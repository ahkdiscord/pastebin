import { addPaste, getPaste } from "$lib/server/db.js";
import { Language } from "$lib/Language.js";
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
    language: Language.optional().catch(undefined).parse(url.searchParams.get("language")),
  };
}

export const actions = {
  async share({ request, cookies }) {
    const data = await request.formData();

    const language = Language.catch("none").parse(data.get("language"));
    const script = string().parse(data.get("script"));

    const id = await addPaste(language, script);

    cookies.set("newly-pasted", "true", { path: "/" });

    const path = `/${id}`;

    redirect(303, path);
  },
};
