import { addPaste } from "$lib/server/db";
import { Language } from "$lib/Language";
import { json } from "@sveltejs/kit";
import { object, string } from "zod";

const PasteRequest = object({
  language: Language,
  script: string(),
});

export async function POST({ request }) {
  const data = PasteRequest.parse(await request.json());

  return json({ id: await addPaste(data.language, data.script) });
}
