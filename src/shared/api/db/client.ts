import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/shared/config/env";
import * as schema from "@/shared/api/db/schema";

const client = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN || undefined,
});

export const db = drizzle(client, { schema });
