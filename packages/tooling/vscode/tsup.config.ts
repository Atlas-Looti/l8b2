import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/extension.ts"],
	external: ["vscode"],
	format: ["cjs"],
	dts: false,
	sourcemap: true,
	clean: true,
});

