import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/initialData';
import { User, UserRole } from '../../types';
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  BookOpen,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  HelpCircle,
  Phone,
  Layers,
  Award,
  ClipboardCheck,
  FileSpreadsheet,
  Users,
} from 'lucide-react';

interface RoleConfig {
  role: UserRole;
  name: string;
  badge: string;
  portalTitle: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  lightBg: string;
  borderActive: string;
  ringColor: string;
  badgeBg: string;
  badgeText: string;
  primaryBtn: string;
  capabilities: { title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[];
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  admin: {
    role: 'admin',
    name: 'Administrator SIM',
    badge: 'Akses Penuh • Level Administrator',
    portalTitle: 'Portal Masuk Administrator SIM',
    tagline: 'Manajemen Master Data, Konfigurasi Sekolah, & Hak Akses',
    description:
      'Akses terpusat untuk mengelola basis data kesiswaan, penugasan pembina dan pelatih, konfigurasi tahun akademik, pengaturan kop surat, serta manajemen akun pengguna (RBAC).',
    icon: Shield,
    accentColor: 'indigo',
    lightBg: 'bg-indigo-50/70',
    borderActive: 'border-indigo-600',
    ringColor: 'ring-indigo-500/30',
    badgeBg: 'bg-indigo-100/80',
    badgeText: 'text-indigo-800',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-600/30',
    capabilities: [
      {
        title: 'Manajemen Master Data Siswa & Ekskul',
        desc: 'Pendaftaran anggota, pembagian cabang, dan pengaturan kuota',
        icon: Users,
      },
      {
        title: 'Konfigurasi Tahun Ajaran & Kop Surat',
        desc: 'Pengaturan semester aktif, logo ganda, dan format dokumen resmi',
        icon: Building2,
      },
      {
        title: 'Manajemen Pengguna & Hak Akses (RBAC)',
        desc: 'Pemberian peran, reset sandi, dan audit log aktivitas sistem',
        icon: Shield,
      },
      {
        title: 'Rekapitulasi & Ekspor Laporan Sekolah',
        desc: 'Cetak buku induk nilai, statistik capaian, dan arsip kelulusan',
        icon: FileSpreadsheet,
      },
    ],
  },
  kepala_sekolah: {
    role: 'kepala_sekolah',
    name: 'Kepala Sekolah',
    badge: 'Akses Eksekutif • Supervisi & Pengesahan Rapor',
    portalTitle: 'Portal Eksekutif Kepala Sekolah',
    tagline: 'Supervisi Capaian Mutu, Evaluasi Pembina, & Validasi Rapor',
    description:
      'Akses pengawasan strategis untuk memantau tren partisipasi peserta didik, mengevaluasi efektivitas program pembinaan, serta memberikan pengesahan resmi atas buku rapor ekstrakurikuler.',
    icon: GraduationCap,
    accentColor: 'emerald',
    lightBg: 'bg-emerald-50/70',
    borderActive: 'border-emerald-600',
    ringColor: 'ring-emerald-500/30',
    badgeBg: 'bg-emerald-100/80',
    badgeText: 'text-emerald-800',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-600/30',
    capabilities: [
      {
        title: 'Pemantauan Indikator Kinerja Utama (KPI)',
        desc: 'Analisis tingkat keaktifan, komparasi antar-cabang, dan capaian target',
        icon: Layers,
      },
      {
        title: 'Pengesahan & Validasi Rapor Ekstrakurikuler',
        desc: 'Verifikasi nilai akhir dan pembubuhan tanda tangan resmi satuan pendidikan',
        icon: CheckCircle2,
      },
      {
        title: 'Supervisi Catatan Prestasi & Piagam Juara',
        desc: 'Peninjauan rekam jejak kejuaraan tingkat kota, provinsi, dan nasional',
        icon: Award,
      },
      {
        title: 'Evaluasi Pembina & Alokasi Fasilitas',
        desc: 'Tinjauan jurnal latihan mingguan dan usulan kebutuhan sarana penunjang',
        icon: ClipboardCheck,
      },
    ],
  },
  pembina: {
    role: 'pembina',
    name: 'Pembina Ekskul',
    badge: 'Akses Pelatih • Presensi & Penilaian Anggota',
    portalTitle: 'Portal Pembina & Pelatih Ekstrakurikuler',
    tagline: 'Presensi Pertemuan, Asesmen Karakter, & Catatan Kejuaraan',
    description:
      'Akses khusus bagi guru pembina dan pelatih cabang untuk mencatat kehadiran latihan berkala, menilai perkembangan kompetensi dan nilai karakter, serta mendokumentasikan raihan kejuaraan.',
    icon: BookOpen,
    accentColor: 'blue',
    lightBg: 'bg-blue-50/70',
    borderActive: 'border-blue-600',
    ringColor: 'ring-blue-500/30',
    badgeBg: 'bg-blue-100/80',
    badgeText: 'text-blue-800',
    primaryBtn: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-600/30',
    capabilities: [
      {
        title: 'Input & Rekap Presensi Latihan Rutin',
        desc: 'Pencatatan status hadir, sakit, izin, atau alpa per jadwal pertemuan',
        icon: ClipboardCheck,
      },
      {
        title: 'Penilaian 7 Dimensi Capaian Karakter',
        desc: 'Asesmen kedisiplinan, kerjasama, keterampilan, teknik, dan sportivitas',
        icon: Award,
      },
      {
        title: 'Dokumentasi Prestasi & Riwayat Kejuaraan',
        desc: 'Pencatatan medali, sertifikat lomba, dan riwayat delegasi sekolah',
        icon: Sparkles,
      },
      {
        title: 'Monitoring Siswa Binaan Per Cabang',
        desc: 'Daftar nama anggota aktif dengan pelacakan tingkat partisipasi',
        icon: Users,
      },
    ],
  },
  wali_kelas: {
    role: 'wali_kelas',
    name: 'Wali Kelas',
    badge: 'Akses Kelas • Verifikasi Nilai & Cetak Rapor',
    portalTitle: 'Portal Wali Kelas & Guru Perwalian',
    tagline: 'Pemantauan Keaktifan Kelas, Nilai Rapor, & Rekomendasi Siswa',
    description:
      'Akses khusus bagi wali kelas untuk meninjau partisipasi ekstrakurikuler seluruh siswa di kelas perwalian, memverifikasi deskripsi capaian rapor, serta mencetak lembar pelengkap rapor.',
    icon: UserCheck,
    accentColor: 'amber',
    lightBg: 'bg-amber-50/70',
    borderActive: 'border-amber-600',
    ringColor: 'ring-amber-500/30',
    badgeBg: 'bg-amber-100/80',
    badgeText: 'text-amber-800',
    primaryBtn: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-amber-600/30',
    capabilities: [
      {
        title: 'Pemantauan Siswa Perwalian Kelas',
        desc: 'Daftar partisipasi seluruh siswa kelas dalam aneka cabang ekskul',
        icon: Users,
      },
      {
        title: 'Sinkronisasi Nilai ke Lembar Rapor',
        desc: 'Verifikasi predikat (A/B/C/D) dan deskripsi narasi kompetensi siswa',
        icon: FileSpreadsheet,
      },
      {
        title: 'Deteksi Dini Siswa Kurang Aktif',
        desc: 'Pemberitahuan siswa yang belum memiliki ekskul atau tingkat kehadiran rendah',
        icon: AlertCircle,
      },
      {
        title: 'Cetak Lembar Nilai Ekstrakurikuler Rapor',
        desc: 'Cetak lembar lampiran rapor kelas siap dibagikan kepada wali murid',
        icon: CheckCircle2,
      },
    ],
  },
};

export const LoginPage: React.FC = () => {
  const { login, schoolInfo, extracurriculars } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@smpalfaalimasykur.sch.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Specific role contextual options
  const [selectedEkskulId, setSelectedEkskulId] = useState<string>('ekskul-1'); // Pramuka
  const [selectedClass, setSelectedClass] = useState<string>('VIII-A');

  // Interactive states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const activeConfig = ROLE_CONFIGS[selectedRole];

  // Available sample accounts for quick selection per role
  const sampleUsersForRole = useMemo(() => {
    return INITIAL_USERS.filter((u) => u.role === selectedRole);
  }, [selectedRole]);

  // Role switch handler
  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setErrorMessage('');

    if (newRole === 'admin') {
      setEmail('admin@smpalfaalimasykur.sch.id');
      setPassword('admin123');
    } else if (newRole === 'kepala_sekolah') {
      setEmail('kepsek@smpalfaalimasykur.sch.id');
      setPassword('kepsek123');
    } else if (newRole === 'pembina') {
      const pembinaUser = INITIAL_USERS.find((u) => u.role === 'pembina') || INITIAL_USERS[2];
      setEmail(pembinaUser.email);
      setPassword('pembina123');
      if (pembinaUser.assignedEkskulId) {
        setSelectedEkskulId(pembinaUser.assignedEkskulId);
      }
    } else if (newRole === 'wali_kelas') {
      const waliUser = INITIAL_USERS.find((u) => u.role === 'wali_kelas') || INITIAL_USERS[4];
      setEmail(waliUser.email);
      setPassword('walikelas123');
      if (waliUser.assignedClass) {
        setSelectedClass(waliUser.assignedClass);
      }
    }
  };

  // Handler for selecting specific coach
  const handleSelectCoachAccount = (userId: string) => {
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setEmail(user.email);
      if (user.assignedEkskulId) {
        setSelectedEkskulId(user.assignedEkskulId);
      }
    }
  };

  // Handler for selecting specific wali kelas
  const handleSelectWaliAccount = (userId: string) => {
    const user = INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setEmail(user.email);
      if (user.assignedClass) {
        setSelectedClass(user.assignedClass);
      }
    }
  };

  // Direct 1-click login
  const handleInstantLogin = (role: UserRole, targetUser?: User) => {
    setIsSubmitting(true);
    setTimeout(() => {
      let finalUser = targetUser;
      if (!finalUser) {
        finalUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
      }
      login(finalUser);
      setIsSubmitting(false);
    }, 400);
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan username, email, atau NIP resmi Anda.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi akun.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      // Find matching user from initial dataset or synthesize role-configured user
      let matched =
        INITIAL_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ||
        INITIAL_USERS.find((u) => u.role === selectedRole);

      if (matched) {
        // Apply contextual selection
        if (selectedRole === 'pembina') {
          matched = {
            ...matched,
            assignedEkskulId: selectedEkskulId,
          };
        } else if (selectedRole === 'wali_kelas') {
          matched = {
            ...matched,
            assignedClass: selectedClass,
          };
        }
        login(matched);
      } else {
        // Fallback user matching the role
        const fallback: User = {
          id: `user-${selectedRole}-${Date.now()}`,
          name:
            selectedRole === 'admin'
              ? 'Administrator SIM'
              : selectedRole === 'kepala_sekolah'
              ? 'Kepala Sekolah'
              : selectedRole === 'pembina'
              ? 'Pembina Ekstrakurikuler'
              : 'Wali Kelas',
          email: email.trim(),
          role: selectedRole,
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          assignedEkskulId: selectedRole === 'pembina' ? selectedEkskulId : undefined,
          assignedClass: selectedRole === 'wali_kelas' ? selectedClass : undefined,
        };
        login(fallback);
      }
      setIsSubmitting(false);
    }, 500);
  };

  const RoleIcon = activeConfig.icon;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Ambience & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        {/* School Branding Header */}
        <header className="text-center mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lg mb-4 animate-in fade-in slide-in-from-top-3 duration-300">
            {schoolInfo.logoUrl ? (
              <img
                src={schoolInfo.logoUrl}
                alt="Logo Sekolah"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                SIM
              </div>
            )}
            <span className="text-xs font-semibold tracking-wide uppercase">
              {schoolInfo.foundationName || 'YAYASAN PENDIDIKAN ALFA ALI MASYKUR'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {schoolInfo.name}
          </h1>

          <p className="mt-2 text-sm sm:text-base font-semibold text-blue-300">
            Sistem Informasi Monitoring & Evaluasi Ekstrakurikuler (SIM-EKSKUL)
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Tahun Ajaran {schoolInfo.academicYear} &bull; Semester {schoolInfo.semester}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Terakreditasi A (Unggul) &bull; NPSN: {schoolInfo.npsn}
            </span>
          </div>
        </header>

        {/* Section 1: Role Selection Tabs ("Pilih Peran Pengguna") */}
        <section className="w-full max-w-4xl mb-6">
          <div className="text-center mb-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Langkah 1: Tentukan Peran Akun Anda di Satuan Pendidikan
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {(['admin', 'kepala_sekolah', 'pembina', 'wali_kelas'] as UserRole[]).map((r) => {
              const cfg = ROLE_CONFIGS[r];
              const isSelected = selectedRole === r;
              const Icon = cfg.icon;

              return (
                <button
                  key={r}
                  type="button"
                  id={`btn-role-tab-${r}`}
                  onClick={() => handleRoleChange(r)}
                  className={`relative flex flex-col p-3.5 rounded-2xl border transition-all text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white shadow-xl ring-4 ring-blue-500/30 scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? `${cfg.badgeBg} ${cfg.badgeText}`
                          : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {isSelected ? (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-slate-500" />
                    )}
                  </div>

                  <p className="font-bold text-sm leading-snug tracking-tight">
                    {cfg.name}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-slate-600 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {r === 'admin'
                      ? 'Akses Penuh IT'
                      : r === 'kepala_sekolah'
                      ? 'Supervisi & Rapor'
                      : r === 'pembina'
                      ? 'Presensi & Nilai'
                      : 'Wali Kelas & Nilai'}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Split View Form & Role Details */}
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (5 cols): Role Context, Authorities & Responsibilities */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-800/90 to-slate-800/60 border border-slate-700 rounded-2xl p-5 sm:p-6 text-white flex flex-col justify-between shadow-xl backdrop-blur-md">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 border bg-white/10 border-white/20">
                <RoleIcon className="w-3.5 h-3.5 text-blue-300" />
                <span>{activeConfig.badge}</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {activeConfig.portalTitle}
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeConfig.description}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-700/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Wewenang & Fitur Utama:
                </p>

                <div className="space-y-3">
                  {activeConfig.capabilities.map((cap, idx) => {
                    const CapIcon = cap.icon;
                    return (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                          <CapIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white leading-tight">
                            {cap.title}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                            {cap.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Helper / Reminder */}
            <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Keamanan SIM: RBAC Aktif</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Siap Digunakan
              </span>
            </div>
          </div>

          {/* Right Column (7 cols): The Role-Tailored Login Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Masuk ke Akun {activeConfig.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Silakan verifikasi identitas resmi Anda untuk membuka dasbor.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <RoleIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Error Notification */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ROLE-SPECIFIC SELECTORS */}

                {/* 1. If Pembina: Option to pick which extracurricular / Coach is being managed */}
                {selectedRole === 'pembina' && (
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-blue-900">
                        Cabang Ekstrakurikuler Binaan:
                      </label>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Terkoneksi Otomatis
                      </span>
                    </div>

                    <select
                      id="select-login-ekskul"
                      value={selectedEkskulId}
                      onChange={(e) => {
                        setSelectedEkskulId(e.target.value);
                        // find matching coach
                        const selectedEks = extracurriculars.find((item) => item.id === e.target.value);
                        if (selectedEks) {
                          const coachMatch = INITIAL_USERS.find(
                            (u) => u.assignedEkskulId === selectedEks.id || u.id === selectedEks.coachId
                          );
                          if (coachMatch) {
                            setEmail(coachMatch.email);
                          }
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      {extracurriculars.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} &bull; Pembina: {e.coachName}
                        </option>
                      ))}
                    </select>

                    <p className="text-[11px] text-blue-700/80 mt-1.5 leading-snug">
                      Memilih cabang akan langsung menyesuaikan lembar presensi dan instrumen penilaian ke ekskul tersebut.
                    </p>
                  </div>
                )}

                {/* 2. If Wali Kelas: Option to pick which class is handled */}
                {selectedRole === 'wali_kelas' && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-amber-900">
                        Kelas Perwalian Binaan:
                      </label>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Filter Rapor Otomatis
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {['VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-C'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setSelectedClass(cls);
                            const matched = INITIAL_USERS.find((u) => u.assignedClass === cls);
                            if (matched) {
                              setEmail(matched.email);
                            }
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                            selectedClass === cls
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          Kelas {cls}
                        </button>
                      ))}
                    </div>

                    <p className="text-[11px] text-amber-800/80 mt-2 leading-snug">
                      Wali Kelas {selectedClass} akan langsung melihat perkembangan dan nilai rapor ekskul siswa kelas ini.
                    </p>
                  </div>
                )}

                {/* Username / Email / NIP Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {selectedRole === 'kepala_sekolah'
                      ? 'NIP / Email Resmi Kepala Sekolah'
                      : selectedRole === 'admin'
                      ? 'Username / Email Administrator'
                      : selectedRole === 'pembina'
                      ? 'Email Guru Pembina / Pelatih'
                      : 'Email / NIP Guru Wali Kelas'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="input-login-email"
                      type="text"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-medium transition-colors"
                      placeholder="nama@smpalfaalimasykur.sch.id"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi Akun
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 font-medium transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-hidden"
                      aria-label="Tampilkan Kata Sandi"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Ingat sesi login di perangkat ini
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedRole}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-2 py-3 px-4 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeConfig.primaryBtn
                  } ${isSubmitting ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Akun {activeConfig.name}...</span>
                    </div>
                  ) : (
                    <>
                      <span>Masuk sebagai {activeConfig.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Account Quick Fill Buttons for Active Role */}
            {sampleUsersForRole.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2">
                  Pilih Akun Terdaftar ({activeConfig.name}):
                </p>
                <div className="space-y-1.5">
                  {sampleUsersForRole.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setEmail(u.email);
                        if (u.assignedEkskulId) setSelectedEkskulId(u.assignedEkskulId);
                        if (u.assignedClass) setSelectedClass(u.assignedClass);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-left border border-slate-200/80 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="truncate">
                          <p className="font-bold text-slate-800 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-600 shrink-0 ml-2">
                        Pilih & Isi
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: One-Click Demo Access Grid */}
        <section className="w-full max-w-4xl mt-8">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Akses Cepat Pengujian Peran (Simulasi 1-Klik)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik langsung untuk menguji tampilan dan kewenangan sistem masing-masing peran tanpa perlu mengisi sandi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Admin Demo */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      ADMIN
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Akses Penuh</span>
                  </div>
                  <p className="text-xs font-bold text-white">Drs. H. Masykur Rahman</p>
                  <p className="text-[10px] text-slate-400 truncate">Penanggung Jawab SIM</p>
                </div>
                <button
                  type="button"
                  id="btn-quick-login-admin"
                  onClick={() => handleInstantLogin('admin')}
                  className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Masuk sbg Admin
                </button>
              </div>

              {/* 2. Kepsek Demo */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      KEPSEK
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Eksekutif</span>
                  </div>
                  <p className="text-xs font-bold text-white">Dr. Hj. Siti Nurjanah</p>
                  <p className="text-[10px] text-slate-400 truncate">Kepala Satuan Pendidikan</p>
                </div>
                <button
                  type="button"
                  id="btn-quick-login-kepsek"
                  onClick={() => handleInstantLogin('kepala_sekolah')}
                  className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Masuk sbg Kepsek
                </button>
              </div>

              {/* 3. Pembina Demo */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      PEMBINA
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Pramuka</span>
                  </div>
                  <p className="text-xs font-bold text-white">Ahmad Fauzi, S.Pd.</p>
                  <p className="text-[10px] text-slate-400 truncate">Pembina Gugus Depan</p>
                </div>
                <button
                  type="button"
                  id="btn-quick-login-pembina"
                  onClick={() => handleInstantLogin('pembina')}
                  className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Masuk sbg Pembina
                </button>
              </div>

              {/* 4. Wali Kelas Demo */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      WALI KELAS
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Kelas VIII-A</span>
                  </div>
                  <p className="text-xs font-bold text-white">Ratna Dewi, S.Pd.</p>
                  <p className="text-[10px] text-slate-400 truncate">Guru Wali Kelas VIII-A</p>
                </div>
                <button
                  type="button"
                  id="btn-quick-login-walikelas"
                  onClick={() => handleInstantLogin('wali_kelas')}
                  className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Masuk sbg Wali Kelas
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer & Contact */}
      <footer className="relative z-10 py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>{schoolInfo.address}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {schoolInfo.phone}
            </span>
            <span>&bull;</span>
            <span>SIM Versi 2.4.0 (2026)</span>
          </div>
        </div>
      </footer>

      {/* Modal Lupa Password */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Bantuan Pemulihan Kata Sandi
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Demi keamanan data sekolah, pengaturan ulang kata sandi diverifikasi melalui email resmi atau kontak langsung dengan Administrator IT Satuan Pendidikan.
            </p>

            {resetSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Instruksi Pemulihan Dikirimkan!
                </div>
                <p className="leading-relaxed">
                  Tautan verifikasi telah diteruskan ke alamat <strong>{resetEmail || email}</strong>. Silakan periksa kotak masuk atau spam email dinas Anda.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPasswordModal(false);
                      setResetSubmitted(false);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Selesai & Kembali ke Form Login
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Akun Terdaftar
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail || email}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nama@smpalfaalimasykur.sch.id"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Kontak Helpdesk SIM Sekolah:</p>
                  <p>&bull; Telepon Ruang Tata Usaha: (031) 876-5432</p>
                  <p>&bull; Email Tim IT: it-support@smpalfaalimasykur.sch.id</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                  >
                    Kirim Permintaan Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
