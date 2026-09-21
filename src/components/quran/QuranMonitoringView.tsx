import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookMarked,
  Plus,
  Search,
  Filter,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { QuranModal } from './QuranModal';

export const QuranMonitoringView: React.FC = () => {
  const {
    students,
    quranRecords,
    setSelectedStudentId,
    setCurrentView,
    classes,
  } = useApp();

  const [selectedJuz, setSelectedJuz] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStudentId, setModalStudentId] = useState<string | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchJuz = selectedJuz === 'all' || s.quranJuz.toString() === selectedJuz;
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm) ||
        s.quranSurah.toLowerCase().includes(searchTerm.toLowerCase());
      return matchJuz && matchClass && matchSearch;
    });
  }, [students, selectedJuz, selectedClass, searchTerm]);

  // Aggregate stats
  const totalAyatAll = students.reduce((acc, s) => acc + s.quranAyatCount, 0);
  const avgAyat = Math.round(totalAyatAll / Math.max(students.length, 1));
  const completedTargetCount = students.filter((s) => s.quranAyatCount >= 564).length;

  const handleOpenInput = (studentId?: string) => {
    setModalStudentId(studentId || null);
    setIsModalOpen(true);
  };

  const handleViewDetail = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView('student_recap');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Program Tahfidzul Qur'an</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Monitoring Hafalan Al-Qur'an Santri
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
              Target pencapaian hafalan Al-Qur'an (Prioritas Juz 30 / Juz 'Amma: 564 ayat) dengan tajwid tartil, mutqin, dan mutaba'ah berkala.
            </p>
          </div>

          <button
            onClick={() => handleOpenInput()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-extrabold shadow-lg transition-all hover:scale-102 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Setoran Al-Qur'an</span>
          </button>
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-emerald-800/80">
          <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-200 font-semibold block">Total Akumulasi Ayat Dihafal</span>
            <span className="text-2xl font-extrabold text-amber-300">{totalAyatAll.toLocaleString()} Ayat</span>
            <span className="text-[10px] text-emerald-300/80 block mt-0.5">Dari seluruh santri aktif</span>
          </div>

          <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-200 font-semibold block">Rata-rata Ayat Santri</span>
            <span className="text-2xl font-extrabold text-white">{avgAyat} Ayat</span>
            <span className="text-[10px] text-emerald-300/80 block mt-0.5">
              Target Juz 30: 564 Ayat
            </span>
          </div>

          <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-700/50">
            <span className="text-[11px] text-emerald-200 font-semibold block">Khatam Juz 30 Mutqin</span>
            <span className="text-2xl font-extrabold text-emerald-300">{completedTargetCount} Santri</span>
            <span className="text-[10px] text-emerald-300/80 block mt-0.5">Siap naik ke Juz 29</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama siswa, NIS, atau nama surah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  Kelas {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Juz Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Juz:</span>
            <select
              value={selectedJuz}
              onChange={(e) => setSelectedJuz(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Juz</option>
              <option value="30">Juz 30 (Juz 'Amma)</option>
              <option value="29">Juz 29 (Tabarak)</option>
              <option value="1">Juz 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Daftar Progres Hafalan Al-Qur'an Siswa
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredStudents.length} siswa sesuai kriteria
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            Target Standar: Juz 30 (564 Ayat)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Kelas</th>
                <th className="py-3 px-4">Surat & Ayat Terakhir</th>
                <th className="py-3 px-3 text-center">Juz</th>
                <th className="py-3 px-4">Progress Juz 30 (564 Ayat)</th>
                <th className="py-3 px-4 text-center">Setoran Terakhir</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    Tidak ada data siswa yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const pct = Math.min(100, Math.round((s.quranAyatCount / 564) * 100));
                  const lastRec = quranRecords.find((r) => r.studentId === s.id);
                  return (
                    <tr key={s.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{s.name}</span>
                            <span className="text-[10px] text-slate-400">NIS: {s.nis}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                          {s.class}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-emerald-900 text-xs">
                          {s.quranSurah}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Total {s.quranAyatCount} ayat dihafal
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                          Juz {s.quranJuz}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>{s.quranAyatCount} / 564 Ayat</span>
                          <span className="text-emerald-700">{pct}%</span>
                        </div>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="text-[11px] font-mono text-slate-700 font-bold">
                          {lastRec ? lastRec.tanggal : s.lastSubmissionDate}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {lastRec ? `Nilai: ${lastRec.nilai}` : 'Tercatat'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.quranAyatCount >= 564
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.statusSetoranHariIni === 'LULUS'
                              ? 'bg-teal-100 text-teal-800'
                              : s.statusSetoranHariIni === 'MENGULANG'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.quranAyatCount >= 564 ? 'TUNTAS JUZ 30' : s.statusSetoranHariIni}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenInput(s.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors"
                          >
                            + Setor
                          </button>
                          <button
                            onClick={() => handleViewDetail(s.id)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Lihat Rekap Siswa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quran Modal */}
      <QuranModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedStudentId={modalStudentId}
      />
    </div>
  );
};
