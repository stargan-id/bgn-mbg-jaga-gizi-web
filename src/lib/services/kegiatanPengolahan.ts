import { db } from "@/lib/db";
import { CreateKegiatanPengolahanData, UpdateKegiatanPengolahanData } from "@/types/kegiatan-pengolahan";

const mockUserId = 'cmgi4dqsd0012uenohbil1hzq'; // TODO Ganti dengan ID user yang sesuai

export async function getKegiatanPengolahanList() {
  return db.kegiatanPengolahan.findMany({
    orderBy: { tanggalPengolahan: "desc" },
  });
}

export async function getKegiatanPengolahanById(id: string) {
  return db.kegiatanPengolahan.findUnique({
    where: { id },
  });
}

export async function createKegiatanPengolahan(input: CreateKegiatanPengolahanData) {
  const data = {...input,
    createdBy: mockUserId,
  }
  return db.kegiatanPengolahan.create({
    data,
  });
}

export async function updateKegiatanPengolahan(id: string, input: UpdateKegiatanPengolahanData) {
  return db.kegiatanPengolahan.update({
    where: { id },
    data: input,
  });
}

export async function deleteKegiatanPengolahan(id: string) {
  return db.kegiatanPengolahan.delete({
    where: { id },
  });
}
