import * as vscode from "vscode";
import * as path from "path";
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log("LootiScript Language Server extension is activating...");

	// Create status bar item
	statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100,
	);
	statusBarItem.text = "$(pulse) L8B";
	statusBarItem.tooltip = "LootiScript Language Server";
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join("..", "language-server", "dist", "server.js"),
	);

	// The debug options for the server
	const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions,
		},
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for LootiScript documents
		documentSelector: [{ scheme: "file", language: "lootiscript" }],
		synchronize: {
			// Notify the server about file changes to .loot files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher("**/*.loot"),
		},
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		"lootiscriptLanguageServer",
		"LootiScript Language Server",
		serverOptions,
		clientOptions,
	);

	// Start the client. This will also launch the server
	client
		.start()
		.then(() => {
			statusBarItem.text = "$(check) L8B";
			statusBarItem.tooltip = "LootiScript Language Server: Running";
			console.log("LootiScript Language Server started successfully");
		})
		.catch((error) => {
			statusBarItem.text = "$(error) L8B";
			statusBarItem.tooltip = `LootiScript Language Server: Error - ${error}`;
			console.error("Failed to start LootiScript Language Server:", error);
		});

	// Register commands
	registerCommands(context);

	// Listen to diagnostics for error count in status bar
	context.subscriptions.push(
		vscode.languages.onDidChangeDiagnostics((e) => {
			updateStatusBarWithDiagnostics();
		}),
	);

	console.log("LootiScript Language Server extension is now active!");
}

function registerCommands(context: vscode.ExtensionContext) {
	// Command: Format Document
	context.subscriptions.push(
		vscode.commands.registerCommand("lootiscript.formatDocument", async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === "lootiscript") {
				await vscode.commands.executeCommand("editor.action.formatDocument");
				vscode.window.showInformationMessage("Document formatted!");
			} else {
				vscode.window.showWarningMessage(
					"No LootiScript file is currently active",
				);
			}
		}),
	);

	// Command: Run Script
	context.subscriptions.push(
		vscode.commands.registerCommand("lootiscript.runScript", async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === "lootiscript") {
				const filePath = editor.document.uri.fsPath;

				// Try to find and run with @l8b/cli if available
				const terminal = vscode.window.createTerminal("L8B Run");
				terminal.show();

				// Check if we're in a workspace with l8b CLI
				const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
				if (workspaceFolder) {
					terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
					terminal.sendText(`npx @l8b/cli dev`);
				} else {
					vscode.window.showWarningMessage(
						"No workspace folder found. Please open a L8B project.",
					);
				}
			} else {
				vscode.window.showWarningMessage(
					"No LootiScript file is currently active",
				);
			}
		}),
	);

	// Command: Show API Documentation
	context.subscriptions.push(
		vscode.commands.registerCommand("lootiscript.showDocs", () => {
			const panel = vscode.window.createWebviewPanel(
				"lootiscriptDocs",
				"LootiScript API Documentation",
				vscode.ViewColumn.Two,
				{},
			);

			panel.webview.html = getDocumentationHTML();
		}),
	);

	// Command: Restart Language Server
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"lootiscript.restartLanguageServer",
			async () => {
				if (client) {
					statusBarItem.text = "$(sync~spin) L8B";
					statusBarItem.tooltip = "LootiScript Language Server: Restarting...";

					await client.stop();
					await client.start();

					statusBarItem.text = "$(check) L8B";
					statusBarItem.tooltip = "LootiScript Language Server: Running";

					vscode.window.showInformationMessage(
						"LootiScript Language Server restarted",
					);
				}
			},
		),
	);
}

function updateStatusBarWithDiagnostics() {
	const diagnostics = vscode.languages.getDiagnostics();
	let errorCount = 0;
	let warningCount = 0;

	for (const [uri, diags] of diagnostics) {
		if (uri.fsPath.endsWith(".loot")) {
			for (const diag of diags) {
				if (diag.severity === vscode.DiagnosticSeverity.Error) {
					errorCount++;
				} else if (diag.severity === vscode.DiagnosticSeverity.Warning) {
					warningCount++;
				}
			}
		}
	}

	if (errorCount > 0) {
		statusBarItem.text = `$(error) L8B ${errorCount}`;
		statusBarItem.tooltip = `LootiScript: ${errorCount} error(s), ${warningCount} warning(s)`;
	} else if (warningCount > 0) {
		statusBarItem.text = `$(warning) L8B ${warningCount}`;
		statusBarItem.tooltip = `LootiScript: ${warningCount} warning(s)`;
	} else {
		statusBarItem.text = "$(check) L8B";
		statusBarItem.tooltip = "LootiScript: No problems";
	}
}

function getDocumentationHTML(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>LootiScript API Documentation</title>
	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
			padding: 20px;
			line-height: 1.6;
			max-width: 800px;
			margin: 0 auto;
		}
		h1 { color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
		h2 { color: #333; margin-top: 30px; }
		.api-section { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; }
		code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
		.method { margin: 10px 0; }
		.signature { color: #0066cc; font-weight: bold; }
		.description { color: #666; margin-left: 20px; }
	</style>
</head>
<body>
	<h1>LootiScript API Documentation</h1>
	
	<h2>🎮 Screen API</h2>
	<div class="api-section">
		<div class="method">
			<div class="signature">screen.drawSprite(sprite: string, x: number, y: number, width?: number, height?: number)</div>
			<div class="description">Draw a sprite at the specified position</div>
		</div>
		<div class="method">
			<div class="signature">screen.fillRect(x: number, y: number, width: number, height: number, color: string)</div>
			<div class="description">Fill a rectangle with the specified color</div>
		</div>
		<div class="method">
			<div class="signature">screen.drawText(text: string, x: number, y: number, color?: string, size?: number)</div>
			<div class="description">Draw text at the specified position</div>
		</div>
		<div class="method">
			<div class="signature">screen.clearScreen(color?: string)</div>
			<div class="description">Clear the screen with a color (default: black)</div>
		</div>
		<div class="method">
			<div class="signature">screen.drawCircle(x: number, y: number, radius: number, color: string)</div>
			<div class="description">Draw a circle outline</div>
		</div>
		<div class="method">
			<div class="signature">screen.fillCircle(x: number, y: number, radius: number, color: string)</div>
			<div class="description">Draw a filled circle</div>
		</div>
	</div>

	<h2>🔊 Audio API</h2>
	<div class="api-section">
		<div class="method">
			<div class="signature">audio.playSound(soundName: string, volume?: number, loop?: boolean)</div>
			<div class="description">Play a sound effect</div>
		</div>
		<div class="method">
			<div class="signature">audio.playMusic(musicName: string, volume?: number, loop?: boolean)</div>
			<div class="description">Play background music</div>
		</div>
		<div class="method">
			<div class="signature">audio.stopSound(soundName: string)</div>
			<div class="description">Stop a playing sound</div>
		</div>
		<div class="method">
			<div class="signature">audio.beep(frequency?: number, duration?: number)</div>
			<div class="description">Play a beep sound</div>
		</div>
	</div>

	<h2>🎯 Input API</h2>
	<div class="api-section">
		<div class="method">
			<div class="signature">input.keyboard</div>
			<div class="description">Keyboard input state object</div>
		</div>
		<div class="method">
			<div class="signature">input.mouse</div>
			<div class="description">Mouse input state (x, y, pressed)</div>
		</div>
		<div class="method">
			<div class="signature">input.touch</div>
			<div class="description">Touch input for mobile devices</div>
		</div>
	</div>

	<h2>⚙️ System API</h2>
	<div class="api-section">
		<div class="method">
			<div class="signature">system.time</div>
			<div class="description">Current system time in milliseconds</div>
		</div>
		<div class="method">
			<div class="signature">system.fps</div>
			<div class="description">Current frames per second</div>
		</div>
		<div class="method">
			<div class="signature">system.deltaTime</div>
			<div class="description">Time elapsed since last frame (seconds)</div>
		</div>
	</div>

	<h2>📝 Game Loop Functions</h2>
	<div class="api-section">
		<div class="method">
			<div class="signature">init = function() ... end</div>
			<div class="description">Called once when the game starts</div>
		</div>
		<div class="method">
			<div class="signature">update = function() ... end</div>
			<div class="description">Called every frame for game logic</div>
		</div>
		<div class="method">
			<div class="signature">draw = function() ... end</div>
			<div class="description">Called every frame for rendering</div>
		</div>
	</div>
</body>
</html>`;
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
