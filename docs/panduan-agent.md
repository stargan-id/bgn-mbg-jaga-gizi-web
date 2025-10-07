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
