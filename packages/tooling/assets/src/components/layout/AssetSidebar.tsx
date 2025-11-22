"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FolderPlus, Grid3x3, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AssetInfo } from "@/types/assets";

interface AssetSidebarProps {
    currentAsset: AssetInfo | null;
    onAssetSelect: (asset: AssetInfo) => void;
}

export function AssetSidebar({ currentAsset, onAssetSelect }: AssetSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [assets, setAssets] = useState<AssetInfo[]>([]);
    const [activeTab, setActiveTab] = useState<"sprites" | "maps">("sprites");

    // TODO: Load assets from API
    useEffect(() => {
        // Placeholder data
        setAssets([
            { name: "player", type: "sprite", path: "/sprites/player.png" },
            { name: "enemy", type: "sprite", path: "/sprites/enemy.png" },
            { name: "level1", type: "map", path: "/maps/level1.json" },
        ]);
    }, []);

    const filteredAssets = assets.filter(
        (asset) =>
            asset.type === activeTab.slice(0, -1) &&
            asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateAsset = () => {
        const name = prompt(`Enter ${activeTab.slice(0, -1)} name:`);
        if (name) {
            // TODO: Create asset via API
            console.log(`Creating ${activeTab.slice(0, -1)}:`, name);
        }
    };

    return (
        <div className="flex h-full flex-col border-r bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Assets</h2>
                <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={handleCreateAsset}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                        <FolderPlus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search assets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
                <TabsList className="mx-4 grid w-auto grid-cols-2">
                    <TabsTrigger value="sprites">Sprites</TabsTrigger>
                    <TabsTrigger value="maps">Maps</TabsTrigger>
                </TabsList>

                <TabsContent value="sprites" className="flex-1 mt-0">
                    <AssetGrid
                        assets={filteredAssets}
                        currentAsset={currentAsset}
                        onAssetSelect={onAssetSelect}
                    />
                </TabsContent>

                <TabsContent value="maps" className="flex-1 mt-0">
                    <AssetGrid
                        assets={filteredAssets}
                        currentAsset={currentAsset}
                        onAssetSelect={onAssetSelect}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

interface AssetGridProps {
    assets: AssetInfo[];
    currentAsset: AssetInfo | null;
    onAssetSelect: (asset: AssetInfo) => void;
}

function AssetGrid({ assets, currentAsset, onAssetSelect }: AssetGridProps) {
    if (assets.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                <div>
                    <FolderPlus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No assets found</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="grid grid-cols-3 gap-2 p-4">
                {assets.map((asset) => (
                    <button
                        key={asset.name}
                        onClick={() => onAssetSelect(asset)}
                        className={`
              group relative aspect-square rounded-lg border-2 transition-all
              hover:border-primary hover:bg-accent
              ${currentAsset?.name === asset.name ? 'border-primary bg-accent' : 'border-border'}
            `}
                    >
                        <div className="flex h-full flex-col items-center justify-center p-2">
                            {asset.type === 'sprite' ? (
                                <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-foreground" />
                            ) : (
                                <Grid3x3 className="h-8 w-8 text-blue-500" />
                            )}
                            <span className="mt-2 text-xs font-medium truncate w-full text-center">
                                {asset.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}
