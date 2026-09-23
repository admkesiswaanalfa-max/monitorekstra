import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Gender, StudentStatus } from '../../types';
import { getAvailableClassNames } from '../../utils/classUtils';
import { X, UserPlus, Save, AlertCircle, Camera, Upload, Trash2, Sparkles } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentToEdit,
}) => {
  const { addStudent, updateStudent, extracurriculars, classes, students } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const [name, setName] = useState('');
  const [nis, setNis] = useState('');
  const [nisn, setNisn] = useState('');
  const [studentClass, setStudentClass] = useState('VIII-A');
  const [gender, setGender] = useState<Gender>('L');
  const [avatar, setAvatar] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedEkskuls, setSelectedEkskuls] = useState<string[]>([]);
  const [status, setStatus] = useState<StudentStatus>('Aktif');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setNis(studentToEdit.nis);
      setNisn(studentToEdit.nisn);
      setStudentClass(studentToEdit.class);
      setGender(studentToEdit.gender);
      setAvatar(studentToEdit.avatar);
      setParentName(studentToEdit.parentName);
      setParentPhone(studentToEdit.parentPhone);
      setSelectedEkskuls(studentToEdit.ekskulIds);
      setStatus(studentToEdit.status);
    } else {
      setName('');
      setNis(`2324070${Math.floor(100 + Math.random() * 900)}`);
      setNisn(`0098712${Math.floor(100 + Math.random() * 900)}`);
      setStudentClass(availableClassNames[0] || 'VII-A');
      setGender('L');
      setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
      setParentName('');
      setParentPhone('0812-');
      setSelectedEkskuls(['ekskul-1']);
      setStatus('Aktif');
    }
    setError('');
    setImageError(null);
  }, [studentToEdit, isOpen]);

  // Process and convert uploaded image file to Base64 with canvas optimization
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
          setAvatar(compressed);
        } else {
          setAvatar(rawBase64);
        }
      };
      img.onerror = () => {
        setAvatar(rawBase64);
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

  const handleResetAvatar = () => {
    const defaultUrl = `https://images.unsplash.com/photo-${
      gender === 'L' ? '1535713875002-d1d0cf377fde' : '1534528741775-53994a69daeb'
    }?w=150&auto=format&fit=crop&q=80`;
    setAvatar(defaultUrl);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleToggleEkskul = (id: string) => {
    if (selectedEkskuls.includes(id)) {
      if (selectedEkskuls.length === 1) {
        setError('Siswa minimal harus memilih 1 ekstrakurikuler.');
        return;
      }
      setSelectedEkskuls(selectedEkskuls.filter((item) => item !== id));
    } else {
      setSelectedEkskuls([...selectedEkskuls, id]);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !nis.trim()) {
      setError('Mohon lengkapi Nama Siswa dan Nomor Induk Siswa (NIS).');
      return;
    }
    if (selectedEkskuls.length === 0) {
      setError('Silakan pilih minimal 1 ekstrakurikuler yang diikuti.');
      return;
    }

    if (studentToEdit) {
      updateStudent(studentToEdit.id, {
        name,
        nis,
        nisn,
        class: studentClass,
        gender,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        parentName,
        parentPhone,
        ekskulIds: selectedEkskuls,
        status,
      });
    } else {
      addStudent({
        name,
        nis,
        nisn,
        class: studentClass,
        gender,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        parentName: parentName || 'Orang Tua Siswa',
        parentPhone: parentPhone || '0812-3456-7890',
        ekskulIds: selectedEkskuls,
        status,
        attendanceRate: 95.0,
        overallScore: 3.50,
        category: 'Baik',
        competencies: {
          keterampilan: 3.5,
          pengetahuan: 3.5,
          kreativitas: 3.5,
          kerjasama: 3.5,
          disiplin: 3.5,
          tanggungJawab: 3.5,
          kepemimpinan: 3.5,
          sportivitas: 3.5,
        },
        historyScores: [
          { month: 'Jul', score: 3.2 },
          { month: 'Agt', score: 3.3 },
          { month: 'Sep', score: 3.4 },
          { month: 'Okt', score: 3.45 },
          { month: 'Nov', score: 3.5 },
        ],
        notesPembina: 'Siswa baru terdaftar dalam kegiatan ekstrakurikuler.',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {studentToEdit ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <p className="text-xs text-slate-500">Database Ekstrakurikuler SMP Alfa Ali Masykur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Foto Profil Siswa (Upload & Base64 Converter) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group shrink-0">
              <img
                src={
                  avatar ||
                  `https://images.unsplash.com/photo-${
                    gender === 'L' ? '1535713875002-d1d0cf377fde' : '1534528741775-53994a69daeb'
                  }?w=150&auto=format&fit=crop&q=80`
                }
                alt={name || 'Preview Siswa'}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-500/20 bg-white"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
                title="Pilih foto baru"
              >
                <Camera className="w-5 h-5 text-blue-300" />
                <span>Ganti</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <label className="block text-xs font-bold text-slate-800">
                  Foto Profil Siswa
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Base64 Format
                </span>
                {avatar?.startsWith('data:image') && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Foto Baru Terpasang
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pilih berkas foto (JPG, PNG, WEBP). Gambar akan dikonversi ke Base64 dan langsung ditampilkan pratinjaunya.
              </p>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleImageChange}
                className="hidden"
                id="student-form-photo-input"
              />

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  id="btn-upload-photo-student-form"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ganti Foto Profil</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    onClick={handleResetAvatar}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    title="Reset ke avatar default"
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Muhammad Farhan Al-Fatih"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIS (Nomor Induk Siswa) *
              </label>
              <input
                type="text"
                required
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="232407..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NISN Nasional
              </label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="009871..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kelas *
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {availableClassNames.map((c) => (
                  <option key={c} value={c}>
                    Kelas {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Kelamin *
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="L"
                    checked={gender === 'L'}
                    onChange={() => setGender('L')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Laki-laki (L)</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="P"
                    checked={gender === 'P'}
                    onChange={() => setGender('P')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>Perempuan (P)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Orang Tua / Wali
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Nama ayah/ibu"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kontak HP / WhatsApp Orang Tua
              </label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Keanggotaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Foto Profil Siswa
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            {/* Ekstrakurikuler checkboxes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Ekstrakurikuler yang Diikuti (Bisa lebih dari 1) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                {extracurriculars.map((e) => {
                  const checked = selectedEkskuls.includes(e.id);
                  return (
                    <label
                      key={e.id}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                        checked
                          ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleEkskul(e.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">{e.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
