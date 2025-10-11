import FormKegiatanPengolahan from "@/components/sppg/kegiatan-pengolahan/FormKegiatanPengolahan";

export default function TambahKegiatanPengolahanPage() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Tambah Kegiatan Pengolahan</h1>
      <FormKegiatanPengolahan mode="create" />
    </div>
  );
}
