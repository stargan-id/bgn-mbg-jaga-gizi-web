/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart } from "@/components/charts/pie-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getGeographicAnalyticsData } from "@/lib/services/dashboard";
import { formatNumber, formatPercentage } from "@/lib/utils";
import {
  Globe,
  Layers,
  Map as MapIcon,
  MapPin,
  Target
} from "lucide-react";

export async function GeographicAnalytics() {
  const data = await getGeographicAnalyticsData();

  // Calculate geographic metrics
  const totalSppgWithLocation = data.sppgDistribution.length;
  const totalCapacity = data.sppgDistribution.reduce((sum: number, sppg: any) => sum + sppg.kapasitasProduksi, 0);
  const avgCapacityPerSppg = totalSppgWithLocation > 0 ? totalCapacity / totalSppgWithLocation : 0;

  // Regional distribution

  const regionalData = data.regionalStats.map((org: any) => ({
    name: org.nama,
    sppgCount: org._count.sppg,
  
    totalCapacity: org.sppg.reduce((sum: number, s: any) => sum + s.kapasitasProduksi, 0),
  
    verifiedCount: org.sppg.filter((s: any) => s.statusVerifikasi === 'APPROVED').length
  }));

  // Province/Region concentration
  const provinceConcentration: { [key: string]: number } = {};

  data.sppgDistribution.forEach((sppg: any) => {
    // Mock province assignment based on coordinates (simplified)
    let province = 'Jakarta';
    if (sppg.latitude < -6.5) province = 'Jawa Barat';
    else if (sppg.latitude > -6 && sppg.longitude > 110) province = 'Jawa Tengah';
    else if (sppg.latitude > 0) province = 'Sumatera Utara';
    
    provinceConcentration[province] = (provinceConcentration[province] || 0) + 1;
  });

  const provinceChart = Object.entries(provinceConcentration).map(([name, value]) => ({
    name,
    value
  }));

  // Performance by region
  const regionPerformance = regionalData.slice(0, 5).map(region => ({
    ...region,
    verificationRate: region.sppgCount > 0 ? (region.verifiedCount / region.sppgCount) * 100 : 0,
    capacityUtilization: Math.floor(Math.random() * 30) + 70 // Mock data
  }));

  return (
    <div className="space-y-4">
      {/* Geographic KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SPPG Tersebar</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalSppgWithLocation)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                dengan koordinat
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Coverage area nasional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kapasitas Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalCapacity)}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                porsi/hari
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Rata-rata: {formatNumber(Math.round(avgCapacityPerSppg))} per SPPG
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Area</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="default" className="text-xs">
                provinsi
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              130+ kota/kabupaten
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Density Score</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8</div>
            <Progress value={78} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              SPPG per 100km² (urban)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map Placeholder and Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Peta Sebaran SPPG</CardTitle>
            <CardDescription>Distribusi geografis SPPG di Indonesia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Mock Indonesia Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <MapIcon className="w-32 h-32 text-blue-200" />
              </div>
              
              {/* Mock SPPG Markers */}
              <div className="absolute top-20 left-24 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute top-32 left-32 w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute top-28 left-40 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute top-36 left-28 w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="absolute top-24 left-36 w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="absolute bottom-24 left-20 w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="absolute bottom-32 left-36 w-3 h-3 bg-pink-500 rounded-full"></div>
              <div className="absolute bottom-20 right-32 w-3 h-3 bg-indigo-500 rounded-full"></div>
              
              <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded text-xs">
                <div className="font-medium mb-1">Legend:</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Under Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi by Provinsi</CardTitle>
            <CardDescription>Konsentrasi SPPG per wilayah</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={provinceChart} />
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performa Regional</CardTitle>
          <CardDescription>Analisis kinerja SPPG berdasarkan organisasi regional</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisasi</TableHead>
                <TableHead>Jumlah SPPG</TableHead>
                <TableHead>Kapasitas Total</TableHead>
                <TableHead>Tingkat Verifikasi</TableHead>
                <TableHead>Utilisasi</TableHead>
                <TableHead>Performance Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionPerformance.map((region: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {region.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatNumber(region.sppgCount)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatNumber(region.totalCapacity)} porsi/hari
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={region.verificationRate} className="w-16" />
                      <span className="text-sm">{formatPercentage(region.verificationRate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={region.capacityUtilization} className="w-16" />
                      <span className="text-sm">{formatPercentage(region.capacityUtilization)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={region.verificationRate > 80 ? "default" : region.verificationRate > 60 ? "secondary" : "destructive"}
                    >
                      {Math.round((region.verificationRate + region.capacityUtilization) / 20)}/5
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Geographic Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coverage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Urban Coverage</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Rural Coverage</span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Remote Areas</span>
                <span className="font-medium">34%</span>
              </div>
              <Progress value={34} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access & Transportation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Akses Jalan Baik</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dekat Pasar Tradisional</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Transportasi Umum</span>
                <span className="font-medium">62%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Logistik Optimal</span>
                <span className="font-medium">71%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Geographic Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-sm">15 SPPG di area terpencil</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">8 wilayah akses sulit</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm">22 SPPG perlu upgrade infrastruktur</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm">5 area butuh expansion</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi Strategis Geografis</CardTitle>
          <CardDescription>Saran pengembangan dan optimalisasi distribusi SPPG</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-3">Expansion Opportunities</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Papua Barat - Manokwari</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Gap coverage untuk 50,000 penduduk
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">High Priority</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Kalimantan Utara - Tarakan</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Potensi melayani 3 kabupaten sekitar
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">Medium Priority</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Sulawesi Tengah - Palu</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Recovery area pasca bencana
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">Strategic</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Optimization Areas</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Jakarta - Optimasi Density</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Redistribusi untuk efisiensi operasional
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">Efficiency</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Jawa Barat - Hub Integration</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Konsolidasi supply chain regional
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">Cost Saving</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Sumatera - Connectivity</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Improve inter-SPPG coordination
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">Network</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}