"use client";

import React from "react";
import Link from "next/link";

export default function ProgramPage() {
  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 select-none">
      
      {/* HEADER SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-16 text-center overflow-hidden border-b border-soft-mint">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
        {/* Swirly background doodles */}
        <div className="absolute top-10 left-10 text-warm-yellow/30 text-5xl select-none font-bold hidden md:block">★</div>
        <div className="absolute bottom-6 right-12 text-primary-green/20 text-5xl select-none font-bold hidden md:block">★</div>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs uppercase font-extrabold text-primary-dark tracking-widest bg-soft-mint px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] border-2 border-dashed border-primary-green/30">
            Tiga Pilar Integrasi
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Program Kerja Utama <span className="text-primary-green relative">G-SEE
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Menyatukan modul belajar digital alternatif, aksi nyata pelestarian lingkungan sungai, dan pendampingan kesejahteraan psikososial keluarga secara terpadu.
          </p>
        </div>
      </section>

      {/* DETAIL PROGRAM PILLARS */}
      <section className="py-16 space-y-24 max-w-7xl mx-4 md:mx-6 lg:mx-8 xl:mx-auto px-4 sm:px-6 lg:px-8 bg-white/40 rounded-[40px_15px_50px_20px]/[20px_50px_15px_40px] border border-soft-mint my-8">
        
        {/* PILAR 1: SMART LEARNING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="w-16 h-16 bg-soft-mint rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-primary-green/40 flex items-center justify-center text-primary-green shadow-xs">
              {/* Sketched Computer SVG */}
              <svg className="w-8 h-8 text-primary-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="11" rx="2" strokeDasharray="3 1" />
                <path d="M2 19h20 M5 19l2-4 M19 19l-2-4" />
                <path d="M8 8h8M8 11h4" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              1. Smart Learning <span className="text-primary-green">(Digitalisasi Kelas Alternatif)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Kami percaya keterbatasan ekonomi tidak boleh membatasi anak-anak Sekolah Gajahwong dalam mengenal perkembangan IT. Pilar **Smart Learning** berfokus pada pembangunan infrastruktur ajar digital ramah anak, modul game-based learning, dan dashboard visual pemantau kemajuan belajar siswa.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary-dark uppercase tracking-wide">Fokus Kegiatan:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-gray font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-primary-green text-sm">✔</span> Modul Game-Based Learning
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-green text-sm">✔</span> Dashboard Evaluasi Siswa
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-green text-sm">✔</span> Pengenalan Dasar Logika IT
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-green text-sm">✔</span> Media Belajar Interaktif
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] p-8 rounded-[35px_15px_45px_20px]/[20px_45px_15px_35px] border-2 border-dashed border-primary-green/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Sistem Evaluasi Belajar Cerdas</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Sistem dashboard evaluasi dirancang agar berjalan responsif di smartphone berspesifikasi rendah, memudahkan wali murid dan relawan guru melacak laporan bulanan secara praktis.
              </p>
              <div className="bg-white p-5 rounded-[20px_40px_15px_35px]/[35px_15px_40px_20px] shadow-xs border-2 border-primary-green/20 space-y-4">
                <div className="flex items-center justify-between border-b border-soft-mint pb-2">
                  <span className="text-xs font-extrabold text-neutral-dark">Rasio Kesiapan Digital</span>
                  <span className="text-xs font-extrabold text-primary-green">85% Sukses</span>
                </div>
                <div className="w-full bg-soft-mint h-3.5 rounded-[99px_15px_99px_15px] overflow-hidden border border-primary-green/10">
                  <div className="bg-primary-green h-full w-[85%] rounded-[99px_0px_0px_99px]"></div>
                </div>
                <div className="text-[10px] text-neutral-gray leading-relaxed font-semibold">
                  *Teruji secara responsif pada perangkat smartphone berspesifikasi rendah milik keluarga siswa.
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-dashed border-soft-mint" />

        {/* PILAR 2: SMART ENVIRONMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="w-16 h-16 bg-warm-yellow/20 rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-warm-yellow/50 flex items-center justify-center text-primary-green shadow-xs">
              {/* Sketched Leaf SVG */}
              <svg className="w-8 h-8 text-primary-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C12 22 12 13 12 8C12 5.5 14.5 3 16.5 3" strokeDasharray="3 1.5" />
                <path d="M12 12C8.5 12 5 9.5 5 7C5 5.5 7.5 5.5 12 8" />
                <path d="M12 10C15.5 10 19 8 19 5.5C19 4 16.5 4 12 7" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              2. Smart Environment <span className="text-primary-green">(Eko-Pedagogi Praktis)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Bertempat di bantaran Sungai Gajahwong, Sekolah Gajahwong berkomitmen menumbuhkan kecintaan terhadap alam sejak dini. Program **Smart Environment** mengintegrasikan kebun pertanian hidroponik Gajahwong Farm, peternakan mandiri, aksi bersih sungai, dan daur ulang sampah plastik kreatif.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary-dark uppercase tracking-wide">Inisiatif Hijau:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-gray font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Gajahwong Farm & Hydroponics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Workshop Plastik Kreatif
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Edukasi Kebersihan Sungai
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Kompos Mandiri Skala Rumah
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1">
            <div className="bg-[#FAF8F5] p-8 rounded-[40px_15px_30px_25px]/[25px_30px_15px_40px] border-2 border-dashed border-primary-green/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Gajahwong Farm Dashboard</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Anak-anak dilibatkan aktif mencatat pertumbuhan sayur hidroponik harian dan mempelajari perubahan iklim mikro sungai secara interaktif lewat representasi data visual sederhana.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-[15px_30px_15px_30px]/[30px_15px_30px_15px] border-2 border-dashed border-primary-green/20 text-center shadow-xs">
                  <span className="block text-2xl font-extrabold text-primary-green">120+</span>
                  <span className="text-[10px] text-neutral-gray uppercase font-extrabold mt-1 block">Sayur Hidroponik</span>
                </div>
                <div className="bg-white p-4 rounded-[30px_15px_30px_15px]/[15px_30px_15px_30px] border-2 border-dashed border-primary-green/20 text-center shadow-xs">
                  <span className="block text-2xl font-extrabold text-warm-yellow">15 kg</span>
                  <span className="text-[10px] text-neutral-gray uppercase font-extrabold mt-1 block">Kompos per Bulan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-dashed border-soft-mint" />

        {/* PILAR 3: MODUL PENDAMPINGAN ANAK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="w-16 h-16 bg-soft-orange/20 rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-soft-orange/50 flex items-center justify-center text-soft-orange shadow-xs">
              {/* Sketched Heart SVG */}
              <svg className="w-8 h-8 text-soft-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21C12 21 3 15 3 9C3 5.5 5.5 3 9 3C11 3 12 4.5 12 4.5C12 4.5 13 3 15 3C18.5 3 21 5.5 21 9C21 15 12 21 12 21Z" strokeDasharray="3 1" />
                <path d="M8 9h8" strokeWidth="1.5" />
                <circle cx="12" cy="9" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              3. Modul Pendampingan Anak <span className="text-soft-orange">(Psikososial & Parenting)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Mendidik anak membutuhkan keterlibatan harmonis lingkungan keluarga. Pilar **Modul Pendampingan** menghadirkan sesi bimbingan psikolog anak, konseling guru, kelas parenting terarah, serta pemantauan sosial ekonomi keluarga untuk mendukung advokasi hak-hak sipil anak.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary-dark uppercase tracking-wide">Ragam Aktivitas:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-gray font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-soft-orange text-sm">❤</span> Kelas Parenting Bulanan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-soft-orange text-sm">❤</span> Konseling Tumbuh Kembang
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-soft-orange text-sm">❤</span> Monitoring Kesejahteraan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-soft-orange text-sm">❤</span> Advokasi Hak Sipil Anak (KIA)
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] p-8 rounded-[25px_35px_15px_40px]/[40px_15px_35px_25px] border-2 border-dashed border-primary-green/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Sinergi Orang Tua & Guru</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Kami menyediakan lembar monitoring kesejahteraan emosional terpadu yang diisi secara kolaboratif oleh guru pengajar di sekolah dan orang tua siswa di rumah.
              </p>
              <div className="bg-white p-5 rounded-[40px_20px_35px_15px]/[15px_35px_20px_40px] shadow-xs border-2 border-soft-orange/30 flex items-center space-x-4">
                <div className="w-12 h-12 bg-soft-orange/10 rounded-full flex items-center justify-center text-soft-orange font-bold text-lg flex-shrink-0">💡</div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-neutral-dark">Pentingnya Kelas Parenting</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Membangun kebiasaan disiplin positif dan komunikasi asertif tanpa kekerasan di rumah tangga.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* CALL TO ACTION */}
      <section className="bg-white py-16 text-center border-t-2 border-dashed border-primary-green/20 relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Tertarik Mendukung Pilar Kegiatan G-SEE?</h2>
          <p className="text-sm text-neutral-gray max-w-xl mx-auto leading-relaxed font-medium">
            Anda dapat bergabung sebagai relawan pengajar di kelas digital alternatif, donatur alat praktikum daur ulang Gajahwong Farm, atau mitra kolaborator strategis.
          </p>
          <div className="pt-2">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
            >
              Hubungi Kami Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
