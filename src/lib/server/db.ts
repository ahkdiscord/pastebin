import { isVersion, type Version } from "$lib/types";
import { sql } from "bun";
import { add } from "date-fns";

export interface Paste {
  id: string;
  version?: Version;
  content: string;
  creation?: Date;
  expiry?: Date;
}

interface PasteEntity {
  id: string;
  version: string | null;
  content: string;
  creation: number | null;
  expiry: number | null;
}

export async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS pastes (
      id VARCHAR(8) PRIMARY KEY,
      version TEXT,
      content TEXT NOT NULL,
      creation TIMESTAMP,
      expiry TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS pastes_expiry
    ON pastes (expiry)
  `;
}

export async function addPaste(version: Version, content: string): Promise<string> {
  const id = Bun.hash.cityHash32(
      Bun.randomUUIDv7("base64") // time-based to avoid collisions
    )
    .toString(16) // hexadecimal so it's short and concise
    .padStart(8, "0") // padded with 0s so it's a fixed-length of 8 chars
    .slice(0, 8); // truncated, just in case (should do nothing)

  const creation = new Date();
  const expiry = add(creation, { days: 30 });

  await sql`
    INSERT INTO pastes ${sql({
      id,
      version,
      content,
      creation: creation.valueOf(),
      expiry: expiry.valueOf(),
    })}
  `;

  return id;
}

export async function getPaste(pasteId: string): Promise<Paste | null> {
  const data: PasteEntity[] = await sql`
    SELECT * FROM pastes WHERE id = ${pasteId}
  `;

  if (data.length === 0) return null;
  if (data.length > 1) console.error("More than one paste with id", pasteId, { data });

  const { id, version, content, creation, expiry } = data[0];

  return {
    id,
    version: isVersion(version) ? version : undefined,
    content,
    creation: creation ? new Date(creation) : undefined,
    expiry: expiry ? new Date(expiry) : undefined,
  };
}