import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getAvailableClassNames } from '../../utils/classUtils';
import {
  UserCheck,
  Users,
  Award,
  ClipboardCheck,
  TrendingUp,
  Trophy,
  Filter,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Printer,
} from 'lucide-react';

interface WaliKelasDashboardProps {
  onPrint?: () => void;
}

export const WaliKelasDashboard: React.FC<WaliKelasDashboardProps> = ({ onPrint }) => {
  const {
    currentUser,
    students,
    extracurriculars,
    achievements,
    setCurrentView,
    setSelectedStudentDetailId,
    classes,
  } = useApp();

  const classOptions = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  // Selected class (defaults to currentUser.assignedClass or first available class)
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (currentUser.assignedClass && currentUser.assignedClass.trim()) {
      return currentUser.assignedClass;
    }
    return classes && classes.length > 0 ? classes[0].name : 'VII-A';
  });

  // Filter students by chosen class
  const classStudents = students.filter((s) => s.class === selectedClass);

  // Class achievements
  const classAchievements = achievements.filter((a) =>
    classStudents.some((s) => s.id === a.studentId)
  );

  const avgClassAttendance = classStudents.length > 0
    ? (classStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / classStudents.length).toFixed(1)
    : '0';

  const avgClassScore = classStudents.length > 0
    ? (classStudents.reduce((acc, s) => acc + s.overallScore, 0) / classStudents.length).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      {/* Wali Kelas Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            Portal Wali Kelas
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Pemantauan Siswa Binaan Kelas {selectedClass}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Wali Kelas: <strong>{currentUser.name}</strong> &bull; Pantau partisipasi ekstrakurikuler, catatan karakter pembina, dan rekap nilai anak didik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onPrint && (
            <button
              type="button"
              id="btn-banner-print-walikelas"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 shadow-xs cursor-pointer transition-colors"
              title="Cetak Halaman Dasbor"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Dasbor</span>
            </button>
          )}

          {/* Class Selector Dropdown */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl backdrop-blur-xs border border-white/20">
            <span className="text-xs font-semibold text-amber-200 px-2">Ganti Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-800 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  Kelas {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Class KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Jumlah Siswa Kelas</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{classStudents.length} Siswa</p>
          <span className="text-[11px] text-blue-600 font-medium">Aktif terdaftar</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rata-rata Kehadiran</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgClassAttendance}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">Tingkat Keaktifan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rerata Nilai Karakter</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{avgClassScore} <span className="text-xs text-slate-400">/ 4.0</span></p>
          <span className="text-[11px] text-emerald-600 font-medium">Perkembangan Positif</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Prestasi Diraih</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{classAchievements.length}</p>
          <span className="text-[11px] text-amber-700 font-medium">Medali & Penghargaan</span>
        </div>
      </div>

      {/* Main Class Students Table with notes from coaches */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Rincian Ekstrakurikuler, Kehadiran, & Catatan Pembina Siswa Kelas {selectedClass}
            </h3>
            <p className="text-xs text-slate-400">Terintegrasi langsung dengan input catatan harian pembina</p>
          </div>
          <button
            onClick={() => setCurrentView('reports')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Cetak Rapor Ekstrakurikuler
          </button>
        </div>

        <div className="space-y-4">
          {classStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada data siswa untuk kelas {selectedClass}.
            </div>
          ) : (
            classStudents.map((std) => {
              const ekskuls = std.ekskulIds
                .map((id) => extracurriculars.find((e) => e.id === id))
                .filter(Boolean);

              const studentAchs = achievements.filter((a) => a.studentId === std.id);

              return (
                <div
                  key={std.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{std.name}</h4>
                        <p className="text-xs text-slate-500">
                          NIS: {std.nis} &bull; Wali: {std.parentName} ({std.parentPhone})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Skor & Presensi:</span>
                        <span className="text-xs font-bold text-slate-800">
                          {std.overallScore.toFixed(2)} / 4.0 &bull; {std.attendanceRate}%
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStudentDetailId(std.id);
                          setCurrentView('students');
                        }}
                        className="p-2 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors"
                        title="Lihat Profil Lengkap"
                      >
                        Detail
                      </button>
                    </div>
                  </div>

                  {/* Ekstrakurikuler yang diikuti */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Ekskul:</span>
                    {ekskuls.map((e) => (
                      <span
                        key={e?.id}
                        className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200"
                      >
                        {e?.name} <span className="text-slate-400 font-normal">({e?.coachName})</span>
                      </span>
                    ))}
                  </div>

                  {/* Prestasi jika ada */}
                  {studentAchs.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                      <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-medium">
                        <strong>Prestasi:</strong> {studentAchs.map((a) => `${a.rank} (${a.competitionName})`).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Catatan Pembina */}
                  <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-slate-200/80 text-xs flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-700">Catatan Pembina: </span>
                      <span className="text-slate-600 italic">
                        &ldquo;{std.notesPembina || 'Siswa menunjukkan partisipasi yang baik dan disiplin dalam mengikuti sesi latihan.'}&rdquo;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
