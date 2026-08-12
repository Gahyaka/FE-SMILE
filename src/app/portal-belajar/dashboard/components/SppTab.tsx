"use client";

import React, { useState, useEffect } from "react";

interface Student {
  id: number;
  name: string;
  class: string;
}

interface SppTransaction {
  id: number;
  studentId: number;
  date: string;
  description: string;
  spp: number;
  les: number;
  total: number;
  depositStatus: string;
}

interface SppTabProps {
  students: Student[];
  sppTransactions: SppTransaction[];
  isAdminTransaksi: boolean;
  onAddSppLesPayment: (newTx: Omit<SppTransaction, "id" | "total">) => void;
  onUpdateSppLesPayment: (updatedTx: SppTransaction) => void;
  onDeleteSppLesPayment: (txId: number) => void;
}

export default function SppTab({
  students,
  sppTransactions,
  isAdminTransaksi,
  onAddSppLesPayment,
  onUpdateSppLesPayment,
  onDeleteSppLesPayment,
}: SppTabProps) {
  // Dynamic year extraction from transaction dates
  const uniqueYears = Array.from(new Set(sppTransactions.map((tx) => tx.date.substring(0, 4))));
  if (uniqueYears.length === 0) {
    uniqueYears.push(new Date().getFullYear().toString());
  }
  uniqueYears.sort().reverse();

  const [showSppForm, setShowSppForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);
  const [selectedClass, setSelectedClass] = useState("Semua");
  const [selectedPeriod, setSelectedPeriod] = useState<"Hari Ini" | "Minggu Ini" | "Bulan Ini" | "Semester 1" | "Semester 2" | "Semua">("Semua");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [payStudentId, setPayStudentId] = useState<number>(students[0]?.id || 1);
  const [payDate, setPayDate] = useState(new Date().toISOString().substring(0, 10));
  const [paySpp, setPaySpp] = useState("75000");
  const [payLes, setPayLes] = useState("40000");
  const [payDesc, setPayDesc] = useState("Pembayaran SPP + Les");
  const [newDepositStatus, setNewDepositStatus] = useState("Belum Disetor");
  const [editingTx, setEditingTx] = useState<SppTransaction | null>(null);
  const [activeMobileKebabId, setActiveMobileKebabId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Helper: check if a date string (YYYY-MM-DD) falls within the selected period
  const isInPeriod = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const txDate = new Date(dateStr);
    txDate.setHours(0, 0, 0, 0);

    if (selectedPeriod === "Hari Ini") {
      return txDate.getTime() === today.getTime();
    }
    if (selectedPeriod === "Minggu Ini") {
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((dayOfWeek === 0 ? 7 : dayOfWeek) - 1));
      monday.setHours(0, 0, 0, 0);
      return txDate >= monday && txDate <= today;
    }
    if (selectedPeriod === "Bulan Ini") {
      return (
        txDate.getFullYear() === today.getFullYear() &&
        txDate.getMonth() === today.getMonth()
      );
    }
    if (selectedPeriod === "Semester 1") {
      // Semester 1: Juli - Desember (month index 6-11)
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(5, 7)); // 1-indexed
      return year === parseInt(selectedYear) && month >= 7 && month <= 12;
    }
    if (selectedPeriod === "Semester 2") {
      // Semester 2: Januari - Juni (month index 0-5)
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(5, 7)); // 1-indexed
      return year === parseInt(selectedYear) && month >= 1 && month <= 6;
    }
    // "Semua" - only filter by year
    return dateStr.startsWith(selectedYear);
  };

  const filteredTransactions = sppTransactions.filter((tx) => {
    const matchesYear = selectedPeriod === "Semua" ? tx.date.startsWith(selectedYear) : true;
    const matchesPeriod = selectedPeriod === "Semua" ? true : isInPeriod(tx.date);
    const student = students.find((s) => s.id === tx.studentId);
    const matchesClass = selectedClass === "Semua" || (student && student.class === selectedClass);
    return matchesYear && matchesPeriod && matchesClass;
  });

  // Calculate summaries dynamically (Only Les fees are deposited, SPP remains at Treasurer)
  // Summaries track all classes but respect the selected period/year
  const periodFilteredAll = sppTransactions.filter((tx) => {
    if (selectedPeriod === "Semua") return tx.date.startsWith(selectedYear);
    return isInPeriod(tx.date);
  });

  const totalSppTerbayar = periodFilteredAll.reduce((sum, tx) => sum + tx.spp, 0);
  const totalLesSudahDisetor = periodFilteredAll
    .filter((tx) => tx.depositStatus === "Sudah Disetor")
    .reduce((sum, tx) => sum + tx.les, 0);
  const totalLesBelumDisetor = periodFilteredAll
    .filter((tx) => tx.depositStatus === "Belum Disetor")
    .reduce((sum, tx) => sum + tx.les, 0);

  const getTxCount = (cls: string) => {
    return sppTransactions.filter((tx) => {
      const matchesYear = selectedPeriod === "Semua" ? tx.date.startsWith(selectedYear) : true;
      const matchesPeriod = selectedPeriod === "Semua" ? true : isInPeriod(tx.date);
      const student = students.find((s) => s.id === tx.studentId);
      if (!student) return false;
      const matchesClass = cls === "Semua" || student.class === cls;
      return matchesYear && matchesPeriod && matchesClass;
    }).length;
  };

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedClass, selectedPeriod]);

  // Dynamic Description Effect based on selection
  useEffect(() => {
    const student = students.find((s) => s.id === payStudentId);
    if (!student) return;
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    // Parse payDate dynamically from YYYY-MM-DD
    const dateParts = payDate.split("-");
    let currentMonthName = "";
    if (dateParts.length === 3) {
      const monthIdx = parseInt(dateParts[1], 10) - 1;
      const year = dateParts[0];
      currentMonthName = (monthNames[monthIdx] || "Agustus") + " " + year;
    } else {
      currentMonthName = monthNames[new Date().getMonth()] + " " + new Date().getFullYear();
    }

    const sppNum = Number(paySpp || 0);
    const lesNum = Number(payLes || 0);
    let typeText = "";
    if (sppNum > 0 && lesNum > 0) {
      typeText = "SPP & Les";
    } else if (sppNum > 0) {
      typeText = "SPP";
    } else if (lesNum > 0) {
      typeText = "Les";
    } else {
      typeText = "Administrasi";
    }

    setPayDesc(`Pembayaran ${typeText} - ${student.name} - ${currentMonthName}`);
  }, [payStudentId, paySpp, payLes, payDate, students]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySpp || !payLes) return;

    onAddSppLesPayment({
      studentId: payStudentId,
      date: payDate,
      description: payDesc || "Pembayaran SPP + Les",
      spp: Number(paySpp),
      les: Number(payLes),
      depositStatus: newDepositStatus,
    });

    // Reset Form to defaults
    setPaySpp("75000");
    setPayLes("40000");
    setNewDepositStatus("Belum Disetor");
    setShowSppForm(false);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Widget Ringkasan Rekonsiliasi Kas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Kas SPP */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 p-4 rounded-2xl border border-indigo-500/20 flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-800 font-extrabold uppercase tracking-wider">Total Kas SPP (Yayasan)</span>
            <h4 className="font-mono text-xl font-black text-indigo-700">Rp {totalSppTerbayar.toLocaleString()}</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Uang Les Sudah Disetor */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-4 rounded-2xl border border-emerald-500/20 flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider">Setoran Les (Selesai)</span>
            <h4 className="font-mono text-xl font-black text-emerald-700">Rp {totalLesSudahDisetor.toLocaleString()}</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Uang Les Belum Disetor */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-4 rounded-2xl border border-amber-500/20 flex items-center justify-between shadow-3xs">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider">Setoran Les (Belum Disetor)</span>
            <h4 className="font-mono text-xl font-black text-amber-700">Rp {totalLesBelumDisetor.toLocaleString()}</h4>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-600 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Active period label below widgets */}
      <div className="flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-primary-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] text-neutral-gray font-bold">
          Data ringkasan di atas menampilkan periode: <span className="text-primary-green font-extrabold">{selectedPeriod === "Semua" ? `Seluruh Tahun ${selectedYear}` : selectedPeriod}</span>
        </span>
      </div>

      {/* Tabel SPP & Les */}
      <div className="w-full space-y-4">
        <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border border-primary-green/10 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-gray/10 pb-4">
            <div>
              <h3 className="font-baloo text-xl font-bold text-neutral-dark">Buku Kas Pembayaran SPP & Les</h3>
              <p className="text-[11px] text-neutral-gray font-semibold mt-1 flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>
                  {isAdminTransaksi 
                    ? "Masukkan transaksi SPP & Les dengan nilai dasar otomatis (SPP: 75.000, Les: 40.000)."
                    : "Hanya Admin Transaksi (Bunda Keuangan) yang memiliki hak mencatat pembayaran."}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
              {/* Dropdown Filter Tahun Pembukuan - only visible on 'Semua' period */}
              {selectedPeriod === "Semua" && (
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-primary-green/10">
                  <span className="text-[9px] font-extrabold text-neutral-gray uppercase">Tahun:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-white border border-primary-green/15 focus:outline-none cursor-pointer"
                  >
                    {uniqueYears.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
              )}

              {isAdminTransaksi && (
                <button
                  onClick={() => setShowSppForm(true)}
                  className="px-4 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center gap-2 cursor-pointer shadow-3xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Catat SPP & Les Baru</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Periode - Dropdown Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPeriodDropdown(prev => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                selectedPeriod !== "Semua"
                  ? "bg-primary-green/10 text-primary-green border-primary-green/30"
                  : "bg-[#FAF8F5] text-neutral-gray border-neutral-gray/15 hover:text-neutral-dark"
              }`}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Periode: <span className="font-black">{selectedPeriod === "Semua" ? `Semua (${selectedYear})` : selectedPeriod}</span></span>
              <svg className={`w-3 h-3 transition-transform flex-shrink-0 ${showPeriodDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPeriodDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowPeriodDropdown(false)}
                />
                {/* Dropdown Panel */}
                <div className="absolute left-0 top-10 z-40 bg-white rounded-2xl border border-primary-green/10 shadow-lg p-3 min-w-[200px] space-y-1 animate-fade-in">
                  <p className="text-[8px] font-extrabold text-neutral-gray uppercase tracking-wider px-2 pb-1 border-b border-neutral-gray/10">Pilih Rentang Waktu</p>

                  {([
                    { label: "Hari Ini", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", desc: "Transaksi hari ini saja" },
                    { label: "Minggu Ini", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", desc: "Senin s.d. hari ini" },
                    { label: "Bulan Ini", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", desc: "Bulan berjalan" },
                    { label: "Semester 1", icon: "M4 6h16M4 10h16M4 14h16M4 18h16", desc: "Juli – Desember" },
                    { label: "Semester 2", icon: "M4 6h16M4 10h16M4 14h16M4 18h16", desc: "Januari – Juni" },
                    { label: "Semua", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", desc: `Seluruh tahun ${selectedYear}` },
                  ] as const).map(({ label, icon, desc }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(label);
                        setShowPeriodDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        selectedPeriod === label
                          ? "bg-primary-green/10 text-primary-green"
                          : "hover:bg-[#FAF8F5] text-neutral-dark"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                      <div>
                        <span className={`block text-[10px] font-extrabold ${selectedPeriod === label ? "text-primary-green" : ""}`}>{label}</span>
                        <span className="block text-[8px] text-neutral-gray font-medium">{desc}</span>
                      </div>
                      {selectedPeriod === label && (
                        <svg className="w-3.5 h-3.5 ml-auto text-primary-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filter Kategori Kelas */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-primary-green/10">
            <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Kategori Kelas:</span>
            {["Semua", "KB", "RA (A)", "RA (B)"].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                  selectedClass === cls
                    ? "bg-primary-green text-white border-primary-green shadow-3xs"
                    : "bg-white text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark"
                }`}
              >
                {cls} ({getTxCount(cls)})
              </button>
            ))}
          </div>

          {/* Tampilan Desktop/Tablet: Tabel Buku Kas */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-gray/10">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10">
                  <th className="py-3.5 px-4 w-[12%]">Tanggal</th>
                  <th className="py-3.5 px-4 w-[20%]">Nama Murid (Kelas)</th>
                  <th className="py-3.5 px-4 w-[23%]">Keterangan</th>
                  <th className="py-3.5 px-4 text-right w-[9%]">Nominal SPP</th>
                  <th className="py-3.5 px-4 text-right w-[9%]">Nominal Les</th>
                  <th className="py-3.5 px-4 text-right w-[9%]">Total Bayar</th>
                  <th className="py-3.5 px-4 w-[10%]">Status Setoran</th>
                  <th className="py-3.5 px-4 text-center w-[8%]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-gray/5 font-semibold text-neutral-dark">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-neutral-gray font-semibold italic">
                      Tidak ada data pencatatan transaksi SPP & Les untuk tahun {selectedYear} dengan filter kelas ini.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => {
                    const student = students.find((s) => s.id === tx.studentId);
                    return (
                      <tr key={tx.id} className="hover:bg-soft-mint/30 transition-colors">
                        <td className="py-3 px-4 text-neutral-gray font-mono">{tx.date}</td>
                        <td className="py-3 px-4 font-bold">
                          {student ? `${student.name} (${student.class})` : "Siswa dihapus"}
                        </td>
                        <td className="py-3 px-4 text-neutral-gray">{tx.description}</td>
                        <td className={`py-3 px-4 text-right font-mono font-bold ${
                          tx.spp === 0 ? "text-rose-500" : "text-emerald-600"
                        }`}>
                          {tx.spp === 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Rp 0
                            </span>
                          ) : `Rp ${tx.spp.toLocaleString()}`}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold ${
                          tx.les === 0 ? "text-rose-500" : "text-emerald-600"
                        }`}>
                          {tx.les === 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Rp 0
                            </span>
                          ) : `Rp ${tx.les.toLocaleString()}`}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-primary-green font-mono">Rp {tx.total.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (!isAdminTransaksi) return;
                              onUpdateSppLesPayment({
                                ...tx,
                                depositStatus: tx.depositStatus === "Sudah Disetor" ? "Belum Disetor" : "Sudah Disetor"
                              });
                            }}
                            disabled={!isAdminTransaksi}
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black border transition-all ${
                              tx.depositStatus === "Sudah Disetor"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            } ${isAdminTransaksi ? "cursor-pointer" : "cursor-default"}`}
                          >
                            {tx.depositStatus === "Sudah Disetor" ? "Sudah" : "Belum"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isAdminTransaksi ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingTx(tx)}
                                className="p-1 hover:bg-stone-100 rounded text-stone-600 transition-colors cursor-pointer"
                                title="Ubah Transaksi"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteSppLesPayment(tx.id)}
                                className="p-1 hover:bg-red-50 rounded text-red-600 transition-colors cursor-pointer"
                                title="Hapus Transaksi"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-neutral-gray italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Tampilan Mobile: Card List (Ditampilkan di Layar Kecil) */}
          <div className="block sm:hidden space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 px-4 text-center text-neutral-gray font-semibold italic bg-[#FAF8F5] rounded-2xl border border-dashed border-neutral-gray/25">
                Tidak ada data pencatatan transaksi SPP & Les untuk tahun {selectedYear} dengan filter kelas ini.
              </div>
            ) : (
              paginatedTransactions.map((tx) => {
                const student = students.find((s) => s.id === tx.studentId);
                return (
                  <div key={tx.id} className="bg-[#FAF8F5] p-4 rounded-2xl border border-primary-green/10 shadow-3xs space-y-3">
                    <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-2 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-neutral-gray font-mono font-bold">{tx.date}</span>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-primary-green/15 text-primary-green rounded-full border border-primary-green/20">
                          {student ? student.class : "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAdminTransaksi) return;
                            onUpdateSppLesPayment({
                              ...tx,
                              depositStatus: tx.depositStatus === "Sudah Disetor" ? "Belum Disetor" : "Sudah Disetor"
                            });
                          }}
                          disabled={!isAdminTransaksi}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full border transition-all ${
                            tx.depositStatus === "Sudah Disetor"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          } ${isAdminTransaksi ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {tx.depositStatus === "Sudah Disetor" ? "Sudah" : "Belum"}
                        </button>

                        {isAdminTransaksi && (
                          <div className="relative border-l border-neutral-gray/10 pl-2">
                            <button
                              type="button"
                              onClick={() => setActiveMobileKebabId(activeMobileKebabId === tx.id ? null : tx.id)}
                              className="p-1 text-neutral-gray hover:text-neutral-dark transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>

                            {activeMobileKebabId === tx.id && (
                              <>
                                <div
                                  onClick={() => setActiveMobileKebabId(null)}
                                  className="fixed inset-0 z-30 bg-transparent"
                                />
                                <div className="absolute right-0 top-7 bg-white border border-primary-green/10 rounded-xl py-1.5 shadow-md w-28 z-40 animate-fade-in text-left">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTx(tx);
                                      setActiveMobileKebabId(null);
                                    }}
                                    className="w-full px-3.5 py-1.5 hover:bg-stone-50 text-neutral-dark font-extrabold text-[10px] uppercase flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Ubah</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteSppLesPayment(tx.id);
                                      setActiveMobileKebabId(null);
                                    }}
                                    className="w-full px-3.5 py-1.5 hover:bg-red-50 text-red-600 font-extrabold text-[10px] uppercase flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-baloo text-sm font-bold text-neutral-dark leading-tight break-words">
                        {student ? student.name : "Siswa dihapus"}
                      </h4>
                      <p className="text-[11px] text-neutral-gray font-medium leading-relaxed break-words">
                        {tx.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-gray/5 text-center text-[10px] font-bold">
                      <div className="bg-white p-2 rounded-lg border border-neutral-gray/5 flex flex-col justify-center">
                        <span className="block text-[8px] text-neutral-gray/60 uppercase">SPP</span>
                        <span className={`font-mono mt-0.5 font-bold ${
                          tx.spp === 0 ? "text-rose-500" : "text-emerald-600"
                        }`}>
                          {tx.spp === 0 ? "Rp 0 ⚠" : `Rp ${tx.spp.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-neutral-gray/5 flex flex-col justify-center">
                        <span className="block text-[8px] text-neutral-gray/60 uppercase">Les</span>
                        <span className={`font-mono mt-0.5 font-bold ${
                          tx.les === 0 ? "text-rose-500" : "text-emerald-600"
                        }`}>
                          {tx.les === 0 ? "Rp 0 ⚠" : `Rp ${tx.les.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex flex-col justify-center">
                        <span className="block text-[8px] text-primary-green uppercase">Total</span>
                        <span className="text-primary-green font-mono font-black mt-0.5">Rp {tx.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-gray/10">
              <span className="text-[10px] text-neutral-gray font-semibold">
                Halaman <span className="font-black text-neutral-dark">{currentPage}</span> dari <span className="font-black text-neutral-dark">{totalPages}</span>
                {" "}({filteredTransactions.length} entri)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded-lg text-[9px] font-extrabold border border-neutral-gray/15 bg-[#FAF8F5] text-neutral-gray hover:bg-primary-green/10 hover:text-primary-green transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Halaman pertama"
                >
                  «
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold border border-neutral-gray/15 bg-[#FAF8F5] text-neutral-gray hover:bg-primary-green/10 hover:text-primary-green transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-[9px] font-extrabold border transition-all cursor-pointer ${
                      currentPage === page
                        ? "bg-primary-green text-white border-primary-green shadow-3xs"
                        : "bg-[#FAF8F5] text-neutral-gray border-neutral-gray/15 hover:bg-primary-green/10 hover:text-primary-green"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold border border-neutral-gray/15 bg-[#FAF8F5] text-neutral-gray hover:bg-primary-green/10 hover:text-primary-green transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next ›
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded-lg text-[9px] font-extrabold border border-neutral-gray/15 bg-[#FAF8F5] text-neutral-gray hover:bg-primary-green/10 hover:text-primary-green transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Halaman terakhir"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Input Pembayaran SPP & Les Pop-up Modal */}
      {showSppForm && isAdminTransaksi && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">Catat Transaksi Pembayaran SPP & Les</h4>
              <button
                type="button"
                onClick={() => setShowSppForm(false)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-neutral-dark">
              <div>
                <label htmlFor="payStudent" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Pilih Siswa</label>
                <select
                  id="payStudent"
                  value={payStudentId}
                  onChange={(e) => setPayStudentId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.class})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="payDate" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tanggal Bayar</label>
                  <input
                    type="date"
                    id="payDate"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-xs font-semibold text-neutral-dark"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Total (Otomatis)</label>
                  <div className="w-full px-3 py-2.5 rounded-lg border border-primary-green/10 bg-[#FAF8F5] text-xs font-bold text-primary-green flex items-center justify-center font-mono">
                    Rp {(Number(paySpp || 0) + Number(payLes || 0)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="paySpp" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nominal SPP (Rp)</label>
                  <input
                    type="number"
                    id="paySpp"
                    min="0"
                    value={paySpp}
                    onChange={(e) => setPaySpp(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono font-bold"
                    placeholder="Default 75000"
                  />
                </div>
                <div>
                  <label htmlFor="payLes" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nominal Les (Rp)</label>
                  <input
                    type="number"
                    id="payLes"
                    min="0"
                    value={payLes}
                    onChange={(e) => setPayLes(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono font-bold"
                    placeholder="Default 40000"
                  />
                </div>
              </div>

              {/* Tombol Pintasan Preset Nominal */}
              <div>
                <span className="block text-[8px] text-neutral-gray/60 uppercase mb-1.5 font-bold tracking-wide">Pilih Pintasan Nominal (Hemat Waktu)</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaySpp("75000");
                      setPayLes("40000");
                    }}
                    className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[9px] font-black rounded-xl border-2 border-emerald-200/60 shadow-3xs transition-all active:scale-95 duration-200 cursor-pointer text-center whitespace-nowrap"
                  >
                    SPP + Les (115rb)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaySpp("75000");
                      setPayLes("0");
                    }}
                    className="py-2 px-2.5 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 text-[9px] font-black rounded-xl border-2 border-sky-200/60 shadow-3xs transition-all active:scale-95 duration-200 cursor-pointer text-center whitespace-nowrap"
                  >
                    Hanya SPP (75rb)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaySpp("0");
                      setPayLes("40000");
                    }}
                    className="py-2 px-2.5 bg-fuchsia-50 hover:bg-fuchsia-600 hover:text-white text-fuchsia-700 text-[9px] font-black rounded-xl border-2 border-fuchsia-200/60 shadow-3xs transition-all active:scale-95 duration-200 cursor-pointer text-center whitespace-nowrap"
                  >
                    Hanya Les (40rb)
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="payDesc" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Keterangan / Uraian</label>
                <input
                  type="text"
                  id="payDesc"
                  value={payDesc}
                  onChange={(e) => setPayDesc(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                  placeholder="Contoh: Pembayaran SPP Agustus + Les"
                />
              </div>

              <div>
                <label htmlFor="newDepositStatus" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Status Setoran Uang Fisik</label>
                <select
                  id="newDepositStatus"
                  value={newDepositStatus}
                  onChange={(e) => setNewDepositStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                >
                  <option value="Belum Disetor">Belum Disetor (Kas Pending)</option>
                  <option value="Sudah Disetor">Sudah Disetor (Kas Fisik Riil)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                >
                  Simpan Pembayaran
                </button>
                <button
                  type="button"
                  onClick={() => setShowSppForm(false)}
                  className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit SppTransaction Modal Pop-up */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">Ubah Transaksi Kas SPP & Les</h4>
              <button
                type="button"
                onClick={() => setEditingTx(null)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateSppLesPayment({
                  ...editingTx,
                  total: Number(editingTx.spp) + Number(editingTx.les)
                });
                setEditingTx(null);
              }}
              className="space-y-3.5 text-xs font-semibold text-neutral-dark"
            >
              <div>
                <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Siswa</label>
                <div className="w-full px-3 py-2.5 rounded-lg border border-primary-green/10 bg-[#FAF8F5] text-xs font-bold text-neutral-dark">
                  {students.find(s => s.id === editingTx.studentId)?.name || "Siswa"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tanggal Bayar</label>
                  <input
                    type="date"
                    required
                    value={editingTx.date}
                    onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Total</label>
                  <div className="w-full px-3 py-2.5 rounded-lg border border-primary-green/10 bg-[#FAF8F5] text-xs font-bold text-primary-green flex items-center justify-center font-mono">
                    Rp {(Number(editingTx.spp) + Number(editingTx.les)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nominal SPP (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingTx.spp}
                    onChange={(e) => setEditingTx({ ...editingTx, spp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nominal Les (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingTx.les}
                    onChange={(e) => setEditingTx({ ...editingTx, les: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Status Setoran Uang Fisik</label>
                <select
                  value={editingTx.depositStatus}
                  onChange={(e) => setEditingTx({ ...editingTx, depositStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                >
                  <option value="Belum Disetor">Belum Disetor (Kas Pending)</option>
                  <option value="Sudah Disetor">Sudah Disetor (Kas Fisik Riil)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Keterangan / Uraian</label>
                <input
                  type="text"
                  required
                  value={editingTx.description}
                  onChange={(e) => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                />
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
                  onClick={() => setEditingTx(null)}
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
  );
}
