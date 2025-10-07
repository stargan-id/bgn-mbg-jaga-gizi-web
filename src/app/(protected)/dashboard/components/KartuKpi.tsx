'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity, Users, AlertTriangle } from 'lucide-react';
import { KpiMetrics } from '@/types/dashboard';

interface KartuKpiProps {
  data: KpiMetrics;
}

export function KartuKpi({ data }: KartuKpiProps) {
  const kpiItems = [
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {kpiItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${item.bgColor}`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {item.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Target: {item.target}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(item.trend)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}