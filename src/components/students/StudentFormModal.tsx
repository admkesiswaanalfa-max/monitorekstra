import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Gender, StudentStatus } from '../../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

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
  const { addStudent, updateStudent, extracurriculars } = useApp();

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
      setStudentClass('VIII-A');
      setGender('L');
      setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
      setParentName('');
      setParentPhone('0812-');
      setSelectedEkskuls(['ekskul-1']);
      setStatus('Aktif');
    }
    setError('');
  }, [studentToEdit, isOpen]);

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
                {['VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B'].map((c) => (
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
