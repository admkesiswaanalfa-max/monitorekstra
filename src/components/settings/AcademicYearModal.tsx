import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle } from 'lucide-react';
import { AcademicYearItem } from '../../types';

interface AcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AcademicYearItem, 'id'>) => void;
  initialData?: AcademicYearItem | null;
}

export const AcademicYearModal: React.FC<AcademicYearModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [year, setYear] = useState('2025/2026');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [status, setStatus] = useState<'active' | 'archived' | 'planned'>('active');
  const [startDate, setStartDate] = useState('2025-07-14');
  const [endDate, setEndDate] = useState('2025-12-20');
  const [targetMeetings, setTargetMeetings] = useState(16);
  const [effectiveWeeks, setEffectiveWeeks] = useState(20);
  const [isLocked, setIsLocked] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setYear(initialData.year);
      setSemester(initialData.semester);
      setStatus(initialData.status);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setTargetMeetings(initialData.targetMeetings);
      setEffectiveWeeks(initialData.effectiveWeeks);
      setIsLocked(initialData.isLocked);
      setNotes(initialData.notes || '');
    } else {
      setYear('2025/2026');
      setSemester('Ganjil');
      setStatus('planned');
      setStartDate('2025-07-14');
      setEndDate('2025-12-20');
      setTargetMeetings(16);
      setEffectiveWeeks(20);
      setIsLocked(false);
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim() || !year.includes('/')) {
      setError('Format tahun ajaran harus berupa contoh: 2025/2026');
      return;
    }
    if (!startDate || !endDate) {
      setError('Tanggal mulai dan selesai harus diisi lengkap');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal mulai tidak boleh melebihi tanggal selesai periode');
      return;
    }

    onSave({
      year: year.trim(),
      semester,
      status,
      startDate,
      endDate,
      targetMeetings: Number(targetMeetings) || 16,
      effectiveWeeks: Number(effectiveWeeks) || 20,
      isLocked,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {initialData ? 'Ubah Konfigurasi Tahun Ajaran' : 'Tambah Periode Tahun Ajaran Baru'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Atur kalender kegiatan, semester, dan target pertemuan latihan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahun Ajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025/2026"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                required
              />
              <span className="text-[10px] text-slate-400">Contoh format: 2025/2026</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Semester <span className="text-rose-500">*</span>
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="Ganjil">Semester Ganjil (Gasal)</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Mulai Periode <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Selesai Periode <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Pertemuan Ekstrakurikuler
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={targetMeetings}
                  onChange={(e) => setTargetMeetings(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
                <span className="absolute right-3 top-2 text-[11px] text-slate-400">Pertemuan</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minggu Efektif Belajar
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={effectiveWeeks}
                  onChange={(e) => setEffectiveWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
                <span className="absolute right-3 top-2 text-[11px] text-slate-400">Minggu</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Status Periode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  status === 'active'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="sr-only"
                />
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>Aktif Sekarang</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  status === 'planned'
                    ? 'border-blue-400 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="planned"
                  checked={status === 'planned'}
                  onChange={() => setStatus('planned')}
                  className="sr-only"
                />
                <div className={`w-2 h-2 rounded-full ${status === 'planned' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                <span>Rencana</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  status === 'archived'
                    ? 'border-slate-400 bg-slate-100 text-slate-800 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="archived"
                  checked={status === 'archived'}
                  onChange={() => setStatus('archived')}
                  className="sr-only"
                />
                <div className={`w-2 h-2 rounded-full ${status === 'archived' ? 'bg-slate-600' : 'bg-slate-300'}`} />
                <span>Arsip / Selesai</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="isLocked"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="isLocked" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold">Kunci Rapor & Presensi Periode Ini</span>
              <p className="text-[10px] text-slate-500">
                Jika dicentang, pembina dan wali kelas tidak dapat lagi mengubah nilai rapor dan absensi di periode ini.
              </p>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan / Agenda Utama Periode
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Fokus evaluasi KTSP/Kurikulum Merdeka & persiapan turnamen antar gugus..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Simpan Perubahan' : 'Tambahkan Periode'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
