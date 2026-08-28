"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export default function LoginClient() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);

  useEffect(() => {
    // Clear any existing session when returning to login page
    localStorage.removeItem("user_session");
    localStorage.removeItem("auth_token");

    // Initialize or force-reset mock users in localStorage to enforce correct credentials
    const defaultUsers = [
      { id: 1, name: "Admin Administrasi (Bunda Nisa)", username: "admin_adm", password: "admin123", role: "admin_adm" },
      { id: 2, name: "Admin Transaksi (Bunda Ajeng)", username: "admin_trx", password: "admin123", role: "admin_trx" },
      { id: 3, name: "Guru Kelas (Bunda Rahma)", username: "guru", password: "guru123", role: "guru" }
    ];

    const existingUsersStr = localStorage.getItem("system_users");
    if (!existingUsersStr) {
      localStorage.setItem("system_users", JSON.stringify(defaultUsers));
    } else {
      try {
        const parsed = JSON.parse(existingUsersStr);
        // If we detect legacy randomized data (like admin_trx70 or sgw_QpNyn83v), override it
        const hasStaleData = parsed.some((u: any) => 
          u.username.startsWith("admin_trx") && u.username !== "admin_trx" ||
          u.password !== "admin123" && (u.role === "admin_adm" || u.role === "admin_trx")
        );
        if (hasStaleData) {
          localStorage.setItem("system_users", JSON.stringify(defaultUsers));
        }
      } catch (e) {
        localStorage.setItem("system_users", JSON.stringify(defaultUsers));
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorDetails("");
    setIsServerOffline(false);
    setLoading(true);

    try {
      // 1. Kirim request login ke backend Railway
      const loginRes = await authService.login({ username, password });

      // Struktur backend: { success, message, data: { token, user: { id, username, nama, role } } }
      const token = loginRes?.data?.token || loginRes?.token || loginRes?.accessToken;
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan dari server.");
      }

      // 2. Simpan token JWT di localStorage
      localStorage.setItem("auth_token", token);

      // 3. Ambil data user langsung dari respons login (lebih lengkap dari getMe)
      //    loginRes.data.user sudah mengandung: id, username, nama, role
      const loginUser = loginRes?.data?.user;

      // 4. Map Peran (Role) backend ke format state frontend
      const rawRole = (loginUser?.role || "").toUpperCase();
      let mappedRole: "admin_adm" | "admin_trx" | "guru" = "guru";

      if (rawRole === "ADMIN_ADMINISTRASI" || rawRole === "ADMIN") {
        mappedRole = "admin_adm";
      } else if (rawRole === "ADMIN_TRANSAKSI") {
        mappedRole = "admin_trx";
      } else if (rawRole === "GURU") {
        mappedRole = "guru";
      }

      // Ambil nama lengkap riil dari data user dalam respons login
      // Catatan: /auth/me hanya mengembalikan JWT claim (tanpa nama), 
      //          sehingga sumber nama terpercaya adalah loginRes.data.user.nama
      const realName = loginUser?.nama || loginUser?.name || username;

      // 5. Simpan session user yang sudah dimapping
      localStorage.setItem(
        "user_session",
        JSON.stringify({ 
          role: mappedRole, 
          name: realName,
          username: loginUser?.username || username
        })
      );

      // 6. Alihkan ke dashboard utama
      router.push("/portal-belajar/dashboard");
    } catch (err: any) {
      console.error("Login API Error:", err);
      
      const status = err.response?.status;
      const responseData = err.response?.data;
      
      if (err.message === "Network Error" || !err.response) {
        // Backend offline / masalah jaringan
        setIsServerOffline(true);
        setError("Koneksi API Backend Terputus");
        setErrorDetails("Server database sedang dalam pemeliharaan atau offline. Anda dapat menggunakan akun lokal untuk mengakses mode demo.");
      } else if (status === 401 || status === 400) {
        // Salah username / password
        setError("Kredensial Salah");
        setErrorDetails(responseData?.message || "Nama pengguna atau kata sandi yang Anda masukkan tidak terdaftar. Periksa kembali penulisan Anda.");
      } else {
        // Kesalahan server internal lainnya
        setError("Kesalahan Sistem Server");
        setErrorDetails(responseData?.message || err.message || "Terjadi kesalahan internal pada server backend. Silakan coba beberapa saat lagi.");
      }
      
      setLoading(false);
    }
  };

  // Fitur Fallback login lokal/demo ketika server offline
  const handleOfflineBypass = () => {
    setError("");
    setErrorDetails("");
    setLoading(true);

    const localUsersRaw = localStorage.getItem("system_users");
    const localUsers = localUsersRaw ? JSON.parse(localUsersRaw) : [];
    
    const userMatch = localUsers.find(
      (u: any) => u.username === username && u.password === password
    );

    if (userMatch) {
      // Simpan session lokal
      localStorage.setItem("auth_token", "offline-mock-token-" + Date.now());
      localStorage.setItem(
        "user_session",
        JSON.stringify({ 
          role: userMatch.role, 
          name: userMatch.name,
          username: userMatch.username // Simpan username login asli
        })
      );
      router.push("/portal-belajar/dashboard");
    } else {
      setError("Login Demo Gagal");
      setErrorDetails("Kredensial lokal tidak terdaftar di database offline. Coba gunakan: admin_adm / admin123");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-20 pb-12 select-none justify-center items-center px-4">
      {/* Premium subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.012)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(44,178,74,0.012)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none -z-10"></div>
      
      {/* Sleek, professional login container card */}
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-neutral-gray/8 shadow-xl relative">
        
        {/* School Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border border-neutral-gray/8 overflow-hidden bg-white shadow-sm flex items-center justify-center p-1.5">
            <img src="/images/logo.jpg" alt="Logo RA Sahabat" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>

        <h2 className="font-baloo text-2xl font-bold text-center text-neutral-dark mb-1.5">Portal RA Sahabat</h2>
        <p className="text-xs text-neutral-gray font-semibold text-center mb-8">Silakan masuk untuk mengakses sistem informasi sekolah.</p>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-neutral-dark space-y-1 animate-fade-in">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
            <p className="text-[10px] text-neutral-gray font-semibold leading-relaxed pl-6">{errorDetails}</p>
            
            {isServerOffline && (
              <div className="pt-2.5 pl-6">
                <button
                  type="button"
                  onClick={handleOfflineBypass}
                  className="py-2 px-3.5 bg-primary-green hover:bg-primary-dark text-white rounded-xl text-[10px] font-extrabold shadow-sm hover:shadow-md transition-all uppercase tracking-wider cursor-pointer"
                >
                  Gunakan Mode Demo (Lokal)
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-2 tracking-wider">Nama Pengguna (Username)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold select-text transition-all"
              placeholder="Masukkan nama pengguna"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-2 tracking-wider">Kata Sandi (Password)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-neutral-gray/12 bg-stone-50 focus:bg-white focus:border-primary-green focus:outline-none text-xs font-semibold select-text transition-all"
                placeholder="Masukkan kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                suppressHydrationWarning
                className="absolute right-3 top-3.5 text-neutral-gray hover:text-neutral-dark focus:outline-none cursor-pointer flex items-center justify-center"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all shadow-sm cursor-pointer select-none active:scale-98 ${
              loading
                ? "bg-neutral-gray/50 text-white cursor-not-allowed"
                : "bg-primary-green hover:bg-primary-dark text-white hover:shadow-md"
            }`}
          >
            {loading ? "Menghubungkan..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
