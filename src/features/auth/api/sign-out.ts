import { authClient } from "@/shared/api/auth/client";

export async function signOutCurrentUser() {
	return authClient.signOut();
}
