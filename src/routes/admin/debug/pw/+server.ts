import { error } from "@sveltejs/kit";
import { getAuth } from "../../auth";
import { text } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
  if (!(await getAuth(cookies))) error(401);

  const password = await request.text();

  return text(await Bun.password.hash(password));
}
