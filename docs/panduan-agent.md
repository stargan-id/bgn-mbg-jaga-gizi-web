# Panduang Agent AI

- schema.prisma untuk core aplikasi penamaan tabel dan kolom dalam bahasa indonesia, untuk existing RBAC biarkan as it is 
- pastikan zod schema juga konsisten dengan schema database, jika schema hanya dibutuhkan untuk form dapat menyesaikan dan menambahkan sesuai kebutuhan form
- selalu lihat schema.prisma 
- nama fungsi pada service gunakan bahasa inggris
- nama fungsi pada action gunakan bahasa inggris
- action return selalu menggunakan ActionResponse.ts yang ada pada folder actions
- untuk setiap fungsi yang dibuat pada services pastikan mempunya return type yang didefinisikan pada @/types
- flow data akan selalu page -> actions/[nama-koleksi]/index.ts|spesific.ts -> lib/services/[nama-service.tsx]
- pemanggilan data selalu melewati actions 
- schema zod gunakan pattern namaobjectSchema contoh : organisasiSchema
- Schema for create (without id and timestamps)
- semua page/halaman menggunakan komponen yang modular
- page selalu server function, selalu gunakan komponen modular untuk setiap bagian page 
- jika ada perlu state atau interaksi pada page, maka komponen dapat di wrap dengan komponen client
- penamaan nama komponen menggunakan bahasa Indonesias
- ikuti kaidan UI/UX yang baik dan konsisten dan mobile responsive
- gunakan style sidebar untuk menu-menu
- flow dan page juga harus mobile friendly sehingga jika ada isian yang di sub halaman 2 tinggka ke bawah, maka gunakan modek sub-halaman seperti yang biasa ada pada mobile apps, saat sub halaman sembunyikan tombol2 umum dan fokus pada satu tugas form 


contoh

```ts
export const createNamaobjectSchema = namaobjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
```
- Schema for update (id required, other fields optional)

contoh

```ts
export const updateNamaObjectSchema = namaObjectSchema.partial().extend({
  id: z.string(),
});
```

- Type exports

```ts
export type NamaObjectData = z.infer<typeof namaObjectSchema>;
export type CreateNamaObjectData = z.infer<typeof createNamaObjectSchema>;
export type UpdateNamaObjectData = z.infer<typeof updateNamaObjectSchema>;
tså
