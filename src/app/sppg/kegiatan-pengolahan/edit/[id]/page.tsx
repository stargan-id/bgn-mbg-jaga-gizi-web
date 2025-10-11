import FormKegiatanPengolahan from "@/components/sppg/kegiatan-pengolahan/FormKegiatanPengolahan";
import { getKegiatanPengolahanByIdAction } from "@/actions/kegiatan-pengolahan";

export default async function EditKegiatanPengolahanPage({ params }: { params: { id: string } }) {
  const res = await getKegiatanPengolahanByIdAction(params.id);
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Kegiatan Pengolahan</h1>
      <FormKegiatanPengolahan mode="edit" initialData={res.data} />
    </div>
  );
}
