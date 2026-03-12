import type { AuthMode } from "./use-auth-form";

export const authCopy: Record<
	AuthMode,
	{
		description: string;
		submit: string;
		success: string;
		switchAction: string;
		switchHref: string;
		switchLabel: string;
		title: string;
	}
> = {
	login: {
		title: "Welcome back",
		description: "Sign in with the email and password configured in Better Auth.",
		submit: "Sign in",
		switchLabel: "Need an account?",
		switchHref: "/signup",
		switchAction: "Create one",
		success: "Session created. Redirecting...",
	},
	signup: {
		title: "Create your first account",
		description: "This creates a Better Auth credential user and signs in immediately.",
		submit: "Create account",
		switchLabel: "Already have an account?",
		switchHref: "/login",
		switchAction: "Sign in",
		success: "Account created. Redirecting...",
	},
};
