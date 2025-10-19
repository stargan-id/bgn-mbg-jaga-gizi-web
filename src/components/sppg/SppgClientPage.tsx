'use client';

import { getOrganisasiOptionsAction } from "@/actions/organisasi";
import {
  createSppgAction,
  deleteSppgAction,
  getSppgListAction,
  getSppgStatsAction,
  updateSppgAction
} from "@/actions/sppg";
import { FormSppg } from "@/components/sppg/FormSppg";
import { ModalKonfirmasiHapus } from "@/components/sppg/ModalKonfirmasiHapus";
import { TabelSppg } from "@/components/sppg/TabelSppg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type OrganisasiOption } from "@/lib/services/organisasi";
import { type SppgWithOrganisasi } from "@/lib/services/sppg";
import { StatusVerifikasi } from "@prisma/client";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle,
  Clock,
  Plus,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ViewMode = 'list' | 'form';

export default function SppgClientPage() {
  // State for data
  const [sppgData, setSppgData] = useState<SppgWithOrganisasi[]>([]);
  const [organisasiOptions, setOrganisasiOptions] = useState<OrganisasiOption[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    byStatus: {} as Record<StatusVerifikasi, number>
  });

  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusVerifikasi | undefined>();

  // State for UI
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingSppg, setEditingSppg] = useState<SppgWithOrganisasi | null>(null);
  const [deletingSppg, setDeletingSppg] = useState<SppgWithOrganisasi | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const limit = 10;

  // Load initial data
  useEffect(() => {
    loadData();
    loadOrganisasiOptions();
    loadStats();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (!initialLoading) {
      loadData();
    }
  }, [currentPage, searchQuery, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getSppgListAction({
        search: searchQuery || undefined,
        statusVerifikasi: statusFilter,
        page: currentPage,
        limit
      });

      if (response.success) {
        setSppgData(response.data.data);
        setTotalData(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Gagal memuat data SPPG");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const loadOrganisasiOptions = async () => {
    try {
      const response = await getOrganisasiOptionsAction();
      if (response.success) {
        setOrganisasiOptions(response.data);
      }
    } catch (error) {
      console.error("Failed to load organisasi options:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getSppgStatsAction();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleSearch = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleFilter = (status?: StatusVerifikasi) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setEditingSppg(null);
    setViewMode('form');
  };

  const handleEdit = (sppg: SppgWithOrganisasi) => {
    setEditingSppg(sppg);
    setViewMode('form');
  };

  const handleDelete = (id: string) => {
    const sppg = sppgData.find(s => s.id === id);
    if (sppg) {
      setDeletingSppg(sppg);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      
      let response;
      if (editingSppg) {
        response = await updateSppgAction(formData);
      } else {
        response = await createSppgAction(formData);
      }

      if (response.success) {
        toast.success(response.message);
        setViewMode('list');
        setEditingSppg(null);
        await loadData();
        await loadStats();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSppg) return;

    try {
      setLoading(true);
      const response = await deleteSppgAction(deletingSppg.id);

      if (response.success) {
        toast.success(response.message);
        setDeletingSppg(null);
        await loadData();
        await loadStats();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingSppg(null);
  };

  const StatusCard = ({ 
    title, 
    count, 
    icon: Icon, 
    variant,
    color 
  }: {
    title: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );

  if (viewMode === 'form') {
    return (
      <FormSppg
        sppg={editingSppg || undefined}
        organisasiOptions={organisasiOptions}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button 
          variant="outline" 
          onClick={() => loadData()}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Refresh Data
        </Button>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah SPPG
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatusCard
          title="Total SPPG"
          count={stats.total}
          icon={Building2}
          variant="default"
          color="text-blue-600"
        />
        <StatusCard
          title="Aktif"
          count={stats.byStatus['APPROVED'] || 0}
          icon={CheckCircle}
          variant="default"
          color="text-green-600"
        />
        <StatusCard
          title="Draft"
          count={stats.byStatus['DRAFT'] || 0}
          icon={Clock}
          variant="secondary"
          color="text-gray-600"
        />
        <StatusCard
          title="Review"
          count={stats.byStatus['UNDER_REVIEW'] || 0}
          icon={AlertTriangle}
          variant="default"
          color="text-yellow-600"
        />
        <StatusCard
          title="Tidak Aktif"
          count={(stats.byStatus['REJECTED'] || 0) + (stats.byStatus['SUSPENDED'] || 0)}
          icon={XCircle}
          variant="destructive"
          color="text-red-600"
        />
      </div>

      {/* Table */}
      <TabelSppg
        data={sppgData}
        total={totalData}
        page={currentPage}
        limit={limit}
        totalPages={totalPages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <ModalKonfirmasiHapus
        sppg={deletingSppg}
        open={!!deletingSppg}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingSppg(null)}
        loading={loading}
      />
    </div>
  );
}