import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Apple,
  TrendingUp,  
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Cookie,
  Droplets,
  Zap
} from "lucide-react";
import { getNutritionAnalyticsData } from "@/lib/services/dashboard";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export async function NutritionAnalytics() {
  const data = await getNutritionAnalyticsData();

  // Calculate nutrition metrics
  const totalMenus = data.akgCompliance.reduce((sum: number, item: any) => sum + item._count.id, 0);
  const compliantMenus = data.akgCompliance
    .filter((item: any) => item.statusAkg === 'MEMENUHI')
    .reduce((sum: number, item: any) => sum + item._count.id, 0);
  const complianceRate = totalMenus > 0 ? (compliantMenus / totalMenus) * 100 : 0;

  // Average nutrition values
  const avgCalories = data.akgCompliance.reduce((sum: number, item: any) => sum + (item._avg.kaloriPerPorsi || 0), 0) / data.akgCompliance.length;
  const avgProtein = data.akgCompliance.reduce((sum: number, item: any) => sum + (item._avg.proteinPerPorsi || 0), 0) / data.akgCompliance.length;
  const avgCarbs = data.akgCompliance.reduce((sum: number, item: any) => sum + (item._avg.karbohidratPerPorsi || 0), 0) / data.akgCompliance.length;
  const avgFat = data.akgCompliance.reduce((sum: number, item: any) => sum + (item._avg.lemakPerPorsi || 0), 0) / data.akgCompliance.length;

  // Prepare chart data
  const akgComplianceChart = data.akgCompliance.map((item: any) => ({
    name: item.statusAkg,
    value: item._count.id
  }));

  // Nutrition trend data (simplified)
  const nutritionTrendChart = data.nutritionTrend.slice(0, 7).map((item: any) => ({
    date: item.tanggal.toISOString().split('T')[0],
    kalori: item.kaloriPerPorsi || 0,
    protein: item.proteinPerPorsi || 0,
    karbohidrat: item.karbohidratPerPorsi || 0,
    lemak: item.lemakPerPorsi || 0
  }));

  return (
    <div className="space-y-4">
      {/* Nutrition KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kepatuhan AKG</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(complianceRate)}</div>
            <Progress value={complianceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {compliantMenus} dari {totalMenus} menu memenuhi standar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kalori</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(Math.round(avgCalories))}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                kkal/porsi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 650-750 kkal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Protein</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgProtein)}g</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge 
                variant={avgProtein >= 15 ? "default" : "destructive"} 
                className="text-xs"
              >
                {avgProtein >= 15 ? "Memadai" : "Kurang"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target minimum: 15g/porsi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Score</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5/10</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Keseimbangan gizi rata-rata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Kepatuhan AKG</CardTitle>
            <CardDescription>Distribusi status pemenuhan Angka Kecukupan Gizi</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={akgComplianceChart} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trend Nilai Gizi</CardTitle>
            <CardDescription>Perkembangan nilai gizi menu dalam 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={nutritionTrendChart} 
              xDataKey="date" 
              yDataKey="kalori"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Nutrition Analysis */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown Makronutrient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Karbohidrat
                  </span>
                  <span className="text-sm font-medium">{Math.round(avgCarbs)}g</span>
                </div>
                <Progress value={Math.min(100, (avgCarbs / 100) * 100)} />
                <p className="text-xs text-muted-foreground mt-1">55-65% total kalori</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <Scale className="w-3 h-3 mr-1" />
                    Protein
                  </span>
                  <span className="text-sm font-medium">{Math.round(avgProtein)}g</span>
                </div>
                <Progress value={Math.min(100, (avgProtein / 25) * 100)} />
                <p className="text-xs text-muted-foreground mt-1">10-15% total kalori</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <Droplets className="w-3 h-3 mr-1" />
                    Lemak
                  </span>
                  <span className="text-sm font-medium">{Math.round(avgFat)}g</span>
                </div>
                <Progress value={Math.min(100, (avgFat / 30) * 100)} />
                <p className="text-xs text-muted-foreground mt-1">20-35% total kalori</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Standar AKG Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.standardAkg.slice(0, 4).map((standard: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">{standard.kelompokUsia}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                    <div>Kalori: {standard.minKalori}-{standard.maxKalori || standard.minKalori}</div>
                    <div>Protein: {standard.minProtein}g+</div>
                    <div>Karbo: {standard.minKarbohidrat}g+</div>
                    <div>Lemak: {standard.minLemak}g+</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alert Gizi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">12 menu kekurangan protein</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">8 menu kelebihan lemak</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">25 menu sudah optimal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cookie className="h-4 w-4 text-blue-500" />
                <span className="text-sm">15 menu perlu evaluasi ulang</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu dengan Performa Gizi Terbaik</CardTitle>
          <CardDescription>Top 10 menu dengan nilai gizi yang memenuhi standar AKG</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Menu</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kalori</TableHead>
                <TableHead>Protein</TableHead>
                <TableHead>Karbohidrat</TableHead>
                <TableHead>Lemak</TableHead>
                <TableHead>Status AKG</TableHead>
                <TableHead>SPPG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.nutritionTrend
                .filter((menu: any) => menu.statusAkg === 'MEMENUHI')
                .slice(0, 10)
                .map((menu: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    Menu #{index + 1}
                  </TableCell>
                  <TableCell>
                    {new Date(menu.tanggal).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {Math.round(menu.kaloriPerPorsi || 0)} kkal
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {Math.round(menu.proteinPerPorsi || 0)}g
                  </TableCell>
                  <TableCell>
                    {Math.round(menu.karbohidratPerPorsi || 0)}g
                  </TableCell>
                  <TableCell>
                    {Math.round(menu.lemakPerPorsi || 0)}g
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={menu.statusAkg} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">SPPG-{index + 1}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Nutrition Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Perbaikan Gizi</CardTitle>
          <CardDescription>Saran untuk meningkatkan kualitas gizi menu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Prioritas Tinggi</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <div className="font-medium">Tingkatkan kandungan protein</div>
                    <div className="text-muted-foreground">12 menu di bawah standar minimum 15g/porsi</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <div className="font-medium">Kurangi lemak jenuh</div>
                    <div className="text-muted-foreground">8 menu melebihi batas lemak yang direkomendasikan</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Rekomendasi</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <div className="font-medium">Tambah sumber protein nabati</div>
                    <div className="text-muted-foreground">Tahu, tempe, kacang-kacangan untuk variasi</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <div className="font-medium">Perbanyak sayuran hijau</div>
                    <div className="text-muted-foreground">Untuk memenuhi kebutuhan mikronutrient</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}