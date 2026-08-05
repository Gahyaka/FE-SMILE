# **NOTULENSI PEMBARUAN KEBUTUHAN SISTEM DIGITAL KB/RA SAHABAT**

**Tanggal Observasi:** 5 Agustus 2026  
**Agenda:** Penetapan parameter data administrasi, struktur aliran dana (SPP & Les), dan penyelesaian status pengembangan modul akademik/rapor.

## **1\. Resolusi Status Modul Rapor dan Evaluasi Pembelajaran**

Pembaruan ini secara resmi mengubah arah pengembangan fitur laporan akademik yang sebelumnya masih berstatus ditunda.

* Fitur rapor digital terpadu tidak perlu dikembangkan.  
* Rapor resmi sudah disediakan langsung dari sistem Kementerian Agama.  
* Fokus pengembangan fitur akademik dialihkan sepenuhnya untuk mendigitalisasi "Laporan Hasil Murajaah" yang saat ini masih diproses secara manual.

## **2\. Parameter Data Administrasi Master**

Untuk menjawab kebutuhan "Data apa saja yang benar-benar diperlukan?" pada rapat sebelumnya, sistem internal dipastikan hanya akan menyimpan parameter informasi peserta didik berikut ini:

* Nama Lengkap  
* Nomor Induk Siswa Nasional (NISN)  
* Nama Madrasah  
* Alamat Lengkap  
* Semester Berjalan  
* Kelas  
* Fase Pembelajaran  
* Tinggi Badan  
* Berat Badan  
* Tahun Ajaran

## **3\. Struktur Data dan Kolom Modul Bendahara (Transaksi)**

Modul transaksi akan dipisah menjadi dua *flow* pencatatan utama untuk memudahkan Bunda Ajeng (Bendahara) dalam melakukan input harian. Antarmuka dan *database* harus mengakomodasi kolom-kolom berikut:

### **A. Format Kolom Pencatatan SPP & Les**

Data ini akan mencatat rincian setoran harian/bulanan dengan kolom yang disesuaikan persis dengan catatan manual bendahara:

1. **Tanggal:** Waktu terjadinya transaksi pembayaran.  
2. **Keterangan:** Detail pembayaran (contoh: "Pembayaran SPP Bulan Agustus" atau nama anak).  
3. **SPP:** Nominal pembayaran SPP (dengan nilai dasar/default 75).  
4. **Les:** Nominal pembayaran uang les (dengan nilai dasar/default 40).  
5. **Total:** Kalkulasi otomatis dari penggabungan kolom SPP dan Les (total default 115). *(Catatan sistem: Fitur ini harus memfasilitasi penjumlahan otomatis di sisi front-end agar bendahara tidak perlu menghitung manual sebelum menekan tombol simpan).*

### **B. Format Kolom Pencatatan Tabungan**

Sistem akan mereplikasi tampilan buku tabungan konvensional agar mudah dipahami oleh admin. Kolom riwayat per anak akan memuat:

1. **Tanggal:** Waktu transaksi (setor/tarik) dilakukan.  
2. **Keterangan:** Uraian transaksi (contoh: "Setoran rutin", "Penarikan untuk alat tulis").  
3. **Debet (Setoran):** Nominal uang masuk.  
4. **Kredit (Penarikan):** Nominal uang keluar.  
5. **Saldo:** Sisa uang tabungan (sistem harus menghitung ini secara otomatis setiap ada baris transaksi baru, *trigger* kalkulasi berdasarkan nilai sebelumnya \+ debet \- kredit).  
6. **Admin/Pencatat:** (Opsional/Sistem) Nama guru atau bendahara yang menginput transaksi tersebut sebagai rekam jejak (*audit trail*).

## **4\. Struktur Modul Laporan Hasil Murajaah**

Sebagai pengganti wacana rapor, Laporan Hasil Murajaah akan dibangun menggunakan antarmuka matriks penilaian. Komponen ini terdiri dari bagian identitas siswa dan lima kategori penilaian dengan skala spesifik (seperti: sb, b, c, k, \-).  
**Bagian Identitas:**

* Nama Santri  
* Kelas  
* Semester / Tahun Ajaran

**Kategori & Parameter Penilaian:**

* **Surat Pendek:** Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas, Al-Asr, An-Nasr, Al-Kafirun, Al-Kautsar, Al-Quraisy, Al-Lahab.  
* **Doa Sehari-hari:** Kedua orang tua, Keselamatan dunia akhirat, Sebelum belajar, Haq dan batil, Masuk masjid, Setelah adzan, Sebelum makan, Sesudah makan, Turun hujan, Bangun tidur, Adzan/iqamah, Masuk WC, Bercermin, Keluar rumah, Berkendara.  
* **Hadits Pilihan:** Niat, Jangan marah, Kebersihan, Masjid rumah kaum mukmin, Surga di bawah kaki ibu, Persaudaraan, Malu, Menuntut ilmu, Asmaul Husna (60).  
* **Ekstrakurikuler Wajib/Pilihan:** Drumband, Angklung, Calistung.  
* **Pendidikan Agama Islam (PAI):** Rukun iman, Rukun islam, Tarikh (Nabi Muhammad), 10 Malaikat, Mufradat (32), Hafalan tambahan, Al-Humazah.  
* **Praktik Sholat Dhuha (Gerakan & Bacaan):** Takbiratul ihram, Ruku, Iktidal, Sujud, Duduk di antara 2 sujud, Tahiyatul.

## 

## **Tindak Lanjut Pengembangan Teknis (Full-Stack Scope)**

1. Menghentikan penyusunan skema *database* dan perancangan *wireframe* UI/UX untuk fitur rapor utuh.  
2. Menyusun relasi tabel untuk modul Laporan Hasil Murajaah agar terhubung langsung dengan tabel *Master* Data Administrasi Siswa.  
3. Merancang antarmuka form input untuk guru menggunakan elemen *radio button* atau *dropdown* yang *mobile-friendly*, guna mempercepat pengisian skala matriks Murajaah dari perangkat gawai.  
4. Menambahkan komponen tagihan *default* (SPP: 75, Les: 40\) pada fungsi formulir pencatatan Admin Transaksi.

