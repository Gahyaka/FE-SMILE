import api from "@/lib/api";

export interface ActivityPayload {
  namaKegiatan: string;
  deskripsi: string;
  tanggalKegiatan: string;
  foto?: File;
}

export const activityService = {
  /**
   * Mengambil semua data dokumentasi kegiatan
   */
  async getAll() {
    const response = await api.get("/api/v1/dokumentasi");
    return response.data;
  },

  /**
   * Mengambil detail dokumentasi tunggal
   */
  async getById(id: string | number) {
    const response = await api.get(`/api/v1/dokumentasi/${id}`);
    return response.data;
  },

  /**
   * Mengunggah dokumentasi kegiatan baru (FormData)
   */
  async create(formData: FormData) {
    const response = await api.post("/api/v1/dokumentasi", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Memperbarui detail kegiatan (FormData)
   */
  async update(id: string | number, formData: FormData) {
    const response = await api.put(`/api/v1/dokumentasi/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Menghapus kegiatan secara permanen
   */
  async delete(id: string | number) {
    const response = await api.delete(`/api/v1/dokumentasi/${id}`);
    return response.data;
  },

  /**
   * Menghapus foto spesifik di dalam kegiatan
   */
  async deletePhoto(photoId: string | number) {
    const response = await api.delete(`/api/v1/dokumentasi/foto/${photoId}`);
    return response.data;
  },

  /**
   * Toggle status publikasi kegiatan ke profil luar
   */
  async togglePublic(id: string | number) {
    const response = await api.put(`/api/v1/dokumentasi/${id}/toggle-public`);
    return response.data;
  }
};

export default activityService;
