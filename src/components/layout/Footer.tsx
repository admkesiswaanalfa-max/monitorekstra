import React from 'react';
import { Trophy, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-5 px-4 sm:px-6 lg:px-8 border-t border-emerald-100 bg-white/80 text-slate-500 text-xs no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-slate-800">
              &copy; 2026/2027 SMP ALFA ALI MASYKUR &mdash; Sistem Monitoring Ekstrakurikuler
            </p>
            <p className="text-[11px] text-slate-400">
              Jl. Dieng Km. 05 Bumirejo, Mojotengah, Wonosobo 56351 &bull; TP 2026/2027
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-500" />
            12 Cabang Pembinaan Minat & Bakat Santri
          </span>
          <span>&bull;</span>
          <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
            v2.7 Pro
          </span>
        </div>
      </div>
    </footer>
  );
};
