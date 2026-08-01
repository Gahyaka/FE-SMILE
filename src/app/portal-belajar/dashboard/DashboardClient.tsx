"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock Initial Activities (Modul B - Dokumentasi Kegiatan)
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

// Mock Initial Students for SPP (Modul C - Monitoring SPP & Data Dasar)
const initialStudents = [
  { id: 1, name: "Ahmad Rayyan", class: "RA (A)", status: { Jan: "Lunas", Feb: "Lunas", Mar: "Belum Lunas" } },
  { id: 2, name: "Bilqis Azzahra", class: "RA (B)", status: { Jan: "Lunas", Feb: "Lunas", Mar: "Lunas" } },
  { id: 3, name: "Fatih Al-Fatih", class: "KB", status: { Jan: "Lunas", Feb: "Belum Lunas", Mar: "Belum Lunas" } },
  { id: 4, name: "Fatimah Az-Zahra", class: "RA (A)", status: { Jan: "Lunas", Feb: "Lunas", Mar: "Lunas" } },
  { id: 5, name: "Yusuf Al-Hafidz", class: "KB", status: { Jan: "Belum Lunas", Feb: "Belum Lunas", Mar: "Belum Lunas" } },
];

// Mock Initial Savings Transactions (Modul 3.C - Tabungan Anak)
const initialSavings = [
  { id: 1, studentId: 1, type: "Setoran", amount: 50000, date: "2026-07-15", method: "Tunai", admin: "Ibu Guru Halimah" },
  { id: 2, studentId: 1, type: "Setoran", amount: 20000, date: "2026-07-20", method: "Tunai", admin: "Ibu Guru Halimah" },
  { id: 3, studentId: 2, type: "Setoran", amount: 100000, date: "2026-07-18", method: "Transfer", admin: "Administrator" },
  { id: 4, studentId: 3, type: "Setoran", amount: 30000, date: "2026-07-22", method: "Tunai", admin: "Ibu Guru Halimah" },
];

// Mock Initial Audit Logs (Modul 9 - Monitoring Aktivitas Admin)
const initialLogs = [
  { id: 1, time: "2026-08-01 09:30", user: "Ibu Guru Halimah", action: "Menambahkan kegiatan: Peringatan Hari Santri" },
  { id: 2, time: "2026-08-01 10:15", user: "Administrator", action: "Mengubah status SPP Ahmad Rayyan (Maret) menjadi Lunas" },
];

export default function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<{ role: "admin" | "walikelas"; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"kegiatan" | "spp" | "tabungan" | "laporan" | "audit">("kegiatan");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Activities states (Modul B)
  const [activities, setActivities] = useState(initialActivities);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState("Akademik");
  const [newDrive, setNewDrive] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  // SPP states (Modul C)
  const [students, setStudents] = useState(initialStudents);

  // Savings states (Section 3.C)
  const [savings, setSavings] = useState(initialSavings);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [transType, setTransType] = useState<"Setoran" | "Penarikan">("Setoran");
  const [transAmount, setTransAmount] = useState("");
  const [transMethod, setTransMethod] = useState("Tunai");

  // Audit Logs state
  const [logs, setLogs] = useState(initialLogs);

  useEffect(() => {
    // Client-side authentication check
    const storedSession = localStorage.getItem("user_session");
    if (!storedSession) {
      router.push("/portal-belajar");
    } else {
      setSession(JSON.parse(storedSession));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/portal-belajar");
  };

  // Add new activity handler
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  // Toggle student SPP payment status (Admin only)
  const toggleSppStatus = (studentId: number, month: "Jan" | "Feb" | "Mar") => {
    if (session?.role !== "admin") return;
    
    let studentName = "";
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          studentName = student.name;
          const currentStatus = student.status[month];
          return {
            ...student,
            status: {
              ...student.status,
              [month]: currentStatus === "Lunas" ? "Belum Lunas" : "Lunas",
            },
          };
        }
        return student;
      })
    );

    // Add audit log
    const newLog = {
      id: Date.now(),
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: session?.name || "User",
      action: `Mengubah status SPP ${studentName} (${month}) menjadi ${
        students.find(s => s.id === studentId)?.status[month] === "Lunas" ? "Belum Lunas" : "Lunas"
      }`,
    };
    setLogs([newLog, ...logs]);
  };

  // Add savings transaction (Admin / Wali kelas)
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transAmount || isNaN(Number(transAmount)) || Number(transAmount) <= 0) return;

    const amountNum = Number(transAmount);
    const selectedStudentName = students.find(s => s.id === selectedStudentId)?.name || "Anak";

    // Recheck penarikan check (penarikan saldo tidak boleh melebihi saldo yang ada)
    const currentSaldo = getStudentSaldo(selectedStudentId);
    if (transType === "Penarikan" && amountNum > currentSaldo) {
      alert("Saldo tidak cukup untuk melakukan penarikan!");
      return;
    }

    const newTrans = {
      id: Date.now(),
      studentId: selectedStudentId,
      type: transType,
      amount: amountNum,
      date: new Date().toISOString().substring(0, 10),
      method: transMethod,
      admin: session?.name || "Admin",
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
  };

  // Helper: Calculate total saldo for a student
  const getStudentSaldo = (studentId: number) => {
    const studentTrans = savings.filter(t => t.studentId === studentId);
    return studentTrans.reduce((total, trans) => {
      if (trans.type === "Setoran") return total + trans.amount;
      return total - trans.amount;
    }, 0);
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

  const isAdmin = session.role === "admin";
  const isWaliKelas = session.role === "walikelas";
  const filteredActivities = filterCategory === "Semua" 
    ? activities 
    : activities.filter(act => act.category === filterCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-dark flex flex-col md:flex-row relative">
      {/* Background Chalkboard Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.012)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>

      {/* Sidebar for Desktop & Mobile Toggle Drawer */}
      <aside className={`w-64 bg-white text-neutral-dark flex flex-col justify-between p-5 border-r border-primary-green/10 z-40 fixed h-screen transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="space-y-6">
          
          {/* Logo Brand Widget */}
          <div className="flex items-center gap-3 border-b border-primary-green/10 pb-5">
            <div className="w-10 h-10 rounded-full border border-primary-green/20 overflow-hidden bg-white shadow-xs">
              <img src="/images/logo.jpg" alt="Logo RA Sahabat" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-baloo text-sm font-bold tracking-wide leading-none text-neutral-dark">RA Sahabat</h2>
              <span className="text-[9px] text-primary-green font-extrabold uppercase mt-1 block tracking-wider">Portal Administrasi</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            <span className="text-[9px] text-primary-green/60 font-extrabold uppercase tracking-widest block mb-2 px-3">Menu Utama</span>
            
            <button
              onClick={() => {
                setActiveTab("kegiatan");
                setSidebarOpen(false);
              }}
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
              onClick={() => {
                setActiveTab("spp");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "spp"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Monitoring SPP</span>
            </button>

            {/* Tabungan Tab (Modul 3.C) */}
            <button
              onClick={() => {
                setActiveTab("tabungan");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "tabungan"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tabungan Anak</span>
            </button>

            {/* Laporan Tab (Modul 10) */}
            <button
              onClick={() => {
                setActiveTab("laporan");
                setSidebarOpen(false);
              }}
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

            {/* Audit Logs Tab (Modul 9) */}
            <button
              onClick={() => {
                setActiveTab("audit");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-primary-green/10 text-primary-green border-l-4 border-primary-green font-extrabold shadow-3xs"
                  : "text-neutral-gray hover:text-neutral-dark hover:bg-neutral-gray/5 border-l-4 border-transparent font-medium"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Catatan Aktivitas</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Account & Logout info */}
        <div className="space-y-4 pt-5 border-t border-primary-green/10">
          <div className="bg-[#FAF8F5] border border-primary-green/10 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center font-extrabold text-[10px] flex-shrink-0">
              {isAdmin ? "AD" : "WK"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-neutral-dark font-bold leading-tight truncate">{session.name}</p>
              <span className="text-[8px] text-primary-green font-bold uppercase mt-1 block">
                {isAdmin ? "Administrator" : "Wali Kelas"}
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

      {/* Background Overlay when Sidebar is open on Mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 min-h-screen flex flex-col justify-between">
        
        <div className="space-y-6">
          
          {/* Mobile Header Bar */}
          <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-xl border border-primary-green/10 shadow-3xs">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 border border-primary-green/20 rounded-lg text-neutral-dark bg-[#FAF8F5] cursor-pointer"
            >
              ☰ Menu
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-primary-green/10">
                <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-baloo text-xs font-bold text-neutral-dark">RA Sahabat</span>
            </div>
          </div>

          {/* Current Page Title and Path info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-primary-green/10 pb-4">
            <div>
              <span className="text-[9px] text-neutral-gray font-bold uppercase tracking-wider">
                Portal Belajar & Administrasi
              </span>
              <h2 className="font-baloo text-2xl font-bold text-neutral-dark mt-1">
                {activeTab === "kegiatan" && "Dokumentasi Kegiatan (Modul B)"}
                {activeTab === "spp" && "Monitoring SPP bulanan (Modul C)"}
                {activeTab === "tabungan" && "Pengelolaan Tabungan Siswa (Modul 3.C)"}
                {activeTab === "laporan" && "Ekspor & Rekap Laporan Sekolah (Modul 10)"}
                {activeTab === "audit" && "Log Riwayat Transaksi Audit (Modul 9)"}
              </h2>
            </div>
            
            <div className="text-[10px] bg-white border border-primary-green/10 px-3.5 py-1.5 rounded-lg font-bold text-neutral-gray flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{isAdmin ? "Status: Administrator" : "Status: Wali Kelas"}</span>
            </div>
          </div>

          {/* TAB CONTENT 1: Dokumentasi Kegiatan */}
          {activeTab === "kegiatan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Input Form (Wali Kelas only) */}
              {isWaliKelas && (
                <div className="lg:col-span-4 bg-white p-6 rounded-[25px_15px_30px_20px]/[20px_30px_15px_25px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-4">
                  <h3 className="font-baloo text-lg font-bold text-neutral-dark flex items-center gap-1.5 border-b border-primary-green/10 pb-2">
                    <span>📝</span> Tambah Kegiatan Baru
                  </h3>
                  
                  <form onSubmit={handleAddActivity} className="space-y-4">
                    <div>
                      <label htmlFor="newTitle" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Nama Kegiatan</label>
                      <input
                        type="text"
                        id="newTitle"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        suppressHydrationWarning
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                        placeholder="Contoh: Senam PHBS Ceria"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="newDate" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Tanggal</label>
                        <input
                          type="date"
                          id="newDate"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          required
                          suppressHydrationWarning
                          className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label htmlFor="newCategory" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Kategori</label>
                        <select
                          id="newCategory"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          suppressHydrationWarning
                          className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                        >
                          <option value="Akademik">Akademik</option>
                          <option value="Keagamaan">Keagamaan / Ke-NU-an</option>
                          <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newDrive" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Tautan Folder Google Drive (Bukti)</label>
                      <input
                        type="url"
                        id="newDrive"
                        value={newDrive}
                        onChange={(e) => setNewDrive(e.target.value)}
                        suppressHydrationWarning
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                        placeholder="https://drive.google.com/..."
                      />
                    </div>

                    <div>
                      <label htmlFor="newDesc" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Deskripsi Singkat</label>
                      <textarea
                        id="newDesc"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        required
                        rows={3}
                        suppressHydrationWarning
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold resize-none"
                        placeholder="Jelaskan tujuan atau luaran kegiatan..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      suppressHydrationWarning
                      className="w-full py-3.5 rounded-[12px_24px_12px_30px]/[30px_12px_24px_12px] bg-[#2CB24A] hover:bg-[#1C8A38] text-white font-extrabold text-xs transition-all border-2 border-[#1C8A38] shadow-xs cursor-pointer"
                    >
                      Simpan Kegiatan 💾
                    </button>
                  </form>
                </div>
              )}

              {/* List and Filter Column */}
              <div className={isWaliKelas ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
                
                {/* Filter Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-primary-green/10 gap-3">
                  <span className="text-xs font-extrabold text-neutral-dark">Daftar Kegiatan Terarsip</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-gray uppercase">Saring:</span>
                    <div className="flex gap-1.5">
                      {["Semua", "Akademik", "Keagamaan", "Ekstrakurikuler"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-3 py-1 rounded-md text-[10px] font-extrabold border transition-colors cursor-pointer ${
                            filterCategory === cat
                              ? "bg-primary-green text-white border-primary-green"
                              : "bg-[#FAF8F5] text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredActivities.map((act) => (
                    <div key={act.id} className="bg-white p-5 rounded-2xl border-2 border-dashed border-primary-green/10 shadow-xs relative flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            act.category === "Keagamaan" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {act.category}
                          </span>
                          <span className="text-[9px] text-neutral-gray font-bold">{act.date}</span>
                        </div>
                        <h4 className="font-baloo text-base font-bold text-neutral-dark mt-2">{act.title}</h4>
                        <p className="text-xs text-neutral-gray font-semibold mt-1.5 leading-relaxed">{act.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-gray/5 flex justify-between items-center">
                        <a
                          href={act.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-extrabold text-primary-green hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          📁 Buka Folder Drive ↗
                        </a>
                        <span className="text-[9px] text-neutral-gray italic">Akreditasi Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: Monitoring SPP */}
          {activeTab === "spp" && (
            <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-6">
              <div>
                <h3 className="font-baloo text-xl font-bold text-neutral-dark mb-1.5">Daftar Status Keuangan SPP TA 2026/2027</h3>
                <p className="text-xs text-neutral-gray font-semibold">
                  {isAdmin 
                    ? "💡 Sebagai Administrator Keuangan, Anda dapat mengeklik status pembayaran bulanan untuk mengubah statusnya (Lunas/Belum Lunas) secara langsung."
                    : "💡 Sebagai Wali Kelas, Anda hanya memiliki izin membaca status keuangan SPP. Silakan hubungi bendahara sekolah untuk melakukan perubahan data."}
                </p>
              </div>

              {/* SPP Table */}
              <div className="overflow-x-auto rounded-xl border border-neutral-gray/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10">
                      <th className="py-4 px-6">Nama Siswa</th>
                      <th className="py-4 px-4">Kelas</th>
                      <th className="py-4 px-4 text-center">Januari</th>
                      <th className="py-4 px-4 text-center">Februari</th>
                      <th className="py-4 px-4 text-center">Maret</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-neutral-dark divide-y divide-neutral-gray/5">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-soft-mint/30 transition-colors">
                        <td className="py-4 px-6 font-bold">{student.name}</td>
                        <td className="py-4 px-4"><span className="px-2 py-0.5 bg-neutral-gray/10 rounded-md text-[10px] font-bold">{student.class}</span></td>
                        
                        {/* Months */}
                        {["Jan", "Feb", "Mar"].map((month) => {
                          const status = student.status[month as "Jan" | "Feb" | "Mar"];
                          const isLunas = status === "Lunas";
                          return (
                            <td key={month} className="py-4 px-4 text-center">
                              <button
                                disabled={!isAdmin}
                                onClick={() => toggleSppStatus(student.id, month as "Jan" | "Feb" | "Mar")}
                                className={`px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all ${
                                  isLunas
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                    : "bg-amber-100 text-amber-700 border-amber-300"
                                } ${isAdmin ? "cursor-pointer hover:scale-105" : "cursor-default"}`}
                              >
                                {status}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* General Note */}
              <div className="p-4 bg-soft-mint border border-primary-green/20 rounded-xl flex items-center gap-3">
                <span className="text-xl">🛡</span>
                <p className="text-[10px] font-semibold text-primary-dark leading-relaxed">
                  Pencatatan ini dilindungi kebijakan privasi lembaga. Keamanan data keuangan anak didik terjaga di bawah pengawasan KB/RA Sahabat Berbah Sleman dan terintegrasi secara internal.
                </p>
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: Tabungan Anak (Modul 3.C) */}
          {activeTab === "tabungan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form Input Transaksi */}
              <div className="lg:col-span-4 bg-white p-6 rounded-[25px_15px_30px_20px]/[20px_30px_15px_25px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-4">
                <h3 className="font-baloo text-lg font-bold text-neutral-dark flex items-center gap-1.5 border-b border-primary-green/10 pb-2">
                  <span>💰</span> Catat Transaksi Baru
                </h3>
                
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <label htmlFor="selectedStudent" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Pilih Siswa</label>
                    <select
                      id="selectedStudent"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                      suppressHydrationWarning
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                    >
                      {students.map((st) => (
                        <option key={st.id} value={st.id}>{st.name} ({st.class})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="transType" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Tipe Transaksi</label>
                      <select
                        id="transType"
                        value={transType}
                        onChange={(e) => setTransType(e.target.value as "Setoran" | "Penarikan")}
                        suppressHydrationWarning
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                      >
                        <option value="Setoran">Setoran</option>
                        <option value="Penarikan">Penarikan</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="transMethod" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Metode</label>
                      <select
                        id="transMethod"
                        value={transMethod}
                        onChange={(e) => setTransMethod(e.target.value)}
                        suppressHydrationWarning
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white"
                      >
                        <option value="Tunai">Tunai</option>
                        <option value="Transfer">Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="transAmount" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Jumlah Uang (Rupiah)</label>
                    <input
                      type="number"
                      id="transAmount"
                      value={transAmount}
                      onChange={(e) => setTransAmount(e.target.value)}
                      required
                      suppressHydrationWarning
                      className="w-full px-3 py-2.5 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                      placeholder="Contoh: 10000"
                    />
                  </div>

                  <button
                    type="submit"
                    suppressHydrationWarning
                    className="w-full py-3.5 rounded-[12px_24px_12px_30px]/[30px_12px_24px_12px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs transition-all border border-primary-green shadow-xs cursor-pointer"
                  >
                    Simpan Transaksi 💾
                  </button>
                </form>
              </div>

              {/* Rekap Saldo dan Transaksi Siswa */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Saldo List Grid */}
                <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-4">
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">Ringkasan Saldo Buku Tabungan</h4>
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

                {/* Transaksi History */}
                <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-4">
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">Riwayat Buku Tabungan (Terbaru)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10">
                          <th className="py-3 px-4">Nama Anak</th>
                          <th className="py-3 px-2">Tipe</th>
                          <th className="py-3 px-4">Nominal</th>
                          <th className="py-3 px-2">Metode</th>
                          <th className="py-3 px-2">Tanggal</th>
                          <th className="py-3 px-4">Petugas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-gray/5 font-semibold text-neutral-dark">
                        {savings.map((t) => {
                          const name = students.find(s => s.id === t.studentId)?.name || "Anak";
                          return (
                            <tr key={t.id} className="hover:bg-soft-mint/30">
                              <td className="py-3 px-4 font-bold">{name}</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  t.type === "Setoran" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {t.type}
                                </span>
                              </td>
                              <td className="py-3 px-4">Rp {t.amount.toLocaleString()}</td>
                              <td className="py-3 px-2">{t.method}</td>
                              <td className="py-3 px-2 text-neutral-gray">{t.date}</td>
                              <td className="py-3 px-4 text-neutral-gray">{t.admin}</td>
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

          {/* TAB CONTENT 4: Laporan & Ekspor (Modul 10) */}
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
                    <span className="text-2xl">📄</span>
                    <h4 className="font-baloo text-base font-bold text-neutral-dark">Arsip Laporan SPP Bulanan (PDF)</h4>
                    <p className="text-xs text-neutral-gray font-semibold leading-relaxed">Format dokumen resmi siap cetak untuk diserahkan ke kepala sekolah atau yayasan penyelenggara.</p>
                  </div>
                  <button
                    onClick={() => alert("Simulasi Ekspor PDF Berhasil! File Rekap_SPP_RA_Sahabat.pdf diunduh.")}
                    className="w-full py-2.5 rounded-lg bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs transition-all border border-primary-green cursor-pointer text-center"
                  >
                    Unduh PDF 💾
                  </button>
                </div>

                {/* Excel Card */}
                <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-primary-green/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-2xl">📊</span>
                    <h4 className="font-baloo text-base font-bold text-neutral-dark">Rekap Data Keuangan & Tabungan (Excel)</h4>
                    <p className="text-xs text-neutral-gray font-semibold leading-relaxed">Berkas lembar kerja spreadsheet untuk mempermudah perhitungan pembukuan kas bulanan yayasan.</p>
                  </div>
                  <button
                    onClick={() => alert("Simulasi Ekspor Excel Berhasil! File Rekap_Kas_RA_Sahabat.xlsx diunduh.")}
                    className="w-full py-2.5 rounded-lg bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold text-xs transition-all border border-[#0E7A4D] cursor-pointer text-center"
                  >
                    Unduh Excel 💾
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 5: Audit Logs (Modul 9) */}
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
