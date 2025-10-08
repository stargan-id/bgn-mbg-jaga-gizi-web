'use client';

import React from 'react';
import { SppgMapData } from '@/lib/services/sppg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Phone, Building2, Users, Eye } from 'lucide-react';

interface SppgInfoOverlayProps {
  sppg: SppgMapData | null;
  onClose: () => void;
  onViewDetail: (sppgId: string) => void;
}

export function SppgInfoOverlay({ sppg, onClose, onViewDetail }: SppgInfoOverlayProps) {
  if (!sppg) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      APPROVED: { label: 'Terverifikasi', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      UNDER_REVIEW: { label: 'Dalam Review', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      REJECTED: { label: 'Ditolak', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      SUSPENDED: { label: 'Ditangguhkan', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
      DRAFT: { label: 'Draft', variant: 'outline' as const, color: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Overlay Card */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                  {sppg.nama}
                </CardTitle>
                <p className="text-sm text-gray-600 mb-2">
                  {sppg.organisasi.nama}
                </p>
                {getStatusBadge(sppg.statusVerifikasi)}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 h-8 w-8 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Alamat */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Alamat</p>
                <p className="text-sm text-gray-600">{sppg.alamat}</p>
              </div>
            </div>

            {/* Kontak */}
            {sppg.kontak && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Kontak</p>
                  <p className="text-sm text-gray-600">{sppg.kontak}</p>
                </div>
              </div>
            )}

            {/* Kapasitas Produksi */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <Users className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Kapasitas Produksi</p>
                <p className="text-sm text-gray-600">
                  {sppg.kapasitasProduksi.toLocaleString('id-ID')} porsi/hari
                </p>
              </div>
            </div>

            {/* Organisasi */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <Building2 className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Organisasi</p>
                <p className="text-sm text-gray-600">
                  {sppg.organisasi.singkatan || sppg.organisasi.nama}
                </p>
              </div>
            </div>

            {/* Koordinat */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-700 mb-1">Koordinat</p>
              <p className="text-xs text-gray-600 font-mono">
                {sppg.latitude.toFixed(6)}, {sppg.longitude.toFixed(6)}
              </p>
            </div>

            {/* Tanggal */}
            <div className="text-xs text-gray-500 border-t pt-3">
              Terdaftar: {formatDate(sppg.createdAt)}
              {sppg.updatedAt && (
                <span className="block">
                  Diperbarui: {formatDate(sppg.updatedAt)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onViewDetail(sppg.id)}
                className="flex-1"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Lihat Detail
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                size="sm"
                className="px-4"
              >
                Tutup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}