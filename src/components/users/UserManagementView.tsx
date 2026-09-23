import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { getAvailableClassNames } from '../../utils/classUtils';
import {
  Shield,
  UserCheck,
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Key,
  X,
  Mail,
  Phone,
  Building,
  Save,
  AlertCircle,
} from 'lucide-react';

const USER_STORAGE_KEY = 'SMP_ALFA_USERS_LIST_V2';

export const UserManagementView: React.FC = () => {
  const { currentUser, switchRole, extracurriculars, showToast, classes, students } = useApp();

  const availableClassNames = useMemo(() => {
    return getAvailableClassNames(classes, students);
  }, [classes, students]);

  const defaultInitialUsers: User[] = [
    {
      id: 'usr-1',
      name: 'Afif Mashadi, S.S.',
      email: 'afif.mashadi@smpalfaalimasykur.sch.id',
      role: 'admin',
      roleTitle: 'Kepala Sekolah & Penanggung Jawab SIM',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      nip: '19780512 200501 1 007',
      phone: '0812-3456-7890',
      isAuthenticated: true,
    },
    {
      id: 'usr-2',
      name: 'Yulianti, S.Pd.',
      email: 'yulianti@smpalfaalimasykur.sch.id',
      role: 'kepala_sekolah',
      roleTitle: 'Wakil Kepala Sekolah Bidang Kesiswaan',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      nip: '19820714 200801 2 011',
      phone: '0813-2233-4455',
      isAuthenticated: true,
    },
    {
      id: 'usr-3',
      name: 'Ahmad Fauzi, S.Pd.',
      email: 'ahmadfauzi@smpalfaalimasykur.sch.id',
      role: 'pembina',
      roleTitle: 'Koordinator Ekstrakurikuler & Pembina Pramuka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      nip: '19880520 201402 1 004',
      phone: '0852-1122-3344',
      assignedEkskulId: 'ekskul-7',
      assignedEkskulName: 'Pramuka',
      isAuthenticated: true,
    },
    {
      id: 'usr-4',
      name: 'Siti Rahmawati, S.Pd.',
      email: 'sitirahmawati@smpalfaalimasykur.sch.id',
      role: 'pembina',
      roleTitle: 'Pembina Ekskul Kaligrafi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      nip: '19900315 201601 2 008',
      phone: '0813-7788-9900',
      assignedEkskulId: 'ekskul-1',
      assignedEkskulName: 'Kaligrafi',
      isAuthenticated: true,
    },
    {
      id: 'usr-5',
      name: 'Bambang Triyono, S.Or.',
      email: 'bambangtri@smpalfaalimasykur.sch.id',
      role: 'pelatih',
      roleTitle: 'Pelatih Voli Putra',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      nip: '19920311 201801 1 007',
      phone: '0813-9988-7766',
      assignedEkskulId: 'ekskul-2',
      assignedEkskulName: 'Voli Putra',
      isAuthenticated: true,
    },
    {
      id: 'usr-6',
      name: 'Muhammad Rizal, M.Pd.',
      email: 'wali8a@smpalfaalimasykur.sch.id',
      role: 'wali_kelas',
      roleTitle: 'Wali Kelas VIII-A',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      nip: '19860412 201201 1 009',
      phone: '0821-4455-6677',
      assignedClass: 'VIII-A',
      isAuthenticated: true,
    },
    {
      id: 'usr-7',
      name: 'Super Administrator Yayasan',
      email: 'sysadmin@smpalfaalimasykur.sch.id',
      role: 'super_admin',
      roleTitle: 'Yayasan Pondok Pesantren Alfa Ali Masykur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      nip: 'SYS-YAYASAN-01',
      phone: '0811-2233-4455',
      isAuthenticated: true,
    },
  ];

  // User list with localStorage persistence
  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse saved users:', err);
      }
    }
    return defaultInitialUsers;
  });

  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usersList));
  }, [usersList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit User Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state for add user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'pembina' as UserRole,
    roleTitle: '',
    nip: '',
    phone: '',
    assignedEkskulId: '',
    assignedClass: '',
  });

  // Form state for edit user
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'pembina' as UserRole,
    roleTitle: '',
    nip: '',
    phone: '',
    assignedEkskulId: '',
    assignedClass: '',
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.roleTitle && u.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.nip && u.nip.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleDefaultTitle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator SIM Sekolah';
      case 'kepala_sekolah':
        return 'Pimpinan Satuan Pendidikan';
      case 'pembina':
        return 'Pembina Ekstrakurikuler';
      case 'pelatih':
        return 'Pelatih Bidang Minat Bakat';
      case 'wali_kelas':
        return 'Wali Kelas Pembimbing';
      case 'super_admin':
        return 'Super Admin Sistem Yayasan';
      default:
        return 'Staf Pengajar';
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-emerald-950 text-amber-300 border-emerald-700';
      case 'kepala_sekolah':
        return 'bg-emerald-950 text-emerald-200 border-emerald-700';
      case 'pembina':
        return 'bg-emerald-950 text-teal-200 border-teal-700';
      case 'wali_kelas':
        return 'bg-amber-950 text-amber-200 border-amber-600';
      case 'pelatih':
        return 'bg-indigo-950 text-indigo-200 border-indigo-700';
      case 'super_admin':
        return 'bg-purple-950 text-purple-200 border-purple-700';
      default:
        return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Data Tidak Lengkap', 'Mohon isi nama dan email pengguna.', 'warning');
      return;
    }

    const assignedEkskul = extracurriculars.find((ek) => ek.id === formData.assignedEkskulId);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      roleTitle: formData.roleTitle.trim() || getRoleDefaultTitle(formData.role),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      nip: formData.nip.trim(),
      phone: formData.phone.trim(),
      assignedEkskulId: formData.assignedEkskulId || undefined,
      assignedEkskulName: assignedEkskul?.name || undefined,
      assignedClass: formData.assignedClass || undefined,
      isAuthenticated: true,
    };

    setUsersList([...usersList, newUser]);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'pembina',
      roleTitle: '',
      nip: '',
      phone: '',
      assignedEkskulId: '',
      assignedClass: '',
    });

    showToast('Pengguna Ditambahkan', `Akun untuk ${newUser.name} berhasil dibuat.`, 'success');
  };

  // Open Edit Modal
  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      roleTitle: user.roleTitle || '',
      nip: user.nip || '',
      phone: user.phone || '',
      assignedEkskulId: user.assignedEkskulId || '',
      assignedClass: user.assignedClass || '',
    });
    setShowEditModal(true);
  };

  // Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      showToast('Data Tidak Lengkap', 'Nama dan email pengguna wajib diisi.', 'warning');
      return;
    }

    const assignedEkskul = extracurriculars.find((ek) => ek.id === editFormData.assignedEkskulId);

    const updatedUser: User = {
      ...editingUser,
      name: editFormData.name.trim(),
      email: editFormData.email.trim().toLowerCase(),
      role: editFormData.role,
      roleTitle: editFormData.roleTitle.trim() || getRoleDefaultTitle(editFormData.role),
      nip: editFormData.nip.trim() || undefined,
      phone: editFormData.phone.trim() || undefined,
      assignedEkskulId:
        editFormData.role === 'pembina' || editFormData.role === 'pelatih'
          ? editFormData.assignedEkskulId || undefined
          : undefined,
      assignedEkskulName:
        editFormData.role === 'pembina' || editFormData.role === 'pelatih'
          ? assignedEkskul?.name || undefined
          : undefined,
      assignedClass: editFormData.role === 'wali_kelas' ? editFormData.assignedClass || undefined : undefined,
    };

    setUsersList(usersList.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    setShowEditModal(false);
    setEditingUser(null);

    showToast('Perubahan Disimpan', `Data pengguna ${updatedUser.name} berhasil diperbarui.`, 'success');
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menonaktifkan/menghapus pengguna ${name}?`)) {
      setUsersList(usersList.filter((u) => u.id !== id));
      showToast('Pengguna Dihapus', `Akun ${name} telah dinonaktifkan.`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Hak Akses & Pengguna</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Manajemen Pengguna & Otoritas Sistem
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            Kelola akun, wewenang pembina, pelatih cabang, wali kelas, dan pimpinan SMP Alfa Ali Masykur.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          id="btn-tambah-pengguna"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama, NIP, atau email pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Peran:</label>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          >
            <option value="all">Semua Peran ({usersList.length})</option>
            <option value="admin">Administrator SIM</option>
            <option value="kepala_sekolah">Kepala Sekolah / Wakasek</option>
            <option value="pembina">Pembina Ekskul</option>
            <option value="pelatih">Pelatih Cabang</option>
            <option value="wali_kelas">Wali Kelas</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Peran & Otoritas</th>
                <th className="py-3 px-4">Tugas Khusus</th>
                <th className="py-3 px-4">Kontak & NIP</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser.email === u.email;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {u.name}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Anda
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500 text-[11px] block">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadge(
                          u.role
                        )}`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                      <p className="text-[11px] text-slate-600 font-medium mt-1">
                        {u.roleTitle || getRoleDefaultTitle(u.role)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {u.assignedEkskulName ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <BookOpen className="w-3 h-3" />
                          <span>Ekskul {u.assignedEkskulName}</span>
                        </div>
                      ) : u.assignedClass ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                          <UserCheck className="w-3 h-3" />
                          <span>Wali Kelas {u.assignedClass}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Akses Menyeluruh</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>NIP: <span className="font-mono">{u.nip || '-'}</span></div>
                      <div className="text-[11px] text-slate-500">{u.phone || '-'}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Aktif
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(u)}
                          title={`Edit Data Pengguna ${u.name}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 shadow-2xs transition-all cursor-pointer hover:scale-102"
                          id={`btn-edit-user-${u.id}`}
                        >
                          <Edit2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="hidden sm:inline text-[11px]">Edit</span>
                        </button>
                        <button
                          onClick={() => switchRole(u.role)}
                          title="Simulasikan masuk sebagai pengguna ini"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-all cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Hapus akun"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold mb-1">
                  <Edit2 className="w-3 h-3 text-emerald-600" />
                  <span>Edit Data Pengguna</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Perbarui Informasi Pengguna
                </h3>
                <p className="text-xs text-slate-500">
                  Ubah data pribadi, peran otoritas, dan penugasan khusus akun.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Yusuf, S.Pd."
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Resmi Sekolah *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@smpalfaalimasykur.sch.id"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Peran / Otoritas Akses *
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setEditFormData({
                        ...editFormData,
                        role: newRole,
                        roleTitle: getRoleDefaultTitle(newRole),
                      });
                    }}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium bg-slate-50"
                  >
                    <option value="pembina">Pembina Ekstrakurikuler</option>
                    <option value="pelatih">Pelatih Cabang Minat Bakat</option>
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="admin">Administrator SIM</option>
                    <option value="kepala_sekolah">Pimpinan Satuan Pendidikan</option>
                    <option value="super_admin">Super Administrator Yayasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jabatan / Keterangan Peran
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Koordinator Ekstrakurikuler & Pembina Pramuka"
                  value={editFormData.roleTitle}
                  onChange={(e) => setEditFormData({ ...editFormData, roleTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NIP / NUPTK / No. Pegawai
                  </label>
                  <input
                    type="text"
                    placeholder="19880520 201402 1 004"
                    value={editFormData.nip}
                    onChange={(e) => setEditFormData({ ...editFormData, nip: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="text"
                    placeholder="0812-3456-7890"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-medium"
                  />
                </div>
              </div>

              {/* Conditional: Ekskul assignment */}
              {(editFormData.role === 'pembina' || editFormData.role === 'pelatih') && (
                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                  <label className="text-xs font-bold text-emerald-950 block mb-1">
                    Penugasan Cabang Ekstrakurikuler
                  </label>
                  <select
                    value={editFormData.assignedEkskulId}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedEkskulId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-emerald-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="">-- Bebas / Tanpa Ekstrakurikuler Spesifik --</option>
                    {extracurriculars.map((ek) => (
                      <option key={ek.id} value={ek.id}>
                        {ek.name} ({ek.category})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Pengguna ini akan memiliki hak input jurnal, presensi, dan penilaian untuk ekskul yang dipilih.
                  </p>
                </div>
              )}

              {/* Conditional: Class assignment */}
              {editFormData.role === 'wali_kelas' && (
                <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100">
                  <label className="text-xs font-bold text-amber-950 block mb-1">
                    Penugasan Rombel / Kelas yang Diampu
                  </label>
                  <select
                    value={editFormData.assignedClass}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedClass: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-amber-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700 bg-white"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {availableClassNames.map((cls) => {
                      const matchedClass = classes?.find((c) => c.name === cls);
                      const roomInfo = matchedClass?.room ? ` (${matchedClass.room})` : '';
                      return (
                        <option key={cls} value={cls}>
                          Kelas {cls}{roomInfo}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-amber-700 mt-1">
                    Wali kelas dapat memantau keterlibatan, rapor, dan catatan pembimbing santri pada kelas tersebut.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all hover:shadow-lg"
                  id="btn-save-edit-user"
                >
                  <Save className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Tambah Pengguna Baru</h3>
                <p className="text-xs text-slate-500">
                  Daftarkan akun staf pengajar, pembina ekstrakurikuler, atau pelatih.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Yusuf, S.Pd."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Sekolah *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@smpalfaalimasykur.sch.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Peran / Otoritas *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      setFormData({
                        ...formData,
                        role: newRole,
                        roleTitle: getRoleDefaultTitle(newRole),
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="pembina">Pembina Ekskul</option>
                    <option value="pelatih">Pelatih Cabang</option>
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="admin">Administrator SIM</option>
                    <option value="kepala_sekolah">Pimpinan Sekolah</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jabatan / Keterangan Peran</label>
                <input
                  type="text"
                  placeholder="Contoh: Koordinator Ekstrakurikuler"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">NIP / NUPTK</label>
                  <input
                    type="text"
                    placeholder="19880520 201402 1 004"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="0812-3456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {(formData.role === 'pembina' || formData.role === 'pelatih') && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cabang Ekstrakurikuler yang Dibina</label>
                  <select
                    value={formData.assignedEkskulId}
                    onChange={(e) => setFormData({ ...formData, assignedEkskulId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="">-- Pilih Ekstrakurikuler --</option>
                    {extracurriculars.map((ek) => (
                      <option key={ek.id} value={ek.id}>
                        {ek.name} ({ek.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.role === 'wali_kelas' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kelas yang Diampu</label>
                  <select
                    value={formData.assignedClass}
                    onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {availableClassNames.map((cls) => {
                      const matchedClass = classes?.find((c) => c.name === cls);
                      const roomInfo = matchedClass?.room ? ` (${matchedClass.room})` : '';
                      return (
                        <option key={cls} value={cls}>
                          Kelas {cls}{roomInfo}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

