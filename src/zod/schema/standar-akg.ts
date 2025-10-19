import { z } from "zod";

// Standar AKG Schema
export const standarAkgSchema = z.object({
  id: z.string(),
  kelompokUsia: z.string().min(1, "Kelompok usia harus diisi"),
  minKalori: z.number().min(1, "Minimum kalori harus lebih dari 0"),
  maxKalori: z.number().min(1).optional(),
  minProtein: z.number().min(0, "Minimum protein tidak boleh negatif"),
  minKarbohidrat: z.number().min(0, "Minimum karbohidrat tidak boleh negatif"),
  minLemak: z.number().min(0, "Minimum lemak tidak boleh negatif"),
  deskripsi: z.string().optional(),
  statusAktif: z.enum(["AKTIF", "NON_AKTIF", "DIBUBARKAN"]),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

// Schema for create (without id and timestamps)
export const createStandarAkgSchema = standarAkgSchema.omit({
  id: true,
  statusAktif: true, // Will be set to AKTIF by default
  createdAt: true,
  updatedAt: true,
});

// Schema for update (id required, other fields optional)
export const updateStandarAkgSchema = standarAkgSchema.partial().extend({
  id: z.string(),
});

// Schema for AKG validation
export const validateAkgSchema = z.object({
  kelompokUsia: z.string(),
  kalori: z.number(),
  protein: z.number(),
  karbohidrat: z.number(),
  lemak: z.number(),
});

// Type exports
export type StandarAkgData = z.infer<typeof standarAkgSchema>;
export type CreateStandarAkgData = z.infer<typeof createStandarAkgSchema>;
export type UpdateStandarAkgData = z.infer<typeof updateStandarAkgSchema>;
export type ValidateAkgData = z.infer<typeof validateAkgSchema>;