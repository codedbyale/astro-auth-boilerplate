"use client";

import { signOutCurrentUser } from "@/features/auth/api/sign-out";
import { Button } from "@/shared/ui/button";

interface SessionPanelProps {
	session: {
		session: {
			expiresAt?: string | Date;
		};
		user: {
			email: string;
			name?: string | null;
		};
	};
}

export function SessionPanel({ session }: SessionPanelProps) {
	async function handleSignOut() {
		await signOutCurrentUser();
		window.location.href = "/";
	}

	const expiresAt = session.session.expiresAt
		? new Date(session.session.expiresAt).toLocaleString()
		: "Unknown";

	return (
		<section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-7">
			<div className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">Protected area</p>
				<h1 className="text-3xl font-semibold tracking-tight text-card-foreground">
					Session is active
				</h1>
				<p className="max-w-xl text-sm leading-6 text-muted-foreground">
					This page only renders when Better Auth returns a valid session from the incoming request.
				</p>
			</div>

			<div className="mt-8 grid gap-4 md:grid-cols-2">
				<div className="rounded-xl bg-muted p-5">
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">User</p>
					<p className="mt-3 text-lg font-medium text-card-foreground">
						{session.user.name || "Unnamed user"}
					</p>
					<p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
				</div>
				<div className="rounded-xl bg-muted p-5">
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Session expires</p>
					<p className="mt-3 text-sm leading-6 text-card-foreground">{expiresAt}</p>
				</div>
			</div>

			<div className="mt-6 flex flex-wrap gap-3">
				<Button type="button" onClick={handleSignOut}>
					Sign out
				</Button>
				<Button asChild variant="outline">
					<a href="/">Back to home</a>
				</Button>
			</div>
		</section>
	);
}
