"use client";

import React from "react";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  prodi: string;
  description: string;
  avatarSeed: string;
  image?: string;
}

interface TeamGroup {
  id: string;
  name: string;
  description: string;
  accentBg: string;
  accentBorder: string;
  members: TeamMember[];
}

export default function TimPage() {
  const teams: TeamGroup[] = [
    {
      id: "pengelola",
      name: "Pimpinan & Administrasi",
      description: "Mengelola kebijakan akademik, administrasi SPB/SPP, serta hubungan kemitraan dengan wali murid.",
      accentBg: "bg-soft-mint/40",
      accentBorder: "border-2 border-dashed border-primary-green/30",
      members: [
        {
          name: "Ibu Hj. Aminah, S.Pd.I.",
          role: "Kepala Sekolah & Humas",
          prodi: "S1 Pendidikan Islam Anak Usia Dini",
          description: "Mengarahkan kurikulum RA Sahabat dan mengkoordinasikan kemitraan dengan Kemenag serta Yayasan.",
          avatarSeed: "from-emerald-400 to-teal-600",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Ibu Nur Latifah, S.Pd.",
          role: "Bendahara & Admin SPP",
          prodi: "S1 Administrasi Pendidikan",
          description: "Mengelola administrasi pembayaran SPP siswa serta pembukuan keuangan operasional harian sekolah.",
          avatarSeed: "from-green-400 to-emerald-500",
          image: "/images/team/fariz.webp",
        },
      ],
    },
    {
      id: "pendidik",
      name: "Tim Guru Pendidik",
      description: "Mengampu pembelajaran harian kelas Kelompok Bermain (KB) dan Raudhatul Athfal (RA) secara kreatif.",
      accentBg: "bg-secondary-soft/50",
      accentBorder: "border-2 border-dashed border-secondary/30",
      members: [
        {
          name: "Ibu Siti Khotimah, S.Pd.",
          role: "Guru Utama Kelas RA (A)",
          prodi: "S1 Bimbingan Konseling Islam",
          description: "Mengampu stimulasi motorik halus dan bimbingan akhlak serta sholawat untuk kelompok usia 4-5 tahun.",
          avatarSeed: "from-yellow-400 to-amber-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Ibu Rohmana, A.Ma.",
          role: "Guru Pendamping Kelas RA (B)",
          prodi: "D3 Pendidikan Guru TK",
          description: "Membantu eksplorasi seni, kreativitas menggambar, dan pembiasaan ibadah praktis wudhu/sholat harian.",
          avatarSeed: "from-lime-400 to-green-600",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Ibu Khairun Nisa, S.Pd.",
          role: "Guru Utama Kelas KB",
          prodi: "S1 Pendidikan Guru PAUD",
          description: "Mengampu pengenalan huruf/angka berbasis permainan edukasi kelompok anak usia 3-4 tahun.",
          avatarSeed: "from-orange-400 to-red-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Ibu Azzahra Fadhillah, S.Sos.",
          role: "Guru Pendamping KB",
          prodi: "S1 Sosiologi Agama",
          description: "Mengelola aktivitas dongeng kisah nabi, pengenalan emosi, dan sosialisasi bermain luar ruangan.",
          avatarSeed: "from-teal-400 to-cyan-500",
          image: "/images/team/fariz.webp",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 select-none">
      
      {/* HEADER SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-16 text-center overflow-hidden border-b border-soft-mint">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
        {/* Swirly background doodles */}
        <div className="absolute top-10 left-10 text-warm-yellow/30 text-5xl select-none font-bold hidden md:block">★</div>
        <div className="absolute bottom-6 right-12 text-primary-green/20 text-5xl select-none font-bold hidden md:block">★</div>

        {/* Paper Plane Doodle */}
        <svg className="absolute top-8 right-1/4 w-12 h-12 text-primary-green/15 pointer-events-none hidden lg:block animate-pulse duration-[3000ms]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 2L2 8.66L11.5 12.5L16 21L22 2Z" />
          <path d="M11.5 12.5L22 2" strokeDasharray="2 1" />
        </svg>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs uppercase font-extrabold text-primary-dark tracking-widest bg-soft-mint px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] border-2 border-dashed border-primary-green/30">
            Profil Pendidik
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Dewan Guru <span className="text-primary-green relative">RA Sahabat
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Mengenal lebih dekat 6 pendidik berdedikasi tinggi yang mengasuh dan mengajar di KB/RA Sahabat Berbah Sleman.
          </p>
        </div>
      </section>

      {/* TEAM GROUPS & MEMBERS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-12 lg:px-20 space-y-20 pb-24 relative overflow-hidden">
        {/* Chalkboard grid overlay background for entire body section */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>

        {/* Background Floating Doodles */}
        <svg className="absolute top-[5%] left-2 xl:left-8 w-16 h-16 text-warm-yellow/30 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M9 18h6M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17h8v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
        </svg>

        <svg className="absolute top-[42%] right-2 xl:right-8 w-18 h-18 text-primary-light/30 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 22C12 22 12 13 12 8C12 5.5 14.5 3 16.5 3" />
          <path d="M12 12C8.5 12 5 9.5 5 7C5 5.5 7.5 5.5 12 8" />
        </svg>

        <svg className="absolute bottom-[20%] left-2 xl:left-8 w-18 h-18 text-soft-orange/30 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
          <path d="M9 10 Q9.5 9 10 10 M14 10 Q14.5 9 15 10 M8.5 14 Q12 18 15.5 14" />
        </svg>

        {teams.map((group) => (
          <div key={group.id} className="space-y-8">
            
            {/* Group Header Title Card */}
            <div className={`p-6 rounded-[24px_12px_36px_18px]/[18px_36px_12px_24px] ${group.accentBg} ${group.accentBorder} shadow-xs`}>
              <h2 className="font-baloo text-2xl font-bold text-neutral-dark">
                {group.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-gray font-semibold leading-relaxed mt-1.5">
                {group.description}
              </p>
            </div>

            {/* Members Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {group.members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[30px_15px_40px_20px]/[20px_40px_15px_30px] p-6 shadow-xs border-2 border-dashed border-primary-green/20 hover:border-solid hover:shadow-md transition-all duration-300 group flex flex-col justify-between max-w-[280px] mx-auto w-full relative overflow-hidden"
                >
                  {/* Subtle child notebook line background for each card */}
                  <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none -z-10"></div>

                  <div>
                    {/* Sketched Photo Box Wrapper with double outline effect */}
                    <div className="relative mb-6">
                      {/* Paper tape (washi tape) at the top */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-warm-yellow/60 border border-warm-yellow/70 rotate-[-4deg] rounded-xs shadow-2xs z-20 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-[1px] border-t border-dashed border-warm-yellow/30"></div>
                      </div>
                      
                      {/* Offset sketchy background border */}
                      <div className="absolute -bottom-1.5 -right-1.5 inset-0 border-2 border-primary-green/20 rounded-[20px_10px_25px_12px]/[12px_25px_10px_20px] pointer-events-none -z-10 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform"></div>

                      {/* Sketched Portrait Placeholder Container */}
                      <div className="w-full aspect-[4/5] bg-gradient-to-tr from-soft-mint to-primary-light/20 rounded-[20px_10px_25px_12px]/[12px_25px_10px_20px] border-2 border-neutral-dark relative overflow-hidden">
                        
                        {/* Member profile image (fariz.webp) */}
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-tr ${member.avatarSeed} opacity-75 group-hover:scale-103 transition-transform duration-500`}></div>
                        )}

                        {/* Tilted name badge sticker at the bottom */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#FAF8F5] py-2.5 px-3 rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-dashed border-primary-green/30 flex flex-col items-center text-center rotate-[-1.5deg] shadow-xs group-hover:rotate-[1deg] transition-transform duration-300">
                          <span className="text-[11px] uppercase font-extrabold text-primary-dark tracking-wide truncate max-w-full leading-tight">
                            {member.role}
                          </span>
                          <span className="text-[9px] text-neutral-gray font-bold mt-1 truncate max-w-full leading-none">
                            {member.prodi}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-baloo text-lg font-extrabold text-neutral-dark mb-2 text-center group-hover:text-primary-green transition-colors">
                      {member.name}
                    </h3>
                  </div>
                  
                  <p className="text-[11px] text-neutral-gray text-center leading-relaxed font-semibold border-t border-soft-mint/60 pt-3 mt-1">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        ))}
      </section>

      {/* FOOTER CTA BANNER */}
      <section className="bg-white py-16 text-center border-t-2 border-dashed border-primary-green/20 relative overflow-hidden">
        {/* Background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Ingin Menjadi Bagian Dari Kami?</h2>
          <p className="text-sm text-neutral-gray max-w-xl mx-auto leading-relaxed font-medium">
            Pintu kolaborasi dan kemitraan selalu terbuka bagi akademisi, mahasiswa, relawan profesional, dan pegiat sosial yang siap bersinergi dengan RA Sahabat.
          </p>
          <div className="pt-2">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
            >
              Daftar PPDB Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
