import api from "@/lib/api";

export interface StudentPayload {
  namaLengkap: string;
  namaOrangTua: string;
  nisn: string;
  nis: string;
  kelasId: string | null;
  alamat?: string;
  tinggiBadan?: number;
  beratBadan?: number;
  lingkarKepala?: number;
  semester?: string;
  tahunAjaran?: string;
  activeStatus?: string;
}

export const studentService = {
  /**
   * Mengambil daftar semua siswa dari backend Adonis
   */
  async getAll() {
    const response = await api.get("/api/v1/siswa");
    return response.data;
  },

  /**
   * Mendaftarkan/Menambahkan siswa baru (Offline)
   */
  async create(payload: StudentPayload) {
    const response = await api.post("/api/v1/siswa", payload);
    return response.data;
  },

  /**
   * Memperbarui profil/data tumbuh kembang siswa
   */
  async update(id: number, payload: Partial<StudentPayload>) {
    const response = await api.put(`/api/v1/siswa/${id}`, payload);
    return response.data;
  },

  /**
   * Menghapus data siswa secara permanen
   */
  async delete(id: number) {
    const response = await api.delete(`/api/v1/siswa/${id}`);
    return response.data;
  }
};
