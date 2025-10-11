import { ListLaporanBahanBaku } from "@/components/sppg/bahan-baku/ListLaporanBahanBaku";

export default function BahanBakuPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Riwayat Laporan Bahan Baku</h1>
        <a href="/sppg/bahan-baku/tambah" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition">
          <span>Tambah Laporan</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-lg border p-4">
        <ListLaporanBahanBaku />
      </div>
    </div>
  );
}
