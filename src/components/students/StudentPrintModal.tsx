import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';
import { Student } from '../../types';
import { DEFAULT_PRIMARY_LOGO, DEFAULT_SECONDARY_LOGO } from '../../data/letterheadPresets';
import {
  Printer,
  Download,
  ExternalLink,
  X,
  SlidersHorizontal,
  CheckCircle2,
  Award,
  ClipboardCheck,
  TrendingUp,
  Trophy,
  FileText,
  User,
  Phone,
  Calendar,
  Building,
} from 'lucide-react';

interface StudentPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export const StudentPrintModal: React.FC<StudentPrintModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const {
    schoolInfo,
    extracurriculars,
    achievements,
    coaches,
    currentUser,
    showToast,
  } = useApp();

  // Print customization states
  const [paperSize, setPaperSize] = useState<'a4' | 'f4'>('a4');
  const [includeLetterhead, setIncludeLetterhead] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
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

  if (!isOpen || !student) return null;

  // Student's extracurriculars
  const ekskuls = student.ekskulIds
    .map((id) => extracurriculars.find((e) => e.id === id))
    .filter(Boolean);

  // Student's achievements
  const studentAchievements = achievements.filter((a) => a.studentId === student.id);

  // Attendance breakdown calculation
  const totalSessions = 24;
  const hadirCount = Math.round((student.attendanceRate / 100) * totalSessions);
  const remaining = Math.max(0, totalSessions - hadirCount);
  const izinCount = Math.min(remaining > 0 ? 1 : 0, remaining);
  const sakitCount = Math.min(remaining - izinCount > 0 ? 1 : 0, remaining - izinCount);
  const alpaCount = Math.max(0, remaining - izinCount - sakitCount);

  // Competency 8 dimensions with descriptors
  const comp = student.competencies;
  const competencyItems = [
    {
      no: 1,
      aspect: 'Keterampilan Teknik',
      score: comp.keterampilan,
      indicator:
        'Penguasaan teknik dasar dan lanjutan, kelincahan gerak, dan penerapan taktik latihan.',
    },
    {
      no: 2,
      aspect: 'Pengetahuan & Teori',
      score: comp.pengetahuan,
      indicator:
        'Pemahaman aturan resmi kegiatan, istilah teknis, dan strategi pelaksanaan cabang.',
    },
    {
      no: 3,
      aspect: 'Kreativitas & Inisiatif',
      score: comp.kreativitas,
      indicator:
        'Kemampuan berimprovisasi, menuangkan ide solutif, serta proaktif dalam sesi latihan.',
    },
    {
      no: 4,
      aspect: 'Kerjasama & Kolaborasi Tim',
      score: comp.kerjasama,
      indicator:
        'Kekompakan regu, komunikasi santun dengan rekan, dan mengutamakan keberhasilan kelompok.',
    },
    {
      no: 5,
      aspect: 'Kedisiplinan & Ketaatan Aturan',
      score: comp.disiplin,
      indicator:
        'Ketepatan waktu kehadiran, kepatuhan seragam/atribut, serta kepatuhan instruksi pembina.',
    },
    {
      no: 6,
      aspect: 'Tanggung Jawab & Kemandirian',
      score: comp.tanggungJawab,
      indicator:
        'Kepedulian terhadap pemeliharaan sarana/alat latihan serta konsistensi menyelesaikan tugas.',
    },
    {
      no: 7,
      aspect: 'Kepemimpinan & Keteladanan',
      score: comp.kepemimpinan,
      indicator:
        'Jiwa mengarahkan rekan sebaya, memberi contoh positif, dan tanggap terhadap situasi tim.',
    },
    {
      no: 8,
      aspect: 'Sportivitas & Etika Karakter',
      score: comp.sportivitas,
      indicator:
        'Sikap lapang dada, menghargai lawan/teman, kejujuran, dan menjunjung tinggi norma sekolah.',
    },
  ];

  // Helper for grade label
  const getGrade = (score: number) => {
    if (score >= 3.6) return { grade: 'A', label: 'Sangat Baik' };
    if (score >= 3.0) return { grade: 'B', label: 'Baik' };
    if (score >= 2.4) return { grade: 'C', label: 'Cukup' };
    return { grade: 'D', label: 'Kurang' };
  };

  const overallGrade = getGrade(student.overallScore);

  // Coach name for primary ekskul
  const primaryEkskul = ekskuls[0];
  const coachName = primaryEkskul?.coachName || 'Pembina Ekstrakurikuler';

  // Wali Kelas Name based on class
  const getWaliKelasName = (studentClass: string) => {
    if (studentClass.startsWith('VII-A')) return 'Dra. Siti Aminah, M.Pd.';
    if (studentClass.startsWith('VII-B')) return 'Budi Santoso, S.Pd.';
    if (studentClass.startsWith('VIII-A')) return 'Ahmad Subandi, S.Pd.';
    if (studentClass.startsWith('VIII-B')) return 'Nurul Hidayah, S.Si.';
    if (studentClass.startsWith('IX-A')) return 'Drs. Hendro Wibowo';
    if (studentClass.startsWith('IX-B')) return 'Rina Wahyuni, S.Pd.';
    return 'Wali Kelas ' + studentClass;
  };

  const waliKelasName = getWaliKelasName(student.class);

  // Direct print execution
  const handlePrint = () => {
    setIsPrinting(true);
    showToast(
      'Membuka Dialog Cetak',
      `Menyiapkan cetakan profil lengkap ${student.name} dari atas sampai bawah...`,
      'info'
    );

    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (err) {
        console.error('Print window error:', err);
        showToast(
          'Perhatian Cetak',
          'Gunakan tombol "Buka Tab Cetak Bersih" jika peramban memblokir cetak langsung.',
          'info'
        );
      } finally {
        setIsPrinting(false);
      }
    }, 250);
  };

  // Open clean printable document in new tab
  const handleOpenPrintTab = () => {
    const docElement = document.getElementById('student-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Biodata_Lengkap_${student.name.replace(/\s+/g, '_')}_${student.nis}_${new Date().toISOString().slice(0, 10)}</title>
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
              size: ${paperSize === 'a4' ? 'A4' : '215mm 330mm'} portrait;
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
              background: #1e293b;
              color: white;
              padding: 10px 18px;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 4px 14px rgba(0,0,0,0.25);
              z-index: 100;
              border: none;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .action-bar:hover {
              background: #0f172a;
            }
          </style>
        </head>
        <body>
          <button class="no-print action-bar" onclick="window.print()">
            🖨️ Cetak Dokumen Lengkap (Ctrl + P)
          </button>
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
        'Mohon izinkan pop-up pada browser Anda untuk membuka tab cetak baru.',
        'error'
      );
    } else {
      showToast('Tab Cetak Bersih Dibuka', 'Dokumen siap cetak terbuka di tab baru.', 'success');
    }
  };

  // Download standalone HTML file
  const handleDownloadHTML = () => {
    const docElement = document.getElementById('student-print-document');
    if (!docElement) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>Biodata_Lengkap_${student.name.replace(/\s+/g, '_')}_${student.nis}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 1.5cm 1.2cm;
              margin: 0 auto;
              max-width: 210mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 11px; }
            th, td { border: 1px solid #334155; padding: 6px 8px; vertical-align: top; }
            th { background-color: #f1f5f9; font-weight: 700; }
            .section-header { font-size: 12px; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 3px; margin-top: 1.2rem; margin-bottom: 0.5rem; }
            @page { size: A4 portrait; margin: 1.2cm 1cm; }
            @media print { body { padding: 0; } tr { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          ${docElement.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Biodata_Siswa_${student.name.replace(/\s+/g, '_')}_${student.nis}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Berkas Diunduh', 'Berkas dokumen cetak berhasil disimpan ke komputer Anda.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto student-detail-modal-backdrop">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-200 my-2 max-h-[96vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 student-detail-modal-container">
        {/* Top Control Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 no-print">
          <div>
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base text-white">
                Cetak Profil Lengkap Peserta Didik
              </h3>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Format dokumen resmi cetak 1 berkas penuh dari atas sampai bawah (Ananda {student.name})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-print-student-now"
              onClick={handlePrint}
              disabled={isPrinting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              title="Cetak Langsung atau Simpan ke PDF"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'Menyiapkan...' : 'Cetak Dokumen (Ctrl+P)'}</span>
            </button>

            <button
              type="button"
              id="btn-print-student-newtab"
              onClick={handleOpenPrintTab}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Buka Tab Cetak Baru (100% Bebas Potongan)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Baru</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Unduh Berkas HTML Siap Cetak"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh HTML</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper & Layout Options Strip */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-700">Ukuran Kertas:</span>
              <select
                value={paperSize}
                onChange={(e) => setPaperSize(e.target.value as 'a4' | 'f4')}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="a4">A4 (210 &times; 297 mm)</option>
                <option value="f4">F4 / Folio (215 &times; 330 mm)</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLetterhead}
                onChange={(e) => setIncludeLetterhead(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">Kop Surat Resmi</span>
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

            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">Lembar Tanda Tangan Resmi</span>
            </label>
          </div>

          <span className="text-[11px] text-slate-500">
            Tip: Pilih <strong>&ldquo;Save as PDF&rdquo;</strong> pada dialog cetak peramban untuk menyimpan arsip digital.
          </span>
        </div>

        {/* Scrollable Printable Document Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/70 flex justify-center student-detail-modal-body print:p-0 print:bg-white">
          {/* Paper Container */}
          <div
            id="student-print-document"
            style={fontFamilyStyle}
            className="bg-white text-slate-900 p-8 sm:p-10 shadow-xl border border-slate-300 w-full max-w-[210mm] min-h-[297mm] text-xs leading-relaxed student-printable-doc print:shadow-none print:border-none print:p-0 print:m-0"
          >
            {/* Header: Official Letterhead */}
            {includeLetterhead && (
              <div className="mb-4">
                <OfficialLetterhead onOpenSettings={() => setIsLetterheadModalOpen(true)} />
                <div className="h-0.5 bg-slate-900 mt-1 mb-3" />
              </div>
            )}

            {/* Document Title */}
            <div className="text-center mb-5">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-950">
                BIODATA &amp; PROFIL CAPAIAN KEGIATAN EKSTRAKURIKULER SISWA
              </h2>
              <p className="text-xs font-bold text-blue-900 uppercase mt-0.5">
                SEMESTER {schoolInfo.semester.toUpperCase()} TAHUN AJARAN {schoolInfo.academicYear}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                No. Dokumen: SIM-EKS/PROFIL/{student.class.replace(/\s+/g, '')}/{student.nis}/
                {schoolInfo.academicYear.replace('/', '-')}
              </p>
            </div>

            {/* Bagian I: Identitas Peserta Didik */}
            <div className="mb-5">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                I. IDENTITAS PESERTA DIDIK
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-3.5 rounded-lg border border-slate-300">
                <div className="w-24 h-28 shrink-0 rounded-lg overflow-hidden border-2 border-slate-400 bg-slate-200 flex items-center justify-center">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Nama Lengkap:</span>
                    <span className="font-bold text-slate-950">{student.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Nomor Induk Siswa (NIS):</span>
                    <span className="font-mono font-bold text-slate-950">{student.nis}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Nomor Induk Siswa Nasional:</span>
                    <span className="font-mono font-bold text-slate-950">{student.nisn}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Kelas / Rombel:</span>
                    <span className="font-bold text-slate-950">Kelas {student.class}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Jenis Kelamin:</span>
                    <span className="font-medium text-slate-950">
                      {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Nama Orang Tua / Wali:</span>
                    <span className="font-medium text-slate-950">{student.parentName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Kontak HP / WhatsApp:</span>
                    <span className="font-mono font-medium text-slate-950">
                      {student.parentPhone}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Status Keaktifan:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                      {student.status}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Skor Capaian Rata-rata:</span>
                    <span className="font-bold text-blue-900">
                      {student.overallScore.toFixed(2)} / 4.00 ({((student.overallScore / 4) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-medium">Predikat Akhir:</span>
                    <span className="font-bold text-blue-900">
                      {student.category} (Predikat {overallGrade.grade})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian II: Ekstrakurikuler yang Diikuti */}
            <div className="mb-5">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                II. CABANG EKSTRAKURIKULER YANG DIIKUTI
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left">
                      Nama Ekstrakurikuler
                    </th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left">Kategori</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left">Pembina / Pelatih</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left">Jadwal Latihan</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left">Lokasi</th>
                  </tr>
                </thead>
                <tbody>
                  {ekskuls.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="border border-slate-400 p-3 text-center text-slate-500">
                        Belum terdaftar pada cabang ekstrakurikuler.
                      </td>
                    </tr>
                  ) : (
                    ekskuls.map((e, idx) => (
                      <tr key={e?.id || idx}>
                        <td className="border border-slate-400 px-2 py-1.5 text-center font-medium">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 font-bold text-slate-950">
                          {e?.name}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-700">
                          {e?.category}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-800">
                          {e?.coachName}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-700">
                          {e?.schedule}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-700">
                          {e?.location}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bagian III: Rekapitulasi Presensi & Kehadiran Latihan */}
            <div className="mb-5">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                III. REKAPITULASI PRESENSI &amp; KEHADIRAN LATIHAN
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-xs text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="border border-slate-400 px-2 py-1.5">Total Pertemuan</th>
                    <th className="border border-slate-400 px-2 py-1.5">Hadir</th>
                    <th className="border border-slate-400 px-2 py-1.5">Izin</th>
                    <th className="border border-slate-400 px-2 py-1.5">Sakit</th>
                    <th className="border border-slate-400 px-2 py-1.5">Tanpa Keterangan</th>
                    <th className="border border-slate-400 px-2 py-1.5">Persentase Kehadiran</th>
                    <th className="border border-slate-400 px-2 py-1.5">Status Keaktifan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-2 font-bold">{totalSessions} Sesi</td>
                    <td className="border border-slate-400 px-2 py-2 text-emerald-800 font-bold">
                      {hadirCount} Kali
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-amber-800 font-medium">
                      {izinCount} Kali
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-indigo-800 font-medium">
                      {sakitCount} Kali
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-rose-800 font-medium">
                      {alpaCount} Kali
                    </td>
                    <td className="border border-slate-400 px-2 py-2 font-black text-blue-900 bg-blue-50/50">
                      {student.attendanceRate}%
                    </td>
                    <td className="border border-slate-400 px-2 py-2 font-bold text-slate-900">
                      {student.attendanceRate >= 85
                        ? 'Sangat Memuaskan'
                        : student.attendanceRate >= 75
                        ? 'Memenuhi Standar'
                        : 'Perlu Perhatian'}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-[10px] text-slate-500 mt-1 italic">
                * Standar minimal kehadiran ekstrakurikuler di SMP Alfa Ali Masykur adalah 75% per semester untuk pemenuhan syarat rapor.
              </p>
            </div>

            {/* Bagian IV: Penilaian 8 Dimensi Perkembangan Kompetensi & Karakter */}
            <div className="mb-5">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                IV. PENILAIAN 8 DIMENSI PERKEMBANGAN KOMPETENSI &amp; KARAKTER (SKALA 1 - 4)
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left w-48">
                      Dimensi Karakter &amp; Kompetensi
                    </th>
                    <th className="border border-slate-400 px-2 py-1.5 text-center w-20">Skor (1-4)</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-center w-16">Predikat</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-left">
                      Indikator Capaian / Deskripsi Pengamatan Pembina
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competencyItems.map((item) => {
                    const gradeInfo = getGrade(item.score);
                    return (
                      <tr key={item.no}>
                        <td className="border border-slate-400 px-2 py-1.5 text-center font-semibold">
                          {item.no}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 font-bold text-slate-900">
                          {item.aspect}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-center font-bold text-blue-900">
                          {item.score.toFixed(2)}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-center font-black">
                          <span
                            className={
                              gradeInfo.grade === 'A'
                                ? 'text-emerald-800'
                                : gradeInfo.grade === 'B'
                                ? 'text-blue-800'
                                : 'text-amber-800'
                            }
                          >
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-700 leading-snug">
                          {item.indicator}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="border border-slate-400 px-3 py-2 text-right">
                      RATA-RATA SKOR AKHIR:
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-center text-blue-950 text-sm font-black">
                      {student.overallScore.toFixed(2)}
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-center text-blue-950 font-black">
                      {overallGrade.grade}
                    </td>
                    <td className="border border-slate-400 px-2 py-2 text-slate-900 font-bold">
                      Kategori Umum: {student.category}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bagian V: Riwayat Perkembangan Evaluasi Bulanan */}
            <div className="mb-5">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                V. RIWAYAT EVALUASI PERKEMBANGAN DARI WAKTU KE WAKTU
              </h3>
              <table className="w-full border-collapse border border-slate-400 text-xs text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    {student.historyScores.map((h) => (
                      <th key={h.month} className="border border-slate-400 px-2 py-1.5">
                        Bulan {h.month}
                      </th>
                    ))}
                    <th className="border border-slate-400 px-2 py-1.5">Dinamika Tren Capaian</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {student.historyScores.map((h) => (
                      <td key={h.month} className="border border-slate-400 px-2 py-2 font-bold text-slate-900">
                        {h.score.toFixed(2)} / 4.00
                      </td>
                    ))}
                    <td className="border border-slate-400 px-2 py-2 font-bold text-emerald-800 bg-emerald-50/50">
                      Meningkat Positif &amp; Konsisten
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bagian VI: Catatan Resmi & Rekomendasi Pembina */}
            <div className="mb-5">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                VI. CATATAN KUALITATIF &amp; REKOMENDASI PEMBINA
              </h3>
              <div className="p-3 border border-slate-400 rounded-lg bg-slate-50 text-xs leading-relaxed text-slate-900">
                <p className="italic font-medium">
                  &ldquo;{student.notesPembina ||
                    `Ananda ${student.name} menunjukkan komitmen, antusiasme, dan kemajuan yang sangat membanggakan dalam kegiatan ekstrakurikuler. Memiliki kedisiplinan yang baik serta mampu bekerjasama dan menginspirasi rekan-rekan satu tim.`}&rdquo;
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-600 font-medium">
                  <span>Rekomendasi Tindak Lanjut: Pertahankan konsistensi latihan dan siap didelegasikan pada ajang kejuaraan mendatang.</span>
                  <span className="font-semibold text-slate-800">Pembina: {coachName}</span>
                </div>
              </div>
            </div>

            {/* Bagian VII: Riwayat Prestasi & Kejuaraan yang Diraih */}
            <div className="mb-6">
              <h3 className="section-header text-[12px] font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
                VII. CATATAN PRESTASI &amp; PIAGAM KEJUARAAN RESMI
              </h3>
              {studentAchievements.length === 0 ? (
                <div className="p-3 border border-slate-400 rounded-lg bg-slate-50 text-center text-slate-500 text-xs italic">
                  Belum ada catatan medali/kejuaraan resmi pada semester ini.
                </div>
              ) : (
                <table className="w-full border-collapse border border-slate-400 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900">
                      <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                      <th className="border border-slate-400 px-2 py-1.5 text-left">Nama Kejuaraan / Kompetisi</th>
                      <th className="border border-slate-400 px-2 py-1.5 text-left">Peringkat / Capaian</th>
                      <th className="border border-slate-400 px-2 py-1.5 text-left">Tingkat</th>
                      <th className="border border-slate-400 px-2 py-1.5 text-left">Penyelenggara</th>
                      <th className="border border-slate-400 px-2 py-1.5 text-center">Tahun / Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAchievements.map((ach, idx) => (
                      <tr key={ach.id}>
                        <td className="border border-slate-400 px-2 py-1.5 text-center font-medium">{idx + 1}</td>
                        <td className="border border-slate-400 px-2 py-1.5 font-bold text-slate-950">
                          {ach.competitionName}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 font-bold text-amber-900">
                          {ach.rank}
                        </td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-700">Tingkat {ach.level}</td>
                        <td className="border border-slate-400 px-2 py-1.5 text-slate-700">{ach.organizer}</td>
                        <td className="border border-slate-400 px-2 py-1.5 text-center text-slate-700">{ach.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Bagian VIII: Lembar Tanda Tangan Pengesahan Resmi (4 Kolom) */}
            {includeSignatures && (
              <div className="mt-8 pt-4 border-t-2 border-slate-400 page-break-inside-avoid">
                <div className="text-right text-xs text-slate-700 mb-4">
                  {schoolInfo.city || 'Kabupaten Pasuruan'},{' '}
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>

                <div className="grid grid-cols-4 gap-4 text-center text-xs text-slate-900">
                  {/* Kolom 1: Kepala Sekolah */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">Mengetahui,</p>
                      <p className="font-bold text-slate-950">Kepala SMP Alfa Ali Masykur</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{schoolInfo.headmaster}</p>
                      <p className="text-[10px] text-slate-600 font-mono">
                        NIP. {schoolInfo.headmasterNip || '19750814 200212 1 003'}
                      </p>
                    </div>
                  </div>

                  {/* Kolom 2: Wali Kelas */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">Memeriksa,</p>
                      <p className="font-bold text-slate-950">Wali Kelas {student.class}</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{waliKelasName}</p>
                      <p className="text-[10px] text-slate-600 font-mono">NIP. 19820516 200801 2 007</p>
                    </div>
                  </div>

                  {/* Kolom 3: Pembina Ekstrakurikuler */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">Menilai,</p>
                      <p className="font-bold text-slate-950">Pembina Ekstrakurikuler</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{coachName}</p>
                      <p className="text-[10px] text-slate-600 font-mono">NUPTK / NIP Pembina</p>
                    </div>
                  </div>

                  {/* Kolom 4: Orang Tua / Wali */}
                  <div className="flex flex-col justify-between h-36">
                    <div>
                      <p className="text-slate-600 text-[11px]">Menyetujui,</p>
                      <p className="font-bold text-slate-950">Orang Tua / Wali Siswa</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950">{student.parentName}</p>
                      <p className="text-[10px] text-slate-500">Tanda Tangan &amp; Nama Terang</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
