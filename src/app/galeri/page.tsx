"use client";

import { useState } from "react";
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
const initialGalleryItems: GalleryItem[] = [
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
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === "Semua"
    ? initialGalleryItems
    : initialGalleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Warm Shapes */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-soft-mint/40 rounded-full blur-2xl -z-10" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="bg-primary-green/10 text-primary-green text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary-green/20">
            Dokumentasi Sekolah
          </span>
          <h1 className="font-baloo text-4xl md:text-5xl font-bold text-neutral-dark leading-tight">
            Galeri Kegiatan <span className="text-primary-green">Sahabat Cilik</span>
          </h1>
          <p className="text-sm font-semibold text-neutral-gray leading-relaxed">
            Intip momen-momen seru, ceria, dan penuh inspirasi anak-anak dalam belajar dan mengeksplorasi dunia di KB/RA Sahabat Berbah.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-neutral-gray/10 pb-6 max-w-xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary-green text-white border-2 border-primary-green shadow-sm"
                  : "bg-white text-neutral-gray border-2 border-stone-200/60 hover:text-neutral-dark hover:border-stone-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActivePhoto(item)}
                className="bg-white rounded-3xl overflow-hidden border border-primary-green/10 shadow-xs hover:shadow-md cursor-pointer group transform hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-[10px] text-white font-extrabold tracking-wider bg-primary-green px-2.5 py-1 rounded-lg">
                      Perbesar Foto 🔍
                    </span>
                  </div>
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-neutral-dark text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-primary-green/10">
                    {item.category}
                  </span>
                </div>

                {/* Content Panel */}
                <div className="p-5 space-y-2">
                  <span className="text-[9px] text-neutral-gray font-bold block">{item.date}</span>
                  <h3 className="font-baloo text-base font-bold text-neutral-dark group-hover:text-primary-green transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-gray leading-relaxed font-semibold">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-primary-green/10 p-8 max-w-sm mx-auto space-y-3">
            <span className="text-3xl">📷</span>
            <h4 className="font-baloo text-base font-bold text-neutral-dark">Belum Ada Foto</h4>
            <p className="text-xs text-neutral-gray font-semibold">
              Kategori kegiatan ini belum memiliki dokumentasi foto yang diunggah.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Overlay */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePhoto(null)}
              className="absolute inset-0 bg-neutral-dark/85 backdrop-blur-xs"
            />

            {/* Photo Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden border border-primary-green/10 w-full max-w-2xl relative shadow-2xl flex flex-col md:flex-row z-10 max-h-[85vh] md:max-h-[70vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>

              {/* Photo Area */}
              <div className="flex-1 bg-stone-900 relative min-h-[30vh] md:min-h-0">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Information Area */}
              <div className="w-full md:w-72 p-6 flex flex-col justify-between bg-[#FAF8F5] border-t md:border-t-0 md:border-l border-primary-green/10">
                <div className="space-y-4">
                  <div>
                    <span className="bg-primary-green/10 text-primary-green text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-primary-green/20">
                      {activePhoto.category}
                    </span>
                    <span className="text-[10px] text-neutral-gray font-bold block mt-2">{activePhoto.date}</span>
                  </div>
                  <h3 className="font-baloo text-lg font-bold text-neutral-dark leading-snug">
                    {activePhoto.title}
                  </h3>
                  <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                    {activePhoto.description}
                  </p>
                </div>

                <div className="pt-6 md:pt-0">
                  <button
                    onClick={() => setActivePhoto(null)}
                    className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
                  >
                    Tutup Detail
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
