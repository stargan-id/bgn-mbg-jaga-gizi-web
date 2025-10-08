'use server';

import { ActionResponse } from '@/actions/response';
import { getAllSppgForMap, getSppgById, getSppgByRegion, getSppgStats, type SppgMapData, type SppgWithOrganisasi } from '@/lib/services/sppg';
import { mockSppgMapData } from '@/lib/mock-data';

export async function getSppgMapDataAction(): Promise<ActionResponse<SppgMapData[]>> {
  try {
    // Use mock data for development
    // const sppgData = await getAllSppgForMap();
    const sppgData = mockSppgMapData;
    
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