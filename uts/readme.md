# UTS Grafika Komputer: Kelompok Raster

## Gambaran umum tentang program yang dibuat

### Soal 2

Pada program ini algoritma midpointline dimodifikasi sehingga dapat mengakomodasi semua slope dengan melewati constraint awal dimana `x2 > x1` dan `y2 > y1` harus terpenuhi. maka input dapat diberi sembarang selama memenuhi batasan koordinat (`-10 < x, y < 10`).

User akan memberi input sesuai kolom input yang ada dan hasil akhir dari garis akan tergambar pada canvas dan juga ditampilkannya tiap titik - titik yang dipilih oleh algoritma guna menggambar garis tersebut pada panel output.

### Soal 3

Program ini menampilkan 3 benda 3D yang merepresentasikan molekul H2O. Terdapat 1 benda besar (oksigen)
dan 2 benda kecil (hidrogen) yang mengitari benda yang besar (oksigen).

Terdapat 4 posisi kamera yang dapat dipilih.

1. Posisi kamera pertama menampilkan semua benda
2. Posisi kamera kedua berfokus pada benda oksigen
3. Posisi kamera ketiga berfokus pada benda hidrogen 1
4. Posisi kamera keempat berfokus pada benda hidrogen 2

## Petunjuk menjalankan program termasuk file-file terkait/struktur direktori yang diperlukan

### Cara Menjalankan Program

Buka index.html yang ada di folder root pada browser

### Struktur Proyek

```
UTS-Raster
│   readme.txt
│   index.html
|   index.css
│
└───Common
│
└───Soal2
    │   index.html
    │   index.css
    │   index.js
    │   alert.css
│
└───Soal3
    │   index.html
    │   index.css
    │   index.js
    │   utils.js
    │   geometry.js
```

## Manual penggunaan

### Halaman Utama

Pada halaman ini terdapat tiga tombol, yang masing-masing mengarah pada Soal 1-3

### Navbar

Setelah membuka Soal 1-3, terdapat navbar pada bagian atas halaman

### Soal 2

Pada halaman ini terdapat 1 canvas, 4 kolom input, 1 tombol **Draw Line**, 1 dropdown berisi 8 **Cardinal Points** (arah mata angin), dan output panel. berikut adalah penjabaran fungsi - fungsinya.

1. 4 kolom input terdiri dari **xAwal**, **xAkhir**, **yAwal** dan **yAkhir**. tiap input menandakan koordinat awal dan akhir dari garis yang akan dibuat menggunakan algoritma midpointline. garis dapat terlihat setelah koordinat diinput dan tombol **Draw Line** ditekan.

2. dropdown **Cardinal Points** atau arah mata angin dapat dipilih dan menggambar semua arah mata angin pada canvas.

3. output panel mengeluarkan semua output dari titik - titik yang akan digambar menjadi garis


### Soal 3

Pada halaman ini terdapat 1 canvas dan 4 tombol. Masing-masing tombol mengubah posisi kamera.

Berikut posisi kamera setelah menekan tombol 1-4:

1. Menampilkan semua benda
2. Berfokus pada benda oksigen
3. Berfokus pada benda hidrogen 1
4. Berfokus pada benda hidrogen 2

## Pembagian kerja/kontribusi anggota kelompok

(1906293070) Hanif Arkan Audah:

- Mengerjakan Soal 3
- Membuat repository kelompok
- Menyusun struktur proyek
- Membuat halaman utama
- Membuat navbar

(18061865272) Mushaffa Huda:

- Mengerjakan Soal 2
- Membuat Design CSS untuk proyek