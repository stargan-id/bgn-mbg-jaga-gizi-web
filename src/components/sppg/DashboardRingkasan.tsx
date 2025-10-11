import { Card, CardContent } from "@/components/ui/card";

interface DashboardRingkasanProps {
  checklist: number;
  checklistTotal: number;
  bahanBaku: number;
  menu: number;
  laporan: boolean;
}

export function DashboardRingkasan({ checklist, checklistTotal, bahanBaku, menu, laporan }: DashboardRingkasanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="py-4">
          <div className="font-semibold text-primary mb-2">Checklist Harian</div>
          <div className="text-3xl font-bold">{checklist}/{checklistTotal}</div>
          <div className="text-xs text-muted-foreground">{checklist} dari {checklistTotal} item sudah lengkap</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <div className="font-semibold text-primary mb-2">Bahan Baku</div>
          <div className="text-3xl font-bold">{bahanBaku}</div>
          <div className="text-xs text-muted-foreground">{bahanBaku} bahan baku diterima hari ini</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <div className="font-semibold text-primary mb-2">Menu Harian</div>
          <div className="text-3xl font-bold">{menu}</div>
          <div className="text-xs text-muted-foreground">Menu sudah diinput</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <div className="font-semibold text-primary mb-2">Laporan Akhir Hari</div>
          <div className="text-3xl font-bold">{laporan ? "Sudah" : "Belum"}</div>
          <div className="text-xs text-muted-foreground">Laporan akhir hari {laporan ? "sudah dibuat" : "belum dibuat"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
