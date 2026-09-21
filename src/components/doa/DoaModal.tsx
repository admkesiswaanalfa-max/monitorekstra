import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';

interface DoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudentId?: string | null;
}

export const DoaModal: React.FC<DoaModalProps> = ({
  isOpen,
  onClose,
  preselectedStudentId,
}) => {
  const { students, currentUser, addDoaRecord, masterDoaList, teachers } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedDoaId, setSelectedDoaId] = useState<number>(1);
  const [kelancaran, setKelancaran] = useState<string>('Lancar & Tertib');
  const [ketepatanLafaz, setKetepatanLafaz] = useState<string>('Fashih & Jelas');
  const [nilai, setNilai] = useState<number>(88);
  const [status, setStatus] = useState<'HAFAL' | 'BELUM HAFAL' | 'PERLU PENGULANGAN'>('HAFAL');
  const [catatan, setCatatan] = useState<string>('Alhamdulillah hafalan lancar tanpa ragu.');
  const [pembimbing, setPembimbing] = useState<string>(currentUser.name);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (preselectedStudentId) {
      setSelectedStudentId(preselectedStudentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [isOpen, preselectedStudentId, students]);

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const currentDoa = masterDoaList.find((d) => d.id === selectedDoaId) || masterDoaList[0];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !currentDoa) return;

    addDoaRecord({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentClass: currentStudent.class,
      namaDoa: currentDoa.nama,
      tanggal,
      kelancaran,
      ketepatanLafaz,
      nilai,
      status,
      catatan,
      pembimbing: pembimbing || currentUser.name,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] shadow-2xl border border-amber-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Input Setoran Hafalan Doa Harian</h3>
              <p className="text-xs text-amber-100">
                Target 20 Doa Pilihan Santri SMP Alfa Ali Masykur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-amber-800/60"
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
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-800 font-bold"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} &bull; Kelas {s.class} ({s.doaMasteredCount}/20 Doa Hafal)
                </option>
              ))}
            </select>
          </div>

          {/* Doa Picker */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pilih Materi Doa *</label>
            <select
              value={selectedDoaId}
              onChange={(e) => setSelectedDoaId(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-slate-900 font-bold text-xs"
            >
              {masterDoaList.map((d) => (
                <option key={d.id} value={d.id}>
                  Doa #{d.id}: {d.nama} &bull; ({d.kategori})
                </option>
              ))}
            </select>
          </div>

          {/* Arabic Preview Box */}
          {currentDoa && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Teks Doa #{currentDoa.id}: {currentDoa.nama}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">{currentDoa.kategori}</span>
              </div>
              <p className="text-right text-base sm:text-lg font-serif text-emerald-950 leading-loose pt-1" dir="rtl">
                {currentDoa.arab}
              </p>
              <p className="text-[11px] text-amber-950 font-medium italic">
                "{currentDoa.latin}"
              </p>
              <p className="text-[10px] text-slate-600">
                <strong>Artinya:</strong> {currentDoa.arti}
              </p>
            </div>
          )}

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
                  if (val >= 80) setStatus('HAFAL');
                  else if (val >= 70) setStatus('PERLU PENGULANGAN');
                  else setStatus('BELUM HAFAL');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-extrabold text-amber-900"
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
                <option value="Lancar & Tertib">Lancar & Tertib</option>
                <option value="Cukup Lancar">Cukup Lancar</option>
                <option value="Kurang Lancar">Kurang Lancar</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ketepatan Lafaz</label>
              <select
                value={ketepatanLafaz}
                onChange={(e) => setKetepatanLafaz(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800"
              >
                <option value="Fashih & Jelas">Fashih & Jelas</option>
                <option value="Cukup Fashih">Cukup Fashih</option>
                <option value="Perlu Bimbingan Makhraj">Perlu Bimbingan Makhraj</option>
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
                  status === 'HAFAL'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : status === 'PERLU PENGULANGAN'
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-rose-300 bg-rose-50 text-rose-800'
                }`}
              >
                <option value="HAFAL">HAFAL (Lulus Masuk Rekap)</option>
                <option value="PERLU PENGULANGAN">PERLU PENGULANGAN</option>
                <option value="BELUM HAFAL">BELUM HAFAL</option>
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
              placeholder="Catatan pelafalan atau anjuran doa..."
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Setoran Doa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
