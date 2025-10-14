# Contoh Menu Harian & Komponen Menu

Berikut adalah contoh data MenuHarian dan KomponenMenu yang sesuai dengan best practice ahli gizi, lengkap dengan analisis gizi dan komponen bahan baku.

---

## Contoh MenuHarian

```json
{
  "tanggal": "2025-10-13",
  "namaMenu": "Nasi Ayam Sayur",
  "deskripsi": "Menu makan siang seimbang terdiri dari nasi, ayam panggang, dan sayur tumis.",
  "porsiTarget": 100,
  "catatanGizi": "Menu ini memenuhi standar AKG untuk kalori, protein, dan serat. Lemak dan natrium dalam batas aman.",
  "biayaPerPorsi": 8500,
  "fotoMenu": ["/public/menu/nasi-ayam-sayur.jpg"],
  "sppgId": "sppg_123456",
  "createdBy": "ahligizi_01"
}
```

## KomponenMenu untuk Menu di atas

```json
[
  {
    "namaBahan": "Nasi Putih",
    "jumlah": 10000,
    "satuan": "gram",
    "kaloriPer100g": 130,
    "proteinPer100g": 2.7,
    "karbohidratPer100g": 28,
    "lemakPer100g": 0.3
  },
  {
    "namaBahan": "Ayam Panggang",
    "jumlah": 8000,
    "satuan": "gram",
    "kaloriPer100g": 165,
    "proteinPer100g": 31,
    "karbohidratPer100g": 0,
    "lemakPer100g": 3.6
  },
  {
    "namaBahan": "Tumis Bayam Wortel",
    "jumlah": 5000,
    "satuan": "gram",
    "kaloriPer100g": 40,
    "proteinPer100g": 2.5,
    "karbohidratPer100g": 7,
    "lemakPer100g": 0.5
  },
  {
    "namaBahan": "Minyak Goreng",
    "jumlah": 500,
    "satuan": "ml",
    "kaloriPer100g": 884,
    "proteinPer100g": 0,
    "karbohidratPer100g": 0,
    "lemakPer100g": 100
  },
  {
    "namaBahan": "Bumbu Rempah",
    "jumlah": 300,
    "satuan": "gram",
    "kaloriPer100g": 50,
    "proteinPer100g": 1.5,
    "karbohidratPer100g": 10,
    "lemakPer100g": 0.2
  }
]
```

---

## Penjelasan Best Practice Ahli Gizi

- **MenuHarian** harus mencantumkan deskripsi, porsi target, dan catatan gizi yang relevan.
- **KomponenMenu** wajib mencantumkan nama bahan, jumlah, satuan, dan analisis gizi per 100g (kalori, protein, karbohidrat, lemak).
- Foto menu sebaiknya jelas dan representatif.
- Catatan gizi harus menginformasikan kelebihan/kekurangan menu terhadap standar AKG.
- Data dapat digunakan untuk perencanaan, monitoring, dan evaluasi menu harian di SPPG.

---

**Referensi:**
- Standar AKG Kemenkes RI
- Pedoman Menu Seimbang Ahli Gizi
- [Prisma Schema MenuHarian & KomponenMenu](../prisma/schema.prisma)
