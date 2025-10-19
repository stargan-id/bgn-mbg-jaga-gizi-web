import { db } from "@/lib/db";
import {
  type CreatePeringatanData,
  type FilterPeringatanData,
  type MarkNotifikasiData,
  type UpdatePeringatanData
} from "@/zod/schema/peringatan";
import { type NotifikasiPeringatan, type Peringatan, Prisma } from "@prisma/client";

// Type untuk peringatan dengan relasi
export type PeringatanWithRelations = Peringatan & {
  sppg?: {
    id: string;
    nama: string;
    alamat: string;
    organisasi: {
      nama: string;
      singkatan?: string | null;
    };
  } | null;
  organisasi?: {
    id: string;
    nama: string;
    singkatan?: string | null;
  } | null;
  notifikasiPeringatan?: NotifikasiPeringatan[];
};

export type NotifikasiWithPeringatan = NotifikasiPeringatan & {
  peringatan: PeringatanWithRelations;
};

/**
 * Mengambil daftar peringatan dengan pagination dan filter
 */
export async function getPeringatanList(
  filters: FilterPeringatanData
): Promise<{
  data: PeringatanWithRelations[] | null ;
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const {
      page,
      limit,
      jenisPeringatan,
      tingkatPrioritas,
      statusPeringatan,
      sppgId,
      organisasiId,
      search,
      dateFrom,
      dateTo,
      showResolved
    } = filters;

    // Build where clause
    const where: Prisma.PeringatanWhereInput = {
      AND: [
        // Filter berdasarkan status resolved
        showResolved 
          ? {} 
          : {
              statusPeringatan: {
                notIn: ['SELESAI', 'DIABAIKAN', 'KADALUARSA']
              }
            },
        
        // Filter berdasarkan jenis peringatan
        jenisPeringatan ? { jenisPeringatan } : {},
        
        // Filter berdasarkan tingkat prioritas
        tingkatPrioritas ? { tingkatPrioritas } : {},
        
        // Filter berdasarkan status peringatan
        statusPeringatan ? { statusPeringatan } : {},
        
        // Filter berdasarkan SPPG
        sppgId ? { sppgId } : {},
        
        // Filter berdasarkan organisasi
        organisasiId ? { organisasiId } : {},
        
        // Filter berdasarkan tanggal
        dateFrom || dateTo ? {
          createdAt: {
            ...(dateFrom && { gte: dateFrom }),
            ...(dateTo && { lte: dateTo })
          }
        } : {},
        
        // Filter pencarian
        search ? {
          OR: [
            { judul: { contains: search, mode: 'insensitive' } },
            { deskripsi: { contains: search, mode: 'insensitive' } },
            { sppg: { nama: { contains: search, mode: 'insensitive' } } },
            { organisasi: { nama: { contains: search, mode: 'insensitive' } } }
          ]
        } : {}
      ]
    };

    // Count total records
    const totalCount = await db.peringatan.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated data
    const data = await db.peringatan.findMany({
      where,
      include: {
        sppg: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            organisasi: {
              select: {
                nama: true,
                singkatan: true
              }
            }
          }
        },
        organisasi: {
          select: {
            id: true,
            nama: true,
            singkatan: true
          }
        },
        notifikasiPeringatan: true
      },
      orderBy: [
        { tingkatPrioritas: 'asc' }, // KRITIS first
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching peringatan list:', error);
    throw new Error('Failed to fetch peringatan list');
  }
}

/**
 * Mengambil detail peringatan berdasarkan ID
 */
export async function getPeringatanById(id: string): Promise<PeringatanWithRelations | null> {
  try {
    const peringatan = await db.peringatan.findUnique({
      where: { id },
      include: {
        sppg: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            organisasi: {
              select: {
                nama: true,
                singkatan: true
              }
            }
          }
        },
        organisasi: {
          select: {
            id: true,
            nama: true,
            singkatan: true
          }
        },
        notifikasiPeringatan: true
      }
    });

    return peringatan;
  } catch (error) {
    console.error('Error fetching peringatan by ID:', error);
    throw new Error('Failed to fetch peringatan');
  }
}

/**
 * Membuat peringatan baru dan notifikasi untuk user terkait
 */
export async function createPeringatan(
  data: CreatePeringatanData,
  targetUserIds?: string[]
): Promise<PeringatanWithRelations> {
  try {
    const result = await db.$transaction(async (tx) => {
      // Create peringatan
      const peringatan = await tx.peringatan.create({
        data,
        include: {
          sppg: {
            select: {
              id: true,
              nama: true,
              alamat: true,
              organisasi: {
                select: {
                  nama: true,
                  singkatan: true
                }
              }
            }
          },
          organisasi: {
            select: {
              id: true,
              nama: true,
              singkatan: true
            }
          }
        }
      });

      // Create notifications for target users
      if (targetUserIds && targetUserIds.length > 0) {
        await tx.notifikasiPeringatan.createMany({
          data: targetUserIds.map(userId => ({
            peringatanId: peringatan.id,
            userId,
            channelEmail: true,
            channelInApp: true
          }))
        });
      }

      return peringatan;
    });

    return result;
  } catch (error) {
    console.error('Error creating peringatan:', error);
    throw new Error('Failed to create peringatan');
  }
}

/**
 * Update peringatan
 */
export async function updatePeringatan(
  data: UpdatePeringatanData
): Promise<PeringatanWithRelations | null> {
  try {
    const { id, ...updateData } = data;
    
    const peringatan = await db.peringatan.update({
      where: { id },
      data: updateData,
      include: {
        sppg: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            organisasi: {
              select: {
                nama: true,
                singkatan: true
              }
            }
          }
        },
        organisasi: {
          select: {
            id: true,
            nama: true,
            singkatan: true
          }
        },
        notifikasiPeringatan: true
      }
    });

    return peringatan;

  } catch (error) {
    console.error('Error updating peringatan:', error);
    throw new Error('Failed to update peringatan');
  }
}

/**
 * Menghapus peringatan
 */
export async function deletePeringatan(id: string): Promise<void> {
  try {
    await db.peringatan.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting peringatan:', error);
    throw new Error('Failed to delete peringatan');
  }
}

/**
 * Resolve peringatan (mark as completed)
 */
export async function resolvePeringatan(
  id: string,
  resolvedBy: string,
  tindakanDilakukan?: string,
  hasilTindakan?: string
): Promise<PeringatanWithRelations> {
  try {
    const peringatan = await db.peringatan.update({
      where: { id },
      data: {
        statusPeringatan: 'SELESAI',
        resolvedAt: new Date(),
        resolvedBy,
        tindakanDilakukan,
        hasilTindakan,
        updatedBy: resolvedBy
      },
      include: {
        sppg: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            organisasi: {
              select: {
                nama: true,
                singkatan: true
              }
            }
          }
        },
        organisasi: {
          select: {
            id: true,
            nama: true,
            singkatan: true
          }
        },
        notifikasiPeringatan: true
      }
    });

    return peringatan;
  } catch (error) {
    console.error('Error resolving peringatan:', error);
    throw new Error('Failed to resolve peringatan');
  }
}

/**
 * Mengambil notifikasi untuk user tertentu
 */
export async function getNotifikasiForUser(
  userId: string,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<NotifikasiWithPeringatan[]> {
  try {
    const notifikasi = await db.notifikasiPeringatan.findMany({
      where: {
        userId,
        ...(unreadOnly && { dibaca: false }),
        dismiss: false // Tidak tampilkan yang sudah di-dismiss
      },
      include: {
        peringatan: {
          include: {
            sppg: {
              select: {
                id: true,
                nama: true,
                alamat: true,
                organisasi: {
                  select: {
                    nama: true,
                    singkatan: true
                  }
                }
              }
            },
            organisasi: {
              select: {
                id: true,
                nama: true,
                singkatan: true
              }
            }
          }
        }
      },
      orderBy: [
        { peringatan: { tingkatPrioritas: 'asc' } },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    return notifikasi;
  } catch (error) {
    console.error('Error fetching notifikasi for user:', error);
    throw new Error('Failed to fetch notifikasi');
  }
}

/**
 * Mark notifikasi sebagai dibaca/dismiss
 */
export async function markNotifikasi(
  data: MarkNotifikasiData,
  userId: string
): Promise<void> {
  try {
    const { notifikasiIds, action } = data;
    
    const updateData: Prisma.NotifikasiPeringatanUpdateManyMutationInput = {};
    
    switch (action) {
      case 'read':
        updateData.dibaca = true;
        updateData.dibacaAt = new Date();
        break;
      case 'dismiss':
        updateData.dismiss = true;
        updateData.dismissAt = new Date();
        break;
      case 'undismiss':
        updateData.dismiss = false;
        updateData.dismissAt = null;
        break;
    }

    await db.notifikasiPeringatan.updateMany({
      where: {
        id: { in: notifikasiIds },
        userId // Ensure user can only modify their own notifications
      },
      data: updateData
    });
  } catch (error) {
    console.error('Error marking notifikasi:', error);
    throw new Error('Failed to mark notifikasi');
  }
}

/**
 * Mendapatkan ringkasan dashboard peringatan
 */
export async function getPeringatanDashboardSummary(
  organisasiId?: string
): Promise<{
  totalAktif: number;
  totalKritis: number;
  totalTinggi: number;
  totalSedang: number;
  totalRendah: number;
  totalInfo: number;
  peringatanTerbaru: PeringatanWithRelations[];
  distribusiJenis: Record<string, number>;
}> {
  try {
    const baseWhere: Prisma.PeringatanWhereInput = {
      statusPeringatan: {
        in: ['AKTIF', 'DITINDAKLANJUTI']
      },
      ...(organisasiId && { organisasiId })
    };

    // Get total counts by priority
    const [
      totalAktif,
      totalKritis,
      totalTinggi, 
      totalSedang,
      totalRendah,
      totalInfo
    ] = await Promise.all([
      db.peringatan.count({ where: baseWhere }),
      db.peringatan.count({ where: { ...baseWhere, tingkatPrioritas: 'KRITIS' } }),
      db.peringatan.count({ where: { ...baseWhere, tingkatPrioritas: 'TINGGI' } }),
      db.peringatan.count({ where: { ...baseWhere, tingkatPrioritas: 'SEDANG' } }),
      db.peringatan.count({ where: { ...baseWhere, tingkatPrioritas: 'RENDAH' } }),
      db.peringatan.count({ where: { ...baseWhere, tingkatPrioritas: 'INFO' } })
    ]);

    // Get recent alerts
    const peringatanTerbaru = await db.peringatan.findMany({
      where: baseWhere,
      include: {
        sppg: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            organisasi: {
              select: {
                nama: true,
                singkatan: true
              }
            }
          }
        },
        organisasi: {
          select: {
            id: true,
            nama: true,
            singkatan: true
          }
        }
      },
      orderBy: [
        { tingkatPrioritas: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 10
    });

    // Get distribution by type
    const jenisDistribution = await db.peringatan.groupBy({
      by: ['jenisPeringatan'],
      where: baseWhere,
      _count: true
    });

    const distribusiJenis = jenisDistribution.reduce((acc, item) => {
      acc[item.jenisPeringatan] = item._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAktif,
      totalKritis,
      totalTinggi,
      totalSedang,
      totalRendah,
      totalInfo,
      peringatanTerbaru,
      distribusiJenis
    };
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw new Error('Failed to fetch dashboard summary');
  }
}

/**
 * Auto-generate peringatan berdasarkan kondisi sistem
 * Fungsi ini akan dipanggil oleh scheduled job atau trigger
 */
export async function generateAutomaticAlerts(): Promise<number> {
  try {
    let alertsGenerated = 0;

    // 1. Check SPPG yang tidak melapor >24 jam
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const sppgNoReport = await db.sppg.findMany({
      where: {
        statusVerifikasi: 'APPROVED',
        checklistHarian: {
          none: {
            tanggal: {
              gte: yesterday
            }
          }
        }
      },
      include: {
        organisasi: true
      }
    });

    // Generate alerts for non-reporting SPPG
    for (const sppg of sppgNoReport) {
      await createPeringatan({
        judul: `SPPG ${sppg.nama} belum melaporkan aktivitas`,
        deskripsi: `SPPG ${sppg.nama} belum submit checklist harian lebih dari 24 jam. Segera lakukan follow-up.`,
        jenisPeringatan: 'KEPATUHAN_OPERASIONAL',
        tingkatPrioritas: 'TINGGI',
        statusPeringatan: 'AKTIF',
        sppgId: sppg.id,
        organisasiId: sppg.organisasiId,
        entityType: 'sppg',
        entityId: sppg.id,
        autoResolve: true,
        batasWaktuTindakan: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
        createdBy: 'system'
      });
      alertsGenerated++;
    }

    // 2. Check dokumen yang akan expired dalam 7 hari
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const expiringDocs = await db.dokumenSppg.findMany({
      where: {
        tanggalExpiry: {
          lte: sevenDaysLater,
          gte: new Date()
        },
        statusDokumen: 'APPROVED'
      },
      include: {
        sppg: {
          include: {
            organisasi: true
          }
        }
      }
    });

    // Generate alerts for expiring documents
    for (const doc of expiringDocs) {
      await createPeringatan({
        judul: `Dokumen ${doc.namaDokumen} akan expired`,
        deskripsi: `Dokumen ${doc.namaDokumen} dari SPPG ${doc.sppg.nama} akan expired pada ${doc.tanggalExpiry?.toLocaleDateString('id-ID')}. Segera lakukan perpanjangan.`,
        jenisPeringatan: 'DOKUMEN_KEPATUHAN',
        tingkatPrioritas: 'SEDANG',
        statusPeringatan: 'AKTIF',
        sppgId: doc.sppgId,
        organisasiId: doc.sppg.organisasiId,
        entityType: 'dokumen',
        entityId: doc.id,
        autoResolve: false,
        batasWaktuTindakan: doc.tanggalExpiry ?? undefined,
        createdBy: 'system'
      });
      alertsGenerated++;
    }

    // 3. Check bahan baku yang mendekati expired (3 hari)
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    const expiringIngredients = await db.laporanBahanBaku.findMany({
      where: {
        tanggalExpiry: {
          lte: threeDaysLater,
          gte: new Date()
        }
      },
      include: {
        sppg: {
          include: {
            organisasi: true
          }
        }
      }
    });

    // Generate alerts for expiring ingredients
    for (const ingredient of expiringIngredients) {
      await createPeringatan({
        judul: `Bahan baku ${ingredient.namaBahan} mendekati expired`,
        deskripsi: `Bahan baku ${ingredient.namaBahan} di SPPG ${ingredient.sppg.nama} akan expired pada ${ingredient.tanggalExpiry?.toLocaleDateString('id-ID')}. Segera gunakan atau buang.`,
        jenisPeringatan: 'KUALITAS_BAHAN',
        tingkatPrioritas: 'TINGGI',
        statusPeringatan: 'AKTIF',
        sppgId: ingredient.sppgId,
        organisasiId: ingredient.sppg.organisasiId,
        entityType: 'bahan_baku',
        entityId: ingredient.id,
        autoResolve: true,
        batasWaktuTindakan: ingredient.tanggalExpiry ?? undefined,
        createdBy: 'system'
      });
      alertsGenerated++;
    }

    return alertsGenerated;
  } catch (error) {
    console.error('Error generating automatic alerts:', error);
    throw new Error('Failed to generate automatic alerts');
  }
}