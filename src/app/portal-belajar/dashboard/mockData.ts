// Mock Initial Activities (Dokumentasi Kegiatan)
export const initialActivities = [
  {
    id: 1,
    title: "Latihan Manasik Haji Cilik",
    date: "2026-07-22",
    category: "Keagamaan",
    driveLink: "https://drive.google.com/drive/folders/mock-manasik",
    description: "Latihan pengenalan tawaf dan sai untuk mengenalkan rukun Islam kelima.",
  },
  {
    id: 2,
    title: "Berkebun Ceria di Halaman Sekolah",
    date: "2026-07-25",
    category: "Akademik",
    driveLink: "https://drive.google.com/drive/folders/mock-gardening",
    description: "Edukasi sains praktis mengenal jenis tanaman dan cara menyiram sayur.",
  },
  {
    id: 3,
    title: "Peringatan Hari Santri & Sholawat",
    date: "2026-07-28",
    category: "Keagamaan",
    driveLink: "https://drive.google.com/drive/folders/mock-santri",
    description: "Kegiatan rutin melafalkan sholawat nabi dan penguatan nilai Aswaja NU.",
  },
  {
    id: 4,
    title: "Pentas Seni Akhir Tahun (Pentas Akhirussanah)",
    date: "2025-06-15",
    category: "Ekstrakurikuler",
    driveLink: "https://drive.google.com/drive/folders/mock-pentas-2025",
    description: "Pertunjukan tari tradisional, hafalan surat pendek, dan drama pendek oleh santri kelas B.",
  },
  {
    id: 5,
    title: "Lomba Mewarnai Se-Kecamatan Berbah",
    date: "2024-11-10",
    category: "Akademik",
    driveLink: "https://drive.google.com/drive/folders/mock-lomba-2024",
    description: "Meraih Juara 2 dalam festival kreativitas anak usia dini tingkat kecamatan.",
  }
];

// Mock Initial Students (Identitas Lengkap sesuai PRD DataFinal)
export const initialStudents = [
  { 
    id: 1, 
    name: "Ahmad Rayyan", 
    nisn: "1234567890",
    madrasahName: "RA Sahabat Berbah Sleman",
    address: "Jl. Kaliurang KM 10, Sleman, Yogyakarta",
    semester: "Semester 1",
    class: "RA (A)",
    fase: "Fase Fondasi",
    height: 105,
    weight: 18,
    academicYear: "2026/2027",
    activeStatus: "Aktif",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-rayyan"
  },
  { 
    id: 2, 
    name: "Bilqis Azzahra", 
    nisn: "1234567891",
    madrasahName: "RA Sahabat Berbah Sleman",
    address: "Berbah, Sleman, Yogyakarta",
    semester: "Semester 1",
    class: "RA (B)",
    fase: "Fase Fondasi",
    height: 110,
    weight: 19,
    academicYear: "2026/2027",
    activeStatus: "Aktif",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-bilqis"
  },
  { 
    id: 3, 
    name: "Fatih Al-Fatih", 
    nisn: "1234567892",
    madrasahName: "RA Sahabat Berbah Sleman",
    address: "Kalasan, Sleman, Yogyakarta",
    semester: "Semester 1",
    class: "KB",
    fase: "Fase Fondasi",
    height: 98,
    weight: 15,
    academicYear: "2026/2027",
    activeStatus: "Aktif",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-fatih"
  },
  { 
    id: 4, 
    name: "Rania Almira (Alumni)", 
    nisn: "1234567895",
    madrasahName: "RA Sahabat Berbah Sleman",
    address: "Prambanan, Sleman, Yogyakarta",
    semester: "Semester 2",
    class: "RA (B)",
    fase: "Fase Fondasi",
    height: 112,
    weight: 20,
    academicYear: "2025/2026",
    activeStatus: "Lulus",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-rania"
  },
  { 
    id: 5, 
    name: "Yusuf Maulana (Alumni)", 
    nisn: "1234567896",
    madrasahName: "RA Sahabat Berbah Sleman",
    address: "Berbah, Sleman, Yogyakarta",
    semester: "Semester 2",
    class: "RA (B)",
    fase: "Fase Fondasi",
    height: 115,
    weight: 22,
    academicYear: "2024/2025",
    activeStatus: "Lulus",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-yusuf"
  }
];

// Mock Initial Transaksi SPP & Les
export const initialSppTransactions = [
  { id: 1, studentId: 1, date: "2026-08-01", description: "Pembayaran SPP + Les Agustus", spp: 75000, les: 40000, total: 115000, depositStatus: "Sudah Disetor" },
  { id: 2, studentId: 2, date: "2026-08-02", description: "Lunas SPP & Les Agustus", spp: 75000, les: 40000, total: 115000, depositStatus: "Belum Disetor" },
  { id: 3, studentId: 1, date: "2026-08-03", description: "Uang Les Tambahan", spp: 0, les: 40000, total: 40000, depositStatus: "Sudah Disetor" },
  { id: 4, studentId: 4, date: "2025-05-12", description: "Lunas SPP Mei", spp: 75000, les: 0, total: 75000, depositStatus: "Sudah Disetor" },
  { id: 5, studentId: 5, date: "2024-10-05", description: "Pembayaran SPP + Les Oktober", spp: 75000, les: 40000, total: 115000, depositStatus: "Sudah Disetor" }
];

// Mock Initial Tabungan
export const initialSavings = [
  { id: 1, studentId: 1, date: "2026-08-01", description: "Setoran awal rutin", debet: 50000, kredit: 0, admin: "Bunda Nisa" },
  { id: 2, studentId: 1, date: "2026-08-03", description: "Setoran mingguan", debet: 30000, kredit: 0, admin: "Bunda Ajeng" },
  { id: 3, studentId: 1, date: "2026-08-04", description: "Penarikan buku tulis", debet: 0, kredit: 15000, admin: "Bunda Ajeng" },
  { id: 4, studentId: 2, date: "2026-08-02", description: "Setoran tabungan Agustus", debet: 100000, kredit: 0, admin: "Bunda Ajeng" }
];

// Mock Initial Laporan Hasil Murajaah
export const initialMurajaah = {
  1: {
    "Al-Fatihah": "sb",
    "Al-Ikhlas": "b",
    "Al-Falaq": "sb",
    "An-Nas": "b",
    "Al-Asr": "c",
    "Kedua orang tua": "sb",
    "Keselamatan dunia akhirat": "sb",
    "Sebelum belajar": "b",
    "Niat": "b",
    "Jangan marah": "c",
    "Drumband": "sb",
    "Rukun iman": "sb",
    "Takbiratul ihram": "sb",
    "Ruku": "b"
  },
  2: {
    "Al-Fatihah": "sb",
    "Al-Ikhlas": "sb",
    "Keselamatan dunia akhirat": "b",
    "Sebelum belajar": "b",
    "Jangan marah": "sb",
    "Calistung": "b",
    "Rukun islam": "sb"
  }
};

// Mock Initial PPDB Applicants (Calon Siswa Baru Online)
export const initialPpdbApplicants = [
  {
    id: 101,
    name: "Siti Humaira",
    nisn: "9876543210",
    madrasahName: "KB RA Sahabat",
    address: "Berbah, Sleman, Yogyakarta",
    semester: "Semester 1",
    class: "RA (A)",
    fase: "Fase Fondasi",
    height: 102,
    weight: 17,
    academicYear: "2026/2027",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-humaira"
  },
  {
    id: 102,
    name: "Muhammad Gibran",
    nisn: "9876543211",
    madrasahName: "SPS Sleman",
    address: "Kalasan, Sleman, Yogyakarta",
    semester: "Semester 1",
    class: "KB",
    fase: "Fase Fondasi",
    height: 95,
    weight: 14,
    academicYear: "2026/2027",
    portfolioLink: "https://drive.google.com/drive/folders/mock-portfolio-gibran"
  }
];

// Mock Initial Audit Logs
export const initialLogs = [
  { id: 1, time: "2026-08-05 09:30", user: "Admin Administrasi (Bunda Nisa)", action: "Menyelaraskan data master siswa baru" },
  { id: 2, time: "2026-08-05 10:15", user: "Admin Transaksi (Bunda Ajeng)", action: "Mencatat setoran tabungan Ahmad Rayyan" },
];

// Mock Initial Classes
export const initialClasses = [
  { id: 1, className: "KB", fase: "Fase Fondasi", teacherName: "Bunda Yuli", description: "Kelompok Bermain usia 3-4 tahun" },
  { id: 2, className: "RA (A)", fase: "Fase Fondasi", teacherName: "Guru Kelas (Bunda Rahma)", description: "Raudhatul Athfal Kelompok A usia 4-5 tahun" },
  { id: 3, className: "RA (B)", fase: "Fase Fondasi", teacherName: "Bunda Echa", description: "Raudhatul Athfal Kelompok B usia 5-6 tahun" },
];

// Mock Initial Users
export const initialUsers = [
  { id: 1, name: "Admin Administrasi (Bunda Nisa)", username: "admin_adm", password: "admin123", role: "admin_adm" },
  { id: 2, name: "Admin Transaksi (Bunda Ajeng)", username: "admin_trx", password: "admin123", role: "admin_trx" },
  { id: 3, name: "Guru Kelas (Bunda Rahma)", username: "guru", password: "guru123", role: "guru" }
];


