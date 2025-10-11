import { db } from "@/lib/db";
import { CreateLaporanBahanBakuData, UpdateLaporanBahanBakuData } from "@/types/laporan-bahan-baku";

export async function getLaporanBahanBakuList() {
  return db.laporanBahanBaku.findMany({
    include: { pemasok: true },
    orderBy: { tanggal: "desc" },
  });
}

export async function getLaporanBahanBakuById(id: string) {
  return db.laporanBahanBaku.findUnique({
    where: { id },
    include: { pemasok: true },
  });
}

export async function createLaporanBahanBaku(input: CreateLaporanBahanBakuData) {
  // Inject dummy/default values for required fields
  return db.laporanBahanBaku.create({
    data: {
      ...input,
      sppgId: "cmgi4dqxt001uueno6548kz4r", // TODO: replace with real sppgId
      createdBy: "cmgi4dqsj0014uenoilo518ci", // TODO: replace with real user id
      createdAt: new Date(),
    },
  });
}

export async function updateLaporanBahanBaku(id: string, input: UpdateLaporanBahanBakuData) {
  return db.laporanBahanBaku.update({
    where: { id },
    data: input,
  });
}

export async function deleteLaporanBahanBaku(id: string) {
  return db.laporanBahanBaku.delete({
    where: { id },
  });
}
