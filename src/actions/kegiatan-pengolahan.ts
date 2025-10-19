import { ActionResponse } from "@/actions/response";
import { createKegiatanPengolahan, deleteKegiatanPengolahan, getKegiatanPengolahanById, getKegiatanPengolahanList, updateKegiatanPengolahan } from "@/lib/services/kegiatanPengolahan";
import { CreateKegiatanPengolahanData, UpdateKegiatanPengolahanData } from "@/types/kegiatan-pengolahan";
import { KegiatanPengolahan } from "@prisma/client";

export async function getKegiatanPengolahanListAction(): Promise<ActionResponse<KegiatanPengolahan[]>> {
  try {
    const data = await getKegiatanPengolahanList();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

export async function getKegiatanPengolahanByIdAction(id: string): Promise<ActionResponse<KegiatanPengolahan|null>> {
  try {
    const data = await getKegiatanPengolahanById(id);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Data tidak ditemukan" };
  }
}

export async function createKegiatanPengolahanAction(input: CreateKegiatanPengolahanData): Promise<ActionResponse<KegiatanPengolahan>> {
  try {
    const data = await createKegiatanPengolahan(input);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal menambah data" };
  }
}

export async function updateKegiatanPengolahanAction(id: string, input: UpdateKegiatanPengolahanData): Promise<ActionResponse<KegiatanPengolahan>> {
  try {
    const data = await updateKegiatanPengolahan(id, input);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal memperbarui data" };
  }
}

export async function deleteKegiatanPengolahanAction(id: string): Promise<ActionResponse<null>> {
  try {
    await deleteKegiatanPengolahan(id);
    return { success: true, data:null };
  } catch (e) {
    return { success: false, error: "Gagal menghapus data" };
  }
}
