import { runScript } from "$lib/server/running";
import { Language } from "$lib/Language";
import { json } from "@sveltejs/kit";
import { object, string } from "zod";

const RunRequest = object({
  language: Language.optional(),
  script: string(),
});

export async function POST({ request }) {
  const data = RunRequest.parse(await request.json());

  return json(await runScript(data.script, data.language ?? "none"));
}
