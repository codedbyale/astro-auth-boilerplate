import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const healthcheck = sqliteTable("healthcheck", {
	id: integer("id").primaryKey(),
	label: text("label").notNull().default("ready"),
});
