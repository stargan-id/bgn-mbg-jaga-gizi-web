import { z } from "zod";

// Penggunaan Bahan Baku Schema
export const penggunaanBahanBakuSchema = z.object({
  id: z.string(),
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
  jumlahDigunakan: z.coerce.number().min(0.01, "Jumlah yang digunakan harus lebih dari 0"),
  satuan: z.string().min(1, "Satuan harus diisi"),
  batchNumber: z.string().optional(),
  tanggalExpiry: z.coerce.date().optional(),
  kondisiBahan: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "BURUK"]),
  sumberBahan: z.string().optional(),
  catatanPenggunaan: z.string().optional(),
  kegiatanPengolahanId: z.string(),
  laporanBahanBakuId: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for create (without id and timestamps)
export const createPenggunaanBahanBakuSchema = penggunaanBahanBakuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updatePenggunaanBahanBakuSchema = penggunaanBahanBakuSchema.partial().extend({
  id: z.string(),
});

// Schema for bulk create (array of penggunaan bahan baku)
export const bulkCreatePenggunaanBahanBakuSchema = z.object({
  kegiatanPengolahanId: z.string(),
  bahanBaku: z.array(createPenggunaanBahanBakuSchema.omit({ kegiatanPengolahanId: true }))
    .min(1, "Minimal satu bahan baku harus digunakan"),
});

// Schema for validating stock availability
export const validateStockSchema = z.object({
  laporanBahanBakuId: z.string(),
  jumlahDigunakan: z.coerce.number().min(0.01, "Jumlah yang digunakan harus lebih dari 0"),
});

// Schema for traceability query
export const traceabilityQuerySchema = z.object({
  kegiatanPengolahanId: z.string().optional(),
  laporanBahanBakuId: z.string().optional(),
  namaBahan: z.string().optional(),
  batchNumber: z.string().optional(),
  tanggalMulai: z.coerce.date().optional(),
  tanggalSelesai: z.coerce.date().optional(),
});

// Schema for usage statistics
export const usageStatisticsSchema = z.object({
  sppgId: z.string().optional(),
  jenisBahan: z.enum([
    "PROTEIN_HEWANI",
    "PROTEIN_NABATI", 
    "KARBOHIDRAT",
    "SAYURAN",
    "BUAH",
    "BUMBU_REMPAH",
    "MINYAK_LEMAK",
    "LAINNYA"
  ]).optional(),
  tanggalMulai: z.coerce.date(),
  tanggalSelesai: z.coerce.date(),
  groupBy: z.enum(["HARIAN", "MINGGUAN", "BULANAN"]).default("HARIAN"),
});

// Type exports
export type PenggunaanBahanBakuData = z.infer<typeof penggunaanBahanBakuSchema>;
export type CreatePenggunaanBahanBakuData = z.infer<typeof createPenggunaanBahanBakuSchema>;
export type UpdatePenggunaanBahanBakuData = z.infer<typeof updatePenggunaanBahanBakuSchema>;
export type BulkCreatePenggunaanBahanBakuData = z.infer<typeof bulkCreatePenggunaanBahanBakuSchema>;
export type ValidateStockData = z.infer<typeof validateStockSchema>;
export type TraceabilityQueryData = z.infer<typeof traceabilityQuerySchema>;
export type UsageStatisticsData = z.infer<typeof usageStatisticsSchema>;