import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityJournal } from '../../types';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Clock,
  Printer,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  Filter,
  X,
  Camera,
  Layers,
} from 'lucide-react';

export const JournalView: React.FC = () => {
  const {
    activityJournals,
    addActivityJournal,
    updateActivityJournal,
    deleteActivityJournal,
    extracurriculars,
    currentUser,
    schoolInfo,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEkskulFilter, setSelectedEkskulFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [journalToEdit, setJournalToEdit] = useState<ActivityJournal | null>(null);
  const [journalToPrint, setJournalToPrint] = useState<ActivityJournal | null>(null);

  // Form State
  const [formEkskulId, setFormEkskulId] = useState<string>(
    currentUser.assignedEkskulId || extracurriculars[0]?.id || ''
  );
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formDay, setFormDay] = useState<string>('Senin');
  const [formMeetingNumber, setFormMeetingNumber] = useState<number>(12);
  const [formTopic, setFormTopic] = useState<string>('');
  const [formPurpose, setFormPurpose] = useState<string>('');
  const [formActivities, setFormActivities] = useState<string>('');
  const [formTrainingMethod, setFormTrainingMethod] = useState<string>('Demonstrasi Praktik & Drill Repetisi');
  const [formTotalParticipants, setFormTotalParticipants] = useState<number>(28);
  const [formPresentCount, setFormPresentCount] = useState<number>(26);
  const [formAbsentCount, setFormAbsentCount] = useState<number>(2);
  const [formResults, setFormResults] = useState<string>('');
  const [formObstacles, setFormObstacles] = useState<string>('');
  const [formSolutions, setFormSolutions] = useState<string>('');
  const [formFollowUp, setFormFollowUp] = useState<string>('');
  const [formCoachName, setFormCoachName] = useState<string>(currentUser.name);

  // Filter journals
  const filteredJournals = useMemo(() => {
    return activityJournals.filter((j) => {
      const matchEkskul = selectedEkskulFilter === 'all' || j.ekskulId === selectedEkskulFilter;
      const matchSearch =
        j.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.ekskulName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.coachName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchEkskul && matchSearch;
    });
  }, [activityJournals, selectedEkskulFilter, searchQuery]);

  const openAddModal = () => {
    setJournalToEdit(null);
    const defaultEkskul = currentUser.assignedEkskulId || extracurriculars[0]?.id || '';
    setFormEkskulId(defaultEkskul);
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormDay('Senin');
    setFormMeetingNumber(13);
    setFormTopic('');
    setFormPurpose('');
    setFormActivities('');
    setFormTrainingMethod('Demonstrasi Praktik & Drill Repetisi');
    setFormTotalParticipants(25);
    setFormPresentCount(24);
    setFormAbsentCount(1);
    setFormResults('');
    setFormObstacles('');
    setFormSolutions('');
    setFormFollowUp('');
    setFormCoachName(currentUser.name);
    setIsModalOpen(true);
  };

  const openEditModal = (journal: ActivityJournal) => {
    setJournalToEdit(journal);
    setFormEkskulId(journal.ekskulId);
    setFormDate(journal.date);
    setFormDay(journal.day);
    setFormMeetingNumber(journal.meetingNumber);
    setFormTopic(journal.topic);
    setFormPurpose(journal.purpose);
    setFormActivities(journal.activities);
    setFormTrainingMethod(journal.trainingMethod);
    setFormTotalParticipants(journal.totalParticipants);
    setFormPresentCount(journal.presentCount);
    setFormAbsentCount(journal.absentCount);
    setFormResults(journal.results);
    setFormObstacles(journal.obstacles);
    setFormSolutions(journal.solutions);
    setFormFollowUp(journal.followUp);
    setFormCoachName(journal.coachName);
    setIsModalOpen(true);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const ekskulObj = extracurriculars.find((e) => e.id === formEkskulId);
    const ekskulName = ekskulObj?.name || 'Ekstrakurikuler';

    if (!formTopic.trim()) {
      showToast('Form Belum Lengkap', 'Silakan isi materi/topik latihan.', 'error');
      return;
    }

    if (journalToEdit) {
      updateActivityJournal(journalToEdit.id, {
        ekskulId: formEkskulId,
        ekskulName,
        date: formDate,
        day: formDay,
        meetingNumber: Number(formMeetingNumber),
        topic: formTopic,
        purpose: formPurpose,
        activities: formActivities,
        trainingMethod: formTrainingMethod,
        totalParticipants: Number(formTotalParticipants),
        presentCount: Number(formPresentCount),
        absentCount: Number(formAbsentCount),
        results: formResults,
        obstacles: formObstacles,
        solutions: formSolutions,
        followUp: formFollowUp,
        coachName: formCoachName,
      });
    } else {
      addActivityJournal({
        ekskulId: formEkskulId,
        ekskulName,
        date: formDate,
        day: formDay,
        meetingNumber: Number(formMeetingNumber),
        topic: formTopic,
        purpose: formPurpose,
        activities: formActivities,
        trainingMethod: formTrainingMethod,
        totalParticipants: Number(formTotalParticipants),
        presentCount: Number(formPresentCount),
        absentCount: Number(formAbsentCount),
        results: formResults,
        obstacles: formObstacles,
        solutions: formSolutions,
        followUp: formFollowUp,
        coachName: formCoachName,
      });
    }

    setIsModalOpen(false);
  };

  const handlePrintSingleJournal = (journal: ActivityJournal) => {
    setJournalToPrint(journal);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Administrasi Pelatih & Pembina</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Jurnal Kegiatan Ekstrakurikuler
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Dokumentasi lengkap materi latihan, proses pelaksanaan kegiatan, evaluasi hasil, kendala & solusi, serta tindak lanjut per pertemuan.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Jurnal Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari materi, ekskul, pembina..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedEkskulFilter}
            onChange={(e) => setSelectedEkskulFilter(e.target.value)}
            className="w-full sm:w-56 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="all">Semua Cabang Ekskul (12 Cabang)</option>
            {extracurriculars.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.day})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 print:hidden">
        {filteredJournals.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Belum Ada Catatan Jurnal</h3>
            <p className="text-xs text-slate-500 mt-1">
              Klik tombol &quot;Tulis Jurnal Baru&quot; untuk mendokumentasikan kegiatan latihan mingguan.
            </p>
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div
              key={journal.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        {journal.ekskulName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                        Pertemuan ke-{journal.meetingNumber}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{journal.topic}</h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handlePrintSingleJournal(journal)}
                      title="Cetak Jurnal Berkop"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(journal)}
                      title="Edit Jurnal"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus jurnal pertemuan ${journal.meetingNumber}?`)) {
                          deleteActivityJournal(journal.id);
                        }
                      }}
                      title="Hapus"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 my-3 py-2 bg-slate-50 rounded-xl px-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {journal.day}, {journal.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      Hadir: <strong>{journal.presentCount}</strong> / {journal.totalParticipants} siswa
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">Tujuan Kegiatan:</span>
                    <p className="line-clamp-2 text-slate-600 mt-0.5">{journal.purpose || '-'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">Metode Pelatihan:</span>
                    <p className="text-slate-600">{journal.trainingMethod || '-'}</p>
                  </div>
                  {journal.results && (
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">Hasil Kegiatan:</span>
                      <p className="line-clamp-2 text-slate-600 mt-0.5">{journal.results}</p>
                    </div>
                  )}
                  {journal.obstacles && (
                    <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 text-[11px] text-amber-900">
                      <strong>Kendala:</strong> {journal.obstacles}
                      {journal.solutions && (
                        <div className="mt-1 text-slate-700">
                          <strong>Solusi:</strong> {journal.solutions}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Pembina: <strong>{journal.coachName}</strong>
                </span>
                <button
                  onClick={() => handlePrintSingleJournal(journal)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                >
                  <span>Cetak Form</span>
                  <Printer className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Input / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in duration-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {journalToEdit ? 'Edit Jurnal Kegiatan' : 'Tulis Jurnal Kegiatan Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJournal} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cabang Ekstrakurikuler *
                  </label>
                  <select
                    value={formEkskulId}
                    onChange={(e) => setFormEkskulId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
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
                    Pertemuan Ke- *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={formMeetingNumber}
                    onChange={(e) => setFormMeetingNumber(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Pelaksanaan *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari *</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Ahad">Ahad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materi / Topik Latihan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Drill Receive Smash Keras dan Rotasi Libero"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tujuan Kegiatan</label>
                <textarea
                  rows={2}
                  placeholder="Tujuan yang ingin dicapai dalam latihan ini..."
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kegiatan yang Dilakukan (Proses Pelatihan)
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi langkah demi langkah proses latihan..."
                  value={formActivities}
                  onChange={(e) => setFormActivities(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Anggota</label>
                  <input
                    type="number"
                    value={formTotalParticipants}
                    onChange={(e) => setFormTotalParticipants(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jumlah Hadir</label>
                  <input
                    type="number"
                    value={formPresentCount}
                    onChange={(e) => {
                      const present = Number(e.target.value);
                      setFormPresentCount(present);
                      setFormAbsentCount(Math.max(0, formTotalParticipants - present));
                    }}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tidak Hadir</label>
                  <input
                    type="number"
                    value={formAbsentCount}
                    onChange={(e) => setFormAbsentCount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kendala / Hambatan</label>
                  <textarea
                    rows={2}
                    placeholder="Kendala fasilitas, cuaca, atau fisik siswa..."
                    value={formObstacles}
                    onChange={(e) => setFormObstacles(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Solusi Pemecahan Masalah</label>
                  <textarea
                    rows={2}
                    placeholder="Solusi langsung yang diterapkan pembina..."
                    value={formSolutions}
                    onChange={(e) => setFormSolutions(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tindak Lanjut Pertemuan Berikutnya
                </label>
                <input
                  type="text"
                  placeholder="Materi pengayaan atau perbaikan di sesi berikutnya..."
                  value={formFollowUp}
                  onChange={(e) => setFormFollowUp(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pembina / Pelatih</label>
                <input
                  type="text"
                  value={formCoachName}
                  onChange={(e) => setFormCoachName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  required
                />
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
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print Layout (Single Journal Document) */}
      {journalToPrint && (
        <div className="hidden print:block font-serif text-slate-950 p-4">
          <OfficialLetterhead readOnly />

          <div className="text-center my-4 pb-2 border-b border-slate-800">
            <h2 className="text-base font-black uppercase tracking-wider">
              JURNAL PELAKSANAAN KEGIATAN EKSTRAKURIKULER
            </h2>
            <p className="text-xs font-bold uppercase mt-0.5">
              CABANG: {journalToPrint.ekskulName} • PERTEMUAN KE-{journalToPrint.meetingNumber}
            </p>
            <p className="text-[11px] text-slate-600">
              Tahun Ajaran {schoolInfo.academicYear} • Semester {schoolInfo.semester}
            </p>
          </div>

          <table className="w-full border border-slate-800 text-xs mb-6">
            <tbody>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold w-44 bg-slate-100 border-r border-slate-800">Hari / Tanggal</td>
                <td className="p-2">
                  {journalToPrint.day}, {journalToPrint.date}
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Materi / Topik</td>
                <td className="p-2 font-bold">{journalToPrint.topic}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Tujuan Kegiatan</td>
                <td className="p-2">{journalToPrint.purpose || '-'}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Deskripsi Kegiatan</td>
                <td className="p-2 whitespace-pre-line">{journalToPrint.activities || '-'}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Metode Pelatihan</td>
                <td className="p-2">{journalToPrint.trainingMethod || '-'}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Kehadiran Peserta</td>
                <td className="p-2">
                  Total Anggota: <strong>{journalToPrint.totalParticipants}</strong> | Hadir:{' '}
                  <strong>{journalToPrint.presentCount}</strong> | Tidak Hadir:{' '}
                  <strong>{journalToPrint.absentCount}</strong>
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Hasil / Capaian</td>
                <td className="p-2">{journalToPrint.results || '-'}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Kendala Dihadapi</td>
                <td className="p-2">{journalToPrint.obstacles || '-'}</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Solusi Pemecahan</td>
                <td className="p-2">{journalToPrint.solutions || '-'}</td>
              </tr>
              <tr>
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-800">Tindak Lanjut</td>
                <td className="p-2">{journalToPrint.followUp || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Official Signatures */}
          <div className="mt-8 pt-4 flex justify-between items-start text-xs">
            <div className="text-center w-64">
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala SMP Alfa Ali Masykur</p>
              <div className="h-20" />
              <p className="font-bold underline">{schoolInfo.principal || 'Afif Mashadi, S.S.'}</p>
              <p>NIP. {schoolInfo.principalNip || '19780512 200501 1 007'}</p>
            </div>

            <div className="text-center w-64">
              <p>Wonosobo, {journalToPrint.date}</p>
              <p className="font-bold">Guru Pembina / Pelatih</p>
              <div className="h-20" />
              <p className="font-bold underline">{journalToPrint.coachName}</p>
              <p>Pembina Cabang {journalToPrint.ekskulName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
