# Product Requirements Document (PRD) v3
## Sistem Digital KB/RA Sahabat — Tervalidasi Hasil Riset Pengguna & Rapat Tim

**Versi:** 3.0 (Revisi — menggantikan PRD v2, berbasis hasil validasi kebutuhan nyata)
**Tanggal:** 3 Agustus 2026
**Sumber data:** Form "Validasi Kebutuhan Sistem Digital KB/RA Sahabat" (3 responden: Kepala Sekolah, Guru Kelas, Bendahara) + notulen diskusi tim internal
**Status:** Draft — akan dibahas lebih lanjut pada pertemuan tatap muka di sekolah, 12 Agustus 2026

> **Instruksi untuk AI Agent:** Dokumen ini adalah acuan kebutuhan fungsional **paling akurat saat ini**, karena berbasis data langsung dari calon pengguna sistem (bukan asumsi tim). Rujuk dokumen ini di atas PRD versi sebelumnya (v2) untuk detail fitur dan alur kerja. Untuk acuan visual/warna tetap gunakan `DESIGN_SYSTEM_RA_Sahabat.md`.

---

## 1. Ringkasan Perubahan dari PRD Sebelumnya

PRD v2 disusun berdasarkan hasil survei lapangan awal (observasi). PRD v3 ini **memvalidasi dan mempertajam** kebutuhan tersebut melalui:
1. Form kebutuhan sistem yang diisi langsung oleh 3 pengguna kunci: **Kepala Sekolah/Pengelola**, **Guru Kelas**, dan **Bendahara**
2. Hasil rapat tim internal yang sudah menyepakati pembagian peran akses dan scope pengerjaan

Perubahan besar dari versi sebelumnya:
- Proyek dipecah tegas menjadi **2 sistem terpisah**: Website Profil Sekolah (publik) dan Website Internal (admin/manajemen)
- Modul transaksi (SPP & Tabungan) **fokus pada pencatatan**, bukan pembayaran online/payment gateway
- **Tidak ada akun login untuk siswa** — siswa hanya berupa data (identitas, SPP, tabungan, rapor), bukan pengguna sistem
- Struktur akses internal sudah punya 3 role yang disepakati: **Admin Administrasi**, **Admin Transaksi**, **Guru**
- Beberapa modul masih **belum final** dan perlu pembahasan lanjutan pada pertemuan 12 Agustus 2026: rapor pembelajaran siswa, laporan administrasi, laporan dokumentasi untuk akreditasi

## 2. Insight dari Hasil Validasi Kebutuhan (Ringkasan Riset)

### 2.1 Profil Responden

| Nama | Peran | Kenyamanan Pakai Aplikasi (1–5) |
|---|---|---|
| Firdla Nisa Sucyana, S.ST., S.Pd | Kepala Sekolah/Pengelola | 4 |
| Rahma Diana Putri | Guru Kelas | 5 |
| Ajeng | Bendahara/Pengelola Keuangan | 3 |

Ketiganya saat ini mengelola administrasi memakai kombinasi **buku tulis, Excel, Google Sheets, Google Docs, Word, WhatsApp, dan Google Drive** — belum ada sistem terpusat.

### 2.2 Masalah Administratif yang Dikonfirmasi Langsung Pengguna

| Masalah | Disebutkan Oleh |
|---|---|
| Data lupa tercatat | Kepala Sekolah, Bendahara |
| Sulit mencari dokumentasi kegiatan lama | Kepala Sekolah, Guru |
| Laporan harus ditulis ulang dari awal | Kepala Sekolah, Guru |
| Data yang sama dicatat berulang di tempat berbeda | Kepala Sekolah & Bendahara: **"Sering"**, Guru: "Kadang-kadang" |

### 2.3 Tugas yang Paling Menyita Waktu (lintas responden)

- Memasukkan data peserta didik
- Mencatat pembayaran SPP & tabungan
- Mengumpulkan foto/video dokumentasi kegiatan
- Mencari dokumentasi kegiatan lama
- Menyusun rapor & laporan kegiatan
- Menyiapkan dokumen akreditasi

### 2.4 Tingkat Kebutuhan Fitur (Rangkuman 3 Responden)

| Fitur | Kepala Sekolah | Guru | Bendahara |
|---|---|---|---|
| Website profil sekolah | Cukup | Cukup | Cukup |
| Informasi PPDB | **Sangat dibutuhkan** | Cukup | Cukup |
| Data peserta didik | **Sangat dibutuhkan** | Cukup | Dibutuhkan |
| Monitoring SPP | Dibutuhkan | Cukup | Dibutuhkan |
| Tabungan per anak | **Sangat dibutuhkan** | Cukup | Dibutuhkan |
| Dokumentasi kegiatan | Dibutuhkan | Cukup | Dibutuhkan |
| Rekap & laporan otomatis | Cukup | Cukup | Dibutuhkan |
| Ekspor Excel/PDF | Dibutuhkan | Kurang dibutuhkan | Dibutuhkan |
| Pengelolaan pengguna & hak akses | Dibutuhkan | Cukup | Dibutuhkan |
| Backup data | Dibutuhkan | Cukup | Cukup |
| Rapor perkembangan anak | Dibutuhkan | Cukup | Dibutuhkan |
| Galeri kegiatan publik | **Sangat dibutuhkan** | Cukup | Cukup |

> **Insight:** Kepala Sekolah paling menekankan pentingnya **PPDB, data siswa, tabungan, dan galeri publik** (kemungkinan karena berkaitan langsung dengan branding & operasional lembaga). Bendahara menekankan hampir semua fitur transaksional & pelaporan dengan tingkat "Dibutuhkan" merata. Guru relatif menilai semua fitur "Cukup dibutuhkan" — kemungkinan karena fokus utamanya di kelas, bukan administrasi lembaga.

### 2.5 Manfaat yang Diharapkan (gabungan seluruh responden)
- Mengurangi pencatatan berulang
- Mempercepat input data
- Memudahkan pencarian data
- Mengurangi kesalahan pencatatan
- Membuat rekap otomatis
- Memudahkan laporan ke kepala sekolah/yayasan
- Memudahkan persiapan akreditasi
- Memusatkan informasi sekolah
- Memperkuat branding sekolah

## 3. Kesepakatan Rapat Tim — Struktur Proyek Final

Berdasarkan diskusi tim, proyek dipecah menjadi **2 sistem terpisah**:

### 3.1 Website Profil Sekolah (Publik)
- Akan didiskusikan lebih lanjut bersama pihak sekolah (Bunda Echa) khususnya terkait alur PPDB
- Sifatnya publik, tanpa login

### 3.2 Website Internal (Admin/Manajemen)
- Untuk penggunaan internal oleh Kepala Sekolah, Admin Administrasi, Admin Transaksi, dan Guru
- Akan ada sesi diskusi & pemaparan lanjutan ke para "Bunda" (staf pengajar) di sekolah setelah rancangan awal selesai
- Fitur yang **sudah jelas arah dan datanya:**
  - Pencatatan Transaksi (Tabungan dan SPP) — data sementara mengacu ke hasil form ini
  - Dokumentasi Kegiatan
- Fitur yang **belum final, perlu pembahasan lanjutan (12 Agustus 2026):**
  - Rapor pembelajaran siswa
  - Laporan administrasi
  - Laporan dokumentasi untuk kebutuhan akreditasi

## 4. Struktur Peran & Hak Akses (Website Internal)

Ini adalah pembagian akses yang **sudah disepakati tim** dan menjadi acuan utama pengembangan modul internal:

### 4.1 Admin Administrasi
| Akses | Detail |
|---|---|
| Data peserta didik | Kelola identitas & data dasar peserta didik |
| Data administrasi | Kelola data administratif umum sekolah |
| Informasi kegiatan | Kelola info kegiatan yang akan/sudah berlangsung |
| Dokumentasi | Kelola dokumentasi kegiatan |
| Laporan umum | Akses laporan umum sekolah |

### 4.2 Admin Transaksi
| Akses | Detail |
|---|---|
| Pencatatan pembayaran & transaksi | SPP dan Tabungan — **hanya pencatatan status**, bukan payment gateway |
| Rekap dan laporan transaksi | Rekap otomatis dari data yang dicatat |

### 4.3 Guru
| Akses | Detail |
|---|---|
| Melihat/memperbarui data tertentu | Sesuai batasan yang ditentukan (belum detail — perlu klarifikasi field mana saja) |
| Mengakses data kelas | Data kelas yang diampu |
| Menambahkan dokumentasi kegiatan | Guru dapat kontribusi dokumentasi, tidak hanya Admin Administrasi |
| Menambahkan laporan pembelajaran kelas | Terkait modul rapor yang masih perlu difinalisasi |
| Melihat laporan yang diperbolehkan | Akses laporan dibatasi sesuai izin (role-based access) |

> **Catatan penting untuk AI Agent:** Sistem **tidak memiliki akun/login untuk siswa**. Siswa hanya direpresentasikan sebagai **data** (bukan user), mencakup: identitas, status SPP, status tabungan, dan rapor. Pastikan arsitektur sistem tidak membuat entitas "user" untuk siswa — cukup entitas "data peserta didik" yang dikelola oleh role Admin/Guru.

## 5. Detail Alur Kerja per Modul (Hasil Klarifikasi Tim)

### 5.1 Modul SPP
- **Bukan sistem pembayaran online.** Pembayaran tetap dilakukan langsung (tunai/manual) oleh orang tua ke Bendahara
- Bukti pembayaran berupa **struk cetak/kwitansi fisik** — sistem tidak menggantikan bukti fisik ini, hanya mencatat statusnya secara digital
- Alur sesuai konfirmasi Bendahara: *"Orang tua membayar kepada saya, saya yang memeriksa, saya yang membuat laporan, dan memberikan laporan kepada kepala sekolah dan yayasan"*
- Informasi yang perlu tersedia di sistem: status sudah/belum bayar, riwayat pembayaran per anak, rekap per kelas, rekap tahunan, bukti pembayaran (kemungkinan berupa foto/scan kwitansi), ekspor Excel/PDF, dan **pengingat WhatsApp** (disebutkan Bendahara sebagai kebutuhan)

### 5.2 Modul Tabungan
- Tetap menggunakan **buku tabungan fisik per anak** sebagai media utama pencatatan di lapangan
- Alur fisik: buku tabungan dikumpulkan di keranjang per kelas → disetor ke Bendahara/Kepala Madrasah secara berkala (bulanan)
- Sistem digital berfungsi sebagai **rekap terpusat**, bukan pengganti buku fisik
- Informasi yang perlu tersedia: saldo tiap anak, riwayat setoran, riwayat penarikan, tanggal transaksi, nama pencatat, rekap per kelas, rekap seluruh anak, bukti transaksi, ekspor Excel/PDF

> **Catatan perbedaan penanggung jawab:** Ada sedikit perbedaan jawaban soal siapa penanggung jawab tabungan — Kepala Sekolah menyebut "Kepala Madrasah", Guru menyebut "Bendahara". Ini perlu diklarifikasi ulang saat pertemuan 12 Agustus agar alur approval di sistem jelas siapa pemegang otoritas akhir.

### 5.3 Modul Dokumentasi Kegiatan
Field yang disepakati (gabungan seluruh responden):
- Judul dan tanggal kegiatan
- Deskripsi dan tujuan
- Kategori kegiatan
- Kelas atau peserta
- Penanggung jawab
- Tautan Google Drive (dokumentasi tetap disimpan di Drive, sistem hanya menautkan)
- Pencarian berdasarkan tanggal/kategori

### 5.4 Modul Rapor Perkembangan Anak (Belum Final)
- Rapor **hanya diperuntukkan bagi guru** sebagai alat pencatatan — orang tua **tidak mengakses rapor secara real-time**
- Orang tua baru mendapat informasi **setelah rapor selesai direkap** oleh guru/sekolah
- Dukungan yang dibutuhkan guru: data perkembangan anak tersimpan dalam satu tempat, catatan perkembangan per periode, template rapor yang mudah diisi, rekap perkembangan otomatis, penyimpanan riwayat rapor
- **Status: perlu pembahasan lebih lanjut** pada pertemuan 12 Agustus 2026 — belum final soal format/struktur rapor yang dipakai sekolah saat ini

### 5.5 Laporan Administrasi & Laporan Akreditasi (Belum Final)
- Kedua modul ini disebut dalam hasil rapat sebagai **belum jelas dan pasti** — perlu digali lebih dalam soal format laporan yang selama ini dipakai sekolah, serta struktur yang dibutuhkan untuk kebutuhan akreditasi resmi (BAN-PDM)
- AI Agent **tidak disarankan membangun modul ini dulu** sampai ada klarifikasi lanjutan pasca pertemuan 12 Agustus 2026

## 6. Website Profil Sekolah (Publik) — Detail Konten

Berdasarkan gabungan jawaban ketiga responden, konten yang perlu ada di halaman publik:

- Profil sekolah & sejarah sekolah
- Visi dan misi
- Program pembelajaran
- Nilai keislaman/Aswaja (khas identitas NU)
- Profil guru
- Informasi PPDB
- Galeri foto kegiatan
- Alamat dan peta lokasi
- Kontak dan sosial media
- Berita terbaru

> Poin ini sejalan dengan struktur landing page yang sudah dirancang di PRD v2 — tidak ada perubahan besar, hanya validasi bahwa struktur tersebut sudah tepat.

## 7. Kesiapan Pengelolaan & Keberlanjutan Sistem (Hasil Survei)

| Aspek | Kepala Sekolah | Guru | Bendahara |
|---|---|---|---|
| Sekolah dapat menunjuk admin utama | Ya | Mungkin/perlu dibicarakan | Ya |
| Sekolah dapat menunjuk admin cadangan | Ya | Mungkin/perlu dibicarakan | Mungkin/perlu dibicarakan |
| Hak akses tiap pengguna perlu dibedakan | Ya | **Tidak** | **Tidak** |
| Sekolah bersedia mengikuti pelatihan | Ya | **Tidak** | Ya |
| Sekolah bersedia mengikuti uji coba sistem | Ya | Mungkin/perlu dibicarakan | Ya |
| Panduan tertulis/video diperlukan | Mungkin/perlu dibicarakan | Mungkin/perlu dibicarakan | Mungkin/perlu dibicarakan |
| Backup data berkala diperlukan | Mungkin/perlu dibicarakan | Ya | Ya |

> **Insight penting:** Ada **perbedaan pandangan** soal perlunya hak akses dibedakan per pengguna — Kepala Sekolah setuju, tapi Guru dan Bendahara menjawab "Tidak". Ini kemungkinan karena mereka belum membayangkan risikonya, atau merasa lingkup kerja mereka sudah cukup jelas tanpa perlu pembatasan formal. **Perlu didiskusikan ulang** di pertemuan 12 Agustus — karena role-based access sudah disepakati di struktur tim (section 4), tapi persepsi pengguna soal "perlu dibedakan" masih beragam.
>
> Guru juga menjawab **"Tidak bersedia pelatihan formal"** — ini penting untuk AI Agent: **desain harus semaksimal mungkin self-explanatory / intuitif**, tidak boleh terlalu bergantung pada asumsi bahwa semua pengguna akan mengikuti pelatihan.

## 8. Indikator Keberhasilan (Menurut Pengguna)

| Responden | Definisi "Berhasil" |
|---|---|
| Kepala Sekolah | Mungkin baru bisa dinilai setelah 1 semester berjalan |
| Guru | Mudah digunakan di HP dan perangkat lain |
| Bendahara | Mudah digunakan di device manapun, laporan menjadi lebih mudah |

> **Insight untuk AI Agent:** Seluruh responden menekankan pentingnya **kemudahan akses lintas perangkat, terutama HP**. Ini menegaskan prioritas **mobile-first design** untuk Website Internal, bukan hanya optimalisasi desktop.

## 9. Catatan Anggaran & Hosting (dari Notulen Rapat Awal)

- Rencana: menggunakan **uji coba gratis** terlebih dahulu, dengan opsi **hosting berbayar** di tahap selanjutnya
- Perlu didiskusikan dengan "bunda-bunda" lain (pihak sekolah) sebelum diputuskan
- Pertemuan lanjutan dijadwalkan **12 Agustus 2026** langsung di lokasi sekolah untuk membahas hal ini beserta modul yang belum final

## 10. Ringkasan Prioritas Pengembangan (Diperbarui)

| Prioritas | Modul | Status Kejelasan Data |
|---|---|---|
| 1 | Website Profil Sekolah (publik) | Jelas — tinggal finalisasi PPDB bersama Bunda Echa |
| 2 | Dokumentasi Kegiatan (internal) | Jelas — field sudah disepakati |
| 3 | Pencatatan Transaksi SPP & Tabungan (internal) | Jelas — alur & field sudah divalidasi |
| 4 | Rapor Perkembangan Anak | **Belum final** — tunggu hasil pertemuan 12 Agustus |
| 5 | Laporan Administrasi | **Belum final** — tunggu hasil pertemuan 12 Agustus |
| 6 | Laporan Dokumentasi Akreditasi | **Belum final** — tunggu hasil pertemuan 12 Agustus |

## 11. Pertanyaan Terbuka untuk Pertemuan 12 Agustus 2026

1. Siapa pemegang otoritas akhir tabungan — Kepala Madrasah atau Bendahara? (ada jawaban berbeda antar responden)
2. Format/struktur rapor pembelajaran yang selama ini dipakai sekolah — apakah ada template baku dari Kemenag/yayasan?
3. Format laporan administrasi yang selama ini disusun — bentuknya seperti apa dan untuk siapa saja ditujukan?
4. Struktur laporan dokumentasi untuk akreditasi — mengacu ke instrumen BAN-PDM yang mana, dan siapa yang biasanya menyusunnya?
5. Apakah hak akses per role benar-benar perlu dibatasi ketat, mengingat Guru & Bendahara menjawab "Tidak" — perlu diskusi ulang supaya tidak menyulitkan penggunaan sehari-hari padahal secara teknis sudah direncanakan role-based
6. Karena Guru menyatakan tidak bersedia pelatihan formal, perlu dibahas: bentuk pendampingan seperti apa yang realistis (panduan singkat, video pendek, atau pendampingan langsung saat uji coba)?
7. Kesepakatan anggaran hosting — kapan transisi dari uji coba gratis ke hosting berbayar akan dilakukan?

## 12. Penutup

PRD v3 ini menegaskan bahwa arah proyek sudah **tervalidasi langsung oleh calon pengguna**, bukan lagi asumsi tim semata. Modul yang sudah jelas (Website Profil, Dokumentasi Kegiatan, Pencatatan SPP & Tabungan) dapat mulai dikerjakan, sementara 3 modul yang belum final (Rapor, Laporan Administrasi, Laporan Akreditasi) **sebaiknya ditahan dulu** sampai hasil pertemuan 12 Agustus 2026 didapat, agar pengembangan tidak berjalan di atas asumsi yang keliru.
