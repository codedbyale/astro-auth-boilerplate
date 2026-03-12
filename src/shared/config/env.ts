import { z } from "zod";

export const envSchema = z.object({
	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(32),
	TURSO_DATABASE_URL: z.string().min(1).default("file:local.db"),
	TURSO_AUTH_TOKEN: z.string().optional(),
});

const runtimeEnv =
	typeof import.meta !== "undefined" && "env" in import.meta ? import.meta.env : process.env;

export const env = envSchema.parse({
	BETTER_AUTH_URL: runtimeEnv.BETTER_AUTH_URL,
	BETTER_AUTH_SECRET: runtimeEnv.BETTER_AUTH_SECRET,
	TURSO_DATABASE_URL: runtimeEnv.TURSO_DATABASE_URL,
	TURSO_AUTH_TOKEN: runtimeEnv.TURSO_AUTH_TOKEN,
});
