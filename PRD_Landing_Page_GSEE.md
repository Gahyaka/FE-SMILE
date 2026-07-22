# Product Requirements Document (PRD)
## Landing Page Publik — G-SEE (Gajahwong Smart Education Ecosystem)

**Versi:** 1.0
**Tanggal:** 21 Juli 2026
**Disusun oleh:** Tim Front-End Development
**Status:** Draft — untuk dibahas di rapat tim

---

## 1. Latar Belakang

G-SEE (Gajahwong Smart Education Ecosystem) adalah program yang mengintegrasikan tiga gagasan utama: **Smart Learning**, **Smart Environment**, dan **Modul Pendampingan Anak**, untuk Sekolah Gajahwong — sekolah komunitas nonformal bagi anak usia 3–15 tahun.

Sebagai tahap awal pengembangan, tim front-end akan membangun **halaman publik (landing page)** terlebih dahulu, sebelum masuk ke pengembangan sistem internal (dashboard Smart Learning). Landing page ini berfungsi sebagai halaman pengenalan program bagi masyarakat umum, calon mitra, relawan, dan orang tua peserta didik.

## 2. Tujuan Halaman

1. Memperkenalkan program G-SEE kepada publik secara menarik dan mudah dipahami.
2. Menjelaskan tiga konsep utama program (Smart Learning, Smart Environment, Modul Pendampingan Anak).
3. Memperkenalkan tim yang terlibat beserta pembagian peran (3 tim).
4. Membangun kepercayaan (trust) dari calon mitra/donatur/relawan melalui tampilan yang profesional namun tetap ramah dan hangat.
5. Menjadi pintu masuk (call-to-action) bagi pihak yang ingin terlibat — baik sebagai relawan, mitra, maupun donatur.

## 3. Target Pengguna Halaman

Perlu digarisbawahi: **halaman ini ditujukan untuk orang dewasa** (calon mitra, orang tua, relawan, dosen pembimbing, masyarakat umum) — **bukan** untuk diakses langsung oleh peserta didik usia 3–15 tahun. Namun, karena program ini berpusat pada anak-anak, nuansa visual dibuat **ramah, ceria, dan hangat** agar mencerminkan semangat program dan menarik secara emosional bagi audiens dewasa yang peduli pada dunia anak.

| Target Audiens | Kebutuhan Utama |
|---|---|
| Orang tua peserta didik | Info program, kepercayaan, kontak |
| Calon relawan/mahasiswa | Info cara bergabung, gambaran kegiatan |
| Calon mitra/donatur | Kredibilitas program, dampak, transparansi |
| Dosen pembimbing/kampus mitra | Info kolaborasi akademik |
| Masyarakat umum | Awareness program & fundraising (merchandise) |

## 4. Ruang Lingkup (Scope) — Fase Ini

**Termasuk dalam scope:**
- Halaman Beranda (Home) satu halaman (single page) dengan beberapa section, atau multi-section scroll
- Section pengenalan program G-SEE
- Section penjelasan 3 konsep utama (Smart Learning, Smart Environment, Modul Pendampingan Anak)
- Section tim (3 tim beserta role masing-masing)
- Section call-to-action (kontak / cara bergabung)
- Responsive design (mobile-friendly)

**Belum termasuk dalam scope (fase berikutnya):**
- Dashboard/sistem internal Smart Learning (login-based)
- Halaman katalog merchandise interaktif (e-commerce)
- Sistem donasi online
- CMS untuk update konten secara mandiri

## 5. Struktur Halaman (Sitemap / Section Breakdown)

```
1. Navbar (Logo G-SEE, menu: Beranda, Tentang, Program, Tim, Kontak)
2. Hero Section (Judul utama + tagline + CTA button)
3. Tentang Program (Latar belakang singkat Sekolah Gajahwong & G-SEE)
4. Tiga Pilar Program (Smart Learning, Smart Environment, Modul Pendampingan Anak)
5. Section Tim (3 Tim + role masing-masing anggota)
6. Section Dampak/Tujuan (ringkas dari indikator keberhasilan, opsional)
7. Call-to-Action (Ingin terlibat/berkolaborasi/donasi)
8. Footer (Kontak, sosial media, alamat)
```

### 5.1 Detail Tiap Section

**A. Navbar**
- Logo G-SEE
- Menu: Beranda, Tentang Program, Tim Kami, Kontak
- Sticky navbar (tetap terlihat saat scroll)

**B. Hero Section**
- Headline besar: nama program + tagline singkat yang menggambarkan misi
- Sub-headline: 1-2 kalimat penjelasan singkat
- CTA button: misal "Kenali Program Kami" atau "Bergabung Jadi Relawan"
- Ilustrasi/gambar bernuansa anak-anak & alam (mendukung tema Smart Environment)

**C. Tentang Program**
- Ringkasan latar belakang Sekolah Gajahwong (dari dokumen proposal)
- Penjelasan singkat kenapa G-SEE hadir

**D. Tiga Pilar Program**
Ditampilkan dalam bentuk 3 card/kolom:
1. **Smart Learning** — ikon buku/laptop, deskripsi singkat
2. **Smart Environment** — ikon daun/recycle, deskripsi singkat
3. **Modul Pendampingan Anak** — ikon hati/orang, deskripsi singkat

**E. Section Tim**
- Ditampilkan per kelompok tim (3 tim)
- Tiap tim menampilkan: nama tim, deskripsi singkat tanggung jawab tim, daftar anggota beserta role masing-masing
- Format card per anggota: foto (opsional/placeholder avatar), nama, role/jabatan

> **Catatan:** Karena detail nama tim dan role belum tercantum dalam dokumen ini, mohon disiapkan datanya (nama 3 tim, deskripsi tanggung jawab tiap tim, serta daftar anggota + role) untuk diisikan ke section ini pada tahap konten.

**F. Call-to-Action**
- Ajakan bergabung sebagai relawan/mitra
- Tombol kontak (WhatsApp/Email) atau form kontak sederhana

**G. Footer**
- Info kontak, alamat Sekolah Gajahwong
- Link sosial media (jika ada)
- Copyright

## 6. Visual Design Guidelines

### 6.1 Color Palette

Warna utama yang ditentukan: **Hijau `#18B36F`**

Palet turunan yang direkomendasikan (untuk kontras, aksen, dan nuansa ramah anak):

| Peran Warna | Kode Warna | Kegunaan |
|---|---|---|
| **Primary Green** | `#18B36F` | Warna utama brand, tombol CTA, aksen utama |
| **Primary Dark** | `#0E7A4D` | Hover state, teks penting di atas warna terang |
| **Primary Light** | `#5FD79B` | Background section, elemen dekoratif |
| **Soft Mint** | `#E6F9F1` | Background section terang, card background |
| **Warm Yellow (aksen)** | `#FFC93C` | Aksen ceria untuk highlight/badge, cocok nuansa anak-anak |
| **Soft Orange (aksen)** | `#FF9F5B` | Aksen kedua, ikon/ilustrasi |
| **Neutral Dark** | `#2E3A32` | Teks utama (bukan hitam pekat, biar lebih lembut) |
| **Neutral Gray** | `#6B7A72` | Teks sekunder/deskripsi |
| **White** | `#FFFFFF` | Background utama |

*Catatan desain: warna aksen kuning/oranye ditambahkan agar nuansa "ramah anak" terasa lebih hidup, karena hijau saja cenderung terkesan formal/korporat/lingkungan semata. Kombinasi hijau + kuning hangat memberi kesan ceria sekaligus tetap merepresentasikan tema alam/lingkungan (Gajahwong Farm, Smart Environment).*

### 6.2 Tipografi (Font)

Karena target program menyasar anak usia 3–15 tahun (meski halaman ini untuk audiens dewasa), font dipilih dengan gaya **rounded, playful, tapi tetap terbaca profesional** — tidak childish berlebihan agar tetap kredibel di mata mitra/donatur.

**Rekomendasi kombinasi font (Google Fonts, gratis):**

| Elemen | Font | Karakter |
|---|---|---|
| **Heading/Judul** | **Baloo 2** | Rounded, tebal, ceria, cocok untuk judul besar bernuansa ramah anak |
| **Body text/Paragraf** | **Quicksand** | Rounded juga tapi lebih ringan, nyaman dibaca panjang |
| **Aksen/Badge (opsional)** | **Fredoka** | Alternatif jika ingin heading lebih playful lagi |

**Alternatif lain jika ingin sedikit lebih formal namun tetap hangat:**
- Heading: **Poppins** (rounded, modern, netral tapi tetap ramah)
- Body: **Nunito** (sangat mudah dibaca, rounded halus)

> Rekomendasi utama: **Baloo 2 (heading) + Quicksand (body)** — kombinasi ini paling menonjolkan nuansa ceria anak-anak tanpa mengorbankan keterbacaan dan profesionalitas untuk audiens dewasa.

Import via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap" rel="stylesheet">
```

### 6.3 Gaya Visual Lainnya
- **Border-radius besar** (rounded corners) pada card, button, gambar — memberi kesan lembut dan ramah, cocok untuk konteks anak-anak
- **Ilustrasi/vector art** bertema anak-anak, alam, dan kebersamaan lebih disarankan dibanding foto stok formal (kecuali dokumentasi kegiatan asli tersedia)
- **Micro-interaction** ringan (hover effect halus, transisi lembut) untuk kesan hidup tanpa berlebihan
- Hindari sudut tajam/serius, hindari palet warna monokrom kaku

## 7. Kebutuhan Fungsional

| No | Kebutuhan | Prioritas |
|---|---|---|
| 1 | Halaman dapat diakses tanpa login (publik) | Wajib |
| 2 | Responsive di mobile, tablet, dan desktop | Wajib |
| 3 | Navigasi antar-section (smooth scroll) | Wajib |
| 4 | Section tim menampilkan 3 tim beserta anggota dan role | Wajib |
| 5 | Tombol CTA mengarah ke kontak (WhatsApp/email/form) | Wajib |
| 6 | Loading halaman cepat (< 3 detik) | Wajib |
| 7 | SEO dasar (title, meta description, Open Graph) | Disarankan |
| 8 | Animasi scroll ringan (fade-in saat elemen muncul) | Opsional |

## 8. Kebutuhan Non-Fungsional

- **Aksesibilitas:** kontras warna teks dan background harus tetap memenuhi standar keterbacaan (WCAG AA) meskipun palet warnanya cerah
- **Performa:** gambar dioptimasi (WebP/lazy loading) agar tetap ringan diakses dari koneksi internet terbatas (mengingat konteks komunitas)
- **Kompatibilitas:** mendukung browser modern (Chrome, Safari, Firefox, Edge versi terbaru)

## 9. Tech Stack (Rekomendasi Fase Ini)

Karena fase ini berfokus pada **halaman publik statis** (belum ada dashboard/login), rekomendasi stack ringan:

- **Framework:** React + TypeScript + Vite (atau Next.js jika sudah direncanakan akan menyatu dengan dashboard nanti)
- **Styling:** Tailwind CSS
- **Font:** Google Fonts (Baloo 2 + Quicksand)
- **Hosting:** Vercel/Netlify (gratis, sesuai kebutuhan halaman statis)

## 10. Konten yang Perlu Disiapkan Tim (Belum Ada di Dokumen Ini)

Sebelum development dimulai, mohon disiapkan/dilengkapi:

1. Nama resmi 3 tim beserta deskripsi singkat tanggung jawab masing-masing tim
2. Daftar anggota tiap tim beserta role/jabatan
3. Foto/logo (jika ada) untuk tim dan program
4. Kontak resmi (nomor WhatsApp/email) untuk CTA
5. Media sosial resmi Sekolah Gajahwong/G-SEE (jika ada)
6. Dokumentasi/foto kegiatan asli (opsional, untuk memperkuat kredibilitas)

## 11. Timeline Singkat (Diusulkan)

| Tahap | Kegiatan | Estimasi |
|---|---|---|
| 1 | Finalisasi konten (poin 10) & review PRD di rapat tim | 3–5 hari |
| 2 | Desain wireframe/mockup low-fidelity | 2–3 hari |
| 3 | Development landing page | 5–7 hari |
| 4 | Review internal & revisi | 2–3 hari |
| 5 | Deploy ke hosting | 1 hari |

## 12. Catatan Penutup

Dokumen ini adalah **draft awal** yang perlu divalidasi bersama tim (khususnya bagian konten tim & role, serta gaya visual) sebelum masuk tahap desain dan development. PRD ini dapat diperbarui seiring hasil diskusi rapat.
