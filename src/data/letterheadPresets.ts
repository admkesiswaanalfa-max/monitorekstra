// Preset SVG logos for Indonesian school letterheads (Kop Surat)
// All SVG strings are encoded as clean Data URIs for reliable offline display & printing

export interface LogoPreset {
  id: string;
  name: string;
  category: 'yayasan' | 'kemendikbud' | 'kemenag' | 'prestasi';
  description: string;
  dataUrl: string;
}

// 1. Alfa Ali Masykur Emblem - Islamic Green & Gold Crest with Star & Book
const SVG_ALFA_MASYKUR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <circle cx="80" cy="80" r="74" fill="%23064e3b" stroke="%23f59e0b" stroke-width="4"/>
  <circle cx="80" cy="80" r="66" fill="none" stroke="%23ffffff" stroke-width="1.5" stroke-dasharray="3,3"/>
  <polygon points="80,18 97,55 138,55 105,80 118,120 80,96 42,120 55,80 22,55 63,55" fill="%23f59e0b" opacity="0.3"/>
  <!-- Islamic Dome / Arch -->
  <path d="M50,110 L50,85 C50,60 80,45 80,45 C80,45 110,60 110,85 L110,110 Z" fill="%23047857" stroke="%23fbbf24" stroke-width="2"/>
  <!-- Open Book (Al-Quran / Education) -->
  <path d="M80,82 C72,76 60,78 54,84 L54,106 C60,100 72,98 80,104 C88,98 100,100 106,106 L106,84 C100,78 88,76 80,82 Z" fill="%23ffffff" stroke="%23d97706" stroke-width="2"/>
  <!-- Central Torch / Light -->
  <path d="M77,55 Q80,42 83,55 Q80,68 77,55 Z" fill="%23f59e0b"/>
  <!-- Stars -->
  <circle cx="80" cy="35" r="5" fill="%23fbbf24"/>
  <circle cx="60" cy="42" r="3.5" fill="%23fbbf24"/>
  <circle cx="100" cy="42" r="3.5" fill="%23fbbf24"/>
  <text x="80" y="132" font-size="10" font-family="sans-serif" font-weight="bold" fill="%23fef08a" text-anchor="middle" letter-spacing="1">SMP ALFA ALI MASYKUR</text>
  <text x="80" y="145" font-size="8" font-family="sans-serif" fill="%23a7f3d0" text-anchor="middle">PASURUAN</text>
</svg>`;

// 2. Tut Wuri Handayani (Official Kemendikbud emblem motif)
const SVG_TUT_WURI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <polygon points="80,10 148,50 148,110 80,150 12,110 12,50" fill="%230284c7" stroke="%23facc15" stroke-width="4"/>
  <polygon points="80,20 138,55 138,105 80,140 22,105 22,55" fill="%230369a1" stroke="%23ffffff" stroke-width="1.5"/>
  <!-- Belanga / Api Obor -->
  <path d="M60,105 C60,115 100,115 100,105 L96,95 L64,95 Z" fill="%23f59e0b" stroke="%23ffffff" stroke-width="1.5"/>
  <!-- Api Obor (Flame) -->
  <path d="M80,50 Q88,68 86,80 Q80,88 74,80 Q72,68 80,50 Z" fill="%23ef4444"/>
  <path d="M80,60 Q84,72 82,78 Q80,82 77,78 Q76,72 80,60 Z" fill="%23fde047"/>
  <!-- Sayap Sayap Burung -->
  <path d="M40,75 C52,70 65,76 72,85 C62,88 50,86 40,75 Z" fill="%23ffffff"/>
  <path d="M120,75 C108,70 95,76 88,85 C98,88 110,86 120,75 Z" fill="%23ffffff"/>
  <!-- Buku Terbuka -->
  <path d="M80,92 C70,88 58,90 52,95 L52,104 C58,100 70,98 80,102 C90,98 102,100 108,104 L108,95 C102,90 90,88 80,92 Z" fill="%23ffffff"/>
  <text x="80" y="132" font-size="9" font-family="sans-serif" font-weight="bold" fill="%23fde047" text-anchor="middle" letter-spacing="0.5">TUT WURI HANDAYANI</text>
</svg>`;

// 3. Kemenag RI Motif (Ikhlas Beramal)
const SVG_KEMENAG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <polygon points="80,12 145,50 145,110 80,148 15,110 15,50" fill="%2315803d" stroke="%23eab308" stroke-width="4"/>
  <circle cx="80" cy="80" r="48" fill="%23166534" stroke="%23ffffff" stroke-width="1.5"/>
  <!-- Bintang Sembilan / Bintang Keemasan -->
  <polygon points="80,45 83,55 93,55 85,62 88,72 80,66 72,72 75,62 67,55 77,55" fill="%23facc15"/>
  <!-- Timbangan Keadilan -->
  <line x1="60" y1="78" x2="100" y2="78" stroke="%23ffffff" stroke-width="2"/>
  <line x1="80" y1="70" x2="80" y2="95" stroke="%23ffffff" stroke-width="2.5"/>
  <polygon points="56,88 64,88 60,78" fill="%23facc15"/>
  <polygon points="96,88 104,88 100,78" fill="%23facc15"/>
  <!-- Kitab Suci -->
  <path d="M80,95 C74,92 64,94 58,98 L58,107 C64,103 74,102 80,105 C86,102 96,103 102,107 L102,98 C96,94 86,92 80,95 Z" fill="%23ffffff"/>
  <text x="80" y="126" font-size="8.5" font-family="sans-serif" font-weight="bold" fill="%23fde047" text-anchor="middle">IKHLAS BERAMAL</text>
  <text x="80" y="137" font-size="7" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">KEMENTERIAN AGAMA</text>
</svg>`;

// 4. Logo Perisai Prestasi & Obor Emas
const SVG_PRESTASI_SHIELD = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <!-- Perisai Emas Biru -->
  <path d="M80,14 C120,14 140,25 140,75 C140,115 95,142 80,150 C65,142 20,115 20,75 C20,25 40,14 80,14 Z" fill="%231e3a8a" stroke="%23d97706" stroke-width="4"/>
  <path d="M80,22 C115,22 132,32 132,75 C132,110 92,134 80,142 C68,134 28,110 28,75 C28,32 45,22 80,22 Z" fill="%23172554" stroke="%23ffffff" stroke-width="1.5"/>
  <!-- Pita Daun Laurel / Gandum -->
  <path d="M50,90 C45,70 52,50 62,40" fill="none" stroke="%23f59e0b" stroke-width="3" stroke-linecap="round"/>
  <path d="M110,90 C115,70 108,50 98,40" fill="none" stroke="%23f59e0b" stroke-width="3" stroke-linecap="round"/>
  <!-- Obor Pendidikan -->
  <path d="M80,45 C86,60 84,70 80,82 C76,70 74,60 80,45 Z" fill="%23f97316"/>
  <circle cx="80" cy="58" r="4" fill="%23fde047"/>
  <polygon points="73,82 87,82 83,105 77,105" fill="%23f59e0b"/>
  <!-- Bintang Prestasi 3 -->
  <circle cx="80" cy="32" r="4" fill="%23fde047"/>
  <circle cx="65" cy="35" r="3" fill="%23fde047"/>
  <circle cx="95" cy="35" r="3" fill="%23fde047"/>
  <text x="80" y="122" font-size="9" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle" letter-spacing="1">PRESTASI & KARAKTER</text>
  <text x="80" y="133" font-size="7.5" font-family="sans-serif" fill="%2393c5fd" text-anchor="middle">EKSTRAKURIKULER</text>
</svg>`;

export const LETTERHEAD_LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'preset-alfa-masykur',
    name: 'Logo SMP Alfa Ali Masykur (Hijau & Emas)',
    category: 'yayasan',
    description: 'Lambang resmi madrasah/sekolah dengan bintang 9, kubah, dan kitab terbuka.',
    dataUrl: SVG_ALFA_MASYKUR,
  },
  {
    id: 'preset-tut-wuri',
    name: 'Logo Tut Wuri Handayani (Kemendikbud)',
    category: 'kemendikbud',
    description: 'Lambang standar pendidikan nasional kementerian pendidikan.',
    dataUrl: SVG_TUT_WURI,
  },
  {
    id: 'preset-kemenag',
    name: 'Logo Kementerian Agama (Ikhlas Beramal)',
    category: 'kemenag',
    description: 'Lambang resmi Kemenag RI dengan timbangan keadilan dan kitab suci.',
    dataUrl: SVG_KEMENAG,
  },
  {
    id: 'preset-prestasi-shield',
    name: 'Perisai Prestasi & Obor Ekstrakurikuler',
    category: 'prestasi',
    description: 'Lambang lambang kejuaraan, sportivitas, dan pengembangan karakter.',
    dataUrl: SVG_PRESTASI_SHIELD,
  },
];

export const DEFAULT_PRIMARY_LOGO = SVG_ALFA_MASYKUR;
export const DEFAULT_SECONDARY_LOGO = SVG_TUT_WURI;
