# Error Cheatsheet

Quick reference untuk memahami dan men-debug error di L8B.

## Error Format

Error di L8B memiliki format berikut:

```text
[Code] Message
  at file:line:column
```

Contoh:

```text
[E2001] Undefined variable 'playerX'
  at scripts/main.loot:15:8
```

## Error Code Categories

| Code Range | Category | Description |
|------------|----------|-------------|
| E1xxx | Syntax Errors | Kesalahan sintaks LootiScript |
| E2xxx | Runtime Errors | Error saat eksekusi program |
| E3xxx | Compilation Errors | Error saat kompilasi |
| E5xxx | Scene Errors | Error scene management |
| E6xxx | CLI Errors | Error command line tools |
| E7xxx | API Errors | Error API calls |

## Syntax Errors (E1xxx)

### E1001 - Unterminated function/block

**Penyebab:** Function atau block tidak ditutup dengan `end`

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

- Tambahkan `end` setelah statement terakhir
- Cek jika ada `end` ekstra di tempat lain
- Pastikan semua nested blocks (if, for, while) ditutup dengan benar

### E1002 - Too many 'end'

**Penyebab:** Terlalu banyak `end` statement

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

- Hapus `end` yang ekstra
- Cek jika ada statement pembuka (if, for, while, function) yang hilang

### E1003 - Missing 'end'

**Penyebab:** Block tidak ditutup dengan `end`

```lua
// ❌ Error
if x > 0 then
  print("positive")
  // Missing 'end'

// ✅ Fix
if x > 0 then
  print("positive")
end
```

**Suggestions:**

- Tambahkan `end` untuk menutup block
- Cek semua nested blocks ditutup dengan benar

### E1004 - Unexpected token

**Penyebab:** Token tidak terduga ditemukan saat parsing

**Suggestions:**

- Cek syntax di sekitar lokasi error
- Pastikan menggunakan syntax yang benar untuk statement tersebut

### E1005 - Missing token

**Penyebab:** Token yang diperlukan tidak ditemukan

**Suggestions:**

- Cek jika ada keyword atau symbol yang hilang
- Pastikan syntax lengkap

### E1006 - Unexpected end of file

**Penyebab:** File berakhir saat parsing belum selesai

**Suggestions:**

- Cek jika ada statement penutup yang hilang
- Pastikan semua blocks ditutup dengan benar

### E1007 - Misuse of reserved keyword

**Penyebab:** Reserved keyword digunakan dengan salah

```lua
// ❌ Error
if = 5  // 'if' adalah reserved keyword

// ✅ Fix
condition = 5
```

**Suggestions:**

- Gunakan identifier name yang berbeda
- Cek konteks penggunaan keyword tersebut

### E1008 - Unterminated string

**Penyebab:** String tidak ditutup dengan quote

```lua
// ❌ Error
message = "Hello world  // Missing closing quote

// ✅ Fix
message = "Hello world"
```

**Suggestions:**

- Tambahkan closing quote untuk menutup string
- Cek escaped quotes di dalam string

### E1009 - Unterminated object/array

**Penyebab:** Object atau array tidak ditutup

```lua
// ❌ Error
data = {x: 10, y: 20  // Missing closing brace

// ✅ Fix
data = {x: 10, y: 20}
```

**Suggestions:**

- Tambahkan closing brace atau bracket
- Cek nested objects/arrays yang perlu ditutup terlebih dahulu

## Runtime Errors (E2xxx)

### E2001 - Undefined variable

**Penyebab:** Variable digunakan sebelum didefinisikan

```lua
// ❌ Error
print(playerX)  // playerX belum didefinisikan

// ✅ Fix
playerX = 100
print(playerX)
```

**Suggestions:**

- Cek jika nama variable benar
- Pastikan variable didefinisikan sebelum digunakan
- Cek scope variable

### E2002 - Type mismatch

**Penyebab:** Operasi dengan tipe data yang tidak kompatibel

```lua
// ❌ Error
result = "hello" + 5  // String + Number

// ✅ Fix
result = "hello" + string(5)  // Convert to string
// atau
result = 5 + 10  // Number + Number
```

**Suggestions:**

- Cek tipe operand
- Gunakan type conversion jika diperlukan

### E2003 - Division by zero

**Penyebab:** Pembagian dengan nol

```lua
// ❌ Error
result = 10 / 0

// ✅ Fix
if divisor != 0 then
  result = 10 / divisor
else
  result = 0
end
```

**Suggestions:**

- Cek divisor sebelum pembagian
- Tambahkan conditional check untuk mencegah division by zero

### E2004 - Function not found

**Penyebab:** Function dipanggil tapi tidak didefinisikan

```lua
// ❌ Error
updateGame()  // Function tidak ada

// ✅ Fix
updateGame = function()
  // implementation
end
updateGame()
```

**Suggestions:**

- Cek jika nama function benar
- Pastikan function didefinisikan sebelum dipanggil
- Cek scope function

### E2005 - Invalid operation

**Penyebab:** Operasi tidak valid dilakukan

**Suggestions:**

- Cek operasi dan operand-nya
- Pastikan operasi valid untuk tipe data yang diberikan

## Compilation Errors (E3xxx)

### E3001 - Compilation failed

**Penyebab:** Proses kompilasi menemukan error

**Suggestions:**

- Cek error messages di atas untuk detail
- Perbaiki error yang dilaporkan dan coba lagi

### E3002 - File not found

**Penyebab:** File yang diperlukan tidak ditemukan

**Suggestions:**

- Cek jika path file benar
- Pastikan file ada di lokasi yang ditentukan

### E3003 - Parse error

**Penyebab:** Source code tidak bisa di-parse

**Suggestions:**

- Cek syntax source code
- Cari syntax errors di file

## Scene Errors (E5xxx)

### E5001 - Invalid path

**Penyebab:** Path route tidak valid

```lua
// ❌ Error
route("", "menu")  // Empty path

// ✅ Fix
route("/", "menu")  // Valid path
```

**Suggestions:**

- Cek format path
- Pastikan path valid

### E5002 - Invalid scene name

**Penyebab:** Nama scene tidak valid

**Suggestions:**

- Cek format nama scene
- Pastikan nama scene valid

### E5003 - Invalid scene definition

**Penyebab:** Scene didefinisikan dengan konfigurasi tidak valid

**Suggestions:**

- Cek syntax definisi scene
- Pastikan semua property yang diperlukan disediakan

### E5004 - Scene not found

**Penyebab:** Scene yang diminta tidak ditemukan

```lua
// ❌ Error
router.push("/game")  // Scene 'game' tidak ada

// ✅ Fix
scene("game", {
  init = function()
    // ...
  end
})
route("/game", "game")
router.push("/game")
```

**Suggestions:**

- Cek jika scene sudah terdaftar
- Pastikan nama scene benar

### E5005 - No route matched

**Penyebab:** Tidak ada route yang cocok dengan path

**Suggestions:**

- Cek jika route ada untuk path ini
- Pastikan format path cocok dengan pattern route

### E5006 - No scenes registered

**Penyebab:** Tidak ada scene yang terdaftar di router

**Suggestions:**

- Daftarkan setidaknya satu scene sebelum menggunakan router
- Cek jika registrasi scene dipanggil

### E5007 - Scene has no draw function

**Penyebab:** Scene tidak punya `draw()` function

```lua
// ❌ Error
scene("menu", {
  init = function()
    // No draw function
  end
})

// ✅ Fix
scene("menu", {
  init = function()
    // ...
  end,
  draw = function()
    screen.clear()
    // ...
  end
})
```

**Suggestions:**

- Tambahkan `draw()` function ke scene
- Cek jika nama function benar

## CLI Errors (E6xxx)

### E6001 - Configuration error

**Penyebab:** Error saat memproses konfigurasi

**Suggestions:**

- Cek file konfigurasi
- Pastikan semua opsi konfigurasi yang diperlukan ada

### E6002 - Build error

**Penyebab:** Error saat proses build

**Suggestions:**

- Cek build output untuk detail
- Perbaiki error yang dilaporkan dan coba lagi

### E6003 - Server error

**Penyebab:** Error di development server

**Suggestions:**

- Cek server logs untuk detail
- Restart development server

## API Errors (E7xxx)

### Screen API Errors (E7001-E7010)

#### E7001 - Failed to get 2D canvas context

**Penyebab:** Browser tidak bisa membuat 2D rendering context untuk canvas

**Suggestions:**

- Cek jika canvas element valid
- Pastikan browser mendukung canvas 2D rendering
- Cek konflik canvas context

#### E7002 - Invalid canvas dimensions

**Penyebab:** Dimensi canvas tidak valid (nol atau negatif)

**Suggestions:**

- Pastikan width dan height adalah angka positif
- Cek jika canvas diinisialisasi dengan benar

#### E7003 - Invalid color format

**Penyebab:** Format warna tidak valid

```lua
// ❌ Error
screen.setColor("red")  // Format tidak valid

// ✅ Fix
screen.setColor("#FF0000")  // Hex format
screen.setColor(palette.get(1))  // Palette index
```

**Suggestions:**

- Gunakan format hex: '#RRGGBB' atau '#RGB'
- Gunakan named colors: 'red', 'blue', dll
- Gunakan format numeric untuk palette colors

#### E7004 - Sprite not found

**Penyebab:** Sprite tidak ada di sprite collection

```lua
// ❌ Error
screen.drawSprite("nonexistent", 0, 0)

// ✅ Fix
// Pastikan sprite sudah di-load
sprites.player = new Sprite("player.png")
screen.drawSprite("player", 0, 0)
```

**Suggestions:**

- Cek jika nama sprite benar
- Pastikan sprite di-load sebelum digunakan
- Cek namespace sprite

#### E7005 - Sprite not ready

**Penyebab:** Sprite ada tapi belum selesai loading

**Suggestions:**

- Tunggu sprite selesai loading
- Cek `sprite.ready` sebelum digunakan
- Gunakan callback atau promise untuk menunggu loading

#### E7006 - Invalid font

**Penyebab:** Nama font tidak valid atau tidak tersedia

**Suggestions:**

- Gunakan nama font yang valid
- Cek jika font sudah di-load
- Gunakan fallback font

#### E7007 - Invalid blend mode

**Penyebab:** Blend mode tidak didukung

**Suggestions:**

- Gunakan blend mode yang valid: 'normal', 'additive', 'multiply', dll
- Cek daftar blend mode yang didukung

### Audio API Errors (E7011-E7020)

#### E7011 - Audio context creation failed

**Penyebab:** Browser tidak bisa membuat AudioContext

**Suggestions:**

- Cek jika browser mendukung Web Audio API
- Coba user interaction untuk mengaktifkan audio
- Cek browser console untuk detail lebih lanjut

#### E7012 - Audio worklet failed to start

**Penyebab:** Audio worklet processor tidak bisa diinisialisasi

**Suggestions:**

- Cek jika AudioWorklet didukung
- Pastikan kode worklet valid
- Cek browser console untuk errors

#### E7013 - Sound not found

**Penyebab:** Sound tidak ada di sound collection

```lua
// ❌ Error
sounds.jump.play()

// ✅ Fix
// Pastikan sound sudah di-load
sounds.jump = new Sound("jump.wav")
sounds.jump.play()
```

**Suggestions:**

- Cek jika nama sound benar
- Pastikan sound di-load sebelum digunakan
- Cek path file sound

#### E7014 - Music not found

**Penyebab:** Music tidak ada di music collection

**Suggestions:**

- Cek jika nama music benar
- Pastikan music di-load sebelum digunakan
- Cek path file music

#### E7015 - Audio context suspended

**Penyebab:** Audio context memerlukan user interaction untuk resume

**Suggestions:**

- Tunggu user interaction (click, touch, keypress)
- Context akan resume otomatis
- Cek jika audio autoplay diblokir

#### E7016 - Invalid audio parameters

**Penyebab:** Parameter audio playback tidak valid

**Suggestions:**

- Cek volume antara 0 dan 1
- Cek pitch adalah angka positif
- Cek pan antara -1 dan 1

### Sprite API Errors (E7021-E7030)

#### E7021 - Sprite loading failed

**Penyebab:** Sprite image tidak bisa di-load

**Suggestions:**

- Cek jika URL benar
- Pastikan file image ada
- Cek CORS settings jika loading dari domain berbeda
- Cek browser console untuk network errors

#### E7022 - Invalid sprite properties

**Penyebab:** Property sprite tidak valid

**Suggestions:**

- Cek frames adalah angka positif
- Cek fps adalah angka positif
- Pastikan semua property yang diperlukan diset

#### E7023 - Invalid sprite URL

**Penyebab:** URL sprite tidak valid atau malformed

**Suggestions:**

- Gunakan URL atau relative path yang valid
- Cek jika URL diformat dengan benar
- Pastikan file extension benar

#### E7024 - Sprite frame out of bounds

**Penyebab:** Frame index di luar range

**Suggestions:**

- Cek frame index antara 0 dan totalFrames-1
- Pastikan sprite punya jumlah frame yang diharapkan

### Map API Errors (E7031-E7040)

#### E7031 - Map canvas context failed

**Penyebab:** Tidak bisa mendapatkan 2D context untuk map rendering canvas

**Suggestions:**

- Cek jika canvas element valid
- Pastikan browser mendukung canvas

#### E7032 - Invalid tile coordinates

**Penyebab:** Koordinat tile di luar map bounds

**Suggestions:**

- Cek koordinat dalam dimensi map
- Pastikan map diinisialisasi dengan benar

#### E7033 - Tile sprite not found

**Penyebab:** Sprite untuk tile tidak ada

**Suggestions:**

- Cek jika nama sprite benar
- Pastikan sprite sudah di-load
- Cek definisi tile

#### E7034 - Invalid map dimensions

**Penyebab:** Dimensi map tidak valid

**Suggestions:**

- Pastikan width dan height adalah angka positif
- Cek inisialisasi map

### Asset API Errors (E7041-E7050)

#### E7041 - Asset not found

**Penyebab:** Asset yang diminta tidak ada

**Suggestions:**

- Cek jika nama asset benar
- Pastikan asset sudah di-load
- Cek urutan loading asset

#### E7042 - Asset loading failed

**Penyebab:** Asset tidak bisa di-load

**Suggestions:**

- Cek jika URL asset benar
- Pastikan file ada
- Cek koneksi network
- Cek CORS settings

#### E7043 - Invalid asset type

**Penyebab:** Tipe asset tidak didukung

**Suggestions:**

- Gunakan tipe asset yang didukung
- Cek dokumentasi tipe asset

#### E7044 - Asset not ready

**Penyebab:** Asset ada tapi belum selesai loading

**Suggestions:**

- Tunggu asset selesai loading
- Cek `asset.ready` sebelum digunakan

### Input API Errors (E7051-E7060)

#### E7051 - Input device not available

**Penyebab:** Input device yang diminta tidak tersedia

**Suggestions:**

- Cek jika device terhubung
- Pastikan browser permissions
- Cek dukungan device

#### E7052 - Invalid input state

**Penyebab:** Input state tidak valid atau corrupted

**Suggestions:**

- Reinisialisasi input system
- Cek koneksi input device

### Storage API Errors (E7061-E7070)

#### E7061 - Storage quota exceeded

**Penyebab:** Storage quota telah melebihi batas

**Suggestions:**

- Hapus data storage lama
- Kurangi jumlah data yang disimpan
- Cek batas storage quota

#### E7062 - Storage operation failed

**Penyebab:** Operasi storage tidak bisa diselesaikan

**Suggestions:**

- Cek storage permissions
- Pastikan storage tersedia
- Cek browser console untuk detail

#### E7063 - Invalid storage key

**Penyebab:** Storage key tidak valid

**Suggestions:**

- Gunakan format key yang valid
- Cek panjang dan karakter key

### Palette API Errors (E7071-E7080)

#### E7071 - Palette not found

**Penyebab:** Palette yang diminta tidak ada

```lua
// ❌ Error
palette.get(0)  // Palette belum dibuat

// ✅ Fix
palette = new Palette({colors: ["#000000", "#FFFFFF"]})
palette.get(0)
```

**Suggestions:**

- Cek jika nama palette benar
- Pastikan palette sudah di-load
- Cek urutan loading palette

#### E7072 - Invalid palette format

**Penyebab:** Format palette tidak didukung

**Suggestions:**

- Gunakan format palette yang didukung
- Cek dokumentasi format palette
- Pastikan format file palette benar

#### E7073 - Invalid color index

**Penyebab:** Color index di luar range palette

**Suggestions:**

- Cek color index dalam range palette
- Pastikan ukuran palette
- Gunakan color index yang valid

#### E7074 - Palette loading failed

**Penyebab:** Palette tidak bisa di-load

**Suggestions:**

- Cek jika file palette ada
- Pastikan format file palette benar
- Cek file permissions
- Cek koneksi network jika loading dari URL

#### E7075 - Invalid palette size

**Penyebab:** Ukuran palette tidak valid

**Suggestions:**

- Cek ukuran palette sesuai dengan yang diharapkan
- Pastikan data palette lengkap
- Cek inisialisasi palette

### Time API Errors (E7081-E7090)

#### E7081 - Invalid time value

**Penyebab:** Nilai time tidak valid atau di luar range

**Suggestions:**

- Cek nilai time adalah angka positif
- Pastikan time dalam range yang valid
- Cek format time

#### E7082 - Time playback failed

**Penyebab:** Operasi time playback tidak bisa diselesaikan

**Suggestions:**

- Cek jika time playback diinisialisasi
- Pastikan state playback
- Cek konflik operasi time

#### E7083 - Time recording failed

**Penyebab:** Operasi time recording tidak bisa diselesaikan

**Suggestions:**

- Cek jika time recording diinisialisasi
- Pastikan state recording
- Cek storage space yang tersedia

#### E7084 - Invalid time format

**Penyebab:** Format time tidak didukung

**Suggestions:**

- Gunakan format time yang didukung
- Cek dokumentasi format time
- Pastikan format string time benar

### Drawing API Errors (E7091-E7100)

#### E7091 - Drawing operation failed

**Penyebab:** Operasi drawing tidak bisa diselesaikan

**Suggestions:**

- Cek jika drawing context valid
- Pastikan parameter drawing
- Cek state canvas

#### E7092 - Invalid drawing context

**Penyebab:** Drawing context tidak valid atau tidak tersedia

**Suggestions:**

- Cek jika canvas context diinisialisasi
- Pastikan context tidak dihancurkan
- Reinisialisasi drawing context

#### E7093 - Invalid drawing parameters

**Penyebab:** Parameter drawing tidak valid

**Suggestions:**

- Cek nilai koordinat adalah angka yang valid
- Pastikan dimensi positif
- Cek nilai color valid
- Pastikan semua parameter yang diperlukan disediakan

### API Validation Errors (E7100-E7199)

#### E7100 - Unknown property

**Penyebab:** Property atau method yang tidak ada di API object diakses

```lua
// ❌ Error
screen.invalidMethod()  // Method tidak ada

// ✅ Fix
screen.clear()  // Method yang benar
```

**Suggestions:**

- Cek jika nama property benar
- Pastikan API object mendukung property ini
- Cek dokumentasi API untuk property yang tersedia

## Warning Codes

Warning tidak menghentikan eksekusi, tapi menunjukkan potensi masalah.

### Syntax Warnings (W1xxx)

#### W1001 - Assigning to API variable

**Penyebab:** Mengubah API variable yang read-only

```lua
// ⚠️ Warning
screen = {}  // screen adalah API variable

// ✅ Fix
localScreen = {}  // Gunakan local variable
```

**Suggestions:**

- Gunakan local variable
- Cek jika maksudnya menggunakan variable yang berbeda

#### W1002 - Assignment as condition

**Penyebab:** Assignment operator (=) digunakan sebagai condition

```lua
// ⚠️ Warning
if x = 5 then  // Seharusnya ==

// ✅ Fix
if x == 5 then  // Comparison
```

**Suggestions:**

- Gunakan == untuk comparison
- Cek jika maksudnya assign sebelum compare

### Runtime Warnings (W2xxx)

#### W2001 - Deprecated API usage

**Penyebab:** API yang deprecated digunakan

**Suggestions:**

- Update ke API baru
- Cek dokumentasi untuk migration guide

### Scene Warnings (W5xxx)

#### W5001 - Activating first available scene

**Penyebab:** Tidak ada route yang cocok, scene pertama diaktifkan

**Suggestions:**

- Daftarkan route untuk initial path
- Cek jika pattern route benar

#### W5002 - No route matched initial path

**Penyebab:** Initial path tidak cocok dengan route manapun

**Suggestions:**

- Daftarkan route untuk initial path
- Cek jika pattern route cocok dengan initial path

#### W5003 - No scenes registered

**Penyebab:** Tidak ada scene yang terdaftar

**Suggestions:**

- Daftarkan setidaknya satu scene
- Cek jika registrasi scene dipanggil

#### W5004 - No scenes before init

**Penyebab:** Router diinisialisasi sebelum scene terdaftar

**Suggestions:**

- Daftarkan scene sebelum memanggil router.init()
- Cek urutan inisialisasi

## Stack Trace

Stack trace menunjukkan urutan pemanggilan function yang menyebabkan error:

```text
[E2001] Undefined variable 'x'
  at scripts/main.loot:15:8
  at updateGame (scripts/game.loot:42:5)
  at update (scripts/main.loot:10:2)
```

**Membaca stack trace:**

1. Baris pertama: Error message dan lokasi
2. Baris berikutnya: Call stack (dari dalam ke luar)
3. Format: `at functionName (file:line:column)`

## Error Types

Error memiliki `type` field yang menunjukkan kapan error terjadi:

| Type | Description |
|------|-------------|
| `init` | Error saat `init()` dipanggil |
| `update` | Error saat `update()` dipanggil |
| `draw` | Error saat `draw()` dipanggil |
| `scene` | Error di scene lifecycle |
| `compile` | Error saat kompilasi |

## Debugging Tips

### 1. Baca Error Message dengan Teliti

Error message biasanya menjelaskan masalahnya. Baca dengan teliti sebelum mencari solusi.

### 2. Cek Lokasi Error

Error menunjukkan `file:line:column`. Buka file tersebut dan cek baris yang disebutkan.

### 3. Gunakan Stack Trace

Stack trace menunjukkan urutan pemanggilan. Gunakan untuk memahami alur program.

### 4. Cek Console

Error juga ditampilkan di browser console. Buka DevTools (F12) untuk melihat detail lebih lengkap.

### 5. Gunakan Print untuk Debug

Tambahkan `print()` statement untuk melihat nilai variable:

```lua
update = function()
  print("playerX: " + playerX)  // Debug output
  playerX += 1
end
```

### 6. Cek Asset Loading

Pastikan asset sudah di-load sebelum digunakan:

```lua
init = function()
  sprites.player = new Sprite("player.png")
  // Wait for asset to load
end

update = function()
  if sprites.player.ready then
    screen.drawSprite("player", 0, 0)
  end
end
```

### 7. Validasi Input

Selalu validasi input sebelum digunakan:

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
if sprites.player then
  screen.drawSprite("player", x, y)
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

### Type Check Pattern

```lua
// Check type before operation
if typeof(value) == "number" then
  result = value * 2
else
  print("Error: Expected number, got " + typeof(value))
end
```

## Getting Help

Jika error masih tidak jelas:

1. **Cek dokumentasi** - Lihat [API Reference](/fundamentals/api-reference)
2. **Cek contoh** - Lihat contoh di `examples/` folder
3. **Cek console** - Buka browser DevTools untuk detail lebih lengkap
4. **Cek stack trace** - Gunakan stack trace untuk memahami alur program
