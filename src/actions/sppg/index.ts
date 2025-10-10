'use server';

import { ActionResponse } from '@/actions/response';
import { 
  getAllSppgForMap, 
  getSppgById, 
  getSppgByRegion, 
  getSppgStats, 
  getSppgList,
  createSppg,
  updateSppg,
  deleteSppg,
  verifySppg,
  type SppgMapData, 
  type SppgWithOrganisasi,
  type SppgListParams,
  type SppgListResult,
  type CreateSppgParams,
  type UpdateSppgParams,
  type VerifySppgParams
} from '@/lib/services/sppg';
import { createSppgSchema, updateSppgSchema, verifySppgSchema } from '@/zod/schema/sppg';
import { mockSppgMapData } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';

export async function getSppgMapDataAction(): Promise<ActionResponse<SppgMapData[]>> {
  try {
    // Get real data from database after seeding
    const sppgData = await getAllSppgForMap();
    
    return {
      success: true,
      data: sppgData,
      message: 'Data SPPG berhasil diambil'
    };
  } catch (error) {
    console.error('[getSppgMapDataAction] Error:', error);
    return {
      success: false,
      message: 'Gagal mengambil data SPPG',
      error: 'Terjadi kesalahan saat mengambil data SPPG'
    };
  }
}

export async function getSppgDetailAction(id: string): Promise<ActionResponse<SppgWithOrganisasi>> {
  try {
    const sppg = await getSppgById(id);
    
    if (!sppg) {
      return {
        success: false,
        message: 'SPPG tidak ditemukan',
        error: 'SPPG dengan ID tersebut tidak ditemukan'
      };
    }

    return {
      success: true,
      data: sppg,
      message: 'Detail SPPG berhasil diambil'
    };
  } catch (error) {
    console.error('[getSppgDetailAction] Error:', error);
    return {
      success: false,
      message: 'Gagal mengambil detail SPPG',
      error: 'Terjadi kesalahan saat mengambil detail SPPG'
    };
  }
}

export async function getSppgByRegionAction(organisasiId: string): Promise<ActionResponse<SppgMapData[]>> {
  try {
    const sppgData = await getSppgByRegion(organisasiId);
    
    return {
      success: true,
      data: sppgData,
      message: 'Data SPPG regional berhasil diambil'
    };
  } catch (error) {
    console.error('[getSppgByRegionAction] Error:', error);
    return {
      success: false,
      message: 'Gagal mengambil data SPPG regional',
      error: 'Terjadi kesalahan saat mengambil data SPPG regional'
    };
  }
}

export type SppgStats = typeof getSppgStats extends () => Promise<infer R> ? R : never;

export async function getSppgStatsAction(): Promise<ActionResponse<Awaited<ReturnType<typeof getSppgStats>>>> {
  try {
    const stats = await getSppgStats();
    
    return {
      success: true,
      data: stats,
      message: 'Statistik SPPG berhasil diambil'
    };
  } catch (error) {
    console.error('[getSppgStatsAction] Error:', error);
    return {
      success: false,
      message: 'Gagal mengambil statistik SPPG',
      error: 'Terjadi kesalahan saat mengambil statistik SPPG'
    };
  }
}

// CRUD Actions

export async function getSppgListAction(params: SppgListParams = {}): Promise<ActionResponse<SppgListResult>> {
  try {
    const result = await getSppgList(params);
    
    return {
      success: true,
      data: result,
      message: 'Daftar SPPG berhasil diambil'
    };
  } catch (error) {
    console.error('[getSppgListAction] Error:', error);
    return {
      success: false,
      message: 'Gagal mengambil daftar SPPG',
      error: 'Terjadi kesalahan saat mengambil daftar SPPG'
    };
  }
}

export async function createSppgAction(formData: FormData): Promise<ActionResponse<SppgWithOrganisasi>> {
  try {
    // Parsing form data
    const rawData = {
      nama: formData.get('nama') as string,
      alamat: formData.get('alamat') as string,
      kontak: formData.get('kontak') as string || undefined,
      kapasitasProduksi: parseInt(formData.get('kapasitasProduksi') as string),
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      organisasiId: formData.get('organisasiId') as string,
      createdBy: formData.get('createdBy') as string,
    };

    // Validasi dengan Zod
    const validatedData = createSppgSchema.parse(rawData);

    // Create SPPG
    const sppg = await createSppg(validatedData);

    // Revalidate cache
    revalidatePath('/dashboard/sppg');

    return {
      success: true,
      data: sppg,
      message: 'SPPG berhasil dibuat'
    };
  } catch (error) {
    console.error('[createSppgAction] Error:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: 'Gagal membuat SPPG',
        error: error.message
      };
    }

    return {
      success: false,
      message: 'Gagal membuat SPPG',
      error: 'Terjadi kesalahan saat membuat SPPG'
    };
  }
}

export async function updateSppgAction(formData: FormData): Promise<ActionResponse<SppgWithOrganisasi>> {
  try {
    // Parsing form data
    const id = formData.get('id') as string;
    const updatedBy = formData.get('updatedBy') as string;
    
    const rawData = {
      id,
      nama: formData.get('nama') as string || undefined,
      alamat: formData.get('alamat') as string || undefined,
      kontak: formData.get('kontak') as string || undefined,
      kapasitasProduksi: formData.get('kapasitasProduksi') ? parseInt(formData.get('kapasitasProduksi') as string) : undefined,
      longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
      latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
      organisasiId: formData.get('organisasiId') as string || undefined,
    };

    // Validasi dengan Zod
    const validatedData = updateSppgSchema.parse({ ...rawData, id });

    // Update SPPG
    const updateParams: UpdateSppgParams = {
      ...validatedData,
      updatedBy
    };
    const sppg = await updateSppg(updateParams);

    // Revalidate cache
    revalidatePath('/dashboard/sppg');

    return {
      success: true,
      data: sppg,
      message: 'SPPG berhasil diperbarui'
    };
  } catch (error) {
    console.error('[updateSppgAction] Error:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: 'Gagal memperbarui SPPG',
        error: error.message
      };
    }

    return {
      success: false,
      message: 'Gagal memperbarui SPPG',
      error: 'Terjadi kesalahan saat memperbarui SPPG'
    };
  }
}

export async function deleteSppgAction(id: string): Promise<ActionResponse<void>> {
  try {
    await deleteSppg(id);

    // Revalidate cache
    revalidatePath('/dashboard/sppg');

    return {
      success: true,
      data: undefined,
      message: 'SPPG berhasil dihapus'
    };
  } catch (error) {
    console.error('[deleteSppgAction] Error:', error);
    return {
      success: false,
      message: 'Gagal menghapus SPPG',
      error: 'Terjadi kesalahan saat menghapus SPPG'
    };
  }
}

export async function verifySppgAction(formData: FormData): Promise<ActionResponse<SppgWithOrganisasi>> {
  try {
    // Parsing form data
    const id = formData.get('id') as string;
    const statusVerifikasi = formData.get('statusVerifikasi') as 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    const updatedBy = formData.get('updatedBy') as string;
    
    const rawData = {
      id,
      statusVerifikasi,
      catatanVerifikasi: formData.get('catatanVerifikasi') as string || undefined,
    };

    // Validasi dengan Zod
    const validatedData = verifySppgSchema.parse(rawData);

    // Verify SPPG
    const verifyParams: VerifySppgParams = {
      id: validatedData.id,
      statusVerifikasi: validatedData.statusVerifikasi,
      updatedBy
    };
    const sppg = await verifySppg(verifyParams);

    // Revalidate cache
    revalidatePath('/dashboard/sppg');

    return {
      success: true,
      data: sppg,
      message: 'Status verifikasi SPPG berhasil diperbarui'
    };
  } catch (error) {
    console.error('[verifySppgAction] Error:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: 'Gagal memperbarui status verifikasi',
        error: error.message
      };
    }

    return {
      success: false,
      message: 'Gagal memperbarui status verifikasi',
      error: 'Terjadi kesalahan saat memperbarui status verifikasi'
    };
  }
}