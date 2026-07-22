"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-[#132A1F] text-white pt-16 pb-8 mt-auto border-t-2 border-primary-green/30 relative">
      {/* Chalkboard Grid Overlay on Footer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Footer Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-dark rounded-[12px_6px_10px_8px]/[8px_10px_6px_12px] border-2 border-primary-light flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-baloo text-2xl font-bold tracking-wide">{siteConfig.name}</span>
            </div>
            <p className="text-xs text-stone-300 max-w-sm leading-relaxed font-medium">
              Membangun ekosistem pendidikan alternatif yang cerdas, peduli pelestarian sungai, dan ramah tumbuh kembang anak di Sekolah Gajahwong.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-baloo font-bold text-sm uppercase tracking-wider text-primary-light">Menu Cepat</h4>
            <ul className="space-y-2 text-xs text-stone-300/85 font-semibold">
              <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/program" className="hover:text-white transition-colors">Program Kami</Link></li>
              <li><Link href="/tim" className="hover:text-white transition-colors">Tim Pelaksana</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
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
                <span>Bantaran Sungai Gajahwong, RT 22 RW 05, Kelurahan Prenggan, Kotagede, Yogyakarta, Indonesia.</span>
              </li>
              <li className="flex items-center gap-2.5">
                {/* Sketched Phone SVG */}
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeDasharray="3 1" />
                </svg>
                <span>+62 812-3456-7890 (Admin G-SEE)</span>
              </li>
              <li className="flex items-center gap-2.5">
                {/* Sketched Email Envelope SVG */}
                <svg className="w-4 h-4 text-primary-light flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeDasharray="3 1" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>info@gajahwong-gsee.org</span>
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
