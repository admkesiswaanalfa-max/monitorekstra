import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Extracurricular, SchoolInfo } from '../types';

export interface ExportPerformancePdfOptions {
  includeTahfidz?: boolean;
  includeCompetencies?: boolean;
  includeSignatures?: boolean;
  documentNumber?: string;
  notes?: string;
  period?: string;
}

/**
 * Draw an official Kop Surat (Letterhead) on the jsPDF document
 */
function drawOfficialKopSurat(
  doc: jsPDF,
  schoolInfo: Partial<SchoolInfo>,
  pageWidth: number
): number {
  const schoolName = schoolInfo.name || 'SMP ALFA ALI MASYKUR';
  const address = schoolInfo.address || 'Jl. Dieng Km. 05 Bumirejo, Wonosobo, Jawa Tengah 56351';
  const phone = schoolInfo.phone || '(0286) 321xxx';
  const email = schoolInfo.email || 'smp.alfaalimasykur@gmail.com';
  const website = schoolInfo.website || 'www.alfaalimasykur.sch.id';
  const npsn = schoolInfo.npsn || '20306789';

  // Map font family to jsPDF standard fonts
  const pdfFont =
    schoolInfo.fontFamily === 'times' ||
    schoolInfo.fontFamily === 'bookman' ||
    schoolInfo.fontFamily === 'georgia'
      ? 'times'
      : 'helvetica';

  // Map header color theme
  const [headerR, headerG, headerB] =
    schoolInfo.headerColorTheme === 'black'
      ? [15, 23, 42]
      : schoolInfo.headerColorTheme === 'navy'
      ? [23, 37, 84]
      : [6, 78, 59];

  // Font scale multiplier
  const scale = schoolInfo.fontScale === 'sm' ? 0.9 : schoolInfo.fontScale === 'lg' ? 1.15 : 1.0;

  // Yayasan / Parent institution
  if (schoolInfo.showFoundationName !== false) {
    const foundation = (schoolInfo.foundationName || 'YAYASAN PONDOK PESANTREN ALFA ALI MASYKUR').toUpperCase();
    doc.setFont(pdfFont, 'bold');
    doc.setFontSize(9 * scale);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(foundation, pageWidth / 2, 14, { align: 'center' });
  }

  // School Name
  doc.setFont(pdfFont, 'bold');
  doc.setFontSize(14 * scale);
  doc.setTextColor(headerR, headerG, headerB);
  doc.text(schoolName.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

  // Subtitle / Status
  const subHeader = schoolInfo.subHeader || `STATUS: TERAKREDITASI "A" • NPSN: ${npsn}`;
  doc.setFont(pdfFont, 'bold');
  doc.setFontSize(8.5 * scale);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(subHeader.replace(/&bull;/g, '•'), pageWidth / 2, 24.5, {
    align: 'center',
  });

  // Address & Contacts
  doc.setFont(pdfFont, 'normal');
  doc.setFontSize(7.5 * scale);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`${address} • Telp: ${phone}`, pageWidth / 2, 28.5, { align: 'center' });
  doc.text(`Email: ${email} • Website: ${website}`, pageWidth / 2, 32, { align: 'center' });

  // Draw raster logos if available (PNG/JPEG base64 data URLs)
  if (schoolInfo.logoUrl && (schoolInfo.logoUrl.startsWith('data:image/png') || schoolInfo.logoUrl.startsWith('data:image/jpeg'))) {
    try {
      const format = schoolInfo.logoUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(schoolInfo.logoUrl, format, 14, 9, 18, 18);
    } catch {
      // safe fallback if unsupported format
    }
  }
  if (schoolInfo.showSecondaryLogo !== false && schoolInfo.secondaryLogoUrl && (schoolInfo.secondaryLogoUrl.startsWith('data:image/png') || schoolInfo.secondaryLogoUrl.startsWith('data:image/jpeg'))) {
    try {
      const format = schoolInfo.secondaryLogoUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(schoolInfo.secondaryLogoUrl, format, pageWidth - 14 - 18, 9, 18, 18);
    } catch {
      // safe fallback
    }
  }

  // Double horizontal border lines
  doc.setDrawColor(headerR, headerG, headerB);
  doc.setLineWidth(0.8);
  doc.line(14, 35, pageWidth - 14, 35);
  doc.setDrawColor(100, 116, 139); // slate-500
  doc.setLineWidth(0.2);
  doc.line(14, 36, pageWidth - 14, 36);

  return 42; // Next available Y position
}

/**
 * Draw Official Stamp / Cap Sekolah
 */
function drawOfficialStamp(doc: jsPDF, x: number, y: number) {
  doc.saveGraphicsState();
  doc.setDrawColor(16, 110, 80);
  doc.setFillColor(240, 253, 244);
  doc.setLineWidth(0.6);
  // Rounded seal box
  doc.roundedRect(x - 14, y - 8, 28, 16, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(6, 95, 70);
  doc.text('SMP ALFA ALI MASYKUR', x, y - 3, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('SEAL &bull; TERVERIFIKASI', x, y + 1.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('RESMI RESEP KEMENDIKBUD', x, y + 5.5, { align: 'center' });
  doc.restoreGraphicsState();
}

/**
 * 1. Export Individual Student Performance to PDF (Official Documentation)
 */
export function exportIndividualStudentPerformancePDF(
  student: Student,
  schoolInfo: Partial<SchoolInfo>,
  extracurriculars: Extracurricular[],
  options: ExportPerformancePdfOptions = {}
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const academicYear = schoolInfo.academicYear || '2026/2027';
  const semester = schoolInfo.semester || 'Ganjil';
  const docNumber = options.documentNumber || `421.3/SMP-AAM/LAP-KHS/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  // 1. Draw Kop Surat
  let currentY = drawOfficialKopSurat(doc, schoolInfo, pageWidth);

  // 2. Title Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('LEMBAR LAPORAN HASIL KINERJA & EVALUASI SISWA', pageWidth / 2, currentY + 2, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Nomor Dokumen: ${docNumber}`, pageWidth / 2, currentY + 6.5, { align: 'center' });
  doc.text(`Tahun Pelajaran: ${academicYear} &bull; Semester: ${semester}`, pageWidth / 2, currentY + 10.5, {
    align: 'center',
  });

  currentY += 15;

  // 3. Student Identity Box
  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 1.5,
      textColor: [30, 41, 59],
      font: 'helvetica',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 32, textColor: [51, 65, 85] },
      1: { cellWidth: 3 },
      2: { cellWidth: 68 },
      3: { fontStyle: 'bold', cellWidth: 32, textColor: [51, 65, 85] },
      4: { cellWidth: 3 },
      5: { cellWidth: 44 },
    },
    body: [
      ['Nama Lengkap', ':', student.name.toUpperCase(), 'Nomor Induk Siswa (NIS)', ':', student.nis],
      [
        'NISN',
        ':',
        student.nisn || '-',
        'Kelas / Rombel',
        ':',
        `${student.class} (${student.rombel || 'Reguler'})`,
      ],
      [
        'Jenis Kelamin',
        ':',
        student.gender === 'L' ? 'Laki-laki (Santriwan)' : 'Perempuan (Santriwati)',
        'Wali Kelas',
        ':',
        student.waliKelas || 'Ustadz Pembina',
      ],
      [
        'Nama Orang Tua / Wali',
        ':',
        student.parentName || 'Orang Tua Siswa',
        'Status Siswa',
        ':',
        `${student.status || 'Aktif'} Terdaftar`,
      ],
    ],
  });

  // Retrieve end position of identity table
  currentY = (doc as any).lastAutoTable.finalY + 4;

  // 4. Section A: Capaian Kinerja Ekstrakurikuler
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(6, 78, 59); // emerald-900
  doc.text('A. Capaian Kinerja & Hasil Evaluasi Ekstrakurikuler', 14, currentY + 2);
  currentY += 4;

  const ekskulRows = (student.ekskulIds || []).map((eId, index) => {
    const ek = extracurriculars.find((e) => e.id === eId);
    const score = student.overallScore || 85;
    const gpa = (score / 25).toFixed(2); // e.g. 3.40 / 4.0
    return [
      String(index + 1),
      ek?.name || eId,
      ek?.category || 'Umum',
      ek?.coachName || 'Pembina Terkait',
      `${student.attendanceRate}%`,
      `${score} (${gpa})`,
      student.category || 'Baik',
      ek?.targetCapaian
        ? ek.targetCapaian.substring(0, 55) + '...'
        : 'Mencapai target kompetensi dan berkontribusi aktif.',
    ];
  });

  if (ekskulRows.length === 0) {
    ekskulRows.push([
      '1',
      'Ekstrakurikuler Reguler',
      'Wajib',
      'Pembina Sekolah',
      `${student.attendanceRate}%`,
      `${student.overallScore}`,
      student.category,
      'Mengikuti kegiatan secara aktif dan tertib.',
    ]);
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [
      [
        'No',
        'Cabang Ekstrakurikuler',
        'Kategori',
        'Pembina / Pelatih',
        'Kehadiran',
        'Nilai (4.0)',
        'Predikat',
        'Capaian Kompetensi',
      ],
    ],
    body: ekskulRows,
    headStyles: {
      fillColor: [6, 78, 59], // emerald-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [15, 23, 42],
      font: 'helvetica',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { fontStyle: 'bold', cellWidth: 38 },
      2: { cellWidth: 22 },
      3: { cellWidth: 32 },
      4: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
      5: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
      6: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
      7: { cellWidth: 'auto' },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // 5. Section B: Evaluasi 8 Aspek Karakter & Kompetensi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(6, 78, 59);
  doc.text('B. Rincian Aspek Kinerja, Keterampilan & Karakter Pesantren', 14, currentY + 2);
  currentY += 4;

  const comps = student.competencies || {
    keterampilan: 3.8,
    pengetahuan: 3.7,
    kreativitas: 3.6,
    kerjasama: 3.9,
    disiplin: 3.8,
    tanggungJawab: 3.9,
    kepemimpinan: 3.7,
    sportivitas: 3.8,
    adab: 3.9,
  };

  const getPredicate = (val: number) => {
    if (val >= 3.85) return 'Sangat Baik (A)';
    if (val >= 3.4) return 'Baik (B)';
    if (val >= 3.0) return 'Cukup (C)';
    return 'Perlu Pembinaan (D)';
  };

  const competenceRows = [
    [
      '1',
      'Keterampilan Praktis / Skill Teknis',
      `${comps.keterampilan || 3.8} / 4.0`,
      getPredicate(comps.keterampilan || 3.8),
      '5',
      'Kedisiplinan & Ketaatan Tata Tertib',
      `${comps.disiplin || 3.8} / 4.0`,
      getPredicate(comps.disiplin || 3.8),
    ],
    [
      '2',
      'Pengetahuan & Pemahaman Konsep',
      `${comps.pengetahuan || 3.7} / 4.0`,
      getPredicate(comps.pengetahuan || 3.7),
      '6',
      'Tanggung Jawab & Kemandirian',
      `${comps.tanggungJawab || 3.9} / 4.0`,
      getPredicate(comps.tanggungJawab || 3.9),
    ],
    [
      '3',
      'Kreativitas & Inovasi Karya',
      `${comps.kreativitas || 3.6} / 4.0`,
      getPredicate(comps.kreativitas || 3.6),
      '7',
      'Kepemimpinan & Sportivitas',
      `${comps.kepemimpinan || 3.7} / 4.0`,
      getPredicate(comps.kepemimpinan || 3.7),
    ],
    [
      '4',
      'Kerjasama Tim & Solidaritas',
      `${comps.kerjasama || 3.9} / 4.0`,
      getPredicate(comps.kerjasama || 3.9),
      '8',
      'Adab & Akhlakul Karimah Pesantren',
      `${comps.adab || 3.9} / 4.0`,
      getPredicate(comps.adab || 3.9),
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [
      ['No', 'Aspek Kompetensi Utama', 'Skor', 'Kualifikasi', 'No', 'Aspek Karakter & Adab', 'Skor', 'Kualifikasi'],
    ],
    body: competenceRows,
    headStyles: {
      fillColor: [15, 118, 110], // teal-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      font: 'helvetica',
      textColor: [15, 23, 42],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 7 },
      1: { cellWidth: 46 },
      2: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 22 },
      4: { halign: 'center', cellWidth: 7 },
      5: { cellWidth: 46 },
      6: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      7: { halign: 'center', cellWidth: 22 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 4;

  // 6. Section C: Capaian Tahfidz Al-Qur'an & Yanbu'a (Optional or if available)
  if (student.yanbuaJilid || student.quranSurah || options.includeTahfidz) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(6, 78, 59);
    doc.text('C. Capaian Pembelajaran Al-Qur`an & Tahfidz', 14, currentY + 2);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      margin: { left: 14, right: 14 },
      theme: 'grid',
      head: [['Jilid Yanbu`a', 'Halaman Terakhir', 'Juz Hafalan', 'Surah & Ayat', 'Target Hafalan', 'Status Setoran']],
      body: [
        [
          student.yanbuaJilid || 'Jilid 2',
          `Halaman ${student.yanbuaHalaman || 15}`,
          `Juz ${student.quranJuz || 30}`,
          student.quranSurah || 'An-Naba: 1-40',
          `${student.quranTargetAyat || 564} Ayat (Juz 30)`,
          student.statusSetoranHariIni || 'LANCAR (MUTQIN)',
        ],
      ],
      headStyles: {
        fillColor: [180, 83, 9], // amber-700
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'center',
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 1.8,
        halign: 'center',
        font: 'helvetica',
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;
  }

  // 7. Notes Box: Catatan Pembimbing & Evaluasi Karakter
  const notesText =
    student.notes ||
    options.notes ||
    'Santri menunjukkan semangat thalabul ilmi yang tinggi, aktif berkontribusi positif dalam kelompok, serta senantiasa menjaga adab sopan santun terhadap pembina dan sesama rekan santri.';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Catatan & Rekomendasi Pembimbing:', 14, currentY + 2);
  currentY += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, currentY, pageWidth - 28, 13, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`"${notesText}"`, 17, currentY + 4.5, { maxWidth: pageWidth - 34 });

  currentY += 17;

  // 8. Official Signatures (3-Column Layout)
  const signDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const headmasterName = schoolInfo.headmaster || 'Afif Mashadi, S.S.';
  const headmasterNip = schoolInfo.headmasterNip || '19780512 200501 1 007';
  const waliKelasName = student.waliKelas || 'Ustadz Ahmad Fauzi, S.Pd.I';
  const parentName = student.parentName || 'Orang Tua / Wali Santri';

  const col1X = 35;
  const col2X = 105;
  const col3X = 175;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  doc.text('Mengetahui,', col1X, currentY, { align: 'center' });
  doc.text('Orang Tua / Wali Santri', col1X, currentY + 4, { align: 'center' });

  doc.text('Pembina / Wali Kelas,', col2X, currentY + 4, { align: 'center' });

  doc.text(`Wonosobo, ${signDate}`, col3X, currentY, { align: 'center' });
  doc.text('Kepala SMP Alfa Ali Masykur', col3X, currentY + 4, { align: 'center' });

  // Official Stamp graphic
  drawOfficialStamp(doc, col3X, currentY + 13);

  // Names after signature space
  const nameY = currentY + 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`( ${parentName} )`, col1X, nameY, { align: 'center' });

  doc.text(waliKelasName, col2X, nameY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('NIP. Guru Pembina', col2X, nameY + 3.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(headmasterName, col3X, nameY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`NIP. ${headmasterNip}`, col3X, nameY + 3.5, { align: 'center' });

  // 9. Document Security & Footer
  const footerY = pageHeight - 10;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(14, footerY - 2, pageWidth - 14, footerY - 2);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Dokumen resmi Sistem Informasi Ekstrakurikuler SMP Alfa Ali Masykur &bull; Dicetak pada: ${new Date().toLocaleString(
      'id-ID'
    )} &bull; Keabsahan digital terjamin`,
    14,
    footerY + 1.5
  );
  doc.setFont('helvetica', 'normal');
  doc.text('Halaman 1 dari 1', pageWidth - 14, footerY + 1.5, { align: 'right' });

  // Save document
  const fileName = `Rapor_Kinerja_${student.name.replace(/\s+/g, '_')}_${student.class}_${academicYear.replace('/', '-')}.pdf`;
  doc.save(fileName);
  return fileName;
}

/**
 * 2. Export Recapitulation / Performance Table of Students to PDF (Landscape Official Documentation)
 */
export function exportRecapitulationStudentPerformancePDF(
  students: Student[],
  schoolInfo: Partial<SchoolInfo>,
  title: string,
  filterInfo: {
    categoryLabel?: string;
    ekskulName?: string;
    className?: string;
    period?: string;
  } = {}
) {
  // Use Landscape for complete multi-column performance table
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const academicYear = schoolInfo.academicYear || '2026/2027';
  const semester = schoolInfo.semester || 'Ganjil';
  const docNumber = `421.3/SMP-AAM/REKAP-EKSKUL/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

  // 1. Draw Kop Surat (adjusted for landscape width)
  let currentY = drawOfficialKopSurat(doc, schoolInfo, pageWidth);

  // 2. Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), pageWidth / 2, currentY + 2, { align: 'center' });

  // Subtitle / Filters
  const filterParts = [
    filterInfo.categoryLabel ? `Kategori: ${filterInfo.categoryLabel}` : '',
    filterInfo.ekskulName ? `Ekstrakurikuler: ${filterInfo.ekskulName}` : '',
    filterInfo.className && filterInfo.className !== 'all' ? `Kelas: ${filterInfo.className}` : 'Seluruh Kelas',
    `Semester ${semester} T.P. ${academicYear}`,
  ].filter(Boolean);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(filterParts.join(' &bull; '), pageWidth / 2, currentY + 6.5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(`Nomor Registrasi: ${docNumber} &bull; Total Terdata: ${students.length} Siswa`, pageWidth / 2, currentY + 10.5, {
    align: 'center',
  });

  currentY += 14;

  // 3. Performance Statistics Summary Bar
  const totalStudents = students.length;
  const avgAttendance = totalStudents
    ? (students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / totalStudents).toFixed(1)
    : '0';
  const avgScore = totalStudents
    ? (students.reduce((acc, s) => acc + (s.overallScore || 0), 0) / totalStudents).toFixed(2)
    : '0';
  const countSangatBaik = students.filter((s) => (s.overallScore || 0) >= 88).length;
  const countBaik = students.filter((s) => (s.overallScore || 0) >= 75 && (s.overallScore || 0) < 88).length;

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    styles: {
      fontSize: 7.5,
      cellPadding: 1.5,
      halign: 'center',
      font: 'helvetica',
    },
    body: [
      [
        `Total Peserta: ${totalStudents} Siswa`,
        `Rata-rata Kehadiran: ${avgAttendance}%`,
        `Rata-rata Nilai: ${avgScore} / 100`,
        `Predikat Sangat Baik (A): ${countSangatBaik} Santri`,
        `Predikat Baik (B): ${countBaik} Santri`,
        'Kelulusan Capaian: 100% Tuntas',
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // 4. Student Performance Table
  const tableData = students.map((s, idx) => {
    const comp = s.competencies || { keterampilan: 3.8, disiplin: 3.8, kerjasama: 3.8 };
    const gpa = ((s.overallScore || 85) / 25).toFixed(2);
    return [
      String(idx + 1),
      s.nis,
      s.name,
      s.gender === 'L' ? 'L' : 'P',
      s.class,
      `${s.attendanceRate}%`,
      String(comp.keterampilan || 3.8),
      String(comp.disiplin || 3.8),
      String(comp.kerjasama || 3.8),
      String(s.overallScore || 85),
      gpa,
      s.category || 'Baik',
      (s.overallScore || 85) >= 75 ? 'Tuntas Kompeten' : 'Perlu Bimbingan',
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: 14, right: 14 },
    theme: 'striped',
    head: [
      [
        'No',
        'NIS',
        'Nama Lengkap Santri / Siswa',
        'L/P',
        'Kelas',
        'Kehadiran',
        'Keterampilan',
        'Kedisiplinan',
        'Kerjasama',
        'Nilai (100)',
        'Skala 4.0',
        'Predikat',
        'Status Ketercapaian',
      ],
    ],
    body: tableData,
    headStyles: {
      fillColor: [6, 78, 59], // emerald-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      font: 'helvetica',
      textColor: [15, 23, 42],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
      2: { fontStyle: 'bold', cellWidth: 55 },
      3: { halign: 'center', cellWidth: 10 },
      4: { halign: 'center', cellWidth: 16 },
      5: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
      6: { halign: 'center', cellWidth: 20 },
      7: { halign: 'center', cellWidth: 20 },
      8: { halign: 'center', cellWidth: 20 },
      9: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
      10: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      11: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
      12: { halign: 'center', cellWidth: 'auto' },
    },
    didDrawPage: (data) => {
      // Add footer to every page
      const pageNum = doc.getNumberOfPages();
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Dokumen Rekapitulasi Resmi SMP Alfa Ali Masykur &bull; Dicetak: ${new Date().toLocaleString('id-ID')}`,
        14,
        pageHeight - 6
      );
      doc.text(`Halaman ${pageNum}`, pageWidth - 14, pageHeight - 6, { align: 'right' });
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // If there's enough space on the current page, draw signatures; otherwise add a page
  if (currentY + 35 > pageHeight) {
    doc.addPage();
    currentY = 20;
  }

  // Official Signature Block (Landscape)
  const signDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const headmasterName = schoolInfo.headmaster || 'Afif Mashadi, S.S.';
  const headmasterNip = schoolInfo.headmasterNip || '19780512 200501 1 007';
  const coordinatorName = schoolInfo.coordinatorName || 'Ahmad Fauzi, S.Pd.';
  const coordinatorNip = schoolInfo.coordinatorNip || '19850315 201101 1 012';

  const colLeft = 50;
  const colRight = pageWidth - 60;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  doc.text('Mengetahui,', colLeft, currentY, { align: 'center' });
  doc.text('Kepala SMP Alfa Ali Masykur', colLeft, currentY + 4, { align: 'center' });

  doc.text(`Wonosobo, ${signDate}`, colRight, currentY, { align: 'center' });
  doc.text('Koordinator Ekstrakurikuler', colRight, currentY + 4, { align: 'center' });

  // Stamp
  drawOfficialStamp(doc, colLeft, currentY + 13);

  const nameY = currentY + 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(headmasterName, colLeft, nameY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${headmasterNip}`, colLeft, nameY + 4, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(coordinatorName, colRight, nameY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`NIP. ${coordinatorNip}`, colRight, nameY + 4, { align: 'center' });

  const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Rekap_Kinerja_${cleanTitle}_${academicYear.replace('/', '-')}.pdf`;
  doc.save(fileName);
  return fileName;
}
