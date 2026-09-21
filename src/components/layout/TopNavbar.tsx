import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  Shield,
  BookOpen,
  UserCheck,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Award,
  Trophy,
  Calendar,
  Layers,
} from 'lucide-react';
import { UserRole } from '../../types';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentUser,
    switchRole,
    schoolInfo,
    globalSearch,
    setGlobalSearch,
    students,
    extracurriculars,
    activityJournals,
    achievements,
    setCurrentView,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Recent notifications from latest journals and achievements
  const recentJournals = (activityJournals || []).slice(0, 4);

  const roleConfig: Record<UserRole, { label: string; bg: string; text: string; icon: any }> = {
    admin: { label: 'Administrator / SIM', bg: 'bg-emerald-950 text-amber-300 border-emerald-700', text: 'text-amber-400', icon: Shield },
    kepala_sekolah: { label: 'Kepala Sekolah', bg: 'bg-emerald-950 text-emerald-200 border-emerald-700', text: 'text-emerald-300', icon: Shield },
    pembina: { label: 'Pembina Ekskul', bg: 'bg-emerald-950 text-teal-200 border-teal-700', text: 'text-teal-300', icon: BookOpen },
    wali_kelas: { label: 'Wali Kelas', bg: 'bg-amber-950 text-amber-200 border-amber-600', text: 'text-amber-300', icon: UserCheck },
    guru: { label: 'Guru Pendamping', bg: 'bg-emerald-950 text-emerald-100 border-emerald-600', text: 'text-emerald-200', icon: BookOpen },
    super_admin: { label: 'Super Admin', bg: 'bg-purple-950 text-purple-200 border-purple-700', text: 'text-purple-300', icon: Shield },
    pelatih: { label: 'Pelatih Cabang', bg: 'bg-indigo-950 text-indigo-200 border-indigo-700', text: 'text-indigo-300', icon: BookOpen },
  };

  const currentRole = roleConfig[currentUser.role] || roleConfig.admin;

  // Search results across students & extracurriculars
  const searchResultsStudents = globalSearch.trim().length > 1
    ? (students || []).filter(
        (s) =>
          (s.name || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
          (s.nis || '').includes(globalSearch) ||
          (s.class || '').toLowerCase().includes(globalSearch.toLowerCase())
      ).slice(0, 4)
    : [];

  const searchResultsEkskuls = globalSearch.trim().length > 1
    ? (extracurriculars || []).filter(
        (e) =>
          (e.name || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
          (e.category || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
          (e.coachName || '').toLowerCase().includes(globalSearch.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <header className="no-print sticky top-0 z-30 bg-emerald-900 text-white shadow-md border-b border-emerald-800/80">
      <div className="px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Left: Hamburger & School Identity */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            aria-label="Buka Navigasi Menu"
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors focus:outline-hidden lg:hidden cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* School Brand Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-bold shadow-md ring-2 ring-amber-300/40 shrink-0">
              <Trophy className="w-5 h-5 text-emerald-950" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight leading-none">
                  SMP ALFA ALI MASYKUR
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  TP {schoolInfo.academicYear}
                </span>
                <span
                  title="Data simulasi 32 siswa, 12 ekstrakurikuler, presensi, dan penilaian untuk pengujian sistem"
                  className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 shadow-xs cursor-help"
                >
                  DATA DEMO
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium tracking-wide mt-0.5">
                Sistem Monitoring Ekstrakurikuler
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-2 relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-global-search"
              type="text"
              placeholder="Cari siswa, NIS, kelas, atau cabang ekskul..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-emerald-950/60 border border-emerald-700/70 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-emerald-950 text-emerald-50 placeholder-emerald-300/60 transition-all"
            />
            {globalSearch && (
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {showSearchDropdown && (searchResultsStudents.length > 0 || searchResultsEkskuls.length > 0) && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150"
              onMouseLeave={() => setShowSearchDropdown(false)}
            >
              {/* Ekskuls matches */}
              {searchResultsEkskuls.length > 0 && (
                <div>
                  <div className="p-2 border-b border-slate-100 bg-emerald-50/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Cabang Ekstrakurikuler</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {searchResultsEkskuls.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          setCurrentView('extracurricular');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 hover:bg-emerald-50/50 text-left text-xs transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{e.name}</p>
                          <p className="text-[10px] text-slate-500">
                            {e.category} • Pembina: {e.coachName} • {e.day}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {e.quota} Kuota
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Students matches */}
              {searchResultsStudents.length > 0 && (
                <div>
                  <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Data Siswa</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {searchResultsStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setCurrentView('students');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 hover:bg-emerald-50/50 text-left text-xs transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-500">
                              NIS: {s.nis} • Kelas {s.class}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Hadir {s.attendanceRate}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Role Switcher, Notification, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Pill */}
          <div className="hidden xl:flex items-center bg-emerald-950/70 p-1 rounded-xl border border-emerald-700/60 text-xs">
            <span className="text-[11px] font-semibold text-emerald-300 px-2">Role:</span>
            {(['admin', 'kepala_sekolah', 'pembina', 'wali_kelas'] as UserRole[]).map((r) => {
              const active = currentUser.role === r;
              const labels: Record<string, string> = {
                admin: 'Admin SIM',
                kepala_sekolah: 'Kepala Sekolah',
                pembina: 'Pembina Ekskul',
                wali_kelas: 'Wali Kelas',
                guru: 'Guru',
                super_admin: 'Super Admin',
                pelatih: 'Pelatih',
              };
              return (
                <button
                  key={r}
                  id={`btn-role-${r}`}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-emerald-950 shadow-sm font-bold'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                  }`}
                >
                  {labels[r] || r}
                </button>
              );
            })}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/70 transition-colors focus:outline-hidden cursor-pointer"
              title="Notifikasi Latihan & Jurnal Terbaru"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-900 animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="p-3.5 bg-emerald-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm">Jurnal & Latihan Terbaru</span>
                  </div>
                  <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded-full text-emerald-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {recentJournals.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => {
                        setCurrentView('journal');
                        setShowNotifications(false);
                      }}
                      className="p-3 hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{j.ekskulName}</p>
                          <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                            Pertemuan {j.meetingNumber}: {j.topic}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {j.presentCount} Hadir
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                        <span>Pembina: <strong className="text-slate-700">{j.coachName}</strong></span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {j.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('journal');
                      setShowNotifications(false);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    Buka Jurnal Kegiatan Lengkap →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Role Menu */}
          <div className="relative">
            <button
              id="btn-user-profile-menu"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-emerald-800/80 transition-colors focus:outline-hidden cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400"
              />
              <div className="hidden md:block text-left leading-tight">
                <p className="text-xs font-bold text-white truncate max-w-[130px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-emerald-300 font-medium">
                  {currentRole.label}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-4 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                    />
                    <div>
                      <p className="font-bold text-sm leading-tight text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-emerald-200">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950">
                        {currentRole.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 text-xs space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Ganti Peran Pengguna (Role Switcher)
                  </p>
                  <div className="space-y-1">
                    {(['admin', 'kepala_sekolah', 'pembina', 'wali_kelas', 'guru'] as UserRole[]).map((r) => {
                      const isCur = currentUser.role === r;
                      const titles: Record<string, { title: string; desc: string }> = {
                        admin: { title: 'Admin Sekolah / SIM', desc: 'Akses penuh seluruh modul, data & pengaturan' },
                        kepala_sekolah: { title: 'Kepala Sekolah', desc: 'Laporan eksekutif, rekapitulasi & tanda tangan resmi' },
                        pembina: { title: 'Pembina / Pelatih Ekskul', desc: 'Presensi, jurnal latihan & penilaian kompetensi' },
                        wali_kelas: { title: 'Wali Kelas (VIII-A)', desc: 'Pantau keikutsertaan & prestasi siswa kelasnya' },
                        guru: { title: 'Guru Pendamping', desc: 'Bimbingan kegiatan & presensi harian' },
                        super_admin: { title: 'Super Admin', desc: 'Hak akses tertinggi sistem' },
                        pelatih: { title: 'Pelatih Cabang', desc: 'Latihan teknis lapangan' },
                      };
                      const item = titles[r] || { title: r, desc: 'Peran pengguna' };
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                            isCur
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`mt-0.5 p-1 rounded-md ${isCur ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {r === 'admin' || r === 'kepala_sekolah' ? (
                              <Shield className="w-3.5 h-3.5" />
                            ) : r === 'wali_kelas' ? (
                              <UserCheck className="w-3.5 h-3.5" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-normal">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
                  >
                    Buka Pengaturan Sistem
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
