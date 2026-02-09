import { deletePaste, getPaste, getUserByName } from "$lib/server/db";
import { error, json, text } from "@sveltejs/kit";
import { add } from "date-fns";

export async function GET({ request, params }) {
  const paste = (await getPaste(params.id)) ?? error(404);

  if (request.headers.get("Accept") === "application/json") {
    return json(paste);
  } else {
    return text(paste.content);
  }
}

export async function DELETE({ request, params }) {
  const delayedRequestEnd = add(new Date(), { seconds: 2.0 });

  try {
    const authHeader = request.headers.get("Authorization") ?? error(401);

    if (!authHeader.startsWith("Basic ")) error(401);
    const data = Buffer.from(authHeader.slice("Basic ".length), "base64").toString("utf-8").split(":");
    if (data.length < 2) error(401);
    if (data.length > 2) error(401);

    const [username, password] = data;

    const user = (await getUserByName(username)) ?? error(401);

    if (!(await Bun.password.verify(password, user.password))) error(401);

    const amount = await deletePaste(params.id);

    return json({ deleted: amount });
  } catch (e) {
    await Bun.sleep(delayedRequestEnd);
    throw e;
  }
}
