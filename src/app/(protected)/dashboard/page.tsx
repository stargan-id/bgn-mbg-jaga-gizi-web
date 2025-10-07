import { SidebarNavigasi } from './components/SidebarNavigasi';
import { HeaderDashboard } from './components/HeaderDashboard';
import { StatusIndicator } from './components/StatusIndicator';
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
  return (
    <SidebarNavigasi>
      <div className="flex flex-col h-full">
        <HeaderDashboard 
          title="Command Center BGN"
          subtitle="Monitoring Nasional Program Makan Bergizi Gratis"
          alertCount={mockAlerts.filter(alert => alert.status === 'ACTIVE').length}
        />
        
        <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
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
      </div>
    </SidebarNavigasi>
  );
}