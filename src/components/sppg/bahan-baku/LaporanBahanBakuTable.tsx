"use client";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LaporanBahanBakuData } from "@/types/laporan-bahan-baku";

interface Props {
  data: LaporanBahanBakuData[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const columns: ColumnDef<LaporanBahanBakuData>[] = [
  {
    accessorKey: "tanggal",
    header: "Tanggal Masuk",
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return val ? new Date(val).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "namaBahan",
    header: "Nama Bahan",
  },
  {
    accessorKey: "pemasok.nama",
    header: "Pemasok",
    cell: ({ row }) => row.original.pemasok?.nama || "-",
  },
  {
    accessorKey: "jumlah",
    header: "Jumlah",
  },
  {
    accessorKey: "satuan",
    header: "Satuan",
  },
  {
    accessorKey: "kondisiBahan",
    header: "Kondisi",
  },
  {
    id: "aksi",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/sppg/bahan-baku/${row.original.id}`}><Button size="sm">Detil</Button></Link>
        <Link href={`/sppg/bahan-baku/${row.original.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
        <Button size="sm" variant="destructive" onClick={() => row.original.id && row.table.options.meta?.onDelete(row.original.id)}>Hapus</Button>
      </div>
    ),
  },
];

export function LaporanBahanBakuTable({ data, loading, onDelete }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { onDelete },
  });

  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white">
      <table className="min-w-full text-sm border-separate border-spacing-0">
        <thead className="bg-primary/10 text-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 font-semibold border-b border-gray-200 text-left">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length} className="p-6 text-center">Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className="p-6 text-center">Belum ada data</td></tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b border-gray-100 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
