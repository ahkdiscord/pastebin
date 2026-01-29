import { addPaste } from '$lib/server/db.js';
import { isVersion } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
  async share({ request, cookies }) {
    const data = await request.formData();

    const version = (() => {
      const x = data.get("version");
      return isVersion(x) ? x : error(400, "version is invalid");
    })();
    const script = (() => {
      const x = data.get("script");
      return typeof x === "string" ? x : error(400, "script is required");
    })();

    const id = await addPaste(version, script);

    cookies.set("newly-pasted", "true", { path: "/" });

    const path = `/${id}`;

    redirect(303, path);
  }
};