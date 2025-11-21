# L8B Tooling - Embedded Language Support

This package provides full-featured VS Code tooling for LootiScript with embedded language support.

## Features

### Core Language Features
- ✅ Syntax highlighting
- ✅ Diagnostics (error checking)
- ✅ Autocomplete (IntelliSense)
- ✅ Hover information
- ✅ Go to Definition
- ✅ Find References
- ✅ Document Symbols
- ✅ Rename Symbol
- ✅ Code Formatting
- ✅ Code Actions

### Embedded Language Support

The L8B language server implements **Language Services** approach for embedded languages, similar to how HTML supports CSS and JavaScript.

#### Supported Embedded Languages

1. **JSON Embedded Support**
   - JSON in code blocks: ` ```json ... ``` `
   - JSON in `JSON.parse()` calls: `JSON.parse('{"key": "value"}')`
   - Full JSON language features (validation, completion, hover) within embedded regions

#### How It Works

The language server:
1. Scans documents for embedded language regions
2. Creates virtual documents with non-matching content replaced by whitespace
3. Routes language server requests (completion, hover, validation) to appropriate language services
4. Merges results back into the main document context

### Example Usage

```lootiscript
// JSON in code block
```json
{
  "name": "example",
  "value": 42
}
```

// JSON in function call
data = JSON.parse('{"key": "value"}')
```

When editing inside the JSON regions, you'll get:
- JSON syntax validation
- JSON property completion
- JSON hover information
- JSON document symbols

## Architecture

### Language Services Approach

We use the **Language Services** approach (recommended by VS Code) because:
- ✅ Full control over language server and user experience
- ✅ No dependencies on other language servers
- ✅ Reusable in all LSP-compliant editors
- ✅ Better performance and integration

### Components

1. **Language Server** (`packages/tooling/language-server/`)
   - Core LSP implementation
   - Embedded language region detection
   - Language mode management
   - JSON language service integration

2. **VS Code Extension** (`packages/tooling/vscode/`)
   - Language client
   - Extension manifest
   - Activation and lifecycle management

### File Structure

```
packages/tooling/
├── language-server/
│   ├── src/
│   │   ├── server.ts              # Main LSP server
│   │   └── embedded/
│   │       ├── language-modes.ts  # Language mode interface & regions
│   │       ├── json-mode.ts        # JSON embedded language mode
│   │       └── mode-manager.ts     # Mode management & caching
│   └── package.json
└── vscode/
    ├── src/
    │   └── extension.ts           # VS Code extension entry
    └── package.json
```

## Development

### Building

```bash
# Build language server
cd packages/tooling/language-server
bun run build

# Build VS Code extension
cd packages/tooling/vscode
npm run compile
```

### Testing

1. Open `packages/tooling/vscode` in VS Code
2. Press `F5` to launch Extension Development Host
3. Create a `.loot` file and test embedded JSON features

### Adding New Embedded Languages

To add support for a new embedded language:

1. Create a new mode file (e.g., `src/embedded/css-mode.ts`)
2. Implement `LanguageMode` interface
3. Register the mode in `server.ts`:

```typescript
import { getCSSMode, createCSSLanguageService } from "./embedded/css-mode";

const cssLanguageService = createCSSLanguageService();
languageModes.registerMode(
  getCSSMode(cssLanguageService, documentRegionsCache)
);
```

4. Update `DocumentRegions.scanRegions()` to detect the new language regions

## References

- [VS Code Language Server Extension Guide](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
- [Embedded Programming Languages](https://code.visualstudio.com/api/language-extensions/embedded-languages)
- [Language Server Protocol Specification](https://microsoft.github.io/language-server-protocol/)

