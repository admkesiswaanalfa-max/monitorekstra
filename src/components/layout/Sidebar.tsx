import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Trophy,
  UserCheck,
  Calendar,
  CheckSquare,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  ShieldCheck,
  FileText,
  Settings,
  X,
  Sparkles,
  School,
  GraduationCap,
  Shield,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  PieChart,
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
    coaches,
  } = useApp();

  const [reportsExpanded, setReportsExpanded] = useState(
    currentView.startsWith('reports')
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'students', label: 'Data Siswa', icon: Users, badge: `${students.length}` },
    { id: 'classes', label: 'Kelas / Rombel', icon: GraduationCap, badge: '6 Kelas' },
    { id: 'extracurricular', label: 'Ekstrakurikuler', icon: Trophy, badge: `${extracurriculars.length} Cabang` },
    { id: 'participants', label: 'Peserta Ekskul', icon: UserCheck, badge: null },
    { id: 'schedule', label: 'Jadwal Kegiatan', icon: Calendar, badge: 'Mingguan' },
    { id: 'attendance', label: 'Presensi', icon: CheckSquare, badge: null },
    { id: 'journal', label: 'Jurnal Kegiatan', icon: BookOpen, badge: null },
    { id: 'development', label: 'Monitoring Perkembangan', icon: TrendingUp, badge: '12 Aspek' },
    { id: 'achievements', label: 'Prestasi', icon: Award, badge: `${achievements.length}` },
    { id: 'targets', label: 'Target & Capaian', icon: Target, badge: null },
    { id: 'analysis', label: 'Analisis & Tren', icon: PieChart, badge: '8 Jawaban' },
    { id: 'coaches', label: 'Pembina & Pelatih', icon: ShieldCheck, badge: `${coaches.length}` },
  ];

  const reportSubItems = [
    { id: 'reports_individual', label: 'Individu Siswa' },
    { id: 'reports_ekskul', label: 'Per Ekstrakurikuler' },
    { id: 'reports_weekly', label: 'Mingguan' },
    { id: 'reports_monthly', label: 'Bulanan' },
    { id: 'reports_semester', label: 'Semesteran' },
    { id: 'reports_annual', label: 'Tahunan' },
  ];

  const bottomMenuItems = [
    { id: 'users', label: 'Manajemen Pengguna', icon: Shield, badge: 'Multi-Role' },
    { id: 'activity_logs', label: 'Riwayat Aktivitas', icon: ClipboardList, badge: null },
    { id: 'settings', label: 'Pengaturan', icon: Settings, badge: null },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    onClose();
  };

  const isReportActive = currentView.startsWith('reports');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-emerald-950/70 z-40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100 flex flex-col border-r border-emerald-800/60 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } print:hidden`}
      >
        {/* Top Header in Sidebar */}
        <div className="p-5 border-b border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 shadow-md ring-2 ring-amber-300/30">
              <School className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm tracking-tight leading-tight">
                SMP ALFA ALI MASYKUR
              </h1>
              <p className="text-[11px] text-amber-300 font-semibold tracking-wide">
                Monitoring Ekstrakurikuler
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Menu"
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info Banner */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate leading-snug">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-amber-300 font-medium truncate">
              {currentUser.roleTitle || 'Pengguna Sistem'}
            </p>
          </div>
        </div>

        {/* Nav Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-emerald-700">
          <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider px-3 mb-1.5">
            Menu Utama
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold shadow-md shadow-amber-950/20 translate-x-0.5'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-950/20 text-emerald-950'
                        : 'bg-emerald-900/50 text-emerald-300 group-hover:text-amber-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Expandable Laporan Section */}
          <div className="pt-1">
            <button
              onClick={() => {
                setReportsExpanded(!reportsExpanded);
                if (!isReportActive) handleNavClick('reports');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isReportActive
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-emerald-900/50 text-emerald-300">
                  <FileText className="w-4 h-4" />
                </span>
                <span>Laporan & Cetak</span>
              </div>
              {reportsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
              )}
            </button>

            {reportsExpanded && (
              <div className="pl-6 pr-2 py-1 space-y-0.5 border-l-2 border-emerald-700/60 ml-4 my-1">
                {reportSubItems.map((sub) => {
                  const isSubActive = currentView === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                        isSubActive
                          ? 'bg-amber-400 text-emerald-950 font-bold'
                          : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span className="truncate">{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider px-3 pt-3 mb-1.5">
            Sistem & Konfigurasi
          </p>

          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold shadow-md shadow-amber-950/20 translate-x-0.5'
                    : 'text-emerald-200 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-950/20 text-emerald-950'
                        : 'bg-emerald-900/50 text-emerald-300 group-hover:text-amber-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-950 text-amber-300'
                        : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info Box */}
        <div className="p-3 border-t border-emerald-800/80 bg-emerald-950/80">
          <div className="bg-emerald-900/40 rounded-xl p-2.5 border border-emerald-800/60 text-[11px] text-emerald-200">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SMP Alfa Ali Masykur</span>
            </div>
            <p className="text-[10px] text-emerald-300/80 leading-relaxed">
              Mojotengah, Wonosobo • TP 2026/2027
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
