"use client";

import React from "react";

interface AuditLog {
  id: number;
  time: string;
  user: string;
  action: string;
}

interface AuditTabProps {
  logs: AuditLog[];
}

export default function AuditTab({ logs }: AuditTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-primary-green/10 shadow-3xs overflow-hidden">

      {/* Header */}
      <div className="px-7 pt-7 pb-5 border-b border-neutral-gray/8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-baloo text-lg font-bold text-neutral-dark tracking-tight">
              Log Aktivitas
            </h3>
            <p className="text-[11px] text-neutral-gray font-medium mt-0.5">
              Audit trail seluruh tindakan petugas dalam sistem
            </p>
          </div>
          {/* Coming Soon Badge */}
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
            Segera Hadir
          </span>
        </div>
      </div>

      {/* Main Content — Coming Soon State */}
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-7 h-7 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>

        {/* Title */}
        <p className="text-sm font-bold text-neutral-dark mb-2 tracking-tight">
          Fitur ini sedang dalam pengembangan
        </p>

        {/* Description */}
        <p className="text-[12px] text-neutral-gray font-medium max-w-sm leading-relaxed">
          Log Aktivitas akan merekam setiap tindakan admin secara real-time — mulai dari perubahan data siswa, transaksi keuangan, hingga pengelolaan akun petugas.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-stone-100 my-6" />

        {/* Feature Checklist Preview */}
        <div className="space-y-2.5 text-left w-full max-w-xs">
          {[
            "Rekam jejak perubahan data siswa",
            "Riwayat transaksi SPP & Tabungan",
            "Deteksi aktivitas mencurigakan",
            "Ekspor laporan audit ke PDF",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full border-2 border-stone-200 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              </div>
              <span className="text-[11px] text-neutral-gray font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
