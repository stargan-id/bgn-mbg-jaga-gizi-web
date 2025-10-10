import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Calendar,
  MapPin,
  ChefHat,
  FileCheck,
  ShoppingCart,
  Activity,
  Clock,
  Target,
  Zap
} from "lucide-react";
import { getDashboardOverviewData } from "@/lib/services/dashboard";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrendChart } from "@/components/charts/trend-chart";
import { PieChart } from "@/components/charts/pie-chart";

export async function DashboardOverview() {
  const data = await getDashboardOverviewData();

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SPPG</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalSppg)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`inline-flex items-center ${data.sppgGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {formatPercentage(data.sppgGrowth)} dari bulan lalu
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SPPG Terverifikasi</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.verifiedSppg)}</div>
            <Progress value={data.verificationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatPercentage(data.verificationRate)} tingkat verifikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Hari Ini</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.todayMenus)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={data.nutritionCompliance >= 80 ? "default" : "destructive"} className="text-xs">
                AKG: {formatPercentage(data.nutritionCompliance)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target porsi: {formatNumber(data.targetPortions)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kepatuhan Checklist</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(data.checklistCompliance)}</div>
            <Progress value={data.checklistCompliance} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {data.pendingChecklists} checklist tertunda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Trend Kegiatan Pengolahan</CardTitle>
            <CardDescription>Volume pengolahan dalam 30 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TrendChart data={data.processingTrend} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status Verifikasi SPPG</CardTitle>
            <CardDescription>Distribusi status verifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={data.verificationStatus} />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organisasi Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.organizationStats.map((org, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{org.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{org.sppgCount} SPPG</Badge>
                    <StatusBadge status={org.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert & Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{data.alerts.expiredDocuments} dokumen akan expired</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm">{data.alerts.overdueChecklists} checklist terlambat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{data.alerts.lowNutrition} menu di bawah standar AKG</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-orange-500" />
                <span className="text-sm">{data.alerts.lowStock} bahan baku menipis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performa Sistem</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Data Completion</span>
                  <span className="text-sm font-medium">{formatPercentage(data.performance.dataCompletion)}</span>
                </div>
                <Progress value={data.performance.dataCompletion} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Quality Score</span>
                  <span className="text-sm font-medium">{formatPercentage(data.performance.qualityScore)}</span>
                </div>
                <Progress value={data.performance.qualityScore} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">User Activity</span>
                  <span className="text-sm font-medium">{formatPercentage(data.performance.userActivity)}</span>
                </div>
                <Progress value={data.performance.userActivity} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Akses cepat ke fungsi utama sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <Building2 className="w-3 h-3 mr-1" />
              Tambah SPPG
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <ChefHat className="w-3 h-3 mr-1" />
              Buat Menu Harian
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <FileCheck className="w-3 h-3 mr-1" />
              Checklist Harian
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Laporan Bahan Baku
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <Activity className="w-3 h-3 mr-1" />
              Kegiatan Pengolahan
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              <MapPin className="w-3 h-3 mr-1" />
              Peta SPPG
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}