"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    childName: "",
    parentName: "",
    phone: "",
    classType: "RA",
  });

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
      <section className="relative bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-white pt-24 pb-16 overflow-hidden">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
        
        {/* Decorative Doodles */}
        <div className="absolute top-12 left-10 text-warm-yellow/30 text-5xl font-bold select-none hidden md:block animate-bounce duration-[4000ms]">★</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-primary-dark bg-soft-mint px-4 py-2 rounded-lg border-2 border-dashed border-primary-green/30">
                Pendaftaran PPDB TA 2026/2027 Dibuka!
              </span>
              <h1 className="font-baloo text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark leading-tight">
                Membentuk Generasi <span className="text-primary-green">Cerdas</span> & Berkarakter Islami
              </h1>
              <p className="text-sm sm:text-base text-neutral-gray max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                KB/RA Sahabat Berbah Sleman berkomitmen menghadirkan ekosistem pendidikan anak usia dini yang menyenangkan, berakhlak mulia, dan berlandaskan nilai Aswaja NU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <a
                  href="#ppdb"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-accent hover:bg-accent-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-accent-dark"
                >
                  Daftar PPDB Online
                </a>
                <Link
                  href="/galeri"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white hover:bg-primary-soft text-primary-green font-extrabold text-base transition-all shadow-xs border-2 border-dashed border-primary-green/40"
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

              {/* Outer circle with chalkboard style dotted line - pulsing in scale, very subtle opacity */}
              <div className="absolute inset-0 bg-[#E7F8EA]/30 rounded-full border-4 border-dashed border-primary-green/15 pointer-events-none custom-pulse-bg"></div>
              
              {/* Logo image container */}
              <div className="w-[85%] aspect-square rounded-full border-4 border-primary-green/80 overflow-hidden bg-white shadow-md z-10 relative">
                <img
                  src="/images/logo.jpg"
                  alt="Logo RA Sahabat"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Doodles around logo - pushed further outward to avoid crowding */}
              {/* Star on top right - very soft warm yellow */}
              <svg className="absolute -top-4 -right-4 w-7 h-7 text-warning/20 z-20 pointer-events-none custom-float-y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FAF8F5" stroke="#F5A623" opacity="0.6" />
              </svg>

              {/* Cloud on top left - very soft purple */}
              <svg className="absolute -top-8 -left-8 w-10 h-7 text-secondary/15 z-20 pointer-events-none custom-float-x" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10,40 C10,25 30,20 40,25 C50,15 75,20 75,35 C85,35 95,45 85,55 H15 C5,55 5,45 10,40 Z" fill="#F2E6F5" stroke="#7A2E8F" opacity="0.4" />
              </svg>

              {/* Flower on bottom left - very soft pink */}
              <svg className="absolute -bottom-6 -left-6 w-7 h-7 text-accent/25 z-20 pointer-events-none custom-float-y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="8" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="12" cy="16" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="8" cy="12" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="16" cy="12" r="2.8" fill="#FCE4F1" stroke="#EC1E8C" strokeWidth="1" opacity="0.7" />
                <circle cx="12" cy="12" r="3" fill="#EC1E8C" opacity="0.4" />
              </svg>

              {/* Paperplane on bottom right - very soft green */}
              <svg className="absolute -bottom-8 -right-8 w-8 h-8 text-primary-green/15 z-20 pointer-events-none custom-float-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L2 8.66L11.5 12.5L16 21L22 2Z" fill="#E7F8EA" stroke="#2CB24A" opacity="0.4" />
                <path d="M11.5 12.5L22 2" stroke="#2CB24A" strokeDasharray="2 1" opacity="0.4" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* PROFIL LEMBAGA SECTION */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-b border-soft-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Sejarah & Visi Misi */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-secondary-dark bg-secondary-soft px-4 py-2 rounded-lg border-2 border-dashed border-secondary/30">
                Profil Sekolah
              </span>
              <h2 className="font-baloo text-3xl sm:text-4xl font-bold text-neutral-dark">
                Pendidikan Islami yang Hangat, Ramah, dan Ceria
              </h2>
              <p className="text-sm text-neutral-gray leading-relaxed font-medium">
                **KB/RA Sahabat** merupakan lembaga pendidikan anak usia dini swasta di wilayah Berbah, Sleman, Yogyakarta yang berada di bawah naungan Kementerian Agama (Kemenag) dengan afiliasi Nahdlatul Ulama (NU). Kami memadukan kurikulum pendidikan umum ramah anak dengan dasar akhlakul karimah dan ibadah harian praktis.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-5 bg-soft-mint rounded-lg border-2 border-dashed border-primary-green/30">
                  <h4 className="font-baloo text-lg font-bold text-primary-dark mb-1">Visi Kami</h4>
                  <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                    Mewujudkan generasi bertakwa, berakhlak mulia, cerdas, kreatif, mandiri, dan cinta tanah air sejak usia dini.
                  </p>
                </div>
                <div className="p-5 bg-secondary-soft rounded-lg border-2 border-dashed border-secondary/30">
                  <h4 className="font-baloo text-lg font-bold text-secondary-dark mb-1">Nilai Aswaja NU</h4>
                  <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                    Menanamkan karakter tawasut (moderat), tawazun (seimbang), i'tidal (tegak lurus), dan tasamuh (toleran) lewat pembiasaan harian.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Akreditasi & Guru Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FAF8F5] p-8 rounded-[40px_15px_50px_20px]/[20px_50px_15px_40px] border-2 border-dashed border-primary-green/30 shadow-xs relative">
                {/* Paper tape at the top */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-warm-yellow/60 border border-warm-yellow/70 rotate-[-4deg] rounded-xs shadow-2xs z-20 pointer-events-none"></div>
                
                <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3 text-center">Fakta RA Sahabat</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-primary-green/10 pb-2">
                    <span className="text-xs font-extrabold text-neutral-dark">Kapasitas Pendidik</span>
                    <span className="text-xs font-extrabold text-secondary">6 Guru Berdedikasi</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-primary-green/10 pb-2">
                    <span className="text-xs font-extrabold text-neutral-dark">Afiliasi Resmi</span>
                    <span className="text-xs font-extrabold text-primary-green">Kemenag Sleman & NU</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-primary-green/10 pb-2">
                    <span className="text-xs font-extrabold text-neutral-dark">Kesiapan Akreditasi</span>
                    <span className="text-xs font-extrabold text-accent">Persiapan BAN-PDM (Sispena)</span>
                  </div>
                  <p className="text-[10px] text-neutral-gray leading-relaxed font-semibold text-center mt-4">
                    *Tim guru RA Sahabat aktif mengikuti pelatihan kurikulum merdeka PAUD secara berkala.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KEUNGGULAN PROGRAM SECTION */}
      <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-accent bg-accent-soft px-4 py-2 rounded-lg border-2 border-dashed border-accent/30">
              Keunggulan Kami
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Mengapa Memilih KB/RA Sahabat?</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Kami menyusun ekosistem belajar ramah anak yang seimbang antara kecerdasan kognitif dan akhlakul karimah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[30px_15px_40px_20px]/[20px_40px_15px_30px] shadow-xs border-2 border-dashed border-primary-green/20 hover:border-solid hover:shadow-sm transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary"></div>
              <div>
                <svg className="w-10 h-10 text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
                </svg>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Pendidikan Karakter Aswaja</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                  Mengenalkan doa-doa harian, asmaul husna, manasik haji cilik, dan kecintaan pada sholawat nabi sejak usia dini.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[20px_40px_15px_35px]/[35px_15px_40px_20px] shadow-xs border-2 border-dashed border-primary-green/20 hover:border-solid hover:shadow-sm transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-green"></div>
              <div>
                <svg className="w-10 h-10 text-primary-green mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Metode Playful Learning</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                  Menerapkan konsep bermain seraya belajar yang merangsang sensorik motorik anak melalui eksperimen kreatif dan permainan kelompok.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[40px_20px_35px_15px]/[15px_35px_20px_40px] shadow-xs border-2 border-dashed border-primary-green/20 hover:border-solid hover:shadow-sm transition-all duration-300 group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
              <div>
                <svg className="w-10 h-10 text-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Tumbuh Kembang Sehat</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-semibold">
                  Melakukan pemantauan gizi siswa harian, koordinasi dengan Puskesmas Berbah, serta pembinaan pola hidup bersih sehat (PHBS).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERI KEGIATAN SECTION (Polaroid Chalkboard Style) */}
      <section className="py-20 bg-white relative overflow-hidden border-b border-soft-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-secondary-dark bg-secondary-soft px-4 py-2 rounded-lg border-2 border-dashed border-secondary/30">
              Galeri Dokumentasi
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Aktivitas Ceria di RA Sahabat</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Momen-momen berharga penuh senyuman saat anak-anak bermain, belajar, dan beribadah bersama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gallery 1 */}
            <div className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative rotate-[-1.5deg] hover:rotate-[1deg] hover:shadow-md transition-all duration-300">
              {/* Polaroid tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[2deg] shadow-3xs pointer-events-none"></div>
              
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-soft-mint to-primary-light/35 rounded-md flex items-center justify-center text-primary-green relative overflow-hidden">
                {/* Simulated kid drawing icon */}
                <svg className="w-12 h-12 text-primary-green/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5" />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Latihan Manasik Haji Cilik</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Pembiasaan ibadah haji sejak usia dini</p>
              </div>
            </div>

            {/* Gallery 2 */}
            <div className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative rotate-[2deg] hover:rotate-[-1deg] hover:shadow-md transition-all duration-300">
              {/* Polaroid tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[-3deg] shadow-3xs pointer-events-none"></div>
              
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-secondary-soft to-accent-soft/30 rounded-md flex items-center justify-center text-secondary relative overflow-hidden">
                {/* Simulated kid drawing icon */}
                <svg className="w-12 h-12 text-secondary/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1" />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Berkebun di Halaman</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Edukasi kecintaan alam & tanaman hijau</p>
              </div>
            </div>

            {/* Gallery 3 */}
            <div className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative rotate-[-1deg] hover:rotate-[2deg] hover:shadow-md transition-all duration-300">
              {/* Polaroid tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[1deg] shadow-3xs pointer-events-none"></div>
              
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-accent-soft to-secondary-soft/30 rounded-md flex items-center justify-center text-accent relative overflow-hidden">
                {/* Simulated kid drawing icon */}
                <svg className="w-12 h-12 text-accent/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364" />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Hari Santri & Sholawat</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Penanaman akhlak mulia sejak dini</p>
              </div>
            </div>

            {/* Gallery 4 */}
            <div className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative rotate-[1.5deg] hover:rotate-[-1.5deg] hover:shadow-md transition-all duration-300">
              {/* Polaroid tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[-1deg] shadow-3xs pointer-events-none"></div>
              
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-soft-mint to-secondary-soft/30 rounded-md flex items-center justify-center text-primary-green relative overflow-hidden">
                {/* Simulated kid drawing APE icon */}
                <svg className="w-12 h-12 text-primary-green/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" strokeDasharray="3 2" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Eksperimen Pelangi Gembira</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Sains cilik & pencampuran warna</p>
              </div>
            </div>

            {/* Gallery 5 */}
            <div className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative rotate-[-2deg] hover:rotate-[1deg] hover:shadow-md transition-all duration-300">
              {/* Polaroid tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[2deg] shadow-3xs pointer-events-none"></div>
              
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-secondary-soft to-primary-light/20 rounded-md flex items-center justify-center text-secondary relative overflow-hidden">
                {/* Simulated art drawing icon */}
                <svg className="w-12 h-12 text-secondary/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z" />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Pentas Seni Anak RA</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Saluran ekspresi minat bakat & percaya diri</p>
              </div>
            </div>

            {/* Gallery 6 */}
            <div className="bg-white p-4 pb-6 rounded-lg border-2 border-dashed border-primary-green/20 shadow-xs relative rotate-[1deg] hover:rotate-[-2deg] hover:shadow-md transition-all duration-300">
              {/* Polaroid tape */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-warm-yellow/60 rotate-[-2deg] shadow-3xs pointer-events-none"></div>
              
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-accent-soft to-soft-mint/30 rounded-md flex items-center justify-center text-accent relative overflow-hidden">
                {/* Simulated kid tooth/gizi icon */}
                <svg className="w-12 h-12 text-accent/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 2a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-4a4 4 0 0 0-4-4z" />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Senam & Gosok Gigi PHBS</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Pembiasaan perilaku hidup bersih sehat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESTASI RA SAHABAT SECTION */}
      <section className="py-20 bg-[#FAF8F5] relative overflow-hidden border-b border-soft-mint">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-accent bg-accent-soft px-4 py-2 rounded-lg border-2 border-dashed border-accent/30">
              Pencapaian Lembaga & Siswa
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Prestasi Kebanggaan RA Sahabat</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Bukti dedikasi dewan guru dan potensi cemerlang anak didik kami dalam berbagai ajang festival dan kesehatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Prestasi 1 */}
            <div className="group bg-white rounded-2xl border border-primary-green/10 shadow-3xs overflow-hidden hover:shadow-sm transition-all duration-300 flex flex-col">
              <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-soft-mint/70 border-b border-primary-green/5">
                <svg className="w-10 h-10 text-primary-green/40 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
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
            <div className="group bg-white rounded-2xl border border-primary-green/10 shadow-3xs overflow-hidden hover:shadow-sm transition-all duration-300 flex flex-col">
              <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-secondary-soft/70 border-b border-secondary/5">
                <svg className="w-10 h-10 text-secondary/40 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
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
            <div className="group bg-white rounded-2xl border border-primary-green/10 shadow-3xs overflow-hidden hover:shadow-sm transition-all duration-300 flex flex-col">
              <div className="relative aspect-[16/9] w-full flex items-center justify-center bg-accent-soft/70 border-b border-accent/5">
                <svg className="w-10 h-10 text-accent/40 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
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
      <section className="py-20 bg-white relative overflow-hidden border-b border-soft-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-secondary-dark bg-secondary-soft px-4 py-2 rounded-lg border-2 border-dashed border-secondary/30">
              Kata Wali Murid
            </span>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Apa Kata Orang Tua Bersama Kami?</h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed">
              Curahan hati dan apresiasi tulus dari para orang tua/wali murid yang mempercayakan putra-putrinya di RA Sahabat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testi 1 */}
            <div className="bg-[#FAF8F5] p-6 rounded-[20px_40px_15px_35px]/[35px_15px_40px_20px] border-2 border-dashed border-primary-green/25 shadow-xs relative flex flex-col justify-between">
              <p className="text-xs text-neutral-gray italic font-semibold leading-relaxed">
                "Sangat bersyukur menyekolahkan anak di RA Sahabat. Selain lingkungannya yang ramah anak, guru-gurunya sabar sekali. Sekarang anak saya sudah hafal sholawat nabi dan doa harian penting."
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-primary-green/10 pt-4">
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
            <div className="bg-[#FAF8F5] p-6 rounded-[30px_15px_40px_20px]/[20px_40px_15px_30px] border-2 border-dashed border-secondary/25 shadow-xs relative flex flex-col justify-between">
              <p className="text-xs text-neutral-gray italic font-semibold leading-relaxed">
                "Metode belajarnya sangat menyenangkan! Anak saya awalnya sangat pemalu dan takut masuk kelas baru. Tapi dengan perhatian dari guru-guru RA Sahabat, sekarang dia jadi aktif bersosialisasi."
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-secondary/15 pt-4">
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
            <div className="bg-[#FAF8F5] p-6 rounded-[25px_35px_15px_40px]/[40px_15px_35px_25px] border-2 border-dashed border-accent/25 shadow-xs relative flex flex-col justify-between">
              <p className="text-xs text-neutral-gray italic font-semibold leading-relaxed">
                "Pencatatan kesehatan tumbuh kembangnya sangat terstruktur. Koordinasi dengan Puskesmas Berbah membantu saya mengontrol nutrisi anak, dan program berkebun membuatnya jadi suka makan sayur!"
              </p>
              <div className="flex items-center gap-3 mt-6 border-t border-accent/15 pt-4">
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

      {/* PREVIEW GALERI SECTION */}
      <section className="py-20 bg-white relative overflow-hidden border-b border-soft-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-primary-dark bg-soft-mint px-4 py-2 rounded-lg border-2 border-dashed border-primary-green/30">
                Dokumentasi Kegiatan
              </span>
              <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Keseruan Sahabat Cilik</h2>
              <p className="text-sm text-neutral-gray leading-relaxed font-semibold">
                Intip sekilas keceriaan anak-anak dalam mengikuti berbagai aktivitas edukatif, keagamaan, dan petualangan outbound kami.
              </p>
            </div>
            <div className="flex justify-center md:justify-end flex-shrink-0">
              <Link
                href="/galeri"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-extrabold text-xs transition-all shadow-3xs border border-accent-dark active:scale-95 duration-200 cursor-pointer"
              >
                <span>Lihat Seluruh Galeri</span>
                <span className="text-xs">➔</span>
              </Link>
            </div>
          </div>

          {/* Grid Preview 3 Foto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF8F5] rounded-3xl overflow-hidden border border-primary-green/10 p-4 space-y-4 hover:shadow-sm transition-all duration-300">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
                  alt="Belajar Al-Qur'an"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary-green/10 text-neutral-dark">
                  Keagamaan
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-baloo text-sm font-bold text-neutral-dark">Belajar Membaca Al-Qur'an</h4>
                <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                  Kegiatan membaca Iqro bersama guru pendamping setiap pagi hari.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-3xl overflow-hidden border border-primary-green/10 p-4 space-y-4 hover:shadow-sm transition-all duration-300">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
                  alt="Outbound"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary-green/10 text-neutral-dark">
                  Outbound
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-baloo text-sm font-bold text-neutral-dark">Outbound Kebun Binatang</h4>
                <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                  Pengenalan satwa dan edukasi lapangan untuk melatih kemandirian anak.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] rounded-3xl overflow-hidden border border-primary-green/10 p-4 space-y-4 hover:shadow-sm transition-all duration-300">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"
                  alt="Pentas Seni"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-white/95 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary-green/10 text-neutral-dark">
                  Pentas Seni
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-baloo text-sm font-bold text-neutral-dark">Pentas Seni Akhir Tahun</h4>
                <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                  Menampilkan bakat kreativitas, tarian, dan hafalan surah pendek.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PPDB REGISTER INFO SECTION — REDESIGNED TO WHATSAPP DIRECT */}
      <section id="ppdb" className="py-20 bg-[#FAF8F5] relative overflow-hidden border-b border-soft-mint">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="space-y-3">
            <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-accent bg-accent-soft px-4 py-2 rounded-lg border-2 border-dashed border-accent/30">
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
              className="inline-flex items-center gap-3 px-10 py-4.5 rounded-xl bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold text-base transition-all border-2 border-primary-dark shadow-md hover:-translate-y-0.5"
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
      <section className="py-20 bg-white relative overflow-hidden border-b border-soft-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Maps info */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-primary-dark bg-soft-mint px-4 py-2 rounded-lg border-2 border-dashed border-primary-green/30">
                Lokasi Kami
              </span>
              <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Bermain & Belajar di Berbah</h2>
              <p className="text-sm text-neutral-gray leading-relaxed font-semibold">
                Sistem belajar terintegrasi KB/RA Sahabat terletak strategis di wilayah Berbah, Kabupaten Sleman, D.I. Yogyakarta. Lokasi sekolah aman dan tenang, cocok bagi anak-anak usia dini mengeksplorasi dunia mereka dengan gembira.
              </p>
            </div>

            {/* Right Maps Google Embed */}
            <div className="lg:col-span-6">
              <div className="w-full aspect-video bg-white rounded-2xl border-2 border-neutral-dark relative overflow-hidden shadow-sm group">
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
                  className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2CB24A] hover:bg-[#1C8A38] text-white font-extrabold text-xs transition-colors border border-[#1C8A38] shadow-md cursor-pointer"
                >
                  <span>Petunjuk Rute</span>
                  <span className="text-[9px]">↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
