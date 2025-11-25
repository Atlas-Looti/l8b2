/**
 * Build-time compiler utilities.
 *
 * Bridges the LootiScript compiler package with the CLI by providing
 * helpers to compile many `.loot` modules and persist their bytecode
 * for the runtime to consume later.
 */

import path from "path";
import fs from "fs-extra";
import pc from "picocolors";

import {
	compileSource,
	serializeRoutineToModule,
	type CompileResult as BaseCompileResult,
	type CompileError as BaseCompileError,
	type CompileWarning as BaseCompileWarning,
} from "@l8b/compiler";

import { DEFAULT_DIRS, resolveProjectPath } from "../utils/paths";

/**
 * Compiled module metadata stored on disk.
 */
export interface CompiledModule {
	/** Logical module name (e.g. scenes/intro) */
	name: string;
	/** Serialized routine exported from @l8b/compiler */
	routine: any;
	/** Relative filename for error reporting */
	filename: string;
}

export type CompileError = BaseCompileError;
export type CompileWarning = BaseCompileWarning;

export interface CompileResult {
	compiled: CompiledModule[];
	errors: CompileError[];
	warnings: CompileWarning[];
}

/**
 * Compile a single file path.
 */
function compileFile(filePath: string, filename: string): BaseCompileResult {
	try {
		const source = fs.readFileSync(filePath, "utf-8");
		return compileSource(source, filename);
	} catch (error: any) {
		return {
			errors: [
				{
					file: filename,
					error: error?.message || String(error),
				},
			],
			warnings: [],
			filename,
		};
	}
}

/**
 * Compile all LootiScript sources discovered in the project.
 */
export async function compileSources(
	sources: Record<string, string>,
	projectPath: string,
): Promise<CompileResult> {
	const compiled: CompiledModule[] = [];
	const errors: CompileError[] = [];
	const warnings: CompileWarning[] = [];

	console.log(pc.gray("  Compiling LootiScript sources..."));

	for (const [moduleName, modulePath] of Object.entries(sources)) {
		const absolutePath = resolveProjectPath(projectPath, modulePath);
		const normalizedPath = path.normalize(absolutePath);
		const relativePath = path.relative(projectPath, normalizedPath);
		const filename = relativePath || path.basename(normalizedPath);

		if (!(await fs.pathExists(normalizedPath))) {
			errors.push({
				file: filename,
				error: `File not found: ${normalizedPath}`,
			});
			console.error(pc.red(`    ✗ ${moduleName} (${filename})`));
			console.error(pc.red(`      File not found: ${normalizedPath}`));
			continue;
		}

		const result = compileFile(normalizedPath, filename);

		if (result.errors.length > 0) {
			errors.push(...result.errors);
			for (const error of result.errors) {
				console.error(pc.red(`    ✗ ${moduleName} (${filename})`));
				console.error(pc.red(`      ${error.error}`));
				if (error.line !== undefined) {
					console.error(
						pc.gray(
							`      Line ${error.line}${
								error.column !== undefined ? `, Column ${error.column}` : ""
							}`,
						),
					);
				}
			}
		} else if (result.routine) {
			compiled.push({
				name: moduleName,
				routine: result.routine,
				filename,
			});

			if (result.warnings.length > 0) {
				for (const warning of result.warnings) {
					warnings.push(warning);
					console.warn(
						pc.yellow(`    ⚠ ${moduleName}: ${warning.warning ?? "Warning"}`),
					);
				}
			}

			console.log(pc.green(`    ✓ ${moduleName} (${filename})`));
		}
	}

	console.log(pc.green(`  ✓ Compiled ${compiled.length} modules`));

	if (warnings.length > 0) {
		console.warn(pc.yellow(`  ⚠ ${warnings.length} warnings`));
	}

	if (errors.length > 0) {
		console.error(pc.red(`  ✗ ${errors.length} errors`));
	}

	return { compiled, errors, warnings };
}

/**
 * Persist compiled routines to the `.l8b/compiled` directory so the runtime
 * can import them at startup.
 */
export async function saveCompiled(
	compiled: CompiledModule[],
	outputDir: string,
): Promise<void> {
	const compiledDir = path.join(outputDir, DEFAULT_DIRS.COMPILED);
	await fs.ensureDir(compiledDir);

	for (const module of compiled) {
		const outputPath = path.join(compiledDir, `${module.name}.js`);
		const jsContent = serializeRoutineToModule(
			module.routine,
			module.name,
			module.filename,
		);

		await fs.ensureDir(path.dirname(outputPath));
		await fs.writeFile(outputPath, jsContent, "utf-8");
	}

	const manifest = {
		modules: compiled.map((module) => ({
			name: module.name,
			filename: module.filename,
			path: `${DEFAULT_DIRS.COMPILED}/${module.name}.js`,
		})),
	};

	await fs.writeJSON(path.join(outputDir, "compiled-manifest.json"), manifest, {
		spaces: 2,
	});
}


