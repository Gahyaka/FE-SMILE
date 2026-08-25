import api from "@/lib/api";

export interface ClassPayload {
  namaKelas: string;
  tahunAjaran: string;
  waliKelas?: string;
  guru_id?: string | number;
  guruId?: string | number;
}

export const classService = {
  /**
   * Mengambil daftar semua kelas dari backend Adonis
   */
  async getAll() {
    const response = await api.get("/api/v1/kelas");
    return response.data;
  },

  /**
   * Membuat kelas baru
   */
  async create(payload: ClassPayload) {
    const response = await api.post("/api/v1/kelas", payload);
    return response.data;
  },

  /**
   * Memperbarui detail kelas
   */
  async update(id: string | number, payload: Partial<ClassPayload>) {
    const response = await api.put(`/api/v1/kelas/${id}`, payload);
    return response.data;
  },

  /**
   * Menghapus kelas secara permanen
   */
  async delete(id: string | number) {
    const response = await api.delete(`/api/v1/kelas/${id}`);
    return response.data;
  }
};
