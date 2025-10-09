import { faker } from '@faker-js/faker';

// Data koordinat real untuk kota/kabupaten di Indonesia (daratan only)
export const INDONESIA_COORDINATES = {
  'DKI Jakarta': {
    'Jakarta Pusat': { lat: -6.1745, lng: 106.8227, radius: 0.02 },
    'Jakarta Utara': { lat: -6.1388, lng: 106.8650, radius: 0.03 },
    'Jakarta Selatan': { lat: -6.2615, lng: 106.8106, radius: 0.04 },
    'Jakarta Timur': { lat: -6.2250, lng: 106.9004, radius: 0.05 },
    'Jakarta Barat': { lat: -6.1352, lng: 106.7600, radius: 0.04 },
    'Kepulauan Seribu': { lat: -5.8800, lng: 106.5300, radius: 0.02 }
  },
  'Jawa Barat': {
    'Bandung': { lat: -6.9175, lng: 107.6191, radius: 0.05 },
    'Bogor': { lat: -6.5944, lng: 106.7892, radius: 0.04 },
    'Bekasi': { lat: -6.2349, lng: 107.0011, radius: 0.03 },
    'Depok': { lat: -6.4025, lng: 106.7942, radius: 0.02 },
    'Cimahi': { lat: -6.8721, lng: 107.5339, radius: 0.02 },
    'Sukabumi': { lat: -6.9278, lng: 106.9271, radius: 0.04 },
    'Cirebon': { lat: -6.7063, lng: 108.5572, radius: 0.03 },
    'Garut': { lat: -7.2253, lng: 107.8958, radius: 0.04 },
    'Tasikmalaya': { lat: -7.3506, lng: 108.2172, radius: 0.03 },
    'Purwakarta': { lat: -6.5569, lng: 107.4431, radius: 0.03 }
  },
  'Jawa Tengah': {
    'Semarang': { lat: -6.9667, lng: 110.4167, radius: 0.05 },
    'Solo': { lat: -7.5756, lng: 110.8244, radius: 0.03 },
    'Yogyakarta': { lat: -7.7956, lng: 110.3695, radius: 0.04 },
    'Magelang': { lat: -7.4698, lng: 110.2177, radius: 0.03 },
    'Pekalongan': { lat: -6.8886, lng: 109.6753, radius: 0.02 },
    'Tegal': { lat: -6.8694, lng: 109.1402, radius: 0.02 },
    'Salatiga': { lat: -7.3318, lng: 110.4969, radius: 0.02 },
    'Surakarta': { lat: -7.5756, lng: 110.8244, radius: 0.03 },
    'Klaten': { lat: -7.7058, lng: 110.6061, radius: 0.03 },
    'Boyolali': { lat: -7.5322, lng: 110.5939, radius: 0.03 }
  },
  'Jawa Timur': {
    'Surabaya': { lat: -7.2492, lng: 112.7508, radius: 0.06 },
    'Malang': { lat: -7.9797, lng: 112.6304, radius: 0.04 },
    'Kediri': { lat: -7.8167, lng: 112.0178, radius: 0.03 },
    'Blitar': { lat: -8.0983, lng: 112.1681, radius: 0.03 },
    'Mojokerto': { lat: -7.4664, lng: 112.4338, radius: 0.02 },
    'Pasuruan': { lat: -7.6453, lng: 112.9075, radius: 0.03 },
    'Probolinggo': { lat: -7.7543, lng: 113.2159, radius: 0.03 },
    'Madiun': { lat: -7.6298, lng: 111.5239, radius: 0.03 },
    'Batu': { lat: -7.8700, lng: 112.5300, radius: 0.02 },
    'Jember': { lat: -8.1844, lng: 113.7002, radius: 0.04 }
  },
  'Sumatera Utara': {
    'Medan': { lat: 3.5952, lng: 98.6722, radius: 0.08 },
    'Binjai': { lat: 3.6000, lng: 98.4847, radius: 0.02 },
    'Tebing Tinggi': { lat: 3.3281, lng: 99.1625, radius: 0.02 },
    'Pematangsiantar': { lat: 2.9592, lng: 99.0686, radius: 0.03 },
    'Tanjungbalai': { lat: 2.9650, lng: 99.7972, radius: 0.02 },
    'Sibolga': { lat: 1.7425, lng: 98.7792, radius: 0.02 },
    'Padangsidimpuan': { lat: 1.3800, lng: 99.2672, radius: 0.02 },
    'Gunungsitoli': { lat: 1.2881, lng: 97.6117, radius: 0.02 }
  },
  'Sumatera Barat': {
    'Padang': { lat: -0.9492, lng: 100.3543, radius: 0.05 },
    'Bukittinggi': { lat: -0.3053, lng: 100.3692, radius: 0.02 },
    'Padangpanjang': { lat: -0.4614, lng: 100.4081, radius: 0.01 },
    'Payakumbuh': { lat: -0.2297, lng: 100.6333, radius: 0.02 },
    'Pariaman': { lat: -0.6189, lng: 100.1197, radius: 0.02 },
    'Sawahlunto': { lat: -0.6800, lng: 100.7800, radius: 0.02 },
    'Solok': { lat: -0.7917, lng: 100.6561, radius: 0.02 },
    'Sijunjung': { lat: -0.6847, lng: 101.0181, radius: 0.03 }
  },
  'Sumatera Selatan': {
    'Palembang': { lat: -2.9761, lng: 104.7754, radius: 0.06 },
    'Prabumulih': { lat: -3.4358, lng: 104.2394, radius: 0.02 },
    'Pagar Alam': { lat: -4.0422, lng: 103.2631, radius: 0.02 },
    'Lubuklinggau': { lat: -3.3044, lng: 102.8614, radius: 0.02 },
    'Ogan Komering Ulu': { lat: -4.8497, lng: 103.7606, radius: 0.05 },
    'Muara Enim': { lat: -3.6053, lng: 103.9372, radius: 0.04 },
    'Lahat': { lat: -3.7958, lng: 103.5436, radius: 0.04 }
  },
  'Kalimantan Timur': {
    'Samarinda': { lat: -0.5017, lng: 117.1536, radius: 0.05 },
    'Balikpapan': { lat: -1.2379, lng: 116.8289, radius: 0.04 },
    'Bontang': { lat: 0.1322, lng: 117.4992, radius: 0.02 },
    'Kutai Kartanegara': { lat: -0.7233, lng: 116.9831, radius: 0.08 },
    'Kutai Timur': { lat: 0.5417, lng: 117.6031, radius: 0.06 },
    'Berau': { lat: 2.0139, lng: 117.3686, radius: 0.05 },
    'Paser': { lat: -1.7425, lng: 116.2214, radius: 0.04 }
  },
  'Kalimantan Selatan': {
    'Banjarmasin': { lat: -3.3194, lng: 114.5906, radius: 0.04 },
    'Banjarbaru': { lat: -3.4442, lng: 114.7675, radius: 0.03 },
    'Kotabaru': { lat: -4.0333, lng: 116.1667, radius: 0.04 },
    'Banjar': { lat: -3.3194, lng: 115.1406, radius: 0.05 },
    'Barito Kuala': { lat: -3.2681, lng: 114.6411, radius: 0.06 },
    'Tapin': { lat: -2.9167, lng: 115.1333, radius: 0.04 },
    'Hulu Sungai Selatan': { lat: -2.6000, lng: 115.2167, radius: 0.05 }
  },
  'Sulawesi Selatan': {
    'Makassar': { lat: -5.1477, lng: 119.4327, radius: 0.06 },
    'Parepare': { lat: -4.0133, lng: 119.6289, radius: 0.02 },
    'Palopo': { lat: -2.9900, lng: 120.1986, radius: 0.02 },
    'Gowa': { lat: -5.3106, lng: 119.4417, radius: 0.04 },
    'Takalar': { lat: -5.4097, lng: 119.4711, radius: 0.03 },
    'Jeneponto': { lat: -5.6406, lng: 119.7375, radius: 0.03 },
    'Bantaeng': { lat: -5.5161, lng: 120.0222, radius: 0.02 },
    'Bulukumba': { lat: -5.3942, lng: 120.1883, radius: 0.03 }
  },
  'Sulawesi Utara': {
    'Manado': { lat: 1.4748, lng: 124.8421, radius: 0.04 },
    'Bitung': { lat: 1.4405, lng: 125.1222, radius: 0.03 },
    'Tomohon': { lat: 1.3317, lng: 124.8369, radius: 0.02 },
    'Kotamobagu': { lat: 0.7267, lng: 124.3183, radius: 0.02 },
    'Minahasa': { lat: 1.3000, lng: 124.9000, radius: 0.05 },
    'Minahasa Utara': { lat: 1.5700, lng: 125.0000, radius: 0.04 },
    'Minahasa Selatan': { lat: 1.2000, lng: 124.8000, radius: 0.04 }
  },
  'Papua': {
    'Jayapura': { lat: -2.5317, lng: 140.7186, radius: 0.04 },
    'Sorong': { lat: -0.8833, lng: 131.2500, radius: 0.03 },
    'Merauke': { lat: -8.4667, lng: 140.4000, radius: 0.03 },
    'Nabire': { lat: -3.3667, lng: 135.5000, radius: 0.03 },
    'Timika': { lat: -4.5333, lng: 136.8833, radius: 0.03 },
    'Biak': { lat: -1.1667, lng: 136.1000, radius: 0.02 },
    'Wamena': { lat: -4.1000, lng: 138.9500, radius: 0.02 },
    'Sentani': { lat: -2.5833, lng: 140.5167, radius: 0.02 }
  },
  'Bali': {
    'Denpasar': { lat: -8.6500, lng: 115.2167, radius: 0.04 },
    'Badung': { lat: -8.5506, lng: 115.1764, radius: 0.05 },
    'Gianyar': { lat: -8.5417, lng: 115.3278, radius: 0.04 },
    'Tabanan': { lat: -8.5389, lng: 115.1194, radius: 0.04 },
    'Klungkung': { lat: -8.5333, lng: 115.4000, radius: 0.03 },
    'Bangli': { lat: -8.3000, lng: 115.3500, radius: 0.03 },
    'Karangasem': { lat: -8.4500, lng: 115.6167, radius: 0.04 },
    'Buleleng': { lat: -8.1167, lng: 115.0833, radius: 0.06 },
    'Jembrana': { lat: -8.3500, lng: 114.6667, radius: 0.04 }
  },
  'Nusa Tenggara Barat': {
    'Mataram': { lat: -8.5833, lng: 116.1167, radius: 0.03 },
    'Bima': { lat: -8.4667, lng: 118.7167, radius: 0.03 },
    'Dompu': { lat: -8.5333, lng: 118.4667, radius: 0.03 },
    'Lombok Barat': { lat: -8.6500, lng: 116.1000, radius: 0.04 },
    'Lombok Tengah': { lat: -8.7000, lng: 116.2700, radius: 0.04 },
    'Lombok Timur': { lat: -8.5500, lng: 116.5200, radius: 0.04 },
    'Lombok Utara': { lat: -8.3500, lng: 116.4000, radius: 0.03 },
    'Sumbawa': { lat: -8.6667, lng: 117.4167, radius: 0.06 }
  },
  'Nusa Tenggara Timur': {
    'Kupang': { lat: -10.1717, lng: 123.6075, radius: 0.04 },
    'Ende': { lat: -8.8500, lng: 121.6600, radius: 0.03 },
    'Maumere': { lat: -8.6167, lng: 122.2100, radius: 0.02 },
    'Atambua': { lat: -9.1000, lng: 124.8900, radius: 0.02 },
    'Kefamenanu': { lat: -9.4500, lng: 124.4700, radius: 0.02 },
    'Soe': { lat: -9.8600, lng: 124.2800, radius: 0.02 },
    'Ruteng': { lat: -8.6100, lng: 120.4600, radius: 0.02 },
    'Bajawa': { lat: -8.8000, lng: 121.0600, radius: 0.02 }
  }
};

// Generate coordinates within a city/kabupaten with realistic radius
export function generateAccurateCoordinates(provinsi: string, kabupaten: string): { latitude: number; longitude: number } {
  const provinsiData = INDONESIA_COORDINATES[provinsi as keyof typeof INDONESIA_COORDINATES];
  
  if (!provinsiData) {
    // Fallback to general Indonesia coordinates (but still on land)
    return {
      latitude: faker.number.float({ min: -8.5, max: 5.5, fractionDigits: 6 }),
      longitude: faker.number.float({ min: 95.5, max: 140.5, fractionDigits: 6 })
    };
  }
  
  const kabupatenData = (provinsiData as any)[kabupaten];
  
  if (!kabupatenData) {
    // Use first city in province as fallback
    const firstCity = Object.values(provinsiData)[0] as any;
    return generateWithinRadius(firstCity.lat, firstCity.lng, firstCity.radius);
  }
  
  return generateWithinRadius(kabupatenData.lat, kabupatenData.lng, kabupatenData.radius);
}

// Generate random point within radius (in decimal degrees)
function generateWithinRadius(centerLat: number, centerLng: number, radius: number): { latitude: number; longitude: number } {
  // Generate random angle and distance
  const angle = faker.number.float({ min: 0, max: 2 * Math.PI });
  const distance = faker.number.float({ min: 0, max: radius });
  
  // Calculate new coordinates
  const latitude = centerLat + (distance * Math.cos(angle));
  const longitude = centerLng + (distance * Math.sin(angle));
  
  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6))
  };
}

// Get list of districts/kecamatan for more realistic addresses
export const KECAMATAN_DATA = {
  'DKI Jakarta': {
    'Jakarta Pusat': ['Gambir', 'Sawah Besar', 'Kemayoran', 'Senen', 'Cempaka Putih', 'Johar Baru', 'Tanah Abang', 'Menteng'],
    'Jakarta Utara': ['Penjaringan', 'Pademangan', 'Tanjung Priok', 'Koja', 'Kelapa Gading', 'Cilincing'],
    'Jakarta Selatan': ['Kebayoran Baru', 'Kebayoran Lama', 'Pesanggrahan', 'Cilandak', 'Pasar Minggu', 'Jagakarsa', 'Mampang Prapatan', 'Pancoran', 'Tebet', 'Setiabudi'],
    'Jakarta Timur': ['Matraman', 'Pulogadung', 'Jatinegara', 'Cakung', 'Duren Sawit', 'Kramat Jati', 'Makasar', 'Pasar Rebo', 'Ciracas', 'Cipayung'],
    'Jakarta Barat': ['Kembangan', 'Kebon Jeruk', 'Palmerah', 'Grogol Petamburan', 'Tambora', 'Taman Sari', 'Cengkareng', 'Kalideres']
  },
  'Jawa Barat': {
    'Bandung': ['Sukasari', 'Coblong', 'Cidadap', 'Bandung Wetan', 'Sumur Bandung', 'Andir', 'Cicendo', 'Bandung Kulon', 'Bojongloa Kidul', 'Bojongloa Kaler'],
    'Bogor': ['Bogor Selatan', 'Bogor Timur', 'Bogor Utara', 'Bogor Tengah', 'Bogor Barat', 'Tanah Sareal'],
    'Bekasi': ['Bekasi Barat', 'Bekasi Selatan', 'Bekasi Timur', 'Bekasi Utara', 'Bantargebang', 'Medan Satria', 'Mustika Jaya', 'Pondok Gede', 'Pondok Melati', 'Rawalumbu', 'Jati Asih', 'Jati Sampurna']
  },
  'Jawa Tengah': {
    'Semarang': ['Semarang Tengah', 'Semarang Utara', 'Semarang Timur', 'Gayamsari', 'Genuk', 'Pedurungan', 'Semarang Selatan', 'Candisari', 'Gajahmungkur', 'Tembalang', 'Banyumanik', 'Gunungpati', 'Semarang Barat', 'Mijen', 'Ngaliyan', 'Tugu'],
    'Solo': ['Laweyan', 'Serengan', 'Pasarkliwon', 'Jebres', 'Banjarsari'],
    'Yogyakarta': ['Gondokusuman', 'Jetis', 'Tegalrejo', 'Umbulharjo', 'Kotagede', 'Mergangsan', 'Bantul', 'Kasihan', 'Sewon', 'Banguntapan']
  }
  // Add more as needed...
};

// Generate realistic kecamatan
export function getRandomKecamatan(provinsi: string, kabupaten: string): string {
  const provinsiData = KECAMATAN_DATA[provinsi as keyof typeof KECAMATAN_DATA];
  if (!provinsiData) return 'Kecamatan Central';
  
  const kabupatenData = (provinsiData as any)[kabupaten];
  if (!kabupatenData || !Array.isArray(kabupatenData) || kabupatenData.length === 0) return 'Kecamatan Central';
  
  return faker.helpers.arrayElement(kabupatenData);
}

export default {
  generateAccurateCoordinates,
  getRandomKecamatan,
  INDONESIA_COORDINATES,
  KECAMATAN_DATA
};