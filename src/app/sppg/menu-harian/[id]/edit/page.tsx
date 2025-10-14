import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormMenuHarian from "@/components/sppg/menu-harian/FormMenuHarian";
import { getMenuHarianByIdAction, updateMenuHarianAction } from "@/actions/menu-harian";
import { UpdateMenuHarianData } from "@/types/menu-harian";

export default function EditMenuHarianPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [defaultValues, setDefaultValues] = useState<UpdateMenuHarianData | null>(null);

  useEffect(() => {
    if (id) {
      getMenuHarianByIdAction(id).then((res) => {
        if (res.success) setDefaultValues(res.data);
      });
    }
  }, [id]);

  const handleUpdate = async (data: UpdateMenuHarianData) => {
    const res = await updateMenuHarianAction(id, data);
    if (res.success) {
      router.push("/sppg/menu-harian");
    }
  };

  if (!defaultValues) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4">Edit Menu Harian</h2>
      {/* You can pass defaultValues and onSubmit to FormMenuHarian for edit mode */}
      <FormMenuHarian defaultValues={defaultValues} onSubmit={handleUpdate} />
    </div>
  );
}
