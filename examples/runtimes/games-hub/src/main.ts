import { initDinoGame } from "./dino/game";
import { initFishGame } from "./fish/game";

const app = document.getElementById("app");
if (!app) throw new Error("App element not found");

// Simple router
const routes: Record<string, () => void | Promise<void>> = {
	"/": showHome,
	"/dino": async () => {
		await initDinoGame();
		addBackButton();
	},
	"/fish": async () => {
		await initFishGame();
		addBackButton();
	},
};

function showHome() {
	if (!app) return;
	
	app.innerHTML = `
		<div class="home-container">
			<h1>GAMES HUB</h1>
			<div id="home">
				<a href="/dino" class="game-button">DINO RUNNER</a>
				<a href="/fish" class="game-button">FISH GAME</a>
			</div>
		</div>
	`;

	// Handle navigation for links
	const links = app.querySelectorAll("a");
	links.forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			const href = link.getAttribute("href");
			if (href) {
				window.history.pushState({}, "", href);
				handleRoute();
			}
		});
	});
}

function addBackButton() {
	const canvas = document.getElementById("game");
	if (!canvas) return;
	
	const backButton = document.createElement("a");
	backButton.href = "/";
	backButton.textContent = "← BACK TO HOME";
	backButton.className = "back-button";
	backButton.style.cssText = `
		position: fixed;
		top: 20px;
		left: 20px;
		background: #238636;
		border: 3px solid #3fb950;
		color: #fff;
		padding: 0.75rem 1.5rem;
		font-family: "PressStart2P", system-ui, sans-serif;
		font-size: 0.8rem;
		cursor: pointer;
		text-decoration: none;
		z-index: 1000;
		border-radius: 4px;
		transition: all 0.2s;
	`;
	
	backButton.addEventListener("click", (e) => {
		e.preventDefault();
		window.history.pushState({}, "", "/");
		handleRoute();
	});
	
	backButton.addEventListener("mouseenter", () => {
		backButton.style.background = "#2ea043";
		backButton.style.borderColor = "#4fd164";
		backButton.style.transform = "scale(1.05)";
	});
	
	backButton.addEventListener("mouseleave", () => {
		backButton.style.background = "#238636";
		backButton.style.borderColor = "#3fb950";
		backButton.style.transform = "scale(1)";
	});
	
	document.body.appendChild(backButton);
}

async function handleRoute() {
	const path = window.location.pathname;
	const handler = routes[path] || routes["/"];
	
	// Remove any existing back button
	const existingBackButton = document.querySelector(".back-button");
	if (existingBackButton) {
		existingBackButton.remove();
	}
	
	if (handler) {
		await handler();
	}
}

// Handle browser back/forward
window.addEventListener("popstate", handleRoute);

// Initial route
handleRoute();

