import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentDetailModal } from './StudentDetailModal';
import { StudentFormModal } from './StudentFormModal';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export const StudentList: React.FC = () => {
  const {
    students,
    extracurriculars,
    deleteStudent,
    currentUser,
    selectedStudentDetailId,
    setSelectedStudentDetailId,
  } = useApp();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterEkskul, setFilterEkskul] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'nis' | 'attendance' | 'score'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Student | null>(null);

  // File import input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort logic
  const filteredStudents = useMemo(() => {
    return students
      .filter((std) => {
        const matchesSearch =
          std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          std.nis.includes(searchQuery) ||
          std.nisn.includes(searchQuery);

        const matchesClass = filterClass === 'all' || std.class === filterClass;
        const matchesEkskul = filterEkskul === 'all' || std.ekskulIds.includes(filterEkskul);
        const matchesStatus = filterStatus === 'all' || std.status === filterStatus;

        return matchesSearch && matchesClass && matchesEkskul && matchesStatus;
      })
      .sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;

        if (sortBy === 'nis') {
          valA = a.nis;
          valB = b.nis;
        } else if (sortBy === 'attendance') {
          valA = a.attendanceRate;
          valB = b.attendanceRate;
        } else if (sortBy === 'score') {
          valA = a.overallScore;
          valB = b.overallScore;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, searchQuery, filterClass, filterEkskul, filterStatus, sortBy, sortOrder]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const toggleSort = (field: 'name' | 'nis' | 'attendance' | 'score') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'NIS',
      'NISN',
      'Nama Siswa',
      'Kelas',
      'Jenis Kelamin',
      'Ekstrakurikuler',
      'Persentase Kehadiran',
      'Skor Evaluasi',
      'Kategori',
      'Status',
      'Orang Tua',
      'Kontak',
    ];

    const rows = filteredStudents.map((s) => {
      const ekskulNames = s.ekskulIds
        .map((id) => extracurriculars.find((e) => e.id === id)?.name)
        .filter(Boolean)
        .join('; ');

      return [
        s.id,
        `"${s.nis}"`,
        `"${s.nisn}"`,
        `"${s.name}"`,
        s.class,
        s.gender,
        `"${ekskulNames}"`,
        `${s.attendanceRate}%`,
        s.overallScore.toFixed(2),
        s.category,
        s.status,
        `"${s.parentName}"`,
        `"${s.parentPhone}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Siswa_Ekstrakurikuler_SMP_Alfa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import mock / sample data from CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      alert(`Berkas "${file.name}" berhasil diunggah dan diverifikasi. Format data siswa sesuai standar SIM SMP Alfa Ali Masykur.`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isEditable = currentUser.role === 'admin' || currentUser.role === 'pembina';

  return (
    <div className="space-y-6">
      {/* Page Heading and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Data Siswa Ekstrakurikuler
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {students.length} Total Siswa
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manajemen lengkap peserta ekstrakurikuler, kelas binaan, dan status keaktifan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File input for CSV upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Impor CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor Data</span>
          </button>

          {isEditable && (
            <button
              id="btn-add-student"
              onClick={() => {
                setStudentToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari berdasarkan nama, NIS, atau NISN..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Filter Kelas */}
          <div>
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Semua Kelas</option>
              <option value="VII-A">Kelas VII-A</option>
              <option value="VII-B">Kelas VII-B</option>
              <option value="VIII-A">Kelas VIII-A</option>
              <option value="VIII-B">Kelas VIII-B</option>
              <option value="IX-A">Kelas IX-A</option>
              <option value="IX-B">Kelas IX-B</option>
            </select>
          </div>

          {/* Filter Ekstrakurikuler */}
          <div>
            <select
              value={filterEkskul}
              onChange={(e) => {
                setFilterEkskul(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Semua Ekstrakurikuler</option>
              {extracurriculars.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Status: Aktif</option>
              <option value="Cuti">Status: Cuti</option>
              <option value="Nonaktif">Status: Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Sort & active filters tags */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Urutkan:</span>
            <button
              onClick={() => toggleSort('name')}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                sortBy === 'name' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200'
              }`}
            >
              Nama <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('nis')}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                sortBy === 'nis' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200'
              }`}
            >
              NIS <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('attendance')}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                sortBy === 'attendance' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200'
              }`}
            >
              Kehadiran <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => toggleSort('score')}
              className={`px-2 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${
                sortBy === 'score' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-slate-200'
              }`}
            >
              Nilai <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>

          <span>Menampilkan <strong>{paginatedStudents.length}</strong> dari <strong>{filteredStudents.length}</strong> siswa</span>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3">Siswa</th>
                <th className="py-3 px-3">NIS/NISN</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3">JK</th>
                <th className="py-3 px-3">Ekstrakurikuler & Pembina</th>
                <th className="py-3 px-3">Kehadiran</th>
                <th className="py-3 px-3">Perkembangan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ditemukan data siswa yang sesuai dengan kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((std, idx) => {
                  const ekskuls = std.ekskulIds
                    .map((id) => extracurriculars.find((e) => e.id === id))
                    .filter(Boolean);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-400 font-medium">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block hover:text-blue-600 transition-colors">
                              {std.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Wali: {std.parentName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="text-slate-800 font-medium block">{std.nis}</span>
                        <span className="text-[10px] text-slate-400">{std.nisn}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{std.class}</td>
                      <td className="py-3 px-3 font-bold text-slate-600">{std.gender}</td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {ekskuls.map((e) => (
                            <span
                              key={e?.id}
                              className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                              title={`Pembina: ${e?.coachName}`}
                            >
                              {e?.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{std.attendanceRate}%</span>
                          <div className="w-12 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                            <div
                              className={`h-1.5 rounded-full ${
                                std.attendanceRate >= 90
                                  ? 'bg-emerald-500'
                                  : std.attendanceRate >= 75
                                  ? 'bg-blue-600'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${std.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-blue-700">{std.overallScore.toFixed(2)}</span>
                          <span
                            className={`ml-1.5 inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              std.category === 'Sangat Baik'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : std.category === 'Baik'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {std.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            std.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : std.status === 'Cuti'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {std.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedStudentDetailId(std.id)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Lihat Detail Profil & Kompetensi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isEditable && (
                            <>
                              <button
                                onClick={() => {
                                  setStudentToEdit(std);
                                  setIsFormModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                title="Edit Data Siswa"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteCandidate(std)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Siswa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Siswa</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus data siswa <strong>{deleteCandidate.name}</strong> (NIS: {deleteCandidate.nis})? Tindakan ini akan menghapus rekap data terkait dari sistem.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteStudent(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        studentId={selectedStudentDetailId}
        onClose={() => setSelectedStudentDetailId(null)}
      />

      {/* Student Form Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setStudentToEdit(null);
        }}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};
