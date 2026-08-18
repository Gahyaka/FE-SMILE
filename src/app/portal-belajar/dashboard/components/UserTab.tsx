"use client";

import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: "admin_adm" | "admin_trx" | "guru";
}

interface UserTabProps {
  users: User[];
  onAddUser: (newUser: Omit<User, "id">) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: number) => void;
}

export default function UserTab({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: UserTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin_adm" | "admin_trx" | "guru">("guru");

  // Success credentials modal state
  const [successCredentials, setSuccessCredentials] = useState<{
    name: string;
    username: string;
    role: string;
    passwordText: string;
  } | null>(null);

  // Helper to generate dynamic random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let generated = "";
    for (let i = 0; i < 8; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `sgw_${generated}`;
  };

  // Trigger password generation when add form is opened
  React.useEffect(() => {
    if (showAddForm) {
      setNewPassword(generateRandomPassword());
    }
  }, [showAddForm]);

  // Auto-generate username from name & role
  React.useEffect(() => {
    if (!newName.trim()) {
      setNewUsername("");
      return;
    }
    
    // Clean and split name
    const sanitized = newName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();
    const parts = sanitized.split(/\s+/);
    // Prefer first or second word if "bunda" is used
    let base = parts[0];
    if ((base === "bunda" || base === "ibu" || base === "pak") && parts.length > 1) {
      base = parts[1];
    }

    const roleSuffix = newRole === "admin_adm" ? "adm" : newRole === "admin_trx" ? "trx" : "guru";
    setNewUsername(`${base}_${roleSuffix}`);
  }, [newName, newRole]);

  const [searchQuery, setSearchQuery] = useState("");

  const visibleUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUsername || !newPassword) return;

    onAddUser({
      name: newName,
      username: newUsername,
      password: newPassword,
      role: newRole,
    });

    // Save for the clipboard success dialog
    setSuccessCredentials({
      name: newName,
      username: newUsername,
      role: newRole === "admin_adm" ? "Admin Administrasi" : newRole === "admin_trx" ? "Admin Transaksi" : "Guru",
      passwordText: newPassword
    });

    // Reset Form
    setNewName("");
    setNewUsername("");
    setNewPassword("");
    setNewRole("guru");
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name || !editingUser.username) return;
    onUpdateUser(editingUser);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Search Panel */}
      <div className="bg-white p-5 rounded-2xl border border-primary-green/10 shadow-3xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-neutral-gray absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna berdasarkan nama, username, atau peran..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-semibold"
          />
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs whitespace-nowrap"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Daftarkan Pengguna Baru</span>
        </button>
      </div>

      {/* 2. Add / Edit Sliding Side Drawers */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => setShowAddForm(false)}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Registrasi Akun Petugas Baru</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content (Scrollable) */}
              <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Lengkap (Gelar)</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Bunda Fitri, S.Pd."
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                  />
                </div>
                 <div>
                  <label htmlFor="username" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Username Login (Otomatis)</label>
                  <input
                    type="text"
                    id="username"
                    disabled
                    value={newUsername}
                    placeholder="Auto-generated dari nama & peran"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-mono font-bold bg-stone-50 text-stone-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Peran Akses (Role)</label>
                  <select
                    id="role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold cursor-pointer bg-white"
                  >
                    <option value="guru">Guru (Pendidik Kelas)</option>
                    <option value="admin_trx">Admin Transaksi (Bendahara Keuangan)</option>
                    <option value="admin_adm">Admin Administrasi (Kepala Sekolah/Pengelola)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pass" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Kata Sandi (Otomatis)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="pass"
                      readOnly
                      value={newPassword}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-primary-green/10 focus:border-primary-green focus:outline-none text-xs font-mono font-bold bg-stone-50 text-stone-600"
                    />
                    <button
                      type="button"
                      onClick={() => setNewPassword(generateRandomPassword())}
                      className="px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-[10px] rounded-xl border border-neutral-gray/10 transition-all cursor-pointer"
                      title="Acak Ulang Kata Sandi"
                    >
                      Acak Ulang
                    </button>
                  </div>
                </div>

                {/* Sticky buttons at bottom */}
                <div className="flex gap-2 pt-3 border-t border-neutral-gray/10 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                  >
                    Simpan Akun
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
            onClick={() => setEditingUser(null)}
          />
          
          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-primary-green/10 flex flex-col shadow-2xl h-full animate-slide-in">
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-gray/10 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">
                  Ubah Akun: <span className="text-primary-green">{editingUser.name}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/10 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content (Scrollable) */}
              <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-neutral-dark">
                <div>
                  <label htmlFor="editName" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    id="editName"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="editUsername" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Username Login</label>
                  <input
                    type="text"
                    id="editUsername"
                    required
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="editRole" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Peran Akses (Role)</label>
                  <select
                    id="editRole"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold cursor-pointer bg-white"
                  >
                    <option value="guru">Guru (Pendidik Kelas)</option>
                    <option value="admin_trx">Admin Transaksi (Bendahara Keuangan)</option>
                    <option value="admin_adm">Admin Administrasi (Kepala Sekolah/Pengelola)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="editPass" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Ubah Sandi Baru (Opsional)</label>
                  <input
                    type="text"
                    id="editPass"
                    value={editingUser.password || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
                  />
                </div>

                {/* Sticky buttons at bottom */}
                <div className="flex gap-2 pt-3 border-t border-neutral-gray/10 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleUsers.map((u) => {
          const initials = u.name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
          const isDropdownOpen = activeDropdownId === u.id;
          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs hover:shadow-xs transition-all relative flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                {/* Header Card dengan Kebab Menu */}
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${
                    u.role === "admin_adm" ? "bg-red-50 text-red-700" :
                    u.role === "admin_trx" ? "bg-amber-50 text-amber-700" :
                    "bg-emerald-50 text-emerald-700"
                  }`}>
                    {u.role === "admin_adm" ? "Admin Administrasi" :
                     u.role === "admin_trx" ? "Admin Transaksi" : "Guru Kelas"}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-neutral-gray font-mono font-bold">
                      ID: USR-{u.id}
                    </span>

                    {/* Kebab Dropdown Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(isDropdownOpen ? null : u.id);
                        }}
                        className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 hover:bg-neutral-gray/5 text-neutral-dark font-extrabold flex items-center justify-center cursor-pointer transition-colors"
                      >
                        ⋮
                      </button>

                      {isDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20 cursor-default"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownId(null);
                            }}
                          />
                          <div className="absolute right-0 mt-1 w-28 bg-white border border-neutral-gray/10 rounded-xl shadow-lg z-30 py-1.5 font-semibold text-xs text-neutral-dark">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddForm(false);
                                setEditingUser({ ...u });
                                setActiveDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left hover:bg-soft-mint/30 cursor-pointer text-yellow-700 flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Ubah</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteUser(u.id);
                                setActiveDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left hover:bg-accent/10 cursor-pointer text-accent flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Hapus</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profil & Avatar Pengguna */}
                <div className="flex items-center gap-3 pr-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center font-baloo font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="font-baloo text-sm font-bold text-neutral-dark truncate leading-tight">
                      {u.name}
                    </h4>
                    <p className="text-[10px] text-neutral-gray truncate mt-0.5">Username: {u.username}</p>
                  </div>
                </div>

                {/* Informasi Kredensial */}
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5 space-y-1.5 text-[11px] font-semibold text-neutral-gray">
                  <div className="flex justify-between items-center">
                    <span>Kata Sandi:</span>
                    <span className="font-mono text-neutral-dark font-bold bg-white px-2 py-0.5 rounded border border-neutral-gray/10">
                      {u.password || "••••••"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {visibleUsers.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-primary-green/10">
            <p className="text-xs text-neutral-gray font-bold">Tidak ada pengguna yang dapat ditampilkan.</p>
          </div>
        )}
      </div>

      {/* 4. Credentials Success Modal Dialog */}
      {successCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-primary-green/10 shadow-2xl p-6 space-y-4 animate-scale-in text-neutral-dark">
            <div className="text-center space-y-2">
              <span className="text-3xl">🎉</span>
              <h4 className="font-baloo text-base font-bold text-neutral-dark">Akun Berhasil Dibuat!</h4>
              <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                Silakan salin kredensial login di bawah ini untuk dibagikan kepada petugas bersangkutan.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-primary-green/5 space-y-2.5 text-xs font-semibold text-neutral-gray font-mono">
              <div>
                <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans">Nama Lengkap</span>
                <span className="text-neutral-dark font-bold font-sans">{successCredentials.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans">Username</span>
                  <span className="text-neutral-dark font-bold">{successCredentials.username}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans">Kata Sandi</span>
                  <span className="text-neutral-dark font-bold">{successCredentials.passwordText}</span>
                </div>
              </div>
              <div>
                <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans">Hak Akses / Peran</span>
                <span className="text-primary-green font-bold font-sans">{successCredentials.role}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const message = `Halo ${successCredentials.name},\n\nBerikut akun login Portal Belajar KB/RA Sahabat Anda:\n-------------------------------------\nUsername: ${successCredentials.username}\nPassword: ${successCredentials.passwordText}\nHak Akses: ${successCredentials.role}\nLink Portal: ${window.location.origin}/portal-belajar\n-------------------------------------\nHarap simpan kredensial ini baik-baik.`;
                  navigator.clipboard.writeText(message);
                  alert("Kredensial login disalin ke clipboard! Siap dikirim via WhatsApp.");
                }}
                className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
              >
                <span>Salin Kredensial</span>
              </button>
              <button
                type="button"
                onClick={() => setSuccessCredentials(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
