import { z } from "zod";

// Kontrol Mutu Pengolahan Schema
export const kontrolMutuPengolahanSchema = z.object({
  id: z.string(),
  waktuKontrol: z.coerce.date(),
  tahapPengolahan: z.enum([
    "PERSIAPAN_BAHAN",
    "PENCUCIAN", 
    "PEMOTONGAN",
    "PEMASAKAN",
    "PENYAJIAN",
    "PEMBERSIHAN"
  ]),
  suhu: z.coerce.number().min(-50).max(200).optional(), // Suhu dalam Celsius
  tekstur: z.string().optional(),
  warna: z.string().optional(),
  aroma: z.string().optional(),
  rasa: z.string().optional(),
  kebersihanAlat: z.boolean(),
  higienePetugas: z.boolean(),
  statusMutu: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "PERLU_PERBAIKAN", "DITOLAK"]),
  tindakanKoreksi: z.string().optional(),
  fotoEvidence: z.array(z.string()),
  petugasKontrol: z.string().min(1, "Petugas kontrol harus diisi"),
  kegiatanPengolahanId: z.string(),
  createdAt: z.coerce.date(),
});

// Schema for create (without id and timestamps)
export const createKontrolMutuPengolahanSchema = kontrolMutuPengolahanSchema.omit({
  id: true,
  createdAt: true,
});

// Schema for update (id required, other fields optional)
export const updateKontrolMutuPengolahanSchema = kontrolMutuPengolahanSchema.partial().extend({
  id: z.string(),
});

// Schema for quick quality check (simplified)
export const quickQualityCheckSchema = z.object({
  kegiatanPengolahanId: z.string(),
  tahapPengolahan: z.enum([
    "PERSIAPAN_BAHAN",
    "PENCUCIAN", 
    "PEMOTONGAN",
    "PEMASAKAN",
    "PENYAJIAN",
    "PEMBERSIHAN"
  ]),
  kebersihanAlat: z.boolean(),
  higienePetugas: z.boolean(),
  statusMutu: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "PERLU_PERBAIKAN", "DITOLAK"]),
  petugasKontrol: z.string().min(1, "Petugas kontrol harus diisi"),
  catatan: z.string().optional(),
});

// Schema for detailed quality assessment
export const detailedQualityAssessmentSchema = z.object({
  kegiatanPengolahanId: z.string(),
  tahapPengolahan: z.enum([
    "PERSIAPAN_BAHAN",
    "PENCUCIAN", 
    "PEMOTONGAN",
    "PEMASAKAN",
    "PENYAJIAN",
    "PEMBERSIHAN"
  ]),
  suhu: z.coerce.number().min(-50).max(200).optional(),
  sensorikCheck: z.object({
    tekstur: z.string().min(1, "Penilaian tekstur harus diisi"),
    warna: z.string().min(1, "Penilaian warna harus diisi"),
    aroma: z.string().min(1, "Penilaian aroma harus diisi"),
    rasa: z.string().optional(), // Optional karena tidak semua tahap memerlukan test rasa
  }),
  hygieneCheck: z.object({
    kebersihanAlat: z.boolean(),
    higienePetugas: z.boolean(),
    kondisiLingkungan: z.string().optional(),
  }),
  statusMutu: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "PERLU_PERBAIKAN", "DITOLAK"]),
  tindakanKoreksi: z.string().optional(),
  fotoEvidence: z.array(z.string()).min(1, "Minimal satu foto evidence diperlukan"),
  petugasKontrol: z.string().min(1, "Petugas kontrol harus diisi"),
});

// Schema for corrective action
export const correctiveActionSchema = z.object({
  id: z.string(),
  tindakanKoreksi: z.string().min(1, "Tindakan koreksi harus diisi"),
  statusMutu: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "PERLU_PERBAIKAN", "DITOLAK"]),
  fotoEvidence: z.array(z.string()).optional(),
});

// Schema for quality control report
export const qualityControlReportSchema = z.object({
  kegiatanPengolahanId: z.string().optional(),
  sppgId: z.string().optional(),
  tanggalMulai: z.coerce.date(),
  tanggalSelesai: z.coerce.date(),
  tahapPengolahan: z.enum([
    "PERSIAPAN_BAHAN",
    "PENCUCIAN", 
    "PEMOTONGAN",
    "PEMASAKAN",
    "PENYAJIAN",
    "PEMBERSIHAN"
  ]).optional(),
  statusMutu: z.enum(["SANGAT_BAIK", "BAIK", "CUKUP", "PERLU_PERBAIKAN", "DITOLAK"]).optional(),
  petugasKontrol: z.string().optional(),
  includePhotos: z.boolean().default(false),
});

// Schema for quality trend analysis
export const qualityTrendAnalysisSchema = z.object({
  sppgId: z.string(),
  periode: z.enum(["HARIAN", "MINGGUAN", "BULANAN"]),
  tanggalMulai: z.coerce.date(),
  tanggalSelesai: z.coerce.date(),
  tahapPengolahan: z.enum([
    "PERSIAPAN_BAHAN",
    "PENCUCIAN", 
    "PEMOTONGAN",
    "PEMASAKAN",
    "PENYAJIAN",
    "PEMBERSIHAN"
  ]).optional(),
});

// Type exports
export type KontrolMutuPengolahanData = z.infer<typeof kontrolMutuPengolahanSchema>;
export type CreateKontrolMutuPengolahanData = z.infer<typeof createKontrolMutuPengolahanSchema>;
export type UpdateKontrolMutuPengolahanData = z.infer<typeof updateKontrolMutuPengolahanSchema>;
export type QuickQualityCheckData = z.infer<typeof quickQualityCheckSchema>;
export type DetailedQualityAssessmentData = z.infer<typeof detailedQualityAssessmentSchema>;
export type CorrectiveActionData = z.infer<typeof correctiveActionSchema>;
export type QualityControlReportData = z.infer<typeof qualityControlReportSchema>;
export type QualityTrendAnalysisData = z.infer<typeof qualityTrendAnalysisSchema>;