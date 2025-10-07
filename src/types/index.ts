// Core SPPG Types
export interface SppgWithRelations {
  id: string;
  nama: string;
  alamat: string;
  kontak: string | null;
  kapasitasProduksi: number;
  statusVerifikasi: StatusVerifikasi;
  longitude: number | null;
  latitude: number | null;
  organisasiId: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  organisasi?: OrganisasiInfo;
  dokumenSppg?: DokumenSppgInfo[];
  checklistHarian?: ChecklistHarianInfo[];
  laporanBahanBaku?: LaporanBahanBakuInfo[];
  menuHarian?: MenuHarianInfo[];
}

export interface SppgSummary {
  id: string;
  nama: string;
  alamat: string;
  kapasitasProduksi: number;
  statusVerifikasi: StatusVerifikasi;
  organisasi: string;
  lastActivity: Date | null;
  complianceScore: number;
}

export interface SppgStats {
  total: number;
  aktif: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  complianceAverage: number;
}

// Document Types
export interface DokumenSppgInfo {
  id: string;
  jenisDokumen: JenisDokumen;
  namaDokumen: string;
  nomorDokumen: string | null;
  tanggalTerbit: Date;
  tanggalExpiry: Date | null;
  filePath: string;
  statusDokumen: StatusDokumen;
  catatanReview: string | null;
  sppgId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface DocumentValidationResult {
  isValid: boolean;
  expiringDocuments: DokumenSppgInfo[];
  expiredDocuments: DokumenSppgInfo[];
  missingDocuments: JenisDokumen[];
}

// Checklist Types
export interface ChecklistHarianInfo {
  id: string;
  tanggal: Date;
  kebersihanSdm: boolean;
  kebersihanInfrastruktur: boolean;
  kondisiPeralatan: boolean;
  suhuPenyimpanan: number | null;
  catatan: string | null;
  fotoEvidence: string[];
  skorKepatuhan: number | null;
  status: StatusChecklist;
  sppgId: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
}

export interface ComplianceReport {
  period: DateRange;
  sppgId: string;
  sppgName: string;
  totalDays: number;
  reportedDays: number;
  reportingRate: number;
  averageScore: number;
  trends: ComplianceTrend[];
  issues: ComplianceIssue[];
}

export interface ComplianceTrend {
  date: Date;
  score: number;
  status: "good" | "warning" | "critical";
}

export interface ComplianceIssue {
  date: Date;
  type: "missing_report" | "low_score" | "critical_violation";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

// Supplier & Ingredient Types
export interface PemasokInfo {
  id: string;
  nama: string;
  alamat: string;
  kontak: string | null;
  jenisPemasok: JenisPemasok;
  statusAktif: StatusAktif;
  sertifikat: string[];
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
}

export interface LaporanBahanBakuInfo {
  id: string;
  tanggal: Date;
  namaBahan: string;
  jenisBahan: JenisBahan;
  jumlah: number;
  satuan: string;
  tanggalExpiry: Date | null;
  kondisiBahan: KondisiBahan;
  suhuPenerimaan: number | null;
  fotoEvidence: string[];
  catatan: string | null;
  sppgId: string;
  pemasokId: string;
  pemasok?: PemasokInfo;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
}

export interface IngredientQualityReport {
  period: DateRange;
  totalDeliveries: number;
  qualityDistribution: Record<KondisiBahan, number>;
  expiringItems: LaporanBahanBakuInfo[];
  supplierPerformance: SupplierPerformance[];
}

export interface SupplierPerformance {
  pemasokId: string;
  nama: string;
  totalDeliveries: number;
  qualityScore: number;
  onTimeRate: number;
  issueCount: number;
}

// Menu & Nutrition Types
export interface MenuHarianInfo {
  id: string;
  tanggal: Date;
  namaMenu: string;
  deskripsi: string | null;
  porsiTarget: number;
  kaloriPerPorsi: number | null;
  proteinPerPorsi: number | null;
  karbohidratPerPorsi: number | null;
  lemakPerPorsi: number | null;
  statusAkg: StatusAkg;
  catatanGizi: string | null;
  biayaPerPorsi: number | null;
  fotoMenu: string[];
  sppgId: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  komponen?: KomponenMenuInfo[];
}

export interface KomponenMenuInfo {
  id: string;
  namaBahan: string;
  jumlah: number;
  satuan: string;
  kaloriPer100g: number | null;
  proteinPer100g: number | null;
  karbohidratPer100g: number | null;
  lemakPer100g: number | null;
  menuHarianId: string;
  createdAt: Date;
}

export interface NutritionAnalysis {
  menu: MenuHarianInfo;
  akgCompliance: AkgComplianceResult;
  recommendations: NutritionRecommendation[];
  costAnalysis: CostAnalysis;
}

export interface AkgComplianceResult {
  status: StatusAkg;
  kelompokUsia: string;
  requirements: NutritionRequirements;
  actual: NutritionValues;
  compliance: CompliancePercentage;
}

export interface NutritionRequirements {
  kalori: { min: number; max?: number };
  protein: { min: number };
  karbohidrat: { min: number };
  lemak: { min: number };
}

export interface NutritionValues {
  kalori: number;
  protein: number;
  karbohidrat: number;
  lemak: number;
}

export interface CompliancePercentage {
  kalori: number;
  protein: number;
  karbohidrat: number;
  lemak: number;
  overall: number;
}

export interface NutritionRecommendation {
  type: "increase" | "decrease" | "replace" | "add";
  nutrient: "kalori" | "protein" | "karbohidrat" | "lemak";
  message: string;
  suggestion: string;
  priority: "low" | "medium" | "high";
}

export interface CostAnalysis {
  totalCost: number;
  costPerPortion: number;
  costBreakdown: CostBreakdownItem[];
  budgetCompliance: boolean;
  recommendations: string[];
}

export interface CostBreakdownItem {
  component: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  percentage: number;
}

// Organization Types
export interface OrganisasiInfo {
  id: string;
  nama: string;
  singkatan: string | null;
  status: StatusAktif;
  tingkat: number | null;
  indukOrganisasiId: string | null;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  indukOrganisasi?: OrganisasiInfo;
  subOrganisasi?: OrganisasiInfo[];
}

export interface OrganizationHierarchy {
  id: string;
  nama: string;
  tingkat: number;
  children: OrganizationHierarchy[];
  sppgCount: number;
  activeUserCount: number;
}

// Analytics & Dashboard Types
export interface DashboardMetrics {
  sppgStats: SppgStats;
  complianceStats: ComplianceStats;
  nutritionStats: NutritionStats;
  recentActivities: ActivitySummary[];
  alerts: AlertItem[];
}

export interface ComplianceStats {
  todayReportingRate: number;
  weeklyAverage: number;
  monthlyTrend: TrendData[];
  criticalIssues: number;
  pendingReviews: number;
}

export interface NutritionStats {
  akgComplianceRate: number;
  menuVariety: number;
  averageCostPerPortion: number;
  nutritionTrends: NutritionTrendData[];
}

export interface TrendData {
  date: Date;
  value: number;
  change?: number;
}

export interface NutritionTrendData {
  date: Date;
  kalori: number;
  protein: number;
  karbohidrat: number;
  lemak: number;
  akgCompliance: number;
}

export interface ActivitySummary {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface AlertItem {
  id: string;
  type: "compliance" | "document" | "nutrition" | "system";
  severity: "info" | "warning" | "error" | "critical";
  title: string;
  message: string;
  entityType: string;
  entityId: string;
  actionRequired: boolean;
  createdAt: Date;
  resolvedAt: Date | null;
}

// Utility Types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterParams {
  organisasiId?: string;
  statusVerifikasi?: StatusVerifikasi;
  statusAktif?: StatusAktif;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

// Enum types (matching Prisma schema)
export type StatusVerifikasi = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type StatusAktif = "AKTIF" | "NON_AKTIF" | "DIBUBARKAN";
export type StatusUser = "AKTIF" | "NON_AKTIF" | "DIBLOKIR";
export type JenisDokumen = "SLHS" | "SERTIFIKAT_HALAL" | "FOOD_HANDLER_CERTIFICATE" | "DENAH_DAPUR" | "SIUP" | "IZIN_OPERASIONAL" | "LAINNYA";
export type StatusDokumen = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
export type StatusChecklist = "DRAFT" | "SUBMITTED" | "REVIEWED";
export type JenisPemasok = "SAYURAN" | "DAGING" | "IKAN" | "BERAS_BIJI" | "BUMBU_REMPAH" | "LAINNYA";
export type JenisBahan = "PROTEIN_HEWANI" | "PROTEIN_NABATI" | "KARBOHIDRAT" | "SAYURAN" | "BUAH" | "BUMBU_REMPAH" | "MINYAK_LEMAK" | "LAINNYA";
export type KondisiBahan = "SANGAT_BAIK" | "BAIK" | "CUKUP" | "BURUK";
export type StatusAkg = "MEMENUHI" | "HAMPIR_MEMENUHI" | "TIDAK_MEMENUHI" | "BELUM_DIEVALUASI";