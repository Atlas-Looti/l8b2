# Getting Started

Welcome to **l8b**, the web-based game engine powered by LootiScript!

## What You'll Build

With l8b, you can create web-based games that run directly in the browser. No complex setup, no native dependencies - just write your game logic in LootiScript and see it come to life.

## Prerequisites

- **Node.js** >= 18
- **npm**, **yarn**, or **bun**
- A code editor (VS Code recommended for LootiScript support)
- Basic understanding of programming and game loops

## Installation

### Create a New Project

```bash
# Create a new directory for your game
mkdir my-game
cd my-game

# Initialize npm project
npm init -y

# Install l8b
npm install l8b
```

### Project Setup

Create the following structure:

```
my-game/
├── package.json
├── index.html
└── game.loot
```

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My l8b Game</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; }
    canvas { border: 1px solid #333; }
  </style>
</head>
<body>
  <script type="module">
    import { createGame } from 'l8b';
    
    // Load and run your game
    createGame({
      script: './game.loot',
      width: 800,
      height: 600
    });
  </script>
</body>
</html>
```

## Your First Game

Create `game.loot` with this simple example:

```lootiscript
// Player position
let x = 400
let y = 300
let speed = 5

// Game loop - called every frame
function update() {
  // Move player with arrow keys
  if (input.isKeyDown("ArrowRight")) {
    x = x + speed
  }
  if (input.isKeyDown("ArrowLeft")) {
    x = x - speed
  }
  if (input.isKeyDown("ArrowUp")) {
    y = y - speed
  }
  if (input.isKeyDown("ArrowDown")) {
    y = y + speed
  }
}

// Render - called every frame after update
function draw() {
  // Clear screen with black
  canvas.clear("black")
  
  // Draw player as a blue square
  canvas.fillRect(x - 16, y - 16, 32, 32, "cyan")
  
  // Draw instructions
  canvas.drawText("Use arrow keys to move", 10, 30, "16px Arial", "white")
}
```

## Run Your Game

Start a local development server:

```bash
# Using Python
python -m http.server 8000

# Or using npx
npx serve

# Or using Node.js http-server
npx http-server
```

Open your browser to `http://localhost:8000` and you should see your game running!

## Development Workflow

1. **Write** - Edit your `.loot` files
2. **Refresh** - Reload the browser to see changes
3. **Debug** - Use browser DevTools (F12) to inspect and debug
4. **Iterate** - Make changes and repeat

## VS Code Setup (Optional)

For the best development experience, install the LootiScript extension:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "LootiScript"
4. Install the extension

This gives you:
- Syntax highlighting
- Auto-completion
- Error checking
- Hover documentation

## Next Steps

- Learn about [Core Concepts](/guide/core-concepts)
- Explore the [Canvas API](/api/core/canvas) for drawing
- Check out [Input Handling](/api/core/input) for controls
- See complete [Examples](/examples/)

## Getting Help

- [GitHub Issues](https://github.com/Atlas-Looti/l8b2/issues) - Report bugs or request features
- [GitHub Discussions](https://github.com/Atlas-Looti/l8b2/discussions) - Ask questions and share ideas
- [Discord Community](#) - Chat with other l8b developers
