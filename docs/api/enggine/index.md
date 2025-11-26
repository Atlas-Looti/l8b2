# How l8b Works

Understanding how l8b works under the hood can help you write better games and debug issues.

## The Engine

l8b automatically handles all the complex parts of running a game in the browser:

### ⚙️ Game Loop
- Runs your `update()` and `draw()` functions 60 times per second
- Maintains consistent timing across different devices
- Handles frame skipping if performance drops

### 🎯 LootiScript Execution
- Parses your `.loot` files
- Executes your game code efficiently
- Provides helpful error messages

### 📺 Screen Management
- Sets up the canvas automatically
- Handles window resizing
- Manages coordinate systems

## What This Means for You

You don't need to worry about:
- ❌ Setting up requestAnimationFrame
- ❌ Managing delta time
- ❌ Creating canvas elements
- ❌ Handling browser compatibility

You just focus on:
- ✅ Writing your game logic in `update()`
- ✅ Drawing your game in `draw()`
- ✅ Using the provided APIs

## Performance Tips

l8b is designed to be fast, but you can help:

1. **Keep update() efficient** - It runs 60 times per second
2. **Minimize draw calls** - Batch similar operations
3. **Cache calculations** - Don't recalculate the same values
4. **Use browser DevTools** - Profile your game to find bottlenecks

## Example: Optimized Game Loop

```lootiscript
// ❌ Bad: Recalculating every frame
function draw() {
  let centerX = canvas.width / 2
  let centerY = canvas.height / 2
  canvas.fillCircle(centerX, centerY, 50, "red")
}

// ✅ Good: Calculate once
let centerX = 400
let centerY = 300

function draw() {
  canvas.fillCircle(centerX, centerY, 50, "red")
}
```

## Debugging

Use browser DevTools (F12) to debug your game:

- **Console** - See error messages and use `console.log()`
- **Debugger** - Set breakpoints (though LootiScript support is limited)
- **Performance** - Profile frame rates and identify slowdowns

## Next Steps

- Learn about [Core APIs](/api/core/)
- Explore [Framework Features](/api/framework/)
- Check out [Examples](/examples/)
