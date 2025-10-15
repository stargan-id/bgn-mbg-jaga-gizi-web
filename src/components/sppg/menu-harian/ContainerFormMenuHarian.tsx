"use client";
import FormMenuHarian from "./FormMenuHarian";
import { useEffect } from "react";
import { updateMenuHarianAction,createMenuHarianAction } from "@/actions/menu-harian";
import { UpdateMenuHarianData } from "@/types/menu-harian";
import { useRouter, useParams } from "next/navigation";
import { MenuHarian } from "@prisma/client";
import { toast } from "sonner";
import {
  createMenuHarianSchema,
  CreateMenuHarianData,
  CreateMenuHarianInput, // Pastikan ini di-import dari file schema
} from "@/zod/schema/menu-harian";

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
