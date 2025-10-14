import { z } from "zod";

// Pemasok Schema
export const pemasokSchema = z.object({
  id: z.string(),
  nama: z.string().min(1, "Nama pemasok harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  kontak: z.string().optional(),
  jenisPemasok: z.enum([
    "SAYURAN",
    "DAGING", 
    "IKAN",
    "BERAS_BIJI",
    "BUMBU_REMPAH",
    "LAINNYA"
  ]),
  statusAktif: z.enum(["AKTIF", "NON_AKTIF", "DIBUBARKAN"]),
  sertifikat: z.array(z.string()),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for create (without id and timestamps)
export const createPemasokSchema = pemasokSchema.omit({
  id: true,
  statusAktif: true, // Will be set to AKTIF by default
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updatePemasokSchema = pemasokSchema.partial().extend({
  id: z.string(),
});

// Type exports
export type PemasokData = z.infer<typeof pemasokSchema>;
export type CreatePemasokData = z.infer<typeof createPemasokSchema>;
export type UpdatePemasokData = z.infer<typeof updatePemasokSchema>;