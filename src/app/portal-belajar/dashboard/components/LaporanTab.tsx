"use client";

import React from "react";

export default function LaporanTab() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-6">
      <div>
        <h3 className="font-baloo text-xl font-bold text-neutral-dark mb-1.5">Ekspor Data Administrasi Sekolah</h3>
        <p className="text-xs text-neutral-gray font-semibold">Silakan unduh rekapitulasi data sekolah untuk pelaporan bulanan atau kebutuhan akreditasi BAN-PDM.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Card */}
        <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-primary-green/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <svg className="w-8 h-8 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h4 className="font-baloo text-base font-bold text-neutral-dark">Arsip Laporan SPP & Les Bulanan (PDF)</h4>
            <p className="text-xs text-neutral-gray font-semibold leading-relaxed">Format dokumen resmi siap cetak untuk diserahkan ke kepala sekolah atau yayasan penyelenggara.</p>
          </div>
          <button
            onClick={() => alert("Simulasi Ekspor PDF Berhasil! File Rekap_SPP_Les_RA_Sahabat.pdf diunduh.")}
            className="w-full py-2.5 rounded-lg bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs transition-all border border-primary-green cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Unduh PDF</span>
          </button>
        </div>

        {/* Excel Card */}
        <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-primary-green/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="font-baloo text-base font-bold text-neutral-dark">Rekap Data Keuangan & Tabungan (Excel)</h4>
            <p className="text-xs text-neutral-gray font-semibold leading-relaxed">Berkas lembar kerja spreadsheet untuk mempermudah perhitungan pembukuan kas bulanan yayasan.</p>
          </div>
          <button
            onClick={() => alert("Simulasi Ekspor Excel Berhasil! File Rekap_Kas_RA_Sahabat.xlsx diunduh.")}
            className="w-full py-2.5 rounded-lg bg-[#18B36F] hover:bg-[#0E7A4D] text-white font-extrabold text-xs transition-all border border-[#0E7A4D] cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Unduh Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
