# KB/RA Sahabat Berbah Sleman - Website Publik & Portal Belajar

Aplikasi web terintegrasi untuk **KB/RA Sahabat Berbah Sleman** yang menggabungkan website publik (company profile sekolah, dokumentasi kegiatan, dan galeri interaktif) dengan portal belajar internal (sistem informasi manajemen sekolah untuk administrasi, keuangan SPP, tabungan, dan penilaian akademik santri).

---

## 🚀 Fitur Utama

### 1. Website Publik (Landing Page)
*   **Beranda (Home)**: Informasi profil singkat sekolah, pilar keunggulan, statistik madrasah, testimoni wali murid, serta preview dokumentasi terpopuler yang mengarahkan langsung ke PPDB online.
*   **Program Kegiatan (/program)**: Halaman komprehensif yang memadukan pilar keunggulan (Karakter Aswaja NU, Metode Playful Learning, Tumbuh Kembang Sehat).
*   **Galeri Foto (/galeri)**: Pure Visual Showcase minimalis dengan grid rasio `4:3`, sudut `rounded-xl`, proteksi anti-selection/anti-copy teks (`select-none`), serta slideshow Full-Screen Lightbox interaktif (mendukung keyboard arrow/escape).
*   **Kontak & PPDB (/kontak)**: Halaman informasi kontak, peta madrasah, formulir registrasi PPDB, dan link WhatsApp Center.

### 2. Portal Belajar Dashboard (Internal Management)
*   **Dashboard Utama**: Statistik ringkasan cepat murid aktif, transaksi SPP bulan ini, total tabungan, dan riwayat aktivitas audit log petugas.
*   **Sistem SPP Multi-Bulan & Matriks Monitoring**:
    *   Mendukung pencatatan pembayaran SPP langsung beberapa bulan sekaligus dalam satu transaksi.
    *   Matriks monitoring bulanan (Soft Glass Badge dengan SVG ✓/✗) untuk melacak status pembayaran murid dari Juli hingga Juni.
    *   Sistem deteksi otomatis bulan tunggakan pertama, dan pencegahan bayar ganda (checkbox lunas dinonaktifkan).
    *   Penyaringan otomatis murid aktif (Alumni/Murid berstatus "Lulus" otomatis disembunyikan).
*   **Buku Tabungan Digital Murid**: Catatan mutasi setor/tarik tabungan personal dengan pintasan nominal harian (5rb, 10rb, 20rb, 50rb) serta akumulasi saldo otomatis.
*   **Matriks Penilaian Murajaah & Tahfidz**: Lembar kerja penilaian hafalan doa harian, surat pendek, hadits pilihan, PAI, wudhu/sholat dhuha secara inline menggunakan skala nilai (`sb`, `b`, `c`, `k`, `-`). Dilengkapi tombol eksport laporan ke berkas PDF.
*   **Manajemen Data Siswa (Student)**: Pendaftaran murid baru offline dan edit profil lengkap (NISN, tinggi/berat badan, status keaktifan).
*   **Manajemen Kelas & Pengguna (Users)**: Kelola kelompok belajar (KB, RA A, RA B) beserta akun petugas madrasah.

---

## 🔒 Hak Akses Pengguna & Kredensial Uji Coba

Sistem dashboard membatasi akses fitur secara ketat berdasarkan peran pengguna (Role-Based Access Control):

| Nama Petugas | Peran (Role) | Username | Password | Hak Akses Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Bunda Nisa** | Admin Administrasi (`admin_adm`) | `admin_adm` | `admin123` | Semua fitur dasbor, kelola murid, kelola pengguna, kelola kelas, kurasi galeri publik. |
| **Bunda Ajeng** | Admin Transaksi (`admin_trx`) | `admin_trx` | `admin123` | Pembukuan SPP/Les & pencatatan transaksi tabungan murid. |
| **Bunda Rahma** | Guru Kelas (`guru`) | `guru` | `guru123` | Lembar kerja Murajaah hafalan, agenda kegiatan, audit logs kelas. |

---

## 🛠️ Tech Stack

*   **Framework Utama**: [Next.js](https://nextjs.org/) (App Router) + TypeScript
*   **Styling System**: Vanilla CSS & Tailwind CSS (desain adaptif, responsif seluler dengan Sliding Side Drawers).
*   **Animasi**: [Framer Motion](https://www.framer.com/motion/)
*   **Ikon & Ilustrasi**: SVG Custom Icons & Lucide React

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18 ke atas disarankan) dan **npm** di komputer Anda.

### 2. Kloning & Instalasi Dependensi
Jalankan perintah berikut di terminal:
```bash
# Masuk ke direktori project
cd Frontend-SGW

# Install seluruh package pendukung
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Server)
Jalankan dev server secara lokal:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat hasilnya.

### 4. Build untuk Produksi
Untuk melakukan build aplikasi ke versi produksi yang teroptimasi:
```bash
npm run build
```
Hasil build akan diletakkan di dalam folder `.next`.