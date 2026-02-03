import { runScript } from '$lib/server/running.js';
import type { Version } from '$lib/types';
import { json } from '@sveltejs/kit';

interface RunRequest {
  version: Version;
  script: string;
}

export async function POST({ request }) {
    const data: RunRequest = await request.json();

    return json(await runScript(data.script, data.version));
  }