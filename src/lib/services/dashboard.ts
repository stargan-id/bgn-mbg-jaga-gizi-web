import { db } from "@/lib/db";
import { StatusVerifikasi, StatusChecklist, StatusAkg, StatusKegiatan } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from "date-fns";

export interface DashboardOverviewData {
  // Basic metrics
  totalSppg: number;
  verifiedSppg: number;
  verificationRate: number;
  sppgGrowth: number;
  
  // Today's metrics
  todayMenus: number;
  targetPortions: number;
  nutritionCompliance: number;
  checklistCompliance: number;
  pendingChecklists: number;
  
  // Trend data
  processingTrend: Array<{ date: string; value: number; porsi: number }>;
  verificationStatus: Array<{ name: string; value: number; color: string }>;
  
  // Organization stats
  organizationStats: Array<{
    name: string;
    sppgCount: number;
    status: string;
  }>;
  
  // Alerts
  alerts: {
    expiredDocuments: number;
    overdueChecklists: number;
    lowNutrition: number;
    lowStock: number;
  };
  
  // Performance metrics
  performance: {
    dataCompletion: number;
    qualityScore: number;
    userActivity: number;
  };
}

export async function getDashboardOverviewData(): Promise<DashboardOverviewData> {
  const now = new Date();
  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));
  const endOfLastMonth = endOfMonth(subMonths(now, 1));

  // Basic SPPG metrics
  const [totalSppg, verifiedSppg, totalSppgLastMonth] = await Promise.all([
    db.sppg.count(),
    db.sppg.count({ where: { statusVerifikasi: StatusVerifikasi.APPROVED } }),
    db.sppg.count({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
      }
    })
  ]);

  const verificationRate = totalSppg > 0 ? (verifiedSppg / totalSppg) * 100 : 0;
  const sppgGrowth = totalSppgLastMonth > 0 ? ((totalSppg - totalSppgLastMonth) / totalSppgLastMonth) * 100 : 0;

  // Today's metrics
  const [todayMenus, todayTargetPortions, todayNutritionCompliant] = await Promise.all([
    db.menuHarian.count({
      where: {
        tanggal: { gte: startOfToday, lte: endOfToday }
      }
    }),
    db.menuHarian.aggregate({
      where: {
        tanggal: { gte: startOfToday, lte: endOfToday }
      },
      _sum: { porsiTarget: true }
    }),
    db.menuHarian.count({
      where: {
        tanggal: { gte: startOfToday, lte: endOfToday },
        statusAkg: StatusAkg.MEMENUHI
      }
    })
  ]);

  const targetPortions = todayTargetPortions._sum.porsiTarget || 0;
  const nutritionCompliance = todayMenus > 0 ? (todayNutritionCompliant / todayMenus) * 100 : 0;

  // Checklist compliance
  const [totalChecklistsToday, completedChecklistsToday, pendingChecklists] = await Promise.all([
    db.checklistHarian.count({
      where: {
        tanggal: { gte: startOfToday, lte: endOfToday }
      }
    }),
    db.checklistHarian.count({
      where: {
        tanggal: { gte: startOfToday, lte: endOfToday },
        status: StatusChecklist.REVIEWED
      }
    }),
    db.checklistHarian.count({
      where: {
        tanggal: { lt: startOfToday },
        status: { in: [StatusChecklist.DRAFT, StatusChecklist.SUBMITTED] }
      }
    })
  ]);

  const checklistCompliance = totalChecklistsToday > 0 ? (completedChecklistsToday / totalChecklistsToday) * 100 : 0;

  // Processing trend (last 30 days)
  const processingTrend = await db.kegiatanPengolahan.groupBy({
    by: ['tanggalPengolahan'],
    where: {
      tanggalPengolahan: {
        gte: subMonths(now, 1)
      }
    },
    _count: { id: true },
    _sum: { porsiTerealisasi: true },
    orderBy: { tanggalPengolahan: 'asc' }
  });

  const trendData = processingTrend.map(item => ({
    date: item.tanggalPengolahan.toISOString().split('T')[0],
    value: item._count.id,
    porsi: item._sum.porsiTerealisasi || 0
  }));

  // Verification status distribution
  const verificationStatusData = await db.sppg.groupBy({
    by: ['statusVerifikasi'],
    _count: { id: true }
  });

  const statusColors: Record<StatusVerifikasi, string> = {
    [StatusVerifikasi.DRAFT]: '#94a3b8',
    [StatusVerifikasi.UNDER_REVIEW]: '#fbbf24',
    [StatusVerifikasi.APPROVED]: '#10b981',
    [StatusVerifikasi.REJECTED]: '#ef4444',
    [StatusVerifikasi.SUSPENDED]: '#f97316'
  };

  const verificationStatus = verificationStatusData.map(item => ({
    name: item.statusVerifikasi,
    value: item._count.id,
    color: statusColors[item.statusVerifikasi]
  }));

  // Organization stats
  const organizationStats = await db.organisasi.findMany({
    select: {
      nama: true,
      status: true,
      _count: { select: { sppg: true } }
    },
    orderBy: { nama: 'asc' },
    take: 5
  });

  const orgStats = organizationStats.map(org => ({
    name: org.nama,
    sppgCount: org._count.sppg,
    status: org.status
  }));

  // Alerts
  const [expiredDocuments, overdueChecklists, lowNutrition, lowStock] = await Promise.all([
    db.dokumenSppg.count({
      where: {
        tanggalExpiry: { lte: now }
      }
    }),
    pendingChecklists, // Already calculated above
    db.menuHarian.count({
      where: {
        tanggal: { gte: startOfThisMonth, lte: endOfThisMonth },
        statusAkg: { in: [StatusAkg.TIDAK_MEMENUHI, StatusAkg.BELUM_DIEVALUASI] }
      }
    }),
    db.laporanBahanBaku.count({
      where: {
        tanggalExpiry: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // Next 7 days
      }
    })
  ]);

  // Performance metrics (simplified calculations)
  const totalRecords = totalSppg + todayMenus + totalChecklistsToday;
  const completedRecords = verifiedSppg + todayNutritionCompliant + completedChecklistsToday;
  const dataCompletion = totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0;

  const qualityScore = Math.min(100, (nutritionCompliance + checklistCompliance + verificationRate) / 3);
  
  // User activity (mock - would need actual user session tracking)
  const userActivity = 75; // Placeholder

  return {
    totalSppg,
    verifiedSppg,
    verificationRate,
    sppgGrowth,
    todayMenus,
    targetPortions,
    nutritionCompliance,
    checklistCompliance,
    pendingChecklists,
    processingTrend: trendData,
    verificationStatus,
    organizationStats: orgStats,
    alerts: {
      expiredDocuments,
      overdueChecklists,
      lowNutrition,
      lowStock
    },
    performance: {
      dataCompletion,
      qualityScore,
      userActivity
    }
  };
}

export async function getOperationalAnalyticsData() {
  const now = new Date();
  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);
  const last30Days = subMonths(now, 1);

  // Processing activities today
  const processingActivities = await db.kegiatanPengolahan.findMany({
    where: {
      tanggalPengolahan: { gte: startOfToday, lte: endOfToday }
    },
    include: {
      sppg: { select: { nama: true } },
      menuHarian: { select: { namaMenu: true } },
      _count: { select: { penggunaanBahanBaku: true, kontrolMutu: true } }
    },
    orderBy: { jamMulai: 'desc' }
  });

  // Quality control metrics
  const qualityMetrics = await db.kontrolMutuPengolahan.groupBy({
    by: ['statusMutu'],
    where: {
      waktuKontrol: { gte: last30Days }
    },
    _count: { id: true }
  });

  // Checklist completion trend
  const checklistTrend = await db.checklistHarian.groupBy({
    by: ['tanggal', 'status'],
    where: {
      tanggal: { gte: last30Days }
    },
    _count: { id: true }
  });

  return {
    processingActivities,
    qualityMetrics,
    checklistTrend
  };
}

export async function getNutritionAnalyticsData() {
  const now = new Date();
  const last30Days = subMonths(now, 1);

  // AKG compliance by menu type
  const akgCompliance = await db.menuHarian.groupBy({
    by: ['statusAkg'],
    where: {
      tanggal: { gte: last30Days }
    },
    _count: { id: true },
    _avg: {
      kaloriPerPorsi: true,
      proteinPerPorsi: true,
      karbohidratPerPorsi: true,
      lemakPerPorsi: true
    }
  });

  // Nutrition trends
  const nutritionTrend = await db.menuHarian.findMany({
    where: {
      tanggal: { gte: last30Days }
    },
    select: {
      tanggal: true,
      kaloriPerPorsi: true,
      proteinPerPorsi: true,
      karbohidratPerPorsi: true,
      lemakPerPorsi: true,
      statusAkg: true
    },
    orderBy: { tanggal: 'asc' }
  });

  // Standard AKG comparison
  const standardAkg = await db.standarAkg.findMany({
    where: { statusAktif: 'AKTIF' }
  });

  return {
    akgCompliance,
    nutritionTrend,
    standardAkg
  };
}

export async function getSupplyChainAnalyticsData() {
  const now = new Date();
  const last30Days = subMonths(now, 1);

  // Supplier performance
  const supplierPerformance = await db.pemasok.findMany({
    include: {
      _count: { select: { laporanBahanBaku: true } },
      laporanBahanBaku: {
        where: {
          tanggal: { gte: last30Days }
        },
        select: {
          kondisiBahan: true,
          jumlah: true
        }
      }
    }
  });

  // Inventory status
  const inventoryStatus = await db.laporanBahanBaku.groupBy({
    by: ['jenisBahan', 'kondisiBahan'],
    where: {
      tanggal: { gte: last30Days }
    },
    _sum: { jumlah: true },
    _count: { id: true }
  });

  // Material usage trend
  const usageTrend = await db.penggunaanBahanBaku.groupBy({
    by: ['namaBahan'],
    where: {
      createdAt: { gte: last30Days }
    },
    _sum: { jumlahDigunakan: true },
    _count: { id: true }
  });

  return {
    supplierPerformance,
    inventoryStatus,
    usageTrend
  };
}

export async function getGeographicAnalyticsData() {
  // SPPG distribution by location
  const sppgDistribution = await db.sppg.findMany({
    where: {
      latitude: { not: null },
      longitude: { not: null }
    },
    include: {
      organisasi: { select: { nama: true } },
      _count: {
        select: {
          menuHarian: true,
          checklistHarian: true,
          kegiatanPengolahan: true
        }
      }
    }
  });

  // Regional performance
  const regionalStats = await db.organisasi.findMany({
    include: {
      _count: { select: { sppg: true } },
      sppg: {
        select: {
          statusVerifikasi: true,
          kapasitasProduksi: true
        }
      }
    }
  });

  return {
    sppgDistribution,
    regionalStats
  };
}