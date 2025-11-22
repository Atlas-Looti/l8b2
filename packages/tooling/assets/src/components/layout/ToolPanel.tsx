"use client";

import { Pencil, Eraser, PaintBucket, Pipette, Crop, Grid3x3, LayoutGrid, FlipHorizontal, FlipVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { AssetInfo, DrawingState, DrawingTool } from "@/types/assets";
import { cn } from "@/lib/utils";

interface ToolPanelProps {
    drawingState: DrawingState;
    onDrawingStateChange: (state: DrawingState) => void;
    currentAsset: AssetInfo | null;
}

export function ToolPanel({ drawingState, onDrawingStateChange, currentAsset }: ToolPanelProps) {
    const tools: { id: DrawingTool; icon: typeof Pencil; label: string }[] = [
        { id: 'pencil', icon: Pencil, label: 'Pencil' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'fill', icon: PaintBucket, label: 'Fill' },
        { id: 'eyedropper', icon: Pipette, label: 'Eyedropper' },
        { id: 'selection', icon: Crop, label: 'Selection' },
    ];

    const updateState = (updates: Partial<DrawingState>) => {
        onDrawingStateChange({ ...drawingState, ...updates });
    };

    return (
        <div className="flex h-full flex-col border-l bg-background">
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Tools Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Tools</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {tools.map(({ id, icon: Icon, label }) => (
                                <button
                                    key={id}
                                    onClick={() => updateState({ tool: id })}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 transition-all hover:bg-accent",
                                        drawingState.tool === id
                                            ? "border-primary bg-accent"
                                            : "border-transparent"
                                    )}
                                    title={label}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-[10px] font-medium">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Color Picker */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Color</Label>
                        <div className="space-y-2">
                            <input
                                type="color"
                                value={drawingState.color}
                                onChange={(e) => updateState({ color: e.target.value })}
                                className="h-24 w-full cursor-pointer rounded-lg border"
                            />
                            <input
                                type="text"
                                value={drawingState.color}
                                onChange={(e) => updateState({ color: e.target.value })}
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
                                placeholder="#000000"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Brush Size */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Brush Size</Label>
                            <span className="text-sm text-muted-foreground">{drawingState.brushSize}px</span>
                        </div>
                        <Slider
                            value={[drawingState.brushSize]}
                            onValueChange={([value]) => updateState({ brushSize: value })}
                            min={1}
                            max={20}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    <Separator />

                    {/* Helpers */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Helpers</Label>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="grid" className="text-sm">Grid</Label>
                                </div>
                                <Switch
                                    id="grid"
                                    checked={drawingState.gridEnabled}
                                    onCheckedChange={(checked) => updateState({ gridEnabled: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="tile" className="text-sm">Tile Mode</Label>
                                </div>
                                <Switch
                                    id="tile"
                                    checked={drawingState.tileMode}
                                    onCheckedChange={(checked) => updateState({ tileMode: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FlipHorizontal className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="symH" className="text-sm">Symmetry H</Label>
                                </div>
                                <Switch
                                    id="symH"
                                    checked={drawingState.symmetryH}
                                    onCheckedChange={(checked) => updateState({ symmetryH: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FlipVertical className="h-4 w-4 text-muted-foreground" />
                                    <Label htmlFor="symV" className="text-sm">Symmetry V</Label>
                                </div>
                                <Switch
                                    id="symV"
                                    checked={drawingState.symmetryV}
                                    onCheckedChange={(checked) => updateState({ symmetryV: checked })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Asset Info */}
                    {currentAsset && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Asset Info</Label>
                                <div className="rounded-lg bg-muted p-3 space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="font-medium">{currentAsset.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type:</span>
                                        <span className="font-medium capitalize">{currentAsset.type}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
