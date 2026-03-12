import type { AstroGlobal } from "astro";
import { auth } from "@/shared/api/auth/server";

export async function getServerSession(request: Request) {
	return auth.api.getSession({
		headers: request.headers,
	});
}

export async function requireServerSession(Astro: AstroGlobal) {
	const session = await getServerSession(Astro.request);

	if (!session) {
		return Astro.redirect("/login");
	}

	return session;
}
