import { ProtectedLayout } from '@/components/layout';
import { PetaContent } from './components/PetaContent';
import { getSppgMapDataAction, getSppgStatsAction } from '@/actions/sppg';

export default async function PetaPage() {
  // Fetch SPPG data and stats
  const [sppgResult, statsResult] = await Promise.all([
    getSppgMapDataAction(),
    getSppgStatsAction()
  ]);

  const sppgData = sppgResult.success ? sppgResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <ProtectedLayout 
      title="Peta Nasional SPPG"
      subtitle="Sebaran dan Status Satuan Pelayanan Pemenuhan Gizi"
      topBarContent={
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Terverifikasi: {sppgData.filter(s => s.statusVerifikasi === 'APPROVED').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Review: {sppgData.filter(s => s.statusVerifikasi === 'UNDER_REVIEW').length}</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="font-medium">Total: {sppgData.length} SPPG</span>
          </div>
        </div>
      }
    >
      <PetaContent initialSppgData={sppgData} initialStats={stats} />
    </ProtectedLayout>
  );
}