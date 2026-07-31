# Rencana Implementasi Arsitektur Multi-Page G-SEE

Dokumen ini menjelaskan rencana perubahan struktur landing page G-SEE dari satu halaman (single-page) menjadi situs multi-page menggunakan struktur folder Next.js App Router.

## Struktur Halaman Baru (Sitemap)

1. **Beranda (`/`):**
   - Hero Section dengan visual ceria.
   - Latar belakang ringkas Sekolah Gajahwong & G-SEE.
   - Teaser singkat Tiga Pilar & Tombol selengkapnya.
   - Ringkasan statistik dampak.

2. **Program Kami (`/program`):**
   - Halaman detail yang mendalam mengenai **Smart Learning**, **Smart Environment**, dan **Modul Pendampingan**.
   - Dilengkapi ilustrasi interaktif, kurikulum pembelajaran, dan contoh kegiatan praktis (daur ulang, berkebun).

3. **Tim Kami (`/tim`):**
   - Grid layout yang menarik untuk menampilkan 3 kelompok tim (total 9 anggota).
   - Card anggota tim yang interaktif dengan filter visual dan detail peran lengkap.

4. **Hubungi Kami (`/kontak`):**
   - Formulir integrasi kolaborasi lengkap, alamat kantor fisik/sekolah, nomor WhatsApp, serta peta lokasi interaktif.

---

## User Review Required

> [!IMPORTANT]
> **Struktur Menu Navigasi:**
> Navigasi di Navbar akan berubah dari smooth-scroll internal (`#program`, `#tim`) menjadi tautan halaman penuh (`/program`, `/tim`, `/kontak`). Kami akan memperbarui [site.ts](file:///c:/website/website_fariz/FE-SGW/src/data/site.ts) agar otomatis merujuk ke rute Next.js yang benar.

> [!TIP]
> **Rekomendasi Diskusi:**
> Anda dapat menggunakan perintah `/grill-me` jika ingin menyelaraskan detail desain visual halaman Program dan Tim secara interaktif melalui wawancara singkat bersama AI.

## Open Questions

> [!IMPORTANT]
> 1. Apakah Anda ingin kami langsung memisahkan rute-rute ini ke dalam folder baru Next.js App Router (`src/app/program/page.tsx`, `src/app/tim/page.tsx`, `src/app/kontak/page.tsx`)?
> 2. Untuk halaman Tim, apakah Anda setuju jika kami mendesain layout grid modern dengan hover-card yang menunjukkan kutipan dedikasi singkat atau detail skill dari masing-masing 9 anggota?

---

## Proposed Changes

### [Next.js App Routing]

#### [NEW] [src/app/program/page.tsx](file:///c:/website/website_fariz/FE-SGW/src/app/program/page.tsx)
Halaman detail Program G-SEE.

#### [NEW] [src/app/tim/page.tsx](file:///c:/website/website_fariz/FE-SGW/src/app/tim/page.tsx)
Halaman grid profil 9 anggota Tim G-SEE dengan detail role yang interaktif.

#### [NEW] [src/app/kontak/page.tsx](file:///c:/website/website_fariz/FE-SGW/src/app/kontak/page.tsx)
Halaman formulir kontak dan detail alamat Sekolah Gajahwong.

#### [MODIFY] [src/app/page.tsx](file:///c:/website/website_fariz/FE-SGW/src/app/page.tsx)
Pembersihan konten beranda agar fokus pada pengenalan platform dan latar belakang program.

#### [MODIFY] [src/data/site.ts](file:///c:/website/website_fariz/FE-SGW/src/data/site.ts)
Pembaruan rute navigasi dari hash anchors (`#`) menjadi path URLs (`/`).

## Verification Plan

### Automated Tests
- Menjalankan build produksi (`npm run build`) untuk memverifikasi kebenaran rute statis/dinamis Next.js.

### Manual Verification
- Navigasi antar halaman melalui navbar untuk memastikan tidak ada broken links.
- Menguji kecocokan layout responsif di setiap rute halaman baru.
