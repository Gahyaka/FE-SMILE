"use client";

import React, { useState } from "react";

const MURAJAAH_PARAMS = {
  suratPendek: ["Al-Fatihah", "Al-Ikhlas", "Al-Falaq", "An-Nas", "Al-Asr", "An-Nasr", "Al-Kafirun", "Al-Kautsar", "Al-Quraisy", "Al-Lahab"],
  doaSehariHari: ["Kedua orang tua", "Keselamatan dunia akhirat", "Sebelum belajar", "Haq dan batil", "Masuk masjid", "Setelah adzan", "Sebelum makan", "Sesudah makan", "Turun hujan", "Bangun tidur", "Adzan/iqamah", "Masuk WC", "Bercermin", "Keluar rumah", "Berkendara"],
  haditsPilihan: ["Niat", "Jangan marah", "Kebersihan", "Masjid rumah kaum mukmin", "Surga di bawah kaki ibu", "Persaudaraan", "Malu", "Menuntut ilmu", "Asmaul Husna (60)"],
  ekskul: ["Drumband", "Angklung", "Calistung"],
  pai: ["Rukun iman", "Rukun islam", "Tarikh (Nabi Muhammad)", "10 Malaikat", "Mufradat (32)", "Hafalan tambahan", "Al-Humazah"],
  sholatDhuha: ["Takbiratul ihram", "Ruku", "Iktidal", "Sujud", "Duduk di antara 2 sujud", "Tahiyatul"]
};

interface Student {
  id: number;
  name: string;
  class: string;
}

interface MurajaahTabProps {
  students: Student[];
  murajaahData: { [studentId: number]: { [param: string]: string } };
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  onUpdateMurajaah: (studentId: number, param: string, score: string) => void;
}

export default function MurajaahTab({
  students,
  murajaahData,
  isAdminAdministrasi,
  isGuru,
  onUpdateMurajaah,
}: MurajaahTabProps) {
  const [murajaahStudentId, setMurajaahStudentId] = useState<number>(students[0]?.id || 1);
  const [editingCategory, setEditingCategory] = useState<keyof typeof MURAJAAH_PARAMS>("suratPendek");
  const [classFilter, setClassFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkTab, setActiveWorkTab] = useState<"input" | "summary">("input");

  const filteredStudents = students.filter((st) => {
    const matchesClass = classFilter === "Semua" || st.class === classFilter;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Description Bar */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs">
        <h3 className="font-baloo text-lg font-bold text-neutral-dark">Matriks Penilaian Murajaah & Tahfidz</h3>
        <p className="text-[11px] text-neutral-gray font-semibold mt-1">
          Pencatatan hafalan santri terpadu. Skala nilai: <strong>sb</strong> (sangat baik), <strong>b</strong> (baik), <strong>c</strong> (cukup), <strong>k</strong> (kurang), <strong>-</strong> (belum mulai).
        </p>
      </div>

      {/* 1. Pilih Santri Panel */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-gray/10 pb-4">
          <h4 className="font-baloo text-base font-bold text-neutral-dark">1. Pilih Santri</h4>
        </div>

        {/* Filter Kategori Kelas — sama persis dengan TabunganTab */}
        <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F5] p-3 rounded-2xl border border-primary-green/10">
          <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Kategori Kelas:</span>
          {["Semua", "KB", "RA (A)", "RA (B)"].map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => setClassFilter(cls)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                classFilter === cls
                  ? "bg-primary-green text-white border-primary-green shadow-3xs"
                  : "bg-white text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Search input — lebar penuh, sama persis dengan TabunganTab */}
        <div className="relative">
          <svg className="w-3.5 h-3.5 text-neutral-gray absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama murid..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
          />
        </div>

        {/* Tabel Murid Bergulir — sama persis dengan TabunganTab */}
        <div className="overflow-x-auto rounded-xl border border-neutral-gray/10 max-h-[200px] overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[10px] font-extrabold uppercase text-neutral-gray border-b border-neutral-gray/10 sticky top-0 z-10">
                <th className="py-2.5 px-4">Nama Santri</th>
                <th className="py-2.5 px-4 w-[30%]">Kelas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-gray/5 font-semibold text-neutral-dark">
              {filteredStudents.map((st) => {
                const isActive = murajaahStudentId === st.id;
                return (
                  <tr
                    key={st.id}
                    onClick={() => setMurajaahStudentId(st.id)}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? "bg-primary-green/10 text-primary-green font-black"
                        : "hover:bg-soft-mint/30"
                    }`}
                  >
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary-green" : "bg-neutral-gray/30"}`} />
                      <span>{st.name}</span>
                    </td>
                    <td className="py-2.5 px-4 text-neutral-gray">{st.class}</td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-neutral-gray italic">Tidak ada murid yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 2. Pilih Kategori Penilaian Panel */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-3">
        <h4 className="font-baloo text-base font-bold text-neutral-dark">2. Pilih Kategori Penilaian</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "suratPendek", label: "Surat Pendek" },
            { key: "doaSehariHari", label: "Doa Harian" },
            { key: "haditsPilihan", label: "Hadits Pilihan" },
            { key: "pai", label: "PAI (Rukun Iman/Islam)" },
            { key: "sholatDhuha", label: "Sholat Dhuha" },
            { key: "ekskul", label: "Ekstrakurikuler" }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setEditingCategory(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
                editingCategory === tab.key
                  ? "bg-primary-green text-white border-primary-green shadow-3xs"
                  : "bg-[#FAF8F5] text-neutral-gray border-neutral-gray/10 hover:text-neutral-dark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Lembar Kerja Murajaah Panel */}
      <div className="bg-white p-6 rounded-2xl border border-primary-green/10 shadow-3xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-gray/10 pb-3.5">
          <h4 className="font-baloo text-base font-bold text-neutral-dark flex items-center gap-2 flex-wrap">
            <span>3. Lembar Kerja Murajaah:</span>
            <span className="text-primary-green font-black underline">{students.find(s => s.id === murajaahStudentId)?.name || "Santri"}</span>
          </h4>

          {/* Work tab toggler */}
          <div className="flex bg-[#FAF8F5] border border-primary-green/10 rounded-lg p-0.5 text-[10px] font-extrabold text-neutral-gray">
            <button
              type="button"
              onClick={() => setActiveWorkTab("input")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer transition-colors ${
                activeWorkTab === "input" ? "bg-primary-green text-white" : "hover:text-neutral-dark"
              }`}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Berikan Nilai
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkTab("summary")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded cursor-pointer transition-colors ${
                activeWorkTab === "summary" ? "bg-primary-green text-white" : "hover:text-neutral-dark"
              }`}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Lihat Rekapan
            </button>
          </div>
        </div>

        {activeWorkTab === "input" ? (
          // Input Nilai Matrix
          (isAdminAdministrasi || isGuru) ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {MURAJAAH_PARAMS[editingCategory].map((param) => {
                  const currentVal = (murajaahData[murajaahStudentId] && murajaahData[murajaahStudentId][param]) || "-";
                  return (
                    <div key={param} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-neutral-gray/5 gap-3">
                      <span className="text-[11px] font-bold text-neutral-dark flex-1 leading-normal break-words">{param}</span>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        {["sb", "b", "c", "k", "-"].map((score) => (
                          <button
                            key={score}
                            onClick={() => onUpdateMurajaah(murajaahStudentId, param, score)}
                            className={`w-6.5 h-6.5 rounded-full text-[9px] font-black uppercase flex items-center justify-center border transition-all cursor-pointer ${
                              currentVal === score
                                ? "bg-primary-green text-white border-primary-green"
                                : "bg-white text-neutral-gray border-neutral-gray/20 hover:bg-neutral-gray/5"
                            }`}
                            title={
                              score === "sb" ? "Sangat Baik" :
                              score === "b" ? "Baik" :
                              score === "c" ? "Cukup" :
                              score === "k" ? "Kurang" : "Belum Mulai"
                            }
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
            <div className="bg-stone-50 p-6 rounded-2xl border border-neutral-gray/10 text-center flex flex-col items-center gap-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                Akun Anda (Admin Transaksi) tidak memiliki hak akses mengubah Laporan Murajaah. Silakan klik tab &quot;Lihat Rekapan&quot; untuk memantau data.
              </p>
            </div>
          )
        ) : (
          // Live Summary Preview
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-1">
            {Object.keys(MURAJAAH_PARAMS).map((catKey) => {
              const params = MURAJAAH_PARAMS[catKey as keyof typeof MURAJAAH_PARAMS];
              return (
                <div key={catKey} className="p-3 bg-[#FAF8F5] rounded-xl border border-neutral-gray/5 space-y-2">
                  <span className="text-[9px] font-black text-neutral-gray uppercase tracking-wider block border-b border-neutral-gray/10 pb-1.5 capitalize">
                    {catKey.replace(/([A-Z])/g, ' $1')}
                  </span>
                  
                  <div className="space-y-1.5">
                    {params.map((p) => {
                      const score = (murajaahData[murajaahStudentId] && murajaahData[murajaahStudentId][p]) || "-";
                      return (
                        <div key={p} className="flex justify-between items-center text-[10px] font-semibold text-neutral-dark gap-3 leading-normal">
                          <span className="flex-1 break-words">{p}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase flex-shrink-0 ${
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
        )}
      </div>

    </div>
  );
}
