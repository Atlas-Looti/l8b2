# Canvas API

The Canvas API provides drawing primitives and rendering operations for your games.

## Methods

### `canvas.clear(color?)`

Clears the entire canvas with an optional color.

**Parameters:**
- `color` (string, optional) - Fill color (default: transparent)

**Example:**
```lootiscript
canvas.clear()           // Clear to transparent
canvas.clear("black")    // Clear to black
```

---

### `canvas.fillRect(x, y, width, height, color)`

Draws a filled rectangle.

**Parameters:**
- `x` (number) - X position
- `y` (number) - Y position
- `width` (number) - Rectangle width
- `height` (number) - Rectangle height
- `color` (string) - Fill color

**Example:**
```lootiscript
canvas.fillRect(10, 10, 100, 50, "blue")
```

---

### `canvas.strokeRect(x, y, width, height, color, lineWidth?)`

Draws a rectangle outline.

**Parameters:**
- `x` (number) - X position
- `y` (number) - Y position
- `width` (number) - Rectangle width
- `height` (number) - Rectangle height
- `color` (string) - Stroke color
- `lineWidth` (number, optional) - Line width (default: 1)

**Example:**
```lootiscript
canvas.strokeRect(10, 10, 100, 50, "red", 2)
```

---

### `canvas.fillCircle(x, y, radius, color)`

Draws a filled circle.

**Parameters:**
- `x` (number) - Center X position
- `y` (number) - Center Y position
- `radius` (number) - Circle radius
- `color` (string) - Fill color

**Example:**
```lootiscript
canvas.fillCircle(100, 100, 25, "green")
```

---

### `canvas.strokeCircle(x, y, radius, color, lineWidth?)`

Draws a circle outline.

**Parameters:**
- `x` (number) - Center X position
- `y` (number) - Center Y position
- `radius` (number) - Circle radius
- `color` (string) - Stroke color
- `lineWidth` (number, optional) - Line width (default: 1)

**Example:**
```lootiscript
canvas.strokeCircle(100, 100, 25, "yellow", 3)
```

---

### `canvas.drawText(text, x, y, font?, color?)`

Draws text on the canvas.

**Parameters:**
- `text` (string) - Text to draw
- `x` (number) - X position
- `y` (number) - Y position
- `font` (string, optional) - Font specification (default: "16px sans-serif")
- `color` (string, optional) - Text color (default: "black")

**Example:**
```lootiscript
canvas.drawText("Score: 100", 10, 30, "20px Arial", "white")
```

---

### `canvas.drawLine(x1, y1, x2, y2, color, lineWidth?)`

Draws a line between two points.

**Parameters:**
- `x1` (number) - Start X position
- `y1` (number) - Start Y position
- `x2` (number) - End X position
- `y2` (number) - End Y position
- `color` (string) - Line color
- `lineWidth` (number, optional) - Line width (default: 1)

**Example:**
```lootiscript
canvas.drawLine(0, 0, 100, 100, "white", 2)
```

---

### `canvas.drawImage(image, x, y, width?, height?)`

Draws an image on the canvas.

**Parameters:**
- `image` (Image) - Image object to draw
- `x` (number) - X position
- `y` (number) - Y position
- `width` (number, optional) - Draw width (default: image width)
- `height` (number, optional) - Draw height (default: image height)

**Example:**
```lootiscript
let sprite = loadImage("player.png")
canvas.drawImage(sprite, 100, 100)
canvas.drawImage(sprite, 200, 200, 64, 64)  // Scaled
```

## Color Formats

Colors can be specified in several formats:

- **Named colors**: `"red"`, `"blue"`, `"green"`
- **Hex colors**: `"#FF0000"`, `"#00FF00"`
- **RGB**: `"rgb(255, 0, 0)"`
- **RGBA**: `"rgba(255, 0, 0, 0.5)"`

## Example Usage

```lootiscript
function draw() {
  // Clear screen
  canvas.clear("black")
  
  // Draw background
  canvas.fillRect(0, 0, 800, 600, "#1a1a1a")
  
  // Draw player
  canvas.fillCircle(playerX, playerY, 20, "cyan")
  
  // Draw UI
  canvas.drawText("Score: " + score, 10, 30, "24px Arial", "white")
}
```
