/**
 * Build-time compiler for LootiScript
 * 
 * Compiles .loot files to bytecode Routines during build,
 * similar to how Next.js pre-compiles React code.
 */

import { Parser, Compiler } from '@l8b/lootiscript';
import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';
import { resolveProjectPath, formatCompileError, COMPILED_DIR, MANIFEST_FILE } from '../utils';

/**
 * Serialized routine data from routine.export()
 */
export interface RoutineExport {
    num_args: number;
    ops: number[];
    args: unknown[];
    import_refs: unknown[];
    import_values: unknown[];
    import_self: number;
    locals_size?: number;
}

/**
 * Compiled module containing serialized routine data
 */
export interface CompiledModule {
    name: string;
    routine: RoutineExport;
    filename: string;
}

/**
 * Compilation error information
 */
export interface CompileError {
    file: string;
    error: string;
    line?: number;
    column?: number;
}

/**
 * Compilation warning information
 */
export interface CompileWarning {
    file: string;
    warning: string;
    line?: number;
    column?: number;
}

/**
 * Result of compiling LootiScript sources
 */
export interface CompileResult {
    compiled: CompiledModule[];
    errors: CompileError[];
    warnings: CompileWarning[];
}

/**
 * Internal compile file result
 */
interface CompileFileResult {
    routine?: RoutineExport;
    error?: CompileError;
    warnings?: CompileWarning[];
}

/**
 * Compile a single .loot file to bytecode
 * 
 * @param filePath - Full path to the .loot file
 * @param filename - Relative filename for error reporting
 * @returns Compilation result with routine, errors, or warnings
 */
function compileFile(
    filePath: string,
    filename: string
): CompileFileResult {
    try {
        const source = fs.readFileSync(filePath, 'utf-8');
        
        // Parse source code
        const parser = new Parser(source, filename);
        parser.parse();
        
        // Check for parse errors
        const parserError = (parser as { error_info?: CompileError }).error_info;
        if (parserError) {
            return {
                error: {
                    file: filename,
                    error: parserError.error || 'Parse error',
                    line: parserError.line,
                    column: parserError.column,
                },
            };
        }
        
        // Compile to bytecode
        const compiler = new Compiler(parser.program);
        
        // Export routine to serializable format
        const routine = compiler.routine.export();
        
        // Collect warnings
        const warnings: CompileWarning[] = parser.warnings.map((w) => ({
            file: filename,
            warning: w.type || 'Warning',
            line: w.line,
            column: w.column,
        }));
        
        return {
            routine,
            warnings,
        };
    } catch (error) {
        const err = error as { message?: string; line?: number; column?: number };
        return {
            error: {
                file: filename,
                error: err.message || String(error),
                line: err.line,
                column: err.column,
            },
        };
    }
}

/**
 * Compile all .loot source files to bytecode
 * 
 * @param sources - Map of module names to file paths
 * @param projectPath - Root path of the project
 * @returns Compilation result with compiled modules, errors, and warnings
 */
export async function compileSources(
    sources: Record<string, string>,
    projectPath: string
): Promise<CompileResult> {
    const compiled: CompiledModule[] = [];
    const errors: CompileError[] = [];
    const warnings: CompileWarning[] = [];
    
    console.log(pc.gray('  Compiling LootiScript sources...'));
    
    for (const [moduleName, filePath] of Object.entries(sources)) {
        // Resolve full file path (handles paths starting with /)
        const fullPath = resolveProjectPath(projectPath, filePath);
        
        // Get relative filename for error reporting
        const relativePath = path.relative(projectPath, fullPath);
        const filename = relativePath || path.basename(fullPath);
        
        // Verify file exists before compiling
        if (!fs.existsSync(fullPath)) {
            const error: CompileError = {
                file: filename,
                error: `File not found: ${fullPath}`,
            };
            errors.push(error);
            console.error(pc.red(`    ✗ ${formatCompileError(moduleName, filename, error)}`));
            continue;
        }
        
        // Compile file
        const result = compileFile(fullPath, filename);
        
        if (result.error) {
            errors.push(result.error);
            console.error(pc.red(`    ✗ ${formatCompileError(moduleName, filename, result.error)}`));
        } else if (result.routine) {
            compiled.push({
                name: moduleName,
                routine: result.routine,
                filename,
            });
            
            // Show warnings if any
            if (result.warnings && result.warnings.length > 0) {
                for (const warning of result.warnings) {
                    warnings.push(warning);
                    console.warn(pc.yellow(`    ⚠ ${moduleName}: ${warning.warning}`));
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
 * Save compiled routines to disk as JS modules
 * 
 * @param compiled - Array of compiled modules
 * @param outputDir - Output directory for compiled files
 */
export async function saveCompiled(
    compiled: CompiledModule[],
    outputDir: string
): Promise<void> {
    const compiledDir = path.join(outputDir, COMPILED_DIR);
    await fs.ensureDir(compiledDir);
    
    // Save each compiled module as JS file that exports the routine data
    for (const module of compiled) {
        const outputPath = path.join(compiledDir, `${module.name}.js`);
        const moduleData = {
            name: module.name,
            filename: module.filename,
            routine: module.routine,
        };
        const jsContent = `export default ${JSON.stringify(moduleData, null, 2)};`;
        
        await fs.writeFile(outputPath, jsContent, 'utf-8');
    }
    
    // Save manifest of all compiled modules
    const manifest = {
        modules: compiled.map((m) => ({
            name: m.name,
            filename: m.filename,
            path: `${COMPILED_DIR}/${m.name}.js`,
        })),
    };
    
    await fs.writeJSON(
        path.join(outputDir, MANIFEST_FILE),
        manifest,
        { spaces: 2 }
    );
}

