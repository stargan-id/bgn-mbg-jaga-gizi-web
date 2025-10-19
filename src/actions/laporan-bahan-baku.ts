"use server"
import { ActionResponse } from "@/actions/response";
import { createLaporanBahanBaku, deleteLaporanBahanBaku, getLaporanBahanBakuById, getLaporanBahanBakuList, updateLaporanBahanBaku } from "@/lib/services/laporanBahanBaku";
import { CreateLaporanBahanBakuData, UpdateLaporanBahanBakuData } from "@/types/laporan-bahan-baku";
import { LaporanBahanBaku } from "@prisma/client";

export async function getLaporanBahanBakuListAction(): Promise<ActionResponse<LaporanBahanBaku[]>> {
  try {
    const data = await getLaporanBahanBakuList();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

export async function getLaporanBahanBakuByIdAction(id: string): Promise<ActionResponse<LaporanBahanBaku | null>> {
  try {
    const data = await getLaporanBahanBakuById(id);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Data tidak ditemukan" };
  }
}

export async function createLaporanBahanBakuAction(input: CreateLaporanBahanBakuData): Promise<ActionResponse<LaporanBahanBaku>> {
  try {
    const data = await createLaporanBahanBaku(input);
    return { success: true, data };
  } catch {
    return { success: false, error: "Gagal menambah data" };
  }
}

export async function updateLaporanBahanBakuAction(id: string, input: UpdateLaporanBahanBakuData): Promise<ActionResponse<LaporanBahanBaku>> {
  try {
    const data = await updateLaporanBahanBaku(id, input);
    return { success: true, data };
  } catch {
    return { success: false, error: "Gagal memperbarui data" };
  }
}

export async function deleteLaporanBahanBakuAction(id: string): Promise<ActionResponse<boolean>> {
  try {
    await deleteLaporanBahanBaku(id);
    return { success: true, data: true };
  } catch {
    return { success: false, error: "Gagal menghapus data" };
  }
}
