import { getKegiatanPengolahanList, getKegiatanPengolahanById, createKegiatanPengolahan, updateKegiatanPengolahan, deleteKegiatanPengolahan } from "@/lib/services/kegiatanPengolahan";
import { ActionResponse } from "@/actions/response";
import { CreateKegiatanPengolahanData, UpdateKegiatanPengolahanData } from "@/types/kegiatan-pengolahan";

export async function getKegiatanPengolahanListAction(): Promise<ActionResponse> {
  try {
    const data = await getKegiatanPengolahanList();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

export async function getKegiatanPengolahanByIdAction(id: string): Promise<ActionResponse> {
  try {
    const data = await getKegiatanPengolahanById(id);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Data tidak ditemukan" };
  }
}

export async function createKegiatanPengolahanAction(input: CreateKegiatanPengolahanData): Promise<ActionResponse> {
  try {
    const data = await createKegiatanPengolahan(input);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal menambah data" };
  }
}

export async function updateKegiatanPengolahanAction(id: string, input: UpdateKegiatanPengolahanData): Promise<ActionResponse> {
  try {
    const data = await updateKegiatanPengolahan(id, input);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal memperbarui data" };
  }
}

export async function deleteKegiatanPengolahanAction(id: string): Promise<ActionResponse> {
  try {
    await deleteKegiatanPengolahan(id);
    return { success: true };
  } catch (e) {
    return { success: false, error: "Gagal menghapus data" };
  }
}
