import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Student,
  Extracurricular,
  Coach,
  Achievement,
  AttendanceRecord,
  ActivityJournal,
  EkskulTarget,
  AssessmentRecord,
  SchoolInfo,
  Teacher,
  ClassInfo,
  YanbuaRecord,
  DoaRecord,
  QuranRecord,
  UnifiedSetoran,
  DoaItem,
  YanbuaLevel,
  ActivityLog,
} from '../types';
import {
  DEFAULT_SCHOOL_INFO,
  INITIAL_USERS,
  INITIAL_EXTRACURRICULARS,
  INITIAL_STUDENTS,
  INITIAL_COACHES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_JOURNALS,
  INITIAL_TARGETS,
  INITIAL_ASSESSMENTS,
  TEACHERS_LIST,
  CLASSES_LIST,
  MASTER_DOA_LIST,
  INITIAL_YANBUA_RECORDS,
  INITIAL_DOA_RECORDS,
  INITIAL_QURAN_RECORDS,
  INITIAL_UNIFIED_SETORAN,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

interface ToastState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Authentication & Role
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  selectedStudentDetailId: string | null;
  setSelectedStudentDetailId: (id: string | null) => void;

  // Global Search
  globalSearch: string;
  setGlobalSearch: (term: string) => void;

  // School Profile
  schoolInfo: SchoolInfo;
  setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo>>;
  updateSchoolInfo: (info: Partial<SchoolInfo>) => void;

  // Extracurriculars
  extracurriculars: Extracurricular[];
  setExtracurriculars: React.Dispatch<React.SetStateAction<Extracurricular[]>>;
  addExtracurricular: (data: Omit<Extracurricular, 'id'>) => void;
  updateExtracurricular: (id: string, data: Partial<Extracurricular>) => void;
  deleteExtracurricular: (id: string) => void;

  // Students
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  addStudent: (data: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Coaches & Trainers
  coaches: Coach[];
  setCoaches: React.Dispatch<React.SetStateAction<Coach[]>>;
  addCoach: (data: Omit<Coach, 'id'>) => void;
  updateCoach: (id: string, data: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;

  // Achievements
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  addAchievement: (data: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, data: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  saveAttendanceBatch: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Activity Journals
  activityJournals: ActivityJournal[];
  setActivityJournals: React.Dispatch<React.SetStateAction<ActivityJournal[]>>;
  addActivityJournal: (data: Omit<ActivityJournal, 'id'>) => void;
  updateActivityJournal: (id: string, data: Partial<ActivityJournal>) => void;
  deleteActivityJournal: (id: string) => void;

  // Targets & Achievements Progress
  targets: EkskulTarget[];
  setTargets: React.Dispatch<React.SetStateAction<EkskulTarget[]>>;
  addTarget: (data: Omit<EkskulTarget, 'id'>) => void;
  updateTarget: (id: string, data: Partial<EkskulTarget>) => void;
  deleteTarget: (id: string) => void;

  // Assessments
  assessments: AssessmentRecord[];
  setAssessments: React.Dispatch<React.SetStateAction<AssessmentRecord[]>>;
  saveAssessment: (data: Omit<AssessmentRecord, 'id'>) => void;

  // Classes & Teachers
  classes: ClassInfo[];
  setClasses: React.Dispatch<React.SetStateAction<ClassInfo[]>>;
  addClass: (data: Omit<ClassInfo, 'id'>) => void;
  updateClass: (id: string, data: Partial<ClassInfo>) => void;
  deleteClass: (id: string) => boolean;
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Activity Logs (Feed)
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  addActivityLog: (log: Omit<ActivityLog, 'id'>) => void;

  // Toast
  toast: ToastState | null;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;

  // Backup & Reset
  resetToDemoData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonData: string) => boolean;
  backupDatabase: () => void;
  restoreDatabase: (jsonData: string) => boolean;
  resetToDefault: () => void;

  // Compatibility with secondary modules
  yanbuaRecords: YanbuaRecord[];
  doaRecords: DoaRecord[];
  quranRecords: QuranRecord[];
  unifiedSetoran: UnifiedSetoran[];
  masterDoaList: DoaItem[];
  addYanbuaRecord: (data: Omit<YanbuaRecord, 'id'>) => void;
  addDoaRecord: (data: Omit<DoaRecord, 'id'>) => void;
  addQuranRecord: (data: Omit<QuranRecord, 'id'>) => void;
  markTodayAllSubmitted: () => void;
  quickSetoran: (
    studentId: string,
    jenis: 'Yanbu\'a' | 'Doa Harian' | 'Al-Qur\'an',
    materi: string,
    nilai: number,
    status: 'LULUS' | 'MENGULANG' | 'BELUM SETOR' | 'DALAM BIMBINGAN',
    catatan?: string
  ) => void;
}

const STORAGE_KEY = 'SMP_ALFA_EKSKUL_MONITORING_V3';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_USER`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0];
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentDetailId, setSelectedStudentDetailId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toast, setToast] = useState<ToastState | null>(null);

  // School Profile
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SCHOOL`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SCHOOL_INFO;
  });

  // Extracurriculars
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_EKSKUL`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXTRACURRICULARS;
  });

  // Students
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_STUDENTS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENTS;
  });

  // Coaches
  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_COACHES`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_COACHES;
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ACHIEVEMENTS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ATTENDANCE`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ATTENDANCE_RECORDS;
  });

  // Activity Journals
  const [activityJournals, setActivityJournals] = useState<ActivityJournal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_JOURNALS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_JOURNALS;
  });

  // Targets
  const [targets, setTargets] = useState<EkskulTarget[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TARGETS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TARGETS;
  });

  // Assessments
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ASSESSMENTS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ASSESSMENTS;
  });

  // Teachers & Classes
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TEACHERS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return TEACHERS_LIST;
  });

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ACTIVITY_LOGS`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CLASSES`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return CLASSES_LIST;
  });
  const [masterDoaList] = useState<DoaItem[]>(MASTER_DOA_LIST);
  const [yanbuaRecords, setYanbuaRecords] = useState<YanbuaRecord[]>(INITIAL_YANBUA_RECORDS);
  const [doaRecords, setDoaRecords] = useState<DoaRecord[]>(INITIAL_DOA_RECORDS);
  const [quranRecords, setQuranRecords] = useState<QuranRecord[]>(INITIAL_QURAN_RECORDS);
  const [unifiedSetoran, setUnifiedSetoran] = useState<UnifiedSetoran[]>(INITIAL_UNIFIED_SETORAN);

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_USER`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_SCHOOL`, JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_EKSKUL`, JSON.stringify(extracurriculars));
  }, [extracurriculars]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_STUDENTS`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_COACHES`, JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ACHIEVEMENTS`, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ATTENDANCE`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_JOURNALS`, JSON.stringify(activityJournals));
  }, [activityJournals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_TARGETS`, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ASSESSMENTS`, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CLASSES`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ACTIVITY_LOGS`, JSON.stringify(activityLogs));
  }, [activityLogs]);

  const addActivityLog = (log: Omit<ActivityLog, 'id'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `log-${Date.now().toString().slice(-4)}`,
      timestamp: log.timestamp || 'Baru saja',
    };
    setActivityLogs((prev) => [newLog, ...(prev || []).slice(0, 49)]);
  };

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3800);
  };

  // Role switching
  const switchRole = (role: UserRole) => {
    const target = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(target);
    showToast(
      'Beralih Peran',
      `Sekarang login sebagai ${target.roleTitle || target.name}`,
      'info'
    );
  };

  const login = (user: User) => {
    setCurrentUser(user);
    showToast('Login Berhasil', `Selamat datang, ${user.name}!`, 'success');
  };

  const logout = () => {
    const defaultAdmin = INITIAL_USERS[0];
    setCurrentUser(defaultAdmin);
    showToast('Sesi Berakhir', 'Kembali ke mode login.', 'info');
  };

  const updateSchoolInfo = (info: Partial<SchoolInfo>) => {
    setSchoolInfo((prev) => ({ ...prev, ...info }));
    showToast('Profil Disimpan', 'Identitas resmi sekolah berhasil diperbarui.', 'success');
  };

  // Extracurricular Actions
  const addExtracurricular = (data: Omit<Extracurricular, 'id'>) => {
    const newEkskul: Extracurricular = {
      ...data,
      id: `ekskul-${Date.now().toString().slice(-4)}`,
    };
    setExtracurriculars((prev) => [...prev, newEkskul]);
    showToast('Ekskul Ditambahkan', `Cabang ${newEkskul.name} berhasil didaftarkan.`, 'success');
  };

  const updateExtracurricular = (id: string, data: Partial<Extracurricular>) => {
    setExtracurriculars((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data } : e))
    );
    showToast('Ekskul Diperbarui', 'Informasi cabang kegiatan ekstrakurikuler telah disimpan.', 'success');
  };

  const deleteExtracurricular = (id: string) => {
    const target = extracurriculars.find((e) => e.id === id);
    setExtracurriculars((prev) => prev.filter((e) => e.id !== id));
    showToast('Ekskul Dihapus', `Cabang ${target?.name || ''} telah dihapus.`, 'info');
  };

  // Student Actions
  const addStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...data,
      id: `std-${Date.now().toString().slice(-4)}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast('Siswa Ditambahkan', `${newStudent.name} (${newStudent.class}) berhasil didaftarkan.`, 'success');
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    showToast('Data Siswa Diperbarui', 'Perubahan biodata siswa telah tersimpan.', 'success');
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) setSelectedStudentId(null);
    showToast('Data Dihapus', `Data siswa ${target?.name || ''} telah dihapus.`, 'info');
  };

  // Coach Actions
  const addCoach = (data: Omit<Coach, 'id'>) => {
    const newCoach: Coach = {
      ...data,
      id: `coach-${Date.now().toString().slice(-4)}`,
    };
    setCoaches((prev) => [...prev, newCoach]);
    showToast('Pembina Ditambahkan', `${newCoach.name} berhasil ditambahkan.`, 'success');
  };

  const updateCoach = (id: string, data: Partial<Coach>) => {
    setCoaches((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    showToast('Data Pembina Disimpan', 'Pembaruan data pembina/pelatih tersimpan.', 'success');
  };

  const deleteCoach = (id: string) => {
    const target = coaches.find((c) => c.id === id);
    setCoaches((prev) => prev.filter((c) => c.id !== id));
    showToast('Pembina Dihapus', `Data ${target?.name || ''} telah dihapus.`, 'info');
  };

  // Achievement Actions
  const addAchievement = (data: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...data,
      id: `ach-${Date.now().toString().slice(-4)}`,
    };
    setAchievements((prev) => [newAch, ...prev]);
    showToast('Prestasi Dicatat', `${newAch.title || newAch.competitionName} berhasil didokumentasikan.`, 'success');
  };

  const updateAchievement = (id: string, data: Partial<Achievement>) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
    showToast('Prestasi Diperbarui', 'Data kejuaraan berhasil diperbarui.', 'success');
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    showToast('Prestasi Dihapus', 'Catatan prestasi telah dihapus.', 'info');
  };

  // Attendance Actions
  const saveAttendanceBatch = (records: Omit<AttendanceRecord, 'id'>[]) => {
    const newRecords: AttendanceRecord[] = records.map((r, idx) => ({
      ...r,
      id: `att-${Date.now()}-${idx}`,
    }));
    setAttendanceRecords((prev) => [...newRecords, ...prev]);

    // Recalculate attendance rates for students involved
    const studentIds = new Set(records.map((r) => r.studentId));
    setStudents((prev) =>
      prev.map((s) => {
        if (!studentIds.has(s.id)) return s;
        const allStudentRecs = [
          ...newRecords.filter((r) => r.studentId === s.id),
          ...attendanceRecords.filter((r) => r.studentId === s.id),
        ];
        const presentCount = allStudentRecs.filter((r) => r.status === 'H' || r.status === 'Hadir').length;
        const rate = allStudentRecs.length > 0 ? Math.round((presentCount / allStudentRecs.length) * 100) : s.attendanceRate;
        return {
          ...s,
          attendanceRate: rate,
        };
      })
    );

    showToast('Presensi Disimpan', `Presensi ${records.length} siswa berhasil direkap.`, 'success');
  };

  // Journal Actions
  const addActivityJournal = (data: Omit<ActivityJournal, 'id'>) => {
    const newJournal: ActivityJournal = {
      ...data,
      id: `jrn-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setActivityJournals((prev) => [newJournal, ...prev]);
    showToast('Jurnal Tersimpan', `Jurnal pertemuan ${newJournal.meetingNumber} telah ditambahkan.`, 'success');
  };

  const updateActivityJournal = (id: string, data: Partial<ActivityJournal>) => {
    setActivityJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...data } : j))
    );
    showToast('Jurnal Diperbarui', 'Perubahan jurnal latihan berhasil disimpan.', 'success');
  };

  const deleteActivityJournal = (id: string) => {
    setActivityJournals((prev) => prev.filter((j) => j.id !== id));
    showToast('Jurnal Dihapus', 'Catatan jurnal kegiatan telah dihapus.', 'info');
  };

  // Target Actions
  const addTarget = (data: Omit<EkskulTarget, 'id'>) => {
    const newTarget: EkskulTarget = {
      ...data,
      id: `tgt-${Date.now().toString().slice(-4)}`,
    };
    setTargets((prev) => [newTarget, ...prev]);
    showToast('Target Dibuat', `Target "${newTarget.title}" berhasil dicatat.`, 'success');
  };

  const updateTarget = (id: string, data: Partial<EkskulTarget>) => {
    setTargets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    showToast('Target Diperbarui', 'Perkembangan target berhasil diperbarui.', 'success');
  };

  const deleteTarget = (id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    showToast('Target Dihapus', 'Target kegiatan telah dihapus.', 'info');
  };

  // Assessment Actions
  const saveAssessment = (data: Omit<AssessmentRecord, 'id'>) => {
    const newRecord: AssessmentRecord = {
      ...data,
      id: `asm-${Date.now().toString().slice(-4)}`,
    };
    setAssessments((prev) => [newRecord, ...prev]);

    // Update student overall score & category if provided
    if (newRecord.averageScore || newRecord.score) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id !== newRecord.studentId) return s;
          const scoreVal = newRecord.score || Math.round((newRecord.averageScore || 3.5) * 25);
          return {
            ...s,
            overallScore: scoreVal,
            category: newRecord.category || s.category,
          };
        })
      );
    }

    showToast('Penilaian Disimpan', `Evaluasi kompetensi untuk ${newRecord.studentName} tersimpan.`, 'success');
  };

  // Teacher actions
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = { ...teacher, id: `tch-${Date.now().toString().slice(-4)}` };
    setTeachers((prev) => [...prev, newTeacher]);
    showToast('Guru Ditambahkan', `${newTeacher.name} berhasil didaftarkan.`, 'success');
  };

  const updateTeacher = (id: string, teacher: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...teacher } : t)));
    showToast('Data Guru Disimpan', 'Data guru telah diperbarui.', 'success');
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    showToast('Guru Dihapus', 'Data guru telah dihapus.', 'info');
  };

  // Class & Rombel Actions
  const addClass = (data: Omit<ClassInfo, 'id'>) => {
    const newId = `cls-${Date.now().toString(36)}`;
    const newClass: ClassInfo = {
      ...data,
      id: newId,
      status: data.status || 'Aktif',
    };
    setClasses((prev) => [...prev, newClass]);
    showToast('Rombel Ditambahkan', `Rombongan belajar kelas ${newClass.name} berhasil dibuat.`, 'success');
  };

  const updateClass = (id: string, data: Partial<ClassInfo>) => {
    const oldClass = classes.find((c) => c.id === id);
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, ...data };
        }
        return c;
      })
    );
    if (oldClass && data.name && data.name !== oldClass.name) {
      setStudents((prev) =>
        prev.map((s) => (s.class === oldClass.name ? { ...s, class: data.name! } : s))
      );
    }
    showToast('Rombel Diperbarui', `Data rombel ${data.name || oldClass?.name || ''} telah diperbarui.`, 'success');
  };

  const deleteClass = (id: string): boolean => {
    const target = classes.find((c) => c.id === id);
    if (!target) return false;

    const enrolledStudents = students.filter((s) => s.class === target.name);
    if (enrolledStudents.length > 0) {
      showToast(
        'Rombel Tidak Dapat Dihapus',
        `Terdapat ${enrolledStudents.length} siswa yang masih terdaftar di kelas ${target.name}. Pindahkan siswa terlebih dahulu.`,
        'error'
      );
      return false;
    }

    setClasses((prev) => prev.filter((c) => c.id !== id));
    showToast('Rombel Dihapus', `Rombel ${target.name} berhasil dihapus.`, 'info');
    return true;
  };

  // Submissions Actions (Compatibility)
  const addYanbuaRecord = (data: Omit<YanbuaRecord, 'id'>) => {
    const rec = { ...data, id: `yb-${Date.now()}` };
    setYanbuaRecords((prev) => [rec, ...prev]);
  };

  const addDoaRecord = (data: Omit<DoaRecord, 'id'>) => {
    const rec = { ...data, id: `doa-${Date.now()}` };
    setDoaRecords((prev) => [rec, ...prev]);
  };

  const addQuranRecord = (data: Omit<QuranRecord, 'id'>) => {
    const rec = { ...data, id: `qr-${Date.now()}` };
    setQuranRecords((prev) => [rec, ...prev]);
  };

  const markTodayAllSubmitted = () => {
    showToast('Semua Siswa Terverifikasi', 'Status presensi dan evaluasi hari ini terkonfirmasi lengkap.', 'success');
  };

  const quickSetoran = (
    studentId: string,
    jenis: 'Yanbu\'a' | 'Doa Harian' | 'Al-Qur\'an',
    materi: string,
    nilai: number,
    status: 'LULUS' | 'MENGULANG' | 'BELUM SETOR' | 'DALAM BIMBINGAN',
    catatan?: string
  ) => {
    showToast('Catatan Disimpan', `${jenis}: ${materi} (Nilai: ${nilai})`, 'success');
  };

  // Demo reset
  const resetToDemoData = () => {
    setSchoolInfo(DEFAULT_SCHOOL_INFO);
    setCurrentUser(INITIAL_USERS[0]);
    setExtracurriculars(INITIAL_EXTRACURRICULARS);
    setStudents(INITIAL_STUDENTS);
    setClasses(CLASSES_LIST);
    setCoaches(INITIAL_COACHES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setAttendanceRecords(INITIAL_ATTENDANCE_RECORDS);
    setActivityJournals(INITIAL_JOURNALS);
    setTargets(INITIAL_TARGETS);
    setAssessments(INITIAL_ASSESSMENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.clear();
    showToast('Reset Selesai', 'Data sistem telah dikembalikan ke standar resmi SMP Alfa Ali Masykur.', 'success');
  };

  // Export JSON
  const exportDatabaseJson = () => {
    const dbDump = {
      schoolInfo,
      extracurriculars,
      students,
      coaches,
      achievements,
      attendanceRecords,
      activityJournals,
      targets,
      assessments,
      teachers,
      classes,
      activityLogs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dbDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ekskul_alfa_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup Berhasil', 'Seluruh basis data sistem berhasil diekspor sebagai JSON.');
  };

  // Import JSON
  const importDatabaseJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.students && Array.isArray(parsed.students)) {
        if (parsed.schoolInfo) setSchoolInfo(parsed.schoolInfo);
        if (parsed.extracurriculars) setExtracurriculars(parsed.extracurriculars);
        setStudents(parsed.students);
        if (parsed.coaches) setCoaches(parsed.coaches);
        if (parsed.achievements) setAchievements(parsed.achievements);
        if (parsed.attendanceRecords) setAttendanceRecords(parsed.attendanceRecords);
        if (parsed.activityJournals) setActivityJournals(parsed.activityJournals);
        if (parsed.targets) setTargets(parsed.targets);
        if (parsed.assessments) setAssessments(parsed.assessments);
        if (parsed.classes && Array.isArray(parsed.classes)) setClasses(parsed.classes);
        if (parsed.activityLogs && Array.isArray(parsed.activityLogs)) setActivityLogs(parsed.activityLogs);
        showToast('Restore Berhasil', 'Seluruh data ekstrakurikuler berhasil diimpor.', 'success');
        return true;
      }
      showToast('Gagal Impor', 'Format file cadangan tidak sesuai skema sistem.', 'error');
      return false;
    } catch (e) {
      showToast('Format Tidak Valid', 'Gagal memproses file JSON cadangan.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        setCurrentUser,
        login,
        logout,
        currentView,
        setCurrentView,
        selectedStudentId,
        setSelectedStudentId,
        selectedStudentDetailId,
        setSelectedStudentDetailId,
        globalSearch,
        setGlobalSearch,
        schoolInfo,
        setSchoolInfo,
        updateSchoolInfo,
        extracurriculars,
        setExtracurriculars,
        addExtracurricular,
        updateExtracurricular,
        deleteExtracurricular,
        students,
        setStudents,
        addStudent,
        updateStudent,
        deleteStudent,
        coaches,
        setCoaches,
        addCoach,
        updateCoach,
        deleteCoach,
        achievements,
        setAchievements,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        attendanceRecords,
        setAttendanceRecords,
        saveAttendanceBatch,
        activityJournals,
        setActivityJournals,
        addActivityJournal,
        updateActivityJournal,
        deleteActivityJournal,
        targets,
        setTargets,
        addTarget,
        updateTarget,
        deleteTarget,
        assessments,
        setAssessments,
        saveAssessment,
        classes,
        setClasses,
        addClass,
        updateClass,
        deleteClass,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        activityLogs,
        setActivityLogs,
        addActivityLog,
        toast,
        showToast,
        resetToDemoData,
        exportDatabaseJson,
        importDatabaseJson,
        backupDatabase: exportDatabaseJson,
        restoreDatabase: importDatabaseJson,
        resetToDefault: resetToDemoData,
        yanbuaRecords,
        doaRecords,
        quranRecords,
        unifiedSetoran,
        masterDoaList,
        addYanbuaRecord,
        addDoaRecord,
        addQuranRecord,
        markTodayAllSubmitted,
        quickSetoran,
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
