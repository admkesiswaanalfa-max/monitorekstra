import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SystemUser, UserRole } from '../../types';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Key,
  Edit2,
  Trash2,
  Briefcase,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { UserAccountModal } from './UserAccountModal';
import { ResetPasswordModal } from './ResetPasswordModal';

export const UserAccessSettings: React.FC = () => {
  const {
    systemUsers,
    addSystemUser,
    updateSystemUser,
    deleteSystemUser,
    toggleUserStatus,
    resetUserPassword,
    roleConfigs,
    currentUser,
    extracurriculars,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'rbac'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [resetPassUser, setResetPassUser] = useState<SystemUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<SystemUser | null>(null);

  // RBAC active role viewer
  const [selectedRoleKey, setSelectedRoleKey] = useState<UserRole>('admin');

  // Filtered users
  const filteredUsers = systemUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.nip && u.nip.includes(searchTerm));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const getEkskulName = (id?: string) => {
    if (!id) return null;
    return extracurriculars.find((e) => e.id === id)?.name || id;
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <ShieldCheck className="w-3 h-3" />
            Administrator SI
          </span>
        );
      case 'kepala_sekolah':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Shield className="w-3 h-3" />
            Kepala Sekolah
          </span>
        );
      case 'pembina':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Briefcase className="w-3 h-3" />
            Pembina Ekskul
          </span>
        );
      case 'wali_kelas':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Users className="w-3 h-3" />
            Wali Kelas
          </span>
        );
    }
  };

  const activeRoleConfig =
    roleConfigs.find((r) => r.role === selectedRoleKey) || roleConfigs[0];

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Direktori Akun Pengguna</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-semibold">
              {systemUsers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('rbac')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'rbac'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Matriks Hak Akses (RBAC)</span>
          </button>
        </div>

        {activeSubTab === 'users' && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setIsAccountModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        )}
      </div>

      {/* SUB-TAB 1: USER ACCOUNTS DIRECTORY */}
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Pengguna</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {systemUsers.length} <span className="text-xs font-normal text-slate-400">Akun</span>
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Pembina & Pelatih</span>
              <span className="text-xl font-black text-blue-600 mt-1 block">
                {systemUsers.filter((u) => u.role === 'pembina').length}{' '}
                <span className="text-xs font-normal text-slate-400">Guru</span>
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Wali Kelas</span>
              <span className="text-xl font-black text-amber-600 mt-1 block">
                {systemUsers.filter((u) => u.role === 'wali_kelas').length}{' '}
                <span className="text-xs font-normal text-slate-400">Rombel</span>
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block">Status Keaktifan</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">
                {systemUsers.filter((u) => u.status === 'active').length} / {systemUsers.length}{' '}
                <span className="text-xs font-normal text-slate-400">Aktif</span>
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama, email sekolah, atau NIP..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="all">Semua Peran</option>
                <option value="admin">Administrator SI</option>
                <option value="kepala_sekolah">Kepala Sekolah</option>
                <option value="pembina">Pembina Ekskul</option>
                <option value="wali_kelas">Wali Kelas</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="all">Semua Status</option>
                <option value="active">Hanya Aktif</option>
                <option value="inactive">Hanya Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Identitas Pengguna</th>
                    <th className="py-3 px-4">Peran & Wewenang</th>
                    <th className="py-3 px-4">Kontak & Penugasan</th>
                    <th className="py-3 px-4 text-center">Status Login</th>
                    <th className="py-3 px-4 text-center">Aktivitas Terakhir</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada akun pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelf = currentUser.id === user.id;
                      const ekskulName = getEkskulName(user.assignedEkskulId);

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {isSelf && (
                                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-md font-bold">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {user.nip ? `NIP: ${user.nip}` : 'ID Guru / Pegawai'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">{getRoleBadge(user.role)}</td>

                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[190px]">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                              {user.role === 'pembina' && ekskulName && (
                                <div className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                                  Binaan: {ekskulName}
                                </div>
                              )}
                              {user.role === 'wali_kelas' && user.assignedClass && (
                                <div className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-100">
                                  Wali Rombel: {user.assignedClass}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(user.id)}
                              disabled={isSelf}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition-colors ${
                                isSelf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                              } ${
                                user.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                              title={
                                isSelf
                                  ? 'Akun Anda sedang aktif digunakan'
                                  : user.status === 'active'
                                  ? 'Klik untuk menonaktifkan akun'
                                  : 'Klik untuk mengaktifkan akun'
                              }
                            >
                              {user.status === 'active' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Aktif</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>Nonaktif</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-center text-slate-500 text-[11px]">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{user.lastLogin || 'Belum login'}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setResetPassUser(user)}
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Reset Password"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUser(user);
                                  setIsAccountModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Ubah Profil Akun"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {!isSelf && (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmUser(user)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Hapus Akun Pengguna"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RBAC PERMISSIONS MATRIX */}
      {activeSubTab === 'rbac' && (
        <div className="space-y-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {roleConfigs.map((cfg) => {
              const isSelected = selectedRoleKey === cfg.role;
              return (
                <button
                  key={cfg.role}
                  type="button"
                  onClick={() => setSelectedRoleKey(cfg.role)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">{cfg.roleTitle}</span>
                    {isSelected && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {cfg.roleDescription}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Role Detail Profile Banner */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${activeRoleConfig.badgeColor}`}>
                  {activeRoleConfig.roleTitle}
                </span>
                <span className="text-xs text-slate-400 font-semibold">Tingkat Wewenang Resmi</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl pt-1">
                {activeRoleConfig.roleDescription}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Pengguna Terdaftar
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {systemUsers.filter((u) => u.role === activeRoleConfig.role).length} Akun
                </span>
              </div>
            </div>
          </div>

          {/* Permissions Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Matriks Hak Akses Per Modul Sistem
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Rincian wewenang operasi (Lihat, Buat, Ubah, Hapus, Ekspor, dan Pengesahan) untuk peran {activeRoleConfig.roleTitle}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Modul & Deskripsi</th>
                    <th className="py-3 px-3 text-center">Lihat (Read)</th>
                    <th className="py-3 px-3 text-center">Buat (Create)</th>
                    <th className="py-3 px-3 text-center">Ubah (Update)</th>
                    <th className="py-3 px-3 text-center">Hapus (Delete)</th>
                    <th className="py-3 px-3 text-center">Ekspor (Export)</th>
                    <th className="py-3 px-3 text-center">Validasi (Approve)</th>
                    <th className="py-3 px-4">Cakupan Wilayah Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeRoleConfig.permissions.map((perm) => (
                    <tr key={perm.moduleId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{perm.moduleName}</div>
                        <div className="text-[11px] text-slate-500 leading-snug">{perm.description}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {perm.canView ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {perm.canCreate ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {perm.canEdit ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {perm.canDelete ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {perm.canExport ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {perm.canApprove ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {perm.scopeNote || 'Sesuai Kebijakan'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security & Audit Guidelines */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 font-semibold block mb-0.5">
                Audit Trail & Kebijakan Akuntabilitas
              </strong>
              Setiap penambahan atau perubahan nilai rapor, kehadiran latihan, maupun sertifikat prestasi direkam secara otomatis dalam <em>Log Aktivitas Sistem</em> bersama stempel waktu dan identitas akun guru yang bertanggung jawab.
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="text-sm font-bold text-slate-900">Hapus Akun Pengguna?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Akun milik <strong className="text-slate-700">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email}) akan dihapus dari sistem. Pengguna tidak akan dapat login kembali.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteSystemUser(deleteConfirmUser.id);
                  setDeleteConfirmUser(null);
                }}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Account Add/Edit Modal */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={(data) => {
          if (editingUser) {
            updateSystemUser(editingUser.id, data);
          } else {
            addSystemUser(data);
          }
        }}
        initialData={editingUser}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={!!resetPassUser}
        onClose={() => setResetPassUser(null)}
        user={resetPassUser}
        onConfirmReset={(userId, pass) => {
          resetUserPassword(userId, pass);
        }}
      />
    </div>
  );
};
