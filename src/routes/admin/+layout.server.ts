import { getSession, getUserData } from "$lib/server/db";
import { redirect, type Cookies } from "@sveltejs/kit";
import { isPast } from "date-fns";

export async function load({ url, cookies }) {
  const sessionId = Number.parseInt(cookies.get("sessionId") ?? sendToLogin(cookies, url));
  if (!Number.isFinite(sessionId)) sendToLogin(cookies, url);
  const session = (await getSession(sessionId)) ?? sendToLogin(cookies, url);
  if (isPast(session.expiry)) sendToLogin(cookies, url);

  const user = (await getUserData(session.userId)) ?? sendToLogin(cookies, url);

  return { session, user };
}

function sendToLogin(cookies: Cookies, returnTo: URL): never {
  cookies.delete("sessionId", { path: "/" });
  cookies.set("returnTo", returnTo.toString(), { path: "/admin/login" });
  redirect(307, "/admin/login");
}
