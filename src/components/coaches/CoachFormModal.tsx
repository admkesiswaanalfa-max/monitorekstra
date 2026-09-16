import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Coach } from '../../types';
import { X, UserCheck, Save, AlertCircle } from 'lucide-react';

interface CoachFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachToEdit?: Coach | null;
}

export const CoachFormModal: React.FC<CoachFormModalProps> = ({
  isOpen,
  onClose,
  coachToEdit,
}) => {
  const { addCoach, updateCoach, extracurriculars } = useApp();

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedEkskuls, setSelectedEkskuls] = useState<string[]>([]);
  const [status, setStatus] = useState<'Guru Tetap' | 'Pelatih Luar'>('Guru Tetap');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (coachToEdit) {
      setName(coachToEdit.name);
      setNip(coachToEdit.nip);
      setPhone(coachToEdit.phone);
      setEmail(coachToEdit.email);
      setSelectedEkskuls(coachToEdit.ekskulIds);
      setStatus(coachToEdit.status);
      setAvatar(coachToEdit.avatar);
    } else {
      setName('');
      setNip('19850612 201001 1 008');
      setPhone('0812-3456-7890');
      setEmail('pembina@smpalfaalimasykur.sch.id');
      setSelectedEkskuls([extracurriculars[0]?.id || 'ekskul-1']);
      setStatus('Guru Tetap');
      setAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80');
    }
    setError('');
  }, [coachToEdit, isOpen, extracurriculars]);

  if (!isOpen) return null;

  const handleToggleEkskul = (id: string) => {
    if (selectedEkskuls.includes(id)) {
      if (selectedEkskuls.length === 1) {
        setError('Pembina minimal harus membina 1 ekstrakurikuler.');
        return;
      }
      setSelectedEkskuls(selectedEkskuls.filter((item) => item !== id));
    } else {
      setSelectedEkskuls([...selectedEkskuls, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Mohon lengkapi nama pembina dan kontak nomor telepon.');
      return;
    }

    if (coachToEdit) {
      updateCoach(coachToEdit.id, {
        name,
        nip,
        phone,
        email,
        ekskulIds: selectedEkskuls,
        status,
        avatar: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      });
    } else {
      addCoach({
        name,
        nip,
        phone,
        email,
        ekskulIds: selectedEkskuls,
        status,
        avatar: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {coachToEdit ? 'Ubah Data Pembina' : 'Tambah Pembina Baru'}
              </h3>
              <p className="text-xs text-slate-500">SMP Alfa Ali Masykur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap & Gelar Pembina *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Drs. Ahmad Fauzi, M.Pd."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP / NIY / NUPTK
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="1985..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Kepegawaian *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Guru Tetap">Guru Tetap</option>
                <option value="Pelatih Luar">Pelatih Luar / Profesional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor HP / WhatsApp *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Sekolah
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@smpalfaalimasykur.sch.id"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              URL Foto Pembina
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Ekstrakurikuler yang Dibina *
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
              {extracurriculars.map((e) => {
                const checked = selectedEkskuls.includes(e.id);
                return (
                  <label
                    key={e.id}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer border ${
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

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pembina</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
