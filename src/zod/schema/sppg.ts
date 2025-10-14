import { z } from "zod";

// SPPG Schema
export const sppgSchema = z.object({
  id: z.string(),
  nama: z.string().min(1, "Nama SPPG harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  kontak: z.string().optional(),
  kapasitasProduksi: z.coerce.number().min(1, "Kapasitas produksi minimal 1 porsi"),
  statusVerifikasi: z.enum(["DRAFT", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"]),
  longitude: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  organisasiId: z.string(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for create (without id and timestamps)
export const createSppgSchema = sppgSchema.omit({
  id: true,
  statusVerifikasi: true, // Will be set to DRAFT by default
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateSppgSchema = sppgSchema.partial().extend({
  id: z.string(),
});

// Schema for verification update (admin only)
export const verifySppgSchema = z.object({
  id: z.string(),
  statusVerifikasi: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
  catatanVerifikasi: z.string().optional(),
});

// Type exports
export type SppgData = z.infer<typeof sppgSchema>;
export type CreateSppgData = z.infer<typeof createSppgSchema>;
export type UpdateSppgData = z.infer<typeof updateSppgSchema>;
export type VerifySppgData = z.infer<typeof verifySppgSchema>;