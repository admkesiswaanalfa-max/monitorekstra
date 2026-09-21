import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  X,
  GraduationCap,
  Users,
  Layers,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {
  exportIndividualStudentPerformancePDF,
  exportRecapitulationStudentPerformancePDF,
} from '../../utils/studentPerformancePdfExport';

interface StudentPerformancePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudentId?: string;
  initialEkskulId?: string;
  initialType?: 'individual' | 'class_recap' | 'ekskul_recap';
}

export const StudentPerformancePdfModal: React.FC<StudentPerformancePdfModalProps> = ({
  isOpen,
  onClose,
  initialStudentId,
  initialEkskulId,
  initialType = 'individual',
}) => {
  const { students, extracurriculars, schoolInfo, showToast } = useApp();

  const [exportMode, setExportMode] = useState<'individual' | 'class_recap' | 'ekskul_recap'>(
    initialType
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || students[0]?.id || ''
  );
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedEkskulId, setSelectedEkskulId] = useState<string>(
    initialEkskulId || extracurriculars[0]?.id || ''
  );
  const [studentSearch, setStudentSearch] = useState('');

  // Options checkboxes
  const [includeTahfidz, setIncludeTahfidz] = useState(true);
  const [includeCompetencies, setIncludeCompetencies] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered students for individual picker
  const filteredStudentsForPicker = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.nis.includes(studentSearch);
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, studentSearch]);

  // Selected student object
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  // Selected ekskul object
  const activeEkskul = useMemo(() => {
    return (
      extracurriculars.find((e) => e.id === selectedEkskulId) || extracurriculars[0]
    );
  }, [extracurriculars, selectedEkskulId]);

  // Class list
  const classList = useMemo(() => {
    const set = new Set(students.map((s) => s.class));
    return Array.from(set).sort();
  }, [students]);

  // Target students for class recapitulation
  const recapStudents = useMemo(() => {
    if (exportMode === 'ekskul_recap') {
      return students.filter((s) => (s.ekskulIds || []).includes(selectedEkskulId));
    }
    if (selectedClass === 'all') {
      return students;
    }
    return students.filter((s) => s.class === selectedClass);
  }, [students, exportMode, selectedEkskulId, selectedClass]);

  if (!isOpen) return null;

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    try {
      if (exportMode === 'individual') {
        if (!activeStudent) {
          showToast('Peringatan', 'Mohon pilih siswa terlebih dahulu.', 'error');
          setIsGenerating(false);
          return;
        }

        const fileName = exportIndividualStudentPerformancePDF(
          activeStudent,
          schoolInfo,
          extracurriculars,
          {
            includeTahfidz,
            includeCompetencies,
            includeSignatures,
          }
        );

        showToast(
          'Export PDF Berhasil',
          `Rapor Kinerja ${activeStudent.name} (${fileName}) berhasil diunduh.`,
          'success'
        );
      } else if (exportMode === 'ekskul_recap') {
        const title = `Laporan Kinerja & Capaian Ekstrakurikuler ${activeEkskul?.name || ''}`;
        const fileName = exportRecapitulationStudentPerformancePDF(
          recapStudents,
          schoolInfo,
          title,
          {
            categoryLabel: activeEkskul?.category,
            ekskulName: activeEkskul?.name,
            className: selectedClass,
          }
        );

        showToast(
          'Export PDF Berhasil',
          `Rekap Kinerja Ekskul ${activeEkskul?.name} (${recapStudents.length} siswa) berhasil diunduh.`,
          'success'
        );
      } else {
        // class_recap
        const title =
          selectedClass === 'all'
            ? 'Rekapitulasi Kinerja Seluruh Siswa SMP Alfa Ali Masykur'
            : `Rekapitulasi Kinerja & Nilai Siswa Kelas ${selectedClass}`;
        const fileName = exportRecapitulationStudentPerformancePDF(
          recapStudents,
          schoolInfo,
          title,
          {
            className: selectedClass,
          }
        );

        showToast(
          'Export PDF Berhasil',
          `Rekap Kinerja ${selectedClass === 'all' ? 'Seluruh Siswa' : `Kelas ${selectedClass}`} (${recapStudents.length} siswa) berhasil diunduh.`,
          'success'
        );
      }

      onClose();
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('Gagal Export PDF', 'Terjadi kesalahan saat memproses dokumen PDF.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/60 border border-emerald-600 text-[10px] font-bold text-emerald-200 mb-1">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>Dokumen Resmi Sekolah & Pesantren</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Export Dokumen PDF Kinerja Siswa
              </h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                Format resmi ber-Kop Surat, nomor dokumen dinas, tabel nilai, dan tanda tangan sah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* 1. Mode Selector */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-2">
              Pilih Jenis Dokumen Laporan Kinerja:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setExportMode('individual')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportMode === 'individual'
                    ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/30 text-emerald-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-xl bg-white shadow-2xs text-emerald-800">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  {exportMode === 'individual' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                </div>
                <span className="font-extrabold text-xs block text-slate-900">
                  Rapor Kinerja Individu
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Laporan lengkap per santri (A4 Portrait, Kop, 8 Aspek, Tahfidz & TTD)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportMode('class_recap')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportMode === 'class_recap'
                    ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/30 text-emerald-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-xl bg-white shadow-2xs text-emerald-800">
                    <Users className="w-4 h-4" />
                  </div>
                  {exportMode === 'class_recap' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                </div>
                <span className="font-extrabold text-xs block text-slate-900">
                  Rekapitulasi Kelas
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Tabel nilai seluruh siswa per kelas / angkatan (A4 Landscape)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExportMode('ekskul_recap')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  exportMode === 'ekskul_recap'
                    ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-600/30 text-emerald-950 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-xl bg-white shadow-2xs text-emerald-800">
                    <Layers className="w-4 h-4" />
                  </div>
                  {exportMode === 'ekskul_recap' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                </div>
                <span className="font-extrabold text-xs block text-slate-900">
                  Rekap Ekstrakurikuler
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  Daftar nilai seluruh peserta cabang ekstrakurikuler (A4 Landscape)
                </span>
              </button>
            </div>
          </div>

          {/* 2. Filter & Target Selection Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            {exportMode === 'individual' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Filter Kelas Siswa:
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs"
                    >
                      <option value="all">Semua Kelas</option>
                      {classList.map((cls) => (
                        <option key={cls} value={cls}>
                          Kelas {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Cari Nama / NIS:
                    </label>
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Ketik nama atau NIS..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pilih Santri / Siswa ({filteredStudentsForPicker.length} siswa ditemukan):
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs"
                  >
                    {filteredStudentsForPicker.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} &bull; Kelas {s.class} (NIS: {s.nis}) &bull; Nilai: {s.overallScore} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Student Card Preview */}
                {activeStudent && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeStudent.avatar}
                        alt={activeStudent.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{activeStudent.name}</p>
                        <p className="text-[11px] text-slate-500">
                          NIS: {activeStudent.nis} &bull; Kelas {activeStudent.class} &bull; Wali:{' '}
                          {activeStudent.waliKelas || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 block">
                        Nilai: {activeStudent.overallScore} ({activeStudent.category})
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Hadir: {activeStudent.attendanceRate}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {exportMode === 'class_recap' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Kelas yang Akan Direkap:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs"
                >
                  <option value="all">Semua Kelas ({students.length} Total Siswa)</option>
                  {classList.map((cls) => {
                    const count = students.filter((s) => s.class === cls).length;
                    return (
                      <option key={cls} value={cls}>
                        Kelas {cls} ({count} Siswa)
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Dokumen akan menyajikan tabel lengkap nama siswa, NIS, kehadiran, nilai kompetensi praktik, kedisiplinan, kerjasama, nilai akhir (skala 100 & 4.0), dan status kelulusan capaian.
                </p>
              </div>
            )}

            {exportMode === 'ekskul_recap' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Cabang Ekstrakurikuler:
                </label>
                <select
                  value={selectedEkskulId}
                  onChange={(e) => setSelectedEkskulId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-bold text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-xs"
                >
                  {extracurriculars.map((e) => {
                    const count = students.filter((s) => (s.ekskulIds || []).includes(e.id)).length;
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.category}) &bull; Pembina: {e.coachName} &bull; {count} Peserta
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Mencetak daftar performa resmi seluruh santri yang terdaftar dalam cabang {activeEkskul?.name}.
                </p>
              </div>
            )}
          </div>

          {/* 3. Official Documentation Options */}
          <div className="space-y-2">
            <span className="block font-extrabold text-slate-800 text-xs">
              Komponen & Standar Dokumen Resmi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeCompetencies}
                  onChange={(e) => setIncludeCompetencies(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-700">
                  8 Aspek Kompetensi
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeTahfidz}
                  onChange={(e) => setIncludeTahfidz(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-700">
                  Capaian Al-Qur'an / Yanbu'a
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <input
                  type="checkbox"
                  checked={includeSignatures}
                  onChange={(e) => setIncludeSignatures(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-700">
                  Stempel & TTD Resmi
                </span>
              </label>
            </div>
          </div>

          {/* 4. Live Specification Preview Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Spesifikasi Format PDF Siap Unduh
              </span>
              <p className="font-bold text-xs">
                {exportMode === 'individual'
                  ? `Rapor Individu: ${activeStudent?.name || '-'} (A4 Portrait)`
                  : exportMode === 'ekskul_recap'
                  ? `Rekapitulasi Ekskul: ${activeEkskul?.name} (${recapStudents.length} Siswa, A4 Landscape)`
                  : `Rekapitulasi Kelas: ${selectedClass === 'all' ? 'Semua Kelas' : `Kelas ${selectedClass}`} (${recapStudents.length} Siswa, A4 Landscape)`}
              </p>
              <p className="text-[10px] text-emerald-800">
                Lembaga: {schoolInfo.name || 'SMP ALFA ALI MASYKUR'} &bull; Tahun Pelajaran {schoolInfo.academicYear}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            id="btn-confirm-export-student-performance-pdf"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? 'Memproses PDF...' : 'Unduh Dokumen PDF Resmi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
