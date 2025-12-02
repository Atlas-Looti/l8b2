# @l8b/assets

**LootiScript API Binding** - Asset loading and management for images, fonts, JSON, and text files.

> **Note**: This package is used as an API binding for LootiScript in the l8b engine.

## API Reference

### Assets.loadImage()

Load an image from the assets directory.

**Signature:**

```lua
Assets.loadImage(path: string, callback?: function): ImageLoaderResult
```

**Parameters:**

- `path` (string) - Image file path relative to `assets/` directory
- `callback` (function, optional) - Called when image is loaded with Image object as parameter

**Returns:** `ImageLoaderResult` object with:

- `ready` (number) - 0 (loading) or 1 (ready)
- `image` (Image, optional) - Image object when loaded

**Examples:**

```lua
// Load image with callback
Assets.loadImage("player.png", function(image)
  // Image is ready to use
  screen.drawImage(image, 0, 0)
end)

// Returns a loader object
local loader = Assets.loadImage("enemy.png")
// Check if ready: loader.ready == 1
// Access image: loader.image

// Polling pattern
local loader = Assets.loadImage("sprite.png")
function update()
  if loader.ready == 1 then
    mySprite = loader.image
  end
end
```

**File Paths:**

- Paths are relative to `assets/` directory
- Supports subdirectories: `Assets.loadImage("sprites/enemy.png")`
- Automatically handles CORS for cross-origin images
- Supports common image formats: PNG, JPG, GIF, WebP

---

### Assets.loadFont()

Load a custom font file (.ttf).

**Signature:**

```lua
Assets.loadFont(font: string): void
```

**Parameters:**

- `font` (string) - Font name (without extension). File should be at `assets/{font}.ttf`

**Returns:** `void`

**Examples:**

```lua
// Load font from assets/myfont.ttf
Assets.loadFont("myfont")

// Load font from subdirectory (path separators converted to dashes)
Assets.loadFont("fonts/custom")  // Loads assets/fonts-custom.ttf

// Use loaded font
screen.setFont("myfont")
screen.drawText("Hello", 10, 10, 16)
```

**Notes:**

- Font files must be in `.ttf` format
- Font name is extracted from the path (last segment)
- Fonts are loaded asynchronously and available immediately after calling
- Use `screen.isFontReady()` to check if font is loaded

---

### Assets.loadJSON()

Load and parse a JSON file.

**Signature:**

```lua
Assets.loadJSON(path: string, callback?: function): JSONLoaderResult
```

**Parameters:**

- `path` (string) - JSON file path relative to `assets/` directory (without .json extension)
- `callback` (function, optional) - Called when JSON is loaded with parsed data as parameter

**Returns:** `JSONLoaderResult` object with:

- `ready` (number) - 0 (loading) or 1 (ready)
- `data` (any, optional) - Parsed JSON data when loaded

**Examples:**

```lua
// Load JSON with callback
Assets.loadJSON("config", function(data)
  print(data.level)
  print(data.score)
  gameConfig = data
end)

// Returns a loader object
local loader = Assets.loadJSON("data")
// Check if ready: loader.ready == 1
// Access data: loader.data

// Load from subdirectory
Assets.loadJSON("levels/level1", function(levelData)
  loadLevel(levelData)
end)
```

**File Paths:**

- Path separators (`/`) are converted to dashes (`-`)
- `.json` extension is automatically added
- Example: `Assets.loadJSON("config/data")` loads `assets/config-data.json`

---

### Assets.loadText()

Load a text file with custom extension.

**Signature:**

```lua
Assets.loadText(path: string, callback?: function, ext?: string): TextLoaderResult
```

**Parameters:**

- `path` (string) - Text file path relative to `assets/` directory (without extension)
- `callback` (function, optional) - Called when text is loaded with text content as parameter
- `ext` (string, optional) - File extension (default: "txt")

**Returns:** `TextLoaderResult` object with:

- `ready` (number) - 0 (loading) or 1 (ready)
- `text` (string, optional) - Text content when loaded

**Examples:**

```lua
// Load text file with callback
Assets.loadText("story", function(text)
  print(text)
  displayStory(text)
end)

// Load with custom extension
Assets.loadText("shader", function(code)
  // Process shader code
  compileShader(code)
end, "glsl")

// Returns a loader object
local loader = Assets.loadText("notes")
// Check if ready: loader.ready == 1
// Access text: loader.text

// Load various text formats
Assets.loadText("config", function(text) end, "ini")
Assets.loadText("data", function(text) end, "xml")
Assets.loadText("script", function(text) end, "lua")
```

**File Paths:**

- Path separators (`/`) are converted to dashes (`-`)
- Extension is appended automatically
- Example: `Assets.loadText("scripts/main", nil, "lua")` loads `assets/scripts-main.lua`

---

### Assets.loadCSV()

Load a CSV file (shorthand for `loadText` with `.csv` extension).

**Signature:**

```lua
Assets.loadCSV(path: string, callback?: function): TextLoaderResult
```

**Parameters:**

- `path` (string) - CSV file path relative to `assets/` directory (without .csv extension)
- `callback` (function, optional) - Called when CSV is loaded with text content as parameter

**Returns:** `TextLoaderResult` object (same as `loadText`)

**Examples:**

```lua
Assets.loadCSV("data", function(csvContent)
  // Parse CSV content
  local rows = parseCSV(csvContent)
  for i = 1, #rows do
    print(rows[i])
  end
end)

// Equivalent to:
Assets.loadText("data", function(text) end, "csv")
```

---

### Assets.loadMarkdown()

Load a Markdown file (shorthand for `loadText` with `.md` extension).

**Signature:**

```lua
Assets.loadMarkdown(path: string, callback?: function): TextLoaderResult
```

**Parameters:**

- `path` (string) - Markdown file path relative to `assets/` directory (without .md extension)
- `callback` (function, optional) - Called when Markdown is loaded with text content as parameter

**Returns:** `TextLoaderResult` object (same as `loadText`)

**Examples:**

```lua
Assets.loadMarkdown("readme", function(mdContent)
  // Process markdown
  displayMarkdown(mdContent)
end)

// Equivalent to:
Assets.loadText("readme", function(text) end, "md")
```

---

## Loader Object

All load functions (except `loadFont`) return a loader object that tracks loading state:

```lua
local loader = Assets.loadImage("sprite.png")

// Properties:
// loader.ready    - 0 (loading) or 1 (ready)
// loader.image    - Image object (for loadImage only, when ready)
// loader.data     - Parsed data (for loadJSON only, when ready)
// loader.text     - Text content (for loadText/CSV/Markdown, when ready)
```

**Usage Patterns:**

```lua
// Pattern 1: Callback-based (recommended)
Assets.loadImage("player.png", function(image)
  // Image is guaranteed to be loaded here
  playerSprite = image
end)

// Pattern 2: Polling
local loader = Assets.loadImage("enemy.png")
function update()
  if loader.ready == 1 and loader.image then
    enemySprite = loader.image
  end
end

// Pattern 3: Multiple assets
local imageLoader = Assets.loadImage("sprite.png")
local jsonLoader = Assets.loadJSON("config")

function checkAssets()
  if imageLoader.ready == 1 and jsonLoader.ready == 1 then
    // All assets loaded
    startGame()
  end
end
```

---

## File Paths

All asset paths are relative to the `assets/` directory in your project:

```lua
// Loads from: assets/player.png
Assets.loadImage("player.png")

// Loads from: assets/sprites/enemy.png  
Assets.loadImage("sprites/enemy.png")

// Loads from: assets/config.json
Assets.loadJSON("config")

// Loads from: assets/levels/level1.json
Assets.loadJSON("levels/level1")

// Loads from: assets/story.txt
Assets.loadText("story")

// Loads from: assets/shaders/main.glsl
Assets.loadText("shaders/main", nil, "glsl")
```

**Path Conversion Rules:**

- Forward slashes (`/`) in paths are converted to dashes (`-`) in actual file paths
- Extensions are automatically added based on the function used
- Example: `Assets.loadJSON("levels/level1")` → loads `assets/levels-level1.json`

---

## Error Handling

Asset loading errors are automatically reported through the runtime's error reporting system:

```lua
// If an asset fails to load, an error is reported but execution continues
local loader = Assets.loadImage("missing.png")
// loader.ready will be 1 even if loading failed
// loader.image will be nil/undefined if loading failed
```

---

## Complete Example

```lua
// Load all game assets
local sprites = {}
local config = nil
local story = nil

// Load sprites
Assets.loadImage("player", function(img)
  sprites.player = img
end)

Assets.loadImage("enemy", function(img)
  sprites.enemy = img
end)

// Load configuration
Assets.loadJSON("config", function(data)
  config = data
  print("Level: " .. config.level)
  print("Difficulty: " .. config.difficulty)
end)

// Load story text
Assets.loadText("story", function(text)
  story = text
end)

// Load custom font
Assets.loadFont("gamefont")

// Check if all assets are loaded
function checkAssets()
  if sprites.player and sprites.enemy and config and story then
    if screen.isFontReady("gamefont") == 1 then
      startGame()
    end
  end
end

function update()
  checkAssets()
end
```
