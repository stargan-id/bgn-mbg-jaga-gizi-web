'use client';

import React from 'react';
import { SppgMapData } from '@/lib/services/sppg';
import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  sppgData: SppgMapData[];
  onMarkerClick?: (sppg: SppgMapData) => void;
  height?: string;
  className?: string;
}

export function MapPlaceholder({ 
  sppgData, 
  onMarkerClick, 
  height = '600px',
  className = '' 
}: MapPlaceholderProps) {
  console.log('📍 MapPlaceholder rendered with:', {
    sppgDataCount: sppgData.length,
    sppgDataSample: sppgData.slice(0, 1),
    height,
    className
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500';
      case 'UNDER_REVIEW':
        return 'bg-yellow-500';
      case 'REJECTED':
        return 'bg-red-500';
      case 'SUSPENDED':
        return 'bg-gray-500';
      case 'DRAFT':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={`bg-gray-100 rounded-lg overflow-hidden relative ${className}`}
      style={{ height }}
    >
      {/* Background with Indonesia outline */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MapPin className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Peta Nasional SPPG</h3>
            <p className="text-sm max-w-md mb-2">
              Peta interaktif menampilkan sebaran {sppgData.length} lokasi SPPG di seluruh Indonesia
            </p>
            <p className="text-xs text-blue-600 font-medium">
              Klik pada item SPPG untuk melihat detail lengkap
            </p>
          </div>
        </div>
      </div>

      {/* SPPG Markers List */}
      {sppgData.length > 0 && (
        <div className="absolute top-4 left-4 right-4 max-h-[calc(100%-2rem)] overflow-auto">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Daftar SPPG ({sppgData.length})
              </h4>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sppgData.map((sppg) => (
                <div 
                  key={sppg.id}
                  className="flex items-start gap-3 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onMarkerClick?.(sppg)}
                >
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getStatusColor(sppg.statusVerifikasi)}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {sppg.nama}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {sppg.alamat}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sppg.organisasi.singkatan || sppg.organisasi.nama}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    <div className="font-mono">{sppg.latitude.toFixed(4)}</div>
                    <div className="font-mono">{sppg.longitude.toFixed(4)}</div>
                    <div className="mt-1 text-blue-600">Lihat Detail →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}