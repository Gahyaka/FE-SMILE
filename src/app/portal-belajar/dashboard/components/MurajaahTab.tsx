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

  return (
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
                          onClick={() => onUpdateMurajaah(murajaahStudentId, param, score)}
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
            Lembar Ringkasan Murajaah: <span className="text-primary-green">{students.find((s) => s.id === murajaahStudentId)?.name || "Santri"}</span>
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
  );
}
