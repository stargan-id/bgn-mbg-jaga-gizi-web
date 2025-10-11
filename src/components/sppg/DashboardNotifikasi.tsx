import { Card, CardContent } from "@/components/ui/card";

interface DashboardNotifikasiProps {
  notifikasi: string[];
}

export function DashboardNotifikasi({ notifikasi }: DashboardNotifikasiProps) {
  return (
    <Card className="mt-6">
      <CardContent className="py-4">
        <div className="font-semibold text-primary mb-2">Notifikasi Terbaru</div>
        <ul className="list-disc pl-5 text-sm">
          {notifikasi.length === 0 ? (
            <li className="text-muted-foreground">Belum ada notifikasi terbaru</li>
          ) : (
            notifikasi.map((n, i) => <li key={i}>{n}</li>)
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
