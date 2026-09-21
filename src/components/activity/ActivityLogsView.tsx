import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import {
  ClipboardList,
  Search,
  Filter,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  User,
  Shield,
  FileText,
  AlertCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ActivityLogsView: React.FC = () => {
  const { activityLogs, schoolInfo, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Fallback seed audit logs if empty
  const defaultLogs: ActivityLog[] = useMemo(() => {
    if (activityLogs && activityLogs.length > 0) {
      return activityLogs;
    }
    return [
      {
        id: 'log-1',
        userId: 'usr-1',
        userName: 'Afif Mashadi, S.S.',
        userRole: 'admin',
        action: 'Pembaruan Data Sekolah',
        target: 'Profil SMP Alfa Ali Masykur TP 2026/2027',
        timestamp: '2026-09-15 08:30:12',
        details: 'Memperbarui data kepala sekolah, wakasek kesiswaan, dan alamat resmi.',
      },
      {
        id: 'log-2',
        userId: 'usr-3',
        userName: 'Ahmad Fauzi, S.Pd.',
        userRole: 'pembina',
        action: 'Input Presensi Pertemuan 8',
        target: 'Ekstrakurikuler Pramuka',
        timestamp: '2026-09-14 16:15:00',
        details: 'Mencatat presensi 32 santri. Hadir: 30, Sakit: 1, Izin: 1.',
      },
      {
        id: 'log-3',
        userId: 'usr-4',
        userName: 'Siti Rahmawati, S.Pd.',
        userRole: 'pembina',
        action: 'Pengisian Jurnal Kegiatan',
        target: 'Ekstrakurikuler Kaligrafi',
        timestamp: '2026-09-14 15:45:22',
        details: 'Materi: Pemantapan Kaidah Khat Naskhi dan persiapan lomba kaligrafi tingkat kabupaten.',
      },
      {
        id: 'log-4',
        userId: 'usr-5',
        userName: 'Bambang Triyono, S.Or.',
        userRole: 'pelatih',
        action: 'Pencatatan Prestasi Siswa',
        target: 'Kejuaraan Voli Antarpelajar Wonosobo',
        timestamp: '2026-09-12 11:20:45',
        details: 'Menambahkan capaian Juara II Tingkat Kabupaten kategori Voli Putra.',
      },
      {
        id: 'log-5',
        userId: 'usr-6',
        userName: 'Muhammad Rizal, M.Pd.',
        userRole: 'wali_kelas',
        action: 'Verifikasi Rapor Ekstrakurikuler',
        target: 'Kelas VIII-A',
        timestamp: '2026-09-10 14:10:00',
        details: 'Mengecek capaian predikat ekstrakurikuler santri bimbingan kelas 8A.',
      },
    ];
  }, [activityLogs]);

  const filteredLogs = defaultLogs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      (log.details && log.details.toLowerCase().includes(q));

    const matchType =
      selectedType === 'all' ||
      log.action.toLowerCase().includes(selectedType.toLowerCase());

    return matchSearch && matchType;
  });

  const handleExportExcel = () => {
    const data = filteredLogs.map((l, idx) => ({
      No: idx + 1,
      Waktu: l.timestamp,
      'Nama Pengguna': l.userName,
      'Peran Pengguna': l.userRole,
      Aktivitas: l.action,
      Target: l.target,
      Detail: l.details || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Log');
    XLSX.writeFile(workbook, `Audit_Trail_Log_${new Date().toISOString().slice(0, 10)}.xlsx`);

    showToast('Export Berhasil', 'Riwayat aktivitas berhasil diunduh dalam format Excel.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Audit Trail & Integritas Data</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Riwayat Aktivitas & Log Sistem
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Rekaman transparansi seluruh aksi penambahan, perubahan data presensi, jurnal, dan penilaian ekstrakurikuler.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Log</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari aktivitas, nama guru/pembina, atau modul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Kategori Aksi:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">Semua Aktivitas ({defaultLogs.length})</option>
            <option value="presensi">Presensi Pertemuan</option>
            <option value="jurnal">Jurnal Pembina</option>
            <option value="prestasi">Prestasi Siswa</option>
            <option value="pembaruan">Pembaruan Master Data</option>
            <option value="verifikasi">Verifikasi Rapor</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Jejak Audit ({filteredLogs.length} Rekaman)
          </span>
          <span className="text-[11px] text-slate-400">Pembaruan Terkini Otomatis</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {log.userName}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {log.userRole}
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        &bull; {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      Objek: <span className="font-bold text-slate-900">{log.target}</span>
                    </p>
                    {log.details && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {log.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono shrink-0 self-end sm:self-center">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
