"use client";

import { startTransition, useState } from "react";
import { signInWithEmail } from "@/features/auth/api/sign-in";
import { signUpWithEmail } from "@/features/auth/api/sign-up";

export type AuthMode = "login" | "signup";

export interface AuthFormValues {
	name: string;
	email: string;
	password: string;
}

export function useAuthForm(mode: AuthMode) {
	const [values, setValues] = useState<AuthFormValues>({ name: "", email: "", password: "" });
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	function updateValue(field: keyof AuthFormValues, value: string) {
		setValues((current) => ({ ...current, [field]: value }));
	}

	async function submit(redirectTo = "/dashboard") {
		setError(null);
		setSuccess(null);
		setIsPending(true);

		try {
			const response =
				mode === "signup"
					? await signUpWithEmail(values)
					: await signInWithEmail({
							email: values.email,
							password: values.password,
						});

			if (response.error) {
				setError(response.error.message || "Authentication failed.");
				return false;
			}

			setSuccess(mode === "signup" ? "Account created. Redirecting..." : "Session created. Redirecting...");
			startTransition(() => {
				window.location.href = redirectTo;
			});
			return true;
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "Authentication failed.");
			return false;
		} finally {
			setIsPending(false);
		}
	}

	return {
		error,
		isPending,
		success,
		submit,
		updateValue,
		values,
	};
}
