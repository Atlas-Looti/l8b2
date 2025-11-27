# Quick Start

Panduan ini akan membantu Anda memulai project game pertama Anda dengan L8B. Untuk gambaran umum tentang L8B, lihat [Apa itu L8B?](/).

## Setup Project

### Instalasi

Install L8B CLI sebagai dev dependency:

```bash
npm install @l8b/cli --save-dev
```

**Catatan:** Runtime tidak perlu di-install secara terpisah. CLI akan otomatis menggunakan runtime dari workspace (jika menggunakan monorepo) atau akan di-bundle saat build.

### Struktur Project

L8B menggunakan struktur project yang standar:

```text
my-game/
├── scripts/              # File LootiScript (.loot)
│   └── main.loot         # Main game code
├── public/               # Static assets
│   ├── sprites/          # Sprite images (.png, .jpg, .webp)
│   ├── maps/             # Map files (.json, .tmj)
│   ├── sounds/           # Sound effects (.mp3, .wav, .ogg)
│   ├── music/            # Music files (.mp3, .wav, .ogg)
│   └── fonts/            # Font files (.ttf)
├── l8b.config.json       # Project configuration
├── package.json
└── .l8b/                 # Build output (generated)
```

**Catatan:** File `.loot` juga bisa ditempatkan di `src/l8b/ls/` sebagai alternatif.

### Configuration

File `l8b.config.json` di root project digunakan untuk mengatur metadata dan behavior:

```json
{
  "name": "my-game",
  "orientation": "any",
  "aspect": "free",
  "dev": {
    "port": 5173,
    "host": "localhost"
  },
  "logging": {
    "browser": { "lifecycle": false, "canvas": false },
    "terminal": { "listener": true, "errors": true }
  }
}
```

**Options:**

- `name`: Nama project (identifier)
- `orientation`: Orientasi layar (`any`, `portrait`, `landscape`)
- `aspect`: Rasio aspek layar (`free`, `16:9`, `4:3`, dll)
- `dev.port`: Port untuk development server (default: 5173)
- `dev.host`: Host untuk development server (default: "localhost")
- `logging`: Konfigurasi output debug di browser dan terminal

### Package.json

Tambahkan scripts untuk development dan build di `package.json`:

```json
{
  "name": "my-game",
  "type": "module",
  "scripts": {
    "dev": "l8b dev",
    "build": "l8b build",
    "start": "l8b start"
  },
  "devDependencies": {
    "@l8b/cli": "workspace:*"
  }
}
```

**Catatan:** Untuk workspace/monorepo, gunakan `workspace:*`. Untuk npm registry, gunakan versi yang sesuai seperti `"@l8b/cli": "^0.0.1"`.

**Commands:**

- `npm run dev` atau `l8b dev`: Menjalankan development server dengan HMR (Hot Module Replacement)
- `npm run build` atau `l8b build`: Build project untuk production (output ke `.l8b/`)
- `npm run start` atau `l8b start`: Preview hasil build production

**Development Server Options:**

```bash
l8b dev [root]              # Start dev server
l8b dev --port 3000         # Custom port
l8b dev --host 0.0.0.0      # Expose to network
```

### Integrasi dengan Code Editor

#### VSCode

Untuk pengalaman development yang optimal, install **LootiScript extension** untuk VSCode:

1. Buka VSCode
2. Tekan `Ctrl+Shift+X` (atau `Cmd+Shift+X` di Mac) untuk membuka Extensions
3. Cari "LootiScript"
4. Klik **Install**

**Fitur extension:**

- ✅ Syntax highlighting untuk file `.loot`
- ✅ Code completion dan IntelliSense
- ✅ Error detection dan diagnostics
- ✅ Code snippets untuk pattern umum
- ✅ Formatting support

## First Program

Buat file `scripts/main.loot` dan mulai dengan program sederhana:

```lua
init = function()
  x = 0
  y = 0
end

update = function()
  if keyboard.LEFT then x -= 1 end
  if keyboard.RIGHT then x += 1 end
  if keyboard.UP then y += 1 end
  if keyboard.DOWN then y -= 1 end
end

draw = function()
  screen.fillRect(0, 0, screen.width, screen.height, "#000")
  screen.drawSprite("player", x, y, 32, 32)
end
```

## Lifecycle Functions

l8b menggunakan 3 fungsi utama untuk game loop:

### `init()`

Dipanggil **sekali** saat program dimulai. Gunakan untuk inisialisasi variabel dan state awal.

```lua
init = function()
  score = 0
  level = 1
  player_x = 0
  player_y = 0
  enemies = []
end
```

### `update()`

Dipanggil **60 kali per detik**. Tempat terbaik untuk:

- Game logic dan physics
- Movement dan collision detection
- Input handling (keyboard, mouse, gamepad)
- State changes

```lua
update = function()
  // Update player position
  if keyboard.UP then player_y += 1 end
  if keyboard.DOWN then player_y -= 1 end
  
  // Update enemies
  for enemy in enemies
    enemy.update()
  end
  
  // Check collisions
  checkCollisions()
end
```

### `draw()`

Dipanggil **setiap frame** (biasanya 60 FPS, tapi bisa berbeda tergantung device). Gunakan untuk rendering:

```lua
draw = function()
  // Clear screen
  screen.fillRect(0, 0, screen.width, screen.height, "#000")
  
  // Draw player
  screen.drawSprite("player", player_x, player_y, 32, 32)
  
  // Draw enemies
  for enemy in enemies
    screen.drawSprite("enemy", enemy.x, enemy.y, 32, 32)
  end
  
  // Draw UI
  screen.drawText("Score: " + score, -screen.width/2 + 10, screen.height/2 - 20, 16, "#FFF")
end
```

**Penting:** `update()` selalu dipanggil 60x/detik, sedangkan `draw()` dipanggil sesuai refresh rate device.

### Execution Order

Urutan eksekusi dalam satu frame:

1. **Input Update** - Input devices (keyboard, mouse, touch, gamepad) diupdate
2. **Scene Update** - Jika ada scene aktif, `scene.update()` dipanggil, jika tidak `update()` global dipanggil
3. **Scene Draw** - Jika ada scene aktif, `scene.draw()` dipanggil, jika tidak `draw()` global dipanggil

```lua
// Execution flow per frame:
// 1. Input update
// 2. update() atau scene.update()
// 3. draw() atau scene.draw()
```

**Catatan:** Jika menggunakan Scene Management, lifecycle scene (`init`, `onEnter`, `onLeave`, `update`, `draw`) akan dipanggil sesuai dengan scene yang aktif.

## Input Handling

### Keyboard

```lua
update = function()
  if keyboard.LEFT then x -= 2 end
  if keyboard.RIGHT then x += 2 end
  if keyboard.UP then y += 2 end
  if keyboard.DOWN then y -= 2 end
  
  if keyboard.SPACE then shoot() end
end
```

### Mouse

```lua
update = function()
  // Mouse position
  player_x = mouse.x
  player_y = mouse.y
  
  // Mouse click
  if mouse.press then
    shoot(mouse.x, mouse.y)
  end
end
```

### Touch (Mobile)

```lua
update = function()
  if touch.touching then
    player_x = touch.x
    player_y = touch.y
  end
end
```

## Scheduler Blocks

l8b menyediakan fitur scheduler yang powerful untuk time-based operations:

### `after` - Delayed Execution

```lua
init = function()
  // Spawn enemy after 3 seconds
  after 3 seconds do
    spawnEnemy()
  end
end
```

### `every` - Repeated Execution

```lua
init = function()
  // Spawn enemy every 5 seconds
  every 5 seconds do
    spawnEnemy()
  end
  
  // Update score every second
  every 1 second do
    score += 10
  end
end
```

### `sleep` - Pause Execution

```lua
playCutscene = function()
  showDialogue("Welcome!")
  sleep 2 seconds
  
  showDialogue("Let's start the game")
  sleep 2 seconds
  
  startGame()
end
```

## Working with Sprites

### Load Sprite

```lua
init = function()
  // Sprites loaded automatically from assets/sprites/
  player_sprite = sprites.player
end
```

### Draw Sprite

```lua
draw = function()
  // drawSprite(name, x, y, width, height)
  screen.drawSprite("player", x, y, 32, 32)
  
  // With rotation
  screen.drawSprite("player", x, y, 32, 32, rotation)
end
```

## Classes & Objects

Gunakan classes untuk mengorganisir code:

```lua
Enemy = class
  constructor = function(x, y)
    this.x = x
    this.y = y
    this.hp = 100
    this.speed = 1
  end
  
  update = function()
    // Move towards player
    if this.x < player_x then this.x += this.speed end
    if this.x > player_x then this.x -= this.speed end
  end
  
  takeDamage = function(damage)
    this.hp -= damage
    if this.hp <= 0 then
      this.destroy()
    end
  end
  
  destroy = function()
    // Remove from enemies list
    enemies.removeElement(this)
  end
end

// Create enemy
init = function()
  enemies = []
  enemies.push(new Enemy(100, 100))
  enemies.push(new Enemy(-100, 50))
end
```

## Arrow Functions

Gunakan arrow functions untuk code yang lebih ringkas:

```lua
// Traditional function
enemies.forEach(function(e) e.update() end)

// Arrow function
enemies.forEach(e => e.update())

// Multiple parameters
bullets.forEach((b, i) => {
  b.update()
  if b.isOffScreen() then bullets.removeAt(i) end
})
```

## Console & Debugging

### Print to Console

Fungsi `print()` mengirim output ke browser console dan terminal:

```lua
update = function()
  print("Player position: " + player_x + ", " + player_y)
  print("Score: " + score)
  
  // Print multiple values
  print("Health:", hp, "Mana:", mana)
end
```

**Output:**

- Browser: Lihat di Developer Tools Console (F12)
- Terminal: Output muncul di terminal tempat dev server berjalan

### Interactive Console

L8B menyediakan interactive console untuk debugging saat development. Anda bisa:

1. **Inspect Variables** - Ketik nama variable untuk melihat nilainya
2. **Execute Commands** - Jalankan kode LootiScript langsung dari console
3. **Call Functions** - Panggil fungsi yang sudah didefinisikan

```lua
// Di browser console atau terminal:
> player_x
150

> score
1250

> enemies.length
3

> enemies[0].hp
100

// Execute code
> x = 50
> y = 100

// Call functions
> spawnEnemy(100, 200)
```

### Error Handling & Stack Trace

Ketika terjadi error, L8B akan menampilkan stack trace yang detail:

```lua
// Contoh error
update = function()
  local enemy = enemies[0]
  enemy.hp -= damage  // Error jika enemies kosong!
end
```

**Error Output:**

```text
Error: Cannot read property 'hp' of undefined
  at update (main.loot:15:3)
  at RuntimeOrchestrator.update (orchestrator.ts:483:5)
Stack trace:
  1. update() - main.loot:15
  2. RuntimeOrchestrator.update() - orchestrator.ts:483
```

### Debugging Tips

#### 1. Gunakan print() untuk tracing

```lua
update = function()
  print("Frame:", system.time)
  print("Player:", player_x, player_y)
  print("Enemies:", enemies.length)
end
```

#### 2. Check variable values

```lua
// Di console, ketik:
> player_x
> enemies
> GameState.current
```

#### 3. Test functions

```lua
// Di console, panggil fungsi:
> calculateDistance(0, 0, 10, 10)
> spawnEnemy(100, 100)
```

#### 4. Inspect objects

```lua
// Di console:
> player
{ x: 0, y: 0, hp: 100, speed: 2 }

> player.hp
100
```

## Best Practices

### 1. Use Local Variables

```lua
update = function()
  local dx = player_x - enemy_x
  local dy = player_y - enemy_y
  local distance = sqrt(dx * dx + dy * dy)
  
  if distance < 50 then
    // Collision!
  end
end
```

### 2. Organize with Classes

```lua
Player = class
  constructor = function()
    this.x = 0
    this.y = 0
    this.hp = 100
  end
  
  update = function()
    this.handleInput()
    this.checkCollisions()
  end
  
  handleInput = function()
    if keyboard.LEFT then this.x -= 2 end
    if keyboard.RIGHT then this.x += 2 end
  end
end
```

### 3. Separate Concerns

```lua
// Game state management
GameState = object
  current = "menu"
  
  setState = function(newState)
    this.current = newState
  end
end

update = function()
  if GameState.current == "menu" then
    updateMenu()
  elsif GameState.current == "playing" then
    updateGame()
  elsif GameState.current == "gameover" then
    updateGameOver()
  end
end
```

### 4. Use Scheduler for Timing

```lua
// ❌ Manual timing (complicated)
init = function()
  spawn_timer = 0
end

update = function()
  spawn_timer += 1
  if spawn_timer >= 300 then  // 5 seconds at 60 FPS
    spawnEnemy()
    spawn_timer = 0
  end
end

// ✅ Scheduler (simple)
init = function()
  every 5 seconds do
    spawnEnemy()
  end
end
```

## Next Steps

Sekarang Anda sudah memahami dasar-dasar l8b! Selanjutnya:

1. **Explore LootiScript** - Pelajari lebih dalam tentang bahasa LootiScript di [LootiScript Programming](/fundamentals/looti-script-programming)
2. **API Reference** - Lihat semua API yang tersedia di [API Reference](/fundamentals/api-reference)
3. **Cheatsheet** - Gunakan [LootiScript Cheatsheet](/quick-reference/lootiscript-cheatsheet) sebagai quick reference

Selamat membuat game! 🎮
