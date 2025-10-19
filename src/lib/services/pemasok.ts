"use server"
import { db } from "@/lib/db";
import { JenisPemasok, StatusAktif } from "@prisma/client";

const mockUserId = 'cmgi4dqsd0012uenohbil1hzq'; // TODO Ganti dengan ID user yang sesuai

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

export async function createPemasok(data: { nama: string; alamat: string; kontak?: string; jenisPemasok: JenisPemasok; statusAktif: StatusAktif; sertifikat?: string[] }) {

  const pemasok = {...data,
    createdBy: mockUserId,
  }

  return db.pemasok.create({
    data: pemasok,
  });
}

export async function updatePemasok(id: string, data: Partial<{ nama: string; alamat: string; kontak?: string; JenisPemasok: string; statusAktif?: StatusAktif; sertifikat?: string[] }>) {
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
