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
  localPasswords?: Record<string, string>;
  onAddUser: (newUser: Omit<User, "id">) => void;
  onUpdateUser: (updatedUser: User) => Promise<void>;
  onDeleteUser: (userId: number) => void;
}

export default function UserTab({
  users,
  localPasswords = {},
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: UserTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin_adm" | "admin_trx" | "guru">("guru");
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Local Confirmation State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    action: null,
  });

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      action,
    });
  };

  // Success credentials modal state
  const [successCredentials, setSuccessCredentials] = useState<{
    name: string;
    username: string;
    role: string;
    passwordText: string;
  } | null>(null);

  // Floating toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-generate username from name & role
  React.useEffect(() => {
    if (!newName) {
      setNewUsername("");
      return;
    }
    const base = newName.toLowerCase().trim().replace(/\s+/g, "_");
    const roleSuffix = newRole === "admin_adm" ? "adm" : newRole === "admin_trx" ? "trx" : "";
    const suggestedBase = roleSuffix ? `${base}_${roleSuffix}` : base;

    let finalUsername = suggestedBase;
    let counter = 1;
    while (users.some((u) => u.username === finalUsername)) {
      finalUsername = `${suggestedBase}${counter}`;
      counter++;
    }

    setNewUsername(finalUsername);
  }, [newName, newRole, users]);

  const visibleUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const executeAddUser = () => {
    onAddUser({
      name: newName,
      username: newUsername,
      password: newPassword,
      role: newRole,
    });

    setSuccessCredentials({
      name: newName,
      username: newUsername,
      role: newRole === "admin_adm" ? "Admin Administrasi" : newRole === "admin_trx" ? "Admin Transaksi" : "Guru",
      passwordText: newPassword
    });

    setNewName("");
    setNewUsername("");
    setNewPassword("");
    setNewRole("guru");
    setShowAddForm(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUsername || !newPassword) return;

    triggerConfirm(
      "Daftarkan Pengguna Baru",
      `Apakah Anda yakin ingin mendaftarkan pengguna "${newName}" dengan username login "${newUsername}"?`,
      executeAddUser
    );
  };

  const [resetError, setResetError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const executeResetPassword = async () => {
    if (!resetPasswordUser || !newPasswordValue.trim()) return;
    const trimmedPassword = newPasswordValue.trim();

    try {
      setIsSubmitting(true);
      await onUpdateUser({
        ...resetPasswordUser,
        password: trimmedPassword
      });

      setToastMessage(`Sandi untuk ${resetPasswordUser.name} berhasil diperbarui secara manual!`);
      setTimeout(() => setToastMessage(null), 3000);
      setResetPasswordUser(null);
      setNewPasswordValue("");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Terjadi kesalahan pada server.";
      setResetError(`Gagal mereset password di backend: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetPasswordUser || !newPasswordValue.trim()) return;

    const trimmedPassword = newPasswordValue.trim();
    if (trimmedPassword.length < 6) {
      setResetError("Gagal mereset password di backend: Password baru wajib diisi dan minimal 6 karakter");
      return;
    }

    triggerConfirm(
      "Reset Sandi Pengguna",
      `Apakah Anda yakin ingin mengubah kata sandi untuk pengguna "${resetPasswordUser.name}"?`,
      executeResetPassword
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Search Panel */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-gray/8 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-neutral-gray absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna berdasarkan nama, username, atau peran..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold text-neutral-dark placeholder:text-neutral-gray/40 transition-all shadow-3xs"
          />
        </div>

        <button
          onClick={() => {
            setResetPasswordUser(null);
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2.5 bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md active:scale-98 whitespace-nowrap"
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
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setShowAddForm(false)}
          />
          <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white border-l border-neutral-gray/8 flex flex-col shadow-2xl h-full animate-slide-in">
              <div className="px-6 py-5 border-b border-neutral-gray/8 flex justify-between items-center bg-[#FAF8F5]">
                <h4 className="font-baloo text-base font-bold text-neutral-dark">Registrasi Akun Petugas Baru</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-6 h-6 rounded-full bg-white border border-neutral-gray/12 flex items-center justify-center text-neutral-gray hover:text-neutral-dark cursor-pointer transition-colors"
                >
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/8 focus:outline-none text-xs font-mono font-bold bg-[#FAF8F5] text-stone-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Peran Akses (Role)</label>
                  <input
                    type="text"
                    id="role"
                    disabled
                    value="Guru (Pendidik Kelas)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/8 focus:outline-none text-xs font-bold bg-[#FAF8F5] text-stone-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="pass" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Kata Sandi (Password)</label>
                  <input
                    type="text"
                    id="pass"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi untuk akun baru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold select-text"
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-gray/8 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-sm hover:shadow-md"
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

      {/* 2b. Reset Password Modal Dialog */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-neutral-gray/8 shadow-2xl p-6 space-y-4 animate-scale-in text-neutral-dark">
            <div className="flex justify-between items-center border-b border-neutral-gray/8 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5 0a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5a2 2 0 012 2v2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-baloo text-sm font-bold leading-tight">Reset Sandi Pengguna</h4>
                  <p className="text-[9px] text-neutral-gray font-bold uppercase mt-0.5">{resetPasswordUser.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetPasswordUser(null);
                  setNewPasswordValue("");
                  setResetError(null);
                }}
                className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-700 cursor-pointer transition-colors text-xs font-black"
              >
                ✕
              </button>
            </div>

            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-[10px] leading-relaxed font-bold animate-pulse flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="flex-1">{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs font-semibold text-neutral-gray">
              <div className="space-y-1">
                <label htmlFor="newPass" className="block text-[9px] font-extrabold uppercase tracking-wider">Kata Sandi Baru</label>
                <input
                  type="text"
                  id="newPass"
                  required
                  disabled={isSubmitting}
                  value={newPasswordValue}
                  onChange={(e) => {
                    setNewPasswordValue(e.target.value);
                    setResetError(null);
                  }}
                  placeholder="Ketikkan sandi manual baru..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-gray/12 focus:border-primary-green focus:outline-none text-xs font-semibold text-neutral-dark bg-stone-50/50 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Sandi Baru</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewPasswordValue("");
                    setResetError(null);
                  }}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
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
              className="bg-white rounded-2xl border border-neutral-gray/8 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-md border ${
                    u.role === "admin_adm" ? "bg-rose-50 text-rose-700 border-rose-100" :
                    u.role === "admin_trx" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-emerald-50 text-emerald-700 border-emerald-100"
                  }`}>
                    {u.role === "admin_adm" ? "Admin Administrasi" :
                     u.role === "admin_trx" ? "Admin Transaksi" : "Guru Kelas"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(isDropdownOpen ? null : u.id);
                        }}
                        className="w-6.5 h-6.5 rounded-full bg-[#FAF8F5] border border-neutral-gray/10 hover:bg-neutral-gray/5 text-neutral-dark font-extrabold flex items-center justify-center cursor-pointer transition-colors"
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
                          <div className="absolute right-0 mt-1 w-32 bg-white border border-neutral-gray/10 rounded-xl shadow-lg z-30 py-1.5 font-semibold text-xs text-neutral-dark">
                            <button
                              type="button"
                              onClick={() => {
                                setResetPasswordUser(u);
                                setNewPasswordValue("");
                                setActiveDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left hover:bg-soft-mint/30 cursor-pointer text-yellow-700 flex items-center gap-1.5 border-b border-neutral-gray/5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-5 0a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5a2 2 0 012 2v2z" />
                              </svg>
                              <span>Reset Sandi</span>
                            </button>

                            {u.username !== "admin_adm" && (
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
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

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

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5 space-y-1.5 text-[11px] font-semibold text-neutral-gray">
                  <div className="flex justify-between items-center">
                    <span>Kata Sandi:</span>
                    <span className="font-mono text-neutral-gray/50 font-bold tracking-widest text-[9px] select-none bg-stone-100/50 px-2 py-0.5 rounded border border-neutral-gray/5">
                      ••••••••
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {visibleUsers.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-neutral-gray/8 shadow-sm">
            <p className="text-xs text-neutral-gray font-bold">Tidak ada pengguna yang dapat ditampilkan.</p>
          </div>
        )}
      </div>

      {/* 4. Credentials Success Modal Dialog */}
      {successCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm select-none p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-neutral-gray/8 shadow-2xl p-6 space-y-4 animate-scale-in text-neutral-dark">
            <div className="text-center space-y-3">
              <div className="mx-auto w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 shadow-3xs animate-pulse">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h4 className="font-baloo text-base font-bold text-neutral-dark leading-tight">Akun Petugas Berhasil Dibuat!</h4>
              <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed">
                Silakan salin kredensial login di bawah ini untuk dibagikan kepada petugas bersangkutan.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-neutral-gray/6 space-y-3 text-xs font-semibold text-neutral-gray font-mono">
              <div>
                <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans tracking-wider mb-0.5">Nama Lengkap</span>
                <span className="text-neutral-dark font-bold font-sans text-xs">{successCredentials.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-b border-neutral-gray/6 py-2.5 my-2">
                <div>
                  <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans tracking-wider mb-0.5">Username</span>
                  <span className="text-neutral-dark font-bold bg-white px-2 py-0.5 rounded border border-neutral-gray/10 text-[11px] block w-fit">{successCredentials.username}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans tracking-wider mb-0.5">Kata Sandi</span>
                  <span className="text-neutral-dark font-bold bg-white px-2 py-0.5 rounded border border-neutral-gray/10 text-[11px] block w-fit">{successCredentials.passwordText}</span>
                </div>
              </div>
              <div>
                <span className="block text-[8px] text-neutral-gray/60 uppercase font-sans tracking-wider mb-0.5">Hak Akses / Peran</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans">{successCredentials.role}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const message = `Halo ${successCredentials.name},\n\nBerikut akun login Portal Belajar KB/RA Sahabat Anda:\n-------------------------------------\nUsername: ${successCredentials.username}\nPassword: ${successCredentials.passwordText}\nHak Akses: ${successCredentials.role}\nLink Portal: ${window.location.origin}/portal-belajar\n-------------------------------------\nHarap simpan kredensial ini baik-baik.`;
                  navigator.clipboard.writeText(message);
                  setToastMessage("Kredensial login disalin ke clipboard! Siap dikirim via WhatsApp.");
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="flex-1 py-2.5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Salin Akun</span>
              </button>
              <button
                type="button"
                onClick={() => setSuccessCredentials(null)}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-neutral-gray/10"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom Confirmation Modal Pop-up ── */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-neutral-gray/8 w-full max-w-sm p-6 relative shadow-2xl text-center space-y-4 animate-scale-in text-neutral-dark">
            <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-baloo text-base font-bold text-neutral-dark">{confirmDialog.title}</h4>
              <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed px-2">
                {confirmDialog.message}
              </p>
            </div>
            <div className="flex gap-2.5 pt-2 select-none">
              <button
                type="button"
                onClick={() => {
                  if (confirmDialog.action) confirmDialog.action();
                  setConfirmDialog({ isOpen: false, title: "", message: "", action: null });
                }}
                className="flex-1 py-2.5 bg-primary-green hover:bg-primary-dark text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Ya, Konfirmasi
              </button>
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, title: "", message: "", action: null })}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#2D6A4F] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-[11px] font-extrabold border border-emerald-500/20 animate-fade-in">
          <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
