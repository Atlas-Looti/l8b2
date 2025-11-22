"use client";

import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AssetSidebar } from "@/components/layout/AssetSidebar";
import { EditorCanvas } from "@/components/layout/EditorCanvas";
import { ToolPanel } from "@/components/layout/ToolPanel";
import type { AssetInfo, DrawingState } from "@/types/assets";

export default function EditorPage() {
  const [currentAsset, setCurrentAsset] = useState<AssetInfo | null>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'pencil',
    color: '#000000',
    brushSize: 1,
    gridEnabled: true,
    symmetryH: false,
    symmetryV: false,
    tileMode: false,
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left: Asset Browser */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <AssetSidebar
            currentAsset={currentAsset}
            onAssetSelect={setCurrentAsset}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center: Canvas Editor */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <EditorCanvas
            currentAsset={currentAsset}
            drawingState={drawingState}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Tool Panel */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <ToolPanel
            drawingState={drawingState}
            onDrawingStateChange={setDrawingState}
            currentAsset={currentAsset}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
