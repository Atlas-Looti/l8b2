/**
 * Bundle @l8b/runtime and @l8b/lootiscript for production
 * 
 * Creates a single bundled JS file that can be imported in the browser
 * without needing to resolve bare module specifiers.
 */

import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';
import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';
import { findWorkspaceRoot, RUNTIME_BUNDLE, MAX_WORKSPACE_SEARCH_DEPTH } from '../utils';

const RUNTIME_ENTRY = 'dist/index.js';
const PACKAGE_RUNTIME = '@l8b/runtime';
const PACKAGE_LOOTISCRIPT = '@l8b/lootiscript';

/**
 * Find runtime and lootiscript entry points
 */
async function findRuntimeEntries(
    projectPath: string,
    workspaceRoot: string | null
): Promise<{ runtime: string; lootiscript: string }> {
    let runtimeEntryPath: string | null = null;
    let lootiscriptEntryPath: string | null = null;
    
    // Try workspace first (monorepo)
    if (workspaceRoot) {
        const workspaceRuntime = path.join(workspaceRoot, 'packages', 'runtime', RUNTIME_ENTRY);
        const workspaceLootiscript = path.join(workspaceRoot, 'packages', 'lootiscript', RUNTIME_ENTRY);
        
        if (await fs.pathExists(workspaceRuntime)) {
            runtimeEntryPath = workspaceRuntime;
        }
        if (await fs.pathExists(workspaceLootiscript)) {
            lootiscriptEntryPath = workspaceLootiscript;
        }
    }
    
    // Fallback to node_modules
    if (!runtimeEntryPath || !lootiscriptEntryPath) {
        const nodeModulesPath = path.join(projectPath, 'node_modules');
        if (await fs.pathExists(nodeModulesPath)) {
            const runtimePkg = path.join(nodeModulesPath, PACKAGE_RUNTIME, RUNTIME_ENTRY);
            const lootiscriptPkg = path.join(nodeModulesPath, PACKAGE_LOOTISCRIPT, RUNTIME_ENTRY);
            
            if (!runtimeEntryPath && await fs.pathExists(runtimePkg)) {
                runtimeEntryPath = runtimePkg;
            }
            if (!lootiscriptEntryPath && await fs.pathExists(lootiscriptPkg)) {
                lootiscriptEntryPath = lootiscriptPkg;
            }
        }
    }
    
    if (!runtimeEntryPath || !lootiscriptEntryPath) {
        const triedPaths: string[] = [];
        if (workspaceRoot) {
            triedPaths.push(
                path.join(workspaceRoot, 'packages', 'runtime', RUNTIME_ENTRY),
                path.join(workspaceRoot, 'packages', 'lootiscript', RUNTIME_ENTRY)
            );
        }
        triedPaths.push(
            path.join(projectPath, 'node_modules', PACKAGE_RUNTIME, RUNTIME_ENTRY),
            path.join(projectPath, 'node_modules', PACKAGE_LOOTISCRIPT, RUNTIME_ENTRY)
        );
        
        throw new Error(
            `Could not find ${PACKAGE_RUNTIME} or ${PACKAGE_LOOTISCRIPT}.\n` +
            `Tried:\n` +
            triedPaths.map(p => `  ${p}`).join('\n')
        );
    }
    
    return {
        runtime: runtimeEntryPath,
        lootiscript: lootiscriptEntryPath,
    };
}

/**
 * Bundle runtime and lootiscript for browser
 * 
 * @param distDir - Output directory for bundled file
 * @param projectPath - Root path of the project
 */
export async function bundleRuntime(distDir: string, projectPath: string): Promise<void> {
    const outputFile = path.join(distDir, RUNTIME_BUNDLE);
    
    console.log(pc.gray('  Bundling runtime dependencies...'));
    
    try {
        // Find workspace root
        const workspaceRoot = await findWorkspaceRoot(projectPath, MAX_WORKSPACE_SEARCH_DEPTH);
        
        // Find runtime entry points
        const entries = await findRuntimeEntries(projectPath, workspaceRoot);
        
        // Create a temporary entry file that imports both and re-exports
        const tempEntryPath = path.join(distDir, '.temp-entry.js');
        const tempEntryContent = `
// Temporary entry file for bundling
export { Runtime } from '${entries.runtime.replace(/\\/g, '/')}';
export { Routine } from '${entries.lootiscript.replace(/\\/g, '/')}';
`;
        
        await fs.writeFile(tempEntryPath, tempEntryContent);
        
        try {
            // Bundle using esbuild
            const buildOptions: BuildOptions = {
                entryPoints: [tempEntryPath],
                bundle: true,
                format: 'esm',
                outfile: outputFile,
                platform: 'browser',
                target: 'es2022',
                splitting: false,
                external: [],
                treeShaking: true,
                minify: true,
                sourcemap: false,
                resolveExtensions: ['.js', '.ts', '.json', '.mjs'],
                keepNames: true,
            };
            
            await build(buildOptions);
            
            console.log(pc.green(`  ✓ Bundled runtime to ${path.relative(distDir, outputFile)}`));
        } finally {
            // Clean up temp file
            if (await fs.pathExists(tempEntryPath)) {
                await fs.remove(tempEntryPath);
            }
        }
    } catch (error) {
        const err = error as { message?: string };
        console.error(pc.red('  ✗ Failed to bundle runtime:'));
        console.error(err.message || String(error));
        throw error;
    }
}

