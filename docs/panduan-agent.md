# Panduan Pengembangan untuk Agen AI

Dokumen ini berisi aturan dan praktik terbaik yang wajib diikuti dalam pengembangan aplikasi untuk memastikan konsistensi, kualitas, dan kemudahan pemeliharaan kode.

## 1\. Konvensi Umum & Struktur Proyek

  - **Package Manager**: Proyek ini secara eksklusif menggunakan **`pnpm`**. Pastikan semua instalasi dan manajemen dependensi dilakukan melalui `pnpm`.
  - **Alur Data (Data Flow)**: Alur data di aplikasi ini bersifat searah dan terstruktur sebagai berikut:
    **`Halaman (Page) -> Actions -> Services`**
      - **Halaman (`/app`)**: Berfungsi sebagai *Server Component* untuk menampilkan data.
      - **Actions (`/actions`)**: Jembatan antara client/server dan logika bisnis. Semua pemanggilan data dari halaman **wajib** melalui *actions*.
      - **Services (`/lib/services`)**: Tempat semua logika bisnis inti dan interaksi langsung dengan database (Prisma) berada.
  - **Struktur Return Actions**: Setiap fungsi *action* **wajib** mengembalikan objek sesuai dengan tipe yang didefinisikan pada `ActionResponse.ts` untuk standarisasi respons.
  - **Definisi Tipe (Types)**: Setiap fungsi pada *services* harus memiliki *return type* yang jelas dan didefinisikan di dalam direktori `@/types`.

-----

## 2\. Aturan Penamaan (Naming Convention)

Konsistensi penamaan adalah kunci utama dalam proyek ini.

  - **Database (`schema.prisma`)**:
      - Nama tabel dan kolom menggunakan **Bahasa Indonesia** (contoh: `pengguna`, `nama_lengkap`).
      - **Pengecualian**: Skema yang sudah ada untuk RBAC (Role-Based Access Control) dibiarkan apa adanya (*as is*).
  - **Fungsi (Functions)**:
      - Nama fungsi pada **Services** menggunakan **Bahasa Inggris** (contoh: `getUserById`, `createProduct`).
      - Nama fungsi pada **Actions** menggunakan **Bahasa Inggris** (contoh: `getUser`, `createProductAction`).
  - **Komponen React**:
      - Penamaan file dan komponen menggunakan **Bahasa Indonesia** dengan format *PascalCase* (contoh: `TombolSimpan.tsx`, `FormulirPengguna.tsx`).
  - **Skema Zod**:
      - Menggunakan format `namaObjectSchema` dalam *camelCase* (contoh: `organisasiSchema`, `produkSchema`).

-----

## 3\. Manajemen Skema (Prisma & Zod)

`schema.prisma` adalah **satu-satunya sumber kebenaran (single source of truth)** untuk struktur data. Skema Zod harus selalu sinkron dengan model Prisma.

  - **Skema Utama**: Merefleksikan model dari `schema.prisma`.

    ```ts
    // contoh: @/lib/schemas/organisasi.ts
    import { z } from "zod";

    export const organisasiSchema = z.object({
      id: z.string().cuid(),
      nama: z.string().min(3, "Nama organisasi minimal 3 karakter"),
      alamat: z.string().optional(),
      createdAt: z.date(),
      updatedAt: z.date(),
    });
    ```

  - **Skema untuk Membuat Data (`Create`)**: Turunan dari skema utama, dengan menghapus `id` dan *timestamps*.

    ```ts
    export const createOrganisasiSchema = organisasiSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    });
    ```

  - **Skema untuk Memperbarui Data (`Update`)**: Turunan dari skema utama, di mana semua field bersifat opsional (`partial`) namun `id` wajib ada.

    ```ts
    export const updateOrganisasiSchema = organisasiSchema.partial().extend({
      id: z.string().cuid("ID organisasi tidak valid"),
    });
    ```

  - **Ekspor Tipe (Type Exports)**: Ekspor tipe TypeScript dari setiap skema Zod untuk digunakan di seluruh aplikasi.

    ```ts
    export type OrganisasiData = z.infer<typeof organisasiSchema>;
    export type CreateOrganisasiData = z.infer<typeof createOrganisasiSchema>;
    export type UpdateOrganisasiData = z.infer<typeof updateOrganisasiSchema>;
    ```

-----

## 4\. Pengembangan Antarmuka (UI/UX)

  - **Modularitas**: Semua halaman **wajib** dibangun menggunakan **komponen modular** yang dapat digunakan kembali. Pecah setiap bagian halaman (seperti header, tabel, form) menjadi komponen tersendiri.
  - **Server & Client Component**:
      - Secara *default*, semua halaman adalah **Server Component** untuk performa optimal.
      - Jika sebuah komponen memerlukan *state* atau interaktivitas (contoh: `onClick`, `useState`), bungkus komponen tersebut atau buat sebagai **Client Component** (`'use client'`).
  - **Desain Responsif & Mobile-Friendly**:
      - Antarmuka harus konsisten, intuitif, dan berfungsi dengan baik di berbagai ukuran layar, terutama **mobile**.
      - Gunakan **Sidebar** sebagai navigasi menu utama.
  - **Alur pada Mobile**: Untuk alur yang kompleks (misalnya form dengan beberapa langkah atau halaman detail), terapkan pola navigasi *sub-halaman* seperti pada aplikasi mobile. Saat pengguna masuk ke *sub-halaman*, sembunyikan menu utama dan elemen lain yang tidak relevan untuk fokus pada tugas yang sedang dikerjakan.

-----

## 5\. Manajemen State

  - Untuk manajemen *state* global atau yang perlu dibagikan antar halaman (seperti data pengguna yang login atau isi keranjang belanja), gunakan **Zustand**.