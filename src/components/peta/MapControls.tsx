'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Pause,
  FileText
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SppgMapData } from '@/lib/services/sppg';

interface MapControlsProps {
  sppgData: SppgMapData[];
  onFilterChange: (filteredData: SppgMapData[]) => void;
  totalStats?: {
    total: number;
    active: number;
    byStatus: Record<string, number>;
  };
}

export function MapControls({ sppgData, onFilterChange, totalStats }: MapControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique regions
  const regions = Array.from(new Set(sppgData.map(sppg => sppg.organisasi.nama))).sort();

  // Apply filters
  React.useEffect(() => {
    let filtered = sppgData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sppg => 
        sppg.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sppg.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sppg.organisasi.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(sppg => sppg.statusVerifikasi === statusFilter);
    }

    // Region filter
    if (regionFilter !== 'ALL') {
      filtered = filtered.filter(sppg => sppg.organisasi.nama === regionFilter);
    }

    onFilterChange(filtered);
  }, [searchTerm, statusFilter, regionFilter, sppgData, onFilterChange]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'UNDER_REVIEW':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'SUSPENDED':
        return <Pause className="w-4 h-4 text-gray-600" />;
      case 'DRAFT':
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      APPROVED: 'Terverifikasi',
      UNDER_REVIEW: 'Dalam Review',
      REJECTED: 'Ditolak',
      SUSPENDED: 'Ditangguhkan',
      DRAFT: 'Draft'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari SPPG berdasarkan nama, alamat, atau organisasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
              {(statusFilter !== 'ALL' || regionFilter !== 'ALL') && (
                <Badge variant="secondary" className="ml-2">
                  {[statusFilter !== 'ALL' ? 1 : 0, regionFilter !== 'ALL' ? 1 : 0].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status Verifikasi
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="APPROVED">Terverifikasi</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Dalam Review</SelectItem>
                    <SelectItem value="REJECTED">Ditolak</SelectItem>
                    <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Organisasi/Wilayah
                </label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih organisasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Organisasi</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Ringkasan SPPG</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total SPPG */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sppgData.length}
              </div>
              <div className="text-xs text-gray-600">Total SPPG</div>
            </div>

            {/* Active SPPG */}
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sppgData.filter(s => s.statusVerifikasi === 'APPROVED').length}
              </div>
              <div className="text-xs text-gray-600">Terverifikasi</div>
            </div>

            {/* Under Review */}
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {sppgData.filter(s => s.statusVerifikasi === 'UNDER_REVIEW').length}
              </div>
              <div className="text-xs text-gray-600">Dalam Review</div>
            </div>

            {/* Draft/Others */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {sppgData.filter(s => !['APPROVED', 'UNDER_REVIEW'].includes(s.statusVerifikasi)).length}
              </div>
              <div className="text-xs text-gray-600">Lainnya</div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                sppgData.reduce((acc, sppg) => {
                  acc[sppg.statusVerifikasi] = (acc[sppg.statusVerifikasi] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([status, count]) => (
                <div key={status} className="flex items-center gap-1">
                  {getStatusIcon(status)}
                  <span className="text-sm text-gray-600">
                    {getStatusLabel(status)}: {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}