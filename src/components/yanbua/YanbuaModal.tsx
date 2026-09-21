import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { YanbuaLevel, SubmissionStatus } from '../../types';
import { X, Save, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface YanbuaModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudentId?: string | null;
}

export const YanbuaModal: React.FC<YanbuaModalProps> = ({
  isOpen,
  onClose,
  preselectedStudentId,
}) => {
  const { students, currentUser, addYanbuaRecord, teachers } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [jilid, setJilid] = useState<YanbuaLevel>('Jilid 1');
  const [halaman, setHalaman] = useState<number>(1);
  const [materi, setMateri] = useState<string>('Halaman Pembuka & Pengenalan Huruf');
  const [nilai, setNilai] = useState<number>(85);
  const [kelancaran, setKelancaran] = useState<string>('Lancar');
  const [tajwidMakhraj, setTajwidMakhraj] = useState<string>('Jayyid (Baik)');
  const [status, setStatus] = useState<SubmissionStatus>('LULUS');
  const [catatan, setCatatan] = useState<string>('Makhraj huruf jelas, lanjutkan ke halaman berikutnya.');
  const [pembimbing, setPembimbing] = useState<string>(currentUser.name);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (preselectedStudentId) {
      setSelectedStudentId(preselectedStudentId);
      const s = students.find((st) => st.id === preselectedStudentId);
      if (s) {
        setJilid(s.yanbuaJilid);
        setHalaman(s.yanbuaHalaman + 1);
      }
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
      setJilid(students[0].yanbuaJilid);
      setHalaman(students[0].yanbuaHalaman + 1);
    }
  }, [isOpen, preselectedStudentId, students]);

  // When student selection changes
  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const s = students.find((st) => st.id === id);
    if (s) {
      setJilid(s.yanbuaJilid);
      setHalaman(s.yanbuaHalaman + 1);
    }
  };

  if (!isOpen) return null;

  const currentSelectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedStudent) return;

    addYanbuaRecord({
      studentId: currentSelectedStudent.id,
      studentName: currentSelectedStudent.name,
      studentClass: currentSelectedStudent.class,
      jilid,
      halaman,
      materi,
      tanggal,
      nilai,
      kelancaran,
      tajwidMakhraj,
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
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Input Setoran Jilid Yanbu'a</h3>
              <p className="text-xs text-emerald-200">
                Thoriqoh Baca Tulis & Menghafal Al-Qur'an
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
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-hidden text-slate-800 font-bold"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} &bull; Kelas {s.class} (Saat ini: {s.yanbuaJilid} Hal {s.yanbuaHalaman})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tingkatan Jilid</label>
              <select
                value={jilid}
                onChange={(e) => setJilid(e.target.value as YanbuaLevel)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-emerald-900"
              >
                <option value="Jilid 1">Jilid 1</option>
                <option value="Jilid 2">Jilid 2</option>
                <option value="Jilid 3">Jilid 3</option>
                <option value="Jilid 4">Jilid 4</option>
                <option value="Jilid 5">Jilid 5</option>
                <option value="Jilid 6">Jilid 6</option>
                <option value="Jilid 7">Jilid 7</option>
                <option value="Al-Qur'an">Al-Qur'an</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Halaman Disetorkan</label>
              <input
                type="number"
                min={1}
                max={604}
                required
                value={halaman}
                onChange={(e) => setHalaman(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Materi / Bahasan Khusus</label>
            <input
              type="text"
              required
              value={materi}
              onChange={(e) => setMateri(e.target.value)}
              placeholder="cth. Mad Thobi'i, Nun Sukun & Tanwin, Idgham Bighunnah"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nilai Angka (0-100)</label>
              <input
                type="number"
                min={50}
                max={100}
                required
                value={nilai}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setNilai(val);
                  if (val >= 80) setStatus('LULUS');
                  else if (val >= 70) setStatus('DALAM BIMBINGAN');
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
                <option value="Sangat Lancar">Sangat Lancar</option>
                <option value="Lancar">Lancar</option>
                <option value="Cukup Lancar">Cukup Lancar</option>
                <option value="Terbata-bata">Terbata-bata</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Tajwid & Makhraj</label>
              <select
                value={tajwidMakhraj}
                onChange={(e) => setTajwidMakhraj(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Mumtaz (Istimewa)">Mumtaz (Istimewa)</option>
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
                onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
                className={`w-full px-3 py-2 border rounded-xl font-bold ${
                  status === 'LULUS'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : status === 'MENGULANG'
                    ? 'border-rose-300 bg-rose-50 text-rose-800'
                    : 'border-amber-300 bg-amber-50 text-amber-800'
                }`}
              >
                <option value="LULUS">LULUS (Lanjut Hal Berikutnya)</option>
                <option value="DALAM BIMBINGAN">DALAM BIMBINGAN</option>
                <option value="MENGULANG">MENGULANG (Setor Kembali)</option>
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
            <label className="font-bold text-slate-700 block mb-1">Guru / Pembimbing</label>
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
              placeholder="Berikan catatan perbaikan makhorijul huruf atau pujian kelancaran..."
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
              <span>Simpan Setoran Yanbu'a</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
