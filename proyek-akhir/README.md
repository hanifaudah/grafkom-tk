# Penjelasan cara penggunaan/menjalankan program
Jalankan hirarki.html menggunakan Live Server

# Proses pembentukan objek

## Membuat object tree
Tambahkan object tree pada `js/hirarki/[objectName].js` dengan langkah-langkah berikut
1. Membuat fungsi draw untuk tiap komponen object
2. Buat node dengan memamnfaatkan fungsi draw. Tambahkan transformasi pada object di sini menggunakan perhitungan matriks
3. Tambahkan node sebagai child atau sibling dari node lain

## Menambahkan object pada scene
1. Tambahkan object handler functions dalam `initObjectTree` dan `animate` pada `js/hirarki/index.js`
2. Tambahkan object animation state dalam `js/index.js`
3. Tambahkan traversal object tree dalam fungsi `drawScene()` yang ada dalam `js/index.js` serta fungsi `drawShadowMap()` yang ada dalam `js/hirarki/index.js`

# Proses rendering objek dan scene
Semua node pada object melalui traversal, kemudian di render pada tiap tahapan traversal tersebut. Traversal rendering dilanjutkan ke child dan sibling dari node tersebut.

# Fasilitas-fasilitas WebGL yang digunakan

# Algoritma-algoritma (khusus) yang digunakan
- Pembentukan object menggunakan algoritma tree traversal

# Log pekerjaan dan tugas masing-masing anggota kelompok.
- 07/06/2022
  - Hanif Arkan Audah:
    - Membuat scene/environment
    - Membuat sistem mapping untuk texturing
    - Membuat model hirarki: Steve, Creeper, Pig, Piston, dan Chest
    - Texturing Steve, Creeper, dan, Pig
    - Membuat animasi untuk semua object
    - Membuat input interaktif untuk masing-masing object hirarki
  - Muhammad Hanif Anggawi: 
    - Texturing pig
    - Research cara menggunakan multiple lightsource dalam satu scene
  - Mushaffa Huda:
    - Membuat basis Hirarki untuk model steve
    - menambahkan texture untuk model steve
- 08/06/2022
  - Hanif Arkan Audah:
    - Merapikan environment
    - Melengkapi texture untuk Steve, Creeper, Pig, Piston, dan Chest
    - Merapikan object Chest
    - Implementasi pergerakan kamera sesuai sudut pandang object hirarki
    - Membuat mode shading dan wireframe
  - Muhammad Hanif Anggawi
    - Implementasi direct light, point light, spot light
  - Mushaffa Huda:
    - Refactor dan Merapihkan codebase
    - Merapihkan Laporan

# Mencantumkan sumber/referensi
- https://learnopengl.com/Lighting/Multiple-lights
