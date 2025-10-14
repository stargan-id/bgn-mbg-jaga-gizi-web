import { z } from "zod";

// Menu Harian Schema
export const menuHarianSchema = z.object({
  id: z.string(),
  tanggal: z.date(),
  namaMenu: z.string().min(1, "Nama menu harus diisi"),
  deskripsi: z.string().optional(),
  porsiTarget: z.number().min(1, "Porsi target minimal 1"),
  kaloriPerPorsi: z.number().min(0).optional(),
  proteinPerPorsi: z.number().min(0).optional(),
  karbohidratPerPorsi: z.number().min(0).optional(),
  lemakPerPorsi: z.number().min(0).optional(),
  statusAkg: z.enum(["MEMENUHI","HAMPIR_MEMENUHI","TIDAK_MEMENUHI","BELUM_DIEVALUASI"]),
  catatanGizi: z.string().optional(),
  biayaPerPorsi: z.number().min(0).optional(),
  fotoMenu: z.array(z.string()),
  sppgId: z.string(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const createMenuHarianSchema = menuHarianSchema.omit({
  id: true,
  sppgId: true,
  statusAkg: true,
  createdBy: true,
  updatedBy: true,
  updatedAt: true,
  createdAt: true,
});


// Schema for update (id required, other fields optional)
export const updateMenuHarianSchema = menuHarianSchema.partial().extend({
  id: z.string(),
});

// Schema for AKG evaluation (admin only)
export const evaluateAkgMenuSchema = z.object({
  id: z.string(),
  statusAkg: z.enum(["MEMENUHI", "HAMPIR_MEMENUHI", "TIDAK_MEMENUHI"]),
  catatanGizi: z.string().optional(),
});

// Type exports

export type MenuHarianData = z.infer<typeof menuHarianSchema>;
export type CreateMenuHarianData = z.infer<typeof createMenuHarianSchema>;
export type UpdateMenuHarianData = z.infer<typeof updateMenuHarianSchema>;
export type EvaluateAkgMenuData = z.infer<typeof evaluateAkgMenuSchema>;

// Type export input 
export type CreateMenuHarianInput = z.input<typeof createMenuHarianSchema>;
export type UpdateMenuHarianInput = z.input<typeof updateMenuHarianSchema>;
export type EvaluateAkgMenuInput = z.input<typeof evaluateAkgMenuSchema>;