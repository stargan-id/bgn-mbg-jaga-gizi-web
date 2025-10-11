import FormLaporanBahanBaku from "@/components/sppg/bahan-baku/FormLaporanBahanBaku";

export default function TambahLaporanBahanBakuPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Laporan Bahan Baku</h1>
      <FormLaporanBahanBaku mode="create" />
    </div>
  );
}
