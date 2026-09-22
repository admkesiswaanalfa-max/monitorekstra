import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  ExternalLink,
  SlidersHorizontal,
  PenTool,
  Save,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Award,
  Users,
  Calendar,
  BarChart3,
  Layers,
} from 'lucide-react';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';

interface AnalysisPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  period?: string;
}

export const AnalysisPrintModal: React.FC<AnalysisPrintModalProps> = ({
  isOpen,
  onClose,
  period = 'Semester Ganjil 2026/2027',
}) => {
  const {
    students,
    extracurriculars,
    achievements,
    schoolInfo,
    currentUser,
    showToast,
    updateSchoolInfo,
  } = useApp();

  const [paperSize, setPaperSize] = useState<'a4' | 'f4'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [showSignatorySettings, setShowSignatorySettings] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  // Manual Signatory State (Sesuai Permintaan Pejabat & Tanda Tangan Manual)
  const [manualHeadmaster, setManualHeadmaster] = useState(
    schoolInfo.headmaster || 'Afif Mashadi, S.S.'
  );
  const [manualHeadmasterNip, setManualHeadmasterNip] = useState(
    schoolInfo.headmasterNip || '19780512 200501 1 007'
  );
  const [manualVicePrincipal, setManualVicePrincipal] = useState(
    schoolInfo.vicePrincipalStudentAffairs || 'Yulianti, S.Pd.'
  );
  const [manualVicePrincipalNip, setManualVicePrincipalNip] = useState(
    schoolInfo.vicePrincipalStudentAffairsNip || '19820714 200801 2 011'
  );
  const [manualCoordinator, setManualCoordinator] = useState(
    schoolInfo.coordinatorName || 'Ahmad Fauzi, S.Pd.'
  );
  const [manualCoordinatorNip, setManualCoordinatorNip] = useState(
    schoolInfo.coordinatorNip || '19880520 201402 1 004'
  );
  const [manualCity, setManualCity] = useState(schoolInfo.district || 'Wonosobo');
  const [manualSignDate, setManualSignDate] = useState(
    new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  );

  // Sync state if schoolInfo changes
  React.useEffect(() => {
    if (schoolInfo.headmaster) setManualHeadmaster(schoolInfo.headmaster);
    if (schoolInfo.headmasterNip) setManualHeadmasterNip(schoolInfo.headmasterNip);
    if (schoolInfo.vicePrincipalStudentAffairs)
      setManualVicePrincipal(schoolInfo.vicePrincipalStudentAffairs);
    if (schoolInfo.vicePrincipalStudentAffairsNip)
      setManualVicePrincipalNip(schoolInfo.vicePrincipalStudentAffairsNip);
    if (schoolInfo.coordinatorName) setManualCoordinator(schoolInfo.coordinatorName);
    if (schoolInfo.coordinatorNip) setManualCoordinatorNip(schoolInfo.coordinatorNip);
    if (schoolInfo.district) setManualCity(schoolInfo.district);
  }, [schoolInfo]);

  if (!isOpen) return null;

  // 1. Participant stats per ekskul
  const ekskulParticipantStats = extracurriculars.map((e) => {
    const members = students.filter((s) => (s.ekskulIds || []).includes(e.id));
    const avgScore = members.length
      ? Number(
          (members.reduce((acc, s) => acc + (s.overallScore || 0), 0) / members.length).toFixed(1)
        )
      : 0;
    const avgAtt = members.length
      ? Number(
          (members.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / members.length).toFixed(1)
        )
      : 0;
    return {
      id: e.id,
      name: e.name,
      category: e.category,
      count: members.length,
      coach: e.coachName,
      avgScore,
      avgAttendance: avgAtt,
    };
  }).sort((a, b) => b.count - a.count);

  const topEkskulByParticipants = ekskulParticipantStats[0] || null;

  // 2. Global Attendance
  const totalStudents = students.length;
  const overallAvgAttendance = totalStudents
    ? Number((students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalStudents).toFixed(1))
    : 0;

  // 3. Top Students
  const topStudents = [...students]
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 5);

  // 4. Students need attention
  const studentsNeedAttention = students.filter(
    (s) =>
      (s.overallScore || 0) < 75 ||
      (s.attendanceRate || 0) < 75 ||
      s.category === 'Perlu Pembinaan'
  );

  // 5. Lowest attendance ekskuls (<85%)
  const lowestAttendanceEkskuls = ekskulParticipantStats.filter((e) => e.avgAttendance < 85);

  // 6. Achievements distribution
  const totalAchievements = achievements.length;
  const levels = ['Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];
  const achievementCounts: Record<string, number> = {};
  achievements.forEach((a) => {
    achievementCounts[a.level] = (achievementCounts[a.level] || 0) + 1;
  });

  // 7. Monthly trend data
  const monthlyProgressTrend = [
    { month: 'Juli', rataNilai: 82.4, kehadiran: 91.0 },
    { month: 'Agustus', rataNilai: 84.8, kehadiran: 92.5 },
    { month: 'September', rataNilai: 87.2, kehadiran: 94.1 },
    { month: 'Oktober', rataNilai: 89.6, kehadiran: 93.8 },
    { month: 'November', rataNilai: 91.5, kehadiran: 95.2 },
  ];

  // 8. Meeting attendance trend
  const meetingAttendanceTrend = [
    { meeting: 'Pertemuan 1', rate: 93 },
    { meeting: 'Pertemuan 2', rate: 94 },
    { meeting: 'Pertemuan 3', rate: 91 },
    { meeting: 'Pertemuan 4', rate: 95 },
    { meeting: 'Pertemuan 5', rate: 96 },
    { meeting: 'Pertemuan 6', rate: 94 },
    { meeting: 'Pertemuan 7', rate: 95 },
    { meeting: 'Pertemuan 8', rate: 97 },
  ];

  // Handler: Direct Browser Print
  const handleDirectPrint = () => {
    setIsPrinting(true);
    showToast(
      'Menyiapkan Dokumen Cetak',
      'Membuka dialog cetak sistem untuk dokumen analisis...',
      'info'
    );
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print error:', err);
        showToast(
          'Pemberitahuan Cetak',
          'Gunakan tombol "Buka Tab Bersih" jika jendela cetak terhalang oleh peramban.',
          'info'
        );
      } finally {
        setIsPrinting(false);
      }
    }, 250);
  };

  // Handler: Open in Clean Tab (iframe bypass)
  const handleOpenPrintTab = () => {
    const docElement = document.getElementById('analysis-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Laporan_Analisis_Tren_${new Date().toISOString().slice(0, 10)}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 1.5cm 1.2cm;
              margin: 0 auto;
              max-width: ${paperSize === 'f4' ? '215mm' : '210mm'};
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              line-height: 1.4;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 0.5rem;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #334155;
              padding: 6px 8px;
              vertical-align: top;
            }
            th {
              background-color: #f1f5f9;
              font-weight: 700;
              color: #0f172a;
            }
            .section-header {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #0f172a;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 3px;
              margin-top: 1.2rem;
              margin-bottom: 0.5rem;
            }
            @page {
              size: ${paperSize === 'a4' ? 'A4' : '215mm 330mm'} ${orientation};
              margin: 1.2cm 1cm;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
              tr { page-break-inside: avoid; }
            }
            .action-bar {
              position: fixed;
              top: 16px;
              right: 16px;
              background: #064e3b;
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              z-index: 100;
              border: none;
            }
          </style>
        </head>
        <body>
          <button class="no-print action-bar" onclick="window.print()">🖨️ Cetak Dokumen Analisis (Ctrl+P)</button>
          ${docElement.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 350);
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
        'Mohon izinkan pop-up pada peramban Anda untuk membuka tab cetak baru.',
        'error'
      );
    } else {
      showToast('Tab Cetak Bersih Dibuka', 'Dokumen analisis siap cetak terbuka di tab baru.', 'success');
    }
  };

  // Handler: Download Standalone HTML
  const handleDownloadHTML = () => {
    const docElement = document.getElementById('analysis-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Laporan_Analisis_Tren_${new Date().toISOString().slice(0, 10)}</title>
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
    link.download = `Laporan_Analisis_Tren_${schoolInfo.academicYear.replace('/', '-')}_${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    showToast('Berkas Diunduh', 'Berkas dokumen analisis siap cetak berhasil disimpan.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <span>Cetak Laporan Analisis &amp; Tren Ekstrakurikuler</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                  T.A. {schoolInfo.academicYear} &bull; {schoolInfo.semester}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Format dokumen resmi standar kedinasan dengan 8 metrik analitis inti, tabel distribusi, dan pengesahan pejabat.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            id="btn-close-analysis-print-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar Pengaturan Cetak */}
        <div className="p-3.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Paper Size */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 text-[11px]">Kertas:</span>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as any)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="f4">F4 / Folio (215 × 330 mm)</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700 text-[11px]">Orientasi:</span>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="portrait">Tegak (Portrait)</option>
                <option value="landscape">Mendatar (Landscape)</option>
              </select>
            </div>

            {/* Toggle Kop Surat */}
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeLetterhead}
                onChange={(e) => setIncludeLetterhead(e.target.checked)}
                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>Tampilkan Kop Surat</span>
            </label>

            {/* Toggle Tanda Tangan */}
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span>Tanda Tangan Pengesahan</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLetterheadModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-emerald-800 bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-300 font-semibold cursor-pointer shadow-2xs"
              title="Sesuaikan Logo & Teks Kop Surat"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Atur Kop</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSignatorySettings(!showSignatorySettings)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors border font-semibold cursor-pointer shadow-2xs ${
                showSignatorySettings
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="Atur Manual Pejabat & Tanda Tangan Pengesahan"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-700" />
              <span>Pejabat Manual</span>
            </button>
          </div>
        </div>

        {/* Expandable Manual Signatory Form */}
        {showSignatorySettings && (
          <div className="bg-amber-50/90 border-b-2 border-amber-300 p-4 space-y-3 shrink-0 text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-400 text-slate-950 font-bold">
                  <PenTool className="w-3.5 h-3.5" />
                </span>
                <span className="font-extrabold text-slate-900 text-xs">
                  Pengaturan Pejabat Penandatangan Dokumen Analisis (Manual)
                </span>
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
                      'Pengaturan Disimpan',
                      'Data pejabat pengesahan berhasil disimpan ke Profil Sekolah.',
                      'success'
                    );
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                >
                  <Save className="w-3 h-3 text-amber-300" />
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
                    showToast('Reset Selesai', 'Data tanda tangan dikembalikan ke profil default.', 'info');
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white text-slate-700 border border-slate-300 font-semibold text-[11px] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Kepala Sekolah */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-800 text-[11px] block mb-1">
                  Kepala Sekolah (Mengetahui):
                </span>
                <input
                  type="text"
                  value={manualHeadmaster}
                  onChange={(e) => setManualHeadmaster(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-xs mb-1 font-semibold"
                  placeholder="Nama Kepala Sekolah"
                />
                <input
                  type="text"
                  value={manualHeadmasterNip}
                  onChange={(e) => setManualHeadmasterNip(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-mono"
                  placeholder="NIP Kepala Sekolah"
                />
              </div>

              {/* Wakasek Kesiswaan */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-800 text-[11px] block mb-1">
                  Wakasek Kesiswaan (Tanda Tangan):
                </span>
                <input
                  type="text"
                  value={manualVicePrincipal}
                  onChange={(e) => setManualVicePrincipal(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-xs mb-1 font-semibold"
                  placeholder="Nama Wakasek Kesiswaan"
                />
                <input
                  type="text"
                  value={manualVicePrincipalNip}
                  onChange={(e) => setManualVicePrincipalNip(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-mono"
                  placeholder="NIP Wakasek"
                />
              </div>

              {/* Koordinator Ekskul */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-800 text-[11px] block mb-1">
                  Koordinator Ekskul:
                </span>
                <input
                  type="text"
                  value={manualCoordinator}
                  onChange={(e) => setManualCoordinator(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-xs mb-1 font-semibold"
                  placeholder="Nama Koordinator"
                />
                <input
                  type="text"
                  value={manualCoordinatorNip}
                  onChange={(e) => setManualCoordinatorNip(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-mono"
                  placeholder="NIP Koordinator"
                />
              </div>

              {/* Tempat & Tanggal */}
              <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="font-bold text-slate-800 text-[11px] block mb-1">
                  Titimangsa Pengesahan:
                </span>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-xs mb-1 font-semibold"
                  placeholder="Kota / Kabupaten"
                />
                <input
                  type="text"
                  value={manualSignDate}
                  onChange={(e) => setManualSignDate(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 text-[11px]"
                  placeholder="Tanggal Pengesahan"
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Document Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/80 flex justify-center">
          <div
            id="analysis-print-document"
            className="bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-slate-200 w-full text-slate-900 transition-all space-y-6"
            style={{
              maxWidth: orientation === 'landscape' ? '1080px' : '820px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {/* 1. Official Letterhead */}
            {includeLetterhead && (
              <div className="mb-4">
                <OfficialLetterhead
                  onOpenSettings={() => setShowLetterheadModal(true)}
                  readOnly={false}
                />
              </div>
            )}

            {/* 2. Document Title & Metadata Box */}
            <div className="text-center my-4 pb-3 border-b-2 border-slate-900">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-950">
                LAPORAN ANALISIS EKSEKUTIF KINERJA &amp; TREN EKSTRAKURIKULER
              </h2>
              <p className="text-xs font-extrabold text-emerald-900 uppercase mt-0.5">
                SMP ALFA ALI MASYKUR WONOSOBO &bull; PERIODE: {period.toUpperCase()}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2 font-medium">
                <span>Nomor: <strong>421.3/EKS/ANALISIS/{schoolInfo.academicYear.replace('/', '-')}</strong></span>
                <span>&bull;</span>
                <span>Tahun Ajaran: <strong>{schoolInfo.academicYear}</strong></span>
                <span>&bull;</span>
                <span>Semester: <strong>{schoolInfo.semester}</strong></span>
                <span>&bull;</span>
                <span>Dicetak pada: <strong>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong></span>
              </div>
            </div>

            {/* Bagian I: Ringkasan 8 Indikator Analitis Utama */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                I. RINGKASAN EKSEKUTIF INDIKATOR ANALISIS UTAMA
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* 1. Ekskul Terbanyak */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">1. Peserta Terbanyak</span>
                  <p className="text-sm font-black text-slate-900 mt-1">{topEkskulByParticipants?.name || '-'}</p>
                  <p className="text-[11px] text-emerald-800 font-bold mt-0.5">{topEkskulByParticipants?.count || 0} Siswa</p>
                </div>

                {/* 2. Rerata Kehadiran */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">2. Kehadiran Global</span>
                  <p className="text-lg font-black text-blue-950 mt-1">{overallAvgAttendance}%</p>
                  <p className="text-[11px] text-blue-800 font-bold mt-0.5">{overallAvgAttendance >= 90 ? 'Sangat Baik' : 'Baik'}</p>
                </div>

                {/* 3. Skor Tertinggi */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">3. Skor Tertinggi</span>
                  <p className="text-xs font-black text-slate-900 mt-1 truncate">{topStudents[0]?.name || '-'}</p>
                  <p className="text-[11px] text-amber-800 font-bold mt-0.5">Nilai: {topStudents[0]?.overallScore || 0} (Kelas {topStudents[0]?.class || '-'})</p>
                </div>

                {/* 4. Perlu Pembinaan */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">4. Perlu Pembinaan</span>
                  <p className="text-lg font-black text-rose-950 mt-1">{studentsNeedAttention.length} Siswa</p>
                  <p className="text-[11px] text-rose-800 font-bold mt-0.5">Skor/Presensi &lt; 75%</p>
                </div>
              </div>
            </div>

            {/* Bagian II: Distribusi & Rekapitulasi Tiap Cabang Kegiatan */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                II. REKAPITULASI SEBARAN MINAT &amp; EVALUASI CABANG EKSTRAKURIKULER
              </h3>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3 border border-slate-300 w-8 text-center">No</th>
                    <th className="py-2 px-3 border border-slate-300">Nama Ekstrakurikuler</th>
                    <th className="py-2 px-3 border border-slate-300">Kategori</th>
                    <th className="py-2 px-3 border border-slate-300">Pembina / Pelatih</th>
                    <th className="py-2 px-3 border border-slate-300 text-center">Peserta</th>
                    <th className="py-2 px-3 border border-slate-300 text-center">Rerata Nilai</th>
                    <th className="py-2 px-3 border border-slate-300 text-center">Kehadiran</th>
                    <th className="py-2 px-3 border border-slate-300 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ekskulParticipantStats.map((e, idx) => (
                    <tr key={e.id} className={e.avgAttendance < 85 ? 'bg-amber-50/50' : ''}>
                      <td className="py-1.5 px-3 border border-slate-300 text-center font-medium text-slate-600">{idx + 1}</td>
                      <td className="py-1.5 px-3 border border-slate-300 font-bold text-slate-900">{e.name}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-slate-600">{e.category}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-slate-700">{e.coach}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-slate-900">{e.count}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-emerald-800">{e.avgScore || 85}</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-slate-800">{e.avgAttendance}%</td>
                      <td className="py-1.5 px-3 border border-slate-300 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.avgAttendance >= 85
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}>
                          {e.avgAttendance >= 85 ? 'Optimal' : 'Perlu Evaluasi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bagian III: Distribusi Prestasi Santri */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
                III. DISTRIBUSI PRESTASI &amp; PIAGAM KEJUARAAN (TOTAL: {totalAchievements} GELAR)
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                {levels.map((lvl) => (
                  <div key={lvl} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">{lvl}</span>
                    <p className="text-base font-black text-slate-900 mt-0.5">{achievementCounts[lvl] || 0} Juara</p>
                  </div>
                ))}
              </div>

              {achievements.length > 0 && (
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-1.5 px-3 border border-slate-300 w-8 text-center">No</th>
                      <th className="py-1.5 px-3 border border-slate-300">Nama Santri</th>
                      <th className="py-1.5 px-3 border border-slate-300">Kelas</th>
                      <th className="py-1.5 px-3 border border-slate-300">Ekstrakurikuler</th>
                      <th className="py-1.5 px-3 border border-slate-300">Kejuaraan &amp; Prestasi</th>
                      <th className="py-1.5 px-3 border border-slate-300">Tingkat</th>
                      <th className="py-1.5 px-3 border border-slate-300 text-center">Capaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {achievements.slice(0, 6).map((a, idx) => (
                      <tr key={a.id}>
                        <td className="py-1.5 px-3 border border-slate-300 text-center font-medium text-slate-600">{idx + 1}</td>
                        <td className="py-1.5 px-3 border border-slate-300 font-bold text-slate-900">{a.studentName}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-slate-600">{a.studentClass}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-emerald-800 font-semibold">{a.ekskulName}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-slate-800 font-bold">{a.title || a.competitionName}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-slate-600">{a.level}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-amber-800">{a.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bagian IV: Dinamika Tren Perkembangan Bulanan & Kehadiran Pertemuan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  IV. TREN PERKEMBANGAN NILAI BULANAN
                </h3>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-1.5 px-3 border border-slate-300">Bulan</th>
                      <th className="py-1.5 px-3 border border-slate-300 text-center">Rata-rata Nilai</th>
                      <th className="py-1.5 px-3 border border-slate-300 text-center">Rata-rata Presensi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyProgressTrend.map((m) => (
                      <tr key={m.month}>
                        <td className="py-1.5 px-3 border border-slate-300 font-semibold text-slate-800">{m.month}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-emerald-800">{m.rataNilai} / 100</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-blue-800">{m.kehadiran}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                  V. TREN KEHADIRAN PER PERTEMUAN (P1 - P8)
                </h3>
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-1.5 px-3 border border-slate-300">Pertemuan</th>
                      <th className="py-1.5 px-3 border border-slate-300 text-center">Persentase Presensi</th>
                      <th className="py-1.5 px-3 border border-slate-300 text-center">Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetingAttendanceTrend.slice(0, 5).map((p) => (
                      <tr key={p.meeting}>
                        <td className="py-1.5 px-3 border border-slate-300 font-semibold text-slate-800">{p.meeting}</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-blue-800">{p.rate}%</td>
                        <td className="py-1.5 px-3 border border-slate-300 text-center font-bold text-emerald-800">Sangat Baik</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bagian VI: Catatan Rekomendasi Dinas / Kebijakan */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                VI. CATATAN EVALUASI &amp; REKOMENDASI KEBIJAKAN
              </h3>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed">
                <p className="italic font-medium">
                  &ldquo;{customNote ||
                    `Berdasarkan data analisis periode ${period}, pelaksanaan program ekstrakurikuler berjalan efektif dengan tingkat kehadiran rata-rata ${overallAvgAttendance}%. Terhadap santri yang memerlukan pembinaan intensif (${studentsNeedAttention.length} anak), telah dikoordinasikan bimbingan konseling dan pemantauan berkala bersama wali kelas dan ustadz asrama pondok pesantren.`}&rdquo;
                </p>
              </div>
            </div>

            {/* Bagian VII: Tanda Tangan Pengesahan Resmi (Sesuai Hirarki) */}
            {includeSignatures && (
              <div className="pt-6 border-t border-slate-300 page-break-inside-avoid">
                <div className="grid grid-cols-3 gap-6 text-xs text-center text-slate-900">
                  {/* Kolom 1: Wakasek Kesiswaan (Tanda Tangan) */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">Yang Bertanda Tangan,</p>
                      <p className="font-bold text-slate-950">Wakasek Bidang Kesiswaan</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{manualVicePrincipal}</p>
                      <p className="text-[10px] text-slate-600 font-mono">NIP. {manualVicePrincipalNip}</p>
                    </div>
                  </div>

                  {/* Kolom 2: Koordinator Ekstrakurikuler */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">Memeriksa,</p>
                      <p className="font-bold text-slate-950">Koordinator Ekstrakurikuler</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{manualCoordinator}</p>
                      <p className="text-[10px] text-slate-600 font-mono">NIP. {manualCoordinatorNip}</p>
                    </div>
                  </div>

                  {/* Kolom 3: Kepala SMP Alfa Ali Masykur (Mengetahui) */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">
                        {manualCity}, {manualSignDate}
                      </p>
                      <p className="text-slate-600 text-[11px]">Mengetahui,</p>
                      <p className="font-bold text-slate-950">Kepala SMP Alfa Ali Masykur</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{manualHeadmaster}</p>
                      <p className="text-[10px] text-slate-600 font-mono">NIP. {manualHeadmasterNip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">Catatan:</span>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Tambahkan catatan dinas opsional pada lembar cetak..."
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl w-full sm:w-80 focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="Simpan file HTML siap cetak ke komputer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Unduh HTML</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPrintTab}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="Buka dokumen di tab baru browser (bebas hambatan iframe)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Bersih</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPrint}
              disabled={isPrinting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              id="btn-confirm-print-analysis"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{isPrinting ? 'Menyiapkan Cetak...' : 'Cetak Dokumen Sekarang'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Letterhead Settings Modal */}
      <LetterheadSettingsModal
        isOpen={showLetterheadModal}
        onClose={() => setShowLetterheadModal(false)}
      />
    </div>
  );
};
