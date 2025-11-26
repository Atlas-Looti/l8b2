# Storage API

The Storage API provides methods for persisting data locally in the browser.

## Methods

### `storage.set(key, value)`

Stores a value with the specified key.

**Parameters:**
- `key` (string) - Storage key
- `value` (any) - Value to store (will be JSON serialized)

**Example:**
```lootiscript
storage.set("highScore", 1000)
storage.set("playerName", "Alice")
storage.set("settings", { volume: 0.8, difficulty: "hard" })
```

---

### `storage.get(key, defaultValue?)`

Retrieves a value by key.

**Parameters:**
- `key` (string) - Storage key
- `defaultValue` (any, optional) - Value to return if key doesn't exist

**Returns:** Stored value or default value

**Example:**
```lootiscript
let highScore = storage.get("highScore", 0)
let playerName = storage.get("playerName", "Player")
let settings = storage.get("settings", { volume: 1.0, difficulty: "normal" })
```

---

### `storage.has(key)`

Checks if a key exists in storage.

**Parameters:**
- `key` (string) - Storage key

**Returns:** `boolean`

**Example:**
```lootiscript
if (storage.has("highScore")) {
  let score = storage.get("highScore")
}
```

---

### `storage.remove(key)`

Removes a value from storage.

**Parameters:**
- `key` (string) - Storage key

**Example:**
```lootiscript
storage.remove("tempData")
```

---

### `storage.clear()`

Clears all stored data.

**Example:**
```lootiscript
storage.clear()  // Remove all data
```

---

### `storage.keys()`

Gets all storage keys.

**Returns:** Array of strings

**Example:**
```lootiscript
let allKeys = storage.keys()
for (let i = 0; i < allKeys.length; i = i + 1) {
  console.log(allKeys[i])
}
```

## Data Types

The storage API can store:

- **Numbers**: `storage.set("score", 100)`
- **Strings**: `storage.set("name", "Alice")`
- **Booleans**: `storage.set("soundEnabled", true)`
- **Objects**: `storage.set("player", { x: 10, y: 20 })`
- **Arrays**: `storage.set("inventory", ["sword", "shield"])`

## Example Usage

### High Score System

```lootiscript
let currentScore = 0
let highScore = storage.get("highScore", 0)

function gameOver() {
  if (currentScore > highScore) {
    highScore = currentScore
    storage.set("highScore", highScore)
    showNewHighScore()
  }
}
```

### Settings Management

```lootiscript
// Load settings
let settings = storage.get("settings", {
  volume: 1.0,
  difficulty: "normal",
  controlScheme: "arrows"
})

function saveSettings() {
  storage.set("settings", settings)
}

function updateVolume(newVolume) {
  settings.volume = newVolume
  saveSettings()
}
```

### Save Game System

```lootiscript
function saveGame() {
  let saveData = {
    level: currentLevel,
    playerX: player.x,
    playerY: player.y,
    inventory: player.inventory,
    timestamp: Date.now()
  }
  storage.set("saveGame", saveData)
}

function loadGame() {
  if (storage.has("saveGame")) {
    let saveData = storage.get("saveGame")
    currentLevel = saveData.level
    player.x = saveData.playerX
    player.y = saveData.playerY
    player.inventory = saveData.inventory
    return true
  }
  return false
}
```

## Storage Limits

- Browser local storage typically has a limit of **5-10 MB**
- Store only essential data
- Consider compression for large datasets
- Use `storage.clear()` to reset during development

## Best Practices

1. **Use default values** with `storage.get()` to handle missing data
2. **Validate loaded data** before using it
3. **Save frequently** but not every frame
4. **Version your save data** for compatibility
5. **Handle storage errors** gracefully

```lootiscript
// Good: Use default values
let score = storage.get("score", 0)

// Good: Validate data
let settings = storage.get("settings", {})
if (settings.volume === undefined) {
  settings.volume = 1.0
}

// Bad: Don't save every frame
function update() {
  storage.set("playerX", player.x)  // Too frequent!
}

// Good: Save on specific events
function onLevelComplete() {
  saveGame()
}
```
