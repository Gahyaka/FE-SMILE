"use client";

import React, { useState } from "react";

interface FotoItem {
  id: string | number;
  url?: string;
  viewUrl?: string;
  path?: string;
  foto?: string;
  isDefault?: boolean;
  isThumbnail?: boolean;
}

interface Activity {
  id: number | string;
  title: string;
  date: string;
  category: string;
  driveLink: string;
  description: string;
  featuredImage?: string;
  isPublic?: boolean;
  fotos?: FotoItem[];
  imageFiles?: File[];
}

interface KegiatanTabProps {
  activities: Activity[];
  isAdminAdministrasi: boolean;
  isGuru: boolean;
  onAddActivity: (newActivity: Omit<Activity, "id">) => void;
  onUpdateActivity?: (updatedActivity: Activity) => void;
  onDeleteActivity?: (activityId: number | string) => void;
  onTogglePublic?: (activityId: number | string, isPublic: boolean) => void;
  onDeletePhoto?: (photoId: string | number, activityId: string | number) => Promise<void>;
}

const CATEGORY_COLORS: Record<string, string> = {
  "AGENDA TAHUNAN": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "AGENDA UPDATE": "bg-blue-50 text-blue-700 border-blue-200",
};

const CATEGORY_DOT: Record<string, string> = {
  "AGENDA TAHUNAN": "bg-emerald-500",
  "AGENDA UPDATE": "bg-blue-500",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.split("T")[0];
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function KegiatanTab({
  activities,
  isAdminAdministrasi,
  isGuru,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onTogglePublic,
  onDeletePhoto,
}: KegiatanTabProps) {
  const uniqueYears = Array.from(new Set(activities.map((act) => act.date.substring(0, 4))));
  if (uniqueYears.length === 0) uniqueYears.push(new Date().getFullYear().toString());
  uniqueYears.sort().reverse();

  const [selectedYear, setSelectedYear] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activeKebabId, setActiveKebabId] = useState<number | string | null>(null);

  // Detail panel
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [detailFotos, setDetailFotos] = useState<FotoItem[]>([]);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Upload form
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("AGENDA TAHUNAN");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredActivities = activities.filter((act) => {
    const matchYear = selectedYear === "Semua" || act.date.startsWith(selectedYear);
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || act.title.toLowerCase().includes(q) || act.description.toLowerCase().includes(q);
    return matchYear && matchSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles((p) => [...p, ...files]);
    setPreviewUrls((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemovePreview = (idx: number) => {
    URL.revokeObjectURL(previewUrls[idx]);
    setSelectedFiles((p) => p.filter((_, i) => i !== idx));
    setPreviewUrls((p) => p.filter((_, i) => i !== idx));
  };

  const resetUploadForm = () => {
    setNewTitle(""); setNewDate(""); setNewDesc(""); setNewCategory("AGENDA TAHUNAN");
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    setSelectedFiles([]); setPreviewUrls([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newDesc || selectedFiles.length === 0) return;
    setIsSubmitting(true);
    onAddActivity({ title: newTitle, date: newDate, category: newCategory, driveLink: "", description: newDesc, featuredImage: previewUrls[0] || "", imageFiles: selectedFiles });
    resetUploadForm();
    setShowActivityForm(false);
    setIsSubmitting(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity?.title || !editingActivity?.date || !editingActivity?.description) return;
    if (onUpdateActivity) onUpdateActivity(editingActivity);
    setEditingActivity(null);
  };

  const openDetail = (act: Activity) => {
    setDetailActivity(act);
    setDetailFotos(act.fotos || []);
    setLightboxIdx(null);
  };

  const closeDetail = () => { setDetailActivity(null); setDetailFotos([]); setLightboxIdx(null); };

  const handleDeletePhoto = async (photoId: string | number) => {
    if (!detailActivity || !onDeletePhoto || detailFotos.length <= 1) return;
    setDeletingPhotoId(photoId);
    try {
      await onDeletePhoto(photoId, detailActivity.id);
      setDetailFotos((p) => p.filter((f) => f.id !== photoId));
      if (lightboxIdx !== null && lightboxIdx >= detailFotos.length - 1) setLightboxIdx(Math.max(0, detailFotos.length - 2));
    } finally { setDeletingPhotoId(null); }
  };

  const getPhotoUrl = (foto: FotoItem) => {
    const rawUrl = foto.viewUrl || foto.url || foto.path || foto.foto || "";
    if (!rawUrl) return "";
    
    // Jika sudah memiliki prefix proxy /api-proxy atau link eksternal http
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("/api-proxy")) {
      return rawUrl;
    }

    // Jika path bertipe local uploads dari Adonis
    if (rawUrl.includes("uploads/")) {
      const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
      return `/api-proxy${cleanPath}`;
    }

    // Jika berawalan / tapi tidak memiliki prefix proxy
    if (rawUrl.startsWith("/") && !rawUrl.startsWith("/api-proxy")) {
      return `/api-proxy${rawUrl}`;
    }

    return rawUrl;
  };

  const lightboxFotos = detailFotos.filter((f) => getPhotoUrl(f));
  const currentLightbox = lightboxIdx !== null ? lightboxFotos[lightboxIdx] : null;

  return (
    <div className="w-full space-y-5">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm overflow-hidden">
        <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary-green/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5.5 h-5.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-baloo text-base font-bold text-neutral-dark leading-tight">Dokumentasi Kegiatan</h3>
              <p className="text-[11px] text-neutral-gray font-medium mt-0.5">Arsip visual kegiatan belajar mengajar untuk kebutuhan akreditasi madrasah</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-gray bg-stone-50 px-3 py-2 rounded-xl border border-neutral-gray/8">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span>{activities.length} Kegiatan</span>
            </div>
            {isAdminAdministrasi && (
              <button
                type="button"
                onClick={() => setShowActivityForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-green hover:bg-primary-dark text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98] whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Unggah Kegiatan
              </button>
            )}
          </div>
        </div>

        {/* ── FILTER & SEARCH TOOLBAR ─────────────────── */}
        <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-neutral-gray/50 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama kegiatan atau deskripsi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold text-neutral-dark placeholder:text-neutral-gray/40 transition-all"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray/40 hover:text-neutral-gray cursor-pointer">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          {/* Year Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["Semua", ...uniqueYears].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-2 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? "bg-primary-green text-white shadow-sm"
                    : "bg-stone-50 text-neutral-gray border border-neutral-gray/12 hover:border-primary-green/30 hover:text-primary-green"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────── */}
      {activities.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {(["AGENDA TAHUNAN", "AGENDA UPDATE"] as const).map((cat) => {
            const count = activities.filter((a) => a.category === cat).length;
            return (
              <div key={cat} className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${CATEGORY_DOT[cat] || "bg-stone-300"}`} />
                <div>
                  <p className="text-[10px] text-neutral-gray font-semibold leading-tight">{cat === "AGENDA TAHUNAN" ? "Agenda Tahunan" : "Agenda Update"}</p>
                  <p className="text-base font-extrabold text-neutral-dark font-baloo leading-tight">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── ACTIVITY GRID ─────────────────────────────────── */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-neutral-gray/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-neutral-dark">Tidak ada hasil</p>
          <p className="text-xs text-neutral-gray font-medium mt-1">Coba ubah filter atau kata kunci pencarian</p>
          {(searchQuery || selectedYear !== "Semua") && (
            <button type="button" onClick={() => { setSearchQuery(""); setSelectedYear("Semua"); }}
              className="mt-4 px-4 py-2 bg-primary-green text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-primary-dark transition-all">
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl border border-neutral-gray/8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Thumbnail */}
              <button
                type="button"
                onClick={() => openDetail(act)}
                className="w-full aspect-video relative overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 cursor-pointer"
              >
                {act.featuredImage ? (
                  <img src={getPhotoUrl({ url: act.featuredImage } as any)} alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Photo count badge */}
                {act.fotos && act.fotos.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {act.fotos.length}
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm text-neutral-dark font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Lihat Galeri
                  </span>
                </div>
              </button>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-4">
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9.5px] text-neutral-gray font-semibold bg-stone-50 border border-neutral-gray/10 px-2 py-0.5 rounded-md">
                      {formatDate(act.date)}
                    </span>
                    <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[act.category] || "bg-stone-50 text-stone-600 border-stone-200"}`}>
                      {act.category}
                    </span>
                  </div>

                  {(isAdminAdministrasi || isGuru) && (
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveKebabId(activeKebabId === act.id ? null : act.id)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                        </svg>
                      </button>
                      {activeKebabId === act.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveKebabId(null)} />
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-gray/10 rounded-xl shadow-xl z-30 py-1.5 overflow-hidden">
                            <button type="button" onClick={() => { openDetail(act); setActiveKebabId(null); }}
                              className="w-full px-3.5 py-2 text-left hover:bg-stone-50 cursor-pointer text-[11px] font-semibold text-neutral-dark flex items-center gap-2.5 transition-colors">
                              <svg className="w-3.5 h-3.5 text-primary-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              Kelola Foto
                            </button>
                            <button type="button" onClick={() => { setEditingActivity({ ...act }); setActiveKebabId(null); }}
                              className="w-full px-3.5 py-2 text-left hover:bg-stone-50 cursor-pointer text-[11px] font-semibold text-neutral-dark flex items-center gap-2.5 transition-colors">
                              <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              Edit Info Kegiatan
                            </button>
                            <button type="button" onClick={() => { if (onTogglePublic) onTogglePublic(act.id, !act.isPublic); setActiveKebabId(null); }}
                              className="w-full px-3.5 py-2 text-left hover:bg-stone-50 cursor-pointer text-[11px] font-semibold text-neutral-dark flex items-center gap-2.5 transition-colors">
                              <svg className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                              {act.isPublic ? "Jadikan Privat" : "Jadikan Publik"}
                            </button>
                            {/* Hapus Kegiatan — Admin Administrasi & Guru */}
                            {(isAdminAdministrasi || isGuru) && (
                              <>
                                <div className="mx-3 my-1 h-px bg-neutral-gray/8" />
                                <button type="button" onClick={() => { if (onDeleteActivity) onDeleteActivity(act.id); setActiveKebabId(null); }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-red-50 cursor-pointer text-[11px] font-semibold text-red-600 flex items-center gap-2.5 transition-colors">
                                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Hapus Kegiatan
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="font-baloo text-sm font-bold text-neutral-dark leading-snug line-clamp-2">{act.title}</h4>
                <p className="text-[11px] text-neutral-gray font-medium mt-1.5 leading-relaxed line-clamp-3 flex-1">{act.description}</p>

                {/* Footer */}
                <div className="mt-3.5 pt-3 border-t border-neutral-gray/6 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openDetail(act)}
                    className="text-[10px] font-bold text-primary-green hover:text-primary-dark flex items-center gap-1 cursor-pointer transition-colors group/btn"
                  >
                    <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {act.fotos && act.fotos.length > 0 ? `${act.fotos.length} Foto` : "Lihat Foto"}
                  </button>

                  <div className="flex items-center gap-2">
                    {act.driveLink?.startsWith("http") && (
                      <a href={act.driveLink} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-primary-green/10 flex items-center justify-center text-neutral-gray hover:text-primary-green transition-colors cursor-pointer"
                        title="Buka Google Drive">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                      </a>
                    )}
                    {(isAdminAdministrasi || isGuru) ? (
                      <button type="button" onClick={() => { if (onTogglePublic) onTogglePublic(act.id, !act.isPublic); }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-extrabold border transition-all cursor-pointer ${
                          act.isPublic ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${act.isPublic ? "bg-emerald-500" : "bg-stone-400"}`} />
                        {act.isPublic ? "Publik" : "Privat"}
                      </button>
                    ) : (
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                        act.isPublic ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-50 text-stone-500 border-stone-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${act.isPublic ? "bg-emerald-500" : "bg-stone-400"}`} />
                        {act.isPublic ? "Publik" : "Privat"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* ══════════════════════════════════════════════════════
          DETAIL PANEL — Galeri Foto Kegiatan
      ══════════════════════════════════════════════════════ */}
      {detailActivity && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={closeDetail} />
          <div className="relative ml-auto w-full max-w-2xl bg-white flex flex-col h-full shadow-2xl animate-slide-in">

            {/* Panel Header */}
            <div className="relative flex-shrink-0">
              {/* Hero image strip */}
              {detailActivity.featuredImage && (
                <div className="w-full h-40 overflow-hidden">
                  <img src={getPhotoUrl({ url: detailActivity.featuredImage } as any)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
                </div>
              )}
              {/* Close button */}
              <button type="button" onClick={closeDetail}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-dark hover:bg-white cursor-pointer transition-colors shadow-md z-10">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Info block */}
              <div className={`px-6 py-4 border-b border-neutral-gray/8 ${detailActivity.featuredImage ? "bg-white" : "bg-[#FAF8F5] pt-14"}`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[9px] font-semibold bg-stone-100 text-neutral-gray px-2.5 py-1 rounded-lg border border-neutral-gray/8">
                    📅 {formatDate(detailActivity.date)}
                  </span>
                  <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-md border ${CATEGORY_COLORS[detailActivity.category] || "bg-stone-50 text-stone-600 border-stone-200"}`}>
                    {detailActivity.category}
                  </span>
                  <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    detailActivity.isPublic ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-stone-50 text-stone-500 border-stone-200"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${detailActivity.isPublic ? "bg-emerald-500" : "bg-stone-400"}`} />
                    {detailActivity.isPublic ? "Publik" : "Privat"}
                  </span>
                </div>
                <h3 className="font-baloo text-lg font-bold text-neutral-dark leading-snug">{detailActivity.title}</h3>
                <p className="text-[11px] text-neutral-gray font-medium mt-1 leading-relaxed line-clamp-2">{detailActivity.description}</p>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 bg-white border-b border-neutral-gray/8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-bold text-neutral-dark">
                    Galeri Foto
                    <span className="ml-1.5 text-[9px] font-bold bg-primary-green/10 text-primary-green px-2 py-0.5 rounded-full">{detailFotos.length} foto</span>
                  </span>
                </div>
                {(isAdminAdministrasi || isGuru) && detailFotos.length > 0 && (
                  <span className={`text-[9px] font-semibold flex items-center gap-1 ${detailFotos.length <= 1 ? "text-amber-600" : "text-neutral-gray/60"}`}>
                    {detailFotos.length <= 1 ? (
                      <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>Foto terakhir tidak bisa dihapus</>
                    ) : "Hover pada foto untuk menghapus"}
                  </span>
                )}
              </div>
            </div>

            {/* Photo Grid — Scrollable */}
            <div className="flex-1 overflow-y-auto p-5">
              {detailFotos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-neutral-gray/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-neutral-dark">Belum ada foto</p>
                  <p className="text-xs text-neutral-gray font-medium mt-1">Unggah foto melalui form tambah kegiatan</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {detailFotos.map((foto, idx) => {
                    const url = getPhotoUrl(foto);
                    const isDeleting = deletingPhotoId === foto.id;
                    const isLastPhoto = detailFotos.length <= 1;
                    const isCover = foto.isDefault || foto.isThumbnail || idx === 0;
                    return (
                      <div key={foto.id ?? idx}
                        className="relative group rounded-xl overflow-hidden border border-neutral-gray/8 bg-stone-50 aspect-square cursor-pointer"
                        onClick={() => { if (url) setLightboxIdx(lightboxFotos.findIndex((f) => f.id === foto.id)); }}
                      >
                        {url ? (
                          <img src={url} alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-400" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-neutral-gray/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" /></svg>
                          </div>
                        )}

                        {/* Cover badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 bg-primary-green text-white text-[7.5px] font-black px-2 py-0.5 rounded-md tracking-wide uppercase shadow-sm">
                            Sampul
                          </div>
                        )}

                        {/* Hover overlay */}
                        {(isAdminAdministrasi || isGuru) && (
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-200 flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}>
                            {/* View button */}
                            <button type="button"
                              onClick={(e) => { e.stopPropagation(); if (url) setLightboxIdx(lightboxFotos.findIndex((f) => f.id === foto.id)); }}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 w-9 h-9 bg-white/90 hover:bg-white text-neutral-dark rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                              title="Perbesar foto">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </button>
                            {/* Delete button */}
                            <button type="button"
                              onClick={(e) => { e.stopPropagation(); handleDeletePhoto(foto.id); }}
                              disabled={isDeleting || isLastPhoto}
                              className={`opacity-0 group-hover:opacity-100 transition-all duration-200 w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
                                isLastPhoto ? "bg-stone-400/80 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 cursor-pointer"
                              } text-white`}
                              title={isLastPhoto ? "Foto terakhir tidak bisa dihapus" : "Hapus foto ini"}>
                              {isDeleting ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-gray/8 bg-[#FAF8F5] flex items-center gap-3">
              {detailActivity.driveLink?.startsWith("http") && (
                <a href={detailActivity.driveLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-gray/12 bg-white hover:bg-stone-50 text-neutral-dark rounded-xl text-xs font-bold cursor-pointer transition-all">
                  <svg className="w-3.5 h-3.5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  Google Drive
                </a>
              )}
              <button type="button" onClick={closeDetail}
                className="flex-1 py-2.5 bg-neutral-dark hover:bg-black text-white font-bold text-xs rounded-xl cursor-pointer transition-all">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════
          LIGHTBOX — Fullscreen dengan navigasi
      ══════════════════════════════════════════════════════ */}
      {lightboxIdx !== null && currentLightbox && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center animate-fade-in" onClick={() => setLightboxIdx(null)}>
          {/* Close */}
          <button type="button" onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors z-10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {/* Counter */}
          <div className="absolute top-4 left-4 text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-lg">
            {lightboxIdx + 1} / {lightboxFotos.length}
          </div>
          {/* Prev */}
          {lightboxFotos.length > 1 && lightboxIdx > 0 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {/* Next */}
          {lightboxFotos.length > 1 && lightboxIdx < lightboxFotos.length - 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
          {/* Main image */}
          <img src={getPhotoUrl(currentLightbox)} alt="Foto kegiatan"
            className="max-w-[88vw] max-h-[88vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} />
          {/* Thumbnail strip */}
          {lightboxFotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-1">
              {lightboxFotos.map((f, i) => (
                <button key={f.id ?? i} type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-all ${i === lightboxIdx ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-90"}`}>
                  <img src={getPhotoUrl(f)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}


      {/* ══════════════════════════════════════════════════════
          UPLOAD DRAWER
      ══════════════════════════════════════════════════════ */}
      {showActivityForm && isAdminAdministrasi && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => { setShowActivityForm(false); resetUploadForm(); }} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl h-full animate-slide-in">
              <div className="px-6 py-5 border-b border-neutral-gray/8 flex justify-between items-center bg-[#FAF8F5]">
                <div>
                  <h4 className="font-baloo text-sm font-bold text-neutral-dark">Unggah Dokumentasi Baru</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Isi semua informasi kegiatan di bawah ini</p>
                </div>
                <button type="button" onClick={() => { setShowActivityForm(false); resetUploadForm(); }}
                  className="w-7 h-7 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Nama */}
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
                  <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-semibold text-neutral-dark placeholder:text-neutral-gray/30 transition-all"
                    placeholder="Contoh: Peringatan Hari Santri Nasional 2026" />
                </div>
                {/* Date + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Tanggal <span className="text-red-500">*</span></label>
                    <input type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-semibold text-neutral-dark transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Kategori</label>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-semibold text-neutral-dark transition-all">
                      <option value="AGENDA TAHUNAN">Agenda Tahunan</option>
                      <option value="AGENDA UPDATE">Agenda Update</option>
                    </select>
                  </div>
                </div>
                {/* File upload */}
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Foto Dokumentasi <span className="text-red-500">*</span></label>
                  <label className="w-full p-6 border-2 border-dashed rounded-xl bg-stone-50 hover:bg-white hover:border-primary-green transition-all flex flex-col items-center justify-center cursor-pointer group">
                    <input type="file" multiple accept="image/*" required={previewUrls.length === 0} onChange={handleFileChange} className="sr-only" />
                    <div className="w-10 h-10 rounded-xl bg-primary-green/10 group-hover:bg-primary-green/20 flex items-center justify-center mb-2 transition-colors">
                      <svg className="w-5 h-5 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-neutral-dark">Klik atau seret foto ke sini</p>
                    <p className="text-[9px] text-neutral-gray font-medium mt-0.5">JPG, PNG, WEBP — bisa pilih banyak sekaligus</p>
                  </label>
                </div>
                {/* Preview */}
                {previewUrls.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide">Pratinjau ({previewUrls.length})</span>
                      <span className="text-[9px] text-primary-green font-bold">★ Foto pertama = Sampul</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative w-18 h-18 rounded-xl overflow-hidden border-2 border-neutral-gray/10 flex-shrink-0 w-[72px] h-[72px]">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {idx === 0 && <div className="absolute bottom-0 inset-x-0 bg-primary-green text-white text-[6.5px] font-black py-0.5 text-center uppercase tracking-wider">Sampul</div>}
                          <button type="button" onClick={() => handleRemovePreview(idx)}
                            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] hover:bg-red-600 cursor-pointer shadow-sm">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Description */}
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Deskripsi <span className="text-red-500">*</span></label>
                  <textarea required rows={4} value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-medium text-neutral-dark resize-none leading-relaxed placeholder:text-neutral-gray/30 transition-all"
                    placeholder="Ringkasan jalannya acara, tujuan kegiatan..." />
                </div>
                {/* Submit */}
                <div className="flex gap-2.5 pt-2 sticky bottom-0 bg-white pb-1">
                  <button type="submit" disabled={isSubmitting || !newTitle || !newDate || !newDesc || selectedFiles.length === 0}
                    className="flex-1 py-3 bg-primary-green hover:bg-primary-dark disabled:bg-neutral-gray/20 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl cursor-pointer transition-all">
                    {isSubmitting ? "Menyimpan..." : "Simpan Kegiatan"}
                  </button>
                  <button type="button" onClick={() => { setShowActivityForm(false); resetUploadForm(); }}
                    className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-sm rounded-xl cursor-pointer transition-all">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════
          EDIT DRAWER
      ══════════════════════════════════════════════════════ */}
      {editingActivity && (isAdminAdministrasi || isGuru) && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setEditingActivity(null)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl h-full animate-slide-in">
              <div className="px-6 py-5 border-b border-neutral-gray/8 flex justify-between items-center bg-[#FAF8F5]">
                <div>
                  <h4 className="font-baloo text-sm font-bold text-neutral-dark">Edit Info Kegiatan</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5 truncate max-w-[220px]">{editingActivity.title}</p>
                </div>
                <button type="button" onClick={() => setEditingActivity(null)}
                  className="w-7 h-7 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
                  <input type="text" required value={editingActivity.title}
                    onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-semibold text-neutral-dark transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Tanggal <span className="text-red-500">*</span></label>
                    <input type="date" required value={editingActivity.date}
                      onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-semibold text-neutral-dark transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Kategori</label>
                    <select value={editingActivity.category}
                      onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-semibold text-neutral-dark transition-all">
                      <option value="AGENDA TAHUNAN">Agenda Tahunan</option>
                      <option value="AGENDA UPDATE">Agenda Update</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Link Google Drive</label>
                  <input type="url" value={editingActivity.driveLink}
                    onChange={(e) => setEditingActivity({ ...editingActivity, driveLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-medium text-neutral-dark transition-all"
                    placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-neutral-gray/70 uppercase tracking-wide mb-1.5">Deskripsi <span className="text-red-500">*</span></label>
                  <textarea required rows={5} value={editingActivity.description}
                    onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/15 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-sm font-medium text-neutral-dark resize-none leading-relaxed transition-all" />
                </div>
                <div className="flex gap-2.5 pt-2 sticky bottom-0 bg-white pb-1">
                  <button type="submit" className="flex-1 py-3 bg-primary-green hover:bg-primary-dark text-white font-bold text-sm rounded-xl cursor-pointer transition-all">
                    Simpan Perubahan
                  </button>
                  <button type="button" onClick={() => setEditingActivity(null)}
                    className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-sm rounded-xl cursor-pointer transition-all">
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
