import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("dashboard route is protected server-side", () => {
	const source = readFileSync(new URL("../src/pages/dashboard.astro", import.meta.url), "utf8");

	expect(source).toMatch(/requireServerSession/);
	expect(source).toMatch(/Astro\.redirect|instanceof Response/);
});
