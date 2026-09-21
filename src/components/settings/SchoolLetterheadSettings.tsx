import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LETTERHEAD_LOGO_PRESETS,
  DEFAULT_PRIMARY_LOGO,
  DEFAULT_SECONDARY_LOGO,
} from '../../data/letterheadPresets';
import {
  Building2,
  Image,
  Upload,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Printer,
  Save,
  Trash2,
  Layers,
  HelpCircle,
  FileText,
  Shield,
  Info,
  Type,
  Palette,
} from 'lucide-react';

export const FONT_OPTIONS: {
  id: 'times' | 'arial' | 'bookman' | 'calibri' | 'georgia';
  name: string;
  category: string;
  fontFamilyCss: string;
  description: string;
  badge: string;
}[] = [
  {
    id: 'times',
    name: 'Times New Roman',
    category: 'Serif Kedinasan Tradisional',
    fontFamilyCss: '"Times New Roman", Times, Georgia, serif',
    description: 'Standar resmi surat dinas pemerintahan, keputusan kepala sekolah, dan dokumen legal kenegaraan.',
    badge: 'Standar Kedinasan Resmi',
  },
  {
    id: 'arial',
    name: 'Arial / Sans-Serif',
    category: 'Modern Kedinasan & Jelas',
    fontFamilyCss: 'Arial, Helvetica, "Nimbus Sans L", sans-serif',
    description: 'Format modern yang sangat mudah dibaca, bersih, ringkas, dan jelas di semua resolusi cetak kertas.',
    badge: 'Paling Populer',
  },
  {
    id: 'bookman',
    name: 'Bookman Old Style',
    category: 'Elegan, Berwibawa & Piagam',
    fontFamilyCss: '"Bookman Old Style", Bookman, Garamond, serif',
    description: 'Biasa digunakan pada naskah piagam ijazah, dokumen kehormatan pesantren, dan sertifikat prestasi resmi.',
    badge: 'Khas Piagam & Ijazah',
  },
  {
    id: 'calibri',
    name: 'Calibri',
    category: 'Perkantoran Modern',
    fontFamilyCss: 'Calibri, Candara, Segoe, sans-serif',
    description: 'Karakter halus, proporsional, ramah, dan menjadi standar baku korespondensi perkantoran modern.',
    badge: 'Rapi & Proporsional',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    category: 'Klasik Akademik',
    fontFamilyCss: 'Georgia, Cambria, serif',
    description: 'Huruf serif akademik dengan ketegasan visual tinggi, memberikan wibawa institusi pendidikan tinggi.',
    badge: 'Akademik Berwibawa',
  },
];

export const FONT_SCALE_OPTIONS: {
  id: 'sm' | 'md' | 'lg';
  label: string;
  badge: string;
  desc: string;
}[] = [
  {
    id: 'sm',
    label: 'Kompak (Ringkas - 90%)',
    badge: 'Hemat Ruang',
    desc: 'Cocok jika nama yayasan, alamat, atau legalitas akreditasi panjang agar tidak memakan porsi lembar isi surat.',
  },
  {
    id: 'md',
    label: 'Standar Proporsional (100%)',
    badge: 'Rekomendasi',
    desc: 'Keseimbangan ukuran teks dan logo standar baku lembar kertas ukuran A4 atau F4 (Folio).',
  },
  {
    id: 'lg',
    label: 'Besar Menonjol (115%)',
    badge: 'Penegasan Lembaga',
    desc: 'Memberikan aksen nama sekolah lebih megah dan menonjol, sangat cocok untuk lembar rapor dan sertifikat.',
  },
];

export const COLOR_THEMES: {
  id: 'emerald' | 'black' | 'navy';
  label: string;
  colorClass: string;
  bgChip: string;
  desc: string;
}[] = [
  {
    id: 'emerald',
    label: 'Hijau Pesantren (Emerald-950)',
    colorClass: 'text-emerald-950',
    bgChip: 'bg-emerald-900',
    desc: 'Warna identitas resmi khas SMP Alfa Ali Masykur dan nuansa Islami pondok pesantren.',
  },
  {
    id: 'black',
    label: 'Hitam Kedinasan (Slate-950)',
    colorClass: 'text-slate-950',
    bgChip: 'bg-slate-950',
    desc: 'Monokrom kedinasan resmi standar fotokopi dan arsip naskah dinas umum.',
  },
  {
    id: 'navy',
    label: 'Biru Klasik (Blue-950 / Navy)',
    colorClass: 'text-blue-950',
    bgChip: 'bg-blue-950',
    desc: 'Nuansa formal kenegaraan, berwibawa, dan elegan.',
  },
];

export const SchoolLetterheadSettings: React.FC = () => {
  const { schoolInfo, updateSchoolInfo, showToast } = useApp();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'identitas_kop' | 'font_tipografi' | 'logo_utama' | 'logo_sekunder'>('identitas_kop');

  // Foundation & School Identity form states
  const [foundationName, setFoundationName] = useState(
    schoolInfo.foundationName || 'YAYASAN PONDOK PESANTREN ALFA ALI MASYKUR'
  );
  const [showFoundationName, setShowFoundationName] = useState(
    schoolInfo.showFoundationName !== false
  );
  const [name, setName] = useState(schoolInfo.name || 'SMP ALFA ALI MASYKUR');
  const [subHeader, setSubHeader] = useState(
    schoolInfo.subHeader ||
      `NPSN: ${schoolInfo.npsn || '20307890'} • STATUS: TERAKREDITASI "A" (UNGGUL) • NSS: 202030709001`
  );
  const [npsn, setNpsn] = useState(schoolInfo.npsn || '20307890');
  const [address, setAddress] = useState(schoolInfo.address || '');
  const [phone, setPhone] = useState(schoolInfo.phone || '');
  const [email, setEmail] = useState(schoolInfo.email || '');
  const [website, setWebsite] = useState(schoolInfo.website || '');
  const [headmaster, setHeadmaster] = useState(
    schoolInfo.headmaster || schoolInfo.principal || 'Afif Mashadi, S.S.'
  );
  const [headmasterNip, setHeadmasterNip] = useState(
    schoolInfo.headmasterNip || schoolInfo.principalNip || '19780512 200501 1 007'
  );
  const [academicYear, setAcademicYear] = useState(schoolInfo.academicYear || '2026/2027');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(schoolInfo.semester || 'Ganjil');

  // Typography & Font states
  const [fontFamily, setFontFamily] = useState<'times' | 'arial' | 'bookman' | 'calibri' | 'georgia'>(
    schoolInfo.fontFamily || 'arial'
  );
  const [fontScale, setFontScale] = useState<'sm' | 'md' | 'lg'>(schoolInfo.fontScale || 'md');
  const [headerColorTheme, setHeaderColorTheme] = useState<'black' | 'emerald' | 'navy'>(
    schoolInfo.headerColorTheme || 'emerald'
  );

  // Primary Logo (Logo Kiri / Utama)
  const [logoUrl, setLogoUrl] = useState(schoolInfo.logoUrl || DEFAULT_PRIMARY_LOGO);
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg'>(schoolInfo.logoSize || 'md');
  const [logoShape, setLogoShape] = useState<'square' | 'circle' | 'rounded'>(
    (schoolInfo.logoShape as any) === 'original' ? 'square' : schoolInfo.logoShape || 'rounded'
  );
  const [customPrimaryUrl, setCustomPrimaryUrl] = useState('');
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);

  // Secondary Logo (Logo Kanan / Tut Wuri Handayani / Kemenag)
  const [secondaryLogoUrl, setSecondaryLogoUrl] = useState(
    schoolInfo.secondaryLogoUrl || DEFAULT_SECONDARY_LOGO
  );
  const [showSecondaryLogo, setShowSecondaryLogo] = useState(
    schoolInfo.showSecondaryLogo !== false
  );
  const [customSecondaryUrl, setCustomSecondaryUrl] = useState('');
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);

  const fileInputPrimaryRef = useRef<HTMLInputElement>(null);
  const fileInputSecondaryRef = useRef<HTMLInputElement>(null);

  // File processing helper (reads image into Base64 Data URL)
  const processImageFile = (file: File, target: 'primary' | 'secondary') => {
    if (!file.type.startsWith('image/')) {
      showToast('Format Tidak Didukung', 'Silakan pilih berkas gambar (PNG, JPG, SVG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran Terlalu Besar', 'Maksimal ukuran berkas logo adalah 5 MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        if (target === 'primary') {
          setLogoUrl(result);
          showToast('Logo Utama Diperbarui', 'Logo berhasil diunggah dan langsung diterapkan pada kop surat.', 'success');
        } else {
          setSecondaryLogoUrl(result);
          showToast('Logo Kanan Diperbarui', 'Logo sekunder berhasil diunggah dan diterapkan.', 'success');
        }
      }
    };
    reader.onerror = () => {
      showToast('Gagal Membaca Berkas', 'Terjadi kesalahan saat membaca berkas gambar.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers for primary logo
  const handleDropPrimary = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPrimary(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], 'primary');
    }
  };

  // Drag & drop handlers for secondary logo
  const handleDropSecondary = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingSecondary(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], 'secondary');
    }
  };

  // Apply URL directly for primary logo
  const handleApplyPrimaryUrl = () => {
    if (!customPrimaryUrl.trim()) return;
    setLogoUrl(customPrimaryUrl.trim());
    setCustomPrimaryUrl('');
    showToast('Tautan Logo Diterapkan', 'Logo utama berhasil diperbarui dari URL.', 'success');
  };

  // Apply URL directly for secondary logo
  const handleApplySecondaryUrl = () => {
    if (!customSecondaryUrl.trim()) return;
    setSecondaryLogoUrl(customSecondaryUrl.trim());
    setCustomSecondaryUrl('');
    showToast('Tautan Logo Kanan Diterapkan', 'Logo sekunder berhasil diperbarui dari URL.', 'success');
  };

  // Reset to default
  const handleResetToDefault = () => {
    setFoundationName('YAYASAN PONDOK PESANTREN ALFA ALI MASYKUR');
    setShowFoundationName(true);
    setName('SMP ALFA ALI MASYKUR');
    setSubHeader('NPSN: 20307890 • STATUS: TERAKREDITASI "A" (UNGGUL) • NSS: 202030709001');
    setLogoUrl(DEFAULT_PRIMARY_LOGO);
    setSecondaryLogoUrl(DEFAULT_SECONDARY_LOGO);
    setShowSecondaryLogo(true);
    setLogoSize('md');
    setLogoShape('rounded');
    setFontFamily('arial');
    setFontScale('md');
    setHeaderColorTheme('emerald');
    showToast('Kop Surat Direset', 'Kop surat, font, dan logo dikembalikan ke standar resmi SMP Alfa Ali Masykur.', 'info');
  };

  // Save all changes
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    updateSchoolInfo({
      foundationName,
      showFoundationName,
      name,
      subHeader,
      npsn,
      address,
      phone,
      email,
      website,
      headmaster,
      headmasterNip,
      principal: headmaster,
      principalNip: headmasterNip,
      academicYear,
      semester,
      logoUrl,
      secondaryLogoUrl,
      showSecondaryLogo,
      logoSize,
      logoShape,
      fontFamily,
      fontScale,
      headerColorTheme,
    });

    showToast(
      'Kop Surat & Logo Disimpan',
      'Pengaturan font tipografi, nama yayasan, logo, dan identitas kop surat berhasil diperbarui di seluruh sistem.',
      'success'
    );
  };

  // Test Print Kop Surat
  const handleTestPrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const sizePx = logoSize === 'sm' ? '64px' : logoSize === 'lg' ? '96px' : '80px';
    const shapeStyle =
      logoShape === 'circle'
        ? 'border-radius: 9999px; object-fit: cover; border: 1px solid #cbd5e1;'
        : logoShape === 'rounded'
        ? 'border-radius: 12px; object-fit: cover; border: 1px solid #cbd5e1;'
        : 'object-fit: contain;';

    const fontCssFamily =
      fontFamily === 'times'
        ? '"Times New Roman", Times, Georgia, serif'
        : fontFamily === 'bookman'
        ? '"Bookman Old Style", Bookman, Garamond, serif'
        : fontFamily === 'georgia'
        ? 'Georgia, Cambria, serif'
        : fontFamily === 'calibri'
        ? 'Calibri, Candara, Segoe, sans-serif'
        : 'Arial, Helvetica, sans-serif';

    const headerColorHex =
      headerColorTheme === 'black' ? '#0f172a' : headerColorTheme === 'navy' ? '#172554' : '#064e3b';

    const printScale = fontScale === 'sm' ? 0.9 : fontScale === 'lg' ? 1.15 : 1.0;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Uji Coba Kop Surat Resmi - ${name}</title>
        <style>
          body { font-family: ${fontCssFamily}; padding: 40px; color: #0f172a; }
          .kop-container { display: flex; align-items: center; justify-content: space-between; gap: 20px; font-family: ${fontCssFamily}; }
          .logo-box { width: ${sizePx}; height: ${sizePx}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .logo-img { width: 100%; height: 100%; ${shapeStyle} }
          .kop-center { flex: 1; text-align: center; }
          .yayasan { font-size: ${11 * printScale}pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 2px; color: #1e293b; }
          .school-name { font-size: ${16 * printScale}pt; font-weight: 900; text-transform: uppercase; margin: 0; color: ${headerColorHex}; }
          .sub-header { font-size: ${8.5 * printScale}pt; font-weight: bold; color: #334155; margin-top: 3px; }
          .contacts { font-size: ${8 * printScale}pt; color: #475569; margin-top: 3px; line-height: 1.4; }
          .border-double-1 { margin-top: 14px; border-bottom: 2.5px solid ${headerColorHex}; }
          .border-double-2 { margin-top: 2px; border-bottom: 1px solid #475569; }
          .sample-content { margin-top: 40px; font-size: 11pt; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="kop-container">
          <div class="logo-box">
            <img src="${logoUrl}" class="logo-img" alt="Logo Utama" />
          </div>
          <div class="kop-center">
            ${showFoundationName && foundationName ? `<div class="yayasan">${foundationName}</div>` : ''}
            <h1 class="school-name">${name}</h1>
            <div class="sub-header">${subHeader}</div>
            <div class="contacts">${address}${phone ? ` • Telp: ${phone}` : ''}${email ? ` • Email: ${email}` : ''}${website ? ` • Web: ${website}` : ''}</div>
          </div>
          ${
            showSecondaryLogo && secondaryLogoUrl
              ? `
            <div class="logo-box">
              <img src="${secondaryLogoUrl}" class="logo-img" alt="Logo Sekunder" />
            </div>
          `
              : `<div class="logo-box" style="visibility: hidden;"></div>`
          }
        </div>
        <div class="border-double-1"></div>
        <div class="border-double-2"></div>

        <div class="sample-content">
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-weight: bold; font-size: 13pt; text-decoration: underline;">SURAT PEMBERITAHUAN RESMI</div>
            <div style="font-size: 10pt; color: #475569;">Nomor: 421.3 / 088 / SMP-AAM / ${academicYear.replace('/', '-')}</div>
          </div>

          <p>Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
          <p>Ini adalah lembar pratinjau uji coba cetak kop surat resmi sekolah berstandar kedinasan. Format font (${fontFamily.toUpperCase()}), skala ukuran (${fontScale}), dan tata naskah ini terintegrasi langsung pada lembar penilaian capaian target santri, rekapitulasi presensi mingguan, piagam penghargaan, dan berkas cetak Dapodik.</p>

          <div style="margin-top: 50px; display: flex; justify-content: flex-end;">
            <div style="text-align: center; width: 250px;">
              <div>Wonosobo, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div>Kepala Sekolah,</div>
              <div style="margin-top: 65px; font-weight: bold; text-decoration: underline;">${headmaster}</div>
              <div style="font-size: 9pt;">NIP. ${headmasterNip}</div>
            </div>
          </div>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Compute CSS sizing for interactive preview
  const previewSizeClass =
    logoSize === 'sm'
      ? 'w-16 h-16 max-h-16'
      : logoSize === 'lg'
      ? 'w-24 h-24 max-h-24'
      : 'w-20 h-20 max-h-20';

  const previewShapeClass =
    logoShape === 'circle'
      ? 'rounded-full object-cover p-1 bg-white border border-slate-200'
      : logoShape === 'rounded'
      ? 'rounded-2xl object-cover p-1 bg-white border border-slate-200'
      : 'rounded-lg object-contain p-0.5 bg-white border border-slate-200';

  // Font family style for preview
  const previewFontFamilyStyle = {
    fontFamily:
      fontFamily === 'times'
        ? '"Times New Roman", Times, Georgia, serif'
        : fontFamily === 'bookman'
        ? '"Bookman Old Style", Bookman, Garamond, serif'
        : fontFamily === 'georgia'
        ? 'Georgia, Cambria, serif'
        : fontFamily === 'calibri'
        ? 'Calibri, Candara, Segoe, sans-serif'
        : 'Arial, Helvetica, "Nimbus Sans L", sans-serif',
  };

  // Color theme class for preview
  const previewColorClass =
    headerColorTheme === 'black'
      ? 'text-slate-950'
      : headerColorTheme === 'navy'
      ? 'text-blue-950'
      : 'text-emerald-950';

  // Scaling classes for preview text
  const previewFoundationClass =
    fontScale === 'sm' ? 'text-[11px] sm:text-xs' : fontScale === 'lg' ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm';
  const previewSchoolNameClass =
    fontScale === 'sm' ? 'text-base sm:text-xl' : fontScale === 'lg' ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl';
  const previewSubHeaderClass =
    fontScale === 'sm' ? 'text-[9.5px] sm:text-[10.5px]' : fontScale === 'lg' ? 'text-[11px] sm:text-xs' : 'text-[10px] sm:text-xs';
  const previewContactsClass =
    fontScale === 'sm' ? 'text-[8.5px] sm:text-[9.5px]' : fontScale === 'lg' ? 'text-[10.5px] sm:text-[11.5px]' : 'text-[9.5px] sm:text-[10.5px]';

  return (
    <div id="school-letterhead-settings" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Kop Surat & Logo Resmi
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Standar Dokumen Kedinasan & Cetak Rapor
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <span>Pengaturan Kop Surat, Nama Yayasan, dan Logo Sekolah</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
            Sesuaikan nama yayasan induk, satuan pendidikan, logo utama (kiri), logo dinas/mitra (kanan), serta legalitas akreditasi dan kontak resmi sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTestPrint}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Cetak contoh surat untuk melihat hasil cetak di kertas"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Uji Coba Cetak</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Kembalikan logo dan kop ke format bawaan"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Bawaan</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* LIVE INTERACTIVE KOP SURAT PREVIEW */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Pratinjau Langsung Kop Surat (Real-Time Live Preview)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
            Tampilan persis seperti pada berkas cetak dan PDF
          </span>
        </div>

        {/* Paper Sheet Preview Container */}
        <div
          className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-inner border border-slate-200 select-none transition-all"
          style={previewFontFamilyStyle}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Left Logo (Logo Utama) */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className={`${previewSizeClass} flex items-center justify-center`}>
                <img
                  src={logoUrl || DEFAULT_PRIMARY_LOGO}
                  alt="Logo Utama"
                  className={`w-full h-full ${previewShapeClass}`}
                />
              </div>
            </div>

            {/* Center Information Text */}
            <div className="flex-1 text-center px-2">
              {showFoundationName && foundationName && (
                <p className={`${previewFoundationClass} font-bold text-slate-800 tracking-wider uppercase leading-tight mb-0.5`}>
                  {foundationName}
                </p>
              )}

              <h1 className={`${previewSchoolNameClass} font-black ${previewColorClass} tracking-tight leading-tight uppercase transition-colors`}>
                {name || 'SMP ALFA ALI MASYKUR'}
              </h1>

              <p className={`${previewSubHeaderClass} text-slate-700 font-bold mt-0.5 leading-snug`}>
                {subHeader ||
                  `NPSN: ${npsn || '20307890'} • STATUS: TERAKREDITASI "A" (UNGGUL) • NSS: 202030709001`}
              </p>

              <p className={`${previewContactsClass} text-slate-600 mt-0.5 leading-snug`}>
                {address || 'Jl. Dieng Km. 05 Bumirejo, Wonosobo, Jawa Tengah 56351'}
                {phone ? ` • Telp/WA: ${phone}` : ''}
                {email ? ` • Email: ${email}` : ''}
                {website ? ` • Web: ${website}` : ''}
              </p>
            </div>

            {/* Right Logo (Logo Sekunder / Tut Wuri Handayani) */}
            {showSecondaryLogo ? (
              <div className="relative shrink-0 flex items-center justify-center">
                <div className={`${previewSizeClass} flex items-center justify-center`}>
                  <img
                    src={secondaryLogoUrl || DEFAULT_SECONDARY_LOGO}
                    alt="Logo Sekunder"
                    className={`w-full h-full ${previewShapeClass}`}
                  />
                </div>
              </div>
            ) : (
              <div className={`${previewSizeClass} shrink-0 hidden sm:block opacity-0 pointer-events-none`} />
            )}
          </div>

          {/* Official Indonesian Double Line Border */}
          <div className="mt-3.5 border-b-2 border-slate-900" />
          <div className="mt-0.5 border-b border-slate-900" />

          {/* Watermark Sample Note */}
          <div className="mt-3 text-center flex flex-wrap items-center justify-center gap-2">
            <span className="text-[9.5px] text-slate-400 italic">
              [Area Konten Dokumen / Lembar Penilaian Santri / Surat Resmi dimulai di sini]
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase font-mono">
              Font: {fontFamily} • Skala: {fontScale}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('identitas_kop')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'identitas_kop'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Nama Yayasan & Teks Kop Surat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('font_tipografi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'font_tipografi'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Type className="w-4 h-4 text-amber-300" />
          <span>2. Font & Tipografi Kop</span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950">
            BARU
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logo_utama')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'logo_utama'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Image className="w-4 h-4 text-amber-300" />
          <span>3. Logo Utama Sekolah (Kiri)</span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-400 text-emerald-950">
            UTAMA
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logo_sekunder')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'logo_sekunder'
              ? 'bg-emerald-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. Logo Sekunder / Dinas (Kanan)</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              showSecondaryLogo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {showSecondaryLogo ? 'Aktif' : 'Mati'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: IDENTITAS YAYASAN & TEKS KOP SURAT                                 */}
      {/* ========================================================================= */}
      {activeTab === 'identitas_kop' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Identitas Yayasan & Satuan Pendidikan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola penamaan yayasan penaung, nama sekolah, sub-header legalitas dinas, serta kontak resmi.
            </p>
          </div>

          <form onSubmit={handleSaveAll} className="space-y-4 text-xs">
            {/* 1. NAMA YAYASAN (FOCAL POINT USER REQUEST) */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-emerald-950 text-xs flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  <span>Nama Yayasan / Badan Penyelenggara (Baris Pertama Kop Surat)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFoundationName}
                    onChange={(e) => setShowFoundationName(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-emerald-300"
                  />
                  <span>Tampilkan di Kop Surat</span>
                </label>
              </div>

              <input
                type="text"
                id="input-foundation-name"
                value={foundationName}
                onChange={(e) => setFoundationName(e.target.value)}
                placeholder="Contoh: YAYASAN PONDOK PESANTREN ALFA ALI MASYKUR"
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl font-bold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

              <p className="text-[11px] text-emerald-800 leading-relaxed flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Nama yayasan akan dicetak dengan huruf kapital pada baris pertama di atas nama sekolah pada seluruh kop dokumen, sertifikat, dan laporan capaian target pembelajaran.
                </span>
              </p>
            </div>

            {/* 2. NAMA SEKOLAH & NPSN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">
                  Nama Satuan Pendidikan (Huruf Besar Utama)
                </label>
                <input
                  type="text"
                  id="input-school-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="SMP ALFA ALI MASYKUR"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">NPSN</label>
                <input
                  type="text"
                  id="input-school-npsn"
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  placeholder="20307890"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. SUB-HEADER LEGALITAS & AKREDITASI */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Sub-Header Legalitas (Akreditasi, NSS, Izin Operasional)
              </label>
              <input
                type="text"
                id="input-school-subheader"
                value={subHeader}
                onChange={(e) => setSubHeader(e.target.value)}
                placeholder='NPSN: 20307890 • STATUS: TERAKREDITASI "A" (UNGGUL) • NSS: 202030709001'
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Dicetak pada baris ketiga tepat di bawah nama sekolah.
              </p>
            </div>

            {/* 4. ALAMAT LENGKAP SEKOLAH */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap Satuan Pendidikan</label>
              <input
                type="text"
                id="input-school-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Dieng Km. 05 Bumirejo, Kecamatan Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* 5. KONTAK & WEBSITE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">No. Telepon / WhatsApp</label>
                <input
                  type="text"
                  id="input-school-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(0286) 321890"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Resmi Sekolah</label>
                <input
                  type="email"
                  id="input-school-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="smpalfaalimasykur@gmail.com"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Website Resmi</label>
                <input
                  type="text"
                  id="input-school-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="www.smpalfaalimasykur.sch.id"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 6. KEPALA SEKOLAH & TAHUN AJARAN */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kepala Sekolah (Nama & Gelar)</label>
                <input
                  type="text"
                  id="input-school-headmaster"
                  value={headmaster}
                  onChange={(e) => setHeadmaster(e.target.value)}
                  placeholder="Afif Mashadi, S.S."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  id="input-school-headmaster-nip"
                  value={headmasterNip}
                  onChange={(e) => setHeadmasterNip(e.target.value)}
                  placeholder="19780512 200501 1 007"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tahun Pelajaran</label>
                <input
                  type="text"
                  id="input-school-academic-year"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026/2027"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Semester Aktif</label>
                <select
                  id="input-school-semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as 'Ganjil' | 'Genap')}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>

            {/* Save Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md transition-all cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Identitas & Teks Kop</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENGATURAN FONT & TIPOGRAFI KOP SURAT                              */}
      {/* ========================================================================= */}
      {activeTab === 'font_tipografi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Type className="w-5 h-5 text-emerald-700" />
                  <span>Pengaturan Gaya Huruf (Font), Proporsi Ukuran, & Warna Kop Surat</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan jenis font tata naskah dinas, skala proporsi keterbacaan cetak, dan warna aksen nama lembaga.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                  Font Terpilih:{' '}
                  <span className="text-emerald-700 uppercase font-extrabold">
                    {FONT_OPTIONS.find((f) => f.id === fontFamily)?.name}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 1. SELEKSI JENIS FONT KEDINASAN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>1. Pilihan Jenis Font Resmi (Typography Family)</span>
                </label>
                <p className="text-xs text-slate-500">
                  Font ini akan otomatis diterapkan ke seluruh dokumen resmi (Kop Surat, PDF Rapor Santri, & Lembar Nilai Target).
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                5 Standar Kedinasan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FONT_OPTIONS.map((font) => {
                const isSelected = fontFamily === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-xs'
                    }`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {font.badge}
                        </span>

                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>

                      {/* Font Name in its own style */}
                      <h4
                        className="text-lg font-bold text-slate-900 mb-0.5"
                        style={{ fontFamily: font.fontFamilyCss }}
                      >
                        {font.name}
                      </h4>
                      <p className="text-[11px] font-medium text-emerald-800 mb-2">
                        {font.category}
                      </p>

                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {font.description}
                      </p>
                    </div>

                    {/* Mini typography preview specimen */}
                    <div
                      className="mt-auto p-3 rounded-xl bg-white border border-slate-200/80 shadow-inner"
                      style={{ fontFamily: font.fontFamilyCss }}
                    >
                      <div className="text-[10px] font-bold text-slate-800 uppercase truncate">
                        YAYASAN PONDOK PESANTREN ALFA ALI MASYKUR
                      </div>
                      <div className="text-xs font-black text-emerald-950 uppercase truncate mt-0.5">
                        SMP ALFA ALI MASYKUR WONOSOBO
                      </div>
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">
                        STATUS: TERAKREDITASI &bull; NPSN: 20307890
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. PENGATURAN SKALA UKURAN & PROPORSI */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>2. Skala Ukuran Teks (Font Scale Multiplier)</span>
              </label>
              <p className="text-xs text-slate-500">
                Atur kerapatan teks kop surat agar seimbang dengan logo dan tidak menghabiskan ruang halaman surat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FONT_SCALE_OPTIONS.map((scaleOpt) => {
                const isSelected = fontScale === scaleOpt.id;
                return (
                  <div
                    key={scaleOpt.id}
                    onClick={() => setFontScale(scaleOpt.id)}
                    className={`rounded-2xl p-4 border-2 transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        {scaleOpt.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {scaleOpt.badge}
                    </span>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {scaleOpt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. TEMA WARNA NAMA LEMBAGA */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-700" />
                <span>3. Tema Warna Teks Nama Sekolah (Institusi Utama)</span>
              </label>
              <p className="text-xs text-slate-500">
                Pilih aksen warna resmi untuk nama SMP ALFA ALI MASYKUR pada bagian kop dan garis batas kedinasan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COLOR_THEMES.map((theme) => {
                const isSelected = headerColorTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setHeaderColorTheme(theme.id)}
                    className={`rounded-2xl p-4 border-2 transition-all cursor-pointer text-left flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl ${theme.bgChip} border border-white shadow-xs shrink-0 flex items-center justify-center text-white`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-slate-900 mb-0.5">
                        {theme.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {theme.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions & Save */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestPrint}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>Uji Coba Cetak Font Terpilih</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFontFamily('arial');
                  setFontScale('md');
                  setHeaderColorTheme('emerald');
                  showToast('Font Direset', 'Font dan ukuran kop dikembalikan ke pengaturan awal.', 'info');
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Font</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md transition-all cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Font & Tipografi</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOGO UTAMA SEKOLAH (KIRI)                                          */}
      {/* ========================================================================= */}
      {activeTab === 'logo_utama' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Image className="w-5 h-5 text-emerald-700" />
              <span>Penambahan & Penggantian Logo Utama Sekolah / Yayasan (Sisi Kiri)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih dari galeri lambang resmi, unggah berkas gambar logo Anda sendiri, atau masukkan tautan URL gambar.
            </p>
          </div>

          {/* Current Logo & Format Styling Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Visual Box of Current Primary Logo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-2xl border-2 border-emerald-200 flex items-center justify-center p-2 shadow-xs shrink-0">
                <img
                  src={logoUrl || DEFAULT_PRIMARY_LOGO}
                  alt="Logo Utama Aktif"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Logo Utama Aktif
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1">Lambang Sisi Kiri Kop</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Ditampilkan pada dokumen resmi, kartu santri, dan laporan Dapodik.
                </p>
              </div>
            </div>

            {/* Logo Size Control */}
            <div>
              <label className="font-bold text-slate-800 text-xs block mb-1.5">
                Ukuran Tampilan Logo
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sm' as const, label: 'Kecil', desc: '64px' },
                  { id: 'md' as const, label: 'Sedang', desc: '80px' },
                  { id: 'lg' as const, label: 'Besar', desc: '96px' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setLogoSize(s.id)}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      logoSize === s.id
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.label}</div>
                    <div className="text-[9.5px] opacity-80">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Shape Framing */}
            <div>
              <label className="font-bold text-slate-800 text-xs block mb-1.5">
                Bentuk Bingkai Logo
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'square' as const, label: 'Asli / Polos' },
                  { id: 'rounded' as const, label: 'Membulat' },
                  { id: 'circle' as const, label: 'Lingkaran' },
                ].map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    onClick={() => setLogoShape(sh.id)}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      logoShape === sh.id
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 text-xs'
                    }`}
                  >
                    <div className="text-xs font-bold">{sh.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* METHOD 1: UPLOAD BERKAS SENDIRI (DRAG & DROP) */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Opsi 1: Unggah Berkas Gambar Logo dari Perangkat (PNG / JPG / SVG / WebP)</span>
            </h4>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPrimary(true);
              }}
              onDragLeave={() => setIsDraggingPrimary(false)}
              onDrop={handleDropPrimary}
              onClick={() => fileInputPrimaryRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDraggingPrimary
                  ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30'
              }`}
            >
              <input
                ref={fileInputPrimaryRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    processImageFile(e.target.files[0], 'primary');
                  }
                }}
              />
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-2 shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Tarik & letakkan berkas logo ke sini, atau <span className="text-emerald-700 underline">klik untuk memilih berkas</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Format didukung: PNG transparan, JPG, SVG vektor, atau WebP (Maksimal 5 MB).
              </p>
            </div>
          </div>

          {/* METHOD 2: PILIH DARI GALERI PRESET RESMI */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Opsi 2: Pilih dari Galeri Lambang & Logo Resmi Bawaan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {LETTERHEAD_LOGO_PRESETS.map((preset) => {
                const isSelected = logoUrl === preset.dataUrl;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setLogoUrl(preset.dataUrl);
                      showToast('Preset Diterapkan', `Logo diubah ke ${preset.name}.`, 'success');
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-600/30'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                        {isSelected && (
                          <span className="p-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* METHOD 3: INPUT URL / TAUTAN LOGO */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-700" />
              <span>Opsi 3: Masukkan Tautan / URL Gambar Online</span>
            </h4>

            <div className="flex gap-2">
              <input
                type="url"
                value={customPrimaryUrl}
                onChange={(e) => setCustomPrimaryUrl(e.target.value)}
                placeholder="https://contoh-domain.sch.id/assets/logo.png"
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPrimaryUrl}
                disabled={!customPrimaryUrl.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Terapkan URL
              </button>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md transition-all cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Logo Utama</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOGO SEKUNDER / DINAS (KANAN)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'logo_sekunder' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <span>Pengaturan Logo Sekunder / Kementerian / Mitra (Sisi Kanan)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tambahkan logo Tut Wuri Handayani, Kementerian Agama, atau logo yayasan pada sisi kanan kop dinas.
              </p>
            </div>

            {/* Toggle Switch */}
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSecondaryLogo}
                onChange={(e) => setShowSecondaryLogo(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-800">
                Tampilkan Logo Sisi Kanan
              </span>
            </label>
          </div>

          {showSecondaryLogo ? (
            <>
              {/* Current Secondary Logo Visual */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl border-2 border-emerald-200 flex items-center justify-center p-2 shadow-xs shrink-0">
                  <img
                    src={secondaryLogoUrl || DEFAULT_SECONDARY_LOGO}
                    alt="Logo Kanan Aktif"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Logo Sisi Kanan Aktif
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    Ditampilkan di sisi kanan atas kop surat berhadapan dengan logo utama sekolah.
                  </p>
                </div>
              </div>

              {/* Upload Secondary Logo */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Unggah Berkas Gambar Logo Kanan</span>
                </h4>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingSecondary(true);
                  }}
                  onDragLeave={() => setIsDraggingSecondary(false)}
                  onDrop={handleDropSecondary}
                  onClick={() => fileInputSecondaryRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDraggingSecondary
                      ? 'border-emerald-500 bg-emerald-50/80 scale-[1.01]'
                      : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30'
                  }`}
                >
                  <input
                    ref={fileInputSecondaryRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(e.target.files[0], 'secondary');
                      }
                    }}
                  />
                  <Upload className="w-6 h-6 text-emerald-700 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800">
                    Klik untuk memilih berkas logo sisi kanan
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Mendukung PNG transparan, JPG, SVG, WebP (Maksimal 5 MB)
                  </p>
                </div>
              </div>

              {/* Presets for Secondary Logo */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Pilih dari Preset Lambang Kedinasan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LETTERHEAD_LOGO_PRESETS.map((preset) => {
                    const isSelected = secondaryLogoUrl === preset.dataUrl;
                    return (
                      <div
                        key={`sec-${preset.id}`}
                        onClick={() => {
                          setSecondaryLogoUrl(preset.dataUrl);
                          showToast('Logo Kanan Diperbarui', `Logo kanan diubah ke ${preset.name}.`, 'success');
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0">
                          <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{preset.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{preset.description}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* URL Input */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="url"
                  value={customSecondaryUrl}
                  onChange={(e) => setCustomSecondaryUrl(e.target.value)}
                  placeholder="https://contoh-domain.sch.id/logo-tut-wuri.png"
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplySecondaryUrl}
                  disabled={!customSecondaryUrl.trim()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Terapkan URL
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Logo Sisi Kanan Dinonaktifkan</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Kop surat saat ini hanya menampilkan logo utama di sisi kiri. Centang tombol &quot;Tampilkan Logo Sisi Kanan&quot; di atas jika ingin menampilkan lambang Tut Wuri Handayani, Kemenag, atau logo yayasan.
              </p>
              <button
                type="button"
                onClick={() => setShowSecondaryLogo(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
              >
                Aktifkan Logo Sisi Kanan
              </button>
            </div>
          )}

          {/* Save Action */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md transition-all cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Logo Kanan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
