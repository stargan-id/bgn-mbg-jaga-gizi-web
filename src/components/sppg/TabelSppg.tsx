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
  MapPin,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Ban
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
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama SPPG</TableHead>
                    <TableHead>Organisasi</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((sppg) => (
                    <TableRow key={sppg.id}>
                      <TableCell className="font-medium">{sppg.nama}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sppg.organisasi.nama}</div>
                          {sppg.organisasi.singkatan && (
                            <div className="text-sm text-gray-500">{sppg.organisasi.singkatan}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{sppg.alamat}</TableCell>
                      <TableCell>{sppg.kapasitasProduksi} porsi/hari</TableCell>
                      <TableCell>
                        <StatusBadge status={sppg.statusVerifikasi} />
                      </TableCell>
                      <TableCell>
                        {sppg.longitude && sppg.latitude ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Ada</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Belum</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(sppg.updatedAt || sppg.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {data.map((sppg) => (
                <Card key={sppg.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{sppg.nama}</h3>
                        <p className="text-sm text-gray-600">{sppg.organisasi.nama}</p>
                      </div>
                      <StatusBadge status={sppg.statusVerifikasi} />
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p className="truncate">{sppg.alamat}</p>
                      <p>Kapasitas: {sppg.kapasitasProduksi} porsi/hari</p>
                      {sppg.kontak && <p>Kontak: {sppg.kontak}</p>}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        {sppg.longitude && sppg.latitude ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Lokasi tersedia</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Belum ada lokasi</span>
                          </div>
                        )}
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