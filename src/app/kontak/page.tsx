"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function KontakPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "PPDB",
    message: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", subject: "PPDB", message: "" });
      alert("Terima kasih! Pesan/Pertanyaan Anda berhasil terkirim. Admin RA Sahabat akan segera menghubungi Anda.");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 select-none">
      
      {/* HEADER SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-16 text-center overflow-hidden border-b border-soft-mint">
        {/* Chalkboard grid overlay background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
        {/* Swirly background doodles */}
        <div className="absolute top-10 left-10 text-warm-yellow/30 text-5xl select-none font-bold hidden md:block animate-pulse">★</div>
        <div className="absolute bottom-6 right-12 text-primary-green/20 text-5xl select-none font-bold hidden md:block">★</div>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs uppercase font-extrabold text-primary-dark tracking-widest bg-soft-mint px-4 py-2 rounded-[99px_15px_99px_15px]/[15px_99px_15px_99px] border-2 border-dashed border-primary-green/30">
            Hubungi Kami
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Hubungi Sekolah <span className="text-primary-green relative">RA Sahabat
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-warm-yellow" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                <path d="M0,5 Q50,9 100,5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-gray max-w-2xl mx-auto leading-relaxed font-medium">
            Punya pertanyaan mengenai pendaftaran PPDB, program belajar, atau kemitraan yayasan? Sampaikan kepada kami di bawah ini.
          </p>
        </div>
      </section>

      {/* FORM AND DETAILS CONTENT */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative">
        
        {/* Floating background loop doodle */}
        <svg className="absolute top-1/2 -left-16 w-24 h-24 text-primary-light/10 pointer-events-none hidden xl:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 80 Q30 20 50 80 T90 20" strokeDasharray="3 3" />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-10">
          
          {/* Left Column: Contact details & school location */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="bg-white p-8 rounded-[25px_15px_30px_20px]/[20px_30px_15px_25px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-6">
              <h2 className="font-baloo text-2xl font-bold text-primary-dark">KB/RA Sahabat Berbah</h2>
              
              <div className="space-y-5 text-xs sm:text-sm text-neutral-gray font-semibold">
                <div className="flex items-start gap-3.5">
                  {/* Sketched Map Pin SVG */}
                  <svg className="w-5 h-5 text-primary-green mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeDasharray="3 1.5" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <strong className="text-neutral-dark block mb-1">Alamat Fisik:</strong>
                    KB/RA Sahabat, Berbah, Kabupaten Sleman, D.I. Yogyakarta, Indonesia.
                  </div>
                </div>
                
                <div className="flex items-center gap-3.5">
                  {/* Sketched Phone SVG */}
                  <svg className="w-5 h-5 text-primary-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeDasharray="3 1" />
                  </svg>
                  <div>
                    <strong className="text-neutral-dark block mb-1">Telepon/WhatsApp:</strong>
                    +62 812-3456-7890 (Admin RA Sahabat)
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  {/* Sketched Email Envelope SVG */}
                  <svg className="w-5 h-5 text-primary-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeDasharray="3 1" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <strong className="text-neutral-dark block mb-1">Email Resmi:</strong>
                    admin@rasahabat.sch.id
                  </div>
                </div>
              </div>
            </div>

            {/* Sketched Map Frame */}
            <div className="bg-[#FAF8F5] p-5 rounded-[25px_15px_30px_20px]/[20px_30px_15px_25px] border-2 border-dashed border-primary-green/30 shadow-xs space-y-3">
              <span className="text-xs font-extrabold text-primary-dark uppercase tracking-widest block">Lokasi RA Sahabat Berbah</span>
              
              {/* Creative Map Doodle Illustration inside map container */}
              <div className="w-full aspect-video bg-white rounded-2xl border-2 border-neutral-dark relative overflow-hidden flex items-center justify-center p-3">
                {/* Chalkboard grid overlay background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                
                {/* Sketched River/Road Wave Doodle */}
                <svg className="absolute w-full h-full inset-0 text-primary-green/15 pointer-events-none" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M10 50 Q100 20 190 50" strokeDasharray="4 3" />
                  <path d="M60 10 L60 90" strokeDasharray="4 3" />
                  
                  {/* School House Marker */}
                  <rect x="85" y="35" width="30" height="20" rx="3" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="2" />
                  <polygon points="80,35 100,20 120,35" fill="#7A2E8F" stroke="#2B2B2B" strokeWidth="2" />
                  <circle cx="100" cy="45" r="2" fill="#EC1E8C" />
                </svg>
                
                <div className="relative z-10 bg-white/95 backdrop-blur-xs py-2 px-4 rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-primary-green/30 text-center shadow-xs rotate-[-1.5deg]">
                  <p className="text-[10px] font-extrabold text-primary-dark uppercase">KB/RA Sahabat Berbah</p>
                  <p className="text-[9px] text-neutral-gray mt-0.5 font-bold">Sleman, Yogyakarta</p>
                </div>
              </div>
            </div>
            
            <div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold text-base transition-all shadow-md hover:-translate-y-0.5 border-2 border-primary-dark"
              >
                {/* Sketched Message SVG */}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Hubungi Admin Sekolah
              </a>
            </div>
          </div>

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[40px_15px_30px_25px]/[25px_30px_15px_40px] shadow-sm border-2 border-dashed border-primary-green/30 relative">
            {/* Notebook grid lines watermark */}
            <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none rounded-[40px_15px_30px_25px]/[25px_30px_15px_40px]"></div>

            <h3 className="font-baloo text-2xl font-bold text-neutral-dark mb-2 relative z-10">Formulir Pesan & Pertanyaan</h3>
            <p className="text-xs text-neutral-gray mb-8 font-semibold relative z-10">Sampaikan pertanyaan atau permohonan kemitraan Anda secara langsung melalui formulir di bawah ini.</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
              <div>
                <label htmlFor="name" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-[12px_8px_15px_10px]/[10px_15px_8px_12px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm transition-colors font-semibold select-text"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Alamat Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-[10px_15px_8px_12px]/[12px_8px_15px_10px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm transition-colors font-semibold select-text"
                  placeholder="anda@contohmail.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Kategori Pertanyaan</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-[12px_8px_15px_10px]/[10px_15px_8px_12px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm bg-white transition-colors font-semibold select-text"
                >
                  <option value="PPDB">Informasi Pendaftaran Siswa Baru (PPDB)</option>
                  <option value="SPP">Informasi Keuangan / SPP</option>
                  <option value="Kemitraan">Kemitraan Yayasan / Donatur</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Pesan / Detail Pertanyaan</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-[10px_15px_8px_12px]/[12px_8px_15px_10px] border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-sm transition-colors resize-none font-semibold select-text"
                  placeholder="Jelaskan detail pertanyaan atau maksud pesan Anda..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                suppressHydrationWarning
                className={`w-full py-4 rounded-[30px_90px_30px_100px]/[100px_30px_90px_20px] font-extrabold text-base transition-all shadow-md cursor-pointer border-2 border-primary-dark ${
                  formSubmitted
                    ? "bg-neutral-gray text-white cursor-not-allowed"
                    : "bg-primary-green hover:bg-primary-dark text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {formSubmitted ? "Mengirim..." : "Kirim Formulir"}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
