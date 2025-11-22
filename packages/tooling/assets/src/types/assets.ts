// Asset types
export type AssetType = 'sprite' | 'map' | 'folder';

export interface AssetInfo {
    name: string;
    type: AssetType;
    path: string;
    lastModified?: Date;
}

// Sprite types
export interface SpriteData {
    name: string;
    width: number;
    height: number;
    frames: SpriteFrame[];
    fps?: number;
}

export interface SpriteFrame {
    id: string;
    data: string; // base64 encoded image data
    duration?: number;
}

// Map types
export interface MapData {
    name: string;
    width: number;
    height: number;
    blockWidth: number;
    blockHeight: number;
    tiles: number[][];
    sprites: string[]; // sprite names used in the map
}

// Drawing tool types
export type DrawingTool = 'pencil' | 'eraser' | 'fill' | 'eyedropper' | 'selection' | 'line' | 'rectangle' | 'circle';

export interface DrawingState {
    tool: DrawingTool;
    color: string;
    brushSize: number;
    gridEnabled: boolean;
    symmetryH: boolean;
    symmetryV: boolean;
    tileMode: boolean;
}

// Editor state
export interface EditorState {
    currentAsset: AssetInfo | null;
    assets: AssetInfo[];
    drawing: DrawingState;
    zoom: number;
    canUndo: boolean;
    canRedo: boolean;
}

// API response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
