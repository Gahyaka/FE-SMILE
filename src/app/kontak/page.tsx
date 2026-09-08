"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function KontakPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "Program",
    message: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const subjectLabel = formData.subject === "Program" ? "Tanya Program Belajar & Kurikulum" :
                         formData.subject === "PPDB" ? "Tanya Pendaftaran (PPDB) & Kunjungan" :
                         formData.subject === "Fasilitas" ? "Tanya Fasilitas & Ekstrakurikuler" :
                         formData.subject === "Saran" ? "Kritik, Saran, & Masukan Sekolah" : "Lainnya";

    const waMessage = `Halo Admin KB/RA Sahabat Berbah Sleman,

Saya ingin bertanya mengenai sekolah:
• Nama: ${formData.name}
• Kategori: ${subjectLabel}
• Pesan: ${formData.message}`;

    const waUrl = `https://wa.me/6285842594081?text=${encodeURIComponent(waMessage)}`;

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", subject: "Program", message: "" });
      window.open(waUrl, "_blank");
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 select-none">
      
      {/* HEADER SECTION */}
      <section className="relative bg-gradient-to-b from-[#FAF8F5] to-white py-16 text-center overflow-hidden border-b border-neutral-gray/8 pt-32">
        {/* Subtle dot-grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(44,178,74,0.015)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <span className="inline-block text-xs font-accent font-bold uppercase tracking-wider text-primary-green bg-primary-green/8 px-4 py-2 rounded-full border border-primary-green/10">
            Hubungi Kami
          </span>
          <h1 className="font-baloo text-4xl sm:text-5xl font-bold text-neutral-dark leading-tight">
            Hubungi Sekolah <span className="text-primary-green relative">RA Sahabat
              {/* Underline sketch */}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary-green/20" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-10">
          
          {/* Left Column: Contact details & school location */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="bg-white p-8 rounded-2xl border border-neutral-gray/8 shadow-sm space-y-6">
              <h2 className="font-baloo text-2xl font-bold text-primary-dark">KB/RA Sahabat Berbah</h2>
              
              <div className="space-y-5 text-xs sm:text-sm text-neutral-gray font-semibold">
                <div className="flex items-start gap-3.5">
                  <svg className="w-5 h-5 text-primary-green mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <strong className="text-neutral-dark block mb-1">Alamat Fisik:</strong>
                    KB/RA Sahabat, Berbah, Kabupaten Sleman, D.I. Yogyakarta, Indonesia.
                  </div>
                </div>


                <a
                  href="https://wa.me/6285842594081?text=Halo%20Admin%20RA%20Sahabat,%20saya%20ingin%20bertanya%20mengenai%20sekolah..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-4 px-6 mt-4 rounded-xl bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer text-center"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                  </svg>
                  <span>Hubungi via WhatsApp (0858-4259-4081)</span>
                </a>
              </div>
            </div>

            {/* Google Maps Interactive Frame */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-gray/8 shadow-sm space-y-3">
              <span className="text-xs font-bold text-primary-dark uppercase tracking-wider block">Lokasi RA Sahabat Berbah</span>
              
              <div className="w-full aspect-video bg-white rounded-2xl border border-neutral-gray/8 relative overflow-hidden shadow-md group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.883731174987!2d110.441871!3d-7.7936473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5190c48cf0b5%3A0x7186938de1643136!2sKB%20RA%20SAHABAT!5e0!3m2!1sen!2sid!4v1722420000000!5m2!1sen!2sid"
                  className="w-full h-full border-none absolute inset-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi KB RA Sahabat"
                ></iframe>

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

          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-neutral-gray/8 relative">
            <h3 className="font-baloo text-2xl font-bold text-neutral-dark mb-2 relative z-10">Formulir Pesan & Pertanyaan</h3>
            <p className="text-xs text-neutral-gray mb-8 font-semibold relative z-10">Sampaikan pertanyaan atau permohonan kemitraan Anda secara langsung melalui formulir di bawah ini.</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-5 relative z-10">
              <div>
                <label htmlFor="name" className="block text-xs font-extrabold uppercase text-neutral-gray mb-2 tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold select-text transition-all"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-extrabold uppercase text-neutral-gray mb-2 tracking-wider">Kategori Pertanyaan</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs bg-white transition-all font-semibold select-text cursor-pointer"
                >
                  <option value="Program">Tanya Program Belajar & Kurikulum</option>
                  <option value="PPDB">Tanya Pendaftaran (PPDB) & Kunjungan</option>
                  <option value="Fasilitas">Tanya Fasilitas & Ekstrakurikuler</option>
                  <option value="Saran">Kritik, Saran, & Masukan Sekolah</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-extrabold uppercase text-neutral-gray mb-2 tracking-wider">Pesan / Detail Pertanyaan</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                  suppressHydrationWarning
                  className="w-full px-4 py-3.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs transition-all resize-none font-semibold select-text"
                  placeholder="Jelaskan detail pertanyaan atau maksud pesan Anda..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                suppressHydrationWarning
                className={`w-full py-4 rounded-xl font-extrabold text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2.5 ${
                  formSubmitted
                    ? "bg-neutral-gray/50 text-white cursor-not-allowed"
                    : "bg-primary-green hover:bg-primary-dark text-white hover:shadow-md active:scale-98"
                }`}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.705 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
                </svg>
                <span>{formSubmitted ? "Membuka WhatsApp..." : "Kirim via WhatsApp"}</span>
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
