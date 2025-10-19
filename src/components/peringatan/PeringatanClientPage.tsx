'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type PeringatanWithRelations } from "@/lib/services/peringatan";
import { cn } from "@/lib/utils";
import {
  type FilterPeringatanData,
  getJenisPeringatanLabel,
  getStatusPeringatanLabel,
  getTingkatPrioritasLabel
} from "@/zod/schema/peringatan";
import { JenisPeringatan, StatusPeringatan, TingkatPrioritas } from "@prisma/client";
import {
  AlertTriangle,
  Bell,
  Clock,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChartDistribusiJenis } from "./ChartDistribusiJenis";
import { StatCard } from "./StatCard";
import { TabelPeringatan } from "./TabelPeringatan";
import { TimelinePrioritas } from "./TimelinePrioritas";

// Mock data untuk development - nanti akan diganti dengan data real
const mockDashboardData = {
  totalAktif: 23,
  totalKritis: 5,
  totalTinggi: 8,
  totalSedang: 7,
  totalRendah: 2,
  totalInfo: 1,
  peringatanTerbaru: [],
  distribusiJenis: {
    "KEPATUHAN_OPERASIONAL": 8,
    "KEAMANAN_PANGAN": 5,
    "STANDAR_GIZI": 4,
    "DOKUMEN_KEPATUHAN": 3,
    "KUALITAS_BAHAN": 2,
    "KAPASITAS_PRODUKSI": 1
  }
};

const mockPeringatanList = [
  {
    id: "1",
    judul: "SPPG Warung Bu Sari belum melaporkan aktivitas",
    deskripsi: "SPPG belum submit checklist harian lebih dari 24 jam. Segera lakukan follow-up.",
    jenisPeringatan: "KEPATUHAN_OPERASIONAL" as JenisPeringatan,
    tingkatPrioritas: "KRITIS" as TingkatPrioritas,
    statusPeringatan: "AKTIF" as StatusPeringatan,
    sppg: {
      id: "sppg1",
      nama: "Warung Bu Sari",
      alamat: "Jl. Sudirman No. 123, Jakarta",
      organisasi: {
        nama: "Dinas Pendidikan DKI Jakarta",
        singkatan: "DISDIK DKI"
      }
    },
    batasWaktuTindakan: new Date(Date.now() + 30 * 60 * 1000), // 30 menit lagi - CRITICAL
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdBy: "system"
  },
  {
    id: "2", 
    judul: "Dokumen SLHS akan expired",
    deskripsi: "Sertifikat Laik Higiene Sanitasi SPPG Katering Sehat akan expired dalam 3 hari.",
    jenisPeringatan: "DOKUMEN_KEPATUHAN" as JenisPeringatan,
    tingkatPrioritas: "TINGGI" as TingkatPrioritas,
    statusPeringatan: "AKTIF" as StatusPeringatan,
    sppg: {
      id: "sppg2",
      nama: "Katering Sehat",
      alamat: "Jl. Gatot Subroto No. 456, Bandung",
      organisasi: {
        nama: "Dinas Pendidikan Jawa Barat",
        singkatan: "DISDIK JABAR"
      }
    },
    batasWaktuTindakan: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 jam lagi - URGENT
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    createdBy: "system"
  },
  {
    id: "3",
    judul: "Menu tidak memenuhi standar AKG",
    deskripsi: "Menu hari ini dari SPPG Makan Sehat kurang protein. Perlu penyesuaian menu.",
    jenisPeringatan: "STANDAR_GIZI" as JenisPeringatan,
    tingkatPrioritas: "SEDANG" as TingkatPrioritas,
    statusPeringatan: "DITINDAKLANJUTI" as StatusPeringatan,
    sppg: {
      id: "sppg3",
      nama: "Makan Sehat",
      alamat: "Jl. Ahmad Yani No. 789, Surabaya",
      organisasi: {
        nama: "Dinas Pendidikan Jawa Timur",
        singkatan: "DISDIK JATIM"
      }
    },
    batasWaktuTindakan: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 hari lagi
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    createdBy: "system"
  },
  {
    id: "4",
    judul: "Laporan bahan baku terlambat",
    deskripsi: "SPPG Bergizi belum submit laporan bahan baku bulanan. Deadline sudah terlewat.",
    jenisPeringatan: "KEPATUHAN_OPERASIONAL" as JenisPeringatan,
    tingkatPrioritas: "KRITIS" as TingkatPrioritas,
    statusPeringatan: "AKTIF" as StatusPeringatan,
    sppg: {
      id: "sppg4",
      nama: "Bergizi",
      alamat: "Jl. Diponegoro No. 321, Yogyakarta",
      organisasi: {
        nama: "Dinas Pendidikan DIY",
        singkatan: "DISDIK DIY"
      }
    },
    batasWaktuTindakan: new Date(Date.now() - 2 * 60 * 60 * 1000), // Sudah terlambat 2 jam
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    createdBy: "system"
  },
  {
    id: "5",
    judul: "Inspeksi sanitasi mendadak diperlukan",
    deskripsi: "Ada laporan dari masyarakat terkait kebersihan dapur SPPG Nusantara.",
    jenisPeringatan: "KEAMANAN_PANGAN" as JenisPeringatan,
    tingkatPrioritas: "TINGGI" as TingkatPrioritas,
    statusPeringatan: "AKTIF" as StatusPeringatan,
    sppg: {
      id: "sppg5",
      nama: "Nusantara",
      alamat: "Jl. Merdeka No. 111, Medan",
      organisasi: {
        nama: "Dinas Pendidikan Sumut",
        singkatan: "DISDIK SUMUT"
      }
    },
    batasWaktuTindakan: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 jam lagi - URGENT
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    createdBy: "system"
  },
  {
    id: "6",
    judul: "Update sistem diperlukan",
    deskripsi: "Sistem POS SPPG Harapan perlu update untuk keamanan data.",
    jenisPeringatan: "SISTEM_TEKNOLOGI" as JenisPeringatan,
    tingkatPrioritas: "RENDAH" as TingkatPrioritas,
    statusPeringatan: "AKTIF" as StatusPeringatan,
    sppg: {
      id: "sppg6",
      nama: "Harapan",
      alamat: "Jl. Veteran No. 555, Makassar",
      organisasi: {
        nama: "Dinas Pendidikan Sulsel",
        singkatan: "DISDIK SULSEL"
      }
    },
    batasWaktuTindakan: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari lagi
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: "system"
  }
];

export function PeringatanClientPage() {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [peringatanList, setPeringatanList] = useState<PeringatanWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState<JenisPeringatan | "ALL">("ALL");
  const [prioritasFilter, setPrioritasFilter] = useState<TingkatPrioritas | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusPeringatan | "ALL">("ALL");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      // TODO: Implement real API call
      // const result = await getPeringatanDashboardSummaryAction();
      // if (result.success && result.data) {
      //   setDashboardData(result.data);
      // }
      
      // For now, use mock data
      setDashboardData(mockDashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    }
  };

  // Load peringatan list
  const loadPeringatanList = async () => {
    try {
      setLoading(true);
      
      const filters: FilterPeringatanData = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        jenisPeringatan: jenisFilter !== "ALL" ? jenisFilter : undefined,
        tingkatPrioritas: prioritasFilter !== "ALL" ? prioritasFilter : undefined,
        statusPeringatan: statusFilter !== "ALL" ? statusFilter : undefined,
        showResolved: false
      };

      // TODO: Implement real API call
      // const result = await getPeringatanListAction(filters);
      // if (result.success && result.data) {
      //   setPeringatanList(result.data.data);
      //   setTotalPages(result.data.totalPages);
      //   setTotalCount(result.data.totalCount);
      // }
      
      // For now, use mock data
      setPeringatanList(mockPeringatanList as any);
      setTotalPages(1);
      setTotalCount(mockPeringatanList.length);
    } catch (error) {
      console.error('Error loading peringatan list:', error);
      toast.error('Gagal memuat daftar peringatan');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadDashboardData(),
      loadPeringatanList()
    ]);
    setRefreshing(false);
    toast.success('Data berhasil di-refresh');
  };

  // Handle resolve peringatan
  const handleResolvePeringatan = async (id: string, tindakan?: string, hasil?: string) => {
    try {
      // TODO: Implement with real user context
      // const result = await resolvePeringatanAction(id, userId, tindakan, hasil);
      // if (result.success) {
      //   toast.success('Peringatan berhasil diselesaikan');
      //   await loadPeringatanList();
      //   await loadDashboardData();
      // } else {
      //   toast.error(result.message);
      // }
      
      // Mock implementation
      toast.success('Peringatan berhasil diselesaikan');
      await loadPeringatanList();
    } catch (error) {
      console.error('Error resolving peringatan:', error);
      toast.error('Gagal menyelesaikan peringatan');
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadPeringatanList();
  }, [currentPage, searchTerm, jenisFilter, prioritasFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Command Center</h2>
          <p className="text-muted-foreground">
            Monitor dan kelola semua peringatan sistem secara real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Buat Peringatan
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Aktif"
          value={dashboardData.totalAktif}
          icon={Bell}
          trend="+2 dari kemarin"
          color="blue"
        />
        <StatCard
          title="Kritis"
          value={dashboardData.totalKritis}
          icon={AlertTriangle}
          trend="Perlu tindakan segera"
          color="red"
        />
        <StatCard
          title="Prioritas Tinggi"
          value={dashboardData.totalTinggi}
          icon={ShieldAlert}
          trend="Dalam 24 jam"
          color="orange"
        />
        <StatCard
          title="Follow-up"
          value={dashboardData.totalSedang + dashboardData.totalRendah}
          icon={Clock}
          trend="Terjadwal"
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartDistribusiJenis 
          data={dashboardData.distribusiJenis}
        />
        
        {/* Priority Timeline Chart */}
        <TimelinePrioritas 
          data={peringatanList.map(p => ({
            ...p,
            batasWaktuTindakan: p.batasWaktuTindakan ? new Date(p.batasWaktuTindakan) : undefined,
            createdAt: new Date(p.createdAt)
          }))}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari peringatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={jenisFilter} onValueChange={(value) => setJenisFilter(value as JenisPeringatan | "ALL")}> 
              <SelectTrigger>
                <SelectValue placeholder="Jenis Peringatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                {Object.values(JenisPeringatan).map((jenis) => (
                  <SelectItem key={jenis} value={jenis}>
                    {getJenisPeringatanLabel(jenis)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={prioritasFilter} onValueChange={(value) => setPrioritasFilter(value as TingkatPrioritas | "ALL")}> 
              <SelectTrigger>
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Prioritas</SelectItem>
                {Object.values(TingkatPrioritas).map((prioritas) => (
                  <SelectItem key={prioritas} value={prioritas}>
                    {getTingkatPrioritasLabel(prioritas)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusPeringatan | "ALL")}> 
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                {Object.values(StatusPeringatan).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusPeringatanLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Peringatan List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Peringatan ({totalCount})</span>
            <Badge variant="outline" className="ml-2">
              Halaman {currentPage} dari {totalPages}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelPeringatan
            data={peringatanList}
            loading={loading}
            onResolve={handleResolvePeringatan}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}