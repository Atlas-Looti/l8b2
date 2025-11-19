/**
 * Path utilities for resolving CLI package and workspace paths
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get the CLI package root directory
 */
export function getCliPackageRoot(): string {
    const normalizedPath = __dirname.replace(/\\/g, '/');
    const cliIndex = normalizedPath.indexOf('/packages/cli/');
    
    if (cliIndex !== -1) {
        // Extract path up to and including 'packages/cli'
        const cliPackageRoot = normalizedPath.substring(0, cliIndex + '/packages/cli'.length);
        return path.normalize(cliPackageRoot);
    }
    
    // Fallback: use relative paths
    const isBuilt = normalizedPath.includes('/dist/core');
    return isBuilt 
        ? path.join(__dirname, '..', '..') // dist/core/../.. = packages/cli/
        : path.join(__dirname, '../..'); // src/core/../.. = packages/cli/
}

/**
 * Find workspace root by traversing up to find packages/ directory
 */
export async function findWorkspaceRoot(startPath: string, maxDepth = 10): Promise<string | null> {
    let currentPath = startPath;
    
    for (let i = 0; i < maxDepth; i++) {
        const packagesDir = path.join(currentPath, 'packages');
        if (await fs.pathExists(packagesDir)) {
            return currentPath;
        }
        const parent = path.dirname(currentPath);
        if (parent === currentPath) break; // Reached filesystem root
        currentPath = parent;
    }
    
    return null;
}

/**
 * Get BitCell font paths (dist and src)
 */
export function getBitCellFontPaths(cliPackageRoot: string): {
    dist: string;
    src: string;
} {
    return {
        dist: path.join(cliPackageRoot, 'dist', 'assets', 'fonts', 'BitCell.ttf'),
        src: path.join(cliPackageRoot, 'src', 'assets', 'fonts', 'BitCell.ttf'),
    };
}

/**
 * Resolve project-relative path (handles paths starting with /)
 */
export function resolveProjectPath(projectPath: string, filePath: string): string {
    // Remove leading / if present (added for Vite compatibility)
    const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    return path.normalize(path.join(projectPath, normalizedPath));
}

