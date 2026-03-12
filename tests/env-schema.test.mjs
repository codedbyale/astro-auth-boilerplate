import { expect, test } from "bun:test";
import { envSchema } from "../src/shared/config/env.ts";

test("env schema accepts the documented local setup", () => {
	const parsed = envSchema.parse({
		BETTER_AUTH_URL: "http://localhost:4321",
		BETTER_AUTH_SECRET: "12345678901234567890123456789012",
		TURSO_DATABASE_URL: "file:local.db",
	});

	expect(parsed.BETTER_AUTH_URL).toBe("http://localhost:4321");
	expect(parsed.TURSO_DATABASE_URL).toBe("file:local.db");
});
