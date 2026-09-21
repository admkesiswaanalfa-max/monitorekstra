import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { StudentModal } from './StudentModal';

export const StudentManagementView: React.FC = () => {
  const {
    students,
    deleteStudent,
    setCurrentView,
    setSelectedStudentId,
    addStudent,
    classes,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm) ||
        s.nisn.includes(searchTerm);
      const matchClass = selectedClass === 'all' || s.class === selectedClass;
      const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchTerm, selectedClass, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${name}"?`)) {
      deleteStudent(id);
    }
  };

  const handleViewDetail = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('student_recap');
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'NIS',
      'NISN',
      'Nama Siswa',
      'Jenis Kelamin',
      'Kelas',
      'Wali Kelas',
      'Jilid Yanbua',
      'Halaman',
      'Doa Dikuasai',
      'Juz Quran',
      'Surat Terakhir',
      'Total Ayat',
      'Progress Pct',
      'Status Siswa',
    ];

    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.nis,
      s.nisn,
      `"${s.name}"`,
      s.gender,
      s.class,
      `"${s.waliKelas}"`,
      s.yanbuaJilid,
      s.yanbuaHalaman,
      s.doaMasteredCount,
      s.quranJuz,
      `"${s.quranSurah}"`,
      s.quranAyatCount,
      `${s.overallProgress}%`,
      s.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_siswa_smp_alfa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export CSV Berhasil', `${filteredStudents.length} data siswa berhasil diunduh.`);
  };

  // Import from CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      let count = 0;
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 4) {
          const name = cols[3] || cols[1] || 'Siswa Baru';
          const nis = cols[1] || `26${Math.floor(1000 + Math.random() * 9000)}`;
          const nisn = cols[2] || `008${Math.floor(1000000 + Math.random() * 9000000)}`;
          const gender = (cols[4] === 'P' ? 'P' : 'L') as any;
          const cls = cols[5] || '7A';
          addStudent({
            nis,
            nisn,
            name,
            gender,
            class: cls,
            waliKelas: 'Ustadz Abdullah Faqih, S.Pd.I',
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
            parentName: 'Wali Murid',
            phone: '081234567890',
            address: 'Mojotengah, Wonosobo',
            yanbuaJilid: 'Jilid 1',
            yanbuaHalaman: 1,
            yanbuaProgressPct: 15,
            doaMasteredCount: 2,
            quranJuz: 30,
            quranSurah: 'An-Naba:1-10',
            quranAyatCount: 10,
            quranTargetAyat: 564,
            statusSetoranHariIni: 'BELUM SETOR',
            status: 'Aktif',
            overallProgress: 20,
          });
          count++;
        }
      }
      showToast('Import CSV Selesai', `${count} data siswa berhasil ditambahkan.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>Master Data Siswa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Daftar Siswa SMP Alfa Ali Masykur
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {students.length} siswa terdaftar &bull; {students.filter((s) => s.status === 'Aktif').length} siswa aktif bimbingan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Import data siswa dari file CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
            title="Export data siswa ke file CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setStudentToEdit(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIS, atau NISN..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Kelas ({students.length})</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  Kelas {c.name} ({students.filter((s) => s.class === c.name).length})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Alumni">Alumni</option>
              <option value="Pindah">Pindah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-3">NIS / NISN</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-2 text-center">L/P</th>
                <th className="py-3 px-3 text-center">Kelas</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4">Jilid Yanbu'a</th>
                <th className="py-3 px-4">Target Hafalan</th>
                <th className="py-3 px-4">Progress Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-400">
                    Tidak ada siswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={student.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-400">{globalIdx}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        <span className="font-bold text-slate-800">{student.nis}</span>
                        <span className="block text-[10px] text-slate-400">{student.nisn}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block hover:text-emerald-800 transition-colors">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{student.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            student.gender === 'L' ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {student.gender}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold">
                          {student.class}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium truncate max-w-[140px]">
                        {student.waliKelas}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-emerald-900">
                          {student.yanbuaJilid} &bull; Hal {student.yanbuaHalaman}
                        </div>
                        <div className="w-24 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${student.yanbuaProgressPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600">
                        <div>Doa: <strong className="text-amber-800">{student.doaMasteredCount}/20</strong></div>
                        <div>Quran: <strong className="text-sky-800">{student.quranAyatCount} ayat</strong></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>{student.overallProgress}%</span>
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full"
                            style={{ width: `${student.overallProgress}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewDetail(student.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Lihat Rekap & Riwayat"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan{' '}
            <strong className="text-slate-900">
              {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            sampai{' '}
            <strong className="text-slate-900">
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
            </strong>{' '}
            dari <strong className="text-slate-900">{filteredStudents.length}</strong> siswa
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors ${
                  currentPage === page
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};
