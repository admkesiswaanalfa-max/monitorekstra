import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Search,
  BookOpen,
  HeartHandshake,
  BookMarked,
  Printer,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  Phone,
  User,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const StudentRecapView: React.FC = () => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    unifiedSetoran,
    masterDoaList,
    schoolInfo,
  } = useApp();

  // Search or select student
  const [searchTerm, setSearchTerm] = useState('');

  const currentStudent = useMemo(() => {
    if (selectedStudentId) {
      const found = students.find((s) => s.id === selectedStudentId);
      if (found) return found;
    }
    return students[0] || null;
  }, [students, selectedStudentId]);

  // Unified history for this student
  const studentHistory = useMemo(() => {
    if (!currentStudent) return [];
    return unifiedSetoran.filter((u) => u.studentId === currentStudent.id);
  }, [unifiedSetoran, currentStudent]);

  // Chart data for score trend
  const scoreTrendData = useMemo(() => {
    if (studentHistory.length === 0) {
      return [
        { date: 'Setoran 1', score: 80 },
        { date: 'Setoran 2', score: 85 },
        { date: 'Setoran 3', score: 88 },
        { date: 'Setoran 4', score: 92 },
      ];
    }
    return [...studentHistory]
      .reverse()
      .map((item, idx) => ({
        date: item.tanggal ? item.tanggal.slice(5) : `Ke-${idx + 1}`,
        score: item.nilai,
        materi: item.materi,
      }));
  }, [studentHistory]);

  const handlePrintCard = () => {
    window.print();
  };

  if (!currentStudent) {
    return (
      <div className="p-12 text-center text-slate-400">
        Belum ada data siswa yang dipilih.
      </div>
    );
  }

  const jilidLevels = ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Jilid 7', "Al-Qur'an"];
  const currentJilidIdx = jilidLevels.indexOf(currentStudent.yanbuaJilid);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Selector Bar */}
      <div className="no-print bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-700" />
          <span className="font-extrabold text-sm text-slate-900">Pilih Siswa untuk Rekap:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={currentStudent.id}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-xs text-emerald-950 focus:outline-hidden"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} &bull; Kelas {s.class} (NIS: {s.nis})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintCard}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Monitoring</span>
          </button>
        </div>
      </div>

      {/* Printable Card Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Header for Print */}
        <div className="border-b-2 border-emerald-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-300 flex items-center justify-center font-serif text-xl font-extrabold shadow-sm">
              AA
            </div>
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                SMP ALFA ALI MASYKUR
              </h2>
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mt-1">
                KARTU MONITORING NGAJI JILID YANBU'A & HAFALAN SISWA
              </p>
              <p className="text-[11px] text-slate-500">
                Tahun Pelajaran {schoolInfo.academicYear} &bull; Mojotengah, Wonosobo
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Status Santri</span>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {currentStudent.status}
            </span>
          </div>
        </div>

        {/* Student Biodata Card */}
        <div className="bg-emerald-950/5 rounded-2xl p-5 border border-emerald-100/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md shrink-0"
            />
            <div className="space-y-0.5">
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                {currentStudent.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                NIS: <strong className="font-mono">{currentStudent.nis}</strong> &bull; NISN: <strong className="font-mono">{currentStudent.nisn}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Kelas: <strong className="text-emerald-800 font-bold">{currentStudent.class}</strong> &bull; Wali Kelas: {currentStudent.waliKelas}
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 text-xs space-y-1 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Orang Tua: <strong>{currentStudent.parentName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Kontak: <strong className="font-mono">{currentStudent.phone}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Setoran Terakhir: <strong className="font-mono">{currentStudent.lastSubmissionDate}</strong></span>
            </div>
          </div>
        </div>

        {/* 3 Pillars Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Yanbua */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">1. Jilid Yanbu'a</h4>
              </div>
              <span className="text-xs font-extrabold text-emerald-800">
                {currentStudent.yanbuaProgressPct}%
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-emerald-950">
                {currentStudent.yanbuaJilid}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Posisi: Halaman <strong className="text-slate-800">{currentStudent.yanbuaHalaman}</strong>
              </p>
            </div>

            {/* Visual Stepper */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Jejak Tingkatan Jilid:
              </span>
              <div className="grid grid-cols-4 gap-1 text-center">
                {jilidLevels.map((lvl, idx) => {
                  const isPassed = idx <= currentJilidIdx;
                  return (
                    <span
                      key={lvl}
                      className={`text-[9px] font-bold py-1 rounded ${
                        isPassed
                          ? 'bg-emerald-700 text-white font-extrabold'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {lvl.replace('Jilid ', 'Jld ')}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pillar 2: Doa Harian */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">2. Doa Harian</h4>
              </div>
              <span className="text-xs font-extrabold text-amber-800">
                {Math.round((currentStudent.doaMasteredCount / 20) * 100)}%
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-amber-950">
                {currentStudent.doaMasteredCount} <span className="text-sm font-normal text-slate-500">/ 20 Doa</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {20 - currentStudent.doaMasteredCount} doa tersisa untuk khatam
              </p>
            </div>

            <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                style={{ width: `${(currentStudent.doaMasteredCount / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 3: Quran */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                  <BookMarked className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">3. Hafalan Al-Qur'an</h4>
              </div>
              <span className="text-xs font-extrabold text-sky-800">
                {Math.min(100, Math.round((currentStudent.quranAyatCount / 564) * 100))}%
              </span>
            </div>

            <div>
              <div className="text-2xl font-black text-sky-950">
                {currentStudent.quranAyatCount} <span className="text-sm font-normal text-slate-500">/ 564 Ayat</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Surat Terakhir: <strong className="text-slate-800">{currentStudent.quranSurah}</strong> (Juz {currentStudent.quranJuz})
              </p>
            </div>

            <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full"
                style={{ width: `${Math.min(100, (currentStudent.quranAyatCount / 564) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Historical Score Progression Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 no-print">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Grafik Perkembangan Nilai Setoran Siswa</span>
            </h4>
            <span className="text-xs text-slate-400">Skor evaluasi berkala (0 - 100)</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#064E3B', color: '#fff', borderRadius: 8, fontSize: 11 }}
                  formatter={(val: any) => [`${val} Poin`, 'Nilai Setoran']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: '#D97706', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed History Table */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Riwayat Seluruh Catatan Setoran Siswa Ini</span>
          </h4>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Jenis Setoran</th>
                  <th className="py-2.5 px-4">Materi</th>
                  <th className="py-2.5 px-3 text-center">Nilai</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-4">Catatan Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      Belum ada riwayat setoran tercatat untuk santri ini.
                    </td>
                  </tr>
                ) : (
                  studentHistory.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">{item.tanggal}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">{item.jenisSetoran}</td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">{item.materi}</td>
                      <td className="py-2.5 px-3 text-center font-extrabold font-mono text-emerald-900">
                        {item.nilai}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'LULUS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 italic text-[11px]">
                        {item.catatan || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature Area for Printing */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-1">Wali Kelas {currentStudent.class}</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">{currentStudent.waliKelas}</p>
            <p className="text-[10px] text-slate-400">Guru Pembimbing</p>
          </div>

          <div>
            <p className="text-slate-500">Mojotengah, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-900 mt-1">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster}</p>
            <p className="text-[10px] text-slate-400">NIP. 19780512 200501 1 003</p>
          </div>
        </div>
      </div>
    </div>
  );
};
