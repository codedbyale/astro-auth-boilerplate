import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { expect, test } from "bun:test";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/shared/api/db/schema/index.ts";

const baseURL = "http://localhost:3000/api/auth";

async function createTestAuth() {
	const dbPath = join(tmpdir(), `pluton-auth-${randomUUID()}.db`);
	const client = createClient({ url: `file:${dbPath}` });

	await createAuthTables(client);

	const db = drizzle(client, { schema });
	const auth = betterAuth({
		baseURL,
		secret: "12345678901234567890123456789012",
		trustedOrigins: ["http://localhost:3000"],
		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema,
		}),
		emailAndPassword: {
			enabled: true,
		},
	});

	return {
		auth,
		client,
		cleanup() {
			client.close();
			rmSync(dbPath, { force: true });
		},
	};
}

async function createAuthTables(client) {
	await client.execute(`
		CREATE TABLE user (
			id TEXT PRIMARY KEY NOT NULL,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			email_verified INTEGER NOT NULL DEFAULT 0,
			image TEXT,
			created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
		)
	`);

	await client.execute(`
		CREATE TABLE session (
			id TEXT PRIMARY KEY NOT NULL,
			expires_at INTEGER NOT NULL,
			token TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			ip_address TEXT,
			user_agent TEXT,
			user_id TEXT NOT NULL,
			FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
		)
	`);

	await client.execute(`CREATE INDEX session_userId_idx ON session (user_id)`);

	await client.execute(`
		CREATE TABLE account (
			id TEXT PRIMARY KEY NOT NULL,
			account_id TEXT NOT NULL,
			provider_id TEXT NOT NULL,
			user_id TEXT NOT NULL,
			access_token TEXT,
			refresh_token TEXT,
			id_token TEXT,
			access_token_expires_at INTEGER,
			refresh_token_expires_at INTEGER,
			scope TEXT,
			password TEXT,
			created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
		)
	`);

	await client.execute(`CREATE INDEX account_userId_idx ON account (user_id)`);

	await client.execute(`
		CREATE TABLE verification (
			id TEXT PRIMARY KEY NOT NULL,
			identifier TEXT NOT NULL,
			value TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			created_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
			updated_at INTEGER NOT NULL DEFAULT (cast(unixepoch('subsecond') * 1000 as integer))
		)
	`);

	await client.execute(`CREATE INDEX verification_identifier_idx ON verification (identifier)`);
}

async function send(auth, path, { body, cookie, method = "GET" } = {}) {
	const headers = new Headers({
		origin: "http://localhost:3000",
	});

	if (body) {
		headers.set("content-type", "application/json");
	}

	if (cookie) {
		headers.set("cookie", cookie);
	}

	return auth.handler(
		new Request(`${baseURL}${path}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		}),
	);
}

function extractSessionCookie(response) {
	const cookie = response.headers.get("set-cookie");

	if (!cookie) {
		return null;
	}

	const match = cookie.match(/better-auth\.session_token=[^;]+/);
	return match ? match[0] : null;
}

test("auth flow supports sign up, sign out, sign in, and get-session", async () => {
	const { auth, cleanup } = await createTestAuth();

	try {
		const signUpResponse = await send(auth, "/sign-up/email", {
			method: "POST",
			body: {
				name: "Ada Lovelace",
				email: "ada@example.com",
				password: "super-secret-password",
			},
		});

		expect(signUpResponse.status).toBe(200);
		const signUpBody = await signUpResponse.json();
		expect(signUpBody.user.email).toBe("ada@example.com");

		const signUpCookie = extractSessionCookie(signUpResponse);
		expect(signUpCookie).toBeTruthy();

		const sessionAfterSignUp = await send(auth, "/get-session", {
			cookie: signUpCookie,
		});

		expect(sessionAfterSignUp.status).toBe(200);
		const sessionAfterSignUpBody = await sessionAfterSignUp.json();
		expect(sessionAfterSignUpBody.user.email).toBe("ada@example.com");

		const signOutResponse = await send(auth, "/sign-out", {
			method: "POST",
			cookie: signUpCookie,
		});

		expect(signOutResponse.status).toBe(200);

		const signInResponse = await send(auth, "/sign-in/email", {
			method: "POST",
			body: {
				email: "ada@example.com",
				password: "super-secret-password",
			},
		});

		expect(signInResponse.status).toBe(200);
		const signInBody = await signInResponse.json();
		expect(signInBody.user.email).toBe("ada@example.com");

		const signInCookie = extractSessionCookie(signInResponse);
		expect(signInCookie).toBeTruthy();

		const sessionAfterSignIn = await send(auth, "/get-session", {
			cookie: signInCookie,
		});

		expect(sessionAfterSignIn.status).toBe(200);
		const sessionAfterSignInBody = await sessionAfterSignIn.json();
		expect(sessionAfterSignInBody.user.email).toBe("ada@example.com");
	} finally {
		cleanup();
	}
});
