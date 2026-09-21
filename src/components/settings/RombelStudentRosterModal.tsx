import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassInfo, Student } from '../../types';
import {
  X,
  Users,
  Search,
  Printer,
  Download,
  Award,
  GraduationCap,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface RombelStudentRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo | null;
}

export const RombelStudentRosterModal: React.FC<RombelStudentRosterModalProps> = ({
  isOpen,
  onClose,
  classInfo,
}) => {
  const { students, schoolInfo, extracurriculars, setSelectedStudentDetailId } = useApp();
  const [search, setSearch] = useState('');

  const classStudents = useMemo(() => {
    if (!classInfo) return [];
    return students.filter((s) => s.class === classInfo.name);
  }, [students, classInfo]);

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    return classStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nis.toLowerCase().includes(q) ||
        (s.nisn && s.nisn.toLowerCase().includes(q))
    );
  }, [classStudents, search]);

  const stats = useMemo(() => {
    const total = classStudents.length;
    const l = classStudents.filter((s) => s.gender === 'L').length;
    const p = classStudents.filter((s) => s.gender === 'P').length;
    const avgScore = total
      ? (classStudents.reduce((acc, s) => acc + (s.overallScore || 0), 0) / total).toFixed(1)
      : '0';
    const avgAttendance = total
      ? (classStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / total).toFixed(1)
      : '0';
    return { total, l, p, avgScore, avgAttendance };
  }, [classStudents]);

  if (!isOpen || !classInfo) return null;

  const handleExportExcel = () => {
    const exportData = classStudents.map((s, idx) => ({
      No: idx + 1,
      'Nama Santri / Siswa': s.name,
      NIS: s.nis,
      NISN: s.nisn || '-',
      'Jenis Kelamin': s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      'Kelas / Rombel': s.class,
      'Wali Kelas': classInfo.waliKelas,
      'Ruang Kelas': classInfo.room || '-',
      'Kehadiran (%)': `${s.attendanceRate || 0}%`,
      'Nilai Rata-rata': s.overallScore || 0,
      Kategori: s.category || '-',
      'Nama Orang Tua / Wali': s.parentName || '-',
      'Kontak Orang Tua': s.parentPhone || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Rombel_${classInfo.name}`);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 26 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 24 },
      { wch: 16 },
    ];

    XLSX.writeFile(workbook, `Daftar_Siswa_Rombel_${classInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daftar Siswa Rombel ${classInfo.name} - ${schoolInfo.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; font-size: 11pt; }
          .header { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 14pt; font-weight: bold; margin: 2px 0; color: #065f46; }
          .meta { margin-bottom: 14px; font-size: 10pt; line-height: 1.5; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 9.5pt; }
          th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
          .center { text-align: center; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
          .sign-box { text-align: center; width: 220px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size: 16pt; font-weight: bold; text-transform: uppercase;">${schoolInfo.name}</div>
          <div style="font-size: 9pt; color: #475569;">${schoolInfo.address || 'Wonosobo, Jawa Tengah'}</div>
          <div class="title" style="margin-top: 10px;">DAFTAR NOMINATIF SANTRI / SISWA ROMBONGAN BELAJAR</div>
          <div style="font-size: 10.5pt; font-weight: bold;">KELAS ${classInfo.name} (KODE: ${classInfo.rombelCode || '-'}) - TAHUN AJARAN ${classInfo.academicYear || schoolInfo.academicYear}</div>
        </div>

        <div class="meta">
          <table style="border: none; margin-bottom: 10px;">
            <tr style="border: none;">
              <td style="border: none; width: 50%;"><strong>Wali Kelas:</strong> ${classInfo.waliKelas} ${classInfo.waliKelasNip ? `(NIP: ${classInfo.waliKelasNip})` : ''}</td>
              <td style="border: none; width: 50%;"><strong>Ruang Belajar:</strong> ${classInfo.room || '-'}</td>
            </tr>
            <tr style="border: none;">
              <td style="border: none;"><strong>Kapasitas / Daya Tampung:</strong> ${classInfo.capacity || 32} Kursi</td>
              <td style="border: none;"><strong>Total Siswa Terdaftar:</strong> ${classStudents.length} Siswa (L: ${stats.l}, P: ${stats.p})</td>
            </tr>
          </table>
        </div>

        <table>
          <thead>
            <tr>
              <th class="center" style="width: 35px;">No</th>
              <th class="center" style="width: 80px;">NIS</th>
              <th class="center" style="width: 90px;">NISN</th>
              <th>Nama Lengkap Santri</th>
              <th class="center" style="width: 40px;">L/P</th>
              <th class="center" style="width: 65px;">Presensi</th>
              <th class="center" style="width: 60px;">Rata-rata</th>
              <th>Nama Orang Tua / Wali</th>
            </tr>
          </thead>
          <tbody>
            ${classStudents
              .map(
                (s, i) => `
              <tr>
                <td class="center">${i + 1}</td>
                <td class="center">${s.nis}</td>
                <td class="center">${s.nisn || '-'}</td>
                <td><strong>${s.name}</strong></td>
                <td class="center">${s.gender}</td>
                <td class="center">${s.attendanceRate || 0}%</td>
                <td class="center">${s.overallScore || 0}</td>
                <td>${s.parentName || '-'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="signatures" style="margin-top: 50px;">
          <div class="sign-box">
            <div>Mengetahui,</div>
            <div>Kepala Sekolah</div>
            <div style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${schoolInfo.principal}</div>
            <div style="font-size: 8.5pt;">NIP. ${schoolInfo.principalNip || '-'}</div>
          </div>
          <div class="sign-box">
            <div>Wonosobo, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Wali Kelas ${classInfo.name}</div>
            <div style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${classInfo.waliKelas}</div>
            <div style="font-size: 8.5pt;">${classInfo.waliKelasNip ? `NIP. ${classInfo.waliKelasNip}` : 'Wali Kelas'}</div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div
      id="rombel-student-roster-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="rombel-student-roster-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Users className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Daftar Santri / Siswa Rombel {classInfo.name}
              </h2>
              <p className="text-xs text-emerald-100">
                Wali Kelas: {classInfo.waliKelas} • Ruang: {classInfo.room || 'Ruang Kelas'} • Kode: {classInfo.rombelCode || '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-export-excel-roster"
              onClick={handleExportExcel}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ekspor ke format Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor Excel</span>
            </button>
            <button
              type="button"
              id="btn-print-roster"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak Daftar Rombel"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              type="button"
              id="btn-close-roster"
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-800">Total Siswa:</span>{' '}
              <span className="font-bold text-emerald-700">{stats.total} Santri</span> (L: {stats.l}, P: {stats.p})
            </div>
            <div>
              <span className="font-semibold text-slate-800">Daya Tampung:</span>{' '}
              <span className="font-bold text-slate-700">{classInfo.capacity || 32} Kursi</span> (
              {Math.round(((stats.total || 0) / (classInfo.capacity || 32)) * 100)}% Terisi)
            </div>
            <div>
              <span className="font-semibold text-slate-800">Rata-rata Nilai:</span>{' '}
              <span className="font-bold text-amber-600">{stats.avgScore}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800">Kehadiran:</span>{' '}
              <span className="font-bold text-teal-600">{stats.avgAttendance}%</span>
            </div>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="search-roster-students"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIS..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 overflow-y-auto grow">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Tidak ada siswa ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">
                {classStudents.length === 0
                  ? 'Belum ada data siswa yang ditempatkan pada kelas rombel ini.'
                  : 'Tidak ada santri yang cocok dengan kata kunci pencarian.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-3">Nama Santri</th>
                    <th className="py-2.5 px-3">NIS / NISN</th>
                    <th className="py-2.5 px-3 text-center">Gender</th>
                    <th className="py-2.5 px-3 text-center">Presensi</th>
                    <th className="py-2.5 px-3 text-center">Skor Rata-rata</th>
                    <th className="py-2.5 px-3">Ekskul Diikuti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s, idx) => {
                    const studentEkskuls = (s.ekskulIds || [])
                      .map((id) => extracurriculars.find((e) => e.id === id)?.name)
                      .filter(Boolean);

                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-emerald-50/40 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedStudentDetailId(s.id);
                          onClose();
                        }}
                      >
                        <td className="py-2.5 px-3 text-center font-medium text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            {s.avatar ? (
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                                {s.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">{s.name}</p>
                              <p className="text-[10px] text-slate-400">{s.nickname ? `Panggilan: ${s.nickname}` : '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          <div>{s.nis}</div>
                          <div className="text-[10px] text-slate-400">{s.nisn || '-'}</div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                              s.gender === 'L'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-pink-50 text-pink-700 border border-pink-200'
                            }`}
                          >
                            {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          <span className={s.attendanceRate >= 90 ? 'text-emerald-700' : 'text-amber-600'}>
                            {s.attendanceRate || 0}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                          {s.overallScore || 0}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-wrap gap-1">
                            {studentEkskuls.length > 0 ? (
                              studentEkskuls.slice(0, 2).map((eName, eIdx) => (
                                <span
                                  key={eIdx}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                                >
                                  {eName}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Belum memilih</span>
                            )}
                            {studentEkskuls.length > 2 && (
                              <span className="px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                +{studentEkskuls.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            Klik baris santri untuk membuka detail profil dan riwayat perkembangan santri.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
