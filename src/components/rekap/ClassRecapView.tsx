import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getAvailableClassNames } from '../../utils/classUtils';
import {
  GraduationCap,
  Users,
  Download,
  Printer,
  BookOpen,
  HeartHandshake,
  BookMarked,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ClassRecapView: React.FC = () => {
  const {
    students,
    classes,
    setSelectedStudentId,
    setCurrentView,
    schoolInfo,
    showToast,
  } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (classes && classes.length > 0) return classes[0].name;
    return 'VII-A';
  });

  // Students in selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.class === selectedClass);
  }, [students, selectedClass]);

  const currentClassInfo = classes.find((c) => c.name === selectedClass);

  // Statistics for this class
  const total = classStudents.length;
  const avgYanbua = Math.round(
    classStudents.reduce((acc, s) => acc + s.yanbuaProgressPct, 0) / Math.max(total, 1)
  );
  const avgDoa = (
    classStudents.reduce((acc, s) => acc + s.doaMasteredCount, 0) / Math.max(total, 1)
  ).toFixed(1);
  const avgAyat = Math.round(
    classStudents.reduce((acc, s) => acc + s.quranAyatCount, 0) / Math.max(total, 1)
  );
  const needHelpCount = classStudents.filter(
    (s) => s.statusSetoranHariIni === 'MENGULANG' || s.statusSetoranHariIni === 'DALAM BIMBINGAN'
  ).length;

  const handleExportCSV = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      'Kelas',
      'Jilid Yanbua',
      'Halaman',
      'Progress Yanbua %',
      'Doa Dikuasai /20',
      'Juz Quran',
      'Ayat Quran',
      'Status Setoran',
    ];

    const rows = classStudents.map((s, idx) => [
      idx + 1,
      s.nis,
      `"${s.name}"`,
      s.class,
      s.yanbuaJilid,
      s.yanbuaHalaman,
      `${s.yanbuaProgressPct}%`,
      s.doaMasteredCount,
      s.quranJuz,
      s.quranAyatCount,
      s.statusSetoranHariIni,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_kelas_${selectedClass}_alfa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Export Berhasil', `Rekap Kelas ${selectedClass} berhasil diunduh.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="no-print bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Rekapitulasi Perkembangan Per Rombel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Rekap Monitoring Ngaji & Hafalan Per Kelas
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Wali Kelas: <strong className="text-amber-300">{currentClassInfo?.waliKelas || 'Ustadz Pengampu'}</strong> &bull; Total {total} santri binaan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-600 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Kelas</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Kelas</span>
          </button>
        </div>
      </div>

      {/* Class Selector Pills */}
      <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {availableClassNames.map((clsName) => {
          const isSelected = selectedClass === clsName;
          const count = students.filter((s) => s.class === clsName).length;
          return (
            <button
              key={clsName}
              onClick={() => setSelectedClass(clsName)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-md font-extrabold scale-102'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              Kelas {clsName} ({count})
            </button>
          );
        })}
      </div>

      {/* Printable Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Print Header */}
        <div className="border-b-2 border-emerald-800 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-slate-900 leading-tight">
              LAPORAN REKAPITULASI PER KELAS &mdash; KELAS {selectedClass}
            </h3>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mt-0.5">
              SMP ALFA ALI MASYKUR &bull; TAHUN PELAJARAN {schoolInfo.academicYear}
            </p>
            <p className="text-[11px] text-slate-500">
              Wali Kelas: {currentClassInfo?.waliKelas}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-slate-700 block">Total: {total} Siswa</span>
            <span className="text-[10px] text-slate-400">Mojotengah, Wonosobo</span>
          </div>
        </div>

        {/* 4 Stat Cards for this Class */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Rata-rata Yanbu'a</span>
            <span className="text-2xl font-extrabold text-emerald-950">{avgYanbua}%</span>
            <span className="text-[10px] text-emerald-700 block">Pencapaian kurikulum</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Rata-rata Doa Harian</span>
            <span className="text-2xl font-extrabold text-amber-950">{avgDoa} / 20</span>
            <span className="text-[10px] text-amber-700 block">Doa dikuasai</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">Rata-rata Tahfidz</span>
            <span className="text-2xl font-extrabold text-sky-950">{avgAyat} Ayat</span>
            <span className="text-[10px] text-sky-700 block">Target 564 ayat</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">Perlu Pendampingan</span>
            <span className="text-2xl font-extrabold text-rose-950">{needHelpCount} Siswa</span>
            <span className="text-[10px] text-rose-700 block">Perlu murajaah intensif</span>
          </div>
        </div>

        {/* Table of Students in this Class */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-950/5 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa / NIS</th>
                <th className="py-3 px-4">Yanbu'a</th>
                <th className="py-3 px-4">Doa Harian</th>
                <th className="py-3 px-4">Tahfidz Quran</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada siswa di kelas {selectedClass}.
                  </td>
                </tr>
              ) : (
                classStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">NIS: {s.nis}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-950 text-xs">
                        {s.yanbuaJilid} &bull; Hal {s.yanbuaHalaman}
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${s.yanbuaProgressPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-amber-950 text-xs">
                        {s.doaMasteredCount} / 20 Doa
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${(s.doaMasteredCount / 20) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-sky-950 text-xs">
                        {s.quranAyatCount} Ayat (Juz {s.quranJuz})
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-sky-600 rounded-full"
                          style={{ width: `${Math.min(100, (s.quranAyatCount / 564) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.statusSetoranHariIni === 'LULUS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.statusSetoranHariIni === 'MENGULANG'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.statusSetoranHariIni}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center no-print">
                      <button
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setCurrentView('student_recap');
                        }}
                        className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title="Buka Rekap Siswa"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Signature for Print */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-1">Wali Kelas {selectedClass}</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">{currentClassInfo?.waliKelas}</p>
            <p className="text-[10px] text-slate-400">Guru Pembimbing Ngaji</p>
          </div>

          <div>
            <p className="text-slate-500">Mojotengah, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-900 mt-1">Kepala SMP Alfa Ali Masykur</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">{schoolInfo.headmaster}</p>
            <p className="text-[10px] text-slate-400">NIP. 19780512 200501 1 003</p>
          </div>
        </div>
      </div>
    </div>
  );
};
