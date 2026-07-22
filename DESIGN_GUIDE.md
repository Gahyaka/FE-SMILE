# Panduan Desain & Styling: G-SEE (Doodle & Chalkboard Concept)

Dokumen ini disusun sebagai acuan aturan gaya visual (*styling rules*) dalam pengembangan situs **G-SEE (Gajahwong Smart Education Ecosystem)** agar konsisten dengan konsep identitas visual terbaru yang ramah anak, peduli lingkungan, namun tetap terlihat profesional dan terpercaya.

---

## 1. Konsep Utama: "Doodle & Chalkboard"

Konsep ini memadukan esensi **sekolah alternatif nonformal bantaran sungai** (ramah, kreatif, organik) dengan kestabilan web profesional.

*   **Warm Paper Canvas:** Latar belakang didominasi warna krim kertas hangat (`#FAF8F5`) daripada putih polos steril, melambangkan buku gambar/kertas sketsa anak-anak.
*   **Organic Chalk Borders:** Penggunaan garis tepi yang tidak lurus kaku komputer. Card, tombol, dan pembatas menggunakan lengkungan asimetris (*asymmetric border radius*) seolah digambar manual menggunakan kapur tulis/krayon.
*   **Chalkboard Grid Overlay:** Pola kotak-kotak matematika tipis transparan di latar belakang untuk memberi tekstur media belajar tanpa mengganggu pembacaan.

---

## 2. Palet Warna (Tailwind CSS v4 Tokens)

Warna didefinisikan dalam `@theme` di `src/app/globals.css`.

| Peran Warna | Variabel CSS | Nilai Hex | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary Green** | `--color-primary-green` | `#18B36F` | Tombol utama, aksen utama, highlight edukasi |
| **Primary Dark** | `--color-primary-dark` | `#0E7A4D` | Hover state, teks judul di atas warna terang |
| **Primary Light** | `--color-primary-light` | `#5FD79B` | Aksen sekunder, latar dekoratif ringan |
| **Soft Mint** | `--color-soft-mint` | `#E6F9F1` | Latar belakang card ringan, kontainer data |
| **Warm Yellow** | `--color-warm-yellow` | `#FFC93C` | Aksen ceria, garis sketsa bawah teks (*underline*), badge |
| **Soft Orange** | `--color-soft-orange` | `#FF9F5B` | Aksen pendampingan anak, ikon detail |
| **Warm Cream** | *(Latar Belakang)* | `#FAF8F5` | Latar belakang utama (kertas gambar) |
| **Neutral Dark** | `--color-neutral-dark` | `#2E3A32` | Teks utama (abu-abu gelap hangat ramah mata) |
| **Neutral Gray** | `--color-neutral-gray` | `#6B7A72` | Deskripsi sekunder, teks footer |

---

## 3. Tipografi (Typography)

*   **Judul & Heading (`h1`, `h2`, `h3`, `h4`):** Menggunakan font **Baloo 2** (rounded, tebal, ceria, ramah anak namun terstruktur).
*   **Teks Isi / Deskripsi (`body`, `p`):** Menggunakan font **Quicksand** (rounded, ringan, sangat mudah dibaca untuk teks panjang).

---

## 4. Aturan Bentuk & Lengkungan (Border Radius)

Untuk mempertahankan jiwa coretan tangan (*doodle*), hindari penggunaan `rounded-2xl` atau `rounded-3xl` standar pada elemen-elemen kunci. Gunakan rumus border radius asimetris berikut:

### A. Tombol Utama (Primary Buttons)
Memiliki lengkungan yang sedikit condong ke salah satu sisi untuk efek sketsa:
```css
rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px]
```

### B. Tombol Alternatif / Kontak (Secondary Buttons)
Lengkungan asimetris berlawanan untuk variasi:
```css
rounded-[100px_30px_90px_20px]/[20px_90px_30px_100px]
```

### C. Pembungkus Grafik / Kontainer Utama (Card Wrappers)
Bentuk lembaran kertas gambar asimetris:
```css
rounded-[40px_15px_50px_20px]/[20px_50px_15px_40px]
```

### D. Navbar Melayang (Floating Navbar Container)
Lengkungan asimetris lurus yang rapi agar tetap kokoh di atas layar:
```css
rounded-[24px_12px_36px_18px]/[18px_36px_12px_24px]
```

---

## 5. Bayangan & Border (Shadow & Stroke)

*   **Bayangan Sangat Tipis (`shadow-sm`):** Konsep ini bertumpu pada kertas gambar datar, kurangi atau hilangkan penggunaan `shadow-lg` atau `shadow-2xl` yang tebal.
*   **Garis Tepi Berkarakter:** Tombol utama dan logo wajib dibingkai dengan garis tepi tegas (`border-2 border-primary-dark` atau `border-2 border-neutral-dark`).
*   **Garis Tepi Putus-Putus (`border-dashed`):** Digunakan pada tombol sekunder atau kontainer pendukung untuk memperkuat visual potongan kertas kerajinan tangan.
