import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Achievement, AchievementLevel } from '../../types';
import { AchievementFormModal } from './AchievementFormModal';
import {
  Trophy,
  Search,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Award,
  Building,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const {
    achievements,
    extracurriculars,
    deleteAchievement,
    currentUser,
    setSelectedStudentDetailId,
    setCurrentView,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedEkskul, setSelectedEkskul] = useState<string>('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [achievementToEdit, setAchievementToEdit] = useState<Achievement | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Achievement | null>(null);
  const [previewCertUrl, setPreviewCertUrl] = useState<string | null>(null);

  const levels: string[] = [
    'all',
    'Sekolah',
    'Kecamatan',
    'Kabupaten/Kota',
    'Provinsi',
    'Nasional',
    'Internasional',
  ];

  // Filtering
  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      const matchSearch =
        ach.competitionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ach.rank.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLevel = selectedLevel === 'all' || ach.level === selectedLevel;
      const matchEkskul = selectedEkskul === 'all' || ach.ekskulId === selectedEkskul;

      return matchSearch && matchLevel && matchEkskul;
    });
  }, [achievements, searchQuery, selectedLevel, selectedEkskul]);

  // Statistics
  const totalCount = achievements.length;
  const nationalCount = achievements.filter((a) => a.level === 'Nasional' || a.level === 'Internasional').length;
  const provinceCount = achievements.filter((a) => a.level === 'Provinsi').length;
  const cityCount = achievements.filter((a) => a.level === 'Kabupaten/Kota').length;

  const isEditable = currentUser.role === 'admin' || currentUser.role === 'pembina';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Prestasi & Penghargaan Siswa
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              {achievements.length} Medali & Gelar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pencatatan rekor kejuaraan, trofi, dan sertifikat resmi siswa SMP Alfa Ali Masykur
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isEditable && (
            <button
              id="btn-add-achievement"
              onClick={() => {
                setAchievementToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Prestasi</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Prestasi</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Terverifikasi</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tingkat Nasional</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{nationalCount}</p>
          <span className="text-[11px] text-amber-700 font-medium">Kejuaraan Bergengsi</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tingkat Provinsi</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{provinceCount}</p>
          <span className="text-[11px] text-blue-700 font-medium">Jawa Timur</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tingkat Kota</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{cityCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Kabupaten / Kota</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kejuaraan, nama siswa, atau instansi..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="all">Semua Jenjang Tingkat</option>
              {levels.filter((l) => l !== 'all').map((lvl) => (
                <option key={lvl} value={lvl}>
                  Tingkat {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedEkskul}
              onChange={(e) => setSelectedEkskul(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="all">Semua Ekstrakurikuler</option>
              {extracurriculars.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Card Header Media */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={ach.certificateUrl}
                  alt={ach.competitionName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                    {ach.rank}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    Tingkat {ach.level}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-black text-sm leading-snug drop-shadow-xs">
                    {ach.competitionName}
                  </h3>
                  <p className="text-[11px] text-amber-200 font-semibold mt-0.5">
                    {ach.studentName} ({ach.studentClass})
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ach.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-700 truncate">{ach.ekskulName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ach.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{ach.date} ({ach.year})</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewCertUrl(ach.certificateUrl)}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Bukti</span>
                  </button>

                  {isEditable && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setAchievementToEdit(ach);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(ach)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Kejuaraan</th>
                  <th className="py-3 px-3">Siswa Peraih</th>
                  <th className="py-3 px-3">Peringkat</th>
                  <th className="py-3 px-3">Tingkat</th>
                  <th className="py-3 px-3">Ekstrakurikuler</th>
                  <th className="py-3 px-3">Penyelenggara & Tanggal</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAchievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 max-w-xs">{ach.competitionName}</td>
                    <td className="py-3 px-3 font-semibold text-blue-700">
                      {ach.studentName} <span className="text-[10px] text-slate-400">({ach.studentClass})</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {ach.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{ach.level}</td>
                    <td className="py-3 px-3 text-slate-600">{ach.ekskulName}</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {ach.organizer} &bull; {ach.date}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPreviewCertUrl(ach.certificateUrl)}
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                          title="Lihat Sertifikat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isEditable && (
                          <>
                            <button
                              onClick={() => {
                                setAchievementToEdit(ach);
                                setIsFormModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteCandidate(ach)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      {previewCertUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Bukti Sertifikat / Dokumentasi Kejuaraan
              </h4>
              <button
                onClick={() => setPreviewCertUrl(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 max-h-[70vh] bg-slate-100 flex items-center justify-center">
              <img
                src={previewCertUrl}
                alt="Sertifikat"
                className="w-full h-auto object-contain max-h-[65vh]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Rekam Prestasi?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Anda yakin ingin menghapus data prestasi <strong>{deleteCandidate.competitionName}</strong> ({deleteCandidate.studentName})?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteAchievement(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Form Modal */}
      <AchievementFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setAchievementToEdit(null);
        }}
        achievementToEdit={achievementToEdit}
      />
    </div>
  );
};
