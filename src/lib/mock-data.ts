// Mock data for BGN Command Dashboard
import { SppgStatusData, KpiMetrics, RegionalPerformance, AlertData, ActivityFeed } from '@/types/dashboard';

export const mockKpiMetrics: KpiMetrics = {
  dailyReportingRate: 92.5,
  nationalComplianceScore: 87.3,
  criticalAlerts: 12,
  activeSppg: 847,
  totalSppg: 920,
  ingredientQualityTrend: 'UP'
};

export const mockSppgData: SppgStatusData[] = [
  {
    id: '1',
    nama: 'SPPG Jakarta Pusat 01',
    alamat: 'Jl. Medan Merdeka Barat No. 15',
    longitude: 106.8229,
    latitude: -6.1744,
    status: 'COMPLIANT',
    lastReport: new Date('2024-10-08T07:30:00'),
    complianceScore: 95,
    organisasi: 'Dinas Pendidikan DKI Jakarta',
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Pusat'
  },
  {
    id: '2',
    nama: 'SPPG Surabaya Timur 03',
    alamat: 'Jl. Ahmad Yani No. 42',
    longitude: 112.7378,
    latitude: -7.2504,
    status: 'PARTIAL',
    lastReport: new Date('2024-10-08T06:15:00'),
    complianceScore: 73,
    organisasi: 'Dinas Pendidikan Jawa Timur',
    provinsi: 'Jawa Timur',
    kota: 'Surabaya'
  },
  {
    id: '3',
    nama: 'SPPG Bandung Selatan 02',
    alamat: 'Jl. Soekarno Hatta No. 189',
    longitude: 107.6098,
    latitude: -6.9175,
    status: 'NON_COMPLIANT',
    lastReport: new Date('2024-10-07T16:45:00'),
    complianceScore: 45,
    organisasi: 'Dinas Pendidikan Jawa Barat',
    provinsi: 'Jawa Barat',
    kota: 'Bandung'
  },
  {
    id: '4',
    nama: 'SPPG Medan Utara 01',
    alamat: 'Jl. Gatot Subroto No. 25',
    longitude: 98.6722,
    latitude: 3.5952,
    status: 'NO_REPORT',
    lastReport: new Date('2024-10-06T14:20:00'),
    complianceScore: 0,
    organisasi: 'Dinas Pendidikan Sumatera Utara',
    provinsi: 'Sumatera Utara',
    kota: 'Medan'
  }
];

export const mockRegionalPerformance: RegionalPerformance[] = [
  {
    provinsi: 'DKI Jakarta',
    totalSppg: 45,
    activeSppg: 43,
    avgComplianceScore: 89.2,
    reportingRate: 95.6,
    criticalIssues: 1
  },
  {
    provinsi: 'Jawa Barat',
    totalSppg: 124,
    activeSppg: 118,
    avgComplianceScore: 82.7,
    reportingRate: 88.9,
    criticalIssues: 4
  },
  {
    provinsi: 'Jawa Timur',
    totalSppg: 138,
    activeSppg: 135,
    avgComplianceScore: 85.1,
    reportingRate: 91.3,
    criticalIssues: 2
  },
  {
    provinsi: 'Sumatera Utara',
    totalSppg: 89,
    activeSppg: 81,
    avgComplianceScore: 76.4,
    reportingRate: 79.8,
    criticalIssues: 8
  }
];

export const mockAlerts: AlertData[] = [
  {
    id: '1',
    type: 'NO_REPORT',
    severity: 'HIGH',
    message: 'Tidak ada laporan selama 2 hari',
    sppgId: '4',
    sppgName: 'SPPG Medan Utara 01',
    timestamp: new Date('2024-10-08T08:30:00'),
    status: 'ACTIVE'
  },
  {
    id: '2',
    type: 'LOW_COMPLIANCE',
    severity: 'MEDIUM',
    message: 'Skor kepatuhan turun di bawah 50%',
    sppgId: '3',
    sppgName: 'SPPG Bandung Selatan 02',
    timestamp: new Date('2024-10-08T07:15:00'),
    status: 'ACKNOWLEDGED'
  },
  {
    id: '3',
    type: 'FOOD_SAFETY',
    severity: 'HIGH',
    message: 'Suhu penyimpanan di luar batas aman',
    sppgId: '8',
    sppgName: 'SPPG Yogyakarta Tengah 01',
    timestamp: new Date('2024-10-08T06:45:00'),
    status: 'ACTIVE'
  }
];

export const mockActivityFeed: ActivityFeed[] = [
  {
    id: '1',
    type: 'REPORT_SUBMITTED',
    message: 'Laporan harian berhasil dikirim',
    sppgName: 'SPPG Jakarta Pusat 01',
    timestamp: new Date('2024-10-08T07:30:00'),
    status: 'success'
  },
  {
    id: '2',
    type: 'ISSUE_RESOLVED',
    message: 'Masalah suhu penyimpanan telah diperbaiki',
    sppgName: 'SPPG Semarang Barat 02',
    timestamp: new Date('2024-10-08T07:15:00'),
    status: 'success'
  },
  {
    id: '3',
    type: 'VERIFICATION',
    message: 'Dokumen SLHS berhasil diverifikasi',
    sppgName: 'SPPG Denpasar Utara 01',
    timestamp: new Date('2024-10-08T06:50:00'),
    status: 'info'
  },
  {
    id: '4',
    type: 'ALERT',
    message: 'Peringatan: compliance score rendah',
    sppgName: 'SPPG Makassar Timur 01',
    timestamp: new Date('2024-10-08T06:30:00'),
    status: 'warning'
  }
];

// Mock SPPG data untuk peta dengan koordinat Indonesia
export const mockSppgMapData = [
  {
    id: 'sppg-001',
    nama: 'SPPG Jakarta Pusat 01',
    alamat: 'Jl. Medan Merdeka Barat No. 15, Jakarta Pusat',
    kontak: '+62 21 3456789',
    kapasitasProduksi: 1500,
    statusVerifikasi: 'APPROVED' as const,
    longitude: 106.8229,
    latitude: -6.1744,
    organisasi: {
      nama: 'Dinas Pendidikan DKI Jakarta',
      singkatan: 'DISDIK DKI'
    },
    createdAt: new Date('2024-01-15T08:00:00'),
    updatedAt: new Date('2024-09-20T14:30:00')
  },
  {
    id: 'sppg-002',
    nama: 'SPPG Surabaya Timur 03',
    alamat: 'Jl. Ahmad Yani No. 42, Surabaya Timur',
    kontak: '+62 31 8765432',
    kapasitasProduksi: 2000,
    statusVerifikasi: 'APPROVED' as const,
    longitude: 112.7378,
    latitude: -7.2504,
    organisasi: {
      nama: 'Dinas Pendidikan Jawa Timur',
      singkatan: 'DISDIK JATIM'
    },
    createdAt: new Date('2024-02-10T09:15:00'),
    updatedAt: new Date('2024-10-01T11:20:00')
  },
  {
    id: 'sppg-003',
    nama: 'SPPG Bandung Selatan 02',
    alamat: 'Jl. Soekarno Hatta No. 189, Bandung Selatan',
    kontak: '+62 22 9876543',
    kapasitasProduksi: 1200,
    statusVerifikasi: 'UNDER_REVIEW' as const,
    longitude: 107.6098,
    latitude: -6.9175,
    organisasi: {
      nama: 'Dinas Pendidikan Jawa Barat',
      singkatan: 'DISDIK JABAR'
    },
    createdAt: new Date('2024-03-05T10:30:00'),
    updatedAt: new Date('2024-09-15T16:45:00')
  },
  {
    id: 'sppg-004',
    nama: 'SPPG Makassar Utara 01',
    alamat: 'Jl. Perintis Kemerdekaan No. 78, Makassar',
    kontak: '+62 411 234567',
    kapasitasProduksi: 1800,
    statusVerifikasi: 'APPROVED' as const,
    longitude: 119.4221,
    latitude: -5.1477,
    organisasi: {
      nama: 'Dinas Pendidikan Sulawesi Selatan',
      singkatan: 'DISDIK SULSEL'
    },
    createdAt: new Date('2024-01-20T07:45:00'),
    updatedAt: new Date('2024-09-28T13:10:00')
  },
  {
    id: 'sppg-005',
    nama: 'SPPG Medan Barat 05',
    alamat: 'Jl. Sisingamangaraja No. 23, Medan',
    kontak: '+62 61 5432109',
    kapasitasProduksi: 2200,
    statusVerifikasi: 'APPROVED' as const,
    longitude: 98.6722,
    latitude: 3.5952,
    organisasi: {
      nama: 'Dinas Pendidikan Sumatera Utara',
      singkatan: 'DISDIK SUMUT'
    },
    createdAt: new Date('2024-02-28T11:00:00'),
    updatedAt: new Date('2024-10-05T09:25:00')
  },
  {
    id: 'sppg-006',
    nama: 'SPPG Denpasar Timur 02',
    alamat: 'Jl. Bypass Ngurah Rai No. 456, Denpasar',
    kontak: '+62 361 876543',
    kapasitasProduksi: 1000,
    statusVerifikasi: 'UNDER_REVIEW' as const,
    longitude: 115.2191,
    latitude: -8.6705,
    organisasi: {
      nama: 'Dinas Pendidikan Bali',
      singkatan: 'DISDIK BALI'
    },
    createdAt: new Date('2024-03-12T14:20:00'),
    updatedAt: new Date('2024-09-10T08:30:00')
  },
  {
    id: 'sppg-007',
    nama: 'SPPG Yogyakarta Tengah 01',
    alamat: 'Jl. Malioboro No. 99, Yogyakarta',
    kontak: '+62 274 123456',
    kapasitasProduksi: 1300,
    statusVerifikasi: 'APPROVED' as const,
    longitude: 110.3695,
    latitude: -7.7956,
    organisasi: {
      nama: 'Dinas Pendidikan DIY',
      singkatan: 'DISDIK DIY'
    },
    createdAt: new Date('2024-01-08T12:15:00'),
    updatedAt: new Date('2024-09-22T15:40:00')
  },
  {
    id: 'sppg-008',
    nama: 'SPPG Palembang Selatan 03',
    alamat: 'Jl. Sudirman No. 234, Palembang',
    kontak: '+62 711 345678',
    kapasitasProduksi: 1600,
    statusVerifikasi: 'REJECTED' as const,
    longitude: 104.7458,
    latitude: -2.9761,
    organisasi: {
      nama: 'Dinas Pendidikan Sumatera Selatan',
      singkatan: 'DISDIK SUMSEL'
    },
    createdAt: new Date('2024-02-14T09:30:00'),
    updatedAt: new Date('2024-08-15T11:25:00')
  },
  {
    id: 'sppg-009',
    nama: 'SPPG Balikpapan Utara 01',
    alamat: 'Jl. Ahmad Yani Km. 5 No. 67, Balikpapan',
    kontak: '+62 542 987654',
    kapasitasProduksi: 1400,
    statusVerifikasi: 'DRAFT' as const,
    longitude: 116.8312,
    latitude: -1.2379,
    organisasi: {
      nama: 'Dinas Pendidikan Kalimantan Timur',
      singkatan: 'DISDIK KALTIM'
    },
    createdAt: new Date('2024-04-01T10:45:00'),
    updatedAt: null
  },
  {
    id: 'sppg-010',
    nama: 'SPPG Manado Barat 02',
    alamat: 'Jl. Sam Ratulangi No. 88, Manado',
    kontak: '+62 431 654321',
    kapasitasProduksi: 1100,
    statusVerifikasi: 'SUSPENDED' as const,
    longitude: 124.8457,
    latitude: 1.4748,
    organisasi: {
      nama: 'Dinas Pendidikan Sulawesi Utara',
      singkatan: 'DISDIK SULUT'
    },
    createdAt: new Date('2024-01-25T13:20:00'),
    updatedAt: new Date('2024-07-30T16:10:00')
  }
];