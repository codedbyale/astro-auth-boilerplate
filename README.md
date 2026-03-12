# Astro Auth Boilerplate

Astro boilerplate for content-heavy sites that still need a real auth and data layer.

It combines Astro page rendering, Bun for local development, Better Auth for authentication, Turso with Drizzle ORM, React islands for interactive surfaces, and a pragmatic Feature-Sliced-inspired structure that stays readable as the codebase grows.

## Highlights

- email/password auth with `login`, `signup`, and protected `dashboard`
- Astro server output with the Node adapter
- Turso/libSQL database setup through Drizzle
- shadcn/ui-compatible shared primitives
- Tailwind CSS v4
- Feature-Sliced-inspired folders: `app`, `pages`, `features`, `shared`

## Who this is for

This boilerplate fits projects such as:

- marketing sites that also need login
- content-heavy sites with a small authenticated area
- landing pages with dashboards or internal tools attached
- Astro projects that need a cleaner structure than a flat `components/` folder

## Quick start

Clone the repo, then run:

```sh
bun install
bun run setup
bun run auth:generate
bun run db:migrate
bun run dev
```

Open `http://localhost:4321`.

Default routes:

- `/`: public landing page
- `/signup`: account creation
- `/login`: sign in
- `/dashboard`: protected authenticated area

## Available scripts

### Setup and development

- `bun run setup`: creates `.env` from `.env.example` and generates a local `BETTER_AUTH_SECRET` if `.env` does not exist yet.
- `bun run dev`: starts the Astro development server.
- `bun run build`: builds the project for production.
- `bun run preview`: serves the production build locally.

### Auth and database

- `bun run auth:generate`: generates the Better Auth schema into `src/shared/api/db/schema/auth.ts`.
- `bun run db:migrate`: pushes the current schema to the configured database.
- `bun run db:generate`: generates Drizzle migration artifacts from the schema.
- `bun run db:studio`: opens Drizzle Studio for local database inspection.

### Quality checks

- `bun run test`: runs the small smoke test suite for the boilerplate.
- `bun run doctor`: runs the full project health check: `astro check`, `drizzle-kit check`, `bun audit --prod --audit-level=high`, and `astro build --silent`.

## Environment variables

Run `bun run setup` to create `.env` automatically, or copy `.env.example` manually and update values as needed:

```env
BETTER_AUTH_URL=http://localhost:4321
BETTER_AUTH_SECRET=change-this-secret-to-a-random-32-char-value
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=
```

Notes:

- `TURSO_DATABASE_URL=file:local.db` lets the project work locally without a Turso account.
- `BETTER_AUTH_SECRET` is required and must be at least 32 characters long.
- `TURSO_AUTH_TOKEN` is only needed when connecting to a remote Turso database.

## Project structure

```text
src/
├── app/                    # app-level layout and entry setup
├── features/               # user-facing actions and flows
├── pages/                  # Astro routes and route-level composition
├── shared/                 # reusable ui, config, auth, db, utils
└── styles/                 # global styling
```

Current key files:

- `src/pages/index.astro`: landing route
- `src/pages/login.astro`: sign-in route
- `src/pages/signup.astro`: sign-up route
- `src/pages/dashboard.astro`: protected authenticated route
- `src/pages/api/auth/[...all].ts`: Better Auth endpoint
- `src/shared/api/auth/server.ts`: Better Auth server config
- `src/shared/api/auth/client.ts`: Better Auth client
- `src/shared/api/db/client.ts`: Drizzle + libsql client
- `src/shared/ui/button.tsx`: sample shadcn-style button component

## Auth and database workflow

Generate the Better Auth schema:

```sh
bun run auth:generate
```

Apply the schema to your local database or Turso database:

```sh
bun run db:migrate
```

This boilerplate is configured so the generated auth schema is written to:

```text
src/shared/api/db/schema/auth.ts
```

After signing up or signing in, use `/dashboard` to verify the protected session flow.

## Project health check

Run the boilerplate health check with:

```sh
bun run doctor
```

This runs the essential validation steps for this stack:

- `astro check`
- `drizzle-kit check`
- `bun audit --prod --audit-level=high`
- `astro build --silent`

## Tests

Run the small smoke suite with:

```sh
bun run test
```

This covers:

- auth form copy and route links
- a real auth flow against Better Auth endpoints: sign up, sign out, sign in, and get-session
- setup script env generation
- env schema validation
- presence of server-side protection on `/dashboard`

## Feature-Sliced Design

This repository follows a Feature-Sliced Design (FSD) architecture. The skill definition is not committed to the repo — install it locally after cloning:

```sh
npx skills add https://github.com/feature-sliced/skills --skill feature-sliced-design --yes
```

That installs agent tooling locally and is intentionally kept out of git.

## Deployment notes

- Astro is configured for server output.
- The project uses the Node adapter.
- Better Auth runs through Astro API routes, so deploy this as a server-capable Astro app.

## Notes

- Astro Dev Toolbar is disabled in `astro.config.mjs` to keep first-run development logs cleaner for a boilerplate.
- A temporary `postinstall` patch in `tools/patch-libsql-punycode.js` rewrites deprecated `punycode` imports in a transitive dependency tree until the upstream `@libsql/client` chain removes that path.
