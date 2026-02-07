import { Language } from "$lib/Language";
import { sql } from "bun";
import { add } from "date-fns";
import z, { date, hex, object, string } from "zod";

export const Paste = object({
  id: hex().length(8),
  language: Language,
  content: string(),
  creation: date(),
  expiry: date(),
});
export type Paste = z.infer<typeof Paste>;

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

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuidv7(),
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT uuidv7(),
      user_id UUID REFERENCES users,
      expiry TIMESTAMPTZ NOT NULL
    )
  `;
}

export async function executeStatements(statements: string) {
  return await sql.unsafe(statements).execute();
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
      Paste.parse({
        id,
        language,
        content,
        creation,
        expiry,
      } satisfies Paste),
    )}
  `;

  return id;
}

export async function getPaste(pasteId: string): Promise<Paste | null> {
  const data: Paste[] = await sql`
    SELECT * FROM pastes WHERE id = ${pasteId}
  `;

  if (data.length === 0) return null;
  if (data.length > 1) console.error("More than one paste with id", pasteId, { data });

  const { id, language, content, creation, expiry } = data[0];

  return Paste.parse({
    id,
    language: Language.catch("none").parse(language),
    content,
    creation,
    expiry,
  } satisfies Paste);
}

export async function deleteExpiredPastes(expiry: Date): Promise<number> {
  const x = await sql`
    DELETE FROM pastes
    WHERE expiry < ${expiry}
  `;

  return x.count ?? 0;
}

export async function deletePaste(pasteId: string): Promise<number> {
  const x = await sql`
    DELETE FROM pastes
    WHERE id = ${pasteId}
  `;

  return x.count ?? 0;
}

export async function getAllPastesWithoutContent() {
  const data: { id: string; language: Language; creation: Date; expiry: Date }[] = await sql`
    SELECT id, language, creation, expiry FROM pastes
  `;

  return [...data];
}

export async function getUserData(id: string) {
  const users: { name: number }[] = await sql`
    SELECT name FROM users WHERE id = ${id}
  `;

  if (!users || !users.length) return undefined;

  return users[0];
}

export async function getUserByName(name: string) {
  const users: { id: string; password: string }[] = await sql`
    SELECT id, password FROM users WHERE name = ${name}
  `;

  if (!users || !users.length) return undefined;
  if (users.length > 1) throw new Error("More than one user with the same name!");

  return users[0];
}

export async function startSession(userId: string): Promise<string> {
  const expiry = add(new Date(), { minutes: 30 });

  const sessions: { id: string }[] = await sql`
    INSERT INTO sessions ${sql({ user_id: userId, expiry })}
      RETURNING id
  `;

  if (!sessions || !sessions.length) throw new Error("Session could not be created");

  return sessions[0].id;
}

export async function getSession(id: string) {
  const sessions: { user_id: string; expiry: Date }[] = await sql`
    SELECT user_id, expiry FROM sessions
      WHERE id = ${id}
  `;

  if (!sessions || !sessions.length) return undefined;

  return {
    userId: sessions[0].user_id,
    expiry: sessions[0].expiry,
  };
}

export async function deleteExpiredSessions(expiry: Date): Promise<number> {
  const x = await sql`
    DELETE FROM sessions
    WHERE expiry < ${expiry}
  `;

  return x.count ?? 0;
}

export async function deleteSession(id: string): Promise<number> {
  const x = await sql`
    DELETE FROM sessions
    WHERE id = ${id}
  `;

  return x.count ?? 0;
}
