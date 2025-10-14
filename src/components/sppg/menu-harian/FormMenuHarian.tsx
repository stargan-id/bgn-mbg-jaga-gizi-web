"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMenuHarianSchema,
  CreateMenuHarianData,
  CreateMenuHarianInput, // Pastikan ini di-import dari file schema
} from "@/zod/schema/menu-harian";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createMenuHarianAction } from "@/actions/menu-harian";

export default function FormMenuHarian() {
  const router = useRouter();

  // Pola yang Benar:
  // 1. useForm menggunakan tipe INPUT (data mentah sebelum validasi)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateMenuHarianData>({ // <-- Menggunakan tipe INPUT
    resolver: zodResolver(createMenuHarianSchema),
    defaultValues: {
      // defaultValues harus cocok dengan tipe INPUT
      // Jadi tanggal bisa string, dan angka bisa number
      tanggal: new Date(),
      namaMenu: "",
      deskripsi: "",
      porsiTarget: 1,
      kaloriPerPorsi: 0,
      proteinPerPorsi: 0,
      karbohidratPerPorsi: 0,
      lemakPerPorsi: 0,
      fotoMenu: [],
      catatanGizi: "",
      biayaPerPorsi: 0,
    },
  });

  const fotoMenu = watch("fotoMenu");

  const handleFotoMenuChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    const promises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });
    const images = await Promise.all(promises);
    setValue("fotoMenu", images, { shouldValidate: true });
  };

  // 2. onSubmit menggunakan tipe OUTPUT (data bersih setelah divalidasi Zod)
  const onSubmit = async (data: CreateMenuHarianData) => { // <-- Menggunakan tipe OUTPUT
    const res = await createMenuHarianAction(data);
    if (res.success) {
      reset();
      router.push("/sppg/menu-harian");
    } else {
      alert(res.message || "Gagal menyimpan data. Silakan coba lagi.");
    }
  };

  const allErrors = Object.entries(errors)
    .filter(([_, err]) => !!err)
    .map(([field, err]) => ({ field, message: err?.message as string }));

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {allErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <strong>Periksa kembali data yang diisi:</strong>
          <ul className="list-disc ml-5 mt-1">
            {allErrors.map((err, i) => (
              <li key={i}>
                <span className="font-semibold">{err.field}</span>:{" "}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        noValidate
      >
        {/* Tanggal */}
        <div className="col-span-1">
          <label htmlFor="tanggal" className="block mb-1 font-semibold text-gray-700">
            Tanggal
          </label>
          <input
            id="tanggal"
            type="date"
            {...register("tanggal")} // <-- Cukup register nama field
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.tanggal ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.tanggal && (
            <span className="text-red-500 text-xs">
              {errors.tanggal.message}
            </span>
          )}
        </div>
        {/* Nama Menu */}
        <div className="col-span-1">
          <label htmlFor="namaMenu" className="block mb-1 font-semibold text-gray-700">
            Nama Menu
          </label>
          <input
            id="namaMenu"
            type="text"
            {...register("namaMenu")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.namaMenu ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.namaMenu && (
            <span className="text-red-500 text-xs">
              {errors.namaMenu.message}
            </span>
          )}
        </div>
        {/* Deskripsi */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="deskripsi" className="block mb-1 font-semibold text-gray-700">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            {...register("deskripsi")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.deskripsi ? "border-red-500" : "border-gray-300"
            }`}
            rows={2}
          />
          {errors.deskripsi && (
            <span className="text-red-500 text-xs">
              {errors.deskripsi.message}
            </span>
          )}
        </div>
        {/* Porsi Target */}
        <div className="col-span-1">
          <label htmlFor="porsiTarget" className="block mb-1 font-semibold text-gray-700">
            Porsi Target
          </label>
          <input
            id="porsiTarget"
            type="number"
            min={1}
            step="1"
            {...register("porsiTarget",
              {valueAsNumber: true}
            )} 
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.porsiTarget ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.porsiTarget && (
            <span className="text-red-500 text-xs">
              {errors.porsiTarget.message}
            </span>
          )}
        </div>

        {/* Kalori Per Porsi */}
        <div className="col-span-1">
          <label htmlFor="kaloriPerPorsi" className="block mb-1 font-semibold text-gray-700">
            Kalori Per Porsi
          </label>
          <input
            id="kaloriPerPorsi"
            type="number"
            min={0}
            step="any"
            {...register("kaloriPerPorsi", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.kaloriPerPorsi ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.kaloriPerPorsi && (
            <span className="text-red-500 text-xs">
              {errors.kaloriPerPorsi.message}
            </span>
          )}
        </div>

        {/* Protein Per Porsi */}
        <div className="col-span-1">
          <label htmlFor="proteinPerPorsi" className="block mb-1 font-semibold text-gray-700">
            Protein Per Porsi (gram)
          </label>
          <input
            id="proteinPerPorsi"
            type="number"
            min={0}
            step="any"
            {...register("proteinPerPorsi", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.proteinPerPorsi ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.proteinPerPorsi && (
            <span className="text-red-500 text-xs">
              {errors.proteinPerPorsi.message}
            </span>
          )}
        </div>

        {/* Karbohidrat Per Porsi */}
        <div className="col-span-1">
          <label htmlFor="karbohidratPerPorsi" className="block mb-1 font-semibold text-gray-700">
            Karbohidrat Per Porsi (gram)
          </label>
          <input
            id="karbohidratPerPorsi"
            type="number"
            min={0}
            step="any"
            {...register("karbohidratPerPorsi", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.karbohidratPerPorsi ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.karbohidratPerPorsi && (
            <span className="text-red-500 text-xs">
              {errors.karbohidratPerPorsi.message}
            </span>
          )}
        </div>

        {/* Lemak Per Porsi */}
        <div className="col-span-1">
          <label htmlFor="lemakPerPorsi" className="block mb-1 font-semibold text-gray-700">
            Lemak Per Porsi (gram)
          </label>
          <input
            id="lemakPerPorsi"
            type="number"
            min={0}
            step="any"
            {...register("lemakPerPorsi", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.lemakPerPorsi ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lemakPerPorsi && (
            <span className="text-red-500 text-xs">
              {errors.lemakPerPorsi.message}
            </span>
          )}
        </div>

        {/* Catatan Gizi */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="catatanGizi" className="block mb-1 font-semibold text-gray-700">
            Catatan Gizi
          </label>
          <textarea
            id="catatanGizi"
            {...register("catatanGizi")}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.catatanGizi ? "border-red-500" : "border-gray-300"
            }`}
            rows={2}
          />
          {errors.catatanGizi && (
            <span className="text-red-500 text-xs">
              {errors.catatanGizi.message}
            </span>
          )}
        </div>

        {/* Biaya Per Porsi */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="biayaPerPorsi" className="block mb-1 font-semibold text-gray-700">
            Biaya Per Porsi
          </label>
          <input
            id="biayaPerPorsi"
            type="number"
            min={0}
            step="any"
            {...register("biayaPerPorsi", { valueAsNumber: true })}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.biayaPerPorsi ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.biayaPerPorsi && (
            <span className="text-red-500 text-xs">
              {errors.biayaPerPorsi.message}
            </span>
          )}
        </div>

        {/* Foto Menu (upload) */}
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="fotoMenu" className="block mb-1 font-semibold text-gray-700">
            Foto Menu
          </label>
          <input
            id="fotoMenu"
            type="file"
            multiple
            accept="image/*"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onChange={handleFotoMenuChange}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {fotoMenu &&
              Array.isArray(fotoMenu) &&
              fotoMenu.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Foto Menu ${idx + 1}`}
                  className="h-16 w-16 object-cover rounded border"
                />
              ))}
          </div>
          {errors.fotoMenu && (
            <span className="text-red-500 text-xs">
              {errors.fotoMenu.message}
            </span>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2 mt-2">
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