import React from 'react';
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
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, currentUser, students, extracurriculars, achievements } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Data Siswa', icon: Users, badge: students.length },
    { id: 'extracurriculars', label: 'Ekstrakurikuler', icon: Award, badge: extracurriculars.length },
    { id: 'coaches', label: 'Pembina', icon: UserCheck },
    { id: 'attendance', label: 'Kehadiran', icon: ClipboardCheck },
    { id: 'development', label: 'Perkembangan Siswa', icon: TrendingUp },
    { id: 'evaluation', label: 'Penilaian', icon: FileSpreadsheet },
    { id: 'achievements', label: 'Prestasi', icon: Trophy, badge: achievements.length },
    { id: 'reports', label: 'Laporan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setCurrentView(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Context Banner */}
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/60 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-blue-400 font-medium capitalize truncate">
              {currentUser.role.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </p>

          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`sidebar-menu-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
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

        {/* Bottom Quick Help Card */}
        <div className="p-3.5 m-3 rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/70 border border-slate-700/60 text-xs">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sistem Terintegrasi</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            Data perkembangan tersimpan secara otomatis & tersinkronisasi ke laporan semester.
          </p>
        </div>
      </aside>
    </>
  );
};
