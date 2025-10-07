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