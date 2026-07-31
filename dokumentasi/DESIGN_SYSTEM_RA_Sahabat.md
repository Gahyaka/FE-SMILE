# Design System — KB/RA Sahabat
## Dokumen Acuan Visual untuk AI Coding Agent

**Versi:** 1.0
**Tanggal:** 31 Juli 2026
**Tujuan dokumen:** Referensi tunggal (single source of truth) bagi AI agent (Claude Code / Copilot / dsb) saat membangun UI proyek ini, agar seluruh halaman — landing page, dashboard SPP, modul dokumentasi kegiatan — konsisten secara visual.

> **Instruksi untuk AI Agent:** Gunakan token warna, font, dan aturan komponen di dokumen ini sebagai acuan utama setiap kali membuat atau mengedit komponen UI. Jangan menciptakan warna/font baru di luar yang tercantum di sini kecuali diminta eksplisit oleh pengguna.

---

## 1. Sumber Identitas Visual

Palet warna diturunkan langsung dari **logo resmi Raudhatul Athfal Sahabat**, yang menampilkan dua karakter anak (laki-laki berkopiah ungu, perempuan berhijab pink) dengan latar lingkaran hijau. Gaya ilustrasi logo bernuansa **kartun/chibi yang ceria dan ramah anak**, sehingga seluruh elemen visual turunan (ikon, ilustrasi, komponen UI) sebaiknya mengikuti nuansa ini — hangat, playful, namun tetap rapi dan profesional untuk audiens dewasa (orang tua, Kemenag, penilai akreditasi).

## 2. Color Palette

### 2.1 Primary — Hijau (dari border & gradasi logo)

| Token | Hex | Kegunaan |
|---|---|---|
| `--color-primary` | `#2CB24A` | Warna utama brand — navbar, tombol utama, elemen aksen dominan |
| `--color-primary-dark` | `#1C8A38` | Hover/active state, teks di atas background terang |
| `--color-primary-light` | `#8ED96B` | Gradasi, elemen dekoratif ringan |
| `--color-primary-soft` | `#E7F8EA` | Background section lembut, card background |

### 2.2 Secondary — Ungu (dari kopiah anak laki-laki)

| Token | Hex | Kegunaan |
|---|---|---|
| `--color-secondary` | `#7A2E8F` | Aksen sekunder — badge, ikon, elemen pembeda dari hijau |
| `--color-secondary-dark` | `#5C2270` | Hover state elemen sekunder |
| `--color-secondary-soft` | `#F2E6F5` | Background lembut untuk elemen bernuansa ungu |

### 2.3 Accent — Pink (dari hijab anak perempuan)

| Token | Hex | Kegunaan |
|---|---|---|
| `--color-accent` | `#EC1E8C` | Aksen ceria — highlight, badge pencapaian, elemen "fun" untuk nuansa anak-anak |
| `--color-accent-dark` | `#C4106E` | Hover state elemen aksen |
| `--color-accent-soft` | `#FCE4F1` | Background lembut bernuansa pink |

### 2.4 Neutral

| Token | Hex | Kegunaan |
|---|---|---|
| `--color-text-dark` | `#2B2B2B` | Teks utama (bukan hitam pekat, agar lebih lembut) |
| `--color-text-muted` | `#6B6B6B` | Teks sekunder/deskripsi |
| `--color-border` | `#E2E2E2` | Border tipis, pembatas antar elemen |
| `--color-background` | `#FFFFFF` | Background utama halaman |
| `--color-background-alt` | `#FAFAFA` | Background alternatif untuk section berselang-seling |

### 2.5 Aturan Penggunaan Warna

- **Hijau** = warna dominan (60–70% penggunaan warna di halaman) — mencerminkan identitas utama lembaga
- **Ungu** = aksen sekunder (20–30%) — untuk membedakan elemen tanpa bersaing dengan hijau
- **Pink** = aksen ceria dalam jumlah kecil (10%) — badge, ikon pencapaian, elemen yang butuh "pop" visual, terutama di bagian yang berhubungan langsung dengan anak-anak (galeri kegiatan, pencapaian siswa)
- Jangan gunakan ketiga warna primer dalam intensitas penuh secara bersamaan di satu elemen kecil (misal satu tombol) — kombinasikan salah satu warna penuh dengan varian *soft* lainnya sebagai background/pendukung
- Untuk teks di atas warna primary/secondary/accent (versi penuh), selalu gunakan teks putih (`#FFFFFF`) untuk memastikan kontras terbaca

## 3. Typography

Font dipilih untuk mencerminkan nuansa ramah-anak dari logo, namun tetap terbaca profesional untuk audiens dewasa (orang tua, pihak Kemenag).

| Elemen | Font | Fallback | Karakter |
|---|---|---|---|
| Heading (H1–H3) | **Baloo 2** | sans-serif | Rounded, tebal, ceria — cocok untuk judul besar |
| Body text | **Quicksand** | sans-serif | Rounded ringan, nyaman dibaca panjang |
| Badge/Aksen kecil (opsional) | **Fredoka** | sans-serif | Untuk label kecil bernuansa playful, misal badge pencapaian anak |

**Import (Google Fonts):**
```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@400;500;600;700&family=Fredoka:wght@500;600&display=swap" rel="stylesheet">
```

**Skala ukuran (rekomendasi):**

| Elemen | Ukuran | Font Weight |
|---|---|---|
| H1 (Hero) | 40–48px | 700 |
| H2 (Section title) | 28–32px | 600 |
| H3 (Card title) | 18–20px | 600 |
| Body text | 16px | 400–500 |
| Small/caption | 13–14px | 400 |

## 4. Bentuk & Layout

- **Border-radius besar** pada semua komponen (card, button, input): `12px`–`20px` — mencerminkan gaya bulat/lembut dari ilustrasi logo (wajah karakter, lingkaran logo)
- **Card** menggunakan shadow lembut (`box-shadow: 0 4px 12px rgba(0,0,0,0.06)`), bukan border tegas, agar terasa ringan
- **Spacing** konsisten menggunakan kelipatan 4px/8px (Tailwind default spacing scale sudah sesuai)
- **Ikon**: gunakan gaya *rounded/filled* (bukan garis tipis/outline tajam) agar selaras dengan gaya ilustrasi logo yang playful

## 5. Komponen — Aturan Spesifik

### 5.1 Tombol (Button)
- **Primary button:** background `--color-primary`, teks putih, border-radius `12px`, hover ke `--color-primary-dark`
- **Secondary button:** border `--color-primary`, teks `--color-primary`, background transparan/putih
- **Accent/CTA button** (untuk ajakan bertindak penting, misal "Daftar PPDB"): background `--color-accent`, teks putih — dipakai terbatas agar tetap terasa spesial

### 5.2 Card
- Background: `--color-background` atau `--color-primary-soft` (untuk card yang butuh sedikit penekanan)
- Border-radius: `16px`
- Padding internal: minimal `16px`, idealnya `24px`

### 5.3 Badge (misal kategori kegiatan, status pembayaran)
- Gunakan warna *soft* sebagai background dan warna penuh yang sesuai sebagai teks, contoh:
  - Badge "Lunas" (SPP): background `--color-primary-soft`, teks `--color-primary-dark`
  - Badge "Belum Bayar": gunakan warna peringatan terpisah (lihat catatan di bawah)
  - Badge kategori kegiatan keagamaan: background `--color-secondary-soft`, teks `--color-secondary-dark`

> **Catatan:** Palet ini belum mencakup warna status/semantic (sukses, peringatan, error) karena logo tidak menyediakan referensi untuk itu. Rekomendasi tambahan non-brand yang aman dipakai:
> - Sukses/Lunas: `#2CB24A` (kebetulan sama dengan primary, aman dipakai ganda)
> - Peringatan/Belum Bayar: `#F5A623` (kuning-oranye netral, tidak bentrok dengan 3 warna brand)
> - Error/Gagal: `#E24C4C` (merah netral, dipakai seperlunya, misal validasi form)

### 5.4 Ilustrasi & Gaya Gambar
- Prioritaskan ilustrasi vektor bergaya kartun/chibi (senada logo) untuk elemen dekoratif, dibanding foto stok formal
- Foto asli dokumentasi kegiatan RA Sahabat tetap ditampilkan apa adanya (autentik), tidak perlu diseragamkan gaya kartun
- Hindari elemen visual tajam, kaku, atau terlalu korporat — semua sudut sebaiknya membulat mengikuti nuansa logo

## 6. Tailwind Config (Referensi Implementasi)

Jika proyek menggunakan Tailwind CSS, AI agent dapat menambahkan token berikut ke `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#2CB24A',
        dark: '#1C8A38',
        light: '#8ED96B',
        soft: '#E7F8EA',
      },
      secondary: {
        DEFAULT: '#7A2E8F',
        dark: '#5C2270',
        soft: '#F2E6F5',
      },
      accent: {
        DEFAULT: '#EC1E8C',
        dark: '#C4106E',
        soft: '#FCE4F1',
      },
      warning: '#F5A623',
      danger: '#E24C4C',
    },
    fontFamily: {
      heading: ['Baloo 2', 'sans-serif'],
      body: ['Quicksand', 'sans-serif'],
      accent: ['Fredoka', 'sans-serif'],
    },
    borderRadius: {
      DEFAULT: '12px',
      lg: '16px',
      xl: '20px',
    },
  },
}
```

## 7. Logo — Aturan Penggunaan

- Logo memiliki latar putih dengan border lingkaran hijau — pastikan logo selalu ditampilkan di atas background polos (putih atau `--color-primary-soft`) agar tidak kehilangan kontras
- Jangan mengubah warna logo asli (hijau/ungu/pink) untuk menyesuaikan tema gelap/dark mode — jika dark mode dibutuhkan di masa depan, gunakan versi logo dengan container putih membulat sebagai bingkai, bukan mengubah warna logo itu sendiri
- Ukuran minimum logo agar tulisan "Raudhatul Athfal Sahabat" tetap terbaca: disarankan tidak lebih kecil dari 64px di layar mobile

## 8. Do's and Don'ts

| Do | Don't |
|---|---|
| Gunakan hijau sebagai warna dominan di seluruh halaman | Jangan gunakan ungu atau pink sebagai warna dominan pengganti hijau |
| Gunakan border-radius besar & konsisten | Jangan campur gaya sudut tajam dan membulat dalam satu halaman |
| Gunakan font rounded (Baloo 2/Quicksand) untuk semua teks | Jangan gunakan font serif atau font tajam/kaku (kesan terlalu formal-korporat) |
| Gunakan warna *soft* sebagai background pendukung | Jangan gunakan 2–3 warna brand penuh sekaligus dalam satu komponen kecil |
| Pertahankan kontras teks-background sesuai standar keterbacaan (WCAG AA) | Jangan gunakan teks pink/ungu di atas background putih tanpa memastikan kontrasnya cukup |

## 9. Catatan untuk AI Agent

- Dokumen ini adalah acuan **desain visual**, bukan acuan struktur data/API — untuk kebutuhan struktur fitur, rujuk ke `PRD_Sistem_Digital_RA_Sahabat_v2.md`
- Jika ada instruksi baru dari pengguna yang tampak bertentangan dengan token warna/font di sini (misal permintaan warna baru di tengah pengerjaan), tanyakan konfirmasi apakah ini perubahan permanen pada design system atau kebutuhan khusus satu komponen saja
- Selalu gunakan token/variable (`--color-primary`, dsb) dibanding hardcode hex langsung di berbagai file, agar perubahan warna di kemudian hari cukup dilakukan di satu tempat
