# Zod Schema Documentation - Pengolahan Makanan

Dokumentasi ini menjelaskan schema Zod yang telah dibuat untuk model-model pengolahan makanan baru.

## 📁 File Schema yang Dibuat

### 1. `kegiatan-pengolahan.ts`
Schema untuk model `KegiatanPengolahan` - aktivitas inti pengolahan makanan.

**Schemas:**
- `kegiatanPengolahanSchema` - Schema lengkap
- `createKegiatanPengolahanSchema` - Untuk membuat kegiatan baru
- `updateKegiatanPengolahanSchema` - Untuk update kegiatan
- `completeKegiatanPengolahanSchema` - Untuk menyelesaikan kegiatan
- `updateStatusKegiatanSchema` - Untuk update status saja
- `filterKegiatanPengolahanSchema` - Untuk filtering/search

**Validasi Utama:**
- `targetPorsi`: Minimal 1
- `suhuPengolahan`: Range -50°C sampai 200°C
- `metodePengolahan` & `penanggungJawab`: Wajib diisi
- `jenisPengolahan`: Enum (SARAPAN, MAKAN_SIANG, dll)
- `statusKegiatan`: Enum (PERSIAPAN, BERLANGSUNG, dll)

### 2. `penggunaan-bahan-baku.ts`
Schema untuk model `PenggunaanBahanBaku` - traceability penggunaan bahan.

**Schemas:**
- `penggunaanBahanBakuSchema` - Schema lengkap
- `createPenggunaanBahanBakuSchema` - Untuk mencatat penggunaan
- `updatePenggunaanBahanBakuSchema` - Untuk update penggunaan
- `bulkCreatePenggunaanBahanBakuSchema` - Untuk bulk input
- `validateStockSchema` - Untuk validasi stok
- `traceabilityQuerySchema` - Untuk penelusuran
- `usageStatisticsSchema` - Untuk statistik penggunaan

**Validasi Utama:**
- `jumlahDigunakan`: Minimal 0.01
- `namaBahan` & `satuan`: Wajib diisi
- `jenisBahan`: Enum (PROTEIN_HEWANI, PROTEIN_NABATI, dll)
- `kondisiBahan`: Enum (SANGAT_BAIK, BAIK, dll)
- Minimal 1 bahan baku untuk bulk create

### 3. `kontrol-mutu-pengolahan.ts`
Schema untuk model `KontrolMutuPengolahan` - quality control real-time.

**Schemas:**
- `kontrolMutuPengolahanSchema` - Schema lengkap
- `createKontrolMutuPengolahanSchema` - Untuk kontrol baru
- `updateKontrolMutuPengolahanSchema` - Untuk update kontrol
- `quickQualityCheckSchema` - Untuk pemeriksaan cepat
- `detailedQualityAssessmentSchema` - Untuk penilaian detail
- `correctiveActionSchema` - Untuk tindakan koreksi
- `qualityControlReportSchema` - Untuk laporan
- `qualityTrendAnalysisSchema` - Untuk analisis trend

**Validasi Utama:**
- `suhu`: Range -50°C sampai 200°C
- `tahapPengolahan`: Enum (PERSIAPAN_BAHAN, PENCUCIAN, dll)
- `statusMutu`: Enum (SANGAT_BAIK, BAIK, dll)
- `kebersihanAlat` & `higienePetugas`: Boolean required
- `petugasKontrol`: Wajib diisi
- Minimal 1 foto evidence untuk detailed assessment

### 4. `pengolahan-workflow.ts`
Schema untuk operasi kompleks melibatkan multiple model.

**Schemas:**
- `startKegiatanPengolahanSchema` - Mulai kegiatan + bahan baku
- `completeKegiatanWithQualityControlSchema` - Selesai + kontrol mutu
- `updateKegiatanWithBahanBakuSchema` - Update dengan bahan baku
- `laporanKegiatanHarianSchema` - Laporan harian
- `dashboardPengolahanSchema` - Dashboard pengolahan
- `analisisEfisiensiSchema` - Analisis efisiensi
- `notifikasiPengolahanSchema` - Sistem notifikasi
- `haccpComplianceSchema` - HACCP compliance

## 🎯 Use Cases dan Contoh Penggunaan

### 1. Memulai Kegiatan Pengolahan Lengkap
```typescript
import { startKegiatanPengolahanSchema } from '@/zod/schema';

const data = {
  kegiatanPengolahan: {
    tanggalPengolahan: new Date(),
    jamMulai: new Date(),
    jenisPengolahan: "MAKAN_SIANG",
    targetPorsi: 100,
    metodePengolahan: "Direbus dan Ditumis",
    penanggungJawab: "Chef Ahmad",
    sppgId: "cuid123",
    // ... other fields
  },
  bahanBaku: [
    {
      namaBahan: "Beras",
      jenisBahan: "KARBOHIDRAT",
      jumlahDigunakan: 5.0,
      satuan: "kg",
      kondisiBahan: "SANGAT_BAIK",
      // ... other fields
    }
  ],
  kontrolMutuAwal: {
    tahapPengolahan: "PERSIAPAN_BAHAN",
    kebersihanAlat: true,
    higienePetugas: true,
    statusMutu: "BAIK",
    petugasKontrol: "QC Officer",
    // ... other fields
  }
};

const result = startKegiatanPengolahanSchema.parse(data);
```

### 2. Quick Quality Check
```typescript
import { quickQualityCheckSchema } from '@/zod/schema';

const quickCheck = {
  kegiatanPengolahanId: "cuid123",
  tahapPengolahan: "PEMASAKAN",
  kebersihanAlat: true,
  higienePetugas: true,
  statusMutu: "BAIK",
  petugasKontrol: "QC Officer",
  catatan: "Suhu pemasakan normal"
};

const result = quickQualityCheckSchema.parse(quickCheck);
```

### 3. Traceability Query
```typescript
import { traceabilityQuerySchema } from '@/zod/schema';

const traceQuery = {
  namaBahan: "Ayam",
  batchNumber: "BATCH001",
  tanggalMulai: new Date('2024-01-01'),
  tanggalSelesai: new Date('2024-01-31')
};

const result = traceabilityQuerySchema.parse(traceQuery);
```

## ✅ Fitur Validasi Utama

### 1. **Type Safety**
- Semua enum menggunakan nilai yang sesuai dengan Prisma schema
- Validasi tipe data yang ketat (string, number, date, boolean)
- Optional fields ditandai dengan jelas

### 2. **Business Rules**
- Target porsi minimal 1
- Jumlah bahan baku minimal 0.01
- Suhu dalam range yang masuk akal (-50°C to 200°C)
- Wajib ada penanggung jawab dan petugas kontrol

### 3. **Data Integrity**
- CUID validation untuk ID
- Date validation untuk timestamp
- Array validation dengan minimum items
- Conditional required fields

### 4. **User Experience**
- Error messages dalam Bahasa Indonesia
- Clear field descriptions
- Logical grouping of related fields

## 🔄 Integration dengan Existing Code

Schema ini siap digunakan dengan:
- **Next.js API Routes** untuk validation
- **React Hook Form** untuk client-side validation
- **Prisma Client** untuk database operations
- **tRPC** untuk end-to-end type safety

## 📊 Advanced Features

### 1. **Bulk Operations**
- `bulkCreatePenggunaanBahanBakuSchema` untuk input multiple bahan baku
- `updateKegiatanWithBahanBakuSchema` untuk batch updates

### 2. **Reporting & Analytics**
- `qualityControlReportSchema` untuk laporan mutu
- `analisisEfisiensiSchema` untuk analisis performa
- `usageStatisticsSchema` untuk statistik penggunaan

### 3. **Compliance & Standards**
- `haccpComplianceSchema` untuk standar HACCP
- `detailedQualityAssessmentSchema` untuk audit detail
- `correctiveActionSchema` untuk dokumentasi perbaikan

Schema ini memberikan foundation yang kuat untuk sistem pengolahan makanan dengan fokus pada quality control, traceability, dan compliance management.