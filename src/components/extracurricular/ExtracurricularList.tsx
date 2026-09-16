import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Extracurricular, EkskulCategory } from '../../types';
import { ExtracurricularDetailModal } from './ExtracurricularDetailModal';
import { ExtracurricularFormModal } from './ExtracurricularFormModal';
import {
  Award,
  Search,
  Plus,
  LayoutGrid,
  List,
  Clock,
  MapPin,
  Users,
  Eye,
  Edit2,
  Trash2,
  Trophy,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

export const ExtracurricularList: React.FC = () => {
  const {
    extracurriculars,
    students,
    achievements,
    deleteExtracurricular,
    currentUser,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [detailEkskulId, setDetailEkskulId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [ekskulToEdit, setEkskulToEdit] = useState<Extracurricular | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Extracurricular | null>(null);

  const categories: string[] = [
    'all',
    'Olahraga',
    'Seni & Budaya',
    'Keagamaan',
    'Akademik',
    'Kepanduan/Kepemimpinan',
    'Keterampilan/Teknologi',
  ];

  const filteredEkskuls = useMemo(() => {
    return extracurriculars.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [extracurriculars, searchQuery, selectedCategory]);

  const isEditable = currentUser.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Daftar Ekstrakurikuler
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
              {extracurriculars.length} Bidang
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Wadah pengembangan bakat, minat, karakter, dan prestasi siswa SMP Alfa Ali Masykur
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Daftar Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isEditable && (
            <button
              id="btn-add-ekskul"
              onClick={() => {
                setEkskulToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ekskul</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ekstrakurikuler, nama pembina, atau lokasi..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEkskuls.map((ekskul) => {
            const memberCount = students.filter((s) => s.ekskulIds.includes(ekskul.id)).length;
            const achCount = achievements.filter((a) => a.ekskulId === ekskul.id).length;

            return (
              <div
                key={ekskul.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Card Banner */}
                <div className="relative h-40 bg-slate-800 overflow-hidden">
                  <img
                    src={ekskul.image}
                    alt={ekskul.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/90 text-white backdrop-blur-xs">
                      {ekskul.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ekskul.status === 'Aktif'
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-slate-700/90 text-slate-300'
                      }`}
                    >
                      {ekskul.status}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-extrabold text-base leading-snug drop-shadow-xs">
                      {ekskul.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 drop-shadow-xs">
                      Pembina: {ekskul.coachName}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ekskul.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{ekskul.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{ekskul.location}</span>
                    </div>
                  </div>

                  {/* Metrics footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        {memberCount} Siswa
                      </span>
                      {achCount > 0 && (
                        <span className="flex items-center gap-1 font-semibold text-amber-700">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          {achCount} Prestasi
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDetailEkskulId(ekskul.id)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isEditable && (
                        <>
                          <button
                            onClick={() => {
                              setEkskulToEdit(ekskul);
                              setIsFormModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(ekskul)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Ekstrakurikuler</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Pembina</th>
                  <th className="py-3 px-3">Jadwal & Tempat</th>
                  <th className="py-3 px-3">Peserta</th>
                  <th className="py-3 px-3">Prestasi</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEkskuls.map((e) => {
                  const memberCount = students.filter((s) => s.ekskulIds.includes(e.id)).length;
                  const achCount = achievements.filter((a) => a.ekskulId === e.id).length;

                  return (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={e.image} alt={e.name} className="w-9 h-9 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{e.name}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">{e.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-600">{e.category}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{e.coachName}</td>
                      <td className="py-3 px-3 text-slate-600">
                        <span>{e.schedule}</span>
                        <span className="block text-[10px] text-slate-400">{e.location}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{memberCount} Siswa</td>
                      <td className="py-3 px-3 font-bold text-amber-700">{achCount}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            e.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailEkskulId(e.id)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isEditable && (
                            <>
                              <button
                                onClick={() => {
                                  setEkskulToEdit(e);
                                  setIsFormModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteCandidate(e)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            <h3 className="text-base font-bold text-slate-900">Hapus Ekstrakurikuler?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Anda yakin ingin menghapus <strong>{deleteCandidate.name}</strong>? Seluruh data log kehadiran dan penilaian terkait akan terhapus.
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
                  deleteExtracurricular(deleteCandidate.id);
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

      {/* Extracurricular Detail Modal */}
      <ExtracurricularDetailModal
        ekskulId={detailEkskulId}
        onClose={() => setDetailEkskulId(null)}
      />

      {/* Extracurricular Form Modal */}
      <ExtracurricularFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEkskulToEdit(null);
        }}
        ekskulToEdit={ekskulToEdit}
      />
    </div>
  );
};
