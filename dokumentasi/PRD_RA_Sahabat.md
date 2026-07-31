# Product Requirements Document (PRD)
## Sistem Digital KB/RA Sahabat — Berbah, Sleman, Yogyakarta

**Versi:** 2.0 (Revisi — menggantikan PRD G-SEE sebelumnya)
**Tanggal:** 31 Juli 2026
**Disusun oleh:** Tim Front-End Development
**Status:** Draft — untuk dibahas di rapat tim & pendaftaran Kalijaga Changemakers

---

## 1. Latar Belakang

Proyek ini merupakan hasil pivot dari rencana awal (G-SEE untuk Sekolah Gajahwong) setelah dilakukan survei langsung ke lokasi baru: **KB (Kelompok Bermain) / RA (Raudhatul Athfal) Sahabat**, lembaga PAUD swasta di wilayah **Berbah, Sleman, Yogyakarta**, di bawah naungan **Kementerian Agama (Kemenag)** dengan afiliasi **Nahdlatul Ulama (NU)**.

RA Sahabat saat ini dikelola oleh **6 guru** yang merangkap berbagai peran administratif (double job), dan masih dalam tahap berkembang dari sisi sistem pengelolaan digital.

### 1.1 Tiga Masalah Utama Hasil Survei

1. **Belum ada identitas digital (rebranding)** yang mencerminkan profil lembaga secara profesional
2. **Pencatatan SPP per anak masih manual**, rawan human error dan sulit dipantau
3. **Dokumentasi kegiatan belum terstruktur**, padahal dibutuhkan sebagai bukti fisik untuk akreditasi resmi (BAN-PDM via Sispena)

### 1.2 Konteks Tambahan

Proyek ini juga direncanakan didaftarkan sebagai bagian dari program **Kalijaga Changemakers**, sehingga narasi dampak sosial dan keberlanjutan program menjadi bagian penting yang perlu tercermin dalam pelaksanaan, bukan hanya dari sisi teknis.

## 2. Tujuan Proyek (Goal)

> Mewujudkan RA Sahabat sebagai KB/RA yang lebih terorganisir, terdokumentasi, dan siap secara administratif menghadapi akreditasi, tanpa menambah beban kerja tim pengajar yang sudah terbatas.

### 2.1 Objective Terukur

| No | Objective | Indikator Keberhasilan |
|---|---|---|
| 1 | Tersedia website rebranding RA Sahabat | Website aktif digunakan & dapat diakses publik |
| 2 | Tersedia sistem pencatatan SPP per anak | Digunakan aktif minimal oleh 1 admin/guru penanggung jawab |
| 3 | Tersedia sistem dokumentasi kegiatan | Minimal terdapat data kegiatan dalam periode program, siap jadi bukti akreditasi |
| 4 | Guru mampu mengoperasikan sistem secara mandiri | Tidak ada ketergantungan ke tim developer setelah serah terima |

## 3. Target Pengguna

Target dipersempit secara spesifik (bukan "masyarakat umum") menjadi warga RA Sahabat:

| Target | Kebutuhan Utama |
|---|---|
| **6 Guru RA Sahabat** | Sistem yang meringankan, bukan menambah kerja administratif |
| **Peserta didik (usia dini, KB/RA)** | Penerima manfaat tidak langsung dari kualitas pengajaran yang lebih baik |
| **Orang tua/wali murid** | Transparansi info SPP & kegiatan, kepercayaan terhadap lembaga |
| **Pengelola/Pemilik yayasan** | Kesiapan akreditasi, citra publik, laporan keuangan (SPP) |
| **Calon wali murid (publik)** | Info profil lembaga melalui landing page (rebranding) |

## 4. Ruang Lingkup Proyek

Proyek dibagi menjadi 3 modul utama. Detail scope dan fase pengerjaan sebagai berikut:

| Modul | Termasuk Scope | Fase |
|---|---|---|
| **A. Rebranding — Landing Page** | Profil lembaga, visi-misi, galeri kegiatan publik, info PPDB sederhana, kontak | Fase 1 (prioritas utama saat ini) |
| **B. Dokumentasi Kegiatan** | Form input kegiatan, link Google Drive, kategorisasi, kalender kegiatan otomatis, export data | Fase 2 |
| **C. Monitoring SPP** | Dashboard status pembayaran per anak, input manual, rekap otomatis | Fase 3 |
| **D. Fitur Tambahan (opsional)** | Notifikasi WhatsApp, rapor sederhana, data induk siswa/guru terpusat | Fase 4 (dibahas lebih lanjut, tidak wajib) |

**Tidak termasuk scope saat ini:**
- Sistem pembayaran online/payment gateway (SPP tetap dicatat manual oleh admin, bukan transfer otomatis)
- Aplikasi mobile terpisah
- Sistem akademik kompleks (rapor detail, kurikulum digital)

## 5. Breakdown Kegiatan Pelaksanaan (untuk narasi Changemakers)

| No | Kegiatan | Sasaran Langsung |
|---|---|---|
| 1 | Survei & wawancara kondisi eksisting | Guru & pengelola |
| 2 | Workshop pengenalan sistem digital | 6 guru |
| 3 | Peluncuran website rebranding | Publik/orang tua calon murid |
| 4 | Pelatihan input data SPP & dokumentasi kegiatan | Guru (admin) |
| 5 | Pendampingan dokumentasi untuk kebutuhan akreditasi | Pengelola/penanggung jawab akreditasi |
| 6 | Evaluasi & serah terima sistem | Seluruh warga RA Sahabat |

## 6. Struktur Halaman — Fase 1 (Landing Page Rebranding)

```
1. Navbar (Logo RA Sahabat, menu: Beranda, Profil, Kegiatan, PPDB, Kontak)
2. Hero Section (Nama lembaga + tagline + CTA)
3. Profil Lembaga (sejarah singkat, visi-misi, naungan Kemenag & nilai ke-NU-an)
4. Keunggulan/Program Unggulan RA Sahabat
5. Galeri Kegiatan (menampilkan dokumentasi kegiatan terbaru)
6. Info PPDB (Penerimaan Peserta Didik Baru) sederhana
7. Testimoni Orang Tua (opsional)
8. Call-to-Action & Kontak
9. Footer (alamat, kontak, sosial media)
```

## 7. Kebutuhan Fungsional

### 7.1 Modul Rebranding (Fase 1)
| No | Kebutuhan | Prioritas |
|---|---|---|
| 1 | Halaman dapat diakses publik tanpa login | Wajib |
| 2 | Responsive (mobile, tablet, desktop) | Wajib |
| 3 | Form PPDB sederhana (nama anak, orang tua, kontak) | Wajib |
| 4 | Galeri kegiatan menampilkan foto/dokumentasi terbaru | Wajib |
| 5 | SEO dasar agar mudah ditemukan calon wali murid | Disarankan |

### 7.2 Modul Dokumentasi Kegiatan (Fase 2)
| No | Kebutuhan | Prioritas |
|---|---|---|
| 1 | Form input kegiatan (judul, tanggal, deskripsi, tujuan) | Wajib |
| 2 | Field tautan Google Drive per kegiatan | Wajib |
| 3 | Kategorisasi kegiatan (akademik, keagamaan, ekstrakurikuler, dll) | Wajib |
| 4 | Kalender kegiatan tahunan otomatis dari data yang diinput | Wajib |
| 5 | Export daftar kegiatan ke PDF/Excel | Disarankan |

### 7.3 Modul Monitoring SPP (Fase 3)
| No | Kebutuhan | Prioritas |
|---|---|---|
| 1 | Dashboard status pembayaran per anak per bulan | Wajib |
| 2 | Input status pembayaran (form sederhana, minim langkah) | Wajib |
| 3 | Rekap otomatis bulanan/tahunan (dapat diunduh) | Wajib |
| 4 | Riwayat pembayaran per anak | Disarankan |
| 5 | Notifikasi pengingat otomatis (WhatsApp) | Opsional (Fase 4) |

## 8. Kebutuhan Non-Fungsional

- **Kemudahan penggunaan (usability):** prioritas utama — sistem harus bisa dioperasikan guru non-teknis tanpa training panjang, mengingat keterbatasan SDM (6 guru double job)
- **Performa:** halaman ringan, gambar dioptimasi, mengingat kemungkinan akses dari koneksi internet terbatas
- **Aksesibilitas:** kontras warna & ukuran teks tetap terbaca jelas untuk pengguna segala usia (termasuk orang tua/guru yang mungkin kurang familiar teknologi)
- **Keamanan data:** data anak (nama, kontak, status pembayaran) hanya dapat diakses oleh pihak berwenang (guru/admin), bukan publik

## 9. Panduan Desain Visual

### 9.1 Palet Warna (Usulan Awal — perlu konfirmasi preferensi yayasan)

Karena RA Sahabat berada di bawah naungan Kemenag dengan afiliasi NU, palet warna diusulkan mencerminkan nuansa Islami yang hangat dan ramah anak — namun tetap terbuka untuk disesuaikan dengan preferensi pemilik/yayasan:

| Peran Warna | Kode Warna (Usulan) | Kegunaan |
|---|---|---|
| Primary Green | `#0F9D58` | Warna utama, mencerminkan nuansa Islami & PAUD |
| Primary Dark | `#0A6B3D` | Hover state, teks penting |
| Soft Mint | `#E8F7EF` | Background section |
| Warm Gold (aksen) | `#E8B84B` | Aksen ceria, mencerminkan nuansa islami-hangat, cocok untuk badge/highlight |
| Neutral Dark | `#2E3A32` | Teks utama |
| White | `#FFFFFF` | Background utama |

> **Catatan:** Palet ini adalah usulan awal berdasarkan konteks kelembagaan. Sebaiknya dikonfirmasi ke pihak yayasan/pemilik apakah ada preferensi warna atau identitas visual tertentu (misal warna khas NU/logo lembaga) sebelum difinalisasi.

### 9.2 Tipografi

Mengikuti pendekatan ramah anak sekaligus tetap kredibel untuk audiens dewasa (orang tua, Kemenag, penilai akreditasi):

| Elemen | Font | Karakter |
|---|---|---|
| Heading | **Baloo 2** atau **Poppins** | Rounded, ramah, tetap profesional |
| Body text | **Quicksand** atau **Nunito** | Nyaman dibaca, rounded halus |

## 10. Tech Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Frontend | React + TypeScript + Vite | Ringan, cocok untuk halaman publik + dashboard sederhana |
| Styling | Tailwind CSS | Cepat, konsisten |
| Backend | Menyesuaikan kesepakatan tim backend (Laravel/API terpisah, atau Supabase jika dikerjakan solo) | Perlu dikonfirmasi siapa yang pegang backend |
| Hosting Frontend | Vercel/Netlify | Gratis, mudah untuk halaman statis/SPA |
| Dokumentasi Media | Google Drive (eksternal, hanya ditautkan) | Tidak perlu upload file besar ke sistem sendiri |

## 11. Konten yang Perlu Disiapkan Sebelum Development

1. Nama resmi & struktur 3 tim beserta role masing-masing anggota (untuk keperluan internal/pendaftaran Changemakers)
2. Profil lengkap RA Sahabat (sejarah, visi-misi, foto, logo jika ada)
3. Kontak resmi (WhatsApp/email) untuk CTA di landing page
4. Preferensi warna/identitas visual dari pihak yayasan (jika ada)
5. Contoh data kegiatan yang sudah pernah dilaksanakan (untuk uji coba modul dokumentasi)
6. Alur pencatatan SPP yang berjalan saat ini (manual di buku/Excel) agar sistem baru menyesuaikan kebiasaan yang ada

## 12. Roadmap & Timeline (Diusulkan)

| Fase | Fokus | Estimasi |
|---|---|---|
| Fase 1 | Rebranding — Landing Page | 2–3 minggu |
| Fase 2 | Modul Dokumentasi Kegiatan | 2–3 minggu |
| Fase 3 | Modul Monitoring SPP | 2–3 minggu |
| Fase 4 (opsional) | Fitur tambahan sesuai kebutuhan lanjutan | Menyesuaikan |

## 13. Pertanyaan Terbuka (Perlu Diklarifikasi Sebelum/Selama Development)

1. Siapa admin/penanggung jawab utama input data sistem (SPP & kegiatan)?
2. Bagaimana alur pencatatan SPP yang berjalan saat ini?
3. Apakah sudah ada folder Google Drive terstruktur untuk dokumentasi kegiatan?
4. Kapan jadwal akreditasi berikutnya (jika sudah diketahui)?
5. Apakah ada preferensi visual/branding khusus dari pemilik/yayasan?
6. Siapa yang memegang pengembangan backend (Laravel/lainnya), dan bagaimana kontrak API-nya?

## 14. Penutup

PRD ini menggantikan dokumen PRD sebelumnya (G-SEE untuk Sekolah Gajahwong) dan menjadi acuan utama pengembangan sistem digital KB/RA Sahabat. Pendekatan pengembangan bersifat **bertahap, realistis terhadap kapasitas tim (6 guru double job)**, dan berorientasi pada dampak nyata — khususnya kesiapan administratif menghadapi akreditasi resmi, sejalan dengan semangat program Kalijaga Changemakers yang menekankan perubahan nyata dan berkelanjutan.
