import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Extracurricular } from '../../types';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import {
  Users,
  Search,
  UserPlus,
  Printer,
  Calendar,
  Award,
  CheckCircle2,
  Trash2,
  Filter,
  UserCheck,
  Building,
  GraduationCap,
  X,
} from 'lucide-react';

export const ParticipantsView: React.FC = () => {
  const {
    extracurriculars,
    students,
    updateStudent,
    updateExtracurricular,
    schoolInfo,
    showToast,
  } = useApp();

  const [selectedEkskulId, setSelectedEkskulId] = useState<string>(
    extracurriculars[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState<string>('');

  const currentEkskul = useMemo(() => {
    return extracurriculars.find((e) => e.id === selectedEkskulId) || extracurriculars[0];
  }, [extracurriculars, selectedEkskulId]);

  // Students enrolled in this ekskul
  const enrolledStudents = useMemo(() => {
    if (!currentEkskul) return [];
    return students.filter((s) => s.ekskulIds?.includes(currentEkskul.id));
  }, [students, currentEkskul]);

  // Filtered enrolled students based on search
  const filteredEnrolled = useMemo(() => {
    return enrolledStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nis.includes(searchQuery) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enrolledStudents, searchQuery]);

  // Students eligible to be added (not currently enrolled in this ekskul)
  const eligibleStudents = useMemo(() => {
    if (!currentEkskul) return [];
    return students.filter((s) => !s.ekskulIds?.includes(currentEkskul.id));
  }, [students, currentEkskul]);

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentToAdd || !currentEkskul) return;

    const studentObj = students.find((s) => s.id === selectedStudentToAdd);
    if (!studentObj) return;

    const currentEkskulIds = studentObj.ekskulIds || [];
    if (currentEkskulIds.includes(currentEkskul.id)) {
      showToast('Sudah Terdaftar', 'Siswa ini sudah terdaftar pada ekstrakurikuler ini.', 'info');
      return;
    }

    // Add ekskul to student
    updateStudent(studentObj.id, {
      ekskulIds: [...currentEkskulIds, currentEkskul.id],
    });

    // Update count in extracurricular
    updateExtracurricular(currentEkskul.id, {
      enrolled: (currentEkskul.enrolled || enrolledStudents.length) + 1,
    });

    showToast(
      'Pendaftaran Berhasil',
      `${studentObj.name} resmi terdaftar di ${currentEkskul.name}.`,
      'success'
    );
    setSelectedStudentToAdd('');
    setIsAddModalOpen(false);
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (!currentEkskul) return;
    if (confirm(`Keluarkan ${studentName} dari keanggotaan ${currentEkskul.name}?`)) {
      const studentObj = students.find((s) => s.id === studentId);
      if (studentObj) {
        updateStudent(studentId, {
          ekskulIds: (studentObj.ekskulIds || []).filter((id) => id !== currentEkskul.id),
        });

        updateExtracurricular(currentEkskul.id, {
          enrolled: Math.max(0, (currentEkskul.enrolled || 1) - 1),
        });

        showToast('Anggota Dikeluarkan', `${studentName} telah dihapus dari daftar anggota.`, 'info');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Manajemen Anggota Ekstrakurikuler</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Daftar Peserta & Anggota Ekstrakurikuler
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Kelola distribusi peserta, pendaftaran anggota baru ke cabang kegiatan, dan cetak daftar nominasi resmi santri.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Daftar</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Anggota</span>
          </button>
        </div>
      </div>

      {/* Extracurricular Selector Chips */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
          Pilih Cabang Ekstrakurikuler (12 Cabang):
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {extracurriculars.map((e) => {
            const isSelected = e.id === currentEkskul?.id;
            return (
              <button
                key={e.id}
                onClick={() => setSelectedEkskulId(e.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{e.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {students.filter((s) => s.ekskulIds?.includes(e.id)).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Ekskul Info Card */}
      {currentEkskul && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-800">Cabang & Kategori</div>
              <div className="text-base font-extrabold text-emerald-950 mt-0.5">{currentEkskul.name}</div>
              <div className="text-xs text-emerald-700">{currentEkskul.category}</div>
            </div>

            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
              <div className="text-[11px] font-bold text-blue-800">Guru Pembina / Pelatih</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{currentEkskul.coachName}</div>
              <div className="text-xs text-slate-500">Pendamping: {currentEkskul.trainerName || '-'}</div>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100">
              <div className="text-[11px] font-bold text-amber-800">Jadwal & Lokasi</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{currentEkskul.schedule || `${currentEkskul.day}, ${currentEkskul.time}`}</div>
              <div className="text-xs text-slate-500">{currentEkskul.location}</div>
            </div>

            <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-100">
              <div className="text-[11px] font-bold text-purple-800">Kapasitas & Kuota</div>
              <div className="text-base font-extrabold text-purple-950 mt-0.5">
                {enrolledStudents.length} / {currentEkskul.quota} Siswa
              </div>
              <div className="text-xs text-purple-700">
                Sisa kuota: {Math.max(0, currentEkskul.quota - enrolledStudents.length)} kursi
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Enrolled Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, NIS, kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="text-xs text-slate-500">
            Menampilkan <strong>{filteredEnrolled.length}</strong> anggota terdaftar
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NIS / NISN</th>
                <th className="py-3 px-4 text-center">Kelas</th>
                <th className="py-3 px-4 text-center">L/P</th>
                <th className="py-3 px-4 text-center">Kehadiran</th>
                <th className="py-3 px-4 text-center">Predikat</th>
                <th className="py-3 px-4 text-center">Wali Kelas</th>
                <th className="py-3 px-4 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrolled.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada siswa terdaftar pada cabang ini yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredEnrolled.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-500">{student.nickname || '-'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {student.nis}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      {student.gender === 'L' ? (
                        <span className="text-blue-600">L</span>
                      ) : (
                        <span className="text-rose-600">P</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${
                          student.attendanceRate >= 85
                            ? 'text-emerald-700'
                            : student.attendanceRate >= 75
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {student.category || 'Baik'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {student.waliKelas || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleRemoveStudent(student.id, student.name)}
                        title="Keluarkan dari Ekskul"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student to Ekskul Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Daftarkan Anggota ke {currentEkskul?.name}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Siswa (Belum Terdaftar di {currentEkskul?.name})
                </label>
                <select
                  value={selectedStudentToAdd}
                  onChange={(e) => setSelectedStudentToAdd(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {eligibleStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class}) - NIS: {s.nis}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tersedia {eligibleStudents.length} siswa yang belum masuk ke cabang ini.
                </p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                <strong>Catatan:</strong> Siswa yang ditambahkan akan langsung tercatat pada presensi kegiatan dan penilaian kompetensi cabang <strong>{currentEkskul?.name}</strong>.
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudentToAdd}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white shadow-md cursor-pointer"
                >
                  Daftarkan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print Layout */}
      {currentEkskul && (
        <div className="hidden print:block font-serif text-slate-950 p-4">
          <OfficialLetterhead readOnly />

          <div className="text-center my-4 pb-2 border-b border-slate-800">
            <h2 className="text-base font-black uppercase tracking-wider">
              DAFTAR NOMINASI PESERTA EKSTRAKURIKULER
            </h2>
            <p className="text-xs font-bold uppercase mt-0.5">
              CABANG: {currentEkskul.name} ({currentEkskul.category})
            </p>
            <p className="text-[11px] text-slate-600">
              Tahun Ajaran {schoolInfo.academicYear} • Hari Latihan: {currentEkskul.schedule || currentEkskul.day}
            </p>
          </div>

          <div className="text-xs mb-3 flex justify-between">
            <div>
              Pembina: <strong>{currentEkskul.coachName}</strong>
            </div>
            <div>
              Total Anggota: <strong>{enrolledStudents.length} Siswa</strong>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-800 p-2 text-center w-8">No</th>
                <th className="border border-slate-800 p-2 text-left">Nama Siswa</th>
                <th className="border border-slate-800 p-2 text-center w-24">NIS</th>
                <th className="border border-slate-800 p-2 text-center w-16">Kelas</th>
                <th className="border border-slate-800 p-2 text-center w-12">L/P</th>
                <th className="border border-slate-800 p-2 text-center w-20">Kehadiran</th>
                <th className="border border-slate-800 p-2 text-center w-24">Predikat</th>
                <th className="border border-slate-800 p-2 text-center w-32">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {enrolledStudents.map((s, idx) => (
                <tr key={s.id} className="border-b border-slate-800">
                  <td className="border border-slate-800 p-2 text-center">{idx + 1}</td>
                  <td className="border border-slate-800 p-2 font-bold">{s.name}</td>
                  <td className="border border-slate-800 p-2 text-center">{s.nis}</td>
                  <td className="border border-slate-800 p-2 text-center">{s.class}</td>
                  <td className="border border-slate-800 p-2 text-center font-bold">{s.gender}</td>
                  <td className="border border-slate-800 p-2 text-center">{s.attendanceRate}%</td>
                  <td className="border border-slate-800 p-2 text-center">{s.category || 'Baik'}</td>
                  <td className="border border-slate-800 p-2 text-center">Aktif</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="mt-8 pt-4 flex justify-between items-start text-xs">
            <div className="text-center w-64">
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala SMP Alfa Ali Masykur</p>
              <div className="h-20" />
              <p className="font-bold underline">{schoolInfo.principal || 'Afif Mashadi, S.S.'}</p>
              <p>NIP. {schoolInfo.principalNip || '19780512 200501 1 007'}</p>
            </div>

            <div className="text-center w-64">
              <p>Wonosobo, {new Date().toLocaleDateString('id-ID')}</p>
              <p className="font-bold">Guru Pembina / Pelatih</p>
              <div className="h-20" />
              <p className="font-bold underline">{currentEkskul.coachName}</p>
              <p>NIP. {currentEkskul.coachNip || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
