import api from "@/lib/api";

export interface PenilaianPayload {
  siswaId: string | number;
  materiId: string | number;
  predikat: string;
}

export const murojaahService = {
  /**
   * Mengambil semua kategori murojaah
   */
  async getKategori() {
    const response = await api.get("/api/v1/murojaah/kategori");
    return response.data;
  },

  /**
   * Mengambil semua daftar materi hafalan (surah/doa/hadits)
   */
  async getMateri() {
    const response = await api.get("/api/v1/murojaah/materi");
    return response.data;
  },

  /**
   * Mengambil perkembangan lembar murojaah milik satu santri
   */
  async getLembarMurojaah(idSiswa: string | number) {
    const response = await api.get(`/api/v1/murojaah/siswa/${idSiswa}`);
    return response.data;
  },

  /**
   * Mengunggah/Menyimpan penilaian murojaah santri
   */
  async savePenilaian(payload: PenilaianPayload) {
    const response = await api.post("/api/v1/murojaah/penilaian", payload);
    return response.data;
  }
};

export default murojaahService;
