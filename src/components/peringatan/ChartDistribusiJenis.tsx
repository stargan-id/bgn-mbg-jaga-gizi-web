'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJenisPeringatanLabel, getAlertTypeIcon } from "@/zod/schema/peringatan";
import { JenisPeringatan } from "@prisma/client";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface ChartDistribusiJenisProps {
  data: Record<string, number>;
}

const colorMap: Record<JenisPeringatan, string> = {
  KEPATUHAN_OPERASIONAL: 'bg-blue-500',
  KEAMANAN_PANGAN: 'bg-red-500',
  STANDAR_GIZI: 'bg-green-500',
  DOKUMEN_KEPATUHAN: 'bg-yellow-500',
  KUALITAS_BAHAN: 'bg-purple-500',
  KAPASITAS_PRODUKSI: 'bg-orange-500',
  SISTEM_TEKNIS: 'bg-gray-500',
  AUDIT_INSPEKSI: 'bg-indigo-500',
  PELATIHAN_SDM: 'bg-pink-500',
  REGULASI_KEBIJAKAN: 'bg-teal-500'
};

export function ChartDistribusiJenis({ data }: ChartDistribusiJenisProps) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  // Convert data to array and sort by count
  const chartData = Object.entries(data)
    .map(([jenis, count]) => ({
      jenis: jenis as JenisPeringatan,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Jenis Peringatan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Donut Chart representation */}
          <div className="relative mx-auto w-48 h-48">
            <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
              {chartData.length > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="text-lg">Tidak ada data</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {chartData.map(({ jenis, count, percentage }) => {
              const IconComponent = Icons[getAlertTypeIcon(jenis) as keyof typeof Icons] as any;
              
              return (
                <div key={jenis} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      colorMap[jenis]
                    )} />
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm font-medium">
                        {getJenisPeringatanLabel(jenis)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-bold">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bars as alternative visualization */}
          <div className="pt-4 space-y-3">
            {chartData.slice(0, 5).map(({ jenis, count, percentage }) => (
              <div key={jenis} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {getJenisPeringatanLabel(jenis)}
                  </span>
                  <span className="font-medium">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn("h-2 rounded-full transition-all", colorMap[jenis])}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}