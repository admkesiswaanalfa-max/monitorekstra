import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  BookMarked,
  HeartHandshake,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  Search,
  Filter,
  Plus,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface NgajiDashboardProps {
  onOpenYanbuaModal: () => void;
  onOpenDoaModal: () => void;
  onOpenQuranModal: () => void;
}

export const NgajiDashboard: React.FC<NgajiDashboardProps> = ({
  onOpenYanbuaModal,
  onOpenDoaModal,
  onOpenQuranModal,
}) => {
  const {
    students,
    unifiedSetoran,
    schoolInfo,
    setCurrentView,
    setSelectedStudentId,
    markTodayAllSubmitted,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Statistics calculation
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Aktif').length;
  const submittedToday = students.filter((s) => s.statusSetoranHariIni === 'LULUS' || s.statusSetoranHariIni === 'MENGULANG').length;
  const unsubmittedToday = students.filter((s) => s.statusSetoranHariIni === 'BELUM SETOR').length;
  const passedYanbua = students.filter((s) => s.yanbuaJilid === "Al-Qur'an").length;
  const completedDoa = students.filter((s) => s.doaMasteredCount >= 20).length;
  const completedQuranTarget = students.filter((s) => s.quranAyatCount >= 564).length;
  const needAssistance = students.filter((s) => s.needAssistance || s.statusSetoranHariIni === 'DALAM BIMBINGAN' || s.statusSetoranHariIni === 'MENGULANG').length;

  // Recent submissions filtered
  const filteredSubmissions = unifiedSetoran.filter((sub) => {
    const matchType = filterType === 'all' || sub.jenisSetoran === filterType;
    const matchStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchType && matchStatus;
  });

  // Data for Mini Progress Yanbu'a Chart
  const yanbuaDistribution = [
    { name: 'Jld 1', count: students.filter((s) => s.yanbuaJilid === 'Jilid 1').length },
    { name: 'Jld 2', count: students.filter((s) => s.yanbuaJilid === 'Jilid 2').length },
    { name: 'Jld 3', count: students.filter((s) => s.yanbuaJilid === 'Jilid 3').length },
    { name: 'Jld 4', count: students.filter((s) => s.yanbuaJilid === 'Jilid 4').length },
    { name: 'Jld 5', count: students.filter((s) => s.yanbuaJilid === 'Jilid 5').length },
    { name: 'Jld 6', count: students.filter((s) => s.yanbuaJilid === 'Jilid 6').length },
    { name: 'Jld 7', count: students.filter((s) => s.yanbuaJilid === 'Jilid 7').length },
    { name: 'Quran', count: students.filter((s) => s.yanbuaJilid === "Al-Qur'an").length },
  ];

  // Setoran Ratio Chart
  const setoranRatioData = [
    { name: 'Sudah Setor', value: submittedToday, color: '#059669' },
    { name: 'Belum Setor', value: unsubmittedToday, color: '#94A3B8' },
    { name: 'Perlu Bimbingan', value: needAssistance, color: '#D97706' },
  ];

  const statCards = [
    {
      title: 'Total Siswa',
      value: totalStudents,
      subtext: 'Terdaftar di database',
      change: '+100% aktif',
      icon: Users,
      trend: 'up',
      color: 'from-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-200',
    },
    {
      title: 'Siswa Aktif',
      value: activeStudents,
      subtext: 'Mengikuti bimbingan',
      change: '100% partisipasi',
      icon: UserCheck,
      trend: 'up',
      color: 'from-teal-600 to-teal-700',
      bgColor: 'bg-teal-50 text-teal-700',
      border: 'border-teal-200',
    },
    {
      title: 'Sudah Setoran Hari Ini',
      value: submittedToday,
      subtext: `${Math.round((submittedToday / Math.max(totalStudents, 1)) * 100)}% dari total siswa`,
      change: '+14% vs kemarin',
      icon: CheckCircle2,
      trend: 'up',
      color: 'from-green-600 to-emerald-700',
      bgColor: 'bg-green-50 text-green-700',
      border: 'border-green-200',
      progress: Math.round((submittedToday / Math.max(totalStudents, 1)) * 100),
    },
    {
      title: 'Belum Setoran Hari Ini',
      value: unsubmittedToday,
      subtext: 'Menunggu antrean',
      change: '-5% vs kemarin',
      icon: Clock,
      trend: 'down',
      color: 'from-slate-600 to-slate-700',
      bgColor: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200',
    },
    {
      title: "Lulus Yanbu'a",
      value: passedYanbua,
      subtext: 'Naik ke tingkat Al-Qur\'an',
      change: '+18% semester ini',
      icon: Award,
      trend: 'up',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 text-amber-700',
      border: 'border-amber-200',
      progress: Math.round((passedYanbua / Math.max(totalStudents, 1)) * 100),
    },
    {
      title: 'Hafalan Doa Selesai',
      value: completedDoa,
      subtext: 'Khatam 20 doa harian',
      change: '+25% bulan ini',
      icon: HeartHandshake,
      trend: 'up',
      color: 'from-sky-600 to-blue-700',
      bgColor: 'bg-sky-50 text-sky-700',
      border: 'border-sky-200',
      progress: Math.round((completedDoa / Math.max(totalStudents, 1)) * 100),
    },
    {
      title: "Hafalan Al-Qur'an Tuntas",
      value: completedQuranTarget,
      subtext: 'Capai target Juz 30',
      change: '+12% semester ini',
      icon: BookMarked,
      trend: 'up',
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'bg-indigo-50 text-indigo-700',
      border: 'border-indigo-200',
      progress: Math.round((completedQuranTarget / Math.max(totalStudents, 1)) * 100),
    },
    {
      title: 'Siswa Perlu Pendampingan',
      value: needAssistance,
      subtext: 'Memerlukan murajaah privat',
      change: 'Perhatian khusus',
      icon: AlertCircle,
      trend: 'neutral',
      color: 'from-rose-600 to-rose-700',
      bgColor: 'bg-rose-50 text-rose-700',
      border: 'border-rose-200',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/60">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assalamu'alaikum Warahmatullahi Wabarakatuh 👋</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Monitoring Ngaji & Hafalan Siswa
            </h2>
            <p className="text-emerald-200 text-xs sm:text-sm font-medium mt-1 max-w-2xl leading-relaxed">
              SMP ALFA ALI MASYKUR &bull; Tahun Pelajaran {schoolInfo.academicYear} ({schoolInfo.semester}) &bull; Mojotengah, Wonosobo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenYanbuaModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-extrabold shadow-md transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Setoran Yanbu'a</span>
            </button>
            <button
              onClick={onOpenDoaModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold border border-emerald-500 shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Setoran Doa</span>
            </button>
            <button
              onClick={onOpenQuranModal}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-100 text-xs font-bold border border-emerald-700 shadow-sm transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Setoran Al-Qur'an</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 8 Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Statistik Monitoring Real-Time</span>
          </h3>
          <span className="text-xs text-slate-500">Update otomatis berdasarkan aktivitas setoran</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-4.5 border ${card.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 truncate">{card.title}</span>
                    <div className={`p-2 rounded-xl ${card.bgColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{card.value}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center">
                      {card.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {card.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
                      {card.change}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{card.subtext}</p>
                </div>

                {card.progress !== undefined && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Pencapaian</span>
                      <span>{card.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-500"
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Progress Overview: Yanbu'a, Doa, Quran */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Yanbua */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Progress Jilid Yanbu'a</h4>
            </div>
            <button
              onClick={() => setCurrentView('yanbua')}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Lihat Detail →
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Distribusi tingkatan jilid santri saat ini (Jilid 1 s/d Al-Qur'an)
          </p>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yanbuaDistribution} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Siswa`, 'Jumlah']}
                />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pillar 2: Doa Harian */}
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Hafalan Doa Harian</h4>
            </div>
            <button
              onClick={() => setCurrentView('doa')}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-bold"
            >
              Lihat Detail →
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Target 20 doa harian wajib SMP Alfa Ali Masykur
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Rata-rata Penguasaan Doa Siswa</span>
                <span className="text-emerald-700">14.8 / 20 Doa (74%)</span>
              </div>
              <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[11px] text-amber-800 font-semibold block">Khatam 20 Doa</span>
                <span className="text-lg font-bold text-slate-900">{completedDoa} Siswa</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-600 font-semibold block">Dalam Hafalan</span>
                <span className="text-lg font-bold text-slate-900">{totalStudents - completedDoa} Siswa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Tahfidz Quran */}
        <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Hafalan Al-Qur'an</h4>
            </div>
            <button
              onClick={() => setCurrentView('quran')}
              className="text-[11px] text-sky-700 hover:text-sky-900 font-bold"
            >
              Lihat Detail →
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-2">
            Status setoran harian & progress juz santri
          </p>

          <div className="flex items-center justify-around h-36">
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={setoranRatioData}
                    dataKey="value"
                    innerRadius={36}
                    outerRadius={52}
                    paddingAngle={3}
                  >
                    {setoranRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-slate-800 leading-none">{submittedToday}</span>
                <span className="text-[9px] text-slate-400">Setor Hari Ini</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600">Sudah Setor: <strong>{submittedToday}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-slate-600">Belum Setor: <strong>{unsubmittedToday}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-slate-600">Perlu Bimbingan: <strong>{needAssistance}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Aktivitas Setoran Terbaru */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              <span>Aktivitas Setoran Terbaru</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar rekam jejak setoran santri terkini secara real-time
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Jenis */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Jenis Setoran</option>
              <option value="Yanbu'a">Yanbu'a</option>
              <option value="Doa Harian">Doa Harian</option>
              <option value="Al-Qur'an">Al-Qur'an</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Status</option>
              <option value="LULUS">LULUS</option>
              <option value="MENGULANG">MENGULANG</option>
              <option value="BELUM SETOR">BELUM SETOR</option>
              <option value="DALAM BIMBINGAN">DALAM BIMBINGAN</option>
            </select>

            <button
              onClick={() => setCurrentView('today_setoran')}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
            >
              Buka Setoran Hari Ini
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-3 text-center">Kelas</th>
                <th className="py-3 px-4">Jenis Setoran</th>
                <th className="py-3 px-4">Materi</th>
                <th className="py-3 px-4">Hasil / Keterangan</th>
                <th className="py-3 px-3 text-center">Nilai</th>
                <th className="py-3 px-4 text-center">Tanggal</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada aktivitas setoran yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedStudentId(item.studentId);
                        setCurrentView('student_recap');
                      }}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.studentName}
                        <span className="block text-[10px] text-slate-400 font-normal">Pembimbing: {item.pembimbing}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {item.studentClass}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-800">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.jenisSetoran === "Yanbu'a"
                                ? 'bg-amber-500'
                                : item.jenisSetoran === 'Doa Harian'
                                ? 'bg-sky-500'
                                : 'bg-emerald-600'
                            }`}
                          />
                          {item.jenisSetoran}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{item.materi}</td>
                      <td className="py-3 px-4 text-slate-600">{item.hasil}</td>
                      <td className="py-3 px-3 text-center font-extrabold text-slate-900">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-xs">
                          {item.nilai}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">{item.tanggal}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            item.status === 'LULUS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.status === 'MENGULANG'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : item.status === 'DALAM BIMBINGAN'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.status}
                        </span>
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
  );
};
