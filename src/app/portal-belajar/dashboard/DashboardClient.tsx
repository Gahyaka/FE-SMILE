"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock Initial Activities (Modul B)
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

// Mock Initial Students for SPP (Modul C)
const initialStudents = [
  { id: 1, name: "Ahmad Rayyan", class: "RA (A)", status: { Jan: "Lunas", Feb: "Lunas", Mar: "Belum Lunas" } },
  { id: 2, name: "Bilqis Azzahra", class: "RA (B)", status: { Jan: "Lunas", Feb: "Lunas", Mar: "Lunas" } },
  { id: 3, name: "Fatih Al-Fatih", class: "KB", status: { Jan: "Lunas", Feb: "Belum Lunas", Mar: "Belum Lunas" } },
  { id: 4, name: "Fatimah Az-Zahra", class: "RA (A)", status: { Jan: "Lunas", Feb: "Lunas", Mar: "Lunas" } },
  { id: 5, name: "Yusuf Al-Hafidz", class: "KB", status: { Jan: "Belum Lunas", Feb: "Belum Lunas", Mar: "Belum Lunas" } },
];

export default function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState<{ role: "admin" | "walikelas"; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"kegiatan" | "spp">("kegiatan");
  
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

  // Add new activity handler (Wali Kelas & Admin can add)
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
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
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
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-24 pb-12 select-none px-4 md:px-8">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* Welcome header widget */}
        <div className="bg-white p-6 rounded-[20px_10px_25px_15px]/[15px_25px_10px_20px] border-2 border-dashed border-primary-green/30 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.005)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none"></div>
          <div>
            <span className="text-[10px] font-extrabold bg-soft-mint border border-primary-green/20 text-primary-dark px-3 py-1 rounded-md uppercase tracking-wider">
              {isAdmin ? "Akses Administrator (Pencatatan Keuangan)" : "Akses Wali Kelas (Pencatatan Kegiatan)"}
            </span>
            <h1 className="font-baloo text-2xl font-bold text-neutral-dark mt-2">Selamat Datang, {session.name}!</h1>
            <p className="text-xs text-neutral-gray font-bold">Portal Administrasi digital KB/RA Sahabat Berbah Sleman.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-[12px_24px_12px_30px]/[30px_12px_24px_12px] bg-accent hover:bg-accent-dark text-white font-extrabold text-xs transition-all border-2 border-primary-dark shadow-xs cursor-pointer"
          >
            Keluar Sistem 🚪
          </button>
        </div>

        {/* Tab triggers */}
        <div className="flex gap-2.5 border-b border-primary-green/10 pb-1">
          <button
            onClick={() => setActiveTab("kegiatan")}
            className={`pb-2.5 px-4 font-baloo text-base font-extrabold transition-colors border-b-4 cursor-pointer ${
              activeTab === "kegiatan"
                ? "border-primary-green text-primary-green"
                : "border-transparent text-neutral-gray hover:text-neutral-dark"
            }`}
          >
            Dokumentasi Kegiatan (Modul B)
          </button>
          <button
            onClick={() => setActiveTab("spp")}
            className={`pb-2.5 px-4 font-baloo text-base font-extrabold transition-colors border-b-4 cursor-pointer ${
              activeTab === "spp"
                ? "border-primary-green text-primary-green"
                : "border-transparent text-neutral-gray hover:text-neutral-dark"
            }`}
          >
            Monitoring Pembayaran SPP (Modul C)
          </button>
        </div>

        {/* Tab 1 content: Dokumentasi Kegiatan */}
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
                      <span className="text-[9px] text-neutral-gray italic">Akreditasi BAN-PDM Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 content: Monitoring SPP */}
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
      </div>
    </div>
  );
}
