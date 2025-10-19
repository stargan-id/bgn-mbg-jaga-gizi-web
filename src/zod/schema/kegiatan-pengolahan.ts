import { z } from "zod";

// Kegiatan Pengolahan Schema
export const kegiatanPengolahanSchema = z.object({
  id: z.string(),
  tanggalPengolahan: z.date(),
  jamMulai: z.date(),
  jamSelesai: z.date(),
  jenisPengolahan: z.enum(["SARAPAN", "MAKAN_SIANG", "MAKAN_MALAM", "SNACK", "KHUSUS"]),
  targetPorsi: z.number().min(1, "Target porsi minimal 1"),
  porsiTerealisasi: z.number().min(0).optional().nullable(),
  suhuPengolahan: z.number().min(-50).max(200).optional().nullable(), // Suhu dalam Celsius
  metodePengolahan: z.string().min(1, "Metode pengolahan harus diisi"),
  penanggungJawab: z.string().min(1, "Penanggung jawab harus diisi"),
  statusKegiatan: z.enum(["PERSIAPAN", "BERLANGSUNG", "SELESAI", "DIHENTIKAN", "GAGAL"]),
  catatanProses: z.string().optional().nullable(),
  catatanMutu: z.string().optional().nullable(),
  fotoProses: z.array(z.string()),
  sppgId: z.string(),
  menuHarianId: z.string(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

// Schema for create (without id and timestamps)
export const createKegiatanPengolahanSchema = kegiatanPengolahanSchema.omit({
  id: true,
  // statusKegiatan: true, // Will be set to BERLANGSUNG by default
  // jamSelesai: true, // Will be set when activity is completed
  // porsiTerealisasi: true, // Will be updated during/after processing
  createdBy: true,
  createdAt: true,
  updatedBy: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateKegiatanPengolahanSchema = kegiatanPengolahanSchema.partial().extend({
  id: z.string(),
});

// Schema for completing activity
export const completeKegiatanPengolahanSchema = z.object({
  id: z.string(),
  jamSelesai: z.date(),
  porsiTerealisasi: z.number().min(0, "Porsi terealisasi tidak boleh negatif"),
  statusKegiatan: z.enum(["SELESAI", "DIHENTIKAN", "GAGAL"]),
  catatanProses: z.string().optional(),
  catatanMutu: z.string().optional(),
});

// Schema for status update only
export const updateStatusKegiatanSchema = z.object({
  id: z.string(),
  statusKegiatan: z.enum(["PERSIAPAN", "BERLANGSUNG", "SELESAI", "DIHENTIKAN", "GAGAL"]),
  catatan: z.string().optional(),
});

// Schema for filtering/searching
export const filterKegiatanPengolahanSchema = z.object({
  sppgId: z.string().optional(),
  tanggalMulai: z.date().optional(),
  tanggalSelesai: z.date().optional(),
  jenisPengolahan: z.enum(["SARAPAN", "MAKAN_SIANG", "MAKAN_MALAM", "SNACK", "KHUSUS"]).optional(),
  statusKegiatan: z.enum(["PERSIAPAN", "BERLANGSUNG", "SELESAI", "DIHENTIKAN", "GAGAL"]).optional(),
  penanggungJawab: z.string().optional(),
});

// Type exports
export type KegiatanPengolahanData = z.infer<typeof kegiatanPengolahanSchema>;
export type CreateKegiatanPengolahanData = z.infer<typeof createKegiatanPengolahanSchema>;
export type UpdateKegiatanPengolahanData = z.infer<typeof updateKegiatanPengolahanSchema>;
export type CompleteKegiatanPengolahanData = z.infer<typeof completeKegiatanPengolahanSchema>;
export type UpdateStatusKegiatanData = z.infer<typeof updateStatusKegiatanSchema>;
export type FilterKegiatanPengolahanData = z.infer<typeof filterKegiatanPengolahanSchema>;