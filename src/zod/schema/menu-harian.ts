import { z } from "zod";

// Menu Harian Schema
export const menuHarianSchema = z.object({
  id: z.string().cuid(),
  tanggal: z.date(),
  namaMenu: z.string().min(1, "Nama menu harus diisi"),
  deskripsi: z.string().optional(),
  porsiTarget: z.number().min(1, "Porsi target minimal 1"),
  kaloriPerPorsi: z.number().min(0).optional(),
  proteinPerPorsi: z.number().min(0).optional(),
  karbohidratPerPorsi: z.number().min(0).optional(),
  lemakPerPorsi: z.number().min(0).optional(),
  statusAkg: z.enum(["MEMENUHI", "HAMPIR_MEMENUHI", "TIDAK_MEMENUHI", "BELUM_DIEVALUASI"]),
  catatanGizi: z.string().optional(),
  biayaPerPorsi: z.number().min(0).optional(),
  fotoMenu: z.array(z.string()),
  sppgId: z.string().cuid(),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Schema for create (without id and timestamps)
export const createMenuHarianSchema = menuHarianSchema.omit({
  id: true,
  statusAkg: true, // Will be set to BELUM_DIEVALUASI by default
  kaloriPerPorsi: true, // Will be calculated from components
  proteinPerPorsi: true, // Will be calculated from components
  karbohidratPerPorsi: true, // Will be calculated from components
  lemakPerPorsi: true, // Will be calculated from components
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateMenuHarianSchema = menuHarianSchema.partial().extend({
  id: z.string().cuid(),
});

// Schema for AKG evaluation (admin only)
export const evaluateAkgMenuSchema = z.object({
  id: z.string().cuid(),
  statusAkg: z.enum(["MEMENUHI", "HAMPIR_MEMENUHI", "TIDAK_MEMENUHI"]),
  catatanGizi: z.string().optional(),
});

// Type exports
export type MenuHarianData = z.infer<typeof menuHarianSchema>;
export type CreateMenuHarianData = z.infer<typeof createMenuHarianSchema>;
export type UpdateMenuHarianData = z.infer<typeof updateMenuHarianSchema>;
export type EvaluateAkgMenuData = z.infer<typeof evaluateAkgMenuSchema>;