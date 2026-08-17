import api from "@/lib/api";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  nama: string;
  username: string;
  password: string;
  role: "ADMIN_ADMINISTRASI" | "ADMIN_TRANSAKSI" | "GURU" | "ADMIN";
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const authService = {
  /**
   * Melakukan autentikasi masuk ke dashboard
   */
  async login(payload: LoginPayload) {
    const response = await api.post("/api/v1/auth/login", payload);
    return response.data; // Biasanya mengembalikan object berisi token JWT
  },

  /**
   * Mengambil data profil user yang sedang aktif login (verifikasi token)
   */
  async getMe() {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },

  /**
   * Mendaftarkan akun petugas baru (Admin only)
   */
  async register(payload: RegisterPayload) {
    const response = await api.post("/api/v1/auth/register", payload);
    return response.data;
  },

  /**
   * Mengubah kata sandi mandiri (self profile change password)
   */
  async changePassword(payload: ChangePasswordPayload) {
    const response = await api.put("/api/v1/auth/change-password", payload);
    return response.data;
  },

  /**
   * Melakukan logout untuk membersihkan sesi di server
   */
  async logout() {
    const response = await api.post("/api/v1/auth/logout");
    return response.data;
  }
};

export default authService;
