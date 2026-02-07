import { error, json } from "@sveltejs/kit";
import { getAuth } from "../../auth";
import { deletePaste } from "$lib/server/db";

export async function DELETE({ params, cookies }) {
  if (!(await getAuth(cookies))) return error(401);

  const amount = await deletePaste(params.id);

  return json(amount);
}
