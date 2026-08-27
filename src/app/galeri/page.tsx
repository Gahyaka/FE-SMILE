"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { initialActivities } from "@/app/portal-belajar/dashboard/mockData";
import { activityService } from "@/services/activity";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  date: string;
}

const getPhotoUrl = (rawUrl: string) => {
  if (!rawUrl) return "";

  // Jika link Google Drive (lh3.googleusercontent.com / drive.google.com), gunakan server-side proxy
  if (rawUrl.includes("googleusercontent.com") || rawUrl.includes("drive.google.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
  }
  
  // Jika mengandung host backend local atau production
  if (rawUrl.includes("localhost:3333") || rawUrl.includes("127.0.0.1:3333") || rawUrl.includes("be-smile-production.up.railway.app")) {
    const pathOnly = rawUrl.replace(/^https?:\/\/[^\/]+/, "");
    return `/api-proxy${pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`}`;
  }

  // Jika sudah memiliki prefix proxy /api-proxy
  if (rawUrl.startsWith("/api-proxy")) {
    return rawUrl;
  }

  // Jika mengandung uploads/
  if (rawUrl.includes("uploads/")) {
    const pathOnly = rawUrl.includes("http") ? rawUrl.replace(/^https?:\/\/[^\/]+/, "") : rawUrl;
    const cleanPath = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
    return `/api-proxy${cleanPath}`;
  }

  // Jika link eksternal http (seperti google drive atau unsplash)
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  // Jika berawalan / tapi tidak memiliki prefix proxy
  if (rawUrl.startsWith("/") && !rawUrl.startsWith("/api-proxy")) {
    return `/api-proxy${rawUrl}`;
  }

  return rawUrl;
};

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic category list built from fetched activities
  const categoriesList = useMemo(() => {
    return ["Semua", ...Array.from(new Set(galleryItems.map(item => item.category)))];
  }, [galleryItems]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await activityService.getPublicGallery();
        const rawAct = res && Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        const items: GalleryItem[] = rawAct.map((item: any) => {
          // Cari URL gambar cover dari relasi fotos
          const fotosArr = Array.isArray(item.foto) ? item.foto
            : Array.isArray(item.fotos) ? item.fotos
            : [];
          const thumbnail = (fotosArr && fotosArr.length > 0) 
            ? (fotosArr.find((f: any) => f.isDefault || f.isThumbnail) || fotosArr[0]) 
            : null;
          const rawCoverUrl = thumbnail?.viewUrl || thumbnail?.url || thumbnail?.path || thumbnail?.foto || item.foto || item.image || "";
          
          const imageUrl = rawCoverUrl 
            ? getPhotoUrl(rawCoverUrl)
            : "https://images.unsplash.com/photo-1590076214561-2679be15bb56?auto=format&fit=crop&q=80&w=800";

          // Format tanggal ke format profesional Indonesia: contoh "25 Agustus 2026"
          let formattedDate = "";
          const rawDateStr = item.tanggalKegiatan || item.date;
          if (rawDateStr) {
            try {
              const cleanDateStr = rawDateStr.split("T")[0];
              formattedDate = new Date(cleanDateStr).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              });
            } catch (dateErr) {
              formattedDate = rawDateStr.split("T")[0];
            }
          }

          return {
            id: item.id,
            title: item.namaKegiatan || item.title || "Kegiatan Madrasah",
            description: item.deskripsi || item.description || "",
            date: formattedDate,
            image: imageUrl,
            category: item.kategori || item.category || "AGENDA TAHUNAN",
            driveLink: item.folderGdriveUrl || item.gdriveFolderUrl || item.driveLink || ""
          };
        });
        setGalleryItems(items);
      } catch (err) {
        console.warn("[SGW] Failed to fetch activities from backend. Using mock fallback.");
        const stored = localStorage.getItem("sgw_activities");
        const activeActs = stored ? JSON.parse(stored) : initialActivities;
        const items: GalleryItem[] = activeActs.map((act: any) => ({
          id: act.id,
          title: act.title || act.namaKegiatan || "Kegiatan Madrasah",
          category: act.category || "Keagamaan",
          image: act.featuredImage || act.image || "https://images.unsplash.com/photo-1590076214561-2679be15bb56?auto=format&fit=crop&q=80&w=800",
          description: act.description || act.deskripsi || "",
          date: act.date || act.tanggalKegiatan || ""
        }));
        setGalleryItems(items);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const filteredItems = selectedCategory === "Semua"
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  // Handle keyboard navigations for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] select-none flex flex-col">
      
      {/* HEADER SECTION (Consistent with other public pages) */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-16 text-center overflow-hidden border-b border-soft-mint pt-32">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
        {/* Swirly background doodles */}
        <div className="absolute top-28 left-10 text-warm-yellow/30 text-5xl select-none font-bold hidden md:block">★</div>
        <div className="absolute bottom-6 right-12 text-primary-green/20 text-5xl select-none font-bold hidden md:block">★</div>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs uppercase font-extrabold text-primary-dark tracking-widest bg-soft-mint px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] border-2 border-dashed border-primary-green/30">
            Dokumentasi Kegiatan
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Galeri Foto <span className="text-primary-green relative">KB/RA Sahabat
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Eksplorasi visual aktivitas harian anak-anak didik kami. Klik foto untuk melihat slideshow layar penuh.
          </p>
        </div>
      </section>

      {/* GALLERY GRID SECTION */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-16 space-y-12">

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200/40 pb-6 max-w-xl mx-auto">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary-green text-white border-2 border-primary-green shadow-xs"
                  : "bg-white text-neutral-gray border-2 border-stone-200/50 hover:text-neutral-dark hover:border-stone-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pure Visual Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // 3 Polaroid Shimmer Skeletons
              Array.from({ length: 3 }).map((_, idx) => (
                <div 
                  key={`skeleton-${idx}`}
                  className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/10 shadow-3xs relative flex flex-col justify-between animate-pulse"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/20 rotate-[-1deg] shadow-3xs pointer-events-none"></div>
                  <div className="w-full aspect-[4/3] rounded-md bg-stone-200/50" />
                  <div className="mt-4 space-y-2 flex flex-col items-center">
                    <div className="w-3/4 h-4 bg-stone-200/50 rounded-md" />
                    <div className="w-1/2 h-3 bg-stone-200/40 rounded-md" />
                  </div>
                </div>
              ))
            ) : (
              filteredItems.map((item, index) => {
                // Alternate rotation angles for polaroid organic feel
                const rotationClass = 
                  index % 3 === 0 
                    ? "rotate-[-1.5deg] hover:rotate-[1deg]" 
                    : index % 3 === 1 
                      ? "rotate-[2deg] hover:rotate-[-1deg]" 
                      : "rotate-[-1deg] hover:rotate-[2deg]";

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setLightboxIndex(index)}
                    className={`bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative hover:shadow-md transition-all duration-300 cursor-pointer ${rotationClass}`}
                  >
                    {/* Polaroid tape */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[-1deg] shadow-3xs pointer-events-none z-20"></div>

                    {/* Photo Container */}
                    <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-stone-100 relative group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Category tag */}
                      <span className="absolute top-2 left-2 bg-white/95 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary-green/10 text-neutral-dark shadow-3xs">
                        {item.category}
                      </span>
                    </div>

                    {/* Description under polaroid */}
                    <div className="mt-4 text-center space-y-1">
                      <h4 className="font-baloo text-base font-bold text-neutral-dark leading-tight group-hover:text-primary-green transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-neutral-gray font-semibold">
                        Diambil pada {item.date}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State (Only show when not loading) */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12 px-6 bg-[#FAF8F5] rounded-3xl border-2 border-dashed border-primary-green/20 max-w-md mx-auto space-y-5 shadow-3xs animate-fade-in">
            {/* Premium Camera SVG Icon */}
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xs border border-primary-green/10">
              <svg className="w-8 h-8 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316A2.192 2.192 0 0014.512 4H9.488c-.696 0-1.332.327-1.745.889l-.916 1.286z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-baloo text-lg font-bold text-neutral-dark">Momen Seru Sedang Bersiap</h4>
              <p className="text-xs text-neutral-gray leading-relaxed max-w-xs mx-auto font-medium">
                Belum ada dokumentasi kegiatan yang dipublikasikan untuk kategori ini. Hubungi admin atau nantikan pembaruan seru lainnya!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pure Full-Screen Lightbox Slideshow */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xs select-none">
            {/* Backdrop Dismiss Trigger */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setLightboxIndex(null)}
            />

            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg cursor-pointer transition-colors"
              title="Tutup (Esc)"
            >
              ✕
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl cursor-pointer transition-colors"
              title="Sebelumnya (Panah Kiri)"
            >
              ‹
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl cursor-pointer transition-colors"
              title="Berikutnya (Panah Kanan)"
            >
              ›
            </button>

            {/* Slide Container */}
            <div className="relative w-full max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center z-10 space-y-4">
              <motion.img
                key={filteredItems[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="max-w-full max-h-[72vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              />

              {/* Minimalist Info Caption */}
              <div className="text-center text-white space-y-1 px-4 max-w-xl">
                <span className="text-[9px] uppercase font-black tracking-widest text-primary-green bg-primary-green/10 px-2 py-0.5 rounded border border-primary-green/20">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h4 className="font-baloo text-base font-bold mt-1.5">
                  {filteredItems[lightboxIndex].title}
                </h4>
                <p className="text-[10px] text-neutral-gray leading-relaxed font-semibold">
                  {filteredItems[lightboxIndex].description}
                </p>
                <span className="text-[9px] text-stone-500 font-bold block mt-1">
                  Foto {lightboxIndex + 1} dari {filteredItems.length} • Diambil pada {filteredItems[lightboxIndex].date}
                </span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
