import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  Filter,
  GraduationCap,
  Award,
  Users,
  Trophy,
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  Eye,
  SlidersHorizontal,
  X,
  Sparkles,
  ExternalLink,
  Image,
} from 'lucide-react';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';

type ReportType =
  | 'executive'
  | 'individual'
  | 'recap_ekskul'
  | 'attendance'
  | 'achievements'
  | 'rapor_export';

type PrintPaperSize = 'a4' | 'f4';
type PrintOrientation = 'portrait' | 'landscape';

export const ReportsView: React.FC = () => {
  const {
    students,
    extracurriculars,
    achievements,
    coaches,
    schoolInfo,
    currentUser,
    showToast,
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<
    'executive' | 'individual' | 'recap_ekskul' | 'attendance' | 'achievements' | 'rapor_export'
  >(() => {
    if (currentUser.role === 'wali_kelas') return 'rapor_export';
    if (currentUser.role === 'pembina') return 'recap_ekskul';
    return 'executive';
  });

  const [filterAcademicYear, setFilterAcademicYear] = useState('2025/2026');
  const [filterSemester, setFilterSemester] = useState('Ganjil');
  const [filterClass, setFilterClass] = useState<string>(() => {
    return currentUser.role === 'wali_kelas' && currentUser.assignedClass ? currentUser.assignedClass : 'all';
  });
  const [filterEkskul, setFilterEkskul] = useState<string>(() => {
    return currentUser.role === 'pembina' && currentUser.assignedEkskulId
      ? currentUser.assignedEkskulId
      : extracurriculars[0]?.id || 'ekskul-1';
  });
  const [filterStudentId, setFilterStudentId] = useState(students[0]?.id || '');

  // Sync role defaults when user switches role
  React.useEffect(() => {
    if (currentUser.role === 'wali_kelas') {
      setSelectedReport('rapor_export');
      if (currentUser.assignedClass) setFilterClass(currentUser.assignedClass);
    } else if (currentUser.role === 'pembina') {
      setSelectedReport('recap_ekskul');
      if (currentUser.assignedEkskulId) setFilterEkskul(currentUser.assignedEkskulId);
    }
  }, [currentUser.role, currentUser.assignedClass, currentUser.assignedEkskulId]);

  // Print Settings State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [paperSize, setPaperSize] = useState<PrintPaperSize>('a4');
  const [orientation, setOrientation] = useState<PrintOrientation>('portrait');
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  const activeEkskul = extracurriculars.find((e) => e.id === filterEkskul) || extracurriculars[0];
  const activeStudent = students.find((s) => s.id === filterStudentId) || students[0];

  // Students filtered by class
  const filteredStudents = useMemo(() => {
    return students.filter((s) => filterClass === 'all' || s.class === filterClass);
  }, [students, filterClass]);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(
      (a) => filterClass === 'all' || a.studentClass === filterClass
    );
  }, [achievements, filterClass]);

  // Filtered ekskul members
  const activeEkskulMembers = useMemo(() => {
    return students.filter(
      (s) => s.ekskulIds.includes(activeEkskul?.id) && (filterClass === 'all' || s.class === filterClass)
    );
  }, [students, activeEkskul, filterClass]);

  // Robust print execution
  const handlePrint = () => {
    setIsPrinting(true);
    showToast(
      'Membuka Dialog Cetak',
      'Menyiapkan dokumen resmi SMP Alfa Ali Masykur untuk dicetak atau disimpan ke PDF...',
      'info'
    );

    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (err) {
        console.error('Window print error:', err);
        showToast(
          'Perhatian',
          'Jika dialog cetak tidak otomatis terbuka, gunakan tombol "Buka Tab Cetak Bersih" atau tekan Ctrl+P.',
          'info'
        );
      } finally {
        setIsPrinting(false);
      }
    }, 250);
  };

  // Generate self-contained standalone printable HTML for opening in a new clean tab
  const handleOpenPrintTab = () => {
    const docElement = document.getElementById('official-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Laporan Resmi - SMP Alfa Ali Masykur</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 2cm 1.5cm;
              margin: 0 auto;
              max-width: ${orientation === 'landscape' ? '297mm' : '210mm'};
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 1rem;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #334155;
              padding: 6px 8px;
            }
            th {
              background-color: #f1f5f9;
              font-weight: 700;
            }
            @page {
              size: ${paperSize === 'a4' ? 'A4' : '215mm 330mm'} ${orientation};
              margin: 1.5cm 1cm;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
            .action-bar {
              position: fixed;
              top: 16px;
              right: 16px;
              background: #1e293b;
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              z-index: 100;
            }
          </style>
        </head>
        <body>
          <button class="no-print action-bar" onclick="window.print()">🖨️ Cetak Dokumen (Print / PDF)</button>
          ${docElement.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 400);
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    if (!newTab) {
      showToast(
        'Pop-up Terblokir',
        'Mohon izinkan pop-up peramban untuk membuka tab cetak baru.',
        'error'
      );
    }
  };

  // Download standalone printable HTML file
  const handleDownloadHTML = () => {
    const docElement = document.getElementById('official-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Laporan_Resmi_${selectedReport}_${new Date().toISOString().slice(0, 10)}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2cm 1.5cm; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 11px; }
            th, td { border: 1px solid #334155; padding: 6px 8px; }
            th { background-color: #f1f5f9; }
          </style>
        </head>
        <body>
          ${docElement.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Laporan_Resmi_AlfaEMS_${selectedReport}_${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    showToast('Berkas Siap Cetak Diunduh', 'Berkas HTML siap cetak berhasil diunduh.', 'success');
  };

  // Download Excel/CSV
  const handleDownloadCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `Laporan_${selectedReport}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (selectedReport === 'attendance') {
      headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Ekstrakurikuler', 'Kehadiran (%)', 'Status'];
      rows = filteredStudents.map((s, i) => [
        String(i + 1),
        `"${s.nis}"`,
        `"${s.name}"`,
        s.class,
        `"${s.ekskulIds.map((id) => extracurriculars.find((e) => e.id === id)?.name).join(', ')}"`,
        `${s.attendanceRate}%`,
        s.status,
      ]);
    } else if (selectedReport === 'achievements') {
      headers = ['No', 'Nama Siswa', 'Kelas', 'Ekstrakurikuler', 'Kejuaraan', 'Tingkat', 'Peringkat', 'Penyelenggara', 'Tahun'];
      rows = filteredAchievements.map((a, i) => [
        String(i + 1),
        `"${a.studentName}"`,
        a.studentClass || '',
        `"${a.ekskulName}"`,
        `"${a.competitionName}"`,
        a.level,
        `"${a.rank}"`,
        `"${a.organizer}"`,
        String(a.year),
      ]);
    } else if (selectedReport === 'recap_ekskul') {
      headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Presensi (%)', 'Skor Rerata', 'Predikat'];
      rows = activeEkskulMembers.map((s, i) => [
        String(i + 1),
        `"${s.nis}"`,
        `"${s.name}"`,
        s.class,
        `${s.attendanceRate}%`,
        s.overallScore.toFixed(2),
        s.category,
      ]);
    } else {
      headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Skor Rerata', 'Predikat', 'Status'];
      rows = filteredStudents.map((s, i) => [
        String(i + 1),
        `"${s.nis}"`,
        `"${s.name}"`,
        s.class,
        s.overallScore.toFixed(2),
        s.category,
        s.status,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ekspor Berhasil', `Berkas ${filename} berhasil diunduh.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header - Screen only */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pusat Laporan & Cetak Resmi
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              Format Standar Sekolah
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cetak dokumen ber-Kop resmi SMP Alfa Ali Masykur, simpan PDF, dan ekspor spreadsheet e-Rapor
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Print Button */}
          <button
            id="btn-print-official-report"
            onClick={handlePrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            title="Cetak Laporan Resmi atau Simpan ke PDF (Ctrl+P)"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>{isPrinting ? 'Menyiapkan Cetak...' : 'Cetak Laporan Resmi'}</span>
            <span className="hidden sm:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
              Ctrl+P
            </span>
          </button>

          {/* Letterhead & Logo Setup Button */}
          <button
            id="btn-settings-letterhead"
            onClick={() => setShowLetterheadModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Ganti Logo Sekolah & Atur Kop Surat"
          >
            <Image className="w-4 h-4 text-white" />
            <span>Ganti Logo / Atur Kop</span>
          </button>

          {/* Print Preview & Setup Button */}
          <button
            id="btn-print-preview-modal"
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Pengaturan Cetak & Pratinjau Kertas"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-300" />
            <span>Opsi & Pratinjau</span>
          </button>

          {/* Export CSV/Excel */}
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Unduh Data dalam format CSV/Excel"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs - Screen only */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 no-print">
        {[
          { id: 'executive' as const, label: 'Laporan Eksekutif', icon: GraduationCap },
          { id: 'individual' as const, label: 'Per Individu Siswa', icon: Users },
          { id: 'recap_ekskul' as const, label: 'Rekapitulasi Ekskul', icon: Award },
          { id: 'attendance' as const, label: 'Rekap Kehadiran', icon: ClipboardCheck },
          { id: 'achievements' as const, label: 'Rekor Prestasi', icon: Trophy },
          { id: 'rapor_export' as const, label: 'Format e-Rapor', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-report-${id}`}
            onClick={() => setSelectedReport(id)}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              selectedReport === id
                ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-xs font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-5 h-5 mb-2 ${selectedReport === id ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-xs leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Filter Parameters Bar - Screen only */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs no-print">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Tahun Ajaran</label>
          <select
            value={filterAcademicYear}
            onChange={(e) => setFilterAcademicYear(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
          >
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">Semester</label>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
          >
            <option value="Ganjil">Semester 1 (Ganjil)</option>
            <option value="Genap">Semester 2 (Genap)</option>
          </select>
        </div>

        {selectedReport === 'individual' ? (
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Pilih Siswa</label>
            <select
              value={filterStudentId}
              onChange={(e) => setFilterStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Kelas {s.class} &bull; NIS: {s.nis})
                </option>
              ))}
            </select>
          </div>
        ) : selectedReport === 'recap_ekskul' ? (
          <>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Ekstrakurikuler</label>
              <select
                value={filterEkskul}
                onChange={(e) => setFilterEkskul(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
              >
                {extracurriculars.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Filter Kelas</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
              >
                <option value="all">Semua Kelas</option>
                <option value="VII-A">Kelas VII-A</option>
                <option value="VII-B">Kelas VII-B</option>
                <option value="VIII-A">Kelas VIII-A</option>
                <option value="VIII-B">Kelas VIII-B</option>
                <option value="IX-A">Kelas IX-A</option>
                <option value="IX-B">Kelas IX-B</option>
              </select>
            </div>
          </>
        ) : (
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Filter Kelas</label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold text-slate-800"
            >
              <option value="all">Semua Kelas ({students.length} Siswa)</option>
              <option value="VII-A">Kelas VII-A</option>
              <option value="VII-B">Kelas VII-B</option>
              <option value="VIII-A">Kelas VIII-A</option>
              <option value="VIII-B">Kelas VIII-B</option>
              <option value="IX-A">Kelas IX-A</option>
              <option value="IX-B">Kelas IX-B</option>
            </select>
          </div>
        )}
      </div>

      {/* Quick Print Floating Action on Screen */}
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl no-print text-xs">
        <div className="flex items-center gap-2 text-blue-900 font-semibold">
          <Printer className="w-4 h-4 text-blue-600" />
          <span>Format Siap Cetak: Kertas A4 &bull; Pasuruan, Jawa Timur</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenPrintTab}
            className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Buka dokumen di tab baru jika browser Anda memblokir dialog cetak pada iframe"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Tab Cetak Bersih</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Sekarang</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL DOCUMENT PAPER */}
      <div
        id="official-print-document"
        className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-md max-w-4xl mx-auto print:p-0 print:border-0 print:shadow-none print:max-w-none print:w-full print:m-0"
      >
        {/* Official School Letterhead (Kop Surat Resmi SMP Alfa Ali Masykur) */}
        {includeLetterhead && (
          <OfficialLetterhead onOpenSettings={() => setShowLetterheadModal(true)} />
        )}

        {/* Report Document Title */}
        <div className="text-center my-6">
          <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wide">
            {selectedReport === 'executive' && 'LAPORAN EVALUASI & ANALISIS KINERJA EKSTRAKURIKULER'}
            {selectedReport === 'individual' && 'LEMBAR HASIL PERKEMBANGAN EKSTRAKURIKULER SISWA'}
            {selectedReport === 'recap_ekskul' && `REKAPITULASI KEGIATAN & PRESTASI ${activeEkskul?.name.toUpperCase()}`}
            {selectedReport === 'attendance' && 'REKAPITULASI KEHADIRAN & PARTISIPASI SISWA EKSTRAKURIKULER'}
            {selectedReport === 'achievements' && 'DAFTAR REKAM PRESTASI & PENGHARGAAN RESMI KEJUARAAN SISWA'}
            {selectedReport === 'rapor_export' && 'REKAPITULASI PREDIKAT & DESKRIPSI CAPAIAN UNTUK e-RAPOR'}
          </h2>
          <p className="text-xs text-slate-700 mt-1 font-bold">
            Tahun Ajaran {filterAcademicYear} &bull; Semester {filterSemester}
            {filterClass !== 'all' && ` &bull; Kelas ${filterClass}`}
          </p>
        </div>

        {/* CONTENT VIEW 1: INDIVIDUAL STUDENT REPORT */}
        {selectedReport === 'individual' && activeStudent && (
          <div className="space-y-6 text-xs text-slate-900">
            {/* Student bio info block */}
            <div className="grid grid-cols-2 gap-2 p-3.5 bg-slate-50 border border-slate-300 rounded-xl print:bg-white print:border-slate-800">
              <div>
                <p><span className="text-slate-600">Nama Siswa:</span> <strong>{activeStudent.name}</strong></p>
                <p className="mt-1"><span className="text-slate-600">NIS / NISN:</span> <strong>{activeStudent.nis} / {activeStudent.nisn}</strong></p>
                <p className="mt-1"><span className="text-slate-600">Kelas:</span> <strong>{activeStudent.class}</strong></p>
              </div>
              <div>
                <p><span className="text-slate-600">Orang Tua/Wali:</span> <strong>{activeStudent.parentName}</strong></p>
                <p className="mt-1"><span className="text-slate-600">Ekstrakurikuler:</span> <strong>{activeStudent.ekskulIds.map((id) => extracurriculars.find((e) => e.id === id)?.name).join(', ')}</strong></p>
                <p className="mt-1"><span className="text-slate-600">Tingkat Kehadiran:</span> <strong>{activeStudent.attendanceRate}%</strong></p>
              </div>
            </div>

            {/* 8 Competency table */}
            <table className="w-full text-left border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-[11px] font-bold print:bg-slate-200">
                <tr>
                  <th className="border border-slate-800 p-2 text-center w-10">No</th>
                  <th className="border border-slate-800 p-2">Aspek Kompetensi yang Dinilai</th>
                  <th className="border border-slate-800 p-2 text-center w-24">Skor (1-4)</th>
                  <th className="border border-slate-800 p-2 text-center w-32">Predikat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Keterampilan & Teknik Fisik', score: activeStudent.competencies.keterampilan },
                  { name: 'Pengetahuan Teori & Pemahaman Materi', score: activeStudent.competencies.pengetahuan },
                  { name: 'Kreativitas, Solusi, & Inovasi', score: activeStudent.competencies.kreativitas },
                  { name: 'Kerjasama Tim & Komunikasi Rekan', score: activeStudent.competencies.kerjasama },
                  { name: 'Kedisiplinan & Ketepatan Waktu', score: activeStudent.competencies.disiplin },
                  { name: 'Tanggung Jawab & Integritas Perlengkapan', score: activeStudent.competencies.tanggungJawab },
                  { name: 'Sikap Kepemimpinan & Keteladanan', score: activeStudent.competencies.kepemimpinan },
                  { name: 'Sportivitas & Etos Bertanding', score: activeStudent.competencies.sportivitas },
                ].map((item, idx) => (
                  <tr key={item.name} className="even:bg-slate-50 print:even:bg-transparent">
                    <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-800 p-2 font-medium">{item.name}</td>
                    <td className="border border-slate-800 p-2 text-center font-bold">{item.score.toFixed(2)}</td>
                    <td className="border border-slate-800 p-2 text-center font-semibold">
                      {item.score >= 3.6 ? 'Sangat Baik' : item.score >= 3.0 ? 'Baik' : 'Cukup'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold print:bg-slate-200">
                  <td colSpan={2} className="border border-slate-800 p-2 text-right">Rata-rata Skor Capaian:</td>
                  <td className="border border-slate-800 p-2 text-center text-blue-900">{activeStudent.overallScore.toFixed(2)}</td>
                  <td className="border border-slate-800 p-2 text-center">{activeStudent.category}</td>
                </tr>
              </tbody>
            </table>

            {/* Coach notes */}
            <div className="p-3.5 border border-slate-800 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">Catatan Evaluasi Pembina:</span>
              <p className="italic text-slate-800">
                &ldquo;{activeStudent.notesPembina || 'Siswa menunjukkan antusiasme dan komitmen yang sangat membanggakan dalam setiap sesi latihan.'}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* CONTENT VIEW 2: EXECUTIVE OVERVIEW */}
        {selectedReport === 'executive' && (
          <div className="space-y-5 text-xs text-slate-900">
            <p className="leading-relaxed">
              Berdasarkan hasil pemantauan komprehensif pada Semester Ganjil T.A. 2025/2026, kegiatan ekstrakurikuler SMP Alfa Ali Masykur melibatkan <strong>{students.length} peserta didik aktif</strong> dengan rata-rata kehadiran sekolah mencapai <strong>{(students.reduce((a, s) => a + s.attendanceRate, 0) / (students.length || 1)).toFixed(1)}%</strong> dan capaian nilai perkembangan rata-rata <strong>{(students.reduce((a, s) => a + s.overallScore, 0) / (students.length || 1)).toFixed(2)} / 4.00</strong> (Predikat Baik &mdash; Sangat Baik).
            </p>

            <table className="w-full border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-[11px] font-bold print:bg-slate-200">
                <tr>
                  <th className="border border-slate-800 p-2 text-center w-10">No</th>
                  <th className="border border-slate-800 p-2">Cabang Ekstrakurikuler</th>
                  <th className="border border-slate-800 p-2">Pembina</th>
                  <th className="border border-slate-800 p-2 text-center">Peserta</th>
                  <th className="border border-slate-800 p-2 text-center">Presensi</th>
                  <th className="border border-slate-800 p-2 text-center">Skor Rerata</th>
                  <th className="border border-slate-800 p-2 text-center">Prestasi</th>
                </tr>
              </thead>
              <tbody>
                {extracurriculars.map((e, idx) => {
                  const members = students.filter((s) => s.ekskulIds.includes(e.id));
                  const achs = achievements.filter((a) => a.ekskulId === e.id);
                  const avgAtt = members.length > 0 ? (members.reduce((a, s) => a + s.attendanceRate, 0) / members.length).toFixed(1) : '0';
                  const avgSc = members.length > 0 ? (members.reduce((a, s) => a + s.overallScore, 0) / members.length).toFixed(2) : '0';

                  return (
                    <tr key={e.id} className="even:bg-slate-50 print:even:bg-transparent">
                      <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-bold">{e.name}</td>
                      <td className="border border-slate-800 p-2">{e.coachName}</td>
                      <td className="border border-slate-800 p-2 text-center">{members.length}</td>
                      <td className="border border-slate-800 p-2 text-center">{avgAtt}%</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-blue-900">{avgSc}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-amber-900">{achs.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENT VIEW 3: REKAPITULASI EKSKUL */}
        {selectedReport === 'recap_ekskul' && activeEkskul && (
          <div className="space-y-4 text-xs text-slate-900">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg print:bg-white print:border-slate-800">
              <p><strong>Ekstrakurikuler:</strong> {activeEkskul.name} ({activeEkskul.category})</p>
              <p className="mt-1"><strong>Pembina:</strong> {activeEkskul.coachName} &bull; <strong>Jadwal:</strong> {activeEkskul.schedule}</p>
              <p className="mt-1"><strong>Target Capaian:</strong> {activeEkskul.targetCapaian || activeEkskul.targetAchievement}</p>
            </div>

            <table className="w-full border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-[11px] font-bold print:bg-slate-200">
                <tr>
                  <th className="border border-slate-800 p-2 text-center w-10">No</th>
                  <th className="border border-slate-800 p-2">Nama Siswa</th>
                  <th className="border border-slate-800 p-2">Kelas</th>
                  <th className="border border-slate-800 p-2 text-center">Presensi</th>
                  <th className="border border-slate-800 p-2 text-center">Skor Evaluasi</th>
                  <th className="border border-slate-800 p-2 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody>
                {activeEkskulMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="border border-slate-800 p-4 text-center text-slate-500">
                      Tidak ada siswa terdaftar pada kelas yang dipilih.
                    </td>
                  </tr>
                ) : (
                  activeEkskulMembers.map((s, idx) => (
                    <tr key={s.id} className="even:bg-slate-50 print:even:bg-transparent">
                      <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-bold">{s.name}</td>
                      <td className="border border-slate-800 p-2">{s.class}</td>
                      <td className="border border-slate-800 p-2 text-center">{s.attendanceRate}%</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-blue-900">{s.overallScore.toFixed(2)}</td>
                      <td className="border border-slate-800 p-2 text-center">{s.category}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENT VIEW 4: ATTENDANCE RECAP */}
        {selectedReport === 'attendance' && (
          <div className="space-y-4 text-xs text-slate-900">
            <table className="w-full border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-[11px] font-bold print:bg-slate-200">
                <tr>
                  <th className="border border-slate-800 p-2 text-center w-10">No</th>
                  <th className="border border-slate-800 p-2">NIS</th>
                  <th className="border border-slate-800 p-2">Nama Siswa</th>
                  <th className="border border-slate-800 p-2">Kelas</th>
                  <th className="border border-slate-800 p-2 text-center">Kehadiran (%)</th>
                  <th className="border border-slate-800 p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="even:bg-slate-50 print:even:bg-transparent">
                    <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-800 p-2 font-mono">{s.nis}</td>
                    <td className="border border-slate-800 p-2 font-bold">{s.name}</td>
                    <td className="border border-slate-800 p-2">{s.class}</td>
                    <td className="border border-slate-800 p-2 text-center font-bold">{s.attendanceRate}%</td>
                    <td className="border border-slate-800 p-2 text-center">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENT VIEW 5: ACHIEVEMENTS LIST */}
        {selectedReport === 'achievements' && (
          <div className="space-y-4 text-xs text-slate-900">
            <table className="w-full border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-[11px] font-bold print:bg-slate-200">
                <tr>
                  <th className="border border-slate-800 p-2 text-center w-10">No</th>
                  <th className="border border-slate-800 p-2">Nama Siswa</th>
                  <th className="border border-slate-800 p-2">Ekstrakurikuler</th>
                  <th className="border border-slate-800 p-2">Kejuaraan</th>
                  <th className="border border-slate-800 p-2 text-center">Tingkat</th>
                  <th className="border border-slate-800 p-2 text-center">Juara</th>
                  <th className="border border-slate-800 p-2">Penyelenggara</th>
                </tr>
              </thead>
              <tbody>
                {filteredAchievements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="border border-slate-800 p-4 text-center text-slate-500">
                      Tidak ada catatan prestasi pada filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filteredAchievements.map((a, idx) => (
                    <tr key={a.id} className="even:bg-slate-50 print:even:bg-transparent">
                      <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-bold">{a.studentName} ({a.studentClass})</td>
                      <td className="border border-slate-800 p-2">{a.ekskulName}</td>
                      <td className="border border-slate-800 p-2">{a.competitionName}</td>
                      <td className="border border-slate-800 p-2 text-center">{a.level}</td>
                      <td className="border border-slate-800 p-2 text-center font-bold text-amber-900">{a.rank}</td>
                      <td className="border border-slate-800 p-2">{a.organizer}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENT VIEW 6: e-RAPOR FORMAT */}
        {selectedReport === 'rapor_export' && (
          <div className="space-y-4 text-xs text-slate-900">
            <table className="w-full border-collapse border border-slate-800">
              <thead className="bg-slate-100 text-[11px] font-bold print:bg-slate-200">
                <tr>
                  <th className="border border-slate-800 p-2 text-center w-10">No</th>
                  <th className="border border-slate-800 p-2">NIS</th>
                  <th className="border border-slate-800 p-2">Nama Siswa</th>
                  <th className="border border-slate-800 p-2">Kelas</th>
                  <th className="border border-slate-800 p-2 text-center">Predikat</th>
                  <th className="border border-slate-800 p-2">Deskripsi Rapor</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => {
                  const grade = s.category === 'Sangat Baik' ? 'A' : s.category === 'Baik' ? 'B' : 'C';
                  return (
                    <tr key={s.id} className="even:bg-slate-50 print:even:bg-transparent">
                      <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-800 p-2 font-mono">{s.nis}</td>
                      <td className="border border-slate-800 p-2 font-bold">{s.name}</td>
                      <td className="border border-slate-800 p-2">{s.class}</td>
                      <td className="border border-slate-800 p-2 text-center font-black">{grade}</td>
                      <td className="border border-slate-800 p-2 text-[11px]">
                        Sangat aktif dan menunjukkan dedikasi tinggi serta kerjasama tim yang prima dalam kegiatan ekstrakurikuler.
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Signatures Block (Tanda Tangan Resmi Pembina & Kepala Sekolah) */}
        {includeSignatures && (
          <div className="mt-12 pt-4 grid grid-cols-2 text-center text-xs text-slate-900">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold text-slate-700">Koordinator Ekstrakurikuler</p>
              <div className="h-20" />
              <p className="font-bold underline text-slate-950">Muhammad Rizal, S.Pd.</p>
              <p className="text-[11px] text-slate-600">NIP. 19850612 201001 1 008</p>
            </div>

            <div>
              <p>Pasuruan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold text-slate-700">Kepala SMP Alfa Ali Masykur</p>
              <div className="h-20" />
              <p className="font-bold underline text-slate-950">{schoolInfo.principal}</p>
              <p className="text-[11px] text-slate-600">NIP. {schoolInfo.principalNip}</p>
            </div>
          </div>
        )}
      </div>

      {/* PRINT PREVIEW & CUSTOMIZER MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Opsi & Pengaturan Cetak Dokumen</h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Ukuran Kertas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaperSize('a4')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paperSize === 'a4'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Kertas A4 (210 x 297 mm)
                  </button>
                  <button
                    onClick={() => setPaperSize('f4')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      paperSize === 'f4'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Folio / F4 (215 x 330 mm)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Orientasi Halaman</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      orientation === 'portrait'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Potret (Vertikal)
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      orientation === 'landscape'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Lanskap (Horizontal)
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLetterhead}
                    onChange={(e) => setIncludeLetterhead(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Sertakan Kop Surat Resmi Sekolah</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSignatures}
                    onChange={(e) => setIncludeSignatures(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">Sertakan Kolom Tanda Tangan & Cap</span>
                </label>
              </div>

              {/* Quick Jump to Kop & Logo Customizer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-amber-950 block text-xs">
                    Pengaturan Logo & Kop Surat
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Ganti logo sekolah, unggah file, atau sesuaikan teks instansi
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPrintModal(false);
                    setShowLetterheadModal(true);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Ganti Logo
                </button>
              </div>

              {/* Tips */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <strong>Tips Cetak / PDF:</strong> Pada dialog printer browser, pilih opsi <em>&quot;Simpan sebagai PDF&quot;</em> atau printer fisik, lalu pastikan mencentang <em>&quot;Grafik Latar Belakang&quot;</em> untuk hasil kop surat terbaik.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadHTML}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Unduh berkas HTML mandiri untuk dicetak kapan saja"
                >
                  Unduh HTML
                </button>
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    handleOpenPrintTab();
                  }}
                  className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Buka Tab Baru
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    handlePrint();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Letterhead & Logo Settings Modal */}
      <LetterheadSettingsModal
        isOpen={showLetterheadModal}
        onClose={() => setShowLetterheadModal(false)}
      />
    </div>
  );
};
