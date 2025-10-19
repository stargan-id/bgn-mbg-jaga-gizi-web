"use client";
import { createLaporanBahanBakuAction, updateLaporanBahanBakuAction } from "@/actions/laporan-bahan-baku";
import { CreateLaporanBahanBakuData } from "@/zod/schema/laporan-bahan-baku";
import { LaporanBahanBaku } from "@prisma/client";
import { useRouter } from "next/navigation";
import FormLaporanBahanBaku from "./FormLaporanBahanBaku";

interface ContainerFormLaporanBahanBakuProps {
  // Define any props needed for the container
  initialValues?: LaporanBahanBaku;
}
export const ContainerFormLaporanBahanBaku = ({
  initialValues,
}: ContainerFormLaporanBahanBakuProps) => {
    const router = useRouter();
  const handleSubmit = async (data: CreateLaporanBahanBakuData) => {
    if (initialValues) {
      // Update existing laporan
      const updatedData = { ...data, id: initialValues.id };
      const res = await updateLaporanBahanBakuAction(initialValues.id, updatedData);
      if (res.success) {
        router.push("/sppg/bahan-baku");
      } else {
        console.log("Update failed:", res);
      }
    } else {
      // Create new laporan
      const res = await createLaporanBahanBakuAction(data);
      if (res.success) {
        router.push("/sppg/bahan-baku");
      } else {
        console.log("Creation failed:", res);
      }
    }
  };

  const handleCancel = () => {
    router.push("/sppg/bahan-baku");
  };

  return <FormLaporanBahanBaku initialValues={initialValues} onSubmit = {handleSubmit} onCancel={handleCancel} />;
};
