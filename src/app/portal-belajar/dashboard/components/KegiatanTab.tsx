"use client";

import React, { useState } from "react";

interface Activity {
  id: number;
  title: string;
  date: string;
  category: string;
  driveLink: string;
  description: string;
  featuredImage?: string;
  isPublic?: boolean;
  imageFiles?: File[];  // File asli untuk dikirim ke backend (tidak disimpan di DB)
}

interface KegiatanTabProps {
  activities: Activity[];
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  onAddActivity: (newActivity: Omit<Activity, "id">) => void;
  onUpdateActivity?: (updatedActivity: Activity) => void;
  onDeleteActivity?: (activityId: number) => void;
  onTogglePublic?: (activityId: number | string, isPublic: boolean) => void;
}

export default function KegiatanTab({
  activities,
  isAdminAdministrasi,
  isGuru,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onTogglePublic,
}: KegiatanTabProps) {
  // Dynamic year extraction
  const uniqueYears = Array.from(new Set(activities.map((act) => act.date.substring(0, 4))));
  if (uniqueYears.length === 0) {
    uniqueYears.push(new Date().getFullYear().toString());
  }
  uniqueYears.sort().reverse();

  const [selectedYear, setSelectedYear] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activeKebabId, setActiveKebabId] = useState<number | null>(null);

  // Form states for creating new activity
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const filteredActivities = activities.filter((act) => {
    const matchesYear = selectedYear === "Semua" || act.date.startsWith(selectedYear);
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate blob preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newDesc) return;

    // Sertakan array File asli agar DashboardClient bisa kirim ke backend
    onAddActivity({
      title: newTitle,
      date: newDate,
      category: "Keagamaan",
      driveLink: "",
      description: newDesc,
      featuredImage: previewUrls[0] || "",
      imageFiles: selectedFiles   // <-- semua file yang dipilih user
    });

    // Reset form
    setNewTitle("");
    setNewDate("");
    setNewDesc("");
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowActivityForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !editingActivity.title || !editingActivity.date || !editingActivity.description) return;

    if (onUpdateActivity) {
      onUpdateActivity(editingActivity);
    }
    setEditingActivity(null);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header Tab & Action Button */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div>
          <h4 className="font-baloo text-base font-bold text-neutral-dark">Arsip Dokumentasi Kegiatan & Media Pembelajaran</h4>
          <p className="text-[11px] text-neutral-gray font-semibold">Media integrasi bukti fisik kegiatan belajar mengajar guna pemenuhan akreditasi madrasah.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {isAdminAdministrasi && (
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
      </div>

      {/* Filter Year Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-primary-green/10 shadow-3xs">
        <h5 className="font-baloo text-sm font-bold text-neutral-dark">Arsip Dokumentasi</h5>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-gray uppercase px-2">Tahun Pelaksanaan:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-[10px] font-extrabold bg-[#FAF8F5] border border-neutral-gray/10 text-neutral-dark focus:outline-none cursor-pointer"
          >
            <option value="Semua">Semua</option>
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
        
        {(searchQuery !== "" || selectedYear !== "Semua") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedYear("Semua");
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
                <div className="flex justify-between items-center gap-2">
                  {/* Tanggal di pojok kiri atas (hanya YYYY-MM-DD) */}
                  <span className="text-[9.5px] text-neutral-gray font-mono font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-neutral-gray/10">
                    {act.date.split("T")[0]}
                  </span>
                  
                  {isAdminAdministrasi && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveKebabId(activeKebabId === act.id ? null : act.id)}
                        className="w-5 h-5 rounded-full hover:bg-neutral-gray/5 flex items-center justify-center text-neutral-dark font-extrabold cursor-pointer transition-colors text-xs"
                      >
                        ⋮
                      </button>
                        {activeKebabId === act.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveKebabId(null)} />
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-neutral-gray/10 rounded-xl shadow-lg z-30 py-1 font-semibold text-[10px] text-neutral-dark">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onTogglePublic) {
                                    onTogglePublic(act.id, !act.isPublic);
                                  }
                                  setActiveKebabId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-soft-mint/30 cursor-pointer text-primary-green flex items-center gap-1.5 border-b border-neutral-gray/5"
                              >
                                <svg className="w-3 h-3 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{act.isPublic ? "Jadikan Privat" : "Jadikan Publik"}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingActivity({ ...act });
                                  setActiveKebabId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-soft-mint/30 cursor-pointer text-yellow-700 flex items-center gap-1.5"
                              >
                                <svg className="w-3 h-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Ubah</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onDeleteActivity) onDeleteActivity(act.id);
                                  setActiveKebabId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-accent/10 cursor-pointer text-accent flex items-center gap-1.5"
                              >
                                <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
                
                {act.featuredImage && (
                  <div className="w-full aspect-[2/1] rounded-xl overflow-hidden border border-neutral-gray/10 bg-stone-50 mt-3">
                    <img 
                      src={act.featuredImage} 
                      alt={act.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h4 className="font-baloo text-base font-bold text-neutral-dark mt-2.5 leading-snug">{act.title}</h4>
                <p className="text-xs text-neutral-gray font-semibold mt-1.5 leading-relaxed">{act.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-gray/5 flex justify-between items-center">
                {act.driveLink && act.driveLink.startsWith("http") ? (
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
                ) : (
                  <span className="text-[10px] font-semibold text-neutral-gray/40 flex items-center gap-1.5 cursor-not-allowed">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>Folder belum tersedia</span>
                  </span>
                )}
                {isAdminAdministrasi || isGuru ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onTogglePublic) {
                        onTogglePublic(act.id, !act.isPublic);
                      }
                    }}
                    className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                      act.isPublic
                        ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#C8E6C9]"
                        : "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0] hover:bg-[#E0E0E0]"
                    }`}
                    title={act.isPublic ? "Klik untuk jadikan privat" : "Klik untuk jadikan publik"}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${act.isPublic ? "bg-[#4CAF50]" : "bg-[#9E9E9E]"}`} />
                    <span>{act.isPublic ? "Publik" : "Privat"}</span>
                  </button>
                ) : (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    act.isPublic
                      ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]"
                      : "bg-[#F5F5F5] text-[#616161] border-[#E0E0E0]"
                  }`}>
                    {act.isPublic ? "Publik" : "Privat"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Activity Sliding Side Drawer */}
      {showActivityForm && isAdminAdministrasi && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => {
              setShowActivityForm(false);
              setSelectedFiles([]);
              setPreviewUrls([]);
            }}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Unggah Dokumentasi Kegiatan</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowActivityForm(false);
                    setSelectedFiles([]);
                    setPreviewUrls([]);
                  }}
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
                 <div className="w-full">
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


                {/* File Uploader Input */}
                <div>
                  <label className="block text-[9px] text-neutral-gray/60 uppercase mb-1.5">Unggah Foto Dokumentasi (Bisa pilih banyak)</label>
                  <div className="w-full p-4 border-2 border-dashed border-primary-green/25 hover:border-primary-green rounded-xl bg-[#FAF8F5] transition-all flex flex-col items-center justify-center relative cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      required={previewUrls.length === 0}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <svg className="w-8 h-8 text-neutral-gray group-hover:text-primary-green transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] text-neutral-dark font-extrabold group-hover:text-primary-green transition-colors">Pilih File Foto</span>
                    <span className="text-[8px] text-neutral-gray mt-1 block">Format: JPG, PNG, WEBP</span>
                  </div>
                </div>

                {/* Selected Images Horizontal Thumbnail Preview */}
                {previewUrls.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="block text-[8px] text-neutral-gray/60 uppercase tracking-wider font-bold">Pratinjau Foto ({previewUrls.length})</span>
                      <span className="text-[8px] text-primary-green/70 font-semibold">★ Foto pertama otomatis jadi sampul</span>
                    </div>
                    
                    <div className="flex gap-2.5 overflow-x-auto pb-2 pr-1 max-w-full">
                      {previewUrls.map((url, idx) => (
                        <div 
                          key={idx}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 border-neutral-gray/10"
                        >
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {idx === 0 && (
                            <div className="absolute inset-x-0 bottom-0 bg-primary-green text-white text-[7px] font-black py-0.5 text-center tracking-wider uppercase">
                              Sampul
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    onClick={() => {
                      setShowActivityForm(false);
                      setSelectedFiles([]);
                      setPreviewUrls([]);
                    }}
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
      {/* Edit Activity Sliding Side Drawer */}
      {editingActivity && (isAdminAdministrasi || isGuru) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => setEditingActivity(null)}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Edit Dokumentasi Kegiatan</h4>
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
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
                  <label htmlFor="editTitle" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Nama Kegiatan</label>
                  <input
                    type="text"
                    id="editTitle"
                    required
                    value={editingActivity.title}
                    onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-bold text-neutral-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="editDate" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tanggal Pelaksanaan</label>
                    <input
                      type="date"
                      id="editDate"
                      required
                      value={editingActivity.date}
                      onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none font-semibold text-neutral-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="editCategory" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Kategori Kegiatan</label>
                    <select
                      id="editCategory"
                      value={editingActivity.category}
                      onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none bg-white font-bold text-neutral-dark"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Keagamaan">Keagamaan / Ke-NU-an</option>
                      <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="editDriveLink" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Link Google Drive</label>
                  <input
                    type="text"
                    id="editDriveLink"
                    value={editingActivity.driveLink}
                    onChange={(e) => setEditingActivity({ ...editingActivity, driveLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-semibold"
                    placeholder="Tautan Google Drive Dokumentasi"
                  />
                </div>

                <div>
                  <label htmlFor="editFeaturedImage" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Tautan Foto Sampul (Featured Image URL)</label>
                  <input
                    type="text"
                    id="editFeaturedImage"
                    value={editingActivity.featuredImage || ""}
                    onChange={(e) => setEditingActivity({ ...editingActivity, featuredImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark font-semibold"
                    placeholder="Tautan gambar eksternal (Unsplash, dsb.)"
                  />
                </div>

                <div>
                  <label htmlFor="editDesc" className="block text-[9px] text-neutral-gray/60 uppercase mb-1">Deskripsi Singkat Kegiatan</label>
                  <textarea
                    id="editDesc"
                    required
                    rows={4}
                    value={editingActivity.description}
                    onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-primary-green/20 focus:border-primary-green focus:outline-none text-neutral-dark resize-none leading-relaxed"
                  ></textarea>
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
                    onClick={() => setEditingActivity(null)}
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
