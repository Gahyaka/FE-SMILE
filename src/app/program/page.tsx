"use client";

import React from "react";
import Link from "next/link";

export default function ProgramPage() {
  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 select-none">
      
      {/* HEADER SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-16 text-center overflow-hidden border-b border-soft-mint">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
        {/* Swirly background doodles */}
        <div className="absolute top-10 left-10 text-warm-yellow/30 text-5xl select-none font-bold hidden md:block">★</div>
        <div className="absolute bottom-6 right-12 text-primary-green/20 text-5xl select-none font-bold hidden md:block">★</div>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs uppercase font-extrabold text-primary-dark tracking-widest bg-soft-mint px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] border-2 border-dashed border-primary-green/30">
            Pilar Kegiatan
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Program Unggulan <span className="text-primary-green relative">RA Sahabat
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Memadukan karakter luhur Aswaja NU, stimulasi tumbuh kembang motorik kognitif, dan pembiasaan hidup sehat harian.
          </p>
        </div>
      </section>

      {/* DETAIL PROGRAM PILLARS */}
      <section className="py-16 space-y-24 max-w-7xl mx-4 md:mx-6 lg:mx-8 xl:mx-auto px-4 sm:px-6 lg:px-8 bg-white/40 rounded-[40px_15px_50px_20px]/[20px_50px_15px_40px] border border-soft-mint my-8">
        
        {/* PILAR 1: KARAKTER ASWAJA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="w-16 h-16 bg-secondary-soft rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-secondary/40 flex items-center justify-center text-secondary shadow-xs">
              {/* Sketched Book/Quran SVG */}
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeDasharray="3 1" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              1. Pendidikan Karakter Aswaja <span className="text-secondary">(Nilai Keagamaan Islami)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Menanamkan cinta kepada Allah SWT dan Rasulullah SAW sejak usia dini menjadi misi utama kami. Melalui pilar ini, anak-anak diperkenalkan dengan ibadah harian praktis, asmaul husna, doa-doa pendek, sholawat, dan praktek latihan manasik haji cilik.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-secondary uppercase tracking-wide">Fokus Kegiatan:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-gray font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-secondary text-sm">✔</span> Hafalan Doa Harian Praktis
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary text-sm">✔</span> Pembiasaan Sholawat Aswaja
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary text-sm">✔</span> Praktek Wudhu & Sholat Dhuha
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-secondary text-sm">✔</span> Latihan Manasik Haji Cilik
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] p-8 rounded-[35px_15px_45px_20px]/[20px_45px_15px_35px] border-2 border-dashed border-secondary/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-secondary mb-3">Kegiatan Keagamaan Mingguan</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Setiap hari Jumat pagi, seluruh siswa KB dan RA diajak membaca sholawat nabi dan mendengarkan dongeng Islami interaktif mengenai akhlak terpuji para nabi.
              </p>
              <div className="bg-white p-5 rounded-[20px_40px_15px_35px]/[35px_15px_40px_20px] shadow-xs border-2 border-secondary/20 space-y-4">
                <div className="flex items-center justify-between border-b border-secondary-soft pb-2">
                  <span className="text-xs font-extrabold text-neutral-dark">Keterlibatan Ibadah Praktis</span>
                  <span className="text-xs font-extrabold text-secondary">95% Siswa Terbiasa</span>
                </div>
                <div className="w-full bg-secondary-soft h-3.5 rounded-[99px_15px_99px_15px] overflow-hidden border border-secondary/10">
                  <div className="bg-secondary h-full w-[95%] rounded-[99px_0px_0px_99px]"></div>
                </div>
                <div className="text-[10px] text-neutral-gray leading-relaxed font-semibold">
                  *Dipantau melalui lembar monitoring ibadah rumah tangga bekerja sama dengan wali murid.
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-dashed border-soft-mint" />

        {/* PILAR 2: PLAYFUL LEARNING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="w-16 h-16 bg-soft-mint rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-primary-green/40 flex items-center justify-center text-primary-green shadow-xs">
              {/* Sketched Puzzle Piece SVG */}
              <svg className="w-8 h-8 text-primary-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C12 22 12 13 12 8C12 5.5 14.5 3 16.5 3" />
                <path d="M12 12C8.5 12 5 9.5 5 7C5 5.5 7.5 5.5 12 8" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              2. Metode Playful Learning <span className="text-primary-green">(Bermain Seraya Belajar)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Eksplorasi sensorik motorik sangat penting di usia emas. Kami menerapkan metode belajar kreatif berbasis sentra, di mana anak belajar logika dasar (angka/huruf), sains sederhana, dan kreasi seni rupa lewat stimulasi permainan kelompok yang ceria.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-primary-dark uppercase tracking-wide">Inisiatif Kognitif:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-gray font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Permainan Sensorik Motorik
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Eksperimen Sains Cilik
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Sentra Seni & Gambar Ceria
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF9F5B] text-sm">🍂</span> Pengenalan Huruf & Angka
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1">
            <div className="bg-[#FAF8F5] p-8 rounded-[40px_15px_30px_25px]/[25px_30px_15px_40px] border-2 border-dashed border-primary-green/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Statistik Sentra Bermain</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Penyediaan media alat peraga edukatif (APE) dalam ruangan dan luar ruangan yang aman, ramah anak, serta merangsang daya motorik kognitif secara aktif.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-[15px_30px_15px_30px]/[30px_15px_30px_15px] border-2 border-dashed border-primary-green/20 text-center shadow-xs">
                  <span className="block text-2xl font-extrabold text-primary-green">32+</span>
                  <span className="text-[10px] text-neutral-gray uppercase font-extrabold mt-1 block">Alat Peraga Edukatif</span>
                </div>
                <div className="bg-white p-4 rounded-[30px_15px_30px_15px]/[15px_30px_15px_30px] border-2 border-dashed border-primary-green/20 text-center shadow-xs">
                  <span className="block text-2xl font-extrabold text-secondary">5 Sentra</span>
                  <span className="text-[10px] text-neutral-gray uppercase font-extrabold mt-1 block">Pilihan Belajar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-dashed border-soft-mint" />

        {/* PILAR 3: TUMBUH KEMBANG SEHAT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="w-16 h-16 bg-accent-soft rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-accent/40 flex items-center justify-center text-accent shadow-xs">
              {/* Sketched Apple/Gizi SVG */}
              <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8" strokeDasharray="3 1" />
                <path d="M12 4c1-2 4-2 4-2" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              3. Tumbuh Kembang Sehat <span className="text-accent">(Pola Hidup Bersih & Sehat)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Kesehatan fisik adalah fondasi utama anak mampu belajar secara aktif. Pilar **Tumbuh Kembang Sehat** mengawal pencatatan gizi rutin bulanan (bekerja sama dengan Puskesmas Berbah), penyediaan makanan sehat tambahan (PMT) berkala, serta edukasi sikat gigi dan cuci tangan bersih.
            </p>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-accent uppercase tracking-wide">Ragam Aktivitas:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-gray font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-accent text-sm">❤</span> Pengukuran Tinggi & Berat Bulanan
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent text-sm">❤</span> Program PMT Sehat Bergizi
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent text-sm">❤</span> Kampanye Cuci Tangan PHBS
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent text-sm">❤</span> Pemeriksaan Gigi Berkala
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="bg-[#FAF8F5] p-8 rounded-[25px_35px_15px_40px]/[40px_15px_35px_25px] border-2 border-dashed border-primary-green/30 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Monitoring Tumbuh Kembang</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Setiap data fisik siswa dicatat secara terpusat oleh guru untuk diarsipkan sebagai bukti fisik laporan akreditasi serta bahan evaluasi konsultasi tumbuh kembang anak dengan wali murid.
              </p>
              <div className="bg-white p-5 rounded-[40px_20px_35px_15px]/[15px_35px_20px_40px] shadow-xs border-2 border-accent/30 flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent-soft rounded-full flex items-center justify-center text-accent font-bold text-lg flex-shrink-0">💡</div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-neutral-dark">Penyediaan PMT Sehat</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Program pemberian makanan tambahan bergizi seminggu sekali (susu, bubur kacang hijau, buah segar).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* CALL TO ACTION */}
      <section className="bg-white py-16 text-center border-t-2 border-dashed border-primary-green/20 relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Tertarik Mendaftarkan Anak Anda di RA Sahabat?</h2>
          <p className="text-sm text-neutral-gray max-w-xl mx-auto leading-relaxed font-medium">
            Proses Penerimaan Peserta Didik Baru (PPDB) dapat dilakukan secara mudah secara daring melalui formulir pendaftaran awal di halaman utama kami.
          </p>
          <div className="pt-2">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
            >
              Isi Formulir PPDB Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
