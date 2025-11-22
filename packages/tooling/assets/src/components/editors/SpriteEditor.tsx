"use client";

import { useRef, useEffect, useState } from "react";
import { ZoomIn, ZoomOut, Save, Undo, Redo, Play, Pause, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AssetInfo, DrawingState } from "@/types/assets";
import { cn } from "@/lib/utils";

interface SpriteEditorProps {
    asset: AssetInfo;
    drawingState: DrawingState;
}

export function SpriteEditor({ asset, drawingState }: SpriteEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState(8);
    const [frames, setFrames] = useState([{ id: '1', data: '' }]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 32;
        canvas.height = 32;

        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid if enabled
        if (drawingState.gridEnabled) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 1;
            for (let x = 0; x <= canvas.width; x++) {
                ctx.beginPath();
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= canvas.height; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(canvas.width, y + 0.5);
                ctx.stroke();
            }
        }
    }, [drawingState.gridEnabled]);

    const handleZoomIn = () => setZoom(Math.min(zoom + 2, 32));
    const handleZoomOut = () => setZoom(Math.max(zoom - 2, 2));

    return (
        <div className="flex h-full flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b p-2">
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                        <Redo className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button size="sm" variant="ghost" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">{zoom}x</span>
                    <Button size="sm" variant="ghost" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">32x32</span>
                    <Separator orientation="vertical" className="h-6" />
                    <Button size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-8">
                <div className="relative" style={{ imageRendering: 'pixelated' }}>
                    <canvas
                        ref={canvasRef}
                        className="border border-border shadow-lg"
                        style={{
                            width: `${32 * zoom}px`,
                            height: `${32 * zoom}px`,
                            imageRendering: 'pixelated',
                        }}
                    />
                </div>
            </div>

            {/* Animation Panel */}
            <div className="border-t bg-background">
                <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-sm text-muted-foreground">12 FPS</span>
                    </div>
                    <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Frame
                    </Button>
                </div>
                <ScrollArea className="h-24">
                    <div className="flex gap-2 p-2">
                        {frames.map((frame, index) => (
                            <button
                                key={frame.id}
                                onClick={() => setCurrentFrame(index)}
                                className={cn(
                                    "relative flex-shrink-0 w-16 h-16 rounded border-2 bg-muted transition-all",
                                    currentFrame === index ? "border-primary" : "border-transparent hover:border-border"
                                )}
                            >
                                <span className="absolute top-0 left-0 bg-background/80 px-1 text-[10px]">
                                    {index + 1}
                                </span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
