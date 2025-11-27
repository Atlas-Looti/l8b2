# API Reference

Dokumentasi lengkap dan mendetail untuk API built-in l8b.

## Screen

Di l8b, layar direpresentasikan oleh objek predefined `screen`. Untuk menampilkan bentuk atau gambar di layar, Anda cukup memanggil fungsi (method) pada objek ini.

### Sistem Koordinat

Untuk memudahkan pekerjaan Anda, l8b secara otomatis menskalakan koordinat layar, terlepas dari resolusi tampilan sebenarnya.

- **Titik Asal (0,0)**: Berada tepat di **tengah layar**.
- **Skala**: Dimensi tampilan terkecil (lebar dalam mode portrait, tinggi dalam mode landscape) selalu dinormalisasi menjadi **200**.
- **Rentang**: Karena 0 ada di tengah, dimensi terkecil berkisar dari **-100 hingga +100**.

Dimensi terbesar akan menyesuaikan rasio aspek layar. Misalnya pada layar 16:9:

- Landscape: Y dari -100 s/d +100, X dari -178 s/d +178.
- Portrait: X dari -100 s/d +100, Y dari -178 s/d +178.

### Properties

| Property | Deskripsi |
|----------|-------------|
| `screen.width` | Lebar layar saat ini dalam unit koordinat l8b. |
| `screen.height` | Tinggi layar saat ini dalam unit koordinat l8b. |

### Warna & Tampilan

#### `screen.setColor(color)`

Mendefinisikan warna yang akan digunakan untuk pemanggilan fungsi menggambar berikutnya.

Warna didefinisikan sebagai string:

- **RGB**: `"rgb(255,0,0)"` (Merah terang), `"rgb(255,255,255)"` (Putih). Nilai 0-255.
- **Hex**: `"#FFF"` atau `"#FFFFFF"` (Putih), `"#F00"` (Merah).
- **Nama**: `"red"`, `"blue"`, `"white"`, dll (sesuai standar HTML5).

#### `screen.clear(color)`

Membersihkan layar (mengisinya dengan warna yang diberikan, atau hitam jika tidak ada warna yang diberikan).

```lua
screen.clear("#000") // Isi layar dengan hitam
```

#### `screen.setAlpha(opacity)`

Mendefinisikan tingkat opasitas (transparansi) keseluruhan untuk fungsi menggambar selanjutnya.

- `0`: Transparan total (tidak terlihat).
- `1`: Opasitas total (menutupi apa yang ada di bawahnya).

```lua
screen.setAlpha(0.5) // Elemen berikutnya akan semi-transparan
// ... menggambar sesuatu ...
screen.setAlpha(1)   // Reset ke default
```

#### `screen.setBlending(mode)`

Mendefinisikan bagaimana operasi menggambar selanjutnya akan dikomposisikan dengan gambar yang sudah ada.

- `"normal"`: Menimpa gambar di bawahnya (default).
- `"additive"`: Menambahkan nilai warna (efek cahaya/glowing).

### Menggambar Bentuk Dasar

#### `screen.fillRect(x, y, width, height, color)`

Menggambar persegi panjang **padat** (terisi warna).

- `x, y`: Koordinat pusat persegi panjang.
- `width, height`: Lebar dan tinggi.
- `color`: (Opsional) Warna isi. Jika dihilangkan, menggunakan warna terakhir.

#### `screen.drawRect(x, y, width, height, color)`

Menggambar **garis tepi** (outline) persegi panjang. Parameter sama dengan `fillRect`.

#### `screen.fillRound(x, y, width, height, color)`

Menggambar bentuk bulat padat (lingkaran atau elips tergantung dimensi).

- `x, y`: Koordinat pusat.
- `width, height`: Diameter horizontal dan vertikal.

#### `screen.drawRound(x, y, width, height, color)`

Menggambar garis tepi bentuk bulat.

#### `screen.drawLine(x1, y1, x2, y2, color)`

Menggambar garis lurus yang menghubungkan titik `(x1, y1)` dan `(x2, y2)`.

#### `screen.setLineWidth(width)`

Mengatur ketebalan garis untuk operasi `draw...` (outline) selanjutnya. Default adalah 1.

### Menggambar Bentuk Lanjut

#### `screen.fillPolygon(x1, y1, x2, y2, ..., color)`

Mengisi poligon yang didefinisikan oleh daftar koordinat titik.
Bisa juga menerima array sebagai argumen pertama: `screen.fillPolygon([x1, y1, x2, y2, ...], color)`.

#### `screen.drawPolyline(x1, y1, x2, y2, ..., color)`

Sama seperti polygon tapi garis tidak ditutup otomatis kembali ke titik awal.

#### `screen.drawArc(x, y, radius, startAngle, endAngle, counterClockwise, color)`

Menggambar busur lingkaran.

- `radius`: Jari-jari lingkaran.
- `startAngle, endAngle`: Sudut dalam **derajat**.

### Sprites & Maps

#### `screen.drawSprite(name, x, y, width, height)`

Menggambar sprite yang telah Anda buat di tab Sprites.

- `name`: Nama sprite (string), contoh `"player"`.
- `x, y`: Koordinat pusat sprite.
- `width`: Lebar tampilan.
- `height`: (Opsional) Tinggi tampilan. Jika dihilangkan, akan dihitung proporsional.

**Animated Sprites**:
Jika sprite memiliki animasi, l8b otomatis memutar frame yang sesuai.

- `sprites["name"].setFrame(0)`: Reset animasi ke frame awal.
- `screen.drawSprite("name.0", ...)`: Menggambar frame spesifik (frame 0).

#### `screen.drawMap(name, x, y, width, height)`

Menggambar map yang dibuat di tab Maps.

- `name`: Nama map.
- `x, y`: Koordinat pusat tampilan map.
- `width, height`: Ukuran tampilan map di layar.

### Teks

#### `screen.drawText(text, x, y, size, color)`

Menampilkan teks di layar.

- `text`: String teks yang akan ditampilkan.
- `x, y`: Koordinat pusat teks.
- `size`: Tinggi teks.

#### `screen.setFont(fontName)`

Mengatur font untuk panggilan `drawText` selanjutnya.
Contoh font bawaan: `"BitCell"`, `"DigitalDisco"`, `"PressStart2P"`, dll.

#### `screen.loadFont(fontName)`

Memulai proses loading font. Font harus diload sebelum bisa digunakan dengan sempurna. Gunakan `screen.isFontReady(fontName)` untuk mengecek statusnya.

### Transformasi Layar

Fungsi-fungsi ini mengubah sistem koordinat untuk operasi menggambar selanjutnya. **Penting:** Selalu reset kembali nilai transformasi setelah selesai menggambar bagian yang diinginkan.

#### `screen.setTranslation(tx, ty)`

Menggeser titik asal koordinat.

```lua
screen.setTranslation(50, 50)
// Menggambar di (0,0) sekarang akan muncul di (50,50)
screen.setTranslation(0, 0) // Reset
```

#### `screen.setRotation(angle)`

Memutar seluruh sistem koordinat sebesar `angle` derajat.

```lua
screen.setRotation(45)
// Gambar miring 45 derajat
screen.setRotation(0) // Reset
```

#### `screen.setScale(x, y)`

Memperbesar/memperkecil sistem koordinat.

```lua
screen.setScale(2, 2) // Zoom 2x
screen.setScale(1, 1) // Reset
```

### Transformasi Objek (Draw Parameters)

Berbeda dengan transformasi layar, fungsi ini hanya mempengaruhi **bagaimana objek digambar**, bukan sistem koordinatnya.

#### `screen.setDrawRotation(angle)`

Memutar objek (sprite/text/rect) pada porosnya sendiri.

```lua
screen.setDrawRotation(90)
screen.drawSprite("player", 0, 0, 32) // Player diputar 90 derajat
screen.setDrawRotation(0) // Reset
```

#### `screen.setDrawAnchor(anchorX, anchorY)`

Mengubah titik tumpu (anchor point) gambar. Defaultnya adalah tengah (0,0).

- `x`: -1 (kiri), 0 (tengah), 1 (kanan)
- `y`: -1 (bawah), 0 (tengah), 1 (atas)

```lua
screen.setDrawAnchor(-1, 1) // Anchor di pojok kiri atas
screen.drawText("Score", -100, 100, 20) // Teks rata kiri di pojok layar
screen.setDrawAnchor(0, 0) // Reset
```

## Inputs

Untuk membuat program interaktif, Anda perlu membaca input dari pengguna.

### Keyboard

Objek `keyboard` menyimpan status tombol saat ini.

```lua
if keyboard.UP then y += 1 end
if keyboard.SPACE then shoot() end
```

**Mendeteksi penekanan tombol (sekali saja):**
Gunakan `keyboard.press.<KEY>` di dalam fungsi `update()`. Bernilai true hanya pada frame saat tombol mulai ditekan.

```lua
if keyboard.press.SPACE then
  // Hanya dieksekusi sekali saat tombol ditekan
  jump()
end
```

### Mouse

Objek `mouse` melaporkan posisi dan status tombol mouse.

| Field | Deskripsi |
|-------|-----------|
| `mouse.x`, `mouse.y` | Posisi pointer mouse dalam koordinat layar. |
| `mouse.left` | 1 jika tombol kiri ditekan, 0 jika tidak. |
| `mouse.right` | 1 jika tombol kanan ditekan, 0 jika tidak. |
| `mouse.press` | true jika tombol mouse baru saja ditekan. |
| `mouse.release` | true jika tombol mouse baru saja dilepas. |

### Touch

Objek `touch` untuk layar sentuh (juga melaporkan status mouse sebagai sentuhan tunggal).

| Field | Deskripsi |
|-------|-----------|
| `touch.touching` | true jika pengguna menyentuh layar. |
| `touch.x`, `touch.y` | Posisi sentuhan. |
| `touch.touches` | List (array) dari semua titik sentuh aktif (untuk multi-touch). |

### Gamepad

Objek `gamepad` untuk controller fisik.

```lua
if gamepad.UP then y += 1 end
if gamepad.press.A then jump() end
```

## Audio

l8b memungkinkan Anda memutar efek suara dan musik.

### `audio.playSound(name, volume, pitch, pan, loop)`

Memutar suara (SFX).

- `name`: Nama file suara di tab Sounds.
- `volume`: 0 sampai 1 (default 1).
- `pitch`: Kecepatan playback (default 1).
- `pan`: Stereo pan, -1 (kiri) sampai 1 (kanan).
- `loop`: 1 (true) untuk mengulang terus menerus.

Mengembalikan objek suara yang bisa dikontrol:

```lua
sfx = audio.playSound("explosion")
sfx.setVolume(0.5)
sfx.stop()
```

### `audio.playMusic(name, volume, loop)`

Memutar musik latar (BGM).

- `name`: Nama file musik di tab Music.
- `volume`: 0 sampai 1.
- `loop`: 1 (true) untuk looping.

Mengembalikan objek musik:

```lua
bgm = audio.playMusic("theme", 0.8, 1)
bgm.stop()
bgm.play() // Resume
```

### `audio.beep(pattern)`

Memutar suara sintetis sederhana (legacy beeper).

```lua
audio.beep("C E G") // Memutar chord C Major
```

## Assets

Asset manager memungkinkan Anda memuat file eksternal. Loading bersifat **asynchronous**.

### `asset_manager.loadJSON(path, callback)`

Memuat file JSON dan mengubahnya menjadi objek l8b.

```lua
// Cara 1: Callback
asset_manager.loadJSON("data/items", function(data)
  items = data
end)

// Cara 2: Loader Object
loader = asset_manager.loadJSON("data/items")
// Di update loop:
if loader.ready then
  items = loader.data
end
```

### `asset_manager.loadImage(path, callback)`

Memuat gambar eksternal untuk digunakan sebagai sprite.

```lua
asset_manager.loadImage("images/background.png", function(img)
  // Gambar siap digunakan
end)
```

### Fungsi Load Lainnya

- `loadFont(path)`: Memuat font TTF.
- `loadText(path)`: Memuat file teks biasa sebagai string.
- `loadCSV(path)`: Memuat file CSV sebagai string.
- `loadMarkdown(path)`: Memuat file Markdown sebagai string.

**Catatan:** 3D Models dan WASM saat ini tidak didukung di l8b.

## System

Objek `system` menyediakan informasi sistem dan kontrol alur.

### Informasi

- `system.language`: Bahasa preferensi pengguna (misal "en", "id").
- `system.fps`: Frame rate efektif saat ini.
- `system.time`: Waktu saat ini dalam milidetik (sejak 1 Jan 1970).
- `system.inputs`: Objek yang memberitahu ketersediaan input hardware (`keyboard`, `mouse`, `touch`, `gamepad`).

### Interaksi & Kontrol

#### `system.say(message)`

Menampilkan jendela pesan (alert).

#### `system.prompt(message, callback)`

Menampilkan jendela input teks.

```lua
system.prompt("Siapa nama Anda?", function(result)
  if result then
    playerName = result
  end
end)
```

#### `system.pause()`

Menjeda eksekusi program (hanya di development environment).

#### `system.exit()`

Keluar dari program.

## Storage

Objek `storage` memungkinkan penyimpanan data permanen (Persistent Storage). Data tetap tersimpan meskipun browser ditutup.

### `storage.set(name, value)`

Menyimpan nilai secara permanen. Nilai bisa berupa number, string, list, atau object.

```lua
storage.set("highscore", 5000)
storage.set("settings", { sound: true, music: false })
```

### `storage.get(name)`

Mengambil nilai yang tersimpan. Mengembalikan `null` jika data tidak ditemukan (atau `0` tergantung implementasi, cek nilai balik).

```lua
highscore = storage.get("highscore")
if !highscore then highscore = 0 end
```

## Palette

Palette memungkinkan Anda mengelola palet warna untuk game Anda. Berguna untuk efek visual seperti palette swapping atau color cycling.

### Membuat Palette

```lua
// Buat palette kosong
palette = new Palette()

// Buat palette dengan warna
palette = new Palette({
  name: "Game Palette",
  colors: ["#000000", "#FF0000", "#00FF00", "#0000FF"]
})
```

### Menggunakan Palette

#### `palette.get(index)`

Mengambil warna berdasarkan indeks. Mengembalikan string hex seperti `"#FF0000"`.

```lua
red = palette.get(1)  // Ambil warna di indeks 1
screen.setColor(red)
```

#### `palette.getRGB(index)`

Mengambil warna sebagai objek RGB `{r, g, b}` dengan nilai 0-255.

```lua
rgb = palette.getRGB(2)  // {r: 0, g: 255, b: 0}
```

#### `palette.set(index, color)`

Mengatur warna di indeks tertentu. Warna harus dalam format hex seperti `"#FF0000"`.

```lua
palette.set(0, "#000000")  // Set warna hitam di indeks 0
palette.set(1, "#FFFFFF")  // Set warna putih di indeks 1
```

#### `palette.add(color)`

Menambahkan warna baru ke palette dan mengembalikan indeks baru.

```lua
index = palette.add("#FF00FF")  // Tambah warna magenta
```

#### `palette.remove(index)`

Menghapus warna di indeks tertentu.

#### `palette.setPalette(colors)`

Mengganti seluruh palette dengan array warna baru.

```lua
palette.setPalette(["#000000", "#FF0000", "#00FF00", "#0000FF"])
```

### Efek Palette

#### `palette.lighten(index, amount)`

Mencerahkan warna. `amount` antara 0-1 (default 0.2).

```lua
lighter = palette.lighten(1, 0.3)  // Cerahkan warna di indeks 1 sebesar 30%
```

#### `palette.darken(index, amount)`

Menggelapkan warna. `amount` antara 0-1 (default 0.2).

#### `palette.mix(index1, index2, ratio)`

Mencampur dua warna. `ratio` antara 0-1 (default 0.5).

```lua
mixed = palette.mix(0, 1, 0.5)  // Campur warna 0 dan 1 dengan rasio 50/50
```

#### `palette.gradient(startIndex, endIndex, steps)`

Membuat array gradient antara dua warna.

```lua
gradient = palette.gradient(0, 3, 10)  // Gradient dari warna 0 ke 3 dengan 10 langkah
```

#### `palette.findClosest(hexColor)`

Mencari indeks warna terdekat dengan warna yang diberikan.

```lua
closest = palette.findClosest("#FF8888")  // Cari warna terdekat dengan #FF8888
```

### Utility

- `palette.size`: Jumlah warna dalam palette
- `palette.paletteName`: Nama palette
- `palette.getAll()`: Ambil semua warna sebagai array
- `palette.toData()`: Export data palette sebagai objek `{name, colors}`
- `Palette.rgbToHex(r, g, b)`: Method statis untuk mengkonversi RGB ke hex

## Scene Management

Sistem scene management memungkinkan Anda mengorganisir game menjadi scene-scene terpisah dengan routing berbasis URL.

### Mendefinisikan Scene

Gunakan fungsi `scene()` untuk mendefinisikan scene dengan lifecycle methods:

```lua
scene("home", object
  init = function()
    // Dipanggil sekali saat scene pertama kali diregistrasi
    print("Home scene initialized")
  end

  onEnter = function(params)
    // Dipanggil saat scene menjadi aktif
    // params berisi parameter route jika ada
    print("Entered home scene")
  end

  onLeave = function()
    // Dipanggil saat scene dinonaktifkan
    print("Left home scene")
  end

  update = function()
    // Dipanggil setiap frame
    if keyboard.press.SPACE then
      router.push("/game")
    end
  end

  draw = function()
    // Dipanggil setiap frame
    screen.clear("blue")
    screen.drawText("Press SPACE to start", 0, 0, 20)
  end
end)
```

### Routing

Gunakan fungsi `route()` untuk memetakan path ke scene:

```lua
route("/", "home")                    // Path root ke scene home
route("/game", "game")                 // Path /game ke scene game
route("/player/:id", "player")         // Path dengan parameter :id
route("/game/:level/:difficulty", "game")  // Multiple parameters
```

Parameter route akan diteruskan ke `onEnter` sebagai objek:

```lua
scene("player", object
  onEnter = function(params)
    playerId = params.id  // Ambil parameter :id dari route
    print("Viewing player: " + playerId)
  end
end)
```

### Router API

Objek `router` menyediakan navigasi dan informasi routing:

#### `router.push(path)`

Navigasi ke path baru (menambahkan ke browser history).

```lua
router.push("/game")           // Navigate ke /game
router.push("/player/42")      // Navigate dengan parameter
```

#### `router.replace(path)`

Mengganti path saat ini tanpa menambahkan ke history.

```lua
router.replace("/menu")  // Replace tanpa menambah history
```

#### `router.back()`

Kembali ke halaman sebelumnya dalam history.

```lua
if keyboard.press.ESCAPE then
  router.back()
end
```

#### Router Properties

- `router.path`: Path saat ini
- `router.params`: Parameter route saat ini (objek)
- `router.sceneName`: Nama scene saat ini

Atau gunakan fungsi:

- `router.getPath()`: Ambil path saat ini
- `router.getParams()`: Ambil parameter route
- `router.getSceneName()`: Ambil nama scene

### Scene API

- `scene(name, definition)`: Registrasi scene dengan lifecycle methods
- `route(path, sceneName)`: Registrasi route mapping path ke scene
- `scenes.goto(name, params)`: Navigasi langsung ke scene (params opsional)
- `scenes.current()`: Ambil nama scene aktif saat ini

### Contoh Lengkap

```lua
// Define routes
route("/", "home")
route("/game", "game")
route("/player/:id", "player")

// Home scene
scene("home", object
  update = function()
    if keyboard.press.SPACE then
      router.push("/game")
    end
  end

  draw = function()
    screen.clear("blue")
    screen.drawText("Press SPACE to start", 0, 0, 20)
  end
end)

// Player scene dengan parameter
scene("player", object
  onEnter = function(params)
    playerId = params.id
  end

  update = function()
    if keyboard.press.ESCAPE then
      router.back()
    end
  end

  draw = function()
    screen.clear("green")
    screen.drawText("Player: " + playerId, 0, 0, 20)
  end
end)
```

## Standard Library

L8B menyediakan standard library utilities yang dapat diakses sebagai global objects: `Math`, `String`, `List`, dan `JSON`.

### Math

Objek `Math` menyediakan fungsi matematika dan utility untuk game development.

#### Fungsi Dasar

- `Math.abs(x)`: Nilai absolut
- `Math.sqrt(x)`: Akar kuadrat
- `Math.floor(x)`: Pembulatan ke bawah
- `Math.ceil(x)`: Pembulatan ke atas
- `Math.round(x)`: Pembulatan ke terdekat
- `Math.min(...args)`: Nilai minimum
- `Math.max(...args)`: Nilai maksimum

#### Trigonometri

- `Math.sin(x)`, `Math.cos(x)`, `Math.tan(x)`: Fungsi trigonometri (radian)
- `Math.asin(x)`, `Math.acos(x)`, `Math.atan(x)`: Fungsi invers
- `Math.atan2(y, x)`: Arc tangent 2

#### Konversi Sudut

- `Math.degToRad(degrees)`: Konversi derajat ke radian
- `Math.radToDeg(radians)`: Konversi radian ke derajat

#### Random

- `Math.random()`: Random number [0..1)
- `Math.randomInt(min, max)`: Random integer [min..max]
- `Math.randomFloat(min, max)`: Random float [min..max)

#### Game Utilities

- `Math.clamp(value, min, max)`: Clamp nilai antara min dan max
- `Math.lerp(a, b, t)`: Linear interpolation
- `Math.distance(x1, y1, x2, y2)`: Jarak antara dua titik
- `Math.distance3D(x1, y1, z1, x2, y2, z2)`: Jarak 3D
- `Math.angleBetween(x1, y1, x2, y2)`: Sudut antara dua titik (radian)
- `Math.sign(x)`: Tanda bilangan (-1, 0, atau 1)
- `Math.mod(n, m)`: Euclidean modulo

#### Konstanta

- `Math.PI`: Pi (3.14159...)
- `Math.E`: Euler's number (2.71828...)

### String

Objek `String` menyediakan fungsi manipulasi string.

#### Split & Join

- `String.split(str, separator)`: Split string menjadi array
- `String.join(arr, separator)`: Join array menjadi string

#### Trim

- `String.trim(str)`: Hapus whitespace di kedua ujung
- `String.trimStart(str)`: Hapus whitespace di awal
- `String.trimEnd(str)`: Hapus whitespace di akhir

#### Replace

- `String.replace(str, search, replacement)`: Replace pertama
- `String.replaceAll(str, search, replacement)`: Replace semua

#### Case

- `String.toLowerCase(str)`: Konversi ke lowercase
- `String.toUpperCase(str)`: Konversi ke uppercase

#### Search

- `String.startsWith(str, prefix)`: Cek apakah dimulai dengan prefix
- `String.endsWith(str, suffix)`: Cek apakah diakhiri dengan suffix
- `String.contains(str, search)`: Cek apakah mengandung substring
- `String.indexOf(str, search, fromIndex)`: Cari indeks pertama
- `String.lastIndexOf(str, search, fromIndex)`: Cari indeks terakhir

#### Substring

- `String.substring(str, start, end)`: Extract substring
- `String.slice(str, start, end)`: Extract substring (slice)

#### Character

- `String.charAt(str, index)`: Ambil karakter di indeks
- `String.charCodeAt(str, index)`: Ambil kode karakter
- `String.fromCharCode(...codes)`: Buat string dari kode karakter

#### Formatting

- `String.repeat(str, count)`: Ulang string
- `String.padStart(str, length, pad)`: Pad di awal
- `String.padEnd(str, length, pad)`: Pad di akhir
- `String.format(template, ...args)`: Format string dengan placeholder `{0}`, `{1}`, dll.

#### Parse

- `String.parseInt(str, radix)`: Parse integer
- `String.parseFloat(str)`: Parse float

### List (Array)

Objek `List` menyediakan fungsi manipulasi array dan functional programming.

#### Functional Methods

- `List.map(arr, fn)`: Map setiap elemen
- `List.filter(arr, fn)`: Filter elemen
- `List.reduce(arr, fn, initial)`: Reduce ke satu nilai
- `List.find(arr, fn)`: Cari elemen pertama yang match
- `List.findIndex(arr, fn)`: Cari indeks pertama yang match
- `List.some(arr, fn)`: Cek apakah ada yang match
- `List.every(arr, fn)`: Cek apakah semua match

#### Manipulasi (Non-mutating)

- `List.reverse(arr)`: Reverse array (return array baru)
- `List.sort(arr, fn)`: Sort array (return array baru)
- `List.slice(arr, start, end)`: Extract subarray
- `List.concat(...arrays)`: Gabungkan array
- `List.flat(arr, depth)`: Flatten nested arrays
- `List.flatMap(arr, fn)`: Map dan flatten

#### List Search

- `List.indexOf(arr, item, fromIndex)`: Cari indeks item
- `List.lastIndexOf(arr, item, fromIndex)`: Cari indeks terakhir
- `List.includes(arr, item, fromIndex)`: Cek apakah mengandung item

#### Access

- `List.first(arr)`: Ambil elemen pertama
- `List.last(arr)`: Ambil elemen terakhir
- `List.at(arr, index)`: Ambil elemen di indeks (support negatif)

#### Mutating Methods

- `List.push(arr, ...items)`: Tambah item di akhir (mutate)
- `List.pop(arr)`: Hapus dan return elemen terakhir
- `List.shift(arr)`: Hapus dan return elemen pertama
- `List.unshift(arr, ...items)`: Tambah item di awal (mutate)
- `List.splice(arr, start, deleteCount, ...items)`: Insert/remove elemen

#### Utilities

- `List.fill(arr, value, start, end)`: Isi array dengan nilai (return baru)
- `List.join(arr, separator)`: Join array menjadi string
- `List.unique(arr)`: Hapus duplikat (return baru)
- `List.shuffle(arr)`: Acak array (return baru)
- `List.chunk(arr, size)`: Bagi menjadi chunk
- `List.sum(arr)`: Jumlahkan angka
- `List.average(arr)`: Rata-rata angka
- `List.min(arr)`: Nilai minimum
- `List.max(arr)`: Nilai maksimum

### JSON

Objek `JSON` menyediakan encoding dan decoding JSON.

- `JSON.encode(value)`: Encode value ke JSON string
- `JSON.decode(json)`: Decode JSON string ke value
- `JSON.pretty(value, indent)`: Pretty-print JSON dengan indentasi

### Contoh Standard Library

```lua
// Math examples
distance = Math.distance(0, 0, 10, 10)
angle = Math.angleBetween(0, 0, 10, 10)
clamped = Math.clamp(value, 0, 100)
randomNum = Math.randomInt(1, 10)

// String examples
parts = String.split("hello,world", ",")
joined = String.join(["a", "b", "c"], "-")
formatted = String.format("Hello {0}, you have {1} points", "Player", 100)

// List examples
doubled = List.map([1, 2, 3], function(x) return x * 2 end)
evens = List.filter([1, 2, 3, 4], function(x) return x % 2 == 0 end)
sum = List.sum([1, 2, 3, 4, 5])
shuffled = List.shuffle([1, 2, 3, 4, 5])

// JSON examples
jsonStr = JSON.encode({name: "Player", score: 100})
data = JSON.decode(jsonStr)
pretty = JSON.pretty({x: 1, y: 2}, 2)
```
