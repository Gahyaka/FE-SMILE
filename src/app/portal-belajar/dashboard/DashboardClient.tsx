"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Nominal standar transaksi
const DEFAULT_SPP_FEE = 75000;
const DEFAULT_LES_FEE = 40000;

// Daftar parameter untuk Laporan Hasil Murajaah
const MURAJAAH_PARAMS = {
  suratPendek: ["Al-Fatihah", "Al-Ikhlas", "Al-Falaq", "An-Nas", "Al-Asr", "An-Nasr", "Al-Kafirun", "Al-Kautsar", "Al-Quraisy", "Al-Lahab"],
  doaSehariHari: ["Kedua orang tua", "Keselamatan dunia akhirat", "Sebelum belajar", "Haq dan batil", "Masuk masjid", "Setelah adzan", "Sebelum makan", "Sesudah makan", "Turun hujan", "Bangun tidur", "Adzan/iqamah", "Masuk WC", "Bercermin", "Keluar rumah", "Berkendara"],
  haditsPilihan: ["Niat", "Jangan marah", "Kebersihan", "Masjid rumah kaum mukmin", "Surga di bawah kaki ibu", "Persaudaraan", "Malu", "Menuntut ilmu", "Asmaul Husna (60)"],
  ekskul: ["Drumband", "Angklung", "Calistung"],
  pai: ["Rukun iman", "Rukun islam", "Tarikh (Nabi Muhammad)", "10 Malaikat", "Mufradat (32)", "Hafalan tambahan", "Al-Humazah"],
  sholatDhuha: ["Takbiratul ihram", "Ruku", "Iktidal", "Sujud", "Duduk di antara 2 sujud", "Tahiyatul"]
};

// Mock Initial Activities (Dokumentasi Kegiatan)
const initialActivities = [
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
];

// Mock Initial Students (Identitas Lengkap sesuai PRD DataFinal)
const initialStudents = [
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
    activeStatus: "Aktif"
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
    activeStatus: "Aktif"
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
    activeStatus: "Aktif"
  }
];

// Mock Initial Transaksi SPP & Les
const initialSppTransactions = [
  { id: 1, studentId: 1, date: "2026-08-01", description: "Pembayaran SPP + Les Agustus", spp: 75000, les: 40000, total: 115000 },
  { id: 2, studentId: 2, date: "2026-08-02", description: "Lunas SPP & Les Agustus", spp: 75000, les: 40000, total: 115000 },
  { id: 3, studentId: 1, date: "2026-08-03", description: "Uang Les Tambahan", spp: 0, les: 40000, total: 40000 }
];

// Mock Initial Tabungan (Debet, Kredit, Saldo otomatis dihitung berdasarkan kronologis)
const initialSavings = [
  { id: 1, studentId: 1, date: "2026-08-01", description: "Setoran awal rutin", debet: 50000, kredit: 0, admin: "Bunda Nisa" },
  { id: 2, studentId: 1, date: "2026-08-03", description: "Setoran mingguan", debet: 30000, kredit: 0, admin: "Bunda Ajeng" },
  { id: 3, studentId: 1, date: "2026-08-04", description: "Penarikan buku tulis", debet: 0, kredit: 15000, admin: "Bunda Ajeng" },
  { id: 4, studentId: 2, date: "2026-08-02", description: "Setoran tabungan Agustus", debet: 100000, kredit: 0, admin: "Bunda Ajeng" }
];

// Mock Initial Laporan Hasil Murajaah
const initialMurajaah = {
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
const initialPpdbApplicants = [
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
    academicYear: "2026/2027"
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
    academicYear: "2026/2027"
  }
];

// Mock Initial Audit Logs
const initialLogs = [
  { id: 1, time: "2026-08-05 09:30", user: "Admin Administrasi (Bunda Nisa)", action: "Menyelaraskan data master siswa baru" },
  { id: 2, time: "2026-08-05 10:15", user: "Admin Transaksi (Bunda Ajeng)", action: "Mencatat setoran tabungan Ahmad Rayyan" },
];

export default function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<{ role: "admin_adm" | "admin_trx" | "guru"; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"siswa" | "kegiatan" | "spp" | "tabungan" | "murajaah" | "laporan" | "audit">("siswa");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Student registration states
  const [students, setStudents] = useState(initialStudents);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentNisn, setNewStudentNisn] = useState("");
  const [newStudentMadrasah, setNewStudentMadrasah] = useState("RA Sahabat Berbah Sleman");
  const [newStudentAddress, setNewStudentAddress] = useState("");
  const [newStudentSemester, setNewStudentSemester] = useState("Semester 1");
  const [newStudentClass, setNewStudentClass] = useState("KB");
  const [newStudentFase, setNewStudentFase] = useState("Fase Fondasi");
  const [newStudentHeight, setNewStudentHeight] = useState("100");
  const [newStudentWeight, setNewStudentWeight] = useState("16");
  const [newStudentYear, setNewStudentYear] = useState("2026/2027");
  const [showStudentForm, setShowStudentForm] = useState(false);

  // Activities states
  const [activities, setActivities] = useState(initialActivities);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState("Akademik");
  const [newDrive, setNewDrive] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [showActivityForm, setShowActivityForm] = useState(false);

  // SPP & Les Transaksi States
  const [sppTransactions, setSppTransactions] = useState(initialSppTransactions);
  const [payStudentId, setPayStudentId] = useState<number>(1);
  const [payDate, setPayDate] = useState(new Date().toISOString().substring(0, 10));
  const [paySpp, setPaySpp] = useState(String(DEFAULT_SPP_FEE));
  const [payLes, setPayLes] = useState(String(DEFAULT_LES_FEE));
  const [payDesc, setPayDesc] = useState("Pembayaran SPP + Les");
  const [showSppForm, setShowSppForm] = useState(false);

  // Savings states
  const [savings, setSavings] = useState(initialSavings);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [transDesc, setTransDesc] = useState("Setoran rutin");
  const [transType, setTransType] = useState<"Setoran" | "Penarikan">("Setoran");
  const [transAmount, setTransAmount] = useState("");
  const [savingFilterStudentId, setSavingFilterStudentId] = useState<number>(1);

  // Murajaah States
  const [murajaahData, setMurajaahData] = useState<{[studentId: number]: {[param: string]: string}}>(initialMurajaah);
  const [murajaahStudentId, setMurajaahStudentId] = useState<number>(1);
  const [editingCategory, setEditingCategory] = useState<keyof typeof MURAJAAH_PARAMS>("suratPendek");

  // Audit Logs state
  const [logs, setLogs] = useState(initialLogs);

  // UX Student View states
  const [selectedFilterClass, setSelectedFilterClass] = useState<string>("Semua");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [activeDetailStudent, setActiveDetailStudent] = useState<any | null>(null);
  const [ppdbApplicants, setPpdbApplicants] = useState(initialPpdbApplicants);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [studentSubTab, setStudentSubTab] = useState<"aktif" | "ppdb">("aktif");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionType: "delete_student" | "reject_ppdb" | null;
    targetId: number | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionType: null,
    targetId: null
  });

  useEffect(() => {
    // Client-side authentication check
    const storedSession = localStorage.getItem("user_session");
    if (!storedSession) {
      router.push("/portal-belajar");
    } else {
      setSession(JSON.parse(storedSession));
    }
  }, [router]);

  // Adjust defaults
  useEffect(() => {
    if (students.length > 0) {
      setSelectedStudentId(students[0].id);
      setPayStudentId(students[0].id);
      setSavingFilterStudentId(students[0].id);
      setMurajaahStudentId(students[0].id);
    }
  }, [students]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/portal-belajar");
  };

  // Add new student handler (Admin Administrasi only)
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.role !== "admin_adm") return;
    if (!newStudentName || !newStudentNisn) return;

    const newSt = {
      id: Date.now(),
      name: newStudentName,
      nisn: newStudentNisn,
      madrasahName: newStudentMadrasah,
      address: newStudentAddress || "Alamat belum diinput",
      semester: newStudentSemester,
      class: newStudentClass,
      fase: newStudentFase,
      height: Number(newStudentHeight) || 100,
      weight: Number(newStudentWeight) || 16,
      academicYear: newStudentYear,
      activeStatus: "Aktif"
    };

    setStudents([...students, newSt]);

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Mendaftarkan siswa baru: ${newStudentName} (NISN: ${newStudentNisn})`,
    };
    setLogs([newLog, ...logs]);

    // Reset Form
    setNewStudentName("");
    setNewStudentNisn("");
    setNewStudentAddress("");
    setShowStudentForm(false);
  };

  // Update Student Active Status (Admin Administrasi only)
  const handleUpdateStudentStatus = (studentId: number, status: string) => {
    if (session?.role !== "admin_adm") return;
    let studentName = "";
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          studentName = student.name;
          return { ...student, activeStatus: status };
        }
        return student;
      })
    );

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Mengubah status keaktifan siswa ${studentName} menjadi: ${status}`,
    };
    setLogs([newLog, ...logs]);
  };

  // Delete Student Data (Admin Administrasi only) - Triggers custom confirm modal
  const handleDeleteStudent = (studentId: number) => {
    if (session?.role !== "admin_adm") return;
    const studentName = students.find((s) => s.id === studentId)?.name || "Siswa";
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Siswa",
      message: `Apakah Anda yakin ingin menghapus data siswa "${studentName}" secara permanen? Tindakan ini tidak dapat dibatalkan.`,
      actionType: "delete_student",
      targetId: studentId
    });
  };

  // Reject/Delete PPDB applicant (Admin Administrasi only) - Triggers custom confirm modal
  const handleRejectPpdb = (applicantId: number) => {
    if (session?.role !== "admin_adm") return;
    const applicant = ppdbApplicants.find(a => a.id === applicantId);
    if (!applicant) return;

    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Tolak Berkas",
      message: `Apakah Anda yakin ingin menolak berkas PPDB atas nama "${applicant.name}"?`,
      actionType: "reject_ppdb",
      targetId: applicantId
    });
  };

  // Approve PPDB applicant (Admin Administrasi only)
  const handleApprovePpdb = (applicantId: number) => {
    if (session?.role !== "admin_adm") return;
    const applicant = ppdbApplicants.find(a => a.id === applicantId);
    if (!applicant) return;

    const newSt = {
      ...applicant,
      id: Date.now(), // generate new student ID
      activeStatus: "Aktif"
    };

    setStudents([...students, newSt]);
    setPpdbApplicants(ppdbApplicants.filter(a => a.id !== applicantId));

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Menyetujui pendaftaran PPDB: ${applicant.name} (NISN: ${applicant.nisn})`,
    };
    setLogs([newLog, ...logs]);
  };

  // Execute custom confirm actions
  const handleExecuteConfirmAction = () => {
    const { actionType, targetId } = confirmModal;
    if (!targetId || !actionType) return;

    if (actionType === "delete_student") {
      const studentName = students.find((s) => s.id === targetId)?.name || "Siswa";
      setStudents(students.filter((s) => s.id !== targetId));

      // Add audit log
      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session?.name || "User",
        action: `Menghapus data siswa: ${studentName}`,
      };
      setLogs([newLog, ...logs]);
    } else if (actionType === "reject_ppdb") {
      const applicant = ppdbApplicants.find(a => a.id === targetId);
      if (applicant) {
        setPpdbApplicants(ppdbApplicants.filter(a => a.id !== targetId));

        // Add audit log
        const newLog = {
          id: Date.now(),
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: session?.name || "User",
          action: `Menolak pendaftaran PPDB: ${applicant.name}`,
        };
        setLogs([newLog, ...logs]);
      }
    }

    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      actionType: null,
      targetId: null
    });
  };

  // Edit student profile handler (Admin Administrasi only)
  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.role !== "admin_adm") return;
    if (!editingStudent) return;

    setStudents((prev) =>
      prev.map((s) => (s.id === editingStudent.id ? editingStudent : s))
    );

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Memperbarui profil data siswa: ${editingStudent.name} (NISN: ${editingStudent.nisn})`,
    };
    setLogs([newLog, ...logs]);

    setEditingStudent(null);
  };

  // Add new activity handler (Admin Administrasi or Guru)
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.role !== "admin_adm" && session?.role !== "guru") return;
    if (!newTitle || !newDate || !newDesc) return;

    const newAct = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      category: newCategory,
      driveLink: newDrive || "https://drive.google.com/drive/folders/mock-new",
      description: newDesc,
    };

    setActivities([newAct, ...activities]);
    
    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Menambahkan kegiatan: ${newTitle}`,
    };
    setLogs([newLog, ...logs]);

    // Reset form
    setNewTitle("");
    setNewDate("");
    setNewCategory("Akademik");
    setNewDrive("");
    setNewDesc("");
    setShowActivityForm(false);
  };

  // Record SPP & Les payment (Admin Transaksi only)
  const handleAddSppLesPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.role !== "admin_trx") return;
    if (!paySpp || !payLes) return;

    const sppNum = Number(paySpp);
    const lesNum = Number(payLes);
    const totalNum = sppNum + lesNum;
    const studentName = students.find(s => s.id === payStudentId)?.name || "Siswa";

    const newTx = {
      id: Date.now(),
      studentId: payStudentId,
      date: payDate,
      description: payDesc || "Pembayaran SPP + Les",
      spp: sppNum,
      les: lesNum,
      total: totalNum
    };

    setSppTransactions([newTx, ...sppTransactions]);

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Mencatat SPP & Les ${studentName}: SPP Rp ${sppNum.toLocaleString()}, Les Rp ${lesNum.toLocaleString()} (Total Rp ${totalNum.toLocaleString()})`,
    };
    setLogs([newLog, ...logs]);

    // Reset form
    setPaySpp(String(DEFAULT_SPP_FEE));
    setPayLes(String(DEFAULT_LES_FEE));
    setPayDesc("Pembayaran SPP + Les");
    setShowSppForm(false);
  };

  // Add savings transaction (Admin Transaksi only)
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.role !== "admin_trx") return;
    if (!transAmount || isNaN(Number(transAmount)) || Number(transAmount) <= 0) return;

    const amountNum = Number(transAmount);
    const selectedStudentName = students.find(s => s.id === selectedStudentId)?.name || "Anak";

    const debetVal = transType === "Setoran" ? amountNum : 0;
    const kreditVal = transType === "Penarikan" ? amountNum : 0;

    // Check Penarikan Saldo
    const currentSaldo = getStudentSaldo(selectedStudentId);
    if (transType === "Penarikan" && amountNum > currentSaldo) {
      alert("Saldo tidak cukup untuk melakukan penarikan!");
      return;
    }

    const newTrans = {
      id: Date.now(),
      studentId: selectedStudentId,
      date: new Date().toISOString().substring(0, 10),
      description: transDesc || "Setoran rutin",
      debet: debetVal,
      kredit: kreditVal,
      admin: session?.name || "Bunda Ajeng",
    };

    setSavings([newTrans, ...savings]);

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Mencatat ${transType} tabungan Rp ${amountNum.toLocaleString()} untuk ${selectedStudentName}`,
    };
    setLogs([newLog, ...logs]);

    // Reset amount
    setTransAmount("");
    setTransDesc("Setoran rutin");
  };

  // Helper: Calculate total saldo for a student dynamically (Debet - Kredit)
  const getStudentSaldo = (studentId: number) => {
    const studentTrans = savings.filter(t => t.studentId === studentId);
    return studentTrans.reduce((total, trans) => {
      return total + trans.debet - trans.kredit;
    }, 0);
  };

  // Helper: Get chronological savings list with running balance
  const getStudentTabunganRows = (studentId: number) => {
    const studentTrans = [...savings].filter(t => t.studentId === studentId).reverse(); // Oldest first for calculation
    let runningSaldo = 0;
    const mapped = studentTrans.map(t => {
      runningSaldo = runningSaldo + t.debet - t.kredit;
      return { ...t, saldo: runningSaldo };
    });
    return mapped.reverse(); // Newest first for visual list
  };

  // Update Murajaah grade
  const handleUpdateMurajaah = (param: string, score: string) => {
    setMurajaahData(prev => {
      const studentData = prev[murajaahStudentId] || {};
      return {
        ...prev,
        [murajaahStudentId]: {
          ...studentData,
          [param]: score
        }
      };
    });
  };

  if (!session) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-[#FAF8F5]">
        <div className="text-center font-baloo text-lg font-bold text-primary-green animate-pulse">
          Memuat halaman keamanan...
        </div>
      </div>
    );
  }

  const isAdminAdministrasi = session.role === "admin_adm";
  const isAdminTransaksi = session.role === "admin_trx";
  const isGuru = session.role === "guru";

  const filteredActivities = filterCategory === "Semua" 
    ? activities 
    : activities.filter(act => act.category === filterCategory);

  const filteredStudents = students.filter(st => {
    const matchesClass = selectedFilterClass === "Semua" || st.class === selectedFilterClass;
    const matchesSearch = st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || st.nisn.includes(studentSearchQuery);
    return matchesClass && matchesSearch;
  });

  const getStudentCount = (cls: string) => {
    if (cls === "Semua") return students.length;
    return students.filter(s => s.class === cls).length;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-dark flex flex-col md:flex-row relative font-sans">
      {/* Background Chalkboard Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.012)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-white text-neutral-dark flex flex-col justify-between p-5 border-r border-primary-green/10 z-40 fixed h-screen transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="space-y-6">
          
          <div className="flex items-center justify-between border-b border-primary-green/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-primary-green/20 overflow-hidden bg-white shadow-xs">
                <img src="/images/logo.jpg" alt="Logo RA Sahabat" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-baloo text-sm font-bold tracking-wide leading-none text-neutral-dark">RA Sahabat</h2>
                <span className="text-[9px] text-primary-green font-extrabold uppercase mt-1 block tracking-wider">Portal Administrasi</span>
              </div>
            </div>
            
            {/* Close Button for Mobile Sidebar */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 cursor-pointer flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1.5">
            <span className="text-[9px] text-primary-green/60 font-extrabold uppercase tracking-widest block mb-2 px-3">Menu Utama</span>
            
            <button
              onClick={() => { setActiveTab("siswa"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "siswa"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Data Siswa</span>
            </button>

            <button
              onClick={() => { setActiveTab("kegiatan"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "kegiatan"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>Dokumentasi Kegiatan</span>
            </button>

            <button
              onClick={() => { setActiveTab("spp"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "spp"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Pencatatan SPP & Les</span>
            </button>

            <button
              onClick={() => { setActiveTab("tabungan"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "tabungan"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tabungan Siswa</span>
            </button>

            <button
              onClick={() => { setActiveTab("murajaah"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "murajaah"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Laporan Murajaah</span>
            </button>

            <button
              onClick={() => { setActiveTab("laporan"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "laporan"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Laporan & Ekspor</span>
            </button>

            <button
              onClick={() => { setActiveTab("audit"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Log Aktivitas</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-5 border-t border-primary-green/10">
          <div className="bg-[#FAF8F5] border border-primary-green/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center font-extrabold text-[10px] flex-shrink-0">
              {isAdminAdministrasi ? "AA" : isAdminTransaksi ? "AT" : "GR"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-neutral-dark font-bold leading-tight truncate">{session.name}</p>
              <span className="text-[8px] text-primary-green font-bold uppercase mt-1 block">
                {isAdminAdministrasi ? "Admin Administrasi" : isAdminTransaksi ? "Admin Transaksi" : "Guru"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg bg-accent/5 hover:bg-accent/15 text-accent hover:text-accent-dark font-extrabold text-xs transition-all border border-accent/20 hover:border-accent/40 shadow-3xs cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 min-h-screen flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Path Header info */}
          <div className="flex flex-row justify-between items-center gap-4 border-b border-primary-green/10 pb-4">
            <div>
              <span className="text-[9px] text-neutral-gray font-bold uppercase tracking-wider block">
                Portal Belajar & Administrasi KB/RA Sahabat
              </span>
              <h2 className="font-baloo text-xl sm:text-2xl font-bold text-neutral-dark mt-0.5">
                {activeTab === "siswa" && "Manajemen Data Peserta Didik"}
                {activeTab === "kegiatan" && "Dokumentasi Kegiatan"}
                {activeTab === "spp" && "Pencatatan SPP & Les Terpadu"}
                {activeTab === "tabungan" && "Buku Tabungan Digital"}
                {activeTab === "murajaah" && "Laporan Hasil Murajaah Santri"}
                {activeTab === "laporan" && "Laporan & Ekspor Data"}
                {activeTab === "audit" && "Log Aktivitas Petugas"}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-[10px] bg-white border border-primary-green/10 px-3.5 py-1.5 rounded-lg font-bold text-neutral-gray flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="hidden sm:inline">
                  {isAdminAdministrasi ? "Status: Admin Adm" : isAdminTransaksi ? "Status: Admin Trx" : "Status: Guru"}
                </span>
                <span className="sm:hidden">
                  {isAdminAdministrasi ? "Adm" : isAdminTransaksi ? "Trx" : "Guru"}
                </span>
              </div>
              
              {/* Hamburger Button for Mobile - Placed in the right corner */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg bg-white border border-primary-green/10 text-primary-green hover:bg-soft-mint/10 cursor-pointer shadow-3xs flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* TAB CONTENT: Data Siswa */}
          {activeTab === "siswa" && (
            <div className="w-full space-y-6">
              
              {/* Container List & Form Tab */}
              <div className="w-full space-y-6">
                
                {/* Sub-tab Switcher (Siswa Aktif vs PPDB) */}
                <div className="flex border-b border-primary-green/10 pb-2 mb-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setStudentSubTab("aktif")}
                    className={`pb-2 text-xs font-extrabold uppercase tracking-wide border-b-2 transition-all cursor-pointer ${
                      studentSubTab === "aktif"
                        ? "border-primary-green text-primary-green font-black"
                        : "border-transparent text-neutral-gray hover:text-neutral-dark"
                    }`}
                  >
                    Siswa Aktif ({students.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentSubTab("ppdb")}
                    className={`pb-2 text-xs font-extrabold uppercase tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      studentSubTab === "ppdb"
                        ? "border-primary-green text-primary-green font-black"
                        : "border-transparent text-neutral-gray hover:text-neutral-dark"
                    }`}
                  >
                    <span>Persetujuan PPDB</span>
                    {ppdbApplicants.length > 0 && (
                      <span className="bg-accent text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                        {ppdbApplicants.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Sub-tab: SISWA AKTIF */}
                {studentSubTab === "aktif" && (
                  <div className="space-y-6">
                    {/* Class Selector Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "Semua", label: "Semua Murid" },
                        { id: "KB", label: "Kelompok Bermain (KB)" },
                        { id: "RA (A)", label: "RA Kelas A" },
                        { id: "RA (B)", label: "RA Kelas B" }
                      ].map((cls) => {
                        const count = getStudentCount(cls.id);
                        const isActive = selectedFilterClass === cls.id;
                        return (
                          <button
                            key={cls.id}
                            type="button"
                            onClick={() => setSelectedFilterClass(cls.id)}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 shadow-3xs ${
                              isActive
                                ? "bg-primary-green border-primary-green text-white"
                                : "bg-white border-primary-green/10 text-neutral-dark hover:bg-soft-mint/10"
                            }`}
                          >
                            <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-85">
                              {cls.label}
                            </span>
                            <span className="text-2xl font-baloo font-bold mt-1 block">
                              {count} <span className="text-xs font-semibold">Anak</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                      {/* Search Bar & Registration Trigger */}
                     <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                       <div className="relative flex-1 flex items-center gap-2">
                         <div className="relative flex-1">
                           <svg className="w-4 h-4 text-neutral-gray absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                           </svg>
                           <input
                             type="text"
                             value={studentSearchQuery}
                             onChange={(e) => setStudentSearchQuery(e.target.value)}
                             placeholder="Cari nama murid atau NISN..."
                             className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-semibold"
                           />
                         </div>
                         
                         {(studentSearchQuery !== "" || selectedFilterClass !== "Semua") && (
                           <button
                             type="button"
                             onClick={() => {
                               setStudentSearchQuery("");
                               setSelectedFilterClass("Semua");
                             }}
                             className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-3xs"
                           >
                             Reset Filter
                           </button>
                         )}
                       </div>
 
                       <div className="flex gap-2 justify-end">
                         {isAdminAdministrasi && (
                           <button
                             onClick={() => setShowStudentForm(!showStudentForm)}
                             className="px-4 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                           >
                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                             </svg>
                             <span>Daftarkan Offline</span>
                           </button>
                         )}
                       </div>
                     </div>
 
                     {/* Grid of Student Cards */}
                     {filteredStudents.length === 0 ? (
                       <div className="bg-white p-12 text-center rounded-2xl border border-primary-green/10">
                         <p className="text-xs text-neutral-gray font-bold">Tidak ada data murid yang sesuai dengan filter atau pencarian Anda.</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                         {filteredStudents.map((st) => {
                           const initials = st.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
                           const isDropdownOpen = activeDropdownId === st.id;
                           return (
                             <div key={st.id} className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs flex flex-col justify-between gap-4 hover:shadow-xs transition-all relative">
                               
                               {/* Kebab Dropdown Menu */}
                               <div className="absolute top-4 right-4">
                                 <button
                                   type="button"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setActiveDropdownId(isDropdownOpen ? null : st.id);
                                   }}
                                   className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 hover:bg-neutral-gray/5 text-neutral-dark font-extrabold flex items-center justify-center cursor-pointer transition-colors"
                                 >
                                   ⋮
                                 </button>
                                 
                                 {isDropdownOpen && (
                                   <>
                                     <div
                                       className="fixed inset-0 z-20 cursor-default"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         setActiveDropdownId(null);
                                       }}
                                     />
                                     <div className="absolute right-0 mt-1 w-32 bg-white border border-neutral-gray/10 rounded-xl shadow-lg z-30 py-1.5 font-semibold text-xs text-neutral-dark">
                                       <button
                                         type="button"
                                         onClick={() => {
                                           setActiveDetailStudent(st);
                                           setActiveDropdownId(null);
                                         }}
                                         className="w-full px-3 py-2 text-left hover:bg-soft-mint/30 cursor-pointer flex items-center gap-1.5"
                                       >
                                         <svg className="w-3.5 h-3.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                           <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                         </svg>
                                         <span>Detail</span>
                                       </button>
                                       {isAdminAdministrasi && (
                                         <>
                                           <button
                                             type="button"
                                             onClick={() => {
                                               setEditingStudent({ ...st });
                                               setActiveDropdownId(null);
                                             }}
                                             className="w-full px-3 py-2 text-left hover:bg-soft-mint/30 cursor-pointer text-yellow-700 flex items-center gap-1.5"
                                           >
                                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                               <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                             </svg>
                                             <span>Edit</span>
                                           </button>
                                           <button
                                             type="button"
                                             onClick={() => {
                                               handleDeleteStudent(st.id);
                                               setActiveDropdownId(null);
                                             }}
                                             className="w-full px-3 py-2 text-left hover:bg-accent/10 cursor-pointer text-accent flex items-center gap-1.5"
                                           >
                                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                               <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                             </svg>
                                             <span>Hapus</span>
                                           </button>
                                         </>
                                       )}
                                     </div>
                                   </>
                                 )}
                               </div>

                              <div className="flex items-start gap-3 pr-6">
                                <div className="w-10 h-10 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center font-baloo font-bold text-sm flex-shrink-0">
                                  {initials}
                                </div>
                                <div className="overflow-hidden flex-1">
                                  <h4 className="font-baloo text-sm font-bold text-neutral-dark truncate leading-tight" title={st.name}>
                                    {st.name}
                                  </h4>
                                  <span className="text-[10px] text-neutral-gray font-mono block mt-0.5">NISN: {st.nisn}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-gray">
                                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Kelas & Fase</span>
                                  <span className="font-bold text-neutral-dark">{st.class}</span>
                                </div>
                                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                                  <span className="block text-[8px] text-neutral-gray/60 uppercase">TB / BB</span>
                                  <span className="font-bold text-neutral-dark">{st.height}cm / {st.weight}kg</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-neutral-gray/5 gap-2">
                                <select
                                  disabled={!isAdminAdministrasi}
                                  value={st.activeStatus}
                                  onChange={(e) => handleUpdateStudentStatus(st.id, e.target.value)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border focus:outline-none transition-colors max-w-[100px] text-center ${
                                    !isAdminAdministrasi ? "bg-neutral-gray/5 border-neutral-gray/10 cursor-not-allowed text-neutral-gray" : "cursor-pointer"
                                  } ${
                                    st.activeStatus === "Aktif"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : st.activeStatus === "Lulus"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-stone-100 text-stone-600 border-stone-300"
                                  }`}
                                >
                                  <option value="Aktif">Aktif</option>
                                  <option value="Lulus">Lulus</option>
                                  <option value="Keluar">Keluar</option>
                                </select>

                                <span className="text-[9px] text-neutral-gray font-bold">
                                  TA: {st.academicYear}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-tab: PERSETUJUAN PPDB */}
                {studentSubTab === "ppdb" && (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs">
                      <h4 className="font-baloo text-sm font-bold text-neutral-dark mb-1">Verifikasi Pendaftar Baru (PPDB Online)</h4>
                      <p className="text-[11px] text-neutral-gray font-semibold">Tinjau berkas pendaftaran calon santri yang disubmit secara online oleh wali murid sebelum memindahkannya ke data aktif madrasah.</p>
                    </div>

                    {ppdbApplicants.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-2xl border border-primary-green/10">
                        <p className="text-xs text-neutral-gray font-bold">Tidak ada calon pendaftar PPDB baru yang perlu diverifikasi.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ppdbApplicants.map((ap) => (
                          <div key={ap.id} className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-full text-[9px] font-black uppercase">
                                  Menunggu Review
                                </span>
                                <span className="text-[10px] text-neutral-gray font-bold">TA: {ap.academicYear}</span>
                              </div>
                              <h4 className="font-baloo text-base font-bold text-neutral-dark">{ap.name}</h4>
                              <p className="text-[10px] text-neutral-gray font-semibold">NISN: {ap.nisn} | Kelas Pilihan: {ap.class}</p>
                              
                              <div className="text-[10.5px] bg-[#FAF8F5] p-3 rounded-lg border border-neutral-gray/5 space-y-1 text-neutral-dark font-medium">
                                <p><strong>Madrasah Asal:</strong> {ap.madrasahName}</p>
                                <p className="truncate"><strong>Alamat Rumah:</strong> {ap.address}</p>
                                <p><strong>Parameter Fisik:</strong> TB {ap.height}cm / BB {ap.weight}kg</p>
                              </div>
                            </div>

                            {isAdminAdministrasi ? (
                              <div className="flex gap-2 border-t border-neutral-gray/5 pt-3">
                                <button
                                  type="button"
                                  onClick={() => handleApprovePpdb(ap.id)}
                                  className="flex-1 py-1.5 bg-primary-green hover:bg-primary-dark text-white font-extrabold text-[10px] rounded-lg transition-all cursor-pointer text-center"
                                >
                                  Setujui & Daftarkan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectPpdb(ap.id)}
                                  className="py-1.5 px-3 bg-accent/10 hover:bg-accent/25 text-accent font-extrabold text-[10px] rounded-lg transition-all cursor-pointer text-center"
                                >
                                  Tolak
                                </button>
                              </div>
                            ) : (
                              <p className="text-[9px] text-neutral-gray italic text-center border-t border-neutral-gray/5 pt-3">
                                Hanya Admin Administrasi yang berhak memberikan persetujuan berkas pendaftaran PPDB.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Compliance Notice */}
                <div className="p-4 bg-soft-mint border border-primary-green/20 rounded-xl flex items-center gap-3 mt-4">
                  <svg className="w-5 h-5 text-primary-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-[10px] font-semibold text-primary-dark leading-relaxed">
                    <strong>Pemberitahuan Kepatuhan Data:</strong> Pengumpulan data dibatasi secara minimal hanya untuk identitas sekolah & fisik dasar peserta didik guna mematuhi prinsip minimalisasi data pribadi anak.
                  </p>
                </div>

                {/* Detail Student Modal Pop-up */}
                {activeDetailStudent && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4">
                      <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
                        <h4 className="font-baloo text-base font-bold text-neutral-dark">Detail Profil Santri</h4>
                        <button
                          type="button"
                          onClick={() => setActiveDetailStudent(null)}
                          className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-3 text-xs font-semibold text-neutral-dark">
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                          <span className="block text-[8px] text-neutral-gray/60 uppercase">Nama Lengkap</span>
                          <span className="text-sm font-bold text-neutral-dark">{activeDetailStudent.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                            <span className="block text-[8px] text-neutral-gray/60 uppercase">NISN</span>
                            <span className="font-mono text-neutral-dark">{activeDetailStudent.nisn}</span>
                          </div>
                          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                            <span className="block text-[8px] text-neutral-gray/60 uppercase">Kelas & Fase</span>
                            <span className="font-bold text-neutral-dark">{activeDetailStudent.class} ({activeDetailStudent.fase})</span>
                          </div>
                        </div>
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                          <span className="block text-[8px] text-neutral-gray/60 uppercase">Nama Madrasah</span>
                          <span className="text-neutral-dark">{activeDetailStudent.madrasahName}</span>
                        </div>
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                          <span className="block text-[8px] text-neutral-gray/60 uppercase">Alamat Rumah</span>
                          <span className="text-neutral-gray font-normal">{activeDetailStudent.address}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-gray/5">
                            <span className="block text-[8px] text-neutral-gray/60 uppercase">TB</span>
                            <span className="font-bold text-neutral-dark">{activeDetailStudent.height} cm</span>
                          </div>
                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-gray/5">
                            <span className="block text-[8px] text-neutral-gray/60 uppercase">BB</span>
                            <span className="font-bold text-neutral-dark">{activeDetailStudent.weight} kg</span>
                          </div>
                          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-gray/5">
                            <span className="block text-[8px] text-neutral-gray/60 uppercase">Status</span>
                            <span className="font-bold text-emerald-600">{activeDetailStudent.activeStatus}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveDetailStudent(null)}
                        className="w-full py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs mt-2"
                      >
                        Tutup Detail
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit Student Modal Pop-up (Completes Student CRUD) */}
                {editingStudent && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4">
                      <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
                        <h4 className="font-baloo text-base font-bold text-neutral-dark">Ubah Profil Santri</h4>
                        <button
                          type="button"
                          onClick={() => setEditingStudent(null)}
                          className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <form onSubmit={handleUpdateStudent} className="space-y-3.5 text-xs font-semibold text-neutral-dark">
                        <div>
                          <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Lengkap</label>
                          <input
                            type="text"
                            required
                            value={editingStudent.name}
                            onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">NISN (10 Digit)</label>
                            <input
                              type="text"
                              required
                              maxLength={10}
                              pattern="[0-9]{10}"
                              title="NISN harus berisi 10 digit angka murni"
                              value={editingStudent.nisn}
                              onChange={(e) => setEditingStudent({ ...editingStudent, nisn: e.target.value.replace(/[^0-9]/g, "") })}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-mono text-neutral-dark"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kelas</label>
                            <select
                              value={editingStudent.class}
                              onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                            >
                              <option value="KB">KB</option>
                              <option value="RA (A)">RA (A)</option>
                              <option value="RA (B)">RA (B)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Madrasah</label>
                          <input
                            type="text"
                            required
                            value={editingStudent.madrasahName}
                            onChange={(e) => setEditingStudent({ ...editingStudent, madrasahName: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Alamat Rumah</label>
                          <input
                            type="text"
                            required
                            value={editingStudent.address}
                            onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tinggi (cm)</label>
                            <input
                              type="number"
                              required
                              min="30"
                              max="200"
                              value={editingStudent.height}
                              onChange={(e) => setEditingStudent({ ...editingStudent, height: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Berat (kg)</label>
                            <input
                              type="number"
                              required
                              min="5"
                              max="100"
                              value={editingStudent.weight}
                              onChange={(e) => setEditingStudent({ ...editingStudent, weight: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Semester</label>
                            <select
                              value={editingStudent.semester}
                              onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white text-neutral-dark"
                            >
                              <option value="Semester 1">Semester 1</option>
                              <option value="Semester 2">Semester 2</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tahun Ajaran</label>
                            <input
                              type="text"
                              required
                              value={editingStudent.academicYear}
                              onChange={(e) => setEditingStudent({ ...editingStudent, academicYear: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                          >
                            Simpan Perubahan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStudent(null)}
                            className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Offline Registration Modal Pop-up (Daftarkan Offline) */}
                {isAdminAdministrasi && showStudentForm && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in">
                      <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
                        <h4 className="font-baloo text-base font-bold text-neutral-dark">Daftarkan Murid Baru (Offline)</h4>
                        <button
                          type="button"
                          onClick={() => setShowStudentForm(false)}
                          className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs font-semibold text-neutral-dark">
                        <div>
                          <label htmlFor="newStudentName" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Lengkap Murid</label>
                          <input
                            type="text"
                            id="newStudentName"
                            required
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                            placeholder="Nama Lengkap Murid"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="newStudentNisn" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">NISN (10 Digit)</label>
                            <input
                              type="text"
                              required
                              maxLength={10}
                              pattern="[0-9]{10}"
                              title="NISN harus berisi 10 digit angka murni"
                              id="newStudentNisn"
                              value={newStudentNisn}
                              onChange={(e) => setNewStudentNisn(e.target.value.replace(/[^0-9]/g, ""))}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-mono text-neutral-dark"
                              placeholder="10 digit NISN"
                            />
                          </div>
                          <div>
                            <label htmlFor="newStudentClass" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kelas</label>
                            <select
                              id="newStudentClass"
                              value={newStudentClass}
                              onChange={(e) => setNewStudentClass(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                            >
                              <option value="KB">KB</option>
                              <option value="RA (A)">RA (A)</option>
                              <option value="RA (B)">RA (B)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="newStudentMadrasah" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Madrasah Asal</label>
                          <input
                            type="text"
                            required
                            id="newStudentMadrasah"
                            value={newStudentMadrasah}
                            onChange={(e) => setNewStudentMadrasah(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                          />
                        </div>

                        <div>
                          <label htmlFor="newStudentAddress" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Alamat Rumah</label>
                          <input
                            type="text"
                            required
                            id="newStudentAddress"
                            value={newStudentAddress}
                            onChange={(e) => setNewStudentAddress(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            placeholder="Alamat rumah tinggal"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="newStudentHeight" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tinggi (cm)</label>
                            <input
                              type="number"
                              required
                              min="30"
                              max="200"
                              id="newStudentHeight"
                              value={newStudentHeight}
                              onChange={(e) => setNewStudentHeight(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            />
                          </div>
                          <div>
                            <label htmlFor="newStudentWeight" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Berat (kg)</label>
                            <input
                              type="number"
                              required
                              min="5"
                              max="100"
                              id="newStudentWeight"
                              value={newStudentWeight}
                              onChange={(e) => setNewStudentWeight(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="newStudentSemester" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Semester</label>
                            <select
                              id="newStudentSemester"
                              value={newStudentSemester}
                              onChange={(e) => setNewStudentSemester(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white text-neutral-dark"
                            >
                              <option value="Semester 1">Semester 1 (Ganjil)</option>
                              <option value="Semester 2">Semester 2 (Genap)</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="newStudentYear" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tahun Ajaran</label>
                            <input
                              type="text"
                              required
                              id="newStudentYear"
                              value={newStudentYear}
                              onChange={(e) => setNewStudentYear(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                          >
                            Daftarkan Murid
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowStudentForm(false)}
                            className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Custom Confirmation Modal Pop-up (Destructive/Important actions) */}
                {confirmModal.isOpen && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-sm p-6 relative shadow-lg space-y-4 text-center animate-fade-in">
                      <div className="mx-auto w-12 h-12 bg-accent/15 text-accent rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      
                      <div className="space-y-1.5">
                        <h4 className="font-baloo text-base font-bold text-neutral-dark">{confirmModal.title}</h4>
                        <p className="text-xs text-neutral-gray font-semibold leading-relaxed px-2">
                          {confirmModal.message}
                        </p>
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={handleExecuteConfirmAction}
                          className="flex-1 py-2 bg-accent hover:bg-accent-dark text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-3xs"
                        >
                          Ya, Lanjutkan
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmModal({ isOpen: false, title: "", message: "", actionType: null, targetId: null })}
                          className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB CONTENT: Dokumentasi Kegiatan */}
          {activeTab === "kegiatan" && (
            <div className="w-full space-y-6">
              
              {/* Header Tab & Action Button */}
              <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                <div>
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">Arsip Dokumentasi Kegiatan & Media Pembelajaran</h4>
                  <p className="text-[11px] text-neutral-gray font-semibold">Media integrasi bukti fisik kegiatan belajar mengajar guna pemenuhan akreditasi madrasah.</p>
                </div>
                
                {(isAdminAdministrasi || isGuru) && (
                  <button
                    type="button"
                    onClick={() => setShowActivityForm(true)}
                    className="py-2.5 px-4 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Unggah Dokumentasi Baru</span>
                  </button>
                )}
              </div>

              {/* Filter Category Bar */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-primary-green/10">
                <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Saring Kategori:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["Semua", "Akademik", "Keagamaan", "Ekstrakurikuler"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                        filterCategory === cat
                          ? "bg-primary-green text-white border-primary-green shadow-3xs"
                          : "bg-[#FAF8F5] text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Activity Cards */}
              {filteredActivities.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-primary-green/10">
                  <p className="text-xs text-neutral-gray font-bold">Belum ada dokumentasi kegiatan terunggah untuk kategori ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map((act) => (
                    <div key={act.id} className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs relative flex flex-col justify-between hover:shadow-xs transition-all min-h-[190px]">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            act.category === "Keagamaan" 
                              ? "bg-purple-50 text-purple-700 border border-purple-200" 
                              : act.category === "Akademik"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {act.category}
                          </span>
                          <span className="text-[9.5px] text-neutral-gray font-mono font-semibold">{act.date}</span>
                        </div>
                        <h4 className="font-baloo text-base font-bold text-neutral-dark mt-2.5 leading-snug">{act.title}</h4>
                        <p className="text-xs text-neutral-gray font-semibold mt-1.5 leading-relaxed">{act.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-gray/5 flex justify-between items-center">
                        <a
                          href={act.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-extrabold text-primary-green hover:text-primary-dark hover:underline flex items-center gap-1.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span>Buka Folder Drive</span>
                        </a>
                        <span className="text-[9px] text-primary-green/80 font-bold bg-soft-mint px-2 py-0.5 rounded border border-primary-green/10">
                          Akreditasi Ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Activity Modal Pop-up (Daftarkan Kegiatan Offline/Online) */}
              {showActivityForm && (isAdminAdministrasi || isGuru) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in">
                    <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
                      <h4 className="font-baloo text-base font-bold text-neutral-dark">Unggah Dokumentasi Kegiatan</h4>
                      <button
                        type="button"
                        onClick={() => setShowActivityForm(false)}
                        className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleAddActivity} className="space-y-3.5 text-xs font-semibold text-neutral-dark">
                      <div>
                        <label htmlFor="newTitle" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Kegiatan</label>
                        <input
                          type="text"
                          id="newTitle"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                          placeholder="Contoh: Senam Sehat Pagi NU"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="newDate" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tanggal Pelaksanaan</label>
                          <input
                            type="date"
                            id="newDate"
                            required
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-semibold text-neutral-dark"
                          />
                        </div>
                        <div>
                          <label htmlFor="newCategory" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kategori Kegiatan</label>
                          <select
                            id="newCategory"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                          >
                            <option value="Akademik">Akademik</option>
                            <option value="Keagamaan">Keagamaan / Ke-NU-an</option>
                            <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newDrive" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tautan Google Drive Dokumentasi</label>
                        <input
                          type="url"
                          id="newDrive"
                          required
                          value={newDrive}
                          onChange={(e) => setNewDrive(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>

                      <div>
                        <label htmlFor="newDesc" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Deskripsi Singkat Kegiatan</label>
                        <textarea
                          id="newDesc"
                          required
                          rows={3}
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark resize-none leading-relaxed"
                          placeholder="Tujuan kegiatan dan ringkasan jalannya acara..."
                        ></textarea>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                        >
                          Simpan Kegiatan
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowActivityForm(false)}
                          className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: Pencatatan SPP & Les */}
          {activeTab === "spp" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input Pembayaran SPP & Les (Admin Transaksi Only) */}
              {isAdminTransaksi && showSppForm && (
                <div className="lg:col-span-4 bg-white p-6 rounded-[25px_15px_30px_20px]/[20px_30px_15px_25px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-4 transition-all">
                  <h3 className="font-baloo text-lg font-bold text-neutral-dark flex items-center gap-1.5 border-b border-primary-green/10 pb-2">
                    <svg className="w-5 h-5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Catat Transaksi SPP & Les</span>
                  </h3>
                  
                  <form onSubmit={handleAddSppLesPayment} className="space-y-4">
                    <div>
                      <label htmlFor="payStudent" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Pilih Siswa</label>
                      <select
                        id="payStudent"
                        value={payStudentId}
                        onChange={(e) => setPayStudentId(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                      >
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>{st.name} ({st.class})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="payDate" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Tanggal</label>
                        <input
                          type="date"
                          id="payDate"
                          value={payDate}
                          onChange={(e) => setPayDate(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Total (Otomatis)</label>
                        <div className="w-full px-3 py-2.5 rounded-lg border-2 border-stone-200 bg-stone-50 text-xs font-bold text-neutral-dark">
                          Rp {(Number(paySpp || 0) + Number(payLes || 0)).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="paySpp" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Nominal SPP (Bunda)</label>
                        <input
                          type="number"
                          id="paySpp"
                          value={paySpp}
                          onChange={(e) => setPaySpp(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                          placeholder="Default 75000"
                        />
                      </div>
                      <div>
                        <label htmlFor="payLes" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Nominal Les (Bunda)</label>
                        <input
                          type="number"
                          id="payLes"
                          value={payLes}
                          onChange={(e) => setPayLes(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                          placeholder="Default 40000"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="payDesc" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Keterangan / Uraian</label>
                      <input
                        type="text"
                        id="payDesc"
                        value={payDesc}
                        onChange={(e) => setPayDesc(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                        placeholder="Contoh: Pembayaran SPP Agustus + Les"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs transition-all border border-primary-green shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span>Simpan Pembayaran</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Tabel SPP & Les */}
              <div className={(isAdminTransaksi && showSppForm) ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
                <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border border-primary-green/10 shadow-xs space-y-6">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-gray/10 pb-4">
                    <div>
                      <h3 className="font-baloo text-xl font-bold text-neutral-dark">Buku Kas Pembayaran SPP & Les</h3>
                      <p className="text-[11px] text-neutral-gray font-semibold mt-1">
                        {isAdminTransaksi 
                          ? "💡 Masukkan transaksi SPP & Les dengan nilai dasar otomatis (SPP: 75.000, Les: 40.000)."
                          : "💡 Hanya Admin Transaksi (Bunda Keuangan) yang memiliki hak mencatat pembayaran."}
                      </p>
                    </div>

                    {isAdminTransaksi && (
                      <button
                        onClick={() => setShowSppForm(!showSppForm)}
                        className="px-3.5 py-1.5 bg-primary-green text-white font-extrabold text-[10px] rounded-lg hover:bg-primary-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                      >
                        {showSppForm ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Tutup Panel</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Catat SPP & Les</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-neutral-gray/10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10">
                          <th className="py-3.5 px-4 w-[15%]">Tanggal</th>
                          <th className="py-3.5 px-4 w-[25%]">Nama Murid (Kelas)</th>
                          <th className="py-3.5 px-4 w-[30%]">Keterangan</th>
                          <th className="py-3.5 px-4 text-right w-[10%]">Nominal SPP</th>
                          <th className="py-3.5 px-4 text-right w-[10%]">Nominal Les</th>
                          <th className="py-3.5 px-4 text-right w-[10%]">Total Bayar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-gray/5 font-semibold text-neutral-dark">
                        {sppTransactions.map((tx) => {
                          const student = students.find(s => s.id === tx.studentId);
                          return (
                            <tr key={tx.id} className="hover:bg-soft-mint/30 transition-colors">
                              <td className="py-3 px-4 text-neutral-gray font-mono">{tx.date}</td>
                              <td className="py-3 px-4 font-bold">
                                {student ? `${student.name} (${student.class})` : "Siswa dihapus"}
                              </td>
                              <td className="py-3 px-4 text-neutral-gray">{tx.description}</td>
                              <td className="py-3 px-4 text-right text-emerald-600 font-mono">Rp {tx.spp.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right text-emerald-600 font-mono">Rp {tx.les.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-bold text-primary-green font-mono">Rp {tx.total.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: Tabungan Siswa (Buku Bank format) */}
          {activeTab === "tabungan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input Transaksi Tabungan (Admin Transaksi Only) */}
              {isAdminTransaksi && (
                <div className="lg:col-span-4 bg-white p-6 rounded-[25px_15px_30px_20px]/[20px_30px_15px_25px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-4">
                  <h3 className="font-baloo text-lg font-bold text-neutral-dark flex items-center gap-1.5 border-b border-primary-green/10 pb-2">
                    <svg className="w-5 h-5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Catat Mutasi Tabungan</span>
                  </h3>
                  
                  <form onSubmit={handleAddTransaction} className="space-y-4">
                    <div>
                      <label htmlFor="selectedStudent" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Pilih Siswa</label>
                      <select
                        id="selectedStudent"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                      >
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>{st.name} ({st.class})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="transType" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Tipe Transaksi</label>
                        <select
                          id="transType"
                          value={transType}
                          onChange={(e) => setTransType(e.target.value as "Setoran" | "Penarikan")}
                          className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                        >
                          <option value="Setoran">Setoran (Debet)</option>
                          <option value="Penarikan">Penarikan (Kredit)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="transAmount" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Nominal (Rupiah)</label>
                        <input
                          type="number"
                          id="transAmount"
                          value={transAmount}
                          onChange={(e) => setTransAmount(e.target.value)}
                          required
                          className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                          placeholder="Jumlah uang"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="transDesc" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Keterangan / Uraian</label>
                      <input
                        type="text"
                        id="transDesc"
                        value={transDesc}
                        onChange={(e) => setTransDesc(e.target.value)}
                        required
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                        placeholder="Contoh: Setoran rutin, Penarikan alat tulis"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs transition-all border border-primary-green shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span>Simpan Transaksi</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Rekap Saldo dan Transaksi Buku Rekening */}
              <div className={isAdminTransaksi ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
                
                {/* Saldo List Grid */}
                <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-4">
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">Ringkasan Saldo Buku Tabungan Murid</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {students.map((st) => {
                      const saldo = getStudentSaldo(st.id);
                      return (
                        <div key={st.id} className="p-3 bg-[#FAF8F5] rounded-xl border border-primary-green/10 flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-neutral-gray truncate">{st.name}</span>
                          <span className="text-xs font-extrabold text-primary-green mt-1">Rp {saldo.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Transaksi History Per Siswa (Buku Rekening) */}
                <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-neutral-gray/10">
                    <h4 className="font-baloo text-base font-bold text-neutral-dark">Buku Rekening Tabungan Personal</h4>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-neutral-gray uppercase">Siswa:</span>
                      <select
                        value={savingFilterStudentId}
                        onChange={(e) => setSavingFilterStudentId(Number(e.target.value))}
                        className="px-2.5 py-1 rounded-md border border-primary-green/20 text-[10px] font-extrabold bg-[#FAF8F5] focus:outline-none cursor-pointer"
                      >
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>{st.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[650px]">
                      <thead>
                        <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10">
                          <th className="py-3 px-4 w-[15%]">Tanggal</th>
                          <th className="py-3 px-4 w-[35%]">Keterangan</th>
                          <th className="py-3 px-3 text-right w-[15%]">Debet (Setoran)</th>
                          <th className="py-3 px-3 text-right w-[15%]">Kredit (Penarikan)</th>
                          <th className="py-3 px-4 text-right w-[15%]">Saldo Akhir</th>
                          <th className="py-3 px-2 text-center w-[10%]">Pencatat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-gray/5 font-semibold text-neutral-dark">
                        {getStudentTabunganRows(savingFilterStudentId).map((t) => (
                          <tr key={t.id} className="hover:bg-soft-mint/30">
                            <td className="py-3 px-4 text-neutral-gray font-mono">{t.date}</td>
                            <td className="py-3 px-4 text-neutral-dark">{t.description}</td>
                            <td className="py-3 px-3 text-right text-emerald-600 font-mono">
                              {t.debet > 0 ? `+Rp ${t.debet.toLocaleString()}` : "-"}
                            </td>
                            <td className="py-3 px-3 text-right text-rose-600 font-mono">
                              {t.kredit > 0 ? `-Rp ${t.kredit.toLocaleString()}` : "-"}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-primary-green font-mono">
                              Rp {t.saldo.toLocaleString()}
                            </td>
                            <td className="py-3 px-2 text-center text-neutral-gray text-[10px] truncate max-w-[80px]" title={t.admin}>
                              {t.admin}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: Laporan Hasil Murajaah */}
          {activeTab === "murajaah" && (
            <div className="space-y-6">
              
              {/* Top Bar Filter */}
              <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-baloo text-lg font-bold text-neutral-dark">Matriks Penilaian Murajaah & Tahfidz</h3>
                  <p className="text-[11px] text-neutral-gray font-semibold">Skala nilai: <strong>sb</strong> (sangat baik), <strong>b</strong> (baik), <strong>c</strong> (cukup), <strong>k</strong> (kurang), <strong>-</strong> (belum mulai).</p>
                </div>
                
                <div className="flex gap-3 flex-wrap">
                  {/* Select Student */}
                  <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-lg border border-primary-green/10">
                    <span className="text-[9px] font-bold text-neutral-gray uppercase tracking-wider pl-1">Santri:</span>
                    <select
                      value={murajaahStudentId}
                      onChange={(e) => setMurajaahStudentId(Number(e.target.value))}
                      className="px-2.5 py-1 rounded-md border border-primary-green/20 text-[10px] font-extrabold bg-white focus:outline-none cursor-pointer"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.id}>{st.name} ({st.class})</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Category */}
                  <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-lg border border-primary-green/10">
                    <span className="text-[9px] font-bold text-neutral-gray uppercase tracking-wider pl-1">Kategori:</span>
                    <select
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value as keyof typeof MURAJAAH_PARAMS)}
                      className="px-2.5 py-1 rounded-md border border-primary-green/20 text-[10px] font-extrabold bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="suratPendek">Surat Pendek</option>
                      <option value="doaSehariHari">Doa Sehari-hari</option>
                      <option value="haditsPilihan">Hadits Pilihan</option>
                      <option value="ekskul">Ekstrakurikuler</option>
                      <option value="pai">Pendidikan Agama Islam (PAI)</option>
                      <option value="sholatDhuha">Sholat Dhuha</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Murajaah Grid Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Input Matrix (Guru & Admin Administrasi Only) */}
                {(isAdminAdministrasi || isGuru) ? (
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-primary-green/10 shadow-xs space-y-4">
                    <h4 className="font-baloo text-base font-bold text-neutral-dark border-b border-neutral-gray/10 pb-2">
                      Input Nilai Murajaah Kategori: <span className="text-primary-green font-extrabold capitalize">{editingCategory.replace(/([A-Z])/g, ' $1')}</span>
                    </h4>

                    <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                      {MURAJAAH_PARAMS[editingCategory].map((param) => {
                        const currentVal = (murajaahData[murajaahStudentId] && murajaahData[murajaahStudentId][param]) || "-";
                        return (
                          <div key={param} className="flex items-center justify-between p-2 bg-[#FAF8F5] rounded-lg border border-neutral-gray/5">
                            <span className="text-xs font-bold text-neutral-dark">{param}</span>
                            
                            <div className="flex gap-1.5">
                              {["sb", "b", "c", "k", "-"].map((score) => (
                                <button
                                  key={score}
                                  onClick={() => handleUpdateMurajaah(param, score)}
                                  className={`w-7 h-7 rounded-full text-[9px] font-black uppercase flex items-center justify-center border transition-all cursor-pointer ${
                                    currentVal === score
                                      ? "bg-primary-green text-white border-primary-green font-black"
                                      : "bg-white text-neutral-gray border-neutral-gray/20 hover:bg-neutral-gray/5"
                                  }`}
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-primary-green/10 shadow-xs">
                    <p className="text-xs text-neutral-gray font-bold text-center">
                      💡 Peran Anda (Admin Transaksi) tidak memiliki hak akses mengubah Laporan Murajaah. Silakan gunakan panel visual di sebelah kanan untuk memantau data.
                    </p>
                  </div>
                )}

                {/* Live Matrix Preview */}
                <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-primary-green/10 shadow-xs space-y-4">
                  <h4 className="font-baloo text-base font-bold text-neutral-dark border-b border-neutral-gray/10 pb-2">
                    Lembar Ringkasan Murajaah: <span className="text-primary-green">{students.find(s => s.id === murajaahStudentId)?.name || "Santri"}</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3.5">
                    {Object.keys(MURAJAAH_PARAMS).map((catKey) => {
                      const params = MURAJAAH_PARAMS[catKey as keyof typeof MURAJAAH_PARAMS];
                      return (
                        <div key={catKey} className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-gray/5 space-y-2">
                          <span className="text-[10px] font-extrabold text-neutral-gray uppercase tracking-wider block border-b border-neutral-gray/10 pb-1 capitalize">
                            {catKey.replace(/([A-Z])/g, ' $1')}
                          </span>
                          
                          <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                            {params.map((p) => {
                              const score = (murajaahData[murajaahStudentId] && murajaahData[murajaahStudentId][p]) || "-";
                              return (
                                <div key={p} className="flex justify-between items-center text-[10px] font-semibold text-neutral-dark">
                                  <span className="truncate max-w-[120px]">{p}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                    score === "sb" ? "bg-emerald-100 text-emerald-800" :
                                    score === "b" ? "bg-blue-100 text-blue-800" :
                                    score === "c" ? "bg-amber-100 text-amber-800" :
                                    score === "k" ? "bg-rose-100 text-rose-800" : "bg-stone-100 text-stone-600"
                                  }`}>
                                    {score}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: Laporan & Ekspor */}
          {activeTab === "laporan" && (
            <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-6">
              <div>
                <h3 className="font-baloo text-xl font-bold text-neutral-dark mb-1.5">Ekspor Data Administrasi Sekolah</h3>
                <p className="text-xs text-neutral-gray font-semibold">Silakan unduh rekapitulasi data sekolah untuk pelaporan bulanan atau kebutuhan akreditasi BAN-PDM.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Card */}
                <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-primary-green/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <svg className="w-8 h-8 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <h4 className="font-baloo text-base font-bold text-neutral-dark">Arsip Laporan SPP & Les Bulanan (PDF)</h4>
                    <p className="text-xs text-neutral-gray font-semibold leading-relaxed">Format dokumen resmi siap cetak untuk diserahkan ke kepala sekolah atau yayasan penyelenggara.</p>
                  </div>
                  <button
                    onClick={() => alert("Simulasi Ekspor PDF Berhasil! File Rekap_SPP_Les_RA_Sahabat.pdf diunduh.")}
                    className="w-full py-2.5 rounded-lg bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs transition-all border border-primary-green cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Unduh PDF</span>
                  </button>
                </div>

                {/* Excel Card */}
                <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-primary-green/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="font-baloo text-base font-bold text-neutral-dark">Rekap Data Keuangan & Tabungan (Excel)</h4>
                    <p className="text-xs text-neutral-gray font-semibold leading-relaxed">Berkas lembar kerja spreadsheet untuk mempermudah perhitungan pembukuan kas bulanan yayasan.</p>
                  </div>
                  <button
                    onClick={() => alert("Simulasi Ekspor Excel Berhasil! File Rekap_Kas_RA_Sahabat.xlsx diunduh.")}
                    className="w-full py-2.5 rounded-lg bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold text-xs transition-all border border-[#0E7A4D] cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Unduh Excel</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: Audit Logs */}
          {activeTab === "audit" && (
            <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-6">
              <div>
                <h3 className="font-baloo text-xl font-bold text-neutral-dark mb-1.5">Riwayat Aktivitas Petugas (Audit Log)</h3>
                <p className="text-xs text-neutral-gray font-semibold">Log jejak digital ini mencatat seluruh tindakan penambahan, pengubahan, dan penghapusan data untuk mencegah penyalahgunaan wewenang admin.</p>
              </div>

              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 bg-[#FAF8F5] rounded-xl border border-neutral-gray/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neutral-gray font-bold flex-shrink-0 bg-neutral-gray/10 px-2 py-0.5 rounded">
                        {log.time}
                      </span>
                      <p className="text-xs font-semibold text-neutral-dark">
                        <strong className="text-primary-green">{log.user}</strong>: {log.action}
                      </p>
                    </div>
                    <span className="text-[9px] text-emerald-500 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Berhasil
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
