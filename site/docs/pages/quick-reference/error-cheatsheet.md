# Error Cheatsheet

Quick reference for understanding and debugging errors in L8B.

## Error Format

Errors in L8B have the following format:

```text
[Code] Message
  at file:line:column
```

Example:

```text
[E2001] Undefined variable 'playerX'
  at scripts/main.loot:15:8
```

## Error Code Categories

| Code Range | Category | Description |
|------------|----------|-------------|
| E1xxx | Syntax Errors | [LootiScript Programming](/looti-script)s |
| E2xxx | Runtime Errors | Errors during program execution |
| E3xxx | Compilation Errors | Errors during compilation |
| E5xxx | Scene Errors | Scene management errors |
| E6xxx | CLI Errors | Command line tool errors |
| E7xxx | API Errors | API call errors |

## Syntax Errors (E1xxx)

### E1001 - Unterminated function/block

**Cause:** Function or block not closed with `end`

```lua
// ❌ Error
myFunction = function()
  print("hello")
  // Missing 'end'

// ✅ Fix
myFunction = function()
  print("hello")
end
```

**Suggestions:**

- Add `end` after the last statement
- Check if there's an extra `end` elsewhere
- Ensure all nested blocks (if, for, while) are properly closed

### E1002 - Too many 'end'

**Cause:** Too many `end` statements

```lua
// ❌ Error
if x > 0 then
  print("positive")
end
end  // Extra 'end'

// ✅ Fix
if x > 0 then
  print("positive")
end
```

**Suggestions:**

- Remove extra `end`
- Check if there's a missing opening statement (if, for, while, function)

### E1004 - Unexpected token

**Cause:** Unexpected token found during parsing

**Suggestions:**

- Check syntax around the error location
- Ensure correct syntax is used for that statement

### E1008 - Unterminated string

**Cause:** String not closed with quote

```lua
// ❌ Error
message = "Hello world  // Missing closing quote

// ✅ Fix
message = "Hello world"
```

**Suggestions:**

- Add closing quote to close the string
- Check for escaped quotes inside the string

## Runtime Errors (E2xxx)

### E2001 - Undefined variable

**Cause:** Variable used before being defined

```lua
// ❌ Error
print(playerX)  // playerX not defined

// ✅ Fix
playerX = 100
print(playerX)
```

**Note:** In LootiScript, undefined variables default to `0`, so this error may not always occur.

## API Errors (E7xxx)

### Screen API Errors (E7001-E7010)

#### E7001 - Failed to get 2D canvas context

**Cause:** Browser cannot create 2D rendering context for canvas

**Suggestions:**

- Check if canvas element is valid
- Ensure browser supports canvas 2D rendering
- Check for canvas context conflicts

#### E7003 - Invalid color format

**Cause:** Invalid color format

```lua
// ✅ Valid formats
screen.setColor("#FF0000")  // Hex format
screen.setColor("red")      // Named color
screen.setColor(999)        // Numeric color
```

**Suggestions:**

- Use hex format: '#RRGGBB' or '#RGB'
- Use named colors: 'red', 'blue', etc.
- Use numeric format for palette colors

#### E7004 - Sprite not found

**Cause:** Sprite not found in sprite collection

```lua
// ❌ Error
screen.drawSprite("nonexistent", 0, 0)

// ✅ Fix
// Ensure sprite is loaded first
screen.drawSprite("player", 0, 0)  // Use existing sprite
```

**Suggestions:**

- Check if sprite name is correct
- Ensure sprite is loaded before use
- Check sprite namespace

### Audio API Errors (E7011-E7020)

#### E7011 - Audio context creation failed

**Cause:** Browser cannot create AudioContext

**Suggestions:**

- Check if browser supports Web Audio API
- Try user interaction to activate audio
- Check browser console for more details

#### E7012 - Audio worklet failed to start

**Cause:** Audio worklet processor cannot be initialized

**Suggestions:**

- Check if AudioWorklet is supported
- Ensure worklet code is valid
- Check browser console for errors

#### E7013 - Sound not found

**Cause:** Sound not found in sound collection

```lua
// ❌ Error
Audio.playSound("nonexistent")

// ✅ Fix
// Ensure sound file exists in assets/sounds/
Audio.playSound("jump.wav")
```

**Suggestions:**

- Check if sound name is correct
- Ensure sound file exists in `assets/sounds/`
- Check file path

#### E7014 - Music not found

**Cause:** Music not found in music collection

**Suggestions:**

- Check if music name is correct
- Ensure music file exists in `assets/music/`
- Check file path

### Sprite API Errors (E7021-E7030)

#### E7021 - Sprite loading failed

**Cause:** Sprite image cannot be loaded

**Suggestions:**

- Check if URL is correct
- Ensure image file exists
- Check CORS settings if loading from different domain
- Check browser console for network errors

#### E7023 - Invalid sprite URL

**Cause:** Invalid or malformed sprite URL

**Suggestions:**

- Use valid URL or relative path
- Check if URL is formatted correctly
- Ensure file extension is correct

### Map API Errors (E7031-E7040)

#### E7034 - Invalid map dimensions

**Cause:** Invalid map dimensions

**Suggestions:**

- Ensure width and height are positive numbers
- Check map initialization

### Asset API Errors (E7041-E7050)

#### E7042 - Asset loading failed

**Cause:** Asset cannot be loaded

**Suggestions:**

- Check if asset URL is correct
- Ensure file exists
- Check network connection
- Check CORS settings

### Drawing API Errors (E7091-E7100)

#### E7092 - Invalid drawing context

**Cause:** Drawing context is invalid or unavailable

**Suggestions:**

- Check if canvas context is initialized
- Ensure context is not destroyed
- Reinitialize drawing context

#### E7093 - Invalid drawing parameters

**Cause:** Invalid drawing parameters

**Suggestions:**

- Check coordinate values are valid numbers
- Ensure dimensions are positive
- Check color value is valid
- Ensure all required parameters are provided

### API Validation Errors (E7100-E7199)

#### E7100 - Unknown property

**Cause:** Property or method that doesn't exist on API object is accessed

```lua
// ❌ Error
screen.invalidMethod()  // Method doesn't exist

// ✅ Fix
screen.clear()  // Correct method
```

**Suggestions:**

- Check if property name is correct
- Ensure API object supports this property
- Check API documentation for available properties

## Warning Codes

Warnings don't stop execution but indicate potential issues.

### Syntax Warnings (W1xxx)

#### W1001 - Assigning to API variable

**Cause:** Modifying read-only API variable

```lua
// ⚠️ Warning
screen = {}  // screen is an API variable

// ✅ Fix
localScreen = {}  // Use local variable
```

**Suggestions:**

- Use local variable
- Check if you meant to use a different variable

## Stack Trace

Stack trace shows the sequence of function calls that caused the error:

```text
[E2001] Undefined variable 'x'
  at scripts/main.loot:15:8
  at updateGame (scripts/game.loot:42:5)
  at update (scripts/main.loot:10:2)
```

**Reading stack trace:**

1. First line: Error message and location
2. Following lines: Call stack (from inner to outer)
3. Format: `at functionName (file:line:column)`

## Error Types

Errors have a `type` field indicating when the error occurred:

| Type | Description |
|------|-------------|
| `init` | Error when `init()` is called |
| `update` | Error when `update()` is called |
| `draw` | Error when `draw()` is called |
| `scene` | Error in scene lifecycle |
| `compile` | Error during compilation |

## Debugging Tips

### 1. Read Error Message Carefully

Error messages usually explain the problem. Read carefully before searching for solutions.

### 2. Check Error Location

Errors show `file:line:column`. Open that file and check the mentioned line.

### 3. Use Stack Trace

Stack trace shows the call sequence. Use it to understand program flow.

### 4. Check Console

Errors are also displayed in the browser console. Open DevTools (F12) to see more details.

### 5. Use Print for Debug

Add `print()` statements to see variable values:

```lua
update = function()
  print("playerX: " + playerX)  // Debug output
  playerX += 1
end
```

### 6. Check Asset Loading

Ensure assets are loaded before use:

```lua
init = function()
  Assets.loadImage("player.png", function(image)
    playerSprite = image
  end)
end

update = function()
  if playerSprite then
    screen.drawSprite(playerSprite, 0, 0)
  end
end
```

### 7. Validate Input

Always validate input before use:

```lua
divide = function(a, b)
  if b == 0 then
    print("Error: Division by zero")
    return 0
  end
  return a / b
end
```

## Common Patterns

### Error Handling Pattern

```lua
// Check if asset exists before use
if playerSprite then
  screen.drawSprite(playerSprite, x, y)
else
  print("Warning: Player sprite not loaded")
end
```

### Null Check Pattern

```lua
// Check if variable exists
if player then
  player.x += 1
else
  print("Error: Player not initialized")
end
```

## Getting Help

If the error is still unclear:

1. **Check documentation** - See [API Reference](/api)
2. **Check examples** - See examples in `examples/` folder
3. **Check console** - Open browser DevTools for more details
4. **Check stack trace** - Use stack trace to understand program flow
