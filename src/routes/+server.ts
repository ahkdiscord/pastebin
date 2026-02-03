import { addPaste } from "$lib/server/db";
import type { Version } from "$lib/types";
import { json } from "@sveltejs/kit";

interface PasteRequest {
  version: Version;
  script: string;
}

export async function POST({ request }) {
  const data: PasteRequest = await request.json();

  return json({ id: await addPaste(data.version, data.script) });
}
