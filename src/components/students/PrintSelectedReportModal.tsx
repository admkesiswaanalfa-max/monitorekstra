import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';
import { exportRecapitulationStudentPerformancePDF } from '../../utils/studentPerformancePdfExport';
import { exportStudentsToXLSX } from '../../utils/studentExcelExport';
import {
  Printer,
  Download,
  FileSpreadsheet,
  X,
  CheckCircle2,
  Users,
  Award,
  Calendar,
  SlidersHorizontal,
  FileText,
  Building,
} from 'lucide-react';

export interface PrintFilterInfo {
  categoryLabel?: string;
  ekskulName?: string;
  className?: string;
}

interface PrintSelectedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: Student[];
  filterInfo?: PrintFilterInfo;
}

export const PrintSelectedReportModal: React.FC<PrintSelectedReportModalProps> = ({
  isOpen,
  onClose,
  selectedStudents,
  filterInfo = {} as PrintFilterInfo,
}) => {
  const { schoolInfo, extracurriculars, currentUser, showToast } = useApp();

  // Print customization settings
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeCompetencies, setIncludeCompetencies] = useState(true);
  const [includeContacts, setIncludeContacts] = useState(true);
  const [includeEkskulSummary, setIncludeEkskulSummary] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [reportOrientation, setReportOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLetterheadModalOpen, setIsLetterheadModalOpen] = useState(false);

  // Dynamic font family style matching Kop Surat settings
  const fontFamilyStyle =
    schoolInfo.fontFamily === 'times'
      ? { fontFamily: '"Times New Roman", Times, Georgia, serif' }
      : schoolInfo.fontFamily === 'bookman'
      ? { fontFamily: '"Bookman Old Style", Bookman, Garamond, serif' }
      : schoolInfo.fontFamily === 'georgia'
      ? { fontFamily: 'Georgia, Cambria, serif' }
      : schoolInfo.fontFamily === 'calibri'
      ? { fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", sans-serif' }
      : { fontFamily: 'Arial, Helvetica, "Nimbus Sans L", sans-serif' };

  if (!isOpen || selectedStudents.length === 0) return null;

  // Metadata
  const academicYear = schoolInfo?.academicYear || '2026/2027';
  const semester = schoolInfo?.semester || 'Ganjil';
  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const docNumber = `421.3/SMP-AAM/LAP-SISWA-TERPILIH/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  // Statistics calculation for selected students
  const totalCount = selectedStudents.length;
  const countMale = selectedStudents.filter((s) => s.gender === 'L').length;
  const countFemale = selectedStudents.filter((s) => s.gender === 'P').length;

  const avgAttendance = totalCount
    ? (selectedStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalCount).toFixed(1)
    : '0';

  const avgScore = totalCount
    ? (selectedStudents.reduce((acc, s) => acc + (s.overallScore || 0), 0) / totalCount).toFixed(2)
    : '0';

  const countSangatBaik = selectedStudents.filter(
    (s) => (s.overallScore || 0) >= 88 || s.category === 'Sangat Baik'
  ).length;
  const countBaik = selectedStudents.filter(
    (s) =>
      ((s.overallScore || 0) >= 75 && (s.overallScore || 0) < 88) ||
      s.category === 'Baik'
  ).length;
  const countCukup = totalCount - countSangatBaik - countBaik;

  // Extracurricular distribution among selected students
  const ekskulCounts: { [key: string]: { name: string; count: number; category: string } } = {};
  selectedStudents.forEach((std) => {
    std.ekskulIds.forEach((id) => {
      const ekskul = extracurriculars.find((e) => e.id === id);
      if (ekskul) {
        if (!ekskulCounts[id]) {
          ekskulCounts[id] = { name: ekskul.name, count: 0, category: ekskul.category };
        }
        ekskulCounts[id].count += 1;
      }
    });
  });
  const sortedEkskuls = Object.values(ekskulCounts).sort((a, b) => b.count - a.count);

  // Class distribution
  const classCounts: { [key: string]: number } = {};
  selectedStudents.forEach((std) => {
    classCounts[std.class] = (classCounts[std.class] || 0) + 1;
  });

  // Handle native browser print
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  // Handle jsPDF download
  const handleDownloadPDF = () => {
    try {
      const fileName = exportRecapitulationStudentPerformancePDF(
        selectedStudents,
        schoolInfo,
        'Laporan Rekapitulasi Siswa Terpilih',
        {
          categoryLabel: filterInfo.categoryLabel,
          ekskulName: filterInfo.ekskulName,
          className: filterInfo.className,
          period: `Semester ${semester} T.P. ${academicYear}`,
        }
      );
      showToast('Unduh PDF Berhasil', `Berkas ${fileName} berhasil diunduh.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal Mengunduh PDF', 'Terjadi kendala saat menyusun berkas PDF.', 'error');
    }
  };

  // Handle Excel download
  const handleDownloadExcel = () => {
    try {
      const filename = exportStudentsToXLSX(
        selectedStudents,
        extracurriculars,
        schoolInfo,
        `Terpilih_${selectedStudents.length}_Siswa`
      );
      showToast('Unduh Excel Berhasil', `Berkas ${filename} berhasil disimpan dalam format .xlsx.`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal Mengunduh Excel', 'Terjadi kendala saat menyusun berkas spreadsheet.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto student-detail-modal-backdrop">
      <div className="bg-white rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden border border-slate-200 my-2 max-h-[96vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 student-detail-modal-container">
        
        {/* Top Control Bar (Screen Only - Hidden in Print) */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0">
              <Printer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">
                  Pratinjau Cetak Laporan Siswa Terpilih
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  {totalCount} Siswa Terpilih
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Kompilasi ringkasan data, kehadiran, capaian evaluasi, dan rekap ekstrakurikuler siap cetak A4.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download Excel Button */}
            <button
              onClick={handleDownloadExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Ekspor data siswa terpilih ke berkas Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Ekspor XLSX</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Unduh format dokumen resmi PDF (Landscape)"
            >
              <Download className="w-4 h-4 text-blue-300" />
              <span>Unduh PDF</span>
            </button>

            {/* Primary Print Button */}
            <button
              id="btn-confirm-print"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-400/20 active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-900" />
              <span>Cetak Sekarang (Print)</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors ml-1 cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options & Layout Customizer Bar (Screen Only - Hidden in Print) */}
        <div className="px-5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 shrink-0 no-print">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Pengaturan Format:</span>
            </span>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLetterhead}
                onChange={(e) => setIncludeLetterhead(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Kop Surat & Logo</span>
            </label>

            <button
              type="button"
              onClick={() => setIsLetterheadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all cursor-pointer"
              title="Atur Logo, Font, dan Format Kop Surat Resmi"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Atur Kop Surat</span>
            </button>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCompetencies}
                onChange={(e) => setIncludeCompetencies(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Dimensi Kompetensi</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeContacts}
                onChange={(e) => setIncludeContacts(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Data Wali / Orang Tua</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeEkskulSummary}
                onChange={(e) => setIncludeEkskulSummary(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Rekap Persebaran Ekskul</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span>Tanda Tangan Pengesahan</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Orientasi:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200 border border-slate-300">
              <button
                type="button"
                onClick={() => setReportOrientation('landscape')}
                className={`px-2 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                  reportOrientation === 'landscape'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Landscape (A4 Lebar)
              </button>
              <button
                type="button"
                onClick={() => setReportOrientation('portrait')}
                className={`px-2 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                  reportOrientation === 'portrait'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Portrait (A4 Tegak)
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body / Printable Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/50 student-detail-modal-body">
          <div
            id="student-print-document"
            className={`mx-auto bg-white shadow-xl rounded-xl sm:rounded-2xl border border-slate-200 p-6 sm:p-10 transition-all student-printable-doc ${
              reportOrientation === 'landscape' ? 'max-w-[1120px]' : 'max-w-[850px]'
            }`}
            style={{ minHeight: '800px', ...fontFamilyStyle }}
          >
            {/* 1. Official Letterhead */}
            {includeLetterhead && (
              <div className="mb-4">
                <OfficialLetterhead onOpenSettings={() => setIsLetterheadModalOpen(true)} />
              </div>
            )}

            {/* 2. Document Title and Metadata */}
            <div className="text-center mb-6 pt-1">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                Laporan Rekapitulasi Data & Capaian Siswa Terpilih
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                SMP ALFA ALI MASYKUR WONOSOBO &bull; TAHUN PELAJARAN {academicYear}
              </p>
              <div className="inline-flex items-center justify-center gap-2 mt-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600">
                <span>Semester: <strong>{semester}</strong></span>
                <span>&bull;</span>
                <span>Tanggal Cetak: <strong>{printDate}</strong></span>
                <span>&bull;</span>
                <span>Nomor: <strong className="font-mono">{docNumber}</strong></span>
                <span>&bull;</span>
                <span className="font-bold text-blue-700">Total: {totalCount} Siswa</span>
              </div>
            </div>

            {/* 3. Compiled Executive Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 text-slate-800">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Total Siswa Terpilih
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900">{totalCount}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    ({countMale} L &bull; {countFemale} P)
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Tersebar di {Object.keys(classCounts).length} Rombel / Kelas
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-slate-800">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Rata-rata Kehadiran
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-900">{avgAttendance}%</span>
                  <span className="text-[11px] font-bold text-emerald-600">Disiplin</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Seluruh sesi pertemuan cabang
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-slate-800">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Rata-rata Nilai Capaian
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-indigo-900">{avgScore}</span>
                  <span className="text-[11px] font-bold text-indigo-600">
                    / 100 ({((Number(avgScore) || 85) / 25).toFixed(2)} IP)
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Evaluasi kognitif & psikomotorik
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 text-slate-800">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Sebaran Predikat
                </span>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-emerald-700">A: {countSangatBaik}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-blue-700">B: {countBaik}</span>
                  {countCukup > 0 && (
                    <>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-amber-700">C: {countCukup}</span>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Tingkat Ketercapaian: 100% Tuntas
                </span>
              </div>
            </div>

            {/* 4. Compiled Data Table for Checked Students */}
            <div className="mb-6 overflow-hidden rounded-xl border border-slate-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-2 text-center w-8 border border-slate-700">No</th>
                    <th className="py-2.5 px-2.5 w-24 border border-slate-700">NIS / NISN</th>
                    <th className="py-2.5 px-3 border border-slate-700">Nama Lengkap Siswa</th>
                    <th className="py-2.5 px-1.5 text-center w-8 border border-slate-700">JK</th>
                    <th className="py-2.5 px-2 text-center w-14 border border-slate-700">Kelas</th>
                    <th className="py-2.5 px-3 border border-slate-700">Ekstrakurikuler Diikuti</th>
                    <th className="py-2.5 px-2 text-center w-16 border border-slate-700">Kehadiran</th>
                    <th className="py-2.5 px-2 text-center w-14 border border-slate-700">Nilai</th>
                    <th className="py-2.5 px-2 text-center w-18 border border-slate-700">Predikat</th>
                    {includeCompetencies && (
                      <th className="py-2.5 px-2 text-center w-24 border border-slate-700">
                        Rincian Aspek
                      </th>
                    )}
                    {includeContacts && (
                      <th className="py-2.5 px-3 border border-slate-700">
                        Orang Tua / Kontak
                      </th>
                    )}
                    <th className="py-2.5 px-2 text-center w-20 border border-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px] text-slate-800">
                  {selectedStudents.map((s, idx) => {
                    const studentEkskuls = s.ekskulIds
                      .map((id) => extracurriculars.find((e) => e.id === id))
                      .filter(Boolean);

                    const comp = s.competencies || {
                      keterampilan: 3.5,
                      disiplin: 3.5,
                      kerjasama: 3.5,
                    };

                    const isEven = idx % 2 === 1;

                    return (
                      <tr
                        key={s.id}
                        className={`${isEven ? 'bg-slate-50/70' : 'bg-white'} hover:bg-blue-50/30 transition-colors`}
                      >
                        <td className="py-2 px-2 text-center font-semibold text-slate-500 border border-slate-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-[10px] border border-slate-200">
                          <span className="font-bold text-slate-900 block">{s.nis}</span>
                          <span className="text-slate-500">{s.nisn || '-'}</span>
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 border border-slate-200">
                          {s.name}
                        </td>
                        <td className="py-2 px-1.5 text-center font-bold text-slate-700 border border-slate-200">
                          {s.gender}
                        </td>
                        <td className="py-2 px-2 text-center font-semibold text-slate-800 border border-slate-200">
                          {s.class}
                        </td>
                        <td className="py-2 px-3 border border-slate-200">
                          <div className="flex flex-wrap gap-1">
                            {studentEkskuls.map((e) => (
                              <span
                                key={e?.id}
                                className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-700"
                              >
                                {e?.name}
                              </span>
                            ))}
                            {studentEkskuls.length === 0 && (
                              <span className="text-slate-400 italic">Belum terdaftar</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-900 border border-slate-200">
                          {s.attendanceRate}%
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-blue-700 border border-slate-200">
                          {s.overallScore.toFixed(1)}
                        </td>
                        <td className="py-2 px-2 text-center border border-slate-200">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              s.category === 'Sangat Baik'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : s.category === 'Baik'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {s.category || 'Baik'}
                          </span>
                        </td>
                        {includeCompetencies && (
                          <td className="py-2 px-2 text-[10px] text-center border border-slate-200 font-mono">
                            <span title="Keterampilan Teknik">Tek: {comp.keterampilan}</span>
                            <span className="mx-1 text-slate-300">|</span>
                            <span title="Kedisiplinan">Dis: {comp.disiplin}</span>
                          </td>
                        )}
                        {includeContacts && (
                          <td className="py-2 px-3 text-[10px] border border-slate-200">
                            <span className="font-semibold text-slate-800 block">
                              {s.parentName || '-'}
                            </span>
                            <span className="text-slate-500 font-mono">
                              {s.parentPhone || '-'}
                            </span>
                          </td>
                        )}
                        <td className="py-2 px-2 text-center border border-slate-200">
                          <span className="text-[10px] font-bold text-emerald-700 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Tuntas</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 5. Distribution by Extracurricular Breakdown */}
            {includeEkskulSummary && sortedEkskuls.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Rekapitulasi Persebaran Cabang Ekstrakurikuler Terpilih</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {sortedEkskuls.map((item) => (
                    <div
                      key={item.name}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800 block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800 text-xs">
                        {item.count} Santri
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Official Signatures Block */}
            {includeSignatures && (
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-end justify-between text-xs text-slate-700">
                {/* Left Signature: Kepala Sekolah with Official Stamp */}
                <div className="text-center w-64 relative">
                  <p className="font-semibold text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-900">Kepala SMP Alfa Ali Masykur</p>

                  {/* Stamp Illustration */}
                  <div className="relative my-2 h-20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600/40 flex flex-col items-center justify-center p-1 text-center select-none rotate-[-6deg] pointer-events-none opacity-80">
                      <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-tighter">
                        SMP ALFA ALI MASYKUR
                      </span>
                      <span className="text-[7px] font-bold text-emerald-700 uppercase">
                        KAB. WONOSOBO
                      </span>
                      <span className="text-[9px] font-black text-emerald-800 mt-0.5">TERAKREDITASI</span>
                    </div>
                  </div>

                  <p className="font-black text-slate-900 underline text-xs">
                    {schoolInfo?.headmaster || 'Afif Mashadi, S.S.'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    NIP. {schoolInfo?.headmasterNip || '19780512 200501 1 007'}
                  </p>
                </div>

                {/* Right Signature: Koordinator / Wali Kelas */}
                <div className="text-center w-64">
                  <p className="font-semibold text-slate-600">
                    Wonosobo, {printDate}
                  </p>
                  <p className="font-bold text-slate-900">
                    {currentUser.role === 'wali_kelas'
                      ? `Wali Kelas ${currentUser.assignedClass || ''}`
                      : currentUser.role === 'pembina'
                      ? `Pembina ${currentUser.assignedEkskulName || 'Ekstrakurikuler'}`
                      : 'Koordinator Ekstrakurikuler'}
                  </p>

                  <div className="h-20 flex items-end justify-center pb-2">
                    <span className="text-[10px] text-slate-400 italic">
                      [Dokumen Sah Diverifikasi Sistem SIM SMP]
                    </span>
                  </div>

                  <p className="font-black text-slate-900 underline text-xs">
                    {currentUser.name || schoolInfo?.coordinatorName || 'Ahmad Fauzi, S.Pd.'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    NIP. {currentUser.nip || schoolInfo?.coordinatorNip || '19850315 201101 1 012'}
                  </p>
                </div>
              </div>
            )}

            {/* Document Verification Footer */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
              <span>
                SIM Ekstrakurikuler SMP Alfa Ali Masykur &bull; Rekapitulasi Siswa Terpilih &bull; Dokumen Sah Sekolah
              </span>
              <span>
                Dicetak pada {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Letterhead Settings Modal */}
      <LetterheadSettingsModal
        isOpen={isLetterheadModalOpen}
        onClose={() => setIsLetterheadModalOpen(false)}
      />
    </div>
  );
};
