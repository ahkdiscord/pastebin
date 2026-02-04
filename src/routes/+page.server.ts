import { addPaste, getPaste } from "$lib/server/db.js";
import { Version } from "$lib/types.js";
import { error, redirect } from "@sveltejs/kit";

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

    let version: Version;
    try {
      version = Version.parse(JSON.parse(data.get("version")?.toString() ?? ""));
    } catch {
      error(400, "version is invalid");
    }
    const script = (() => {
      const x = data.get("script");
      return typeof x === "string" ? x : error(400, "script is required");
    })();

    const id = await addPaste(version, script);

    cookies.set("newly-pasted", "true", { path: "/" });

    const path = `/${id}`;

    redirect(303, path);
  },
};
