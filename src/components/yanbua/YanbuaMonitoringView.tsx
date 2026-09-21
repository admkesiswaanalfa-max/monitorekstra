import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { YanbuaLevel } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ChevronRight,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import { YanbuaModal } from './YanbuaModal';

export const YanbuaMonitoringView: React.FC = () => {
  const {
    students,
    yanbuaRecords,
    setSelectedStudentId,
    setCurrentView,
    classes,
  } = useApp();

  const [selectedJilid, setSelectedJilid] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStudentId, setModalStudentId] = useState<string | null>(null);

  const jilidList: YanbuaLevel[] = [
    'Jilid 1',
    'Jilid 2',
    'Jilid 3',
    'Jilid 4',
    'Jilid 5',
    'Jilid 6',
    'Jilid 7',
    "Al-Qur'an",
  ];

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchJilid = selectedJilid === 'all' || s.yanbuaJilid === selectedJilid;
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm);
      return matchJilid && matchClass && matchSearch;
    });
  }, [students, selectedJilid, selectedClass, searchTerm]);

  const handleOpenInput = (studentId?: string) => {
    setModalStudentId(studentId || null);
    setIsModalOpen(true);
  };

  const handleViewStudentRecap = (studentId: string) => {
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
              <BookOpen className="w-3.5 h-3.5" />
              <span>Metode Thoriqoh Yanbu'a</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Monitoring Setoran Ngaji Jilid Yanbu'a
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
              Pantau perkembangan kelancaran makhraj, tajwid, dan kenaikan jilid santri dari Jilid 1 hingga siap membaca Al-Qur'an secara tartil.
            </p>
          </div>

          <button
            onClick={() => handleOpenInput()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-extrabold shadow-lg transition-all hover:scale-102 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Setoran Yanbu'a</span>
          </button>
        </div>

        {/* Visual Stepper Jilid 1 - 7 -> Al-Qur'an */}
        <div className="mt-6 pt-5 border-t border-emerald-800/80">
          <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
            Tingkatan Kurikulum Yanbu'a (Klik untuk filter):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {jilidList.map((lvl, idx) => {
              const count = students.filter((s) => s.yanbuaJilid === lvl).length;
              const isSelected = selectedJilid === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedJilid(isSelected ? 'all' : lvl)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-emerald-950 font-bold border-amber-300 shadow-md scale-102'
                      : 'bg-emerald-900/50 hover:bg-emerald-800/60 border-emerald-700/50 text-emerald-100'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    Tahap {idx + 1}
                  </div>
                  <div className="text-xs font-extrabold mt-0.5 truncate">{lvl}</div>
                  <div className="text-[11px] mt-1 font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 text-amber-300">
                      {count} Siswa
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari siswa atau NIS..."
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

          {/* Jilid Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Jilid:</span>
            <select
              value={selectedJilid}
              onChange={(e) => setSelectedJilid(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Jilid</option>
              {jilidList.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {selectedJilid !== 'all' && (
            <button
              onClick={() => setSelectedJilid('all')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline px-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Monitoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Daftar Perkembangan Santri Yanbu'a
            </h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredStudents.length} siswa sesuai kriteria
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {students.filter((s) => s.yanbuaJilid === "Al-Qur'an").length} Telah Lulus ke Al-Qur'an
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Kelas</th>
                <th className="py-3 px-4">Posisi Jilid & Halaman</th>
                <th className="py-3 px-4">Progress Yanbu'a</th>
                <th className="py-3 px-4 text-center">Setoran Terakhir</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Tidak ada data siswa yang cocok dengan filter jilid/kelas.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  // Find last Yanbua submission
                  const lastRec = yanbuaRecords.find((r) => r.studentId === s.id);
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
                          {s.yanbuaJilid} &bull; Halaman {s.yanbuaHalaman}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {s.yanbuaJilid === "Al-Qur'an" ? 'Telah naik ke Mushaf Al-Qur\'an' : `Buku Metode Yanbu'a`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Progress Tingkatan</span>
                          <span className="text-emerald-700">{s.yanbuaProgressPct}%</span>
                        </div>
                        <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-300"
                            style={{ width: `${s.yanbuaProgressPct}%` }}
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
                            s.statusSetoranHariIni === 'LULUS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.statusSetoranHariIni === 'MENGULANG'
                              ? 'bg-rose-100 text-rose-800'
                              : s.statusSetoranHariIni === 'DALAM BIMBINGAN'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {s.statusSetoranHariIni}
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
                            onClick={() => handleViewStudentRecap(s.id)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="Lihat Riwayat Lengkap"
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

      {/* Yanbua Input Modal */}
      <YanbuaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preselectedStudentId={modalStudentId}
      />
    </div>
  );
};
