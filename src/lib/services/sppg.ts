import { db } from '@/lib/db';
import { Sppg, StatusVerifikasi } from '@prisma/client';

export interface SppgStats {
  total: number;
  active: number;
  byStatus: Record<StatusVerifikasi, number>;
}

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


export async function getSppgStats(): Promise<SppgStats> {
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

// CRUD Operations

export interface SppgListParams {
  search?: string;
  statusVerifikasi?: StatusVerifikasi;
  organisasiId?: string;
  page?: number;
  limit?: number;
}

export interface SppgListResult {
  data: SppgWithOrganisasi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getSppgList(params: SppgListParams = {}): Promise<SppgListResult> {
  const { search, statusVerifikasi, organisasiId, page = 1, limit = 10 } = params;
  
  const where: Record<string, unknown> = {};
  
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { alamat: { contains: search, mode: 'insensitive' } },
      { kontak: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (statusVerifikasi) {
    where.statusVerifikasi = statusVerifikasi;
  }
  
  if (organisasiId) {
    where.organisasiId = organisasiId;
  }

  const [data, total] = await Promise.all([
    db.sppg.findMany({
      where,
      include: {
        organisasi: {
          select: {
            id: true,
            nama: true,
            singkatan: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.sppg.count({ where })
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

export interface CreateSppgParams {
  nama: string;
  alamat: string;
  kontak?: string;
  kapasitasProduksi: number;
  longitude?: number;
  latitude?: number;
  organisasiId: string;
  createdBy: string;
}

export async function createSppg(params: CreateSppgParams): Promise<SppgWithOrganisasi> {
  const sppg = await db.sppg.create({
    data: {
      ...params,
      statusVerifikasi: 'DRAFT'
    },
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

  return sppg;
}

export interface UpdateSppgParams {
  id: string;
  nama?: string;
  alamat?: string;
  kontak?: string;
  kapasitasProduksi?: number;
  longitude?: number;
  latitude?: number;
  organisasiId?: string;
  updatedBy: string;
}

export async function updateSppg(params: UpdateSppgParams): Promise<SppgWithOrganisasi> {
  const { id, updatedBy, ...updateData } = params;
  
  const sppg = await db.sppg.update({
    where: { id },
    data: {
      ...updateData,
      updatedBy,
      updatedAt: new Date()
    },
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

  return sppg;
}

export async function deleteSppg(id: string): Promise<void> {
  await db.sppg.delete({
    where: { id }
  });
}

export interface VerifySppgParams {
  id: string;
  statusVerifikasi: 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  updatedBy: string;
}

export async function verifySppg(params: VerifySppgParams): Promise<SppgWithOrganisasi> {
  const { id, statusVerifikasi, updatedBy } = params;
  
  const sppg = await db.sppg.update({
    where: { id },
    data: {
      statusVerifikasi,
      updatedBy,
      updatedAt: new Date()
    },
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

  return sppg;
}