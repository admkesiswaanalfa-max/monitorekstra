import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Calendar,
  Users,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  Trophy,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Printer,
} from 'lucide-react';

interface PembinaDashboardProps {
  onPrint?: () => void;
}

export const PembinaDashboard: React.FC<PembinaDashboardProps> = ({ onPrint }) => {
  const {
    currentUser,
    students,
    extracurriculars,
    achievements,
    assessments,
    setCurrentView,
    setSelectedStudentDetailId,
  } = useApp();

  // Determine coach's extracurricular
  const assignedEkskul =
    extracurriculars.find((e) => e.id === currentUser.assignedEkskulId) ||
    extracurriculars[0]; // fallback to Pramuka or first

  // Students in this coach's extracurricular
  const myStudents = students.filter((s) => s.ekskulIds.includes(assignedEkskul.id));

  // Students who have or haven't been assessed recently
  const unassessedStudents = myStudents.filter((s) => s.overallScore < 3.0 || !s.notesPembina);
  const needAttentionStudents = myStudents.filter(
    (s) => s.category === 'Perlu Pembinaan' || s.attendanceRate < 80
  );

  // My ekskul's achievements
  const myAchievements = achievements.filter((a) => a.ekskulId === assignedEkskul.id);

  const avgAttendance = myStudents.length > 0
    ? (myStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / myStudents.length).toFixed(1)
    : '0';

  const avgScore = myStudents.length > 0
    ? (myStudents.reduce((acc, s) => acc + s.overallScore, 0) / myStudents.length).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      {/* Pembina Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 border border-blue-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Portal Pembina Ekstrakurikuler
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {assignedEkskul.name}
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Pembina: <strong>{currentUser.name}</strong> &bull; NIP: {currentUser.nip || '-'}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-blue-100">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              {assignedEkskul.schedule}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {assignedEkskul.location}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons (Section 20 Requirement) */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {onPrint && (
            <button
              type="button"
              id="btn-banner-print-pembina"
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 shadow-md transition-colors cursor-pointer"
              title="Cetak Halaman Dasbor"
            >
              <Printer className="w-4 h-4 text-blue-200" />
              <span>Cetak Dasbor</span>
            </button>
          )}
          <button
            id="btn-quick-attendance"
            onClick={() => setCurrentView('attendance')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Input Kehadiran</span>
          </button>
          <button
            id="btn-quick-development"
            onClick={() => setCurrentView('development')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-semibold text-xs shadow-md transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Input Penilaian</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Siswa Binaan</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{myStudents.length} Siswa</p>
          <span className="text-[11px] text-blue-600 font-medium">Terdaftar aktif</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rerata Kehadiran</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{avgAttendance}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">Semester Ganjil</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rerata Perkembangan</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{avgScore} <span className="text-xs text-slate-400">/ 4.0</span></p>
          <span className="text-[11px] text-emerald-600 font-medium">Kategori Sangat Baik</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Prestasi Ekskul</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{myAchievements.length}</p>
          <span className="text-[11px] text-amber-700 font-medium">Trofi & Kejuaraan</span>
        </div>
      </div>

      {/* Siswa Belum Dinilai & Siswa Butuh Pembinaan Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Siswa Belum Dinilai */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Siswa Belum Mengisi Evaluasi Lengkap
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              {unassessedStudents.length} Siswa
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed mb-3">
            Pastikan seluruh aspek kompetensi dan sikap dinilai sebelum batas waktu pengisian nilai semester.
          </p>
          <button
            onClick={() => setCurrentView('development')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline inline-flex items-center gap-1"
          >
            Lakukan Penilaian Sekarang <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Siswa Membutuhkan Bimbingan */}
        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Siswa Membutuhkan Pembinaan Tambahan
            </span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
              {needAttentionStudents.length} Siswa
            </span>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed mb-3">
            Siswa dengan presensi di bawah 80% atau memerlukan bimbingan teknik dan disiplin ekstra.
          </p>
          <button
            onClick={() => setCurrentView('attendance')}
            className="text-xs font-bold text-rose-800 hover:text-rose-950 underline inline-flex items-center gap-1"
          >
            Cek Riwayat Presensi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Daftar Siswa Binaan Tabel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Daftar Siswa Binaan {assignedEkskul.name}
            </h3>
            <p className="text-xs text-slate-400">Status presensi dan skor kompetensi siswa</p>
          </div>
          <button
            onClick={() => setCurrentView('students')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Lihat di Database
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Siswa</th>
                <th className="py-2.5 px-3">NIS</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3">Kehadiran</th>
                <th className="py-2.5 px-3">Skor Perkembangan</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-slate-900">{std.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{std.nis}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{std.class}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{std.attendanceRate}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700">{std.overallScore.toFixed(2)}</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(std.overallScore / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                        std.category === 'Sangat Baik'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : std.category === 'Baik'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : std.category === 'Cukup'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {std.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudentDetailId(std.id);
                        setCurrentView('students');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-[11px] font-semibold transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
