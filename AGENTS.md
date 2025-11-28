# L8b Game Engine - AI Agent Instructions

## Project Overview

L8b (Looti Engine) is a TypeScript-based game engine with a custom scripting language (LootiScript). The project is organized as a monorepo using Bun and Turbo.

## Project Structure

```
l8b/
├── packages/
│   ├── core/          # Core APIs (sprites, screen, audio, input, time, etc.)
│   ├── enggine/       # Runtime engine (VM, I/O, runtime orchestrator)
│   ├── framework/     # CLI, compiler, scene management
│   ├── tooling/       # Language server, diagnostics, VSCode extension
│   └── lootiscript/   # LootiScript parser and language implementation
├── examples/          # Example projects and demos
├── docs/             # VitePress documentation
└── apps/             # Applications
```

## Package Manager

**Always use Bun** as the package manager for this project:
- Installation: `bun install`
- Running scripts: `bun run <script>`
- Adding dependencies: `bun add <package>`

## Code Style & Formatting

This project uses **Biome** for linting and formatting:
- **Indentation**: Tabs (not spaces)
- **Quotes**: Double quotes for JavaScript/TypeScript
- **Format code**: `bun run format`
- **Lint code**: `bun run lint`

## TypeScript Conventions

- Use meaningful variable and function names
- Add JSDoc comments for public APIs and complex logic
- Prefer explicit types over inference for function signatures
- Use `interface` for object shapes, `type` for unions/intersections
- Organize imports: external packages → internal packages → relative imports

## Testing

- Test files: `*.test.ts` or `*.spec.ts`
- Run tests: `bun run test`
- Watch mode: `bun run test:watch`
- Coverage: `bun run test:coverage`
- Use Vitest for all testing

## Monorepo Workflow

The project uses **Turbo** for build orchestration:
- Build all packages: `bun run build`
- Dev mode (all packages): `bun run dev`
- Type checking: `bun run check-types`
- Create new package: `bun run new`

## Build System

- Uses `tsup` for building TypeScript packages
- Configuration: `tsup.config.base.ts` (shared across packages)
- Each package can override with its own `tsup.config.ts`

## Documentation

- Uses VitePress for documentation
- Dev server: `bun run docs:dev`
- Build docs: `bun run docs:build`
- Preview build: `bun run docs:preview`

## LootiScript (.loot files)

- Custom scripting language for the game engine
- Files use `.loot` extension
- Syntax similar to JavaScript but with game-specific features
- Language server provides autocompletion and diagnostics

## Key Principles

1. **Type Safety**: Maintain strict TypeScript types throughout
2. **Documentation**: Keep code well-commented, especially for APIs
3. **Testing**: Write tests for new features and bug fixes
4. **Consistency**: Follow existing patterns in the codebase
5. **Performance**: Consider performance implications, especially for core and engine packages

## Common Tasks

### Adding a New Core API

1. Create new package in `packages/core/<api-name>/`
2. Follow existing structure (src/, tests/, package.json)
3. Add API definition in `tooling/language-server/src/api-definitions/`
4. Update documentation in `docs/`

### Working with the VM

- VM code is in `packages/enggine/vm/`
- Global API bindings are registered in VM context
- See existing services for patterns

### Modifying the Language Server

- Code is in `packages/tooling/language-server/`
- API definitions drive autocompletion
- Update diagnostics in `packages/tooling/diagnostics/`

## Getting Help

- Check existing similar code for patterns
- Review VitePress documentation for API references
- Look at examples in `examples/` directory for usage patterns
