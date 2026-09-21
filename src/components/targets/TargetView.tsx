import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EkskulTarget } from '../../types';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import {
  Target,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Printer,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const TargetView: React.FC = () => {
  const {
    targets,
    addTarget,
    updateTarget,
    deleteTarget,
    extracurriculars,
    schoolInfo,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEkskulFilter, setSelectedEkskulFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetToEdit, setTargetToEdit] = useState<EkskulTarget | null>(null);

  // Form State
  const [formEkskulId, setFormEkskulId] = useState(extracurriculars[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EkskulTarget['category']>('Target Kompetensi');
  const [formTargetDesc, setFormTargetDesc] = useState('');
  const [formProcessDesc, setFormProcessDesc] = useState('');
  const [formAchievementDesc, setFormAchievementDesc] = useState('');
  const [formEvaluationDesc, setFormEvaluationDesc] = useState('');
  const [formFollowUpDesc, setFormFollowUpDesc] = useState('');
  const [formProgress, setFormProgress] = useState(50);
  const [formStatus, setFormStatus] = useState<EkskulTarget['status']>('Dalam Proses');
  const [formDueDate, setFormDueDate] = useState('2025-12-20');

  const filteredTargets = useMemo(() => {
    return targets.filter((t) => {
      const matchEkskul = selectedEkskulFilter === 'all' || t.ekskulId === selectedEkskulFilter;
      const matchStatus = selectedStatusFilter === 'all' || t.status === selectedStatusFilter;
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ekskulName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.targetDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchEkskul && matchStatus && matchSearch;
    });
  }, [targets, selectedEkskulFilter, selectedStatusFilter, searchQuery]);

  const openAddModal = () => {
    setTargetToEdit(null);
    setFormEkskulId(extracurriculars[0]?.id || '');
    setFormTitle('');
    setFormCategory('Target Kompetensi');
    setFormTargetDesc('');
    setFormProcessDesc('');
    setFormAchievementDesc('');
    setFormEvaluationDesc('');
    setFormFollowUpDesc('');
    setFormProgress(50);
    setFormStatus('Dalam Proses');
    setFormDueDate('2025-12-20');
    setIsModalOpen(true);
  };

  const openEditModal = (target: EkskulTarget) => {
    setTargetToEdit(target);
    setFormEkskulId(target.ekskulId);
    setFormTitle(target.title);
    setFormCategory(target.category);
    setFormTargetDesc(target.targetDescription);
    setFormProcessDesc(target.processDescription);
    setFormAchievementDesc(target.achievementDescription);
    setFormEvaluationDesc(target.evaluationDescription);
    setFormFollowUpDesc(target.followUpDescription);
    setFormProgress(target.progressPercentage);
    setFormStatus(target.status);
    setFormDueDate(target.dueDate || '2025-12-20');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Form Tidak Lengkap', 'Judul target capaian wajib diisi.', 'error');
      return;
    }

    const ekskulObj = extracurriculars.find((e) => e.id === formEkskulId);
    const ekskulName = ekskulObj?.name || 'Ekstrakurikuler';

    if (targetToEdit) {
      updateTarget(targetToEdit.id, {
        ekskulId: formEkskulId,
        ekskulName,
        title: formTitle,
        category: formCategory,
        targetDescription: formTargetDesc,
        processDescription: formProcessDesc,
        achievementDescription: formAchievementDesc,
        evaluationDescription: formEvaluationDesc,
        followUpDescription: formFollowUpDesc,
        progressPercentage: Number(formProgress),
        status: formStatus,
        dueDate: formDueDate,
      });
    } else {
      addTarget({
        ekskulId: formEkskulId,
        ekskulName,
        title: formTitle,
        category: formCategory,
        targetDescription: formTargetDesc,
        processDescription: formProcessDesc,
        achievementDescription: formAchievementDesc,
        evaluationDescription: formEvaluationDesc,
        followUpDescription: formFollowUpDesc,
        progressPercentage: Number(formProgress),
        status: formStatus,
        dueDate: formDueDate,
      });
    }

    setIsModalOpen(false);
  };

  // Status color helper
  const getStatusBadge = (status: EkskulTarget['status']) => {
    switch (status) {
      case 'Tercapai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Melampaui Target':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Dalam Proses':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Siklus Mutu & Perkembangan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Target & Capaian Ekstrakurikuler
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Pemantauan target terstruktur melalui 5 tahap: <strong>Target</strong> → <strong>Proses</strong> → <strong>Capaian</strong> → <strong>Evaluasi</strong> → <strong>Tindak Lanjut</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Target Baru</span>
          </button>
        </div>
      </div>

      {/* Cycle Indicator Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 print:hidden">
        <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          Alur Siklus Target Mutu SMP Alfa Ali Masykur
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="inline-block w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold leading-5 mb-1">
              1
            </span>
            <div className="font-bold text-emerald-950">TARGET</div>
            <div className="text-[10px] text-slate-500">Standar yang diharapkan</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="inline-block w-5 h-5 rounded-full bg-blue-700 text-white text-[10px] font-bold leading-5 mb-1">
              2
            </span>
            <div className="font-bold text-slate-900">PROSES</div>
            <div className="text-[10px] text-slate-500">Langkah pembinaan & drill</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="inline-block w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold leading-5 mb-1">
              3
            </span>
            <div className="font-bold text-slate-900">CAPAIAN</div>
            <div className="text-[10px] text-slate-500">Progres nyata yang diraih</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs">
            <span className="inline-block w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold leading-5 mb-1">
              4
            </span>
            <div className="font-bold text-slate-900">EVALUASI</div>
            <div className="text-[10px] text-slate-500">Analisis hambatan & jurang</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-2xs col-span-2 sm:col-span-1">
            <span className="inline-block w-5 h-5 rounded-full bg-purple-700 text-white text-[10px] font-bold leading-5 mb-1">
              5
            </span>
            <div className="font-bold text-slate-900">TINDAK LANJUT</div>
            <div className="text-[10px] text-slate-500">Langkah perbaikan berikutnya</div>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari target, ekskul, uraian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedEkskulFilter}
            onChange={(e) => setSelectedEkskulFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="all">Semua Cabang Ekskul</option>
            {extracurriculars.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="all">Semua Status</option>
            <option value="Belum Dimulai">Belum Dimulai</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Tercapai">Tercapai</option>
            <option value="Melampaui Target">Melampaui Target</option>
          </select>
        </div>
      </div>

      {/* Target Cards */}
      <div className="space-y-4 print:hidden">
        {filteredTargets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Belum Ada Target Tercatat</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tambahkan target capaian baru untuk memandu proses latihan ekstrakurikuler siswa.
            </p>
          </div>
        ) : (
          filteredTargets.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {item.ekskulName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {item.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right mr-2">
                    <div className="text-xs text-slate-500">Tenggat Waktu:</div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.dueDate || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus target "${item.title}"?`)) {
                        deleteTarget(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="my-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-bold">Progres Ketercapaian:</span>
                  <span className="font-extrabold text-emerald-800">{item.progressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.progressPercentage >= 100
                        ? 'bg-purple-600'
                        : item.progressPercentage >= 80
                        ? 'bg-emerald-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, item.progressPercentage)}%` }}
                  />
                </div>
              </div>

              {/* 5-Step Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs mt-4">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase mb-1">1. TARGET</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{item.targetDescription || '-'}</p>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <div className="text-[10px] font-bold text-blue-800 uppercase mb-1">2. PROSES</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{item.processDescription || '-'}</p>
                </div>

                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <div className="text-[10px] font-bold text-amber-800 uppercase mb-1">3. CAPAIAN</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{item.achievementDescription || '-'}</p>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                  <div className="text-[10px] font-bold text-rose-800 uppercase mb-1">4. EVALUASI</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{item.evaluationDescription || '-'}</p>
                </div>

                <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-800 uppercase mb-1">5. TINDAK LANJUT</div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{item.followUpDescription || '-'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {targetToEdit ? 'Edit Target & Capaian' : 'Buat Target & Capaian Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cabang Ekstrakurikuler *
                  </label>
                  <select
                    value={formEkskulId}
                    onChange={(e) => setFormEkskulId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600"
                  >
                    {extracurriculars.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Target *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Target Kompetensi">Target Kompetensi (Keahlian/Keterampilan)</option>
                    <option value="Target Prestasi">Target Prestasi (Juara/Kejuaraan)</option>
                    <option value="Target Karya">Target Karya (Produk/Hasil Nyata)</option>
                    <option value="Target Karakter">Target Karakter (Disiplin & Akhlak)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Target Capaian *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kelulusan Uji SKU Penggalang Ramu & Rakit 100%"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    1. Target (Apa yang ingin dicapai?)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Standar capaian kuantitatif maupun kualitatif..."
                    value={formTargetDesc}
                    onChange={(e) => setFormTargetDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-900 mb-1">
                    2. Proses (Bagaimana cara mencapainya?)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Langkah pembinaan, latihan drill, uji berkala..."
                    value={formProcessDesc}
                    onChange={(e) => setFormProcessDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    3. Capaian (Apa yang sudah tercapai saat ini?)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Kondisi riil capaian siswa di lapangan..."
                    value={formAchievementDesc}
                    onChange={(e) => setFormAchievementDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    4. Evaluasi (Apa kekurangan atau hambatan?)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Analisis hambatan, kendala materi, atau ketertinggalan siswa..."
                    value={formEvaluationDesc}
                    onChange={(e) => setFormEvaluationDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-900 mb-1">
                    5. Tindak Lanjut (Langkah nyata ke depan)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Strategi penguatan, remedial materi, atau persiapan turnamen..."
                    value={formFollowUpDesc}
                    onChange={(e) => setFormFollowUpDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Persentase Capaian ({formProgress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={formProgress}
                    onChange={(e) => setFormProgress(Number(e.target.value))}
                    className="w-full accent-emerald-700 mt-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Target</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Belum Dimulai">Belum Dimulai</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Tercapai">Tercapai</option>
                    <option value="Melampaui Target">Melampaui Target</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Selesai</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md cursor-pointer"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print Layout */}
      <div className="hidden print:block font-serif text-slate-950 p-4">
        <OfficialLetterhead readOnly />

        <div className="text-center my-4 pb-2 border-b border-slate-800">
          <h2 className="text-base font-black uppercase tracking-wider">
            REKAPITULASI TARGET DAN CAPAIAN EKSTRAKURIKULER
          </h2>
          <p className="text-xs font-bold uppercase mt-0.5">
            SMP ALFA ALI MASYKUR WONOSOBO
          </p>
          <p className="text-[11px] text-slate-600">
            Tahun Ajaran {schoolInfo.academicYear} • Semester {schoolInfo.semester}
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-800 text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-800 p-2 text-center w-8">No</th>
              <th className="border border-slate-800 p-2 text-left w-36">Ekstrakurikuler</th>
              <th className="border border-slate-800 p-2 text-left">Target & Uraian Siklus</th>
              <th className="border border-slate-800 p-2 text-center w-20">Progres</th>
              <th className="border border-slate-800 p-2 text-center w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTargets.map((item, idx) => (
              <tr key={item.id} className="border-b border-slate-800">
                <td className="border border-slate-800 p-2 text-center align-top">{idx + 1}</td>
                <td className="border border-slate-800 p-2 align-top">
                  <strong>{item.ekskulName}</strong>
                  <div className="text-[10px] text-slate-600">{item.category}</div>
                </td>
                <td className="border border-slate-800 p-2 align-top space-y-1">
                  <div className="font-bold text-slate-950">{item.title}</div>
                  <div className="text-[11px]">
                    <strong>1. Target:</strong> {item.targetDescription}
                  </div>
                  <div className="text-[11px]">
                    <strong>2. Proses:</strong> {item.processDescription}
                  </div>
                  <div className="text-[11px]">
                    <strong>3. Capaian:</strong> {item.achievementDescription}
                  </div>
                  <div className="text-[11px]">
                    <strong>4. Evaluasi:</strong> {item.evaluationDescription}
                  </div>
                  <div className="text-[11px]">
                    <strong>5. Tindak Lanjut:</strong> {item.followUpDescription}
                  </div>
                </td>
                <td className="border border-slate-800 p-2 text-center font-bold align-top">
                  {item.progressPercentage}%
                </td>
                <td className="border border-slate-800 p-2 text-center align-top font-bold">
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-8 pt-4 flex justify-between items-start text-xs">
          <div className="text-center w-64">
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-20" />
            <p className="font-bold underline">{schoolInfo.principal || 'Afif Mashadi, S.S.'}</p>
            <p>NIP. {schoolInfo.principalNip || '19780512 200501 1 007'}</p>
          </div>

          <div className="text-center w-64">
            <p>Wonosobo, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-bold">Wakasek Kesiswaan</p>
            <div className="h-20" />
            <p className="font-bold underline">{schoolInfo.vicePrincipal || 'Yulianti, S.Pd.'}</p>
            <p>NIP. {schoolInfo.vicePrincipalNip || '19820714 200801 2 011'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
