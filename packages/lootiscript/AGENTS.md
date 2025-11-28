# LootiScript Package Patterns

LootiScript is the custom scripting language for l8b game engine.

## Parser Structure

```typescript
interface ASTNode {
  type: string;
  line: number;
  column: number;
}

class Parser {
  private tokens: Token[];
  private current = 0;

  parse(): Program {
    const statements = [];
    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }
    return { type: "Program", body: statements };
  }
}
```

## .loot File Conventions

### Naming
- **Constants**: `UPPER_SNAKE_CASE`
- **Variables**: `camelCase`
- **Functions**: `camelCase`

### Structure
```lootiscript
// Constants
const PLAYER_SPEED = 5;

// Variables
let player = null;
let score = 0;

// Initialization
function init() {
  // Setup
}

// Update loop
function update(dt) {
  // Game logic
}

// Render loop
function render() {
  // Drawing
}
```

## Error Messages

Provide helpful errors with context:

```typescript
class LootiScriptError extends Error {
  constructor(message: string, line: number, column: number) {
    super(message);
    this.line = line;
    this.column = column;
  }

  format(source: string): string {
    // Show source line with pointer
    const errorLine = source.split("\n")[this.line - 1];
    const pointer = " ".repeat(this.column - 1) + "^";
    return `${errorLine}\n${pointer}`;
  }
}
```

## Testing

```typescript
describe("Parser", () => {
  it("should parse declarations", () => {
    const ast = parse("let x = 10;");
    expect(ast.body[0].type).toBe("VariableDeclaration");
  });
});
```
