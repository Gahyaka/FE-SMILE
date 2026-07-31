"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  // Chibi characters logo component (matching Navbar)
  const ChibiLogo = () => (
    <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-dark rounded-full border-2 border-white flex items-center justify-center shadow-md overflow-hidden relative flex-shrink-0">
      {/* Green circle background */}
      <div className="absolute inset-0 bg-primary-green"></div>
      
      {/* Boy with Purple Kopiah (Left) */}
      <svg className="w-6 h-6 text-white absolute bottom-0 left-[-2px] z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="6" width="6" height="3" fill="#7A2E8F" stroke="#2B2B2B" strokeWidth="1.2" />
        <circle cx="7" cy="12" r="3.2" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="1.2" />
        <circle cx="6" cy="11.5" r="0.5" fill="#2B2B2B" />
        <circle cx="8" cy="11.5" r="0.5" fill="#2B2B2B" />
        <path d="M6 13.5 Q7 14.5 8 13.5" stroke="#2B2B2B" strokeWidth="1" strokeLinecap="round" />
      </svg>
      
      {/* Girl with Pink Hijab (Right) */}
      <svg className="w-6 h-6 text-white absolute bottom-0 right-[-2px] z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8 C12 5, 21 5, 21 8 C21 11, 21 15, 17 16 C13 15, 12 11, 12 8" fill="#EC1E8C" stroke="#2B2B2B" strokeWidth="1.2" />
        <circle cx="16.5" cy="11.5" r="2.8" fill="#FAF8F5" stroke="#2B2B2B" strokeWidth="1.2" />
        <circle cx="15.5" cy="11" r="0.5" fill="#2B2B2B" />
        <circle cx="17.5" cy="11" r="0.5" fill="#2B2B2B" />
        <path d="M15.5 13 Q16.5 14 17.5 13" stroke="#2B2B2B" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );

  return (
    <footer className="bg-[#132A1F] text-white pt-16 pb-8 mt-auto border-t-2 border-primary-green/30 relative select-none">
      {/* Chalkboard Grid Overlay on Footer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Footer Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <ChibiLogo />
              <span className="font-baloo text-2xl font-bold tracking-wide">{siteConfig.name}</span>
            </div>
            <p className="text-xs text-stone-300 max-w-sm leading-relaxed font-medium">
              Membangun ekosistem pendidikan anak usia dini yang cerdas, berakhlak mulia, dan berkarakter Islami di KB/RA Sahabat Berbah Sleman.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-baloo font-bold text-sm uppercase tracking-wider text-primary-light">Menu Cepat</h4>
            <ul className="space-y-2 text-xs text-stone-300/85 font-semibold">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/tim" className="hover:text-white transition-colors">Profil Guru</Link></li>
              <li><Link href="/program" className="hover:text-white transition-colors">Kegiatan</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-colors">PPDB & Kontak</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-baloo font-bold text-sm uppercase tracking-wider text-primary-light">Kontak & Alamat</h4>
            <ul className="space-y-3 text-xs text-stone-300/85 font-semibold">
              <li className="flex items-start gap-2.5">
                {/* Sketched Map Pin SVG */}
                <svg className="w-4 h-4 text-primary-light mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeDasharray="3 1.5" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>KB/RA Sahabat, Berbah, Sleman, D.I. Yogyakarta, Indonesia.</span>
              </li>
              <li className="flex items-center gap-2.5">
                {/* Sketched Phone SVG */}
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeDasharray="3 1" />
                </svg>
                <span>+62 812-3456-7890 (Admin RA Sahabat)</span>
              </li>
              <li className="flex items-center gap-2.5">
                {/* Sketched Email Envelope SVG */}
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeDasharray="3 1" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>admin@rasahabat.sch.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 font-semibold gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name} — {siteConfig.tagline}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
