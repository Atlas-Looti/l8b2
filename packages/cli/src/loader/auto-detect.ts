/**
 * Automatic asset detection for LootiScript projects
 * 
 * Scans public/ directory for game assets (sprites, maps, sounds, music)
 * and returns them in the Resources format expected by @l8b/runtime.
 */

import fs from 'fs-extra';
import path from 'path';
import type { Resources, ResourceFile } from '@l8b/runtime';

// Image file extensions
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
// Map file extensions
const MAP_EXTENSIONS = new Set(['.json', '.tmj']);
// Audio file extensions
const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg']);
// Known asset directories to skip when scanning root public/
const KNOWN_DIRS = new Set(['sprites', 'maps', 'fonts', 'sounds', 'music', 'l8b']);

/**
 * Scan a single directory for files with matching extensions
 * 
 * @param dirPath - Directory to scan
 * @param extensions - Set of file extensions to match
 * @returns Array of ResourceFile objects
 */
async function scanDirectory(dirPath: string, extensions: Set<string>): Promise<ResourceFile[]> {
    const files: ResourceFile[] = [];
    
    if (!await fs.pathExists(dirPath)) {
        return files;
    }

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            // Skip directories
            if (entry.isDirectory()) continue;
            
            const ext = path.extname(entry.name).toLowerCase();
            if (extensions.has(ext)) {
                files.push({
                    file: entry.name, // Just the filename
                    version: 1,
                });
            }
        }
    } catch (error) {
        // Directory might have been removed, silently ignore
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            console.warn(`Warning: Failed to scan directory ${dirPath}:`, error);
        }
    }

    return files;
}

/**
 * Detect and collect all game resources from public/ directory
 * 
 * Scans for images, maps, sounds, music, and generic assets.
 * Checks both public/ and public/l8b/ directories for compatibility.
 * 
 * @param projectPath - Root path of the project
 * @returns Resources object with detected assets
 */
export async function detectResources(projectPath: string = process.cwd()): Promise<Resources> {
    const resources: Resources = {
        images: [],
        maps: [],
        sounds: [],
        music: [],
        assets: [],
    };

    const publicDir = path.join(projectPath, 'public');

    if (!await fs.pathExists(publicDir)) {
        return resources;
    }

    // Scan multiple directories in parallel for better performance
    const scanTasks = [
        // Images from sprites
        scanDirectory(path.join(publicDir, 'sprites'), IMAGE_EXTENSIONS),
        scanDirectory(path.join(publicDir, 'l8b', 'sprites'), IMAGE_EXTENSIONS),
        
        // Maps
        scanDirectory(path.join(publicDir, 'maps'), MAP_EXTENSIONS),
        scanDirectory(path.join(publicDir, 'l8b', 'maps'), MAP_EXTENSIONS),
        
        // Sounds
        scanDirectory(path.join(publicDir, 'sounds'), AUDIO_EXTENSIONS),
        scanDirectory(path.join(publicDir, 'l8b', 'sounds'), AUDIO_EXTENSIONS),
        
        // Music
        scanDirectory(path.join(publicDir, 'music'), AUDIO_EXTENSIONS),
        scanDirectory(path.join(publicDir, 'l8b', 'music'), AUDIO_EXTENSIONS),
    ];

    const [
        sprites1, sprites2,
        maps1, maps2,
        sounds1, sounds2,
        music1, music2
    ] = await Promise.all(scanTasks);

    // Combine results (remove duplicates based on filename)
    const imageSet = new Set<string>();
    const mapSet = new Set<string>();
    const soundSet = new Set<string>();
    const musicSet = new Set<string>();

    [...sprites1, ...sprites2].forEach(file => {
        if (!imageSet.has(file.file)) {
            imageSet.add(file.file);
            resources.images!.push(file);
        }
    });

    [...maps1, ...maps2].forEach(file => {
        if (!mapSet.has(file.file)) {
            mapSet.add(file.file);
            resources.maps!.push(file);
        }
    });

    [...sounds1, ...sounds2].forEach(file => {
        if (!soundSet.has(file.file)) {
            soundSet.add(file.file);
            resources.sounds!.push(file);
        }
    });

    [...music1, ...music2].forEach(file => {
        if (!musicSet.has(file.file)) {
            musicSet.add(file.file);
            resources.music!.push(file);
        }
    });

    // Scan root public for generic assets (non-parallel to avoid too many concurrent reads)
    try {
        const entries = await fs.readdir(publicDir, { withFileTypes: true });
        for (const entry of entries) {
            // Skip known directories
            if (entry.isDirectory() || KNOWN_DIRS.has(entry.name)) {
                continue;
            }
            
            // Add as generic asset
            resources.assets!.push({
                file: '/' + entry.name.replace(/\\/g, '/'),
                version: 1,
            });
        }
    } catch (error) {
        // Silently ignore if directory doesn't exist
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            console.warn(`Warning: Failed to scan public directory:`, error);
        }
    }

    return resources;
}
