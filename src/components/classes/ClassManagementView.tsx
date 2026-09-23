import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { getAvailableClassNames, getWaliKelasForClass } from '../../utils/classUtils';
import {
  GraduationCap,
  Users,
  Search,
  Printer,
  Download,
  Award,
  BookOpen,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Building,
  Settings,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ClassManagementView: React.FC = () => {
  const {
    students,
    extracurriculars,
    schoolInfo,
    currentUser,
    setSelectedStudentDetailId,
    showToast,
    classes,
    setCurrentView,
  } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const classList = useMemo(() => {
    return availableClassNames.map((clsName) => {
      const matched = classes.find((c) => c.name === clsName);
      return {
        id: matched?.id || `cls-${clsName.toLowerCase()}`,
        name: clsName,
        wali: matched?.waliKelas || getWaliKelasForClass(clsName, classes),
        grade: matched?.grade || (clsName.startsWith('VII') ? '7' : clsName.startsWith('VIII') ? '8' : clsName.startsWith('IX') ? '9' : '7'),
        room: matched?.room || 'Ruang Kelas',
        capacity: matched?.capacity || 32,
        rombelCode: matched?.rombelCode,
        status: matched?.status || 'Aktif',
      };
    });
  }, [availableClassNames, classes]);

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return availableClassNames[0] || 'VII-A';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Current selected class info
  const currentClassInfo = useMemo(() => {
    return classList.find((c) => c.name === selectedClass) || classList[0];
  }, [selectedClass]);

  // Students in selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.class === selectedClass);
  }, [students, selectedClass]);

  // Filtered by search
  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.nis.includes(q) ||
        (s.nisn && s.nisn.includes(q))
      );
    });
  }, [classStudents, searchQuery]);

  // Class KPI calculations
  const totalStudents = classStudents.length;
  const avgAttendance = totalStudents
    ? (classStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalStudents).toFixed(1)
    : '0';
  const avgScore = totalStudents
    ? (classStudents.reduce((acc, s) => acc + (s.overallScore || 0), 0) / totalStudents).toFixed(1)
    : '0';

  const totalEnrollments = classStudents.reduce(
    (acc, s) => acc + (s.ekskulIds ? s.ekskulIds.length : 0),
    0
  );

  // Distribution of extracurriculars in this class
  const ekskulDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    classStudents.forEach((s) => {
      (s.ekskulIds || []).forEach((eId) => {
        counts[eId] = (counts[eId] || 0) + 1;
      });
    });
    return extracurriculars
      .map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        count: counts[e.id] || 0,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [classStudents, extracurriculars]);

  // Export Excel
  const handleExportExcel = () => {
    const data = filteredStudents.map((s, idx) => {
      const ekskulNames = (s.ekskulIds || [])
        .map((id) => extracurriculars.find((e) => e.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      return {
        No: idx + 1,
        NIS: s.nis,
        NISN: s.nisn || '-',
        'Nama Siswa': s.name,
        Kelas: s.class,
        'Wali Kelas': currentClassInfo.wali,
        'Ekstrakurikuler Diikuti': ekskulNames || 'Belum Terdaftar',
        'Tingkat Kehadiran (%)': s.attendanceRate,
        'Nilai Akhir': s.overallScore,
        Kategori: s.category,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Kelas ${selectedClass}`);
    XLSX.writeFile(workbook, `Rekap_Ekskul_Kelas_${selectedClass}_${new Date().toISOString().slice(0, 10)}.xlsx`);

    showToast('Export Berhasil', `Data kelas ${selectedClass} berhasil diunduh dalam format Excel.`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Print Official Header */}
      <div className="hidden print:block mb-4">
        <OfficialLetterhead readOnly />
        <div className="text-center mt-3 pb-2 border-b border-slate-300">
          <h2 className="text-base font-black uppercase text-slate-900">
            REKAPITULASI PARTISIPASI EKSTRAKURIKULER KELAS {selectedClass}
          </h2>
          <p className="text-xs font-semibold text-emerald-800 uppercase mt-0.5">
            TAHUN PELAJARAN {schoolInfo.academicYear} &bull; SEMESTER {schoolInfo.semester || 'GANJIL'}
          </p>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Manajemen Rombel & Kelas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Data Kelas & Rombongan Belajar
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Pantau sebaran siswa dan partisipasi ekstrakurikuler berdasarkan kelas, rombel, dan bimbingan wali kelas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentView('settings')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold border border-emerald-500/40 shadow-md transition-all cursor-pointer"
            title="Buka Pengaturan Data Rombel Kelas"
          >
            <Settings className="w-4 h-4 text-emerald-200" />
            <span>Pengaturan Rombel</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Class Switcher Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
        {classList.map((cls) => {
          const count = students.filter((s) => s.class === cls.name).length;
          const isSelected = selectedClass === cls.name;
          return (
            <button
              key={cls.name}
              onClick={() => setSelectedClass(cls.name)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white border-emerald-700 shadow-lg ring-2 ring-amber-400/50'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Tingkat {cls.grade}
                </span>
                <Users className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
              </div>
              <h3 className="text-lg font-black mt-2 leading-tight">Kelas {cls.name}</h3>
              <p className={`text-[11px] truncate mt-1 ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                {cls.wali}
              </p>
              <div className="mt-2 text-xs font-extrabold flex items-center justify-between">
                <span className={isSelected ? 'text-white' : 'text-emerald-800'}>
                  {count} Siswa
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Class Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print:shadow-none print:border-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Wali Kelas
            </span>
            <p className="text-base font-extrabold text-emerald-950 mt-1">
              {currentClassInfo.wali}
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">Ruang: {currentClassInfo.room}</p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Jumlah Siswa
            </span>
            <p className="text-2xl font-black text-blue-950 mt-1">{totalStudents} Siswa</p>
            <p className="text-xs text-blue-700 mt-0.5">{totalEnrollments} Total Keikutsertaan Ekskul</p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Rata-rata Presensi
            </span>
            <p className="text-2xl font-black text-amber-950 mt-1">{avgAttendance}%</p>
            <p className="text-xs text-amber-700 mt-0.5">Kehadiran Kegiatan</p>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-100">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
              Rata-rata Nilai
            </span>
            <p className="text-2xl font-black text-purple-950 mt-1">{avgScore}</p>
            <p className="text-xs text-purple-700 mt-0.5">Predikat Perkembangan</p>
          </div>
        </div>
      </div>

      {/* Ekskul Distribution Badges in this class */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print:hidden">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-700" />
          Distribusi Ekstrakurikuler yang Diikuti Siswa Kelas {selectedClass}
        </h4>
        <div className="flex flex-wrap gap-2">
          {ekskulDistribution.map((item) => (
            <div
              key={item.id}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center gap-2"
            >
              <span className="font-bold text-slate-800">{item.name}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold">
                {item.count} siswa
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari siswa di kelas ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Menampilkan {filteredStudents.length} dari {totalStudents} Siswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-4">NIS / NISN</th>
                <th className="py-3 px-4">Ekstrakurikuler yang Diikuti</th>
                <th className="py-3 px-4 text-center">Presensi</th>
                <th className="py-3 px-4 text-center">Nilai</th>
                <th className="py-3 px-4 text-center">Kategori</th>
                <th className="py-3 px-4 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Tidak ada data siswa ditemukan untuk kelas ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const studentEkskuls = (std.ekskulIds || [])
                    .map((id) => extracurriculars.find((e) => e.id === id))
                    .filter(Boolean);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 print:hidden"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {std.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        <div>{std.nis}</div>
                        {std.nisn && <div className="text-[10px] text-slate-400">{std.nisn}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {studentEkskuls.length > 0 ? (
                            studentEkskuls.map((e) => (
                              <span
                                key={e?.id}
                                className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold"
                              >
                                {e?.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Belum mendaftar
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            (std.attendanceRate || 0) >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : (std.attendanceRate || 0) >= 75
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {std.attendanceRate || 0}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-extrabold text-slate-900">
                        {std.overallScore || 0}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            std.category === 'Sangat Baik'
                              ? 'bg-emerald-100 text-emerald-800'
                              : std.category === 'Baik'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {std.category || 'Baik'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center print:hidden">
                        <button
                          onClick={() => setSelectedStudentDetailId(std.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all cursor-pointer"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Signatures for Print */}
      <div className="hidden print:block mt-8 pt-4 border-t border-slate-300">
        <div className="grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster || 'Afif Mashadi, S.S.'}</p>
            <p className="text-[11px] text-slate-600">NIP. {schoolInfo.headmasterNip || '19780512 200501 1 007'}</p>
          </div>
          <div>
            <p className="text-slate-600">
              {schoolInfo.district || 'Wonosobo'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold text-slate-900 mt-0.5">Wali Kelas {selectedClass}</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{currentClassInfo.wali}</p>
            <p className="text-[11px] text-slate-600">NIP / NUPTK Guru</p>
          </div>
        </div>
      </div>
    </div>
  );
};
