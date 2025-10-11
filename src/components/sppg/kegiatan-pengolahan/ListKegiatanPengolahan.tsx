"use client";
import { useEffect, useState } from "react";
import { getKegiatanPengolahanListAction, deleteKegiatanPengolahanAction } from "@/actions/kegiatan-pengolahan";
import { KegiatanPengolahanData } from "@/types/kegiatan-pengolahan";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ListKegiatanPengolahan() {
  const [data, setData] = useState<KegiatanPengolahanData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getKegiatanPengolahanListAction().then((res) => {
      setData(res.data || []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus kegiatan ini?")) {
      await deleteKegiatanPengolahanAction(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/sppg/kegiatan-pengolahan/tambah">
          <Button>Tambah Kegiatan</Button>
        </Link>
      </div>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-primary/10">
            <th className="p-2">Tanggal</th>
            <th className="p-2">Jenis</th>
            <th className="p-2">Target Porsi</th>
            <th className="p-2">Penanggung Jawab</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={5} className="p-4 text-center">Belum ada data</td></tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{new Date(item.tanggalPengolahan).toLocaleDateString()}</td>
                <td className="p-2">{item.jenisPengolahan}</td>
                <td className="p-2">{item.targetPorsi}</td>
                <td className="p-2">{item.penanggungJawab}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/sppg/kegiatan-pengolahan/${item.id}`}><Button size="sm">Detail</Button></Link>
                  <Link href={`/sppg/kegiatan-pengolahan/edit/${item.id}`}><Button size="sm" variant="outline">Edit</Button></Link>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Hapus</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
