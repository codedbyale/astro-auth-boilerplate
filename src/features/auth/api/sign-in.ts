import { authClient } from "@/shared/api/auth/client";

interface SignInInput {
	email: string;
	password: string;
}

export async function signInWithEmail({ email, password }: SignInInput) {
	return authClient.signIn.email({
		email,
		password,
	});
}
