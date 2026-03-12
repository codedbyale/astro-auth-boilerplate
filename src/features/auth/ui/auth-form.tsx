"use client";

import type { AuthMode } from "@/features/auth/model/use-auth-form";
import { authCopy } from "@/features/auth/model/copy";
import { useAuthForm } from "@/features/auth/model/use-auth-form";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface AuthFormProps {
	mode: AuthMode;
	redirectTo?: string;
}

export function AuthForm({ mode, redirectTo = "/dashboard" }: AuthFormProps) {
	const content = authCopy[mode];
	const { error, isPending, submit, success, updateValue, values } = useAuthForm(mode);

	async function handleSubmit(event: Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0]) {
		event.preventDefault();
		await submit(redirectTo);
	}

	return (
		<div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-7">
			<div className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">Better Auth</p>
				<h1 className="text-3xl font-semibold tracking-tight text-card-foreground">{content.title}</h1>
				<p className="max-w-md text-sm leading-6 text-muted-foreground">{content.description}</p>
			</div>

			<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
				{mode === "signup" ? (
					<Field label="Name" htmlFor="name">
						<Input
							id="name"
							name="name"
							autoComplete="name"
							placeholder="Ada Lovelace"
							required
							value={values.name}
							onChange={(event) => updateValue("name", event.target.value)}
						/>
					</Field>
				) : null}

				<Field label="Email" htmlFor="email">
					<Input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="you@example.com"
						required
						value={values.email}
						onChange={(event) => updateValue("email", event.target.value)}
					/>
				</Field>

				<Field label="Password" htmlFor="password">
					<Input
						id="password"
						name="password"
						type="password"
						autoComplete={mode === "signup" ? "new-password" : "current-password"}
						placeholder="••••••••"
						required
						value={values.password}
						onChange={(event) => updateValue("password", event.target.value)}
					/>
				</Field>

				<div className="space-y-3">
					<p
						className={cn(
							"min-h-5 text-sm",
							error ? "text-red-600" : success ? "text-secondary-foreground" : "text-transparent",
						)}
					>
						{error || success || content.success}
					</p>

					<Button className="w-full" type="submit" disabled={isPending}>
						{isPending ? "Working..." : content.submit}
					</Button>
				</div>
			</form>

			<p className="mt-6 text-sm text-muted-foreground">
				{content.switchLabel}{" "}
				<a className="font-medium text-primary underline-offset-4 hover:underline" href={content.switchHref}>
					{content.switchAction}
				</a>
			</p>
		</div>
	);
}

interface FieldProps {
	children: React.ReactNode;
	htmlFor: string;
	label: string;
}

function Field({ children, htmlFor, label }: FieldProps) {
	return (
		<label className="block space-y-2" htmlFor={htmlFor}>
			<span className="text-sm font-medium text-card-foreground">{label}</span>
			{children}
		</label>
	);
}
