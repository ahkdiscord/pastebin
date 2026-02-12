import { deleteSession, getUserByName, startSession } from "$lib/server/db";
import { error, isRedirect, redirect } from "@sveltejs/kit";
import { add } from "date-fns";

export async function load({ cookies }) {
  const sessionId = cookies.get("sessionId");

  if (sessionId) await deleteSession(sessionId);

  cookies.delete("sessionId", { path: "/" });
}

export const actions = {
  async default({ request, cookies }) {
    // to prevent automated login attempts:
    const delayedRequestEnd = add(new Date(), { seconds: 2.0 });

    try {
      const data = await request.formData();

      const username = data.get("username");
      if (typeof username !== "string") error(400);

      const user = await getUserByName(username);
      if (!user) error(401);
      if (!user.isAdmin) error(401);

      const password = data.get("password");
      if (typeof password !== "string") error(400);

      if (!(await Bun.password.verify(password, user.password))) error(401);

      const sessionId = await startSession(user.id);

      cookies.set("sessionId", sessionId, { path: "/", httpOnly: true, sameSite: "strict", secure: true });

      redirect(307, cookies.get("returnTo") ?? "/admin");
    } catch (e) {
      if (isRedirect(e)) throw e;

      await Bun.sleep(delayedRequestEnd);
      throw e;
    }
  },
};
