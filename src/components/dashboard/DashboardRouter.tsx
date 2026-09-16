import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { KepalaSekolahDashboard } from './KepalaSekolahDashboard';
import { PembinaDashboard } from './PembinaDashboard';
import { WaliKelasDashboard } from './WaliKelasDashboard';
import { DashboardPrintModal } from './DashboardPrintModal';
import { OfficialLetterhead } from '../common/OfficialLetterhead';

export const DashboardRouter: React.FC = () => {
  const { currentUser, schoolInfo } = useApp();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Render appropriate dashboard strictly based on currentUser.role
  const renderRoleDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard onPrint={() => setIsPrintModalOpen(true)} />;
      case 'kepala_sekolah':
        return <KepalaSekolahDashboard onPrint={() => setIsPrintModalOpen(true)} />;
      case 'pembina':
        return <PembinaDashboard onPrint={() => setIsPrintModalOpen(true)} />;
      case 'wali_kelas':
        return <WaliKelasDashboard onPrint={() => setIsPrintModalOpen(true)} />;
      default:
        return <AdminDashboard onPrint={() => setIsPrintModalOpen(true)} />;
    }
  };

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
            {currentUser.role === 'admin'
              ? 'TAMPILAN DASBOR ADMINISTRATOR SISTEM'
              : currentUser.role === 'kepala_sekolah'
              ? 'TAMPILAN DASBOR KEPALA SEKOLAH'
              : currentUser.role === 'pembina'
              ? 'TAMPILAN DASBOR PEMBINA EKSTRAKURIKULER'
              : 'TAMPILAN DASBOR WALI KELAS'}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 mt-1 font-medium">
            <span>
              Tahun Ajaran: <strong>{schoolInfo.academicYear}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Semester: <strong>{schoolInfo.semester}</strong>
            </span>
            <span>&bull;</span>
            <span>
              Waktu Cetak:{' '}
              <strong>
                {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </strong>
            </span>
            <span>&bull;</span>
            <span>
              Petugas: <strong>{currentUser.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Render appropriate dashboard for user's role */}
      {renderRoleDashboard()}

      {/* Print-Only Official Signatures Footer */}
      <div className="hidden print:block mt-8 pt-6 border-t border-slate-300">
        <div className="flex justify-between items-start text-xs text-slate-900">
          <div className="text-center w-60">
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster}</p>
            <p className="text-[11px] text-slate-600">
              NIP. {schoolInfo.headmasterNip || '19750814 200212 1 003'}
            </p>
          </div>

          <div className="text-center w-60">
            <p className="text-slate-500">
              {schoolInfo.city || 'Kabupaten Pasuruan'},{' '}
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
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
        activeRole={currentUser.role}
      />
    </div>
  );
};
