import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/initialData';
import { User, UserRole } from '../../types';
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  BookOpen,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@smpalfaalimasykur.sch.id');
  const [password, setPassword] = useState('********');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const matched = INITIAL_USERS.find((u) => u.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan username atau email sekolah.');
      return;
    }

    const matched =
      INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
      INITIAL_USERS.find((u) => u.role === selectedRole) ||
      INITIAL_USERS[0];

    login(matched);
  };

  const handleDemoQuickLogin = (role: UserRole) => {
    const matched = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    login(matched);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4 ring-4 ring-white/10">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SMP ALFA ALI MASYKUR
        </h1>
        <p className="mt-1 text-sm sm:text-base font-semibold text-blue-300">
          Monitoring Ekstrakurikuler
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Sistem Terpadu Pemantauan Keaktifan, Kompetensi & Prestasi Siswa
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          {/* Role selector buttons for demonstration */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Peran Akun (Simulasi Cepat):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'admin' as UserRole, label: 'Admin', icon: Shield },
                { role: 'kepala_sekolah' as UserRole, label: 'Kepala Sekolah', icon: GraduationCap },
                { role: 'pembina' as UserRole, label: 'Pembina Ekskul', icon: BookOpen },
                { role: 'wali_kelas' as UserRole, label: 'Wali Kelas', icon: UserCheck },
              ].map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                    selectedRole === role
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Email Sekolah
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-colors"
                  placeholder="nama@smpalfaalimasykur.sch.id"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">Ingat saya</span>
              </label>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 text-center mb-2.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Masuk Langsung dengan Akun Uji Coba:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('admin')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-medium text-center transition-colors"
              >
                Login sbg Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('kepala_sekolah')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-medium text-center transition-colors"
              >
                Login sbg Kepsek
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('pembina')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-medium text-center transition-colors"
              >
                Login sbg Pembina
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('wali_kelas')}
                className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 text-xs font-medium text-center transition-colors"
              >
                Login sbg Wali Kelas
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          &copy; 2026 SMP Alfa Ali Masykur &bull; Layanan Pengaduan SIM Sekolah
        </p>
      </div>

      {/* Modal Lupa Password */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Pemulihan Kata Sandi
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Masukkan alamat email resmi sekolah Anda untuk menerima instruksi reset kata sandi dari Administrator IT.
            </p>

            {resetSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Instruksi Terkirim!
                </div>
                <p>
                  Tautan pemulihan telah dikirimkan ke <strong>{resetEmail}</strong>. Silakan periksa kotak masuk atau spam email Anda.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setResetSubmitted(false);
                  }}
                  className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (resetEmail) {
                    setResetSubmitted(true);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Terdaftar
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nama@smpalfaalimasykur.sch.id"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    Kirim Tautan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
