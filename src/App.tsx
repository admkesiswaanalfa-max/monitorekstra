import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Footer } from './components/layout/Footer';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardRouter } from './components/dashboard/DashboardRouter';
import { StudentList } from './components/students/StudentList';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { ExtracurricularList } from './components/extracurricular/ExtracurricularList';
import { CoachesView } from './components/coaches/CoachesView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { DevelopmentView } from './components/development/DevelopmentView';
import { EvaluationView } from './components/evaluation/EvaluationView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    currentView,
    selectedStudentDetailId,
    setSelectedStudentDetailId,
    toast,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not logged in, show the role simulation login page
  if (!currentUser.isAuthenticated) {
    return <LoginPage />;
  }

  // Render view based on active navigation item
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardRouter />;
      case 'students':
        return <StudentList />;
      case 'extracurriculars':
        return <ExtracurricularList />;
      case 'coaches':
        return <CoachesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'development':
        return <DevelopmentView />;
      case 'evaluation':
        return <EvaluationView />;
      case 'achievements':
        return <AchievementsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardRouter />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800 selection:bg-blue-600 selection:text-white">
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

      {/* Global Student Profile Modal */}
      <StudentDetailModal
        studentId={selectedStudentDetailId}
        onClose={() => setSelectedStudentDetailId(null)}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          id="system-toast-container"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
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
