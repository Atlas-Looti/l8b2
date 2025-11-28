# @l8b/audio

**LootiScript API Binding** - Audio playback for sound effects, music, and synthesized beeps.

> **Note**: This package is used as an API binding for LootiScript in the l8b engine.

## API Reference

### Audio.playSound()
Play a sound effect with optional parameters.

```lua
// Basic usage
Audio.playSound("jump.wav")

// With volume (0.0 to 1.0)
Audio.playSound("explosion.wav", 0.8)

// With volume and pitch (0.5 to 2.0)
Audio.playSound("coin.wav", 1.0, 1.5)

// With volume, pitch, and pan (-1.0 to 1.0)
Audio.playSound("footstep.wav", 0.7, 1.0, -0.5)

// With all parameters including loop
Audio.playSound("engine.wav", 0.9, 1.0, 0, true)

// Returns sound ID (number)
local soundId = Audio.playSound("laser.wav")
```

**Parameters:**
- `sound` (string) - Sound file name
- `volume` (number, optional) - Volume level 0.0-1.0, default: 1.0
- `pitch` (number, optional) - Pitch 0.5-2.0, default: 1.0
- `pan` (number, optional) - Stereo pan -1.0 (left) to 1.0 (right), default: 0
- `loop` (boolean, optional) - Loop the sound, default: false

**Returns:** Sound ID (number)

### Audio.playMusic()
Play background music with optional looping.

```lua
// Basic usage
Audio.playMusic("theme.mp3")

// With volume
Audio.playMusic("battle.mp3", 0.6)

// With volume and loop
Audio.playMusic("menu.mp3", 0.8, true)

// Returns music ID (number)
local musicId = Audio.playMusic("credits.mp3", 1.0, false)
```

**Parameters:**
- `music` (string) - Music file name
- `volume` (number, optional) - Volume level 0.0-1.0, default: 1.0
- `loop` (boolean, optional) - Loop the music, default: false

**Returns:** Music ID (number)

### Audio.beep()
Play synthesized beep sequences.

```lua
// Single note
Audio.beep("C4")

// Multiple notes
Audio.beep("C4 E4 G4")

// With duration (in seconds)
Audio.beep("A3 0.1, B3 0.1, C4 0.2")

// Complex melody
Audio.beep("C4 0.25, D4 0.25, E4 0.25, F4 0.5")
```

**Note Format:**
- Note names: `C`, `D`, `E`, `F`, `G`, `A`, `B`
- Octaves: `0-8` (e.g., `C4`, `A3`)
- Sharps: `#` (e.g., `C#4`, `F#3`)
- Duration: Optional number after note (in seconds)
- Separator: Space or comma

### Audio.cancelBeeps()
Stop all currently playing beeps and sounds.

```lua
// Stop everything
Audio.cancelBeeps()
```

## Sound File Formats

Supported audio formats:
- `.wav` - Uncompressed audio
- `.mp3` - Compressed audio
- `.ogg` - Compressed audio (recommended for web)

## File Paths

All audio paths are relative to the `assets/` directory:

```lua
// Loads from: assets/sounds/jump.wav
Audio.playSound("sounds/jump.wav")

// Loads from: assets/music/theme.mp3
Audio.playMusic("music/theme.mp3")
```

## Volume Control

Volume values range from 0.0 (silent) to 1.0 (full volume):

```lua
Audio.playSound("quiet.wav", 0.3)   // 30% volume
Audio.playSound("normal.wav", 0.7)  // 70% volume
Audio.playSound("loud.wav", 1.0)    // 100% volume
```

## Pitch Control

Pitch values range from 0.5 (half speed, lower pitch) to 2.0 (double speed, higher pitch):

```lua
Audio.playSound("voice.wav", 1.0, 0.5)  // Lower pitch
Audio.playSound("voice.wav", 1.0, 1.0)  // Normal pitch
Audio.playSound("voice.wav", 1.0, 2.0)  // Higher pitch
```

## Pan Control

Pan values range from -1.0 (left) to 1.0 (right):

```lua
Audio.playSound("left.wav", 1.0, 1.0, -1.0)   // Left speaker
Audio.playSound("center.wav", 1.0, 1.0, 0.0)  // Center
Audio.playSound("right.wav", 1.0, 1.0, 1.0)   // Right speaker
```
