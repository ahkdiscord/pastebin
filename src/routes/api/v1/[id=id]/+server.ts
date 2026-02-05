import { getPaste } from "$lib/server/db";
import { error, json, text } from "@sveltejs/kit";

export async function GET({ request, params }) {
  const paste = (await getPaste(params.id)) ?? error(404);

  if (request.headers.get("Accept") === "application/json") {
    return json(paste);
  } else {
    return text(paste.content);
  }
}
