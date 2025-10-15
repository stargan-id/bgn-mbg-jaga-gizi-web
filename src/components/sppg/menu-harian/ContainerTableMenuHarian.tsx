"use client"
import { useState } from "react";
import { TableMenuHarian } from "./TableMenuHarian";
import { deleteMenuHarianAction } from "@/actions/menu-harian";
import { MenuHarian } from "@prisma/client";

interface ContainerTableMenuHarianProps {
    initialData?: MenuHarian[];
}
export const ContainerTableMenuHarian = ({initialData}:ContainerTableMenuHarianProps) => {

    const [data, setData] = useState<MenuHarian[]>(initialData || []);
    
  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus menu ini?")) {
      await deleteMenuHarianAction(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return <TableMenuHarian loading={false} data={data} onDelete={handleDelete} />;

}