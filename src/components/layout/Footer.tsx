import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white/70 text-slate-500 text-xs no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <p className="font-semibold text-slate-700">
            &copy; 2026 SMP Alfa Ali Masykur &mdash; Sistem Monitoring Ekstrakurikuler
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Membina Karakter, Mengasah Talenta, Mewujudkan Prestasi Gemilang
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistem Aktif & Terlindungi
          </span>
          <span>&bull;</span>
          <span>Versi 2.6 Pro</span>
        </div>
      </div>
    </footer>
  );
};
