"use client";

import React, { useState } from "react";

interface Student {
  id: number;
  name: string;
  nisn: string;
  madrasahName: string;
  address: string;
  semester: string;
  class: string;
  fase: string;
  height: number;
  weight: number;
  academicYear: string;
  activeStatus: string;
  portfolioLink: string;
}

interface StudentTabProps {
  students: Student[];
  isAdminAdministrasi: boolean;
  onAddStudent: (newStudent: Omit<Student, "id" | "activeStatus">) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (studentId: number) => void;
  onUpdateStudentStatus: (studentId: number, status: string) => void;
}

export default function StudentTab({
  students,
  isAdminAdministrasi,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onUpdateStudentStatus,
}: StudentTabProps) {
  // Local UI States
  const [selectedFilterClass, setSelectedFilterClass] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("2026/2027");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [activeDetailStudent, setActiveDetailStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);

  // Local Form States (Offline Registration)
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentNisn, setNewStudentNisn] = useState("");
  const [newStudentMadrasah, setNewStudentMadrasah] = useState("RA Sahabat Berbah Sleman");
  const [newStudentAddress, setNewStudentAddress] = useState("");
  const [newStudentSemester, setNewStudentSemester] = useState("Semester 1");
  const [newStudentClass, setNewStudentClass] = useState("KB");
  const [newStudentFase, setNewStudentFase] = useState("Fase Fondasi");
  const [newStudentHeight, setNewStudentHeight] = useState("100");
  const [newStudentWeight, setNewStudentWeight] = useState("16");
  const [newStudentYear, setNewStudentYear] = useState("2026/2027");
  const [newStudentPortfolio, setNewStudentPortfolio] = useState("");

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
      madrasahName: newStudentMadrasah,
      address: newStudentAddress || "Alamat belum diinput",
      semester: newStudentSemester,
      class: newStudentClass,
      fase: newStudentFase,
      height: Number(newStudentHeight) || 100,
      weight: Number(newStudentWeight) || 16,
      academicYear: newStudentYear,
      portfolioLink: newStudentPortfolio || `https://drive.google.com/drive/folders/mock-portfolio-${newStudentNisn}`
    });

    // Reset Form
    setNewStudentName("");
    setNewStudentNisn("");
    setNewStudentAddress("");
    setNewStudentPortfolio("");
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
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs">
            <div className="flex items-center gap-1 bg-stone-100/70 p-1 rounded-xl w-fit">
              {["Semua", "KB", "RA (A)", "RA (B)"].map((cls) => {
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

            <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-neutral-gray/10">
              <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Tahun Ajaran:</span>
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
          <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="relative flex-1 flex items-center gap-2">
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
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-3xs"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              {isAdminAdministrasi && (
                <button
                  onClick={() => setShowStudentForm(!showStudentForm)}
                  className="px-4 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Daftarkan Offline</span>
                </button>
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
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                <span className="block text-[8px] text-neutral-gray/60 uppercase">Nama Lengkap</span>
                <span className="text-sm font-bold text-neutral-dark">{activeDetailStudent.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">NISN</span>
                  <span className="font-mono text-neutral-dark">{activeDetailStudent.nisn}</span>
                </div>
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Kelas & Fase</span>
                  <span className="font-bold text-neutral-dark">{activeDetailStudent.class} ({activeDetailStudent.fase})</span>
                </div>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                <span className="block text-[8px] text-neutral-gray/60 uppercase">Nama Madrasah</span>
                <span className="text-neutral-dark">{activeDetailStudent.madrasahName}</span>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                <span className="block text-[8px] text-neutral-gray/60 uppercase">Alamat Rumah</span>
                <span className="text-neutral-gray font-normal">{activeDetailStudent.address}</span>
              </div>
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5">
                <span className="block text-[8px] text-neutral-gray/60 uppercase">Tautan Portofolio Foto Raport (Google Drive)</span>
                {activeDetailStudent.portfolioLink ? (
                  <a
                    href={activeDetailStudent.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-green hover:underline font-bold flex items-center gap-1 mt-0.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>Buka Portofolio Drive</span>
                  </a>
                ) : (
                  <span className="text-neutral-gray/70 italic font-normal">Belum diisi</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">TB</span>
                  <span className="font-bold text-neutral-dark">{activeDetailStudent.height} cm</span>
                </div>
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">BB</span>
                  <span className="font-bold text-neutral-dark">{activeDetailStudent.weight} kg</span>
                </div>
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-gray/5">
                  <span className="block text-[8px] text-neutral-gray/60 uppercase">Status</span>
                  <span className="font-bold text-emerald-600">{activeDetailStudent.activeStatus}</span>
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
                    <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kelas</label>
                    <select
                      value={editingStudent.class}
                      onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                    >
                      <option value="KB">KB</option>
                      <option value="RA (A)">RA (A)</option>
                      <option value="RA (B)">RA (B)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Madrasah</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.madrasahName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, madrasahName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                  />
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

                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tautan Portofolio Foto Raport (Google Drive)</label>
                  <input
                    type="url"
                    value={editingStudent.portfolioLink || ""}
                    onChange={(e) => setEditingStudent({ ...editingStudent, portfolioLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
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

                <div className="grid grid-cols-2 gap-3">
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
                    <label htmlFor="newStudentClass" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kelas</label>
                    <select
                      id="newStudentClass"
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                    >
                      <option value="KB">KB</option>
                      <option value="RA (A)">RA (A)</option>
                      <option value="RA (B)">RA (B)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="newStudentMadrasah" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Madrasah Asal</label>
                  <input
                    type="text"
                    required
                    id="newStudentMadrasah"
                    value={newStudentMadrasah}
                    onChange={(e) => setNewStudentMadrasah(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark"
                  />
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

                <div>
                  <label htmlFor="newStudentPortfolio" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tautan Portofolio Foto Raport (Google Drive)</label>
                  <input
                    type="url"
                    id="newStudentPortfolio"
                    value={newStudentPortfolio}
                    onChange={(e) => setNewStudentPortfolio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
}
