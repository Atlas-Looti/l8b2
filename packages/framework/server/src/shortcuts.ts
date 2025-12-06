/**
 * CLI Shortcuts for L8B Development Server
 * Inspired by Vite's keyboard shortcuts implementation
 */
import readline from "node:readline";
import type { L8BDevServer } from "./server";

/** ANSI color codes */
const COLORS = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	green: "\x1b[32m",
	cyan: "\x1b[36m",
} as const;

/**
 * CLI Shortcut definition
 */
export interface CLIShortcut<Server = L8BDevServer> {
	/** Key to trigger the shortcut (single character) */
	key: string;
	/** Description shown in help menu */
	description: string;
	/** Action to execute when shortcut is triggered */
	action?(server: Server): void | Promise<void>;
}

/**
 * Options for binding CLI shortcuts
 */
export interface BindCLIShortcutsOptions<Server = L8BDevServer> {
	/** Print help hint after server starts */
	print?: boolean;
	/** Custom shortcuts (takes priority over defaults) */
	customShortcuts?: CLIShortcut<Server>[];
}

/**
 * Default development server shortcuts
 */
const BASE_DEV_SHORTCUTS: CLIShortcut<L8BDevServer>[] = [
	{
		key: "r",
		description: "restart the server",
		async action(server) {
			await restartServer(server);
		},
	},
	{
		key: "u",
		description: "show server url",
		action(server) {
			const url = server.getServerUrl();
			console.log("");
			console.log(`  ${COLORS.dim}Local:${COLORS.reset}   ${COLORS.cyan}${url}${COLORS.reset}`);
			console.log("");
		},
	},
	{
		key: "o",
		description: "open in browser",
		action(server) {
			server.openInBrowser();
		},
	},
	{
		key: "c",
		description: "clear console",
		action() {
			// Clear the terminal screen using ANSI escape code
			process.stdout.write("\x1Bc");
		},
	},
	{
		key: "q",
		description: "quit",
		async action(server) {
			try {
				await server.stop();
			} finally {
				process.exit(0);
			}
		},
	},
];

/**
 * Restart the server
 */
async function restartServer(server: L8BDevServer): Promise<void> {
	console.log(`\n${COLORS.cyan}[l8b]${COLORS.reset} Restarting server...\n`);

	// Store shortcuts options before restart
	const shortcutsOptions = server._shortcutsOptions;

	await server.stop();
	await server.start();

	// Rebind shortcuts after restart (without printing help again)
	if (shortcutsOptions) {
		bindCLIShortcuts(server, { ...shortcutsOptions, print: false });
	}

	console.log(`${COLORS.cyan}[l8b]${COLORS.reset} ${COLORS.green}✓${COLORS.reset} Server restarted\n`);
}

/**
 * Bind CLI shortcuts to a dev server
 *
 * @param server - The L8B dev server instance
 * @param opts - Shortcut binding options
 * @param enabled - Whether shortcuts should be enabled (default: true if TTY and not CI)
 */
export function bindCLIShortcuts(
	server: L8BDevServer,
	opts?: BindCLIShortcutsOptions<L8BDevServer>,
	enabled: boolean = process.stdin.isTTY === true && !process.env.CI,
): void {
	if (!enabled) {
		return;
	}

	const customShortcuts: CLIShortcut<L8BDevServer>[] = opts?.customShortcuts ?? [];

	// Merge custom shortcuts from existing options (new shortcuts take priority)
	for (const shortcut of server._shortcutsOptions?.customShortcuts ?? []) {
		if (!customShortcuts.some((s) => s.key === shortcut.key)) {
			customShortcuts.push(shortcut);
		}
	}

	server._shortcutsOptions = {
		...opts,
		customShortcuts,
	};

	// Print help hint
	if (opts?.print) {
		console.log(
			`${COLORS.dim}${COLORS.green}  ➜${COLORS.reset}${COLORS.dim}  press ${COLORS.reset}${COLORS.bold}h + enter${COLORS.reset}${COLORS.dim} to show help${COLORS.reset}`,
		);
	}

	// Build shortcuts list with custom taking priority over defaults
	const shortcuts = customShortcuts.concat(BASE_DEV_SHORTCUTS);

	let actionRunning = false;

	const onInput = async (input: string) => {
		// Prevent concurrent actions
		if (actionRunning) return;

		const trimmedInput = input.trim().toLowerCase();

		// Handle help command (always available)
		if (trimmedInput === "h") {
			const loggedKeys = new Set<string>();
			console.log("\n  Shortcuts\n");

			for (const shortcut of shortcuts) {
				if (loggedKeys.has(shortcut.key)) continue;
				loggedKeys.add(shortcut.key);

				if (shortcut.action == null) continue;

				console.log(
					`${COLORS.dim}  press ${COLORS.reset}${COLORS.bold}${shortcut.key} + enter${COLORS.reset}${COLORS.dim} to ${shortcut.description}${COLORS.reset}`,
				);
			}
			console.log("");
			return;
		}

		// Find matching shortcut
		const shortcut = shortcuts.find((s) => s.key === trimmedInput);
		if (!shortcut || shortcut.action == null) return;

		actionRunning = true;
		try {
			await shortcut.action(server);
		} catch (err) {
			console.error(`${COLORS.cyan}[l8b]${COLORS.reset} Shortcut "${shortcut.key}" failed:`, err);
		}
		actionRunning = false;
	};

	// Setup or reuse readline interface
	if (!server._rl) {
		const rl = readline.createInterface({ input: process.stdin });
		server._rl = rl;
	} else {
		// Remove existing listeners before adding new ones
		server._rl.removeAllListeners("line");
	}

	server._rl.on("line", onInput);
}

/**
 * Unbind CLI shortcuts from a server (cleanup)
 */
export function unbindCLIShortcuts(server: L8BDevServer): void {
	if (server._rl) {
		server._rl.removeAllListeners("line");
		server._rl.close();
		server._rl = undefined;
	}
	server._shortcutsOptions = undefined;
}
