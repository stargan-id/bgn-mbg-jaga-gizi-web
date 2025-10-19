"use server"
import { ActionResponse } from "@/actions/response";
import { createMenuHarian, deleteMenuHarian, getMenuHarianById, getMenuHarianList, updateMenuHarian } from "@/lib/services/menuHarian";
import { CreateMenuHarianData, UpdateMenuHarianData } from "@/types/menu-harian";
import { MenuHarian } from "@prisma/client";

export async function getMenuHarianListAction(): Promise<ActionResponse<MenuHarian[]>> {
  try {
    const data = await getMenuHarianList();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal mengambil data" };
  }
}

export async function getMenuHarianByIdAction(id: string): Promise<ActionResponse<MenuHarian|null>> {
  try {
    const data = await getMenuHarianById(id);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Data tidak ditemukan" };
  }
}

export async function createMenuHarianAction(input: CreateMenuHarianData): Promise<ActionResponse<MenuHarian>> {
  try {
    console.log("Input data:", input);
    const data = await createMenuHarian(input);
    return { success: true, data };
  } catch (e) {
    console.error("Error creating Menu Harian:", e);
    return { success: false, error: "Gagal menambah data" };
  }
}

export async function updateMenuHarianAction(id: string, input: UpdateMenuHarianData): Promise<ActionResponse<MenuHarian>> {
  try {
    const data = await updateMenuHarian(id, input);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: "Gagal memperbarui data" };
  }
}

export async function deleteMenuHarianAction(id: string): Promise<ActionResponse<null>> {
  try {
    await deleteMenuHarian(id);
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: "Gagal menghapus data" };
  }
}
