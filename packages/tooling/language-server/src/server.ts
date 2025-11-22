import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	CompletionList,
	TextDocumentSyncKind,
	InitializeResult,
	Diagnostic,
	DiagnosticSeverity,
	Position,
	Location,
	DocumentSymbolParams,
	SymbolInformation,
	SymbolKind,
	Hover,
	DefinitionParams,
	RenameParams,
	TextEdit,
	DocumentFormattingParams,
	CodeActionParams,
	CodeAction,
	CodeActionKind,
	WorkspaceEdit,
	SignatureHelp,
	SignatureInformation,
	ParameterInformation,
	InsertTextFormat,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Parser } from "@l8b/lootiscript/dist/v1/parser";
import { Range } from "vscode-languageserver-types";
import { LanguageModes, DocumentRegionsCache } from "./embedded/mode-manager";
import { getJSONMode, createJSONLanguageService } from "./embedded/json-mode";

// Simple AST node interface
interface ASTNode {
	type: string;
	name?: string;
	line: number;
	column: number;
	endLine?: number;
	endColumn?: number;
	children?: ASTNode[];
	scope?: Scope;
}

interface Scope {
	parent?: Scope;
	symbols: Map<string, SymbolInfo>;
}

interface SymbolInfo {
	name: string;
	type: "function" | "variable" | "argument" | "global";
	range: Range;
	documentUri: string;
}

// Document state storage
interface DocumentState {
	textDocument: TextDocument;
	ast: ASTNode | null;
	scope: Scope | null;
	symbols: SymbolInfo[];
}

const documentStates: Map<string, DocumentState> = new Map();

// Global API list for suggestions and hover info
const GLOBAL_API: Record<
	string,
	{
		type: string;
		description: string;
		signature?: string;
		properties?: Record<
			string,
			{ type: string; description: string; signature?: string }
		>;
	}
> = {
	print: {
		type: "function",
		description: "Prints text to the debug console",
		signature: "print(text: any)",
	},
	List: {
		type: "module",
		description: "Standard library for array manipulation",
	},
	Math: {
		type: "module",
		description: "Math utilities (sin, cos, sqrt, ...)",
	},
	// Screen API
	screen: {
		type: "object",
		description: "Screen drawing and display interface",
		properties: {
			width: {
				type: "property",
				description: "Screen width in pixels",
			},
			height: {
				type: "property",
				description: "Screen height in pixels",
			},
			drawSprite: {
				type: "method",
				description: "Draw a sprite at the specified position",
				signature:
					"screen.drawSprite(sprite: string, x: number, y: number, width?: number, height?: number)",
			},
			fillRect: {
				type: "method",
				description: "Fill a rectangle with the current color",
				signature:
					"screen.fillRect(x: number, y: number, width: number, height: number, color: string)",
			},
			drawRect: {
				type: "method",
				description: "Draw a rectangle outline",
				signature:
					"screen.drawRect(x: number, y: number, width: number, height: number, color: string)",
			},
			drawText: {
				type: "method",
				description: "Draw text at the specified position",
				signature:
					"screen.drawText(text: string, x: number, y: number, color?: string, size?: number)",
			},
			clearScreen: {
				type: "method",
				description: "Clear the screen with a color",
				signature: "screen.clearScreen(color?: string)",
			},
			drawCircle: {
				type: "method",
				description: "Draw a circle",
				signature:
					"screen.drawCircle(x: number, y: number, radius: number, color: string)",
			},
			fillCircle: {
				type: "method",
				description: "Fill a circle",
				signature:
					"screen.fillCircle(x: number, y: number, radius: number, color: string)",
			},
			drawLine: {
				type: "method",
				description: "Draw a line between two points",
				signature:
					"screen.drawLine(x1: number, y1: number, x2: number, y2: number, color: string)",
			},
		},
	},
	// Audio API
	audio: {
		type: "object",
		description: "Audio playback and sound interface",
		properties: {
			beep: {
				type: "method",
				description: "Play a beep sound",
				signature: "audio.beep(frequency?: number, duration?: number)",
			},
			playSound: {
				type: "method",
				description: "Play a sound file",
				signature:
					"audio.playSound(soundName: string, volume?: number, loop?: boolean)",
			},
			stopSound: {
				type: "method",
				description: "Stop a playing sound",
				signature: "audio.stopSound(soundName: string)",
			},
			setVolume: {
				type: "method",
				description: "Set the master volume",
				signature: "audio.setVolume(volume: number)",
			},
			playMusic: {
				type: "method",
				description: "Play background music",
				signature:
					"audio.playMusic(musicName: string, volume?: number, loop?: boolean)",
			},
			stopMusic: {
				type: "method",
				description: "Stop background music",
				signature: "audio.stopMusic()",
			},
		},
	},
	// Input API
	input: {
		type: "object",
		description: "User input interface (keyboard, mouse, touch, gamepad)",
		properties: {
			keyboard: {
				type: "property",
				description: "Keyboard input state object",
			},
			mouse: {
				type: "property",
				description:
					"Mouse input state object with x, y, and button properties",
			},
			touch: {
				type: "property",
				description: "Touch input state for mobile devices",
			},
			gamepad: {
				type: "property",
				description: "Gamepad input state",
			},
		},
	},
	// System API
	system: {
		type: "object",
		description: "Runtime system utilities and information",
		properties: {
			time: {
				type: "property",
				description: "Current system time in milliseconds",
			},
			fps: {
				type: "property",
				description: "Current frames per second",
			},
			deltaTime: {
				type: "property",
				description: "Time elapsed since last frame in seconds",
			},
			platform: {
				type: "property",
				description: "Current platform (web, mobile, etc.)",
			},
		},
	},
};

// Create a connection for the server
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Setup embedded language support
const documentRegionsCache = new DocumentRegionsCache();
const languageModes = new LanguageModes(documentRegionsCache);

// Register JSON mode for embedded JSON support
const jsonLanguageService = createJSONLanguageService();
languageModes.registerMode(
	getJSONMode(jsonLanguageService, documentRegionsCache),
);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: ["."],
			},
			signatureHelpProvider: {
				triggerCharacters: ["(", ","],
			},
			referencesProvider: true,
		},
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true,
			},
		};
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined,
		);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders((_event) => {
			connection.console.log("Workspace folder change event received.");
		});
	}
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
	updateDocumentState(change.document);
	validateTextDocument(change.document);
});

documents.onDidOpen((change) => {
	updateDocumentState(change.document);
	validateTextDocument(change.document);
});

documents.onDidClose((change) => {
	documentStates.delete(change.document.uri);
	connection.sendDiagnostics({ uri: change.document.uri, diagnostics: [] });
});

function updateDocumentState(textDocument: TextDocument) {
	const text = textDocument.getText();
	const state: DocumentState = {
		textDocument,
		ast: null,
		scope: null,
		symbols: [],
	};

	try {
		const parser = new Parser(text, textDocument.uri);
		parser.parse();

		const ast = convertParserAst(parser);
		const scope = buildScope(ast);
		const symbols = collectSymbols(ast, textDocument.uri);

		state.ast = ast;
		state.scope = scope;
		state.symbols = symbols;
	} catch (err) {
		connection.console.error(`AST build failed: ${err}`);
	}

	documentStates.set(textDocument.uri, state);
}

function convertParserAst(parser: any): ASTNode | null {
	const root = {
		type: "root",
		line: 1,
		column: 0,
		children: [],
		scope: {
			symbols: new Map(),
		},
	} as ASTNode;

	const statements = parser.program?.statements || [];
	for (const stmt of statements) {
		root.children?.push(convertNode(stmt));
	}

	return root;
}

function convertNode(node: any): ASTNode {
	const base: ASTNode = {
		type: node.constructor?.name || "Unknown",
		line: node?.token?.line || 1,
		column: node?.token?.column || 0,
		endLine: node?.token?.line || 1,
		endColumn: node?.token?.column || 0,
		children: [],
	};

	if (node.identifier) {
		base.name = node.identifier;
	}

	if (node.sequence) {
		for (const child of node.sequence) {
			base.children?.push(convertNode(child));
		}
	}

	if (node.body) {
		for (const child of node.body) {
			base.children?.push(convertNode(child));
		}
	}

	if (node.expression) {
		base.children?.push(convertNode(node.expression));
	}

	if (node.statements) {
		for (const child of node.statements) {
			base.children?.push(convertNode(child));
		}
	}

	if (node.function_body) {
		for (const child of node.function_body) {
			base.children?.push(convertNode(child));
		}
	}

	return base;
}

function buildScope(ast: ASTNode | null, parent?: Scope): Scope | null {
	if (!ast) return null;

	const scope: Scope = {
		parent,
		symbols: new Map(),
	};

	if (ast.children) {
		for (const child of ast.children) {
			buildScope(child, scope);
		}
	}

	ast.scope = scope;
	return scope;
}

function collectSymbols(ast: ASTNode | null, uri: string): SymbolInfo[] {
	if (!ast) return [];
	const symbols: SymbolInfo[] = [];

	function visit(node: ASTNode) {
		if (node.type === "Function" && node.name) {
			const symbol: SymbolInfo = {
				name: node.name,
				type: "function",
				documentUri: uri,
				range: buildRange(node),
			};
			symbols.push(symbol);
			node.scope?.symbols.set(node.name, symbol);
		} else if (node.type === "Assignment" && node.name) {
			const symbol: SymbolInfo = {
				name: node.name,
				type: "variable",
				documentUri: uri,
				range: buildRange(node),
			};
			symbols.push(symbol);
			node.scope?.symbols.set(node.name, symbol);
		}

		if (node.children) {
			for (const child of node.children) {
				visit(child);
			}
		}
	}

	visit(ast);
	return symbols;
}

function buildRange(node: ASTNode): Range {
	return Range.create(
		Position.create(Math.max(node.line - 1, 0), Math.max(node.column, 0)),
		Position.create(
			Math.max((node.endLine || node.line) - 1, 0),
			Math.max(node.endColumn || node.column + (node.name?.length || 1), 0),
		),
	);
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	const text = textDocument.getText();
	const diagnostics: Diagnostic[] = [];

	// Validate embedded languages
	const allModes = languageModes.getAllModes();
	for (const mode of allModes) {
		if (mode.doValidation) {
			const embeddedDiagnostics = mode.doValidation(textDocument);
			diagnostics.push(...embeddedDiagnostics);
		}
	}

	// Validate LootiScript
	try {
		const parser = new Parser(text, textDocument.uri);
		parser.parse();

		if ((parser as any).error_info) {
			const err = (parser as any).error_info;
			const diagnostic: Diagnostic = {
				severity: DiagnosticSeverity.Error,
				range: {
					start: { line: err.line - 1, character: err.column },
					end: { line: err.line - 1, character: err.column + 10 },
				},
				message: err.error || "Syntax Error",
				source: "lootiscript",
			};
			diagnostics.push(diagnostic);
		}
	} catch (e: any) {
		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: {
				start: { line: 0, character: 0 },
				end: { line: 0, character: 10 },
			},
			message: e.message || "Unknown parser error",
			source: "lootiscript",
		};
		diagnostics.push(diagnostic);
	}

	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles((_change) => {
	// Monitored files have change in VSCode
	connection.console.log("We received an file change event");
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	async (params: any): Promise<CompletionItem[] | CompletionList | null> => {
		const uri = params.textDocument.uri;
		const document = documents.get(uri);
		if (!document) {
			return null;
		}

		const position = params.position;

		// Check if we're in an embedded language region
		const mode = languageModes.getModeAtPosition(document, position);
		if (mode && mode.doComplete) {
			const result = mode.doComplete(document, position);
			if (result) {
				return result;
			}
		}

		// Detect completion context
		const context = detectCompletionContext(document, position);

		// Property access completion (e.g., screen.drawSprite)
		if (context.type === "property" && context.object) {
			return getPropertyCompletions(context.object);
		}

		// Default LootiScript completion
		const state = documentStates.get(uri);
		const items: CompletionItem[] = [];

		// Add code snippets (high priority)
		items.push(...getSnippetCompletions());

		// local symbols (high priority)
		state?.symbols.forEach((symbol) => {
			items.push({
				label: symbol.name,
				kind:
					symbol.type === "function"
						? CompletionItemKind.Function
						: CompletionItemKind.Variable,
				detail: symbol.type,
				data: symbol.name,
				sortText: `0_${symbol.name}`, // Priority: local symbols
			});
		});

		// globals (medium priority)
		for (const [name, info] of Object.entries(GLOBAL_API)) {
			items.push({
				label: name,
				kind:
					info.type === "function"
						? CompletionItemKind.Function
						: CompletionItemKind.Class,
				detail: info.description,
				documentation: info.signature,
				data: name,
				sortText: `1_${name}`, // Priority: globals
			});
		}

		// keywords (lower priority)
		[
			"function",
			"return",
			"local",
			"global",
			"if",
			"then",
			"else",
			"end",
			"while",
			"for",
		].forEach((keyword) => {
			items.push({
				label: keyword,
				kind: CompletionItemKind.Keyword,
				data: keyword,
				sortText: `2_${keyword}`, // Priority: keywords
			});
		});

		return items;
	},
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	const info = GLOBAL_API[item.data as string];
	if (info) {
		item.detail = info.signature || info.type;
		item.documentation = info.description;
	}
	return item;
});

// Signature help provides parameter information when typing function calls
connection.onSignatureHelp((params): SignatureHelp | null => {
	const document = documents.get(params.textDocument.uri);
	if (!document) return null;

	const line = document.getText({
		start: Position.create(params.position.line, 0),
		end: Position.create(params.position.line, params.position.character),
	});

	// Extract function name from the line
	const functionMatch = line.match(/([A-Za-z_][A-Za-z0-9_.]*)\s*\([^)]*$/);
	if (!functionMatch) return null;

	const functionName = functionMatch[1];

	// Check if it's a method call (e.g., screen.drawSprite)
	const parts = functionName.split(".");
	let signature: string | undefined;
	let description: string | undefined;

	if (parts.length === 2) {
		// Property method call
		const [objectName, methodName] = parts;
		const api = GLOBAL_API[objectName];
		if (api && api.properties && api.properties[methodName]) {
			signature = api.properties[methodName].signature;
			description = api.properties[methodName].description;
		}
	} else {
		// Global function call
		const api = GLOBAL_API[functionName];
		if (api) {
			signature = api.signature;
			description = api.description;
		}
	}

	if (!signature) return null;

	// Parse signature to extract parameters
	const paramMatch = signature.match(/\(([^)]*)\)/);
	const paramsStr = paramMatch ? paramMatch[1] : "";
	const parameters: ParameterInformation[] = paramsStr
		.split(",")
		.filter((p) => p.trim())
		.map((param) => ({
			label: param.trim(),
		}));

	// Count commas to determine active parameter
	const commaCount = (line.match(/,/g) || []).length;
	const activeParameter = Math.min(commaCount, parameters.length - 1);

	return {
		signatures: [
			SignatureInformation.create(signature, description, ...parameters),
		],
		activeSignature: 0,
		activeParameter: activeParameter >= 0 ? activeParameter : 0,
	};
});

connection.onHover((params): Hover | null => {
	const document = documents.get(params.textDocument.uri);
	if (!document) return null;

	// Check if we're in an embedded language region
	const mode = languageModes.getModeAtPosition(document, params.position);
	if (mode && mode.doHover) {
		const result = mode.doHover(document, params.position);
		if (result) {
			return result;
		}
	}

	// Default LootiScript hover
	const state = documentStates.get(params.textDocument.uri);
	if (!state) return null;
	const word = getWordAtPosition(state.textDocument, params.position);
	if (!word) return null;

	const symbol = findSymbolByName(state, word);
	if (symbol) {
		return {
			contents: {
				kind: "markdown",
				value: `**${symbol.name}** (${symbol.type})`,
			},
		};
	}

	const globalInfo = GLOBAL_API[word];
	if (globalInfo) {
		return {
			contents: {
				kind: "markdown",
				value: `**${word}** - ${globalInfo.description}\n\n${globalInfo.signature || ""}`,
			},
		};
	}

	return null;
});

connection.onDefinition((params: DefinitionParams) => {
	const state = documentStates.get(params.textDocument.uri);
	if (!state) return [];
	const word = getWordAtPosition(state.textDocument, params.position);
	if (!word) return [];
	const symbol = findSymbolByName(state, word);
	if (!symbol) return [];
	return Location.create(symbol.documentUri, symbol.range);
});

connection.onDocumentSymbol((params: DocumentSymbolParams) => {
	const state = documentStates.get(params.textDocument.uri);
	if (!state) return [];
	return state.symbols.map((symbol) => ({
		name: symbol.name,
		kind:
			symbol.type === "function" ? SymbolKind.Function : SymbolKind.Variable,
		location: Location.create(symbol.documentUri, symbol.range),
	}));
});

connection.onWorkspaceSymbol(() => {
	const infos: SymbolInformation[] = [];
	for (const state of documentStates.values()) {
		state.symbols.forEach((symbol) => {
			infos.push({
				name: symbol.name,
				kind:
					symbol.type === "function"
						? SymbolKind.Function
						: SymbolKind.Variable,
				location: Location.create(symbol.documentUri, symbol.range),
			});
		});
	}
	return infos;
});

// Find all references to a symbol across the workspace
connection.onReferences((params) => {
	const state = documentStates.get(params.textDocument.uri);
	if (!state) return [];

	const word = getWordAtPosition(state.textDocument, params.position);
	if (!word) return [];

	const references: Location[] = [];

	// Search across all open documents in the workspace
	for (const [uri, docState] of documentStates) {
		const text = docState.textDocument.getText();
		const regex = new RegExp(`\\b${word}\\b`, "g");
		let match;

		while ((match = regex.exec(text))) {
			const start = docState.textDocument.positionAt(match.index);
			const end = docState.textDocument.positionAt(match.index + word.length);
			references.push(
				Location.create(uri, {
					start,
					end,
				}),
			);
		}
	}

	return references;
});

connection.onRenameRequest((params: RenameParams): WorkspaceEdit | null => {
	const state = documentStates.get(params.textDocument.uri);
	if (!state) return null;
	const word = getWordAtPosition(state.textDocument, params.position);
	if (!word) return null;
	const edits: TextEdit[] = [];
	const text = state.textDocument.getText();
	const regex = new RegExp(`\\b${word}\\b`, "g");
	let match;
	while ((match = regex.exec(text))) {
		const start = state.textDocument.positionAt(match.index);
		const end = state.textDocument.positionAt(match.index + word.length);
		edits.push({
			range: { start, end },
			newText: params.newName,
		});
	}
	return {
		changes: {
			[params.textDocument.uri]: edits,
		},
	};
});

connection.onDocumentFormatting((params: DocumentFormattingParams) => {
	const doc = documents.get(params.textDocument.uri);
	if (!doc) return [];
	const text = doc.getText();
	const lines = text.split(/\r?\n/);
	let indent = 0;
	const formatted = lines.map((line) => {
		let trimmed = line.trim();
		if (/^(end|else|elseif)/.test(trimmed)) {
			indent = Math.max(indent - 1, 0);
		}
		const formattedLine = `${"\t".repeat(indent)}${trimmed}`;
		if (
			/(then|do|function|repeat)\b.*$/.test(trimmed) &&
			!trimmed.includes("end")
		) {
			indent++;
		}
		return formattedLine;
	});
	const fullRange = Range.create(
		Position.create(0, 0),
		doc.positionAt(text.length),
	);
	return [TextEdit.replace(fullRange, formatted.join("\n"))];
});

connection.onCodeAction((params: CodeActionParams): CodeAction[] => {
	const actions: CodeAction[] = [];

	for (const diagnostic of params.context.diagnostics) {
		const message = diagnostic.message.toLowerCase();

		// Quick fix: Missing 'end' keyword
		if (message.includes("end") || message.includes("expected")) {
			actions.push({
				title: "Insert 'end'",
				kind: CodeActionKind.QuickFix,
				edit: {
					changes: {
						[params.textDocument.uri]: [
							TextEdit.insert(
								Position.create(diagnostic.range.end.line + 1, 0),
								"end\n",
							),
						],
					},
				},
				diagnostics: [diagnostic],
			});
		}

		// Quick fix: Undefined variable - suggest declaration
		if (message.includes("undefined") || message.includes("not defined")) {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				const word = getWordAtPosition(document, diagnostic.range.start);
				if (word) {
					actions.push({
						title: `Declare variable '${word}'`,
						kind: CodeActionKind.QuickFix,
						edit: {
							changes: {
								[params.textDocument.uri]: [
									TextEdit.insert(
										Position.create(diagnostic.range.start.line, 0),
										`local ${word} = nil\n`,
									),
								],
							},
						},
						diagnostics: [diagnostic],
					});
				}
			}
		}
	}

	// Refactor action: Extract to function (if there's a selection)
	if (
		params.range &&
		(params.range.start.line !== params.range.end.line ||
			params.range.start.character !== params.range.end.character)
	) {
		const document = documents.get(params.textDocument.uri);
		if (document) {
			const selectedText = document.getText(params.range);
			if (selectedText.trim()) {
				actions.push({
					title: "Extract to function",
					kind: CodeActionKind.RefactorExtract,
					edit: {
						changes: {
							[params.textDocument.uri]: [
								// Replace selection with function call
								TextEdit.replace(params.range, "extracted_function()"),
								// Insert function definition at end
								TextEdit.insert(
									Position.create(document.lineCount, 0),
									`\n\nextracted_function = function()\n\t${selectedText.replace(/\n/g, "\n\t")}\nend\n`,
								),
							],
						},
					},
				});
			}
		}
	}

	return actions;
});

function getWordAtPosition(
	document: TextDocument,
	position: Position,
): string | null {
	const line = document.getText({
		start: Position.create(position.line, 0),
		end: Position.create(position.line, Number.MAX_SAFE_INTEGER),
	});
	const regex = /[A-Za-z_][A-Za-z0-9_]*/g;
	let match: RegExpExecArray | null;
	while ((match = regex.exec(line))) {
		const start = match.index;
		const end = start + match[0].length;
		if (position.character >= start && position.character <= end) {
			return match[0];
		}
	}
	return null;
}

/**
 * Detect completion context (property access, function call, etc.)
 */
interface CompletionContext {
	type: "property" | "function_call" | "default";
	object?: string;
	inFunctionCall?: boolean;
}

function detectCompletionContext(
	document: TextDocument,
	position: Position,
): CompletionContext {
	const line = document.getText({
		start: Position.create(position.line, 0),
		end: Position.create(position.line, position.character),
	});

	// Check for property access (e.g., "screen.")
	const propertyMatch = line.match(/([A-Za-z_][A-Za-z0-9_]*)\.\s*$/);
	if (propertyMatch) {
		return {
			type: "property",
			object: propertyMatch[1],
		};
	}

	// Check if we're in a function call
	const openParenCount = (line.match(/\(/g) || []).length;
	const closeParenCount = (line.match(/\)/g) || []).length;
	if (openParenCount > closeParenCount) {
		return {
			type: "function_call",
			inFunctionCall: true,
		};
	}

	return { type: "default" };
}

/**
 * Get property completions for an object
 */
function getPropertyCompletions(objectName: string): CompletionItem[] {
	const api = GLOBAL_API[objectName];
	const items: CompletionItem[] = [];

	if (api && api.properties) {
		for (const [propName, propInfo] of Object.entries(api.properties)) {
			items.push({
				label: propName,
				kind:
					propInfo.type === "method"
						? CompletionItemKind.Method
						: CompletionItemKind.Property,
				detail: propInfo.description,
				documentation: propInfo.signature,
				insertText: propInfo.type === "method" ? `${propName}($0)` : propName,
				insertTextFormat:
					propInfo.type === "method"
						? InsertTextFormat.Snippet
						: InsertTextFormat.PlainText,
			});
		}
	}

	return items;
}

/**
 * Get code snippet completions
 */
function getSnippetCompletions(): CompletionItem[] {
	return [
		{
			label: "func",
			kind: CompletionItemKind.Snippet,
			detail: "Function definition",
			insertText: "${1:name} = function(${2:args})\n\t${3:// body}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "Creates a new function",
		},
		{
			label: "update",
			kind: CompletionItemKind.Snippet,
			detail: "Update loop function",
			insertText: "update = function()\n\t${1:// update logic}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "Game update loop function",
		},
		{
			label: "draw",
			kind: CompletionItemKind.Snippet,
			detail: "Draw loop function",
			insertText: "draw = function()\n\t${1:// draw logic}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "Game draw loop function",
		},
		{
			label: "if",
			kind: CompletionItemKind.Snippet,
			detail: "If statement",
			insertText: "if ${1:condition} then\n\t${2:// code}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "If conditional statement",
		},
		{
			label: "ifelse",
			kind: CompletionItemKind.Snippet,
			detail: "If-else statement",
			insertText:
				"if ${1:condition} then\n\t${2:// true}\nelse\n\t${3:// false}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "If-else conditional statement",
		},
		{
			label: "for",
			kind: CompletionItemKind.Snippet,
			detail: "For loop",
			insertText: "for ${1:i} in ${2:list} do\n\t${3:// code}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "For loop iteration",
		},
		{
			label: "while",
			kind: CompletionItemKind.Snippet,
			detail: "While loop",
			insertText: "while ${1:condition} do\n\t${2:// code}\nend",
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: "While loop",
		},
	];
}

function findSymbolByName(
	state: DocumentState,
	name: string,
): SymbolInfo | undefined {
	return state.symbols.find((sym) => sym.name === name);
}

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
