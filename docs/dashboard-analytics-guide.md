# 📊 Dashboard Analytics SPPG - Dokumentasi Lengkap

## 🎯 Overview
Dashboard Analytics SPPG adalah sistem analitik komprehensif untuk mengelola dan memantau Satuan Pelayanan Pemenuhan Gizi (SPPG) di seluruh Indonesia. Dashboard ini menyediakan insight mendalam tentang operasional, nutrisi, supply chain, dan distribusi geografis SPPG.

## 🏗️ Arsitektur Dashboard

### 📁 File Structure
```
src/
├── app/(protected)/dashboard/analytics/
│   └── page.tsx                          # Main dashboard page
├── components/dashboard/
│   ├── overview.tsx                      # Dashboard overview utama
│   ├── operational-analytics.tsx         # Analitik operasional
│   ├── nutrition-analytics.tsx           # Analitik gizi & menu
│   ├── supply-chain-analytics.tsx        # Analitik supply chain
│   └── geographic-analytics.tsx          # Analitik geografis
├── components/charts/
│   ├── bar-chart.tsx                     # Bar chart component
│   ├── line-chart.tsx                    # Line chart component
│   ├── pie-chart.tsx                     # Pie chart component
│   └── trend-chart.tsx                   # Trend chart component
├── components/ui/
│   └── status-badge.tsx                  # Status badge component
└── lib/services/
    └── dashboard.ts                      # Dashboard service functions
```

## 🔥 Features & Capabilities

### 1. 📈 **Dashboard Overview**
- **KPI Cards**: Total SPPG, verifikasi, menu harian, kepatuhan checklist
- **Trend Analysis**: Grafik pengolahan 30 hari terakhir
- **Status Distribution**: Pie chart status verifikasi SPPG
- **Organization Stats**: Performa organisasi regional
- **Real-time Alerts**: Dokumen expired, checklist tertunda, dll
- **Performance Metrics**: Data completion, quality score, user activity
- **Quick Actions**: Shortcut ke fitur utama sistem

### 2. ⚙️ **Operational Analytics**
- **Activity Tracking**: Kegiatan pengolahan real-time
- **Quality Control**: Skor mutu dan distribusi status
- **Checklist Compliance**: Trend kepatuhan checklist harian
- **Processing Metrics**: Target vs realisasi porsi
- **Efficiency Analysis**: Waktu pengolahan, efisiensi bahan baku
- **Operational Alerts**: Kegiatan terlambat, kontrol suhu, dll
- **SPPG Performance**: Ranking produktivitas SPPG

### 3. 🍎 **Nutrition Analytics**
- **AKG Compliance**: Kepatuhan Angka Kecukupan Gizi
- **Macronutrient Analysis**: Breakdown protein, karbohidrat, lemak
- **Nutrition Trends**: Perkembangan nilai gizi menu
- **Standard Comparison**: Perbandingan dengan standar AKG
- **Menu Performance**: Top menu dengan nilai gizi optimal
- **Nutrition Alerts**: Menu kekurangan protein, kelebihan lemak
- **Recommendations**: Saran perbaikan kualitas gizi

### 4. 🚛 **Supply Chain Analytics**
- **Supplier Performance**: Rating dan evaluasi pemasok
- **Inventory Management**: Stock level dan turnover rate
- **Material Usage**: Top bahan baku paling banyak digunakan
- **Quality Tracking**: Kondisi bahan baku yang diterima
- **Lead Time Analysis**: Waktu pengiriman rata-rata
- **Cost Analysis**: Total spending dan trend cost
- **Supply Alerts**: Stock menipis, pengiriman terlambat
- **Restocking Recommendations**: Saran pemesanan ulang

### 5. 🗺️ **Geographic Analytics**
- **SPPG Distribution**: Peta sebaran SPPG nasional
- **Regional Performance**: Analisis kinerja per wilayah
- **Coverage Analysis**: Urban vs rural coverage
- **Density Metrics**: Konsentrasi SPPG per area
- **Access & Transportation**: Infrastruktur dan logistik
- **Geographic Challenges**: Area terpencil dan akses sulit
- **Expansion Opportunities**: Rekomendasi area baru
- **Strategic Recommendations**: Optimalisasi distribusi

## 📊 Key Performance Indicators (KPIs)

### 🎯 **Primary KPIs**
1. **Total SPPG**: Jumlah total SPPG aktif
2. **Verification Rate**: Persentase SPPG terverifikasi
3. **Nutrition Compliance**: Kepatuhan standar AKG
4. **Checklist Compliance**: Tingkat penyelesaian checklist
5. **Quality Score**: Skor mutu rata-rata
6. **Supplier Rating**: Rating pemasok rata-rata
7. **Coverage**: Cakupan geografis nasional

### 📈 **Secondary KPIs**
1. **Processing Efficiency**: Efisiensi waktu pengolahan
2. **Material Utilization**: Utilisasi bahan baku
3. **Inventory Turnover**: Perputaran inventory
4. **Lead Time**: Waktu pengiriman rata-rata
5. **Cost per Portion**: Biaya per porsi makanan
6. **Regional Balance**: Keseimbangan distribusi regional

## 🔧 Technical Implementation

### 🛠️ **Tech Stack**
- **Frontend**: Next.js 14 dengan App Router
- **UI Components**: Shadcn/ui + Radix UI
- **Charts**: Recharts untuk visualisasi data
- **Database**: PostgreSQL dengan Prisma ORM
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

### 📡 **Data Sources**
```typescript
// Main entities dari Prisma schema:
- Sppg (SPPG data)
- MenuHarian (Daily menus)
- ChecklistHarian (Daily checklists)
- KegiatanPengolahan (Processing activities)
- LaporanBahanBaku (Material reports)
- Pemasok (Suppliers)
- KontrolMutuPengolahan (Quality control)
- Organisasi (Organizations)
```

### 🔄 **Service Functions**
```typescript
// Dashboard service functions:
- getDashboardOverviewData()
- getOperationalAnalyticsData()
- getNutritionAnalyticsData()
- getSupplyChainAnalyticsData()
- getGeographicAnalyticsData()
```

## 📱 Responsive Design

### 🖥️ **Desktop Layout**
- Full KPI cards grid (4 columns)
- Side-by-side charts
- Comprehensive tables
- Multi-column insights

### 📱 **Mobile Layout**
- Stacked KPI cards (1-2 columns)
- Vertical chart arrangement
- Scrollable tables
- Collapsible sections

## 🎨 UI/UX Features

### 🎯 **Visual Elements**
- **Status Badges**: Color-coded status indicators
- **Progress Bars**: Visual progress tracking
- **Charts**: Interactive data visualization
- **Cards**: Clean information containers
- **Tables**: Sortable and searchable

### 🔍 **Interactive Features**
- **Tabs Navigation**: Easy switching between analytics
- **Drill-down**: Click to see detailed data
- **Filtering**: Filter by date, status, region
- **Export**: Download reports and charts
- **Real-time Updates**: Live data refresh

## 🚀 Deployment & Usage

### 📋 **Prerequisites**
```bash
# Install dependencies
pnpm install recharts
pnpm install @radix-ui/react-progress
pnpm install lucide-react
```

### 🔧 **Setup Steps**
1. Ensure Prisma schema is migrated
2. Seed database with sample SPPG data
3. Configure environment variables
4. Start development server
5. Navigate to `/dashboard/analytics`

### 📊 **Usage Examples**
```typescript
// Access dashboard
http://localhost:3000/dashboard/analytics

// Navigate tabs
- Overview: General KPIs dan trends
- Operasional: Processing dan quality metrics
- Gizi & Menu: Nutrition analysis
- Supply Chain: Inventory dan supplier metrics
- Geografis: Regional distribution analysis
```

## 🎯 Key Benefits

### 📈 **For Management**
- **Strategic Decisions**: Data-driven insights
- **Performance Monitoring**: Real-time KPIs
- **Resource Planning**: Capacity dan demand analysis
- **Risk Management**: Early warning alerts

### 👥 **For Operations**
- **Daily Monitoring**: Operational metrics
- **Quality Control**: Mutu dan compliance tracking
- **Efficiency**: Process optimization insights
- **Troubleshooting**: Issue identification

### 📊 **For Analysis**
- **Trend Analysis**: Historical data patterns
- **Comparative Analysis**: Performance benchmarking
- **Predictive Insights**: Future planning
- **Reporting**: Automated report generation

## 🔄 Future Enhancements

### 🚀 **Planned Features**
1. **Real-time Notifications**: Push alerts untuk critical events
2. **Advanced Filtering**: Complex query builder
3. **Export Capabilities**: PDF/Excel report generation
4. **Mobile App**: Dedicated mobile dashboard
5. **AI Predictions**: Machine learning insights
6. **Integration APIs**: Third-party system connections

### 📱 **Mobile-First Improvements**
1. **Progressive Web App**: Offline capability
2. **Touch Gestures**: Swipe navigation
3. **Voice Commands**: Voice-activated queries
4. **Camera Integration**: QR code scanning

### 🎯 **Advanced Analytics**
1. **Predictive Analytics**: Forecasting demand
2. **Anomaly Detection**: Automatic issue detection
3. **Recommendation Engine**: AI-powered suggestions
4. **Custom Dashboards**: User-configurable views

---

## 📚 How to Use This Dashboard

### 🎯 **Getting Started**
1. **Access**: Navigate to `/dashboard/analytics`
2. **Overview**: Start with Overview tab for general insights
3. **Deep Dive**: Use specific tabs for detailed analysis
4. **Actions**: Use quick actions for common tasks

### 📊 **Reading the Data**
- 🟢 **Green indicators**: Good performance
- 🟡 **Yellow indicators**: Needs attention
- 🔴 **Red indicators**: Critical issues
- 📈 **Trends**: Look for patterns over time
- 🎯 **Targets**: Compare against benchmarks

### 🔧 **Troubleshooting**
- **Loading Issues**: Check database connection
- **Data Missing**: Verify seeded data
- **Charts Not Showing**: Ensure Recharts is installed ✅

**Dashboard SPPG Analytics siap digunakan untuk monitoring dan analisis komprehensif sistem penyediaan pangan dan gizi nasional!** 🚀