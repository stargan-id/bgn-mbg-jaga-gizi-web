import { generateSppgData } from './seeders/sppg-generator';

// Test the updated generator with accurate coordinates
console.log('🧪 Testing updated SPPG generator with accurate coordinates...\n');

// Generate 10 test SPPG to verify coordinates
const testSppg = generateSppgData('test-org-id', 10);

console.log('📍 Sample SPPG with coordinates:');
testSppg.slice(0, 5).forEach((sppg, index) => {
  console.log(`\n${index + 1}. ${sppg.nama}`);
  console.log(`   📍 Address: ${sppg.alamat}`);
  console.log(`   📞 Contact: ${sppg.kontak}`);
  console.log(`   🗺️  Coordinates: ${sppg.latitude}, ${sppg.longitude}`);
  console.log(`   👥 Capacity: ${sppg.kapasitasProduksi} porsi`);
  console.log(`   ✅ Status: ${sppg.statusVerifikasi}`);
});

console.log('\n✅ Test completed!');