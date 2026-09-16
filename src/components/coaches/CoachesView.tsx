import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Coach } from '../../types';
import { CoachFormModal } from './CoachFormModal';
import {
  UserCheck,
  Search,
  Plus,
  Phone,
  Mail,
  Award,
  Users,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export const CoachesView: React.FC = () => {
  const {
    coaches,
    extracurriculars,
    students,
    deleteCoach,
    currentUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [coachToEdit, setCoachToEdit] = useState<Coach | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Coach | null>(null);

  const filteredCoaches = useMemo(() => {
    return coaches.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nip.includes(searchQuery) ||
        c.phone.includes(searchQuery)
      );
    });
  }, [coaches, searchQuery]);

  const isEditable = currentUser.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Data Pembina & Instruktur
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {coaches.length} Tenaga Pendidik
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar dewan guru dan pelatih ahli ekstrakurikuler SMP Alfa Ali Masykur
          </p>
        </div>

        {isEditable && (
          <button
            id="btn-add-coach"
            onClick={() => {
              setCoachToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pembina</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pembina, NIP, atau nomor kontak..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Coaches Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCoaches.map((c) => {
          const ekskuls = c.ekskulIds
            .map((id) => extracurriculars.find((e) => e.id === id))
            .filter(Boolean);

          // Total students coached across their assigned ekskuls
          const studentCount = students.filter((s) =>
            s.ekskulIds.some((id) => c.ekskulIds.includes(id))
          ).length;

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {c.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400">NIP: {c.nip || '-'}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'Guru Tetap'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  {isEditable && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setCoachToEdit(c);
                          setIsFormModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(c)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Ekstrakurikuler yang dibina */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Membina Ekstrakurikuler:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ekskuls.map((e) => (
                      <span
                        key={e?.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        {e?.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact information */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-mono">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                </div>
              </div>

              {/* Total students coached footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Peserta Binaan</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  {studentCount} Siswa
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Pembina?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Anda yakin ingin menghapus data pembina <strong>{deleteCandidate.name}</strong>?
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
                  deleteCoach(deleteCandidate.id);
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

      {/* Coach Form Modal */}
      <CoachFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setCoachToEdit(null);
        }}
        coachToEdit={coachToEdit}
      />
    </div>
  );
};
