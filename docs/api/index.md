# API Reference

Complete API documentation for l8b game engine.

## Core APIs

These APIs are always available in your LootiScript code:

### [Canvas API](/api/core/canvas)
Draw shapes, text, and images on the screen.
```lootiscript
canvas.fillRect(x, y, width, height, "blue")
canvas.drawText("Hello", 10, 30, "20px Arial", "white")
```

### [Input API](/api/core/input)
Handle keyboard and mouse input.
```lootiscript
if (input.isKeyDown("Space")) jump()
let mouseX = input.getMouseX()
```

### [Storage API](/api/core/storage)
Save and load data locally.
```lootiscript
storage.set("highScore", 1000)
let score = storage.get("highScore", 0)
```

---

## Framework APIs

For organizing larger games:

### [Scene API](/api/framework/scene)
Organize your game into scenes (menu, gameplay, game over).
```lootiscript
scene("menu", { init: ..., update: ..., draw: ... })
```

### [Route API](/api/framework/route)
Navigate between scenes.
```lootiscript
route.goto("gameplay")
```

---

## Quick Navigation

**Just getting started?**
- [Getting Started Guide](/guide/getting-started)
- [Core Concepts](/guide/core-concepts)

**Ready to build?**
- [Examples](/examples/)
- [Canvas API](/api/core/canvas) - Drawing
- [Input API](/api/core/input) - Controls
