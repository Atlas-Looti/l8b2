# Engine Package Patterns

Engine packages handle VM execution, runtime orchestration, and I/O operations.

## VM Global Registration

Core APIs are exposed to LootiScript via VM globals:

```typescript
// In VM initialization
vm.setGlobal("sprite", spriteAPI);
vm.setGlobal("screen", screenAPI);
```

See existing patterns in `packages/enggine/vm/src/`

## Runtime Orchestrator

Manages game loop and lifecycle:

```typescript
class RuntimeOrchestrator {
  async initialize() {
    // 1. Init core systems
    // 2. Setup VM
    // 3. Load scene
    // 4. Start game loop
  }

  private gameLoop(timestamp: number) {
    const deltaTime = timestamp - this.lastTimestamp;
    this.update(deltaTime);
    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}
```

## Performance Critical

- Avoid allocations in game loop
- Use object pooling for frequently created objects
- Profile before optimizing
- Use requestAnimationFrame for rendering

## Error Handling

Wrap VM execution with proper error handling:

```typescript
try {
  await vm.evaluate(script);
} catch (error) {
  console.error("VM error:", error);
  // Provide user-friendly error
}
```
