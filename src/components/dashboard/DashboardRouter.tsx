import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { KepalaSekolahDashboard } from './KepalaSekolahDashboard';
import { PembinaDashboard } from './PembinaDashboard';
import { WaliKelasDashboard } from './WaliKelasDashboard';
import { DashboardPrintModal } from './DashboardPrintModal';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { UserRole } from '../../types';
import { Shield, GraduationCap, BookOpen, UserCheck, Eye, Printer } from 'lucide-react';

export const DashboardRouter: React.FC = () => {
  const { currentUser, schoolInfo } = useApp();
  // Allow previewing different role dashboards directly if desired
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(currentUser.role);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Keep in sync with currentUser role when switched from navbar
  React.useEffect(() => {
    setActiveTabRole(currentUser.role);
  }, [currentUser.role]);

  return (
    <div className="space-y-4">
      {/* Print-Only Official Document Header */}
      <div className="hidden print:block mb-6">
        <OfficialLetterhead readOnly />
        <div className="text-center py-2.5 mt-2 border-b border-slate-300">
          <h2 className="text-base font-black uppercase tracking-wider text-slate-950">
            LAPORAN EKSEKUTIF PEMANTAUAN KEGIATAN EKSTRAKURIKULER
          </h2>
          <p className="text-xs font-bold text-blue-900 uppercase mt-0.5">
            {activeTabRole === 'admin'
              ? 'TAMPILAN DASBOR ADMINISTRATOR SISTEM'
              : activeTabRole === 'kepala_sekolah'
              ? 'TAMPILAN DASBOR KEPALA SEKOLAH'
              : activeTabRole === 'pembina'
              ? 'TAMPILAN DASBOR PEMBINA EKSTRAKURIKULER'
              : 'TAMPILAN DASBOR WALI KELAS'}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 mt-1 font-medium">
            <span>Tahun Ajaran: <strong>{schoolInfo.academicYear}</strong></span>
            <span>&bull;</span>
            <span>Semester: <strong>{schoolInfo.semester}</strong></span>
            <span>&bull;</span>
            <span>Waktu Cetak: <strong>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong></span>
            <span>&bull;</span>
            <span>Petugas: <strong>{currentUser.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Top role preview selector pill and Print Button (Hidden on Print) */}
      <div className="no-print flex items-center justify-between flex-wrap gap-2.5 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Tampilan Dasbor Berdasarkan Peran:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {[
              { role: 'admin' as UserRole, label: 'Admin Utama', icon: Shield },
              { role: 'kepala_sekolah' as UserRole, label: 'Kepala Sekolah', icon: GraduationCap },
              { role: 'pembina' as UserRole, label: 'Pembina Ekskul', icon: BookOpen },
              { role: 'wali_kelas' as UserRole, label: 'Wali Kelas', icon: UserCheck },
            ].map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                id={`tab-dashboard-${role}`}
                onClick={() => setActiveTabRole(role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTabRole === role
                    ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Dedicated Dashboard Print Button */}
          <button
            type="button"
            id="btn-print-dashboard"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
            title="Cetak dan Ekspor Halaman Dasbor (Print / PDF)"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dasbor</span>
          </button>
        </div>
      </div>

      {/* Render appropriate dashboard */}
      {activeTabRole === 'admin' && <AdminDashboard onPrint={() => setIsPrintModalOpen(true)} />}
      {activeTabRole === 'kepala_sekolah' && (
        <KepalaSekolahDashboard onPrint={() => setIsPrintModalOpen(true)} />
      )}
      {activeTabRole === 'pembina' && (
        <PembinaDashboard onPrint={() => setIsPrintModalOpen(true)} />
      )}
      {activeTabRole === 'wali_kelas' && (
        <WaliKelasDashboard onPrint={() => setIsPrintModalOpen(true)} />
      )}

      {/* Print-Only Official Signatures Footer */}
      <div className="hidden print:block mt-8 pt-6 border-t border-slate-300">
        <div className="flex justify-between items-start text-xs text-slate-900">
          <div className="text-center w-60">
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster}</p>
            <p className="text-[11px] text-slate-600">NIP. {schoolInfo.headmasterNip || '19750814 200212 1 003'}</p>
          </div>

          <div className="text-center w-60">
            <p className="text-slate-500">
              {schoolInfo.city || 'Kabupaten Pasuruan'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold text-slate-900 mt-0.5">Penanggung Jawab / Operator</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{currentUser.name}</p>
            <p className="text-[11px] text-slate-600 font-mono">
              {currentUser.nip ? `NIP. ${currentUser.nip}` : 'NIP / NUPTK Guru'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Print and Export Modal */}
      <DashboardPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        activeRole={activeTabRole}
      />
    </div>
  );
};
