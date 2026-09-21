import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  Printer,
  Download,
  ExternalLink,
  Check,
  Eye,
  SlidersHorizontal,
  Calendar,
  Users,
  Award,
  Trophy,
  TrendingUp,
  ClipboardCheck,
  CheckCircle2,
  Shield,
  GraduationCap,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';

interface DashboardPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
}

export const DashboardPrintModal: React.FC<DashboardPrintModalProps> = ({
  isOpen,
  onClose,
  activeRole: initialActiveRole,
}) => {
  const {
    students,
    extracurriculars,
    achievements,
    coaches,
    schoolInfo,
    currentUser,
    showToast,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialActiveRole);
  const [paperSize, setPaperSize] = useState<'a4' | 'f4'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  // Sync role when opened
  React.useEffect(() => {
    setSelectedRole(initialActiveRole);
  }, [initialActiveRole, isOpen]);

  if (!isOpen) return null;

  // Global KPIs
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Aktif').length;
  const participationRate = ((activeStudents / (totalStudents || 1)) * 100).toFixed(1);
  const avgAttendance = (
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (totalStudents || 1)
  ).toFixed(1);
  const avgScore = (
    students.reduce((acc, s) => acc + s.overallScore, 0) / (totalStudents || 1)
  ).toFixed(2);
  const totalAchievements = achievements.length;
  const needAttentionStudents = students.filter(
    (s) => s.category === 'Perlu Pembinaan' || s.attendanceRate < 75
  );

  // Top 5 Students
  const topStudents = [...(students || [])].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0)).slice(0, 5);

  // Pembina specific data (if selected)
  const pembinaEkskul =
    (extracurriculars || []).find((e) => e.id === currentUser?.assignedEkskulId) || (extracurriculars || [])[0];
  const pembinaStudents = (students || []).filter((s) => pembinaEkskul && (s.ekskulIds || []).includes(pembinaEkskul.id));

  // Wali kelas specific data (if selected)
  const targetClass = currentUser.assignedClass || 'VIII-A';
  const classStudents = students.filter((s) => s.class === targetClass);

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator Sistem';
      case 'kepala_sekolah':
        return 'Kepala Sekolah (Eksekutif)';
      case 'pembina':
        return `Pembina Ekstrakurikuler (${pembinaEkskul?.name || 'Cabang'})`;
      case 'wali_kelas':
        return `Wali Kelas (${targetClass})`;
    }
  };

  // Direct print using window.print()
  const handleDirectPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.error('Print error:', err);
        showToast('Info Cetak', 'Gunakan pintasan keyboard Ctrl + P atau tombol Buka Tab Baru jika dialog tidak muncul.', 'info');
      } finally {
        setIsPrinting(false);
      }
    }, 200);
  };

  // Open clean printable document in new tab
  const handleOpenPrintTab = () => {
    const docElement = document.getElementById('dashboard-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Laporan_Dasbor_${selectedRole}_${schoolInfo.academicYear.replace('/', '-')}_${new Date().toISOString().slice(0, 10)}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 1.5cm 1cm;
              margin: 0 auto;
              max-width: ${orientation === 'landscape' ? '297mm' : '210mm'};
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 0.8rem;
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
              margin: 1.2cm 1cm;
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
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              z-index: 100;
              border: none;
            }
          </style>
        </head>
        <body>
          <button class="no-print action-bar" onclick="window.print()">🖨️ Cetak Dokumen Sekarang (Ctrl+P)</button>
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
      showToast('Pop-up Terblokir', 'Mohon izinkan pop-up pada peramban Anda untuk membuka tab cetak baru.', 'error');
    }
  };

  // Download Standalone Printable HTML File
  const handleDownloadHTML = () => {
    const docElement = document.getElementById('dashboard-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Laporan_Dasbor_${selectedRole}_${new Date().toISOString().slice(0, 10)}</title>
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
    link.download = `Laporan_Dasbor_${selectedRole}_${schoolInfo.academicYear.replace('/', '-')}_${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    showToast('Berkas Diunduh', 'Berkas HTML siap cetak berhasil disimpan.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Cetak Halaman Dasbor Ekstrakurikuler</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  T.A. {schoolInfo.academicYear} &bull; {schoolInfo.semester}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Pratinjau dan cetak dokumen resmi statistik pemantauan kegiatan ekstrakurikuler sekolah
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar Pengaturan Cetak */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Role selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 text-[11px]">Format Dasbor:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              {[
                { role: 'admin' as UserRole, label: 'Admin', icon: Shield },
                { role: 'kepala_sekolah' as UserRole, label: 'Kepsek', icon: GraduationCap },
                { role: 'pembina' as UserRole, label: 'Pembina', icon: BookOpen },
                { role: 'wali_kelas' as UserRole, label: 'Wali Kelas', icon: UserCheck },
              ].map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedRole === role
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paper and Orientation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-700 text-[11px]">Kertas:</span>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as any)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-800"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="f4">F4 / Folio (215 × 330 mm)</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-700 text-[11px]">Orientasi:</span>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-800"
              >
                <option value="portrait">Tegak (Portrait)</option>
                <option value="landscape">Mendatar (Landscape)</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeLetterhead}
                onChange={(e) => setIncludeLetterhead(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Kop Dinas</span>
            </label>

            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Tanda Tangan</span>
            </label>

            <button
              type="button"
              onClick={() => setShowLetterheadModal(true)}
              className="inline-flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Sesuaikan Logo & Teks Kop Surat"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Atur Kop</span>
            </button>
          </div>
        </div>

        {/* Live Document Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center">
          <div
            id="dashboard-print-document"
            className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 w-full text-slate-900 transition-all"
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
            <div className="text-center my-4 pb-3 border-b border-slate-300">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-950">
                LAPORAN EKSEKUTIF PEMANTAUAN KEGIATAN EKSTRAKURIKULER
              </h2>
              <p className="text-xs font-bold text-blue-800 uppercase mt-0.5">
                TAMPILAN DASBOR: {getRoleTitle(selectedRole)}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2 font-medium">
                <span>Tahun Ajaran: <strong>{schoolInfo.academicYear}</strong></span>
                <span>&bull;</span>
                <span>Semester: <strong>{schoolInfo.semester}</strong></span>
                <span>&bull;</span>
                <span>Tanggal Dokumen: <strong>{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</strong></span>
                <span>&bull;</span>
                <span>Operator: <strong>{currentUser.name}</strong></span>
              </div>
            </div>

            {/* Optional Custom Note */}
            {customNote && (
              <div className="mb-4 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 italic">
                <strong>Catatan Dinas:</strong> {customNote}
              </div>
            )}

            {/* 3. Core KPIs Summary Table */}
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                I. Indikator Kinerja Utama (Key Performance Indicators)
              </h3>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="border border-slate-300 py-2 px-3">Indikator Pemantauan</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Capaian Real</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Target Standar</th>
                    <th className="border border-slate-300 py-2 px-3">Status Evaluasi Mutu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-semibold">Total Siswa Terdaftar</td>
                    <td className="border border-slate-300 py-2 px-3 text-center font-bold">{totalStudents} Siswa</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-slate-500">100% Peserta</td>
                    <td className="border border-slate-300 py-2 px-3 text-emerald-700 font-medium">Lengkap & Terverifikasi</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-semibold">Partisipasi Aktif Siswa</td>
                    <td className="border border-slate-300 py-2 px-3 text-center font-bold">{activeStudents} Siswa ({participationRate}%)</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-slate-500">&ge; 90%</td>
                    <td className="border border-slate-300 py-2 px-3 text-emerald-700 font-medium">Sangat Baik (Optimal)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-semibold">Rata-Rata Kehadiran (Presensi)</td>
                    <td className="border border-slate-300 py-2 px-3 text-center font-bold">{avgAttendance}%</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-slate-500">&ge; 85%</td>
                    <td className="border border-slate-300 py-2 px-3 text-emerald-700 font-medium">Disiplin Tinggi</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-semibold">Rata-Rata Penilaian Karakter (Skor)</td>
                    <td className="border border-slate-300 py-2 px-3 text-center font-bold">{avgScore} / 4.00</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-slate-500">&ge; 3.00 (Baik)</td>
                    <td className="border border-slate-300 py-2 px-3 text-blue-700 font-medium">Predikat Sangat Baik (A)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-semibold">Total Prestasi & Kejuaraan</td>
                    <td className="border border-slate-300 py-2 px-3 text-center font-bold">{totalAchievements} Piagam</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-slate-500">Kota s/d Nasional</td>
                    <td className="border border-slate-300 py-2 px-3 text-amber-700 font-medium">Berprestasi Unggul</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 py-2 px-3 font-semibold">Peserta Perlu Bimbingan Tambahan</td>
                    <td className="border border-slate-300 py-2 px-3 text-center font-bold text-rose-700">{needAttentionStudents.length} Siswa</td>
                    <td className="border border-slate-300 py-2 px-3 text-center text-slate-500">&le; 5%</td>
                    <td className="border border-slate-300 py-2 px-3 text-rose-600 font-medium">Tindak Lanjut Wali Kelas & Pembina</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Extracurricular Breakdown Table */}
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                II. Rekapitulasi Pembinaan Cabang Ekstrakurikuler
              </h3>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="border border-slate-300 py-2 px-2 text-center w-8">No</th>
                    <th className="border border-slate-300 py-2 px-3">Nama Ekstrakurikuler</th>
                    <th className="border border-slate-300 py-2 px-3">Kategori</th>
                    <th className="border border-slate-300 py-2 px-3">Pembina / Pelatih</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Jadwal Latihan</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Peserta</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Kehadiran</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Prestasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {extracurriculars.map((ekskul, index) => {
                    const count = students.filter((s) => s.ekskulIds.includes(ekskul.id)).length;
                    const members = students.filter((s) => s.ekskulIds.includes(ekskul.id));
                    const att = members.length > 0
                      ? (members.reduce((acc, m) => acc + m.attendanceRate, 0) / members.length).toFixed(1)
                      : '0';
                    const ach = achievements.filter((a) => a.ekskulId === ekskul.id).length;

                    return (
                      <tr key={ekskul.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="border border-slate-300 py-1.5 px-2 text-center font-medium">{index + 1}</td>
                        <td className="border border-slate-300 py-1.5 px-3 font-bold text-slate-900">{ekskul.name}</td>
                        <td className="border border-slate-300 py-1.5 px-3 text-slate-600">{ekskul.category}</td>
                        <td className="border border-slate-300 py-1.5 px-3 text-slate-800">{ekskul.coach}</td>
                        <td className="border border-slate-300 py-1.5 px-3 text-center text-slate-600 text-[11px]">{ekskul.schedule}</td>
                        <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-slate-900">{count} Siswa</td>
                        <td className="border border-slate-300 py-1.5 px-3 text-center font-semibold text-blue-700">{att}%</td>
                        <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-amber-600">{ach}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 5. Top Achievements Recap */}
            <div className="mb-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                III. Catatan Prestasi Unggulan Sekolah (Terbaru)
              </h3>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="border border-slate-300 py-2 px-2 text-center w-8">No</th>
                    <th className="border border-slate-300 py-2 px-3">Nama Siswa / Tim</th>
                    <th className="border border-slate-300 py-2 px-3">Cabang Ekskul</th>
                    <th className="border border-slate-300 py-2 px-3">Nama Kejuaraan / Kompetisi</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Tingkat</th>
                    <th className="border border-slate-300 py-2 px-3 text-center">Peringkat</th>
                    <th className="border border-slate-300 py-2 px-3">Penyelenggara</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(achievements || []).slice(0, 5).map((a, i) => (
                    <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="border border-slate-300 py-1.5 px-2 text-center">{i + 1}</td>
                      <td className="border border-slate-300 py-1.5 px-3 font-bold text-slate-900">{a.studentName}</td>
                      <td className="border border-slate-300 py-1.5 px-3 text-slate-700">{a.ekskulName}</td>
                      <td className="border border-slate-300 py-1.5 px-3 font-semibold text-slate-800">{a.competitionName}</td>
                      <td className="border border-slate-300 py-1.5 px-3 text-center">
                        <span className="font-semibold text-blue-700">{a.level}</span>
                      </td>
                      <td className="border border-slate-300 py-1.5 px-3 text-center font-bold text-amber-700">{a.rank}</td>
                      <td className="border border-slate-300 py-1.5 px-3 text-slate-600">{a.organizer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 6. Signature Block */}
            {includeSignatures && (
              <div className="mt-8 pt-4 border-t border-slate-300">
                <div className="flex justify-between items-start text-xs text-slate-900">
                  <div className="text-center w-64">
                    <p className="text-slate-500">Mengetahui & Mengesahkan,</p>
                    <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
                    <div className="h-20" />
                    <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster}</p>
                    <p className="text-[11px] text-slate-600">NIP. {schoolInfo.headmasterNip || '19750814 200212 1 003'}</p>
                  </div>

                  <div className="text-center w-64">
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
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Tambahkan catatan dinas opsional pada lembar cetak..."
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl w-64 sm:w-80 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Simpan file HTML siap cetak ke komputer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh HTML</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPrintTab}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              title="Buka dokumen di tab baru browser"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Bersih</span>
            </button>

            <button
              type="button"
              onClick={handleDirectPrint}
              disabled={isPrinting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
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
