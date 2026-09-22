import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';
import {
  FileText,
  Printer,
  Download,
  Filter,
  Search,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  Target,
  Sparkles,
  BarChart3,
  GraduationCap,
  FileSpreadsheet,
  Layers,
  ChevronDown,
  SlidersHorizontal,
  Settings,
  PenTool,
  UserCheck,
  Edit3,
  Save,
  RotateCcw,
  Check,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { StudentPerformancePdfModal } from './StudentPerformancePdfModal';
import {
  exportIndividualStudentPerformancePDF,
  exportRecapitulationStudentPerformancePDF,
} from '../../utils/studentPerformancePdfExport';

export const ReportsView: React.FC = () => {
  const {
    students,
    extracurriculars,
    achievements,
    activityJournals,
    targets,
    attendanceRecords,
    assessments,
    schoolInfo,
    classes,
    coaches,
    updateSchoolInfo,
    showToast,
    currentView,
  } = useApp();

  // Report sub-type
  type ReportCategory =
    | 'rapor_individual'
    | 'per_ekskul'
    | 'mingguan'
    | 'bulanan'
    | 'semesteran'
    | 'tahunan'
    | 'presensi'
    | 'prestasi';

  const [reportType, setReportType] = useState<ReportCategory>('rapor_individual');

  // Auto select report type based on currentView
  useEffect(() => {
    if (currentView === 'reports_individual') setReportType('rapor_individual');
    else if (currentView === 'reports_ekskul') setReportType('per_ekskul');
    else if (currentView === 'reports_weekly') setReportType('mingguan');
    else if (currentView === 'reports_monthly') setReportType('bulanan');
    else if (currentView === 'reports_semester') setReportType('semesteran');
    else if (currentView === 'reports_annual') setReportType('tahunan');
  }, [currentView]);

  const [selectedEkskulId, setSelectedEkskulId] = useState<string>(extracurriculars[0]?.id || 'ekskul-1');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [selectedWeek, setSelectedWeek] = useState<string>('Minggu ke-2 September 2026');
  const [period, setPeriod] = useState<string>('Semester Ganjil 2026/2027');

  // Kop Surat & Lembar Cetak Customization States
  const [isLetterheadModalOpen, setIsLetterheadModalOpen] = useState<boolean>(false);
  const [includeLetterhead, setIncludeLetterhead] = useState<boolean>(true);
  const [includeSignatures, setIncludeSignatures] = useState<boolean>(true);

  // Pejabat Penandatangan Manual States (Kepala Sekolah dibuat manual, Wakasek, Wali Kelas, Pembina)
  const [manualHeadmaster, setManualHeadmaster] = useState<string>(schoolInfo.headmaster || 'Afif Mashadi, S.S.');
  const [manualHeadmasterNip, setManualHeadmasterNip] = useState<string>(
    schoolInfo.headmasterNip || '19780512 200501 1 007'
  );
  const [manualVicePrincipal, setManualVicePrincipal] = useState<string>(
    schoolInfo.vicePrincipalStudentAffairs || 'Yulianti, S.Pd.'
  );
  const [manualVicePrincipalNip, setManualVicePrincipalNip] = useState<string>(
    schoolInfo.vicePrincipalStudentAffairsNip || '19820714 200801 2 011'
  );
  const [manualCity, setManualCity] = useState<string>(schoolInfo.district || 'Wonosobo');
  const [manualSignDate, setManualSignDate] = useState<string>(
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );
  const [manualWaliKelasName, setManualWaliKelasName] = useState<string>('');
  const [manualWaliKelasNip, setManualWaliKelasNip] = useState<string>('');
  const [manualCoachName, setManualCoachName] = useState<string>('');
  const [manualCoachNip, setManualCoachNip] = useState<string>('');
  const [showSignatorySettings, setShowSignatorySettings] = useState<boolean>(false);

  // Sync manual state when schoolInfo changes
  useEffect(() => {
    if (schoolInfo.headmaster) setManualHeadmaster(schoolInfo.headmaster);
    if (schoolInfo.headmasterNip) setManualHeadmasterNip(schoolInfo.headmasterNip);
    if (schoolInfo.vicePrincipalStudentAffairs) setManualVicePrincipal(schoolInfo.vicePrincipalStudentAffairs);
    if (schoolInfo.vicePrincipalStudentAffairsNip) setManualVicePrincipalNip(schoolInfo.vicePrincipalStudentAffairsNip);
    if (schoolInfo.district) setManualCity(schoolInfo.district);
  }, [schoolInfo]);

  // Dynamic font family style matching Kop Surat settings
  const fontFamilyStyle = useMemo(() => {
    switch (schoolInfo.fontFamily) {
      case 'times':
        return { fontFamily: '"Times New Roman", Times, Georgia, serif' };
      case 'bookman':
        return { fontFamily: '"Bookman Old Style", Bookman, Garamond, serif' };
      case 'georgia':
        return { fontFamily: 'Georgia, Cambria, serif' };
      case 'calibri':
        return { fontFamily: 'Calibri, Candara, Segoe, "Segoe UI", sans-serif' };
      case 'arial':
      default:
        return { fontFamily: 'Arial, Helvetica, "Nimbus Sans L", sans-serif' };
    }
  }, [schoolInfo.fontFamily]);

  const fontLabel =
    schoolInfo.fontFamily === 'times'
      ? 'Times New Roman'
      : schoolInfo.fontFamily === 'bookman'
      ? 'Bookman Old Style'
      : schoolInfo.fontFamily === 'georgia'
      ? 'Georgia'
      : schoolInfo.fontFamily === 'calibri'
      ? 'Calibri'
      : 'Arial';

  const scaleLabel =
    schoolInfo.fontScale === 'sm'
      ? 'Kecil (90%)'
      : schoolInfo.fontScale === 'lg'
      ? 'Besar (115%)'
      : 'Standar (100%)';

  const themeLabel =
    schoolInfo.headerColorTheme === 'navy'
      ? 'Biru Resmi'
      : schoolInfo.headerColorTheme === 'black'
      ? 'Hitam Monokrom'
      : 'Hijau Pesantren';

  // Performance PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfModalInitialType, setPdfModalInitialType] = useState<'individual' | 'class_recap' | 'ekskul_recap'>('individual');

  // Selected student for Rapor Individual
  const studentForRapor = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Selected ekskul details
  const currentEkskul = useMemo(() => {
    return extracurriculars.find((e) => e.id === selectedEkskulId) || extracurriculars[0];
  }, [extracurriculars, selectedEkskulId]);

  // Resolve current class & Wali Kelas info
  const currentClassInfo = useMemo(() => {
    const targetClass = studentForRapor?.class || (selectedClass !== 'all' ? selectedClass : '7A');
    return classes.find((c) => c.name === targetClass);
  }, [classes, studentForRapor?.class, selectedClass]);

  const resolvedWaliKelasName = useMemo(() => {
    if (manualWaliKelasName) return manualWaliKelasName;
    if (currentClassInfo?.waliKelas) return currentClassInfo.waliKelas;
    if (studentForRapor?.waliKelas) return studentForRapor.waliKelas;
    return 'Ustadz Ahmad Fauzi, S.Pd.I';
  }, [manualWaliKelasName, currentClassInfo, studentForRapor]);

  const resolvedWaliKelasNip = useMemo(() => {
    if (manualWaliKelasNip) return manualWaliKelasNip;
    if (currentClassInfo?.waliKelasNip) return currentClassInfo.waliKelasNip;
    return '19850315 201101 1 012';
  }, [manualWaliKelasNip, currentClassInfo]);

  // Resolve Coach / Pembina info
  const currentCoachObj = useMemo(() => {
    return coaches.find(
      (c) => c.name === currentEkskul?.coachName || c.assignedEkskulId === currentEkskul?.id
    );
  }, [coaches, currentEkskul]);

  const resolvedCoachName = useMemo(() => {
    if (manualCoachName) return manualCoachName;
    if (currentEkskul?.coachName) return currentEkskul.coachName;
    return 'Pembina Ekstrakurikuler';
  }, [manualCoachName, currentEkskul]);

  const resolvedCoachNip = useMemo(() => {
    if (manualCoachNip) return manualCoachNip;
    if (currentCoachObj?.nip) return currentCoachObj.nip;
    return '19900315 201601 2 008';
  }, [manualCoachNip, currentCoachObj]);

  // Students belonging to selected ekskul
  const ekskulStudents = useMemo(() => {
    return students.filter((s) => (s.ekskulIds || []).includes(selectedEkskulId));
  }, [students, selectedEkskulId]);

  // Journals of selected ekskul
  const ekskulJournals = useMemo(() => {
    return activityJournals.filter((j) => j.ekskulId === selectedEkskulId);
  }, [activityJournals, selectedEkskulId]);

  // Targets of selected ekskul
  const ekskulTargets = useMemo(() => {
    return targets.filter((t) => t.ekskulId === selectedEkskulId);
  }, [targets, selectedEkskulId]);

  // Filtered students for list reports
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery);
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, searchQuery]);

  // 1. Export Excel using XLSX
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    if (reportType === 'rapor_individual' && studentForRapor) {
      const ekskulList = (studentForRapor.ekskulIds || [])
        .map((id) => extracurriculars.find((e) => e.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      const data = [
        { 'Identitas Siswa': 'Nama Lengkap', Keterangan: studentForRapor.name },
        { 'Identitas Siswa': 'NIS / NISN', Keterangan: `${studentForRapor.nis} / ${studentForRapor.nisn || '-'}` },
        { 'Identitas Siswa': 'Kelas / Rombel', Keterangan: `${studentForRapor.class} (${studentForRapor.rombel || '-'})` },
        { 'Identitas Siswa': 'Wali Kelas', Keterangan: studentForRapor.waliKelas || '-' },
        { 'Identitas Siswa': 'Ekstrakurikuler Diikuti', Keterangan: ekskulList },
        { 'Identitas Siswa': 'Tingkat Kehadiran (%)', Keterangan: `${studentForRapor.attendanceRate}%` },
        { 'Identitas Siswa': 'Nilai Akhir', Keterangan: studentForRapor.overallScore },
        { 'Identitas Siswa': 'Predikat Kompetensi', Keterangan: studentForRapor.category },
        { 'Identitas Siswa': 'Catatan Pembimbing', Keterangan: studentForRapor.notes || '-' },
      ];
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Rapor Individu');
      XLSX.writeFile(workbook, `Rapor_Individu_${studentForRapor.name.replace(/\s+/g, '_')}_2026-2027.xlsx`);
    } else if (reportType === 'per_ekskul') {
      const data = ekskulStudents.map((s, idx) => ({
        No: idx + 1,
        NIS: s.nis,
        'Nama Santri': s.name,
        Kelas: s.class,
        'Kehadiran (%)': s.attendanceRate,
        'Nilai Akhir': s.overallScore,
        Predikat: s.category,
      }));
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Peserta Ekskul');
      XLSX.writeFile(workbook, `Laporan_Ekskul_${currentEkskul?.name.replace(/\s+/g, '_')}_2026-2027.xlsx`);
    } else {
      const data = filteredStudents.map((s, idx) => ({
        No: idx + 1,
        NIS: s.nis,
        'Nama Santri': s.name,
        Kelas: s.class,
        'Kehadiran (%)': s.attendanceRate,
        'Nilai Akhir': s.overallScore,
        Predikat: s.category,
      }));
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Rekapitulasi');
      XLSX.writeFile(workbook, `Laporan_${reportType}_SMP_Alfa_Ali_Masykur.xlsx`);
    }

    showToast('Export Excel Berhasil', 'Dokumen laporan Excel (.xlsx) siap digunakan.', 'success');
  };

  // 2. Export PDF using official student performance PDF generator
  const handleExportPDF = () => {
    try {
      if (reportType === 'rapor_individual' && studentForRapor) {
        const fileName = exportIndividualStudentPerformancePDF(
          studentForRapor,
          schoolInfo,
          extracurriculars,
          {
            includeTahfidz: true,
            includeCompetencies: true,
            includeSignatures: true,
          }
        );
        showToast(
          'Export PDF Berhasil',
          `Rapor Kinerja ${studentForRapor.name} (${fileName}) berhasil diunduh.`,
          'success'
        );
      } else if (reportType === 'per_ekskul' && currentEkskul) {
        const title = `Laporan Kinerja & Capaian Ekstrakurikuler ${currentEkskul.name}`;
        const fileName = exportRecapitulationStudentPerformancePDF(
          ekskulStudents,
          schoolInfo,
          title,
          {
            ekskulName: currentEkskul.name,
            categoryLabel: currentEkskul.category,
            className: selectedClass,
          }
        );
        showToast(
          'Export PDF Berhasil',
          `Rekap Kinerja Ekskul ${currentEkskul.name} (${ekskulStudents.length} siswa) berhasil diunduh.`,
          'success'
        );
      } else {
        const titleLabel =
          reportType === 'semesteran'
            ? 'Rekapitulasi Rapor Kinerja Ekstrakurikuler Semester ' + (schoolInfo.semester?.toUpperCase() || 'GANJIL')
            : reportType === 'tahunan'
            ? 'Laporan Evaluasi & Kinerja Prestasi Tahunan Siswa'
            : reportType === 'mingguan'
            ? 'Laporan Kinerja Mingguan Ekstrakurikuler (' + selectedWeek + ')'
            : reportType === 'bulanan'
            ? 'Laporan Evaluasi Bulanan Kinerja Siswa (' + selectedMonth + ')'
            : 'Rekapitulasi Kinerja Siswa SMP Alfa Ali Masykur';

        const fileName = exportRecapitulationStudentPerformancePDF(
          filteredStudents,
          schoolInfo,
          titleLabel,
          {
            className: selectedClass,
            period: schoolInfo.academicYear,
          }
        );
        showToast(
          'Export PDF Berhasil',
          `Dokumen Rekap Kinerja (${filteredStudents.length} siswa) berhasil diunduh (${fileName}).`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Gagal Export PDF', 'Terjadi kesalahan saat memproses dokumen PDF.', 'error');
    }
  };

  const renderDocHeader = (title: string, subtitle?: string, docNumber?: string) => (
    <div className="space-y-3">
      {includeLetterhead && (
        <div className="official-report-letterhead pb-1">
          <OfficialLetterhead onOpenSettings={() => setIsLetterheadModalOpen(true)} />
          <div
            className="my-3 border-t-2 border-b-[0.5px] py-[1.5px]"
            style={{
              borderColor:
                schoolInfo.headerColorTheme === 'black'
                  ? '#0f172a'
                  : schoolInfo.headerColorTheme === 'navy'
                  ? '#1e3a8a'
                  : '#064e3b',
            }}
          />
        </div>
      )}
      <div className="text-center pt-1 pb-3 border-b border-slate-200">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="text-xs font-bold text-emerald-900 uppercase mt-0.5">
          {subtitle ||
            `SMP ALFA ALI MASYKUR • TAHUN PELAJARAN ${schoolInfo.academicYear} (SEMESTER ${schoolInfo.semester?.toUpperCase() || 'GANJIL'})`}
        </p>
        {docNumber && (
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Nomor Dokumen: {docNumber}
          </p>
        )}
      </div>
    </div>
  );

  const renderDocSignatures = (
    mode:
      | 'rapor_individual'
      | 'individual'
      | 'per_ekskul'
      | 'ekskul'
      | 'mingguan'
      | 'bulanan'
      | 'semesteran'
      | 'tahunan'
      | 'presensi'
      | 'prestasi'
      | 'general' = 'general'
  ) => {
    if (!includeSignatures) return null;
    const today = manualSignDate;
    const district = manualCity;

    // 1. LAPORAN INDIVIDU SISWA
    // Yang tanda tangan: Wali Kelas
    // Yang mengetahui: Orang Tua / Wali Siswa
    // Yang mengesahkan: Kepala SMP Alfa Ali Masykur
    if (mode === 'rapor_individual' || mode === 'individual') {
      return (
        <div className="mt-8 pt-4 border-t border-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-center">
            {/* Kolom Kiri: Mengetahui Orang Tua / Wali Siswa */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-900 mt-0.5">Orang Tua / Wali Siswa</p>
              </div>
              <div className="h-16 sm:h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 print:hidden italic">
                  [Tanda Tangan Asli]
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline">
                  ( {studentForRapor?.parentName || '........................................'} )
                </p>
                <p className="text-[11px] text-slate-500">Tanda Tangan & Nama Terang</p>
              </div>
            </div>

            {/* Kolom Tengah: Mengesahkan Kepala SMP Alfa Ali Masykur */}
            <div className="flex flex-col justify-between relative">
              <div>
                <p className="text-slate-600">Mengesahkan,</p>
                <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
              </div>

              {/* Cap Stempel Resmi */}
              <div className="h-16 sm:h-20 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full border border-dashed border-emerald-600/30 flex flex-col items-center justify-center p-1 text-center select-none rotate-[-4deg] pointer-events-none opacity-80">
                  <span className="text-[6.5px] font-bold text-emerald-800 uppercase tracking-tighter">
                    SMP ALFA ALI MASYKUR
                  </span>
                  <span className="text-[6px] font-bold text-emerald-700 uppercase">
                    KAB. WONOSOBO
                  </span>
                  <span className="text-[7.5px] font-black text-emerald-800">TERAKREDITASI</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                  <span>{manualHeadmaster}</span>
                  <button
                    type="button"
                    onClick={() => setShowSignatorySettings(true)}
                    className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                    title="Ubah Nama Kepala Sekolah Manual"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  NIP. {manualHeadmasterNip || '-'}
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Yang Tanda Tangan Wali Kelas */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-600">
                  {district}, {today}
                </p>
                <p className="font-bold text-slate-900 mt-0.5">
                  Wali Kelas {studentForRapor?.class || (selectedClass !== 'all' ? selectedClass : '')}
                </p>
              </div>
              <div className="h-16 sm:h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 print:hidden italic">
                  [Tanda Tangan Asli]
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                  <span>{resolvedWaliKelasName}</span>
                  <button
                    type="button"
                    onClick={() => setShowSignatorySettings(true)}
                    className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                    title="Ubah Nama Wali Kelas Manual"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  NIP. {resolvedWaliKelasNip || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. LAPORAN PER EKSTRAKURIKULER
    // Yang tanda tangan: Pembina Ekstrakurikuler
    // Yang mengetahui: Wakasek Bidang Kesiswaan
    // Yang mengesahkan: Kepala SMP Alfa Ali Masykur
    if (mode === 'per_ekskul' || mode === 'ekskul') {
      return (
        <div className="mt-8 pt-4 border-t border-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-center">
            {/* Kolom Kiri: Mengetahui Wakasek Bidang Kesiswaan */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-900 mt-0.5">Wakasek Bidang Kesiswaan</p>
              </div>
              <div className="h-16 sm:h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 print:hidden italic">
                  [Tanda Tangan Asli]
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                  <span>{manualVicePrincipal}</span>
                  <button
                    type="button"
                    onClick={() => setShowSignatorySettings(true)}
                    className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                    title="Ubah Nama Wakasek Kesiswaan Manual"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  NIP. {manualVicePrincipalNip || '-'}
                </p>
              </div>
            </div>

            {/* Kolom Tengah: Mengesahkan Kepala SMP Alfa Ali Masykur */}
            <div className="flex flex-col justify-between relative">
              <div>
                <p className="text-slate-600">Mengesahkan,</p>
                <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
              </div>

              {/* Cap Stempel Resmi */}
              <div className="h-16 sm:h-20 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full border border-dashed border-emerald-600/30 flex flex-col items-center justify-center p-1 text-center select-none rotate-[-4deg] pointer-events-none opacity-80">
                  <span className="text-[6.5px] font-bold text-emerald-800 uppercase tracking-tighter">
                    SMP ALFA ALI MASYKUR
                  </span>
                  <span className="text-[6px] font-bold text-emerald-700 uppercase">
                    KAB. WONOSOBO
                  </span>
                  <span className="text-[7.5px] font-black text-emerald-800">TERAKREDITASI</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                  <span>{manualHeadmaster}</span>
                  <button
                    type="button"
                    onClick={() => setShowSignatorySettings(true)}
                    className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                    title="Ubah Nama Kepala Sekolah Manual"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  NIP. {manualHeadmasterNip || '-'}
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Yang Tanda Tangan Pembina Ekstrakurikuler */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-slate-600">
                  {district}, {today}
                </p>
                <p className="font-bold text-slate-900 mt-0.5">
                  Pembina {currentEkskul?.name || 'Ekstrakurikuler'}
                </p>
              </div>
              <div className="h-16 sm:h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 print:hidden italic">
                  [Tanda Tangan Asli]
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                  <span>{resolvedCoachName}</span>
                  <button
                    type="button"
                    onClick={() => setShowSignatorySettings(true)}
                    className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                    title="Ubah Nama Pembina Manual"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  NIP. {resolvedCoachNip || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. LAPORAN MINGGUAN, BULANAN, TAHUNAN (DAN SEMESTERAN / PRESENSI / UMUM)
    // Yang tanda tangan: Wakasek Bidang Kesiswaan
    // Yang mengetahui: Kepala SMP Alfa Ali Masykur
    return (
      <div className="mt-8 pt-4 border-t border-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-center max-w-2xl mx-auto">
          {/* Kolom Kiri: Mengetahui Kepala SMP Alfa Ali Masykur */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
            </div>

            {/* Cap Stempel Resmi */}
            <div className="h-16 sm:h-20 flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-full border border-dashed border-emerald-600/30 flex flex-col items-center justify-center p-1 text-center select-none rotate-[-4deg] pointer-events-none opacity-80">
                <span className="text-[6.5px] font-bold text-emerald-800 uppercase tracking-tighter">
                  SMP ALFA ALI MASYKUR
                </span>
                <span className="text-[6px] font-bold text-emerald-700 uppercase">
                  KAB. WONOSOBO
                </span>
                <span className="text-[7.5px] font-black text-emerald-800">TERAKREDITASI</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                <span>{manualHeadmaster}</span>
                <button
                  type="button"
                  onClick={() => setShowSignatorySettings(true)}
                  className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                  title="Ubah Nama Kepala Sekolah Manual"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </p>
              <p className="text-[11px] text-slate-600 font-mono">
                NIP. {manualHeadmasterNip || '-'}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Yang Tanda Tangan Wakasek Bidang Kesiswaan */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-slate-600">
                {district}, {today}
              </p>
              <p className="font-bold text-slate-900 mt-0.5">Wakasek Bidang Kesiswaan</p>
            </div>
            <div className="h-16 sm:h-20 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 print:hidden italic">
                [Tanda Tangan Asli]
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900 underline flex items-center justify-center gap-1">
                <span>{manualVicePrincipal}</span>
                <button
                  type="button"
                  onClick={() => setShowSignatorySettings(true)}
                  className="print:hidden text-emerald-700 hover:text-emerald-900 p-0.5 rounded cursor-pointer"
                  title="Ubah Nama Wakasek Kesiswaan Manual"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </p>
              <p className="text-[11px] text-slate-600 font-mono">
                NIP. {manualVicePrincipalNip || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Pusat Pelaporan Resmi Sekolah</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Laporan & Rekapitulasi Ekstrakurikuler
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Menyediakan 6 format laporan resmi: Individu Siswa, Per Cabang Ekskul, Mingguan, Bulanan, Semesteran, dan Tahunan siap cetak atau ekspor.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsLetterheadModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-emerald-950 font-black text-xs sm:text-sm shadow-md border border-amber-300 transition-all cursor-pointer"
            id="btn-open-kop-settings-banner"
            title="Atur Font, Skala Ukuran, Logo, dan Format Kop Surat Resmi"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-950" />
            <span>Atur Kop Surat & Font</span>
          </button>
          <button
            onClick={() => {
              setPdfModalInitialType(
                reportType === 'rapor_individual'
                  ? 'individual'
                  : reportType === 'per_ekskul'
                  ? 'ekskul_recap'
                  : 'class_recap'
              );
              setIsPdfModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md border border-emerald-600 transition-all cursor-pointer"
            id="btn-open-performance-pdf-export-modal"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Export PDF Kinerja Resmi</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 shadow-md transition-all cursor-pointer"
            title="Download langsung PDF resmi untuk tampilan saat ini"
          >
            <Download className="w-4 h-4 text-emerald-200" />
            <span>Export PDF Cepat</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* Pengaturan Kop Surat & Lembar Dokumen Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Kop Surat & Lembar Laporan:</span>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                  Font: <strong>{fontLabel}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                  Skala: <strong>{scaleLabel}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  Tema: <strong>{themeLabel}</strong>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsLetterheadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer ml-1"
            title="Ubah Font, Skala Ukuran, Logo, dan Format Kop Surat"
            id="btn-open-kop-settings-from-reports"
          >
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span>Ubah Pengaturan Kop & Font</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignatorySettings(!showSignatorySettings)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ml-1 ${
              showSignatorySettings
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                : 'bg-emerald-900 hover:bg-emerald-800 text-white'
            }`}
            title="Edit Manual Nama & NIP Kepala Sekolah, Wakasek, Wali Kelas, Pembina"
            id="btn-toggle-signatory-settings"
          >
            <PenTool className="w-3.5 h-3.5 text-amber-300" />
            <span>Pejabat & Tanda Tangan Manual</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
          <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeLetterhead}
              onChange={(e) => setIncludeLetterhead(e.target.checked)}
              className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
            />
            <span>Tampilkan Kop Surat</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSignatures}
              onChange={(e) => setIncludeSignatures(e.target.checked)}
              className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 cursor-pointer"
            />
            <span>Tanda Tangan Pengesahan</span>
          </label>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Lembar Ini</span>
          </button>
        </div>
      </div>

      {/* Expandable Manual Signatory Settings Panel */}
      {showSignatorySettings && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-4 print:hidden animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400 text-emerald-950 font-bold">
                <PenTool className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Pengaturan Pejabat & Tanda Tangan Pengesahan Laporan (Manual)
                </h3>
                <p className="text-xs text-slate-600">
                  Kepala Sekolah dan pejabat pengesahan dapat disesuaikan secara manual langsung untuk dokumen cetak.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  updateSchoolInfo({
                    headmaster: manualHeadmaster,
                    headmasterNip: manualHeadmasterNip,
                    vicePrincipalStudentAffairs: manualVicePrincipal,
                    vicePrincipalStudentAffairsNip: manualVicePrincipalNip,
                    district: manualCity,
                  });
                  showToast(
                    'Pengaturan Tersimpan',
                    'Nama Kepala Sekolah & Wakasek berhasil disimpan permanen ke profil sekolah.',
                    'success'
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                title="Simpan perubahan ini ke Profil Sekolah"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>Simpan ke Profil</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualHeadmaster(schoolInfo.headmaster || 'Afif Mashadi, S.S.');
                  setManualHeadmasterNip(schoolInfo.headmasterNip || '19780512 200501 1 007');
                  setManualVicePrincipal(
                    schoolInfo.vicePrincipalStudentAffairs || 'Yulianti, S.Pd.'
                  );
                  setManualVicePrincipalNip(
                    schoolInfo.vicePrincipalStudentAffairsNip || '19820714 200801 2 011'
                  );
                  setManualCity(schoolInfo.district || 'Wonosobo');
                  setManualWaliKelasName('');
                  setManualWaliKelasNip('');
                  setManualCoachName('');
                  setManualCoachNip('');
                  showToast('Reset Selesai', 'Nilai tanda tangan dikembalikan ke data default profil.', 'info');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold cursor-pointer"
                title="Kembalikan ke nilai default profil"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSignatorySettings(false)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-amber-200/50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Kepala Sekolah (Dibuat Manual Sesuai Permintaan) */}
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Kepala Sekolah (Manual)</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-[10px] font-bold text-amber-900 border border-amber-200">
                  Mengesahkan / Mengetahui
                </span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Nama Kepala Sekolah & Gelar:
                </label>
                <input
                  type="text"
                  value={manualHeadmaster}
                  onChange={(e) => setManualHeadmaster(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  placeholder="e.g. Afif Mashadi, S.S."
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  NIP Kepala Sekolah:
                </label>
                <input
                  type="text"
                  value={manualHeadmasterNip}
                  onChange={(e) => setManualHeadmasterNip(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 text-xs"
                  placeholder="e.g. 19780512 200501 1 007"
                />
              </div>
            </div>

            {/* 2. Wakasek Kesiswaan */}
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Wakasek Kesiswaan</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[10px] font-bold text-blue-900 border border-blue-200">
                  Tanda Tangan / Mengetahui
                </span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Nama Wakasek Kesiswaan & Gelar:
                </label>
                <input
                  type="text"
                  value={manualVicePrincipal}
                  onChange={(e) => setManualVicePrincipal(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  placeholder="e.g. Yulianti, S.Pd."
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  NIP Wakasek Kesiswaan:
                </label>
                <input
                  type="text"
                  value={manualVicePrincipalNip}
                  onChange={(e) => setManualVicePrincipalNip(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 text-xs"
                  placeholder="e.g. 19820714 200801 2 011"
                />
              </div>
            </div>

            {/* 3. Wali Kelas / Pembina Sesuai Tab Terpilih */}
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    {reportType === 'per_ekskul'
                      ? 'Pembina Ekskul (Manual)'
                      : 'Wali Kelas (Manual)'}
                  </span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-[10px] font-bold text-emerald-900 border border-emerald-200">
                  Tanda Tangan
                </span>
              </div>
              {reportType === 'per_ekskul' ? (
                <>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Nama Pembina ({currentEkskul?.name}):
                    </label>
                    <input
                      type="text"
                      value={manualCoachName || currentEkskul?.coachName || ''}
                      onChange={(e) => setManualCoachName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                      placeholder="e.g. Ahmad Fauzi, S.Pd."
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      NIP Pembina:
                    </label>
                    <input
                      type="text"
                      value={manualCoachNip || currentCoachObj?.nip || ''}
                      onChange={(e) => setManualCoachNip(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 text-xs"
                      placeholder="e.g. 19900315 201601 2 008"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      Nama Wali Kelas ({studentForRapor?.class || (selectedClass !== 'all' ? selectedClass : '7A')}):
                    </label>
                    <input
                      type="text"
                      value={manualWaliKelasName || currentClassInfo?.waliKelas || studentForRapor?.waliKelas || ''}
                      onChange={(e) => setManualWaliKelasName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                      placeholder="e.g. Ustadz Ahmad Fauzi, S.Pd.I"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                      NIP Wali Kelas:
                    </label>
                    <input
                      type="text"
                      value={manualWaliKelasNip || currentClassInfo?.waliKelasNip || ''}
                      onChange={(e) => setManualWaliKelasNip(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 text-xs"
                      placeholder="e.g. 19850315 201101 1 012"
                    />
                  </div>
                </>
              )}
            </div>

            {/* 4. Kota & Tanggal Titimangsa */}
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Titimangsa Laporan</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-800 border border-slate-200">
                  Tempat & Tanggal
                </span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Kota / Kabupaten Pengesahan:
                </label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  placeholder="e.g. Wonosobo"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  Tanggal Pengesahan Dokumen:
                </label>
                <input
                  type="text"
                  value={manualSignDate}
                  onChange={(e) => setManualSignDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900 text-xs"
                  placeholder="e.g. 22 September 2026"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 Core Report Tabs (Section 13-19 and Section 29) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setReportType('rapor_individual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'rapor_individual'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>1. Individu Siswa</span>
          </button>

          <button
            onClick={() => setReportType('per_ekskul')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'per_ekskul'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Per Ekstrakurikuler</span>
          </button>

          <button
            onClick={() => setReportType('mingguan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'mingguan'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3. Mingguan</span>
          </button>

          <button
            onClick={() => setReportType('bulanan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'bulanan'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>4. Bulanan</span>
          </button>

          <button
            onClick={() => setReportType('semesteran')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'semesteran'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>5. Semesteran</span>
          </button>

          <button
            onClick={() => setReportType('tahunan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'tahunan'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>6. Tahunan</span>
          </button>

          <button
            onClick={() => setReportType('presensi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              reportType === 'presensi'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekap Presensi</span>
          </button>
        </div>
      </div>

      {/* Dynamic Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {reportType === 'rapor_individual' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Siswa:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 w-full sm:w-72"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class} - {s.nis})
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'per_ekskul' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Ekstrakurikuler:</label>
              <select
                value={selectedEkskulId}
                onChange={(e) => setSelectedEkskulId(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 w-full sm:w-72"
              >
                {extracurriculars.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.category})
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'mingguan' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Minggu:</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Minggu ke-1 September 2026">Minggu ke-1 September 2026</option>
                <option value="Minggu ke-2 September 2026">Minggu ke-2 September 2026</option>
                <option value="Minggu ke-3 September 2026">Minggu ke-3 September 2026</option>
                <option value="Minggu ke-4 September 2026">Minggu ke-4 September 2026</option>
              </select>
            </div>
          )}

          {reportType === 'bulanan' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Bulan:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Juli 2026">Juli 2026</option>
                <option value="Agustus 2026">Agustus 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="Oktober 2026">Oktober 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="Desember 2026">Desember 2026</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Tahun Pelajaran:</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {schoolInfo.academicYear} &bull; Semester {schoolInfo.semester || 'Ganjil'}
            </span>
          </div>
        </div>
      </div>

      {/* REPORT CONTENT 1: INDIVIDU SISWA (Section 14) */}
      {reportType === 'rapor_individual' && studentForRapor && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {/* Official Letterhead & Title Header */}
          {renderDocHeader(
            'RAPOR HASIL PERKEMBANGAN EKSTRAKURIKULER SISWA',
            `SMP ALFA ALI MASYKUR • TAHUN PELAJARAN ${schoolInfo.academicYear} (SEMESTER ${schoolInfo.semester?.toUpperCase() || 'GANJIL'})`,
            `421.3/EKS/RAPOR-IND/${studentForRapor.class.replace(/\s+/g, '')}/${studentForRapor.nis}/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          {/* Identity Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Nama Santri / Siswa
                </span>
                <p className="text-lg font-black text-slate-900 mt-0.5">{studentForRapor.name}</p>
                <p className="text-xs text-slate-600 mt-1">
                  NIS: <span className="font-mono font-bold">{studentForRapor.nis}</span> &bull; NISN:{' '}
                  <span className="font-mono">{studentForRapor.nisn || '-'}</span>
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Kelas & Wali Kelas
                </span>
                <p className="text-lg font-black text-emerald-950 mt-0.5">
                  Kelas {studentForRapor.class} ({studentForRapor.rombel || 'Rombel Reguler'})
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Wali Kelas: <span className="font-bold">{studentForRapor.waliKelas || '-'}</span>
                </p>
              </div>
            </div>
            <div className="shrink-0 flex sm:flex-col gap-2 print:hidden">
              <button
                type="button"
                onClick={() => {
                  exportIndividualStudentPerformancePDF(
                    studentForRapor,
                    schoolInfo,
                    extracurriculars,
                    {
                      includeTahfidz: true,
                      includeCompetencies: true,
                      includeSignatures: true,
                    }
                  );
                  showToast(
                    'Export PDF Berhasil',
                    `Rapor Kinerja ${studentForRapor.name} berhasil diunduh.`,
                    'success'
                  );
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                id="btn-export-single-student-performance-pdf"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh Rapor PDF Siswa Ini</span>
              </button>
            </div>
          </div>

          {/* Scores & Participation Table */}
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              Capaian Ekstrakurikuler yang Diikuti
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Cabang Ekstrakurikuler</th>
                    <th className="py-3 px-4">Pembina / Pelatih</th>
                    <th className="py-3 px-4 text-center">Kehadiran (%)</th>
                    <th className="py-3 px-4 text-center">Nilai Angka</th>
                    <th className="py-3 px-4 text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(studentForRapor.ekskulIds || []).map((eId, idx) => {
                    const ek = extracurriculars.find((e) => e.id === eId);
                    return (
                      <tr key={eId}>
                        <td className="py-3 px-4 text-slate-500 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{ek?.name || eId}</td>
                        <td className="py-3 px-4 text-slate-600">{ek?.coachName || '-'}</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-800">
                          {studentForRapor.attendanceRate}%
                        </td>
                        <td className="py-3 px-4 text-center font-black text-slate-900">
                          {studentForRapor.overallScore}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {studentForRapor.category}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Radar / Competencies Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Keterampilan</span>
              <p className="text-xl font-black text-emerald-950 mt-1">
                {studentForRapor.competencies?.keterampilan || 3.8} / 4.0
              </p>
            </div>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Kedisiplinan</span>
              <p className="text-xl font-black text-blue-950 mt-1">
                {studentForRapor.competencies?.disiplin || 3.9} / 4.0
              </p>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Kerjasama Tim</span>
              <p className="text-xl font-black text-amber-950 mt-1">
                {studentForRapor.competencies?.kerjasama || 3.8} / 4.0
              </p>
            </div>
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-800 block">Tanggung Jawab</span>
              <p className="text-xl font-black text-purple-950 mt-1">
                {studentForRapor.competencies?.tanggungJawab || 3.9} / 4.0
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-1">Catatan Pembimbing & Akhlak Pesantren:</span>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "{studentForRapor.notes || 'Santri berakhlakul karimah, aktif mengikuti kegiatan dengan tekun, serta menjaga adab thalabul ilmi.'}"
            </p>
          </div>

          {/* Signatures */}
          {renderDocSignatures('rapor_individual')}
        </div>
      )}

      {/* REPORT CONTENT 2: PER EKSTRAKURIKULER (Section 15) */}
      {reportType === 'per_ekskul' && currentEkskul && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {renderDocHeader(
            `REKAPITULASI KEGIATAN & KINERJA EKSTRAKURIKULER ${currentEkskul.name.toUpperCase()}`,
            `SMP ALFA ALI MASYKUR • PEMBINA: ${currentEkskul.coachName.toUpperCase()} • TAHUN PELAJARAN ${schoolInfo.academicYear}`,
            `421.3/EKS/CABANG/${currentEkskul.code || 'EKS'}/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Nama Ekstrakurikuler
              </span>
              <p className="text-lg font-black text-slate-900 mt-0.5">{currentEkskul.name}</p>
              <p className="text-xs text-emerald-800 font-bold mt-1">Kategori: {currentEkskul.category}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Pembina & Pelatih
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">Pembina: {currentEkskul.coachName}</p>
              <p className="text-xs text-slate-600 mt-0.5">Pelatih: {currentEkskul.trainerName || '-'}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Jadwal & Lokasi
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{currentEkskul.day}, {currentEkskul.time}</p>
              <p className="text-xs text-slate-600 mt-0.5">{currentEkskul.location}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-2">Target Capaian Pembelajaran:</h4>
            <p className="text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 leading-relaxed">
              {currentEkskul.targetCapaian || 'Membekali santri keterampilan teknik, kemandirian, dan kesiapan kompetisi resmi.'}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Daftar Santri Anggota ({ekskulStudents.length} Santri)
                </h4>
                <span className="text-xs font-bold text-emerald-800">
                  Kapasitas Kuota: {currentEkskul.quota} Siswa
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const title = `Laporan Kinerja & Capaian Ekstrakurikuler ${currentEkskul.name}`;
                  exportRecapitulationStudentPerformancePDF(
                    ekskulStudents,
                    schoolInfo,
                    title,
                    {
                      ekskulName: currentEkskul.name,
                      categoryLabel: currentEkskul.category,
                      className: selectedClass,
                    }
                  );
                  showToast(
                    'Export PDF Berhasil',
                    `Rekap Kinerja Ekskul ${currentEkskul.name} (${ekskulStudents.length} santri) berhasil diunduh.`,
                    'success'
                  );
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                id="btn-export-ekskul-recap-pdf"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh Rekap PDF Peserta Ekskul Ini</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12">No</th>
                    <th className="py-3 px-4">Nama Santri</th>
                    <th className="py-3 px-4">NIS</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4 text-center">Presensi</th>
                    <th className="py-3 px-4 text-center">Skor Nilai</th>
                    <th className="py-3 px-4 text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ekskulStudents.map((std, idx) => (
                    <tr key={std.id}>
                      <td className="py-3 px-4 text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{std.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{std.nis}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">{std.class}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{std.attendanceRate}%</td>
                      <td className="py-3 px-4 text-center font-black text-slate-900">{std.overallScore}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {std.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          {renderDocSignatures('per_ekskul')}
        </div>
      )}

      {/* REPORT CONTENT 3: MINGGUAN (Section 16) */}
      {reportType === 'mingguan' && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {renderDocHeader(
            'LAPORAN MINGGUAN KETERLAKSANAAN EKSTRAKURIKULER',
            `SMP ALFA ALI MASYKUR • PERIODE: ${selectedWeek.toUpperCase()} • TP ${schoolInfo.academicYear}`,
            `421.3/EKS/MGG/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 print:bg-transparent print:border-slate-300">
            <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base">
              Rekapitulasi Keterlaksanaan Kegiatan: {selectedWeek}
            </h3>
            <p className="text-xs text-emerald-700 mt-1">
              Menampilkan realisasi materi dan partisipasi santri per pertemuan mingguan.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Hari / Waktu</th>
                  <th className="py-3 px-4">Ekstrakurikuler</th>
                  <th className="py-3 px-4">Materi & Topik Jurnal</th>
                  <th className="py-3 px-4">Pembina / Pelatih</th>
                  <th className="py-3 px-4 text-center">Kehadiran</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activityJournals.slice(0, 8).map((j) => (
                  <tr key={j.id}>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {j.day}, {j.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{j.ekskulName}</td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">{j.topic}</td>
                    <td className="py-3 px-4 text-slate-600">{j.coachName}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-800">
                      {j.presentCount} / {j.totalParticipants} ({Math.round((j.presentCount / (j.totalParticipants || 1)) * 100)}%)
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Terlaksana
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          {renderDocSignatures('mingguan')}
        </div>
      )}

      {/* REPORT CONTENT 4: BULANAN (Section 17) */}
      {reportType === 'bulanan' && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {renderDocHeader(
            'LAPORAN EVALUASI & KEMAJUAN BULANAN EKSTRAKURIKULER',
            `SMP ALFA ALI MASYKUR • PERIODE BULAN: ${selectedMonth.toUpperCase()} • TP ${schoolInfo.academicYear}`,
            `421.3/EKS/BLN/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 print:bg-transparent print:border-slate-300">
            <h3 className="font-extrabold text-blue-950 text-sm sm:text-base">
              Evaluasi Bulanan Periode: {selectedMonth}
            </h3>
            <p className="text-xs text-blue-700 mt-1">
              Rekapitulasi efektivitas latihan, catatan kendala, dan rekomendasi tindak lanjut.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ekstrakurikuler</th>
                  <th className="py-3 px-4 text-center">Pertemuan Terlaksana</th>
                  <th className="py-3 px-4 text-center">Rerata Presensi</th>
                  <th className="py-3 px-4">Kendala yang Dihadapi</th>
                  <th className="py-3 px-4">Solusi & Tindak Lanjut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {extracurriculars.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{e.name}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">4 / 4 Pertemuan</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-800">94.2%</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      Keterbatasan ruang saat hujan deras
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium text-[11px]">
                      Relokasi ke Aula Pondok Pesantren
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          {renderDocSignatures('bulanan')}
        </div>
      )}

      {/* REPORT CONTENT 5: SEMESTERAN (Section 18) */}
      {reportType === 'semesteran' && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {renderDocHeader(
            `REKAPITULASI RAPOR EKSTRAKURIKULER SEMESTER ${schoolInfo.semester?.toUpperCase() || 'GANJIL'}`,
            `SMP ALFA ALI MASYKUR • KELAS: ${selectedClass.toUpperCase()} • TAHUN PELAJARAN ${schoolInfo.academicYear}`,
            `421.3/EKS/SMT/${schoolInfo.semester?.toLowerCase() || '1'}/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 print:bg-transparent print:border-slate-300">
            <div>
              <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base">
                Rekapitulasi Rapor Akhir Semester: {period}
              </h3>
              <p className="text-xs text-emerald-700 mt-1">
                Data nilai kumulatif dan predikat kelulusan ekstrakurikuler untuk Buku Rapor Pendidikan Siswa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const title = `Rekapitulasi Rapor Kinerja Ekstrakurikuler Semester ${schoolInfo.semester?.toUpperCase() || 'GANJIL'}`;
                exportRecapitulationStudentPerformancePDF(
                  filteredStudents,
                  schoolInfo,
                  title,
                  {
                    className: selectedClass,
                    period: period,
                  }
                );
                showToast(
                  'Export PDF Berhasil',
                  `Rapor Kinerja Semester (${filteredStudents.length} siswa) berhasil diunduh.`,
                  'success'
                );
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 print:hidden"
              id="btn-export-semester-pdf"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>Unduh Rekap PDF Semester</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Ekstrakurikuler Diikuti</th>
                  <th className="py-3 px-4 text-center">Kehadiran</th>
                  <th className="py-3 px-4 text-center">Nilai Rapor</th>
                  <th className="py-3 px-4 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => {
                  const ekskuls = (s.ekskulIds || [])
                    .map((id) => extracurriculars.find((e) => e.id === id)?.name)
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <tr key={s.id}>
                      <td className="py-3 px-4 text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 font-bold text-slate-700">{s.class}</td>
                      <td className="py-3 px-4 text-slate-600">{ekskuls}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{s.attendanceRate}%</td>
                      <td className="py-3 px-4 text-center font-black text-slate-900">{s.overallScore}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-800">{s.category}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          {renderDocSignatures('semesteran')}
        </div>
      )}

      {/* REPORT CONTENT 6: TAHUNAN (Section 19) */}
      {reportType === 'tahunan' && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {renderDocHeader(
            'LAPORAN EVALUASI TAHUNAN & PRESTASI EKSTRAKURIKULER',
            `SMP ALFA ALI MASYKUR • TAHUN PELAJARAN ${schoolInfo.academicYear}`,
            `421.3/EKS/THN/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 print:bg-transparent print:border-slate-300">
            <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
              Laporan Evaluasi Tahunan & Inventaris Prestasi TP 2026/2027
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Rekapitulasi ketercapaian target kurikuler dan daftar prestasi resmi kejuaraan santri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Peserta Aktif</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{students.length} Siswa</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase">Tingkat Kehadiran Global</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">94.3%</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-xs font-bold text-amber-800 uppercase">Total Prestasi Diraih</span>
              <p className="text-2xl font-black text-amber-950 mt-1">{achievements.length} Medali/Gelar</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900 mb-3">Daftar Prestasi Resmi:</h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Santri</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">Ekstrakurikuler</th>
                    <th className="py-3 px-4">Kejuaraan & Prestasi</th>
                    <th className="py-3 px-4">Tingkat</th>
                    <th className="py-3 px-4">Peringkat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {achievements.map((a, idx) => (
                    <tr key={a.id}>
                      <td className="py-3 px-4 text-slate-500 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{a.studentName}</td>
                      <td className="py-3 px-4 text-slate-600">{a.studentClass}</td>
                      <td className="py-3 px-4 text-emerald-800 font-semibold">{a.ekskulName}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{a.title || a.competitionName}</td>
                      <td className="py-3 px-4 text-slate-700">{a.level}</td>
                      <td className="py-3 px-4 font-bold text-amber-800">{a.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          {renderDocSignatures('tahunan')}
        </div>
      )}

      {/* REPORT CONTENT: PRESENSI LENGKAP */}
      {reportType === 'presensi' && (
        <div
          id="official-print-document"
          style={fontFamilyStyle}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-md text-slate-900 print:p-0 print:border-none print:shadow-none print:rounded-none space-y-6"
        >
          {renderDocHeader(
            'REKAPITULASI PRESENSI KEHADIRAN SANTRI EKSTRAKURIKULER',
            `SMP ALFA ALI MASYKUR • KELAS: ${selectedClass.toUpperCase()} • TAHUN PELAJARAN ${schoolInfo.academicYear}`,
            `421.3/EKS/ABS/${schoolInfo.academicYear.replace('/', '-')}`
          )}

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Rekapitulasi Kehadiran Seluruh Santri
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total {filteredStudents.length} Siswa
            </span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12">No</th>
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">Nama Santri</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4 text-center">Kehadiran (%)</th>
                  <th className="py-3 px-4 text-center">Predikat</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="py-3 px-4 text-slate-500 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{s.nis}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4 text-slate-700">{s.class}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-800">{s.attendanceRate}%</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{s.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          {renderDocSignatures('presensi')}
        </div>
      )}

      {/* Student Performance PDF Export Modal */}
      <StudentPerformancePdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialStudentId={selectedStudentId}
        initialEkskulId={selectedEkskulId}
        initialType={pdfModalInitialType}
      />

      {/* Letterhead & Font Settings Modal */}
      <LetterheadSettingsModal
        isOpen={isLetterheadModalOpen}
        onClose={() => setIsLetterheadModalOpen(false)}
      />
    </div>
  );
};
