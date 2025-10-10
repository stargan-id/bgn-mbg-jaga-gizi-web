import { db } from '@/lib/db';
import { Organisasi, StatusAktif } from '@prisma/client';

export interface OrganisasiOption {
  id: string;
  nama: string;
  singkatan: string | null;
}

export async function getOrganisasiOptions(): Promise<OrganisasiOption[]> {
  const organisasi = await db.organisasi.findMany({
    where: {
      status: StatusAktif.AKTIF
    },
    select: {
      id: true,
      nama: true,
      singkatan: true
    },
    orderBy: {
      nama: 'asc'
    }
  });

  return organisasi;
}

export async function getOrganisasiById(id: string): Promise<Organisasi | null> {
  return await db.organisasi.findUnique({
    where: { id }
  });
}