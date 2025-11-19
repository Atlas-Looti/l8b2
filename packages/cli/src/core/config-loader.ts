import fs from 'fs-extra';
import path from 'path';
import type { LootiConfig } from '../types/config';
import {
    DEFAULT_GAME_NAME,
    DEFAULT_CANVAS_ID,
    DEFAULT_ORIENTATION,
    DEFAULT_ASPECT,
    ASPECT_SIZES,
    DEFAULT_CANVAS_SIZE,
} from '../utils';

const DEFAULT_CONFIG: LootiConfig = {
    name: DEFAULT_GAME_NAME,
    orientation: DEFAULT_ORIENTATION,
    aspect: DEFAULT_ASPECT,
    canvas: {
        id: DEFAULT_CANVAS_ID,
    },
};

/**
 * Load and merge configuration from l8b.config.json
 * 
 * @param projectPath - Root path of the project
 * @returns Merged configuration with defaults
 */
export async function loadConfig(projectPath: string = process.cwd()): Promise<LootiConfig> {
    const configPath = path.join(projectPath, 'l8b.config.json');

    let userConfig: Partial<LootiConfig> = {};

    if (await fs.pathExists(configPath)) {
        try {
            userConfig = await fs.readJson(configPath);
        } catch (error) {
            console.warn('Failed to parse l8b.config.json, using defaults');
        }
    }

    const config: LootiConfig = { ...DEFAULT_CONFIG, ...userConfig };

    // Ensure canvas object exists
    if (!config.canvas) {
        config.canvas = { id: DEFAULT_CANVAS_ID };
    }

    // Calculate dimensions based on aspect ratio if not explicitly provided
    if (!config.width || !config.height) {
        const aspect = config.aspect || DEFAULT_ASPECT;
        const [w, h] = ASPECT_SIZES[aspect] || DEFAULT_CANVAS_SIZE;
        
        // Apply orientation
        if (config.orientation === 'portrait' && w > h) {
            config.width = h;
            config.height = w;
        } else if (config.orientation === 'landscape' && h > w) {
            config.width = w;
            config.height = h;
        } else {
            config.width = w;
            config.height = h;
        }
    }

    return config;
}

/**
 * Get canvas dimensions from config with fallbacks
 * 
 * @param config - Game configuration
 * @returns Canvas width and height
 */
export function getCanvasSize(config: LootiConfig): { width: number; height: number } {
    const [defaultWidth, defaultHeight] = DEFAULT_CANVAS_SIZE;
    const width = config.width || config.canvas?.width || defaultWidth;
    const height = config.height || config.canvas?.height || defaultHeight;
    return { width, height };
}

