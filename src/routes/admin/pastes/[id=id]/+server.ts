import { error, json } from "@sveltejs/kit";
import { getAuth } from "../../auth";
import { deletePastes } from "$lib/server/db";

export async function DELETE({ params, cookies }) {
  if (!(await getAuth(cookies))) return error(401);

  const amount = await deletePastes(params.id);

  return json(amount);
}
