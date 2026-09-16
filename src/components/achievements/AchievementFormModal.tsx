import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Achievement, AchievementLevel } from '../../types';
import { X, Trophy, Save, AlertCircle } from 'lucide-react';

interface AchievementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementToEdit?: Achievement | null;
}

export const AchievementFormModal: React.FC<AchievementFormModalProps> = ({
  isOpen,
  onClose,
  achievementToEdit,
}) => {
  const { addAchievement, updateAchievement, students, extracurriculars } = useApp();

  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [ekskulId, setEkskulId] = useState(extracurriculars[0]?.id || '');
  const [competitionName, setCompetitionName] = useState('');
  const [level, setLevel] = useState<AchievementLevel>('Kabupaten/Kota');
  const [rank, setRank] = useState('Juara 1');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [year, setYear] = useState('2025');
  const [description, setDescription] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [error, setError] = useState('');

  const levels: AchievementLevel[] = [
    'Sekolah',
    'Kecamatan',
    'Kabupaten/Kota',
    'Provinsi',
    'Nasional',
    'Internasional',
  ];

  useEffect(() => {
    if (achievementToEdit) {
      setStudentId(achievementToEdit.studentId);
      setEkskulId(achievementToEdit.ekskulId);
      setCompetitionName(achievementToEdit.competitionName);
      setLevel(achievementToEdit.level);
      setRank(achievementToEdit.rank);
      setOrganizer(achievementToEdit.organizer);
      setDate(achievementToEdit.date);
      setYear(achievementToEdit.year);
      setDescription(achievementToEdit.description);
      setCertificateUrl(achievementToEdit.certificateUrl);
    } else {
      setStudentId(students[0]?.id || '');
      setEkskulId(extracurriculars[0]?.id || '');
      setCompetitionName('');
      setLevel('Kabupaten/Kota');
      setRank('Juara 1');
      setOrganizer('Dinas Pendidikan & Olahraga');
      setDate(new Date().toISOString().slice(0, 10));
      setYear('2025');
      setDescription('');
      setCertificateUrl('https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&auto=format&fit=crop&q=80');
    }
    setError('');
  }, [achievementToEdit, isOpen, students, extracurriculars]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitionName.trim() || !rank.trim() || !organizer.trim()) {
      setError('Mohon lengkapi nama kejuaraan, peringkat juara, dan pihak penyelenggara.');
      return;
    }

    const matchedStudent = students.find((s) => s.id === studentId);
    const matchedEkskul = extracurriculars.find((e) => e.id === ekskulId);

    if (achievementToEdit) {
      updateAchievement(achievementToEdit.id, {
        studentId,
        studentName: matchedStudent?.name || achievementToEdit.studentName,
        studentClass: matchedStudent?.class || achievementToEdit.studentClass,
        ekskulId,
        ekskulName: matchedEkskul?.name || achievementToEdit.ekskulName,
        competitionName,
        level,
        rank,
        organizer,
        date,
        year,
        description,
        certificateUrl: certificateUrl || 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&auto=format&fit=crop&q=80',
      });
    } else {
      addAchievement({
        studentId,
        studentName: matchedStudent?.name || 'Siswa',
        studentClass: matchedStudent?.class || 'VIII-A',
        ekskulId,
        ekskulName: matchedEkskul?.name || 'Ekstrakurikuler',
        competitionName,
        level,
        rank,
        organizer,
        date,
        year,
        description,
        certificateUrl: certificateUrl || 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&auto=format&fit=crop&q=80',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {achievementToEdit ? 'Ubah Data Prestasi' : 'Tambah Prestasi Baru'}
              </h3>
              <p className="text-xs text-slate-500">Pencatatan Kejuaraan Siswa SMP Alfa Ali Masykur</p>
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
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Siswa Peraih Prestasi *
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Kelas {s.class})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cabang Ekstrakurikuler *
              </label>
              <select
                value={ekskulId}
                onChange={(e) => setEkskulId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {extracurriculars.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Kejuaraan / Kompetisi *
              </label>
              <input
                type="text"
                required
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                placeholder="Contoh: Turnamen Futsal Pelajar Tingkat Kota"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Kejuaraan *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as AchievementLevel)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peringkat / Juara *
              </label>
              <input
                type="text"
                required
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Contoh: Juara 1, Juara 2, Medali Emas"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instansi Penyelenggara *
              </label>
              <input
                type="text"
                required
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="Contoh: Dinas Pemuda & Olahraga"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Kejuaraan
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Singkat Pencapaian
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail jalannya kompetisi atau capaian khusus..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Foto Dokumentasi / Sertifikat
              </label>
              <input
                type="url"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="https://..."
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Prestasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
