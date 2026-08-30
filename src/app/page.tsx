"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { initialActivities } from "@/app/portal-belajar/dashboard/mockData";
import { activityService } from "@/services/activity";

const getPhotoUrl = (rawUrl: string) => {
  if (!rawUrl) return "";

  // Jika link Google Drive (lh3.googleusercontent.com / drive.google.com), gunakan server-side proxy
  if (rawUrl.includes("googleusercontent.com") || rawUrl.includes("drive.google.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(rawUrl)}&v=2`;
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

export default function HomePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    childName: "",
    parentName: "",
    phone: "",
    classType: "RA",
  });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await activityService.getPublicGallery();
        const rawAct = res && Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        const items = rawAct.map((item: any) => {
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
        setGalleryItems(items.slice(0, 3));
      } catch (err) {
        console.warn("[SGW] Failed to fetch activities from backend. Using mock fallback.");
        const stored = localStorage.getItem("sgw_activities");
        const activeActs = stored ? JSON.parse(stored) : initialActivities;
        const items = activeActs.slice(0, 3).map((act: any) => ({
          id: act.id,
          title: act.title || act.namaKegiatan || "Kegiatan Madrasah",
          category: act.category || "Keagamaan",
          image: act.featuredImage || act.image || "https://images.unsplash.com/photo-1590076214561-2679be15bb56?auto=format&fit=crop&q=80&w=800",
          description: act.description || act.deskripsi || "",
          date: act.date || act.tanggalKegiatan || ""
        }));
        setGalleryItems(items);
      }
    };

    fetchActivities();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ childName: "", parentName: "", phone: "", classType: "RA" });
      alert("Terima kasih! Formulir PPDB awal berhasil dikirim. Admin RA Sahabat akan segera menghubungi Anda.");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark select-none bg-[#FAF8F5] pt-20">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-white pt-24 pb-20 overflow-hidden">
        {/* Subtle dot-grid overlay background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(44,178,74,0.015)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-primary-green bg-primary-green/8 px-4 py-2 rounded-full border border-primary-green/10">
                Pendaftaran PPDB TA 2026/2027 Dibuka!
              </span>
              <h1 className="font-baloo text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark leading-tight">
                Membentuk Generasi <span className="text-primary-green">Cerdas</span> & Berkarakter Islami
              </h1>
              <p className="text-sm sm:text-base text-neutral-gray max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                RA Sahabat berkomitmen memuliakan setiap anak melalui pendekatan Pembelajaran Mendalam (PM) dengan Kurikulum Berbasis Cinta yang berlandaskan suasana belajar yang berkesadaran, bermakna, dan menggembirakan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <a
                  href="#ppdb"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-sm hover:shadow-md"
                >
                  Daftar PPDB Online
                </a>
                <Link
                  href="/galeri"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white hover:bg-stone-50 text-neutral-dark font-extrabold text-base transition-all shadow-xs border border-neutral-gray/12"
                >
                  Lihat Dokumentasi Kegiatan
                </Link>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 relative w-full aspect-square max-w-[330px] mx-auto flex items-center justify-center p-4 lg:-mt-12 mt-16">
              <style>{`
                @keyframes slow-scale-pulse {
                  0%, 100% { transform: scale(0.96); }
                  50% { transform: scale(1.04); }
                }
                @keyframes slow-float-y {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
                @keyframes slow-float-x {
                  0%, 100% { transform: translateX(0); }
                  50% { transform: translateX(8px); }
                }
                .custom-pulse-bg {
                  animation: slow-scale-pulse 7s ease-in-out infinite;
                }
                .custom-float-y {
                  animation: slow-float-y 4s ease-in-out infinite;
                }
                .custom-float-x {
                  animation: slow-float-x 5s ease-in-out infinite;
                }
              `}</style>

              {/* Outer soft glowing backdrop circle */}
              <div className="absolute inset-0 bg-[#E7F8EA]/30 rounded-full border border-primary-green/8 pointer-events-none custom-pulse-bg blur-xs"></div>
              
              {/* Logo image container */}
              <div className="w-[85%] aspect-square rounded-full border border-neutral-gray/8 overflow-hidden bg-white shadow-lg z-10 relative">
                <img
                  src="/images/logo.jpg"
                  alt="Logo RA Sahabat"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Doodles around logo - soft SVG badges */}
              <svg className="absolute -top-4 -right-4 w-7 h-7 text-warning/20 z-20 pointer-events-none custom-float-y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FAF8F5" stroke="#F5A623" opacity="0.6" />
              </svg>

              <svg className="absolute -top-8 -left-8 w-10 h-7 text-secondary/15 z-20 pointer-events-none custom-float-x" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10,40 C10,25 30,20 40,25 C50,15 75,20 75,35 C85,35 95,45 85,55 H15 C5,55 5,45 10,40 Z" fill="#F2E6F5" stroke="#7A2E8F" opacity="0.4" />
              </svg>

              <svg className="absolute -bottom-6 -left-6 w-7 h-7 text-accent/25 z-20 pointer-events-none custom-float-y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="8" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="12" cy="16" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="8" cy="12" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="16" cy="12" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="12" cy="12" r="3" fill="#EC1E8C" opacity="0.4" />
              </svg>

              <svg className="absolute -bottom-8 -right-8 w-8 h-8 text-primary-green/15 z-20 pointer-events-none custom-float-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L2 8.66L11.5 12.5L16 21L22 2Z" fill="#E7F8EA" stroke="#2CB24A" opacity="0.4" />
                <path d="M11.5 12.5L22 2" stroke="#2CB24A" strokeDasharray="2 1" opacity="0.4" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* PROFIL LEMBAGA SECTION */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-b border-neutral-gray/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Sejarah & Visi Misi */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-secondary bg-secondary/8 px-4 py-2 rounded-full border border-secondary/10">
                Profil Sekolah
              </span>
              <h2 className="font-baloo text-3xl sm:text-4xl font-bold text-neutral-dark">
                Pendidikan Islami yang Hangat, Ramah, dan Ceria
              </h2>
              <p className="text-sm text-neutral-gray leading-relaxed font-medium">
                **RA Sahabat** merupakan lembaga pendidikan jenjang TK di Tlogowono, Tegaltirto, Berbah, Sleman, Yogyakarta yang berada di bawah naungan Yayasan Rumah Sahabat Kita dan Kemenag Kabupaten Sleman. Kami mengimplementasikan Pembelajaran Mendalam (PM) dengan mengoptimalkan seluruh potensi anak (olah pikir, olah hati, olah rasa, dan olah raga).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-6 bg-stone-50/60 rounded-2xl border border-neutral-gray/8">
                  <h4 className="font-baloo text-base font-bold text-primary-dark mb-2">Visi RA Sahabat</h4>
                  <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                    "Terwujudnya generasi Qur’ani yang CERIA (Cerdas, Riang, Berakhlaq Mulia) serta cinta tanah air"
                  </p>
                </div>
                <div className="p-6 bg-stone-50/60 rounded-2xl border border-neutral-gray/8">
                  <h4 className="font-baloo text-base font-bold text-secondary-dark mb-2">Kurikulum Berbasis Cinta (Panca Cinta)</h4>
                  <ul className="text-xs text-neutral-gray font-semibold leading-relaxed list-disc list-inside space-y-1">
                    <li>Cinta Allah dan Rasul-Nya</li>
                    <li>Cinta Ilmu</li>
                    <li>Cinta Lingkungan</li>
                    <li>Cinta Diri & Sesama Manusia</li>
                    <li>Cinta Tanah Air</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right side: Akreditasi & Guru Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-neutral-gray/8 shadow-sm relative">
                <h3 className="font-baloo text-lg font-bold text-primary-dark mb-5 text-center">Fakta RA Sahabat</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-gray/6 pb-2.5">
                    <span className="text-xs font-bold text-neutral-dark">Kapasitas Pendidik</span>
                    <span className="text-xs font-extrabold text-secondary">7 Staf & Guru Berdedikasi</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-gray/6 pb-2.5">
                    <span className="text-xs font-bold text-neutral-dark">Penyelenggara</span>
                    <span className="text-xs font-extrabold text-primary-green">Yayasan Rumah Sahabat Kita</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-gray/6 pb-2.5">
                    <span className="text-xs font-bold text-neutral-dark">Status Akreditasi</span>
                    <span className="text-xs font-extrabold text-accent">Terakreditasi B</span>
                  </div>
                  <p className="text-[10px] text-neutral-gray leading-relaxed font-bold text-center mt-4">
                    *Alamat: Tlogowono RT 06/RW 05, Tegaltirto, Berbah, Sleman, DIY.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KEUNGGULAN PROGRAM SECTION */}
      <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-accent bg-accent/8 px-4 py-2 rounded-full border border-accent/10">
              Keunggulan Kami
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Mengapa Memilih KB/RA Sahabat?</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Kami menyusun ekosistem belajar ramah anak yang seimbang antara kecerdasan kognitif dan akhlakul karimah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-gray/8 hover:shadow-md transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 text-secondary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m18-13C19.168 5.477 17.586 5 15.8 5c-1.747 0-3.332.477-4.5 1.253v13C12.5 18.5 14.086 18 15.8 18c1.74 0 3.33.477 4.5 1.253V6.253z" />
                  </svg>
                </div>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Pembelajaran Mendalam (PM)</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                  Pendekatan yang menekankan pada penciptaan suasana belajar yang berkesadaran, bermakna, dan menggembirakan secara terpadu.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-gray/8 hover:shadow-md transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-green"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-green/10 flex items-center justify-center mb-5 text-primary-green">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">7 Kebiasaan Anak Indonesia Hebat</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                  Menerapkan kerangka karakter praktis harian: bangun pagi, beribadah, berolahraga, makan sehat, gemar belajar, hingga bermasyarakat.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-gray/8 hover:shadow-md transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 text-accent">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Program Unggulan Keagamaan</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                  Tahfidz Qur'an Yanbu'a dengan metode setoran "one day one ayat", sholat dhuha berjamaah, dan simulasi manasik haji.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI KEGIATAN SECTION */}
      <section className="py-20 bg-white relative overflow-hidden border-b border-neutral-gray/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-secondary bg-secondary/8 px-4 py-2 rounded-full border border-secondary/10">
              Galeri Dokumentasi
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Aktivitas Ceria di RA Sahabat</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Momen-momen berharga penuh senyuman saat anak-anak bermain, belajar, dan beribadah bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => {
              return (
                <div
                  key={item.id || index}
                  onClick={() => setLightboxIndex(index)}
                  className="bg-white p-4 pb-6 rounded-2xl border border-neutral-gray/8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  {/* Photo Container */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 relative">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1590076214561-2679be15bb56?auto=format&fit=crop&q=80&w=800"}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590076214561-2679be15bb56?auto=format&fit=crop&q=80&w=800";
                      }}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    
                    {/* Category tag */}
                    <span className="absolute top-3 left-3 bg-white/95 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary-green/10 text-neutral-dark shadow-3xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mt-4 text-center space-y-1">
                    <h4 className="font-baloo text-base font-bold text-neutral-dark leading-tight group-hover:text-primary-green transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-gray font-semibold">
                      Diambil pada {item.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button to full gallery page */}
          <div className="flex justify-center mt-12">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent-dark text-white font-extrabold text-xs transition-all shadow-sm hover:shadow-md active:scale-95 duration-200 cursor-pointer"
            >
              <span>Lihat Seluruh Galeri Dokumentasi</span>
              <span className="text-xs">➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PRESTASI RA SAHABAT SECTION */}
      <section className="py-20 bg-[#FAF8F5] relative overflow-hidden border-b border-neutral-gray/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-accent bg-accent/8 px-4 py-2 rounded-full border border-accent/10">
              Pencapaian Lembaga & Siswa
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Prestasi Kebanggaan RA Sahabat</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Bukti dedikasi dewan guru dan potensi cemerlang anak didik kami dalam berbagai ajang festival dan kesehatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Prestasi 1 */}
            <div className="group bg-white rounded-2xl border border-neutral-gray/8 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-soft-mint/70 border-b border-neutral-gray/8">
                <svg className="w-10 h-10 text-primary-green/40 group-hover:scale-105 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1 bg-warning text-white rounded-full shadow-3xs">
                  Tingkat Kecamatan
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-1">
                <div>
                  <span className="text-[9px] font-extrabold text-primary-green uppercase tracking-wider block">Festival Anak Ceria</span>
                  <h4 className="font-baloo text-base font-bold text-neutral-dark mt-1 group-hover:text-primary-green transition-colors leading-snug">Juara 1 Lomba Mewarnai & Menggambar</h4>
                  <p className="text-[11px] text-neutral-gray font-semibold mt-2 leading-relaxed">Meraih Juara Pertama pada Festival Kreasi Anak Usia Dini tingkat Kecamatan Berbah Sleman.</p>
                </div>
              </div>
            </div>

            {/* Prestasi 2 */}
            <div className="group bg-white rounded-2xl border border-neutral-gray/8 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-secondary-soft/70 border-b border-neutral-gray/8">
                <svg className="w-10 h-10 text-secondary/40 group-hover:scale-105 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1 bg-secondary text-white rounded-full shadow-3xs">
                  Tingkat Kabupaten
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-1">
                <div>
                  <span className="text-[9px] font-extrabold text-secondary uppercase tracking-wider block">Festival Syiar Anak Sholeh</span>
                  <h4 className="font-baloo text-base font-bold text-neutral-dark mt-1 group-hover:text-secondary transition-colors leading-snug">Juara 2 Lomba Adzan & Surat Pendek</h4>
                  <p className="text-[11px] text-neutral-gray font-semibold mt-2 leading-relaxed">Meraih juara kedua hafalan Juz Amma dan ketepatan lafadz adzan cilik se-Kabupaten Sleman.</p>
                </div>
              </div>
            </div>

            {/* Prestasi 3 */}
            <div className="group bg-white rounded-2xl border border-neutral-gray/8 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-accent-soft/70 border-b border-neutral-gray/8">
                <svg className="w-10 h-10 text-accent/40 group-hover:scale-105 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="absolute top-3 left-3 text-[9px] font-extrabold px-2.5 py-1 bg-accent text-white rounded-full shadow-3xs">
                  Program Gizi Terpadu
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between gap-1">
                <div>
                  <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider block">Kemitraan Puskesmas Berbah</span>
                  <h4 className="font-baloo text-base font-bold text-neutral-dark mt-1 group-hover:text-accent transition-colors leading-snug">Penghargaan PAUD Peduli PHBS</h4>
                  <p className="text-[11px] text-neutral-gray font-semibold mt-2 leading-relaxed">Penghargaan tertinggi atas konsistensi program sanitasi bersih serta monitoring berat & tinggi rutin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONI WALI MURID SECTION */}
      <section className="py-20 bg-white relative overflow-hidden border-b border-neutral-gray/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-secondary bg-secondary/8 px-4 py-2 rounded-full border border-secondary/10">
              Kata Wali Murid
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Apa Kata Orang Tua Bersama Kami?</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Curahan hati dan apresiasi tulus dari para orang tua/wali murid yang mempercayakan putra-putrinya di RA Sahabat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testi 1 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-neutral-gray/8 shadow-sm relative flex flex-col justify-between">
              <p className="text-xs text-neutral-gray italic font-semibold leading-relaxed">
                "Sangat bersyukur menyekolahkan anak di RA Sahabat. Selain lingkungannya yang ramah anak, guru-gurunya sabar sekali. Sekarang anak saya sudah hafal sholawat nabi dan doa harian penting."
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-neutral-gray/6 pt-4">
                <div className="w-9 h-9 rounded-full bg-primary-green text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                  IR
                </div>
                <div>
                  <h4 className="font-baloo text-xs font-bold text-neutral-dark">Ibu Rina</h4>
                  <p className="text-[10px] text-neutral-gray font-bold">Wali Murid Kelas RA (A)</p>
                </div>
              </div>
            </div>

            {/* Testi 2 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-neutral-gray/8 shadow-sm relative flex flex-col justify-between">
              <p className="text-xs text-neutral-gray italic font-semibold leading-relaxed">
                "Metode belajarnya sangat menyenangkan! Anak saya awalnya sangat pemalu dan takut masuk kelas baru. Tapi dengan perhatian dari guru-guru RA Sahabat, sekarang dia jadi aktif bersosialisasi."
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-neutral-gray/6 pt-4">
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                  BJ
                </div>
                <div>
                  <h4 className="font-baloo text-xs font-bold text-neutral-dark">Bapak Joko</h4>
                  <p className="text-[10px] text-neutral-gray font-bold">Wali Murid Kelas KB</p>
                </div>
              </div>
            </div>

            {/* Testi 3 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-neutral-gray/8 shadow-sm relative flex flex-col justify-between">
              <p className="text-xs text-neutral-gray italic font-semibold leading-relaxed">
                "Pencatatan kesehatan tumbuh kembangnya sangat terstruktur. Koordinasi dengan Puskesmas Berbah membantu saya mengontrol nutrisi anak, dan program berkebun membuatnya jadi suka makan sayur!"
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-neutral-gray/6 pt-4">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                  IS
                </div>
                <div>
                  <h4 className="font-baloo text-xs font-bold text-neutral-dark">Ibu Siti</h4>
                  <p className="text-[10px] text-neutral-gray font-bold">Wali Murid Kelas RA (B)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PPDB REGISTER INFO SECTION — REDESIGNED TO WHATSAPP DIRECT */}
      <section id="ppdb" className="py-20 bg-[#FAF8F5] relative overflow-hidden border-b border-neutral-gray/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-accent bg-accent/8 px-4 py-2 rounded-full border border-accent/10">
              Pendaftaran PPDB TA 2026/2027
            </span>
            <h2 className="font-baloo text-3xl sm:text-4xl font-bold text-neutral-dark">Mari Bergabung Menjadi Sahabat Cilik Kami!</h2>
            <p className="text-xs sm:text-sm text-neutral-gray leading-relaxed font-semibold max-w-xl mx-auto">
              Saat ini pendaftaran dilakukan secara langsung/offline. Silakan hubungi admin kami melalui WhatsApp untuk informasi kuota kelas, alur pendaftaran, serta jadwal kunjungan sekolah.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20RA%20Sahabat,%20saya%20ingin%20mendaftarkan%20anak%20saya%20di%20KB/RA%20Sahabat%20Sleman..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold text-base transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 3.977 14.128 2.95 11.5 2.95c-5.437 0-9.863 4.373-9.867 9.803-.001 1.73.457 3.416 1.328 4.937l-.988 3.597 3.674-.952zM17.7 14.542c-.3-.15-1.77-.874-2.046-.974-.276-.1-.477-.15-.677.15-.2.3-.777.974-.95 1.174-.173.2-.347.225-.648.075-.3-.15-1.266-.467-2.41-1.484-.89-.791-1.49-1.77-1.665-2.07-.173-.3-.018-.462.13-.61.135-.135.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.374-.025-.524-.075-.15-.677-1.63-.927-2.23-.244-.587-.493-.507-.677-.517-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.374-.276.3-1.053 1.028-1.053 2.507 0 1.48 1.079 2.906 1.228 3.106.15.2 2.122 3.24 5.14 4.547.717.31 1.278.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.77-.723 2.02-1.388.25-.665.25-1.233.175-1.353-.075-.12-.275-.22-.575-.37z"/>
              </svg>
              <span>Hubungi Admin PPDB via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* LOKASI MAPS & HUBUGI KAMI */}
      <section className="py-20 bg-white relative overflow-hidden border-b border-neutral-gray/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Maps info */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-primary-green bg-primary-green/8 px-4 py-2 rounded-full border border-primary-green/10">
                Lokasi Kami
              </span>
              <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Bermain & Belajar di Berbah</h2>
              <p className="text-sm text-neutral-gray leading-relaxed font-semibold">
                Sistem belajar terintegrasi KB/RA Sahabat terletak strategis di wilayah Berbah, Kabupaten Sleman, D.I. Yogyakarta. Lokasi sekolah aman dan tenang, cocok bagi anak-anak usia dini mengeksplorasi dunia mereka dengan gembira.
              </p>
            </div>

            {/* Right Maps Google Embed */}
            <div className="lg:col-span-6">
              <div className="w-full aspect-video bg-white rounded-2xl border border-neutral-gray/8 relative overflow-hidden shadow-md group">
                {/* Google Maps Interactive Iframe */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.883731174987!2d110.441871!3d-7.7936473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5190c48cf0b5%3A0x7186938de1643136!2sKB%20RA%20SAHABAT!5e0!3m2!1sen!2sid!4v1722420000000!5m2!1sen!2sid"
                  className="w-full h-full border-none absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi KB RA Sahabat"
                ></iframe>

                {/* Floating Directions Action Button */}
                <a
                  href="https://www.google.com/maps/place/KB+RA+SAHABAT/@-7.7936473,110.441871,15z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2CB24A] hover:bg-[#1C8A38] text-white font-extrabold text-xs transition-colors shadow-md cursor-pointer"
                >
                  <span>Petunjuk Rute</span>
                  <span className="text-[9px]">↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pure Full-Screen Lightbox Slideshow */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryItems[lightboxIndex] && (
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
              onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length)}
              className="absolute left-4 md:left-8 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl cursor-pointer transition-colors"
              title="Sebelumnya"
            >
              ‹
            </button>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryItems.length)}
              className="absolute right-4 md:right-8 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl cursor-pointer transition-colors"
              title="Berikutnya"
            >
              ›
            </button>

            {/* Slide Container */}
            <div className="relative w-full max-w-4xl max-h-[80vh] px-4 flex flex-col items-center justify-center z-10 space-y-4">
              <motion.img
                key={galleryItems[lightboxIndex].id || lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={galleryItems[lightboxIndex].image}
                alt={galleryItems[lightboxIndex].title}
                className="max-w-full max-h-[72vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              />

              {/* Caption */}
              <div className="text-center text-white space-y-1 px-4 max-w-xl">
                <span className="text-[9px] uppercase font-black tracking-widest text-primary-green bg-primary-green/10 px-2 py-0.5 rounded border border-primary-green/20">
                  {galleryItems[lightboxIndex].category}
                </span>
                <h4 className="font-baloo text-base font-bold mt-1.5">
                  {galleryItems[lightboxIndex].title}
                </h4>
                <p className="text-[10px] text-neutral-gray leading-relaxed font-semibold">
                  {galleryItems[lightboxIndex].description}
                </p>
                <span className="text-[9px] text-stone-500 font-bold block mt-1">
                  Foto {lightboxIndex + 1} dari {galleryItems.length} • Diambil pada {galleryItems[lightboxIndex].date}
                </span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
