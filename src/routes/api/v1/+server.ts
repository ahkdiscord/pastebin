import { addPaste, deletePastes } from "$lib/server/db";
import { Language } from "$lib/Language";
import { json } from "@sveltejs/kit";
import { array, hex, object, string } from "zod";
import { add } from "date-fns";
import { error } from "@sveltejs/kit";
import { getUserByName } from "$lib/server/db";

const PasteRequest = object({
  language: Language.optional(),
  script: string(),
});

export async function POST({ request }) {
  const data = PasteRequest.parse(await request.json());

  return json({ id: await addPaste(data.language ?? "none", data.script) });
}

const DeleteRequest = object({
  pasteIds: array(hex().length(8)).max(5),
});
export async function DELETE({ request }) {
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

    const deleteRequest = DeleteRequest.parse(await request.json());

    const amount = await deletePastes(...deleteRequest.pasteIds);

    return json({ deleted: amount });
  } catch (e) {
    await Bun.sleep(delayedRequestEnd);
    throw e;
  }
}
