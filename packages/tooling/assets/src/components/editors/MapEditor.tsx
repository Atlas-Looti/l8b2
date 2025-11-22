"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Save, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AssetInfo, DrawingState } from "@/types/assets";

interface MapEditorProps {
    asset: AssetInfo;
    drawingState: DrawingState;
}

interface MapData {
    width: number;
    height: number;
    blockWidth: number;
    blockHeight: number;
    tiles: string[][]; // sprite names
}

export function MapEditor({ asset, drawingState }: MapEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mapData, setMapData] = useState<MapData>({
        width: 20,
        height: 20,
        blockWidth: 16,
        blockHeight: 16,
        tiles: Array(20).fill(null).map(() => Array(20).fill('')),
    });
    const [selectedTile, setSelectedTile] = useState<string>('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [mousePos, setMousePos] = useState({ x: -1, y: -1 });

    // Available sprites for tiles (mock data for now)
    const availableSprites = ['player', 'enemy', 'wall', 'floor', 'coin', 'tree'];

    // Draw the map canvas
    const drawMap = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height, blockWidth, blockHeight, tiles } = mapData;

        // Set canvas size
        canvas.width = width * blockWidth;
        canvas.height = height * blockHeight;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw tiles
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = tiles[y]?.[x];
                if (tile) {
                    // Draw tile (for now just a colored rectangle)
                    const hue = (tile.charCodeAt(0) * 30) % 360;
                    ctx.fillStyle = `hsl(${hue}, 60%, 50%)`;
                    ctx.fillRect(
                        x * blockWidth + 1,
                        y * blockHeight + 1,
                        blockWidth - 2,
                        blockHeight - 2
                    );

                    // Draw tile name
                    ctx.fillStyle = '#fff';
                    ctx.font = '8px monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                        tile.substring(0, 3),
                        x * blockWidth + blockWidth / 2,
                        y * blockHeight + blockHeight / 2
                    );
                }
            }
        }

        // Draw grid
        if (drawingState.gridEnabled) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;

            for (let x = 0; x <= width; x++) {
                ctx.beginPath();
                ctx.moveTo(x * blockWidth + 0.5, 0);
                ctx.lineTo(x * blockWidth + 0.5, canvas.height);
                ctx.stroke();
            }

            for (let y = 0; y <= height; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * blockHeight + 0.5);
                ctx.lineTo(canvas.width, y * blockHeight + 0.5);
                ctx.stroke();
            }
        }

        // Highlight hovered cell
        if (mousePos.x >= 0 && mousePos.y >= 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                mousePos.x * blockWidth,
                mousePos.y * blockHeight,
                blockWidth,
                blockHeight
            );
        }
    }, [mapData, drawingState.gridEnabled, mousePos]);

    useEffect(() => {
        drawMap();
    }, [drawMap]);

    // Handle mouse events for tile placement
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        placeTile(e);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / mapData.blockWidth);
        const y = Math.floor((e.clientY - rect.top) / mapData.blockHeight);

        setMousePos({ x, y });

        if (isDrawing) {
            placeTile(e);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleMouseLeave = () => {
        setIsDrawing(false);
        setMousePos({ x: -1, y: -1 });
    };

    const placeTile = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedTile) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / mapData.blockWidth);
        const y = Math.floor((e.clientY - rect.top) / mapData.blockHeight);

        if (x >= 0 && x < mapData.width && y >= 0 && y < mapData.height) {
            setMapData(prev => {
                const newTiles = prev.tiles.map(row => [...row]);
                newTiles[y][x] = selectedTile;
                return { ...prev, tiles: newTiles };
            });
        }
    };

    const handleResize = () => {
        const newWidth = parseInt((document.getElementById('map-width') as HTMLInputElement)?.value || '20');
        const newHeight = parseInt((document.getElementById('map-height') as HTMLInputElement)?.value || '20');

        if (newWidth > 0 && newHeight > 0 && newWidth <= 128 && newHeight <= 128) {
            setMapData(prev => {
                const newTiles = Array(newHeight).fill(null).map((_, y) =>
                    Array(newWidth).fill(null).map((_, x) => prev.tiles[y]?.[x] || '')
                );
                return { ...prev, width: newWidth, height: newHeight, tiles: newTiles };
            });
        }
    };

    const handleBlockSizeChange = () => {
        const newBlockWidth = parseInt((document.getElementById('map-block-width') as HTMLInputElement)?.value || '16');
        const newBlockHeight = parseInt((document.getElementById('map-block-height') as HTMLInputElement)?.value || '16');

        if (newBlockWidth > 0 && newBlockHeight > 0 && newBlockWidth <= 64 && newBlockHeight <= 64) {
            setMapData(prev => ({ ...prev, blockWidth: newBlockWidth, blockHeight: newBlockHeight }));
        }
    };

    return (
        <div className="flex h-full">
            {/* Tile Palette */}
            <div className="w-48 border-r bg-background flex flex-col">
                <div className="p-3 border-b">
                    <h3 className="text-sm font-semibold">Tiles</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-2 gap-2 p-2">
                        {availableSprites.map((sprite) => (
                            <button
                                key={sprite}
                                onClick={() => setSelectedTile(sprite)}
                                className={`aspect-square rounded border-2 transition-all p-2 ${selectedTile === sprite
                                        ? 'border-primary bg-accent'
                                        : 'border-transparent bg-muted hover:border-border'
                                    }`}
                            >
                                <div
                                    className="w-full h-full rounded"
                                    style={{
                                        background: `hsl(${(sprite.charCodeAt(0) * 30) % 360}, 60%, 50%)`
                                    }}
                                />
                                <div className="text-[10px] mt-1 truncate text-center">{sprite}</div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center justify-between border-b p-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-xs">Size:</Label>
                            <Input
                                id="map-width"
                                type="number"
                                defaultValue={mapData.width}
                                className="w-16 h-8 text-xs"
                            />
                            <span className="text-xs">x</span>
                            <Input
                                id="map-height"
                                type="number"
                                defaultValue={mapData.height}
                                className="w-16 h-8 text-xs"
                            />
                            <Button size="sm" variant="ghost" onClick={handleResize}>
                                Apply
                            </Button>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <Label className="text-xs">Block:</Label>
                            <Input
                                id="map-block-width"
                                type="number"
                                defaultValue={mapData.blockWidth}
                                className="w-16 h-8 text-xs"
                            />
                            <span className="text-xs">x</span>
                            <Input
                                id="map-block-height"
                                type="number"
                                defaultValue={mapData.blockHeight}
                                className="w-16 h-8 text-xs"
                            />
                            <Button size="sm" variant="ghost" onClick={handleBlockSizeChange}>
                                Apply
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                            <Redo className="h-4 w-4" />
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <Button size="sm">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-8">
                    <canvas
                        ref={canvasRef}
                        className="border border-border shadow-lg cursor-crosshair"
                        style={{ imageRendering: 'pixelated' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    />
                </div>

                {/* Status Bar */}
                <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                        {mousePos.x >= 0 && mousePos.y >= 0 ? (
                            <span>Position: {mousePos.x}, {mousePos.y}</span>
                        ) : (
                            <span>Hover over map to see coordinates</span>
                        )}
                    </div>
                    <div>
                        Selected: {selectedTile || 'None'}
                    </div>
                </div>
            </div>
        </div>
    );
}
