import { addPaste } from "$lib/server/db";
import { Version } from "$lib/types";
import { json } from "@sveltejs/kit";
import { object, string } from "zod";

const PasteRequest = object({
  version: Version.optional(),
  script: string(),
});

export async function POST({ request }) {
  const data = PasteRequest.parse(await request.json());

  return json({ id: await addPaste(data.version, data.script) });
}
