import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, BookMarked, Sparkles } from 'lucide-react';

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudentId?: string | null;
}

const SURAH_JUZ_30 = [
  'An-Naba\'',
  'An-Nazi\'at',
  '\'Abasa',
  'At-Takwir',
  'Al-Infithar',
  'Al-Muthaffifin',
  'Al-Insyiqaq',
  'Al-Buruj',
  'Ath-Thariq',
  'Al-A\'la',
  'Al-Ghasyiyah',
  'Al-Fajr',
  'Al-Balad',
  'Asy-Syams',
  'Al-Lail',
  'Adh-Dhuha',
  'Al-Insyirah',
  'At-Tin',
  'Al-\'Alaq',
  'Al-Qadr',
  'Al-Bayyinah',
  'Az-Zalzalah',
  'Al-\'Adiyat',
  'Al-Qari\'ah',
  'At-Takatsur',
  'Al-\'Ashr',
  'Al-Humazah',
  'Al-Fil',
  'Quraisy',
  'Al-Ma\'un',
  'Al-Kautsar',
  'Al-Kafirun',
  'An-Nashr',
  'Al-Lahab',
  'Al-Ikhlas',
  'Al-Falaq',
  'An-Nas',
];

export const QuranModal: React.FC<QuranModalProps> = ({
  isOpen,
  onClose,
  preselectedStudentId,
}) => {
  const { students, currentUser, addQuranRecord, teachers } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [juz, setJuz] = useState<number>(30);
  const [surah, setSurah] = useState<string>('An-Naba\'');
  const [ayatMulai, setAyatMulai] = useState<number>(1);
  const [ayatAkhir, setAyatAkhir] = useState<number>(15);
  const [nilai, setNilai] = useState<number>(85);
  const [kelancaran, setKelancaran] = useState<string>('Lancar');
  const [tajwid, setTajwid] = useState<string>('Jayyid (Baik)');
  const [makhraj, setMakhraj] = useState<string>('Jayyid (Baik)');
  const [status, setStatus] = useState<'LANCAR' | 'CUKUP LANCAR' | 'PERLU MURAJAAH' | 'MENGULANG'>('LANCAR');
  const [catatan, setCatatan] = useState<string>('Hafalan mutqin, perhatikan panjang mad jaiz.');
  const [pembimbing, setPembimbing] = useState<string>(currentUser.name);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (preselectedStudentId) {
      setSelectedStudentId(preselectedStudentId);
      const s = students.find((st) => st.id === preselectedStudentId);
      if (s) {
        setJuz(s.quranJuz);
      }
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
      setJuz(students[0].quranJuz);
    }
  }, [isOpen, preselectedStudentId, students]);

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const jumlahAyat = Math.max(1, ayatAkhir - ayatMulai + 1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    addQuranRecord({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentClass: currentStudent.class,
      juz,
      surah,
      ayatMulai,
      ayatAkhir,
      jumlahAyat,
      tanggal,
      kelancaran,
      tajwid,
      makhraj,
      nilai,
      status,
      catatan,
      pembimbing: pembimbing || currentUser.name,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Input Setoran Hafalan Al-Qur'an</h3>
              <p className="text-xs text-emerald-200">
                Program Tahfidzul Qur'an Santri SMP Alfa Ali Masykur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Student Picker */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pilih Siswa *</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800 font-bold"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} &bull; Kelas {s.class} (Hafalan: Juz {s.quranJuz} &bull; {s.quranAyatCount} ayat)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pilih Surah *</label>
              <select
                value={surah}
                onChange={(e) => setSurah(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-emerald-900"
              >
                {SURAH_JUZ_30.map((sur) => (
                  <option key={sur} value={sur}>
                    Surah {sur}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Juz</label>
              <select
                value={juz}
                onChange={(e) => setJuz(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                {Array.from({ length: 30 }, (_, i) => 30 - i).map((j) => (
                  <option key={j} value={j}>
                    Juz {j} {j === 30 ? '(Juz \'Amma)' : j === 29 ? '(Tabarak)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ayat Mulai</label>
              <input
                type="number"
                min={1}
                max={300}
                required
                value={ayatMulai}
                onChange={(e) => setAyatMulai(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ayat Akhir</label>
              <input
                type="number"
                min={ayatMulai}
                max={300}
                required
                value={ayatAkhir}
                onChange={(e) => setAyatAkhir(parseInt(e.target.value) || ayatMulai)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Jumlah Ayat</label>
              <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-mono font-bold text-emerald-900 text-center">
                {jumlahAyat} Ayat
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nilai (0-100)</label>
              <input
                type="number"
                min={50}
                max={100}
                required
                value={nilai}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setNilai(val);
                  if (val >= 85) setStatus('LANCAR');
                  else if (val >= 75) setStatus('CUKUP LANCAR');
                  else if (val >= 65) setStatus('PERLU MURAJAAH');
                  else setStatus('MENGULANG');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-extrabold text-emerald-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kelancaran</label>
              <select
                value={kelancaran}
                onChange={(e) => setKelancaran(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Sangat Lancar & Tartil">Sangat Lancar & Tartil</option>
                <option value="Lancar">Lancar</option>
                <option value="Cukup Lancar">Cukup Lancar</option>
                <option value="Terbata-bata">Terbata-bata</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tajwid & Makhraj</label>
              <select
                value={tajwid}
                onChange={(e) => {
                  setTajwid(e.target.value);
                  setMakhraj(e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Mumtaz (Sangat Bagus)">Mumtaz (Sangat Bagus)</option>
                <option value="Jayyid (Baik)">Jayyid (Baik)</option>
                <option value="Maqbul (Cukup)">Maqbul (Cukup)</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Keputusan Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`w-full px-3 py-2 border rounded-xl font-bold ${
                  status === 'LANCAR'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : status === 'CUKUP LANCAR'
                    ? 'border-sky-300 bg-sky-50 text-sky-800'
                    : 'border-amber-300 bg-amber-50 text-amber-800'
                }`}
              >
                <option value="LANCAR">LANCAR (Lanjut Ayat Berikutnya)</option>
                <option value="CUKUP LANCAR">CUKUP LANCAR (Bisa Lanjut)</option>
                <option value="PERLU MURAJAAH">PERLU MURAJAAH</option>
                <option value="MENGULANG">MENGULANG (Setor Ulang)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tanggal Setoran</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Guru / Pembimbing Tahfidz</label>
            <select
              value={pembimbing}
              onChange={(e) => setPembimbing(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-medium"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} &bull; {t.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Catatan Evaluasi Pembimbing</label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan waqaf, ibtida', dengung ikhfa', dll..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Setoran Tahfidz</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
