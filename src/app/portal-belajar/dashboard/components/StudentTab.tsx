"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Student {
  id: number;
  name: string;
  nisn: string;
  nis: string;
  address: string;
  semester: string;
  class: string;
  fase: string;
  height: number;
  weight: number;
  headCircumference: number;
  academicYear: string;
  activeStatus: string;
  parentName?: string;
}

interface StudentTabProps {
  students: Student[];
  isAdminAdministrasi: boolean;
  isGuru?: boolean;
  onAddStudent: (newStudent: Omit<Student, "id" | "activeStatus">) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: number) => void;
  onUpdateStudentStatus: (studentId: number, status: string) => void;
  classes: any[];
}

export default function StudentTab({
  students,
  isAdminAdministrasi,
  isGuru = false,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onUpdateStudentStatus,
  classes,
}: StudentTabProps) {
  // Local UI States
  const [selectedFilterClass, setSelectedFilterClass] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("2026/2027");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [activeDetailStudent, setActiveDetailStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [importResult, setImportResult] = useState<{
    isOpen: boolean;
    successCount: number;
    failCount: number;
    duplicateCount: number;
    errorMessage?: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Ekspor Data Siswa ke Excel (Bisa menjadi template jika data kosong)
  const handleExportExcel = () => {
    try {
      const dataToExport = filteredStudents.length > 0 
        ? filteredStudents.map((st, index) => ({
            "No": index + 1,
            "Nama Lengkap": st.name,
            "NISN": st.nisn,
            "NIS": st.nis || "",
            "Nama Orang Tua": st.parentName || "",
            "Kelas": st.class,
            "Semester": st.semester,
            "Fase": st.fase,
            "Tahun Ajaran": st.academicYear,
            "Tinggi Badan (cm)": st.height,
            "Berat Badan (kg)": st.weight,
            "Lingkar Kepala (cm)": st.headCircumference,
            "Alamat": st.address,
            "Status Sesi": st.activeStatus || "Aktif",
          }))
        : [
            {
              "No": 1,
              "Nama Lengkap": "Masukkan Nama Murid Baru",
              "NISN": "1234567890",
              "NIS": "112233",
              "Nama Orang Tua": "Budi Santoso",
              "Kelas": "RA (A)",
              "Semester": "Semester 1",
              "Fase": "Fase Fondasi",
              "Tahun Ajaran": "2026/2027",
              "Tinggi Badan (cm)": 100,
              "Berat Badan (kg)": 16,
              "Lingkar Kepala (cm)": 48,
              "Alamat": "Tegaltirto, Berbah, Sleman",
              "Status Sesi": "Aktif",
            }
          ];

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

      // Auto-fit column widths
      const maxLens = Object.keys(dataToExport[0] || {}).map(key => ({ wch: key.length + 5 }));
      worksheet["!cols"] = maxLens;

      XLSX.writeFile(workbook, `Data_Siswa_RA_Sahabat_${selectedFilterClass}_${selectedYear.replace("/", "-")}.xlsx`);
      
      // Visual feedback toast
      setToastMessage("Data siswa berhasil diekspor ke Excel!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setImportResult({
        isOpen: true,
        successCount: 0,
        failCount: 0,
        duplicateCount: 0,
        errorMessage: "Gagal mengekspor data ke Excel: " + err.message
      });
    }
  };

  // 2. Impor Data Siswa dari File Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (data.length === 0) {
          setImportResult({
            isOpen: true,
            successCount: 0,
            failCount: 0,
            duplicateCount: 0,
            errorMessage: "Berkas Excel kosong atau format kolom tidak sesuai."
          });
          return;
        }

        let successCount = 0;
        let failCount = 0;
        let duplicateCount = 0;

        data.forEach((row: any) => {
          // Hilangkan baris instruksi/contoh template jika ada
          const name = row["Nama Lengkap"];
          const nisn = String(row["NISN"] || "").trim();
          const classVal = row["Kelas"] || "KB";

          if (name && name !== "Masukkan Nama Murid Baru" && nisn) {
            // Validasi duplikasi berdasarkan NISN atau Nama + Kelas
            const isDuplicate = students.some(
              (s) => 
                (s.nisn && s.nisn.trim() === nisn) || 
                (s.name.toLowerCase().trim() === name.toLowerCase().trim() && s.class === classVal)
            );

            if (isDuplicate) {
              duplicateCount++;
            } else {
              onAddStudent({
                name: name,
                nisn: nisn,
                nis: String(row["NIS"] || ""),
                parentName: row["Nama Orang Tua"] || "",
                class: classVal,
                semester: row["Semester"] || "Semester 1",
                fase: row["Fase"] || "Fase Fondasi",
                academicYear: row["Tahun Ajaran"] || "2026/2027",
                height: Number(row["Tinggi Badan (cm)"] || 100),
                weight: Number(row["Berat Badan (kg)"] || 16),
                headCircumference: Number(row["Lingkar Kepala (cm)"] || 48),
                address: row["Alamat"] || "Berbah, Sleman",
              });
              successCount++;
            }
          } else {
            failCount++;
          }
        });

        setImportResult({
          isOpen: true,
          successCount,
          failCount,
          duplicateCount,
        });
        e.target.value = ""; // Reset input file
      } catch (err: any) {
        setImportResult({
          isOpen: true,
          successCount: 0,
          failCount: 0,
          duplicateCount: 0,
          errorMessage: "Gagal membaca atau memproses berkas Excel: " + err.message
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  // Local Form States (Offline Registration)
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentNisn, setNewStudentNisn] = useState("");
  const [newStudentNis, setNewStudentNis] = useState("");
  const [newStudentAddress, setNewStudentAddress] = useState("");
  const [newStudentSemester, setNewStudentSemester] = useState("Semester 1");
  const [newStudentClass, setNewStudentClass] = useState("KB");
  const [newStudentFase, setNewStudentFase] = useState("Fase Fondasi");
  const [newStudentHeight, setNewStudentHeight] = useState("100");
  const [newStudentWeight, setNewStudentWeight] = useState("16");
  const [newStudentHead, setNewStudentHead] = useState("48");
  const [newStudentYear, setNewStudentYear] = useState("2026/2027");
  const [newStudentParentName, setNewStudentParentName] = useState("");

  // Get unique years dynamically
  const uniqueYears = Array.from(new Set(students.map((s) => s.academicYear)));
  if (!uniqueYears.includes("2026/2027")) {
    uniqueYears.push("2026/2027");
  }
  uniqueYears.sort().reverse();

  const filteredStudents = students.filter((st) => {
    const matchesClass = selectedFilterClass === "Semua" || st.class === selectedFilterClass;
    const matchesYear = st.academicYear === selectedYear;
    const matchesSearch =
      st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      st.nisn.includes(studentSearchQuery);
    return matchesClass && matchesYear && matchesSearch;
  });

  const getStudentCount = (cls: string) => {
    if (cls === "Semua") return students.filter((s) => s.academicYear === selectedYear).length;
    return students.filter((s) => s.class === cls && s.academicYear === selectedYear).length;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentNisn) return;

    onAddStudent({
      name: newStudentName,
      nisn: newStudentNisn,
      nis: newStudentNis,
      address: newStudentAddress || "Alamat belum diinput",
      semester: newStudentSemester,
      class: newStudentClass,
      fase: newStudentFase,
      height: Number(newStudentHeight) || 100,
      weight: Number(newStudentWeight) || 16,
      headCircumference: Number(newStudentHead) || 48,
      academicYear: newStudentYear,
      parentName: newStudentParentName
    });

    // Reset Form
    setNewStudentName("");
    setNewStudentNisn("");
    setNewStudentNis("");
    setNewStudentAddress("");
    setNewStudentParentName("");
    setShowStudentForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="w-full space-y-6">
      


        <div className="space-y-6">
          
          {/* Kelas & Tahun Ajaran filter badges — Startup Segmented Control Style */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs">
            {!isGuru ? (
              <div className="flex items-center gap-1 bg-stone-100/70 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none whitespace-nowrap">
                {["Semua", ...classes.map((c: any) => c.className)].map((cls) => {
                  const isActive = selectedFilterClass === cls;
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedFilterClass(cls)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-primary-green text-white shadow-xs"
                          : "text-neutral-gray hover:text-neutral-dark"
                      }`}
                    >
                      {cls} <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-black ${isActive ? "bg-white/20 text-white" : "bg-neutral-gray/10 text-neutral-gray"}`}>{getStudentCount(cls)}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-[10px] font-bold text-neutral-gray uppercase px-2 flex items-center gap-1.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />
                <span>Peserta Didik Kelas Anda</span>
              </div>
            )}

            <div className="flex items-center justify-between sm:justify-start gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-gray/10">
              <span className="text-[10px] font-bold text-neutral-gray uppercase">Tahun Ajaran:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-[#FAF8F5] border border-neutral-gray/10 text-neutral-dark focus:outline-none cursor-pointer"
              >
                {uniqueYears.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar & Registration Trigger */}
          <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            <div className="relative flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <svg className="w-4 h-4 text-neutral-gray absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder="Cari nama murid atau NISN..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-semibold"
                />
              </div>
              
              {(studentSearchQuery !== "" || selectedFilterClass !== "Semua" || selectedYear !== "2026/2027") && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentSearchQuery("");
                    setSelectedFilterClass("Semua");
                    setSelectedYear("2026/2027");
                  }}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-3xs text-center"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full lg:w-auto justify-stretch sm:justify-end items-center">
              {isAdminAdministrasi && (
                <>
                  {/* Import Excel Trigger */}
                  <label className="px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs text-center">
                    <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Impor Excel</span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleImportExcel}
                      className="hidden"
                    />
                  </label>

                  {/* Export Excel Button */}
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="px-3.5 py-2.5 bg-white hover:bg-primary-green/5 text-primary-green border-2 border-dashed border-primary-green/30 font-extrabold text-[10px] uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                    title="Ekspor Data Siswa Terfilter ke Excel"
                  >
                    <svg className="w-3.5 h-3.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Ekspor Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowStudentForm(!showStudentForm)}
                    className="col-span-2 sm:col-span-1 px-4 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Daftarkan Offline</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Grid of Student Cards */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-primary-green/10">
              <p className="text-xs text-neutral-gray font-bold">Tidak ada data murid yang sesuai dengan filter atau pencarian Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStudents.map((st) => {
                const initials = st.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
                const isDropdownOpen = activeDropdownId === st.id;
                return (
                  <div key={st.id} className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs flex flex-col justify-between gap-4 hover:shadow-xs transition-all relative">
                    
                    {/* Kebab Dropdown Menu */}
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(isDropdownOpen ? null : st.id);
                        }}
                        className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 hover:bg-neutral-gray/5 text-neutral-dark font-extrabold flex items-center justify-center cursor-pointer transition-colors"
                      >
                        ⋮
                      </button>
                      
                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20 cursor-default"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(null);
                            }}
                          />
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-neutral-gray/10 rounded-xl shadow-lg z-30 py-1.5 font-semibold text-xs text-neutral-dark">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDetailStudent(st);
                                setActiveDropdownId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-soft-mint/30 cursor-pointer flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Detail</span>
                            </button>
                            {isAdminAdministrasi && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingStudent({ ...st });
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-soft-mint/30 cursor-pointer text-yellow-700 flex items-center gap-1.5"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteStudent(st.id);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-accent/10 cursor-pointer text-accent flex items-center gap-1.5"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Hapus</span>
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-start gap-3 pr-6">
                      <div className="w-10 h-10 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center font-baloo font-bold text-sm flex-shrink-0">
                        {initials}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h4 className="font-baloo text-sm font-bold text-neutral-dark truncate leading-tight" title={st.name}>
                          {st.name}
                        </h4>
                        <span className="text-[10px] text-neutral-gray font-mono block mt-0.5">NISN: {st.nisn}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-gray">
                      <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                        <span className="block text-[8px] text-neutral-gray/60 uppercase">Kelas & Fase</span>
                        <span className="font-bold text-neutral-dark">{st.class}</span>
                      </div>
                      <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                        <span className="block text-[8px] text-neutral-gray/60 uppercase">TB / BB</span>
                        <span className="font-bold text-neutral-dark">{st.height}cm / {st.weight}kg</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-neutral-gray/5 gap-2">
                      <select
                        disabled={!isAdminAdministrasi}
                        value={st.activeStatus}
                        onChange={(e) => onUpdateStudentStatus(st.id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border focus:outline-none transition-colors max-w-[100px] text-center ${
                          !isAdminAdministrasi ? "bg-neutral-gray/5 border-neutral-gray/10 cursor-not-allowed text-neutral-gray" : "cursor-pointer"
                        } ${
                          st.activeStatus === "Aktif"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : st.activeStatus === "Lulus"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-stone-100 text-stone-600 border-stone-300"
                        }`}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Lulus">Lulus</option>
                        <option value="Keluar">Keluar</option>
                      </select>

                      <span className="text-[9px] text-neutral-gray font-bold">
                        TA: {st.academicYear}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      {/* Detail Student Modal Pop-up */}
      {activeDetailStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">Detail Profil Santri</h4>
              <button
                type="button"
                onClick={() => setActiveDetailStudent(null)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-neutral-dark">
              {/* Nama Lengkap */}
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                <span className="block text-[8px] text-neutral-gray/60 uppercase">Nama Lengkap</span>
                <span className="text-sm font-bold text-neutral-dark">{activeDetailStudent.name}</span>
              </div>

              {/* NISN & NIS */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">NISN</span>
                  <span className="font-mono text-neutral-dark font-bold">{activeDetailStudent.nisn || "-"}</span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">NIS (Nomor Induk)</span>
                  <span className="font-mono text-neutral-dark font-bold">{activeDetailStudent.nis || "-"}</span>
                </div>
              </div>

              {/* Orang Tua & Tahun Ajaran */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Orang Tua / Wali</span>
                  <span className="text-neutral-dark font-bold">{activeDetailStudent.parentName || "-"}</span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Tahun Ajaran</span>
                  <span className="text-neutral-dark font-bold">{activeDetailStudent.academicYear || "-"}</span>
                </div>
              </div>

              {/* Kelas/Fase & Semester */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Kelas &amp; Fase</span>
                  <span className="font-bold text-neutral-dark">{activeDetailStudent.class} ({activeDetailStudent.fase})</span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Semester</span>
                  <span className="text-neutral-dark font-bold">{activeDetailStudent.semester || "-"}</span>
                </div>
              </div>

              {/* Alamat */}
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                <span className="block text-[8px] text-neutral-gray/60 uppercase">Alamat Rumah</span>
                <span className="text-neutral-gray font-normal">{activeDetailStudent.address}</span>
              </div>

              {/* TB, BB, LK, Status */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                  <span className="block text-[7px] text-neutral-gray/60 uppercase">TB</span>
                  <span className="font-bold text-[10px] text-neutral-dark">{activeDetailStudent.height} cm</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                  <span className="block text-[7px] text-neutral-gray/60 uppercase">BB</span>
                  <span className="font-bold text-[10px] text-neutral-dark">{activeDetailStudent.weight} kg</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                  <span className="block text-[7px] text-neutral-gray/60 uppercase">LK</span>
                  <span className="font-bold text-[10px] text-neutral-dark">{activeDetailStudent.headCircumference || 48} cm</span>
                </div>
                <div className="bg-[#FAF8F5] p-2 rounded-lg border border-neutral-gray/5">
                  <span className="block text-[7px] text-neutral-gray/60 uppercase">Status</span>
                  <span className={`font-bold text-[10px] ${activeDetailStudent.activeStatus === "Aktif" ? "text-emerald-600" : "text-rose-500"}`}>{activeDetailStudent.activeStatus}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveDetailStudent(null)}
              className="w-full py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs mt-2"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}

      {/* Edit Student Sliding Side Drawer */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => setEditingStudent(null)}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Ubah Profil Santri</h4>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content (Scrollable) */}
              <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.parentName || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    placeholder="Nama Orang Tua Murid"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">NISN (10 Digit)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="NISN harus berisi 10 digit angka murni"
                      value={editingStudent.nisn}
                      onChange={(e) => setEditingStudent({ ...editingStudent, nisn: e.target.value.replace(/[^0-9]/g, "") })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-mono text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">NIS (Nomor Induk)</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.nis || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-mono text-neutral-dark"
                      placeholder="Contoh: 2026001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kelas</label>
                    <select
                      value={editingStudent.class}
                      onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                    >
                      {classes.length > 0 ? (
                        classes.map((c: any) => (
                          <option key={c.id} value={c.className}>{c.className}</option>
                        ))
                      ) : (
                        <>
                          <option value="KB">KB</option>
                          <option value="RA (A)">RA (A)</option>
                          <option value="RA (B)">RA (B)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>


                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Alamat Rumah</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.address}
                    onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                  />
                </div>


                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tinggi (cm)</label>
                    <input
                      type="number"
                      required
                      min="30"
                      max="200"
                      value={editingStudent.height}
                      onChange={(e) => setEditingStudent({ ...editingStudent, height: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Berat (kg)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="100"
                      value={editingStudent.weight}
                      onChange={(e) => setEditingStudent({ ...editingStudent, weight: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">LK (cm)</label>
                    <input
                      type="number"
                      required
                      min="20"
                      max="100"
                      value={editingStudent.headCircumference || 48}
                      onChange={(e) => setEditingStudent({ ...editingStudent, headCircumference: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Semester</label>
                    <select
                      value={editingStudent.semester}
                      onChange={(e) => setEditingStudent({ ...editingStudent, semester: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white text-neutral-dark"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tahun Ajaran</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.academicYear}
                      onChange={(e) => setEditingStudent({ ...editingStudent, academicYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    />
                  </div>
                </div>

                {/* Sticky buttons at bottom */}
                <div className="flex gap-2 pt-3 border-t border-neutral-gray/10 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
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

      {/* Offline Registration Sliding Side Drawer */}
      {isAdminAdministrasi && showStudentForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => setShowStudentForm(false)}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Daftarkan Murid Baru (Offline)</h4>
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content (Scrollable) */}
              <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                <div>
                  <label htmlFor="newStudentName" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Lengkap Murid</label>
                  <input
                    type="text"
                    id="newStudentName"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                    placeholder="Nama Lengkap Murid"
                  />
                </div>

                <div>
                  <label htmlFor="newStudentParent" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    id="newStudentParent"
                    required
                    value={newStudentParentName}
                    onChange={(e) => setNewStudentParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    placeholder="Contoh: Siti Aminah"
                  />
                </div>                 <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="newStudentNisn" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">NISN (10 Digit)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="NISN harus berisi 10 digit angka murni"
                      id="newStudentNisn"
                      value={newStudentNisn}
                      onChange={(e) => setNewStudentNisn(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-mono text-neutral-dark"
                      placeholder="10 digit NISN"
                    />
                  </div>
                  <div>
                    <label htmlFor="newStudentNis" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">NIS (Nomor Induk)</label>
                    <input
                      type="text"
                      required
                      id="newStudentNis"
                      value={newStudentNis}
                      onChange={(e) => setNewStudentNis(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-mono text-neutral-dark"
                      placeholder="Contoh: 2026001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="newStudentClass" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kelas</label>
                    <select
                      id="newStudentClass"
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                    >
                      {classes.length > 0 ? (
                        classes.map((c: any) => (
                          <option key={c.id} value={c.className}>{c.className}</option>
                        ))
                      ) : (
                        <>
                          <option value="KB">KB</option>
                          <option value="RA (A)">RA (A)</option>
                          <option value="RA (B)">RA (B)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>


                <div>
                  <label htmlFor="newStudentAddress" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Alamat Rumah</label>
                  <input
                    type="text"
                    required
                    id="newStudentAddress"
                    value={newStudentAddress}
                    onChange={(e) => setNewStudentAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    placeholder="Alamat rumah tinggal"
                  />
                </div>


                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label htmlFor="newStudentHeight" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tinggi (cm)</label>
                    <input
                      type="number"
                      required
                      min="30"
                      max="200"
                      id="newStudentHeight"
                      value={newStudentHeight}
                      onChange={(e) => setNewStudentHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="newStudentWeight" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Berat (kg)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="100"
                      id="newStudentWeight"
                      value={newStudentWeight}
                      onChange={(e) => setNewStudentWeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="newStudentHead" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">LK (cm)</label>
                    <input
                      type="number"
                      required
                      min="20"
                      max="100"
                      id="newStudentHead"
                      value={newStudentHead}
                      onChange={(e) => setNewStudentHead(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="newStudentSemester" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Semester</label>
                    <select
                      id="newStudentSemester"
                      value={newStudentSemester}
                      onChange={(e) => setNewStudentSemester(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white text-neutral-dark"
                    >
                      <option value="Semester 1">Semester 1 (Ganjil)</option>
                      <option value="Semester 2">Semester 2 (Genap)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="newStudentYear" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tahun Ajaran</label>
                    <input
                      type="text"
                      required
                      id="newStudentYear"
                      value={newStudentYear}
                      onChange={(e) => setNewStudentYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                    />
                  </div>
                </div>

                {/* Sticky buttons at bottom */}
                <div className="flex gap-2 pt-3 border-t border-neutral-gray/10 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                  >
                    Daftarkan Murid
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStudentForm(false)}
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
      {/* Import/Export Excel Result Notification Dialog */}
      {importResult && importResult.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-primary-green/10 shadow-2xl p-6 space-y-4 animate-scale-in text-neutral-dark">
            <div className="text-center space-y-3">
              {importResult.errorMessage ? (
                <>
                  <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 shadow-3xs">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h4 className="font-baloo text-base font-bold text-red-600 leading-tight">Proses Gagal</h4>
                  <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                    {importResult.errorMessage}
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-3xs animate-pulse">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-baloo text-base font-bold text-primary-green leading-tight">Proses Impor Selesai!</h4>
                  <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                    Sinkronisasi berkas Excel ke database berhasil diselesaikan.
                  </p>
                </>
              )}
            </div>

            {!importResult.errorMessage && (
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-primary-green/5 space-y-2.5 text-xs font-semibold text-neutral-gray">
                <div className="flex justify-between items-center">
                  <span>Siswa Berhasil Ditambahkan:</span>
                  <span className="text-primary-green font-extrabold font-mono text-sm bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">{importResult.successCount}</span>
                </div>
                <div className="flex justify-between items-center border-t border-neutral-gray/5 pt-2.5">
                  <span>Ditolak (Sudah Terdaftar/Duplikat):</span>
                  <span className="text-yellow-700 font-extrabold font-mono text-sm bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">{importResult.duplicateCount}</span>
                </div>
                <div className="flex justify-between items-center border-t border-neutral-gray/5 pt-2.5">
                  <span>Gagal (Format Kolom Tidak Valid):</span>
                  <span className="text-accent font-extrabold font-mono text-sm bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">{importResult.failCount}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setImportResult(null)}
              className="w-full py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}
      {/* 5. Custom Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2D6A4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-[11px] font-extrabold border border-emerald-500/20 animate-fade-in">
          <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
