const layers = [
	{
		name: "app",
		description: "Global providers, layout, and entrypoints.",
	},
	{
		name: "pages",
		description: "Route-level composition for each public page.",
	},
	{
		name: "features",
		description: "User actions such as sign in, sign up, or profile updates.",
	},
	{
		name: "shared",
		description: "Cross-cutting UI, config, API clients, and utilities.",
	},
];

const commands = [
	"bun install",
	"cp .env.example .env",
	"bun run auth:generate",
	"bun run db:migrate",
	"bun run dev",
];

export function HomePage() {
	return (
		<div className="mx-auto flex max-w-6xl flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
			<header className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-8 lg:pb-10">
				<div className="space-y-6">
					<div className="inline-flex rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
						Astro + Bun + Better Auth + Turso
					</div>
					<div className="space-y-4">
						<h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
							Boilerplate for content-heavy sites that still need a real auth and data layer.
						</h1>
						<p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
							This starter keeps Astro routes simple, uses React only where interactivity is
							useful, and structures the codebase around Feature-Sliced public APIs instead
							of a flat components dump.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<a
							className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
							href="/signup"
						>
							Create account
						</a>
						<a
							className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							href="/login"
						>
							Sign in
						</a>
						<a
							className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
							href="/dashboard"
						>
							Dashboard
						</a>
					</div>
				</div>

				<div className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm sm:p-6">
					<p className="text-sm font-medium text-muted-foreground">Bootstrap sequence</p>
					<ol className="mt-4 space-y-3 text-sm text-card-foreground">
						{commands.map((command, index) => (
							<li key={command} className="flex items-center gap-3">
								<span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
									{index + 1}
								</span>
								<code className="rounded bg-muted px-2 py-1">{command}</code>
							</li>
						))}
					</ol>
				</div>
			</header>

			<main className="grid gap-6 py-8 lg:grid-cols-[1fr_0.9fr] lg:gap-8 lg:py-10">
				<section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm sm:p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">Feature-Sliced Design</p>
							<h2 className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">
								A pragmatic layer split for Astro
							</h2>
						</div>
						<a
							className="text-sm font-medium text-primary underline-offset-4 hover:underline"
							href="https://fsd.how"
							target="_blank"
							rel="noreferrer"
						>
							FSD reference
						</a>
					</div>

					<div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2">
						{layers.map((layer) => (
							<article key={layer.name} className="rounded-xl bg-muted p-5">
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									{layer.name}
								</p>
								<p className="mt-3 text-sm leading-6 text-card-foreground">
									{layer.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm sm:p-6">
					<p className="text-sm font-medium text-muted-foreground">What is already wired</p>
					<ul className="mt-4 space-y-4 text-sm leading-6 text-card-foreground sm:mt-5">
						<li>Astro server output with the Node adapter so Better Auth routes can run in production.</li>
						<li>React integration only for interactive islands and shadcn/ui-compatible components.</li>
						<li>Drizzle + @libsql/client configured for Turso, with a local file:local.db fallback.</li>
						<li>Shared aliases and public API entrypoints to keep feature boundaries explicit.</li>
					</ul>
				</section>
			</main>
		</div>
	);
}
