"use client";
import { DatePicker, ImageUploader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { getPemasokList } from "@/lib/services/pemasok";
import { CreateLaporanBahanBakuData, createLaporanBahanBakuSchema } from "@/zod/schema/laporan-bahan-baku";
import { zodResolver } from "@hookform/resolvers/zod";
import { JenisBahan, KondisiBahan, LaporanBahanBaku } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  initialValues?: LaporanBahanBaku;
  onSubmit: (data: CreateLaporanBahanBakuData) => Promise<void> | void;
  onCancel?: () => void;
}

export default function FormLaporanBahanBaku({ initialValues, onSubmit,onCancel }: Props) {
  // Enum options for select fields
  const jenisBahanOptions = [
    "PROTEIN_HEWANI",
    "PROTEIN_NABATI",
    "KARBOHIDRAT",
    "SAYURAN",
    "BUAH",
    "BUMBU_REMPAH",
    "MINYAK_LEMAK",
    "LAINNYA",
  ];
  const kondisiBahanOptions = [
    "SANGAT_BAIK",
    "BAIK",
    "CUKUP",
    "BURUK",
  ];
  const [pemasokList, setPemasokList] = useState<{ id: string; nama: string }[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  watch,
    setValue,
  } = useForm<CreateLaporanBahanBakuData>({
    resolver: zodResolver(createLaporanBahanBakuSchema),
    defaultValues: initialValues || {
      tanggal: new Date(),
      namaBahan: "",
      jenisBahan: JenisBahan.PROTEIN_HEWANI,
      jumlah: 0,
      satuan: "",
      tanggalExpiry: new Date(),
      kondisiBahan: KondisiBahan.BAIK,
      suhuPenerimaan: undefined,
      fotoEvidence: [],
      catatan: "",
      pemasokId: "",
    },
  });

  useEffect(() => {
    async function fetchPemasok() {
      const list = await getPemasokList();
      setPemasokList(list.map((p) => ({ id: p.id, nama: p.nama })));
    }
    fetchPemasok();
  }, []);

  // const onSubmit = async (data: CreateLaporanBahanBakuData) => {
  //   const res = await createLaporanBahanBakuAction(data);
  //   if (res.success) {
  //     reset();
  //     router.push("/sppg/bahan-baku");
  //   } else {
  //       console.log(res);
  //     // setError("namaBahan", { type: "manual", message: res.error || "Gagal menyimpan data" });
  //   }
  // };

  // Helper to collect all error messages
  const allErrors = Object.entries(errors)
  .filter(([_, err]) => !!err)
  .map(([field, err]) => ({ field, message: err?.message }));

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {allErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <strong>Periksa kembali data yang diisi:</strong>
          <ul className="list-disc ml-5 mt-1">
            {allErrors.map((err, i) => (
              <li key={i}><span className="font-semibold">{err.field}</span>: {err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="col-span-1">
          <label htmlFor="tanggal" className="block mb-1 font-semibold text-gray-700">Tanggal Masuk</label>
          <DatePicker
          name="tanggal"
          register={register}
          watch={watch}
          errors={errors}
          required
          />
          {errors.tanggal && <span className="text-red-500 text-xs">{errors.tanggal.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="namaBahan" className="block mb-1 font-semibold text-gray-700">Nama Bahan</label>
          <input
            id="namaBahan"
            type="text"
            {...register("namaBahan")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.namaBahan ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.namaBahan && <span className="text-red-500 text-xs">{errors.namaBahan.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="jenisBahan" className="block mb-1 font-semibold text-gray-700">Jenis Bahan</label>
          <select
            id="jenisBahan"
            {...register("jenisBahan")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.jenisBahan ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Pilih jenis bahan</option>
            {jenisBahanOptions.map((opt) => (
              <option key={opt} value={opt}>{opt.replace(/_/g, " ")}</option>
            ))}
          </select>
          {errors.jenisBahan && <span className="text-red-500 text-xs">{errors.jenisBahan.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="jumlah" className="block mb-1 font-semibold text-gray-700">Jumlah</label>
          <input
            id="jumlah"
            type="number"
            min={0}
            step="any"
            {...register("jumlah", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.jumlah ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.jumlah && <span className="text-red-500 text-xs">{errors.jumlah.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="satuan" className="block mb-1 font-semibold text-gray-700">Satuan</label>
          <input
            id="satuan"
            type="text"
            {...register("satuan")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.satuan ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.satuan && <span className="text-red-500 text-xs">{errors.satuan.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="tanggalExpiry" className="block mb-1 font-semibold text-gray-700">Tanggal Expiry</label>
        
          <DatePicker
          name="tanggalExpiry"
          register={register}
          watch={watch}
          errors={errors}
           required={false}
          />
          {errors.tanggalExpiry && <span className="text-red-500 text-xs">{errors.tanggalExpiry.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="kondisiBahan" className="block mb-1 font-semibold text-gray-700">Kondisi Bahan</label>
          <select
            id="kondisiBahan"
            {...register("kondisiBahan")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.kondisiBahan ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Pilih kondisi bahan</option>
            {kondisiBahanOptions.map((opt) => (
              <option key={opt} value={opt}>{opt.replace(/_/g, " ")}</option>
            ))}
          </select>
          {errors.kondisiBahan && <span className="text-red-500 text-xs">{errors.kondisiBahan.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="suhuPenerimaan" className="block mb-1 font-semibold text-gray-700">Suhu Penerimaan (°C)</label>
          <input
            id="suhuPenerimaan"
            type="number"
            min={0}
            step="any"
            {...register("suhuPenerimaan", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.suhuPenerimaan ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.suhuPenerimaan && <span className="text-red-500 text-xs">{errors.suhuPenerimaan.message}</span>}
        </div>
        <div className="col-span-1">
          <label htmlFor="pemasokId" className="block mb-1 font-semibold text-gray-700">Pemasok</label>
          <select
            id="pemasokId"
            {...register("pemasokId")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.pemasokId ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Pilih pemasok</option>
            {pemasokList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
          {errors.pemasokId && <span className="text-red-500 text-xs">{errors.pemasokId.message}</span>}
        </div>

        {/* Foto (upload) */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="fotoEvidence" className="block mb-1 font-semibold text-gray-700">
            Foto Bahan
          </label>
          <ImageUploader
            name="fotoEvidence"
            setValue={setValue}
            watch={watch}
            errors={errors}
            multiple={true}
            accept="image/*"
          />
          {errors.fotoEvidence && (
            <span className="text-red-500 text-xs">
              {errors.fotoEvidence.message}
            </span>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="catatan" className="block mb-1 font-semibold text-gray-700">Catatan</label>
          <textarea
            id="catatan"
            {...register("catatan")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.catatan ? "border-red-500" : "border-gray-300"}`}
            rows={2}
          />
          {errors.catatan && <span className="text-red-500 text-xs">{errors.catatan.message}</span>}
        </div>

        

        <div className="col-span-1 sm:col-span-2 mt-2 gap-2 flex flex-col">
          <Button
            variant="outline"
            type="button"
            className="w-full py-2 text-base font-semibold"
            onClick={() => {
              if (onCancel) {
                onCancel();
              }
            }}
          >Cancel</Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-base font-semibold"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
