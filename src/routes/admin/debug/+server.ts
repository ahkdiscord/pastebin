import { executeStatements } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { getAuth } from "../auth";

export async function POST({ request, cookies }) {
  if (!(await getAuth(cookies))) error(401);

  const script = await request.text();

  const response = [...(await executeStatements(script))];

  return json(response);
}
