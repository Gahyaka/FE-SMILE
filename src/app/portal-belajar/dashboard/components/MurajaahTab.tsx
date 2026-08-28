"use client";

import React, { useState, useMemo, useEffect } from "react";

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

// Hardcoded fallback data in case database categories are empty or failed to load
const FALLBACK_PARAMS = {
  suratPendek: ["Al-Fatihah", "Al-Ikhlas", "Al-Falaq", "An-Nas", "Al-Asr", "An-Nasr", "Al-Kafirun", "Al-Kautsar", "Al-Quraisy", "Al-Lahab"],
  doaSehariHari: ["Kedua orang tua", "Keselamatan dunia akhirat", "Sebelum belajar", "Haq dan batil", "Masuk masjid", "Setelah adzan", "Sebelum makan", "Sesudah makan", "Turun hujan", "Bangun tidur", "Adzan/iqamah", "Masuk WC", "Bercermin", "Keluar rumah", "Berkendara"],
  haditsPilihan: ["Niat", "Jangan marah", "Kebersihan", "Masjid rumah kaum mukmin", "Surga di bawah kaki ibu", "Persaudaraan", "Malu", "Menuntut ilmu", "Asmaul Husna (60)"],
  ekskul: ["Drumband", "Angklung", "Calistung"],
  pai: ["Rukun iman", "Rukun islam", "Tarikh (Nabi Muhammad)", "10 Malaikat", "Mufradat (32)", "Hafalan tambahan", "Al-Humazah"],
  sholatDhuha: ["Takbiratul ihram", "Ruku", "Iktidal", "Sujud", "Duduk di antara 2 sujud", "Tahiyatul"]
};

const FALLBACK_CATEGORY_TABS = [
  { key: "suratPendek",  label: "Surat Pendek",  icon: "surat" },
  { key: "doaSehariHari", label: "Doa Harian",   icon: "doa" },
  { key: "haditsPilihan", label: "Hadits",        icon: "hadits" },
  { key: "pai",           label: "PAI",           icon: "pai" },
  { key: "sholatDhuha",   label: "Sholat Dhuha",  icon: "sholat" },
  { key: "ekskul",        label: "Ekskul",        icon: "ekskul" },
];

function getCategorySvg(iconKey: string, className = "w-3.5 h-3.5") {
  switch (iconKey) {
    case "doa":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "hadits":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "pai":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "sholat":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "ekskul":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    case "surat":
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
  }
}

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
  murojaahCategories?: any[];
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  onUpdateMurajaah: (studentId: string | number, param: string, score: string) => void;
}

export default function MurajaahTab({
  students,
  classes = [],
  murajaahData,
  murojaahCategories = [],
  isAdminAdministrasi,
  isGuru,
  onUpdateMurajaah,
}: MurajaahTabProps) {
  const [murajaahStudentId, setMurajaahStudentId] = useState<string | number>(students[0]?.id || "");
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [classFilter, setClassFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkTab, setActiveWorkTab] = useState<"input" | "summary">("input");

  // Mouse-dragging & smooth scrolling controls for category tabs
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 180;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const currentStudent = students.find(s => String(s.id) === String(murajaahStudentId));

  const filteredStudents = students.filter((st) => {
    const matchesClass = classFilter === "Semua" || st.class === classFilter;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Reconstruct categories dynamically from backend murojaahCategories
  const categoriesList = useMemo(() => {
    if (!murojaahCategories || murojaahCategories.length === 0) {
      return FALLBACK_CATEGORY_TABS.map(tab => {
        const key = tab.key as keyof typeof FALLBACK_PARAMS;
        return {
          id: tab.key,
          nama: tab.label,
          icon: tab.icon,
          materi: FALLBACK_PARAMS[key] || []
        };
      });
    }

    return murojaahCategories.map(cat => {
      const nameLower = cat.nama.toLowerCase();
      let icon = "surat";
      if (nameLower.includes("doa")) icon = "doa";
      else if (nameLower.includes("hadits") || nameLower.includes("hadist")) icon = "hadits";
      else if (nameLower.includes("pai") || nameLower.includes("agama")) icon = "pai";
      else if (nameLower.includes("sholat") || nameLower.includes("shalat") || nameLower.includes("dhuha")) icon = "sholat";
      else if (nameLower.includes("ekskul") || nameLower.includes("musik") || nameLower.includes("seni") || nameLower.includes("olahraga")) icon = "ekskul";

      const materiList = cat.materi || cat.materis || [];
      return {
        id: String(cat.id),
        nama: cat.nama,
        icon: icon,
        materi: materiList.map((m: any) => m.nama || m.namaMateri || "")
      };
    });
  }, [murojaahCategories]);

  // Set default selected category once categoriesList is loaded
  useEffect(() => {
    if (categoriesList.length > 0 && (!editingCategory || !categoriesList.some(c => c.id === editingCategory))) {
      setEditingCategory(categoriesList[0].id);
    }
  }, [categoriesList, editingCategory]);

  const activeCategoryObj = useMemo(() => {
    return categoriesList.find(c => c.id === editingCategory) || categoriesList[0];
  }, [categoriesList, editingCategory]);

  const studentScores = useMemo(() => murajaahData[murajaahStudentId] || {}, [murajaahData, murajaahStudentId]);
  const allParams = useMemo(() => categoriesList.flatMap(c => c.materi), [categoriesList]);
  const filled = useMemo(() => allParams.filter((p: string) => studentScores[p] && studentScores[p] !== "-").length, [allParams, studentScores]);
  const pct = allParams.length > 0 ? Math.round((filled / allParams.length) * 100) : 0;
  
  const catParams = activeCategoryObj?.materi || [];
  const catFilled = catParams.filter((p: string) => studentScores[p] && studentScores[p] !== "-").length;

  const scoreCounts = useMemo(() => {
    const counts: Record<string, number> = { sb: 0, b: 0, c: 0, k: 0, "-": 0 };
    allParams.forEach((p: string) => { const s = studentScores[p] || "-"; counts[s] = (counts[s] || 0) + 1; });
    return counts;
  }, [allParams, studentScores]);

  const handleDownloadPDF = () => {
    if (!currentStudent) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let tablesHtml = "";
    categoriesList.forEach((cat) => {
      const params = cat.materi;
      let rowsHtml = "";
      params.forEach((param: string, idx: number) => {
        const s = studentScores[param] || "-";
        const scoreColor = s === "sb" ? "#15803d" : s === "b" ? "#1d4ed8" : s === "c" ? "#b45309" : s === "k" ? "#be123c" : "#9ca3af";
        rowsHtml += `<tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:5px 8px;text-align:center;color:#6b7280;font-size:10px">${idx + 1}</td>
          <td style="padding:5px 8px;font-size:11px">${param}</td>
          <td style="padding:5px 8px;text-align:center;font-weight:900;font-size:11px;color:${scoreColor}">${s.toUpperCase()}</td>
        </tr>`;
      });
      tablesHtml += `<div style="margin-top:14px;page-break-inside:avoid">
        <h4 style="margin:0 0 5px;font-size:10px;text-transform:uppercase;color:#15803d;border-left:3px solid #15803d;padding-left:6px;letter-spacing:0.5px">${cat.nama}</h4>
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
          <div className="overflow-y-auto max-h-[300px] lg:max-h-[520px]">
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
        <div className="flex-1 min-w-0 space-y-4 w-full">

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
            {activeWorkTab === "input" && activeCategoryObj && (
              <div className="px-5 pt-4">
                {/* Scrollable Container with Left/Right Buttons and Drag-to-Scroll support */}
                <div className="relative flex items-center group/nav">
                  {/* Left Scroll Button */}
                  <button
                    type="button"
                    onClick={() => scrollTabs("left")}
                    className="absolute left-0 z-10 w-7 h-7 bg-white/90 hover:bg-white border border-neutral-gray/12 shadow-sm rounded-full flex items-center justify-center text-neutral-gray hover:text-primary-green opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 -left-2.5 cursor-pointer hidden md:flex"
                    title="Scroll Kiri"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div
                    ref={tabsRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex gap-2 overflow-x-auto scrollbar-none pb-1 flex-1 select-none ${
                      isDragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
                  >
                    {categoriesList.map((tab) => {
                      const done = tab.materi.filter((p: string) => studentScores[p] && studentScores[p] !== "-").length;
                      const isActive = editingCategory === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            // Only trigger select if not dragging
                            if (!isDragging) setEditingCategory(tab.id);
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all cursor-pointer flex-shrink-0 select-none ${
                            isActive
                              ? "bg-primary-green text-white border-primary-green shadow-sm"
                              : "bg-stone-50 text-neutral-gray border-neutral-gray/12 hover:border-primary-green/30 hover:text-neutral-dark"
                          }`}
                        >
                          <span className="opacity-90">{getCategorySvg(tab.icon, "w-3.5 h-3.5 flex-shrink-0")}</span>
                          <span>{tab.nama}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-stone-200 text-neutral-gray"}`}>
                            {done}/{tab.materi.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Scroll Button */}
                  <button
                    type="button"
                    onClick={() => scrollTabs("right")}
                    className="absolute right-0 z-10 w-7 h-7 bg-white/90 hover:bg-white border border-neutral-gray/12 shadow-sm rounded-full flex items-center justify-center text-neutral-gray hover:text-primary-green opacity-0 group-hover/nav:opacity-100 transition-opacity duration-200 -right-2.5 cursor-pointer hidden md:flex"
                    title="Scroll Kanan"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Category progress bar */}
                <div className="mt-3 mb-1">
                  <div className="flex justify-between text-[9px] font-semibold text-neutral-gray mb-1">
                    <span className="capitalize">{activeCategoryObj.nama}</span>
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
            <div className="p-4 sm:p-5">
              {activeWorkTab === "input" ? (
                (isAdminAdministrasi || isGuru) ? (
                  <div className="space-y-3">
                    {catParams.map((param: string, idx: number) => {
                      const currentVal = studentScores[param] || "-";
                      const cfg = SCORE_CONFIG[currentVal];
                      return (
                        <div key={param} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 hover:bg-stone-100/70 rounded-xl border border-neutral-gray/6 transition-colors group">
                          {/* Left Column (Index + Name) */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-[9.5px] font-black text-neutral-gray/40 w-4 text-center flex-shrink-0">{idx + 1}</span>
                            <span className="text-[11.5px] font-bold text-neutral-dark leading-snug break-words">{param}</span>
                          </div>

                          {/* Right Column (Control Buttons + Current status badge) */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-dashed border-neutral-gray/12 flex-shrink-0">
                            {/* Score selection buttons */}
                            <div className="flex gap-1.5">
                              {["sb", "b", "c", "k", "-"].map((score) => {
                                const isSelected = currentVal === score;
                                const sc = SCORE_CONFIG[score];
                                return (
                                  <button
                                    key={score}
                                    type="button"
                                    onClick={() => onUpdateMurajaah(murajaahStudentId, param, score)}
                                    title={sc.label}
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-[9.5px] sm:text-[10px] font-black uppercase flex items-center justify-center transition-all cursor-pointer ${
                                      isSelected
                                        ? `${sc.bg} text-white shadow-md scale-105 z-10 font-black`
                                        : "bg-white border border-neutral-gray/15 text-neutral-gray/60 hover:border-neutral-gray/30 hover:text-neutral-dark"
                                    }`}
                                  >
                                    {score}
                                  </button>
                                );
                              })}
                            </div>
                            {/* Status badge preview */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} shadow-sm border border-white/20`}>
                              <span className="text-[8.5px] font-black text-white uppercase">{currentVal}</span>
                            </div>
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
                /* Summary view - Grid layout (responsive on mobile) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoriesList.map((cat) => {
                    const done = cat.materi.filter((p: string) => studentScores[p] && studentScores[p] !== "-").length;
                    const catPct = Math.round((done / cat.materi.length) * 100);
                    return (
                      <div key={cat.id} className="rounded-xl border border-neutral-gray/8 overflow-hidden bg-white shadow-3xs flex flex-col">
                        {/* Category header */}
                        <div className="px-4 py-3 bg-stone-50 border-b border-neutral-gray/6 flex items-center justify-between flex-shrink-0">
                          <span className="text-[10px] font-extrabold text-neutral-dark uppercase tracking-wide truncate max-w-[130px] sm:max-w-none">{cat.nama}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 sm:w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-300 ${catPct === 100 ? "bg-emerald-500" : "bg-primary-green"}`} style={{ width: `${catPct}%` }} />
                            </div>
                            <span className="text-[9px] font-black text-neutral-gray">{done}/{cat.materi.length}</span>
                          </div>
                        </div>
                        {/* Items grid */}
                        <div className="divide-y divide-neutral-gray/5 overflow-y-auto max-h-[220px] scrollbar-thin">
                          {cat.materi.map((p: string, idx: number) => {
                            const score = studentScores[p] || "-";
                            return (
                              <div key={p} className="px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[8.5px] text-neutral-gray/40 font-bold w-4 text-center flex-shrink-0">{idx + 1}</span>
                                  <span className="text-[11px] font-semibold text-neutral-dark truncate">{p}</span>
                                </div>
                                <span className={`text-[8px] sm:text-[8.5px] font-extrabold px-2 py-0.5 rounded-md border flex-shrink-0 uppercase ${BADGE[score]} shadow-3xs`}>
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
