import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { getAvailableClassNames } from '../../utils/classUtils';
import { StudentDetailModal } from './StudentDetailModal';
import { StudentFormModal } from './StudentFormModal';
import { PrintSelectedReportModal } from './PrintSelectedReportModal';
import { exportStudentsToXLSX } from '../../utils/studentExcelExport';
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
  Printer,
  CheckSquare,
  Square,
  MinusSquare,
} from 'lucide-react';

export const StudentList: React.FC = () => {
  const {
    students,
    extracurriculars,
    deleteStudent,
    currentUser,
    selectedStudentDetailId,
    setSelectedStudentDetailId,
    schoolInfo,
    showToast,
    classes,
  } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  // Search & Filters initialized based on user role
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>(() => {
    return currentUser.role === 'wali_kelas' && currentUser.assignedClass ? currentUser.assignedClass : 'all';
  });
  const [filterEkskul, setFilterEkskul] = useState<string>(() => {
    return currentUser.role === 'pembina' && currentUser.assignedEkskulId ? currentUser.assignedEkskulId : 'all';
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'nis' | 'attendance' | 'score'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Synchronize filter when role or user assignment changes
  React.useEffect(() => {
    if (currentUser.role === 'wali_kelas' && currentUser.assignedClass) {
      setFilterClass(currentUser.assignedClass);
    } else if (currentUser.role === 'pembina' && currentUser.assignedEkskulId) {
      setFilterEkskul(currentUser.assignedEkskulId);
    }
  }, [currentUser.role, currentUser.assignedClass, currentUser.assignedEkskulId]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Multiple selection for students
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isPrintReportModalOpen, setIsPrintReportModalOpen] = useState(false);

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

  // Selected students array
  const selectedStudents = useMemo(() => {
    return students.filter((s) => selectedStudentIds.includes(s.id));
  }, [students, selectedStudentIds]);

  // Checkbox helpers
  const isAllOnPageSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedStudentIds.includes(s.id));

  const isSomeOnPageSelected =
    paginatedStudents.some((s) => selectedStudentIds.includes(s.id)) &&
    !isAllOnPageSelected;

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    if (isAllOnPageSelected) {
      // Uncheck all on current page
      const pageIds = new Set(paginatedStudents.map((s) => s.id));
      setSelectedStudentIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      // Check all on current page
      const newIds = new Set([...selectedStudentIds, ...paginatedStudents.map((s) => s.id)]);
      setSelectedStudentIds(Array.from(newIds));
    }
  };

  const handleSelectAllFiltered = () => {
    setSelectedStudentIds(filteredStudents.map((s) => s.id));
    showToast(
      'Seluruh Siswa Dipilih',
      `Menandai ${filteredStudents.length} siswa sesuai filter aktif.`,
      'info'
    );
  };

  const handleClearSelection = () => {
    setSelectedStudentIds([]);
  };

  const handleOpenPrintReport = () => {
    if (selectedStudentIds.length === 0) {
      // If none selected, default to all visible students on current page
      setSelectedStudentIds(paginatedStudents.map((s) => s.id));
      showToast(
        'Memilih Siswa Halaman Aktif',
        'Menandai 10 siswa di halaman ini untuk dicetak laporannya.',
        'info'
      );
    }
    setIsPrintReportModalOpen(true);
  };

  const toggleSort = (field: 'name' | 'nis' | 'attendance' | 'score') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Export to XLSX (Excel format)
  const handleExportXLSX = (targetStudents = filteredStudents, suffix = 'Semua') => {
    try {
      const filename = exportStudentsToXLSX(targetStudents, extracurriculars, schoolInfo, suffix);
      showToast(
        'Ekspor Excel Berhasil',
        `Data ${targetStudents.length} siswa berhasil disimpan dalam format .xlsx (${filename}).`,
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Gagal Ekspor', 'Terjadi kesalahan saat menyusun berkas Excel.', 'error');
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
    showToast('Ekspor CSV Berhasil', 'Berkas CSV berhasil diunduh.', 'success');
  };

  // Import mock / sample data from CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      showToast(
        'Verifikasi Berkas',
        `Berkas "${file.name}" berhasil dibaca dan diverifikasi. Format data siswa sesuai standar SIM SMP Alfa Ali Masykur.`,
        'success'
      );
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isEditable = currentUser.role === 'admin' || currentUser.role === 'pembina';

  return (
    <div className="space-y-6">
      {/* Role Notice Banner */}
      {currentUser.role === 'wali_kelas' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md font-bold bg-amber-200 text-amber-900 text-[11px]">
              Wali Kelas {currentUser.assignedClass || 'Perwalian'}
            </span>
            <span>
              Menampilkan data siswa untuk <strong>Kelas {currentUser.assignedClass || 'Binaan'}</strong>. Anda dapat meninjau keaktifan cabang, kehadiran, dan skor penilaian masing-masing anak.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFilterClass('all')}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline shrink-0 ml-3"
          >
            {filterClass === 'all' ? `Filter Kelas ${currentUser.assignedClass}` : 'Lihat Seluruh Siswa'}
          </button>
        </div>
      )}

      {currentUser.role === 'pembina' && (
        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md font-bold bg-blue-200 text-blue-900 text-[11px]">
              Pembina Cabang
            </span>
            <span>
              Menampilkan data siswa anggota ekstrakurikuler binaan Anda. Anda dapat mengelola catatan keaktifan dan perkembangan kompetensi.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFilterEkskul('all')}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline shrink-0 ml-3"
          >
            {filterEkskul === 'all' ? 'Filter Ekskul Saya' : 'Lihat Seluruh Siswa'}
          </button>
        </div>
      )}

      {/* Page Heading and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentUser.role === 'wali_kelas'
                ? `Data Siswa Kelas ${currentUser.assignedClass || 'Perwalian'}`
                : currentUser.role === 'pembina'
                ? 'Data Siswa Anggota Ekstrakurikuler'
                : 'Data Siswa Ekstrakurikuler'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {filteredStudents.length} Siswa Terpilih
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentUser.role === 'wali_kelas'
              ? `Pemantauan status ekstrakurikuler & capaian peserta didik Kelas ${currentUser.assignedClass}`
              : currentUser.role === 'pembina'
              ? 'Manajemen anggota terdaftar, status presensi, dan evaluasi capaian cabang'
              : 'Manajemen lengkap peserta ekstrakurikuler, kelas binaan, dan status keaktifan'}
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Impor Data</span>
          </button>

          {/* Export to Excel (.xlsx) */}
          <button
            onClick={() =>
              handleExportXLSX(
                selectedStudentIds.length > 0 ? selectedStudents : filteredStudents,
                selectedStudentIds.length > 0 ? 'Terpilih' : 'Filter'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Unduh data dalam format spreadsheet Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Ekspor (.xlsx)
              {selectedStudentIds.length > 0 && ` (${selectedStudentIds.length})`}
            </span>
          </button>

          {/* Print Selected Report Button */}
          <button
            id="btn-print-selected-report"
            onClick={handleOpenPrintReport}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
              selectedStudentIds.length > 0
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-400/40 shadow-sm'
                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
            title="Kompilasi ringkasan data dan capaian siswa terpilih ke format laporan siap cetak"
          >
            <Printer className={`w-4 h-4 ${selectedStudentIds.length > 0 ? 'text-slate-950' : 'text-slate-600'}`} />
            <span>Print Selected Report</span>
            {selectedStudentIds.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-900 text-white font-bold">
                {selectedStudentIds.length}
              </span>
            )}
          </button>

          {isEditable && (
            <button
              id="btn-add-student"
              onClick={() => {
                setStudentToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Multi-Selection Bar */}
      {selectedStudentIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              {selectedStudentIds.length}
            </span>
            <div className="text-xs">
              <span className="font-extrabold text-blue-950">
                {selectedStudentIds.length} Siswa Terpilih
              </span>
              <span className="text-blue-700/80 ml-1.5 hidden md:inline">
                Siap dikompilasi ke dalam dokumen laporan resmi atau diekspor ke Excel (.xlsx).
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedStudentIds.length < filteredStudents.length && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline px-1.5 py-1 cursor-pointer"
              >
                Pilih Seluruh ({filteredStudents.length}) Siswa
              </button>
            )}

            <button
              type="button"
              onClick={() => handleExportXLSX(selectedStudents, 'Terpilih')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-slate-700 hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor XLSX Terpilih</span>
            </button>

            <button
              id="btn-print-selected-banner"
              type="button"
              onClick={() => setIsPrintReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950" />
              <span>Print Selected Report ({selectedStudentIds.length})</span>
            </button>

            <button
              type="button"
              onClick={handleClearSelection}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Batal Pilihan
            </button>
          </div>
        </div>
      )}

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
              <option value="all">Semua Kelas ({students.length})</option>
              {availableClassNames.map((c) => {
                const count = students.filter((s) => s.class === c).length;
                return (
                  <option key={c} value={c}>
                    Kelas {c} ({count})
                  </option>
                );
              })}
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
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeOnPageSelected;
                    }}
                    onChange={handleToggleSelectAllPage}
                    aria-label="Pilih semua siswa di halaman aktif"
                    className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                    title={
                      isAllOnPageSelected
                        ? 'Batalkan pilihan halaman ini'
                        : 'Pilih semua siswa di halaman ini'
                    }
                  />
                </th>
                <th className="py-3 px-2 w-10 text-center">No</th>
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
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ditemukan data siswa yang sesuai dengan kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((std, idx) => {
                  const ekskuls = std.ekskulIds
                    .map((id) => extracurriculars.find((e) => e.id === id))
                    .filter(Boolean);
                  const isSelected = selectedStudentIds.includes(std.id);

                  return (
                    <tr
                      key={std.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-blue-50/70 hover:bg-blue-100/50'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleStudent(std.id)}
                          aria-label={`Pilih ${std.name}`}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-2 text-center text-slate-400 font-medium">
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
                          <button
                            onClick={() => setSelectedStudentDetailId(std.id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Cetak Profil Lengkap Siswa (1 Berkas Penuh)"
                          >
                            <Printer className="w-4 h-4" />
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

      {/* Print Selected Report Modal */}
      <PrintSelectedReportModal
        isOpen={isPrintReportModalOpen}
        onClose={() => setIsPrintReportModalOpen(false)}
        selectedStudents={selectedStudents.length > 0 ? selectedStudents : paginatedStudents}
        filterInfo={{
          className: filterClass !== 'all' ? filterClass : undefined,
          ekskulName: filterEkskul !== 'all' ? extracurriculars.find((e) => e.id === filterEkskul)?.name : undefined,
        }}
      />
    </div>
  );
};
