'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MapContainerLeaflet from '@/components/peta/MapContainerLeaflet';
import { SppgInfoOverlay } from '@/components/peta/SppgInfoOverlay';
import { SppgMapData } from '@/lib/services/sppg';

interface PetaContentProps {
  initialSppgData: SppgMapData[];
  initialStats: any;
}

export function PetaContent({ initialSppgData, initialStats }: PetaContentProps) {
  const router = useRouter();
  const [filteredSppgData, setFilteredSppgData] = useState<SppgMapData[]>(initialSppgData);
  const [selectedSppg, setSelectedSppg] = useState<SppgMapData | null>(null);

  const handleMarkerClick = useCallback((sppg: SppgMapData) => {
    setSelectedSppg(sppg);
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setSelectedSppg(null);
  }, []);

  const handleViewDetail = useCallback((sppgId: string) => {
    // Navigate to SPPG detail page
    router.push(`/dashboard/sppg/${sppgId}`);
  }, [router]);

  const handleFilterChange = useCallback((filtered: SppgMapData[]) => {
    setFilteredSppgData(filtered);
  }, []);

  return (
    <div className="h-full flex flex-col">

      
      {/* Mobile-first layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6">
        {/* Controls Panel - Mobile: Top, Desktop: Left */}
        <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Filter SPPG</h3>
            <p className="text-sm text-gray-600">Total: {initialSppgData.length} SPPG</p>
          </div>
          
          {/* Legend */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Legenda Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Terverifikasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Dalam Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Ditolak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Ditangguhkan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Draft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container - Mobile: Bottom, Desktop: Right */}
        <div className="flex-1 relative">
          <div className="bg-white rounded-lg border overflow-hidden h-full min-h-[500px] lg:min-h-[700px]">
            <MapContainerLeaflet className="h-full" />
          </div>
        </div>
      </div>

      {/* SPPG Info Overlay */}
      <SppgInfoOverlay
        sppg={selectedSppg}
        onClose={handleCloseOverlay}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}