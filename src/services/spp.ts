import api from "@/lib/api";

export interface SppPayload {
  siswaId: string;
  tanggalBayar: string;
  nominalSpp: number;
  nominalLes: number;
  catatan: string;
  statusSetoran: string;
  paidMonths?: string[];
}

export const sppService = {
  /**
   * Mengambil daftar transaksi pembayaran SPP & Les
   */
  async getAll(tahun: string = "2026") {
    const response = await api.get(`/api/v1/pembayaran-spp-les?tahun=${tahun}`);
    return response.data;
  },

  /**
   * Mencatat transaksi pembayaran baru
   */
  async create(payload: SppPayload) {
    const response = await api.post("/api/v1/pembayaran-spp-les", payload);
    return response.data;
  },

  /**
   * Memperbarui transaksi pembayaran
   */
  async update(id: string | number, payload: Partial<SppPayload>) {
    const response = await api.put(`/api/v1/pembayaran-spp-les/${id}`, payload);
    return response.data;
  },

  /**
   * Menghapus transaksi pembayaran
   */
  async delete(id: string | number) {
    const response = await api.delete(`/api/v1/pembayaran-spp-les/${id}`);
    return response.data;
  }
};
