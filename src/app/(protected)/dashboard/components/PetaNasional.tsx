'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { SppgStatusData } from '@/types/dashboard';

interface PetaNasionalProps {
  sppgData: SppgStatusData[];
}

export function PetaNasional({ sppgData }: PetaNasionalProps) {
  const getStatusColor = (status: SppgStatusData['status']) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-green-500';
      case 'PARTIAL':
        return 'bg-yellow-500';
      case 'NON_COMPLIANT':
        return 'bg-red-500';
      case 'NO_REPORT':
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: SppgStatusData['status']) => {
    switch (status) {
      case 'COMPLIANT':
        return 'Patuh Penuh';
      case 'PARTIAL':
        return 'Patuh Sebagian';
      case 'NON_COMPLIANT':
        return 'Tidak Patuh';
      case 'NO_REPORT':
        return 'Belum Lapor';
    }
  };

  const statusCounts = {
    COMPLIANT: sppgData.filter(s => s.status === 'COMPLIANT').length,
    PARTIAL: sppgData.filter(s => s.status === 'PARTIAL').length,
    NON_COMPLIANT: sppgData.filter(s => s.status === 'NON_COMPLIANT').length,
    NO_REPORT: sppgData.filter(s => s.status === 'NO_REPORT').length,
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Peta Distribusi SPPG</CardTitle>
          <Button size="sm" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Buka Peta Penuh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status as SppgStatusData['status'])}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {getStatusLabel(status as SppgStatusData['status'])}
                </p>
                <p className="text-sm font-semibold text-gray-700">{count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map Placeholder - In real app this would be actual map component */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 md:h-80 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-2">Peta Interaktif Indonesia</p>
            <p className="text-xs text-gray-400">
              Menampilkan lokasi dan status {sppgData.length} SPPG di seluruh Indonesia
            </p>
          </div>
          
          {/* Sample location dots */}
          <div className="absolute inset-0">
            {sppgData.slice(0, 8).map((sppg, index) => (
              <div
                key={sppg.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${25 + (index * 8)}%`,
                  top: `${30 + (index % 3 * 20)}%`
                }}
              >
                <div className={`w-3 h-3 rounded-full ${getStatusColor(sppg.status)} animate-pulse`} />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    <p className="font-medium">{sppg.nama}</p>
                    <p>Skor: {sppg.complianceScore}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total SPPG</p>
            <p className="text-xl font-bold text-gray-900">{sppgData.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Tingkat Kepatuhan</p>
            <p className="text-xl font-bold text-green-700">
              {Math.round((statusCounts.COMPLIANT / sppgData.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Navigation className="w-4 h-4 mr-2" />
            Filter Wilayah
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Ekspor Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}