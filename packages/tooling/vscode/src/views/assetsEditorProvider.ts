import * as vscode from 'vscode';

export class AssetsServerManager {
    private _serverPort = 54321;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly _context: vscode.ExtensionContext
    ) { }

    public async openEditor() {
        const url = `http://localhost:${this._serverPort}`;

        // Check if server is running by trying to fetch
        const isRunning = await this.checkServerRunning();

        if (!isRunning) {
            const action = await vscode.window.showWarningMessage(
                'Assets Editor server is not running. Please run "bun dev" in the assets folder first.',
                'Open Terminal',
                'Open Anyway'
            );

            if (action === 'Open Terminal') {
                const terminal = vscode.window.createTerminal('L8B Assets Editor');
                terminal.show();
                terminal.sendText('cd packages/tooling/assets');
                terminal.sendText('bun dev');

                vscode.window.showInformationMessage(
                    'Terminal opened. After the server starts (shows "Ready"), click "Open Assets Editor" again.'
                );
                return;
            } else if (action !== 'Open Anyway') {
                return;
            }
        }

        vscode.env.openExternal(vscode.Uri.parse(url));
    }

    private async checkServerRunning(): Promise<boolean> {
        try {
            // Try to fetch from the server
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);

            const response = await fetch(`http://localhost:${this._serverPort}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    public dispose() {
        // Nothing to dispose
    }
}
