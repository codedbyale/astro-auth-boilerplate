import { authClient } from "@/shared/api/auth/client";

interface SignUpInput {
	name: string;
	email: string;
	password: string;
}

export async function signUpWithEmail({ name, email, password }: SignUpInput) {
	return authClient.signUp.email({
		name,
		email,
		password,
	});
}
