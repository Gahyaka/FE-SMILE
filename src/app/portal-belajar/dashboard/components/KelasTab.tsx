"use client";

import React, { useState } from "react";

interface Student {
  id: number;
  name: string;
  class: string;
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
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs hover:shadow-xs transition-all relative flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold px-2.5 py-1 bg-primary-green/10 text-primary-green rounded-full">
                    {cls.fase}
                  </span>
                  <span className="text-[10px] text-neutral-gray font-mono font-bold">
                    ID: CLS-{cls.id}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-baloo text-lg font-bold text-neutral-dark">{cls.className}</h4>
                  <p className="text-[11px] text-neutral-gray font-medium mt-1 leading-relaxed">{cls.description}</p>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5 space-y-2 text-[11px] font-semibold text-neutral-gray">
                  <div className="flex justify-between">
                    <span>Guru Pengampu:</span>
                    <span className="font-bold text-neutral-dark">{cls.teacherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah Siswa Aktif:</span>
                    <span className="font-bold text-primary-green">{studentCount} Anak</span>
                  </div>
                </div>
              </div>

              {isAdminAdministrasi && (
                <div className="flex gap-2 pt-2 border-t border-neutral-gray/5">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingClass({ ...cls });
                    }}
                    className="flex-1 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-extrabold text-[10px] uppercase rounded-lg border border-yellow-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteClass(cls.id)}
                    className="py-1.5 px-3 bg-accent/5 hover:bg-accent/15 text-accent font-extrabold text-[10px] uppercase rounded-lg border border-accent/20 transition-all cursor-pointer flex items-center justify-center"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {visibleClasses.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-primary-green/10">
            <p className="text-xs text-neutral-gray font-bold">Tidak ada data kelas yang dapat ditampilkan.</p>
          </div>
        )}
      </div>

    </div>
  );
}
