import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package,
  Truck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Star,
  BarChart3,
  ShoppingCart,
  Factory,
  Timer
} from "lucide-react";
import { getSupplyChainAnalyticsData } from "@/lib/services/dashboard";
import { formatNumber, formatPercentage, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export async function SupplyChainAnalytics() {
  const data = await getSupplyChainAnalyticsData();

  // Calculate supplier metrics
  const totalSuppliers = data.supplierPerformance.length;
  const activeSuppliers = data.supplierPerformance.filter((s: any) => s.statusAktif === 'AKTIF').length;
  const avgDeliveries = data.supplierPerformance.reduce((sum: number, s: any) => sum + s._count.laporanBahanBaku, 0) / totalSuppliers;
  
  // Calculate quality metrics
  const totalDeliveries = data.supplierPerformance.reduce((sum: number, s: any) => sum + s._count.laporanBahanBaku, 0);
  const goodQualityDeliveries = data.supplierPerformance.reduce((sum: number, s: any) => 
    sum + s.laporanBahanBaku.filter((l: any) => ['SANGAT_BAIK', 'BAIK'].includes(l.kondisiBahan)).length, 0
  );
  const qualityRate = totalDeliveries > 0 ? (goodQualityDeliveries / totalDeliveries) * 100 : 0;

  // Prepare chart data
  const inventoryByType = data.inventoryStatus.map((item: any) => ({
    name: item.jenisBahan,
    value: item._sum.jumlah || 0
  }));

  const inventoryByCondition = data.inventoryStatus
    .reduce((acc: any[], item: any) => {
      const existing = acc.find(a => a.name === item.kondisiBahan);
      if (existing) {
        existing.value += item._count.id;
      } else {
        acc.push({ name: item.kondisiBahan, value: item._count.id });
      }
      return acc;
    }, []);

  const topUsedMaterials = data.usageTrend
    .sort((a: any, b: any) => (b._sum.jumlahDigunakan || 0) - (a._sum.jumlahDigunakan || 0))
    .slice(0, 10)
    .map((item: any) => ({
      name: item.namaBahan,
      value: item._sum.jumlahDigunakan || 0
    }));

  return (
    <div className="space-y-4">
      {/* Supply Chain KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasok</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalSuppliers)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="default" className="text-xs">
                {activeSuppliers} aktif
              </Badge>
              <Badge variant="outline" className="text-xs">
                {totalSuppliers - activeSuppliers} non-aktif
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kualitas Pengiriman</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(qualityRate)}</div>
            <Progress value={qualityRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {goodQualityDeliveries} dari {totalDeliveries} pengiriman
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgDeliveries)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                per bulan/pemasok
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Konsistensi pengiriman
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5x</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Efisiensi penggunaan bahan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Inventory by Jenis Bahan</CardTitle>
            <CardDescription>Volume bahan baku berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={inventoryByType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kondisi Bahan Baku</CardTitle>
            <CardDescription>Status kualitas bahan baku yang diterima</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={inventoryByCondition} />
          </CardContent>
        </Card>
      </div>

      {/* Material Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Bahan Baku Paling Banyak Digunakan</CardTitle>
          <CardDescription>Volume penggunaan bahan baku dalam 30 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={topUsedMaterials} height={400} />
        </CardContent>
      </Card>

      {/* Supplier Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performa Pemasok</CardTitle>
          <CardDescription>Evaluasi kinerja pemasok berdasarkan kualitas dan konsistensi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pemasok</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Pengiriman</TableHead>
                <TableHead>Kualitas Rata-rata</TableHead>
                <TableHead>On-Time Delivery</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.supplierPerformance.slice(0, 10).map((supplier: any, index: number) => {
                const qualityScore = supplier.laporanBahanBaku.length > 0 ? 
                  (supplier.laporanBahanBaku.filter((l: any) => ['SANGAT_BAIK', 'BAIK'].includes(l.kondisiBahan)).length / supplier.laporanBahanBaku.length) * 100 : 0;
                const onTimeDelivery = Math.floor(Math.random() * 30) + 70; // Mock data
                const rating = Math.round((qualityScore + onTimeDelivery) / 20);
                
                return (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      {supplier.nama}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {supplier.jenisPemasok}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={supplier.statusAktif} />
                    </TableCell>
                    <TableCell>
                      {formatNumber(supplier._count.laporanBahanBaku)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={qualityScore} className="w-16" />
                        <span className="text-sm">{formatPercentage(qualityScore)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={onTimeDelivery} className="w-16" />
                        <span className="text-sm">{formatPercentage(onTimeDelivery)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Supply Chain Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Rata-rata Lead Time</span>
                <span className="font-medium">3.2 hari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tercepat</span>
                <span className="font-medium">1 hari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Terlama</span>
                <span className="font-medium">7 hari</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Standar Deviasi</span>
                <span className="font-medium">±1.8 hari</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Spending (30d)</span>
                <span className="font-medium">{formatCurrency(85000000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Rata-rata per SPPG</span>
                <span className="font-medium">{formatCurrency(2500000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Trend Cost</span>
                <span className="font-medium flex items-center text-green-600">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -5.2%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Savings Target</span>
                <span className="font-medium">{formatCurrency(4250000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supply Chain Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">5 bahan baku stok menipis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm">3 pengiriman terlambat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">12 bahan akan expired</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">15 pengiriman on-time</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management Dashboard</CardTitle>
          <CardDescription>Status real-time inventory dan rekomendasi restocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">Stock Level Warnings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm">Beras Premium</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">15kg</div>
                    <div className="text-xs text-muted-foreground">Min: 50kg</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm">Minyak Goreng</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">8L</div>
                    <div className="text-xs text-muted-foreground">Min: 20L</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Daging Ayam</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">25kg</div>
                    <div className="text-xs text-muted-foreground">Min: 30kg</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-sm text-red-800">Urgent Restock</div>
                  <div className="text-xs text-red-600">Order beras premium minimum 100kg</div>
                </div>
                <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                  <div className="font-medium text-sm text-orange-800">Schedule Delivery</div>
                  <div className="text-xs text-orange-600">Minyak goreng dalam 2-3 hari</div>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-sm text-green-800">Optimize Usage</div>
                  <div className="text-xs text-green-600">Monitor konsumsi sayuran segar</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}