import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  UserCheck,
  ClipboardCheck,
  Trophy,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Plus,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface AdminDashboardProps {
  onPrint?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPrint }) => {
  const {
    students,
    extracurriculars,
    coaches,
    achievements,
    activityLogs,
    setCurrentView,
    setSelectedStudentDetailId,
  } = useApp();

  // KPI Calculations
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Aktif').length;
  const totalEkskul = extracurriculars.length;
  const totalCoaches = coaches.length;

  const avgAttendance = Number(
    (students.reduce((acc, curr) => acc + curr.attendanceRate, 0) / (totalStudents || 1)).toFixed(1)
  );

  const studentWithAchievementsCount = new Set(achievements.map((a) => a.studentId)).size;
  const veryGoodStudentsCount = students.filter((s) => s.category === 'Sangat Baik').length;
  const needAttentionCount = students.filter(
    (s) => s.category === 'Perlu Pembinaan' || s.attendanceRate < 75
  ).length;

  // Chart 1: Jumlah peserta setiap ekstrakurikuler
  const ekskulParticipantsData = extracurriculars.map((e) => {
    const count = students.filter((s) => s.ekskulIds.includes(e.id)).length;
    return {
      name: e.name.length > 12 ? e.name.slice(0, 11) + '..' : e.name,
      fullName: e.name,
      peserta: count,
    };
  });

  // Chart 2: Rata-rata kehadiran bulanan
  const monthlyAttendanceData = [
    { month: 'Jul', rate: 91.2 },
    { month: 'Agt', rate: 92.8 },
    { month: 'Sep', rate: 94.1 },
    { month: 'Okt', rate: 93.6 },
    { month: 'Nov', rate: 95.0 },
  ];

  // Chart 3: Rata-rata Kompetensi Siswa (Radar)
  const avgCompetencyData = [
    {
      aspect: 'Keterampilan',
      score: Number((students.reduce((a, c) => a + c.competencies.keterampilan, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Pengetahuan',
      score: Number((students.reduce((a, c) => a + c.competencies.pengetahuan, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Kreativitas',
      score: Number((students.reduce((a, c) => a + c.competencies.kreativitas, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Kerjasama',
      score: Number((students.reduce((a, c) => a + c.competencies.kerjasama, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Disiplin',
      score: Number((students.reduce((a, c) => a + c.competencies.disiplin, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Tanggung Jwb',
      score: Number((students.reduce((a, c) => a + c.competencies.tanggungJawab, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Kepemimpinan',
      score: Number((students.reduce((a, c) => a + c.competencies.kepemimpinan, 0) / totalStudents).toFixed(2)),
    },
    {
      aspect: 'Sportivitas',
      score: Number((students.reduce((a, c) => a + c.competencies.sportivitas, 0) / totalStudents).toFixed(2)),
    },
  ];

  // Chart 4: Prestasi berdasarkan tingkat
  const achievementLevels = ['Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional'];
  const achievementLevelData = achievementLevels.map((lvl) => ({
    level: lvl,
    total: achievements.filter((a) => a.level === lvl).length,
  }));

  // Chart 5: Tren skor perkembangan siswa dari waktu ke waktu
  const developmentTrendData = [
    { bulan: 'Jul', rataRata: 3.28 },
    { bulan: 'Agt', rataRata: 3.44 },
    { bulan: 'Sep', rataRata: 3.56 },
    { bulan: 'Okt', rataRata: 3.65 },
    { bulan: 'Nov', rataRata: 3.71 },
  ];

  // Top 5 Best Students
  const topStudents = [...students]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sistem Informasi Ekstrakurikuler Terpadu
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              ALFA EXTRACURRICULAR MONITORING SYSTEM
            </h2>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Monitoring perkembangan kompetensi, keaktifan presensi, dan capaian prestasi peserta didik SMP Alfa Ali Masykur secara transparan dan akuntabel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onPrint && (
              <button
                type="button"
                id="btn-banner-print-admin"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors border border-white/20 shadow-xs cursor-pointer"
                title="Cetak Halaman Dasbor"
              >
                <Printer className="w-4 h-4 text-blue-200" />
                <span>Cetak Dasbor</span>
              </button>
            )}
            <button
              onClick={() => setCurrentView('attendance')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Input Kehadiran</span>
            </button>
            <button
              onClick={() => setCurrentView('development')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-semibold text-xs transition-colors shadow-xs"
            >
              <TrendingUp className="w-4 h-4 text-blue-700" />
              <span>Input Penilaian</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Siswa */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Siswa</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</p>
          <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            Terdaftar di sistem
          </span>
        </div>

        {/* Siswa Aktif */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Siswa Aktif Ekskul</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{activeStudents}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            {((activeStudents / totalStudents) * 100).toFixed(0)}% Partisipasi
          </span>
        </div>

        {/* Jumlah Ekstrakurikuler */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ekstrakurikuler</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalEkskul}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
            6 Bidang Peminatan
          </span>
        </div>

        {/* Jumlah Pembina */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Jumlah Pembina</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalCoaches}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
            Guru & Instruktur Ahli
          </span>
        </div>

        {/* Rata-rata Kehadiran */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-rata Kehadiran</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{avgAttendance}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(avgAttendance, 100)}%` }}
            />
          </div>
        </div>

        {/* Siswa Berprestasi */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Siswa Berprestasi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{studentWithAchievementsCount}</p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 inline-block">
            {achievements.length} Kejuaraan Diraih
          </span>
        </div>

        {/* Perkembangan Sangat Baik */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sangat Baik (A)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{veryGoodStudentsCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
            Kompetensi unggul
          </span>
        </div>

        {/* Perlu Pembinaan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Perlu Pembinaan</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{needAttentionCount}</p>
          <span className="text-[11px] text-rose-500 font-medium mt-1 inline-block">
            Perlu atensi pembina
          </span>
        </div>
      </div>

      {/* Row 1 Charts: Jumlah Peserta per Ekskul & Kehadiran Bulanan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Peserta Ekskul */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Distribusi Jumlah Peserta Ekstrakurikuler
              </h3>
              <p className="text-xs text-slate-400">Total anggota aktif tiap cabang kegiatan</p>
            </div>
            <button
              onClick={() => setCurrentView('extracurriculars')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
            >
              Lihat Ekskul <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ekskulParticipantsData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} Siswa`, 'Peserta']}
                  labelFormatter={(label, payload) => payload[0]?.payload.fullName || label}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="peserta" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Kehadiran Bulanan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Rata-rata Kehadiran Bulanan
              </h3>
              <p className="text-xs text-slate-400">Tren presensi semester ganjil (%)</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAttendanceData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Tingkat Kehadiran']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Radar Kompetensi, Prestasi per Tingkat, & Tren Nilai */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Radar Chart: 8 Indikator Kompetensi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Rata-rata Capaian Kompetensi
            </h3>
            <p className="text-xs text-slate-400">Profil 8 aspek kompetensi seluruh siswa (skala 1-4)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={avgCompetencyData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 10, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Radar name="Rata-rata Skor" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prestasi per Tingkat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Prestasi Berdasarkan Tingkat
              </h3>
              <p className="text-xs text-slate-400">Distribusi jenjang kompetisi yang dimenangkan</p>
            </div>
            <button
              onClick={() => setCurrentView('achievements')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Lihat
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={achievementLevelData} layout="vertical" margin={{ top: 10, right: 15, left: 25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis dataKey="level" type="category" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Prestasi`, 'Total']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="total" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tren Nilai Perkembangan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Tren Perkembangan Siswa
            </h3>
            <p className="text-xs text-slate-400">Kenaikan skor evaluasi bulanan</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={developmentTrendData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} / 4.00`, 'Rata-rata Skor']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="rataRata"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Aktivitas Terbaru & Siswa dengan Perkembangan Terbaik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Aktivitas Terbaru
              </h3>
              <p className="text-xs text-slate-400">Log pembina, penginputan nilai, dan catatan absensi</p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Real-time Feed
            </span>
          </div>

          <div className="space-y-3.5">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  {log.type === 'assessment' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : log.type === 'attendance' ? (
                    <ClipboardCheck className="w-4 h-4" />
                  ) : log.type === 'achievement' ? (
                    <Trophy className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {log.user} <span className="text-[11px] font-normal text-slate-500">({log.role})</span>
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{log.description}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {log.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Siswa dengan Perkembangan Terbaik */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Siswa Berprestasi Tinggi
              </h3>
              <p className="text-xs text-slate-400">Skor evaluasi tertinggi bulan ini</p>
            </div>
            <button
              onClick={() => setCurrentView('students')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center"
            >
              Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topStudents.map((std, idx) => {
              const ekskulNames = std.ekskulIds
                .map((id) => extracurriculars.find((e) => e.id === id)?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <div
                  key={std.id}
                  onClick={() => {
                    setSelectedStudentDetailId(std.id);
                    setCurrentView('students');
                  }}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={std.avatar}
                        alt={std.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center ring-1 ring-white">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{std.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        Kelas {std.class} &bull; {ekskulNames || 'Ekskul'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-blue-700">{std.overallScore.toFixed(2)}</div>
                    <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {std.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
