import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Student, Gender, StudentStatus, YanbuaLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import { getAvailableClassNames, getWaliKelasForClass } from '../../utils/classUtils';
import { X, Save, UserPlus, BookOpen, Camera, Upload, Trash2, AlertCircle, Sparkles } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { addStudent, updateStudent, classes, students } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const defaultClass = classes[0]?.name || 'VII-A';
  const defaultWali = getWaliKelasForClass(defaultClass, classes);

  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    name: '',
    gender: 'L' as Gender,
    class: defaultClass,
    waliKelas: defaultWali,
    parentName: '',
    phone: '',
    address: 'Wonosobo',
    yanbuaJilid: 'Jilid 1' as YanbuaLevel,
    yanbuaHalaman: 1,
    doaMasteredCount: 0,
    quranJuz: 30,
    quranSurah: 'An-Naba:1-10',
    quranAyatCount: 0,
    quranTargetAyat: 564,
    status: 'Aktif' as StudentStatus,
    avatar: '',
  });

  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        nis: studentToEdit.nis,
        nisn: studentToEdit.nisn,
        name: studentToEdit.name,
        gender: studentToEdit.gender,
        class: studentToEdit.class,
        waliKelas: studentToEdit.waliKelas,
        parentName: studentToEdit.parentName,
        phone: studentToEdit.phone,
        address: studentToEdit.address,
        yanbuaJilid: studentToEdit.yanbuaJilid,
        yanbuaHalaman: studentToEdit.yanbuaHalaman,
        doaMasteredCount: studentToEdit.doaMasteredCount,
        quranJuz: studentToEdit.quranJuz,
        quranSurah: studentToEdit.quranSurah,
        quranAyatCount: studentToEdit.quranAyatCount,
        quranTargetAyat: studentToEdit.quranTargetAyat,
        status: studentToEdit.status,
        avatar: studentToEdit.avatar || '',
      });
    } else {
      setFormData({
        nis: `26${Math.floor(1000 + Math.random() * 9000)}`,
        nisn: `008${Math.floor(1000000 + Math.random() * 9000000)}`,
        name: '',
        gender: 'L',
        class: defaultClass,
        waliKelas: defaultWali,
        parentName: '',
        phone: '081234567890',
        address: 'Mojotengah, Wonosobo',
        yanbuaJilid: 'Jilid 1',
        yanbuaHalaman: 1,
        doaMasteredCount: 0,
        quranJuz: 30,
        quranSurah: 'An-Naba:1-10',
        quranAyatCount: 0,
        quranTargetAyat: 564,
        status: 'Aktif',
        avatar: '',
      });
    }
    setImageError(null);
  }, [studentToEdit, isOpen]);

  // When class changes, auto-set wali kelas
  const handleClassChange = (selectedClass: string) => {
    const matched = classes.find((c) => c.name === selectedClass);
    setFormData((prev) => ({
      ...prev,
      class: selectedClass,
      waliKelas: matched ? matched.waliKelas : getWaliKelasForClass(selectedClass, classes),
    }));
  };

  // Convert uploaded image to Base64 with canvas-based size optimization
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('File harus berupa berkas gambar (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError('Ukuran gambar maksimal 5MB.');
      return;
    }

    setImageError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result as string;
      if (!rawBase64) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 480;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(file.type.includes('png') ? 'image/png' : 'image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, avatar: compressed }));
        } else {
          setFormData((prev) => ({ ...prev, avatar: rawBase64 }));
        }
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, avatar: rawBase64 }));
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }));
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (studentToEdit) {
      updateStudent(studentToEdit.id, formData);
    } else {
      addStudent({
        ...formData,
        avatar:
          formData.avatar ||
          `https://images.unsplash.com/photo-${
            formData.gender === 'L' ? '1535713875002-d1d0cf377fde' : '1534528741775-53994a69daeb'
          }?w=150`,
        yanbuaProgressPct: 15,
        statusSetoranHariIni: 'BELUM SETOR',
        overallProgress: 15,
      });
    }
    onClose();
  };

  // Compute active preview avatar URL
  const currentAvatarPreview =
    formData.avatar ||
    (studentToEdit?.avatar
      ? studentToEdit.avatar
      : `https://images.unsplash.com/photo-${
          formData.gender === 'L' ? '1535713875002-d1d0cf377fde' : '1534528741775-53994a69daeb'
        }?w=150`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {studentToEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <p className="text-xs text-emerald-200">
                SMP Alfa Ali Masykur &bull; TP 2026/2027
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Section: Foto Profil Siswa (Upload & Base64 Converter) */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group shrink-0">
              <img
                src={currentAvatarPreview}
                alt="Foto Profil Siswa"
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-emerald-600/30 bg-slate-100"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-emerald-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
                title="Klik untuk memilih foto baru"
              >
                <Camera className="w-5 h-5 text-amber-300" />
                <span>Ganti Foto</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
                  Foto Profil Siswa
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Base64 Format
                </span>
                {formData.avatar?.startsWith('data:image') && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Foto Baru Terpasang
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pilih foto santri/siswa (JPG, PNG, WEBP). Berkas langsung dikonversi ke string Base64 dan tersimpan ke basis data profil siswa.
              </p>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleImageChange}
                className="hidden"
                id="student-avatar-file-input"
              />

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  id="btn-trigger-upload-avatar"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Foto Profil</span>
                </button>

                {formData.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    title="Reset ke avatar awal"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Reset Foto</span>
                  </button>
                )}
              </div>

              {imageError && (
                <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-semibold pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="cth. Muhammad Faris"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">NIS (Nomor Induk Siswa)</label>
              <input
                type="text"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">NISN</label>
              <input
                type="text"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kelas</label>
              <select
                value={formData.class}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800 font-bold"
              >
                {availableClassNames.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Wali Kelas</label>
              <input
                type="text"
                value={formData.waliKelas}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Posisi Tingkatan Awal / Saat Ini</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Jilid Yanbu'a</label>
                <select
                  value={formData.yanbuaJilid}
                  onChange={(e) => setFormData({ ...formData, yanbuaJilid: e.target.value as YanbuaLevel })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                >
                  <option value="Jilid 1">Jilid 1</option>
                  <option value="Jilid 2">Jilid 2</option>
                  <option value="Jilid 3">Jilid 3</option>
                  <option value="Jilid 4">Jilid 4</option>
                  <option value="Jilid 5">Jilid 5</option>
                  <option value="Jilid 6">Jilid 6</option>
                  <option value="Jilid 7">Jilid 7</option>
                  <option value="Al-Qur'an">Al-Qur'an</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Halaman Yanbu'a</label>
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={formData.yanbuaHalaman}
                  onChange={(e) => setFormData({ ...formData, yanbuaHalaman: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doa Dikuasai (Maks 20)</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={formData.doaMasteredCount}
                  onChange={(e) => setFormData({ ...formData, doaMasteredCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-emerald-900 mb-2">Kontak Orang Tua / Wali</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="cth. H. Ahmad Subagio"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">No. HP / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700">Status Siswa:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
              >
                <option value="Aktif">Aktif</option>
                <option value="Alumni">Alumni</option>
                <option value="Pindah">Pindah</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Siswa</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
