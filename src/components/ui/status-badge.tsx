import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  // SPPG Status
  DRAFT: { label: "Draft", variant: "outline" },
  UNDER_REVIEW: { label: "Review", variant: "secondary" },
  APPROVED: { label: "Approved", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  SUSPENDED: { label: "Suspended", variant: "destructive" },
  
  // Kegiatan Status
  PERSIAPAN: { label: "Persiapan", variant: "outline" },
  BERLANGSUNG: { label: "Berlangsung", variant: "secondary" },
  SELESAI: { label: "Selesai", variant: "default" },
  DIHENTIKAN: { label: "Dihentikan", variant: "destructive" },
  GAGAL: { label: "Gagal", variant: "destructive" },
  
  // Checklist Status
  SUBMITTED: { label: "Submitted", variant: "secondary" },
  REVIEWED: { label: "Reviewed", variant: "default" },
  
  // Quality Status
  SANGAT_BAIK: { label: "Sangat Baik", variant: "default" },
  BAIK: { label: "Baik", variant: "default" },
  CUKUP: { label: "Cukup", variant: "secondary" },
  PERLU_PERBAIKAN: { label: "Perlu Perbaikan", variant: "destructive" },
  DITOLAK: { label: "Ditolak", variant: "destructive" },
  
  // Organisasi Status
  AKTIF: { label: "Aktif", variant: "default" },
  NON_AKTIF: { label: "Non Aktif", variant: "outline" },
  DIBUBARKAN: { label: "Dibubarkan", variant: "destructive" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "outline" as const };
  
  return (
    <Badge variant={config.variant} className={cn("text-xs", className)}>
      {config.label}
    </Badge>
  );
}