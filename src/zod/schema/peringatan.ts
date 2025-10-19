import { z } from "zod";
import { JenisPeringatan, TingkatPrioritas, StatusPeringatan } from "@prisma/client";

// Schema untuk data peringatan
export const peringatanSchema = z.object({
  id: z.string(),
  judul: z.string().min(1, "Judul peringatan harus diisi"),
  deskripsi: z.string().min(1, "Deskripsi peringatan harus diisi"),
  jenisPeringatan: z.nativeEnum(JenisPeringatan),
  tingkatPrioritas: z.nativeEnum(TingkatPrioritas),
  statusPeringatan: z.nativeEnum(StatusPeringatan),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  dataKonteks: z.any().optional(), // JSON data
  sppgId: z.string().optional(),
  organisasiId: z.string().optional(),
  batasWaktuTindakan: z.date().optional(),
  tindakanDilakukan: z.string().optional(),
  hasilTindakan: z.string().optional(),
  autoResolve: z.boolean().default(false),
  resolvedAt: z.date().optional(),
  resolvedBy: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Schema untuk create peringatan
export const createPeringatanSchema = peringatanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
  resolvedBy: true,
}).extend({
  // Override default values
  statusPeringatan: z.nativeEnum(StatusPeringatan).default(StatusPeringatan.AKTIF),
  autoResolve: z.boolean().default(false),
});

// Schema untuk update peringatan
export const updatePeringatanSchema = peringatanSchema.partial().extend({
  id: z.string(),
});

// Schema untuk filter peringatan
export const filterPeringatanSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  jenisPeringatan: z.nativeEnum(JenisPeringatan).optional(),
  tingkatPrioritas: z.nativeEnum(TingkatPrioritas).optional(),
  statusPeringatan: z.nativeEnum(StatusPeringatan).optional(),
  sppgId: z.string().optional(),
  organisasiId: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  showResolved: z.boolean().default(false), // Default hanya tampilkan yang belum resolved
});

// Schema untuk notifikasi peringatan
export const notifikasiPeringatanSchema = z.object({
  id: z.string(),
  peringatanId: z.string(),
  userId: z.string(),
  dibaca: z.boolean().default(false),
  dibacaAt: z.date().optional(),
  dismiss: z.boolean().default(false),
  dismissAt: z.date().optional(),
  channelEmail: z.boolean().default(true),
  channelInApp: z.boolean().default(true),
  createdAt: z.date(),
});

// Schema untuk mark notifikasi sebagai dibaca
export const markNotifikasiSchema = z.object({
  notifikasiIds: z.array(z.string()).min(1, "Minimal satu notifikasi harus dipilih"),
  action: z.enum(["read", "dismiss", "undismiss"]),
});

// Schema untuk aturan peringatan otomatis
export const aturanPeringatanSchema = z.object({
  id: z.string(),
  namaAturan: z.string().min(1, "Nama aturan harus diisi"),
  deskripsi: z.string().optional(),
  jenisPeringatan: z.nativeEnum(JenisPeringatan),
  tingkatPrioritas: z.nativeEnum(TingkatPrioritas),
  kondisiTrigger: z.any(), // JSON untuk fleksibilitas
  templateJudul: z.string().min(1, "Template judul harus diisi"),
  templateDeskripsi: z.string().min(1, "Template deskripsi harus diisi"),
  statusAktif: z.boolean().default(true),
  autoResolve: z.boolean().default(false),
  batasWaktuDefault: z.number().min(1).optional(), // dalam jam
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Type exports
export type PeringatanData = z.infer<typeof peringatanSchema>;
export type CreatePeringatanData = z.infer<typeof createPeringatanSchema>;
export type UpdatePeringatanData = z.infer<typeof updatePeringatanSchema>;
export type FilterPeringatanData = z.infer<typeof filterPeringatanSchema>;
export type NotifikasiPeringatanData = z.infer<typeof notifikasiPeringatanSchema>;
export type MarkNotifikasiData = z.infer<typeof markNotifikasiSchema>;
export type AturanPeringatanData = z.infer<typeof aturanPeringatanSchema>;

// Helper untuk konversi prioritas ke warna
export const getPriorityColor = (priority: TingkatPrioritas): string => {
  switch (priority) {
    case TingkatPrioritas.KRITIS:
      return "bg-red-100 text-red-800 border-red-200";
    case TingkatPrioritas.TINGGI:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case TingkatPrioritas.SEDANG:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case TingkatPrioritas.RENDAH:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case TingkatPrioritas.INFO:
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Helper untuk konversi jenis peringatan ke icon
export const getAlertTypeIcon = (type: JenisPeringatan): string => {
  switch (type) {
    case JenisPeringatan.KEPATUHAN_OPERASIONAL:
      return "FileX";
    case JenisPeringatan.KEAMANAN_PANGAN:
      return "ShieldAlert";
    case JenisPeringatan.STANDAR_GIZI:
      return "Apple";
    case JenisPeringatan.DOKUMEN_KEPATUHAN:
      return "FileWarning";
    case JenisPeringatan.KUALITAS_BAHAN:
      return "Package";
    case JenisPeringatan.KAPASITAS_PRODUKSI:
      return "TrendingDown";
    case JenisPeringatan.SISTEM_TEKNIS:
      return "Server";
    case JenisPeringatan.AUDIT_INSPEKSI:
      return "Search";
    case JenisPeringatan.PELATIHAN_SDM:
      return "Users";
    case JenisPeringatan.REGULASI_KEBIJAKAN:
      return "Scale";
    default:
      return "AlertTriangle";
  }
};

// Helper untuk mendapatkan label yang user-friendly
export const getJenisPeringatanLabel = (type: JenisPeringatan): string => {
  switch (type) {
    case JenisPeringatan.KEPATUHAN_OPERASIONAL:
      return "Kepatuhan Operasional";
    case JenisPeringatan.KEAMANAN_PANGAN:
      return "Keamanan Pangan";
    case JenisPeringatan.STANDAR_GIZI:
      return "Standar Gizi";
    case JenisPeringatan.DOKUMEN_KEPATUHAN:
      return "Dokumen Kepatuhan";
    case JenisPeringatan.KUALITAS_BAHAN:
      return "Kualitas Bahan";
    case JenisPeringatan.KAPASITAS_PRODUKSI:
      return "Kapasitas Produksi";
    case JenisPeringatan.SISTEM_TEKNIS:
      return "Sistem Teknis";
    case JenisPeringatan.AUDIT_INSPEKSI:
      return "Audit & Inspeksi";
    case JenisPeringatan.PELATIHAN_SDM:
      return "Pelatihan SDM";
    case JenisPeringatan.REGULASI_KEBIJAKAN:
      return "Regulasi & Kebijakan";
    default:
      return "Lainnya";
  }
};

export const getTingkatPrioritasLabel = (priority: TingkatPrioritas): string => {
  switch (priority) {
    case TingkatPrioritas.KRITIS:
      return "Kritis";
    case TingkatPrioritas.TINGGI:
      return "Tinggi";
    case TingkatPrioritas.SEDANG:
      return "Sedang";
    case TingkatPrioritas.RENDAH:
      return "Rendah";
    case TingkatPrioritas.INFO:
      return "Info";
    default:
      return "Tidak Diketahui";
  }
};

export const getStatusPeringatanLabel = (status: StatusPeringatan): string => {
  switch (status) {
    case StatusPeringatan.AKTIF:
      return "Aktif";
    case StatusPeringatan.DITINDAKLANJUTI:
      return "Ditindaklanjuti";
    case StatusPeringatan.SELESAI:
      return "Selesai";
    case StatusPeringatan.DIABAIKAN:
      return "Diabaikan";
    case StatusPeringatan.KADALUARSA:
      return "Kadaluarsa";
    default:
      return "Tidak Diketahui";
  }
};