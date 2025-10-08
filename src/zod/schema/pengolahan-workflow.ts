import { z } from "zod";
import { 
  createKegiatanPengolahanSchema,
  updateKegiatanPengolahanSchema 
} from "./kegiatan-pengolahan";
import { 
  createPenggunaanBahanBakuSchema 
} from "./penggunaan-bahan-baku";
import { 
  createKontrolMutuPengolahanSchema 
} from "./kontrol-mutu-pengolahan";

// Schema untuk memulai kegiatan pengolahan lengkap dengan bahan baku
export const startKegiatanPengolahanSchema = z.object({
  kegiatanPengolahan: createKegiatanPengolahanSchema,
  bahanBaku: z.array(createPenggunaanBahanBakuSchema.omit({ kegiatanPengolahanId: true }))
    .min(1, "Minimal satu bahan baku harus digunakan"),
  kontrolMutuAwal: createKontrolMutuPengolahanSchema
    .omit({ kegiatanPengolahanId: true })
    .extend({
      tahapPengolahan: z.literal("PERSIAPAN_BAHAN"),
    })
    .optional(),
});

// Schema untuk menyelesaikan kegiatan pengolahan dengan kontrol mutu akhir
export const completeKegiatanWithQualityControlSchema = z.object({
  id: z.string().cuid(),
  jamSelesai: z.date(),
  porsiTerealisasi: z.number().min(0, "Porsi terealisasi tidak boleh negatif"),
  statusKegiatan: z.enum(["SELESAI", "DIHENTIKAN", "GAGAL"]),
  catatanProses: z.string().optional(),
  catatanMutu: z.string().optional(),
  kontrolMutuAkhir: createKontrolMutuPengolahanSchema
    .omit({ kegiatanPengolahanId: true })
    .extend({
      tahapPengolahan: z.literal("PENYAJIAN"),
    }),
});

// Schema untuk update kegiatan dengan tambahan bahan baku
export const updateKegiatanWithBahanBakuSchema = z.object({
  kegiatanPengolahan: updateKegiatanPengolahanSchema,
  bahanBakuBaru: z.array(createPenggunaanBahanBakuSchema.omit({ kegiatanPengolahanId: true }))
    .optional(),
  bahanBakuUpdate: z.array(z.object({
    id: z.string().cuid(),
    data: createPenggunaanBahanBakuSchema.partial(),
  })).optional(),
  bahanBakuHapus: z.array(z.string().cuid()).optional(),
});

// Schema untuk laporan kegiatan pengolahan harian
export const laporanKegiatanHarianSchema = z.object({
  sppgId: z.string().cuid(),
  tanggal: z.date(),
  includeDetails: z.boolean().default(true),
  includeBahanBaku: z.boolean().default(true),
  includeKontrolMutu: z.boolean().default(true),
  includeFoto: z.boolean().default(false),
});

// Schema untuk dashboard pengolahan
export const dashboardPengolahanSchema = z.object({
  sppgId: z.string().cuid().optional(),
  tanggalMulai: z.date().optional(),
  tanggalSelesai: z.date().optional(),
  jenisPengolahan: z.enum(["SARAPAN", "MAKAN_SIANG", "MAKAN_MALAM", "SNACK", "KHUSUS"]).optional(),
  statusKegiatan: z.enum(["PERSIAPAN", "BERLANGSUNG", "SELESAI", "DIHENTIKAN", "GAGAL"]).optional(),
  includeMetrics: z.boolean().default(true),
  includeTrends: z.boolean().default(false),
});

// Schema untuk analisis efisiensi pengolahan
export const analisisEfisiensiSchema = z.object({
  sppgId: z.string().cuid(),
  periode: z.enum(["HARIAN", "MINGGUAN", "BULANAN"]),
  tanggalMulai: z.date(),
  tanggalSelesai: z.date(),
  jenisPengolahan: z.enum(["SARAPAN", "MAKAN_SIANG", "MAKAN_MALAM", "SNACK", "KHUSUS"]).optional(),
  metrik: z.array(z.enum([
    "WAKTU_PENGOLAHAN",
    "EFISIENSI_PORSI", 
    "KUALITAS_MUTU",
    "PENGGUNAAN_BAHAN_BAKU",
    "BIAYA_PRODUKSI"
  ])).min(1, "Minimal satu metrik harus dipilih"),
});

// Schema untuk notifikasi pengolahan
export const notifikasiPengolahanSchema = z.object({
  sppgId: z.string().cuid(),
  jenis: z.enum([
    "KEGIATAN_DIMULAI",
    "KEGIATAN_SELESAI", 
    "KONTROL_MUTU_BURUK",
    "BAHAN_BAKU_HABIS",
    "TARGET_TIDAK_TERCAPAI",
    "WAKTU_PENGOLAHAN_MELEBIHI"
  ]),
  prioritas: z.enum(["RENDAH", "SEDANG", "TINGGI", "KRITIS"]),
  pesan: z.string().min(1, "Pesan notifikasi harus diisi"),
  data: z.record(z.string(), z.any()).optional(),
});

// Schema untuk validasi HACCP compliance
export const haccpComplianceSchema = z.object({
  kegiatanPengolahanId: z.string().cuid(),
  checkPoints: z.array(z.object({
    controlPoint: z.string(),
    criticalLimit: z.string(),
    actualValue: z.string(),
    isCompliant: z.boolean(),
    correctiveAction: z.string().optional(),
  })),
  overallCompliance: z.boolean(),
  verifiedBy: z.string().min(1, "Verifikator harus diisi"),
  verificationDate: z.date(),
});

// Type exports
export type StartKegiatanPengolahanData = z.infer<typeof startKegiatanPengolahanSchema>;
export type CompleteKegiatanWithQualityControlData = z.infer<typeof completeKegiatanWithQualityControlSchema>;
export type UpdateKegiatanWithBahanBakuData = z.infer<typeof updateKegiatanWithBahanBakuSchema>;
export type LaporanKegiatanHarianData = z.infer<typeof laporanKegiatanHarianSchema>;
export type DashboardPengolahanData = z.infer<typeof dashboardPengolahanSchema>;
export type AnalisisEfisiensiData = z.infer<typeof analisisEfisiensiSchema>;
export type NotifikasiPengolahanData = z.infer<typeof notifikasiPengolahanSchema>;
export type HaccpComplianceData = z.infer<typeof haccpComplianceSchema>;