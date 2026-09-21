import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Search,
  UserCheck,
  Save,
  Check,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { SubmissionStatus } from '../../types';

export const TodaySetoranView: React.FC = () => {
  const {
    students,
    currentUser,
    quickSetoran,
    markTodayAllSubmitted,
    classes,
    teachers,
    showToast,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Quick form state
  const [formStudentId, setFormStudentId] = useState<string>(students[0]?.id || '');
  const [formJenis, setFormJenis] = useState<'Yanbu\'a' | 'Doa Harian' | 'Al-Qur\'an'>("Yanbu'a");
  const [formMateri, setFormMateri] = useState<string>('Jilid 3 Hal 18 (Mad Thobi\'i)');
  const [formNilai, setFormNilai] = useState<number>(85);
  const [formStatus, setFormStatus] = useState<SubmissionStatus>('LULUS');
  const [formCatatan, setFormCatatan] = useState<string>('Lancar dan tartil');
  const [formPembimbing, setFormPembimbing] = useState<string>(currentUser.name);

  // Quick modal for single student click
  const [quickGradingStudent, setQuickGradingStudent] = useState<any | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === 'sudah'
          ? s.statusSetoranHariIni === 'LULUS' || s.statusSetoranHariIni === 'MENGULANG'
          : selectedStatus === 'belum'
          ? s.statusSetoranHariIni === 'BELUM SETOR'
          : s.statusSetoranHariIni === selectedStatus;
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm);
      return matchClass && matchStatus && matchSearch;
    });
  }, [students, selectedClass, selectedStatus, searchTerm]);

  // Statistics for today
  const total = students.length;
  const sudah = students.filter((s) => s.statusSetoranHariIni === 'LULUS' || s.statusSetoranHariIni === 'MENGULANG').length;
  const belum = students.filter((s) => s.statusSetoranHariIni === 'BELUM SETOR').length;
  const bimbingan = students.filter((s) => s.statusSetoranHariIni === 'DALAM BIMBINGAN' || s.statusSetoranHariIni === 'MENGULANG').length;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId) return;

    quickSetoran(formStudentId, formJenis, formMateri, formNilai, formStatus, formCatatan);
  };

  const handleQuickGradeSubmit = (status: SubmissionStatus, nilai: number) => {
    if (!quickGradingStudent) return;
    quickSetoran(
      quickGradingStudent.id,
      quickGradingStudent.yanbuaJilid === "Al-Qur'an" ? "Al-Qur'an" : "Yanbu'a",
      `Setoran Rutin: ${quickGradingStudent.yanbuaJilid} Hal ${quickGradingStudent.yanbuaHalaman}`,
      nilai,
      status,
      status === 'LULUS' ? 'Lancar dan tertib' : 'Perlu pengulangan'
    );
    setQuickGradingStudent(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-bold mb-2">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Presensi & Monitoring Setoran Harian</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Setoran Ngaji & Hafalan Hari Ini
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Pencatatan real-time setoran Yanbu'a, Doa Harian, dan Al-Qur'an santri hari ini ({selectedDate}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs font-bold text-emerald-100 font-mono focus:outline-hidden"
          />

          <button
            onClick={markTodayAllSubmitted}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-extrabold shadow-md transition-all hover:scale-102 cursor-pointer"
            title="Tandai seluruh santri sudah setoran dengan status LULUS"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tandai Semua Selesai</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Siswa</span>
          <span className="text-2xl font-extrabold text-slate-900">{total} Siswa</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Wajib bimbingan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Sudah Setoran</span>
          <span className="text-2xl font-extrabold text-emerald-800">{sudah} Siswa</span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">
            {Math.round((sudah / Math.max(total, 1)) * 100)}% kehadiran
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Belum Setoran</span>
          <span className="text-2xl font-extrabold text-slate-600">{belum} Siswa</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Menunggu giliran</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Perlu Bimbingan</span>
          <span className="text-2xl font-extrabold text-amber-800">{bimbingan} Siswa</span>
          <span className="text-[10px] text-amber-600 block mt-0.5">Mengulang / belum lancar</span>
        </div>
      </div>

      {/* Grid: Form Input Cepat + Daftar Siswa Hari Ini */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast Input Panel */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-emerald-50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Form Input Cepat Setoran</h3>
              <p className="text-[11px] text-slate-400">Catat langsung hasil setoran santri di majlis</p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pilih Santri *</label>
              <select
                value={formStudentId}
                onChange={(e) => {
                  setFormStudentId(e.target.value);
                  const st = students.find((s) => s.id === e.target.value);
                  if (st) {
                    setFormMateri(`${st.yanbuaJilid} Hal ${st.yanbuaHalaman + 1}`);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-900 font-bold"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class}) - Status: {s.statusSetoranHariIni}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jenis Setoran</label>
                <select
                  value={formJenis}
                  onChange={(e) => setFormJenis(e.target.value as any)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl font-bold text-emerald-900"
                >
                  <option value="Yanbu'a">Yanbu'a</option>
                  <option value="Doa Harian">Doa Harian</option>
                  <option value="Al-Qur'an">Al-Qur'an</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nilai (0-100)</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={formNilai}
                  onChange={(e) => setFormNilai(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-extrabold text-emerald-900"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Materi Disetorkan</label>
              <input
                type="text"
                required
                value={formMateri}
                onChange={(e) => setFormMateri(e.target.value)}
                placeholder="cth. Jilid 3 Hal 20 / Doa Masuk Masjid / An-Naba:1-15"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Status Hasil</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as SubmissionStatus)}
                className={`w-full px-3 py-2 border rounded-xl font-bold ${
                  formStatus === 'LULUS'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : formStatus === 'MENGULANG'
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-amber-300 bg-amber-50 text-amber-800'
                }`}
              >
                <option value="LULUS">LULUS (Lanjut Materi)</option>
                <option value="DALAM BIMBINGAN">DALAM BIMBINGAN</option>
                <option value="MENGULANG">MENGULANG</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Guru Pengampu</label>
              <select
                value={formPembimbing}
                onChange={(e) => setFormPembimbing(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-700"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Catatan Evaluasi Singkat</label>
              <input
                type="text"
                value={formCatatan}
                onChange={(e) => setFormCatatan(e.target.value)}
                placeholder="cth. Makhraj huruf shod & dho perlu diperbaiki"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Setoran Santri</span>
            </button>
          </form>
        </div>

        {/* Right Table: Students Status Today */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari siswa hari ini..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden text-slate-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Kelas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    Kelas {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
              >
                <option value="all">Semua Status</option>
                <option value="sudah">Sudah Setoran</option>
                <option value="belum">Belum Setoran</option>
                <option value="LULUS">LULUS</option>
                <option value="MENGULANG">MENGULANG</option>
                <option value="DALAM BIMBINGAN">DALAM BIMBINGAN</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-3 text-center">Kelas</th>
                    <th className="py-3 px-4">Posisi Saat Ini</th>
                    <th className="py-3 px-4 text-center">Status Hari Ini</th>
                    <th className="py-3 px-4 text-center">Tindakan Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        Tidak ada santri yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const isLulus = s.statusSetoranHariIni === 'LULUS';
                      const isMengulang = s.statusSetoranHariIni === 'MENGULANG';
                      const isBelum = s.statusSetoranHariIni === 'BELUM SETOR';

                      return (
                        <tr key={s.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{s.name}</span>
                            <span className="text-[10px] text-slate-400">NIS: {s.nis}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                              {s.class}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-900">
                            {s.yanbuaJilid} Hal {s.yanbuaHalaman}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              Doa: {s.doaMasteredCount}/20 &bull; Quran: Juz {s.quranJuz}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                isLulus
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : isMengulang
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : isBelum
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {s.statusSetoranHariIni}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  quickSetoran(
                                    s.id,
                                    s.yanbuaJilid === "Al-Qur'an" ? "Al-Qur'an" : "Yanbu'a",
                                    `${s.yanbuaJilid} Hal ${s.yanbuaHalaman + 1}`,
                                    88,
                                    'LULUS',
                                    'Lulus setoran harian lancar'
                                  );
                                }}
                                className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-[10px] transition-colors"
                                title="Beri nilai Lulus Langsung"
                              >
                                ✓ Lulus (88)
                              </button>
                              <button
                                onClick={() => {
                                  quickSetoran(
                                    s.id,
                                    s.yanbuaJilid === "Al-Qur'an" ? "Al-Qur'an" : "Yanbu'a",
                                    `${s.yanbuaJilid} Hal ${s.yanbuaHalaman}`,
                                    65,
                                    'MENGULANG',
                                    'Perlu pengulangan tajwid'
                                  );
                                }}
                                className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[10px] transition-colors"
                                title="Tandai Mengulang"
                              >
                                ↺ Ulang
                              </button>
                            </div>
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
      </div>
    </div>
  );
};
