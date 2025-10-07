# Database Schema & Validation Documentation
**JAGA GIZI - MVP Database Design**

## Overview

Database schema dan validation layer untuk sistem JAGA GIZI yang berfokus pada pencatatan digital operasional SPPG (Satuan Pelayanan Pemenuhan Gizi). Schema ini dirancang untuk mendukung MVP dengan fitur-fitur core seperti registrasi SPPG, dokumentasi kepatuhan, checklist harian, tracking bahan baku, dan perencanaan menu.

## Database Architecture

### Core Entities Relationship

```
Organisasi (1) -----> (*) User
    |
    └── (1) -----> (*) Sppg
                     |
                     ├── (1) -----> (*) DokumenSppg
                     ├── (1) -----> (*) ChecklistHarian
                     ├── (1) -----> (*) LaporanBahanBaku -----> (*) Pemasok
                     └── (1) -----> (*) MenuHarian -----> (*) KomponenMenu

StandarAkg (reference data)
LogAktivitas (audit trail)
```

## Entity Details

### 1. SPPG (Satuan Pelayanan Pemenuhan Gizi)
**Table: `sppg`**

Entitas utama yang merepresentasikan unit penyedia layanan gizi.

**Key Fields:**
- `nama`: Nama SPPG
- `alamat`: Alamat lengkap
- `kapasitas_produksi`: Kapasitas produksi per hari
- `status_verifikasi`: Status verifikasi oleh BGN
- `longitude`, `latitude`: Koordinat GPS untuk mapping

**Status Verifikasi Flow:**
```
DRAFT → UNDER_REVIEW → APPROVED/REJECTED/SUSPENDED
```

### 2. DokumenSppg (Dokumen Kepatuhan)
**Table: `dokumen_sppg`**

Menyimpan semua dokumen kepatuhan yang diperlukan SPPG.

**Jenis Dokumen:**
- `SLHS`: Sertifikat Laik Higiene Sanitasi Jasa Boga
- `SERTIFIKAT_HALAL`: Sertifikat Halal MUI
- `FOOD_HANDLER_CERTIFICATE`: Sertifikat penjamah makanan
- `DENAH_DAPUR`: Denah layout dapur
- `SIUP`: Surat Izin Usaha Perdagangan
- `IZIN_OPERASIONAL`: Izin operasional lainnya

**Auto-expiry Tracking:**
- System akan otomatis mendeteksi dokumen yang akan expired
- Reminder notifications untuk renewal

### 3. ChecklistHarian (Checklist Operasional Harian)
**Table: `checklist_harian`**

Pencatatan checklist kepatuhan operasional harian dengan foto evidence.

**Checklist Categories:**
- `kebersihan_sdm`: Personal hygiene compliance
- `kebersihan_infrastruktur`: Infrastructure cleanliness
- `kondisi_peralatan`: Equipment condition

**Compliance Scoring:**
- Otomatis calculate score berdasarkan checklist completion
- Photo evidence mandatory untuk verification
- Unique constraint per SPPG per tanggal

### 4. Pemasok (Supplier Management)
**Table: `pemasok`**

Master data pemasok bahan baku dengan categorization.

**Supplier Categories:**
- `SAYURAN`, `DAGING`, `IKAN`, `BERAS_BIJI`, `BUMBU_REMPAH`

### 5. LaporanBahanBaku (Ingredient Receipt Tracking)
**Table: `laporan_bahan_baku`**

Tracking semua penerimaan bahan baku dengan quality assessment.

**Quality Assessment:**
- `SANGAT_BAIK`, `BAIK`, `CUKUP`, `BURUK`
- Temperature logging untuk chilled/frozen items
- Photo documentation untuk quality verification
- Expiry date tracking

### 6. MenuHarian & KomponenMenu (Menu Planning & Nutrition)
**Tables: `menu_harian`, `komponen_menu`**

Perencanaan menu harian dengan analisis gizi otomatis.

**Nutrition Calculation:**
- Auto-calculate dari komponen menu
- AKG compliance checking
- Cost analysis per porsi

**AKG Status:**
- `MEMENUHI`: Meets all AKG requirements
- `HAMPIR_MEMENUHI`: Close to requirements
- `TIDAK_MEMENUHI`: Below requirements
- `BELUM_DIEVALUASI`: Pending evaluation

### 7. StandarAkg (AKG Standards Reference)
**Table: `standar_akg`**

Master data standar Angka Kecukupan Gizi per kelompok usia.

### 8. LogAktivitas (Audit Trail)
**Table: `log_aktivitas`**

Comprehensive audit trail untuk semua user activities dengan JSON data logging.

## Zod Validation Schemas

### Schema Organization

```typescript
src/zod/schema/
├── index.ts              // Central exports
├── sppg.ts              // SPPG validation
├── dokumen-sppg.ts      // Document validation
├── checklist-harian.ts  // Daily checklist validation
├── pemasok.ts           // Supplier validation
├── laporan-bahan-baku.ts // Ingredient logging validation
├── menu-harian.ts       // Menu planning validation
├── komponen-menu.ts     // Menu components validation
├── standar-akg.ts       // AKG standards validation
└── common.ts            // Common utilities & analytics
```

### Schema Patterns

Following panduan agent, semua schemas menggunakan pattern konsisten:

```typescript
// Base schema
export const entityNameSchema = z.object({...});

// Create schema (omit id & timestamps)
export const createEntityNameSchema = entityNameSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (id required, fields partial)
export const updateEntityNameSchema = entityNameSchema.partial().extend({
  id: z.string().cuid(),
});

// Type exports
export type EntityNameData = z.infer<typeof entityNameSchema>;
export type CreateEntityNameData = z.infer<typeof createEntityNameSchema>;
export type UpdateEntityNameData = z.infer<typeof updateEntityNameSchema>;
```

### Key Validation Features

1. **Required Field Validation**
   - Comprehensive field validation dengan error messages dalam Bahasa Indonesia
   - Custom validation untuk business rules

2. **File Upload Validation**
   - Array of strings untuk multiple photo uploads
   - Minimum photo requirements untuk evidence

3. **Business Logic Validation**
   - Date range validation (expiry dates, etc.)
   - Numeric constraints (minimum values, ranges)
   - Enum validation untuk status fields

4. **Nested Object Support**
   - Menu dengan components validation
   - Bulk operations support

## Type System Integration

### Type Definitions (`src/types/index.ts`)

Comprehensive TypeScript types yang match dengan database schema:

1. **Core Entity Types**
   - Basic entity interfaces
   - Extended types dengan relations
   - Summary/info types untuk UI display

2. **Business Logic Types**
   - Compliance reports
   - Analytics data structures
   - Dashboard metrics

3. **Utility Types**
   - Pagination helpers
   - Filter parameters
   - Response wrappers

### Type Safety Benefits

- **Compile-time Validation**: Catch type errors sebelum runtime
- **IntelliSense Support**: Auto-completion untuk better DX
- **API Consistency**: Consistent typing across frontend/backend
- **Refactoring Safety**: Type-safe refactoring capabilities

## Security & Data Integrity

### Access Control Integration
- Schema fully integrated dengan existing RBAC system
- User context validation dalam all create/update operations
- Audit trail untuk compliance requirements

### Data Validation Layers
1. **Database Level**: Constraints, foreign keys, unique indexes
2. **Application Level**: Zod schema validation
3. **Business Logic Level**: Custom validation rules
4. **UI Level**: Real-time form validation

### File Management
- Secure file upload dengan validation
- Organized folder structure untuk different document types
- File metadata tracking dalam database

## Performance Considerations

### Database Optimizations
- Strategic indexing untuk query performance
- Composite indexes untuk complex queries
- Proper foreign key relationships

### Query Optimization
- Pagination support untuk large datasets
- Filtering capabilities untuk dashboard queries
- Efficient relation loading strategies

## Migration & Deployment

### Database Migrations
Schema dirancang untuk incremental deployment dengan Prisma migrations:

```bash
npx prisma migrate dev --name "add-jaga-gizi-schema"
npx prisma generate
```

### Data Seeding
Comprehensive seeding untuk:
- Master data (StandarAkg, Organisasi)
- Sample SPPG data untuk testing
- Reference data untuk dropdown options

## Usage Examples

### Creating SPPG with Validation

```typescript
import { createSppgSchema, type CreateSppgData } from '@/zod/schema';

// Frontend form validation
const formData: CreateSppgData = {
  nama: "SPPG Sekolah Dasar 01",
  alamat: "Jl. Pendidikan No. 123, Jakarta",
  kontak: "021-12345678",
  kapasitasProduksi: 500,
  organisasiId: "org-123",
  createdBy: userId
};

// Validation
const validatedData = createSppgSchema.parse(formData);
```

### Daily Checklist Submission

```typescript
import { createChecklistHarianSchema } from '@/zod/schema';

const checklistData = {
  tanggal: new Date(),
  kebersihanSdm: true,
  kebersihanInfrastruktur: true,
  kondisiPeralatan: true,
  suhuPenyimpanan: 4.5,
  fotoEvidence: ["photo1.jpg", "photo2.jpg"],
  sppgId: "sppg-123",
  createdBy: userId
};

const validated = createChecklistHarianSchema.parse(checklistData);
```

### Menu Planning with Nutrition

```typescript
import { createMenuWithComponentsSchema } from '@/zod/schema';

const menuData = {
  tanggal: new Date(),
  namaMenu: "Nasi Gudeg Ayam",
  porsiTarget: 100,
  sppgId: "sppg-123",
  fotoMenu: ["menu-photo.jpg"],
  komponen: [
    {
      namaBahan: "Beras",
      jumlah: 5,
      satuan: "kg",
      kaloriPer100g: 365,
      karbohidratPer100g: 79
    },
    {
      namaBahan: "Ayam",
      jumlah: 2,
      satuan: "kg", 
      kaloriPer100g: 165,
      proteinPer100g: 31
    }
  ]
};

const validated = createMenuWithComponentsSchema.parse(menuData);
```

## Best Practices

### Schema Design
1. **Consistent Naming**: Menggunakan bahasa Indonesia untuk business entities
2. **Proper Relationships**: Clear foreign key relationships
3. **Audit Trail**: Comprehensive logging untuk compliance
4. **Soft Deletes**: Menggunakan status fields instead of hard deletes

### Validation Strategy
1. **Layered Validation**: Multiple validation layers untuk security
2. **User-Friendly Messages**: Error messages dalam Bahasa Indonesia
3. **Progressive Enhancement**: Basic functionality works, enhanced with JS
4. **Type Safety**: Full TypeScript integration

### Performance Guidelines
1. **Efficient Queries**: Use proper indexing dan query optimization
2. **Pagination**: Always paginate large datasets
3. **Caching**: Strategic caching untuk reference data
4. **File Management**: Optimize file storage dan retrieval

---

Schema ini dirancang sebagai foundation yang solid untuk MVP JAGA GIZI dengan fokus pada pencatatan digital yang akurat, compliance monitoring, dan user experience yang baik untuk operators SPPG dan administrators BGN.