import { db } from "@/lib/db";
import { CreateMenuHarianData, UpdateMenuHarianData } from "@/types/menu-harian";

const dummySppgId = "cmgi4dqyg003guenozcoftv8f"; // TODO: replace with real sppgId
const dummyUserId = "cmgi4dqsn0016uenol844bi6e"; // TODO: replace with real user id

export async function getMenuHarianList() {
  return db.menuHarian.findMany({
    orderBy: { tanggal: "desc" },
  });
}

export async function getMenuHarianById(id: string) {
  return db.menuHarian.findUnique({
    where: { id },
  });
}

export async function createMenuHarian(input: CreateMenuHarianData) {
  return db.menuHarian.create({
    data: {
      ...input,
      sppgId: dummySppgId, // TODO: replace with real sppgId
      createdBy: dummyUserId, // TODO: replace with real user id
      createdAt: new Date(),
    },
  });
}

export async function updateMenuHarian(id: string, input: UpdateMenuHarianData) {
  return db.menuHarian.update({
    where: { id },
    data: input,
  });
}

export async function deleteMenuHarian(id: string) {
  return db.menuHarian.delete({
    where: { id },
  });
}
