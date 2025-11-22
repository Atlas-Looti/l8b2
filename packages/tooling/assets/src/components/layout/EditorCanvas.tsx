"use client";

import { Palette } from "lucide-react";
import type { AssetInfo, DrawingState } from "@/types/assets";
import { SpriteEditor } from "@/components/editors/SpriteEditor";
import { MapEditor } from "@/components/editors/MapEditor";

interface EditorCanvasProps {
    currentAsset: AssetInfo | null;
    drawingState: DrawingState;
}

export function EditorCanvas({ currentAsset, drawingState }: EditorCanvasProps) {
    if (!currentAsset) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-background text-muted-foreground">
                <Palette className="h-24 w-24 mb-6 opacity-20" />
                <h2 className="text-2xl font-semibold mb-2">Select an asset to edit</h2>
                <p className="text-sm">Choose a sprite or map from the sidebar to get started</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-background">
            {currentAsset.type === 'sprite' && (
                <SpriteEditor asset={currentAsset} drawingState={drawingState} />
            )}
            {currentAsset.type === 'map' && (
                <MapEditor asset={currentAsset} drawingState={drawingState} />
            )}
        </div>
    );
}
