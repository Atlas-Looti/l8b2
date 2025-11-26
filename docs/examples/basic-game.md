# Basic Game Example

A simple game demonstrating core l8b concepts.

## Overview

This example shows:
- Basic game loop (update/draw)
- Player movement with keyboard input
- Simple collision detection
- Score tracking with storage

## Code

```lootiscript
// Game state
let playerX = 400
let playerY = 300
let playerSize = 32
let speed = 5

let targetX = 200
let targetY = 200
let targetSize = 24

let score = 0
let highScore = storage.get("highScore", 0)

// Initialize
function init() {
  spawnTarget()
}

// Update game logic
function update() {
  // Player movement
  if (input.isKeyDown("ArrowRight")) {
    playerX = playerX + speed
  }
  if (input.isKeyDown("ArrowLeft")) {
    playerX = playerX - speed
  }
  if (input.isKeyDown("ArrowUp")) {
    playerY = playerY - speed
  }
  if (input.isKeyDown("ArrowDown")) {
    playerY = playerY + speed
  }
  
  // Keep player in bounds
  if (playerX < 0) playerX = 0
  if (playerX > 800 - playerSize) playerX = 800 - playerSize
  if (playerY < 0) playerY = 0
  if (playerY > 600 - playerSize) playerY = 600 - playerSize
  
  // Check collision with target
  if (checkCollision()) {
    score = score + 1
    if (score > highScore) {
      highScore = score
      storage.set("highScore", highScore)
    }
    spawnTarget()
  }
}

// Render graphics
function draw() {
  // Clear screen
  canvas.clear("black")
  
  // Draw target
  canvas.fillCircle(targetX, targetY, targetSize, "gold")
  
  // Draw player
  canvas.fillRect(playerX, playerY, playerSize, playerSize, "cyan")
  
  // Draw UI
  canvas.drawText("Score: " + score, 10, 30, "24px Arial", "white")
  canvas.drawText("High Score: " + highScore, 10, 60, "20px Arial", "gray")
  canvas.drawText("Use arrow keys to move", 10, 590, "16px Arial", "white")
}

// Helper functions
function checkCollision() {
  let dx = (playerX + playerSize / 2) - targetX
  let dy = (playerY + playerSize / 2) - targetY
  let distance = Math.sqrt(dx * dx + dy * dy)
  return distance < (playerSize / 2 + targetSize)
}

function spawnTarget() {
  targetX = Math.random() * (800 - targetSize * 2) + targetSize
  targetY = Math.random() * (600 - targetSize * 2) + targetSize
}
```

## Key Concepts

### Game Loop

The game uses two main functions:
- `update()` - Called every frame to update game logic
- `draw()` - Called every frame to render graphics

### Input Handling

```lootiscript
if (input.isKeyDown("ArrowRight")) {
  playerX = playerX + speed
}
```

Use `input.isKeyDown()` for continuous movement.

### Collision Detection

```lootiscript
function checkCollision() {
  let dx = (playerX + playerSize / 2) - targetX
  let dy = (playerY + playerSize / 2) - targetY
  let distance = Math.sqrt(dx * dx + dy * dy)
  return distance < (playerSize / 2 + targetSize)
}
```

Simple circle-to-circle collision using distance calculation.

### Score Persistence

```lootiscript
let highScore = storage.get("highScore", 0)

if (score > highScore) {
  highScore = score
  storage.set("highScore", highScore)
}
```

Use the Storage API to persist high scores between sessions.

## Try It Yourself

Modify the example:
1. Change player speed
2. Add more targets
3. Add a timer
4. Create power-ups
5. Add sound effects

## Next Steps

- Learn about [Scene Management](/examples/scenes)
- Explore the [Canvas API](/api/core/canvas)
- Check out [Input API](/api/core/input)
