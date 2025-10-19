"use client";
import { deleteLaporanBahanBakuAction, getLaporanBahanBakuListAction } from "@/actions/laporan-bahan-baku";
import { LaporanBahanBakuData } from "@/types/laporan-bahan-baku";
import { useEffect, useState } from "react";
import { LaporanBahanBakuTable } from "./LaporanBahanBakuTable";

export function ListLaporanBahanBaku() {
  const [data, setData] = useState<LaporanBahanBakuData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLaporanBahanBakuListAction().then((res) => {
      if (res.success) {
        setData(res.data || []);
      } else {
        setData([]);
        // Optionally show an error message here
      }
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus laporan ini?")) {
      await deleteLaporanBahanBakuAction(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div>
      <LaporanBahanBakuTable data={data} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
