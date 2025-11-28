# Framework Package Patterns

Framework packages provide developer-facing tools: CLI, compiler, and scene management.

## CLI Commands (packages/framework/cli)

Use Commander.js pattern:

```typescript
program
  .command("create <name>")
  .description("Create new project")
  .option("-t, --template <template>", "Template name")
  .action(async (name, options) => {
    // Implementation
  });
```

## Compiler Pipeline (packages/framework/compiler)

```typescript
class Compiler {
  async compile(source: string) {
    const ast = this.parse(source);      // Parse
    this.validate(ast);                   // Validate
    const transformed = this.transform(ast); // Transform
    return this.generate(transformed);    // Generate
  }
}
```

## Error Messages

Provide helpful, actionable errors with context:

```typescript
class CompilerError extends Error {
  constructor(message: string, line: number, column: number) {
    super(message);
    this.line = line;
    this.column = column;
  }

  toString() {
    // Show source context with pointer
  }
}
```

## Scene Management (packages/framework/scene)

```typescript
interface Scene {
  id: string;
  init(): Promise<void>;
  update(deltaTime: number): void;
  render(): void;
  dispose(): void;
}
```

## Developer Experience

Focus on:
- Clear error messages
- Helpful defaults
- Fast compilation
- Good documentation
