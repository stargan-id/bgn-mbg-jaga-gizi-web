"use server";

import { revalidatePath } from "next/cache";
import { 
  createPeringatanSchema,
  updatePeringatanSchema,
  filterPeringatanSchema,
  markNotifikasiSchema,
  type FilterPeringatanData,
  type CreatePeringatanData,
  type UpdatePeringatanData,
  type MarkNotifikasiData
} from "@/zod/schema/peringatan";
import { 
  getPeringatanList,
  getPeringatanById,
  createPeringatan,
  updatePeringatan,
  deletePeringatan,
  resolvePeringatan,
  getNotifikasiForUser,
  markNotifikasi,
  getPeringatanDashboardSummary,
  generateAutomaticAlerts,
  type PeringatanWithRelations,
  type NotifikasiWithPeringatan
} from "@/lib/services/peringatan";
import { type ActionResponse } from "@/actions/response";

/**
 * Action untuk mendapatkan daftar peringatan
 */
export async function getPeringatanListAction(
  filters: FilterPeringatanData
): Promise<ActionResponse<{
  data: PeringatanWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}>> {
  try {
    // Validasi input
    const validatedFilters = filterPeringatanSchema.parse(filters);
    
    const result = await getPeringatanList(validatedFilters);
    
    return {
      success: true,
      message: "Berhasil mengambil daftar peringatan",
      data: result
    };
  } catch (error) {
    console.error("Error in getPeringatanListAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil daftar peringatan"
    };
  }
}

/**
 * Action untuk mendapatkan detail peringatan
 */
export async function getPeringatanByIdAction(
  id: string
): Promise<ActionResponse<PeringatanWithRelations>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID peringatan harus diisi"
      };
    }

    const peringatan = await getPeringatanById(id);
    
    if (!peringatan) {
      return {
        success: false,
        message: "Peringatan tidak ditemukan"
      };
    }

    return {
      success: true,
      message: "Berhasil mengambil detail peringatan",
      data: peringatan
    };
  } catch (error) {
    console.error("Error in getPeringatanByIdAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil detail peringatan"
    };
  }
}

/**
 * Action untuk membuat peringatan baru
 */
export async function createPeringatanAction(
  data: CreatePeringatanData,
  targetUserIds?: string[]
): Promise<ActionResponse<PeringatanWithRelations>> {
  try {
    // Validasi input
    const validatedData = createPeringatanSchema.parse(data);
    
    const peringatan = await createPeringatan(validatedData, targetUserIds);
    
    // Revalidate cache
    revalidatePath("/dashboard/peringatan");
    
    return {
      success: true,
      message: "Berhasil membuat peringatan baru",
      data: peringatan
    };
  } catch (error) {
    console.error("Error in createPeringatanAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat peringatan"
    };
  }
}

/**
 * Action untuk mengupdate peringatan
 */
export async function updatePeringatanAction(
  data: UpdatePeringatanData
): Promise<ActionResponse<PeringatanWithRelations>> {
  try {
    // Validasi input
    const validatedData = updatePeringatanSchema.parse(data);
    
    const peringatan = await updatePeringatan(validatedData);
    
    // Revalidate cache
    revalidatePath("/dashboard/peringatan");
    revalidatePath(`/dashboard/peringatan/${data.id}`);
    
    return {
      success: true,
      message: "Berhasil mengupdate peringatan",
      data: peringatan
    };
  } catch (error) {
    console.error("Error in updatePeringatanAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengupdate peringatan"
    };
  }
}

/**
 * Action untuk menghapus peringatan
 */
export async function deletePeringatanAction(
  id: string
): Promise<ActionResponse<void>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "ID peringatan harus diisi"
      };
    }

    await deletePeringatan(id);
    
    // Revalidate cache
    revalidatePath("/dashboard/peringatan");
    
    return {
      success: true,
      message: "Berhasil menghapus peringatan"
    };
  } catch (error) {
    console.error("Error in deletePeringatanAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus peringatan"
    };
  }
}

/**
 * Action untuk resolve peringatan
 */
export async function resolvePeringatanAction(
  id: string,
  resolvedBy: string,
  tindakanDilakukan?: string,
  hasilTindakan?: string
): Promise<ActionResponse<PeringatanWithRelations>> {
  try {
    if (!id || !resolvedBy) {
      return {
        success: false,
        message: "ID peringatan dan user yang menyelesaikan harus diisi"
      };
    }

    const peringatan = await resolvePeringatan(id, resolvedBy, tindakanDilakukan, hasilTindakan);
    
    // Revalidate cache
    revalidatePath("/dashboard/peringatan");
    revalidatePath(`/dashboard/peringatan/${id}`);
    
    return {
      success: true,
      message: "Berhasil menyelesaikan peringatan",
      data: peringatan
    };
  } catch (error) {
    console.error("Error in resolvePeringatanAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menyelesaikan peringatan"
    };
  }
}

/**
 * Action untuk mendapatkan notifikasi user
 */
export async function getNotifikasiForUserAction(
  userId: string,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<ActionResponse<NotifikasiWithPeringatan[]>> {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID harus diisi"
      };
    }

    const notifikasi = await getNotifikasiForUser(userId, limit, unreadOnly);
    
    return {
      success: true,
      message: "Berhasil mengambil notifikasi",
      data: notifikasi
    };
  } catch (error) {
    console.error("Error in getNotifikasiForUserAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil notifikasi"
    };
  }
}

/**
 * Action untuk mark notifikasi
 */
export async function markNotifikasiAction(
  data: MarkNotifikasiData,
  userId: string
): Promise<ActionResponse<void>> {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID harus diisi"
      };
    }

    // Validasi input
    const validatedData = markNotifikasiSchema.parse(data);
    
    await markNotifikasi(validatedData, userId);
    
    // Revalidate cache untuk notifications
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/peringatan");
    
    return {
      success: true,
      message: "Berhasil mengupdate notifikasi"
    };
  } catch (error) {
    console.error("Error in markNotifikasiAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengupdate notifikasi"
    };
  }
}

/**
 * Action untuk mendapatkan ringkasan dashboard peringatan
 */
export async function getPeringatanDashboardSummaryAction(
  organisasiId?: string
): Promise<ActionResponse<{
  totalAktif: number;
  totalKritis: number;
  totalTinggi: number;
  totalSedang: number;
  totalRendah: number;
  totalInfo: number;
  peringatanTerbaru: PeringatanWithRelations[];
  distribusiJenis: Record<string, number>;
}>> {
  try {
    const summary = await getPeringatanDashboardSummary(organisasiId);
    
    return {
      success: true,
      message: "Berhasil mengambil ringkasan dashboard",
      data: summary
    };
  } catch (error) {
    console.error("Error in getPeringatanDashboardSummaryAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengambil ringkasan dashboard"
    };
  }
}

/**
 * Action untuk generate peringatan otomatis
 * Biasanya dipanggil oleh scheduled job
 */
export async function generateAutomaticAlertsAction(): Promise<ActionResponse<number>> {
  try {
    const alertsGenerated = await generateAutomaticAlerts();
    
    // Revalidate cache
    revalidatePath("/dashboard/peringatan");
    revalidatePath("/dashboard");
    
    return {
      success: true,
      message: `Berhasil generate ${alertsGenerated} peringatan otomatis`,
      data: alertsGenerated
    };
  } catch (error) {
    console.error("Error in generateAutomaticAlertsAction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal generate peringatan otomatis"
    };
  }
}