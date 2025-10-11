import { ListKegiatanPengolahan } from "@/components/sppg/kegiatan-pengolahan/ListKegiatanPengolahan";

export default function KegiatanPengolahanPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kegiatan Pengolahan Makanan</h1>
      <ListKegiatanPengolahan />
    </div>
  );
}
