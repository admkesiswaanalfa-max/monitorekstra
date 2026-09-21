import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  FileCode,
  HardDrive,
  Clock,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  FileText,
  AlertCircle,
  RefreshCw,
  KeyRound,
} from 'lucide-react';

export const DatabaseSnapshotManager: React.FC = () => {
  const {
    currentUser,
    switchRole,
    schoolInfo,
    setSchoolInfo,
    students,
    setStudents,
    extracurriculars,
    setExtracurriculars,
    coaches,
    setCoaches,
    achievements,
    setAchievements,
    attendanceRecords,
    setAttendanceRecords,
    activityJournals,
    setActivityJournals,
    targets,
    setTargets,
    assessments,
    setAssessments,
    classes,
    teachers,
    activityLogs,
    addActivityLog,
    showToast,
    resetToDemoData,
  } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';

  // State for inspect preview
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  // State for restore
  const [restoreMethod, setRestoreMethod] = useState<'upload' | 'paste'>('upload');
  const [pastedJson, setPastedJson] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [parsedSnapshot, setParsedSnapshot] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState<'overwrite' | 'merge'>('overwrite');
  const [createSafetyRollback, setCreateSafetyRollback] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hasRollbackPoint, setHasRollbackPoint] = useState(() => {
    return !!localStorage.getItem('SMP_ALFA_EKSKUL_SAFETY_ROLLBACK');
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate real-time snapshot object
  const currentSnapshot = useMemo(() => {
    const now = new Date();
    return {
      metadata: {
        system: 'Sistem Monitoring Ekstrakurikuler SMP Alfa Ali Masykur',
        version: '3.2.0',
        environment: 'production-ready',
        snapshotId: `SNP-${now.getTime()}`,
        exportedAt: now.toISOString(),
        exportedBy: currentUser.name,
        userRole: currentUser.role,
        entitySummary: {
          totalStudents: students.length,
          totalExtracurriculars: extracurriculars.length,
          totalCoaches: coaches.length,
          totalAttendanceRecords: attendanceRecords.length,
          totalJournals: activityJournals.length,
          totalAchievements: achievements.length,
          totalTargets: targets.length,
          totalAssessments: assessments.length,
          totalClasses: (classes || []).length,
          totalTeachers: (teachers || []).length,
          totalLogs: (activityLogs || []).length,
        },
      },
      schoolInfo,
      students,
      extracurriculars,
      coaches,
      achievements,
      attendanceRecords,
      activityJournals,
      targets,
      assessments,
      classes: classes || [],
      teachers: teachers || [],
      activityLogs: activityLogs || [],
    };
  }, [
    currentUser,
    schoolInfo,
    students,
    extracurriculars,
    coaches,
    achievements,
    attendanceRecords,
    activityJournals,
    targets,
    assessments,
    classes,
    teachers,
    activityLogs,
  ]);

  const jsonString = useMemo(() => {
    return JSON.stringify(currentSnapshot, null, 2);
  }, [currentSnapshot]);

  const snapshotSizeKb = useMemo(() => {
    return (new Blob([jsonString]).size / 1024).toFixed(1);
  }, [jsonString]);

  // Export Instant Snapshot
  const handleDownloadSnapshot = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const filename = `SNAPSHOT_SMP_ALFA_EKSKUL_${timestamp}.json`;

    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addActivityLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Ekspor Snapshot Basis Data',
      target: filename,
      timestamp: `${now.toLocaleDateString('id-ID')} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      details: `Snapshot instan berhasil diunduh (${snapshotSizeKb} KB, ${students.length} siswa, ${extracurriculars.length} ekskul).`,
    });

    showToast(
      'Snapshot Berhasil Diunduh',
      `Berkas ${filename} (${snapshotSizeKb} KB) siap disimpan untuk pemulihan state.`,
      'success'
    );
  };

  // Copy JSON to Clipboard
  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      showToast('Tersalin ke Clipboard', 'Payload snapshot JSON siap ditempel ke editor atau sistem lain.', 'info');
    } catch (err) {
      showToast('Gagal Menyalin', 'Izin clipboard browser tidak tersedia.', 'error');
    }
  };

  // Validate JSON string
  const validateAndParseJson = (rawText: string, filename?: string) => {
    setValidationError(null);
    setParsedSnapshot(null);

    if (!rawText.trim()) {
      setValidationError('Konten JSON masih kosong.');
      return;
    }

    try {
      const parsed = JSON.parse(rawText);

      // Check essential keys
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Format root JSON harus berupa objek valid.');
      }

      if (!parsed.students || !Array.isArray(parsed.students)) {
        throw new Error("Objek snapshot tidak memiliki koleksi array 'students' yang valid.");
      }

      if (!parsed.extracurriculars || !Array.isArray(parsed.extracurriculars)) {
        throw new Error("Objek snapshot tidak memiliki koleksi array 'extracurriculars' yang valid.");
      }

      setParsedSnapshot(parsed);
      if (filename) setSelectedFileName(filename);
      showToast('Snapshot Terverifikasi', 'Format data valid dan siap dipulihkan ke sistem.', 'success');
    } catch (err: any) {
      setValidationError(err.message || 'File JSON tidak valid atau struktur data rusak.');
      setParsedSnapshot(null);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setValidationError('Berkas yang dipilih harus berformat .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      validateAndParseJson(content, file.name);
    };
    reader.onerror = () => {
      setValidationError('Gagal membaca file dari komputer.');
    };
    reader.readAsText(file);
  };

  // Paste handler
  const handlePasteChange = (val: string) => {
    setPastedJson(val);
    if (val.trim()) {
      validateAndParseJson(val, 'Input Paste Teks');
    } else {
      setParsedSnapshot(null);
      setValidationError(null);
    }
  };

  // Execute State Recovery
  const executeRestore = () => {
    if (!parsedSnapshot) return;

    const now = new Date();

    // 1. Safety Rollback snapshot save
    if (createSafetyRollback) {
      try {
        localStorage.setItem('SMP_ALFA_EKSKUL_SAFETY_ROLLBACK', jsonString);
        localStorage.setItem('SMP_ALFA_EKSKUL_ROLLBACK_TIMESTAMP', now.toISOString());
        setHasRollbackPoint(true);
      } catch (err) {
        console.warn('Gagal menyimpan rollback point ke local storage', err);
      }
    }

    // 2. Perform State Recovery
    try {
      if (recoveryMode === 'overwrite') {
        if (parsedSnapshot.schoolInfo) setSchoolInfo(parsedSnapshot.schoolInfo);
        if (parsedSnapshot.students) setStudents(parsedSnapshot.students);
        if (parsedSnapshot.extracurriculars) setExtracurriculars(parsedSnapshot.extracurriculars);
        if (parsedSnapshot.coaches) setCoaches(parsedSnapshot.coaches);
        if (parsedSnapshot.achievements) setAchievements(parsedSnapshot.achievements);
        if (parsedSnapshot.attendanceRecords) setAttendanceRecords(parsedSnapshot.attendanceRecords);
        if (parsedSnapshot.activityJournals) setActivityJournals(parsedSnapshot.activityJournals);
        if (parsedSnapshot.targets) setTargets(parsedSnapshot.targets);
        if (parsedSnapshot.assessments) setAssessments(parsedSnapshot.assessments);
      } else {
        // Merge mode
        if (parsedSnapshot.students) {
          setStudents((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const newOnes = parsedSnapshot.students.filter((s: any) => !existingIds.has(s.id));
            return [...prev, ...newOnes];
          });
        }
        if (parsedSnapshot.extracurriculars) {
          setExtracurriculars((prev) => {
            const existingIds = new Set(prev.map((e) => e.id));
            const newOnes = parsedSnapshot.extracurriculars.filter((e: any) => !existingIds.has(e.id));
            return [...prev, ...newOnes];
          });
        }
        if (parsedSnapshot.achievements) {
          setAchievements((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newOnes = parsedSnapshot.achievements.filter((a: any) => !existingIds.has(a.id));
            return [...prev, ...newOnes];
          });
        }
      }

      addActivityLog({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Pemulihan State Database (Restore)',
        target: selectedFileName || 'Manual Snapshot',
        timestamp: `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID')}`,
        details: `Pemulihan basis data mode ${recoveryMode === 'overwrite' ? 'TIMPA TOTAL' : 'PENGGABUNGAN'}. Dipulihkan: ${parsedSnapshot.students?.length || 0} santri, ${parsedSnapshot.extracurriculars?.length || 0} ekskul.`,
      });

      setIsConfirmModalOpen(false);
      setParsedSnapshot(null);
      setSelectedFileName(null);
      setPastedJson('');

      showToast(
        'Basis Data Berhasil Dipulihkan!',
        `Sistem berhasil memulihkan seluruh state aplikasi sesuai snapshot terpilih.`,
        'success'
      );
    } catch (err: any) {
      showToast('Gagal Memulihkan State', err.message || 'Terjadi kesalahan saat memulihkan database.', 'error');
    }
  };

  // Rollback to previous state
  const handleRollback = () => {
    const rollbackStr = localStorage.getItem('SMP_ALFA_EKSKUL_SAFETY_ROLLBACK');
    if (!rollbackStr) {
      showToast('Tidak Ada Titik Rollback', 'Belum ada cadangan otomatis sebelum pemulihan.', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(rollbackStr);
      if (parsed.schoolInfo) setSchoolInfo(parsed.schoolInfo);
      if (parsed.students) setStudents(parsed.students);
      if (parsed.extracurriculars) setExtracurriculars(parsed.extracurriculars);
      if (parsed.coaches) setCoaches(parsed.coaches);
      if (parsed.achievements) setAchievements(parsed.achievements);
      if (parsed.attendanceRecords) setAttendanceRecords(parsed.attendanceRecords);
      if (parsed.activityJournals) setActivityJournals(parsed.activityJournals);
      if (parsed.targets) setTargets(parsed.targets);
      if (parsed.assessments) setAssessments(parsed.assessments);

      addActivityLog({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Rollback State Database',
        target: 'Titik Pemulihan Otomatis',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        details: 'Mengembalikan state sistem ke titik aman sebelum pemulihan terakhir.',
      });

      showToast('Rollback Berhasil', 'State sistem berhasil dikembalikan ke titik sebelum restore.', 'success');
    } catch (err) {
      showToast('Gagal Rollback', 'File titik rollback tidak dapat dimuat.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Status Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-7 border border-emerald-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs shadow-md">
                <ShieldCheck className="w-4 h-4 text-emerald-950" />
                <span>SUPER ADMIN CONSOLE</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                Otoritas Penuh: Snapshot & Pemulihan State
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Snapshot Basis Data & State Recovery
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              Alat kendali darurat dan pencadangan instan untuk Super Admin SMP Alfa Ali Masykur. Lakukan snapshot lengkap dalam format JSON terstruktur atau pulihkan state sistem seketika dengan integritas data terjamin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isSuperAdmin ? (
              <button
                type="button"
                onClick={() => switchRole('super_admin')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Beralih ke Super Admin</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-900/80 px-3.5 py-2 rounded-xl border border-emerald-600/50 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-[10px] text-amber-300 font-mono">({currentUser.role})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live System Metrics Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Kesehatan & Metrik Basis Data Aktif
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Estimasi Ukuran JSON:</span>
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {snapshotSizeKb} KB
            </span>
            <span className="text-slate-500 ml-1">Skema:</span>
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              v3.2.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Santri / Siswa
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{students.length}</p>
            <span className="text-[10px] text-emerald-700 font-medium">Record Aktif</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Ekstrakurikuler
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{extracurriculars.length}</p>
            <span className="text-[10px] text-emerald-700 font-medium">12 Cabang Resmi</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Presensi Siswa
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{attendanceRecords.length}</p>
            <span className="text-[10px] text-emerald-700 font-medium">Pertemuan</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Jurnal Kegiatan
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{activityJournals.length}</p>
            <span className="text-[10px] text-emerald-700 font-medium">Catatan Pembina</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Prestasi & Medali
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{achievements.length}</p>
            <span className="text-[10px] text-amber-700 font-medium">Kejuaraan</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Audit Trail Log
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{(activityLogs || []).length}</p>
            <span className="text-[10px] text-slate-600 font-medium">Rekaman Jejak</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Controls: Snapshot Export (Left) & Restore (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: INSTANT DATABASE SNAPSHOT EXPORT */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    1. Instant Snapshot Export (JSON)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unduh snapshot atomik seluruh state aplikasi seketika.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Format .json
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Cakupan Data Snapshot Instan:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
                <li>Metadata & waktu stempel pembuatan oleh Super Admin aktif.</li>
                <li>Identitas resmi SMP Alfa Ali Masykur, NIP, & konfigurasi kop surat.</li>
                <li>Seluruh 32 santri demo / data real, foto, wali, nilai, dan kompetensi.</li>
                <li>12 cabang ekstrakurikuler, pembina, pelatih, target capaian, & kuota.</li>
                <li>Rekap pertemuan presensi kehadiran dan jurnal harian kegiatan.</li>
                <li>Arsip kejuaraan, piagam prestasi, dan jejak aktivitas audit log.</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadSnapshot}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Snapshot Instan (.json)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyClipboard}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs transition-all border border-slate-200 cursor-pointer"
                title="Salin isi JSON ke Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowJsonPreview(!showJsonPreview)}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-bold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                {showJsonPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showJsonPreview ? 'Tutup Preview' : 'Intip Struktur'}</span>
              </button>
            </div>

            {/* Collapsible JSON Preview */}
            {showJsonPreview && (
              <div className="mt-4 p-3.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-2xl border border-slate-800 max-h-60 overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between text-slate-400 text-[10px] pb-2 mb-2 border-b border-slate-800">
                  <span>SNAPSHOT LIVE PREVIEW</span>
                  <span>{snapshotSizeKb} KB</span>
                </div>
                <pre className="whitespace-pre-wrap leading-tight">{jsonString.slice(0, 1500)}...</pre>
                <p className="text-[10px] text-slate-500 mt-2 italic">
                  *Menampilkan 1.500 karakter pertama dari payload penuh.
                </p>
              </div>
            )}
          </div>

          {/* Snapshot Info Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Realtime Synced
            </span>
            <span>SMP Alfa Ali Masykur TP 2026/2027</span>
          </div>
        </div>

        {/* PANEL 2: MANUAL DATABASE RESTORE & STATE RECOVERY */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    2. Manual Restore & State Recovery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pulihkan basis data dari berkas snapshot terverifikasi.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Super Admin Only
              </span>
            </div>

            {/* Input Selection Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRestoreMethod('upload');
                  setValidationError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  restoreMethod === 'upload'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload File Snapshot (.json)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRestoreMethod('paste');
                  setValidationError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  restoreMethod === 'paste'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tempel Langsung (Raw JSON)
              </button>
            </div>

            {/* File Upload Mode */}
            {restoreMethod === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Klik untuk memilih file snapshot JSON
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      atau drag-and-drop file snapshot cadangan ke sini
                    </p>
                  </div>
                  {selectedFileName && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold mt-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedFileName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paste Mode */}
            {restoreMethod === 'paste' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Tempel Konten JSON Snapshot:
                </label>
                <textarea
                  rows={5}
                  value={pastedJson}
                  onChange={(e) => handlePasteChange(e.target.value)}
                  placeholder="Paste payload snapshot JSON di sini (misal: { 'metadata': {...}, 'students': [...] })"
                  className="w-full p-3 bg-slate-50 font-mono text-[11px] border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>
            )}

            {/* Validation Feedback & Inspector */}
            {validationError && (
              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Validasi Gagal:</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{validationError}</p>
                </div>
              </div>
            )}

            {parsedSnapshot && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Integritas Terverifikasi Lolos</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Valid Schema
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">Lembaga:</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {parsedSnapshot.schoolInfo?.name || 'SMP ALFA ALI MASYKUR'}
                    </span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">Waktu Ekspor:</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {parsedSnapshot.metadata?.exportedAt
                        ? new Date(parsedSnapshot.metadata.exportedAt).toLocaleDateString('id-ID')
                        : 'Snapshot'}
                    </span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">Santri Terdeteksi:</span>
                    <span className="font-bold text-emerald-800">
                      {parsedSnapshot.students?.length || 0} Santri
                    </span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">Ekstrakurikuler:</span>
                    <span className="font-bold text-emerald-800">
                      {parsedSnapshot.extracurriculars?.length || 0} Cabang
                    </span>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Metode Pemulihan:</span>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="recovery_mode"
                        checked={recoveryMode === 'overwrite'}
                        onChange={() => setRecoveryMode('overwrite')}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span className="font-bold text-slate-800 text-[11px]">Timpa Total (Clean)</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="recovery_mode"
                        checked={recoveryMode === 'merge'}
                        onChange={() => setRecoveryMode('merge')}
                        className="text-emerald-700 focus:ring-emerald-700"
                      />
                      <span className="font-medium text-slate-700 text-[11px]">Gabungkan (Merge)</span>
                    </label>
                  </div>
                </div>

                {/* Safety Rollback Option */}
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 pt-1">
                  <input
                    type="checkbox"
                    checked={createSafetyRollback}
                    onChange={(e) => setCreateSafetyRollback(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-700"
                  />
                  <span>Simpan titik pemulihan otomatis (Safety Rollback) sebelum restore</span>
                </label>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-emerald-950 font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Pulihkan State Basis Data Sekarang</span>
                </button>
              </div>
            )}
          </div>

          {/* Rollback Available Box */}
          {hasRollbackPoint && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                Tersedia Titik Rollback Otomatis
              </span>
              <button
                type="button"
                onClick={handleRollback}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer"
              >
                Kembalikan State Sebelumnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Safeguard Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Konfirmasi Pemulihan State Database
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tindakan ini memerlukan otorisasi Super Admin SMP Alfa Ali Masykur.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-bold">Perhatian Penting:</p>
              <p className="leading-relaxed">
                {recoveryMode === 'overwrite'
                  ? 'Mode Timpa Total akan menggantikan seluruh siswa, presensi, jurnal, nilai, dan konfigurasi aktif dengan data dari snapshot yang Anda muat.'
                  : 'Mode Gabungkan akan menambahkan data baru dari snapshot tanpa menghapus data aktif yang ada saat ini.'}
              </p>
              {createSafetyRollback && (
                <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Titik Safety Rollback otomatis akan disimpan sebelum proses dimulai.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={executeRestore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Ya, Eksekusi Pemulihan Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
