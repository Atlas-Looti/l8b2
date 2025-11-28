# @l8b/assets

**LootiScript API Binding** - Asset loading and management for images, fonts, JSON, and text files.

> **Note**: This package is used as an API binding for LootiScript in the l8b engine.

## API Reference

### Assets.loadImage()
Load an image from the assets directory.

```lua
// Load image with callback
Assets.loadImage("player.png", function(image)
  // Image is ready to use
end)

// Returns a loader object
local loader = Assets.loadImage("enemy.png")
// Check if ready: loader.ready == 1
// Access image: loader.image
```

### Assets.loadFont()
Load a custom font file (.ttf).

```lua
// Load font from assets/myfont.ttf
Assets.loadFont("myfont")
```

### Assets.loadJSON()
Load and parse a JSON file.

```lua
// Load JSON with callback
Assets.loadJSON("config.json", function(data)
  Console.log(data.level)
  Console.log(data.score)
end)

// Returns a loader object
local loader = Assets.loadJSON("data.json")
// Check if ready: loader.ready == 1
// Access data: loader.data
```

### Assets.loadText()
Load a text file with custom extension.

```lua
// Load text file with callback
Assets.loadText("story.txt", function(text)
  Console.log(text)
end)

// Load with custom extension
Assets.loadText("shader.glsl", function(code)
  // Process shader code
end, "glsl")

// Returns a loader object
local loader = Assets.loadText("notes.txt")
// Check if ready: loader.ready == 1
// Access text: loader.text
```

### Assets.loadCSV()
Load a CSV file (shorthand for loadText with .csv extension).

```lua
Assets.loadCSV("data.csv", function(csvContent)
  // Parse CSV content
end)
```

### Assets.loadMarkdown()
Load a Markdown file (shorthand for loadText with .md extension).

```lua
Assets.loadMarkdown("readme.md", function(mdContent)
  // Process markdown
end)
```

## Loader Object

All load functions return a loader object:

```lua
local loader = Assets.loadImage("sprite.png")

// Properties:
// loader.ready    - 0 (loading) or 1 (ready)
// loader.image    - Image object (for loadImage)
// loader.data     - Parsed data (for loadJSON)
// loader.text     - Text content (for loadText/CSV/Markdown)
```

## File Paths

All asset paths are relative to the `assets/` directory:

```lua
// Loads from: assets/player.png
Assets.loadImage("player.png")

// Loads from: assets/sprites/enemy.png  
Assets.loadImage("sprites/enemy.png")

// Loads from: assets/config.json
Assets.loadJSON("config.json")
```
