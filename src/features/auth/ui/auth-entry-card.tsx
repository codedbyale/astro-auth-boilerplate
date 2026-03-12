import { Button } from "@/shared/ui/button";

export function AuthEntryCard() {
	return (
		<section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm sm:p-6">
			<div className="space-y-2">
				<p className="text-sm font-medium text-muted-foreground">Authentication</p>
				<h2 className="text-xl font-semibold tracking-tight text-card-foreground">
					Email and password auth is wired
				</h2>
				<p className="max-w-2xl text-sm leading-6 text-muted-foreground">
					The public home stays static. Create an account, sign in, and use the protected
					dashboard to inspect the active session.
				</p>
			</div>

			<div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-2">
				<div className="rounded-lg bg-muted p-4">
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recommended flow</p>
					<p className="mt-2 text-sm text-card-foreground">
						Create your first user at <code className="rounded bg-background px-1.5 py-0.5 text-xs">/signup</code>,
						then continue to the protected dashboard.
					</p>
				</div>
				<div className="rounded-lg bg-muted p-4">
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Why this split</p>
					<p className="mt-2 text-sm text-card-foreground">
						It keeps the landing page cache-friendly and avoids session polling on every public page load.
					</p>
				</div>
			</div>

			<div className="mt-5 flex flex-wrap gap-3 md:mt-6">
				<Button asChild>
					<a href="/signup">Create account</a>
				</Button>
				<Button asChild variant="outline">
					<a href="/login">Sign in</a>
				</Button>
				<Button asChild variant="outline">
					<a href="/dashboard">Dashboard</a>
				</Button>
			</div>
		</section>
	);
}
