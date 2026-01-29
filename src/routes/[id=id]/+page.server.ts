import { getPaste } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ params, cookies }) {
  const paste = await getPaste(params.id) ?? error(404);

  const newlyPasted = cookies.get("newly-pasted") === "true";

  cookies.delete("newly-pasted", { path: "/" });

  return { paste, newlyPasted };
}