import { db } from '@/lib/db';

async function verifySeedingResults() {
  console.log('🔍 Verifying seeding results...\n');
  
  try {
    // Count total SPPG
    const totalSppg = await db.sppg.count();
    console.log(`📊 Total SPPG: ${totalSppg}`);
    
    // Count by status
    const statusCounts = await db.sppg.groupBy({
      by: ['statusVerifikasi'],
      _count: {
        statusVerifikasi: true
      }
    });
    
    console.log('\n📈 SPPG by Status:');
    statusCounts.forEach(status => {
      console.log(`   ${status.statusVerifikasi}: ${status._count.statusVerifikasi}`);
    });
    
    // Count by organization
    const orgCounts = await db.sppg.groupBy({
      by: ['organisasiId'],
      _count: {
        organisasiId: true
      },
      orderBy: {
        _count: {
          organisasiId: 'desc'
        }
      }
    });
    
    console.log('\n🏢 SPPG by Organization:');
    for (const orgCount of orgCounts) {
      const org = await db.organisasi.findUnique({
        where: { id: orgCount.organisasiId },
        select: { nama: true }
      });
      console.log(`   ${org?.nama}: ${orgCount._count.organisasiId}`);
    }
    
    // Sample SPPG data
    const sampleSppg = await db.sppg.findMany({
      take: 5,
      select: {
        nama: true,
        alamat: true,
        kontak: true,
        kapasitasProduksi: true,
        statusVerifikasi: true,
        organisasi: {
          select: { nama: true }
        }
      }
    });
    
    console.log('\n📋 Sample SPPG Data:');
    sampleSppg.forEach((sppg, index) => {
      console.log(`\n   ${index + 1}. ${sppg.nama}`);
      console.log(`      📍 ${sppg.alamat}`);
      console.log(`      📞 ${sppg.kontak}`);
      console.log(`      👥 Kapasitas: ${sppg.kapasitasProduksi} porsi`);
      console.log(`      ✅ Status: ${sppg.statusVerifikasi}`);
      console.log(`      🏢 Organisasi: ${sppg.organisasi.nama}`);
    });
    
    // Capacity statistics
    const capacityStats = await db.sppg.aggregate({
      _avg: { kapasitasProduksi: true },
      _min: { kapasitasProduksi: true },
      _max: { kapasitasProduksi: true },
      _sum: { kapasitasProduksi: true }
    });
    
    console.log('\n📊 Capacity Statistics:');
    console.log(`   Average: ${Math.round(capacityStats._avg.kapasitasProduksi || 0)} porsi`);
    console.log(`   Minimum: ${capacityStats._min.kapasitasProduksi} porsi`);
    console.log(`   Maximum: ${capacityStats._max.kapasitasProduksi} porsi`);
    console.log(`   Total: ${capacityStats._sum.kapasitasProduksi?.toLocaleString()} porsi`);
    
    // Geographic distribution (sample coordinates)
    const geoSample = await db.sppg.findMany({
      take: 10,
      select: {
        nama: true,
        latitude: true,
        longitude: true
      },
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } }
        ]
      }
    });
    
    console.log('\n🌏 Geographic Sample:');
    geoSample.forEach((sppg, index) => {
      console.log(`   ${index + 1}. ${sppg.nama}`);
      console.log(`      📍 ${sppg.latitude}, ${sppg.longitude}`);
    });
    
    console.log('\n✅ Verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await db.$disconnect();
  }
}

verifySeedingResults().catch(console.error);