import api from "@/lib/api";
import { RegisterPayload } from "./auth";

export const userService = {
  /**
   * Mengambil daftar semua pengguna/petugas (Admin & Guru)
   */
  async getAll() {
    // Kita coba fetch dari backend, jika backend belum mendukung list user,
    // interceptor global atau catch block akan mengamankan dengan fallback ke localStorage
    const response = await api.get("/api/v1/users");
    return response.data;
  },

  /**
   * Mendaftarkan petugas baru
   */
  async create(payload: RegisterPayload) {
    const response = await api.post("/api/v1/auth/register", payload);
    return response.data;
  },

  async resetPassword(id: string | number, passwordBaru: string) {
    // Route: PUT /api/v1/users/:id/reset-password
    // User diidentifikasi melalui :id — field "username" di body dihilangkan
    // karena menyebabkan backend mengupdate username di DB dan merusak login
    const response = await api.put(`/api/v1/users/${id}/reset-password`, {
      newPassword: passwordBaru
    });
    return response.data;
  },

  /**
   * Menghapus akun pengguna secara permanen
   */
  async delete(id: string | number) {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  }
};
