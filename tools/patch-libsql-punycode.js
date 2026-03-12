import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const deprecatedImport = 'require("punycode")';
const fixedImport = 'require("punycode/")';

const targets = [
	join(
		process.cwd(),
		"node_modules",
		"cross-fetch",
		"node_modules",
		"node-fetch",
		"node_modules",
		"whatwg-url",
		"lib",
		"url-state-machine.js",
	),
	join(
		process.cwd(),
		"node_modules",
		"cross-fetch",
		"node_modules",
		"node-fetch",
		"node_modules",
		"whatwg-url",
		"node_modules",
		"tr46",
		"index.js",
	),
];

// Temporary workaround for the deprecated `punycode` core-module import
// that still appears in the transitive dependency chain:
// @libsql/client -> @libsql/hrana-client -> cross-fetch -> node-fetch@2 -> whatwg-url/tr46
//
// This keeps `bun install` / `bun run dev` output clean for the boilerplate
// until upstream removes the deprecated import path.
// TODO: remove this script once the @libsql/client dependency chain no longer
// pulls cross-fetch/node-fetch@2 with deprecated punycode imports.
for (const target of targets) {
	try {
		const source = readFileSync(target, "utf8");

		if (!source.includes(deprecatedImport) || source.includes(fixedImport)) {
			continue;
		}

		writeFileSync(target, source.replace(deprecatedImport, fixedImport));
		console.log(`patched deprecated punycode import in ${target}`);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
			continue;
		}

		throw error;
	}
}
