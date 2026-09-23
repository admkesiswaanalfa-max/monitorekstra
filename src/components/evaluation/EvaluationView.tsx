import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getAvailableClassNames } from '../../utils/classUtils';
import {
  FileSpreadsheet,
  Sparkles,
  Download,
  Filter,
  CheckCircle2,
  Printer,
  Edit3,
  Search,
  BookOpen,
} from 'lucide-react';

export const EvaluationView: React.FC = () => {
  const { students, extracurriculars, currentUser, showToast, classes } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return currentUser.role === 'wali_kelas' && currentUser.assignedClass ? currentUser.assignedClass : 'all';
  });
  const [selectedEkskul, setSelectedEkskul] = useState<string>(() => {
    return currentUser.role === 'pembina' && currentUser.assignedEkskulId ? currentUser.assignedEkskulId : 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Sync role assignment
  React.useEffect(() => {
    if (currentUser.role === 'wali_kelas' && currentUser.assignedClass) {
      setSelectedClass(currentUser.assignedClass);
    } else if (currentUser.role === 'pembina' && currentUser.assignedEkskulId) {
      setSelectedEkskul(currentUser.assignedEkskulId);
    }
  }, [currentUser.role, currentUser.assignedClass, currentUser.assignedEkskulId]);

  // Editable automated descriptions state mapped by student ID
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

  // Generate automated description helper (Section 11 requirement)
  const generateAutoDescription = (studentName: string, category: string, ekskulName: string, score: number) => {
    if (category === 'Sangat Baik') {
      return `Ananda ${studentName} menunjukkan dedikasi, kedisiplinan, dan penguasaan teknik yang sangat istimewa dalam kegiatan ${ekskulName}. Memiliki jiwa kepemimpinan serta kerjasama tim yang teladan.`;
    } else if (category === 'Baik') {
      return `Ananda ${studentName} aktif berpartisipasi dan menunjukkan pemahaman teori serta praktik yang baik dalam ${ekskulName}. Mampu berkolaborasi dengan kompak bersama rekan regu.`;
    } else if (category === 'Cukup') {
      return `Ananda ${studentName} cukup aktif mengikuti sesi ${ekskulName}. Perlu meningkatkan kedisiplinan waktu kehadiran dan ketekunan dalam latihan teknik mandiri.`;
    } else {
      return `Ananda ${studentName} memerlukan bimbingan lebih intensif dan pendampingan personal dari pembina untuk meningkatkan komitmen dan motivasi dalam ${ekskulName}.`;
    }
  };

  // Initialize descriptions
  React.useEffect(() => {
    const map: Record<string, string> = {};
    students.forEach((s) => {
      const ekskul = extracurriculars.find((e) => e.id === s.ekskulIds[0]);
      map[s.id] = generateAutoDescription(s.name, s.category, ekskul?.name || 'Ekstrakurikuler', s.overallScore);
    });
    setDescriptions(map);
  }, [students, extracurriculars]);

  const handleRegenerateAll = () => {
    const map: Record<string, string> = {};
    students.forEach((s) => {
      const ekskul = extracurriculars.find((e) => e.id === s.ekskulIds[0]);
      map[s.id] = generateAutoDescription(s.name, s.category, ekskul?.name || 'Ekstrakurikuler', s.overallScore);
    });
    setDescriptions(map);
    showToast(
      'Narasi Diperbarui',
      'Seluruh deskripsi capaian rapor ekstrakurikuler berhasil digenerate ulang!',
      'success'
    );
  };

  const handleUpdateDescription = (studentId: string, text: string) => {
    setDescriptions((prev) => ({
      ...prev,
      [studentId]: text,
    }));
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery);
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchEkskul = selectedEkskul === 'all' || s.ekskulIds.includes(selectedEkskul);
      return matchSearch && matchClass && matchEkskul;
    });
  }, [students, searchQuery, selectedClass, selectedEkskul]);

  // Export to Excel / CSV format
  const handleExportRapor = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      'Kelas',
      'Ekstrakurikuler',
      'Presensi (%)',
      'Skor Akhir',
      'Predikat',
      'Deskripsi Capaian Rapor',
    ];

    const rows = filteredStudents.map((s, idx) => {
      const ekskulNames = s.ekskulIds
        .map((id) => extracurriculars.find((e) => e.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      const grade =
        s.category === 'Sangat Baik' ? 'A' : s.category === 'Baik' ? 'B' : s.category === 'Cukup' ? 'C' : 'D';

      return [
        idx + 1,
        `"${s.nis}"`,
        `"${s.name}"`,
        s.class,
        `"${ekskulNames}"`,
        `${s.attendanceRate}%`,
        s.overallScore.toFixed(2),
        grade,
        `"${descriptions[s.id] || ''}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapor_Nilai_Ekstrakurikuler_SMP_Alfa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Role Notice */}
      {currentUser.role === 'wali_kelas' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md font-bold bg-amber-200 text-amber-900 text-[11px]">
              Verifikasi Nilai Rapor &bull; Kelas {currentUser.assignedClass}
            </span>
            <span>
              Menampilkan penilaian dan narasi capaian ekstrakurikuler siswa binaan <strong>Kelas {currentUser.assignedClass}</strong> untuk diintegrasikan ke buku rapor semester.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedClass('all')}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline shrink-0 ml-3"
          >
            {selectedClass === 'all' ? `Filter Kelas ${currentUser.assignedClass}` : 'Lihat Seluruh Kelas'}
          </button>
        </div>
      )}

      {currentUser.role === 'pembina' && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md font-bold bg-blue-200 text-blue-900 text-[11px]">
              Instrumen Penilaian Pembina
            </span>
            <span>
              Penilaian capaian kompetensi anggota cabang binaan Anda. Predikat dan narasi capaian akan otomatis diteruskan ke wali kelas.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedEkskul('all')}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline shrink-0 ml-3"
          >
            {selectedEkskul === 'all' ? 'Filter Cabang Saya' : 'Lihat Seluruh Cabang'}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Penilaian Akhir Semester & Rapor
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
              Konversi Rapor
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kompilasi predikat (A/B/C/D), narasi capaian kompetensi otomatis, dan integrasi e-Rapor
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRegenerateAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Generate Ulang Narasi</span>
          </button>

          <button
            onClick={handleExportRapor}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Format Rapor (Excel)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa atau NIS..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="all">Semua Kelas ({students.length})</option>
            {availableClassNames.map((c) => {
              const count = students.filter((s) => s.class === c).length;
              return (
                <option key={c} value={c}>
                  Kelas {c} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <select
            value={selectedEkskul}
            onChange={(e) => setSelectedEkskul(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="all">Semua Ekstrakurikuler</option>
            {extracurriculars.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Evaluation / Rapor Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Daftar Nilai & Narasi Capaian Rapor Siswa
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Semester Ganjil &bull; T.A. 2025/2026
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredStudents.map((std, idx) => {
            const ekskuls = std.ekskulIds
              .map((id) => extracurriculars.find((e) => e.id === id))
              .filter(Boolean);

            const gradeLetter =
              std.category === 'Sangat Baik'
                ? 'A'
                : std.category === 'Baik'
                ? 'B'
                : std.category === 'Cukup'
                ? 'C'
                : 'D';

            return (
              <div key={std.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{std.name}</span>
                        <span className="text-xs font-mono text-slate-400">({std.nis})</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Kelas {std.class} &bull; Ekskul: {ekskuls.map((e) => e?.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Presensi</span>
                      <span className="font-bold text-slate-800">{std.attendanceRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Skor Rata-rata</span>
                      <span className="font-bold text-blue-700">{std.overallScore.toFixed(2)}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-slate-400 block text-[10px]">Nilai Rapor</span>
                      <span
                        className={`inline-block px-3 py-0.5 rounded-lg font-black text-sm ${
                          gradeLetter === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : gradeLetter === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {gradeLetter}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editable automated narration text */}
                <div className="mt-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Deskripsi Capaian Kompetensi Rapor (Dapat Disesuaikan):
                  </label>
                  <textarea
                    rows={2}
                    value={descriptions[std.id] || ''}
                    onChange={(e) => handleUpdateDescription(std.id, e.target.value)}
                    className="w-full p-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all leading-relaxed"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
