"use client";

import React, { useState } from "react";

interface Student {
  id: number;
  name: string;
  class: string;
  nisn: string;
  academicYear: string;
}

interface ClassData {
  id: number;
  className: string;
  fase: string;
  teacherName: string;
  description: string;
}

interface KelasTabProps {
  students: Student[];
  classes: ClassData[];
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  currentUserDisplayName: string;
  onAddClass: (newClass: Omit<ClassData, "id">) => void;
  onUpdateClass: (updatedClass: ClassData) => void;
  onDeleteClass: (classId: number) => void;
}

export default function KelasTab({
  students,
  classes,
  isAdminAdministrasi,
  isGuru,
  currentUserDisplayName,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
}: KelasTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Form states
  const [newClassName, setNewClassName] = useState("");
  const [newFase, setNewFase] = useState("Fase Fondasi");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Determine which classes this user can see
  const visibleClasses = classes.filter((cls) => {
    // Search filter
    const matchesSearch =
      cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (isGuru) {
      // Guru only sees class they teach (matching their display name)
      // Standardize comparison to be case insensitive and flexible
      return cls.teacherName.toLowerCase().includes(currentUserDisplayName.toLowerCase()) || 
             currentUserDisplayName.toLowerCase().includes(cls.teacherName.toLowerCase());
    }

    return true; // Admin Adm can see all
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !newTeacherName) return;

    onAddClass({
      className: newClassName,
      fase: newFase,
      teacherName: newTeacherName,
      description: newDescription || "Tidak ada deskripsi",
    });

    // Reset Form
    setNewClassName("");
    setNewFase("Fase Fondasi");
    setNewTeacherName("");
    setNewDescription("");
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !editingClass.className || !editingClass.teacherName) return;
    onUpdateClass(editingClass);
    setEditingClass(null);
  };

  // Helper to count students in a class
  const getStudentCount = (className: string) => {
    return students.filter((s) => s.class === className).length;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Search Action Panel */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-neutral-gray absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kelas atau guru pengampu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-semibold"
          />
        </div>

        {isAdminAdministrasi && (
          <button
            onClick={() => {
              setEditingClass(null);
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Kelas Baru</span>
          </button>
        )}
      </div>

      {/* 2. Add / Edit Forms */}
      {showAddForm && isAdminAdministrasi && (
        <div className="bg-white p-6 rounded-2xl border border-primary-green/15 shadow-3xs space-y-4 animate-fade-in">
          <h4 className="font-baloo text-sm font-bold text-neutral-dark border-b border-neutral-gray/10 pb-2">
            Form Tambah Kelas Baru
          </h4>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="className" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Kelas</label>
              <input
                type="text"
                id="className"
                required
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Contoh: RA (C), SPS"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="teacherName" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Guru Pengampu</label>
              <input
                type="text"
                id="teacherName"
                required
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="Contoh: Bunda Rahma"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="fase" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Fase Pembelajaran</label>
              <select
                id="fase"
                value={newFase}
                onChange={(e) => setNewFase(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="Fase Fondasi">Fase Fondasi</option>
                <option value="Fase A">Fase A</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Deskripsi Singkat</label>
              <input
                type="text"
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Deskripsi tingkat umur atau detail kelas"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 pt-2 justify-end">
              <button
                type="submit"
                className="py-2 px-5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
              >
                Simpan Kelas
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {editingClass && isAdminAdministrasi && (
        <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-3xs space-y-4 animate-fade-in">
          <h4 className="font-baloo text-sm font-bold text-neutral-dark border-b border-neutral-gray/10 pb-2">
            Edit Data Kelas: <span className="text-primary-green">{editingClass.className}</span>
          </h4>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editClassName" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Kelas</label>
              <input
                type="text"
                id="editClassName"
                required
                value={editingClass.className}
                onChange={(e) => setEditingClass({ ...editingClass, className: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="editTeacherName" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Guru Pengampu</label>
              <input
                type="text"
                id="editTeacherName"
                required
                value={editingClass.teacherName}
                onChange={(e) => setEditingClass({ ...editingClass, teacherName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="editFase" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Fase Pembelajaran</label>
              <select
                id="editFase"
                value={editingClass.fase}
                onChange={(e) => setEditingClass({ ...editingClass, fase: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="Fase Fondasi">Fase Fondasi</option>
                <option value="Fase A">Fase A</option>
              </select>
            </div>
            <div>
              <label htmlFor="editDescription" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Deskripsi Singkat</label>
              <input
                type="text"
                id="editDescription"
                value={editingClass.description}
                onChange={(e) => setEditingClass({ ...editingClass, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 pt-2 justify-end">
              <button
                type="submit"
                className="py-2 px-5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
              >
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={() => setEditingClass(null)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleClasses.map((cls) => {
          const studentCount = getStudentCount(cls.className);
          const initials = cls.className.substring(0, 2).toUpperCase();
          const isDropdownOpen = activeDropdownId === cls.id;
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs hover:shadow-xs transition-all relative flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                {/* Header Card dengan Kebab Menu */}
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold px-2.5 py-1 bg-primary-green/10 text-primary-green rounded-full">
                    {cls.fase}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-neutral-gray font-mono font-bold">
                      ID: CLS-{cls.id}
                    </span>

                    {/* Kebab Dropdown Menu untuk Admin Administrasi */}
                    {isAdminAdministrasi && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(isDropdownOpen ? null : cls.id);
                          }}
                          className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 hover:bg-neutral-gray/5 text-neutral-dark font-extrabold flex items-center justify-center cursor-pointer transition-colors"
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
                            <div className="absolute right-0 mt-1 w-28 bg-white border border-neutral-gray/10 rounded-xl shadow-lg z-30 py-1.5 font-semibold text-xs text-neutral-dark">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddForm(false);
                                  setEditingClass({ ...cls });
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-soft-mint/30 cursor-pointer text-yellow-700 flex items-center gap-1.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Ubah</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteClass(cls.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-accent/10 cursor-pointer text-accent flex items-center gap-1.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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

                {/* Judul & Avatar Kelas */}
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center font-baloo font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="font-baloo text-base font-bold text-neutral-dark truncate leading-tight">
                      Kelas {cls.className}
                    </h4>
                    <p className="text-[10px] text-neutral-gray truncate mt-0.5">{cls.description}</p>
                  </div>
                </div>

                {/* Detail Pengampu & Jumlah Siswa */}
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5 space-y-2 text-[11px] font-semibold text-neutral-gray">
                  <div className="flex justify-between items-center">
                    <span>Guru Pengampu:</span>
                    <span className="font-bold text-neutral-dark">{cls.teacherName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Jumlah Siswa:</span>
                    <span className="font-bold text-primary-green">{studentCount} Anak</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Lihat Daftar Siswa */}
              <div className="pt-2 border-t border-neutral-gray/5">
                <button
                  type="button"
                  onClick={() => setSelectedClassForStudents(cls.className)}
                  className="w-full py-2 bg-soft-mint/30 hover:bg-soft-mint/60 active:scale-98 text-primary-green font-extrabold text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <svg className="w-3.5 h-3.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Lihat Daftar Siswa</span>
                </button>
              </div>
            </div>
          );
        })}

        {visibleClasses.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-primary-green/10">
            <p className="text-xs text-neutral-gray font-bold">Tidak ada data kelas yang dapat ditampilkan.</p>
          </div>
        )}
      </div>

      {/* 4. Modal List Siswa */}
      {selectedClassForStudents && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-primary-green/10 w-full max-w-md p-6 relative shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-gray/10 pb-3">
              <div>
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Daftar Santri Kelas</h4>
                <p className="text-[10px] text-primary-green font-bold uppercase tracking-wide">Kelas: {selectedClassForStudents}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClassForStudents(null)}
                className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors hover:bg-neutral-gray/5"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
              {students.filter(s => s.class === selectedClassForStudents).length === 0 ? (
                <p className="text-xs text-neutral-gray italic text-center py-6">Belum ada murid yang terdaftar di kelas ini.</p>
              ) : (
                students
                  .filter(s => s.class === selectedClassForStudents)
                  .map((st, idx) => (
                    <div key={st.id} className="flex justify-between items-center p-3 bg-[#FAF8F5] rounded-xl border border-neutral-gray/5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-black text-primary-green w-5 h-5 bg-primary-green/10 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-neutral-dark">{st.name}</p>
                          <span className="text-[9px] text-neutral-gray font-mono block">NISN: {st.nisn}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        {st.academicYear}
                      </span>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedClassForStudents(null)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
