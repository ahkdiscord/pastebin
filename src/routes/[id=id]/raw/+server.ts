import { getPaste } from '$lib/server/db';
import { error, text } from '@sveltejs/kit';

export async function GET({ params }) {
  const paste = await getPaste(params.id) ?? error(404);

  return text(paste.content);
}