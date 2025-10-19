import { getMenuHarianByIdAction } from "@/actions/menu-harian";
import { ContainerFormMenuHarian } from "@/components/sppg/menu-harian/ContainerFormMenuHarian";

export const MenuHarianEditPage = async({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const result = await getMenuHarianByIdAction(id);

  if(result.success === false || !result.data) {
    return <div>Data tidak ditemukan</div>;
  }

  const initialValues = result.data;
  console.log("Initial Values:", initialValues);

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4">Edit Menu Harian</h2>
      {/* You can pass defaultValues and onSubmit to FormMenuHarian for edit mode */}
      <ContainerFormMenuHarian initialValues={initialValues} />
    </div>
  );
}


export default MenuHarianEditPage;