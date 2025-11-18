import { Runtime } from "@l8b/runtime";
import mainLootiScript from "./main.ls?raw";

export async function initDinoGame() {
	const app = document.getElementById("app");
	if (!app) throw new Error("App element not found");

	// Clear app and create canvas
	app.innerHTML = '<canvas id="game"></canvas>';

	const canvas = document.getElementById("game") as HTMLCanvasElement | null;
	if (!canvas) throw new Error("Canvas element with id 'game' not found");
	canvas.width = 1920;
	canvas.height = 1080;

	// Create runtime
	const runtime = new Runtime({
		canvas,
		width: 1920,
		height: 1080,
		url: "/",
		sources: {
			main: mainLootiScript,
		},
		resources: {
			images: [
				{ file: "hero.png", version: 1 },
				{ file: "wall.png", version: 1 },
				{ file: "blade.png", version: 1 },
				{ file: "icon.png", version: 1 },
			],
		},
		listener: {
			log: (message) => {
				console.log("[GAME]", message);
			},
			reportError: (error) => {
				console.error("[GAME ERROR]", error);
			},
			postMessage: (msg) => {
				console.log("[GAME MESSAGE]", msg);
			},
		},
	});

	const logCanvasSize = () => {
		console.log(
			`Canvas internal size: ${canvas.width}x${canvas.height}, display size: ${canvas.clientWidth}x${canvas.clientHeight}`,
		);
	};

	// Start the game
	console.log("Starting Dino Game...");
	try {
		await runtime.start();
		console.log("Runtime started successfully!");
		console.log("Game is running...");
		logCanvasSize();
	} catch (err) {
		console.error(err);
	}

	// Make runtime accessible from console for debugging
	(window as any).runtime = runtime;
	console.log("Runtime available as window.runtime");

	window.addEventListener("resize", logCanvasSize);
}

