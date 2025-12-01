import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Session } from "./auth";
import { auth } from "./auth";

export async function getSession(): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session ?? null;
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
