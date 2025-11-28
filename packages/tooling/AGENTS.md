# Tooling Package Patterns

Tooling packages provide IDE support: language server, diagnostics, and VSCode extension.

## API Definitions (packages/tooling/language-server)

Drives autocomplete and documentation:

```typescript
export const apiDefinition = {
  name: "apiName",
  description: "API description",
  methods: [
    {
      name: "methodName",
      parameters: [{ name: "param", type: "string" }],
      returnType: "ReturnType",
      examples: [{ code: "apiName.methodName('value')" }]
    }
  ]
};
```

Location: `src/api-definitions/<api-name>.ts`

## Language Server Protocol

```typescript
// Completion provider
connection.onCompletion((params) => {
  const context = getContext(params);
  return getCompletions(context);
});

// Hover provider
connection.onHover((params) => {
  const symbol = getSymbol(params);
  return { contents: formatDocs(symbol) };
});
```

## Diagnostics (packages/tooling/diagnostics)

```typescript
interface Diagnostic {
  severity: "error" | "warning" | "info";
  message: string;
  line: number;
  column: number;
}

function createDiagnostic(message: string, line: number, column: number) {
  return { severity: "error", message, line, column };
}
```

## VSCode Extension (packages/tooling/vscode)

```typescript
export function activate(context: vscode.ExtensionContext) {
  // Start language client
  const client = new LanguageClient(...);
  client.start();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("l8b.command", handler)
  );
}
```

## Documentation

All API definitions must include:
- Clear descriptions
- Parameter types
- Usage examples
- Return types
