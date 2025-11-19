/**
 * Source file loader for LootiScript projects
 * 
 * Recursively finds and loads all .loot source files from standard locations.
 */

import fs from 'fs-extra';
import path from 'path';

// Standard source directories
const SOURCE_DIRECTORIES = ['scripts', 'src/l8b/ls'];

/**
 * Recursively find all .loot files in a directory
 * 
 * Uses parallel reads for better performance.
 * 
 * @param dir - Directory to scan
 * @returns Array of full file paths
 */
async function findLootFiles(dir: string): Promise<string[]> {
    if (!await fs.pathExists(dir)) {
        return [];
    }

    const results: string[] = [];
    
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        // Process entries in parallel where possible
        const fileTasks: Promise<string[]>[] = [];
        
        for (const entry of entries) {
            const filePath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                fileTasks.push(findLootFiles(filePath));
            } else if (entry.isFile() && entry.name.endsWith('.loot')) {
                results.push(filePath);
            }
        }
        
        // Wait for all subdirectory scans to complete
        if (fileTasks.length > 0) {
            const subResults = await Promise.all(fileTasks);
            results.push(...subResults.flat());
        }
    } catch (error) {
        // Directory might have been removed, silently ignore
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            console.warn(`Warning: Failed to scan directory ${dir}:`, error);
        }
    }
    
    return results;
}

/**
 * Load all .loot source files and return as Record<moduleName, filePath>
 * 
 * For Vite dev server, returns paths with leading / so they can be imported with ?raw.
 * Module names are relative paths without .loot extension (e.g., 'main', 'scenes/level1').
 * 
 * @param projectPath - Root path of the project
 * @returns Map of module names to file paths (relative to project root with leading /)
 */
export async function loadSources(projectPath: string = process.cwd()): Promise<Record<string, string>> {
    const sources: Record<string, string> = {};

    // Check for standard locations
    const locations = SOURCE_DIRECTORIES.map(dir => path.join(projectPath, ...dir.split('/')));

    // Scan all locations in parallel
    const scanTasks = locations.map(dir => findLootFiles(dir));
    const allFiles = (await Promise.all(scanTasks)).flat();

    // Process files to create module names
    for (const file of allFiles) {
        // Determine which source root this file belongs to
        let sourceRoot: string | null = null;
        for (const loc of locations) {
            if (file.startsWith(loc + path.sep) || file === loc) {
                sourceRoot = loc;
                break;
            }
        }

        if (!sourceRoot) continue;

        // Create a module name relative to the source root
        // e.g. scripts/main.loot -> main
        // scripts/scenes/level1.loot -> scenes/level1
        const relativePath = path.relative(sourceRoot, file);
        const name = relativePath.replace(/\.loot$/, '').replace(/\\/g, '/');

        // For dev server with Vite, we return the file path (relative to project root)
        const relativeToProject = path.relative(projectPath, file).replace(/\\/g, '/');
        sources[name] = '/' + relativeToProject;
    }

    return sources;
}

/**
 * Read source file content
 * 
 * @param filePath - Path to the source file
 * @returns File content as string
 */
export async function readSourceContent(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
}
