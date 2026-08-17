import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://be-smile-production.up.railway.app";

// Membuat instance axios dengan konfigurasi default
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan Bearer token ke setiap request secara otomatis
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk mendeteksi error global (seperti token kadaluarsa / 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Hapus session lokal jika token kadaluarsa / tidak valid
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_session");
        
        // Redirect ke portal-belajar login jika sedang di dalam dashboard
        if (window.location.pathname.startsWith("/portal-belajar/dashboard")) {
          window.location.href = "/portal-belajar";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
