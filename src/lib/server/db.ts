import { Language } from "$lib/Language";
import { sql } from "bun";
import { add } from "date-fns";
import z, { codec, date, hex, number, object, string } from "zod";

const DateNumber = codec(number(), date(), {
  decode: number => new Date(number),
  encode: date => date.valueOf(),
});

export const Paste = object({
  id: hex().length(8),
  language: Language,
  content: string(),
  creation: date(),
  expiry: date(),
});
export type Paste = z.infer<typeof Paste>;

export const PasteEntity = object({
  id: hex().length(8),
  language: Language,
  content: string(),
  creation: number(),
  expiry: number(),
});
export type PasteEntity = z.infer<typeof PasteEntity>;

export async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS pastes (
      id VARCHAR(8) PRIMARY KEY,
      language TEXT NOT NULL,
      content TEXT NOT NULL,
      creation TIMESTAMPTZ NOT NULL,
      expiry TIMESTAMPTZ NOT NULL
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS pastes_expiry
    ON pastes (expiry)
  `;
}

export async function addPaste(language: Language, content: string): Promise<string> {
  const id = Bun.hash
    .cityHash32(
      Bun.randomUUIDv7("base64"), // time-based to avoid collisions
    )
    .toString(16) // hexadecimal so it's short and concise
    .padStart(8, "0") // padded with 0s so it's a fixed-length of 8 chars
    .slice(0, 8); // truncated, just in case (should do nothing)

  const creation = new Date();
  const expiry = add(creation, { days: 30 });

  await sql`
    INSERT INTO pastes ${sql(
      PasteEntity.parse({
        id,
        language,
        content,
        creation: DateNumber.encode(creation),
        expiry: DateNumber.encode(expiry),
      } satisfies PasteEntity),
    )}
  `;

  return id;
}

export async function getPaste(pasteId: string): Promise<Paste | null> {
  const data: PasteEntity[] = await sql`
    SELECT * FROM pastes WHERE id = ${pasteId}
  `;

  if (data.length === 0) return null;
  if (data.length > 1) console.error("More than one paste with id", pasteId, { data });

  const { id, language, content, creation, expiry } = data[0];

  return Paste.parse({
    id,
    language: Language.catch("none").parse(language),
    content,
    creation: DateNumber.decode(creation),
    expiry: DateNumber.decode(expiry),
  } satisfies Paste);
}

export async function deleteExpiredPastes(expiry: Date): Promise<number> {
  const x = await sql`
    DELETE FROM pastes
    WHERE expiry < ${sql.options.adapter === "sqlite" ? expiry.valueOf() : expiry}
  `;

  return x.count ?? 0;
}
