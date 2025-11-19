/**
 * Constants used throughout the CLI
 */

export const DEFAULT_PORT = 3000;
export const DEFAULT_HOST = false;
export const CACHE_TTL_MS = 100;
export const MAX_WORKSPACE_SEARCH_DEPTH = 10;

export const DEFAULT_GAME_NAME = 'LootiScript Game';
export const DEFAULT_CANVAS_ID = 'game';
export const DEFAULT_ORIENTATION = 'any' as const;
export const DEFAULT_ASPECT = 'free' as const;

export const ASPECT_SIZES: Record<string, [number, number]> = {
    'free': [1920, 1080],
    '16x9': [1920, 1080],
    '4x3': [1600, 1200],
    '1x1': [1080, 1080],
    '2x1': [2560, 1280],
    '>16x9': [1920, 1080], // Minimum
    '>4x3': [1600, 1200], // Minimum
    '>1x1': [1080, 1080], // Minimum
    '>2x1': [2560, 1280], // Minimum
};

export const DEFAULT_CANVAS_SIZE: [number, number] = [1920, 1080];

export const FONT_BITCELL = 'BitCell.ttf';
export const FONT_CONTENT_TYPE = 'font/ttf';
export const FONT_CACHE_CONTROL = 'public, max-age=31536000';

export const BUILD_OUTPUT_DIR = '.l8b';
export const COMPILED_DIR = 'compiled';
export const RUNTIME_BUNDLE = 'runtime.js';
export const MANIFEST_FILE = 'compiled-manifest.json';

