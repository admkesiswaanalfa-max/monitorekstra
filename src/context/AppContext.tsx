import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Student,
  Extracurricular,
  Coach,
  Achievement,
  ActivityLog,
  NotificationItem,
  AttendanceRecord,
  CompetencyAssessment,
  SchoolInfo,
  AcademicYearItem,
  SystemUser,
  RoleAccessConfig,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_EKSTRAKURIKULER,
  INITIAL_COACHES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import { DEFAULT_PRIMARY_LOGO, DEFAULT_SECONDARY_LOGO } from '../data/letterheadPresets';
import {
  INITIAL_ACADEMIC_YEARS,
  INITIAL_SYSTEM_USERS,
  ROLE_ACCESS_CONFIGS,
} from '../data/academicAndUserData';

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  name: 'SMP ALFA ALI MASYKUR',
  npsn: '20512345',
  address: 'Jl. Raya Pesantren No. 45, Pasuruan, Jawa Timur',
  phone: '(031) 876-5432',
  email: 'info@smpalfaalimasykur.sch.id',
  website: 'www.smpalfaalimasykur.sch.id',
  principal: 'H. Moh. Masykur, M.Pd.I.',
  principalNip: '19760815 200212 1 004',
  academicYear: '2025/2026',
  semester: 'Ganjil',
  foundationName: 'YAYASAN PENDIDIKAN ALFA ALI MASYKUR',
  subHeader: 'NPSN: 20512345 • Terakreditasi A (Unggul) • SK Izin Operasional: 421.3/1209/418.20/2018',
  logoUrl: DEFAULT_PRIMARY_LOGO,
  secondaryLogoUrl: DEFAULT_SECONDARY_LOGO,
  showSecondaryLogo: true,
  logoSize: 'md',
  logoShape: 'original',
  city: 'Pasuruan',
  coordinatorName: 'Muhammad Rizal, S.Pd.',
  coordinatorNip: '19850612 201001 1 008',
};

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: User['role']) => void;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;

  currentView: string;
  setCurrentView: (view: string) => void;

  selectedStudentDetailId: string | null;
  setSelectedStudentDetailId: (id: string | null) => void;

  selectedEkskulDetailId: string | null;
  setSelectedEkskulDetailId: (id: string | null) => void;

  // School Master Info
  schoolInfo: SchoolInfo;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

  // Data sets
  students: Student[];
  extracurriculars: Extracurricular[];
  coaches: Coach[];
  achievements: Achievement[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  attendanceRecords: AttendanceRecord[];
  assessments: CompetencyAssessment[];

  // Global Search
  globalSearch: string;
  setGlobalSearch: (term: string) => void;

  // Student Actions
  addStudent: (studentData: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, studentData: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Extracurricular Actions
  addExtracurricular: (ekskulData: Omit<Extracurricular, 'id'>) => void;
  updateExtracurricular: (id: string, ekskulData: Partial<Extracurricular>) => void;
  deleteExtracurricular: (id: string) => void;

  // Coach Actions
  addCoach: (coachData: Omit<Coach, 'id'>) => void;
  updateCoach: (id: string, coachData: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;

  // Achievement Actions
  addAchievement: (achievementData: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, achievementData: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  // Attendance & Assessment Actions
  saveAttendanceBatch: (records: (Omit<AttendanceRecord, 'id'> | AttendanceRecord)[], ekskulName?: string) => void;
  saveCompetencyAssessment: (assessment: CompetencyAssessment) => void;
  saveAssessment: (assessment: Omit<CompetencyAssessment, 'id'>) => void;

  // Academic Years
  academicYears: AcademicYearItem[];
  addAcademicYear: (data: Omit<AcademicYearItem, 'id'>) => void;
  updateAcademicYear: (id: string, data: Partial<AcademicYearItem>) => void;
  deleteAcademicYear: (id: string) => void;
  setActiveAcademicPeriod: (year: string, semester: 'Ganjil' | 'Genap') => void;
  toggleLockAcademicYear: (id: string) => void;

  // System Users & Access Rights (RBAC)
  systemUsers: SystemUser[];
  addSystemUser: (data: Omit<SystemUser, 'id'>) => void;
  updateSystemUser: (id: string, data: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string, customPass?: string) => void;
  roleConfigs: RoleAccessConfig[];

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDefault: () => void;
  resetToDemoData: () => void;

  // Toast
  toast: ToastState | null;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

const STORAGE_KEY = 'ALFA_EMS_STORAGE_V1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_USER`);
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return { ...u, isAuthenticated: true };
      } catch (e) {
        console.error(e);
      }
    }
    return { ...INITIAL_USERS[0], isAuthenticated: true };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_LOGGED_IN`);
    return saved !== null ? saved === 'true' : true;
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedStudentDetailId, setSelectedStudentDetailId] = useState<string | null>(null);
  const [selectedEkskulDetailId, setSelectedEkskulDetailId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toast, setToast] = useState<ToastState | null>(null);

  // School Profile
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SCHOOL`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SCHOOL_INFO, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SCHOOL_INFO;
  });

  // Core Data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_STUDENTS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_STUDENTS;
  });

  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_EKSKUL`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_EKSTRAKURIKULER.map((e) => ({
      ...e,
      status: e.isActive ? 'Aktif' : 'Nonaktif',
      targetCapaian: e.targetAchievement,
    }));
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_COACHES`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_COACHES.map((c) => ({
      ...c,
      ekskulIds: [c.ekskulId],
      status: 'Guru Tetap',
    }));
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ACHIEVEMENTS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ACHIEVEMENTS.map((a) => ({
      ...a,
      certificateUrl: a.certificateUrl || 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&auto=format&fit=crop&q=80',
    }));
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_LOGS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_NOTIFS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ATTENDANCE`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Generate initial realistic sample attendance records
    return [
      { id: 'att-1', studentId: 'std-1', studentName: 'Muhammad Farhan', ekskulId: 'ekskul-1', date: '2025-11-04', meetingNumber: 11, status: 'H', topic: 'Pola Serangan 3-1 & Finishing Goal' },
      { id: 'att-2', studentId: 'std-2', studentName: 'Aisyah Putri Rahmadani', ekskulId: 'ekskul-2', date: '2025-11-05', meetingNumber: 11, status: 'H', topic: 'Harmonisasi Suara Babak 2' },
      { id: 'att-3', studentId: 'std-3', studentName: 'Ahmad Kevin Pratama', ekskulId: 'ekskul-3', date: '2025-11-06', meetingNumber: 11, status: 'H', topic: 'Pionering Tiang Bendera 3 Kaki' },
    ];
  });

  const [assessments, setAssessments] = useState<CompetencyAssessment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ASSESSMENTS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'asm-1',
        studentId: 'std-1',
        studentName: 'Muhammad Farhan',
        ekskulId: 'ekskul-1',
        ekskulName: 'Futsal Prestasi',
        period: 'November 2025 (Semester Ganjil)',
        date: '2025-11-01',
        averageScore: 3.82,
        category: 'Sangat Baik',
        notes: 'Kapten yang disiplin, teknik tendangan akurat dan mampu memotivasi tim.',
        coachName: 'Bambang Sudarsono, S.Pd.',
      },
    ];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_USER`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_LOGGED_IN`, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_SCHOOL`, JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_STUDENTS`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_EKSKUL`, JSON.stringify(extracurriculars));
  }, [extracurriculars]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_COACHES`, JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ACHIEVEMENTS`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_LOGS`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_NOTIFS`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ATTENDANCE`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ASSESSMENTS`, JSON.stringify(assessments));
  }, [assessments]);

  // Academic Years State
  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ACADEMIC_YEARS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ACADEMIC_YEARS;
  });

  // System Users State
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SYSTEM_USERS`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SYSTEM_USERS;
  });

  const [roleConfigs] = useState<RoleAccessConfig[]>(ROLE_ACCESS_CONFIGS);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ACADEMIC_YEARS`, JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_SYSTEM_USERS`, JSON.stringify(systemUsers));
  }, [systemUsers]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const login = (user: User) => {
    setCurrentUser({ ...user, isAuthenticated: true });
    setIsLoggedIn(true);
    showToast('Login Berhasil', `Selamat datang, ${user.name}!`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser((prev) => ({ ...prev, isAuthenticated: false }));
    showToast('Logout Berhasil', 'Anda telah keluar dari sistem.', 'info');
  };

  const switchRole = (role: User['role']) => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser({ ...targetUser, isAuthenticated: true });
    showToast('Beralih Peran', `Beralih ke mode ${targetUser.role.replace('_', ' ').toUpperCase()} (${targetUser.name})`, 'info');
  };

  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    setSchoolInfo((prev) => ({ ...prev, ...info }));
    showToast('Profil Sekolah Diperbarui', 'Data resmi satuan pendidikan telah disimpan.', 'success');
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now().toString().slice(-4)}`,
    };
    setStudents((prev) => [newStudent, ...prev]);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'student',
      user: currentUser.name,
      role: currentUser.role,
      description: `Menambahkan siswa baru: ${newStudent.name} (${newStudent.class})`,
      target: newStudent.name,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Berhasil', `Data siswa ${newStudent.name} berhasil ditambahkan.`);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...studentData } : s))
    );
    showToast('Berhasil', 'Perubahan data siswa berhasil disimpan.');
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentDetailId === id) {
      setSelectedStudentDetailId(null);
    }
    showToast('Dihapus', `Data siswa ${target ? target.name : ''} telah dihapus.`, 'info');
  };

  // Extracurricular Actions
  const addExtracurricular = (ekskulData: Omit<Extracurricular, 'id'>) => {
    const newEkskul: Extracurricular = {
      ...ekskulData,
      id: `ekskul-${Date.now().toString().slice(-4)}`,
      status: ekskulData.status || 'Aktif',
    };
    setExtracurriculars((prev) => [newEkskul, ...prev]);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'ekskul',
      user: currentUser.name,
      role: currentUser.role,
      description: `Menambahkan ekstrakurikuler baru: ${newEkskul.name}`,
      target: newEkskul.name,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Berhasil', `Ekstrakurikuler ${newEkskul.name} berhasil ditambahkan.`);
  };

  const updateExtracurricular = (id: string, ekskulData: Partial<Extracurricular>) => {
    setExtracurriculars((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...ekskulData } : e))
    );
    showToast('Berhasil', 'Data ekstrakurikuler berhasil diperbarui.');
  };

  const deleteExtracurricular = (id: string) => {
    const target = extracurriculars.find((e) => e.id === id);
    setExtracurriculars((prev) => prev.filter((e) => e.id !== id));
    showToast('Dihapus', `Ekstrakurikuler ${target ? target.name : ''} berhasil dihapus.`, 'info');
  };

  // Coach Actions
  const addCoach = (coachData: Omit<Coach, 'id'>) => {
    const newCoach: Coach = {
      ...coachData,
      id: `coach-${Date.now().toString().slice(-4)}`,
      status: coachData.status || 'Guru Tetap',
    };
    setCoaches((prev) => [newCoach, ...prev]);
    showToast('Berhasil', `Data pembina ${newCoach.name} berhasil ditambahkan.`);
  };

  const updateCoach = (id: string, coachData: Partial<Coach>) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...coachData } : c))
    );
    showToast('Berhasil', 'Data pembina berhasil diperbarui.');
  };

  const deleteCoach = (id: string) => {
    const target = coaches.find((c) => c.id === id);
    setCoaches((prev) => prev.filter((c) => c.id !== id));
    showToast('Dihapus', `Data pembina ${target ? target.name : ''} berhasil dihapus.`, 'info');
  };

  // Achievement Actions
  const addAchievement = (achievementData: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...achievementData,
      id: `ach-${Date.now()}`,
    };
    setAchievements((prev) => [newAch, ...prev]);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'achievement',
      user: currentUser.name,
      role: currentUser.role,
      description: `Mencatat prestasi: ${newAch.rank} pada ${newAch.competitionName} (${newAch.level})`,
      target: `${newAch.studentName} - ${newAch.ekskulName}`,
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'achievement',
      title: 'Prestasi Baru!',
      message: `${newAch.studentName} meraih ${newAch.rank} (${newAch.level}) dalam ${newAch.competitionName}.`,
      time: 'Baru saja',
      read: false,
      priority: 'medium',
      linkTarget: 'achievements',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Prestasi Ditambahkan!', `${newAch.rank} berhasil dicatat.`);
  };

  const updateAchievement = (id: string, achievementData: Partial<Achievement>) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...achievementData } : a))
    );
    showToast('Berhasil', 'Data prestasi berhasil diperbarui.');
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    showToast('Dihapus', 'Data prestasi berhasil dihapus.', 'info');
  };

  // Attendance Actions
  const saveAttendanceBatch = (
    records: (Omit<AttendanceRecord, 'id'> | AttendanceRecord)[],
    ekskulName?: string
  ) => {
    const normalized: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: 'id' in r && r.id ? r.id : `att-${Date.now()}-${idx}`,
    }));

    setAttendanceRecords((prev) => {
      const filtered = prev.filter(
        (p) => !normalized.some((r) => r.studentId === p.studentId && r.date === p.date && r.ekskulId === p.ekskulId)
      );
      return [...normalized, ...filtered];
    });

    const targetName = ekskulName || 'Ekstrakurikuler';
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'attendance',
      user: currentUser.name,
      role: currentUser.role,
      description: `Menyimpan presensi ${normalized.length} siswa`,
      target: targetName,
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    showToast('Presensi Disimpan', `Berhasil menyimpan presensi ${normalized.length} siswa.`, 'success');
  };

  // Assessment Actions
  const saveAssessment = (assessmentData: Omit<CompetencyAssessment, 'id'>) => {
    const newAssessment: CompetencyAssessment = {
      ...assessmentData,
      id: `asm-${Date.now()}`,
    };
    saveCompetencyAssessment(newAssessment);
  };

  const saveCompetencyAssessment = (assessment: CompetencyAssessment) => {
    setAssessments((prev) => [assessment, ...prev]);

    // Update student's overall score and competencies
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === assessment.studentId) {
          const comp = assessment.scores ? { ...assessment.scores } : { ...s.competencies };
          const newScore = assessment.averageScore || s.overallScore;
          const cat = assessment.category as any;

          return {
            ...s,
            overallScore: newScore,
            category: cat || s.category,
            competencies: comp,
            notesPembina: assessment.notes || s.notesPembina,
          };
        }
        return s;
      })
    );

    const targetStudent = students.find((s) => s.id === assessment.studentId);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'assessment',
      user: currentUser.name,
      role: currentUser.role,
      description: `Menginput evaluasi perkembangan untuk ${targetStudent?.name || 'Siswa'} (${assessment.category} - ${assessment.averageScore.toFixed(2)})`,
      target: targetStudent?.name || 'Siswa',
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    showToast('Penilaian Disimpan', `Evaluasi perkembangan tersimpan dengan predikat ${assessment.category}.`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifikasi', 'Semua notifikasi ditandai telah dibaca.', 'info');
  };

  // Academic Years Actions
  const addAcademicYear = (data: Omit<AcademicYearItem, 'id'>) => {
    const newYear: AcademicYearItem = {
      ...data,
      id: `ay-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (newYear.status === 'active') {
      setAcademicYears((prev) => [
        newYear,
        ...prev.map((item) => (item.status === 'active' ? { ...item, status: 'archived' as const } : item)),
      ]);
      setSchoolInfo((prev) => ({
        ...prev,
        academicYear: newYear.year,
        semester: newYear.semester,
      }));
    } else {
      setAcademicYears((prev) => [newYear, ...prev]);
    }

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'achievement',
      user: currentUser.name,
      role: currentUser.role,
      description: `Menambahkan tahun ajaran baru: ${newYear.year} Semester ${newYear.semester}`,
      target: newYear.year,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Tahun Ajaran Ditambahkan', `Periode ${newYear.year} (${newYear.semester}) berhasil dibuat.`, 'success');
  };

  const updateAcademicYear = (id: string, data: Partial<AcademicYearItem>) => {
    setAcademicYears((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...data };
          if (updated.status === 'active') {
            setSchoolInfo((s) => ({
              ...s,
              academicYear: updated.year,
              semester: updated.semester,
            }));
          }
          return updated;
        }
        if (data.status === 'active' && item.id !== id && item.status === 'active') {
          return { ...item, status: 'archived' as const };
        }
        return item;
      })
    );
    showToast('Perubahan Disimpan', 'Konfigurasi tahun ajaran berhasil diperbarui.', 'success');
  };

  const deleteAcademicYear = (id: string) => {
    const target = academicYears.find((y) => y.id === id);
    if (target?.status === 'active') {
      showToast('Gagal Menghapus', 'Tahun ajaran yang sedang aktif tidak dapat dihapus.', 'error');
      return;
    }
    setAcademicYears((prev) => prev.filter((y) => y.id !== id));
    showToast('Tahun Ajaran Dihapus', `Periode ${target?.year || ''} telah dihapus.`, 'info');
  };

  const setActiveAcademicPeriod = (year: string, semester: 'Ganjil' | 'Genap') => {
    setAcademicYears((prev) => {
      let matched = false;
      const updated = prev.map((item) => {
        if (item.year === year && item.semester === semester) {
          matched = true;
          return { ...item, status: 'active' as const, isLocked: false };
        }
        return item.status === 'active' ? { ...item, status: 'archived' as const } : item;
      });

      if (!matched) {
        const newEntry: AcademicYearItem = {
          id: `ay-${Date.now()}`,
          year,
          semester,
          status: 'active',
          startDate: semester === 'Ganjil' ? `${year.split('/')[0]}-07-14` : `${year.split('/')[1]}-01-05`,
          endDate: semester === 'Ganjil' ? `${year.split('/')[0]}-12-20` : `${year.split('/')[1]}-06-20`,
          targetMeetings: 16,
          effectiveWeeks: semester === 'Ganjil' ? 20 : 22,
          isLocked: false,
          notes: 'Periode aktif',
          createdAt: new Date().toISOString().split('T')[0],
        };
        return [newEntry, ...updated];
      }
      return updated;
    });

    setSchoolInfo((prev) => ({ ...prev, academicYear: year, semester }));
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'achievement',
      user: currentUser.name,
      role: currentUser.role,
      description: `Mengaktifkan periode akademik: ${year} Semester ${semester}`,
      target: year,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Periode Aktif Diperbarui', `Tahun Ajaran ${year} Semester ${semester} kini berstatus aktif.`, 'success');
  };

  const toggleLockAcademicYear = (id: string) => {
    setAcademicYears((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLocked: !item.isLocked } : item))
    );
    const item = academicYears.find((y) => y.id === id);
    const isNowLocked = !item?.isLocked;
    showToast(
      isNowLocked ? 'Periode Terkunci' : 'Kunci Periode Dibuka',
      isNowLocked
        ? `Nilai dan presensi pada ${item?.year} ${item?.semester} terkunci dari perubahan.`
        : `Periode ${item?.year} ${item?.semester} kini dapat diedit kembali.`,
      isNowLocked ? 'info' : 'success'
    );
  };

  // System Users & RBAC Actions
  const addSystemUser = (data: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...data,
      id: `user-${Date.now()}`,
      status: data.status || 'active',
      avatar:
        data.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Belum pernah login',
    };
    setSystemUsers((prev) => [newUser, ...prev]);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Baru saja',
      type: 'student',
      user: currentUser.name,
      role: currentUser.role,
      description: `Membuat akun pengguna baru: ${newUser.name} (${newUser.role})`,
      target: newUser.name,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
    showToast('Akun Pengguna Dibuat', `Akun ${newUser.name} dengan peran ${newUser.role.replace('_', ' ')} berhasil dibuat.`, 'success');
  };

  const updateSystemUser = (id: string, data: Partial<SystemUser>) => {
    setSystemUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...data }));
    }
    showToast('Akun Diperbarui', 'Informasi profil dan hak akses pengguna telah disimpan.', 'success');
  };

  const deleteSystemUser = (id: string) => {
    if (currentUser.id === id) {
      showToast('Gagal Menghapus Akun', 'Anda tidak dapat menghapus akun yang sedang Anda gunakan saat ini.', 'error');
      return;
    }
    const target = systemUsers.find((u) => u.id === id);
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Akun Dihapus', `Akun ${target?.name || ''} telah dihapus dari sistem.`, 'info');
  };

  const toggleUserStatus = (id: string) => {
    if (currentUser.id === id) {
      showToast('Peringatan', 'Anda tidak dapat menonaktifkan akun yang sedang aktif digunakan.', 'error');
      return;
    }
    setSystemUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    );
    const target = systemUsers.find((u) => u.id === id);
    const isNowActive = target?.status !== 'active';
    showToast(
      isNowActive ? 'Akun Diaktifkan' : 'Akun Dinonaktifkan',
      `Status akun ${target?.name} kini ${isNowActive ? 'Aktif' : 'Nonaktif'}.`,
      isNowActive ? 'success' : 'info'
    );
  };

  const resetUserPassword = (id: string, customPass?: string) => {
    const target = systemUsers.find((u) => u.id === id);
    const newPass = customPass || 'Alfa2026!';
    showToast('Password Berhasil Direset', `Password akun ${target?.name} direset menjadi: ${newPass}`, 'success');
  };

  const resetToDefault = () => {
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setStudents(INITIAL_STUDENTS);
    setExtracurriculars(
      INITIAL_EKSTRAKURIKULER.map((e) => ({
        ...e,
        status: e.isActive ? 'Aktif' : 'Nonaktif',
        targetCapaian: e.targetAchievement,
      }))
    );
    setCoaches(
      INITIAL_COACHES.map((c) => ({
        ...c,
        ekskulIds: [c.ekskulId],
        status: 'Guru Tetap',
      }))
    );
    setAchievements(
      INITIAL_ACHIEVEMENTS.map((a) => ({
        ...a,
        certificateUrl: a.certificateUrl || 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&auto=format&fit=crop&q=80',
      }))
    );
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAttendanceRecords([]);
    setAssessments([]);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setSystemUsers(INITIAL_SYSTEM_USERS);

    localStorage.removeItem(`${STORAGE_KEY}_SCHOOL`);
    localStorage.removeItem(`${STORAGE_KEY}_STUDENTS`);
    localStorage.removeItem(`${STORAGE_KEY}_EKSKUL`);
    localStorage.removeItem(`${STORAGE_KEY}_COACHES`);
    localStorage.removeItem(`${STORAGE_KEY}_ACHIEVEMENTS`);
    localStorage.removeItem(`${STORAGE_KEY}_LOGS`);
    localStorage.removeItem(`${STORAGE_KEY}_NOTIFS`);
    localStorage.removeItem(`${STORAGE_KEY}_ATTENDANCE`);
    localStorage.removeItem(`${STORAGE_KEY}_ASSESSMENTS`);
    localStorage.removeItem(`${STORAGE_KEY}_ACADEMIC_YEARS`);
    localStorage.removeItem(`${STORAGE_KEY}_SYSTEM_USERS`);

    showToast('Reset Selesai', 'Data bawaan SMP Alfa Ali Masykur telah dipulihkan.', 'success');
  };

  const resetToDemoData = resetToDefault;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        isLoggedIn,
        login,
        logout,
        currentView,
        setCurrentView,
        selectedStudentDetailId,
        setSelectedStudentDetailId,
        selectedEkskulDetailId,
        setSelectedEkskulDetailId,
        schoolInfo,
        updateSchoolInfo,
        students,
        extracurriculars,
        coaches,
        achievements,
        activityLogs,
        notifications,
        attendanceRecords,
        assessments,
        academicYears,
        addAcademicYear,
        updateAcademicYear,
        deleteAcademicYear,
        setActiveAcademicPeriod,
        toggleLockAcademicYear,
        systemUsers,
        addSystemUser,
        updateSystemUser,
        deleteSystemUser,
        toggleUserStatus,
        resetUserPassword,
        roleConfigs,
        globalSearch,
        setGlobalSearch,
        addStudent,
        updateStudent,
        deleteStudent,
        addExtracurricular,
        updateExtracurricular,
        deleteExtracurricular,
        addCoach,
        updateCoach,
        deleteCoach,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        saveAttendanceBatch,
        saveCompetencyAssessment,
        saveAssessment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDefault,
        resetToDemoData,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
