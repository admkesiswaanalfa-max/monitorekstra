import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  TrendingUp,
  Award,
  Users,
  Trophy,
  AlertTriangle,
  ClipboardCheck,
  Star,
  Download,
  FileSpreadsheet,
  ChevronRight,
  ArrowUpRight,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

interface KepalaSekolahDashboardProps {
  onPrint?: () => void;
}

export const KepalaSekolahDashboard: React.FC<KepalaSekolahDashboardProps> = ({ onPrint }) => {
  const { students, extracurriculars, achievements, coaches, setCurrentView, setSelectedStudentDetailId } = useApp();

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Aktif').length;
  const participationRate = ((activeStudents / totalStudents) * 100).toFixed(1);

  const avgAttendance = (
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (totalStudents || 1)
  ).toFixed(1);

  const avgDevelopment = (
    students.reduce((acc, s) => acc + s.overallScore, 0) / (totalStudents || 1)
  ).toFixed(2);

  const totalAchievements = achievements.length;

  // Comparison data between extracurriculars
  const ekskulComparisonData = extracurriculars.map((e) => {
    const members = students.filter((s) => s.ekskulIds.includes(e.id));
    const memberCount = members.length;
    const avgScore = memberCount > 0
      ? Number((members.reduce((acc, m) => acc + m.overallScore, 0) / memberCount).toFixed(2))
      : 0;
    const avgAtt = memberCount > 0
      ? Number((members.reduce((acc, m) => acc + m.attendanceRate, 0) / memberCount).toFixed(1))
      : 0;
    const achCount = achievements.filter((a) => a.ekskulId === e.id).length;

    return {
      name: e.name.length > 10 ? e.name.slice(0, 9) + '..' : e.name,
      fullName: e.name,
      skorPerkembangan: avgScore,
      kehadiran: avgAtt,
      prestasi: achCount,
      peserta: memberCount,
    };
  });

  // Most active and best progress ekskul
  const sortedByScore = [...ekskulComparisonData].sort((a, b) => b.skorPerkembangan - a.skorPerkembangan);
  const bestProgressEkskul = sortedByScore[0];

  const sortedByAttendance = [...ekskulComparisonData].sort((a, b) => b.kehadiran - a.kehadiran);
  const mostActiveEkskul = sortedByAttendance[0];

  // Students requiring attention
  const studentsNeedingAttention = students.filter(
    (s) => s.category === 'Perlu Pembinaan' || s.attendanceRate < 75
  );

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-lg border border-emerald-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            Panel Analitik Eksekutif Pimpinan Sekolah
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Tinjauan Strategis & Evaluasi Mutu Ekstrakurikuler
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Laporan analitis capaian kompetensi non-akademik, pembinaan karakter, dan pencapaian prestasi SMP Alfa Ali Masykur T.A. 2025/2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onPrint && (
            <button
              type="button"
              id="btn-banner-print-kepsek"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20 shadow-xs cursor-pointer"
              title="Cetak Halaman Dasbor"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>Cetak Dasbor</span>
            </button>
          )}
          <button
            onClick={() => setCurrentView('reports')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-900/40 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Buka Laporan Lengkap</span>
          </button>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Partisipasi Siswa</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{participationRate}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">{activeStudents} dari {totalStudents} Siswa</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rerata Presensi</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{avgAttendance}%</p>
          <span className="text-[11px] text-blue-600 font-medium">Semester Berjalan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rerata Kompetensi</span>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{avgDevelopment} <span className="text-xs text-slate-400">/ 4.0</span></p>
          <span className="text-[11px] text-emerald-600 font-medium">Predikat Sangat Baik</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Prestasi</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{totalAchievements}</p>
          <span className="text-[11px] text-amber-700 font-medium">Tingkat Kota sd Nas.</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Perlu Atensi</span>
          <p className="text-2xl font-bold text-rose-600 mt-2">{studentsNeedingAttention.length}</p>
          <span className="text-[11px] text-rose-500 font-medium">Butuh Bimbingan</span>
        </div>
      </div>

      {/* Highlights: Ekskul Paling Aktif & Perkembangan Terbaik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Ekstrakurikuler Paling Aktif</span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">{mostActiveEkskul?.fullName || 'Pramuka'}</h4>
            <p className="text-xs text-slate-600 mt-1">
              Rata-rata presensi: <strong className="text-blue-700">{mostActiveEkskul?.kehadiran}%</strong> &bull; {mostActiveEkskul?.peserta} Siswa
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Perkembangan Kompetensi Terbaik</span>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">{bestProgressEkskul?.fullName || 'Tahfidz'}</h4>
            <p className="text-xs text-slate-600 mt-1">
              Skor rata-rata: <strong className="text-emerald-700">{bestProgressEkskul?.skorPerkembangan} / 4.0</strong> &bull; {bestProgressEkskul?.prestasi} Prestasi
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Star className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Comparison Chart: Perkembangan dan Kehadiran Antar Ekstrakurikuler */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Grafik Komparasi Rata-rata Skor Perkembangan Antar Ekstrakurikuler
            </h3>
            <p className="text-xs text-slate-400">Skor evaluasi kompetensi pada seluruh 12 ekstrakurikuler (skala 1 - 4)</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ekskulComparisonData} margin={{ top: 15, right: 15, left: -20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val: any) => [`${val} / 4.00`, 'Skor Rerata']}
                labelFormatter={(label, payload) => payload[0]?.payload.fullName || label}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="skorPerkembangan" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two columns: Siswa Berprestasi Utama & Siswa Membutuhkan Atensi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Siswa Berprestasi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Siswa Berprestasi Unggul
            </h3>
            <span className="text-xs text-slate-400">{achievements.length} Penghargaan</span>
          </div>

          <div className="divide-y divide-slate-100">
            {achievements.slice(0, 4).map((ach) => (
              <div key={ach.id} className="py-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">{ach.studentName}</p>
                  <p className="text-[11px] text-slate-500">{ach.rank} &bull; {ach.competitionName}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    Tingkat {ach.level} ({ach.year})
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">{ach.ekskulName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Siswa Membutuhkan Atensi / Konseling */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-rose-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Siswa Membutuhkan Perhatian Khusus
            </h3>
            <span className="text-xs text-rose-600 font-semibold">{studentsNeedingAttention.length} Siswa</span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentsNeedingAttention.map((std) => (
              <div
                key={std.id}
                onClick={() => {
                  setSelectedStudentDetailId(std.id);
                  setCurrentView('students');
                }}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{std.name}</p>
                    <p className="text-[10px] text-slate-500">Kelas {std.class} &bull; Presensi: {std.attendanceRate}%</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  {std.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
