
SELECT
  t.id,
  t.kode_baru,
  t.nama_bahan_makanan,
  COALESCE(MAX(CASE WHEN kg.nama = 'Air' THEN ng.nilai END)::text, '-') AS air,
  COALESCE(MAX(CASE WHEN kg.nama = 'Energi' THEN ng.nilai END)::text, '-') AS energi,
  COALESCE(MAX(CASE WHEN kg.nama = 'Protein' THEN ng.nilai END)::text, '-') AS protein,
  COALESCE(MAX(CASE WHEN kg.nama = 'Lemak' THEN ng.nilai END)::text, '-') AS lemak,
  COALESCE(MAX(CASE WHEN kg.nama = 'Karbohidrat' THEN ng.nilai END)::text, '-') AS karbohidrat,
  COALESCE(MAX(CASE WHEN kg.nama = 'Serat' THEN ng.nilai END)::text, '-') AS serat,
  COALESCE(MAX(CASE WHEN kg.nama = 'Abu' THEN ng.nilai END)::text, '-') AS abu,
  COALESCE(MAX(CASE WHEN kg.nama = 'Kalsium (Ca)' THEN ng.nilai END)::text, '-') AS kalsium,
  COALESCE(MAX(CASE WHEN kg.nama = 'Fosfor (P)' THEN ng.nilai END)::text, '-') AS fosfor,
  COALESCE(MAX(CASE WHEN kg.nama = 'Besi (Fe)' THEN ng.nilai END)::text, '-') AS besi,
  COALESCE(MAX(CASE WHEN kg.nama = 'Natrium (Na)' THEN ng.nilai END)::text, '-') AS natrium,
  COALESCE(MAX(CASE WHEN kg.nama = 'Kalium (Ka)' THEN ng.nilai END)::text, '-') AS kalium,
  COALESCE(MAX(CASE WHEN kg.nama = 'Tembaga (Cu)' THEN ng.nilai END)::text, '-') AS tembaga,
  COALESCE(MAX(CASE WHEN kg.nama = 'Seng (Zn)' THEN ng.nilai END)::text, '-') AS seng,
  COALESCE(MAX(CASE WHEN kg.nama = 'Retinol (vit. A)' THEN ng.nilai END)::text, '-') AS retinol_vit_a,
  COALESCE(MAX(CASE WHEN kg.nama = 'β-karoten' THEN ng.nilai END)::text, '-') AS beta_karoten,
  COALESCE(MAX(CASE WHEN kg.nama = 'Karoten total' THEN ng.nilai END)::text, '-') AS karoten_total,
  COALESCE(MAX(CASE WHEN kg.nama = 'Thiamin (vit. B1)' THEN ng.nilai END)::text, '-') AS thiamin_vit_b1,
  COALESCE(MAX(CASE WHEN kg.nama = 'Riboflavin (vit. B2)' THEN ng.nilai END)::text, '-') AS riboflavin_vit_b2,
  COALESCE(MAX(CASE WHEN kg.nama = 'Niasin' THEN ng.nilai END)::text, '-') AS niasin,
  COALESCE(MAX(CASE WHEN kg.nama = 'Vitamin C' THEN ng.nilai END)::text, '-') AS vitamin_c,
  COALESCE(t.bdd::text, '-') AS bdd,
  t.mentah_olahan,
  t.kelompok_makanan,
  t.sumber 
FROM
  tkpi t
LEFT JOIN
  nilai_gizi ng ON t.id = ng.tkpi_id
LEFT JOIN
  komponen_gizi kg ON ng.komponen_gizi_id = kg.id
GROUP BY
  t.id, t.kode_baru, t.nama_bahan_makanan
ORDER BY
  t.nama_bahan_makanan;