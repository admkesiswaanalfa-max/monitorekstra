import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Shield,
  BookOpen,
  UserCheck,
  GraduationCap,
  CheckCircle2,
  X,
  Clock,
  ExternalLink,
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
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    globalSearch,
    setGlobalSearch,
    setCurrentView,
    setSelectedStudentDetailId,
    students,
    extracurriculars,
    schoolInfo,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string; icon: any }> = {
    admin: { label: 'Administrator', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', icon: Shield },
    kepala_sekolah: { label: 'Kepala Sekolah', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: GraduationCap },
    pembina: { label: 'Pembina Ekskul', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: BookOpen },
    wali_kelas: { label: 'Wali Kelas', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: UserCheck },
  };

  const currentRoleConfig = roleLabels[currentUser.role] || roleLabels.admin;
  const RoleIcon = currentRoleConfig.icon;

  // Search results preview
  const searchResults = globalSearch.trim().length > 1
    ? {
        students: students.filter(
          (s) =>
            s.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            s.nis.includes(globalSearch) ||
            s.class.toLowerCase().includes(globalSearch.toLowerCase())
        ).slice(0, 4),
        ekskuls: extracurriculars.filter(
          (e) =>
            e.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            e.category.toLowerCase().includes(globalSearch.toLowerCase()) ||
            e.coachName.toLowerCase().includes(globalSearch.toLowerCase())
        ).slice(0, 3),
      }
    : null;

  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & School Brand indicator */}
        <div className="flex items-center gap-3">
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            aria-label="Buka Navigasi Menu"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-slate-800">
            <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">SMP Alfa Ali Masykur</span>
            <button
              type="button"
              onClick={() => setCurrentView('settings')}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              title="Klik untuk membuka Pengaturan Periode Kalender Akademik"
            >
              <span>T.A. {schoolInfo.academicYear}</span>
              <span className="text-blue-400 font-normal">|</span>
              <span>{schoolInfo.semester}</span>
            </button>
          </div>
        </div>

        {/* Middle: Global Search */}
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-global-search"
              type="text"
              placeholder="Cari siswa, NIS, kelas, atau ekskul..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {globalSearch && (
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {showSearchDropdown && searchResults && (searchResults.students.length > 0 || searchResults.ekskuls.length > 0) && (
            <div
              className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
              onMouseLeave={() => setShowSearchDropdown(false)}
            >
              {searchResults.students.length > 0 && (
                <div className="p-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Siswa</p>
                  {searchResults.students.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentDetailId(s.id);
                        setCurrentView('students');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={s.avatar} alt={s.name} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900">{s.name}</p>
                          <p className="text-slate-400 text-[10px]">NIS: {s.nis} • Kelas {s.class}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        Skor: {s.overallScore.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.ekskuls.length > 0 && (
                <div className="p-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Ekstrakurikuler</p>
                  {searchResults.ekskuls.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        setCurrentView('extracurriculars');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left text-xs text-slate-700 transition-colors"
                    >
                      <span className="font-semibold text-slate-900">{e.name}</span>
                      <span className="text-slate-400 text-[11px]">{e.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Role Pills, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher (Visible on desktop for test/review) */}
          <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 px-2">Mode:</span>
            {(['admin', 'kepala_sekolah', 'pembina', 'wali_kelas'] as UserRole[]).map((r) => {
              const active = currentUser.role === r;
              const names: Record<UserRole, string> = {
                admin: 'Admin',
                kepala_sekolah: 'Kepsek',
                pembina: 'Pembina',
                wali_kelas: 'Wali Kelas',
              };
              return (
                <button
                  key={r}
                  id={`btn-switch-role-${r}`}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    active
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {names[r]}
                </button>
              );
            })}
          </div>

          {/* Role Badge (on tablet/smaller screens) */}
          <div className="xl:hidden flex items-center">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentRoleConfig.bg} ${currentRoleConfig.text}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentRoleConfig.label}</span>
            </span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Tidak ada notifikasi saat ini.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.linkTarget) {
                            setCurrentView(notif.linkTarget);
                          }
                          setShowNotifications(false);
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="mt-0.5">
                          <span
                            className={`w-2 h-2 rounded-full block ${
                              notif.priority === 'high'
                                ? 'bg-rose-500'
                                : notif.priority === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 inline-flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Logout / Return to Login Page Button */}
          <button
            type="button"
            id="btn-navbar-logout"
            onClick={logout}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Keluar / Ganti Akun Login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Ganti Akun</span>
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              id="btn-user-menu"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{currentRoleConfig.label}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="p-3.5 bg-slate-50 border-b border-slate-200">
                  <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${currentRoleConfig.bg} ${currentRoleConfig.text}`}>
                      <RoleIcon className="w-3 h-3" />
                      {currentRoleConfig.label}
                    </span>
                    {currentUser.assignedClass && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Kelas {currentUser.assignedClass}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 text-xs space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Informasi Akun & Wewenang
                  </p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">NIP / ID:</span>
                      <span className="font-mono font-medium text-slate-800">{currentUser.nip || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wewenang:</span>
                      <span className="font-bold text-slate-800">{currentRoleConfig.label}</span>
                    </div>
                    {currentUser.assignedEkskulId && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Binaan:</span>
                        <span className="font-semibold text-blue-700">
                          {extracurriculars.find((e) => e.id === currentUser.assignedEkskulId)?.name || 'Ekstrakurikuler'}
                        </span>
                      </div>
                    )}
                    {currentUser.assignedClass && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Perwalian:</span>
                        <span className="font-semibold text-amber-700">
                          Kelas {currentUser.assignedClass}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sekolah:</span>
                      <span className="font-semibold text-slate-800">SMP Alfa Ali Masykur</span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 border-t border-slate-100">
                  <button
                    id="btn-logout"
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar dari Sistem
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
