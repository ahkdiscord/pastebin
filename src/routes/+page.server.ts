import { addPaste, getPaste } from "$lib/server/db.js";
import { Version } from "$lib/types.js";
import { redirect } from "@sveltejs/kit";
import { string } from "zod";

export async function load({ cookies }) {
  const edit = cookies.get("edit");

  cookies.delete("edit", { path: "/" });

  return {
    paste: edit ? ((await getPaste(edit)) ?? undefined) : undefined,
  };
}

export const actions = {
  async share({ request, cookies }) {
    const data = await request.formData();

    const version = Version.optional().catch(undefined).parse(data.get("version"));
    const script = string().parse(data.get("script"));

    const id = await addPaste(version, script);

    cookies.set("newly-pasted", "true", { path: "/" });

    const path = `/${id}`;

    redirect(303, path);
  },
};
