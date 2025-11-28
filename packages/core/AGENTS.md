# Core Package Patterns

Core packages provide fundamental game engine APIs (sprites, screen, audio, input, time, map, palette, scene, assets).

## Service Pattern

All core services follow this pattern:

```typescript
export class MyService {
  private static instance: MyService | null = null;

  static getInstance(): MyService {
    if (!this.instance) {
      this.instance = new MyService();
    }
    return this.instance;
  }

  dispose(): void {
    // Clean up resources
  }
}
```

## Package Structure

```
packages/core/<name>/
├── src/
│   ├── index.ts      # Main exports
│   ├── <name>.ts     # Implementation
│   └── types.ts      # Type definitions
├── tests/
│   └── <name>.test.ts
└── package.json
```

## API Exposure

New core APIs must be:
1. Implemented in the package
2. Added to `tooling/language-server/src/api-definitions/` for autocomplete
3. Registered in VM globals (see `packages/enggine/vm/`)

## Testing

Use Vitest with this pattern:

```typescript
describe("ServiceName", () => {
  let service: ServiceName;

  beforeEach(() => {
    service = ServiceName.getInstance();
  });

  afterEach(() => {
    service.dispose();
  });

  it("should do something", () => {
    // Test
  });
});
```
