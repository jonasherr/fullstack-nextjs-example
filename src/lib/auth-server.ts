import { auth } from "./auth";
import { headers } from "next/headers";
import type { Session } from "./auth";

export async function getSession(): Promise<Session | null> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session ?? null;
}

export async function requireAuth(): Promise<Session> {
	const session = await getSession();

	if (!session) {
		throw new Error("Unauthorized");
	}

	return session;
}
