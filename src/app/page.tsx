'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-neutral-dark select-none bg-white">
      
      {/* HERO SECTION */}
      <section id="home" className="relative bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-white pt-28 pb-16 overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-16 right-0 w-80 h-80 bg-warm-yellow/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]"></div>
        <div className="absolute bottom-10 left-10 w-88 h-88 bg-primary-light/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>

        {/* Decorative background doodles */}
        {/* Sparkle top-left */}
        <svg className="absolute top-20 left-12 w-10 h-10 text-warm-yellow/25 pointer-events-none hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" />
        </svg>
        {/* Swirly loop bottom-right near divider */}
        <svg className="absolute bottom-6 right-16 w-12 h-16 text-primary-green/20 pointer-events-none hidden lg:block" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10,10 C25,5 35,20 25,35 C15,50 5,30 20,55 L12,48 M20,55 L25,48" />
        </svg>

        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-10 sm:pt-14">
            {/* Hero Left */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] bg-warm-yellow/20 text-primary-dark text-xs font-bold border-2 border-dashed border-warm-yellow/50">
                <span className="flex h-2.5 w-2.5 rounded-full bg-soft-orange animate-ping"></span>
                Sekolah Komunitas Nonformal Bantaran Sungai
              </div>
              <h1 className="font-baloo text-3xl sm:text-4.5xl lg:text-[3.25rem] font-bold text-neutral-dark leading-[1.15] tracking-tight">
                Tumbuhkan Impian Cerdas Bersama <span className="text-primary-green relative">G-SEE
                  {/* Decorative sketch line under logo */}
                  <svg className="absolute -bottom-2.5 left-0 w-full h-3 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                    <path d="M0,5 Q30,9 50,4 T100,6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-gray max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Gajahwong Smart Education Ecosystem (G-SEE) mengintegrasikan sistem belajar berbasis IT cerdas, aksi tani & daur ulang peduli alam, serta bimbingan psikososial keluarga secara hangat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/program"
                  className="px-8 py-3.5 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-sm transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark text-center"
                >
                  Lihat Program Kami
                </Link>
                <Link
                  href="/kontak"
                  className="px-8 py-3.5 rounded-[100px_30px_90px_20px]/[20px_90px_30px_100px] border-2 border-dashed border-primary-green/80 hover:border-solid hover:bg-soft-mint text-primary-dark font-extrabold text-sm transition-all text-center"
                >
                  Ajukan Kolaborasi
                </Link>
              </div>
            </div>

            {/* Hero Right / Hero Graphic */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] bg-white rounded-[40px_15px_50px_20px]/[20px_50px_15px_40px] p-7 shadow-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-primary-green/60">
                {/* SVG Children & Nature Doodle Illustration */}
                <svg className="w-full h-full max-h-64 text-primary-green" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Sun doodle */}
                  <circle cx="170" cy="35" r="14" stroke="#FFC93C" strokeWidth="2.5" strokeDasharray="3 3" />
                  <path d="M170 12 V 16 M170 54 V 58 M147 35 H 151 M189 35 H 193" stroke="#FFC93C" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Cloud doodle */}
                  <path d="M25 45 C 20 40, 40 25, 48 32 C 55 25, 75 35, 68 45 Z" stroke="#6B7A72" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  
                  {/* Stylized chalkboard river bank path */}
                  <path d="M -10 170 Q 50 145 110 165 T 210 140" stroke="#0E7A4D" strokeWidth="3" strokeDasharray="5 4" fill="none" />
                  <path d="M -10 185 Q 60 160 120 180 T 210 155" stroke="#5FD79B" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

                  {/* Hand drawn tree sprout (Smart Environment) */}
                  <path d="M 60 160 Q 62 120 65 95" stroke="#8B5A2B" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 65 95 Q 40 85 45 70 Q 70 80 65 95" stroke="#18B36F" strokeWidth="2.5" strokeLinecap="round" fill="#E6F9F1" />
                  <path d="M 65 95 Q 90 90 85 75 Q 62 82 65 95" stroke="#18B36F" strokeWidth="2.5" strokeLinecap="round" fill="#FAF8F5" />
                  
                  {/* Laptop / Computer doodle (Smart Learning) */}
                  <path d="M 125 105 H 175 V 135 H 125 Z" stroke="#0E7A4D" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M 115 135 H 185 L 180 148 H 120 Z" stroke="#0E7A4D" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M 142 115 H 158 V 125 H 142 Z" stroke="#FFC93C" strokeWidth="1.5" />

                  {/* Stick figure child doodle (Modul Pendampingan) */}
                  <circle cx="105" cy="85" r="7" stroke="#FF9F5B" strokeWidth="2.5" />
                  <path d="M 105 92 V 112 M 105 98 L 94 105 M 105 98 L 116 105 M 105 112 L 97 125 M 105 112 L 113 125" stroke="#FF9F5B" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Decorative sketch stars */}
                  <path d="M 105 35 L 108 42 L 115 42 L 110 46 L 112 53 L 105 49 L 98 53 L 100 46 L 95 42 L 102 42 Z" stroke="#FFC93C" strokeWidth="1.5" fill="none" />
                </svg>

                {/* Chalkboard labels */}
                <div className="absolute top-4 left-4 bg-[#FAF8F5] border-2 border-dashed border-primary-green/40 px-3 py-1.5 rounded-[12px_36px_12px_36px]/[36px_12px_36px_12px] shadow-sm flex items-center space-x-1">
                  <span className="text-xs">🌳</span>
                  <span className="text-[10px] font-extrabold text-primary-dark">Tani Cerdas</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#FAF8F5] border-2 border-dashed border-primary-green/40 px-3 py-1.5 rounded-[36px_12px_36px_12px]/[12px_36px_12px_36px] shadow-sm flex items-center space-x-1">
                  <span className="text-xs">🏫</span>
                  <span className="text-[10px] font-extrabold text-primary-dark">Sekolah Sungai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PENGENALAN PROGRAM */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle decorative doodle star on top left */}
        <div className="absolute top-8 left-10 text-warm-yellow/30 text-4xl select-none font-bold hidden lg:block animate-bounce duration-[5000ms]">★</div>
        
        {/* Background leaf doodle left side */}
        <svg className="absolute bottom-12 -left-6 w-20 h-20 text-primary-green/10 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 22C2 22 10 18 14 14C17 11 22 2 22 2C22 2 13 7 10 10C6 14 2 22 2 22Z" />
          <path d="M9 15C12 14 15 11 17 8" />
        </svg>

        {/* Swirly cloud top right */}
        <svg className="absolute top-10 -right-6 w-24 h-16 text-primary-light/15 pointer-events-none hidden xl:block" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10,40 C10,25 30,20 40,25 C50,15 75,20 75,35 C85,35 95,45 85,55 H15 C5,55 5,45 10,40 Z" strokeDasharray="3 3" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block text-xs uppercase font-extrabold text-primary-dark tracking-widest bg-soft-mint px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] border-2 border-dashed border-primary-green/30">
                Apa itu G-SEE?
              </div>
              <h2 className="font-baloo text-3xl sm:text-4xl font-bold text-neutral-dark leading-tight relative">
                Meningkatkan <span className="text-primary-green relative inline-block">Kemandirian
                  {/* Circular hand-drawn doodle outline (Wider loop) */}
                  <svg className="absolute -inset-x-6 -inset-y-3.5 w-[122%] h-[145%] text-warm-yellow pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none">
                    <path d="M5,5 C30,3 70,3 95,5 C98,15 90,27 60,28 C30,29 3,25 5,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span> dari Tepian Sungai Gajahwong
              </h2>
              <div className="space-y-4 text-neutral-gray leading-relaxed text-sm font-medium">
                <p>
                  Sekolah Gajahwong adalah sekolah komunitas nonformal bagi anak usia 3-15 tahun dari keluarga marjinal di Prenggan, Kotagede. Hadirnya ekosistem **G-SEE** dirancang sebagai wadah terintegrasi untuk menyajikan metode pembelajaran berbasis IT (Smart Learning), kepedulian lingkungan praktis (Smart Environment), dan bimbingan psikososial (Modul Pendampingan).
                </p>
                <p>
                  Melalui kolaborasi multi-pihak, kami mendampingi anak-anak agar tidak hanya memiliki bekal akademis yang tangguh tetapi juga tumbuh menjadi generasi yang sadar ekologis dan peduli terhadap kelestarian lingkungan tempat tinggal mereka.
                </p>
              </div>
              
              <div className="pt-2">
                <Link
                  href="/program"
                  className="inline-flex items-center text-primary-green font-extrabold text-base gap-2 hover:gap-3 transition-all group"
                >
                  Pelajari Lebih Dalam Mengenai Program Kami
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </Link>
              </div>
            </div>

            {/* Right side stats/card */}
            <div className="lg:col-span-5">
              <div className="bg-[#FAF8F5] p-8 rounded-[40px_15px_50px_20px]/[20px_50px_15px_40px] border-2 border-dashed border-primary-green/40 space-y-6 shadow-sm">
                <h3 className="font-baloo text-2xl font-bold text-primary-dark">Dampak G-SEE</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-medium">
                  Kami mengukur perkembangan keberhasilan program melalui indikator pertumbuhan minat belajar digital, produksi kompos, dan keaktifan kelas bimbingan orang tua.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-[15px_30px_15px_30px]/[30px_15px_30px_15px] border-2 border-dashed border-primary-green/30 text-center shadow-xs">
                    <span className="block font-baloo text-3xl font-extrabold text-primary-green">90+</span>
                    <span className="text-[10px] uppercase font-bold text-neutral-gray block mt-1">Siswa Aktif</span>
                  </div>
                  <div className="bg-white p-4 rounded-[30px_15px_30px_15px]/[15px_30px_15px_30px] border-2 border-dashed border-primary-green/30 text-center shadow-xs">
                    <span className="block font-baloo text-3xl font-extrabold text-warm-yellow">9</span>
                    <span className="text-[10px] uppercase font-bold text-neutral-gray block mt-1">Staf Pengajar</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THREE TEASERS PAGE SECTION */}
      <section className="py-20 bg-soft-mint/20 border-y-2 border-dashed border-primary-green/20 relative">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              Pilar Utama <span className="text-primary-green relative">Kegiatan
                <svg className="absolute -bottom-2.5 left-0 w-full h-2 text-warm-yellow pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                  <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-sm text-neutral-gray font-medium leading-relaxed">
              Tiga komponen utama yang dijalankan secara terpadu demi menyokong ekosistem belajar alternatif di Sungai Gajahwong.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[30px_15px_40px_20px]/[20px_40px_15px_30px] shadow-sm border-2 border-dashed border-primary-green/30 hover:border-solid hover:bg-soft-mint/10 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                {/* Sketched Computer SVG */}
                <svg className="w-10 h-10 text-primary-green mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="11" rx="2" strokeDasharray="3 1" />
                  <path d="M2 19h20 M5 19l2-4 M19 19l-2-4" />
                  <path d="M8 8h8M8 11h4" strokeWidth="1.5" />
                </svg>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Smart Learning</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-medium">
                  Kurikulum pendidikan tematik berbasis digital dan media ajar interaktif untuk memperkaya minat belajar mandiri siswa alternatif.
                </p>
              </div>
              <Link href="/program" className="text-xs font-extrabold text-primary-green mt-6 inline-flex items-center gap-1.5 group">
                Selengkapnya <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[20px_40px_15px_35px]/[35px_15px_40px_20px] shadow-sm border-2 border-dashed border-primary-green/30 hover:border-solid hover:bg-soft-mint/10 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                {/* Sketched Plant SVG */}
                <svg className="w-10 h-10 text-primary-green mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C12 22 12 13 12 8C12 5.5 14.5 3 16.5 3" strokeDasharray="3 1.5" />
                  <path d="M12 12C8.5 12 5 9.5 5 7C5 5.5 7.5 5.5 12 8" />
                  <path d="M12 10C15.5 10 19 8 19 5.5C19 4 16.5 4 12 7" />
                </svg>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Smart Environment</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-medium">
                  Edukasi eko-pedagogi sungai praktis melalui daur ulang plastik kreatif dan kebun tani hidroponik Gajahwong Farm.
                </p>
              </div>
              <Link href="/program" className="text-xs font-extrabold text-primary-green mt-6 inline-flex items-center gap-1.5 group">
                Selengkapnya <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[40px_20px_35px_15px]/[15px_35px_20px_40px] shadow-sm border-2 border-dashed border-primary-green/30 hover:border-solid hover:bg-soft-mint/10 hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div>
                {/* Sketched Hands/Heart support SVG */}
                <svg className="w-10 h-10 text-primary-green mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21C12 21 3 15 3 9C3 5.5 5.5 3 9 3C11 3 12 4.5 12 4.5C12 4.5 13 3 15 3C18.5 3 21 5.5 21 9C21 15 12 21 12 21Z" strokeDasharray="3 1" />
                  <path d="M8 9h8" strokeWidth="1.5" />
                  <circle cx="12" cy="9" r="1.5" fill="currentColor" />
                </svg>
                <h3 className="font-baloo text-xl font-bold mb-2 text-primary-dark">Modul Pendampingan</h3>
                <p className="text-xs text-neutral-gray leading-relaxed font-medium">
                  Konseling psikologis berkala, dukungan tumbuh kembang anak, dan pendampingan pola asuh positif bagi orang tua wali murid.
                </p>
              </div>
              <Link href="/program" className="text-xs font-extrabold text-primary-green mt-6 inline-flex items-center gap-1.5 group">
                Selengkapnya <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SINERGI KOLABORASI SECTION */}
      <section className="py-16 bg-white relative overflow-hidden border-b border-soft-mint">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>

        {/* Decorative background doodles */}
        {/* Sparkle top-right */}
        <svg className="absolute top-8 right-16 w-8 h-8 text-warm-yellow/25 pointer-events-none hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 4v16M4 12h16" />
        </svg>
        {/* Loop sketch bottom-right */}
        <svg className="absolute bottom-6 right-12 w-10 h-10 text-primary-light/20 pointer-events-none hidden md:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="6" strokeDasharray="3 2" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>

        {/* Sketched Teddy Bear doodle (Boneka Beruang) bottom-left */}
        <svg className="absolute bottom-4 left-8 w-16 h-16 text-warm-yellow/60 pointer-events-none hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {/* Ears */}
          <circle cx="35" cy="30" r="8" />
          <circle cx="65" cy="30" r="8" />
          {/* Head */}
          <circle cx="50" cy="42" r="18" fill="#FAF8F5" />
          {/* Eyes */}
          <circle cx="44" cy="38" r="1.5" fill="currentColor" />
          <circle cx="56" cy="38" r="1.5" fill="currentColor" />
          {/* Snout & Nose */}
          <ellipse cx="50" cy="46" rx="5" ry="3" />
          <path d="M50 48 v3 Q50 53 47 53 M50 51 Q53 53 53 53" />
          {/* Body */}
          <path d="M36 56 C30 65 32 82 50 82 C68 82 70 65 64 56" />
          {/* Arms */}
          <path d="M34 60 C26 62 26 70 34 66" />
          <path d="M66 60 C74 62 74 70 66 66" />
          {/* Legs */}
          <path d="M38 82 C34 90 46 92 46 82" />
          <path d="M62 82 C66 90 54 92 54 82" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="font-baloo text-2xl sm:text-3xl font-bold text-neutral-dark">
              Sinergi <span className="text-primary-green relative">Kolaborasi
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-warm-yellow pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                  <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-gray font-medium leading-relaxed">
              Integrasi platform ekosistem digital G-SEE di bawah naungan resmi Sekolah Gajahwong (Pusat).
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 max-w-3xl mx-auto">
            {/* Logo Pusat Sekolah Gajahwong */}
            <div className="bg-[#FAF8F5] p-6 rounded-[24px_12px_36px_18px]/[18px_36px_12px_24px] border-2 border-dashed border-primary-green/30 w-full max-w-[280px] text-center shadow-xs">
              {/* Elephant sketch SVG */}
              <svg className="w-16 h-16 text-primary-green mx-auto mb-3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M30 70 C25 60 25 40 40 30 C55 20 75 25 80 40 C85 55 80 70 70 75" />
                <path d="M30 45 C20 45 15 55 18 65 C20 75 10 80 5 70" />
                <path d="M42 32 C35 32 32 42 35 50 C38 58 48 58 48 48 Z" fill="#E6F9F1" />
                <path d="M38 70 v20 M48 72 v18 M64 74 v16 M72 72 v18" />
                <path d="M10 90 Q30 85 50 90 T90 85" strokeWidth="2" strokeDasharray="3 3" />
              </svg>
              <h4 className="font-baloo text-sm font-bold text-neutral-dark leading-none">Sekolah Gajahwong</h4>
              <p className="text-[10px] text-neutral-gray mt-1.5 font-semibold uppercase tracking-wider">Yayasan Pusat</p>
            </div>

            {/* Connection Link Arrow */}
            <div className="flex items-center justify-center">
              {/* Swirly connecting loop line SVG */}
              <svg className="w-12 h-12 md:w-16 md:h-8 text-warm-yellow rotate-90 md:rotate-0" viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M5,10 Q20,2 30,10 T55,10" strokeDasharray="4 3" />
                <path d="M48,5 L55,10 L48,15" />
              </svg>
            </div>

            {/* Logo Platform G-SEE */}
            <div className="bg-[#FAF8F5] p-6 rounded-[36px_18px_24px_12px]/[12px_24px_18px_36px] border-2 border-dashed border-primary-green/30 w-full max-w-[280px] text-center shadow-xs">
              {/* Ecosystem sketch SVG */}
              <svg className="w-16 h-16 text-primary-green mx-auto mb-3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="20" y="22" width="60" height="40" rx="6" strokeDasharray="3 1" fill="#E6F9F1" />
                <path d="M38 62 L32 75 H68 L62 62" />
                <path d="M50 50 C50 50 50 35 50 30 C50 26 53 23 55 23" />
                <path d="M50 38 C45 38 41 35 41 32" />
                <circle cx="28" cy="32" r="1.5" fill="currentColor" />
                <circle cx="72" cy="32" r="1.5" fill="currentColor" />
              </svg>
              <h4 className="font-baloo text-sm font-bold text-neutral-dark leading-none">G-SEE Platform</h4>
              <p className="text-[10px] text-neutral-gray mt-1.5 font-semibold uppercase tracking-wider">Ekosistem Digital</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM LINK TEASER */}
      <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
        {/* Subtle background star decoration */}
        <div className="absolute bottom-6 right-12 text-warm-yellow/30 text-5xl select-none font-bold hidden md:block">★</div>

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Dijalankan oleh Tim Pelaksana Profesional</h2>
          <p className="text-sm text-neutral-gray max-w-xl mx-auto leading-relaxed font-medium">
            Program G-SEE dikawal oleh 9 anggota tim yang berdedikasi tinggi di bidang kurikulum alternatif, kelestarian lingkungan bantaran sungai, dan konseling psikososial keluarga.
          </p>
          <div className="pt-2">
            <Link
              href="/tim"
              className="inline-flex items-center justify-center px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
            >
              Mengenal Tim Kami
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
