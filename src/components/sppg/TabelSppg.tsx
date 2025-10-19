'use client';

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pencil, 
  Trash2, 
  Search, 
  Filter,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Ban,
  Users
} from "lucide-react";
import { type SppgWithOrganisasi } from "@/lib/services/sppg";
import { StatusVerifikasi } from "@prisma/client";

interface TabelSppgProps {
  data: SppgWithOrganisasi[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onEdit: (sppg: SppgWithOrganisasi) => void;
  onDelete: (id: string) => void;
  onSearch: (search: string) => void;
  onFilter: (status?: StatusVerifikasi) => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const statusConfig = {
  DRAFT: {
    label: "Draft",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-gray-600"
  },
  UNDER_REVIEW: {
    label: "Dalam Review",
    variant: "default" as const,
    icon: AlertTriangle,
    color: "text-blue-600"
  },
  APPROVED: {
    label: "Disetujui",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600"
  },
  REJECTED: {
    label: "Ditolak",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600"
  },
  SUSPENDED: {
    label: "Diskors",
    variant: "destructive" as const,
    icon: Ban,
    color: "text-orange-600"
  }
};

export function TabelSppg({
  data,
  total,
  page,
  limit,
  totalPages,
  onEdit,
  onDelete,
  onSearch,
  onFilter,
  onPageChange,
  loading = false
}: TabelSppgProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusVerifikasi | "ALL">("ALL");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilter = (value: string) => {
    const status = value === "ALL" ? undefined : value as StatusVerifikasi;
    setStatusFilter(value as StatusVerifikasi | "ALL");
    onFilter(status);
  };

  const handleAddressClick = (sppg: SppgWithOrganisasi) => {
    if (sppg.longitude && sppg.latitude) {
      // Buka Google Maps dengan koordinat
      const url = `https://www.google.com/maps?q=${sppg.latitude},${sppg.longitude}`;
      window.open(url, '_blank');
    } else {
      // Jika tidak ada koordinat, search berdasarkan alamat
      const encodedAddress = encodeURIComponent(sppg.alamat);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(url, '_blank');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const StatusBadge = ({ status }: { status: StatusVerifikasi }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Daftar SPPG
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari nama, alamat, atau kontak..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={handleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="UNDER_REVIEW">Dalam Review</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
                <SelectItem value="SUSPENDED">Diskors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">SPPG & Organisasi</TableHead>
                    <TableHead className="w-[35%]">Alamat & Info</TableHead>
                    <TableHead className="w-[20%]">Status & Detail</TableHead>
                    <TableHead className="w-[10%] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((sppg) => (
                    <TableRow key={sppg.id}>
                      {/* SPPG & Organisasi */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{sppg.nama}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{sppg.organisasi.nama}</span>
                            {sppg.organisasi.singkatan && (
                              <Badge variant="outline" className="text-xs">
                                {sppg.organisasi.singkatan}
                              </Badge>
                            )}
                          </div>
                          {sppg.kontak && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              📞 {sppg.kontak}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Alamat & Info */}
                      <TableCell>
                        <div className="space-y-1">
                          <div 
                            className={`text-sm text-gray-900 max-w-[250px] overflow-hidden cursor-pointer hover:text-blue-600 hover:underline ${sppg.longitude && sppg.latitude ? 'text-blue-700' : ''}`}
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              WebkitBoxOrient: 'vertical' as any
                            }}
                            onClick={() => handleAddressClick(sppg)}
                            title={sppg.longitude && sppg.latitude ? 'Klik untuk buka di Google Maps' : 'Lokasi GPS tidak tersedia'}
                          >
                            {sppg.alamat}
                          </div>
                          <div className="text-xs text-gray-500">
                            📅 {formatDate(sppg.updatedAt || sppg.createdAt)}
                          </div>
                        </div>
                      </TableCell>

                      {/* Status & Detail */}
                      <TableCell>
                        <div className="space-y-2">
                          <StatusBadge status={sppg.statusVerifikasi} />
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{sppg.kapasitasProduksi} porsi/hari</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Aksi */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(sppg)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(sppg.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Tablet Table */}
            <div className="hidden md:block lg:hidden">
              <div className="space-y-3">
                {data.map((sppg) => (
                  <Card key={sppg.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{sppg.nama}</h3>
                            <p className="text-sm text-gray-600">{sppg.organisasi.nama}</p>
                          </div>
                          <StatusBadge status={sppg.statusVerifikasi} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Alamat:</p>
                            <p 
                              className={`text-gray-900 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-blue-600 hover:underline ${sppg.longitude && sppg.latitude ? 'text-blue-700' : ''}`}
                              onClick={() => handleAddressClick(sppg)}
                              title={sppg.longitude && sppg.latitude ? 'Klik untuk buka di Google Maps' : 'Klik untuk cari di Google Maps'}
                            >
                              {sppg.alamat}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Kapasitas:</p>
                            <p className="text-gray-900">{sppg.kapasitasProduksi} porsi/hari</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="text-xs text-gray-500">
                            <span>📅 {formatDate(sppg.updatedAt || sppg.createdAt)}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(sppg)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(sppg.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {data.map((sppg) => (
                <Card key={sppg.id} className="p-3">
                  <div className="space-y-2">
                    {/* Header dengan nama dan status */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{sppg.nama}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 truncate flex-1">
                            {sppg.organisasi.nama}
                          </span>
                          {sppg.organisasi.singkatan && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {sppg.organisasi.singkatan}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={sppg.statusVerifikasi} />
                    </div>
                    
                    {/* Info grid compact */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="text-gray-500">📍</span>
                        <span 
                          className={`ml-1 truncate block cursor-pointer hover:text-blue-600 hover:underline ${sppg.longitude && sppg.latitude ? 'text-blue-700' : ''}`}
                          onClick={() => handleAddressClick(sppg)}
                          title={sppg.longitude && sppg.latitude ? 'Klik untuk buka di Google Maps' : 'Klik untuk cari di Google Maps'}
                        >
                          {sppg.alamat}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">👥</span>
                        <span className="ml-1">{sppg.kapasitasProduksi} porsi/hari</span>
                      </div>
                    </div>
                    
                    {/* Footer dengan tanggal dan aksi */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <span>📅 {formatDate(sppg.updatedAt || sppg.createdAt)}</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(sppg)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(sppg.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Kontak jika ada */}
                    {sppg.kontak && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 pt-1">
                        <span>📞</span>
                        <span className="truncate">{sppg.kontak}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Menampilkan {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} dari {total} data
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Sebelumnya
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}