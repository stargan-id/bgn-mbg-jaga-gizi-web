/* eslint-disable @typescript-eslint/no-explicit-any */

import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOperationalAnalyticsData } from "@/lib/services/dashboard";
import { formatNumber, formatPercentage, formatTime } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Target,
  ThermometerSun,
  Timer,
  Users
} from "lucide-react";

export async function OperationalAnalytics() {
  const data = await getOperationalAnalyticsData();

  // Calculate aggregated metrics
  const totalActivities = data.processingActivities.length;
  const activeActivities = data.processingActivities.filter((a: any) => a.statusKegiatan === 'BERLANGSUNG').length;
  const completedActivities = data.processingActivities.filter((a: any) => a.statusKegiatan === 'SELESAI').length;
  const avgCompletionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  // Quality metrics aggregation
  const qualityData = data.qualityMetrics.map((q: any) => ({
    name: q.statusMutu,
    value: q._count.id
  }));

  const totalQualityChecks = qualityData.reduce((sum: number, item: any) => sum + item.value, 0);
  const goodQualityChecks = qualityData
    .filter((item: any) => ['SANGAT_BAIK', 'BAIK'].includes(item.name))
    .reduce((sum: number, item: any) => sum + item.value, 0);
  const qualityScore = totalQualityChecks > 0 ? (goodQualityChecks / totalQualityChecks) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Operational KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kegiatan Hari Ini</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalActivities)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="default" className="text-xs">
                {activeActivities} berlangsung
              </Badge>
              <Badge variant="outline" className="text-xs">
                {completedActivities} selesai
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(avgCompletionRate)}</div>
            <Progress value={avgCompletionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Target harian tercapai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skor Mutu</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(qualityScore)}</div>
            <Progress value={qualityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalQualityChecks} kontrol mutu dilakukan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efisiensi Waktu</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Rata-rata waktu pengolahan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Mutu</CardTitle>
            <CardDescription>Hasil kontrol mutu dalam 30 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={qualityData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend Kepatuhan Checklist</CardTitle>
            <CardDescription>Penyelesaian checklist harian</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={data.checklistTrend} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kegiatan Pengolahan Hari Ini</CardTitle>
          <CardDescription>Detail kegiatan pengolahan yang sedang berlangsung atau baru selesai</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SPPG</TableHead>
                <TableHead>Menu</TableHead>
                <TableHead>Jam Mulai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target Porsi</TableHead>
                <TableHead>Realisasi</TableHead>
                <TableHead>Bahan Baku</TableHead>
                <TableHead>Kontrol Mutu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.processingActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    {activity.sppg.nama}
                  </TableCell>
                  <TableCell>
                    {activity.menuHarian?.namaMenu || 'Menu Khusus'}
                  </TableCell>
                  <TableCell>
                    {formatTime(activity.jamMulai)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={activity.statusKegiatan} />
                  </TableCell>
                  <TableCell>
                    {formatNumber(activity.targetPorsi)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{formatNumber(activity.porsiTerealisasi || 0)}</span>
                      {activity.porsiTerealisasi && activity.targetPorsi && (
                        <Badge 
                          variant={activity.porsiTerealisasi >= activity.targetPorsi ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {formatPercentage((activity.porsiTerealisasi / activity.targetPorsi) * 100)}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {activity._count.penggunaanBahanBaku} items
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {activity._count.kontrolMutu} checks
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metrik Kinerja Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Waktu Rata-rata Pengolahan</span>
                <span className="font-medium">2.5 jam</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Efisiensi Bahan Baku</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tingkat Kesesuaian Resep</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Kontrol Suhu Optimal</span>
                <span className="font-medium">91%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">2 kegiatan melebihi waktu target</span>
              </div>
              <div className="flex items-center space-x-2">
                <ThermometerSun className="h-4 w-4 text-orange-500" />
                <span className="text-sm">3 kontrol suhu perlu perhatian</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">5 checklist belum disubmit</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">1 SPPG butuh bantuan tenaga</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produktivitas SPPG</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">SPPG Terproduktif</span>
                  <span className="text-sm font-medium">SMAN 1 Jakarta</span>
                </div>
                <Progress value={95} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Rata-rata Porsi/Hari</span>
                  <span className="text-sm font-medium">1,245 porsi</span>
                </div>
                <Progress value={78} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Konsistensi Operasional</span>
                  <span className="text-sm font-medium">89%</span>
                </div>
                <Progress value={89} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}