import { getSession, getUserData } from "$lib/server/db";
import { isPast } from "date-fns";
import type { Cookies } from "@sveltejs/kit";

export async function getAuth(cookies: Cookies) {
  try {
    const sessionId = cookies.get("sessionId") ?? raise("no sessionId");
    const session = (await getSession(sessionId)) ?? raise("sessionId invalid");
    if (isPast(session.expiry)) raise("session expired");

    const user = (await getUserData(session.userId)) ?? raise("session valid but user invalid");

    return { session, user };
  } catch {
    return;
  }
}

function raise(message: string): never {
  throw new Error(message);
}
