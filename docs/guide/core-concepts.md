# Core Concepts

Understanding the core concepts of l8b will help you build games more effectively.

## What is l8b?

l8b is a complete game engine for the web, powered by **LootiScript** - a simple, game-focused scripting language. Everything runs in the browser, making your games instantly shareable and playable on any device.

## The Game Loop

Every l8b game runs on a standard game loop that executes 60 times per second:

1. **Update** - Process game logic, handle input, update state
2. **Draw** - Render graphics to the canvas
3. **Repeat** - Loop continues automatically

```lootiscript
function update() {
  // Called 60 times per second
  // Update game state, handle input, check collisions
  playerX = playerX + speed
}

function draw() {
  // Called after update, 60 times per second
  // Render everything to the screen
  canvas.clear("black")
  canvas.fillRect(playerX, playerY, 32, 32, "cyan")
}
```

You just define these two functions, and l8b handles the rest!

## LootiScript Language

LootiScript is designed to be simple and familiar:

### Variables

```lootiscript
let x = 10          // Mutable variable
const speed = 5     // Constant (cannot change)
```

### Functions

```lootiscript
function movePlayer(dx, dy) {
  playerX = playerX + dx
  playerY = playerY + dy
}

// Call it
movePlayer(5, 0)
```

### Objects

```lootiscript
let player = {
  x: 100,
  y: 100,
  speed: 5,
  health: 100
}

// Access properties
player.x = player.x + player.speed
```

### Arrays

```lootiscript
let enemies = [enemy1, enemy2, enemy3]

// Loop through
for (let i = 0; i < enemies.length; i = i + 1) {
  updateEnemy(enemies[i])
}
```

## Core APIs

l8b provides several built-in APIs that are always available in your game code:

### Canvas API - Drawing

```lootiscript
// Clear screen
canvas.clear("black")

// Draw shapes
canvas.fillRect(x, y, width, height, "blue")
canvas.fillCircle(x, y, radius, "red")

// Draw text
canvas.drawText("Score: 100", 10, 30, "20px Arial", "white")

// Draw images
canvas.drawImage(sprite, x, y)
```

[Full Canvas API Reference →](/api/core/canvas)

### Input API - Controls

```lootiscript
// Keyboard
if (input.isKeyDown("Space")) {
  jump()
}

if (input.isKeyPressed("Enter")) {
  // Only fires once per press
  startGame()
}

// Mouse
let mouseX = input.getMouseX()
let mouseY = input.getMouseY()

if (input.isMouseDown(0)) {
  shoot(mouseX, mouseY)
}
```

[Full Input API Reference →](/api/core/input)

### Storage API - Save Data

```lootiscript
// Save data (persists between sessions)
storage.set("highScore", 1000)
storage.set("playerName", "Alice")

// Load data
let savedScore = storage.get("highScore", 0)  // 0 is default if not found
let name = storage.get("playerName", "Player")
```

[Full Storage API Reference →](/api/core/storage)

## Organizing with Scenes

For larger games, use **scenes** to organize different game states (menu, gameplay, game over):

```lootiscript
// Define menu scene
scene("menu", {
  init: function() {
    // Setup menu (called once when entering)
  },
  update: function() {
    if (input.isKeyPressed("Space")) {
      route.goto("game")  // Go to game scene
    }
  },
  draw: function() {
    canvas.clear("black")
    canvas.drawText("Press SPACE to start", 300, 300, "24px Arial", "white")
  }
})

// Define game scene
scene("game", {
  init: function() {
    // Reset game state
    score = 0
  },
  update: function() {
    // Game logic
  },
  draw: function() {
    // Render game
  }
})

// Start at menu
route.goto("menu")
```

[Learn more about Scenes →](/api/framework/)

## Loading Assets

Load images and other assets for your game:

```lootiscript
// Load an image
let playerSprite = loadImage("player.png")

// Use it in draw
function draw() {
  canvas.drawImage(playerSprite, playerX, playerY)
}
```

## Best Practices

1. **Keep update() fast** - It runs 60 times per second
2. **Separate logic and rendering** - Game logic in `update()`, drawing in `draw()`
3. **Use scenes for organization** - Menu, gameplay, settings, etc.
4. **Cache calculations** - Don't recalculate the same thing every frame
5. **Use storage wisely** - Save only important data (high scores, settings)

## Example: Complete Simple Game

```lootiscript
// Game state
let playerX = 400
let playerY = 300
let score = 0

function update() {
  // Movement
  if (input.isKeyDown("ArrowRight")) playerX = playerX + 5
  if (input.isKeyDown("ArrowLeft")) playerX = playerX - 5
  if (input.isKeyDown("ArrowUp")) playerY = playerY - 5
  if (input.isKeyDown("ArrowDown")) playerY = playerY + 5
}

function draw() {
  canvas.clear("black")
  canvas.fillRect(playerX, playerY, 32, 32, "cyan")
  canvas.drawText("Score: " + score, 10, 30, "20px Arial", "white")
}
```

## Next Steps

- Explore the [Canvas API](/api/core/canvas) for all drawing methods
- Learn about [Input Handling](/api/core/input) in detail
- Check out [Complete Examples](/examples/)
- Build a game with [Scenes](/api/framework/)
