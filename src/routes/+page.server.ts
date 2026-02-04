import { addPaste, getPaste } from "$lib/server/db.js";
import { Version } from "$lib/types.js";
import { redirect } from "@sveltejs/kit";
import { string } from "zod";

export async function load({ cookies, url }) {
  const edit = cookies.get("edit");

  cookies.delete("edit", { path: "/" });

  if (edit) {
    return {
      paste: (await getPaste(edit)) ?? undefined,
    };
  }

  return {
    script: url.searchParams.get("script") ?? undefined,
    version: Version.optional().catch(undefined).parse(url.searchParams.get("version")) ?? undefined,
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
