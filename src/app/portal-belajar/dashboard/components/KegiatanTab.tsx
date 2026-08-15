"use client";

import React, { useState } from "react";

interface Activity {
  id: number;
  title: string;
  date: string;
  category: string;
  driveLink: string;
  description: string;
}

interface KegiatanTabProps {
  activities: Activity[];
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  onAddActivity: (newActivity: Omit<Activity, "id">) => void;
}

export default function KegiatanTab({
  activities,
  isAdminAdministrasi,
  isGuru,
  onAddActivity,
}: KegiatanTabProps) {
  // Dynamic year extraction
  const uniqueYears = Array.from(new Set(activities.map((act) => act.date.substring(0, 4))));
  if (uniqueYears.length === 0) {
    uniqueYears.push(new Date().getFullYear().toString());
  }
  uniqueYears.sort().reverse();

  const [filterCategory, setFilterCategory] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState(uniqueYears[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActivityForm, setShowActivityForm] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState("Akademik");
  const [newDrive, setNewDrive] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filteredActivities = activities.filter((act) => {
    const matchesCategory = filterCategory === "Semua" || act.category === filterCategory;
    const matchesYear = act.date.startsWith(selectedYear);
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesYear && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newDesc) return;

    onAddActivity({
      title: newTitle,
      date: newDate,
      category: newCategory,
      driveLink: newDrive || "https://drive.google.com/drive/folders/mock-new",
      description: newDesc,
    });

    // Reset form
    setNewTitle("");
    setNewDate("");
    setNewCategory("Akademik");
    setNewDrive("");
    setNewDesc("");
    setShowActivityForm(false);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header Tab & Action Button */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div>
          <h4 className="font-baloo text-base font-bold text-neutral-dark">Arsip Dokumentasi Kegiatan & Media Pembelajaran</h4>
          <p className="text-[11px] text-neutral-gray font-semibold">Media integrasi bukti fisik kegiatan belajar mengajar guna pemenuhan akreditasi madrasah.</p>
        </div>
        
        {(isAdminAdministrasi || isGuru) && (
          <button
            type="button"
            onClick={() => setShowActivityForm(true)}
            className="py-2.5 px-4 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Unggah Dokumentasi Baru</span>
          </button>
        )}
      </div>

      {/* Filter Category & Year Bar — Startup Segmented Control Style */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs">
        <div className="flex items-center gap-1 bg-stone-100/70 p-1 rounded-xl w-fit">
          {["Semua", "Akademik", "Keagamaan", "Ekstrakurikuler"].map((cat) => {
            const isActive = filterCategory === cat;
            const catCount = cat === "Semua" ? activities.length : activities.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary-green text-white shadow-xs"
                    : "text-neutral-gray hover:text-neutral-dark"
                }`}
              >
                {cat} <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-black ${isActive ? "bg-white/20 text-white" : "bg-neutral-gray/10 text-neutral-gray"}`}>{catCount}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-neutral-gray/10">
          <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Tahun Pelaksanaan:</span>
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

      {/* Search Bar Bar */}
      <div className="bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-neutral-gray absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci kegiatan atau deskripsi..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-semibold"
          />
        </div>
        
        {(searchQuery !== "" || filterCategory !== "Semua" || selectedYear !== uniqueYears[0]) && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setFilterCategory("Semua");
              setSelectedYear(uniqueYears[0]);
            }}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-3xs"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Grid of Activity Cards */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-primary-green/10">
          <p className="text-xs text-neutral-gray font-bold">Belum ada dokumentasi kegiatan terunggah untuk kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div key={act.id} className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs relative flex flex-col justify-between hover:shadow-xs transition-all min-h-[190px]">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    act.category === "Keagamaan" 
                      ? "bg-purple-50 text-purple-700 border border-purple-200" 
                      : act.category === "Akademik"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    {act.category}
                  </span>
                  <span className="text-[9.5px] text-neutral-gray font-mono font-semibold">{act.date}</span>
                </div>
                <h4 className="font-baloo text-base font-bold text-neutral-dark mt-2.5 leading-snug">{act.title}</h4>
                <p className="text-xs text-neutral-gray font-semibold mt-1.5 leading-relaxed">{act.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-gray/5 flex justify-between items-center">
                <a
                  href={act.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-extrabold text-primary-green hover:text-primary-dark hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span>Buka Folder Drive</span>
                </a>
                <span className="text-[9px] text-primary-green/80 font-bold bg-soft-mint px-2 py-0.5 rounded border border-primary-green/10">
                  Akreditasi Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Activity Sliding Side Drawer */}
      {showActivityForm && (isAdminAdministrasi || isGuru) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => setShowActivityForm(false)}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Unggah Dokumentasi Kegiatan</h4>
                <button
                  type="button"
                  onClick={() => setShowActivityForm(false)}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content (Scrollable) */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                <div>
                  <label htmlFor="newTitle" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Kegiatan</label>
                  <input
                    type="text"
                    id="newTitle"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                    placeholder="Contoh: Senam Sehat Pagi NU"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="newDate" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tanggal Pelaksanaan</label>
                    <input
                      type="date"
                      id="newDate"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-semibold text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="newCategory" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kategori Kegiatan</label>
                    <select
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Keagamaan">Keagamaan / Ke-NU-an</option>
                      <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="newDrive" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tautan Google Drive Dokumentasi</label>
                  <input
                    type="url"
                    id="newDrive"
                    required
                    value={newDrive}
                    onChange={(e) => setNewDrive(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-mono"
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div>
                  <label htmlFor="newDesc" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Deskripsi Singkat Kegiatan</label>
                  <textarea
                    id="newDesc"
                    required
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark resize-none leading-relaxed"
                    placeholder="Tujuan kegiatan dan ringkasan jalannya acara..."
                  ></textarea>
                </div>

                {/* Sticky buttons at bottom */}
                <div className="flex gap-2 pt-3 border-t border-neutral-gray/10 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                  >
                    Simpan Kegiatan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowActivityForm(false)}
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
