"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TableMenuHarian } from "@/components/sppg/menu-harian/TableMenuHarian";
import { getMenuHarianListAction, deleteMenuHarianAction } from "@/actions/menu-harian";
import { Button } from "@/components/ui/button";

export default function MenuHarianPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMenuHarianListAction().then((res) => {
      setData(res.data || []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus menu ini?")) {
      await deleteMenuHarianAction(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Menu Harian & Analisis Gizi</h1>
      <div className="flex justify-end mb-4">
        <Link href="/sppg/menu-harian/tambah">
          <Button>Tambah Menu Harian</Button>
        </Link>
      </div>
      <TableMenuHarian data={data} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
