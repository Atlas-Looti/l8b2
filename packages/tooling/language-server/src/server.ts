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
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Parser } from "@l8b/lootiscript/dist/v1/parser";
import {
	Range,
} from "vscode-languageserver-types";
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
	screen: {
		type: "object",
		description: "Reference to screen interface",
	},
	audio: {
		type: "object",
		description: "Audio interface",
	},
	system: {
		type: "object",
		description: "Runtime system API",
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
	getJSONMode(jsonLanguageService, documentRegionsCache)
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
			},
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

		// Default LootiScript completion
		const state = documentStates.get(uri);
		const items: CompletionItem[] = [];

		// local symbols
		state?.symbols.forEach((symbol) => {
			items.push({
				label: symbol.name,
				kind:
					symbol.type === "function"
						? CompletionItemKind.Function
						: CompletionItemKind.Variable,
				detail: symbol.type,
				data: symbol.name,
			});
		});

		// globals
		for (const [name, info] of Object.entries(GLOBAL_API)) {
			items.push({
				label: name,
				kind: info.type === "function" ? CompletionItemKind.Function : CompletionItemKind.Class,
				detail: info.description,
				documentation: info.signature,
				data: name,
			});
		}

		// keywords
		["function", "return", "local", "global", "if", "then", "else", "end", "while", "for"].forEach(
			(keyword) => {
				items.push({
					label: keyword,
					kind: CompletionItemKind.Keyword,
					data: keyword,
				});
			},
		);

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
		kind: symbol.type === "function" ? SymbolKind.Function : SymbolKind.Variable,
		location: Location.create(symbol.documentUri, symbol.range),
	}));
});

connection.onWorkspaceSymbol(() => {
	const infos: SymbolInformation[] = [];
	for (const state of documentStates.values()) {
		state.symbols.forEach((symbol) => {
			infos.push({
				name: symbol.name,
				kind: symbol.type === "function" ? SymbolKind.Function : SymbolKind.Variable,
				location: Location.create(symbol.documentUri, symbol.range),
			});
		});
	}
	return infos;
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
		if (/(then|do|function|repeat)\b.*$/.test(trimmed) && !trimmed.includes("end")) {
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
	return params.context.diagnostics.map((diagnostic) => ({
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
	}));
});

function getWordAtPosition(document: TextDocument, position: Position): string | null {
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

function findSymbolByName(state: DocumentState, name: string): SymbolInfo | undefined {
	return state.symbols.find((sym) => sym.name === name);
}


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();

