"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear any existing session when returning to login page
    localStorage.removeItem("user_session");
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      // Mock validation
      if (username === "admin" && password === "admin123") {
        localStorage.setItem(
          "user_session",
          JSON.stringify({ role: "admin", name: "Administrator" })
        );
        router.push("/portal-belajar/dashboard");
      } else if (username === "walikelas" && password === "walikelas123") {
        localStorage.setItem(
          "user_session",
          JSON.stringify({ role: "walikelas", name: "Ibu Guru Halimah (Wali Kelas)" })
        );
        router.push("/portal-belajar/dashboard");
      } else {
        setError("Nama pengguna atau kata sandi salah. Silakan coba lagi!");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen text-neutral-dark bg-[#FAF8F5] pt-24 pb-12 select-none justify-center items-center px-4">
      {/* Background Chalkboard grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(44,178,74,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(44,178,74,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10"></div>
      
      {/* Decorative stars */}
      <div className="absolute top-16 left-12 text-warm-yellow/20 text-5xl font-bold hidden md:block animate-pulse">★</div>
      <div className="absolute bottom-20 right-16 text-primary-green/15 text-5xl font-bold hidden md:block">★</div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[35px_15px_30px_20px]/[20px_30px_15px_35px] border-2 border-dashed border-primary-green/30 shadow-md relative">
        {/* Notebook grid watermark */}
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(44,178,74,0.01)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none rounded-[35px_15px_30px_20px]/[20px_30px_15px_35px]"></div>
        
        {/* School Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-primary-green overflow-hidden bg-white shadow-xs">
            <img src="/images/logo.jpg" alt="Logo RA Sahabat" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="font-baloo text-2xl font-bold text-center text-neutral-dark mb-1 relative z-10">Portal RA Sahabat</h2>
        <p className="text-xs text-neutral-gray font-bold text-center mb-8 relative z-10">Silakan masuk untuk mengakses sistem informasi sekolah.</p>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-accent/10 border border-accent/25 text-xs text-accent font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5 relative z-10">
          <div>
            <label htmlFor="username" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Nama Pengguna (Username)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-xs transition-colors font-semibold select-text"
              placeholder="Masukkan nama pengguna"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-extrabold uppercase text-neutral-gray mb-1.5 tracking-wide">Kata Sandi (Password)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border-2 border-primary-green/20 focus:border-primary-green focus:outline-none text-xs transition-colors font-semibold select-text"
              placeholder="Masukkan kata sandi"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning
            className={`w-full py-3.5 rounded-[15px_35px_15px_40px]/[40px_15px_35px_15px] font-extrabold text-xs transition-all border-2 border-primary-dark shadow-md cursor-pointer ${
              loading
                ? "bg-neutral-gray text-white cursor-not-allowed"
                : "bg-accent hover:bg-accent-dark text-white hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Menghubungkan..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
