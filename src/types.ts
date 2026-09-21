export type UserRole =
  | 'admin'
  | 'kepala_sekolah'
  | 'pembina'
  | 'wali_kelas'
  | 'guru'
  | 'super_admin'
  | 'pelatih';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle?: string;
  avatar: string;
  nip?: string;
  phone?: string;
  assignedClass?: string; // e.g. "VIII-A", "7A" for wali kelas
  assignedEkskulId?: string;
  assignedEkskulName?: string;
  isAuthenticated?: boolean;
}

export type Gender = 'L' | 'P';
export type StudentStatus = 'Aktif' | 'Alumni' | 'Pindah' | 'Mutasi' | 'Tidak Aktif' | 'Lulus';

export interface StudentCompetencies {
  keterampilan: number;
  pengetahuan: number;
  kreativitas: number;
  kerjasama: number;
  disiplin: number;
  tanggungJawab: number;
  kepemimpinan: number;
  sportivitas: number;
  // Extended 12 aspects from official curriculum
  kehadiran?: number;
  kedisiplinan?: number;
  keaktifan?: number;
  sikap?: number;
  penguasaanMateri?: number;
  keterampilanTeknis?: number;
  prestasi?: number;
  konsistensiLatihan?: number;
  perkembanganUmum?: number;
  tajwid?: number;
  fashahah?: number;
  kelancaran?: number;
  adab?: number;
}

export type EkskulCategory =
  | 'Olahraga'
  | 'Seni & Budaya'
  | 'Keagamaan'
  | 'Akademik'
  | 'Kepanduan/Kepemimpinan'
  | 'Keterampilan/Teknologi'
  | 'Seni'
  | 'Kepemimpinan';

export interface Extracurricular {
  id: string;
  code?: string;
  name: string;
  category: EkskulCategory;
  description: string;
  coachId?: string;
  coachName: string;
  trainerName?: string;
  day: string;
  time: string;
  schedule: string;
  location: string;
  targetCapaian: string;
  image: string;
  status: 'Aktif' | 'Nonaktif';
  quota?: number;
  enrolled?: number;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  nickname?: string;
  gender: Gender;
  birthPlace?: string;
  birthDate?: string;
  class: string; // e.g. 'VII-A', 'VIII-A', 'IX-B'
  rombel?: string;
  waliKelas?: string;
  avatar: string;
  phone?: string;
  parentName: string;
  parentPhone: string;
  ekskulIds: string[];
  status: StudentStatus;
  attendanceRate: number; // 0 - 100%
  overallScore: number; // 0 - 100
  category: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Pembinaan' | string;
  competencies: StudentCompetencies;
  notes?: string;

  // Optional legacy fields for Yanbua / Tahfidz compatibility
  yanbuaJilid?: string;
  yanbuaHalaman?: number;
  yanbuaProgressPct?: number;
  targetHafalan?: string;
  doaMasteredCount?: number;
  doaTotalTarget?: number;
  quranJuz?: number;
  quranSurah?: string;
  quranAyatCount?: number;
  quranTargetAyat?: number;
  overallProgress?: number;
  statusSetoranHariIni?: string;
  needAssistance?: boolean;
  lastSubmissionDate?: string;
}

export interface Coach {
  id: string;
  name: string;
  nip: string;
  phone: string;
  email: string;
  ekskulIds: string[];
  status: 'Guru Tetap' | 'Pelatih Luar' | 'Aktif' | 'Non-aktif';
  avatar: string;
  specialty?: string;
  notes?: string;
}

export type AttendanceStatus =
  | 'H'
  | 'S'
  | 'I'
  | 'A'
  | 'D'
  | 'Hadir'
  | 'Sakit'
  | 'Izin'
  | 'Alpa'
  | 'Dispensasi';

export interface AttendanceRecord {
  id: string;
  ekskulId: string;
  meetingNumber: number;
  date: string;
  topic: string;
  studentId: string;
  studentName?: string;
  class?: string;
  status: AttendanceStatus;
  notes?: string;
  recordedBy?: string;
}

export interface ActivityJournal {
  id: string;
  ekskulId: string;
  ekskulName: string;
  date: string;
  day: string;
  meetingNumber: number;
  topic: string;
  purpose: string;
  activities: string;
  trainingMethod: string;
  totalParticipants: number;
  presentCount: number;
  absentCount: number;
  results: string;
  obstacles: string;
  solutions: string;
  followUp: string;
  coachName: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  ekskulId: string;
  ekskulName?: string;
  class?: string;
  date: string;
  period?: string;
  score?: number;
  averageScore?: number;
  scores?: Record<string, number>;
  category?: string;
  aspects?: StudentCompetencies;
  notes?: string;
  strengths?: string;
  improvements?: string;
  recommendations?: string;
  coachName?: string;
}

export interface EkskulTarget {
  id: string;
  ekskulId: string;
  ekskulName: string;
  title: string;
  category: string;
  targetDescription: string;
  processDescription: string;
  achievementDescription: string;
  evaluationDescription: string;
  followUpDescription: string;
  progressPercentage: number;
  status: 'Dalam Proses' | 'Tercapai' | 'Perlu Pendampingan' | 'Melampaui Target';
  dueDate: string;
}

export type AchievementLevel =
  | 'Sekolah'
  | 'Kecamatan'
  | 'Kabupaten'
  | 'Kabupaten/Kota'
  | 'Provinsi'
  | 'Nasional'
  | 'Internasional';

export interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  ekskulId: string;
  ekskulName?: string;
  competitionName: string;
  title?: string;
  category?: string;
  level: AchievementLevel;
  rank: string;
  organizer: string;
  date: string;
  year: string;
  description?: string;
  certificateUrl?: string;
  documentationUrl?: string;
  notes?: string;
}

export interface SchoolInfo {
  name: string;
  foundationName?: string;
  showFoundationName?: boolean;
  subHeader?: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  headmaster?: string;
  headmasterNip?: string;
  academicYear: string;
  semester?: 'Ganjil' | 'Genap';
  principal?: string;
  principalNip?: string;
  vicePrincipalStudentAffairs?: string; // Yulianti, S.Pd.
  vicePrincipalStudentAffairsNip?: string;
  subdistrict?: string;
  district?: string;
  postalCode?: string;
  website?: string;
  coordinatorName?: string;
  coordinatorNip?: string;
  logoUrl?: string;
  secondaryLogoUrl?: string;
  showSecondaryLogo?: boolean;
  logoSize?: 'sm' | 'md' | 'lg';
  logoShape?: 'circle' | 'rounded' | 'square';
  fontFamily?: 'times' | 'arial' | 'bookman' | 'calibri' | 'georgia';
  fontScale?: 'sm' | 'md' | 'lg';
  headerColorTheme?: 'black' | 'emerald' | 'navy';
  institutionStatus?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  phone?: string;
  nip?: string;
  email?: string;
  assignedClass?: string;
  avatar?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  rombelCode?: string;
  grade?: '7' | '8' | '9' | string;
  waliKelas: string;
  waliKelasNip?: string;
  room?: string;
  capacity?: number;
  totalStudents?: number;
  academicYear?: string;
  semester?: 'Ganjil' | 'Genap';
  classLeader?: string;
  notes?: string;
  status?: 'Aktif' | 'Nonaktif';
}

export interface AcademicYearItem {
  id: string;
  year: string;
  semester: 'Ganjil' | 'Genap';
  status: 'active' | 'planned' | 'archived';
  isActive?: boolean;
  startDate: string;
  endDate: string;
  targetMeetings?: number;
  effectiveWeeks?: number;
  isLocked?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  status?: string;
  lastLogin?: string;
  avatar?: string;
  nip?: string;
  phone?: string;
  assignedEkskulId?: string;
  assignedClass?: string;
  notes?: string;
  createdAt?: string;
}

export interface RoleAccessConfig {
  role: UserRole;
  allowedViews?: string[];
  roleTitle?: string;
  roleDescription?: string;
  badgeColor?: string;
  permissions?: any;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName?: string;
  userRole?: string;
  action?: string;
  details?: string;
  ip?: string;
  // Dashboard feed fields
  type?: 'assessment' | 'attendance' | 'achievement' | 'journal' | 'system' | string;
  user?: string;
  role?: string;
  description?: string;
  target?: string;
}

// Optional Legacy compatibility types for Ngaji/Tahfidz modals
export type YanbuaLevel =
  | 'Jilid 1'
  | 'Jilid 2'
  | 'Jilid 3'
  | 'Jilid 4'
  | 'Jilid 5'
  | 'Jilid 6'
  | 'Jilid 7'
  | "Al-Qur'an";

export type SubmissionStatus =
  | 'LULUS'
  | 'MENGULANG'
  | 'BELUM SETOR'
  | 'DALAM BIMBINGAN';

export interface YanbuaRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  jilid: YanbuaLevel;
  halaman: number;
  materi: string;
  tanggal: string;
  pembimbing: string;
  nilai: number;
  kelancaran: string;
  tajwidMakhraj: string;
  catatan: string;
  status: 'LULUS' | 'MENGULANG' | 'DALAM BIMBINGAN';
}

export interface DoaItem {
  id: number | string;
  nama?: string;
  kategori?: string;
  arab?: string;
  latin?: string;
  arti?: string;
  name?: string;
  category?: string;
  arabic?: string;
  meaning?: string;
}

export interface DoaRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  namaDoa: string;
  tanggal: string;
  pembimbing: string;
  kelancaran: string;
  ketepatanLafaz: string;
  nilai: number;
  status: 'HAFAL' | 'BELUM HAFAL' | 'PERLU PENGULANGAN';
  catatan: string;
}

export interface QuranRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  surah: string;
  juz: number;
  ayatMulai: number;
  ayatAkhir: number;
  jumlahAyat: number;
  tanggal: string;
  pembimbing: string;
  kelancaran: string;
  tajwid: string;
  makhraj: string;
  nilai: number;
  status: 'LANCAR' | 'CUKUP LANCAR' | 'PERLU MURAJAAH' | 'MENGULANG';
  catatan: string;
}

export interface UnifiedSetoran {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  jenisSetoran: "Yanbu'a" | 'Doa Harian' | "Al-Qur'an";
  materi: string;
  hasil?: string;
  nilai: number;
  tanggal: string;
  status: SubmissionStatus;
  pembimbing: string;
  catatan?: string;
}
