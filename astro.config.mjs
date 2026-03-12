// @ts-check

import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { createLogger } from "vite";

const filteredWarningSources = [
	"/node_modules/@astrojs/node/dist/",
	"/node_modules/astro/dist/core/app/node.js",
	"/node_modules/send/index.js",
	"/node_modules/etag/index.js",
	"/node_modules/mime-types/index.js",
	"/node_modules/on-finished/index.js",
];

const viteLogger = createLogger();
const viteWarn = viteLogger.warn;

/**
 * Filter known build-time externalization warnings from Astro's Node adapter internals.
 *
 * @param {string | Error} msg
 * @param {import("vite").LogOptions | undefined} options
 */
viteLogger.warn = (msg, options) => {
	if (
		typeof msg === "string" &&
		msg.includes("externalized for browser compatibility") &&
		filteredWarningSources.some((source) => msg.includes(source))
	) {
		return;
	}

	if (typeof msg === "string") {
		viteWarn(msg, options);
		return;
	}

	viteWarn(msg.message, options);
};

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	integrations: [react()],
	devToolbar: {
		enabled: false,
	},
	vite: {
		customLogger: viteLogger,
		plugins: [tailwindcss()],
		build: {
			chunkSizeWarningLimit: 800,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes("node_modules")) {
							return;
						}

						if (id.includes("better-auth/dist/client")) {
							return "better-auth-client";
						}

						if (
							id.includes("better-auth") ||
							id.includes("@better-auth") ||
							id.includes("@better-fetch") ||
							id.includes("better-call")
						) {
							return "better-auth-core";
						}

						if (id.includes("nanostores")) {
							return "state-vendor";
						}

						if (id.includes("@noble") || id.includes("@simplewebauthn")) {
							return "crypto-vendor";
						}

						if (id.includes("react") || id.includes("scheduler")) {
							return "react-vendor";
						}

						if (
							id.includes("lucide-react") ||
							id.includes("@radix-ui") ||
							id.includes("class-variance-authority") ||
							id.includes("clsx") ||
							id.includes("tailwind-merge")
						) {
							return "ui-vendor";
						}
					},
				},
			},
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	},
});
