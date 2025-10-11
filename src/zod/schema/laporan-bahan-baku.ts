import { z } from "zod";

// Laporan Bahan Baku Schema
export const laporanBahanBakuSchema = z.object({
  id: z.string().cuid(),
  tanggal: z.coerce.date(),
  namaBahan: z.string().min(1, "Nama bahan harus diisi"),
  jenisBahan: z.enum([
    "PROTEIN_HEWANI",
    "PROTEIN_NABATI", 
    "KARBOHIDRAT",
    "SAYURAN",
    "BUAH",
    "BUMBU_REMPAH",
    "MINYAK_LEMAK",
    "LAINNYA"
  ]),
  jumlah: z.number().min(0.1, "Jumlah harus lebih dari 0"),
  satuan: z.string().min(1, "Satuan harus diisi"),
  tanggalExpiry: z.coerce.date().optional(),
  kondisiBahan: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "BURUK"]),
  suhuPenerimaan: z.number().optional(),
  // fotoEvidence: z.array(z.string()).min(1, "Minimal 1 foto bukti harus diunggah"),
  catatan: z.string().optional(),
  sppgId: z.string(),
  pemasokId: z.string(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Schema for create (without id and timestamps)
export const createLaporanBahanBakuSchema = laporanBahanBakuSchema.omit({
  id: true,
  sppgId: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateLaporanBahanBakuSchema = laporanBahanBakuSchema.partial().extend({
  id: z.string().cuid(),
});

// Schema for bulk create (multiple ingredients at once)
export const createBulkLaporanBahanBakuSchema = z.object({
  tanggal: z.coerce.date(),
  sppgId: z.string().cuid(),
  pemasokId: z.string().cuid(),
  bahanBaku: z.array(
    z.object({
      namaBahan: z.string().min(1, "Nama bahan harus diisi"),
      jenisBahan: z.enum([
        "PROTEIN_HEWANI",
        "PROTEIN_NABATI", 
        "KARBOHIDRAT",
        "SAYURAN",
        "BUAH",
        "BUMBU_REMPAH",
        "MINYAK_LEMAK",
        "LAINNYA"
      ]),
      jumlah: z.number().min(0.1, "Jumlah harus lebih dari 0"),
      satuan: z.string().min(1, "Satuan harus diisi"),
      tanggalExpiry: z.date().optional(),
      kondisiBahan: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "BURUK"]),
      suhuPenerimaan: z.number().optional(),
      fotoEvidence: z.array(z.string()).min(1, "Minimal 1 foto bukti harus diunggah"),
      catatan: z.string().optional(),
    })
  ).min(1, "Minimal 1 bahan baku harus diisi"),
});

// Type exports
export type LaporanBahanBakuData = z.infer<typeof laporanBahanBakuSchema>;
export type CreateLaporanBahanBakuData = z.infer<typeof createLaporanBahanBakuSchema>;
export type UpdateLaporanBahanBakuData = z.infer<typeof updateLaporanBahanBakuSchema>;
export type CreateBulkLaporanBahanBakuData = z.infer<typeof createBulkLaporanBahanBakuSchema>;