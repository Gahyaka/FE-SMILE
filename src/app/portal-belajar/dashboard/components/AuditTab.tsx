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
    <div className="bg-white p-6 md:p-8 rounded-[30px_15px_25px_20px]/[20px_25px_15px_30px] border-2 border-dashed border-primary-green/20 shadow-xs space-y-6">
      <div>
        <h3 className="font-baloo text-xl font-bold text-neutral-dark mb-1.5">Riwayat Aktivitas Petugas (Audit Log)</h3>
        <p className="text-xs text-neutral-gray font-semibold">Log jejak digital ini mencatat seluruh tindakan penambahan, pengubahan, dan penghapusan data untuk mencegah penyalahgunaan wewenang admin.</p>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="p-4 bg-[#FAF8F5] rounded-xl border border-neutral-gray/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-gray font-bold flex-shrink-0 bg-neutral-gray/10 px-2 py-0.5 rounded">
                {log.time}
              </span>
              <p className="text-xs font-semibold text-neutral-dark font-sans leading-relaxed">
                <strong className="text-primary-green">{log.user}</strong>: {log.action}
              </p>
            </div>
            <span className="text-[9px] text-emerald-500 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Berhasil
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
