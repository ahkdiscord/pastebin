import { runScript } from "$lib/server/running.js";
import { Version } from "$lib/types";
import { json } from "@sveltejs/kit";
import { object, string } from "zod";

const RunRequest = object({
  version: Version,
  script: string(),
});

export async function POST({ request }) {
  const data = RunRequest.parse(await request.json());

  return json(await runScript(data.script, data.version));
}
