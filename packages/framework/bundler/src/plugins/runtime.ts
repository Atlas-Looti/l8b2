/**
 * Runtime Plugin - Bundles the L8B runtime for production
 *
 * This plugin is responsible for:
 * 1. Bundling the @l8b/runtime package with proper optimization
 * 2. Creating the Player class
 * 3. Embedding compiled routines
 */

import type { L8BPlugin } from "./index";
import { createLogger } from "@l8b/framework-shared";
import { PLAYER_TEMPLATE } from "../templates/player";
import { INIT_TEMPLATE } from "../templates/init";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const logger = createLogger("runtime-plugin");

/**
 * Find the resolve directory for esbuild to resolve @l8b/runtime
 * This walks up from the resolved package location to find node_modules
 */
function findResolveDir(): string {
	try {
		// Resolve @l8b/runtime from the bundler's node_modules
		const runtimePath = require.resolve("@l8b/runtime");
		let currentDir = dirname(runtimePath);
		
		// Walk up to find node_modules or workspace root
		while (currentDir !== dirname(currentDir)) {
			// Check if this directory has node_modules
			const nodeModulesPath = join(currentDir, "node_modules");
			if (existsSync(nodeModulesPath)) {
				return currentDir;
			}
			currentDir = dirname(currentDir);
		}
		
		// Fallback: use the directory containing the resolved package
		return dirname(runtimePath);
	} catch (err) {
		// Fallback to process.cwd() if resolution fails
		logger.warn("Failed to resolve @l8b/runtime, using process.cwd() as resolveDir");
		return process.cwd();
	}
}

/**
 * Runtime plugin options
 */
export interface RuntimePluginOptions {
	/** Minify the runtime bundle */
	minify?: boolean;
	/** Include source maps */
	sourcemap?: boolean;
	/** Externalize sources to sources.json (lazy loading) */
	externalSources?: boolean;
}

/**
 * Create runtime plugin
 */
export function runtimePlugin(options: RuntimePluginOptions = {}): L8BPlugin {
	const { minify = false, sourcemap = false, externalSources = false } = options;

	return {
		name: "l8b:runtime",

		buildStart() {
			// No-op: esbuild handles incremental builds automatically
		},

		async generateBundle(files, ctx) {
			logger.info("Generating runtime bundle...");

			try {
				let sourcesCode = "";
				if (externalSources) {
					const sourcesData = generateSourcesData(ctx.resources.sources);
					files.set("sources.json", JSON.stringify(sourcesData));
					sourcesCode = "window.__L8B_EXTERNAL_SOURCES__ = true;";
					logger.info(`Generated sources.json (${(JSON.stringify(sourcesData).length / 1024).toFixed(1)} KB)`);
				} else {
					sourcesCode = generateSourcesCode(ctx.resources.sources);
				}

				const virtualEntry = [
					`import { RuntimeOrchestrator } from "@l8b/runtime";`,
					`window.Runtime = RuntimeOrchestrator;`,
					sourcesCode,
					PLAYER_TEMPLATE,
					INIT_TEMPLATE,
				].join("\n");

				const esbuild = await import("esbuild");
				const resolveDir = findResolveDir();
				const result = await esbuild.build({
					stdin: {
						contents: virtualEntry,
						resolveDir,
						sourcefile: "game.js",
						loader: "ts",
					},
					bundle: true,
					format: "iife",
					globalName: "L8BGame",
					splitting: false,
					platform: "browser",
					outdir: ".",
					write: false,
					minify,
					sourcemap: sourcemap ? "inline" : false,
					define: {
						"process.env.NODE_ENV": '"production"',
					},
					logLevel: "warning",
				});

				let mainEntryContent: string | null = null;
				const chunkFiles: Array<{ name: string; content: string }> = [];

				for (const file of result.outputFiles) {
					const fileName = file.path.split("/").pop()!;

					if (fileName === "stdin.js" || (result.outputFiles.length === 1 && !mainEntryContent)) {
						mainEntryContent = file.text;
					} else {
						chunkFiles.push({ name: fileName, content: file.text });
					}
				}

				if (mainEntryContent) {
					files.set("game.js", mainEntryContent);
				} else if (result.outputFiles.length > 0) {
					files.set("game.js", result.outputFiles[0].text);
					logger.warn(`Using first output file as game.js`);
				} else {
					throw new Error("No output files generated from esbuild");
				}

				for (const chunk of chunkFiles) {
					files.set(chunk.name, chunk.content);
				}

				const mainFile = files.get("game.js");
				const sizeKB = mainFile ? ((typeof mainFile === "string" ? mainFile.length : 0) / 1024).toFixed(1) : "0";
				const chunkInfo = chunkFiles.length > 0 ? ` + ${chunkFiles.length} chunks` : "";
				logger.success(`Runtime bundle generated: game.js (${sizeKB} KB${chunkInfo})`);
			} catch (err) {
				logger.error("Failed to generate runtime bundle:", err);
				ctx.errors.push(`Runtime bundle error: ${err}`);
			}
		},
	};
}

function generateSourcesCode(sources: Array<{ name: string; content?: string }>): string {
	const embedded = generateSourcesData(sources);
	return `window.__L8B_SOURCES__ = ${JSON.stringify(embedded)};`;
}

function generateSourcesData(sources: Array<{ name: string; content?: string }>): Record<string, string> {
	const embedded: Record<string, string> = {};

	for (const source of sources) {
		if (source.content) {
			embedded[source.name] = source.content;
		}
	}

	return embedded;
}
