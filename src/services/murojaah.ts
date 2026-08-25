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

  async getMateri() {
    // Karena backend Adonis tidak menyediakan endpoint materi mandiri, 
    // kita fetch data Kategori yang sudah include array materi di dalamnya.
    const response = await api.get("/api/v1/murojaah/kategori");
    const categories = Array.isArray(response.data) ? response.data : response.data?.data || [];
    
    // Satukan/Flatten semua list materi dari setiap kategori
    const allMaterials = categories.reduce((acc: any[], cat: any) => {
      const materiList = cat.materi || cat.materis || [];
      const mapped = materiList.map((m: any) => ({
        ...m,
        namaMateri: m.nama || m.namaMateri || "Materi Hafalan", // Pastikan key namaMateri terisi
        kategoriId: cat.id,
        kategoriNama: cat.nama
      }));
      return [...acc, ...mapped];
    }, []);

    return allMaterials;
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
