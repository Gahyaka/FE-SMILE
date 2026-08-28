"use client";

import React from "react";
import Link from "next/link";

export default function ProgramPage() {
  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 select-none">
      
      {/* HEADER SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-20 text-center overflow-hidden border-b border-neutral-gray/8 pt-32">
        {/* Subtle dot-grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(44,178,74,0.015)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-primary-green bg-primary-green/8 px-4 py-2 rounded-full border border-primary-green/10">
            Kurikulum & Kegiatan
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Program & <span className="text-primary-green relative">Kurikulum Unggulan
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary-green/20" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Memadukan Pembelajaran Mendalam (PM) dengan Kurikulum Berbasis Cinta (Panca Cinta) demi melahirkan generasi CERIA yang Qur'ani dan cinta tanah air.
          </p>
        </div>
      </section>

      {/* DETAIL PROGRAM PILLARS */}
      <section className="py-16 space-y-24 max-w-7xl mx-4 md:mx-6 lg:mx-8 xl:mx-auto px-4 sm:px-6 lg:px-8 bg-white/40 rounded-3xl border border-neutral-gray/8 my-8">
        
        {/* PROGRAM 1: KEAGAMAAN (Tahfidz Yanbu'a) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="w-16 h-16 bg-secondary/8 rounded-2xl border border-secondary/15 flex items-center justify-center text-secondary shadow-sm">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              1. Program Keagamaan <span className="text-secondary">(Religius)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Membangun rasa kecintaan terhadap Al-Qur'an sejak dini dengan menyelaraskan pengalaman belajar dengan nilai-nilai agama dan asmaul husna secara menyenangkan.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-stone-50/50 rounded-xl border border-neutral-gray/6">
                <h4 className="font-bold text-xs text-secondary uppercase tracking-wider mb-1">Tahfidz & Tahsin Qur'an</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                  Menghafal Al-Qur'an menggunakan metode setoran hafalan praktis *"One Day One Ayat"*, serta perbaikan bacaan (tahsin) menggunakan metode **Yanbu’a**.
                </p>
              </div>
              <div className="p-4 bg-stone-50/50 rounded-xl border border-neutral-gray/6">
                <h4 className="font-bold text-xs text-secondary uppercase tracking-wider mb-1">Pembiasaan Ibadah Harian</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                  Pelaksanaan sholat dhuha berjamaah, pembacaan sholawat, menghafal hadits-hadits pendek pilihan, doa sehari-hari, serta pengenalan Asmaul Husna secara rutin.
                </p>
              </div>
              <div className="p-4 bg-stone-50/50 rounded-xl border border-neutral-gray/6">
                <h4 className="font-bold text-xs text-secondary uppercase tracking-wider mb-1">Simulasi Manasik Haji</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                  Penyelenggaraan manasik haji cilik sebagai pengenalan rukun Islam kelima melalui simulasi fisik yang interaktif.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-neutral-gray/8 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-secondary mb-3">Target Keagamaan</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Setiap santri didorong untuk memiliki pembiasaan akhlakul karimah yang terpantau melalui sinergi guru dan orang tua.
              </p>
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-gray/8 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs font-bold text-neutral-dark">Kefasihan Ibadah Harian</span>
                  <span className="text-xs font-extrabold text-secondary">Hingga 95% Capaian</span>
                </div>
                <div className="w-full bg-stone-100 h-3.5 rounded-full overflow-hidden border border-neutral-gray/8">
                  <div className="bg-secondary h-full w-[95%] rounded-full"></div>
                </div>
                <div className="text-[10px] text-neutral-gray leading-relaxed font-semibold">
                  *Mufradat Bahasa Arab juga diperkenalkan sebanyak 4 kosakata baru setiap bulannya (48 kosakata dalam setahun).
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t border-neutral-gray/8" />

        {/* PROGRAM 2: PROGRAM KHUSUS (Mamahku Guruku & Siaga Bencana) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="w-16 h-16 bg-primary-green/8 rounded-2xl border border-primary-green/15 flex items-center justify-center text-primary-green shadow-sm">
              <svg className="w-8 h-8 text-primary-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              2. Program Khusus & Kemitraan
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Meningkatkan keterlibatan aktif orang tua serta menumbuhkan kesadaran diri anak terhadap lingkungan sosial dan alam sekitar.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-stone-50/50 rounded-xl border border-neutral-gray/6">
                <h4 className="font-bold text-xs text-primary-dark uppercase tracking-wider mb-1">Mamahku Adalah Guruku</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                  Program kolaboratif di mana orang tua/wali murid dengan keahlian khusus diundang secara sukarela ke madrasah untuk berbagi pengetahuan nyata kepada anak-anak.
                </p>
              </div>
              <div className="p-4 bg-stone-50/50 rounded-xl border border-neutral-gray/6">
                <h4 className="font-bold text-xs text-primary-dark uppercase tracking-wider mb-1">Madrasah Tanggap & Siaga Bencana</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                  Edukasi keselamatan dasar bagi murid dalam melindungi diri dari berbagai ancaman alam (seperti simulasi gempa bumi, banjir, letusan Gunung Merapi).
                </p>
              </div>
              <div className="p-4 bg-stone-50/50 rounded-xl border border-neutral-gray/6">
                <h4 className="font-bold text-xs text-primary-dark uppercase tracking-wider mb-1">Program Moderasi Beragama</h4>
                <p className="text-xs text-neutral-gray font-semibold leading-relaxed">
                  Pengenalan keragaman sosial dan perbedaan di sekitar untuk membina rasa toleransi, anti-kekerasan, dan saling menghormati sejak usia dini.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-neutral-gray/8 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Kolaborasi Kemitraan</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Kekuatan RA Sahabat didukung oleh jaringan stakeholder yang kuat, termasuk Puskesmas Berbah untuk pemantauan tumbuh kembang (Holistik Integratif).
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-neutral-gray/8 text-center shadow-xs">
                  <span className="block text-2xl font-extrabold text-primary-green">100%</span>
                  <span className="text-[10px] text-neutral-gray uppercase font-bold mt-1 block">Layanan PAUD HI</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-neutral-gray/8 text-center shadow-xs">
                  <span className="block text-2xl font-extrabold text-secondary">Jumat Pon</span>
                  <span className="text-[10px] text-neutral-gray uppercase font-bold mt-1 block">Budaya Jawa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t border-neutral-gray/8" />

        {/* PROGRAM 3: 7 KEBIASAAN ANAK INDONESIA HEBAT (7 KAIH) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="w-16 h-16 bg-accent/8 rounded-2xl border border-accent/15 flex items-center justify-center text-accent shadow-sm">
              <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <h2 className="font-baloo text-3xl font-bold text-neutral-dark">
              3. 7 Kebiasaan Anak Indonesia Hebat <span className="text-accent">(7 KAIH)</span>
            </h2>
            <p className="text-sm text-neutral-gray leading-relaxed font-medium">
              Kerangka pembiasaan positif harian yang sistematis dan praktis untuk menanamkan karakter luhur dan gaya hidup sehat mandiri pada anak.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex gap-2">
                <span className="text-accent font-extrabold text-sm">01.</span>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark">Bangun Pagi</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Melatih kesiapan anak mengawali hari.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-accent font-extrabold text-sm">02.</span>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark">Beribadah</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Pembiasaan spiritual harian.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-accent font-extrabold text-sm">03.</span>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark">Berolahraga</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Menjaga kebugaran jasmani fisik motorik.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-accent font-extrabold text-sm">04.</span>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark">Mengonsumsi Makanan Sehat</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Nutrisi bergizi seimbang.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-accent font-extrabold text-sm">05.</span>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark">Gemar Belajar</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Merangsang rasa ingin tahu kognitif.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-accent font-extrabold text-sm">06.</span>
                <div>
                  <h4 className="font-bold text-xs text-neutral-dark">Bermasyarakat</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Melatih interaksi dan kolaborasi sosial.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-neutral-gray/8 flex flex-col justify-center shadow-sm">
              <h3 className="font-baloo text-xl font-bold text-primary-dark mb-3">Tidur Cepat & Istirahat</h3>
              <p className="text-xs text-neutral-gray leading-relaxed mb-6 font-medium">
                Poin ketujuh dari 7 KAIH adalah membiasakan tidur cepat dan beristirahat yang cukup agar metabolisme tumbuh kembang anak berjalan optimal secara alami.
              </p>
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-gray/8 flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/8 rounded-full flex items-center justify-center text-accent font-bold text-lg flex-shrink-0">✓</div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-neutral-dark">Konsistensi Evaluasi Harian</h4>
                  <p className="text-[10px] text-neutral-gray font-medium mt-0.5">Dipadukan dengan buku monitoring siswa di madrasah dan rumah secara sinergi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* CALL TO ACTION */}
      <section className="bg-white py-16 text-center border-t border-neutral-gray/8 relative overflow-hidden">
        {/* Subtle dot-grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(44,178,74,0.015)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Tertarik Mendaftarkan Anak Anda di RA Sahabat?</h2>
          <p className="text-sm text-neutral-gray max-w-xl mx-auto leading-relaxed font-medium">
            Silakan hubungi kami untuk informasi kuota kelas pendaftaran melalui WhatsApp Admin di halaman utama.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-sm hover:shadow-md"
            >
              Hubungi WhatsApp Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
