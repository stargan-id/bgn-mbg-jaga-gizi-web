import { z } from "zod";

// Checklist Harian Schema
export const checklistHarianSchema = z.object({
  id: z.string().cuid(),
  tanggal: z.date(),
  kebersihanSdm: z.boolean({
    message: "Status kebersihan SDM harus diisi",
  }),
  kebersihanInfrastruktur: z.boolean({
    message: "Status kebersihan infrastruktur harus diisi",
  }),
  kondisiPeralatan: z.boolean({
    message: "Status kondisi peralatan harus diisi",
  }),
  suhuPenyimpanan: z.number().optional(),
  catatan: z.string().optional(),
  fotoEvidence: z.array(z.string()).min(1, "Minimal 1 foto bukti harus diunggah"),
  skorKepatuhan: z.number().min(0).max(100).optional(),
  status: z.enum(["DRAFT", "SUBMITTED", "REVIEWED"]),
  sppgId: z.string().cuid(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Schema for create (without id and timestamps)
export const createChecklistHarianSchema = checklistHarianSchema.omit({
  id: true,
  status: true, // Will be set to DRAFT by default
  skorKepatuhan: true, // Will be calculated automatically
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateChecklistHarianSchema = checklistHarianSchema.partial().extend({
  id: z.string().cuid(),
});

// Schema for submission (sets status to SUBMITTED)
export const submitChecklistSchema = z.object({
  id: z.string().cuid(),
});

// Schema for review (admin only)
export const reviewChecklistSchema = z.object({
  id: z.string().cuid(),
  skorKepatuhan: z.number().min(0).max(100),
  catatan: z.string().optional(),
});

// Type exports
export type ChecklistHarianData = z.infer<typeof checklistHarianSchema>;
export type CreateChecklistHarianData = z.infer<typeof createChecklistHarianSchema>;
export type UpdateChecklistHarianData = z.infer<typeof updateChecklistHarianSchema>;
export type SubmitChecklistData = z.infer<typeof submitChecklistSchema>;
export type ReviewChecklistData = z.infer<typeof reviewChecklistSchema>;