import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_PRIMARY_LOGO, DEFAULT_SECONDARY_LOGO } from '../../data/letterheadPresets';
import { Image, SlidersHorizontal, Upload } from 'lucide-react';

interface OfficialLetterheadProps {
  onOpenSettings?: () => void;
  readOnly?: boolean;
}

export const OfficialLetterhead: React.FC<OfficialLetterheadProps> = ({
  onOpenSettings,
  readOnly = false,
}) => {
  const { schoolInfo } = useApp();

  const primaryLogo = schoolInfo.logoUrl || DEFAULT_PRIMARY_LOGO;
  const secondaryLogo = schoolInfo.secondaryLogoUrl || DEFAULT_SECONDARY_LOGO;
  const showSecondary = schoolInfo.showSecondaryLogo !== false;

  const sizeClass =
    schoolInfo.logoSize === 'sm'
      ? 'w-16 h-16 max-h-16'
      : schoolInfo.logoSize === 'lg'
      ? 'w-24 h-24 max-h-24'
      : 'w-20 h-20 max-h-20';

  const shapeClass =
    schoolInfo.logoShape === 'circle'
      ? 'rounded-full object-cover p-1 bg-white border border-slate-200'
      : schoolInfo.logoShape === 'rounded'
      ? 'rounded-2xl object-cover p-1 bg-white border border-slate-200'
      : 'object-contain';

  // Font family inline style mapping
  const fontFamilyStyle =
    schoolInfo.fontFamily === 'times'
      ? { fontFamily: '"Times New Roman", Times, Georgia, serif' }
      : schoolInfo.fontFamily === 'bookman'
      ? { fontFamily: '"Bookman Old Style", Bookman, Garamond, serif' }
      : schoolInfo.fontFamily === 'georgia'
      ? { fontFamily: 'Georgia, Cambria, serif' }
      : schoolInfo.fontFamily === 'calibri'
      ? { fontFamily: 'Calibri, Candara, Segoe, sans-serif' }
      : { fontFamily: 'Arial, Helvetica, "Nimbus Sans L", sans-serif' };

  // Color theme for main heading
  const titleColorClass =
    schoolInfo.headerColorTheme === 'black'
      ? 'text-slate-950'
      : schoolInfo.headerColorTheme === 'navy'
      ? 'text-blue-950'
      : 'text-emerald-950';

  // Font scale adjustments
  const scale = schoolInfo.fontScale || 'md';
  const foundationSizeClass =
    scale === 'sm' ? 'text-[10px] sm:text-[11px]' : scale === 'lg' ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs';
  const schoolNameSizeClass =
    scale === 'sm' ? 'text-base sm:text-xl' : scale === 'lg' ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl';
  const subHeaderSizeClass =
    scale === 'sm' ? 'text-[9px] sm:text-[10px]' : scale === 'lg' ? 'text-[11px] sm:text-xs' : 'text-[10px] sm:text-[11px]';
  const contactsSizeClass =
    scale === 'sm' ? 'text-[8.5px] sm:text-[9.5px]' : scale === 'lg' ? 'text-[10.5px] sm:text-[11.5px]' : 'text-[9.5px] sm:text-[10px]';

  return (
    <div className="relative pb-3 text-center select-none group" style={fontFamilyStyle}>
      {/* Quick Edit Overlay Button on Screen (hidden during print) */}
      {!readOnly && onOpenSettings && (
        <div className="no-print absolute -top-3 -right-3 z-10 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={onOpenSettings}
            type="button"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-md cursor-pointer transition-all active:scale-95"
            title="Klik untuk mengganti logo atau mengedit kop surat"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Pengaturan Kop & Logo</span>
          </button>
        </div>
      )}

      {/* Main Kop Content */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Logo (Logo Utama) */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div
            onClick={!readOnly && onOpenSettings ? onOpenSettings : undefined}
            className={`${sizeClass} flex items-center justify-center ${
              !readOnly && onOpenSettings ? 'cursor-pointer hover:ring-2 hover:ring-blue-500/40 rounded-xl transition-all' : ''
            }`}
            title={!readOnly && onOpenSettings ? 'Klik untuk mengganti logo' : undefined}
          >
            <img
              src={primaryLogo}
              alt="Logo Resmi Satuan Pendidikan"
              className={`w-full h-full ${shapeClass}`}
            />
          </div>
          {!readOnly && onOpenSettings && (
            <span className="no-print absolute -bottom-2 -left-1 hidden group-hover:flex items-center gap-1 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow">
              <Upload className="w-2.5 h-2.5" /> Ganti Logo
            </span>
          )}
        </div>

        {/* Center Kop Information Text */}
        <div className="flex-1 text-center px-1">
          {schoolInfo.showFoundationName !== false && (
            <p className={`${foundationSizeClass} font-bold text-slate-800 tracking-wider uppercase leading-tight`}>
              {schoolInfo.foundationName || 'YAYASAN PONDOK PESANTREN ALFA ALI MASYKUR'}
            </p>
          )}

          <h1 className={`${schoolNameSizeClass} font-black ${titleColorClass} tracking-tight leading-tight uppercase mt-0.5`}>
            {schoolInfo.name || 'SMP ALFA ALI MASYKUR'}
          </h1>

          <p className={`${subHeaderSizeClass} text-slate-800 font-semibold mt-0.5 leading-snug`}>
            {schoolInfo.subHeader ||
              `NPSN: ${schoolInfo.npsn || '20512345'} • Terakreditasi A (Unggul) • NSS: 202051405001`}
          </p>

          <p className={`${contactsSizeClass} text-slate-600 mt-0.5 leading-snug`}>
            {schoolInfo.address}
            {schoolInfo.phone ? ` • Telp: ${schoolInfo.phone}` : ''}
            {schoolInfo.email ? ` • Email: ${schoolInfo.email}` : ''}
            {schoolInfo.website ? ` • Web: ${schoolInfo.website}` : ''}
          </p>
        </div>

        {/* Right Logo (Logo Sekunder / Tut Wuri Handayani / Kemenag) */}
        {showSecondary ? (
          <div className="relative shrink-0 flex items-center justify-center">
            <div
              onClick={!readOnly && onOpenSettings ? onOpenSettings : undefined}
              className={`${sizeClass} flex items-center justify-center ${
                !readOnly && onOpenSettings ? 'cursor-pointer hover:ring-2 hover:ring-blue-500/40 rounded-xl transition-all' : ''
              }`}
              title={!readOnly && onOpenSettings ? 'Klik untuk mengganti logo kanan' : undefined}
            >
              <img
                src={secondaryLogo}
                alt="Logo Sekunder / Tut Wuri Handayani"
                className={`w-full h-full ${shapeClass}`}
              />
            </div>
          </div>
        ) : (
          <div className={`${sizeClass} shrink-0 hidden sm:block opacity-0 pointer-events-none`} />
        )}
      </div>

      {/* Official Indonesian Double Line Border (Garis Ganda Kop Dinas) */}
      <div className="mt-3 border-b-2 border-slate-950" />
      <div className="mt-0.5 border-b border-slate-950" />
    </div>
  );
};
