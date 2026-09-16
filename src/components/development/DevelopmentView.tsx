import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentCompetencies, AssessmentRecord } from '../../types';
import {
  TrendingUp,
  User,
  Award,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  History,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

export const DevelopmentView: React.FC = () => {
  const {
    students,
    extracurriculars,
    assessments,
    saveAssessment,
    currentUser,
  } = useApp();

  // Selected Student & Ekskul
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedEkskulId, setSelectedEkskulId] = useState<string>(
    currentUser.assignedEkskulId || extracurriculars[0]?.id || ''
  );

  const [period, setPeriod] = useState<string>('November 2025 (Semester Ganjil)');

  // Selected Student Object
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Competency form scores (1.00 - 4.00)
  const [scores, setScores] = useState<StudentCompetencies>({
    keterampilan: 3.5,
    pengetahuan: 3.5,
    kreativitas: 3.5,
    kerjasama: 3.5,
    disiplin: 3.5,
    tanggungJawab: 3.5,
    kepemimpinan: 3.5,
    sportivitas: 3.5,
  });

  const [notes, setNotes] = useState<string>('');

  // Update form when student changes
  React.useEffect(() => {
    if (currentStudent) {
      setScores({ ...currentStudent.competencies });
      setNotes(currentStudent.notesPembina || '');
      // If student belongs to certain ekskul, select the first
      if (currentStudent.ekskulIds.length > 0 && !currentStudent.ekskulIds.includes(selectedEkskulId)) {
        setSelectedEkskulId(currentStudent.ekskulIds[0]);
      }
    }
  }, [selectedStudentId, currentStudent]);

  // Automated average score & category calculation (Section 8 Requirement)
  const averageScore = useMemo(() => {
    const values = Object.values(scores) as number[];
    const sum = values.reduce((acc, v) => acc + Number(v), 0);
    return Number((sum / values.length).toFixed(2));
  }, [scores]);

  const category = useMemo(() => {
    if (averageScore >= 3.6) return 'Sangat Baik';
    if (averageScore >= 3.0) return 'Baik';
    if (averageScore >= 2.5) return 'Cukup';
    return 'Perlu Pembinaan';
  }, [averageScore]);

  const gradeLetter = useMemo(() => {
    if (category === 'Sangat Baik') return 'A';
    if (category === 'Baik') return 'B';
    if (category === 'Cukup') return 'C';
    return 'D';
  }, [category]);

  const handleScoreChange = (field: keyof StudentCompetencies, val: number) => {
    setScores((prev) => ({
      ...prev,
      [field]: Math.min(4.0, Math.max(1.0, val)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const ekskul = extracurriculars.find((e) => e.id === selectedEkskulId);

    const record: Omit<AssessmentRecord, 'id'> = {
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      ekskulId: selectedEkskulId,
      ekskulName: ekskul?.name || 'Ekstrakurikuler',
      period,
      scores: { ...scores },
      averageScore,
      category,
      notes: notes || 'Siswa menunjukkan disiplin dan komitmen yang sangat positif dalam kegiatan ekstrakurikuler.',
      coachName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
    };

    saveAssessment(record);
  };

  // Radar chart data based on dynamic form state
  const radarData = [
    { subject: 'Keterampilan', score: scores.keterampilan },
    { subject: 'Pengetahuan', score: scores.pengetahuan },
    { subject: 'Kreativitas', score: scores.kreativitas },
    { subject: 'Kerja Sama', score: scores.kerjasama },
    { subject: 'Disiplin', score: scores.disiplin },
    { subject: 'Tanggung Jwb', score: scores.tanggungJawab },
    { subject: 'Kepemimpinan', score: scores.kepemimpinan },
    { subject: 'Sportivitas', score: scores.sportivitas },
  ];

  // Assessment History
  const studentAssessments = assessments.filter((a) => a.studentId === selectedStudentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Penilaian Perkembangan Siswa
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              8 Indikator Kompetensi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluasi berkala kompetensi teknis, pengetahuan, kepemimpinan, dan karakter siswa
          </p>
        </div>
      </div>

      {/* Target Selector Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pilih Siswa
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Kelas {s.class} - NIS: {s.nis})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Cabang Ekstrakurikuler
          </label>
          <select
            value={selectedEkskulId}
            onChange={(e) => setSelectedEkskulId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            {extracurriculars.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Periode Penilaian
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="November 2025 (Semester Ganjil)">November 2025 (Semester Ganjil)</option>
            <option value="Oktober 2025">Oktober 2025</option>
            <option value="September 2025">September 2025</option>
            <option value="Agustus 2025">Agustus 2025</option>
          </select>
        </div>
      </div>

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 8 Aspect Inputs */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Formulir 8 Indikator Kompetensi & Karakter
                </h3>
                <p className="text-xs text-slate-400">
                  Gunakan skala penilaian 1.00 (Kurang) sampai 4.00 (Sangat Unggul)
                </p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Skala 1.00 - 4.00
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'keterampilan' as const, label: '1. Aspek Teknis / Keterampilan', desc: 'Kemahiran praktik & ketangkasan fisik/teknik' },
                { key: 'pengetahuan' as const, label: '2. Aspek Pengetahuan / Teori', desc: 'Pemahaman aturan, materi, & wawasan' },
                { key: 'kreativitas' as const, label: '3. Kreativitas & Inovasi', desc: 'Inisiatif, solusi kreatif, & inovasi' },
                { key: 'kerjasama' as const, label: '4. Kerjasama Tim', desc: 'Kolaborasi, toleransi, & komunikasi regu' },
                { key: 'disiplin' as const, label: '5. Disiplin & Tanggung Jawab', desc: 'Ketepatan waktu, kehadiran, & komitmen' },
                { key: 'tanggungJawab' as const, label: '6. Tanggung Jawab & Integritas', desc: 'Kepedulian terhadap peralatan & tim' },
                { key: 'kepemimpinan' as const, label: '7. Sikap & Kepemimpinan', desc: 'Kemampuan memotivasi & menjadi teladan' },
                { key: 'sportivitas' as const, label: '8. Sportivitas & Etika', desc: 'Sikap fair-play, sopan santun, & etos' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl bg-slate-50/60 border border-slate-200/80 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800">{item.label}</label>
                    <span className="text-xs font-black text-blue-700 font-mono">
                      {scores[item.key].toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">{item.desc}</p>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.05"
                    value={scores[item.key]}
                    onChange={(e) => handleScoreChange(item.key, parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                    <span>1.0 (Kurang)</span>
                    <span>2.5 (Cukup)</span>
                    <span>3.5 (Baik)</span>
                    <span>4.0 (Sangat Baik)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Catatan Pembina / Rekomendasi */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Catatan Pembina & Saran Perkembangan
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan apresiasi, pengamatan perilaku siswa, serta rekomendasi latihan mandiri..."
                className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>
          </div>

          {/* Right: Live Calculation & Radar Visualization */}
          <div className="lg:col-span-4 space-y-4">
            {/* Automatic Grade & Category Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 rounded-2xl text-white shadow-md border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                  Hasil Perhitungan Otomatis
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs text-slate-300">Rata-rata Skor:</span>
                  <p className="text-3xl font-black text-white">{averageScore} <span className="text-sm font-normal text-slate-400">/ 4.00</span></p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-2xl font-black text-blue-200 shadow-inner">
                  {gradeLetter}
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">Predikat Kompetensi:</span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                    category === 'Sangat Baik'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : category === 'Baik'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {category}
                </span>
              </div>
            </div>

            {/* Radar Chart Component */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Visualisasi Radar Profil Kompetensi
              </h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="68%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#475569' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 4]} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                    <Radar
                      name="Skor Kompetensi"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Penilaian Siswa</span>
            </button>
          </div>
        </div>
      </form>

      {/* Assessment History for Selected Student */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Riwayat Penilaian {currentStudent?.name}
          </h4>
          <span className="text-xs text-slate-400">{studentAssessments.length} Catatan Tersimpan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-3">Periode</th>
                <th className="py-3 px-3">Ekstrakurikuler</th>
                <th className="py-3 px-3">Pembina</th>
                <th className="py-3 px-3">Rata-rata Skor</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Catatan Pembina</th>
                <th className="py-3 px-3 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentAssessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    Belum ada riwayat penilaian tersimpan untuk siswa ini.
                  </td>
                </tr>
              ) : (
                studentAssessments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{a.period}</td>
                    <td className="py-3 px-3">{a.ekskulName}</td>
                    <td className="py-3 px-3 text-slate-600">{a.coachName}</td>
                    <td className="py-3 px-3 font-black text-blue-700">{a.averageScore.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 italic max-w-xs truncate">&ldquo;{a.notes}&rdquo;</td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">{a.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
