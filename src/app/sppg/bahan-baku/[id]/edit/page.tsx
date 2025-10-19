import { getLaporanBahanBakuByIdAction } from "@/actions/laporan-bahan-baku";
import { ContainerFormLaporanBahanBaku } from "@/components/sppg/bahan-baku/ContainerFormLaporanBahanBaku";

export async function EditBahanBakuPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getLaporanBahanBakuByIdAction(id);
    console.log("EditBahanBakuPage params:", params);
    console.log("EditBahanBakuPage result:", result);

    if (result.success === false || !result.data) {
        return <div>Data tidak ditemukan</div>;
    }


    return (
        <ContainerFormLaporanBahanBaku initialValues={result.data} />
    );
}

export default EditBahanBakuPage;