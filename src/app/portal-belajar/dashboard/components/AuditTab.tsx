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

      {/* Main Content — Focused Minimal Coming Soon State */}
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-7 h-7 text-stone-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-neutral-dark mb-2 tracking-tight">
          Fitur ini sedang dalam pengembangan
        </h3>

        {/* Description */}
        <p className="text-[12px] text-neutral-gray font-medium max-w-sm leading-relaxed">
          Log Aktivitas akan merekam setiap tindakan admin secara real-time — mulai dari perubahan data siswa, transaksi keuangan, hingga pengelolaan akun petugas.
        </p>
      </div>

    </div>
  );
}
