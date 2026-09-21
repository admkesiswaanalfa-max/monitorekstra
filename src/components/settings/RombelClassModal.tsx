import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassInfo } from '../../types';
import {
  X,
  GraduationCap,
  UserCheck,
  Building,
  Users,
  Calendar,
  Save,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface RombelClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClass: ClassInfo | null;
}

export const RombelClassModal: React.FC<RombelClassModalProps> = ({
  isOpen,
  onClose,
  editingClass,
}) => {
  const { teachers, addClass, updateClass, schoolInfo, classes } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    rombelCode: '',
    grade: '7',
    waliKelas: '',
    waliKelasNip: '',
    room: '',
    capacity: 32,
    academicYear: schoolInfo.academicYear || '2026/2027',
    semester: (schoolInfo.semester as 'Ganjil' | 'Genap') || 'Ganjil',
    classLeader: '',
    notes: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingClass) {
      setFormData({
        name: editingClass.name || '',
        rombelCode: editingClass.rombelCode || `RBL-${editingClass.name.replace(/[^a-zA-Z0-9]/g, '')}`,
        grade: editingClass.grade || '7',
        waliKelas: editingClass.waliKelas || '',
        waliKelasNip: editingClass.waliKelasNip || '',
        room: editingClass.room || '',
        capacity: editingClass.capacity || 32,
        academicYear: editingClass.academicYear || schoolInfo.academicYear || '2026/2027',
        semester: editingClass.semester || schoolInfo.semester || 'Ganjil',
        classLeader: editingClass.classLeader || '',
        notes: editingClass.notes || '',
        status: editingClass.status || 'Aktif',
      });
    } else {
      // Suggest next grade/name
      setFormData({
        name: '',
        rombelCode: '',
        grade: '7',
        waliKelas: teachers[0]?.name || '',
        waliKelasNip: teachers[0]?.nip || '',
        room: 'Ruang 7.1',
        capacity: 32,
        academicYear: schoolInfo.academicYear || '2026/2027',
        semester: schoolInfo.semester || 'Ganjil',
        classLeader: '',
        notes: '',
        status: 'Aktif',
      });
    }
    setErrors({});
  }, [editingClass, isOpen, schoolInfo, teachers]);

  if (!isOpen) return null;

  // Handle name change and auto-suggest rombelCode
  const handleNameChange = (val: string) => {
    const cleanVal = val.toUpperCase();
    const suggestedCode = `RBL-${cleanVal.replace(/[^A-Z0-9]/g, '')}`;
    
    // Auto-detect grade if start with VII, VIII, IX or 7, 8, 9
    let autoGrade = formData.grade;
    if (cleanVal.startsWith('VII') || cleanVal.startsWith('7')) autoGrade = '7';
    else if (cleanVal.startsWith('VIII') || cleanVal.startsWith('8')) autoGrade = '8';
    else if (cleanVal.startsWith('IX') || cleanVal.startsWith('9')) autoGrade = '9';

    setFormData((prev) => ({
      ...prev,
      name: val,
      rombelCode: prev.rombelCode === '' || prev.rombelCode.startsWith('RBL-') ? suggestedCode : prev.rombelCode,
      grade: autoGrade,
    }));
  };

  // Handle teacher select
  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const teacherObj = teachers.find((t) => t.name === selectedName);
    setFormData((prev) => ({
      ...prev,
      waliKelas: selectedName,
      waliKelasNip: teacherObj?.nip || prev.waliKelasNip,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nama kelas wajib diisi (misal: VII-A)';
    } else {
      // Check duplicate name
      const duplicate = classes.find(
        (c) =>
          c.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
          c.id !== editingClass?.id
      );
      if (duplicate) {
        newErrors.name = `Kelas dengan nama "${formData.name}" sudah ada!`;
      }
    }

    if (!formData.waliKelas.trim()) {
      newErrors.waliKelas = 'Wali kelas wajib diisi atau dipilih';
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'Kapasitas minimal 1 siswa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        name: formData.name.trim(),
        rombelCode: formData.rombelCode.trim() || `RBL-${formData.name.trim()}`,
        grade: formData.grade,
        waliKelas: formData.waliKelas.trim(),
        waliKelasNip: formData.waliKelasNip.trim(),
        room: formData.room.trim(),
        capacity: Number(formData.capacity),
        academicYear: formData.academicYear,
        semester: formData.semester,
        classLeader: formData.classLeader.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
      });
    } else {
      addClass({
        name: formData.name.trim(),
        rombelCode: formData.rombelCode.trim() || `RBL-${formData.name.trim()}`,
        grade: formData.grade,
        waliKelas: formData.waliKelas.trim(),
        waliKelasNip: formData.waliKelasNip.trim(),
        room: formData.room.trim(),
        capacity: Number(formData.capacity),
        totalStudents: 0,
        academicYear: formData.academicYear,
        semester: formData.semester,
        classLeader: formData.classLeader.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
      });
    }

    onClose();
  };

  return (
    <div
      id="rombel-class-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="rombel-class-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6 transition-all"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <GraduationCap className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {editingClass ? 'Edit Rombongan Belajar (Rombel)' : 'Tambah Rombongan Belajar Baru'}
              </h2>
              <p className="text-xs text-emerald-100">
                Data master rombel kelas, alokasi wali kelas, dan kapasitas ruang
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-rombel-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Rombel / Kelas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-rombel-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: VII-A, VIII-B, IX-C"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/40 text-rose-900'
                    : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-600 bg-white text-slate-900'
                }`}
              />
              {errors.name ? (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{errors.name}</p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Nama tampilan kelas di seluruh sistem</p>
              )}
            </div>

            {/* Kode Rombel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Rombel (Dapodik / EMIS)
              </label>
              <input
                type="text"
                id="input-rombel-code"
                value={formData.rombelCode}
                onChange={(e) => setFormData({ ...formData, rombelCode: e.target.value.toUpperCase() })}
                placeholder="Contoh: RBL-7A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all uppercase"
              />
              <p className="text-[10px] text-slate-400 mt-1">Kode unik identifikasi rombel</p>
            </div>

            {/* Tingkat / Jenjang */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat / Jenjang <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-rombel-grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all cursor-pointer"
              >
                <option value="7">Kelas VII (Tingkat 7)</option>
                <option value="8">Kelas VIII (Tingkat 8)</option>
                <option value="9">Kelas IX (Tingkat 9)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Kelompok jenjang kelas santri</p>
            </div>

            {/* Status Rombel */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Rombel
              </label>
              <select
                id="select-rombel-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all cursor-pointer"
              >
                <option value="Aktif">Aktif (Sedang Berjalan)</option>
                <option value="Nonaktif">Nonaktif (Arsip / Tutup)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Status keaktifan kegiatan pembelajaran</p>
            </div>

            {/* Wali Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wali Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                <select
                  id="select-rombel-teacher"
                  value={formData.waliKelas}
                  onChange={handleTeacherChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="">-- Pilih dari Daftar Guru --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.role || 'Guru'})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  id="input-rombel-walikelas-manual"
                  value={formData.waliKelas}
                  onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                  placeholder="Atau ketik nama wali kelas secara langsung"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              {errors.waliKelas && (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{errors.waliKelas}</p>
              )}
            </div>

            {/* NIP Wali Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP / NIY Wali Kelas
              </label>
              <input
                type="text"
                id="input-rombel-walikelas-nip"
                value={formData.waliKelasNip}
                onChange={(e) => setFormData({ ...formData, waliKelasNip: e.target.value })}
                placeholder="Contoh: 19860412 201201 1 009"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Dicetak pada lembar rapor & surat keterangan</p>
            </div>

            {/* Ruang Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ruang Belajar / Lokasi
              </label>
              <input
                type="text"
                id="input-rombel-room"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="Contoh: Ruang 7.1 (Lantai 1) / Lab Bahasa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">Lokasi fisik ruang kelas</p>
            </div>

            {/* Kapasitas / Daya Tampung */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kapasitas Maksimal Siswa <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="input-rombel-capacity"
                  min={1}
                  max={60}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-semibold">
                  Kursi
                </span>
              </div>
              {errors.capacity ? (
                <p className="text-[11px] font-medium text-rose-600 mt-1">{errors.capacity}</p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Standar SMP Kemdikbud: 32 siswa</p>
              )}
            </div>

            {/* Tahun Ajaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahun Ajaran
              </label>
              <input
                type="text"
                id="input-rombel-academic-year"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2026/2027"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
            </div>

            {/* Ketua Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ketua Kelas / Rombel (Opsional)
              </label>
              <input
                type="text"
                id="input-rombel-leader"
                value={formData.classLeader}
                onChange={(e) => setFormData({ ...formData, classLeader: e.target.value })}
                placeholder="Nama santri ketua rombel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>

          {/* Catatan / Keterangan Khusus */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan / Kekhususan Rombel
            </label>
            <textarea
              id="input-rombel-notes"
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Contoh: Rombel Program Tahfidz Al-Qur'an & Olimpiade Sains / Rombel Keputrian"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all resize-none"
            />
          </div>

          {/* Info notice */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Sinkronisasi Siswa Otomatis</p>
              <p className="text-[11px] text-emerald-800">
                Siswa yang memiliki data kelas yang sama akan otomatis terhubung ke rombel ini. Anda dapat memantau keterisian dan mutasi siswa secara real-time.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-rombel"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-rombel"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingClass ? 'Simpan Perubahan' : 'Buat Rombel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
