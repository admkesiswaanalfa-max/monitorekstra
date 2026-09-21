import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartHandshake,
  Plus,
  Search,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  BookMarked,
} from 'lucide-react';
import { DoaModal } from './DoaModal';

export const DoaMonitoringView: React.FC = () => {
  const {
    students,
    doaRecords,
    masterDoaList,
    setSelectedStudentId,
    setCurrentView,
    classes,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'katalog'>('monitoring');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStudentId, setModalStudentId] = useState<string | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm);
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, searchTerm]);

  // Statistics
  const completedDoaCount = students.filter((s) => s.doaMasteredCount >= 20).length;
  const avgDoa = (
    students.reduce((acc, s) => acc + s.doaMasteredCount, 0) / Math.max(students.length, 1)
  ).toFixed(1);

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
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-700/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 text-amber-300 text-xs font-bold mb-2">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Kurikulum Hafalan Doa Harian SMP</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Monitoring Hafalan Doa Harian Santri
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
              Target penguasaan 20 doa harian esensial islami dengan lafaz fashih, tartil, dan pemahaman arti untuk pembiasaan ibadah sehari-hari.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenInput()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-extrabold shadow-lg transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Setoran Doa Harian</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Cards Inside Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-amber-700/60">
          <div className="bg-amber-950/50 p-3.5 rounded-2xl border border-amber-700/50">
            <span className="text-[11px] text-amber-200 font-semibold block">Total Materi Doa</span>
            <span className="text-2xl font-extrabold text-amber-300">20 Doa Wajib</span>
            <span className="text-[10px] text-amber-200/80 block mt-0.5">Katalog terstandarisasi</span>
          </div>

          <div className="bg-amber-950/50 p-3.5 rounded-2xl border border-amber-700/50">
            <span className="text-[11px] text-amber-200 font-semibold block">Rata-rata Penguasaan</span>
            <span className="text-2xl font-extrabold text-white">{avgDoa} / 20 Doa</span>
            <span className="text-[10px] text-amber-200/80 block mt-0.5">
              {Math.round((parseFloat(avgDoa) / 20) * 100)}% ketuntasan siswa
            </span>
          </div>

          <div className="bg-amber-950/50 p-3.5 rounded-2xl border border-amber-700/50">
            <span className="text-[11px] text-amber-200 font-semibold block">Siswa Khatam 20 Doa</span>
            <span className="text-2xl font-extrabold text-emerald-300">{completedDoaCount} Santri</span>
            <span className="text-[10px] text-amber-200/80 block mt-0.5">Lulus seluruh doa wajib</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'monitoring'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Daftar Monitoring Siswa ({filteredStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('katalog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'katalog'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Katalog Teks 20 Doa Harian (Arab & Terjemah)
        </button>
      </div>

      {/* View 1: Monitoring Siswa */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari nama siswa atau NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Filter Kelas:</span>
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
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3 text-center">Kelas</th>
                    <th className="py-3 px-4">Jumlah Doa Dikuasai</th>
                    <th className="py-3 px-4">Progress Hafalan</th>
                    <th className="py-3 px-4 text-center">Setoran Terakhir</th>
                    <th className="py-3 px-3 text-center">Status Doa</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        Tidak ada data siswa yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const pct = Math.round((s.doaMasteredCount / 20) * 100);
                      const lastDoa = doaRecords.find((r) => r.studentId === s.id);
                      return (
                        <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-200"
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
                            <span className="text-sm font-extrabold text-amber-900">
                              {s.doaMasteredCount}
                            </span>
                            <span className="text-xs text-slate-400"> / 20 Doa</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                              <span>{pct}% Selesai</span>
                            </div>
                            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="text-[11px] font-mono text-slate-700 font-bold">
                              {lastDoa ? lastDoa.tanggal : s.lastSubmissionDate}
                            </div>
                            <span className="text-[10px] text-amber-800 truncate block max-w-[120px] mx-auto">
                              {lastDoa ? lastDoa.namaDoa : 'Doa Harian'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                s.doaMasteredCount >= 20
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : s.doaMasteredCount >= 10
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {s.doaMasteredCount >= 20 ? 'KHATAM 20' : `${s.doaMasteredCount} HAFAL`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenInput(s.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors"
                              >
                                + Setor
                              </button>
                              <button
                                onClick={() => handleViewDetail(s.id)}
                                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                                title="Lihat Rekap Lengkap"
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
        </div>
      )}

      {/* View 2: Katalog Teks 20 Doa Harian */}
      {activeTab === 'katalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {masterDoaList.map((doa) => (
            <div
              key={doa.id}
              className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-amber-50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    {doa.id}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">{doa.nama}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {doa.kategori}
                </span>
              </div>

              {/* Arabic */}
              <div className="p-3 bg-amber-50/40 rounded-xl">
                <p className="text-right text-lg sm:text-xl font-serif text-emerald-950 leading-loose" dir="rtl">
                  {doa.arab}
                </p>
              </div>

              {/* Transliteration */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lafaz Latin:
                </span>
                <p className="text-xs font-semibold text-amber-950 italic mt-0.5">
                  "{doa.latin}"
                </p>
              </div>

              {/* Translation */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Artinya:
                </span>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {doa.arti}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Doa Modal */}
      <DoaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedStudentId={modalStudentId}
      />
    </div>
  );
};
