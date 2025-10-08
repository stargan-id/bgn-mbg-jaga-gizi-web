# Dokumentasi Halaman Peta Nasional SPPG

## Overview
Halaman Peta Nasional SPPG merupakan implementasi interaktif untuk menampilkan sebaran Satuan Pelayanan Pemenuhan Gizi (SPPG) di seluruh Indonesia menggunakan Leaflet dengan OpenStreetMap dengan UI/UX yang responsif dan modular.

## Fitur Utama

### 1. **Peta Interaktif dengan MapKit JS**
- **Teknologi**: Apple MapKit JS untuk performa dan kualitas peta yang optimal
- **Coverage**: Fokus pada wilayah Indonesia dengan koordinat center (-2.5489, 118.0149)
- **Zoom Level**: Otomatis menyesuaikan untuk menampilkan semua marker SPPG
- **Controls**: Zoom, compass, dan map type controls built-in

### 2. **Marker SPPG dengan Status Visual**
- **Color Coding**:
  - 🟢 **Hijau**: APPROVED (Terverifikasi)
  - 🟡 **Kuning**: UNDER_REVIEW (Dalam Review)  
  - 🔴 **Merah**: REJECTED (Ditolak)
  - ⚪ **Abu-abu**: SUSPENDED (Ditangguhkan)
  - 🔵 **Biru**: DRAFT (Draft)
- **Interactive**: Klik marker untuk melihat detail SPPG
- **Tooltips**: Nama dan alamat SPPG saat hover

### 3. **Info Overlay Pop-up**
- **Trigger**: Klik pada marker SPPG
- **Informasi Ditampilkan**:
  - Nama SPPG dan status verifikasi
  - Alamat lengkap dan kontak
  - Kapasitas produksi per hari
  - Organisasi pengelola
  - Koordinat geografis
  - Tanggal registrasi dan update terakhir
- **Actions**: 
  - "Lihat Detail" untuk navigasi ke halaman detail SPPG
  - "Tutup" untuk menutup overlay

### 4. **Panel Kontrol & Filter**
- **Search**: Pencarian berdasarkan nama SPPG, alamat, atau organisasi
- **Filter Status**: Filter berdasarkan status verifikasi
- **Filter Regional**: Filter berdasarkan organisasi/wilayah
- **Real-time**: Filter langsung mengupdate marker di peta

### 5. **Dashboard Statistik**
- **Total SPPG**: Jumlah keseluruhan SPPG terdaftar
- **Status Breakdown**: Distribusi berdasarkan status verifikasi
- **Regional Summary**: Overview berdasarkan organisasi
- **Visual Indicators**: Icons dan color coding yang konsisten

### 6. **Responsive Design**
- **Mobile First**: Layout yang optimal untuk mobile device
- **Desktop Enhancement**: Sidebar layout untuk desktop
- **Breakpoints**: sm, md, lg, xl responsiveness
- **Touch Friendly**: Controls yang mudah digunakan di mobile

## Struktur Komponen

### 1. **Page Level** (`/dashboard/peta/page.tsx`)
```typescript
// Server component untuk data fetching
- getSppgMapDataAction(): Fetch semua data SPPG
- getSppgStatsAction(): Fetch statistik SPPG
- ProtectedLayout wrapper dengan title dan subtitle
```

### 2. **Content Component** (`PetaContent.tsx`)
```typescript
// Client component untuk state management
- State management untuk selected SPPG
- Filter state management
- Navigation handling
- Event coordination antar komponen
```

### 3. **Map Container** (`MapContainer.tsx`)
```typescript
// MapKit JS integration
- Dynamic script loading untuk MapKit JS
- Map initialization dengan Indonesia center
- Marker creation dengan status-based styling
- Event handling untuk marker clicks
```

### 4. **Info Overlay** (`SppgInfoOverlay.tsx`)
```typescript
// Modal overlay untuk detail SPPG
- Card-based information display
- Action buttons (View Detail, Close)
- Responsive modal positioning
- Backdrop untuk UX yang baik
```

### 5. **Map Controls** (`MapControls.tsx`)
```typescript
// Filter dan kontrol panel
- Search functionality
- Status dan regional filters
- Statistics dashboard
- Legend untuk status colors
```

## Data Flow

### 1. **Server Side**
```
Page Component
├── getSppgMapDataAction() → Service Layer → Database
├── getSppgStatsAction() → Service Layer → Database
└── Pass data to Client Components
```

### 2. **Client Side**
```
PetaContent (State Management)
├── MapContainer (Map Rendering)
├── MapControls (Filtering)
├── SppgInfoOverlay (Detail Display)
└── Event Coordination
```

### 3. **Service Layer** (`/lib/services/sppg.ts`)
```typescript
- getAllSppgForMap(): Get SPPG dengan koordinat
- getSppgById(): Get detail SPPG spesifik
- getSppgByRegion(): Filter berdasarkan organisasi
- getSppgStats(): Statistik agregat
```

### 4. **Action Layer** (`/actions/sppg/index.ts`)
```typescript
- getSppgMapDataAction(): Server action wrapper
- getSppgDetailAction(): Detail SPPG action
- Error handling dengan ActionResponse pattern
```

## Mock Data

### Sample SPPG Data (`mockSppgMapData`)
- **10 SPPG Sample**: Tersebar di kota-kota besar Indonesia
- **Diverse Status**: Representasi semua status verifikasi
- **Real Coordinates**: Koordinat geografis yang akurat
- **Complete Information**: Data lengkap sesuai schema database

### Koordinat Sampel:
- Jakarta: 106.8229, -6.1744
- Surabaya: 112.7378, -7.2504  
- Bandung: 107.6098, -6.9175
- Makassar: 119.4221, -5.1477
- Medan: 98.6722, 3.5952
- Dan 5 kota lainnya

## Technology Stack

### Frontend
- **Next.js 15**: React framework dengan App Router
- **TypeScript**: Type safety dan development experience
- **Tailwind CSS**: Utility-first styling
- **Apple MapKit JS**: Premium map rendering

### Backend Integration
- **Prisma ORM**: Database access layer
- **PostgreSQL**: Primary database
- **Server Actions**: Next.js server-side data fetching

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Consistent iconography
- **Custom Components**: Modular dan reusable

## Best Practices Implemented

### 1. **Performance**
- Lazy loading untuk MapKit JS script
- Efficient re-rendering dengan useCallback
- Optimized marker updates
- Image optimization untuk map tiles

### 2. **User Experience**
- Loading states dengan skeleton UI
- Error boundaries dan fallback states
- Intuitive color coding dan iconography
- Smooth animations dan transitions

### 3. **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast color combinations
- Focus management untuk modal

### 4. **Mobile Optimization**
- Touch-friendly controls
- Responsive modal sizing
- Optimized for various screen sizes
- Efficient use of screen real estate

## Configuration & Environment

### Required Environment Variables
```env
NEXT_PUBLIC_MAPKIT_JS_TOKEN=your_mapkit_js_token_here
```

### Development Fallback
- Placeholder token untuk development
- Graceful degradation jika token tidak tersedia
- Console warnings untuk missing configuration

## Testing & Quality Assurance

### Manual Testing Checklist
- ✅ Map loads dengan koordinat Indonesia
- ✅ Markers muncul dengan color coding yang benar
- ✅ Click marker menampilkan info overlay
- ✅ Search dan filter berfungsi dengan baik
- ✅ Responsive design di berbagai device
- ✅ Navigation ke detail page

### Error Handling
- Network errors untuk map loading
- Missing coordinate data
- Invalid SPPG data
- MapKit JS initialization failures

## Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket untuk live data
2. **Clustering**: Marker clustering untuk performa
3. **Heatmap**: Density visualization
4. **Export**: PDF/Excel export untuk data
5. **Offline Support**: PWA capabilities

### Technical Improvements
1. **Caching**: Redis untuk data caching
2. **CDN**: Static asset optimization
3. **Analytics**: User interaction tracking
4. **Performance**: Bundle size optimization

## Deployment Notes

### Production Requirements
- Valid MapKit JS token dari Apple Developer Account
- SSL certificate untuk HTTPS (required by MapKit JS)
- CDN configuration untuk optimal loading
- Database indexing untuk coordinate queries

### Monitoring
- Map loading performance metrics
- User interaction analytics
- Error tracking dan alerting
- Database query performance

---

**Status**: ✅ **COMPLETED**  
**Version**: 1.0.0  
**Last Updated**: October 8, 2025  
**Next Review**: Q1 2026