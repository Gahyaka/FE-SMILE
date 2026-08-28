"use client";

import React, { useState, useEffect } from "react";

interface Student {
  id: string | number;
  name: string;
  class: string;
  activeStatus?: string;
}

interface SavingTransaction {
  id: string | number;
  studentId: string | number;
  date: string;
  description: string;
  debet: number;
  kredit: number;
  admin: string;
}

interface TabunganTabProps {
  students: Student[];
  classes: any[];
  savings: SavingTransaction[];
  isAdminTransaksi: boolean;
  adminName: string;
  onAddTransaction: (newTrans: Omit<SavingTransaction, "id" | "date" | "admin"> & { transType: "Setoran" | "Penarikan", amountNum: number }) => Promise<boolean>;
}

export default function TabunganTab({
  students,
  classes = [],
  savings,
  isAdminTransaksi,
  adminName,
  onAddTransaction,
}: TabunganTabProps) {
  // Form states (mendukung UUID String & Number)
  const [selectedStudentId, setSelectedStudentId] = useState<string | number>("");
  const [transDesc, setTransDesc] = useState("Setoran rutin");
  const [transType, setTransType] = useState<"Setoran" | "Penarikan">("Setoran");
  const [transAmount, setTransAmount] = useState("");
  const [savingFilterStudentId, setSavingFilterStudentId] = useState<string | number>(students.filter(s => s.activeStatus === "Aktif")[0]?.id || "");
  const [showMutasiForm, setShowMutasiForm] = useState(false);

  // Form Filter Kelas (baru untuk mencegah loading berat)
  const [formSelectedClass, setFormSelectedClass] = useState(classes[0]?.className || "KB");

  // Filters for summary lists
  const [classFilter, setClassFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Local Confirmation State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
  });

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      action,
    });
  };

  const filteredStudents = students.filter((st) => {
    const matchesClass = classFilter === "Semua" || st.class === classFilter;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isAktif = st.activeStatus === "Aktif";
    return matchesClass && matchesSearch && isAktif;
  });

  // Filter students based on chosen class in Form
  const formFilteredStudents = students.filter(
    (st) => st.activeStatus === "Aktif" && st.class === formSelectedClass
  );

  // Auto set first student when form class filter changes
  useEffect(() => {
    if (formFilteredStudents.length > 0) {
      setSelectedStudentId(formFilteredStudents[0].id);
    } else {
      setSelectedStudentId("");
    }
  }, [formSelectedClass, students]);

  // Helper: Calculate total saldo for a student dynamically (Debet - Kredit)
  const getStudentSaldo = (studentId: string | number) => {
    const studentTrans = savings.filter((t) => String(t.studentId) === String(studentId));
    return studentTrans.reduce((total, trans) => {
      return total + trans.debet - trans.kredit;
    }, 0);
  };

  // Helper: Get chronological savings list with running balance
  const getStudentTabunganRows = (studentId: string | number) => {
    const studentTrans = [...savings].filter((t) => String(t.studentId) === String(studentId)).reverse(); // Oldest first for calculation
    let runningSaldo = 0;
    const mapped = studentTrans.map((t) => {
      runningSaldo = runningSaldo + t.debet - t.kredit;
      return { ...t, saldo: runningSaldo };
    });
    return mapped.reverse(); // Newest first for visual list
  };

  const executeAddTransaction = async () => {
    const amountNum = Number(transAmount);
    const success = await onAddTransaction({
      studentId: selectedStudentId,
      description: transDesc || "Setoran rutin",
      debet: transType === "Setoran" ? amountNum : 0,
      kredit: transType === "Penarikan" ? amountNum : 0,
      transType,
      amountNum,
    });

    if (success) {
      setTransAmount("");
      setTransDesc("Setoran rutin");
      setShowMutasiForm(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    if (!transAmount || isNaN(Number(transAmount)) || Number(transAmount) <= 0) return;

    const studentName = students.find(s => String(s.id) === String(selectedStudentId))?.name || "Siswa";
    const amountVal = Number(transAmount);

    triggerConfirm(
      `Konfirmasi Mutasi ${transType}`,
      `Apakah Anda yakin ingin menyimpan transaksi ${transType.toLowerCase()} sebesar Rp ${amountVal.toLocaleString()} untuk siswa "${studentName}"?`,
      executeAddTransaction
    );
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header Tab & Action Button */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-gray/8 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div>
          <h4 className="font-baloo text-base font-bold text-neutral-dark">Buku Tabungan Digital Murid</h4>
          <p className="text-[11px] text-neutral-gray font-semibold">Mutasi tabungan digital KB/RA Sahabat Berbah Sleman untuk melatih kemandirian finansial santri sejak dini.</p>
        </div>
        
        {isAdminTransaksi && (
          <button
            type="button"
            onClick={() => setShowMutasiForm(true)}
            className="py-2.5 px-4 bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-98"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Catat Mutasi Baru</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Input Transaksi Tabungan Sliding Side Drawer (Admin Transaksi Only) */}
        {showMutasiForm && isAdminTransaksi && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop Overlay */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setShowMutasiForm(false)}
            />
            
            {/* Drawer Container */}
            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md bg-white border-l border-neutral-gray/8 flex flex-col shadow-2xl h-full animate-slide-in">
                {/* Header */}
                <div className="px-6 py-5 border-b border-neutral-gray/8 flex justify-between items-center bg-[#FAF8F5]">
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">Catat Mutasi Tabungan</h4>
                  <button
                    type="button"
                    onClick={() => setShowMutasiForm(false)}
                    className="w-6 h-6 rounded-full bg-white border border-neutral-gray/12 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form Content (Scrollable) */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                  
                  {/* 1. Pemilihan Kelas (Baru - Filter Awal Murid) */}
                  <div>
                    <label htmlFor="formClassSelect" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Langkah 1: Filter Kelas Dahulu</label>
                    <select
                      id="formClassSelect"
                      value={formSelectedClass}
                      onChange={(e) => setFormSelectedClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 bg-white font-bold text-neutral-dark cursor-pointer focus:border-primary-green focus:outline-none"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.className}>{c.className}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Pemilihan Murid Terfilter */}
                  <div>
                    <label htmlFor="selectedStudent" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Langkah 2: Pilih Siswa Kelas {formSelectedClass}</label>
                    <select
                      id="selectedStudent"
                      value={selectedStudentId || ""}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 bg-white cursor-pointer focus:border-primary-green focus:outline-none"
                    >
                      <option value="">-- Pilih Murid --</option>
                      {formFilteredStudents.map((st) => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                    {formFilteredStudents.length === 0 && (
                      <span className="text-[9px] text-rose-500 font-semibold block mt-1">Belum ada murid aktif di kelas ini.</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="transType" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Tipe Transaksi</label>
                      <select
                        id="transType"
                        value={transType}
                        onChange={(e) => setTransType(e.target.value as "Setoran" | "Penarikan")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 bg-white cursor-pointer focus:border-primary-green focus:outline-none"
                      >
                        <option value="Setoran">Setoran (Debet)</option>
                        <option value="Penarikan">Penarikan (Kredit)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="transAmount" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Nominal (Rupiah)</label>
                      <input
                        type="number"
                        id="transAmount"
                        value={transAmount}
                        onChange={(e) => setTransAmount(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 focus:border-primary-green focus:outline-none bg-stone-50 focus:bg-white font-bold"
                        placeholder="Jumlah uang"
                      />
                    </div>
                  </div>

                  {/* Tombol Pintasan Nominal Tabungan */}
                  <div>
                    <span className="block text-[8.5px] text-neutral-gray/60 uppercase mb-1.5 font-bold tracking-wide">Pintasan Nominal Harian</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[5000, 10000, 20000, 50000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTransAmount(amt.toString())}
                          className="py-2 px-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[9px] font-black rounded-xl border-2 border-emerald-200/60 shadow-3xs transition-all active:scale-95 duration-150 cursor-pointer text-center"
                        >
                          Rp {(amt / 1000).toString()}rb
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="transDesc" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1.5">Keterangan / Uraian</label>
                    <input
                      type="text"
                      id="transDesc"
                      value={transDesc}
                      onChange={(e) => setTransDesc(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:outline-none"
                      placeholder="Contoh: Setoran rutin, Penarikan alat tulis"
                    />
                  </div>

                  {/* Sticky buttons at bottom */}
                  <div className="flex gap-2 pt-4 border-t border-neutral-gray/8 sticky bottom-0 bg-white">
                    <button
                      type="submit"
                      disabled={!selectedStudentId}
                      className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Simpan Transaksi
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMutasiForm(false)}
                      className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Rekap Saldo dan Transaksi Buku Rekening */}
        <div className="lg:col-span-12 space-y-6">
          
          {/* Saldo List Grid */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-gray/8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-gray/8 pb-4">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">Ringkasan Saldo Buku Tabungan Murid</h4>
            </div>

            {/* Filter Kategori Kelas */}
            <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-gray/8 shadow-3xs">
              <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Kategori Kelas:</span>
              <button
                type="button"
                onClick={() => setClassFilter("Semua")}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                  classFilter === "Semua"
                    ? "bg-primary-green text-white border-primary-green shadow-xs"
                    : "bg-white text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark hover:border-neutral-gray/30"
                }`}
              >
                Semua
              </button>
              {classes.map((c: any) => (
                <button
                  key={c.id || c.className}
                  type="button"
                  onClick={() => setClassFilter(c.className)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                    classFilter === c.className
                      ? "bg-primary-green text-white border-primary-green shadow-xs"
                      : "bg-white text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark hover:border-neutral-gray/30"
                  }`}
                >
                  {c.className}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative">
              <svg className="w-3.5 h-3.5 text-neutral-gray absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama murid..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>

            {/* List Murid Saldo Pembukuan (Scrollable Table) */}
            <div className="overflow-x-auto rounded-xl border border-neutral-gray/8 shadow-sm max-h-[220px] overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10 sticky top-0 z-10">
                    <th className="py-3 px-4">Nama Murid</th>
                    <th className="py-3 px-4 w-[25%]">Kelas</th>
                    <th className="py-3 px-4 text-right w-[30%]">Saldo Tabungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-gray/5 font-semibold text-neutral-dark">
                  {filteredStudents.map((st) => {
                    const saldo = getStudentSaldo(st.id);
                    const isActive = String(savingFilterStudentId) === String(st.id);
                    return (
                      <tr
                        key={st.id}
                        onClick={() => setSavingFilterStudentId(st.id)}
                        className={`cursor-pointer transition-colors ${
                          isActive
                            ? "bg-primary-green/10 text-primary-green font-black"
                            : "hover:bg-soft-mint/30"
                        }`}
                      >
                        <td className="py-2.5 px-4 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary-green animate-pulse" : "bg-neutral-gray/30"}`} />
                          <span>{st.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-neutral-gray">{st.class}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-primary-green">
                          Rp {saldo.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-neutral-gray italic">Tidak ada murid yang ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaksi History Per Siswa (Buku Rekening) */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-gray/8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-neutral-gray/8">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">
                Buku Rekening Tabungan Personal: <span className="text-primary-green underline font-black">{students.find(s => String(s.id) === String(savingFilterStudentId))?.name || "Murid"}</span>
              </h4>
            </div>

            {/* Tampilan Desktop: Tabel Buku Rekening */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-gray/8 shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
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
                    <tr key={t.id} className="hover:bg-soft-mint/30 transition-colors">
                      <td className="py-3 px-4 text-neutral-gray font-mono">{t.date}</td>
                      <td className="py-3 px-4 text-neutral-dark">{t.description}</td>
                      <td className="py-3 px-3 text-right text-emerald-600 font-mono font-bold">
                        {t.debet > 0 ? `+Rp ${t.debet.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-3 px-3 text-right text-rose-600 font-mono font-bold">
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
                  {getStudentTabunganRows(savingFilterStudentId).length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-neutral-gray italic">Belum ada riwayat transaksi tabungan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tampilan Mobile: Card List */}
            <div className="block sm:hidden space-y-3">
              {getStudentTabunganRows(savingFilterStudentId).map((t) => (
                <div key={t.id} className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-gray/8 shadow-sm space-y-2.5 animate-fade-in hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-1.5 gap-2">
                    <span className="text-[10px] text-neutral-gray font-mono font-bold">{t.date}</span>
                    <span className="text-[9px] text-neutral-gray/80 font-bold bg-white px-2 py-0.5 rounded border border-neutral-gray/10 truncate max-w-[90px]" title={t.admin}>
                      Oleh: {t.admin}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-dark font-medium leading-relaxed">
                    {t.description}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] font-bold">
                    <div className="bg-white p-1.5 rounded-xl border border-neutral-gray/5 flex flex-col justify-center">
                      <span className="block text-[8px] text-neutral-gray/60 uppercase">Setor (+)</span>
                      <span className="text-emerald-600 font-mono mt-0.5 font-bold">
                        {t.debet > 0 ? `Rp ${t.debet.toLocaleString()}` : "-"}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded-xl border border-neutral-gray/5 flex flex-col justify-center">
                      <span className="block text-[8px] text-neutral-gray/60 uppercase">Tarik (-)</span>
                      <span className="text-rose-600 font-mono mt-0.5 font-bold">
                        {t.kredit > 0 ? `Rp ${t.kredit.toLocaleString()}` : "-"}
                      </span>
                    </div>
                    <div className="bg-emerald-500/10 p-1.5 rounded-xl border border-emerald-500/20 flex flex-col justify-center">
                      <span className="block text-[8px] text-primary-green uppercase">Saldo</span>
                      <span className="text-primary-green font-mono font-black mt-0.5">
                        Rp {t.saldo.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {getStudentTabunganRows(savingFilterStudentId).length === 0 && (
                <p className="text-[11px] text-neutral-gray italic text-center py-6">Belum ada riwayat transaksi tabungan.</p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ── Custom Confirmation Modal Pop-up ── */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-neutral-gray/8 w-full max-w-sm p-6 relative shadow-2xl text-center space-y-4 animate-scale-in text-neutral-dark">
            <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">{confirmDialog.title}</h4>
              <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed px-2">
                {confirmDialog.message}
              </p>
            </div>
            <div className="flex gap-2.5 pt-2 select-none">
              <button
                type="button"
                onClick={() => {
                  if (confirmDialog.action) confirmDialog.action();
                  setConfirmDialog({ isOpen: false, title: "", message: "", action: null });
                }}
                className="flex-1 py-2.5 bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Ya, Konfirmasi
              </button>
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, title: "", message: "", action: null })}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
