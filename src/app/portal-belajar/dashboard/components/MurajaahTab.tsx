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
  id: string | number;
  name: string;
  class: string;
  nisn: string;
  academicYear: string;
  semester: string;
  fase: string;
  madrasahName: string;
}

interface MurajaahTabProps {
  students: Student[];
  classes: any[];
  murajaahData: { [studentId: string]: { [param: string]: string } };
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  onUpdateMurajaah: (studentId: string | number, param: string, score: string) => void;
}

export default function MurajaahTab({
  students,
  classes = [],
  murajaahData,
  isAdminAdministrasi,
  isGuru,
  onUpdateMurajaah,
}: MurajaahTabProps) {
  const [murajaahStudentId, setMurajaahStudentId] = useState<string | number>(students[0]?.id || "");
  const [editingCategory, setEditingCategory] = useState<keyof typeof MURAJAAH_PARAMS>("suratPendek");
  const [classFilter, setClassFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkTab, setActiveWorkTab] = useState<"input" | "summary">("input");

  const currentStudent = students.find(s => String(s.id) === String(murajaahStudentId));

  const filteredStudents = students.filter((st) => {
    const matchesClass = classFilter === "Semua" || st.class === classFilter;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleDownloadPDF = () => {
    if (!currentStudent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const studentScores = murajaahData[currentStudent.id] || {};

    let tablesHtml = "";

    Object.keys(MURAJAAH_PARAMS).forEach((catKey) => {
      const catLabel = catKey === "suratPendek" ? "Surat Pendek" :
                       catKey === "doaSehariHari" ? "Doa Harian" :
                       catKey === "haditsPilihan" ? "Hadits Pilihan" :
                       catKey === "ekskul" ? "Ekstrakurikuler" :
                       catKey === "pai" ? "Pendidikan Agama Islam (PAI)" : "Sholat Dhuha";

      const params = MURAJAAH_PARAMS[catKey as keyof typeof MURAJAAH_PARAMS];
      let rowsHtml = "";

      params.forEach((param, idx) => {
        const rawScore = studentScores[param] || "-";
        const scoreLabel = rawScore.toUpperCase();

        rowsHtml += `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 5px 8px; text-align: center; width: 10%;">${idx + 1}</td>
            <td style="padding: 5px 8px; width: 65%;">${param}</td>
            <td style="padding: 5px 8px; text-align: center; font-weight: bold; width: 25%;">${scoreLabel}</td>
          </tr>
        `;
      });

      tablesHtml += `
        <div style="margin-top: 15px; page-break-inside: avoid;">
          <h4 style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #15803d; border-left: 3px solid #15803d; padding-left: 6px;">
            ${catLabel}
          </h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;">
            <thead>
              <tr style="background-color: #FAF8F5;">
                <th style="width: 10%; text-align: center; padding: 6px 8px; font-size: 10px;">No</th>
                <th style="width: 65%; padding: 6px 8px; font-size: 10px;">Materi Hafalan</th>
                <th style="width: 25%; text-align: center; padding: 6px 8px; font-size: 10px;">Predikat</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    });

    const docHtml = `
      <html>
        <head>
          <title>Laporan Murajaah - ${currentStudent.name}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 11px; margin: 30px; color: #333; line-height: 1.3; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
            th { font-weight: bold; }
            .header-table td { border: none; padding: 3px 0; }
            .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 15px; }
            .kop h2 { margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
            .kop p { margin: 2px 0; font-size: 10px; }
            .sig-table { width: 100%; margin-top: 30px; page-break-inside: avoid; }
            .sig-table td { border: none; text-align: center; width: 50%; }
            @media print {
              body { margin: 1cm; font-size: 10px; }
              th, td { padding: 4px 6px; }
              .kop h2 { font-size: 14px; }
              .sig-table { margin-top: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="kop">
            <h2>KB / RA SAHABAT BERBAH SLEMAN</h2>
            <p>Alamat: Berbah, Sleman, Daerah Istimewa Yogyakarta</p>
            <p>Email: rasahabatberbah@gmail.com | Telp: (0274) 1234567</p>
          </div>

          <h3 style="text-align: center; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Laporan Hasil Perkembangan Murajaah Santri</h3>

          <table class="header-table" style="width: 100%; margin-bottom: 10px;">
            <tr>
              <td style="width: 15%; font-weight: bold;">Nama Santri</td>
              <td style="width: 35%;">: ${currentStudent.name}</td>
              <td style="width: 15%; font-weight: bold;">Semester</td>
              <td style="width: 35%;">: ${currentStudent.semester || "Semester 1"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">NISN</td>
              <td>: ${currentStudent.nisn || "-"}</td>
              <td style="font-weight: bold;">Tahun Ajaran</td>
              <td>: ${currentStudent.academicYear || "2026/2027"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Kelas (Fase)</td>
              <td>: ${currentStudent.class} (${currentStudent.fase || "Fase Fondasi"})</td>
              <td style="font-weight: bold;">Madrasah</td>
              <td>: ${currentStudent.madrasahName || "RA Sahabat Berbah Sleman"}</td>
            </tr>
          </table>

          <div style="display: grid; grid-template-cols: 1fr; gap: 10px;">
            ${tablesHtml}
          </div>

          <div style="margin-top: 15px; font-size: 9px; font-style: italic; color: #555; page-break-inside: avoid;">
            <strong>Keterangan Predikat Nilai:</strong> SB = Sangat Baik | B = Baik | C = Cukup | K = Kurang | - = Belum Mulai
          </div>

          <table class="sig-table">
            <tr>
              <td>
                <p>Mengetahui,</p>
                <p style="margin-top: 45px; font-weight: bold; text-decoration: underline;">Bunda Nisa</p>
                <p style="margin-top: 2px; font-size: 9px; color: #555;">Kepala Madrasah</p>
              </td>
              <td>
                <p>Yogyakarta, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p style="margin-top: 45px; font-weight: bold; text-decoration: underline;">Bunda Rahma</p>
                <p style="margin-top: 2px; font-size: 9px; color: #555;">Guru Kelas</p>
              </td>
            </tr>
          </table>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(docHtml);
    printWindow.document.close();
  };


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

        {/* Filter Kategori Kelas — Scrollable on mobile */}
        <div className="flex items-center gap-1 bg-stone-100/70 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            type="button"
            onClick={() => setClassFilter("Semua")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
              classFilter === "Semua"
                ? "bg-primary-green text-white shadow-xs"
                : "text-neutral-gray hover:text-neutral-dark"
            }`}
          >
            Semua <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-black ${classFilter === "Semua" ? "bg-white/20 text-white" : "bg-neutral-gray/10 text-neutral-gray"}`}>{students.length}</span>
          </button>
          {classes.map((c: any) => {
            const isActive = classFilter === c.className;
            const classCount = students.filter((s) => s.class === c.className).length;
            return (
              <button
                key={c.id || c.className}
                type="button"
                onClick={() => setClassFilter(c.className)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary-green text-white shadow-xs"
                    : "text-neutral-gray hover:text-neutral-dark"
                }`}
              >
                {c.className} <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-black ${isActive ? "bg-white/20 text-white" : "bg-neutral-gray/10 text-neutral-gray"}`}>{classCount}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Select for Student - Only visible on small screens */}
        <div className="block sm:hidden">
          <label htmlFor="studentSelect" className="block text-[9px] font-extrabold uppercase text-neutral-gray mb-1.5">Pilih Santri (Mobile Dropdown)</label>
          <select
            id="studentSelect"
            value={murajaahStudentId}
            onChange={(e) => setMurajaahStudentId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-primary-green/15 text-xs font-semibold bg-[#FAF8F5] text-neutral-dark focus:outline-none"
          >
            {filteredStudents.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.class})
              </option>
            ))}
            {filteredStudents.length === 0 && <option value="">Tidak ada murid</option>}
          </select>
        </div>

        {/* Search input — lebar penuh */}
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

        {/* Tabel Murid Bergulir — Hidden on mobile to save vertical space */}
        <div className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-gray/10 max-h-[200px] overflow-y-auto pr-1">
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

      {/* 2. Pilih Kategori Penilaian Panel — Scrollable on mobile */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs space-y-3">
        <h4 className="font-baloo text-base font-bold text-neutral-dark">2. Pilih Kategori Penilaian</h4>
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-none gap-2 py-1">
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
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer inline-block ${
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

      <div className="bg-white p-6 rounded-2xl border border-primary-green/10 shadow-3xs space-y-6">
        <div className="flex flex-col gap-4 border-b border-neutral-gray/10 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3">
            <h4 className="font-baloo text-base font-bold text-neutral-dark flex flex-wrap items-center gap-1.5">
              <span>3. Lembar Kerja Murajaah:</span>
              <span className="text-primary-green underline decoration-2">{students.find(s => s.id === murajaahStudentId)?.name || "Santri"}</span>
            </h4>
            
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold text-[10px] uppercase rounded-xl border border-amber-200 transition-all cursor-pointer shadow-3xs"
              title="Unduh Laporan Lengkap (PDF)"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Unduh Laporan PDF</span>
            </button>
          </div>
          
          {/* Work tab toggler — Melebar penuh di mobile */}
          <div className="flex bg-[#FAF8F5] border border-primary-green/10 rounded-xl p-0.5 text-[10px] font-extrabold text-neutral-gray w-full sm:w-fit">
            <button
              type="button"
              onClick={() => setActiveWorkTab("input")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                activeWorkTab === "input" ? "bg-primary-green text-white shadow-3xs" : "hover:text-neutral-dark"
              }`}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Berikan Nilai</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkTab("summary")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                activeWorkTab === "summary" ? "bg-primary-green text-white shadow-3xs" : "hover:text-neutral-dark"
              }`}
            >
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Lihat Rekapan</span>
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
                    <div key={param} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#FAF8F5] rounded-xl border border-neutral-gray/5 gap-2.5">
                      <span className="text-[11px] font-bold text-neutral-dark leading-normal break-words">{param}</span>
                      
                      <div className="flex justify-between sm:justify-start gap-1 flex-shrink-0 w-full sm:w-auto">
                        {["sb", "b", "c", "k", "-"].map((score) => (
                          <button
                            key={score}
                            onClick={() => onUpdateMurajaah(murajaahStudentId, param, score)}
                            className={`w-8 h-8 sm:w-6.5 sm:h-6.5 rounded-full text-[10px] sm:text-[9px] font-black uppercase flex items-center justify-center border transition-all cursor-pointer ${
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
