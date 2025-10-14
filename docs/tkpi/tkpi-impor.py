# -*- coding: utf-8 -*-
"""
Skrip untuk mengimpor data Tabel Komposisi Pangan Indonesia (TKPI) dari file JSON
langsung ke database PostgreSQL tanpa perantara Prisma Client.

Skrip ini menggunakan driver 'asyncpg'.

Prasyarat:
1. Tabel 'tkpi', 'komponen_gizi', dan 'nilai_gizi' sudah ada di database.
2. Library asyncpg sudah terinstal (`pip install asyncpg`).
"""

import asyncio
import json
import asyncpg
import uuid
from typing import Dict, Any, List, Optional

# --- Konfigurasi ---
# Nama file JSON yang berisi data TKPI
NAMA_FILE_JSON = "docs/tkpi-komposisi-1.json"

# --- Konfigurasi Database ---
# GANTI DENGAN DETAIL KONEKSI DATABASE ANDA
DB_USER = "jagagizi_user"
DB_PASSWORD = "your_secure_password_here"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "jagagizi_db"

# Definisikan "kamus" master untuk semua komponen gizi (tidak berubah)
KOMPONEN_GIZI_MAP: Dict[str, str] = {
    "Air": "g", "Energi": "kcal", "Protein": "g", "Lemak": "g", "Karbohidrat": "g",
    "Serat": "g", "Abu": "g", "Kalsium (Ca)": "mg", "Fosfor (P)": "mg",
    "Besi (Fe)": "mg", "Natrium (Na)": "mg", "Kalium (Ka)": "mg", "Tembaga (Cu)": "mg",
    "Seng (Zn)": "mg", "Retinol (vit. A)": "mcg", "β-karoten": "mcg",
    "Karoten total": "mcg", "Thiamin (vit. B1)": "mg", "Riboflavin (vit. B2)": "mg",
    "Niasin": "mg", "Vitamin C": "mg",
}

# --- Fungsi Helper ---

def clean_value(value_str: Any) -> Optional[float]:
    """
    Membersihkan dan mengonversi nilai numerik dari sumber data.
    - Menangani format ribuan (misal: '1.787,0').
    - Mengganti koma desimal (,) dengan titik (.).
    - Mengonversi ke float.
    - Mengembalikan None jika nilai tidak valid (misalnya "-", "", atau non-string).
    """
    if not isinstance(value_str, str):
        return None
        
    cleaned_str = value_str.strip()
    if cleaned_str in ["-", ""]:
        return None
        
    try:
        # --- PERUBAHAN UTAMA DI SINI ---
        # 1. Hapus pemisah ribuan (titik). Contoh: '1.787,0' -> '1787,0'
        # 2. Ganti pemisah desimal (koma) dengan titik. Contoh: '1787,0' -> '1787.0'
        standard_format_str = cleaned_str.replace('.', '').replace(',', '.')
        return float(standard_format_str)
    except (ValueError, TypeError):
        print(f"⚠️ Peringatan: Tidak dapat mengonversi nilai '{value_str}' ke float.")
        return None

async def seed_komponen_gizi(conn: asyncpg.Connection) -> Dict[str, int]:
    """
    Memasukkan data master komponen gizi ke database menggunakan SQL mentah.
    Menggunakan klausa `ON CONFLICT` (fitur PostgreSQL) untuk meniru 'upsert'.
    """
    print("🚀 Memulai proses seeding tabel 'komponen_gizi'...")
    # SQL untuk UPSERT: jika 'nama' sudah ada, perbarui 'satuan'.
    sql_upsert = """
        INSERT INTO komponen_gizi (nama, satuan) VALUES ($1, $2)
        ON CONFLICT (nama) DO UPDATE SET satuan = $2;
    """
    for nama, satuan in KOMPONEN_GIZI_MAP.items():
        await conn.execute(sql_upsert, nama, satuan)
    print("✅ Seeding 'komponen_gizi' selesai.")

    # Ambil semua data untuk membuat map pencarian cepat
    rows = await conn.fetch("SELECT nama, id FROM komponen_gizi")
    return {row['nama']: row['id'] for row in rows}

# --- Fungsi Utama ---

# --- Ganti seluruh fungsi main() Anda dengan ini ---
async def main():
    """Fungsi utama untuk menjalankan keseluruhan proses impor."""
    conn = None
    try:
        conn = await asyncpg.connect(
            user=DB_USER, password=DB_PASSWORD,
            database=DB_NAME, host=DB_HOST, port=DB_PORT
        )
        print("🔌 Koneksi ke database berhasil.")

        komponen_map = await seed_komponen_gizi(conn)

        try:
            with open(NAMA_FILE_JSON, 'r', encoding='utf-8') as f:
                data_tkpi: List[Dict[str, Any]] = json.load(f)
            print(f"📂 Berhasil membaca {len(data_tkpi)} item dari '{NAMA_FILE_JSON}'.")
        except FileNotFoundError:
            print(f"❌ FATAL: File '{NAMA_FILE_JSON}' tidak ditemukan.")
            return
        except json.JSONDecodeError:
            print(f"❌ FATAL: Gagal mem-parsing '{NAMA_FILE_JSON}'. Format JSON tidak valid.")
            return

        print("\n🌽 Memulai proses impor data bahan makanan...")
        for index, item in enumerate(data_tkpi, 1):
            kode_baru = item.get("kode_baru")
            nama_bahan = item.get("nama_bahan_makanan")

            if not kode_baru or not nama_bahan:
                print(f"⏭️  Melewatkan item #{index} karena tidak memiliki 'kode_baru' atau 'nama_bahan_makanan'.")
                continue

            print(f"\n[{index}/{len(data_tkpi)}] Memproses: {nama_bahan} (Kode: {kode_baru})")

            # --- PERUBAHAN DIMULAI DI SINI ---

            # 1. Modifikasi Kueri SQL untuk menyertakan kolom `id` di bagian INSERT
            sql_upsert_tkpi = """
                INSERT INTO tkpi (id, kode_baru, nama_bahan_makanan, bdd, mentah_olahan, kelompok_makanan, sumber)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (kode_baru) DO UPDATE SET
                    nama_bahan_makanan = $3,
                    bdd = $4,
                    mentah_olahan = $5,
                    kelompok_makanan = $6,
                    sumber = $7
                RETURNING id;
            """
            
            # 2. Eksekusi kueri dengan menyertakan UUID baru sebagai parameter pertama
            tkpi_record = await conn.fetchrow(
                sql_upsert_tkpi,
                str(uuid.uuid4()),  # Membuat ID unik baru untuk kasus INSERT
                kode_baru,
                nama_bahan,
                clean_value(item.get("BDD")),
                item.get("mentah_olahan"),
                item.get("kelompok_makanan"),
                item.get("sumber")
            )
            # --- AKHIR PERUBAHAN ---
            
            tkpi_id = tkpi_record['id']

            sql_upsert_nilai = """
                INSERT INTO nilai_gizi (id, tkpi_id, komponen_gizi_id, nilai)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (tkpi_id, komponen_gizi_id) DO UPDATE SET nilai = $4;
            """
            for nama_komponen, nilai_str in item.items():
                if nama_komponen in komponen_map:
                    nilai_float = clean_value(nilai_str)
                    if nilai_float is not None:
                        komponen_id = komponen_map[nama_komponen]
                        
                        # 2. Eksekusi kueri dengan menyertakan UUID baru
                        await conn.execute(
                            sql_upsert_nilai,
                            str(uuid.uuid4()), # ID unik baru untuk nilai_gizi
                            tkpi_id,
                            komponen_id,
                            nilai_float
                        )
                        print(f"  -> Menyimpan '{nama_komponen}': {nilai_float}")


        print("\n🎉 Proses impor selesai. Semua data telah berhasil diproses.")

    except asyncpg.exceptions.PostgresError as e:
        print(f"\n❌ Terjadi error pada database: {e}")
    except Exception as e:
        print(f"\n❌ Terjadi error yang tidak terduga: {e}")
    finally:
        if conn:
            await conn.close()
            print("\n🔌 Koneksi ke database ditutup.")

if __name__ == "__main__":
    print("=============================================")
    print("= SCRIPT IMPOR DATA TKPI (DIRECT TO DATABASE) =")
    print("=============================================")
    asyncio.run(main())