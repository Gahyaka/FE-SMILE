"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  date: string;
}

// Data dummy galeri awal yang mewakili kegiatan KB/RA Sahabat
export const initialGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Belajar Membaca Al-Qur'an",
    category: "Keagamaan",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800",
    description: "Kegiatan rutin mengaji pagi hari dengan metode Iqro yang interaktif.",
    date: "12 Agustus 2026",
  },
  {
    id: 2,
    title: "Kegiatan Outbound Kebun Binatang",
    category: "Outbound",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    description: "Mengenal satwa secara langsung dan melatih ketangkasan motorik kasar anak.",
    date: "5 Juli 2026",
  },
  {
    id: 3,
    title: "Pentas Seni Akhir Tahun",
    category: "Pentas Seni",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    description: "Penampilan tarian daerah dan hafalan surah pendek oleh murid kelas RA (B).",
    date: "20 Juni 2026",
  },
  {
    id: 4,
    title: "Praktik Melukis dengan Jari",
    category: "Pembelajaran",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    description: "Mengasah kreativitas dan motorik halus melalui kreasi lukisan cat air.",
    date: "1 Agustus 2026",
  },
  {
    id: 5,
    title: "Peringatan Hari Kemerdekaan",
    category: "Pentas Seni",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800",
    description: "Keseruan lomba membawa kelereng dengan sendok antar murid KB dan RA.",
    date: "15 Agustus 2026",
  },
  {
    id: 6,
    title: "Manasik Haji Cilik",
    category: "Keagamaan",
    image: "https://images.unsplash.com/photo-1590076214561-2679be15bb56?auto=format&fit=crop&q=80&w=800",
    description: "Edukasi nilai-nilai keagamaan sejak dini dengan simulasi ibadah haji lengkap.",
    date: "18 Mei 2026",
  },
];

const categories = ["Semua", "Pembelajaran", "Outbound", "Keagamaan", "Pentas Seni"];

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
    <div className="w-full min-h-screen bg-[#FAF8F5] pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-[#E7F8EA]/30 rounded-full blur-2xl -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div>
            <span className="inline-block bg-primary-green/10 text-primary-green text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary-green/20 mb-3.5">
              Dokumentasi Kegiatan
            </span>
            <h1 className="font-baloo text-3xl md:text-5xl font-bold text-neutral-dark tracking-tight leading-tight">
              Galeri Foto <span className="text-primary-green">KB/RA Sahabat</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-gray leading-relaxed mt-2.5">
              Eksplorasi visual aktivitas harian anak-anak didik kami. Klik foto untuk melihat slideshow layar penuh.
            </p>
          </div>
        </div>

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
