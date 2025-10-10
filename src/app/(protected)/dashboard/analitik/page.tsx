import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  BarChart3
} from "lucide-react";

// Import layout dan components
import { ProtectedLayout } from '@/components/layout';
import { DashboardOverview } from "@/components/dashboard/overview";
import { OperationalAnalytics } from "@/components/dashboard/operational-analytics";
import { NutritionAnalytics } from "@/components/dashboard/nutrition-analytics";
import { SupplyChainAnalytics } from "@/components/dashboard/supply-chain-analytics";
import { GeographicAnalytics } from "@/components/dashboard/geographic-analytics";
import { Skeleton } from "@/components/ui/skeleton";

// Dashboard Skeleton Component
const DashboardSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[60px] mb-1" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <Skeleton className="h-5 w-[200px]" />
        </CardHeader>
        <CardContent className="pl-2">
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-5 w-[150px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function AnalitikPage() {
  return (
    <ProtectedLayout 
      title="Analitik Dashboard"
      subtitle="Analisis mendalam performa SPPG dan insights strategis"
      topBarContent={
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Live Data</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>Real-time</span>
          </Badge>
        </div>
      }
    >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="operational">Operasional</TabsTrigger>
            <TabsTrigger value="nutrition">Gizi & Menu</TabsTrigger>
            <TabsTrigger value="supply">Supply Chain</TabsTrigger>
            <TabsTrigger value="geographic">Geografis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardOverview />
            </Suspense>
          </TabsContent>

          <TabsContent value="operational" className="space-y-4">
            <Suspense fallback={<DashboardSkeleton />}>
              <OperationalAnalytics />
            </Suspense>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <Suspense fallback={<DashboardSkeleton />}>
              <NutritionAnalytics />
            </Suspense>
          </TabsContent>

          <TabsContent value="supply" className="space-y-4">
            <Suspense fallback={<DashboardSkeleton />}>
              <SupplyChainAnalytics />
            </Suspense>
          </TabsContent>

          <TabsContent value="geographic" className="space-y-4">
            <Suspense fallback={<DashboardSkeleton />}>
              <GeographicAnalytics />
            </Suspense>
          </TabsContent>
        </Tabs>
    </ProtectedLayout>
  );
}