import {
	TextDocument,
	Position,
	CompletionList,
	CompletionItem,
	Hover,
	Diagnostic,
	DocumentSymbol,
} from "vscode-languageserver/node";
import {
	JSONLanguageService,
	getLanguageService,
} from "vscode-json-languageservice";
import { LanguageMode } from "./language-modes";
import { DocumentRegionsCache } from "./mode-manager";

/**
 * JSON language mode for embedded JSON support
 */
export function getJSONMode(
	jsonLanguageService: JSONLanguageService,
	documentRegionsCache: DocumentRegionsCache,
): LanguageMode {
	return {
		getId() {
			return "json";
		},

		doComplete(
			document: TextDocument,
			position: Position,
		): CompletionList | null {
			// Get virtual JSON document with all non-JSON content replaced with whitespace
			const documentRegions = documentRegionsCache.get(document);
			const embedded = documentRegions.getEmbeddedDocument("json");

			// Parse JSON document
			const jsonDocument = jsonLanguageService.parseJSONDocument(embedded);

			// Get completions
			const completions = jsonLanguageService.doComplete(
				embedded,
				position,
				jsonDocument,
			);

			return completions;
		},

		doHover(document: TextDocument, position: Position): Hover | null {
			const documentRegions = documentRegionsCache.get(document);
			const embedded = documentRegions.getEmbeddedDocument("json");
			const jsonDocument = jsonLanguageService.parseJSONDocument(embedded);

			return jsonLanguageService.doHover(embedded, position, jsonDocument);
		},

		doValidation(document: TextDocument): Diagnostic[] {
			const documentRegions = documentRegionsCache.get(document);
			const embedded = documentRegions.getEmbeddedDocument("json");
			const jsonDocument = jsonLanguageService.parseJSONDocument(embedded);

			return jsonLanguageService.doValidation(embedded, jsonDocument, {
				schemaValidation: "error",
				commentValidation: "warning",
			});
		},

		findDocumentSymbols(document: TextDocument): DocumentSymbol[] {
			const documentRegions = documentRegionsCache.get(document);
			const embedded = documentRegions.getEmbeddedDocument("json");
			const jsonDocument = jsonLanguageService.parseJSONDocument(embedded);

			return jsonLanguageService.findDocumentSymbols(embedded, jsonDocument);
		},
	};
}

/**
 * Create JSON language service instance
 */
export function createJSONLanguageService(): JSONLanguageService {
	return getLanguageService({
		schemaRequestService: {
			async requestSchema(uri: string): Promise<string> {
				// Return empty schema for now
				// Can be extended to load schemas from URLs
				return "";
			},
		},
		workspaceContext: {
			resolveRelativePath: (relativePath: string, resource: string) => {
				// Simple path resolution
				const base = resource.substring(0, resource.lastIndexOf("/"));
				return base + "/" + relativePath;
			},
		},
	});
}
