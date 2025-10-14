import { z } from "zod";

// Organisasi Schema (extending existing)
export const organisasiSchema = z.object({
  id: z.string(),
  nama: z.string().min(1, "Nama organisasi harus diisi"),
  singkatan: z.string().optional(),
  status: z.enum(["AKTIF", "NON_AKTIF", "DIBUBARKAN"]),
  tingkat: z.coerce.number().int().optional(),
  indukOrganisasiId: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Schema for create (without id and timestamps)
export const createOrganisasiSchema = organisasiSchema.omit({
  id: true,
  status: true, // Will be set to AKTIF by default
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateOrganisasiSchema = organisasiSchema.partial().extend({
  id: z.string(),
});

// Log Aktivitas Schema
export const logAktivitasSchema = z.object({
  id: z.string(),
  entityType: z.string().min(1, "Tipe entitas harus diisi"),
  entityId: z.string(),
  action: z.string().min(1, "Aksi harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  oldData: z.record(z.string(), z.any()).optional(),
  newData: z.record(z.string(), z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  userId: z.string(),
  createdAt: z.coerce.date(),
});

// Schema for create (without id and timestamps)
export const createLogAktivitasSchema = logAktivitasSchema.omit({
  id: true,
  createdAt: true,
});

// Dashboard Analytics Schema
export const dashboardAnalyticsSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  organisasiId: z.string().optional(),
  sppgId: z.string().optional(),
});

// Compliance Report Schema
export const complianceReportSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  organisasiIds: z.array(z.string()).optional(),
  sppgIds: z.array(z.string()).optional(),
  includeDetails: z.boolean().default(false),
  format: z.enum(["PDF", "EXCEL", "CSV"]).default("PDF"),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: "File harus berupa instance File" }),
  folder: z.string().optional(),
  allowedTypes: z.array(z.string()).optional(),
  maxSize: z.coerce.number().optional(), // in bytes
});

// Bulk Operations Schema
export const bulkOperationSchema = z.object({
  operation: z.enum(["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT"]),
  entityType: z.string(),
  entityIds: z.array(z.string()),
  data: z.record(z.string(), z.any()).optional(),
});

// Type exports
export type OrganisasiData = z.infer<typeof organisasiSchema>;
export type CreateOrganisasiData = z.infer<typeof createOrganisasiSchema>;
export type UpdateOrganisasiData = z.infer<typeof updateOrganisasiSchema>;
export type LogAktivitasData = z.infer<typeof logAktivitasSchema>;
export type CreateLogAktivitasData = z.infer<typeof createLogAktivitasSchema>;
export type DashboardAnalyticsData = z.infer<typeof dashboardAnalyticsSchema>;
export type ComplianceReportData = z.infer<typeof complianceReportSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type BulkOperationData = z.infer<typeof bulkOperationSchema>;