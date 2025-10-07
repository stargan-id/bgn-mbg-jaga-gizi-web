# BGN Command Dashboard

Comprehensive dashboard untuk monitoring nasional program Makan Bergizi Gratis (MBG) yang dikelola oleh Badan Gizi Nasional (BGN).

## 🎯 Overview

Dashboard ini dirancang sebagai **Command Center** untuk BGN dalam memonitor operasional SPPG (Satuan Pelayanan Pemenuhan Gizi) di seluruh Indonesia secara real-time.

## 🏗️ Arsitektur Komponen

### Core Components

#### 1. **SidebarNavigasi**
- Navigation sidebar dengan menu utama
- Responsive design (drawer di mobile)
- Brand identity JAGA GIZI
- Menu: Beranda, Peta Nasional, Analitik, Peringatan, SPPG, Laporan, Pengaturan

#### 2. **HeaderDashboard**
- Header dengan title dan search functionality
- User profile dropdown
- Notification bell dengan badge counter
- Mobile-responsive search bar

#### 3. **StatusIndicator**
- Real-time system status
- Connection status (online/offline)
- Last update timestamp
- Manual refresh capability

#### 4. **AksiCepat (Quick Actions)**
- Primary actions: Tambah SPPG, Buat Laporan, Ekspor Data, Kirim Notifikasi
- Secondary actions: Filter Wilayah, Cari SPPG, Peringatan, Pengaturan
- Mobile-optimized button layout

#### 5. **KartuKpi (KPI Cards)**
- 4 key metrics cards:
  - Tingkat Pelaporan Harian (Target: 95%)
  - Skor Kepatuhan Nasional (Target: 85%)
  - SPPG Aktif (dari total registered)
  - Peringatan Kritis (aktif alerts)
- Color-coded status indicators
- Trend indicators (up/down/stable)

#### 6. **PetaNasional (National Map)**
- Interactive map placeholder untuk Indonesia
- Status legend dengan color coding:
  - 🟢 Hijau: Patuh Penuh (95%+ compliance)
  - 🟡 Kuning: Patuh Sebagian (75-95% compliance)
  - 🔴 Merah: Tidak Patuh (<75% compliance)
  - ⚫ Abu: Belum Lapor (no recent report)
- Location dots dengan hover tooltip
- Quick statistics dan action buttons

#### 7. **PanelPeringatan (Alerts Panel)**
- Real-time alerts dengan severity levels
- Alert types: NO_REPORT, LOW_COMPLIANCE, FOOD_SAFETY, SYSTEM
- Status tracking: ACTIVE, ACKNOWLEDGED, RESOLVED
- Action buttons untuk acknowledge dan detail view

#### 8. **FeedAktivitas (Activity Feed)**
- Live activity stream dari semua SPPG
- Activity types: REPORT_SUBMITTED, ISSUE_RESOLVED, VERIFICATION, ALERT
- Timeline design dengan icons dan timestamps
- Status-based color coding

#### 9. **PerformaRegional (Regional Performance)**
- Regional ranking berdasarkan compliance score
- Progress bars untuk compliance dan reporting rates
- Critical issues indicator
- Top performer highlighting dengan award badge

### Support Components

#### 10. **ResponsiveLayout**
- ResponsiveContainer untuk full-screen layouts
- GridLayout dengan configurable breakpoints
- MobileAdaptiveCard dengan responsive padding

#### 11. **LoadingStates**
- DashboardSkeleton untuk loading states
- LoadingState dengan spinner
- EmptyState untuk no-data scenarios

## 📱 Mobile-First Design

### Responsive Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md/lg) 
- **Desktop**: > 1024px (xl)

### Mobile Optimizations
1. **Sidebar Navigation**: Collapsible drawer with overlay
2. **Header**: Simplified with hamburger menu
3. **KPI Cards**: 1-2 columns layout
4. **Grid Layouts**: Stack vertically on mobile
5. **Quick Actions**: 2-column grid untuk primary actions
6. **Tables**: Horizontal scroll dengan fixed headers
7. **Charts**: Responsive sizing dengan touch interactions

## 🎨 UI/UX Principles

### Design Language
- **Colors**: Green primary (BGN branding), semantic colors for status
- **Typography**: Clear hierarchy dengan readable sizes
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle elevation untuk depth

### Accessibility
- **Contrast**: WCAG 2.1 AA compliance
- **Navigation**: Keyboard accessible
- **Screen Readers**: Proper ARIA labels
- **Focus States**: Visible focus indicators

### Performance
- **Lazy Loading**: Components load on demand
- **Virtual Scrolling**: Untuk large datasets
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: Efficient data management

## 📊 Data Flow

### Mock Data Structure
```typescript
// KPI Metrics
interface KpiMetrics {
  dailyReportingRate: number;
  nationalComplianceScore: number;
  criticalAlerts: number;
  activeSppg: number;
  totalSppg: number;
}

// SPPG Status
interface SppgStatusData {
  id: string;
  nama: string;
  status: 'COMPLIANT' | 'PARTIAL' | 'NON_COMPLIANT' | 'NO_REPORT';
  complianceScore: number;
  lastReport: Date;
  // ... geografis dan organisasi data
}

// Alerts
interface AlertData {
  type: 'NO_REPORT' | 'LOW_COMPLIANCE' | 'FOOD_SAFETY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  // ... message dan timestamp
}
```

## 🔄 Real-time Features

### Auto-refresh Mechanisms
1. **Status Indicator**: Updates every minute
2. **KPI Metrics**: Real-time WebSocket updates
3. **Activity Feed**: Live event streaming
4. **Alerts Panel**: Immediate notifications

### Update Strategies
- **Polling**: Fallback untuk compatibility
- **WebSockets**: Real-time bidirectional communication
- **Server-Sent Events**: One-way live updates
- **Optimistic Updates**: Immediate UI feedback

## 📈 Performance Metrics

### Target Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Optimization Techniques
- Component lazy loading
- Image optimization dengan Next.js
- Bundle splitting per route
- Service Worker caching
- Database query optimization

## 🚀 Implementation Status

### ✅ Completed Components
- [x] SidebarNavigasi dengan responsive navigation
- [x] HeaderDashboard dengan search dan profile
- [x] StatusIndicator dengan real-time updates
- [x] AksiCepat dengan mobile-optimized actions
- [x] KartuKpi dengan trend indicators
- [x] PetaNasional dengan interactive elements
- [x] PanelPeringatan dengan severity handling
- [x] FeedAktivitas dengan timeline design
- [x] PerformaRegional dengan ranking system
- [x] LoadingStates dan EmptyStates
- [x] ResponsiveLayout helpers
- [x] TypeScript interfaces dan mock data

### 🔄 In Progress
- [ ] Real WebSocket integration
- [ ] Actual map component (Leaflet/Mapbox)
- [ ] Advanced filtering capabilities
- [ ] Export functionality
- [ ] User preference persistence

### 📋 Next Phase
- [ ] Drill-down detail pages
- [ ] Advanced analytics dashboard
- [ ] Mobile PWA capabilities
- [ ] Offline functionality
- [ ] Push notifications

## 💻 Development Setup

### Prerequisites
```bash
Node.js >= 18
pnpm >= 8
```

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

## 📱 Mobile Testing

### Test Devices
- iPhone 12/13/14 (390px)
- Samsung Galaxy S21 (360px)
- iPad (768px)
- iPad Pro (1024px)

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 🔐 Security Considerations

### Data Protection
- Input validation pada semua forms
- XSS prevention dengan proper escaping
- CSRF protection dengan tokens
- Rate limiting untuk API calls

### Authentication
- NextAuth.js integration
- Role-based access control (RBAC)
- Session management
- Secure cookie handling

## 📞 Support & Documentation

### Component Documentation
Setiap komponen memiliki:
- TypeScript interfaces
- Props documentation
- Usage examples
- Mobile considerations

### API Integration
- RESTful endpoints
- GraphQL queries (future)
- WebSocket events
- Error handling patterns

---

**Built by PT STARGAN MITRA TEKNOLOGI**  
*Digital Solution for BGN National Nutrition Program*