import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { StudentPrintModal } from './StudentPrintModal';
import {
  X,
  User,
  Phone,
  Calendar,
  Award,
  Trophy,
  ClipboardCheck,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface StudentDetailModalProps {
  studentId: string | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  studentId,
  onClose,
}) => {
  const { students, extracurriculars, achievements, coaches, setCurrentView, showToast } = useApp();

  if (!studentId) return null;
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  // Matched extracurriculars
  const ekskuls = student.ekskulIds
    .map((id) => extracurriculars.find((e) => e.id === id))
    .filter(Boolean);

  // Matched achievements
  const studentAchievements = achievements.filter((a) => a.studentId === student.id);

  // Competency aspects for progress bars & radar chart
  const comp = student.competencies;
  const competencyItems = [
    { label: 'Keterampilan', score: comp.keterampilan, max: 4.0 },
    { label: 'Pengetahuan', score: comp.pengetahuan, max: 4.0 },
    { label: 'Kreativitas', score: comp.kreativitas, max: 4.0 },
    { label: 'Kerja Sama', score: comp.kerjasama, max: 4.0 },
    { label: 'Disiplin', score: comp.disiplin, max: 4.0 },
    { label: 'Tanggung Jawab', score: comp.tanggungJawab, max: 4.0 },
    { label: 'Kepemimpinan', score: comp.kepemimpinan, max: 4.0 },
    { label: 'Sportivitas', score: comp.sportivitas, max: 4.0 },
  ];

  // Radar chart data (7-8 aspects)
  const radarData = competencyItems.map((item) => ({
    subject: item.label,
    score: item.score,
    fullMark: 4.0,
  }));

  // Attendance breakdown calculation
  const totalSessions = 24; // standard semester sessions
  const hadirCount = Math.round((student.attendanceRate / 100) * totalSessions);
  const remaining = totalSessions - hadirCount;
  const izinCount = Math.min(remaining > 0 ? 1 : 0, remaining);
  const sakitCount = Math.min(remaining - izinCount > 0 ? 1 : 0, remaining - izinCount);
  const alpaCount = Math.max(0, remaining - izinCount - sakitCount);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto student-detail-modal-backdrop">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 student-detail-modal-container">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {student.name}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    student.category === 'Sangat Baik'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : student.category === 'Baik'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {student.category}
                </span>
              </div>
              <p className="text-xs text-blue-200">
                NIS: {student.nis} &bull; NISN: {student.nisn} &bull; Kelas {student.class}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-student-detail-header"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25 no-print cursor-pointer"
              title="Cetak Profil Lengkap Siswa (1 Berkas Penuh dari Atas Sampai Bawah)"
            >
              <Printer className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Cetak Profil Lengkap</span>
              <span className="sm:hidden">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors no-print cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 student-detail-modal-body">
          {/* Official Letterhead for printing */}
          <div className="hidden print:block pb-2">
            <OfficialLetterhead readOnly />
          </div>

          {/* Section 1: Profil Siswa & Kontak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Jenis Kelamin</span>
              <p className="font-bold text-slate-800 mt-0.5">
                {student.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Orang Tua / Wali</span>
              <p className="font-bold text-slate-800 mt-0.5">{student.parentName}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Kontak HP / WA</span>
              <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-blue-600" />
                {student.parentPhone}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Status Peserta</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {student.status}
              </span>
            </div>
          </div>

          {/* Section 2: Ekstrakurikuler yang Diikuti */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Ekstrakurikuler yang Diikuti
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ekskuls.map((e) => (
                <div
                  key={e?.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={e?.image}
                      alt={e?.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{e?.name}</p>
                      <p className="text-[11px] text-slate-500">Pembina: {e?.coachName}</p>
                      <p className="text-[10px] text-blue-600 mt-0.5 font-medium">{e?.schedule}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {e?.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Rekap Kehadiran Presensi */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              Rekap Kehadiran Presensi (Semester Ganjil)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Persentase</span>
                <p className="text-xl font-extrabold text-blue-900 mt-1">{student.attendanceRate}%</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Hadir</span>
                <p className="text-xl font-extrabold text-emerald-900 mt-1">{hadirCount}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Izin</span>
                <p className="text-xl font-extrabold text-amber-900 mt-1">{izinCount}</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Sakit</span>
                <p className="text-xl font-extrabold text-indigo-900 mt-1">{sakitCount}</p>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-center">
                <span className="text-[10px] font-bold text-rose-700 uppercase">Alpa</span>
                <p className="text-xl font-extrabold text-rose-900 mt-1">{alpaCount}</p>
              </div>
            </div>
          </div>

          {/* Section 4: 8 Aspek Perkembangan Kompetensi (Progress Bars & Radar) */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Perkembangan Kompetensi & Karakter Siswa (Skala 1 - 4)
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* 8 Progress bars */}
              <div className="lg:col-span-7 space-y-3">
                {competencyItems.map((item) => {
                  const pct = (item.score / item.max) * 100;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="text-blue-700 font-bold">
                          {item.score.toFixed(2)} / {item.max.toFixed(1)} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            item.score >= 3.7
                              ? 'bg-emerald-500'
                              : item.score >= 3.2
                              ? 'bg-blue-600'
                              : item.score >= 2.5
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Radar Chart */}
              <div className="lg:col-span-5 h-64 bg-slate-50 rounded-2xl p-2 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider mt-1">
                  Peta Radar Kompetensi
                </p>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#475569' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                    <Radar
                      name={student.name}
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Section 5: Grafik Tren Nilai dari Waktu ke Waktu (Line Chart) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Grafik Riwayat Perkembangan dari Waktu ke Waktu
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={student.historyScores} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[2.0, 4.0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val} / 4.00`, 'Nilai Evaluasi']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 6: Catatan Pembina */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Catatan Pembina & Rekomendasi Tindak Lanjut
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-blue-100">
              &ldquo;{student.notesPembina || 'Siswa menunjukkan antusiasme belajar dan progres yang sangat positif dalam keikutsertaan kegiatan ekstrakurikuler.'}&rdquo;
            </p>
          </div>

          {/* Section 7: Riwayat Prestasi */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Riwayat Prestasi & Kejuaraan
            </h4>

            {studentAchievements.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                Belum ada catatan kejuaraan resmi untuk siswa ini.
              </div>
            ) : (
              <div className="space-y-2">
                {studentAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-amber-950">{ach.rank}</p>
                      <p className="text-slate-700 font-semibold mt-0.5">{ach.competitionName}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Penyelenggara: {ach.organizer} &bull; {ach.date}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] whitespace-nowrap">
                      Tingkat {ach.level}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 no-print">
          <span className="text-xs text-slate-500">
            Terakhir dievaluasi: Semester Ganjil 2025/2026 &bull; Format dokumen cetak A4 / F4
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-student-detail-footer"
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Profil Lengkap</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Full Student Printable Document Modal */}
      {isPrintModalOpen && (
        <StudentPrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          student={student}
        />
      )}
    </div>
  );
};
