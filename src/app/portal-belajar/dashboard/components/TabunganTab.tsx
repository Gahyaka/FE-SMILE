"use client";

import React, { useState } from "react";

interface Student {
  id: number;
  name: string;
  class: string;
}

interface SavingTransaction {
  id: number;
  studentId: number;
  date: string;
  description: string;
  debet: number;
  kredit: number;
  admin: string;
}

interface TabunganTabProps {
  students: Student[];
  savings: SavingTransaction[];
  isAdminTransaksi: boolean;
  adminName: string;
  onAddTransaction: (newTrans: Omit<SavingTransaction, "id" | "date" | "admin"> & { transType: "Setoran" | "Penarikan", amountNum: number }) => boolean;
}

export default function TabunganTab({
  students,
  savings,
  isAdminTransaksi,
  adminName,
  onAddTransaction,
}: TabunganTabProps) {
  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState<number>(students[0]?.id || 1);
  const [transDesc, setTransDesc] = useState("Setoran rutin");
  const [transType, setTransType] = useState<"Setoran" | "Penarikan">("Setoran");
  const [transAmount, setTransAmount] = useState("");
  const [savingFilterStudentId, setSavingFilterStudentId] = useState<number>(students[0]?.id || 1);

  // Helper: Calculate total saldo for a student dynamically (Debet - Kredit)
  const getStudentSaldo = (studentId: number) => {
    const studentTrans = savings.filter((t) => t.studentId === studentId);
    return studentTrans.reduce((total, trans) => {
      return total + trans.debet - trans.kredit;
    }, 0);
  };

  // Helper: Get chronological savings list with running balance
  const getStudentTabunganRows = (studentId: number) => {
    const studentTrans = [...savings].filter((t) => t.studentId === studentId).reverse(); // Oldest first for calculation
    let runningSaldo = 0;
    const mapped = studentTrans.map((t) => {
      runningSaldo = runningSaldo + t.debet - t.kredit;
      return { ...t, saldo: runningSaldo };
    });
    return mapped.reverse(); // Newest first for visual list
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transAmount || isNaN(Number(transAmount)) || Number(transAmount) <= 0) return;

    const amountNum = Number(transAmount);

    // Call callback to parent
    const success = onAddTransaction({
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
    }
  };

  return (
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="selectedStudent" className="block text-[10px] font-extrabold text-neutral-gray uppercase tracking-wide mb-1">Pilih Siswa</label>
              <select
                id="selectedStudent"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white cursor-pointer"
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
                  className="w-full px-3 py-2 rounded-lg border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold bg-white cursor-pointer"
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
  );
}
