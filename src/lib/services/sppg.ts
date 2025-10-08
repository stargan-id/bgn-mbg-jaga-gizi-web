import { Sppg, StatusVerifikasi } from '@prisma/client';
import { db } from '@/lib/db';

export interface SppgWithOrganisasi extends Sppg {
  organisasi: {
    id: string;
    nama: string;
    singkatan: string | null;
  };
}

export interface SppgMapData {
  id: string;
  nama: string;
  alamat: string;
  kontak: string | null;
  kapasitasProduksi: number;
  statusVerifikasi: StatusVerifikasi;
  longitude: number;
  latitude: number;
  organisasi: {
    nama: string;
    singkatan: string | null;
  };
  createdAt: Date;
  updatedAt: Date | null;
}

export async function getAllSppgForMap(): Promise<SppgMapData[]> {
  const sppgList = await db.sppg.findMany({
    where: {
      AND: [
        { longitude: { not: null } },
        { latitude: { not: null } }
      ]
    },
    include: {
      organisasi: {
        select: {
          nama: true,
          singkatan: true
        }
      }
    },
    orderBy: {
      nama: 'asc'
    }
  });

  return sppgList.map(sppg => ({
    id: sppg.id,
    nama: sppg.nama,
    alamat: sppg.alamat,
    kontak: sppg.kontak,
    kapasitasProduksi: sppg.kapasitasProduksi,
    statusVerifikasi: sppg.statusVerifikasi,
    longitude: sppg.longitude!,
    latitude: sppg.latitude!,
    organisasi: sppg.organisasi,
    createdAt: sppg.createdAt,
    updatedAt: sppg.updatedAt
  }));
}

export async function getSppgById(id: string): Promise<SppgWithOrganisasi | null> {
  return await db.sppg.findUnique({
    where: { id },
    include: {
      organisasi: {
        select: {
          id: true,
          nama: true,
          singkatan: true
        }
      }
    }
  });
}

export async function getSppgByRegion(organisasiId: string): Promise<SppgMapData[]> {
  const sppgList = await db.sppg.findMany({
    where: {
      organisasiId,
      AND: [
        { longitude: { not: null } },
        { latitude: { not: null } }
      ]
    },
    include: {
      organisasi: {
        select: {
          nama: true,
          singkatan: true
        }
      }
    },
    orderBy: {
      nama: 'asc'
    }
  });

  return sppgList.map(sppg => ({
    id: sppg.id,
    nama: sppg.nama,
    alamat: sppg.alamat,
    kontak: sppg.kontak,
    kapasitasProduksi: sppg.kapasitasProduksi,
    statusVerifikasi: sppg.statusVerifikasi,
    longitude: sppg.longitude!,
    latitude: sppg.latitude!,
    organisasi: sppg.organisasi,
    createdAt: sppg.createdAt,
    updatedAt: sppg.updatedAt
  }));
}

export async function getSppgStats() {
  const stats = await db.sppg.groupBy({
    by: ['statusVerifikasi'],
    _count: {
      statusVerifikasi: true
    }
  });

  const totalSppg = await db.sppg.count();
  const activeSppg = await db.sppg.count({
    where: {
      statusVerifikasi: 'APPROVED'
    }
  });

  return {
    total: totalSppg,
    active: activeSppg,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat.statusVerifikasi] = stat._count.statusVerifikasi;
      return acc;
    }, {} as Record<StatusVerifikasi, number>)
  };
}