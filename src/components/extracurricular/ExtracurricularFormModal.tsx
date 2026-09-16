import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Extracurricular, EkskulCategory } from '../../types';
import { X, Award, Save, AlertCircle } from 'lucide-react';

interface ExtracurricularFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ekskulToEdit?: Extracurricular | null;
}

export const ExtracurricularFormModal: React.FC<ExtracurricularFormModalProps> = ({
  isOpen,
  onClose,
  ekskulToEdit,
}) => {
  const { addExtracurricular, updateExtracurricular, coaches } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<EkskulCategory>('Olahraga');
  const [coachName, setCoachName] = useState('');
  const [schedule, setSchedule] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [targetCapaian, setTargetCapaian] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');
  const [error, setError] = useState('');

  const categories: EkskulCategory[] = [
    'Olahraga',
    'Seni & Budaya',
    'Keagamaan',
    'Akademik',
    'Kepanduan/Kepemimpinan',
    'Keterampilan/Teknologi',
  ];

  useEffect(() => {
    if (ekskulToEdit) {
      setName(ekskulToEdit.name);
      setCategory(ekskulToEdit.category);
      setCoachName(ekskulToEdit.coachName);
      setSchedule(ekskulToEdit.schedule);
      setLocation(ekskulToEdit.location);
      setDescription(ekskulToEdit.description);
      setTargetCapaian(ekskulToEdit.targetCapaian);
      setImage(ekskulToEdit.image);
      setStatus(ekskulToEdit.status);
    } else {
      setName('');
      setCategory('Olahraga');
      setCoachName(coaches[0]?.name || 'Ustadz / Pembina');
      setSchedule('Jumat, 15.30 - 17.00 WIB');
      setLocation('Lapangan Utama SMP');
      setDescription('');
      setTargetCapaian('Meningkatkan keterampilan dan sportivitas peserta.');
      setImage('https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80');
      setStatus('Aktif');
    }
    setError('');
  }, [ekskulToEdit, isOpen, coaches]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !coachName.trim() || !schedule.trim()) {
      setError('Mohon lengkapi nama ekstrakurikuler, pembina, dan jadwal latihan.');
      return;
    }

    if (ekskulToEdit) {
      updateExtracurricular(ekskulToEdit.id, {
        name,
        category,
        coachName,
        schedule,
        location,
        description,
        targetCapaian,
        image: image || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80',
        status,
      });
    } else {
      addExtracurricular({
        name,
        category,
        coachName,
        schedule,
        location,
        description,
        targetCapaian,
        image: image || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80',
        status,
        maxQuota: 30,
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
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {ekskulToEdit ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
              </h3>
              <p className="text-xs text-slate-500">SMP Alfa Ali Masykur</p>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Ekstrakurikuler *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Robotik & Coding"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Bidang *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EkskulCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pembina / Instruktur *
              </label>
              <input
                type="text"
                required
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="Nama Pembina & Gelar"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jadwal Latihan *
              </label>
              <input
                type="text"
                required
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Hari, Jam latihan"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tempat / Lokasi *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ruang Lab / Lapangan"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Singkat Ekstrakurikuler
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan fokus kegiatan dan pengembangan minat bakat siswa..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Capaian Pembelajaran
            </label>
            <input
              type="text"
              value={targetCapaian}
              onChange={(e) => setTargetCapaian(e.target.value)}
              placeholder="Contoh: Menguasai teknik dasar dan siap bertanding tingkat kota"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Kegiatan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="Aktif">Aktif Berjalan</option>
                <option value="Nonaktif">Nonaktif / Ditangguhkan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Banner / Foto
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
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
              <span>Simpan Ekstrakurikuler</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
