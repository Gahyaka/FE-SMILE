"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Modular tab components
import StudentTab from "./components/StudentTab";
import KegiatanTab from "./components/KegiatanTab";
import SppTab from "./components/SppTab";
import TabunganTab from "./components/TabunganTab";
import MurajaahTab from "./components/MurajaahTab";
import LaporanTab from "./components/LaporanTab";
import AuditTab from "./components/AuditTab";

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

// Mock Initial Tabungan
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
  
  // Shared database states
  const [students, setStudents] = useState(initialStudents);
  const [activities, setActivities] = useState(initialActivities);
  const [sppTransactions, setSppTransactions] = useState(initialSppTransactions);
  const [savings, setSavings] = useState(initialSavings);
  const [murajaahData, setMurajaahData] = useState<{[studentId: number]: {[param: string]: string}}>(initialMurajaah);
  const [ppdbApplicants, setPpdbApplicants] = useState(initialPpdbApplicants);
  const [logs, setLogs] = useState(initialLogs);

  // Custom confirmation modal state
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
    // Authenticate session on client side
    const cachedSession = localStorage.getItem("user_session");
    if (!cachedSession) {
      router.push("/portal-belajar");
    } else {
      setSession(JSON.parse(cachedSession));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/portal-belajar");
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

  // CRUD & Operations handlers
  const handleAddStudent = (newStData: any) => {
    if (!isAdminAdministrasi) return;
    const newSt = {
      ...newStData,
      id: Date.now(),
      activeStatus: "Aktif"
    };
    setStudents([...students, newSt]);

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mendaftarkan siswa baru: ${newSt.name} (NISN: ${newSt.nisn})`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateStudent = (updatedStudent: any) => {
    if (!isAdminAdministrasi) return;
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Memperbarui profil data siswa: ${updatedStudent.name} (NISN: ${updatedStudent.nisn})`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateStudentStatus = (studentId: number, status: string) => {
    if (!isAdminAdministrasi) return;
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

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mengubah status keaktifan siswa ${studentName} menjadi: ${status}`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleDeleteStudent = (studentId: number) => {
    if (!isAdminAdministrasi) return;
    const studentName = students.find((s) => s.id === studentId)?.name || "Siswa";
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Siswa",
      message: `Apakah Anda yakin ingin menghapus data siswa "${studentName}" secara permanen? Tindakan ini tidak dapat dibatalkan.`,
      actionType: "delete_student",
      targetId: studentId
    });
  };

  const handleRejectPpdb = (applicantId: number) => {
    if (!isAdminAdministrasi) return;
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

  const handleApprovePpdb = (applicantId: number) => {
    if (!isAdminAdministrasi) return;
    const applicant = ppdbApplicants.find(a => a.id === applicantId);
    if (!applicant) return;

    const newSt = {
      ...applicant,
      id: Date.now(),
      activeStatus: "Aktif"
    };

    setStudents([...students, newSt]);
    setPpdbApplicants(ppdbApplicants.filter(a => a.id !== applicantId));

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Menyetujui pendaftaran PPDB: ${applicant.name} (NISN: ${applicant.nisn})`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleExecuteConfirmAction = () => {
    const { actionType, targetId } = confirmModal;
    if (!targetId || !actionType) return;

    if (actionType === "delete_student") {
      const studentName = students.find((s) => s.id === targetId)?.name || "Siswa";
      setStudents(students.filter((s) => s.id !== targetId));

      const newLog = {
        id: Date.now(),
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        user: session.name,
        action: `Menghapus data master siswa: ${studentName}`,
      };
      setLogs([newLog, ...logs]);
    } else if (actionType === "reject_ppdb") {
      const applicant = ppdbApplicants.find(a => a.id === targetId);
      if (applicant) {
        setPpdbApplicants(ppdbApplicants.filter(a => a.id !== targetId));

        const newLog = {
          id: Date.now(),
          time: new Date().toISOString().replace('T', ' ').substring(0, 16),
          user: session.name,
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

  const handleAddActivity = (newActData: any) => {
    if (!isAdminAdministrasi && !isGuru) return;
    const newAct = {
      ...newActData,
      id: Date.now()
    };
    setActivities([newAct, ...activities]);

    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Menambahkan kegiatan: ${newAct.title}`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleAddSppLesPayment = (newTxData: any) => {
    if (!isAdminTransaksi) return;
    const totalNum = newTxData.spp + newTxData.les;
    const newTx = {
      ...newTxData,
      id: Date.now(),
      total: totalNum
    };
    setSppTransactions([newTx, ...sppTransactions]);

    const studentName = students.find(s => s.id === newTxData.studentId)?.name || "Siswa";
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mencatat SPP & Les ${studentName}: SPP Rp ${newTxData.spp.toLocaleString()}, Les Rp ${newTxData.les.toLocaleString()} (Total Rp ${totalNum.toLocaleString()})`,
    };
    setLogs([newLog, ...logs]);
  };

  const handleAddSavingsTransaction = (data: {
    studentId: number;
    description: string;
    debet: number;
    kredit: number;
    transType: "Setoran" | "Penarikan";
    amountNum: number;
  }) => {
    if (!isAdminTransaksi) return false;

    // Check Penarikan Saldo
    if (data.transType === "Penarikan") {
      const studentTrans = savings.filter(t => t.studentId === data.studentId);
      const currentSaldo = studentTrans.reduce((total, trans) => total + trans.debet - trans.kredit, 0);
      if (data.amountNum > currentSaldo) {
        alert("Saldo tidak cukup untuk melakukan penarikan!");
        return false;
      }
    }

    const newTrans = {
      id: Date.now(),
      studentId: data.studentId,
      date: new Date().toISOString().substring(0, 10),
      description: data.description || "Setoran rutin",
      debet: data.debet,
      kredit: data.kredit,
      admin: session.name,
    };

    setSavings([newTrans, ...savings]);

    const studentName = students.find(s => s.id === data.studentId)?.name || "Anak";
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session.name,
      action: `Mencatat ${data.transType} tabungan Rp ${data.amountNum.toLocaleString()} untuk ${studentName}`,
    };
    setLogs([newLog, ...logs]);
    return true;
  };

  const handleUpdateMurajaah = (studentId: number, param: string, score: string) => {
    if (!isAdminAdministrasi && !isGuru) return;
    setMurajaahData(prev => {
      const studentData = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...studentData,
          [param]: score
        }
      };
    });
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
              
              {/* Hamburger Button for Mobile */}
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

          {/* Render Active Tab Component */}
          {activeTab === "siswa" && (
            <StudentTab
              students={students}
              ppdbApplicants={ppdbApplicants}
              isAdminAdministrasi={isAdminAdministrasi}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onUpdateStudentStatus={handleUpdateStudentStatus}
              onApprovePpdb={handleApprovePpdb}
              onRejectPpdb={handleRejectPpdb}
            />
          )}

          {activeTab === "kegiatan" && (
            <KegiatanTab
              activities={activities}
              isAdminAdministrasi={isAdminAdministrasi}
              isGuru={isGuru}
              onAddActivity={handleAddActivity}
            />
          )}

          {activeTab === "spp" && (
            <SppTab
              students={students}
              sppTransactions={sppTransactions}
              isAdminTransaksi={isAdminTransaksi}
              onAddSppLesPayment={handleAddSppLesPayment}
            />
          )}

          {activeTab === "tabungan" && (
            <TabunganTab
              students={students}
              savings={savings}
              isAdminTransaksi={isAdminTransaksi}
              adminName={session.name}
              onAddTransaction={handleAddSavingsTransaction}
            />
          )}

          {activeTab === "murajaah" && (
            <MurajaahTab
              students={students}
              murajaahData={murajaahData}
              isAdminAdministrasi={isAdminAdministrasi}
              isGuru={isGuru}
              onUpdateMurajaah={handleUpdateMurajaah}
            />
          )}

          {activeTab === "laporan" && (
            <LaporanTab />
          )}

          {activeTab === "audit" && (
            <AuditTab logs={logs} />
          )}
        </div>

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
      </main>
    </div>
  );
}
