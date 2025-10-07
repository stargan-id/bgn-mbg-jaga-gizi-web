// Dashboard types for BGN Command Center
export interface SppgStatusData {
  id: string;
  nama: string;
  alamat: string;
  longitude?: number;
  latitude?: number;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'NO_REPORT';
  lastReport: Date;
  complianceScore: number;
  organisasi: string;
  provinsi: string;
  kota: string;
}

export interface KpiMetrics {
  dailyReportingRate: number;
  nationalComplianceScore: number;
  criticalAlerts: number;
  activeSppg: number;
  totalSppg: number;
  ingredientQualityTrend: 'UP' | 'DOWN' | 'STABLE';
}

export interface RegionalPerformance {
  provinsi: string;
  totalSppg: number;
  activeSppg: number;
  avgComplianceScore: number;
  reportingRate: number;
  criticalIssues: number;
}

export interface AlertData {
  id: string;
  type: 'NO_REPORT' | 'LOW_COMPLIANCE' | 'FOOD_SAFETY' | 'SYSTEM';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  sppgId?: string;
  sppgName?: string;
  timestamp: Date;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
}

export interface ActivityFeed {
  id: string;
  type: 'REPORT_SUBMITTED' | 'ISSUE_RESOLVED' | 'VERIFICATION' | 'ALERT';
  message: string;
  sppgName: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface FilterOptions {
  provinsi?: string;
  status?: SppgStatusData['status'];
  dateRange?: {
    start: Date;
    end: Date;
  };
}