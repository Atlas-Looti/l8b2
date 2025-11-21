import * as path from "path";
import {
	workspace,
	ExtensionContext,
	window,
	StatusBarAlignment,
	commands,
} from "vscode";
import { exec } from "child_process";

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 100);
	statusBar.text = "$(tools) L8B LSP: Starting";
	statusBar.show();
	context.subscriptions.push(statusBar);

	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join("..", "language-server", "dist", "server.js"),
	);

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		},
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: "file", language: "lootiscript" }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
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
	client.start();

	client.onReady().then(() => {
		statusBar.text = "$(check) L8B LSP: Ready";
	});

	const buildCommand = commands.registerCommand("lootiscript.runBuild", () => {
		const folder = workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!folder) {
			window.showWarningMessage("No workspace folder open.");
			return;
		}
		statusBar.text = "$(sync~spin) L8B: Building...";
		exec("l8b build", { cwd: folder }, (error, stdout, stderr) => {
			if (error) {
				window.showErrorMessage(`Build failed: ${stderr || error.message}`);
				statusBar.text = "$(error) L8B: Build Failed";
				return;
			}
			window.showInformationMessage("L8B build completed.");
			statusBar.text = "$(check) L8B: Build Success";
			console.log(stdout);
		});
	});

	context.subscriptions.push(buildCommand);
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

