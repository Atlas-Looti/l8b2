# Contoh Code yang Memunculkan Error & Warning di VSCode

File ini berisi contoh-contoh code LootiScript yang akan memunculkan error dan warning di Problems panel VSCode.

## 📋 Daftar Error Codes

### 1. Syntax Errors (E1xxx) - Muncul di Editor

#### ❌ E1001: Missing closing brace
```lootiscript
function test() {
    print("test")
    // Missing closing brace }
```

#### ❌ E1002: Unexpected token / Missing closing parenthesis
```lootiscript
function test2() {
    print("test" // Missing closing parenthesis
}
```

#### ❌ E1004: Invalid syntax
```lootiscript
if true then // Missing condition
    print("test")
end
```

#### ❌ E1001: Unclosed string
```lootiscript
print("Hello world // Missing closing quote
```

### 2. API Validation Errors (E7xxx) - Muncul di Editor

#### ❌ API1001: Unknown property on screen
```lootiscript
screen.invalidProperty = 100
screen.wrongMethod()
```

**Error yang muncul:**
- `Unknown property 'invalidProperty' on screen`
- `Unknown property 'wrongMethod' on screen`

#### ❌ API1001: Unknown property on audio
```lootiscript
audio.nonExistentMethod()
audio.invalidProperty
```

#### ❌ API1001: Unknown property on sprites
```lootiscript
sprites.player.invalidProperty
sprites.enemy.wrongMethod()
```

#### ❌ API1001: Unknown property on map
```lootiscript
map.level1.invalidTile
map.level1.wrongMethod()
```

#### ❌ API1001: Unknown property on input
```lootiscript
input.invalidMethod()
keyboard.nonExistentProperty
```

### 3. Runtime Errors (E2xxx) - Muncul saat Runtime, BUKAN di Editor

#### ⚠️ E2001: Division by zero
```lootiscript
function divide() {
    local a = 10
    local b = 0
    local result = a / b // E2001: Division by zero
    return result
}
```

#### ⚠️ E2002: Array index out of bounds
```lootiscript
function arrayAccess() {
    local arr = [1, 2, 3]
    local value = arr[10] // E2002: Index out of bounds
    return value
}
```

### 4. Compilation Errors (E3xxx) - Muncul saat Compile

#### ❌ E3001: File not found
```lootiscript
// import "non-existent-file.loot"
```

### 5. Scene Errors (E5xxx) - Muncul saat Runtime

#### ⚠️ E5001: Scene not found
```lootiscript
// scene.activate("non-existent-scene")
```

## ✅ Contoh Code yang Benar

```lootiscript
function correctExample() {
    // ✅ Syntax benar
    print("Hello World")
    
    // ✅ Screen API benar
    screen.width = 320
    screen.height = 240
    screen.setColor("#FF0000")
    screen.fillRect(10, 10, 100, 100)
    
    // ✅ Audio API benar
    audio.playSound("jump")
    audio.playMusic("background")
    
    // ✅ Sprite API benar
    sprites.player.x = 100
    sprites.player.y = 200
    sprites.player.visible = true
    
    // ✅ Map API benar
    map.level1.width = 20
    map.level1.height = 15
    local tile = map.level1.get(5, 5)
    
    // ✅ Input API benar
    if keyboard.KEY_W then
        print("W pressed")
    end
    
    if mouse.left then
        print("Mouse clicked")
    end
    
    return true
}
```

## 📊 Error Display di VSCode

### Problems Panel
- Semua errors dan warnings akan muncul di Problems panel
- Dapat di-filter berdasarkan severity (Error, Warning, Info)
- Dapat di-sort berdasarkan file, severity, atau code

### Status Bar
- Icon akan berubah sesuai dengan jumlah errors/warnings
- `$(pass) L8B` - No problems
- `$(warning) L8B` - Ada warnings
- `$(error) L8B` - Ada errors

### Hover
- Hover di atas error akan menampilkan:
  - Error code (E1001, API1001, dll)
  - Error message
  - Suggestions (jika ada)
  - Related information

### Editor
- Underline merah untuk errors
- Underline kuning untuk warnings
- Squiggly lines menunjukkan lokasi error

## 🎯 Testing

1. Buka file `.loot` di VSCode
2. Ketik code yang salah (contoh di atas)
3. Lihat Problems panel (Ctrl+Shift+M / Cmd+Shift+M)
4. Hover di atas error untuk melihat detail
5. Status bar akan menampilkan jumlah errors/warnings

