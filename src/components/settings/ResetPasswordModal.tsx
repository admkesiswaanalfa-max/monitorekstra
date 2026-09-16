import React, { useState } from 'react';
import { X, Key, Check, Copy, AlertTriangle } from 'lucide-react';
import { SystemUser } from '../../types';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SystemUser | null;
  onConfirmReset: (userId: string, newPass: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  user,
  onConfirmReset,
}) => {
  const [password, setPassword] = useState('Alfa2026!');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateRandom = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReset(user.id, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Reset Password Pengguna</h3>
              <p className="text-[11px] text-slate-500">Atur ulang kredensial login akun sekolah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900">{user.name}</div>
            <div className="text-slate-600 font-mono text-[11px]">{user.email}</div>
            <div className="text-slate-400 text-[10px]">
              Peran: <span className="capitalize font-semibold text-slate-700">{user.role.replace('_', ' ')}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password Baru Sementara</label>
              <button
                type="button"
                onClick={handleGenerateRandom}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Acak Otomatis
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-20 py-2 text-xs font-mono font-bold border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-1.5 px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Berikan password baru ini kepada guru / staf terkait untuk login kembali.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              Setelah password direset, pengguna disarankan segera mengganti password pribadi setelah berhasil masuk.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Terapkan Reset Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
