import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LETTERHEAD_LOGO_PRESETS,
  DEFAULT_PRIMARY_LOGO,
  DEFAULT_SECONDARY_LOGO,
} from '../../data/letterheadPresets';
import {
  X,
  Upload,
  Image,
  Check,
  RotateCcw,
  Sliders,
  Building,
  Eye,
  CheckCircle2,
  Sparkles,
  Link,
  Layers,
} from 'lucide-react';
import { SchoolInfo } from '../../types';

interface LetterheadSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetterheadSettingsModal: React.FC<LetterheadSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { schoolInfo, updateSchoolInfo, showToast } = useApp();

  // Local state for letterhead editing
  const [activeTab, setActiveTab] = useState<'logo_primary' | 'logo_secondary' | 'styling_text'>('logo_primary');

  // Primary logo (Kiri)
  const [logoUrl, setLogoUrl] = useState(schoolInfo.logoUrl || DEFAULT_PRIMARY_LOGO);
  // Secondary logo (Kanan)
  const [secondaryLogoUrl, setSecondaryLogoUrl] = useState(
    schoolInfo.secondaryLogoUrl || DEFAULT_SECONDARY_LOGO
  );
  const [showSecondaryLogo, setShowSecondaryLogo] = useState(
    schoolInfo.showSecondaryLogo !== false
  );

  // Logo sizing & styling
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg'>(schoolInfo.logoSize || 'md');
  const [logoShape, setLogoShape] = useState<'original' | 'circle' | 'rounded'>(
    schoolInfo.logoShape || 'original'
  );

  // Text contents
  const [foundationName, setFoundationName] = useState(
    schoolInfo.foundationName || 'YAYASAN PENDIDIKAN ALFA ALI MASYKUR'
  );
  const [name, setName] = useState(schoolInfo.name || 'SMP ALFA ALI MASYKUR');
  const [subHeader, setSubHeader] = useState(
    schoolInfo.subHeader ||
      `NPSN: ${schoolInfo.npsn || '20512345'} • Terakreditasi A (Unggul) • NSS: 202051405001`
  );
  const [address, setAddress] = useState(
    schoolInfo.address || 'Jl. Raya Pesantren No. 45, Pasuruan, Jawa Timur'
  );
  const [phone, setPhone] = useState(schoolInfo.phone || '(031) 876-5432');
  const [email, setEmail] = useState(schoolInfo.email || 'info@smpalfaalimasykur.sch.id');
  const [website, setWebsite] = useState(schoolInfo.website || 'www.smpalfaalimasykur.sch.id');

  // Input states
  const [customPrimaryUrl, setCustomPrimaryUrl] = useState('');
  const [customSecondaryUrl, setCustomSecondaryUrl] = useState('');
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);

  const fileInputPrimaryRef = useRef<HTMLInputElement>(null);
  const fileInputSecondaryRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process file upload into base64 Data URL
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
          showToast('Logo Kiri Diperbarui', 'Logo berhasil diunggah dan siap digunakan pada kop surat.', 'success');
        } else {
          setSecondaryLogoUrl(result);
          showToast('Logo Kanan Diperbarui', 'Logo sekunder berhasil diunggah.', 'success');
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

  // Save changes to context & localStorage
  const handleSave = () => {
    updateSchoolInfo({
      logoUrl,
      secondaryLogoUrl,
      showSecondaryLogo,
      logoSize,
      logoShape,
      foundationName,
      name,
      subHeader,
      address,
      phone,
      email,
      website,
    });
    showToast(
      'Kop Surat & Logo Disimpan',
      'Pengaturan logo dan identitas resmi kop surat berhasil diperbarui di seluruh dokumen!',
      'success'
    );
    onClose();
  };

  // Reset to default
  const handleResetToDefault = () => {
    setLogoUrl(DEFAULT_PRIMARY_LOGO);
    setSecondaryLogoUrl(DEFAULT_SECONDARY_LOGO);
    setShowSecondaryLogo(true);
    setLogoSize('md');
    setLogoShape('original');
    setFoundationName('YAYASAN PENDIDIKAN ALFA ALI MASYKUR');
    setName('SMP ALFA ALI MASYKUR');
    setSubHeader('NPSN: 20512345 • Terakreditasi A (Unggul) • NSS: 202051405001');
    setAddress('Jl. Raya Pesantren No. 45, Pasuruan, Jawa Timur');
    setPhone('(031) 876-5432');
    setEmail('info@smpalfaalimasykur.sch.id');
    setWebsite('www.smpalfaalimasykur.sch.id');
    showToast('Logo Direset', 'Logo dan kop surat dikembalikan ke bawaan SMP Alfa Ali Masykur.', 'info');
  };

  // Logo size preview calculation
  const sizeClass =
    logoSize === 'sm'
      ? 'w-16 h-16'
      : logoSize === 'lg'
      ? 'w-24 h-24'
      : 'w-20 h-20';

  const shapeClass =
    logoShape === 'circle'
      ? 'rounded-full object-cover p-1 bg-white border border-slate-200'
      : logoShape === 'rounded'
      ? 'rounded-2xl object-cover p-1 bg-white border border-slate-200'
      : 'object-contain';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Pengaturan Kop Surat & Logo Sekolah
              </h3>
              <p className="text-xs text-blue-200">
                Ganti logo sekolah, unggah berkas sendiri, atur logo dinas, dan sesuaikan teks kop resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-blue-600" /> Pratinjau Kop Surat Langsung
            </span>
            <span className="text-[10px] text-slate-500 italic">
              Akan tampil persis seperti ini pada lembar cetak & PDF
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-inner">
            <div className="flex items-center justify-between gap-3 text-center">
              {/* Primary Preview */}
              <div className={`${sizeClass} shrink-0 flex items-center justify-center`}>
                <img
                  src={logoUrl}
                  alt="Logo Utama"
                  className={`w-full h-full ${shapeClass}`}
                />
              </div>

              {/* Center Text Preview */}
              <div className="flex-1 px-2">
                {foundationName && (
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-wider uppercase leading-tight">
                    {foundationName}
                  </p>
                )}
                <h4 className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-tight uppercase mt-0.5">
                  {name}
                </h4>
                <p className="text-[9px] sm:text-[10px] text-slate-800 font-semibold mt-0.5 leading-tight">
                  {subHeader}
                </p>
                <p className="text-[8.5px] sm:text-[9px] text-slate-600 mt-0.5 leading-tight">
                  {address}
                  {phone ? ` • Telp: ${phone}` : ''}
                  {email ? ` • Email: ${email}` : ''}
                </p>
              </div>

              {/* Secondary Preview */}
              {showSecondaryLogo ? (
                <div className={`${sizeClass} shrink-0 flex items-center justify-center`}>
                  <img
                    src={secondaryLogoUrl}
                    alt="Logo Sekunder"
                    className={`w-full h-full ${shapeClass}`}
                  />
                </div>
              ) : (
                <div className={`${sizeClass} shrink-0 opacity-0 pointer-events-none hidden sm:block`} />
              )}
            </div>

            {/* Double Border Line */}
            <div className="mt-2.5 border-b-2 border-slate-900" />
            <div className="mt-0.5 border-b border-slate-900" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('logo_primary')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logo_primary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Logo Kiri (Utama)</span>
          </button>
          <button
            onClick={() => setActiveTab('logo_secondary')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logo_secondary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Logo Kanan (Sekunder)</span>
          </button>
          <button
            onClick={() => setActiveTab('styling_text')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'styling_text'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Format & Teks Kop</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {/* TAB 1: LOGO UTAMA (KIRI) */}
          {activeTab === 'logo_primary' && (
            <div className="space-y-5">
              {/* Option A: Upload File */}
              <div>
                <label className="font-bold text-slate-900 text-xs block mb-1.5">
                  1. Unggah Berkas Logo Sekolah (PNG / JPG / SVG / WebP)
                </label>
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
                      ? 'border-blue-600 bg-blue-50/70 scale-[1.01]'
                      : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/60'
                  }`}
                >
                  <input
                    ref={fileInputPrimaryRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(e.target.files[0], 'primary');
                      }
                    }}
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-800 text-xs sm:text-sm">
                    Tarik dan lepaskan gambar logo di sini, atau{' '}
                    <span className="text-blue-600 underline">klik untuk memilih berkas</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Mendukung PNG transparan, JPG, WebP, atau SVG (Maks. 5 MB)
                  </p>
                </div>
              </div>

              {/* Option B: Preset Selection */}
              <div>
                <label className="font-bold text-slate-900 text-xs block mb-1.5">
                  2. Atau Pilih Logo Lambang Bawaan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {LETTERHEAD_LOGO_PRESETS.map((preset) => {
                    const isSelected = logoUrl === preset.dataUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setLogoUrl(preset.dataUrl);
                          showToast('Logo Dipilih', `Menggunakan ${preset.name}`, 'info');
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-12 h-12 shrink-0 p-1 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                          <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs truncate">
                              {preset.name}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                          </div>
                          <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option C: Image URL */}
              <div>
                <label className="font-bold text-slate-900 text-xs block mb-1.5">
                  3. Atau Tempel URL Tautan Gambar Eksternal
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="https://domain-sekolah.sch.id/logo.png"
                      value={customPrimaryUrl}
                      onChange={(e) => setCustomPrimaryUrl(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                    />
                    <Link className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (customPrimaryUrl.trim()) {
                        setLogoUrl(customPrimaryUrl.trim());
                        showToast('Logo URL Diterapkan', 'Gambar dari URL berhasil diterapkan.', 'success');
                      }
                    }}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO SEKUNDER (KANAN) */}
          {activeTab === 'logo_secondary' && (
            <div className="space-y-5">
              {/* Toggle Show Secondary */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-xs">
                    Tampilkan Logo Sisi Kanan pada Kop Surat
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Biasanya digunakan untuk logo Tut Wuri Handayani, Kemenag, atau lambang Pemkab.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSecondaryLogo}
                    onChange={(e) => setShowSecondaryLogo(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {showSecondaryLogo && (
                <>
                  {/* Upload Secondary */}
                  <div>
                    <label className="font-bold text-slate-900 text-xs block mb-1.5">
                      Unggah Berkas Logo Kanan
                    </label>
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
                          ? 'border-blue-600 bg-blue-50/70'
                          : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/60'
                      }`}
                    >
                      <input
                        ref={fileInputSecondaryRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processImageFile(e.target.files[0], 'secondary');
                          }
                        }}
                      />
                      <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-800 text-xs">
                        Tarik dan lepaskan gambar logo kanan di sini, atau{' '}
                        <span className="text-blue-600 underline">klik untuk memilih</span>
                      </p>
                    </div>
                  </div>

                  {/* Preset Secondary */}
                  <div>
                    <label className="font-bold text-slate-900 text-xs block mb-1.5">
                      Atau Pilih Preset Logo Kanan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {LETTERHEAD_LOGO_PRESETS.map((preset) => {
                        const isSelected = secondaryLogoUrl === preset.dataUrl;
                        return (
                          <button
                            key={`sec-${preset.id}`}
                            type="button"
                            onClick={() => {
                              setSecondaryLogoUrl(preset.dataUrl);
                              showToast('Logo Kanan Dipilih', `Menggunakan ${preset.name}`, 'info');
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="w-10 h-10 shrink-0 p-1 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                              <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 text-xs truncate">
                                  {preset.name}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                {preset.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: FORMAT & TEKS KOP SURAT */}
          {activeTab === 'styling_text' && (
            <div className="space-y-4">
              {/* Logo Sizing & Shape Styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Ukuran Tampilan Logo
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'sm' as const, label: 'Kecil (64px)' },
                      { id: 'md' as const, label: 'Sedang (80px)' },
                      { id: 'lg' as const, label: 'Besar (96px)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setLogoSize(s.id)}
                        className={`p-1.5 rounded-lg border text-center text-[11px] font-semibold cursor-pointer ${
                          logoSize === s.id
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 text-xs block mb-1">
                    Bentuk Bingkai Logo
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'original' as const, label: 'Asli / Polos' },
                      { id: 'circle' as const, label: 'Lingkaran' },
                      { id: 'rounded' as const, label: 'Membulat' },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setLogoShape(sh.id)}
                        className={`p-1.5 rounded-lg border text-center text-[11px] font-semibold cursor-pointer ${
                          logoShape === sh.id
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 1: Nama Yayasan / Instansi Induk (Huruf Kapital)
                  </label>
                  <input
                    type="text"
                    value={foundationName}
                    onChange={(e) => setFoundationName(e.target.value)}
                    placeholder="YAYASAN PENDIDIKAN ALFA ALI MASYKUR"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 2: Nama Satuan Pendidikan (Huruf Besar Utama)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="SMP ALFA ALI MASYKUR"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 3: Legalitas & Sub-Identitas
                  </label>
                  <input
                    type="text"
                    value={subHeader}
                    onChange={(e) => setSubHeader(e.target.value)}
                    placeholder="NPSN: 20512345 • Terakreditasi A (Unggul) • NSS: 202051405001"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Baris 4: Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Raya Pesantren No. 45, Pasuruan, Jawa Timur"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Telepon</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(031) 876-5432"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="info@smpalfaalimasykur.sch.id"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="www.smpalfaalimasykur.sch.id"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pulihkan Logo Bawaan</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Terapkan Kop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
