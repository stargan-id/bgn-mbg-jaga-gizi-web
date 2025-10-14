import json
from bs4 import BeautifulSoup

# Header kolom sesuai TKPI
header = [
    "nomor", "kode_baru", "nama_bahan_makanan", "Air", "Energi", "Protein", "Lemak", "Karbohidrat", "Serat", "Abu",
    "Kalsium (Ca)", "Fosfor (P)", "Besi (Fe)", "Natrium (Na)", "Kalium (Ka)", "Tembaga (Cu)", "Seng (Zn)",
    "Retinol (vit. A)", "β-karoten", "Karoten total", "Thiamin (vit. B1)", "Riboflavin (vit. B2)", "Niasin",
    "Vitamin C", "BDD", "mentah_olahan", "kelompok_makanan", "sumber"
]

# Baca file HTML
with open("docs/tkpi-2019-hal1.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
rows = soup.find_all("tr")

data = []
for row in rows:
    tds = row.find_all("td")
    if len(tds) == len(header):
        values = []
        for i, td in enumerate(tds):
            if header[i] == "nama_bahan_makanan":
                a = td.find("a")
                values.append(a.text.strip() if a else td.text.strip())
            else:
                values.append(td.text.strip())
        data.append(dict(zip(header, values)))

# Simpan ke file JSON
with open("docs/tkpi-komposisi-1.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Berhasil mengekstrak {len(data)} baris ke docs/tkpi-komposisi-1 .json")