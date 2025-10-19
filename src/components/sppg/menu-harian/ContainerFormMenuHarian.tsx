"use client";
import { createMenuHarianAction, updateMenuHarianAction } from "@/actions/menu-harian";
import { UpdateMenuHarianData } from "@/types/menu-harian";
import {
  CreateMenuHarianData
} from "@/zod/schema/menu-harian";
import { MenuHarian } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormMenuHarian from "./FormMenuHarian";

interface ContainerFormMenuHarianProps {
  initialValues?: MenuHarian;
}
export const ContainerFormMenuHarian = ({
  initialValues,
}: ContainerFormMenuHarianProps) => {
  const router = useRouter();

  const handleUpdate = async (data: CreateMenuHarianData) => {
    try {
      const updatedData: UpdateMenuHarianData = {
        ...data,
        id: initialValues?.id || "N/A", // Pastikan ada id untuk update,
      };

      const res = await updateMenuHarianAction(updatedData.id, updatedData);
      if (res.success) {
        router.push("/sppg/menu-harian");
      } else {
        toast.error(res.error || "Gagal memperbarui data. Silakan coba lagi.");
      }
    } catch (e) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleCreate = async (data: CreateMenuHarianData) => {
    try{
        const res = await createMenuHarianAction(data);
        if (res.success) {
          router.push("/sppg/menu-harian");
        } else {
          toast.error(res.error || "Gagal menambah data. Silakan coba lagi.");
        }
    }
    catch (e) {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleOnSubmit = async (data: CreateMenuHarianData) => {
    // jika ada id maka update
    if (initialValues?.id) {
      await handleUpdate(data);
      return;
    } else {
        await handleCreate(data);
        return;
    }
  };

  return (
    <FormMenuHarian onSubmit={handleOnSubmit} initialValues={initialValues} />
  );
};
