import api from "@/lib/api";

export interface TabunganPayload {
  siswaId?: string | number;
  siswa_id?: string | number;
  jenisMutasi?: "DEBET" | "KREDIT" | string;
  jenis_mutasi?: "DEBET" | "KREDIT" | string;
  nominal: number;
  catatan: string;
  tanggalBayar?: string;
  tanggal_bayar?: string;
}

export const tabunganService = {
  /**
   * Mengambil mutasi tabungan berdasarkan ID Siswa
   */
  async getBySiswaId(siswaId: string | number) {
    const response = await api.get(`/api/v1/tabungan/siswa/${siswaId}`);
    return response.data;
  },

  /**
   * Mencatat transaksi mutasi tabungan baru (Setoran/Penarikan)
   */
  async create(payload: TabunganPayload) {
    const response = await api.post("/api/v1/tabungan/mutasi", payload);
    return response.data;
  },

  /**
   * Menghapus transaksi mutasi tabungan
   */
  async delete(id: string | number) {
    const response = await api.delete(`/api/v1/tabungan/mutasi/${id}`);
    return response.data;
  }
};

export default tabunganService;
