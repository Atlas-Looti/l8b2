# Route API

Navigate between scenes in your game.

## Overview

The Route API provides simple navigation between scenes. Think of it like changing pages in a website, but for your game states.

## Methods

### `route.goto(sceneName)`

Navigate to a different scene.

**Parameters:**
- `sceneName` (string) - Name of the scene to navigate to

**Example:**
```lootiscript
// Go to game scene
route.goto("game")

// Go to menu
route.goto("menu")

// Go to game over
route.goto("gameover")
```

**What happens:**
1. Current scene's `cleanup()` is called (if defined)
2. New scene's `init()` is called
3. Game loop continues with new scene's `update()` and `draw()`

---

### `route.current()`

Get the name of the current scene.

**Returns:** `string` - Current scene name

**Example:**
```lootiscript
let currentScene = route.current()

if (currentScene === "menu") {
  console.log("We're in the menu")
}

// Conditional logic based on scene
if (route.current() === "game") {
  // Do something only in game scene
}
```

## Usage Examples

### Basic Navigation

```lootiscript
scene("menu", {
  update: function() {
    if (input.isKeyPressed("Space")) {
      route.goto("game")  // Start game
    }
  }
})

scene("game", {
  update: function() {
    if (playerDied) {
      route.goto("gameover")  // Go to game over
    }
    
    if (input.isKeyPressed("Escape")) {
      route.goto("menu")  // Back to menu
    }
  }
})
```

### Conditional Navigation

```lootiscript
scene("game", {
  update: function() {
    if (levelComplete) {
      if (isLastLevel) {
        route.goto("victory")  // All levels complete
      } else {
        route.goto("nextlevel")  // More levels to play
      }
    }
  }
})
```

### Scene-Specific Behavior

```lootiscript
function update() {
  // Different behavior based on current scene
  if (route.current() === "menu") {
    updateMenuAnimations()
  } else if (route.current() === "game") {
    updateGameLogic()
  }
}
```

## Complete Example

```lootiscript
// Menu Scene
scene("menu", {
  init: function() {
    console.log("Entered menu")
  },
  update: function() {
    if (input.isKeyPressed("Space")) {
      route.goto("game")
    }
  },
  draw: function() {
    canvas.clear("black")
    canvas.drawText("Press SPACE to play", 300, 300, "24px Arial", "white")
  },
  cleanup: function() {
    console.log("Leaving menu")
  }
})

// Game Scene
scene("game", {
  init: function() {
    console.log("Game started")
    score = 0
  },
  update: function() {
    // Game logic
    score = score + 1
    
    if (score >= 100) {
      route.goto("win")
    }
    
    if (input.isKeyPressed("Escape")) {
      route.goto("menu")
    }
  },
  draw: function() {
    canvas.clear("black")
    canvas.drawText("Score: " + score, 10, 30, "20px Arial", "white")
    canvas.drawText("ESC for menu", 10, 60, "16px Arial", "gray")
  }
})

// Win Scene
scene("win", {
  init: function() {
    console.log("Player won!")
  },
  update: function() {
    if (input.isKeyPressed("Space")) {
      route.goto("menu")
    }
  },
  draw: function() {
    canvas.clear("black")
    canvas.drawText("YOU WIN!", 350, 300, "32px Arial", "gold")
    canvas.drawText("Press SPACE for menu", 280, 350, "18px Arial", "white")
  }
})

// Start at menu
route.goto("menu")
```

## Best Practices

### 1. Always Define Scenes Before Navigating

```lootiscript
// ✅ Good: Define scene first
scene("game", { ... })
route.goto("game")

// ❌ Bad: Navigate to undefined scene
route.goto("game")  // Error: scene not defined
scene("game", { ... })
```

### 2. Use Cleanup for Resource Management

```lootiscript
scene("game", {
  init: function() {
    backgroundMusic = playSound("bgm.mp3", true)
  },
  cleanup: function() {
    // ✅ Stop music when leaving scene
    stopSound(backgroundMusic)
  }
})
```

### 3. Handle Navigation Errors Gracefully

```lootiscript
scene("game", {
  update: function() {
    if (playerWon) {
      // ✅ Check if scene exists
      if (hasNextLevel) {
        route.goto("level" + (currentLevel + 1))
      } else {
        route.goto("victory")
      }
    }
  }
})
```

## Common Patterns

### Back Button

```lootiscript
let previousScene = "menu"

scene("settings", {
  update: function() {
    if (input.isKeyPressed("Escape")) {
      route.goto(previousScene)  // Go back
    }
  }
})

// When entering settings, remember where we came from
function openSettings() {
  previousScene = route.current()
  route.goto("settings")
}
```

### Scene Stack (for nested menus)

```lootiscript
let sceneStack = []

function pushScene(sceneName) {
  sceneStack.push(route.current())
  route.goto(sceneName)
}

function popScene() {
  if (sceneStack.length > 0) {
    let previous = sceneStack.pop()
    route.goto(previous)
  }
}

// Usage
scene("menu", {
  update: function() {
    if (input.isKeyPressed("S")) {
      pushScene("settings")  // Can go back to menu
    }
  }
})

scene("settings", {
  update: function() {
    if (input.isKeyPressed("Escape")) {
      popScene()  // Return to menu
    }
  }
})
```

## Debugging

Check current scene in console:

```lootiscript
function update() {
  // Log scene changes
  if (route.current() !== lastScene) {
    console.log("Scene changed to: " + route.current())
    lastScene = route.current()
  }
}
```

## Next Steps

- Learn about [Scene API](/api/framework/scene)
- See [Scene Management Example](/examples/scenes)
- Explore [Storage API](/api/core/storage) for saving progress between scenes
