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
}

interface SppTabProps {
  students: Student[];
  sppTransactions: SppTransaction[];
  isAdminTransaksi: boolean;
  onAddSppLesPayment: (newTx: Omit<SppTransaction, "id" | "total">) => void;
}

export default function SppTab({
  students,
  sppTransactions,
  isAdminTransaksi,
  onAddSppLesPayment,
}: SppTabProps) {
  const [showSppForm, setShowSppForm] = useState(false);
  const [payStudentId, setPayStudentId] = useState<number>(students[0]?.id || 1);
  const [payDate, setPayDate] = useState(new Date().toISOString().substring(0, 10));
  const [paySpp, setPaySpp] = useState("75000");
  const [payLes, setPayLes] = useState("40000");
  const [payDesc, setPayDesc] = useState("Pembayaran SPP + Les");

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
    });

    // Reset Form to defaults
    setPaySpp("75000");
    setPayLes("40000");
    setShowSppForm(false);
  };

  return (
    <div className="w-full space-y-6">
      
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

          {/* Tampilan Desktop/Tablet: Tabel Buku Kas */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-gray/10">
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
                  const student = students.find((s) => s.id === tx.studentId);
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

          {/* Tampilan Mobile: Card List (Ditampilkan di Layar Kecil) */}
          <div className="block sm:hidden space-y-4">
            {sppTransactions.map((tx) => {
              const student = students.find((s) => s.id === tx.studentId);
              return (
                <div key={tx.id} className="bg-[#FAF8F5] p-4 rounded-2xl border border-primary-green/10 shadow-3xs space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-2 gap-2">
                    <span className="text-[10px] text-neutral-gray font-mono font-bold flex-shrink-0">{tx.date}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 bg-primary-green/15 text-primary-green rounded-full border border-primary-green/20">
                      {student ? student.class : "N/A"}
                    </span>
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
                      <span className="text-emerald-600 font-mono mt-0.5">Rp {tx.spp.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-neutral-gray/5 flex flex-col justify-center">
                      <span className="block text-[8px] text-neutral-gray/60 uppercase">Les</span>
                      <span className="text-emerald-600 font-mono mt-0.5">Rp {tx.les.toLocaleString()}</span>
                    </div>
                    <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex flex-col justify-center">
                      <span className="block text-[8px] text-primary-green uppercase">Total</span>
                      <span className="text-primary-green font-mono font-black mt-0.5">Rp {tx.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Input Pembayaran SPP & Les Pop-up Modal */}
      {showSppForm && isAdminTransaksi && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in">
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
    </div>
  );
}
