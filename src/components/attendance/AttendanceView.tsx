import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, AttendanceRecord } from '../../types';
import {
  ClipboardCheck,
  Calendar,
  BookOpen,
  CheckCircle2,
  Users,
  Save,
  CheckCheck,
  History,
  AlertCircle,
  FileText,
  Clock,
  TrendingUp,
  UserX,
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    extracurriculars,
    students,
    attendanceRecords,
    saveAttendanceBatch,
    currentUser,
  } = useApp();

  // Selected Ekskul
  const defaultEkskulId = currentUser.assignedEkskulId || extracurriculars[0]?.id || '';
  const [selectedEkskulId, setSelectedEkskulId] = useState<string>(defaultEkskulId);

  // Form State
  const [meetingNumber, setMeetingNumber] = useState<number>(12);
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [topic, setTopic] = useState<string>('Latihan Rutin & Pendalaman Materi Taktikal / Keterampilan');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'input' | 'history' | 'recap'>('input');

  // Selected ekskul object
  const currentEkskul = extracurriculars.find((e) => e.id === selectedEkskulId) || extracurriculars[0];

  // Participants of this ekskul
  const ekskulStudents = useMemo(() => {
    return students.filter((s) => s.ekskulIds.includes(selectedEkskulId));
  }, [students, selectedEkskulId]);

  // Attendance states for current session: { [studentId]: { status: AttendanceStatus, notes: string } }
  const [attendanceState, setAttendanceState] = useState<
    Record<string, { status: AttendanceStatus; notes: string }>
  >({});

  // Initialize or reset status to 'Hadir' when changing ekskul or students list
  React.useEffect(() => {
    const initial: Record<string, { status: AttendanceStatus; notes: string }> = {};
    ekskulStudents.forEach((std) => {
      initial[std.id] = { status: 'H', notes: '' };
    });
    setAttendanceState(initial);
  }, [selectedEkskulId, ekskulStudents]);

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleSetNotes = (studentId: string, notes: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; notes: string }> = {};
    ekskulStudents.forEach((std) => {
      updated[std.id] = {
        status: 'H',
        notes: attendanceState[std.id]?.notes || '',
      };
    });
    setAttendanceState(updated);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Mohon isi topik materi latihan hari ini.');
      return;
    }

    const recordsToSave: Omit<AttendanceRecord, 'id'>[] = ekskulStudents.map((std) => ({
      studentId: std.id,
      studentName: std.name,
      ekskulId: selectedEkskulId,
      date: sessionDate,
      meetingNumber: Number(meetingNumber),
      status: attendanceState[std.id]?.status || 'H',
      topic: topic,
      notes: attendanceState[std.id]?.notes || '',
    }));

    saveAttendanceBatch(recordsToSave);
  };

  // Recap Stats
  const historyForEkskul = attendanceRecords.filter((r) => r.ekskulId === selectedEkskulId);

  // Group by date & meetingNumber
  const previousMeetings = useMemo(() => {
    const map = new Map<string, AttendanceRecord[]>();
    historyForEkskul.forEach((rec) => {
      const key = `${rec.date}-Pertemuan-${rec.meetingNumber}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(rec);
    });
    return Array.from(map.entries()).map(([key, list]) => ({
      key,
      date: list[0]?.date || '',
      meetingNumber: list[0]?.meetingNumber || 1,
      topic: list[0]?.topic || 'Latihan Rutin',
      totalStudents: list.length,
      hadirCount: list.filter((l) => l.status === 'H').length,
      izinCount: list.filter((l) => l.status === 'I').length,
      sakitCount: list.filter((l) => l.status === 'S').length,
      alpaCount: list.filter((l) => l.status === 'A').length,
    }));
  }, [historyForEkskul]);

  // Students ranking by attendance
  const mostDisciplined = [...(ekskulStudents || [])]
    .sort((a, b) => (b.attendanceRate || 0) - (a.attendanceRate || 0))
    .slice(0, 4);
  const leastDisciplined = (ekskulStudents || []).filter((s) => (s.attendanceRate || 0) < 85);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Monitoring Kehadiran Ekstrakurikuler
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Presensi Digital
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan presensi peserta, topik latihan harian, dan analisis keaktifan siswa
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'input'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Input Presensi</span>
          </button>
          <button
            onClick={() => setActiveTab('recap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'recap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Rekap Kehadiran</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Sesi</span>
          </button>
        </div>
      </div>

      {/* Ekstrakurikuler Selector Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pilih Ekstrakurikuler:
            </label>
            <select
              value={selectedEkskulId}
              onChange={(e) => setSelectedEkskulId(e.target.value)}
              className="mt-0.5 text-sm font-bold text-slate-900 bg-transparent border-0 focus:ring-0 cursor-pointer"
            >
              {extracurriculars.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} (Pembina: {e.coachName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Jadwal Rutin:</span>
            <span className="font-bold text-slate-800">{currentEkskul?.schedule}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Lokasi:</span>
            <span className="font-bold text-slate-800">{currentEkskul?.location}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">Peserta:</span>
            <span className="font-bold text-blue-700">{ekskulStudents.length} Siswa</span>
          </div>
        </div>
      </div>

      {/* TAB 1: INPUT PRESENSI */}
      {activeTab === 'input' && (
        <form onSubmit={handleSaveAttendance} className="space-y-6">
          {/* Meeting configuration card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Informasi Sesi Latihan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pertemuan Ke-
                </label>
                <input
                  type="number"
                  min={1}
                  max={36}
                  value={meetingNumber}
                  onChange={(e) => setMeetingNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik / Materi Latihan
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Pemantapan Formasi & Strategi"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Student list for attendance */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Daftar Presensi Peserta ({ekskulStudents.length} Siswa)
                </h4>
                <p className="text-xs text-slate-400">
                  Tentukan status kehadiran tiap peserta (Hadir / Izin / Sakit / Alpa)
                </p>
              </div>

              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Tandai Semua Hadir</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {ekskulStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada siswa yang terdaftar di ekstrakurikuler ini.
                </div>
              ) : (
                ekskulStudents.map((std, idx) => {
                  const currStatus = attendanceState[std.id]?.status || 'H';
                  const currNotes = attendanceState[std.id]?.notes || '';

                  return (
                    <div
                      key={std.id}
                      className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-slate-400 w-5 text-center">
                          {idx + 1}
                        </span>
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{std.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            NIS: {std.nis} &bull; Kelas {std.class} &bull; Rerata: {std.attendanceRate}%
                          </p>
                        </div>
                      </div>

                      {/* Status selectors & notes */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* 4 Status Buttons: H, I, S, A */}
                        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => handleSetStatus(std.id, 'H')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currStatus === 'H'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700'
                            }`}
                          >
                            Hadir
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(std.id, 'I')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currStatus === 'I'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700'
                            }`}
                          >
                            Izin
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(std.id, 'S')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currStatus === 'S'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700'
                            }`}
                          >
                            Sakit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(std.id, 'A')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currStatus === 'A'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-rose-700'
                            }`}
                          >
                            Alpa
                          </button>
                        </div>

                        {/* Optional notes */}
                        <input
                          type="text"
                          value={currNotes}
                          onChange={(e) => handleSetNotes(std.id, e.target.value)}
                          placeholder="Catatan (surat izin, alasan)..."
                          className="w-48 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Submit Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Total {ekskulStudents.length} peserta akan disimpan ke database presensi sekolah.
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Kehadiran</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: REKAP KEHADIRAN */}
      {activeTab === 'recap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Siswa Paling Rajin */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Siswa Paling Rajin ({currentEkskul?.name})
              </h4>
              <div className="space-y-2.5">
                {mostDisciplined.map((std) => (
                  <div
                    key={std.id}
                    className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{std.name}</p>
                        <p className="text-[11px] text-slate-500">Kelas {std.class}</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-700 text-sm">{std.attendanceRate}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Siswa Perlu Perhatian / Sering Tidak Hadir */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-rose-700 text-sm mb-3 flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-600" />
                Siswa Sering Tidak Hadir (&lt; 85%)
              </h4>
              {leastDisciplined.length === 0 ? (
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                  Seluruh siswa memiliki tingkat presensi di atas 85%.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {leastDisciplined.map((std) => (
                    <div
                      key={std.id}
                      className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={std.avatar} alt={std.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{std.name}</p>
                          <p className="text-[11px] text-slate-500">Kelas {std.class}</p>
                        </div>
                      </div>
                      <span className="font-black text-rose-700 text-sm">{std.attendanceRate}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RIWAYAT SESI */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">
              Riwayat Pertemuan {currentEkskul?.name}
            </h4>
            <p className="text-xs text-slate-400">
              Rekap sesi presensi yang telah disimpan sebelumnya
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Pertemuan</th>
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Topik / Materi</th>
                  <th className="py-3 px-3 text-center">Hadir</th>
                  <th className="py-3 px-3 text-center">Izin</th>
                  <th className="py-3 px-3 text-center">Sakit</th>
                  <th className="py-3 px-3 text-center">Alpa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previousMeetings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                      Belum ada catatan pertemuan untuk ekstrakurikuler ini.
                    </td>
                  </tr>
                ) : (
                  previousMeetings.map((m) => (
                    <tr key={m.key} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">Ke-{m.meetingNumber}</td>
                      <td className="py-3 px-3 text-slate-600">{m.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{m.topic}</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">{m.hadirCount}</td>
                      <td className="py-3 px-3 text-center font-bold text-blue-600">{m.izinCount}</td>
                      <td className="py-3 px-3 text-center font-bold text-amber-600">{m.sakitCount}</td>
                      <td className="py-3 px-3 text-center font-bold text-rose-600">{m.alpaCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
