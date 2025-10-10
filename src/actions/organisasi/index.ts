'use server';

import { ActionResponse } from '@/actions/response';
import { getOrganisasiOptions, type OrganisasiOption } from '@/lib/services/organisasi';

export async function getOrganisasiOptionsAction(): Promise<ActionResponse<OrganisasiOption[]>> {
  try {
    const options = await getOrganisasiOptions();
    
    return {
      success: true,
      data: options,
      message: 'Daftar organisasi berhasil diambil'
    };
  } catch (error) {
    console.error('[getOrganisasiOptionsAction] Error:', error);
    return {
      success: false,
      message: 'Gagal mengambil daftar organisasi',
      error: 'Terjadi kesalahan saat mengambil daftar organisasi'
    };
  }
}