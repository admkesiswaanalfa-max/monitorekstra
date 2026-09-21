import * as XLSX from 'xlsx';
import { Student, Extracurricular, SchoolInfo } from '../types';

/**
 * Export student data to formatted Excel (.xlsx) file
 */
export function exportStudentsToXLSX(
  students: Student[],
  extracurriculars: Extracurricular[],
  schoolInfo?: Partial<SchoolInfo>,
  fileNameSuffix = 'Kompilasi'
): string {
  const academicYear = schoolInfo?.academicYear || '2026/2027';
  const semester = schoolInfo?.semester || 'Ganjil';

  // 1. Prepare Rows
  const rows = students.map((s, idx) => {
    const ekskulNames = s.ekskulIds
      .map((id) => extracurriculars.find((e) => e.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const comp = s.competencies || {
      keterampilan: 3.5,
      disiplin: 3.5,
      kerjasama: 3.5,
      pengetahuan: 3.5,
    };

    return {
      'No': idx + 1,
      'NIS': s.nis,
      'NISN': s.nisn,
      'Nama Siswa': s.name,
      'Kelas': s.class,
      'Jenis Kelamin': s.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)',
      'Ekstrakurikuler': ekskulNames || '-',
      'Kehadiran (%)': s.attendanceRate,
      'Nilai Capaian (100)': s.overallScore,
      'Skala 4.0': Number(((s.overallScore || 85) / 25).toFixed(2)),
      'Predikat': s.category,
      'Keterampilan': comp.keterampilan ?? 3.5,
      'Kedisiplinan': comp.disiplin ?? 3.5,
      'Kerjasama': comp.kerjasama ?? 3.5,
      'Status': s.status,
      'Nama Orang Tua': s.parentName || '-',
      'Kontak Orang Tua': s.parentPhone || '-',
    };
  });

  // 2. Summary stats row
  const totalStudents = students.length;
  const avgAttendance = totalStudents
    ? Number((students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalStudents).toFixed(1))
    : 0;
  const avgScore = totalStudents
    ? Number((students.reduce((acc, s) => acc + (s.overallScore || 0), 0) / totalStudents).toFixed(2))
    : 0;

  // 3. Create worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 4. Set auto column widths
  const colWidths = [
    { wch: 6 },  // No
    { wch: 14 }, // NIS
    { wch: 16 }, // NISN
    { wch: 28 }, // Nama Siswa
    { wch: 10 }, // Kelas
    { wch: 16 }, // Jenis Kelamin
    { wch: 32 }, // Ekstrakurikuler
    { wch: 14 }, // Kehadiran
    { wch: 18 }, // Nilai Capaian
    { wch: 12 }, // Skala 4.0
    { wch: 16 }, // Predikat
    { wch: 14 }, // Keterampilan
    { wch: 14 }, // Kedisiplinan
    { wch: 14 }, // Kerjasama
    { wch: 12 }, // Status
    { wch: 24 }, // Orang Tua
    { wch: 18 }, // Kontak
  ];
  worksheet['!cols'] = colWidths;

  // 5. Create workbook & append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

  // 6. Add a summary sheet
  const summaryData = [
    { 'Indikator': 'Nama Sekolah', 'Keterangan': schoolInfo?.name || 'SMP ALFA ALI MASYKUR' },
    { 'Indikator': 'NPSN', 'Keterangan': schoolInfo?.npsn || '20306789' },
    { 'Indikator': 'Tahun Pelajaran', 'Keterangan': academicYear },
    { 'Indikator': 'Semester', 'Keterangan': semester },
    { 'Indikator': 'Total Siswa Diekspor', 'Keterangan': `${totalStudents} Siswa` },
    { 'Indikator': 'Rata-rata Kehadiran', 'Keterangan': `${avgAttendance}%` },
    { 'Indikator': 'Rata-rata Nilai Capaian', 'Keterangan': `${avgScore} / 100` },
    { 'Indikator': 'Tanggal Unduh', 'Keterangan': new Date().toLocaleString('id-ID') },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 24 }, { wch: 36 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan Laporan');

  // 7. Write and save file
  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanSuffix = fileNameSuffix.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Data_Siswa_SMP_Alfa_Ali_Masykur_${cleanSuffix}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return filename;
}
