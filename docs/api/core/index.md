# Core APIs

The core APIs are the foundation of l8b - they're always available in your game code and provide everything you need for basic game development.

## What's Included

### 🎨 [Canvas API](/api/core/canvas)
Draw shapes, text, and images on the screen.

**Common uses:**
- Drawing game objects (player, enemies, items)
- Rendering UI (score, health bars, menus)
- Creating visual effects

### 🎮 [Input API](/api/core/input)
Handle player input from keyboard and mouse.

**Common uses:**
- Player movement controls
- Menu navigation
- Mouse aiming and clicking

### 💾 [Storage API](/api/core/storage)
Save and load data that persists between game sessions.

**Common uses:**
- High scores
- Player settings (volume, difficulty)
- Save game data

## Quick Example

Here's how you use all three core APIs together:

```lootiscript
// Load saved high score
let highScore = storage.get("highScore", 0)
let currentScore = 0

function update() {
  // Handle input
  if (input.isKeyDown("Space")) {
    currentScore = currentScore + 10
  }
  
  // Update high score
  if (currentScore > highScore) {
    highScore = currentScore
    storage.set("highScore", highScore)
  }
}

function draw() {
  // Draw with canvas
  canvas.clear("black")
  canvas.drawText("Score: " + currentScore, 10, 30, "20px Arial", "white")
  canvas.drawText("High: " + highScore, 10, 60, "16px Arial", "gray")
}
```

## Learn More

- [Canvas API Reference](/api/core/canvas) - All drawing methods
- [Input API Reference](/api/core/input) - All input methods
- [Storage API Reference](/api/core/storage) - All storage methods
