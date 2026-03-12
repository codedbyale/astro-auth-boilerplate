import { expect, test } from "bun:test";
import { buildEnvFile } from "../tools/setup.js";

test("setup injects a generated auth secret into env template", () => {
	const result = buildEnvFile(
		"BETTER_AUTH_URL=http://localhost:4321\nBETTER_AUTH_SECRET=change-me\n",
		"super-secret-value",
	);

	expect(result).toMatch(/BETTER_AUTH_SECRET=super-secret-value/);
	expect(result).not.toMatch(/BETTER_AUTH_SECRET=change-me/);
});
