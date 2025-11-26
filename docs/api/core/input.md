# Input API

The Input API provides methods for handling keyboard, mouse, and touch input in your games.

## Keyboard Input

### `input.isKeyDown(key)`

Checks if a key is currently pressed.

**Parameters:**
- `key` (string) - Key name (e.g., "Space", "ArrowUp", "a")

**Returns:** `boolean`

**Example:**
```lootiscript
if (input.isKeyDown("Space")) {
  jump()
}

if (input.isKeyDown("ArrowRight")) {
  moveRight()
}
```

---

### `input.isKeyPressed(key)`

Checks if a key was just pressed this frame (single press detection).

**Parameters:**
- `key` (string) - Key name

**Returns:** `boolean`

**Example:**
```lootiscript
if (input.isKeyPressed("Space")) {
  // Only fires once per press
  shoot()
}
```

---

### `input.isKeyReleased(key)`

Checks if a key was just released this frame.

**Parameters:**
- `key` (string) - Key name

**Returns:** `boolean`

**Example:**
```lootiscript
if (input.isKeyReleased("Space")) {
  stopCharging()
}
```

## Mouse Input

### `input.getMouseX()`

Gets the current mouse X position.

**Returns:** `number`

**Example:**
```lootiscript
let mouseX = input.getMouseX()
```

---

### `input.getMouseY()`

Gets the current mouse Y position.

**Returns:** `number`

**Example:**
```lootiscript
let mouseY = input.getMouseY()
```

---

### `input.isMouseDown(button?)`

Checks if a mouse button is currently pressed.

**Parameters:**
- `button` (number, optional) - Button index (0=left, 1=middle, 2=right, default: 0)

**Returns:** `boolean`

**Example:**
```lootiscript
if (input.isMouseDown(0)) {
  // Left mouse button is down
  shoot()
}
```

---

### `input.isMousePressed(button?)`

Checks if a mouse button was just pressed this frame.

**Parameters:**
- `button` (number, optional) - Button index (default: 0)

**Returns:** `boolean`

**Example:**
```lootiscript
if (input.isMousePressed(0)) {
  // Left mouse button was just clicked
  selectTarget()
}
```

## Key Names

Common key names:

- **Letters**: `"a"`, `"b"`, `"c"`, etc.
- **Numbers**: `"0"`, `"1"`, `"2"`, etc.
- **Arrows**: `"ArrowUp"`, `"ArrowDown"`, `"ArrowLeft"`, `"ArrowRight"`
- **Special**: `"Space"`, `"Enter"`, `"Escape"`, `"Shift"`, `"Control"`, `"Alt"`
- **Function**: `"F1"`, `"F2"`, etc.

## Example Usage

```lootiscript
let playerX = 100
let playerY = 100
let speed = 5

function update() {
  // Keyboard movement
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
  
  // Jump on space press
  if (input.isKeyPressed("Space")) {
    jump()
  }
  
  // Mouse aiming
  let mouseX = input.getMouseX()
  let mouseY = input.getMouseY()
  aimAt(mouseX, mouseY)
  
  // Shoot on click
  if (input.isMousePressed(0)) {
    shoot(mouseX, mouseY)
  }
}
```

## Best Practices

1. **Use `isKeyDown()` for continuous actions** (movement, holding)
2. **Use `isKeyPressed()` for single actions** (jump, shoot)
3. **Check input in `update()`, not `draw()`**
4. **Cache mouse position** if used multiple times per frame
