import { getPaste } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export async function GET({ params }) {
  const paste = await getPaste(params.id) ?? error(404);

  return json(paste);
}