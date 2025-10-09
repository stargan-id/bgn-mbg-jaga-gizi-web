import { faker } from '@faker-js/faker';
import { StatusVerifikasi } from '@prisma/client';
import { generateAccurateCoordinates, getRandomKecamatan } from './indonesia-coordinates';

// Indonesian provinces and their representative cities/kabupaten
const INDONESIAN_PROVINCES = [
  {
    nama: 'DKI Jakarta',
    kabupaten: ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Kepulauan Seribu']
  },
  {
    nama: 'Jawa Barat',
    kabupaten: ['Bandung', 'Bogor', 'Bekasi', 'Depok', 'Cimahi', 'Sukabumi', 'Cirebon', 'Garut', 'Tasikmalaya', 'Purwakarta']
  },
  {
    nama: 'Jawa Tengah',
    kabupaten: ['Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Pekalongan', 'Tegal', 'Salatiga', 'Surakarta', 'Klaten', 'Boyolali']
  },
  {
    nama: 'Jawa Timur',
    kabupaten: ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Madiun', 'Batu', 'Jember']
  },
  {
    nama: 'Sumatera Utara',
    kabupaten: ['Medan', 'Binjai', 'Tebing Tinggi', 'Pematangsiantar', 'Tanjungbalai', 'Sibolga', 'Padangsidimpuan', 'Gunungsitoli']
  },
  {
    nama: 'Sumatera Barat',
    kabupaten: ['Padang', 'Bukittinggi', 'Padangpanjang', 'Payakumbuh', 'Pariaman', 'Sawahlunto', 'Solok', 'Sijunjung']
  },
  {
    nama: 'Sumatera Selatan',
    kabupaten: ['Palembang', 'Prabumulih', 'Pagar Alam', 'Lubuklinggau', 'Ogan Komering Ulu', 'Muara Enim', 'Lahat']
  },
  {
    nama: 'Kalimantan Timur',
    kabupaten: ['Samarinda', 'Balikpapan', 'Bontang', 'Kutai Kartanegara', 'Kutai Timur', 'Berau', 'Paser']
  },
  {
    nama: 'Kalimantan Selatan',
    kabupaten: ['Banjarmasin', 'Banjarbaru', 'Kotabaru', 'Banjar', 'Barito Kuala', 'Tapin', 'Hulu Sungai Selatan']
  },
  {
    nama: 'Sulawesi Selatan',
    kabupaten: ['Makassar', 'Parepare', 'Palopo', 'Gowa', 'Takalar', 'Jeneponto', 'Bantaeng', 'Bulukumba']
  },
  {
    nama: 'Sulawesi Utara',
    kabupaten: ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu', 'Minahasa', 'Minahasa Utara', 'Minahasa Selatan']
  },
  {
    nama: 'Papua',
    kabupaten: ['Jayapura', 'Sorong', 'Merauke', 'Nabire', 'Timika', 'Biak', 'Wamena', 'Sentani']
  },
  {
    nama: 'Bali',
    kabupaten: ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Klungkung', 'Bangli', 'Karangasem', 'Buleleng', 'Jembrana']
  },
  {
    nama: 'Nusa Tenggara Barat',
    kabupaten: ['Mataram', 'Bima', 'Dompu', 'Lombok Barat', 'Lombok Tengah', 'Lombok Timur', 'Lombok Utara', 'Sumbawa']
  },
  {
    nama: 'Nusa Tenggara Timur',
    kabupaten: ['Kupang', 'Ende', 'Maumere', 'Atambua', 'Kefamenanu', 'Soe', 'Ruteng', 'Bajawa']
  }
];

// SPPG types based on Indonesian context
const SPPG_TYPES = [
  'TK/PAUD', 'SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK', 
  'Pesantren', 'Panti Asuhan', 'Rumah Sakit', 'Puskesmas',
  'Lansia', 'Balita', 'Ibu Hamil', 'Pekerja', 'Komunitas'
];

// Generate realistic Indonesian names for SPPG
function generateSppgName(type: string, kabupaten: string): string {
  const templates = {
    'TK/PAUD': [
      `TK Ceria ${kabupaten}`,
      `PAUD Bintang ${kabupaten}`,
      `TK Harapan Bangsa ${kabupaten}`,
      `PAUD Tunas Muda ${kabupaten}`
    ],
    'SD/MI': [
      `SDN ${faker.number.int({ min: 1, max: 50 })} ${kabupaten}`,
      `MI Al-Hidayah ${kabupaten}`,
      `SD Pancasila ${kabupaten}`,
      `MI Nurul Huda ${kabupaten}`
    ],
    'SMP/MTs': [
      `SMPN ${faker.number.int({ min: 1, max: 30 })} ${kabupaten}`,
      `MTs Al-Ikhlas ${kabupaten}`,
      `SMP Pembangunan ${kabupaten}`,
      `MTs Darul Ulum ${kabupaten}`
    ],
    'SMA/MA': [
      `SMAN ${faker.number.int({ min: 1, max: 20 })} ${kabupaten}`,
      `MA Darul Hikmah ${kabupaten}`,
      `SMA Negeri ${kabupaten}`,
      `MA Al-Falah ${kabupaten}`
    ],
    'SMK': [
      `SMKN ${faker.number.int({ min: 1, max: 15 })} ${kabupaten}`,
      `SMK Teknologi ${kabupaten}`,
      `SMK Bina Karya ${kabupaten}`,
      `SMK Mandiri ${kabupaten}`
    ],
    'Pesantren': [
      `Pesantren Al-Hidayah ${kabupaten}`,
      `Pondok Pesantren Darul Ulum ${kabupaten}`,
      `Pesantren Modern ${kabupaten}`,
      `Pondok Pesantren An-Nur ${kabupaten}`
    ],
    'Panti Asuhan': [
      `Panti Asuhan Kasih Ibu ${kabupaten}`,
      `Yayasan Anak Bangsa ${kabupaten}`,
      `Panti Sosial ${kabupaten}`,
      `Rumah Yatim ${kabupaten}`
    ],
    'Rumah Sakit': [
      `RS Umum ${kabupaten}`,
      `RSU Dr. ${faker.person.lastName()} ${kabupaten}`,
      `RS Islam ${kabupaten}`,
      `RSUD ${kabupaten}`
    ],
    'Puskesmas': [
      `Puskesmas ${kabupaten} I`,
      `Puskesmas ${kabupaten} II`,
      `Puskesmas Kecamatan ${kabupaten}`,
      `Puskesmas Rawat Inap ${kabupaten}`
    ],
    'Lansia': [
      `Panti Jompo ${kabupaten}`,
      `Wisma Lansia ${kabupaten}`,
      `Griya Wredha ${kabupaten}`,
      `Rumah Lansia ${kabupaten}`
    ],
    'Balita': [
      `Posyandu ${faker.lorem.word()} ${kabupaten}`,
      `Taman Bermain Anak ${kabupaten}`,
      `Daycare ${kabupaten}`,
      `TPA ${faker.lorem.word()} ${kabupaten}`
    ],
    'Ibu Hamil': [
      `Klinik Ibu dan Anak ${kabupaten}`,
      `Posyandu Ibu Hamil ${kabupaten}`,
      `Puskesmas KIA ${kabupaten}`,
      `Bidan Praktik Mandiri ${kabupaten}`
    ],
    'Pekerja': [
      `Kantin PT ${faker.company.name()}`,
      `Katering Karyawan ${kabupaten}`,
      `Resto Pekerja ${kabupaten}`,
      `Warung Buruh ${kabupaten}`
    ],
    'Komunitas': [
      `Dapur Umum ${kabupaten}`,
      `Katering Komunitas ${kabupaten}`,
      `Warung Gotong Royong ${kabupaten}`,
      `Dapur Bersama ${kabupaten}`
    ]
  };

  const options = templates[type as keyof typeof templates] || [`SPPG ${type} ${kabupaten}`];
  return faker.helpers.arrayElement(options);
}

// Generate realistic address with kecamatan
function generateAddress(provinsi: string, kabupaten: string): string {
  const jalan = [
    'Jl. Merdeka', 'Jl. Sudirman', 'Jl. Diponegoro', 'Jl. Ahmad Yani', 
    'Jl. Gatot Subroto', 'Jl. Veteran', 'Jl. Pahlawan', 'Jl. Kartini',
    'Jl. Hayam Wuruk', 'Jl. Imam Bonjol', 'Jl. Cendrawasih', 'Jl. Melati',
    'Jl. Dr. Wahidin', 'Jl. Cut Nyak Dien', 'Jl. HR. Rasuna Said', 'Jl. MT Haryono'
  ];
  
  const kelurahan = [
    'Kelurahan Central', 'Kelurahan Barat', 'Kelurahan Timur', 'Kelurahan Utara',
    'Kelurahan Selatan', 'Kelurahan Indah', 'Kelurahan Sejahtera', 'Kelurahan Makmur',
    'Kelurahan Mandiri', 'Kelurahan Harapan', 'Kelurahan Maju', 'Kelurahan Damai'
  ];
  
  const kecamatan = getRandomKecamatan(provinsi, kabupaten);

  return `${faker.helpers.arrayElement(jalan)} No. ${faker.number.int({ min: 1, max: 999 })}, ${faker.helpers.arrayElement(kelurahan)}, Kec. ${kecamatan}, ${kabupaten}`;
}

// Generate contact info (Indonesian phone format)
function generateContact(): string {
  const prefixes = ['0812', '0813', '0821', '0822', '0851', '0852', '0853'];
  const prefix = faker.helpers.arrayElement(prefixes);
  const number = faker.string.numeric(8);
  return `${prefix}-${number}`;
}

// This function is now replaced by generateAccurateCoordinates from indonesia-coordinates.ts

export interface SppgSeedData {
  nama: string;
  alamat: string;
  kontak: string;
  kapasitasProduksi: number;
  statusVerifikasi: StatusVerifikasi;
  longitude: number;
  latitude: number;
  organisasiId: string;
  createdBy: string;
}

export function generateSppgData(organisasiId: string, count: number = 1000): SppgSeedData[] {
  console.log(`🏢 Generating ${count} SPPG data...`);
  
  const sppgList: SppgSeedData[] = [];
  
  for (let i = 0; i < count; i++) {
    // Random province and kabupaten
    const province = faker.helpers.arrayElement(INDONESIAN_PROVINCES);
    const kabupaten = faker.helpers.arrayElement(province.kabupaten);
    const type = faker.helpers.arrayElement(SPPG_TYPES);
    
    // Generate accurate coordinates for specific kabupaten
    const coordinates = generateAccurateCoordinates(province.nama, kabupaten);
    
    // Generate capacity based on type
    let kapasitasProduksi: number;
    switch (type) {
      case 'TK/PAUD':
        kapasitasProduksi = faker.number.int({ min: 50, max: 200 });
        break;
      case 'SD/MI':
        kapasitasProduksi = faker.number.int({ min: 200, max: 800 });
        break;
      case 'SMP/MTs':
        kapasitasProduksi = faker.number.int({ min: 300, max: 1200 });
        break;
      case 'SMA/MA':
      case 'SMK':
        kapasitasProduksi = faker.number.int({ min: 400, max: 1500 });
        break;
      case 'Pesantren':
        kapasitasProduksi = faker.number.int({ min: 500, max: 2000 });
        break;
      case 'Rumah Sakit':
        kapasitasProduksi = faker.number.int({ min: 1000, max: 5000 });
        break;
      case 'Puskesmas':
        kapasitasProduksi = faker.number.int({ min: 200, max: 800 });
        break;
      case 'Lansia':
        kapasitasProduksi = faker.number.int({ min: 50, max: 300 });
        break;
      case 'Balita':
        kapasitasProduksi = faker.number.int({ min: 30, max: 150 });
        break;
      case 'Ibu Hamil':
        kapasitasProduksi = faker.number.int({ min: 20, max: 100 });
        break;
      case 'Pekerja':
        kapasitasProduksi = faker.number.int({ min: 100, max: 1000 });
        break;
      case 'Komunitas':
        kapasitasProduksi = faker.number.int({ min: 50, max: 500 });
        break;
      default:
        kapasitasProduksi = faker.number.int({ min: 100, max: 500 });
    }
    
    // Generate status with realistic distribution
    const statusDistribution = [
      StatusVerifikasi.APPROVED, // 60%
      StatusVerifikasi.APPROVED,
      StatusVerifikasi.APPROVED,
      StatusVerifikasi.UNDER_REVIEW, // 25%
      StatusVerifikasi.UNDER_REVIEW,
      StatusVerifikasi.DRAFT, // 10%
      StatusVerifikasi.REJECTED, // 4%
      StatusVerifikasi.SUSPENDED // 1%
    ];
    
    const sppg: SppgSeedData = {
      nama: generateSppgName(type, kabupaten),
      alamat: generateAddress(province.nama, kabupaten),
      kontak: generateContact(),
      kapasitasProduksi,
      statusVerifikasi: faker.helpers.arrayElement(statusDistribution),
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
      organisasiId,
      createdBy: 'seeder'
    };
    
    sppgList.push(sppg);
    
    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`   Generated ${i + 1}/${count} SPPG...`);
    }
  }
  
  console.log(`✅ Generated ${count} SPPG data successfully!`);
  return sppgList;
}

// Batch insert function for better performance
export async function insertSppgBatch(db: any, sppgData: SppgSeedData[], batchSize: number = 50) {
  console.log(`📥 Inserting ${sppgData.length} SPPG in batches of ${batchSize}...`);
  
  const totalBatches = Math.ceil(sppgData.length / batchSize);
  
  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, sppgData.length);
    const batch = sppgData.slice(start, end);
    
    try {
      await db.sppg.createMany({
        data: batch,
        skipDuplicates: true
      });
      
      console.log(`   Batch ${i + 1}/${totalBatches} inserted (${batch.length} records)`);
    } catch (error) {
      console.error(`❌ Error inserting batch ${i + 1}:`, error);
      throw error;
    }
  }
  
  console.log(`✅ All ${sppgData.length} SPPG inserted successfully!`);
}