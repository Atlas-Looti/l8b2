import { defineConfig } from "vitepress";

export default defineConfig({
	title: "l8b",
	description: "Looti Engine - Game engine web berbasis LootiScript",
	srcDir: "./docs",
	themeConfig: {
		logo: "/logo.svg",
		nav: [
			{ text: "Guide", link: "/guide/getting-started" },
			{ text: "API Reference", link: "/api/" },
			{ text: "Examples", link: "/examples/" },
		],
		sidebar: {
			"/guide/": [
				{
					text: "Introduction",
					items: [
						{ text: "Getting Started", link: "/guide/getting-started" },
						{ text: "Core Concepts", link: "/guide/core-concepts" },
					],
				},
				{
					text: "LootiScript",
					items: [
						{ text: "Language Basics", link: "/guide/lootiscript/basics" },
						{ text: "Variables & Types", link: "/guide/lootiscript/variables" },
						{ text: "Functions", link: "/guide/lootiscript/functions" },
					],
				},
				{
					text: "Game Development",
					items: [
						{ text: "Game Loop", link: "/guide/game-loop" },
						{ text: "Scenes & Routing", link: "/guide/scenes" },
						{ text: "Input Handling", link: "/guide/input" },
						{ text: "Graphics & Rendering", link: "/guide/graphics" },
					],
				},
			],
			"/api/": [
				{
					text: "Core",
					items: [
						{ text: "Overview", link: "/api/core/" },
						{ text: "Canvas", link: "/api/core/canvas" },
						{ text: "Input", link: "/api/core/input" },
						{ text: "Storage", link: "/api/core/storage" },
					],
				},
				{
					text: "Engine",
					items: [
						{ text: "Overview", link: "/api/enggine/" },
						{ text: "Runtime", link: "/api/enggine/runtime" },
						{ text: "VM", link: "/api/enggine/vm" },
						{ text: "Screen", link: "/api/enggine/screen" },
					],
				},
				{
					text: "Framework",
					items: [
						{ text: "Overview", link: "/api/framework/" },
						{ text: "Scene API", link: "/api/framework/scene" },
						{ text: "Route API", link: "/api/framework/route" },
					],
				},
			],
			"/examples/": [
				{
					text: "Examples",
					items: [
						{ text: "Overview", link: "/examples/" },
						{ text: "Basic Game", link: "/examples/basic-game" },
						{ text: "Scene Management", link: "/examples/scenes" },
						{ text: "Input Demo", link: "/examples/input" },
					],
				},
			],
		},
		socialLinks: [
			{ icon: "github", link: "https://github.com/Atlas-Looti/l8b2" },
		],
		search: {
			provider: "local",
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "Copyright © 2025 Atlas-Looti",
		},
	},
});
