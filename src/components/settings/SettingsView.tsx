import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Calendar,
  Users,
  Database,
  RefreshCw,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Lock,
  UserCheck,
  Image,
  SlidersHorizontal,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { OfficialLetterhead } from '../common/OfficialLetterhead';
import { LetterheadSettingsModal } from '../common/LetterheadSettingsModal';
import {
  LETTERHEAD_LOGO_PRESETS,
  DEFAULT_PRIMARY_LOGO,
  DEFAULT_SECONDARY_LOGO,
} from '../../data/letterheadPresets';
import { AcademicYearSettings } from './AcademicYearSettings';
import { UserAccessSettings } from './UserAccessSettings';

export const SettingsView: React.FC = () => {
  const {
    schoolInfo,
    updateSchoolInfo,
    resetToDefault,
    students,
    extracurriculars,
    achievements,
    coaches,
    attendanceRecords,
    assessments,
    currentUser,
  } = useApp();

  // School profile form
  const [name, setName] = useState(schoolInfo.name);
  const [npsn, setNpsn] = useState(schoolInfo.npsn);
  const [address, setAddress] = useState(schoolInfo.address);
  const [phone, setPhone] = useState(schoolInfo.phone);
  const [email, setEmail] = useState(schoolInfo.email);
  const [principal, setPrincipal] = useState(schoolInfo.principal);
  const [principalNip, setPrincipalNip] = useState(schoolInfo.principalNip);
  const [academicYear, setAcademicYear] = useState(schoolInfo.academicYear);
  const [semester, setSemester] = useState(schoolInfo.semester);

  const [activeTab, setActiveTab] = useState<'profile' | 'letterhead' | 'academic' | 'users' | 'database'>('profile');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLetterheadModal, setShowLetterheadModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolInfo({
      name,
      npsn,
      address,
      phone,
      email,
      principal,
      principalNip,
      academicYear,
      semester,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Backup data to JSON file
  const handleBackupData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      schoolInfo,
      students,
      extracurriculars,
      achievements,
      coaches,
      attendanceRecords,
      assessments,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BACKUP_ALFA_EMS_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore data from JSON file
  const handleRestoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.students && parsed.extracurriculars) {
            localStorage.setItem('ALFA_EMS_STORAGE_V1', JSON.stringify({
              students: parsed.students,
              extracurriculars: parsed.extracurriculars,
              achievements: parsed.achievements || [],
              coaches: parsed.coaches || [],
              attendanceRecords: parsed.attendanceRecords || [],
              assessments: parsed.assessments || [],
              schoolInfo: parsed.schoolInfo || schoolInfo,
            }));
            alert('Data cadangan berhasil dipulihkan! Halaman akan dimuat ulang.');
            window.location.reload();
          } else {
            alert('Format berkas backup JSON tidak valid.');
          }
        } catch (err) {
          alert('Gagal membaca berkas backup.');
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pengaturan & Master Data
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
              Konfigurasi Sistem
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola identitas sekolah, periode aktif, hak akses peran, serta pencadangan data
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Profil Sekolah</span>
        </button>
        <button
          onClick={() => setActiveTab('letterhead')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'letterhead'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Kop Surat & Logo</span>
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'academic'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tahun Ajaran & Semester</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Akun & Hak Akses</span>
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'database'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Backup & Reset Data</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Perubahan konfigurasi sekolah berhasil disimpan!</span>
        </div>
      )}

      {/* TAB 1: PROFIL SEKOLAH */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Letterhead Logo Quick Preview & Link */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-14 h-14 p-1 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src={schoolInfo.logoUrl || DEFAULT_PRIMARY_LOGO}
                  alt="Logo Kop Surat"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  Logo Kop Surat Resmi
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                  {schoolInfo.name || 'SMP ALFA ALI MASYKUR'}
                </h4>
                <p className="text-[11px] text-slate-600">
                  Logo aktif yang tercetak pada seluruh dokumen, rapor, dan sertifikat sekolah.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('letterhead')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Image className="w-4 h-4" />
              <span>Ganti Logo / Atur Kop</span>
            </button>
          </div>

          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Identitas Resmi Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Pokok Sekolah Nasional (NPSN)</label>
              <input
                type="text"
                value={npsn}
                onChange={(e) => setNpsn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon Kantor</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi Sekolah</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={principalNip}
                onChange={(e) => setPrincipalNip(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Sekolah</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB BARU: KOP SURAT & LOGO */}
      {activeTab === 'letterhead' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  Kustomisasi Kop Surat & Logo Sekolah
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur logo kiri (sekolah/yayasan), logo kanan (Dinas/Tut Wuri Handayani), ukuran, bentuk frame, serta teks resmi instansi
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLetterheadModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Buka Panel Lengkap Kop & Logo</span>
              </button>
            </div>

            {/* Live Visual Letterhead Preview */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" /> Pratinjau Tampilan Kop Surat Saat Ini
              </span>
              <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-300 shadow-xs">
                <OfficialLetterhead onOpenSettings={() => setShowLetterheadModal(true)} />
              </div>
            </div>

            {/* Quick Presets Grid */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs mb-2">
                Pilih Logo Lambang Sekolah / Instansi Cepat:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {LETTERHEAD_LOGO_PRESETS.map((preset) => {
                  const isSelected = (schoolInfo.logoUrl || DEFAULT_PRIMARY_LOGO) === preset.dataUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        updateSchoolInfo({ logoUrl: preset.dataUrl });
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-16 h-16 p-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                        <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="w-full min-w-0">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {preset.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                          {preset.description}
                        </p>
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Aktif Digunakan
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-600 hover:text-blue-600">
                          Gunakan Logo Ini
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Ingin mengunggah gambar logo Anda sendiri (PNG transparan/JPG) atau mengatur teks instansi?
              </div>
              <button
                type="button"
                onClick={() => setShowLetterheadModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Unggah Berkas Logo / Konfigurasi Lengkap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TAHUN AJARAN & SEMESTER */}
      {activeTab === 'academic' && <AcademicYearSettings />}

      {/* TAB 3: AKUN & HAK AKSES */}
      {activeTab === 'users' && <UserAccessSettings />}

      {/* TAB 4: DATABASE & BACKUP */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Pencadangan Data (Backup JSON)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Unduh seluruh snapshot basis data meliputi data siswa, presensi, penilaian, prestasi, dan konfigurasi sekolah dalam satu berkas format JSON terenkripsi.
                </p>
              </div>
              <button
                onClick={handleBackupData}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.JSON)</span>
              </button>
            </div>

            {/* Restore Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Pemulihan Data (Restore JSON)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Unggah berkas JSON cadangan yang telah diunduh sebelumnya untuk mengembalikan kondisi data sistem ke kondisi tersebut.
                </p>
              </div>
              <label className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas JSON untuk Restore</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Box */}
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-rose-900 text-sm">Reset ke Setelan Awal Pabrik (Factory Reset)</h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Menghapus perubahan dan mengembalikan seluruh data siswa, ekskul, dan presensi ke data bawaan awal.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 transition-colors"
            >
              Reset Data Bawaan
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Reset Data</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh database aplikasi ke data bawaan SMP Alfa Ali Masykur. Seluruh perubahan lokal akan ditimpa.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  resetToDefault();
                  setShowResetConfirm(false);
                  window.location.reload();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letterhead Settings Modal */}
      <LetterheadSettingsModal
        isOpen={showLetterheadModal}
        onClose={() => setShowLetterheadModal(false)}
      />
    </div>
  );
};
