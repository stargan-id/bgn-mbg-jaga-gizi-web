import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { ProtectedLayout } from "@/components/layout";
import SppgClientPage from "@/components/sppg/SppgClientPage";
import { Building2, Activity, BarChart3 } from "lucide-react";

export default function SppgPage() {
  return (
    <ProtectedLayout 
      title="Manajemen SPPG"
      subtitle="Kelola Satuan Pelayanan Pemenuhan Gizi secara terpusat"
      topBarContent={
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden md:block">Status:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Active
          </span>
        </div>
      }
    >
      <div className="p-4 md:p-6 space-y-6">
        <Suspense fallback={
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
            <div className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <SppgClientPage />
        </Suspense>
      </div>
    </ProtectedLayout>
  );
}