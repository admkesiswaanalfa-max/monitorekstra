import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Award,
  UserCheck,
  ClipboardCheck,
  TrendingUp,
  FileSpreadsheet,
  Trophy,
  FileText,
  Settings,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X,
  LogOut,
  Shield,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    students,
    extracurriculars,
    achievements,
    logout,
  } = useApp();

  // Compute menu items strictly filtered according to currentUser.role
  const menuItems = useMemo(() => {
    // Determine student badge count based on role's scope
    let studentBadgeCount = students.length;
    if (currentUser.role === 'pembina' && currentUser.assignedEkskulId) {
      studentBadgeCount = students.filter((s) =>
        s.ekskulIds.includes(currentUser.assignedEkskulId!)
      ).length;
    } else if (currentUser.role === 'wali_kelas' && currentUser.assignedClass) {
      studentBadgeCount = students.filter(
        (s) => s.class === currentUser.assignedClass
      ).length;
    }

    // Role-specific definitions
    if (currentUser.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
        { id: 'students', label: 'Master Data Siswa', icon: Users, badge: studentBadgeCount },
        {
          id: 'extracurriculars',
          label: 'Ekstrakurikuler',
          icon: Award,
          badge: extracurriculars.length,
        },
        { id: 'coaches', label: 'Pembina & Pelatih', icon: UserCheck },
        { id: 'attendance', label: 'Presensi & Kehadiran', icon: ClipboardCheck },
        { id: 'development', label: 'Perkembangan Karakter', icon: TrendingUp },
        { id: 'evaluation', label: 'Penilaian Rapor', icon: FileSpreadsheet },
        { id: 'achievements', label: 'Prestasi & Piagam', icon: Trophy, badge: achievements.length },
        { id: 'reports', label: 'Laporan & Dokumen', icon: FileText },
        { id: 'settings', label: 'Pengaturan SIM', icon: Settings },
      ];
    }

    if (currentUser.role === 'kepala_sekolah') {
      return [
        { id: 'dashboard', label: 'Dashboard Eksekutif', icon: LayoutDashboard },
        { id: 'students', label: 'Data Peserta Didik', icon: Users, badge: studentBadgeCount },
        {
          id: 'extracurriculars',
          label: 'Cabang Ekstrakurikuler',
          icon: Award,
          badge: extracurriculars.length,
        },
        { id: 'coaches', label: 'Supervisi Pembina', icon: UserCheck },
        { id: 'attendance', label: 'Monitoring Kehadiran', icon: ClipboardCheck },
        { id: 'development', label: 'Capaian Karakter', icon: TrendingUp },
        { id: 'evaluation', label: 'Rekap Nilai Rapor', icon: FileSpreadsheet },
        { id: 'achievements', label: 'Prestasi Sekolah', icon: Trophy, badge: achievements.length },
        { id: 'reports', label: 'Laporan & Pengesahan', icon: FileText },
      ];
    }

    if (currentUser.role === 'pembina') {
      const ekskul = extracurriculars.find((e) => e.id === currentUser.assignedEkskulId);
      const ekskulName = ekskul ? ekskul.name : 'Ekskul';
      const myAchievements = currentUser.assignedEkskulId
        ? achievements.filter((a) => a.ekskulId === currentUser.assignedEkskulId).length
        : achievements.length;

      return [
        { id: 'dashboard', label: 'Dashboard Pembina', icon: LayoutDashboard },
        { id: 'students', label: `Anggota ${ekskulName}`, icon: Users, badge: studentBadgeCount },
        { id: 'attendance', label: 'Presensi & Jurnal Latihan', icon: ClipboardCheck },
        { id: 'evaluation', label: 'Penilaian 7 Dimensi', icon: FileSpreadsheet },
        { id: 'development', label: 'Perkembangan Anggota', icon: TrendingUp },
        { id: 'achievements', label: 'Prestasi & Kejuaraan', icon: Trophy, badge: myAchievements },
        { id: 'reports', label: 'Laporan Kegiatan Cabang', icon: FileText },
      ];
    }

    if (currentUser.role === 'wali_kelas') {
      const className = currentUser.assignedClass ? `Kelas ${currentUser.assignedClass}` : 'Kelas Perwalian';
      return [
        { id: 'dashboard', label: 'Dashboard Wali Kelas', icon: LayoutDashboard },
        { id: 'students', label: `Siswa ${className}`, icon: Users, badge: studentBadgeCount },
        { id: 'evaluation', label: 'Nilai Rapor Siswa', icon: FileSpreadsheet },
        { id: 'development', label: 'Monitoring Karakter', icon: TrendingUp },
        { id: 'achievements', label: 'Prestasi Siswa Kelas', icon: Trophy, badge: achievements.length },
        { id: 'reports', label: 'Cetak Rapor Ekstrakurikuler', icon: FileText },
      ];
    }

    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Data Siswa', icon: Users, badge: studentBadgeCount },
    ];
  }, [currentUser, students, extracurriculars, achievements]);

  const handleSelect = (id: string) => {
    setCurrentView(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // Get assigned info for current user
  const assignedInfo = useMemo(() => {
    if (currentUser.role === 'pembina' && currentUser.assignedEkskulId) {
      const eks = extracurriculars.find((e) => e.id === currentUser.assignedEkskulId);
      return eks ? `Pembina ${eks.name}` : 'Pembina Ekstrakurikuler';
    }
    if (currentUser.role === 'wali_kelas' && currentUser.assignedClass) {
      return `Wali Kelas ${currentUser.assignedClass}`;
    }
    if (currentUser.role === 'kepala_sekolah') {
      return 'Kepala Satuan Pendidikan';
    }
    return 'Administrator IT & SIM';
  }, [currentUser, extracurriculars]);

  const roleTheme = useMemo(() => {
    switch (currentUser.role) {
      case 'admin':
        return {
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          label: 'Admin Utama',
          icon: Shield,
        };
      case 'kepala_sekolah':
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          label: 'Kepala Sekolah',
          icon: GraduationCap,
        };
      case 'pembina':
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          label: 'Pembina Ekskul',
          icon: BookOpen,
        };
      case 'wali_kelas':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          label: 'Wali Kelas',
          icon: UserCheck,
        };
    }
  }, [currentUser.role]);

  const RoleIcon = roleTheme.icon;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`no-print fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-1 ring-white/15">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white">ALFA EMS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                SMP Alfa Ali Masykur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Context & Role Banner */}
        <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800/80 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded border ${roleTheme.badge}`}
              >
                <RoleIcon className="w-2.5 h-2.5" />
                {roleTheme.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
              {assignedInfo}
            </p>
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Sesuai Peran
          </p>

          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`sidebar-menu-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Quick Info Card */}
        <div className="p-3.5 m-3 mb-1.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/70 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hak Akses Terproteksi</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Tampilan disesuaikan dengan wewenang resmi ({roleTheme.label}).
          </p>
        </div>

        {/* Logout / Switch Account Action Button */}
        <div className="p-3 pt-1">
          <button
            type="button"
            id="btn-sidebar-logout"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Keluar / Ganti Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
};
