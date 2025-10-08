'use client';

import { MetricGrid, MetricData } from '@/components/common';
import { Activity, Users, AlertTriangle } from 'lucide-react';
import { KpiMetrics } from '@/types/dashboard';

interface KartuKpiProps {
  data: KpiMetrics;
}

export function KartuKpi({ data }: KartuKpiProps) {
  const kpiItems: MetricData[] = [
    {
      title: 'Tingkat Pelaporan Harian',
      value: `${data.dailyReportingRate}%`,
      target: '95%',
      icon: Activity,
      trend: data.dailyReportingRate >= 90 ? 'up' : data.dailyReportingRate >= 80 ? 'stable' : 'down',
      color: data.dailyReportingRate >= 90 ? 'text-green-600' : data.dailyReportingRate >= 80 ? 'text-yellow-600' : 'text-red-600',
      bgColor: data.dailyReportingRate >= 90 ? 'bg-green-50' : data.dailyReportingRate >= 80 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'Skor Kepatuhan Nasional',
      value: `${data.nationalComplianceScore}%`,
      target: '85%',
      icon: Users,
      trend: data.nationalComplianceScore >= 85 ? 'up' : data.nationalComplianceScore >= 75 ? 'stable' : 'down',
      color: data.nationalComplianceScore >= 85 ? 'text-green-600' : data.nationalComplianceScore >= 75 ? 'text-yellow-600' : 'text-red-600',
      bgColor: data.nationalComplianceScore >= 85 ? 'bg-green-50' : data.nationalComplianceScore >= 75 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'SPPG Aktif',
      value: `${data.activeSppg}`,
      target: `dari ${data.totalSppg}`,
      icon: Users,
      trend: (data.activeSppg / data.totalSppg) >= 0.9 ? 'up' : (data.activeSppg / data.totalSppg) >= 0.8 ? 'stable' : 'down',
      color: (data.activeSppg / data.totalSppg) >= 0.9 ? 'text-green-600' : (data.activeSppg / data.totalSppg) >= 0.8 ? 'text-yellow-600' : 'text-red-600',
      bgColor: (data.activeSppg / data.totalSppg) >= 0.9 ? 'bg-green-50' : (data.activeSppg / data.totalSppg) >= 0.8 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'Peringatan Kritis',
      value: `${data.criticalAlerts}`,
      target: 'aktif',
      icon: AlertTriangle,
      trend: data.criticalAlerts <= 5 ? 'up' : data.criticalAlerts <= 15 ? 'stable' : 'down',
      color: data.criticalAlerts <= 5 ? 'text-green-600' : data.criticalAlerts <= 15 ? 'text-yellow-600' : 'text-red-600',
      bgColor: data.criticalAlerts <= 5 ? 'bg-green-50' : data.criticalAlerts <= 15 ? 'bg-yellow-50' : 'bg-red-50'
    }
  ];

  return (
    <MetricGrid 
      metrics={kpiItems}
      columns={{ default: 1, md: 2, xl: 4 }}
      gap={4}
      className="mb-6"
    />
  );
}