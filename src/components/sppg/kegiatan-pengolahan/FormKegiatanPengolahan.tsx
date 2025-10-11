"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createKegiatanPengolahanAction, updateKegiatanPengolahanAction } from "@/actions/kegiatan-pengolahan";
import { kegiatanPengolahanSchema, CreateKegiatanPengolahanData, UpdateKegiatanPengolahanData, KegiatanPengolahanData } from "@/zod/schema/kegiatan-pengolahan";
import { Button } from "@/components/ui/button";


interface Props {
  mode: "create" | "edit";
  initialData?: KegiatanPengolahanData;
}

export default function FormKegiatanPengolahan({ mode, initialData }: Props) {


  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<KegiatanPengolahanData>({
    resolver: zodResolver(kegiatanPengolahanSchema),
    defaultValues: initialData || {
      tanggalPengolahan: "",
      jamMulai: "",
      jamSelesai: "",
      jenisPengolahan: "",
      targetPorsi: 0,
      porsiTerealisasi: 0,
      suhuPengolahan: undefined,
      metodePengolahan: "",
      penanggungJawab: "",
      statusKegiatan: "BERLANGSUNG",
      catatanProses: "",
      catatanMutu: "",
      fotoProses: [],
    },
  });

  const onSubmit = async (data: KegiatanPengolahanData) => {
    if (mode === "create") {
      const res = await createKegiatanPengolahanAction(data as CreateKegiatanPengolahanData);
      if (res.success) {
        reset();
        router.push("/sppg/kegiatan-pengolahan");
      } else {
        setError("tanggalPengolahan", { type: "manual", message: res.error || "Gagal menyimpan data" });
      }
    } else {
      const res = await updateKegiatanPengolahanAction(data.id!, data as UpdateKegiatanPengolahanData);
      if (res.success) {
        router.push("/sppg/kegiatan-pengolahan");
      } else {
        setError("tanggalPengolahan", { type: "manual", message: res.error || "Gagal memperbarui data" });
      }
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Tanggal Pengolahan</label>
            <input type="date" {...register("tanggalPengolahan")} className="input w-full border rounded px-3 py-2 focus:outline-primary" />
            {errors.tanggalPengolahan && <span className="text-red-500 text-xs mt-1 block">{errors.tanggalPengolahan.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Jam Mulai</label>
            <input type="time" {...register("jamMulai")} className="input w-full border rounded px-3 py-2 focus:outline-primary" />
            {errors.jamMulai && <span className="text-red-500 text-xs mt-1 block">{errors.jamMulai.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Jam Selesai</label>
            <input type="time" {...register("jamSelesai")} className="input w-full border rounded px-3 py-2 focus:outline-primary" />
            {errors.jamSelesai && <span className="text-red-500 text-xs mt-1 block">{errors.jamSelesai.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Jenis Pengolahan</label>
            <input type="text" {...register("jenisPengolahan")} className="input w-full border rounded px-3 py-2 focus:outline-primary" placeholder="Contoh: Penggorengan, Pengukusan" />
            {errors.jenisPengolahan && <span className="text-red-500 text-xs mt-1 block">{errors.jenisPengolahan.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Target Porsi</label>
            <input type="number" {...register("targetPorsi", { valueAsNumber: true })} className="input w-full border rounded px-3 py-2 focus:outline-primary" min={1} />
            {errors.targetPorsi && <span className="text-red-500 text-xs mt-1 block">{errors.targetPorsi.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Porsi Terealisasi</label>
            <input type="number" {...register("porsiTerealisasi", { valueAsNumber: true })} className="input w-full border rounded px-3 py-2 focus:outline-primary" min={0} />
            {errors.porsiTerealisasi && <span className="text-red-500 text-xs mt-1 block">{errors.porsiTerealisasi.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Suhu Pengolahan (°C)</label>
            <input type="number" {...register("suhuPengolahan", { valueAsNumber: true })} className="input w-full border rounded px-3 py-2 focus:outline-primary" min={0} />
            {errors.suhuPengolahan && <span className="text-red-500 text-xs mt-1 block">{errors.suhuPengolahan.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Metode Pengolahan</label>
            <input type="text" {...register("metodePengolahan")} className="input w-full border rounded px-3 py-2 focus:outline-primary" placeholder="Contoh: Direbus, Digoreng" />
            {errors.metodePengolahan && <span className="text-red-500 text-xs mt-1 block">{errors.metodePengolahan.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Penanggung Jawab</label>
            <input type="text" {...register("penanggungJawab")} className="input w-full border rounded px-3 py-2 focus:outline-primary" placeholder="Nama petugas" />
            {errors.penanggungJawab && <span className="text-red-500 text-xs mt-1 block">{errors.penanggungJawab.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Status Kegiatan</label>
            <select {...register("statusKegiatan")} className="input w-full border rounded px-3 py-2 focus:outline-primary">
              <option value="PERSIAPAN">Persiapan</option>
              <option value="BERLANGSUNG">Berlangsung</option>
              <option value="SELESAI">Selesai</option>
              <option value="DIHENTIKAN">Dihentikan</option>
              <option value="GAGAL">Gagal</option>
            </select>
            {errors.statusKegiatan && <span className="text-red-500 text-xs mt-1 block">{errors.statusKegiatan.message}</span>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">Catatan Proses</label>
            <textarea {...register("catatanProses")} className="input w-full border rounded px-3 py-2 focus:outline-primary" rows={2} placeholder="Catatan proses pengolahan..." />
            {errors.catatanProses && <span className="text-red-500 text-xs mt-1 block">{errors.catatanProses.message}</span>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">Catatan Mutu</label>
            <textarea {...register("catatanMutu")} className="input w-full border rounded px-3 py-2 focus:outline-primary" rows={2} placeholder="Catatan mutu/kualitas..." />
            {errors.catatanMutu && <span className="text-red-500 text-xs mt-1 block">{errors.catatanMutu.message}</span>}
          </div>
          <div className="md:col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={isSubmitting} className="px-6 py-2 text-base font-semibold rounded-lg shadow bg-primary text-white hover:bg-primary/90 transition">
              {isSubmitting ? "Menyimpan..." : mode === "create" ? "Simpan" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}