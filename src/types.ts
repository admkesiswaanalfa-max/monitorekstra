export type UserRole = 'admin' | 'kepala_sekolah' | 'pembina' | 'wali_kelas';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  nip?: string;
  assignedEkskulId?: string; // for pembina
  assignedClass?: string;     // for wali kelas, e.g. "VIII-A"
  isAuthenticated?: boolean;
}

export type Gender = 'L' | 'P';

export type StudentStatus = 'Aktif' | 'Cuti' | 'Nonaktif';

export interface CompetencyAspects {
  keterampilan: number;   // 1 to 4 scale
  pengetahuan: number;
  kreativitas: number;
  kerjasama: number;
  disiplin: number;
  tanggungJawab: number;
  kepemimpinan: number;
  sportivitas: number;
}

export type StudentCompetencies = CompetencyAspects;

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'H' | 'I' | 'S' | 'A';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  ekskulId: string;
  date: string; // YYYY-MM-DD
  meetingNumber?: number;
  status: AttendanceStatus;
  topic?: string;
  notes?: string;
}

export interface CompetencyAssessment {
  id: string;
  studentId: string;
  studentName?: string;
  ekskulId: string;
  ekskulName?: string;
  period: string; // e.g. "November 2025" or "Semester Ganjil 2025/2026"
  date: string;
  // A. Keterampilan (1-4)
  teknik?: number;
  praktik?: number;
  kreativitas?: number;
  // B. Sikap (1-4)
  disiplin?: number;
  tanggungJawab?: number;
  kerjasama?: number;
  sportivitas?: number;
  kepemimpinan?: number;
  // C. Keaktifan (1-4)
  kehadiranScore?: number;
  partisipasi?: number;
  inisiatif?: number;
  scores?: StudentCompetencies;
  // Calculated
  averageScore: number; // 1.0 - 4.0
  developmentPercentage?: number; // 0 - 100%
  category: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan' | string;
  trend?: 'Meningkat' | 'Stabil' | 'Menurun';
  notes: string;
  recommendation?: string;
  coachName?: string;
}

export type AssessmentRecord = CompetencyAssessment;

export type AchievementLevel =
  | 'Sekolah'
  | 'Kecamatan'
  | 'Kabupaten/Kota'
  | 'Provinsi'
  | 'Nasional'
  | 'Internasional';

export interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  ekskulId: string;
  ekskulName: string;
  competitionName: string;
  level: AchievementLevel;
  year: number | string;
  rank: string; // e.g. "Juara 1", "Medali Emas", "Harapan 1"
  date: string;
  organizer: string;
  description: string;
  certificateUrl: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  class: string; // e.g. "VII-A", "VIII-B"
  gender: Gender;
  avatar: string;
  parentName: string;
  parentPhone: string;
  ekskulIds: string[];
  status: StudentStatus;
  // Overall aggregated stats
  attendanceRate: number; // in %
  overallScore: number;   // 1.0 - 4.0
  category: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan';
  competencies: CompetencyAspects;
  historyScores: { month: string; score: number }[];
  notesPembina?: string;
}

export type EkskulCategory =
  | 'Olahraga'
  | 'Seni & Budaya'
  | 'Kepanduan & Bela Negara'
  | 'Keagamaan'
  | 'Sains & Teknologi'
  | 'Keterampilan'
  | 'Akademik'
  | 'Kepanduan/Kepemimpinan'
  | 'Keterampilan/Teknologi'
  | string;

export interface Extracurricular {
  id: string;
  name: string;
  category: EkskulCategory;
  iconName?: string;
  image: string;
  coachId?: string;
  coachName: string;
  schedule: string;
  location: string;
  isActive?: boolean;
  status?: 'Aktif' | 'Nonaktif';
  description: string;
  targetAchievement?: string;
  targetCapaian?: string;
}

export interface Coach {
  id: string;
  name: string;
  nip: string;
  email: string;
  phone: string;
  avatar: string;
  ekskulId?: string;
  ekskulIds?: string[];
  ekskulName?: string;
  specialization?: string;
  joinYear?: number;
  status?: 'Guru Tetap' | 'Pelatih Luar';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'assessment' | 'attendance' | 'achievement' | 'student' | 'note' | 'ekskul';
  user: string;
  role: string;
  description: string;
  target: string;
}

export interface NotificationItem {
  id: string;
  type: 'attendance_alert' | 'unassessed' | 'schedule' | 'achievement' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  linkTarget?: string;
}

export interface SemesterReport {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  nis: string;
  ekskulId: string;
  ekskulName: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  attendanceScore: number;
  competencyScore: number;
  attitudeScore: number;
  activityScore: number;
  finalScore: number; // 0-100 or 1-4
  finalGrade: 'A' | 'B' | 'C' | 'D';
  autoDescription: string;
  teacherNotes: string;
  createdAt: string;
}

export interface SchoolInfo {
  name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principal: string;
  principalNip: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  // Letterhead & Logo Customization Properties
  foundationName?: string;
  subHeader?: string;
  logoUrl?: string;
  secondaryLogoUrl?: string;
  showSecondaryLogo?: boolean;
  logoSize?: 'sm' | 'md' | 'lg';
  logoShape?: 'original' | 'circle' | 'rounded';
  city?: string;
  coordinatorName?: string;
  coordinatorNip?: string;
}

export interface AcademicYearItem {
  id: string;
  year: string; // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  status: 'active' | 'archived' | 'planned';
  startDate: string; // e.g. "2025-07-14"
  endDate: string; // e.g. "2025-12-20"
  targetMeetings: number; // e.g. 16
  effectiveWeeks: number; // e.g. 20
  isLocked: boolean; // if true, report grading & attendance is read-only
  notes?: string;
  createdAt?: string;
}

export interface SystemUser extends User {
  phone?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt?: string;
  notes?: string;
}

export interface ModulePermission {
  moduleId: string;
  moduleName: string;
  description: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canApprove: boolean;
  scopeNote?: string;
}

export interface RoleAccessConfig {
  role: UserRole;
  roleTitle: string;
  roleDescription: string;
  badgeColor: string;
  permissions: ModulePermission[];
}
