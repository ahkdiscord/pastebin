import { redirect, type Cookies } from "@sveltejs/kit";
import { getAuth } from "./auth";

export async function load({ url, cookies }) {
  const { session, user } = (await getAuth(cookies)) ?? sendToLogin(cookies, url);

  return { session, user };
}

function sendToLogin(cookies: Cookies, returnTo: URL): never {
  cookies.delete("sessionId", { path: "/" });
  cookies.set("returnTo", returnTo.toString(), { path: "/admin/login" });
  redirect(307, "/admin/login");
}
