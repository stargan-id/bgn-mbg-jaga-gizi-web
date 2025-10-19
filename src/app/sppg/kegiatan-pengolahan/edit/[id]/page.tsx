import { getKegiatanPengolahanByIdAction } from "@/actions/kegiatan-pengolahan";
import FormKegiatanPengolahan from "@/components/sppg/kegiatan-pengolahan/FormKegiatanPengolahan";

export default async function EditKegiatanPengolahanPage({ params }: { params: { id: string } }) {
  const res = await getKegiatanPengolahanByIdAction(params.id);

  if (res.success === false || !res.data) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Kegiatan Pengolahan</h1>
      <FormKegiatanPengolahan mode="edit" initialData={res.data} menuHarianId={res.data.menuHarianId} />
    </div>
  );
}
