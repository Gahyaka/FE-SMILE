"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { initialActivities } from "@/app/portal-belajar/dashboard/mockData";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  date: string;
}

// Convert dynamic curated activities into Gallery items format
const initialGalleryItems: GalleryItem[] = initialActivities
  .filter(act => act.isPublishedToGallery && act.featuredImage)
  .map(act => ({
    id: act.id,
    title: act.title,
    category: act.category,
    image: act.featuredImage || "",
    description: act.description,
    date: act.date
  }));

const categories = ["Semua", "Akademik", "Keagamaan", "Ekstrakurikuler"];

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === "Semua"
    ? initialGalleryItems
    : initialGalleryItems.filter(item => item.category === selectedCategory);

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
          {categories.map((cat) => (
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => setLightboxIndex(index)}
                className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden border border-primary-green/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] cursor-pointer group transform hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo Element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />

                {/* Minimalist Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 space-y-1 text-white">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-primary-green px-2 py-0.5 rounded self-start">
                    {item.category}
                  </span>
                  <h3 className="font-baloo text-sm font-bold leading-tight">
                    {item.title}
                  </h3>
                  <span className="text-[8px] opacity-75 font-semibold">{item.date}</span>
                </div>

                {/* Constant small label (Visible when not hovered) */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-primary-green/5 text-[9px] font-bold text-neutral-dark group-hover:opacity-0 transition-opacity duration-200">
                  {item.title}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-primary-green/10 p-8 max-w-sm mx-auto space-y-3">
            <span className="text-3xl">📷</span>
            <h4 className="font-baloo text-base font-bold text-neutral-dark">Belum Ada Foto</h4>
            <p className="text-xs text-neutral-gray font-semibold">
              Kategori kegiatan ini belum memiliki dokumentasi foto yang diunggah.
            </p>
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
