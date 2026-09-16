import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicYearItem } from '../../types';
import {
  Calendar,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Archive,
  Edit2,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { AcademicYearModal } from './AcademicYearModal';

export const AcademicYearSettings: React.FC = () => {
  const {
    academicYears,
    addAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    setActiveAcademicPeriod,
    toggleLockAcademicYear,
    schoolInfo,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYearItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Quick switch state
  const [quickYear, setQuickYear] = useState(schoolInfo.academicYear);
  const [quickSemester, setQuickSemester] = useState<'Ganjil' | 'Genap'>(schoolInfo.semester);

  const activePeriod = academicYears.find((y) => y.status === 'active') || {
    year: schoolInfo.academicYear,
    semester: schoolInfo.semester,
    startDate: '2025-07-14',
    endDate: '2025-12-20',
    targetMeetings: 16,
    effectiveWeeks: 20,
    isLocked: false,
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AcademicYearItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<AcademicYearItem, 'id'>) => {
    if (editingItem) {
      updateAcademicYear(editingItem.id, data);
    } else {
      addAcademicYear(data);
    }
  };

  const handleQuickActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveAcademicPeriod(quickYear, quickSemester);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Active Highlight Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Kalender Akademik Berjalan</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Tahun Ajaran {schoolInfo.academicYear} - Semester {schoolInfo.semester}
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Periode ini aktif digunakan pada seluruh lembar penilaian e-Rapor, kop surat dinas, rekap absensi mingguan, dan buku induk peserta ekstrakurikuler.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all duration-150 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Periode Baru</span>
          </button>
        </div>

        {/* Quick Stats in Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-[11px] text-blue-200 block">Total Periode</span>
            <span className="text-lg font-bold text-white">{academicYears.length} Terdaftar</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-[11px] text-blue-200 block">Target Pertemuan</span>
            <span className="text-lg font-bold text-white">{activePeriod.targetMeetings || 16} Kali / Smt</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-[11px] text-blue-200 block">Minggu Efektif</span>
            <span className="text-lg font-bold text-white">{activePeriod.effectiveWeeks || 20} Minggu</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
            <span className="text-[11px] text-blue-200 block">Status Kunci Rapor</span>
            <span className="text-lg font-bold text-white flex items-center gap-1.5">
              {activePeriod.isLocked ? (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-300">Terkunci</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-300">Terbuka</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Switcher Form */}
      <form
        onSubmit={handleQuickActivate}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Peralihan Cepat Periode Aktif
          </h3>
          <p className="text-[11px] text-slate-500">
            Pilih dan aktifkan tahun ajaran serta semester untuk sinkronisasi seketika
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Tahun Ajaran
            </label>
            <select
              value={quickYear}
              onChange={(e) => setQuickYear(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              {Array.from(new Set(academicYears.map((y) => y.year))).map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
              {!academicYears.some((y) => y.year === quickYear) && (
                <option value={quickYear}>{quickYear}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Semester
            </label>
            <select
              value={quickSemester}
              onChange={(e) => setQuickSemester(e.target.value as 'Ganjil' | 'Genap')}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
          </div>

          <div className="self-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Aktifkan Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* 3. Daftar Seluruh Periode Akademik */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Daftar Periode Kalender Akademik & Arsip
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola tanggal kalender, target pertemuan, serta kunci proteksi arsip rapor masa lampau
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            {academicYears.length} Periode
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tahun Ajaran & Semester</th>
                <th className="py-3 px-4">Rentang Waktu Kalender</th>
                <th className="py-3 px-4 text-center">Beban Belajar</th>
                <th className="py-3 px-4 text-center">Status Operasional</th>
                <th className="py-3 px-4 text-center">Kunci Arsip</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {academicYears.map((item) => {
                const isActive = item.status === 'active';
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isActive ? 'bg-blue-50/40 font-medium' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : item.status === 'planned'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.semester === 'Ganjil' ? 'S1' : 'S2'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{item.year}</span>
                            <span className="text-slate-400 font-normal">|</span>
                            <span>{item.semester}</span>
                            {isActive && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Aktif
                              </span>
                            )}
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1 text-[11px] font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {item.startDate} s.d. {item.endDate}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-slate-900">{item.targetMeetings} Pertemuan</span>
                        <span className="text-[10px] text-slate-500">{item.effectiveWeeks} Minggu Efektif</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Berjalan
                        </span>
                      ) : item.status === 'planned' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Direncanakan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <Archive className="w-3 h-3 text-slate-400" />
                          Arsip Selesai
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleLockAcademicYear(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          item.isLocked
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                        title={item.isLocked ? 'Klik untuk membuka kunci periode' : 'Klik untuk mengunci periode'}
                      >
                        {item.isLocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Terkunci</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Terbuka</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => setActiveAcademicPeriod(item.year, item.semester)}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Jadikan periode aktif sekarang"
                          >
                            Jadikan Aktif
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Ubah Rincian Periode"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Periode"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-900">Hapus Tahun Ajaran?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Data periode ini akan dihapus dari daftar kalender akademik. Pastikan tidak ada data penilaian krusial yang terikat.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAcademicYear(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Year Add/Edit Modal */}
      <AcademicYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingItem}
      />
    </div>
  );
};
