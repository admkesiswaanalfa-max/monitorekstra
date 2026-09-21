import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DatabaseSnapshotManager } from './DatabaseSnapshotManager';
import { RombelClassSettings } from './RombelClassSettings';
import { AcademicYearSettings } from './AcademicYearSettings';
import { SchoolLetterheadSettings } from './SchoolLetterheadSettings';
import {
  Settings,
  Building2,
  Users,
  Database,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  Shield,
  Layers,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    teachers,
    classes,
    resetToDemoData,
    currentUser,
    switchRole,
    showToast,
  } = useApp();

  // Active sub-tab - default to kop surat & identitas as requested
  const [activeTab, setActiveTab] = useState<'identitas' | 'rombel' | 'snapshot' | 'guru' | 'tahun_ajaran' | 'reset'>('identitas');

  const isSuperAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan & Konfigurasi Sistem</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Pengaturan Aplikasi & Master Basis Data
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Kelola profil resmi sekolah, data guru & pembina, serta konsol Super Admin untuk ekspor snapshot instan dan pemulihan state basis data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-600/60 text-emerald-200">
            Peran: <strong className="text-amber-300 uppercase">{currentUser.role}</strong>
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('rombel')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'rombel'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-300" />
          <span>Data Rombel Kelas ({classes.length})</span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
            ROMBEL
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('snapshot')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'snapshot'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4 text-amber-300" />
          <span>Snapshot & Restore DB</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identitas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'identitas'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-300" />
          <span>Kop Surat & Logo Sekolah</span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950">
            YAYASAN & LOGO
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guru')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'guru'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Guru & Pembina ({teachers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tahun_ajaran')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'tahun_ajaran'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tahun Ajaran & Periode</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reset')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'reset'
              ? 'bg-rose-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Standar Demo</span>
        </button>
      </div>

      {/* Tab Content: Data Rombel Kelas */}
      {activeTab === 'rombel' && <RombelClassSettings />}

      {/* Tab Content: Tahun Ajaran & Periode */}
      {activeTab === 'tahun_ajaran' && <AcademicYearSettings />}

      {/* Tab Content: Dedicated Super Admin Database Snapshot & Recovery */}
      {activeTab === 'snapshot' && <DatabaseSnapshotManager />}

      {/* Tab Content: Identitas Sekolah, Kop Surat, Yayasan & Logo */}
      {activeTab === 'identitas' && <SchoolLetterheadSettings />}

      {/* Tab Content: Daftar Guru & Pembina */}
      {activeTab === 'guru' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Data Guru Pembina & Pelatih Ekstrakurikuler
              </h3>
              <p className="text-xs text-slate-500">
                Tenaga pendidik dan pembina resmi ekstrakurikuler SMP Alfa Ali Masykur
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {teachers.length} Guru / Pembina Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(teachers || []).map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                  {(t.name || 'Guru').slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5 text-xs">
                  <h4 className="font-extrabold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-emerald-800 font-semibold">{t.role}</p>
                  <p className="text-[10px] text-slate-500">Bidang: {t.specialty}</p>
                  <p className="text-[10px] font-mono text-slate-400">Kontak: {t.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Reset Demo */}
      {activeTab === 'reset' && (
        <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-4 max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-rose-950">
                Reset Basis Data ke Standar Demo Resmi
              </h3>
              <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                Fitur ini akan mengembalikan seluruh data sistem ke kondisi awal (32 siswa demo, 12 cabang ekstrakurikuler, presensi pertemuan, jurnal, dan capaian target pembelajaran). Gunakan dengan bijak jika Anda ingin membersihkan data uji coba.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-200/80 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-rose-900">Yang akan dilakukan oleh proses reset:</p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
              <li>Membersihkan data modifikasi lokal dari browser (localStorage).</li>
              <li>Memuat ulang 32 siswa demo resmi beserta NISN, rombel, dan wali kelas.</li>
              <li>Menata ulang 12 cabang ekstrakurikuler, pembina, jadwal, dan kuota.</li>
              <li>Mengisi kembali data presensi pertemuan dan jurnal latihan.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={resetToDemoData}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Seluruh Basis Data ke Demo Awal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
