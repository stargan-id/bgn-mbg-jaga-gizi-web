import { Suspense } from "react";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PeringatanClientPage } from "@/components/peringatan/PeringatanClientPage";
import { Skeleton } from "@/components/ui/skeleton";

// Loading component for suspense
function PeringatanLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header stats loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      
      {/* Chart loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
      
      {/* Recent alerts loading */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function PeringatanPage() {
  return (
    <ProtectedLayout
      title="Dashboard Peringatan"
      subtitle="Monitoring dan manajemen peringatan sistem JAGA GIZI"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<PeringatanLoadingState />}>
          <PeringatanClientPage />
        </Suspense>
      </div>
    </ProtectedLayout>
  );
}