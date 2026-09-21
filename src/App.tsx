import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Footer } from './components/layout/Footer';
import { DashboardRouter } from './components/dashboard/DashboardRouter';
import { StudentList } from './components/students/StudentList';
import { ExtracurricularList } from './components/extracurricular/ExtracurricularList';
import { ParticipantsView } from './components/participants/ParticipantsView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { JournalView } from './components/journal/JournalView';
import { DevelopmentView } from './components/development/DevelopmentView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { TargetView } from './components/targets/TargetView';
import { EvaluationView } from './components/evaluation/EvaluationView';
import { CoachesView } from './components/coaches/CoachesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ClassManagementView } from './components/classes/ClassManagementView';
import { AnalysisView } from './components/analysis/AnalysisView';
import { UserManagementView } from './components/users/UserManagementView';
import { ActivityLogsView } from './components/activity/ActivityLogsView';

const MainAppContent: React.FC = () => {
  const { currentView, toast } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Render view based on active navigation item
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardRouter />;
      case 'students':
        return <StudentList />;
      case 'classes':
        return <ClassManagementView />;
      case 'extracurricular':
        return <ExtracurricularList />;
      case 'participants':
        return <ParticipantsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'attendance':
        return <AttendanceView />;
      case 'journal':
        return <JournalView />;
      case 'development':
        return <DevelopmentView />;
      case 'achievements':
        return <AchievementsView />;
      case 'targets':
        return <TargetView />;
      case 'analysis':
        return <AnalysisView />;
      case 'evaluation':
        return <EvaluationView />;
      case 'coaches':
        return <CoachesView />;
      case 'reports':
      case 'reports_individual':
      case 'reports_ekskul':
      case 'reports_weekly':
      case 'reports_monthly':
      case 'reports_semester':
      case 'reports_annual':
        return <ReportsView />;
      case 'users':
        return <UserManagementView />;
      case 'activity_logs':
        return <ActivityLogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardRouter />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col antialiased text-slate-800 selection:bg-emerald-700 selection:text-amber-200">
      {/* Responsive Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Offset for desktop fixed sidebar) */}
      <div className="lg:pl-72 print:pl-0 flex flex-col flex-1 min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto print:p-0 print:max-w-none print:w-full print:m-0">
          {renderCurrentView()}
        </main>

        {/* School Footer */}
        <Footer />
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          id="system-toast-container"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="alert"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 leading-snug">{toast.title}</h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
