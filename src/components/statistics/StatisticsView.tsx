import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Filter,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

export const StatisticsView: React.FC = () => {
  const { students, unifiedSetoran, classes } = useApp();

  const [periodFilter, setPeriodFilter] = useState<'all' | 'semester1' | 'semester2'>('all');

  // Chart 1: Jumlah Siswa Berdasarkan Jilid Yanbu'a
  const yanbuaLevels = ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Jilid 7', "Al-Qur'an"];
  const yanbuaChartData = yanbuaLevels.map((lvl) => ({
    name: lvl.replace('Jilid ', 'Jld '),
    fullName: lvl,
    siswa: students.filter((s) => s.yanbuaJilid === lvl).length,
  }));

  // Chart 2: Distribusi Penguasaan Doa Harian
  const doaRanges = [
    { range: '1-5 Doa', count: students.filter((s) => s.doaMasteredCount >= 1 && s.doaMasteredCount <= 5).length },
    { range: '6-10 Doa', count: students.filter((s) => s.doaMasteredCount >= 6 && s.doaMasteredCount <= 10).length },
    { range: '11-15 Doa', count: students.filter((s) => s.doaMasteredCount >= 11 && s.doaMasteredCount <= 15).length },
    { range: '16-19 Doa', count: students.filter((s) => s.doaMasteredCount >= 16 && s.doaMasteredCount <= 19).length },
    { range: '20 Doa (Khatam)', count: students.filter((s) => s.doaMasteredCount >= 20).length },
  ];

  // Chart 3: Perkembangan Hafalan Al-Qur'an (Rentang Ayat)
  const quranRanges = [
    { range: '< 50 Ayat', count: students.filter((s) => s.quranAyatCount < 50).length },
    { range: '50-150 Ayat', count: students.filter((s) => s.quranAyatCount >= 50 && s.quranAyatCount < 150).length },
    { range: '150-300 Ayat', count: students.filter((s) => s.quranAyatCount >= 150 && s.quranAyatCount < 300).length },
    { range: '300-500 Ayat', count: students.filter((s) => s.quranAyatCount >= 300 && s.quranAyatCount < 500).length },
    { range: '500+ Ayat (Juz 30)', count: students.filter((s) => s.quranAyatCount >= 500).length },
  ];

  // Chart 4: Jumlah Setoran Per Bulan (Sep 2026 - Jun 2027)
  const monthlySetoran = [
    { month: 'Jul', count: 120 },
    { month: 'Agt', count: 195 },
    { month: 'Sep', count: 240 },
    { month: 'Okt', count: 215 },
    { month: 'Nov', count: 280 },
    { month: 'Des', count: 260 },
    { month: 'Jan', count: 290 },
    { month: 'Feb', count: 310 },
    { month: 'Mar', count: 345 },
    { month: 'Apr', count: 275 },
    { month: 'Mei', count: 360 },
    { month: 'Jun', count: 320 },
  ];

  // Chart 5: Rata-Rata Nilai Setoran Per Kelas
  const classScores = classes.map((c) => {
    const stds = students.filter((s) => s.class === c.name);
    const avgScore = stds.length > 0 ? Math.round(stds.reduce((acc, s) => acc + s.overallProgress, 0) / stds.length) : 80;
    return {
      kelas: c.name,
      nilai: avgScore,
    };
  });

  // Chart 6: Siswa Sudah vs Belum Setoran Hari Ini (Donut)
  const sudahCount = students.filter((s) => s.statusSetoranHariIni === 'LULUS' || s.statusSetoranHariIni === 'MENGULANG').length;
  const belumCount = students.filter((s) => s.statusSetoranHariIni === 'BELUM SETOR').length;
  const bimbinganCount = students.filter((s) => s.statusSetoranHariIni === 'DALAM BIMBINGAN').length;

  const donutData = [
    { name: 'Sudah Setor (Lulus/Ulang)', value: sudahCount, color: '#059669' },
    { name: 'Belum Setor', value: belumCount, color: '#94A3B8' },
    { name: 'Dalam Bimbingan', value: bimbinganCount, color: '#D97706' },
  ];

  // Chart 7: Progress Yanbu'a Setiap Kelas (Tingkat Dasar vs Lanjutan)
  const classYanbuaGrouped = (classes || []).slice(0, 8).map((c) => {
    const stds = (students || []).filter((s) => s.class === c.name);
    const dasar = stds.filter((s) => s.yanbuaJilid === 'Jilid 1' || s.yanbuaJilid === 'Jilid 2' || s.yanbuaJilid === 'Jilid 3').length;
    const menengah = stds.filter((s) => s.yanbuaJilid === 'Jilid 4' || s.yanbuaJilid === 'Jilid 5').length;
    const mahir = stds.filter((s) => s.yanbuaJilid === 'Jilid 6' || s.yanbuaJilid === 'Jilid 7' || s.yanbuaJilid === "Al-Qur'an").length;
    return {
      kelas: c.name,
      Dasar: dasar,
      Menengah: menengah,
      Mahir: mahir,
    };
  });

  // Chart 8: Tren Kelulusan Setoran 1 Tahun (Line/Area)
  const yearlyTrend = [
    { bulan: 'Jul', lulus: 85, ulang: 15 },
    { bulan: 'Agt', lulus: 120, ulang: 22 },
    { bulan: 'Sep', lulus: 180, ulang: 25 },
    { bulan: 'Okt', lulus: 165, ulang: 20 },
    { bulan: 'Nov', lulus: 210, ulang: 28 },
    { bulan: 'Des', lulus: 195, ulang: 18 },
    { bulan: 'Jan', lulus: 230, ulang: 24 },
    { bulan: 'Feb', lulus: 250, ulang: 22 },
    { bulan: 'Mar', lulus: 270, ulang: 20 },
    { bulan: 'Apr', lulus: 220, ulang: 16 },
    { bulan: 'Mei', lulus: 290, ulang: 19 },
    { bulan: 'Jun', lulus: 260, ulang: 15 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Pusat Analitik & Visualisasi Data</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Statistik & Grafik Monitoring Ngaji
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Analisis 8 indikator kunci perkembangan jilid Yanbu'a, hafalan doa harian, dan hafalan Al-Qur'an santri SMP Alfa Ali Masykur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-300 font-semibold">Periode:</span>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value as any)}
            className="px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-xs font-bold text-white focus:outline-hidden"
          >
            <option value="all">Satu Tahun Penuh (2026/2027)</option>
            <option value="semester1">Semester Ganjil</option>
            <option value="semester2">Semester Genap</option>
          </select>
        </div>
      </div>

      {/* 8 Interactive Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                1. Jumlah Siswa Berdasarkan Jilid Yanbu'a
              </h3>
              <p className="text-[11px] text-slate-500">Distribusi tingkat kemampuan membaca tartil</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              Jilid 1 - Quran
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yanbuaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Siswa`, 'Jumlah Santri']}
                />
                <Bar dataKey="siswa" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                2. Perkembangan Hafalan Doa Harian
              </h3>
              <p className="text-[11px] text-slate-500">Jumlah santri berdasarkan rentang doa yang dihafal</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              Target 20 Doa
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doaRanges} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#78350F', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Siswa`, 'Jumlah Santri']}
                />
                <Bar dataKey="count" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                3. Perkembangan Hafalan Al-Qur'an (Tahfidz)
              </h3>
              <p className="text-[11px] text-slate-500">Pengelompokan total ayat Al-Qur'an yang telah disetor</p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
              Juz 30 (564 Ayat)
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quranRanges} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C4A6E', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Siswa`, 'Jumlah Santri']}
                />
                <Bar dataKey="count" fill="#0284C7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                4. Jumlah Setoran Per Bulan
              </h3>
              <p className="text-[11px] text-slate-500">Volume aktivitas setoran bulanan santri</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
              1 Tahun Ajaran
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySetoran} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Kali`, 'Total Setoran']}
                />
                <Area type="monotone" dataKey="count" stroke="#059669" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                5. Rata-Rata Nilai Setoran Per Kelas
              </h3>
              <p className="text-[11px] text-slate-500">Perbandingan ketercapaian nilai antar rombel</p>
            </div>
            <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
              Kelas 7A - 9D
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="kelas" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#581C87', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Poin`, 'Rata-rata Nilai']}
                />
                <Bar dataKey="nilai" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                6. Rasio Siswa Sudah vs Belum Setoran Hari Ini
              </h3>
              <p className="text-[11px] text-slate-500">Persentase disiplin setoran harian</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              Hari Ini
            </span>
          </div>
          <div className="h-56 w-full flex items-center justify-around">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                    formatter={(val: any) => [`${val} Santri`, 'Jumlah']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {donutData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: d.color }} />
                  <div>
                    <span className="text-slate-700 font-semibold block">{d.name}</span>
                    <strong className="text-slate-900">{d.value} Siswa</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 7 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                7. Tingkatan Progress Yanbu'a Setiap Kelas
              </h3>
              <p className="text-[11px] text-slate-500">Dasar (Jilid 1-3), Menengah (Jilid 4-5), Mahir (Jilid 6-Quran)</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classYanbuaGrouped} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="kelas" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="Dasar" fill="#94A3B8" />
                <Bar dataKey="Menengah" fill="#D97706" />
                <Bar dataKey="Mahir" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                8. Tren Kelulusan vs Pengulangan Setoran (1 Tahun)
              </h3>
              <p className="text-[11px] text-slate-500">Kualitas dan ketuntasan materi santri sepanjang tahun</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              Evaluasi Tahunan
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Line type="monotone" dataKey="lulus" stroke="#059669" strokeWidth={2.5} name="Lulus Setoran" />
                <Line type="monotone" dataKey="ulang" stroke="#E11D48" strokeWidth={2} name="Mengulang" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
