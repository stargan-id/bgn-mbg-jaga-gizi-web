import { z } from "zod";

// Komponen Menu Schema
export const komponenMenuSchema = z.object({
  id: z.string().cuid(),
  namaBahan: z.string().min(1, "Nama bahan harus diisi"),
  jumlah: z.number().min(0.1, "Jumlah harus lebih dari 0"),
  satuan: z.string().min(1, "Satuan harus diisi"),
  kaloriPer100g: z.number().min(0).optional(),
  proteinPer100g: z.number().min(0).optional(),
  karbohidratPer100g: z.number().min(0).optional(),
  lemakPer100g: z.number().min(0).optional(),
  menuHarianId: z.string().cuid(),
  createdAt: z.date(),
});

// Schema for create (without id and timestamps)
export const createKomponenMenuSchema = komponenMenuSchema.omit({
  id: true,
  createdAt: true,
});

// Schema for update (id required, other fields optional)
export const updateKomponenMenuSchema = komponenMenuSchema.partial().extend({
  id: z.string().cuid(),
});

// Schema for creating menu with components
export const createMenuWithComponentsSchema = z.object({
  tanggal: z.date(),
  namaMenu: z.string().min(1, "Nama menu harus diisi"),
  deskripsi: z.string().optional(),
  porsiTarget: z.number().min(1, "Porsi target minimal 1"),
  biayaPerPorsi: z.number().min(0).optional(),
  fotoMenu: z.array(z.string()),
  sppgId: z.string().cuid(),
  komponen: z.array(
    z.object({
      namaBahan: z.string().min(1, "Nama bahan harus diisi"),
      jumlah: z.number().min(0.1, "Jumlah harus lebih dari 0"),
      satuan: z.string().min(1, "Satuan harus diisi"),
      kaloriPer100g: z.number().min(0).optional(),
      proteinPer100g: z.number().min(0).optional(),
      karbohidratPer100g: z.number().min(0).optional(),
      lemakPer100g: z.number().min(0).optional(),
    })
  ).min(1, "Minimal 1 komponen menu harus diisi"),
});

// Type exports
export type KomponenMenuData = z.infer<typeof komponenMenuSchema>;
export type CreateKomponenMenuData = z.infer<typeof createKomponenMenuSchema>;
export type UpdateKomponenMenuData = z.infer<typeof updateKomponenMenuSchema>;
export type CreateMenuWithComponentsData = z.infer<typeof createMenuWithComponentsSchema>;