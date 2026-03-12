import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const envExamplePath = join(projectRoot, ".env.example");
const envPath = join(projectRoot, ".env");

export function generateSecret() {
	return randomBytes(32).toString("base64url");
}

export function buildEnvFile(template, secret) {
	return template.replace(
		/^BETTER_AUTH_SECRET=.*$/m,
		`BETTER_AUTH_SECRET=${secret}`,
	);
}

function main() {
	if (existsSync(envPath)) {
		console.log(".env already exists. Leaving it unchanged.");
		return;
	}

	const template = readFileSync(envExamplePath, "utf8");
	const envFile = buildEnvFile(template, generateSecret());
	writeFileSync(envPath, envFile);
	console.log("Created .env from .env.example with a generated BETTER_AUTH_SECRET.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}
