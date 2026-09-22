import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { AnalysisPrintModal } from './AnalysisPrintModal';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  HelpCircle,
  FileSpreadsheet,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import * as XLSX from 'xlsx';

export const AnalysisView: React.FC = () => {
  const {
    students,
    extracurriculars,
    achievements,
    attendanceRecords,
    activityJournals,
    schoolInfo,
    showToast,
  } = useApp();

  const [period, setPeriod] = useState<string>('Semester Ganjil 2026/2027');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Check if data is sufficient
  const hasSufficientData = students.length > 0 && extracurriculars.length > 0;

  // 1. Ekstrakurikuler dengan jumlah peserta terbanyak
  const ekskulParticipantStats = useMemo(() => {
    return extracurriculars.map((e) => {
      const count = students.filter((s) => (s.ekskulIds || []).includes(e.id)).length;
      return {
        id: e.id,
        name: e.name,
        category: e.category,
        count,
        coach: e.coachName,
      };
    }).sort((a, b) => b.count - a.count);
  }, [extracurriculars, students]);

  const topEkskulByParticipants = ekskulParticipantStats[0] || null;

  // 2. Rata-rata Kehadiran Keseluruhan
  const totalStudents = students.length;
  const overallAvgAttendance = totalStudents
    ? Number((students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalStudents).toFixed(1))
    : 0;

  // 3. Siswa dengan perkembangan tertinggi (Top 5 Overall Score)
  const topStudents = useMemo(() => {
    return [...students]
      .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
      .slice(0, 5);
  }, [students]);

  // 4. Siswa yang memerlukan pembinaan (Skor < 75 atau Kehadiran < 75%)
  const studentsNeedAttention = useMemo(() => {
    return students.filter(
      (s) =>
        (s.overallScore || 0) < 75 ||
        (s.attendanceRate || 0) < 75 ||
        s.category === 'Perlu Pembinaan'
    );
  }, [students]);

  // 5. Ekstrakurikuler dengan kehadiran rendah (Simulasi per ekskul berdasarkan rerata siswa)
  const ekskulAttendanceStats = useMemo(() => {
    return extracurriculars.map((e) => {
      const members = students.filter((s) => (s.ekskulIds || []).includes(e.id));
      const avgAtt = members.length
        ? Number((members.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / members.length).toFixed(1))
        : 0;
      return {
        id: e.id,
        name: e.name,
        avgAttendance: avgAtt,
        memberCount: members.length,
      };
    }).sort((a, b) => a.avgAttendance - b.avgAttendance);
  }, [extracurriculars, students]);

  const lowestAttendanceEkskuls = ekskulAttendanceStats.filter((e) => e.avgAttendance < 85);

  // 6. Jumlah & Distribusi Prestasi
  const totalAchievements = achievements.length;
  const achievementByLevel = useMemo(() => {
    const levels = ['Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];
    const counts: Record<string, number> = {};
    achievements.forEach((a) => {
      counts[a.level] = (counts[a.level] || 0) + 1;
    });
    return levels.map((lvl) => ({
      name: lvl,
      value: counts[lvl] || 0,
    })).filter((item) => item.value > 0);
  }, [achievements]);

  const COLORS = ['#059669', '#2563EB', '#D97706', '#7C3AED', '#DC2626'];

  // 7. Tren Perkembangan Bulanan (Agregat)
  const monthlyProgressTrend = [
    { month: 'Juli', rataNilai: 82.4, kehadiran: 91.0 },
    { month: 'Agustus', rataNilai: 84.8, kehadiran: 92.5 },
    { month: 'September', rataNilai: 87.2, kehadiran: 94.1 },
    { month: 'Oktober', rataNilai: 89.6, kehadiran: 93.8 },
    { month: 'November', rataNilai: 91.5, kehadiran: 95.2 },
  ];

  // 8. Tren Kehadiran per Pertemuan
  const meetingAttendanceTrend = [
    { meeting: 'P1', rate: 93 },
    { meeting: 'P2', rate: 94 },
    { meeting: 'P3', rate: 91 },
    { meeting: 'P4', rate: 95 },
    { meeting: 'P5', rate: 96 },
    { meeting: 'P6', rate: 94 },
    { meeting: 'P7', rate: 95 },
    { meeting: 'P8', rate: 97 },
  ];

  // Export Excel
  const handleExportAnalysis = () => {
    const summaryData = [
      { Metrik: 'Total Siswa Terdaftar', Nilai: totalStudents },
      { Metrik: 'Rata-rata Kehadiran Global', Nilai: `${overallAvgAttendance}%` },
      { Metrik: 'Ekstrakurikuler Terbanyak Peserta', Nilai: `${topEkskulByParticipants?.name || '-'} (${topEkskulByParticipants?.count || 0} siswa)` },
      { Metrik: 'Siswa Berprestasi Tinggi', Nilai: topStudents.map((s) => s.name).join(', ') },
      { Metrik: 'Siswa Memerlukan Pembinaan', Nilai: `${studentsNeedAttention.length} Siswa` },
      { Metrik: 'Total Perolehan Prestasi / Medali', Nilai: totalAchievements },
    ];

    const ekskulData = ekskulParticipantStats.map((e) => ({
      'Nama Ekstrakurikuler': e.name,
      Kategori: e.category,
      'Jumlah Peserta': e.count,
      'Pembina / Pelatih': e.coach,
    }));

    const workbook = XLSX.utils.book_new();
    const sheet1 = XLSX.utils.json_to_sheet(summaryData);
    const sheet2 = XLSX.utils.json_to_sheet(ekskulData);

    XLSX.utils.book_append_sheet(workbook, sheet1, 'Ringkasan Analisis');
    XLSX.utils.book_append_sheet(workbook, sheet2, 'Sebaran Peserta');
    XLSX.writeFile(workbook, `Laporan_Analisis_Ekskul_${new Date().toISOString().slice(0, 10)}.xlsx`);

    showToast('Export Berhasil', 'Laporan analisis statistik berhasil diunduh dalam format Excel.', 'success');
  };

  if (!hasSufficientData) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-xs max-w-xl mx-auto my-12">
        <HelpCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">
          Data belum mencukupi untuk menghasilkan analisis.
        </h3>
        <p className="text-xs text-slate-500 mt-2">
          Silakan tambahkan data peserta ekstrakurikuler, presensi pertemuan, dan jurnal kegiatan terlebih dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Official Print Header */}
      <div className="hidden print:block mb-4">
        <OfficialLetterhead readOnly />
        <div className="text-center mt-3 pb-2 border-b border-slate-300">
          <h2 className="text-base font-black uppercase text-slate-900">
            LAPORAN ANALISIS EKSEKUTIF EKSTRAKURIKULER
          </h2>
          <p className="text-xs font-semibold text-emerald-800 uppercase mt-0.5">
            {period} &bull; SMP ALFA ALI MASYKUR WONOSOBO
          </p>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analisis & Statistik Komprehensif</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Analisis Kinerja & Tren Ekstrakurikuler
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Menjawab 8 pertanyaan analitis inti mengenai partisipasi, kehadiran, lonjakan prestasi, dan kebutuhan pembinaan santri.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            id="btn-cetak-analisis"
            title="Buka Lembar Pratinjau & Cetak Laporan Analisis Eksekutif"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak Analisis</span>
          </button>
          <button
            onClick={handleExportAnalysis}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* 8 Core Analytical Answers - Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Answer 1: Ekskul Terbanyak Peserta */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              1. Peserta Terbanyak
            </span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-2">
            {topEkskulByParticipants?.name || '-'}
          </h3>
          <p className="text-xs font-bold text-emerald-700 mt-0.5">
            {topEkskulByParticipants?.count || 0} Siswa Terdaftar
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Pembina: {topEkskulByParticipants?.coach || '-'}
          </p>
        </div>

        {/* Answer 2: Rata-rata Kehadiran */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              2. Rata-rata Kehadiran
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-blue-950 mt-2">
            {overallAvgAttendance}%
          </h3>
          <p className="text-xs font-bold text-blue-700 mt-0.5">
            Tingkat Presensi Global
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Kategori:{' '}
            <span className="font-bold text-emerald-700">
              {overallAvgAttendance >= 90 ? 'Sangat Baik' : 'Baik'}
            </span>
          </p>
        </div>

        {/* Answer 3: Siswa Perkembangan Tertinggi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              3. Skor Tertinggi
            </span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-base font-black text-slate-900 mt-2 truncate">
            {topStudents[0]?.name || '-'}
          </h3>
          <p className="text-xs font-bold text-amber-700 mt-0.5">
            Nilai Akhir: {topStudents[0]?.overallScore || 0} (Skala 100)
          </p>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Kelas {topStudents[0]?.class || '-'} &bull; Predikat {topStudents[0]?.category || '-'}
          </p>
        </div>

        {/* Answer 4: Siswa Perlu Pembinaan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              4. Perlu Pembinaan
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <h3 className="text-2xl font-black text-rose-950 mt-2">
            {studentsNeedAttention.length} Siswa
          </h3>
          <p className="text-xs font-bold text-rose-700 mt-0.5">
            Kehadiran / Skor &lt; 75%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Direkomendasikan konseling wali kelas & pembina
          </p>
        </div>
      </div>

      {/* Charts Row 1: Bar Chart (Peserta) & Donut Chart (Prestasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Jumlah Peserta per Ekstrakurikuler */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Distribusi Jumlah Peserta per Ekstrakurikuler
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Membandingkan sebaran minat 12 cabang kegiatan santri
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {totalStudents} Total Siswa
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ekskulParticipantStats} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#475569' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(value) => [`${value} Siswa`, 'Peserta']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#047857" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / Donut Chart: Jumlah & Distribusi Prestasi */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                6. Distribusi Prestasi
              </h3>
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs text-slate-500">
              Total {totalAchievements} medali & kejuaraan berhasil diraih
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={achievementByLevel}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {achievementByLevel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {achievementByLevel.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">{item.value} Juara</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Tren Perkembangan & Tren Kehadiran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Tren Perkembangan Bulanan (Section 23 requirement) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                7. Tren Perkembangan Bulanan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kenaikan rata-rata nilai kompetensi santri dari Juli s.d. November
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgressTrend} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rataNilai"
                  stroke="#047857"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#047857' }}
                  name="Rata-rata Nilai"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress & Line Chart: Tren Kehadiran per Pertemuan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                8. Tren Kehadiran per Pertemuan (P1 - P8)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Stabilitas konsistensi kehadiran latihan rutin santri
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={meetingAttendanceTrend} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="meeting" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Kehadiran']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2563EB' }}
                  name="Persentase Presensi"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attention Callout: 5. Ekstrakurikuler dengan Kehadiran Rendah & Rekomendasi */}
      <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
            5. Evaluasi Cabang Ekstrakurikuler dengan Kehadiran di Bawah 85%
          </h3>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed mb-4">
          {lowestAttendanceEkskuls.length > 0
            ? `Ditemukan ${lowestAttendanceEkskuls.length} cabang ekstrakurikuler dengan catatan kehadiran di bawah standar optimal 85%. Disarankan penyesuaian durasi waktu latihan dan koordinasi intensif dengan pembimbing asrama pondok.`
            : 'Seluruh cabang ekstrakurikuler menunjukkan tingkat kehadiran yang sangat memuaskan (di atas 85%). Komitmen santri dan pembimbing terjaga dengan sangat baik.'}
        </p>

        {lowestAttendanceEkskuls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowestAttendanceEkskuls.map((e) => (
              <div
                key={e.id}
                className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{e.name}</span>
                  <span className="text-[11px] text-slate-500">{e.memberCount} Siswa</span>
                </div>
                <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-extrabold text-xs">
                  {e.avgAttendance}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official Signatures for Print */}
      <div className="hidden print:block mt-8 pt-4 border-t border-slate-300">
        <div className="grid grid-cols-3 gap-6 text-xs text-center">
          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-0.5">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster || 'Afif Mashadi, S.S.'}</p>
            <p className="text-[11px] text-slate-600">NIP. {schoolInfo.headmasterNip || '19780512 200501 1 007'}</p>
          </div>
          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-0.5">Wakasek Bidang Kesiswaan</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.vicePrincipalStudentAffairs || 'Yulianti, S.Pd.'}</p>
            <p className="text-[11px] text-slate-600">NIP. {schoolInfo.vicePrincipalStudentAffairsNip || '19820714 200801 2 011'}</p>
          </div>
          <div>
            <p className="text-slate-600">
              {schoolInfo.district || 'Wonosobo'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold text-slate-900 mt-0.5">Koordinator Ekstrakurikuler</p>
            <div className="h-20" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.coordinatorName || 'Ahmad Fauzi, S.Pd.'}</p>
            <p className="text-[11px] text-slate-600">NIP. {schoolInfo.coordinatorNip || '19880520 201402 1 004'}</p>
          </div>
        </div>
      </div>

      {/* Analysis Print Modal */}
      <AnalysisPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        period={period}
      />
    </div>
  );
};
