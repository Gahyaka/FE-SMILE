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

  // Custom Chibi Girl & Boy Illustration in SVG
  const ChibiIllustration = () => (
    <svg className="w-full h-full text-primary-green drop-shadow-md" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle with Chalkboard Dotted Line */}
      <circle cx="100" cy="100" r="85" fill="#E7F8EA" stroke="#2CB24A" strokeWidth="3" strokeDasharray="6 4" />
      
      {/* Cloud Doodles */}
      <path d="M20 60 C20 50, 40 45, 45 50 C50 40, 70 45, 65 55" stroke="#8ED96B" strokeWidth="2" strokeLinecap="round" />
      <path d="M140 50 C140 42, 155 38, 160 42 C165 35, 180 38, 175 48" stroke="#8ED96B" strokeWidth="2" strokeLinecap="round" />

      {/* Sparkles */}
      <path d="M30 140 L38 140 M34 136 L34 144" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M170 130 L176 130 M173 127 L173 133" stroke="#EC1E8C" strokeWidth="2" strokeLinecap="round" />

      {/* Boy Character (Left) */}
      <g>
        {/* Kopiah (Purple) */}
        <path d="M50 100 L90 100 L85 82 L55 82 Z" fill="#7A2E8F" stroke="#2B2B2B" strokeWidth="2" />
        <path d="M50 100 L90 100" stroke="#FAF8F5" strokeWidth="1.5" />
        {/* Face */}
        <circle cx="70" cy="115" r="18" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="2" />
        {/* Ears */}
        <circle cx="51" cy="115" r="4" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="2" />
        {/* Hair */}
        <path d="M53 105 Q65 100 75 103" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="63" cy="112" r="2" fill="#2B2B2B" />
        <circle cx="77" cy="112" r="2" fill="#2B2B2B" />
        {/* Cheeks */}
        <circle cx="59" cy="118" r="1.5" fill="#EC1E8C" opacity="0.5" />
        <circle cx="81" cy="118" r="1.5" fill="#EC1E8C" opacity="0.5" />
        {/* Smile */}
        <path d="M66 123 Q70 127 74 123" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" />
        {/* Clothes (Green) */}
        <path d="M50 133 C50 133, 45 160, 70 160 C95 160, 90 133, 90 133" fill="#2CB24A" stroke="#2B2B2B" strokeWidth="2" />
      </g>

      {/* Girl Character (Right) */}
      <g>
        {/* Hijab (Pink) */}
        <path d="M105 105 C105 90, 145 90, 145 105 C145 125, 140 160, 125 162 C110 160, 105 125, 105 105" fill="#EC1E8C" stroke="#2B2B2B" strokeWidth="2" />
        <path d="M110 120 C110 110, 140 110, 140 120 C140 130, 135 155, 125 155 C115 155, 110 130, 110 120" fill="#EC1E8C" />
        {/* Face inside Hijab */}
        <circle cx="125" cy="120" r="14" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="2" />
        {/* Eyes */}
        <circle cx="119" cy="118" r="2" fill="#2B2B2B" />
        <circle cx="131" cy="118" r="2" fill="#2B2B2B" />
        {/* Cheeks */}
        <circle cx="115" cy="123" r="1.5" fill="#EC1E8C" opacity="0.5" />
        <circle cx="135" cy="123" r="1.5" fill="#EC1E8C" opacity="0.5" />
        {/* Smile */}
        <path d="M121 127 Q125 130 129 127" stroke="#2B2B2B" strokeWidth="2" strokeLinecap="round" />
        {/* Clothes (Purple) */}
        <path d="M108 135 C108 135, 105 160, 125 160 C145 160, 142 135, 142 135" fill="#7A2E8F" stroke="#2B2B2B" strokeWidth="2" />
      </g>
    </svg>
  );

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark select-none bg-[#FAF8F5] pt-20">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-white pt-24 pb-16 overflow-hidden">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
        
        {/* Decorative Doodles */}
        <div className="absolute top-12 left-10 text-warm-yellow/30 text-5xl font-bold select-none hidden md:block animate-bounce duration-[4000ms]">★</div>
        <div className="absolute bottom-16 right-16 text-secondary-soft/80 text-6xl font-bold select-none hidden md:block rotate-12">✿</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-primary-dark bg-soft-mint px-4 py-2 rounded-lg border-2 border-dashed border-primary-green/30">
                Pendaftaran PPDB TA 2026/2027 Dibuka!
              </span>
              <h1 className="font-baloo text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark leading-tight">
                Membentuk Generasi <span className="text-primary-green relative">Cerdas
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                    <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span> & Berkarakter Islami
              </h1>
              <p className="text-sm sm:text-base text-neutral-gray max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                KB/RA Sahabat Berbah Sleman berkomitmen menghadirkan ekosistem pendidikan anak usia dini yang menyenangkan, berakhlak mulia, dan berlandaskan nilai Aswaja NU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <a
                  href="#ppdb"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-accent hover:bg-accent-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
                >
                  Daftar PPDB Online
                </a>
                <Link
                  href="/tim"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white hover:bg-primary-soft text-primary-green font-extrabold text-base transition-all shadow-xs border-2 border-dashed border-primary-green/40"
                >
                  Kenali Profil Guru
                </Link>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 relative w-full aspect-square max-w-[380px] mx-auto">
              <ChibiIllustration />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Berkebun di Halaman Sekolah</h4>
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
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Hari Santri & Sholawat Bersama</h4>
                <p className="text-[10px] text-neutral-gray font-semibold mt-1">Penanaman akhlak mulia sejak usia dini</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PPDB REGISTER FORM SECTION */}
      <section id="ppdb" className="py-20 bg-[#FAF8F5] relative overflow-hidden border-b border-soft-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left side PPDB Info */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="inline-block text-xs font-accent font-semibold uppercase tracking-wider text-accent bg-accent-soft px-4 py-2 rounded-lg border-2 border-dashed border-accent/30">
                  PPDB TA 2026/2027
                </span>
                <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Mari Bergabung Menjadi Sahabat Cilik Kami!</h2>
                <p className="text-xs sm:text-sm text-neutral-gray leading-relaxed font-semibold">
                  Menerima pendaftaran baru untuk Kelompok Bermain (KB, Usia 3-4 Tahun) dan Raudhatul Athfal (RA, Usia 4-6 Tahun). 
                </p>
                <div className="p-5 bg-white rounded-lg border-2 border-dashed border-primary-green/20 space-y-3 font-semibold text-xs text-neutral-gray">
                  <p className="flex items-center gap-2"><span className="text-primary-green">★</span> Fotokopi Akta Kelahiran Anak (1 Lembar)</p>
                  <p className="flex items-center gap-2"><span className="text-primary-green">★</span> Fotokopi Kartu Keluarga (1 Lembar)</p>
                  <p className="flex items-center gap-2"><span className="text-primary-green">★</span> Mengisi Formulir PPDB Online/Manual</p>
                </div>
              </div>
              
              <div>
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20RA%20Sahabat,%20saya%20tertarik%20tanya%20PPDB..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold transition-all border-2 border-primary-dark shadow-md"
                >
                  Hubungi Admin PPDB (WhatsApp)
                </a>
              </div>
            </div>

            {/* Right side PPDB Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[40px_15px_30px_25px]/[25px_30px_15px_40px] shadow-sm border-2 border-dashed border-primary-green/30 relative">
              {/* Notebook grid watermark */}
              <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none rounded-[40px_15px_30px_25px]/[25px_30px_15px_40px]"></div>
              
              <h3 className="font-baloo text-2xl font-bold text-neutral-dark mb-2 relative z-10">Formulir Pendaftaran PPDB Awal</h3>
              <p className="text-xs text-neutral-gray mb-8 font-semibold relative z-10">Isi biodata anak dan orang tua dengan lengkap. Tim admin RA Sahabat akan menghubungi Anda via WhatsApp untuk verifikasi berkas.</p>
              
              <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
                <div>
                  <label htmlFor="childName" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Nama Lengkap Anak</label>
                  <input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3.5 rounded-[12px_8px_15px_10px]/[10px_15px_8px_12px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm transition-colors font-semibold select-text"
                    placeholder="Masukkan nama lengkap anak"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="parentName" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Nama Orang Tua / Wali</label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3.5 rounded-[10px_15px_8px_12px]/[12px_8px_15px_10px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm transition-colors font-semibold select-text"
                      placeholder="Nama Ibu/Ayah/Wali"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">No. WhatsApp Aktif</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3.5 rounded-[12px_8px_15px_10px]/[10px_15px_8px_12px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm transition-colors font-semibold select-text"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="classType" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Pilihan Jenjang Kelas</label>
                  <select
                    id="classType"
                    name="classType"
                    value={formData.classType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3.5 rounded-[10px_15px_8px_12px]/[12px_8px_15px_10px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm bg-white transition-colors font-semibold select-text"
                  >
                    <option value="KB">Kelompok Bermain (KB, Usia 3-4 Tahun)</option>
                    <option value="RA">Raudhatul Athfal (RA, Usia 4-6 Tahun)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitted}
                  className={`w-full py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] font-extrabold text-base transition-all border-2 border-primary-dark shadow-md cursor-pointer ${
                    formSubmitted
                      ? "bg-neutral-gray text-white cursor-not-allowed"
                      : "bg-accent hover:bg-accent-dark text-white hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {formSubmitted ? "Mengirim Data..." : "Kirim Formulir PPDB"}
                </button>
              </form>
            </div>

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

            {/* Right Maps SVG Drawing */}
            <div className="lg:col-span-6">
              <div className="w-full aspect-video bg-white rounded-2xl border-2 border-neutral-dark relative overflow-hidden flex items-center justify-center p-4">
                {/* Coordinates grids background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                
                {/* Maps Sleman Berbah Illustration in SVG */}
                <svg className="absolute w-full h-full inset-0 text-primary-green/15 pointer-events-none" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  {/* Road grid lines */}
                  <path d="M10 50 Q100 20 190 50" strokeDasharray="3 3" />
                  <path d="M60 10 L60 90" strokeDasharray="3 3" />
                  <path d="M140 10 L140 90" strokeDasharray="3 3" />
                  
                  {/* School House Marker */}
                  <rect x="85" y="35" width="30" height="20" rx="3" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="2" />
                  <polygon points="80,35 100,20 120,35" fill="#7A2E8F" stroke="#2B2B2B" strokeWidth="2" />
                  <circle cx="100" cy="45" r="2" fill="#EC1E8C" />
                </svg>

                <div className="relative z-10 bg-white/95 backdrop-blur-xs py-2 px-4 rounded-lg border-2 border-primary-green/30 text-center shadow-xs rotate-[-1.5deg]">
                  <p className="text-[10px] font-extrabold text-primary-dark uppercase">KB/RA Sahabat Berbah</p>
                  <p className="text-[9px] text-neutral-gray mt-0.5 font-bold">Sleman, Yogyakarta</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
