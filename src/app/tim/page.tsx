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
      id: "smart-learning",
      name: "Tim Smart Learning",
      description: "Mengembangkan sistem teknologi pembelajaran cerdas, digitalisasi materi ajar, dan media belajar interaktif.",
      accentBg: "bg-soft-mint/40",
      accentBorder: "border-2 border-dashed border-primary-green/30",
      members: [
        {
          name: "Gahyaka Ararya Fairuz",
          role: "Project Manager",
          prodi: "Informatika '24",
          description: "Mengoordinasikan kolaborasi tim, merencanakan sprint pengembangan, dan menyelaraskan modul ajar digital.",
          avatarSeed: "from-green-400 to-emerald-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Fariz Husain Albar",
          role: "Frontend Developer",
          prodi: "Informatika '24",
          description: "Membangun antarmuka dashboard pembelajaran responsif yang mudah diakses dari perangkat low-end keluarga siswa.",
          avatarSeed: "from-teal-400 to-cyan-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Muhammad Redhy Kustanto",
          role: "Backend Developer",
          prodi: "Informatika '24",
          description: "Mengembangkan arsitektur server, basis data relasional, dan API handal untuk ekosistem belajar digital G-SEE.",
          avatarSeed: "from-emerald-400 to-teal-600",
          image: "/images/team/fariz.webp",
        },
      ],
    },
    {
      id: "smart-environment",
      name: "Tim Smart Environment",
      description: "Mengelola urban farming Gajahwong Farm, edukasi ekologis praktis (daur ulang), dan kebersihan lingkungan sekolah.",
      accentBg: "bg-warm-yellow/10",
      accentBorder: "border-2 border-dashed border-warm-yellow/40",
      members: [
        {
          name: "Muhammad Satria Fahrul",
          role: "IoT & Weather Analyst",
          prodi: "Informatika '25",
          description: "Mengintegrasikan sensor pemantauan cuaca mikro dan pencatatan kondisi kelembaban hidroponik Gajahwong Farm.",
          avatarSeed: "from-lime-400 to-green-600",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Adiib Tastamar Uam",
          role: "Eco-System Coordinator",
          prodi: "Biologi '24",
          description: "Menganalisis kondisi ekologis Sungai Gajahwong, merancang eko-pedagogi sungai, dan mengelola pembibitan urban farming.",
          avatarSeed: "from-yellow-400 to-amber-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Kania Rafha Zahira",
          role: "Environmental Tech Support",
          prodi: "Informatika '25",
          description: "Mengembangkan media edukasi daur ulang sampah berbasis digital untuk meningkatkan kesadaran ekologis anak.",
          avatarSeed: "from-green-500 to-emerald-700",
          image: "/images/team/fariz.webp",
        },
      ],
    },
    {
      id: "modul-pendampingan",
      name: "Tim Modul Pendampingan",
      description: "Menyusun panduan parenting, mengelola sesi konseling, dan memonitor tumbuh kembang kesejahteraan anak.",
      accentBg: "bg-soft-orange/10",
      accentBorder: "border-2 border-dashed border-soft-orange/30",
      members: [
        {
          name: "Azzahra Fadhillah Aulia",
          role: "Social Data Analyst",
          prodi: "Matematika '25",
          description: "Mengolah data kuantitatif hasil pemetaan sosial ekonomi keluarga wali murid Sekolah Gajahwong secara berkala.",
          avatarSeed: "from-amber-400 to-orange-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Nafisa Athaya Firdausi",
          role: "Lead Child Counselor",
          prodi: "Bimbingan dan Konseling Islam '24",
          description: "Menyusun panduan konseling anak, menyelenggarakan sesi terapi emosional, dan memonitor mental siswa.",
          avatarSeed: "from-orange-400 to-red-500",
          image: "/images/team/fariz.webp",
        },
        {
          name: "Viandra Seiscara",
          role: "Parenting Program Specialist",
          prodi: "Bimbingan dan Konseling Islam '24",
          description: "Mengorganisir kelas parenting bulanan untuk membangun pola asuh positif tanpa kekerasan di rumah tangga.",
          avatarSeed: "from-red-400 to-rose-500",
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
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
            Kolaborator Program
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Struktur Pelaksana <span className="text-primary-green relative">Tim G-SEE
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Sembilan pelaksana berdedikasi tinggi yang mengawal kurikulum, kelestarian lingkungan, dan pendampingan kesejahteraan sosial anak di bantaran sungai.
          </p>
        </div>
      </section>

      {/* TEAM GROUPS & MEMBERS */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-12 lg:px-20 space-y-20 pb-24 relative overflow-hidden">
        {/* Chalkboard grid overlay background for entire body section */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>

        {/* Background Floating Doodles representing the 3 pillars & classroom items */}
        {/* Sketched Lightbulb (ideas/curriculum for smart learning) - Top Left */}
        <svg className="absolute top-[5%] left-2 xl:left-8 w-16 h-16 text-warm-yellow/30 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M9 18h6M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17h8v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
        </svg>

        {/* Sketched Cloud - Top Right */}
        <svg className="absolute top-[12%] right-2 xl:right-8 w-16 h-10 text-primary-light/25 pointer-events-none hidden xl:block" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M10,40 C10,25 30,20 40,25 C50,15 75,20 75,35 C85,35 95,45 85,55 H15 C5,55 5,45 10,40 Z" strokeDasharray="3 2" />
        </svg>

        {/* Sketched Pencil - Middle Left */}
        <svg className="absolute top-[32%] left-3 xl:left-10 w-12 h-12 text-primary-green/25 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" strokeDasharray="2 1" />
        </svg>

        {/* Sketched Sprout leaf (nature/environment for smart environment) - Middle Right */}
        <svg className="absolute top-[48%] right-2 xl:right-8 w-18 h-18 text-primary-light/30 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 22C12 22 12 13 12 8C12 5.5 14.5 3 16.5 3" />
          <path d="M12 12C8.5 12 5 9.5 5 7C5 5.5 7.5 5.5 12 8" />
          <path d="M12 14C15.5 14 19 12 19 9.5C19 8 16.5 8 12 11" />
        </svg>

        {/* Sketched Smile Sun (children/mental health for parenting support) - Bottom Left */}
        <svg className="absolute bottom-[20%] left-2 xl:left-8 w-18 h-18 text-soft-orange/30 pointer-events-none hidden xl:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
          <path d="M9 10 Q9.5 9 10 10 M14 10 Q14.5 9 15 10 M8.5 14 Q12 18 15.5 14" />
        </svg>

        {/* Sketched Loop Arrow - Bottom Right */}
        <svg className="absolute bottom-[10%] right-3 xl:right-10 w-12 h-16 text-warm-yellow/25 pointer-events-none hidden xl:block" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M10,10 C25,5 35,20 25,35 C15,50 5,30 20,55 L12,48 M20,55 L25,48" strokeDasharray="2 1" />
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
                  <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(24,179,111,0.01)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none -z-10"></div>

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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,179,111,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(24,179,111,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-baloo text-3xl font-bold text-neutral-dark">Ingin Menjadi Bagian Dari Kami?</h2>
          <p className="text-sm text-neutral-gray max-w-xl mx-auto leading-relaxed font-medium">
            Pintu kolaborasi kami selalu terbuka bagi akademisi, mahasiswa, relawan profesional, dan pegiat lingkungan yang siap bersinergi.
          </p>
          <div className="pt-2">
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-primary-green hover:bg-primary-dark text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
            >
              Daftar Jadi Relawan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
