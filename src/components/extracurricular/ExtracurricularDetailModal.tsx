import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Award,
  Users,
  Calendar,
  MapPin,
  UserCheck,
  Trophy,
  ClipboardCheck,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';

interface ExtracurricularDetailModalProps {
  ekskulId: string | null;
  onClose: () => void;
}

export const ExtracurricularDetailModal: React.FC<ExtracurricularDetailModalProps> = ({
  ekskulId,
  onClose,
}) => {
  const { extracurriculars, students, achievements, setSelectedStudentDetailId, setCurrentView } = useApp();

  if (!ekskulId) return null;
  const ekskul = extracurriculars.find((e) => e.id === ekskulId);
  if (!ekskul) return null;

  // Members
  const members = students.filter((s) => s.ekskulIds.includes(ekskul.id));

  // Achievements
  const ekskulAchievements = achievements.filter((a) => a.ekskulId === ekskul.id);

  // Averages
  const avgAttendance = members.length > 0
    ? (members.reduce((acc, s) => acc + s.attendanceRate, 0) / members.length).toFixed(1)
    : '0';

  const avgScore = members.length > 0
    ? (members.reduce((acc, s) => acc + s.overallScore, 0) / members.length).toFixed(2)
    : '0';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Banner with Image & Info */}
        <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden shrink-0">
          <img
            src={ekskul.image}
            alt={ekskul.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white uppercase tracking-wider">
              {ekskul.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 text-white">
              {ekskul.name}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
              {ekskul.description}
            </p>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Jumlah Anggota</span>
              <p className="text-lg font-extrabold text-slate-900 mt-0.5">{members.length} Siswa</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Rerata Presensi</span>
              <p className="text-lg font-extrabold text-blue-900 mt-0.5">{avgAttendance}%</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Skor Kompetensi</span>
              <p className="text-lg font-extrabold text-emerald-900 mt-0.5">{avgScore} <span className="text-xs text-emerald-700">/ 4.0</span></p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Total Prestasi</span>
              <p className="text-lg font-extrabold text-amber-900 mt-0.5">{ekskulAchievements.length} Gelar</p>
            </div>
          </div>

          {/* Logistics Info: Coach, Schedule, Location, Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Pembina Ekstrakurikuler</span>
                <span className="font-bold text-slate-800">{ekskul.coachName}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Jadwal Latihan Rutin</span>
                <span className="font-bold text-slate-800">{ekskul.schedule}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Tempat / Lokasi Latihan</span>
                <span className="font-bold text-slate-800">{ekskul.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Target className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold">Target Capaian</span>
                <span className="font-bold text-slate-800">{ekskul.targetCapaian}</span>
              </div>
            </div>
          </div>

          {/* Prestasi yang Pernah Diraih */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Prestasi & Penghargaan Terverifikasi
            </h4>

            {ekskulAchievements.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                Belum ada catatan kejuaraan resmi yang dicatatkan pada ekstrakurikuler ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ekskulAchievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{ach.rank}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                        {ach.level}
                      </span>
                    </div>
                    <p className="text-slate-700 font-semibold mt-1">{ach.competitionName}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">
                      Peraih: {ach.studentName} ({ach.date})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Siswa Peserta Ekstrakurikuler */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Daftar Peserta Aktif ({members.length} Siswa)
              </h4>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Siswa</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Presensi</th>
                    <th className="py-2.5 px-3">Skor</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                        <img src={std.avatar} alt={std.name} className="w-7 h-7 rounded-full object-cover" />
                        <span>{std.name}</span>
                      </td>
                      <td className="py-2.5 px-3">{std.class}</td>
                      <td className="py-2.5 px-3 font-bold">{std.attendanceRate}%</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">{std.overallScore.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            onClose();
                            setSelectedStudentDetailId(std.id);
                            setCurrentView('students');
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Detail Siswa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
