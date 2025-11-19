/**
 * Production build for LootiScript projects
 * 
 * Compiles LootiScript sources, bundles runtime, and generates
 * optimized production-ready output.
 */

import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';

import { loadConfig } from './config-loader';
import { detectResources } from '../loader/auto-detect';
import { loadSources } from '../loader/source-loader';
import { generateHTML } from '../generator/html-generator';
import { compileSources, saveCompiled } from '../compiler';
import { bundleRuntime } from '../bundler/runtime-bundler';
import {
    getCliPackageRoot,
    getBitCellFontPaths,
    BUILD_OUTPUT_DIR,
    FONT_BITCELL,
} from '../utils';

/**
 * Get CLI package root directory
 */
const cliPackageRoot = getCliPackageRoot();

/**
 * Copy .loot files recursively from source to destination
 */
async function copyLootFiles(srcDir: string, destDir: string): Promise<void> {
    const entries = await fs.readdir(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        
        if (entry.isDirectory()) {
            await fs.ensureDir(destPath);
            await copyLootFiles(srcPath, destPath);
        } else if (entry.name.endsWith('.loot')) {
            await fs.copy(srcPath, destPath);
        }
    }
}

/**
 * Build project for production
 * 
 * @param projectPath - Root path of the project
 */
export async function build(projectPath: string = process.cwd()): Promise<void> {
    const config = await loadConfig(projectPath);
    const distDir = path.join(projectPath, BUILD_OUTPUT_DIR);
    
    console.log(pc.cyan('\n  🏗️  Building for production...\n'));
    console.log(pc.gray(`  Project: ${projectPath}\n`));
    
    // Load sources and resources
    console.log(pc.gray('  Scanning sources and assets...'));
    const sources = await loadSources(projectPath);
    const resources = await detectResources(projectPath);
    
    console.log(pc.green(`  ✓ Found ${Object.keys(sources).length} source files`));
    console.log(pc.green(`  ✓ Found ${resources.images?.length ?? 0} images, ${resources.maps?.length ?? 0} maps`));
    
    // Compile LootiScript sources to bytecode
    const compileResult = await compileSources(sources, projectPath);
    
    if (compileResult.errors.length > 0) {
        console.error(pc.red('\n✗ Build failed due to compilation errors\n'));
        process.exit(1);
    }
    
    // Clean dist directory
    if (await fs.pathExists(distDir)) {
        console.log(pc.gray('  Cleaning previous build...'));
        await fs.remove(distDir);
    }
    
    // Ensure dist directory exists
    await fs.ensureDir(distDir);
    await fs.ensureDir(path.join(distDir, 'fonts'));
    
    // Save compiled routines
    console.log(pc.gray('  Saving compiled bytecode...'));
    await saveCompiled(compileResult.compiled, distDir);
    console.log(pc.green(`  ✓ Saved ${compileResult.compiled.length} compiled modules`));
    
    // Bundle runtime and lootiscript for browser
    console.log(pc.gray('  Bundling runtime dependencies...'));
    await bundleRuntime(distDir, projectPath);
    console.log(pc.green('  ✓ Bundled runtime'));
    
    // Copy public directory to dist
    const publicDir = path.join(projectPath, 'public');
    if (await fs.pathExists(publicDir)) {
        console.log(pc.gray('  Copying public assets...'));
        await fs.copy(publicDir, distDir, {
            overwrite: true,
            filter: (src) => {
                // Skip node_modules and other unnecessary files
                const relative = path.relative(publicDir, src);
                return !relative.includes('node_modules') && 
                       !relative.startsWith('.') &&
                       relative !== 'index.html'; // We'll generate this
            }
        });
        console.log(pc.green('  ✓ Copied public assets'));
    }
    
    // Copy source files (.loot) to dist for production
    console.log(pc.gray('  Copying source files...'));
    const scriptsDirs = [
        path.join(projectPath, 'scripts'),
        path.join(projectPath, 'src', 'l8b', 'ls')
    ];
    
    for (const scriptsDir of scriptsDirs) {
        if (await fs.pathExists(scriptsDir)) {
            const scriptsDest = path.join(distDir, 'scripts');
            await fs.ensureDir(scriptsDest);
            
            await copyLootFiles(scriptsDir, scriptsDest);
        }
    }
    console.log(pc.green('  ✓ Copied source files'));
    
    // Copy BitCell font from CLI package to dist
    const fontPaths = getBitCellFontPaths(cliPackageRoot);
    const fontDistPath = path.join(distDir, 'fonts', FONT_BITCELL);
    
    let fontSourcePath: string | null = null;
    if (await fs.pathExists(fontPaths.dist)) {
        fontSourcePath = fontPaths.dist;
    } else if (await fs.pathExists(fontPaths.src)) {
        fontSourcePath = fontPaths.src;
    }
    
    if (fontSourcePath) {
        await fs.copy(fontSourcePath, fontDistPath);
        console.log(pc.green('  ✓ Copied BitCell font'));
    } else {
        // Only warn, don't fail - font might work from browser cache
        console.warn(pc.yellow(`  ⚠ BitCell font not found. Tried:`));
        console.warn(pc.yellow(`    ${fontPaths.dist}`));
        console.warn(pc.yellow(`    ${fontPaths.src}`));
        console.warn(pc.gray(`  (Font may still work if cached)`));
    }
    
    // Generate HTML for production (using pre-compiled routines)
    console.log(pc.gray('  Generating HTML...'));
    const html = generateHTML(config, {}, resources, compileResult.compiled);
    
    // Write index.html
    await fs.writeFile(path.join(distDir, 'index.html'), html);
    console.log(pc.green('  ✓ Generated index.html'));
    
    console.log(pc.green('\n  ✓ Build completed successfully!\n'));
    console.log(pc.gray(`  Output: ${distDir}\n`));
    console.log(pc.cyan('  Run `l8b start` to preview the production build\n'));
}

