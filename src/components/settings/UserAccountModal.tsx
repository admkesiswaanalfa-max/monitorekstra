import React, { useState, useEffect, useMemo } from 'react';
import { X, UserPlus, Check, AlertCircle, Shield, Briefcase, Mail, Phone } from 'lucide-react';
import { SystemUser, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { getAvailableClassNames } from '../../utils/classUtils';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SystemUser, 'id'>) => void;
  initialData?: SystemUser | null;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { extracurriculars, classes, students } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nip, setNip] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('pembina');
  const [assignedEkskulId, setAssignedEkskulId] = useState('');
  const [assignedClass, setAssignedClass] = useState('VII-A');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  const CLASS_OPTIONS = availableClassNames;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setNip(initialData.nip || '');
      setPhone(initialData.phone || '');
      setRole(initialData.role);
      setAssignedEkskulId(initialData.assignedEkskulId || (extracurriculars[0]?.id || ''));
      setAssignedClass(initialData.assignedClass || 'VII-A');
      setStatus(initialData.status);
      setNotes(initialData.notes || '');
      setAvatar(initialData.avatar || '');
    } else {
      setName('');
      setEmail('');
      setNip('');
      setPhone('');
      setRole('pembina');
      setAssignedEkskulId(extracurriculars[0]?.id || '');
      setAssignedClass('VII-A');
      setStatus('active');
      setNotes('');
      setAvatar('');
    }
    setError('');
  }, [initialData, isOpen, extracurriculars]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama lengkap pengguna wajib diisi');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Format email tidak valid');
      return;
    }

    const userData: Omit<SystemUser, 'id'> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      nip: nip.trim() || undefined,
      phone: phone.trim() || undefined,
      role,
      status,
      notes: notes.trim() || undefined,
      avatar:
        avatar.trim() ||
        `https://images.unsplash.com/photo-${role === 'admin' ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?w=150&auto=format&fit=crop&q=80`,
    };

    if (role === 'pembina') {
      userData.assignedEkskulId = assignedEkskulId;
      delete userData.assignedClass;
    } else if (role === 'wali_kelas') {
      userData.assignedClass = assignedClass;
      delete userData.assignedEkskulId;
    } else {
      delete userData.assignedEkskulId;
      delete userData.assignedClass;
    }

    onSave(userData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {initialData ? 'Ubah Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Tentukan hak akses, kredensial login, dan penugasan rombel/ekskul
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar Akademik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Drs. H. Masykur Rahman, M.Pd."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Akun Sekolah <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama.guru@smpalfaalimasykur.sch.id"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  required
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP / NUPTK / No. Pegawai
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19880520 201402 1 004"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Akun
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="active">Aktif (Dapat Login)</option>
                <option value="inactive">Nonaktif (Akses Ditangguhkan)</option>
              </select>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>Peran & Tingkat Wewenang (Role Access)</span>
              <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'admin', label: 'Administrator', desc: 'Akses penuh seluruh SIM' },
                { id: 'kepala_sekolah', label: 'Kepala Sekolah', desc: 'Monitoring & TTD Resmi' },
                { id: 'pembina', label: 'Pembina Ekskul', desc: 'Presensi & Nilai Aspek' },
                { id: 'wali_kelas', label: 'Wali Kelas', desc: 'Pantau Siswa & Nilai Rapor' },
              ].map((r) => (
                <label
                  key={r.id}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    role === r.id
                      ? 'border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="userRole"
                    value={r.id}
                    checked={role === r.id}
                    onChange={() => setRole(r.id as UserRole)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold">{r.label}</span>
                    {role === r.id && <Check className="w-3 h-3 text-indigo-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal leading-tight">{r.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional Assignment based on Role */}
          {role === 'pembina' && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>Penugasan Cabang Ekstrakurikuler Binaan</span>
              </label>
              <select
                value={assignedEkskulId}
                onChange={(e) => setAssignedEkskulId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {extracurriculars.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.category}) - Pembina: {e.coach}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-blue-700">
                Akun pembina ini akan secara otomatis memiliki wewenang menginput presensi dan penilaian siswa pada cabang ekskul yang dipilih.
              </p>
            </div>
          )}

          {role === 'wali_kelas' && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Penugasan Rombel Kelas Perwalian</span>
              </label>
              <select
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 font-medium"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    Kelas {c}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-amber-700">
                Akun wali kelas akan berfokus melihat perkembangan ekstrakurikuler seluruh siswa yang berada di rombel kelas perwalian tersebut.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Tugas / Keterangan Tambahan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Guru Pengampu Mata Pelajaran PJOK & Koordinator Lapangan Turnamen"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
              <span>{initialData ? 'Simpan Perubahan Akun' : 'Buat Akun Pengguna'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
