"use server"
import { db } from "@/lib/db";

export async function getPemasokList() {
  return db.pemasok.findMany({
    orderBy: { nama: "asc" },
    select: {
      id: true,
      nama: true,
    },
  });
}

export async function getPemasokById(id: string) {
  return db.pemasok.findUnique({
    where: { id },
  });
}

export async function createPemasok(data: { nama: string; alamat?: string; kontak?: string; jenisPemasok: string; statusAktif?: string; sertifikat?: string[] }) {
  return db.pemasok.create({
    data,
  });
}

export async function updatePemasok(id: string, data: Partial<{ nama: string; alamat?: string; kontak?: string; jenisPemasok: string; statusAktif?: string; sertifikat?: string[] }>) {
  return db.pemasok.update({
    where: { id },
    data,
  });
}

export async function deletePemasok(id: string) {
  return db.pemasok.delete({
    where: { id },
  });
}
