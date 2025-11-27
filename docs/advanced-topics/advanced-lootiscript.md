# Advanced LootiScript

## Prototypes for Core Types

LootiScript 1.0 memperkenalkan prototype untuk Object, List, String, Number, dan Function. Prototype adalah kumpulan fungsi yang dapat Anda definisikan dan kemudian gunakan pada nilai dari tipe yang sesuai.

### Contoh: String Prototype

Kita akan membuat fungsi yang, ketika diterapkan pada string, mengembalikan string yang sama dengan huruf pertama dijadikan kapital:

```lua
String.capitalized = function()
  if this.length > 0 then
    this[0].toUpperCase() + this.substring(1)
  else
    ""
  end
end
```

**Catatan:** Dalam fungsi yang didefinisikan, `this` merujuk pada instance string yang fungsi tersebut dipanggil.

Kita kemudian dapat menggunakan fungsi ini pada nilai string apa pun seperti ini:

```lua
lastname = "doe".capitalized()
firstname = "john"
firstname = firstname.capitalized()
city = "paris"
print(firstname + " " + lastname + " " + city.capitalized())
```

**Catatan:** Nilai string selalu konstan. Setiap fungsi yang terlihat seperti mengubah string tidak mengubah nilai string asli, hanya mengembalikan nilai string baru yang berisi string yang telah diubah.

### Contoh: List Prototype

```lua
List.modulo = function(mod)
  local result = []
  for i = 0 to this.length - 1 by mod
    result += this[i]
  end
  result
end
```

Setelah didefinisikan, Anda dapat memanggil fungsi `modulo` pada list, yang akan mengembalikan subset dari elemen dalam list:

```lua
[1,2,3,4,5,6,7,8].modulo(2)
// Hasil: [1,3,5,7]
```

## Operator Overloading

### Untuk Classes

Saat membuat class, Anda dapat mendefinisikan bagaimana operator LootiScript `+ - * / %` diterapkan pada instance object dari class Anda.

```lua
Vector3 = class
  constructor = function(x, y, z)
    this.x = x
    this.y = y
    this.z = z
  end

  "+" = function(a, b)
    new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
  end
end
```

Ketika Anda mendefinisikan operator biner seperti `+`, pikirkan bahwa itu akan digunakan seperti ini: `a + b`. `a` dan `b` akan menjadi dua argumen untuk fungsi overloading Anda.

**Catatan:** Ketika `a <op> b` ditemukan dalam kode dan `a` bukan angka, operasi yang akan dilakukan ditentukan berdasarkan tipe atau class dari `a`. Jika `a` adalah List dan `<op>` didefinisikan dalam prototype List, maka itu yang akan dilakukan. Jika `a` adalah instance dari class Vector3 dan class mendefinisikan `<op>`, maka itu yang akan dilakukan.

**Kasus khusus:** Ketika ditemukan `-b` dalam kode; jika prototype atau parent class dari `b` ditemukan mendefinisikan operator biner `-`, maka fungsi `(a, b)` dipanggil dengan `a` diset ke `0` dan `b` diset ke nilai `b`. Dengan demikian, Anda dapat mengimplementasikan operator `-` untuk class Vector3 Anda seperti ini:

```lua
Vector3."-" = function(a, b)
  if a then
    new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
  else
    new Vector3(-b.x, -b.y, -b.z)
  end
end
```

### Untuk Core Types

Anda juga dapat melakukan overloading operator untuk tipe core dari LootiScript. Contoh:

```lua
String."*" = function(a, b)
  local result = a
  for i = 2 to b by 1
    result += a
  end
  result
end
```

Penggunaan:

```lua
"abc" * 5
// Hasil: "abcabcabcabcabc"
```

**Catatan:** Overloading operator biner `+ - * / %` untuk prototype Number tidak didukung!

## Manipulating Classes / Prototypes

Anda dapat memanipulasi class dan prototype secara dinamis untuk menambahkan atau mengubah perilaku:

```lua
// Menambahkan method baru ke List
List.sum = function()
  local total = 0
  for i = 0 to this.length - 1
    total += this[i]
  end
  total
end

// Menggunakan method baru
numbers = [1, 2, 3, 4, 5]
print(numbers.sum())  // Hasil: 15
```

## Embedding JavaScript

Anda sekarang dapat menyematkan kode JavaScript dalam kode LootiScript Anda. Ini memungkinkan Anda menambahkan fitur ke aplikasi Anda yang mungkin tidak disediakan oleh API core L8B.

**Catatan:** Anda tidak dapat memanggil fungsi LootiScript atau membuat instance class LootiScript dari kode JavaScript Anda. Anda dapat memanggil fungsi JavaScript atau membuat instance class JavaScript dari kode LootiScript Anda.

**Catatan:** JavaScript saat ini didukung pada semua platform target yang ada untuk aplikasi L8B Anda, karena semuanya bergantung pada engine HTML5. Di masa depan, lebih banyak target ekspor dapat ditambahkan, yang mungkin tidak menyertakan dukungan JavaScript.

### Cara Menjalankan JavaScript

#### 1. Embed Snippet

Anda dapat menjalankan kode JavaScript dengan memanggil `system.javascript(javascript_code)`. Contoh:

```lua
system.javascript("""
  this.setFullscreen = function() { 
    document.body.requestFullscreen() 
  } ;
""")
```

Kode JavaScript Anda dieksekusi dengan `this` diset ke konteks global LootiScript. Dengan demikian, dengan menyetel `this.setFullscreen = ...`, Anda membuat fungsi global yang kemudian dapat Anda panggil dari kode LootiScript Anda.

#### 2. Buat File JavaScript

Anda dapat membuat file JavaScript lengkap, cukup dengan memulai file Anda dengan `// javascript` diikuti dengan baris baru.

Contoh:

```lua
// javascript

this.setFullscreen = function() { 
  document.body.requestFullscreen() 
} ;
```

Konteks global LootiScript juga disediakan sebagai variabel bernama `global`. Anda dapat menulis:

```lua
// javascript

global.setFullscreen = function() { 
  document.body.requestFullscreen() 
} ;
```

### Contoh Penggunaan JavaScript Interop

```lua
// Menambahkan fungsi JavaScript untuk mengakses localStorage
system.javascript("""
  this.saveToLocalStorage = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  this.loadFromLocalStorage = function(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
""")

// Menggunakan dari LootiScript
init = function()
  // Simpan data
  saveToLocalStorage("playerName", "John")
  
  // Muat data
  playerName = loadFromLocalStorage("playerName")
  print("Player: " + playerName)
end
```

## Best Practices

1. **Gunakan Prototype dengan Bijak**: Hanya tambahkan method ke prototype jika benar-benar diperlukan dan akan digunakan secara luas.

2. **Dokumentasikan Extension**: Jika Anda menambahkan method ke prototype, dokumentasikan dengan baik agar pengembang lain memahami perilakunya.

3. **JavaScript Interop**: Gunakan JavaScript interop hanya untuk fitur yang tidak tersedia di API L8B. Hindari menggunakannya untuk logika game inti.

4. **Operator Overloading**: Pastikan operator yang Anda overload memiliki semantik yang jelas dan intuitif untuk class Anda.

5. **Performance**: Perlu diingat bahwa menambahkan method ke prototype dapat mempengaruhi performa jika dilakukan berulang kali. Lakukan sekali saat inisialisasi.
