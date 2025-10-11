import { DashboardRingkasan } from "@/components/sppg/DashboardRingkasan";
import { DashboardNotifikasi } from "@/components/sppg/DashboardNotifikasi";

export default function SppgDashboardPage() {
  // Data mockup sementara
  const checklist = 3;
  const checklistTotal = 5;
  const bahanBaku = 2;
  const menu = 1;
  const laporan = false;
  const notifikasi = [
    "Checklist harian belum lengkap",
    "Bahan baku 'Ayam' diterima jam 07:30",
    "Menu 'Nasi Ayam Sayur' sudah diinput"
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="rounded-xl bg-gradient-to-r from-primary/10 to-white p-6 md:p-8 shadow flex flex-col md:flex-row items-center gap-6 mb-2">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Dashboard Operasional SPPG</h2>
          <p className="text-muted-foreground text-base md:text-lg">Pantau dan kelola pelaksanaan operasional harian SPPG secara digital, terintegrasi, dan real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/90 text-white font-semibold text-lg shadow">Aktif</span>
        </div>
      </section>

      {/* Ringkasan Operasional & Notifikasi dalam grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardRingkasan
            checklist={checklist}
            checklistTotal={checklistTotal}
            bahanBaku={bahanBaku}
            menu={menu}
            laporan={laporan}
          />
        </div>
        <div>
          <DashboardNotifikasi notifikasi={notifikasi} />
        </div>
      </div>
    </>
  );
}
