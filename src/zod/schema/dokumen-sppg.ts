import { z } from "zod";

// Dokumen SPPG Schema
export const dokumenSppgSchema = z.object({
  id: z.string(),
  jenisDokumen: z.enum([
    "SLHS", 
    "SERTIFIKAT_HALAL", 
    "FOOD_HANDLER_CERTIFICATE", 
    "DENAH_DAPUR", 
    "SIUP", 
    "IZIN_OPERASIONAL", 
    "LAINNYA"
  ]),
  namaDokumen: z.string().min(1, "Nama dokumen harus diisi"),
  nomorDokumen: z.string().optional(),
  tanggalTerbit: z.date(),
  tanggalExpiry: z.date().optional(),
  filePath: z.string().min(1, "File harus diunggah"),
  statusDokumen: z.enum(["PENDING", "APPROVED", "REJECTED", "EXPIRED"]),
  catatanReview: z.string().optional(),
  sppgId: z.string(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Schema for create (without id and timestamps)
export const createDokumenSppgSchema = dokumenSppgSchema.omit({
  id: true,
  statusDokumen: true, // Will be set to PENDING by default
  catatanReview: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateDokumenSppgSchema = dokumenSppgSchema.partial().extend({
  id: z.string(),
});

// Schema for document review (admin only)
export const reviewDokumenSchema = z.object({
  id: z.string(),
  statusDokumen: z.enum(["APPROVED", "REJECTED"]),
  catatanReview: z.string().min(1, "Catatan review harus diisi"),
});

// Type exports
export type DokumenSppgData = z.infer<typeof dokumenSppgSchema>;
export type CreateDokumenSppgData = z.infer<typeof createDokumenSppgSchema>;
export type UpdateDokumenSppgData = z.infer<typeof updateDokumenSppgSchema>;
export type ReviewDokumenData = z.infer<typeof reviewDokumenSchema>;