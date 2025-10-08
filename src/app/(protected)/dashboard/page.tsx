import { ProtectedLayout } from '@/components/layout';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { AksiCepat } from './components/AksiCepat';
import { KartuKpi } from './components/KartuKpi';
import { PetaNasional } from './components/PetaNasional';
import { PanelPeringatan } from './components/PanelPeringatan';
import { FeedAktivitas } from './components/FeedAktivitas';
import { PerformaRegional } from './components/PerformaRegional';
import { 
  mockKpiMetrics, 
  mockSppgData, 
  mockAlerts, 
  mockActivityFeed, 
  mockRegionalPerformance 
} from '@/lib/mock-data';

export default function DashboardPage() {
  const activeAlertCount = mockAlerts.filter(alert => alert.status === 'ACTIVE').length;

  return (
    <ProtectedLayout 
      title="Command Center BGN"
      subtitle="Monitoring Nasional Program Makan Bergizi Gratis"
      topBarContent={
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden md:block">Peringatan Aktif:</span>
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            {activeAlertCount}
          </span>
        </div>
      }
    >
      <div className="p-4 md:p-6 space-y-6">
        {/* Status & Quick Actions */}
        <StatusIndicator />
        <AksiCepat />
        
        {/* KPI Cards */}
        <KartuKpi data={mockKpiMetrics} />
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Map */}
          <div className="xl:col-span-2">
            <PetaNasional sppgData={mockSppgData} />
          </div>
          
          {/* Right Column - Alerts */}
          <div>
            <PanelPeringatan alerts={mockAlerts} />
          </div>
        </div>
        
        {/* Bottom Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Regional Performance */}
          <PerformaRegional data={mockRegionalPerformance} />
          
          {/* Activity Feed */}
          <FeedAktivitas activities={mockActivityFeed} />
        </div>
      </div>
    </ProtectedLayout>
  );
}