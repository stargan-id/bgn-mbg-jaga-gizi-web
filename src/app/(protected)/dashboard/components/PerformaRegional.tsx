'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { RegionalPerformance } from '@/types/dashboard';

interface PerformaRegionalProps {
  data: RegionalPerformance[];
}

export function PerformaRegional({ data }: PerformaRegionalProps) {
  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const sortedData = [...data].sort((a, b) => b.avgComplianceScore - a.avgComplianceScore);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performa Regional
            </div>
          </CardTitle>
          <Button size="sm" variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analisis Lengkap
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Top Performer */}
          {sortedData.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Terbaik Nasional</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-900">{sortedData[0].provinsi}</p>
                  <p className="text-sm text-green-700">
                    {sortedData[0].avgComplianceScore.toFixed(1)}% compliance score
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">
                  #{1}
                </Badge>
              </div>
            </div>
          )}

          {/* Regional List */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {sortedData.map((region, index) => (
              <div key={region.provinsi} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{region.provinsi}</h4>
                      <p className="text-sm text-gray-600">
                        {region.activeSppg} dari {region.totalSppg} SPPG aktif
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getPerformanceBadge(region.avgComplianceScore)}
                  >
                    {region.avgComplianceScore.toFixed(1)}%
                  </Badge>
                </div>

                {/* Progress bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Skor Kepatuhan</span>
                      <span className={`font-medium ${getPerformanceColor(region.avgComplianceScore)}`}>
                        {region.avgComplianceScore.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={region.avgComplianceScore} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tingkat Pelaporan</span>
                      <span className={`font-medium ${getPerformanceColor(region.reportingRate)}`}>
                        {region.reportingRate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={region.reportingRate} 
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Critical issues indicator */}
                {region.criticalIssues > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {region.criticalIssues} masalah kritis
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Rata-rata Nasional</p>
                <p className="text-lg font-bold text-blue-700">
                  {(data.reduce((sum, region) => sum + region.avgComplianceScore, 0) / data.length).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-600">Total Masalah Kritis</p>
                <p className="text-lg font-bold text-orange-700">
                  {data.reduce((sum, region) => sum + region.criticalIssues, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}