"use client";

import React, { useState, useMemo } from "react";

const MURAJAAH_PARAMS = {
  suratPendek: ["Al-Fatihah", "Al-Ikhlas", "Al-Falaq", "An-Nas", "Al-Asr", "An-Nasr", "Al-Kafirun", "Al-Kautsar", "Al-Quraisy", "Al-Lahab"],
  doaSehariHari: ["Kedua orang tua", "Keselamatan dunia akhirat", "Sebelum belajar", "Haq dan batil", "Masuk masjid", "Setelah adzan", "Sebelum makan", "Sesudah makan", "Turun hujan", "Bangun tidur", "Adzan/iqamah", "Masuk WC", "Bercermin", "Keluar rumah", "Berkendara"],
  haditsPilihan: ["Niat", "Jangan marah", "Kebersihan", "Masjid rumah kaum mukmin", "Surga di bawah kaki ibu", "Persaudaraan", "Malu", "Menuntut ilmu", "Asmaul Husna (60)"],
  ekskul: ["Drumband", "Angklung", "Calistung"],
  pai: ["Rukun iman", "Rukun islam", "Tarikh (Nabi Muhammad)", "10 Malaikat", "Mufradat (32)", "Hafalan tambahan", "Al-Humazah"],
  sholatDhuha: ["Takbiratul ihram", "Ruku", "Iktidal", "Sujud", "Duduk di antara 2 sujud", "Tahiyatul"]
};

const CATEGORY_TABS = [
  { key: "suratPendek",  label: "Surat Pendek",  icon: "📖" },
  { key: "doaSehariHari", label: "Doa Harian",   icon: "🤲" },
  { key: "haditsPilihan", label: "Hadits",        icon: "📜" },
  { key: "pai",           label: "PAI",           icon: "🕌" },
  { key: "sholatDhuha",   label: "Sholat Dhuha",  icon: "🧎" },
  { key: "ekskul",        label: "Ekskul",        icon: "🎵" },
];

const CAT_LABEL: Record<string, string> = {
  suratPendek: "Surat Pendek", doaSehariHari: "Doa Harian",
  haditsPilihan: "Hadits Pilihan", ekskul: "Ekstrakurikuler",
  pai: "Pendidikan Agama Islam (PAI)", sholatDhuha: "Sholat Dhuha",
};

const SCORE_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  sb: { label: "Sangat Baik", color: "text-emerald-700", bg: "bg-emerald-500", dot: "bg-emerald-500" },
  b:  { label: "Baik",        color: "text-blue-700",    bg: "bg-blue-500",    dot: "bg-blue-500"    },
  c:  { label: "Cukup",       color: "text-amber-700",   bg: "bg-amber-500",   dot: "bg-amber-500"   },
  k:  { label: "Kurang",      color: "text-rose-700",    bg: "bg-rose-500",    dot: "bg-rose-500"    },
  "-":{ label: "Belum",       color: "text-stone-400",   bg: "bg-stone-300",   dot: "bg-stone-300"   },
};

const BADGE: Record<string, string> = {
  sb: "bg-emerald-100 text-emerald-800 border-emerald-200",
  b:  "bg-blue-100 text-blue-800 border-blue-200",
  c:  "bg-amber-100 text-amber-800 border-amber-200",
  k:  "bg-rose-100 text-rose-800 border-rose-200",
  "-":"bg-stone-100 text-stone-500 border-stone-200",
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

  // Progress stats for current student
  const studentScores = useMemo(() => murajaahData[murajaahStudentId] || {}, [murajaahData, murajaahStudentId]);
  const allParams = useMemo(() => Object.values(MURAJAAH_PARAMS).flat(), []);
  const filled = useMemo(() => allParams.filter(p => studentScores[p] && studentScores[p] !== "-").length, [allParams, studentScores]);
  const pct = allParams.length > 0 ? Math.round((filled / allParams.length) * 100) : 0;
  const catParams = MURAJAAH_PARAMS[editingCategory];
  const catFilled = catParams.filter(p => studentScores[p] && studentScores[p] !== "-").length;

  // Score distribution for current student
  const scoreCounts = useMemo(() => {
    const counts: Record<string, number> = { sb: 0, b: 0, c: 0, k: 0, "-": 0 };
    allParams.forEach(p => { const s = studentScores[p] || "-"; counts[s] = (counts[s] || 0) + 1; });
    return counts;
  }, [allParams, studentScores]);

  const handleDownloadPDF = () => {
    if (!currentStudent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let tablesHtml = "";
    Object.keys(MURAJAAH_PARAMS).forEach((catKey) => {
      const params = MURAJAAH_PARAMS[catKey as keyof typeof MURAJAAH_PARAMS];
      let rowsHtml = "";
      params.forEach((param, idx) => {
        const s = studentScores[param] || "-";
        const scoreColor = s === "sb" ? "#15803d" : s === "b" ? "#1d4ed8" : s === "c" ? "#b45309" : s === "k" ? "#be123c" : "#9ca3af";
        rowsHtml += `<tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:5px 8px;text-align:center;color:#6b7280;font-size:10px">${idx + 1}</td>
          <td style="padding:5px 8px;font-size:11px">${param}</td>
          <td style="padding:5px 8px;text-align:center;font-weight:900;font-size:11px;color:${scoreColor}">${s.toUpperCase()}</td>
        </tr>`;
      });
      tablesHtml += `<div style="margin-top:14px;page-break-inside:avoid">
        <h4 style="margin:0 0 5px;font-size:10px;text-transform:uppercase;color:#15803d;border-left:3px solid #15803d;padding-left:6px;letter-spacing:0.5px">${CAT_LABEL[catKey]}</h4>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:#f9fafb">
            <th style="width:8%;text-align:center;padding:5px 8px;font-size:9px;border-bottom:1px solid #e5e7eb">No</th>
            <th style="width:67%;padding:5px 8px;font-size:9px;border-bottom:1px solid #e5e7eb">Materi</th>
            <th style="width:25%;text-align:center;padding:5px 8px;font-size:9px;border-bottom:1px solid #e5e7eb">Predikat</th>
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table></div>`;
    });

    printWindow.document.write(`<html><head><title>Laporan Murajaah - ${currentStudent.name}</title>
      <style>body{font-family:Arial,sans-serif;font-size:11px;margin:28px;color:#1f2937;line-height:1.4}
      .kop{text-align:center;border-bottom:2.5px double #000;padding-bottom:10px;margin-bottom:14px}
      .kop h2{margin:0;font-size:15px;text-transform:uppercase;letter-spacing:0.5px}
      .kop p{margin:2px 0;font-size:9px;color:#555}
      .info td{padding:3px 6px;font-size:10px;border:none}
      .sig td{border:none;text-align:center;width:50%;padding-top:40px}
      @media print{body{margin:1cm;font-size:10px}}</style>
    </head><body>
      <div class="kop"><h2>KB / RA SAHABAT BERBAH SLEMAN</h2>
        <p>Berbah, Sleman, Daerah Istimewa Yogyakarta</p>
        <p>Email: rasahabatberbah@gmail.com</p></div>
      <h3 style="text-align:center;margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px">Laporan Hasil Perkembangan Murajaah Santri</h3>
      <table class="info" style="width:100%;margin-bottom:12px;border-collapse:collapse">
        <tr><td style="font-weight:bold;width:18%">Nama Santri</td><td style="width:32%">: ${currentStudent.name}</td>
            <td style="font-weight:bold;width:18%">Semester</td><td>: ${currentStudent.semester || "Semester 1"}</td></tr>
        <tr><td style="font-weight:bold">NISN</td><td>: ${currentStudent.nisn || "-"}</td>
            <td style="font-weight:bold">Tahun Ajaran</td><td>: ${currentStudent.academicYear || "2026/2027"}</td></tr>
        <tr><td style="font-weight:bold">Kelas</td><td>: ${currentStudent.class} (${currentStudent.fase || "Fase Fondasi"})</td>
            <td style="font-weight:bold">Madrasah</td><td>: ${currentStudent.madrasahName || "RA Sahabat"}</td></tr>
      </table>
      ${tablesHtml}
      <div style="margin-top:12px;font-size:8.5px;font-style:italic;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:6px">
        <strong>Keterangan:</strong> SB = Sangat Baik &nbsp;|&nbsp; B = Baik &nbsp;|&nbsp; C = Cukup &nbsp;|&nbsp; K = Kurang &nbsp;|&nbsp; - = Belum Mulai
      </div>
      <table class="sig" style="width:100%;margin-top:28px;border-collapse:collapse">
        <tr>
          <td style="text-align:center;width:50%;border:none">
            <div>Mengetahui,</div>
            <div style="margin-top:40px;font-weight:bold;text-decoration:underline">Bunda Nisa</div>
            <div style="font-size:9px;color:#555">Kepala Madrasah</div>
          </td>
          <td style="text-align:center;width:50%;border:none">
            <div>Yogyakarta, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
            <div style="margin-top:40px;font-weight:bold;text-decoration:underline">Bunda Rahma</div>
            <div style="font-size:9px;color:#555">Guru Kelas</div>
          </td>
        </tr>
      </table>
      <script>window.onload=function(){window.print()}</script>
    </body></html>`);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">

      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-green/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h3 className="font-baloo text-base font-bold text-neutral-dark">Matriks Murajaah & Tahfidz</h3>
            <p className="text-[11px] text-neutral-gray font-medium mt-0.5">
              Skala nilai: <span className="font-bold text-emerald-600">SB</span> · <span className="font-bold text-blue-600">B</span> · <span className="font-bold text-amber-600">C</span> · <span className="font-bold text-rose-600">K</span> · <span className="font-bold text-stone-400">—</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={!currentStudent}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl border border-amber-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Unduh Laporan PDF
        </button>
      </div>

      {/* ── MAIN LAYOUT — left student picker + right workspace ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">

        {/* LEFT — Student Selector ──────────────────────── */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 bg-white rounded-2xl border border-neutral-gray/8 shadow-sm overflow-hidden">
          <div className="px-4 py-4 border-b border-neutral-gray/8">
            <h4 className="text-xs font-extrabold text-neutral-dark uppercase tracking-wide">Pilih Santri</h4>
            {/* Search */}
            <div className="relative mt-3">
              <svg className="w-3.5 h-3.5 text-neutral-gray/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama santri..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold text-neutral-dark placeholder:text-neutral-gray/35 transition-all"
              />
            </div>
            {/* Class filter pills */}
            <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-0.5">
              {["Semua", ...classes.map((c: any) => c.className)].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setClassFilter(cls)}
                  className={`px-2.5 py-1 rounded-lg text-[9.5px] font-extrabold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                    classFilter === cls
                      ? "bg-primary-green text-white"
                      : "bg-stone-100 text-neutral-gray hover:text-neutral-dark"
                  }`}
                >
                  {cls}
                  <span className={`ml-1 text-[8px] ${classFilter === cls ? "opacity-70" : "opacity-50"}`}>
                    ({cls === "Semua" ? students.length : students.filter(s => s.class === cls).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Student list */}
          <div className="overflow-y-auto max-h-[400px] lg:max-h-[520px]">
            {filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-gray font-medium">Tidak ada santri</div>
            ) : (
              filteredStudents.map((st) => {
                const isActive = String(murajaahStudentId) === String(st.id);
                const stScores = murajaahData[st.id] || {};
                const stFilled = allParams.filter(p => stScores[p] && stScores[p] !== "-").length;
                const stPct = Math.round((stFilled / allParams.length) * 100);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setMurajaahStudentId(st.id)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-neutral-gray/5 transition-all cursor-pointer ${
                      isActive ? "bg-primary-green/8 border-l-[3px] border-l-primary-green" : "hover:bg-stone-50 border-l-[3px] border-l-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      isActive ? "bg-primary-green text-white" : "bg-stone-100 text-neutral-gray"
                    }`}>
                      {st.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? "text-primary-green" : "text-neutral-dark"}`}>{st.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-neutral-gray font-medium">{st.class}</span>
                        <span className="text-neutral-gray/30 text-[8px]">·</span>
                        <span className={`text-[9px] font-bold ${stPct === 100 ? "text-emerald-600" : stPct > 50 ? "text-amber-600" : "text-neutral-gray"}`}>{stPct}%</span>
                      </div>
                      {/* Mini progress */}
                      <div className="w-full h-1 bg-stone-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${stPct === 100 ? "bg-emerald-500" : stPct > 50 ? "bg-amber-400" : "bg-primary-green/50"}`}
                          style={{ width: `${stPct}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT — Workspace ────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Student summary card */}
          {currentStudent && (
            <div className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-green to-primary-dark flex items-center justify-center text-white text-lg font-black flex-shrink-0 shadow-sm">
                    {currentStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-baloo text-base font-bold text-neutral-dark leading-tight">{currentStudent.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[9.5px] font-semibold text-neutral-gray bg-stone-100 px-2 py-0.5 rounded-md">{currentStudent.class}</span>
                      <span className="text-[9.5px] font-semibold text-neutral-gray bg-stone-100 px-2 py-0.5 rounded-md">{currentStudent.semester || "Semester 1"}</span>
                      <span className="text-[9.5px] font-semibold text-neutral-gray bg-stone-100 px-2 py-0.5 rounded-md">{currentStudent.academicYear || "2026/2027"}</span>
                    </div>
                  </div>
                </div>
                {/* Overall progress ring */}
                <div className="flex-shrink-0 text-center">
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="#f5f5f4" strokeWidth="5" />
                      <circle cx="28" cy="28" r="22" fill="none"
                        stroke={pct === 100 ? "#16a34a" : pct > 50 ? "#f59e0b" : "#22c55e"}
                        strokeWidth="5"
                        strokeDasharray={`${2 * Math.PI * 22}`}
                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[11px] font-black text-neutral-dark leading-none">{pct}%</span>
                    </div>
                  </div>
                  <p className="text-[8.5px] text-neutral-gray font-semibold mt-1">Selesai</p>
                </div>
              </div>

              {/* Score distribution pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {Object.entries(SCORE_CONFIG).map(([score, cfg]) => (
                  <div key={score} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-bold ${BADGE[score]}`}>
                    <span>{score.toUpperCase()}</span>
                    <span className="font-black">{scoreCounts[score] || 0}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-gray/10 bg-stone-50 text-[9px] font-bold text-neutral-gray">
                  <span>Total</span>
                  <span className="font-black text-neutral-dark">{allParams.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab bar: Input / Summary */}
          <div className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm overflow-hidden">
            {/* Tabs header */}
            <div className="flex border-b border-neutral-gray/8">
              {[
                { key: "input", label: "Berikan Nilai", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
                { key: "summary", label: "Lihat Rekapan", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveWorkTab(tab.key as "input" | "summary")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                    activeWorkTab === tab.key
                      ? "border-primary-green text-primary-green bg-primary-green/4"
                      : "border-transparent text-neutral-gray hover:text-neutral-dark hover:bg-stone-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category tabs — only shown in input mode */}
            {activeWorkTab === "input" && (
              <div className="px-5 pt-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {CATEGORY_TABS.map((tab) => {
                    const params = MURAJAAH_PARAMS[tab.key as keyof typeof MURAJAAH_PARAMS];
                    const done = params.filter(p => studentScores[p] && studentScores[p] !== "-").length;
                    const isActive = editingCategory === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setEditingCategory(tab.key as any)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all cursor-pointer flex-shrink-0 ${
                          isActive
                            ? "bg-primary-green text-white border-primary-green shadow-sm"
                            : "bg-stone-50 text-neutral-gray border-neutral-gray/12 hover:border-primary-green/30 hover:text-neutral-dark"
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-stone-200 text-neutral-gray"}`}>
                          {done}/{params.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Category progress bar */}
                <div className="mt-3 mb-1">
                  <div className="flex justify-between text-[9px] font-semibold text-neutral-gray mb-1">
                    <span className="capitalize">{CAT_LABEL[editingCategory]}</span>
                    <span>{catFilled}/{catParams.length} selesai</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-green rounded-full transition-all duration-500"
                      style={{ width: catParams.length > 0 ? `${(catFilled / catParams.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Content area */}
            <div className="p-5">
              {activeWorkTab === "input" ? (
                (isAdminAdministrasi || isGuru) ? (
                  <div className="space-y-2.5">
                    {catParams.map((param, idx) => {
                      const currentVal = studentScores[param] || "-";
                      const cfg = SCORE_CONFIG[currentVal];
                      return (
                        <div key={param} className="flex items-center gap-3 p-3.5 bg-stone-50 hover:bg-stone-100/70 rounded-xl border border-neutral-gray/6 transition-colors group">
                          {/* Row number */}
                          <span className="text-[9px] font-black text-neutral-gray/40 w-4 text-center flex-shrink-0">{idx + 1}</span>
                          {/* Param name */}
                          <span className="flex-1 text-[11.5px] font-semibold text-neutral-dark leading-snug">{param}</span>
                          {/* Score buttons */}
                          <div className="flex gap-1.5 flex-shrink-0">
                            {["sb", "b", "c", "k", "-"].map((score) => {
                              const isSelected = currentVal === score;
                              const sc = SCORE_CONFIG[score];
                              return (
                                <button
                                  key={score}
                                  type="button"
                                  onClick={() => onUpdateMurajaah(murajaahStudentId, param, score)}
                                  title={sc.label}
                                  className={`w-8 h-8 rounded-lg text-[9.5px] font-black uppercase flex items-center justify-center transition-all cursor-pointer ${
                                    isSelected
                                      ? `${sc.bg} text-white shadow-sm scale-110`
                                      : "bg-white border border-neutral-gray/15 text-neutral-gray/50 hover:border-neutral-gray/30 hover:text-neutral-gray"
                                  }`}
                                >
                                  {score}
                                </button>
                              );
                            })}
                          </div>
                          {/* Current badge */}
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                            <span className="text-[7px] font-black text-white uppercase">{currentVal}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-neutral-dark">Akses Terbatas</p>
                    <p className="text-xs text-neutral-gray font-medium mt-1 max-w-xs">Akun Anda tidak memiliki hak mengubah nilai Murajaah. Buka tab <strong>Lihat Rekapan</strong> untuk memantau.</p>
                    <button type="button" onClick={() => setActiveWorkTab("summary")}
                      className="mt-4 px-4 py-2 bg-primary-green text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-primary-dark transition-all">
                      Lihat Rekapan
                    </button>
                  </div>
                )
              ) : (
                /* Summary view */
                <div className="space-y-4">
                  {Object.keys(MURAJAAH_PARAMS).map((catKey) => {
                    const params = MURAJAAH_PARAMS[catKey as keyof typeof MURAJAAH_PARAMS];
                    const done = params.filter(p => studentScores[p] && studentScores[p] !== "-").length;
                    const catPct = Math.round((done / params.length) * 100);
                    return (
                      <div key={catKey} className="rounded-xl border border-neutral-gray/8 overflow-hidden">
                        {/* Category header */}
                        <div className="px-4 py-3 bg-stone-50 border-b border-neutral-gray/6 flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-neutral-dark uppercase tracking-wide">{CAT_LABEL[catKey]}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${catPct === 100 ? "bg-emerald-500" : "bg-primary-green"}`} style={{ width: `${catPct}%` }} />
                            </div>
                            <span className="text-[9px] font-bold text-neutral-gray">{done}/{params.length}</span>
                          </div>
                        </div>
                        {/* Items grid */}
                        <div className="divide-y divide-neutral-gray/5">
                          {params.map((p, idx) => {
                            const score = studentScores[p] || "-";
                            return (
                              <div key={p} className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-[8.5px] text-neutral-gray/40 font-bold w-4 text-center flex-shrink-0">{idx + 1}</span>
                                  <span className="text-[11px] font-semibold text-neutral-dark truncate">{p}</span>
                                </div>
                                <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-md border flex-shrink-0 uppercase ${BADGE[score]}`}>
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
        </div>
      </div>
    </div>
  );
}
