import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassInfo } from '../../types';
import {
  GraduationCap,
  Plus,
  Search,
  Users,
  Building,
  Edit2,
  Trash2,
  Download,
  Printer,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { RombelClassModal } from './RombelClassModal';
import { RombelStudentRosterModal } from './RombelStudentRosterModal';

export const RombelClassSettings: React.FC = () => {
  const { classes, students, schoolInfo, deleteClass } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [selectedRosterClass, setSelectedRosterClass] = useState<ClassInfo | null>(null);

  const [deleteConfirmClass, setDeleteConfirmClass] = useState<ClassInfo | null>(null);

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      // Grade filter
      if (selectedGrade !== 'all' && c.grade !== selectedGrade) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && (c.status || 'Aktif') !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchCode = (c.rombelCode || '').toLowerCase().includes(q);
        const matchWali = (c.waliKelas || '').toLowerCase().includes(q);
        const matchRoom = (c.room || '').toLowerCase().includes(q);
        const matchNotes = (c.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchWali && !matchRoom && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [classes, selectedGrade, selectedStatus, searchQuery]);

  // Overall calculations & metrics
  const metrics = useMemo(() => {
    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => (c.status || 'Aktif') === 'Aktif').length;

    // Student counts per class
    const studentCountMap: { [className: string]: { total: number; l: number; p: number } } = {};
    let totalEnrolled = 0;
    let totalL = 0;
    let totalP = 0;

    students.forEach((s) => {
      totalEnrolled++;
      if (s.gender === 'L') totalL++;
      if (s.gender === 'P') totalP++;

      if (!studentCountMap[s.class]) {
        studentCountMap[s.class] = { total: 0, l: 0, p: 0 };
      }
      studentCountMap[s.class].total += 1;
      if (s.gender === 'L') studentCountMap[s.class].l += 1;
      if (s.gender === 'P') studentCountMap[s.class].p += 1;
    });

    const totalCapacity = classes.reduce((acc, c) => acc + (c.capacity || 32), 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    const grade7Count = classes.filter((c) => c.grade === '7').length;
    const grade8Count = classes.filter((c) => c.grade === '8').length;
    const grade9Count = classes.filter((c) => c.grade === '9').length;

    return {
      totalClasses,
      activeClasses,
      totalEnrolled,
      totalL,
      totalP,
      totalCapacity,
      occupancyRate,
      grade7Count,
      grade8Count,
      grade9Count,
      studentCountMap,
    };
  }, [classes, students]);

  // Handle open add modal
  const handleOpenAdd = () => {
    setEditingClass(null);
    setIsClassModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (c: ClassInfo) => {
    setEditingClass(c);
    setIsClassModalOpen(true);
  };

  // Handle open roster modal
  const handleOpenRoster = (c: ClassInfo) => {
    setSelectedRosterClass(c);
    setIsRosterModalOpen(true);
  };

  // Handle delete
  const handleConfirmDelete = () => {
    if (!deleteConfirmClass) return;
    deleteClass(deleteConfirmClass.id);
    setDeleteConfirmClass(null);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = classes.map((c, idx) => {
      const classStudentInfo = metrics.studentCountMap[c.name] || { total: 0, l: 0, p: 0 };
      const cap = c.capacity || 32;
      const pct = Math.round((classStudentInfo.total / cap) * 100);

      return {
        No: idx + 1,
        'Kode Rombel': c.rombelCode || `RBL-${c.name.replace(/[^a-zA-Z0-9]/g, '')}`,
        'Nama Kelas / Rombel': c.name,
        'Tingkat / Jenjang': `Kelas ${c.grade || '7'}`,
        'Wali Kelas': c.waliKelas,
        'NIP Wali Kelas': c.waliKelasNip || '-',
        'Ruang Belajar': c.room || '-',
        'Kapasitas (Kursi)': cap,
        'Siswa Terdaftar': classStudentInfo.total,
        'Siswa Laki-laki': classStudentInfo.l,
        'Siswa Perempuan': classStudentInfo.p,
        'Tingkat Keterisian (%)': `${pct}%`,
        'Tahun Ajaran': c.academicYear || schoolInfo.academicYear,
        Semester: c.semester || schoolInfo.semester,
        'Ketua Kelas': c.classLeader || '-',
        Status: c.status || 'Aktif',
        'Catatan / Kekhususan': c.notes || '-',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Rombel_Kelas');

    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 14 },
      { wch: 20 },
      { wch: 14 },
      { wch: 28 },
      { wch: 22 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 30 },
    ];

    XLSX.writeFile(workbook, `Data_Rombel_Kelas_${schoolInfo.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  };

  // Print class data list
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daftar Rombongan Belajar (Rombel) - ${schoolInfo.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; font-size: 10pt; }
          .header { text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 12px; margin-bottom: 16px; }
          .school-title { font-size: 15pt; font-weight: bold; text-transform: uppercase; color: #065f46; }
          .sub-title { font-size: 11pt; font-weight: bold; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 9pt; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; }
          .center { text-align: center; }
          .right { text-align: right; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
          .sign-box { text-align: center; width: 220px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-title">${schoolInfo.name}</div>
          <div style="font-size: 9pt; color: #475569;">${schoolInfo.address || 'Wonosobo, Jawa Tengah'}</div>
          <div class="sub-title">DATA MASTER ROMBONGAN BELAJAR (ROMBEL) KELAS</div>
          <div style="font-size: 9pt;">Tahun Ajaran ${schoolInfo.academicYear} • Semester ${schoolInfo.semester}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="center" style="width: 30px;">No</th>
              <th style="width: 75px;">Kode</th>
              <th>Nama Rombel</th>
              <th class="center" style="width: 55px;">Tingkat</th>
              <th>Wali Kelas</th>
              <th>Ruang Belajar</th>
              <th class="center" style="width: 55px;">Kapasitas</th>
              <th class="center" style="width: 55px;">Terdaftar</th>
              <th class="center" style="width: 55px;">Keterisian</th>
              <th class="center" style="width: 55px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${classes
              .map((c, i) => {
                const info = metrics.studentCountMap[c.name] || { total: 0 };
                const cap = c.capacity || 32;
                const pct = Math.round((info.total / cap) * 100);
                return `
                <tr>
                  <td class="center">${i + 1}</td>
                  <td>${c.rombelCode || '-'}</td>
                  <td><strong>${c.name}</strong></td>
                  <td class="center">Kelas ${c.grade || '7'}</td>
                  <td>${c.waliKelas}</td>
                  <td>${c.room || '-'}</td>
                  <td class="center">${cap}</td>
                  <td class="center">${info.total}</td>
                  <td class="center">${pct}%</td>
                  <td class="center">${c.status || 'Aktif'}</td>
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>

        <div style="margin-top: 16px; font-size: 9pt; color: #475569;">
          <strong>Ringkasan:</strong> Total Rombel: ${classes.length} • Total Santri: ${metrics.totalEnrolled} • Daya Tampung: ${metrics.totalCapacity} Kursi (${metrics.occupancyRate}% Terisi)
        </div>

        <div class="signatures">
          <div class="sign-box">
            <div>Mengetahui,</div>
            <div>Kepala Sekolah</div>
            <div style="margin-top: 60px; font-weight: bold; text-decoration: underline;">${schoolInfo.principal}</div>
            <div style="font-size: 8.5pt;">NIP. ${schoolInfo.principalNip || '-'}</div>
          </div>
          <div class="sign-box">
            <div>Wonosobo, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Wakasek Kurikulum & Kesiswaan</div>
            <div style="margin-top: 60px; font-weight: bold; text-decoration: underline;">Yulianti, S.Pd.</div>
            <div style="font-size: 8.5pt;">NIP. 19820714 200801 2 011</div>
          </div>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div id="rombel-class-settings-section" className="space-y-6">
      {/* Top Banner & Action Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Manajemen Rombel
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Tahun Ajaran {schoolInfo.academicYear} ({schoolInfo.semester})
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <span>Pengaturan Data Rombongan Belajar (Rombel) Kelas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Kelola rombel kelas aktif, penetapan wali kelas, ruang belajar, kapasitas daya tampung, serta monitoring santri terdaftar.
          </p>
        </div>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            id="btn-export-rombel-xlsx"
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Unduh seluruh data rombel dalam berkas Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ekspor .xlsx</span>
          </button>

          <button
            type="button"
            id="btn-print-rombel-data"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Cetak format cetak resmi data rombel"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Data</span>
          </button>

          <button
            type="button"
            id="btn-add-new-rombel"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rombel Kelas</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Rombel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Rombel</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{metrics.totalClasses}</span>
              <span className="text-xs font-medium text-emerald-700">({metrics.activeClasses} Aktif)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              VII: {metrics.grade7Count} • VIII: {metrics.grade8Count} • IX: {metrics.grade9Count}
            </p>
          </div>
        </div>

        {/* Metric 2: Total Siswa */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Santri Terdaftar</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{metrics.totalEnrolled}</span>
              <span className="text-xs font-medium text-slate-500">Santri</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {metrics.totalL} Laki-laki • {metrics.totalP} Perempuan
            </p>
          </div>
        </div>

        {/* Metric 3: Kapasitas Ruang */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Daya Tampung</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{metrics.totalCapacity}</span>
              <span className="text-xs font-medium text-amber-700">({metrics.occupancyRate}% Terisi)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Tersedia {Math.max(0, metrics.totalCapacity - metrics.totalEnrolled)} kursi kosong
            </p>
          </div>
        </div>

        {/* Metric 4: Wali Kelas */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Wali Kelas</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{metrics.totalClasses}</span>
              <span className="text-xs font-medium text-teal-700">Guru Terpilih</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              100% Rombel memiliki wali kelas
            </p>
          </div>
        </div>
      </div>

      {/* Filter & View Controls Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 grow">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              id="search-rombel-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kelas, wali, atau ruang..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
            />
          </div>

          {/* Grade filter */}
          <select
            id="filter-grade-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
          >
            <option value="all">Semua Tingkat</option>
            <option value="7">Kelas VII</option>
            <option value="8">Kelas VIII</option>
            <option value="9">Kelas IX</option>
          </select>

          {/* Status filter */}
          <select
            id="filter-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>

          {(searchQuery || selectedGrade !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              id="btn-reset-rombel-filters"
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('all');
                setSelectedStatus('all');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            id="btn-view-grid"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kartu</span>
          </button>
          <button
            type="button"
            id="btn-view-table"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tabel</span>
          </button>
        </div>
      </div>

      {/* Rombel Content: Empty State */}
      {filteredClasses.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada rombel ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada rombongan belajar kelas yang cocok dengan filter atau kata kunci pencarian.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rombel Baru</span>
          </button>
        </div>
      )}

      {/* View Mode: Card Grid */}
      {filteredClasses.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((c) => {
            const studentInfo = metrics.studentCountMap[c.name] || { total: 0, l: 0, p: 0 };
            const cap = c.capacity || 32;
            const pct = Math.round((studentInfo.total / cap) * 100);
            const isFull = studentInfo.total >= cap;

            return (
              <div
                key={c.id}
                id={`rombel-card-${c.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          c.grade === '7'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : c.grade === '8'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        Kelas {c.grade || '7'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {c.rombelCode || `RBL-${c.name}`}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (c.status || 'Aktif') === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.status || 'Aktif'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3.5">
                    {/* Class Name & Room */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.room || 'Ruang Belajar Reguler'}</span>
                      </p>
                    </div>

                    {/* Wali Kelas Info */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {c.waliKelas.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">Wali Kelas</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{c.waliKelas}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {c.waliKelasNip ? `NIP. ${c.waliKelasNip}` : 'Wali Kelas Terdaftar'}
                        </p>
                      </div>
                    </div>

                    {/* Capacity & Occupancy Progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-600">Keterisian Siswa</span>
                        <span className="font-bold text-slate-900">
                          {studentInfo.total} / {cap}{' '}
                          <span
                            className={`text-[10px] ${
                              isFull ? 'text-rose-600' : pct >= 80 ? 'text-amber-600' : 'text-emerald-700'
                            }`}
                          >
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isFull
                              ? 'bg-rose-500'
                              : pct >= 80
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>L: {studentInfo.l} santri</span>
                        <span>P: {studentInfo.p} santri</span>
                        <span>{isFull ? 'Penuh' : `Sisa ${cap - studentInfo.total} kursi`}</span>
                      </div>
                    </div>

                    {/* Ketua Kelas or Notes if present */}
                    {(c.classLeader || c.notes) && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100 space-y-0.5">
                        {c.classLeader && (
                          <p>
                            <span className="font-semibold text-slate-700">Ketua Kelas:</span> {c.classLeader}
                          </p>
                        )}
                        {c.notes && (
                          <p className="text-slate-500 italic text-[10px] line-clamp-1">
                            &quot;{c.notes}&quot;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    id={`btn-view-students-${c.id}`}
                    onClick={() => handleOpenRoster(c)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Lihat Siswa ({studentInfo.total})</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      id={`btn-edit-rombel-${c.id}`}
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                      title="Edit Data Rombel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      id={`btn-delete-rombel-${c.id}`}
                      onClick={() => setDeleteConfirmClass(c)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Rombel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode: Table (Dapodik Style) */}
      {filteredClasses.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3.5 text-center w-12">No</th>
                  <th className="py-3 px-3.5">Kode Rombel</th>
                  <th className="py-3 px-3.5">Nama Kelas</th>
                  <th className="py-3 px-3.5 text-center">Tingkat</th>
                  <th className="py-3 px-3.5">Wali Kelas</th>
                  <th className="py-3 px-3.5">Ruang Belajar</th>
                  <th className="py-3 px-3.5 text-center">Daya Tampung</th>
                  <th className="py-3 px-3.5 text-center">Terdaftar (L/P)</th>
                  <th className="py-3 px-3.5 text-center">Keterisian</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.map((c, idx) => {
                  const studentInfo = metrics.studentCountMap[c.name] || { total: 0, l: 0, p: 0 };
                  const cap = c.capacity || 32;
                  const pct = Math.round((studentInfo.total / cap) * 100);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3.5 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-mono font-semibold text-slate-700">
                        {c.rombelCode || `RBL-${c.name}`}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-900 text-sm">
                        {c.name}
                        {c.notes && (
                          <p className="text-[10px] text-slate-400 font-normal line-clamp-1">{c.notes}</p>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.grade === '7'
                              ? 'bg-blue-50 text-blue-700'
                              : c.grade === '8'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          Kelas {c.grade || '7'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <p className="font-semibold text-slate-800">{c.waliKelas}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {c.waliKelasNip ? `NIP. ${c.waliKelasNip}` : '-'}
                        </p>
                      </td>
                      <td className="py-3 px-3.5 text-slate-600">{c.room || '-'}</td>
                      <td className="py-3 px-3.5 text-center font-bold text-slate-700">{cap}</td>
                      <td className="py-3 px-3.5 text-center">
                        <span className="font-bold text-slate-900">{studentInfo.total}</span>{' '}
                        <span className="text-[10px] text-slate-400">
                          ({studentInfo.l}L / {studentInfo.p}P)
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`font-bold ${
                            pct >= 100
                              ? 'text-rose-600'
                              : pct >= 80
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            (c.status || 'Aktif') === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.status || 'Aktif'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenRoster(c)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Lihat Daftar Siswa"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Rombel"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmClass(c)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus Rombel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rombel Add/Edit Modal */}
      <RombelClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        editingClass={editingClass}
      />

      {/* Student Roster View Modal */}
      <RombelStudentRosterModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        classInfo={selectedRosterClass}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Rombel Kelas?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Apakah Anda yakin ingin menghapus rombongan belajar kelas{' '}
                  <strong className="text-slate-800">{deleteConfirmClass.name}</strong>?
                </p>
                {metrics.studentCountMap[deleteConfirmClass.name]?.total > 0 && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
                    Peringatan: Masih terdapat{' '}
                    {metrics.studentCountMap[deleteConfirmClass.name]?.total} siswa yang terdaftar di kelas ini.
                    Rombel tidak dapat dihapus sebelum siswa dipindahkan ke rombel lain.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmClass(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Ya, Hapus Rombel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
