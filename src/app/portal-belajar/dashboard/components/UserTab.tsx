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

  // Form states
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin_adm" | "admin_trx" | "guru">("guru");

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

      {/* 2. Add / Edit Forms */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-primary-green/15 shadow-3xs space-y-4 animate-fade-in">
          <h4 className="font-baloo text-sm font-bold text-neutral-dark border-b border-neutral-gray/10 pb-2">
            Registrasi Akun Petugas Baru
          </h4>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Lengkap (Gelar)</label>
              <input
                type="text"
                id="name"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Bunda Fitri, S.Pd."
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Username Login</label>
              <input
                type="text"
                id="username"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Contoh: bundafitri (huruf kecil & tanpa spasi)"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Peran Akses (Role)</label>
              <select
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold cursor-pointer"
              >
                <option value="guru">Guru (Pendidik Kelas)</option>
                <option value="admin_trx">Admin Transaksi (Bendahara Keuangan)</option>
                <option value="admin_adm">Admin Administrasi (Kepala Sekolah/Pengelola)</option>
              </select>
            </div>
            <div>
              <label htmlFor="pass" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Kata Sandi (Password)</label>
              <input
                type="password"
                id="pass"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Buat sandi minimal 6 karakter"
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 pt-2 justify-end">
              <button
                type="submit"
                className="py-2 px-5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
              >
                Simpan & Daftarkan Akun
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {editingUser && (
        <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-3xs space-y-4 animate-fade-in">
          <h4 className="font-baloo text-sm font-bold text-neutral-dark border-b border-neutral-gray/10 pb-2">
            Ubah Data Akun: <span className="text-primary-green">{editingUser.name}</span>
          </h4>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editName" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                id="editName"
                required
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
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
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div>
              <label htmlFor="editRole" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5">Peran Akses (Role)</label>
              <select
                id="editRole"
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold cursor-pointer"
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
                className="w-full px-3.5 py-2 rounded-xl border-2 border-primary-green/15 focus:border-primary-green focus:outline-none text-xs font-semibold"
              />
            </div>
            <div className="md:col-span-2 flex gap-2 pt-2 justify-end">
              <button
                type="submit"
                className="py-2 px-5 bg-primary-green text-white font-extrabold text-xs rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-3xs"
              >
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleUsers.map((u) => {
          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-primary-green/10 p-5 shadow-3xs hover:shadow-xs transition-all relative flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full ${
                    u.role === "admin_adm" ? "bg-red-50 text-red-700" :
                    u.role === "admin_trx" ? "bg-amber-50 text-amber-700" :
                    "bg-emerald-50 text-emerald-700"
                  }`}>
                    {u.role === "admin_adm" ? "Admin Administrasi" :
                     u.role === "admin_trx" ? "Admin Transaksi" : "Guru Kelas"}
                  </span>
                  <span className="text-[10px] text-neutral-gray font-mono font-bold">
                    ID: USR-{u.id}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-baloo text-base font-bold text-neutral-dark">{u.name}</h4>
                  <p className="text-[10px] text-neutral-gray font-mono mt-0.5">Username: {u.username}</p>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-neutral-gray/5 space-y-1 text-[11px] font-semibold text-neutral-gray">
                  <div className="flex justify-between">
                    <span>Kata Sandi:</span>
                    <span className="font-mono text-neutral-dark font-bold bg-white px-2 py-0.5 rounded border border-neutral-gray/10">
                      {u.password || "••••••"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prevent self deletion */}
              <div className="flex gap-2 pt-2 border-t border-neutral-gray/5">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUser({ ...u });
                  }}
                  className="flex-1 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-extrabold text-[10px] uppercase rounded-lg border border-yellow-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Akun</span>
                </button>
                <button
                  onClick={() => onDeleteUser(u.id)}
                  className="py-1.5 px-3 bg-accent/5 hover:bg-accent/15 text-accent font-extrabold text-[10px] uppercase rounded-lg border border-accent/20 transition-all cursor-pointer flex items-center justify-center"
                >
                  Hapus
                </button>
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

    </div>
  );
}
