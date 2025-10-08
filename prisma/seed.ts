import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { 
  StatusAktif, 
  StatusVerifikasi, 
  JenisDokumen, 
  StatusDokumen, 
  StatusChecklist,
  JenisPemasok,
  JenisBahan,
  KondisiBahan,
  StatusAkg
} from '@prisma/client';
import { generateSppgData, insertSppgBatch } from './seeders/sppg-generator';


async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in proper order (respecting foreign key constraints)
  console.log('🧹 Cleaning existing data...');

  // Delete data that references other tables first
  await db.laporanBahanBaku.deleteMany({});
  await db.checklistHarian.deleteMany({});
  await db.menuHarian.deleteMany({});
  await db.dokumenSppg.deleteMany({});
  await db.sppg.deleteMany({});
  await db.pemasok.deleteMany({});
  await db.standarAkg.deleteMany({});
  await db.userRole.deleteMany({});
  await db.rolePermission.deleteMany({});
  await db.roleExtension.deleteMany({});
  await db.userPreference.deleteMany({});
  await db.session.deleteMany({});
  await db.verificationToken.deleteMany({});
  await db.user.deleteMany({});
  await db.role.deleteMany({});
  await db.permission.deleteMany({});
  await db.organisasi.deleteMany({});

  // 1. Create Organizations
  console.log('🏢 Creating organizations...');

  const rootOrg = await db.organisasi.create({
    data: {
      nama: 'Kementerian Kesehatan RI',
      singkatan: 'KEMENKES',
      status: StatusAktif.AKTIF,
      tingkat: 1,
      createdBy: 'system',
    },
  });

  const dirjenOrg = await db.organisasi.create({
    data: {
      nama: 'Direktorat Jenderal Kesehatan Masyarakat',
      singkatan: 'DITJEN KESMAS',
      status: StatusAktif.AKTIF,
      tingkat: 2,
      indukOrganisasiId: rootOrg.id,
      createdBy: 'system',
    },
  });

  const dirGiziOrg = await db.organisasi.create({
    data: {
      nama: 'Direktorat Gizi dan Kesehatan Ibu Anak',
      singkatan: 'DIT GIZI KIA',
      status: StatusAktif.AKTIF,
      tingkat: 3,
      indukOrganisasiId: dirjenOrg.id,
      createdBy: 'system',
    },
  });

  const dinkesOrg = await db.organisasi.create({
    data: {
      nama: 'Dinas Kesehatan DKI Jakarta',
      singkatan: 'DINKES DKI',
      status: StatusAktif.AKTIF,
      tingkat: 3,
      indukOrganisasiId: rootOrg.id,
      createdBy: 'system',
    },
  });

  // 2. Create Permissions
  console.log('🔐 Creating permissions...');
  
  const permissions = [
    // User management
    { name: 'user.create', resource: 'user', action: 'create', description: 'Create new users' },
    { name: 'user.read', resource: 'user', action: 'read', description: 'View user information' },
    { name: 'user.update', resource: 'user', action: 'update', description: 'Update user information' },
    { name: 'user.delete', resource: 'user', action: 'delete', description: 'Delete users' },
    
    // Role management
    { name: 'role.create', resource: 'role', action: 'create', description: 'Create new roles' },
    { name: 'role.read', resource: 'role', action: 'read', description: 'View roles' },
    { name: 'role.update', resource: 'role', action: 'update', description: 'Update roles' },
    { name: 'role.delete', resource: 'role', action: 'delete', description: 'Delete roles' },
    
    // Permission management
    { name: 'permission.create', resource: 'permission', action: 'create', description: 'Create permissions' },
    { name: 'permission.read', resource: 'permission', action: 'read', description: 'View permissions' },
    { name: 'permission.update', resource: 'permission', action: 'update', description: 'Update permissions' },
    { name: 'permission.delete', resource: 'permission', action: 'delete', description: 'Delete permissions' },
    
    // Organization management
    { name: 'organization.create', resource: 'organization', action: 'create', description: 'Create organizations' },
    { name: 'organization.read', resource: 'organization', action: 'read', description: 'View organizations' },
    { name: 'organization.update', resource: 'organization', action: 'update', description: 'Update organizations' },
    { name: 'organization.delete', resource: 'organization', action: 'delete', description: 'Delete organizations' },
    
    // Dashboard access
    { name: 'dashboard.admin', resource: 'dashboard-admin', action: 'read', description: 'Access admin dashboard' },
    { name: 'dashboard.user', resource: 'dashboard-user', action: 'read', description: 'Access user dashboard' },

    // Nutrition data management
    { name: 'nutrition.create', resource: 'nutrition', action: 'create', description: 'Create nutrition data' },
    { name: 'nutrition.read', resource: 'nutrition', action: 'read', description: 'View nutrition data' },
    { name: 'nutrition.update', resource: 'nutrition', action: 'update', description: 'Update nutrition data' },
    { name: 'nutrition.delete', resource: 'nutrition', action: 'delete', description: 'Delete nutrition data' },
    
    // Reports
    { name: 'report.generate', resource: 'report', action: 'create', description: 'Generate reports' },
    { name: 'report.view', resource: 'report', action: 'read', description: 'View reports' },
    { name: 'report.export', resource: 'report', action: 'export', description: 'Export reports' },
  ];

  const createdPermissions = await Promise.all(
    permissions.map((permission) =>
      db.permission.create({
        data: {
          ...permission,
          createdBy: 'system',
        },
      })
    )
  );

  // 3. Create Roles
  console.log('👥 Creating roles...');
  
  const superAdminRole = await db.role.create({
    data: {
      name: 'Super Admin',
      description: 'Full system access and administration rights',
      createdBy: 'system',
    },
  });

  const adminRole = await db.role.create({
    data: {
      name: 'Admin',
      description: 'Administrative access with some restrictions',
      createdBy: 'system',
    },
  });

  const managerRole = await db.role.create({
    data: {
      name: 'Manager',
      description: 'Management level access for nutrition programs',
      createdBy: 'system',
    },
  });

  const operatorRole = await db.role.create({
    data: {
      name: 'Operator',
      description: 'Operational level access for data entry and viewing',
      createdBy: 'system',
    },
  });

  const userRole = await db.role.create({
    data: {
      name: 'User',
      description: 'Basic user access for viewing assigned data',
      createdBy: 'system',
    },
  });

  // 4. Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');
  
  // Super Admin - All permissions
  await Promise.all(
    createdPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Admin - Most permissions except super admin functions
  const adminPermissions = createdPermissions.filter(p => 
    !p.name.includes('permission') && !p.name.includes('role.delete')
  );
  await Promise.all(
    adminPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Manager - Data management and reports
  const managerPermissions = createdPermissions.filter(p => 
    p.name.includes('nutrition') || 
    p.name.includes('report') || 
    p.name.includes('organization.read') ||
    p.name.includes('user.read') ||
    p.name.includes('dashboard')
  );
  await Promise.all(
    managerPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Operator - Basic CRUD for nutrition data
  const operatorPermissions = createdPermissions.filter(p => 
    p.name.includes('nutrition') || 
    p.name.includes('report.view') ||
    p.name.includes('dashboard.user') ||
    p.name.includes('organization.read')
  );
  await Promise.all(
    operatorPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: operatorRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // User - Read only access
  const readOnlyPermissions = createdPermissions.filter(p => 
    p.action === 'read' && (
      p.name.includes('nutrition.read') || 
      p.name.includes('report.view') ||
      p.name.includes('dashboard.user')
    )
  );
  await Promise.all(
    readOnlyPermissions.map((permission) =>
      db.rolePermission.create({
        data: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // 5. Create Users
  console.log('👤 Creating users...');
  
  const hashedPassword = await bcrypt.hash('Admin@123!', 12);
  
  const superAdmin = await db.user.create({
    data: {
      name: 'Super Administrator',
      email: 'superadmin@jagagizi.stargan.id',
      password: hashedPassword,
      organisasiId: rootOrg.id,
      createdBy: 'system',
    },
  });

  const admin = await db.user.create({
    data: {
      name: 'Administrator Gizi',
      email: 'admin@jagagizi.stargan.id',
      password: hashedPassword,
      organisasiId: dirGiziOrg.id,
      createdBy: 'system',
    },
  });

  const manager = await db.user.create({
    data: {
      name: 'Manager Program Gizi',
      email: 'manager@jagagizi.stargan.id',
      password: hashedPassword,
      organisasiId: dirGiziOrg.id,
      createdBy: 'system',
    },
  });

  const operator = await db.user.create({
    data: {
      name: 'Operator Data Gizi',
      email: 'operator@jagagizi.stargan.id',
      password: hashedPassword,
      organisasiId: dinkesOrg.id,
      createdBy: 'system',
    },
  });

  const regularUser = await db.user.create({
    data: {
      name: 'Petugas Gizi Puskesmas',
      email: 'user@jagagizi.stargan.id',
      password: hashedPassword,
      organisasiId: dinkesOrg.id,
      createdBy: 'system',
    },
  });

  // 6. Assign roles to users
  console.log('🎭 Assigning roles to users...');
  
  await db.userRole.create({
    data: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: manager.id,
      roleId: managerRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: operator.id,
      roleId: operatorRole.id,
    },
  });

  await db.userRole.create({
    data: {
      userId: regularUser.id,
      roleId: userRole.id,
    },
  });

  // 7. Create user preferences
  console.log('⚙️ Creating user preferences...');
  
  const userPreferences = [
    {
      id: superAdmin.id,
      tema: 'dark',
      bahasa: 'id',
      detil: {
        sidebar: 'expanded',
        notifications: true,
        autoSave: true,
      },
    },
    {
      id: admin.id,
      tema: 'light',
      bahasa: 'id',
      detil: {
        sidebar: 'collapsed',
        notifications: true,
        autoSave: false,
      },
    },
    {
      id: manager.id,
      tema: 'light',
      bahasa: 'id',
      detil: {
        sidebar: 'expanded',
        notifications: false,
        autoSave: true,
      },
    },
    {
      id: operator.id,
      tema: 'system',
      bahasa: 'id',
      detil: {
        sidebar: 'collapsed',
        notifications: true,
        autoSave: true,
      },
    },
    {
      id: regularUser.id,
      tema: 'light',
      bahasa: 'id',
      detil: {
        sidebar: 'auto',
        notifications: false,
        autoSave: false,
      },
    },
  ];

  await Promise.all(
    userPreferences.map((pref) =>
      db.userPreference.create({
        data: pref,
      })
    )
  );

  // ========================================
  // CORE APPLICATION SEEDING (JAGA GIZI)
  // ========================================

  console.log('🏥 Creating SPPG core data...');

  // Clear existing core data
  await db.komponenMenu.deleteMany({});
  await db.menuHarian.deleteMany({});
  await db.laporanBahanBaku.deleteMany({});
  await db.checklistHarian.deleteMany({});
  await db.dokumenSppg.deleteMany({});
  await db.sppg.deleteMany({});
  await db.pemasok.deleteMany({});
  await db.standarAkg.deleteMany({});

  // Create additional regional organizations for SPPG
  const provinsiOrgs = await Promise.all([
    db.organisasi.create({
      data: {
        nama: 'Dinas Pendidikan DKI Jakarta',
        singkatan: 'DISDIK DKI',
        status: StatusAktif.AKTIF,
        tingkat: 4,
        indukOrganisasiId: dinkesOrg.id,
        createdBy: 'system',
      },
    }),
    db.organisasi.create({
      data: {
        nama: 'Dinas Pendidikan Jawa Timur',
        singkatan: 'DISDIK JATIM',
        status: StatusAktif.AKTIF,
        tingkat: 4,
        indukOrganisasiId: rootOrg.id,
        createdBy: 'system',
      },
    }),
    db.organisasi.create({
      data: {
        nama: 'Dinas Pendidikan Jawa Barat',
        singkatan: 'DISDIK JABAR',
        status: StatusAktif.AKTIF,
        tingkat: 4,
        indukOrganisasiId: rootOrg.id,
        createdBy: 'system',
      },
    }),
    db.organisasi.create({
      data: {
        nama: 'Dinas Pendidikan Sulawesi Selatan',
        singkatan: 'DISDIK SULSEL',
        status: StatusAktif.AKTIF,
        tingkat: 4,
        indukOrganisasiId: rootOrg.id,
        createdBy: 'system',
      },
    }),
    db.organisasi.create({
      data: {
        nama: 'Dinas Pendidikan Sumatera Utara',
        singkatan: 'DISDIK SUMUT',
        status: StatusAktif.AKTIF,
        tingkat: 4,
        indukOrganisasiId: rootOrg.id,
        createdBy: 'system',
      },
    }),
  ]);

  // Create Standar AKG
  console.log('📊 Creating AKG standards...');
  const standarAkgData = [
    {
      kelompokUsia: 'Balita 1-3 tahun',
      minKalori: 1125,
      maxKalori: 1350,
      minProtein: 26,
      minKarbohidrat: 155,
      minLemak: 44,
      deskripsi: 'Standar AKG untuk balita usia 1-3 tahun',
      createdBy: 'system'
    },
    {
      kelompokUsia: 'Anak 4-6 tahun',
      minKalori: 1400,
      maxKalori: 1700,
      minProtein: 35,
      minKarbohidrat: 200,
      minLemak: 62,
      deskripsi: 'Standar AKG untuk anak usia 4-6 tahun',
      createdBy: 'system'
    },
    {
      kelompokUsia: 'Anak 7-9 tahun',
      minKalori: 1650,
      maxKalori: 2000,
      minProtein: 49,
      minKarbohidrat: 254,
      minLemak: 74,
      deskripsi: 'Standar AKG untuk anak usia 7-9 tahun',
      createdBy: 'system'
    },
    {
      kelompokUsia: 'Remaja 10-12 tahun',
      minKalori: 2000,
      maxKalori: 2400,
      minProtein: 56,
      minKarbohidrat: 289,
      minLemak: 89,
      deskripsi: 'Standar AKG untuk remaja usia 10-12 tahun',
      createdBy: 'system'
    }
  ];

  await Promise.all(
    standarAkgData.map((standar) =>
      db.standarAkg.create({ data: standar })
    )
  );

  // Create Pemasok
  console.log('🚚 Creating suppliers...');
  const pemasokData = [
    {
      nama: 'CV Sumber Protein Jakarta',
      alamat: 'Jl. Raya Pasar Minggu No. 45, Jakarta Selatan',
      kontak: '+62 21 7890123',
      jenisPemasok: JenisPemasok.DAGING,
      sertifikat: ['HALAL_MUI', 'HACCP'],
      createdBy: 'system'
    },
    {
      nama: 'UD Sayur Segar Nusantara',
      alamat: 'Jl. Veteran No. 67, Surabaya',
      kontak: '+62 31 5551234',
      jenisPemasok: JenisPemasok.SAYURAN,
      sertifikat: ['ORGANIK', 'GAP'],
      createdBy: 'system'
    },
    {
      nama: 'PT Beras Unggul Indonesia',
      alamat: 'Jl. Sudirman No. 89, Bandung',
      kontak: '+62 22 4445678',
      jenisPemasok: JenisPemasok.BERAS_BIJI,
      sertifikat: ['SNI', 'HALAL_MUI'],
      createdBy: 'system'
    },
    {
      nama: 'CV Ikan Segar Bahari',
      alamat: 'Jl. Pelabuhan No. 23, Makassar',
      kontak: '+62 411 8889012',
      jenisPemasok: JenisPemasok.IKAN,
      sertifikat: ['CPIB', 'HALAL_MUI'],
      createdBy: 'system'
    },
    {
      nama: 'UD Bumbu Rempah Nusantara',
      alamat: 'Jl. Pasar Besar No. 12, Medan',
      kontak: '+62 61 3334567',
      jenisPemasok: JenisPemasok.BUMBU_REMPAH,
      sertifikat: ['HALAL_MUI', 'SNI'],
      createdBy: 'system'
    }
  ];

  const pemasokList = await Promise.all(
    pemasokData.map((pemasok) =>
      db.pemasok.create({ data: pemasok })
    )
  );

  // Create SPPG with coordinates - Generate 1000 SPPG using Faker
  console.log('🏢 Creating 1000 SPPG locations...');
  
  // Distribute SPPG across all provincial organizations
  const totalSppg = 1000;
  const sppgPerOrg = Math.floor(totalSppg / provinsiOrgs.length);
  const remainder = totalSppg % provinsiOrgs.length;
  
  let allSppgData: any[] = [];
  
  for (let i = 0; i < provinsiOrgs.length; i++) {
    const orgId = provinsiOrgs[i].id;
    const count = i < remainder ? sppgPerOrg + 1 : sppgPerOrg;
    
    console.log(`   Generating ${count} SPPG for ${provinsiOrgs[i].nama}...`);
    const orgSppgData = generateSppgData(orgId, count);
    allSppgData = allSppgData.concat(orgSppgData);
  }
  
  // Insert all SPPG in batches for better performance
  await insertSppgBatch(db, allSppgData, 50);
  
  // Get all created SPPG for further processing
  const sppgList = await db.sppg.findMany({
    orderBy: { createdAt: 'asc' }
  });

  // Create sample documents for SPPG
  console.log('📋 Creating SPPG documents...');
  const dokumenSppgData = [];
  
  for (let i = 0; i < sppgList.length; i++) {
    const sppg = sppgList[i];
    // Add 2-3 documents per SPPG
    dokumenSppgData.push(
      {
        jenisDokumen: JenisDokumen.SLHS,
        namaDokumen: `SLHS ${sppg.nama}`,
        nomorDokumen: `SLHS/2024/${String(i + 1).padStart(3, '0')}`,
        tanggalTerbit: new Date('2024-01-15'),
        tanggalExpiry: new Date('2025-01-15'),
        filePath: `/documents/slhs/${sppg.id}_slhs.pdf`,
        statusDokumen: i % 2 === 0 ? StatusDokumen.APPROVED : StatusDokumen.PENDING,
        sppgId: sppg.id,
        createdBy: 'system'
      },
      {
        jenisDokumen: JenisDokumen.SERTIFIKAT_HALAL,
        namaDokumen: `Sertifikat Halal ${sppg.nama}`,
        nomorDokumen: `MUI/HM/2024/${String(i + 1).padStart(4, '0')}`,
        tanggalTerbit: new Date('2024-02-01'),
        tanggalExpiry: new Date('2026-02-01'),
        filePath: `/documents/halal/${sppg.id}_halal.pdf`,
        statusDokumen: StatusDokumen.APPROVED,
        sppgId: sppg.id,
        createdBy: 'system'
      }
    );
  }

  await Promise.all(
    dokumenSppgData.map((dokumen) =>
      db.dokumenSppg.create({ data: dokumen })
    )
  );

  // Create sample daily checklists
  console.log('✅ Creating daily checklists...');
  const checklistData = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) { // Last 5 days
    const tanggal = new Date(today);
    tanggal.setDate(today.getDate() - i);
    
    for (const sppg of sppgList.slice(0, 5)) { // First 5 SPPG
      checklistData.push({
        tanggal,
        kebersihanSdm: Math.random() > 0.1, // 90% true
        kebersihanInfrastruktur: Math.random() > 0.05, // 95% true  
        kondisiPeralatan: Math.random() > 0.15, // 85% true
        suhuPenyimpanan: 2 + Math.random() * 6, // 2-8°C
        catatan: i === 0 ? 'Semua kondisi baik dan sesuai standar' : null,
        fotoEvidence: [`/images/${sppg.id}_${tanggal.toISOString().split('T')[0]}_1.jpg`],
        skorKepatuhan: Math.floor(80 + Math.random() * 20), // 80-100
        status: Math.random() > 0.1 ? StatusChecklist.REVIEWED : StatusChecklist.SUBMITTED,
        sppgId: sppg.id,
        createdBy: 'system'
      });
    }
  }

  await Promise.all(
    checklistData.map((checklist) =>
      db.checklistHarian.create({ data: checklist })
    )
  );

  // Create sample supply reports
  console.log('📦 Creating supply reports...');
  const laporanBahanBakuData = [];
  
  for (let i = 0; i < 3; i++) { // Last 3 days
    const tanggal = new Date(today);
    tanggal.setDate(today.getDate() - i);
    
    for (const sppg of sppgList.slice(0, 3)) { // First 3 SPPG
      // Add 2-3 supply reports per SPPG per day
      laporanBahanBakuData.push(
        {
          tanggal,
          namaBahan: 'Beras Premium',
          jenisBahan: JenisBahan.KARBOHIDRAT,
          jumlah: 50 + Math.random() * 50, // 50-100kg
          satuan: 'kg',
          tanggalExpiry: new Date(tanggal.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
          kondisiBahan: KondisiBahan.BAIK,
          suhuPenerimaan: 25 + Math.random() * 5, // 25-30°C
          fotoEvidence: [`/images/${sppg.id}_beras_${tanggal.toISOString().split('T')[0]}.jpg`],
          catatan: 'Kualitas beras sesuai standar',
          sppgId: sppg.id,
          pemasokId: pemasokList[2].id, // PT Beras Unggul Indonesia
          createdBy: 'system'
        },
        {
          tanggal,
          namaBahan: 'Daging Ayam',
          jenisBahan: JenisBahan.PROTEIN_HEWANI,
          jumlah: 20 + Math.random() * 30, // 20-50kg
          satuan: 'kg',
          tanggalExpiry: new Date(tanggal.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
          kondisiBahan: KondisiBahan.BAIK,
          suhuPenerimaan: 2 + Math.random() * 2, // 2-4°C
          fotoEvidence: [`/images/${sppg.id}_ayam_${tanggal.toISOString().split('T')[0]}.jpg`],
          sppgId: sppg.id,
          pemasokId: pemasokList[0].id, // CV Sumber Protein Jakarta
          createdBy: 'system'
        }
      );
    }
  }

  await Promise.all(
    laporanBahanBakuData.map((laporan) =>
      db.laporanBahanBaku.create({ data: laporan })
    )
  );

  // Create sample daily menus
  console.log('🍽️ Creating daily menus...');
  const menuHarianData = [];
  
  for (let i = 0; i < 7; i++) { // Last 7 days
    const tanggal = new Date(today);
    tanggal.setDate(today.getDate() - i);
    
    for (const sppg of sppgList.slice(0, 4)) { // First 4 SPPG
      menuHarianData.push({
        tanggal,
        namaMenu: i % 2 === 0 ? 'Nasi Gudeg Ayam' : 'Nasi Rendang Daging',
        deskripsi: i % 2 === 0 ? 
          'Nasi putih dengan gudeg khas Yogyakarta, ayam opor, dan sayur lodeh' :
          'Nasi putih dengan rendang daging sapi, sayur bayam, dan kerupuk',
        porsiTarget: Math.floor(sppg.kapasitasProduksi * 0.8), // 80% of capacity
        kaloriPerPorsi: 450 + Math.random() * 100, // 450-550 kcal
        proteinPerPorsi: 15 + Math.random() * 10, // 15-25g
        karbohidratPerPorsi: 60 + Math.random() * 20, // 60-80g
        lemakPerPorsi: 12 + Math.random() * 8, // 12-20g
        statusAkg: (() => {
          const rand = Math.random();
          if (rand > 0.7) return StatusAkg.MEMENUHI; // 30%
          if (rand > 0.4) return StatusAkg.HAMPIR_MEMENUHI; // 30%
          if (rand > 0.1) return StatusAkg.TIDAK_MEMENUHI; // 30%
          return StatusAkg.BELUM_DIEVALUASI; // 10%
        })(),
        catatanGizi: 'Menu memenuhi standar AKG untuk anak usia sekolah',
        biayaPerPorsi: 8000 + Math.random() * 4000, // Rp 8,000-12,000
        fotoMenu: [`/images/${sppg.id}_menu_${tanggal.toISOString().split('T')[0]}.jpg`],
        sppgId: sppg.id,
        createdBy: 'system'
      });
    }
  }

  const menuHarianList = await Promise.all(
    menuHarianData.map((menu) =>
      db.menuHarian.create({ data: menu })
    )
  );

  // Create menu components
  console.log('🥘 Creating menu components...');
  const komponenMenuData = [];
  
  for (const menu of menuHarianList) {
    if (menu.namaMenu.includes('Gudeg')) {
      komponenMenuData.push(
        {
          namaBahan: 'Nasi Putih',
          jumlah: 150,
          satuan: 'gram',
          kaloriPer100g: 130,
          proteinPer100g: 2.7,
          karbohidratPer100g: 28,
          lemakPer100g: 0.3,
          menuHarianId: menu.id
        },
        {
          namaBahan: 'Gudeg Nangka',
          jumlah: 100,
          satuan: 'gram',
          kaloriPer100g: 150,
          proteinPer100g: 3,
          karbohidratPer100g: 25,
          lemakPer100g: 5,
          menuHarianId: menu.id
        },
        {
          namaBahan: 'Ayam Opor',
          jumlah: 80,
          satuan: 'gram',
          kaloriPer100g: 200,
          proteinPer100g: 18,
          karbohidratPer100g: 2,
          lemakPer100g: 14,
          menuHarianId: menu.id
        }
      );
    } else {
      komponenMenuData.push(
        {
          namaBahan: 'Nasi Putih',
          jumlah: 150,
          satuan: 'gram',
          kaloriPer100g: 130,
          proteinPer100g: 2.7,
          karbohidratPer100g: 28,
          lemakPer100g: 0.3,
          menuHarianId: menu.id
        },
        {
          namaBahan: 'Rendang Daging',
          jumlah: 100,
          satuan: 'gram',
          kaloriPer100g: 220,
          proteinPer100g: 16,
          karbohidratPer100g: 8,
          lemakPer100g: 15,
          menuHarianId: menu.id
        },
        {
          namaBahan: 'Sayur Bayam',
          jumlah: 60,
          satuan: 'gram',
          kaloriPer100g: 23,
          proteinPer100g: 2.9,
          karbohidratPer100g: 3.6,
          lemakPer100g: 0.4,
          menuHarianId: menu.id
        }
      );
    }
  }

  await Promise.all(
    komponenMenuData.map((komponen) =>
      db.komponenMenu.create({ data: komponen })
    )
  );

  console.log('✅ Core application seeding completed!');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📋 Created:');
  console.log(`   • ${await db.organisasi.count()} Organizations`);
  console.log(`   • ${await db.permission.count()} Permissions`);
  console.log(`   • ${await db.role.count()} Roles`);
  console.log(`   • ${await db.user.count()} Users`);
  console.log(`   • ${await db.rolePermission.count()} Role-Permission assignments`);
  console.log(`   • ${await db.userRole.count()} User-Role assignments`);
  console.log(`   • ${await db.userPreference.count()} User preferences`);
  
  console.log('\n👤 Default Users Created:');
  console.log('   • superadmin@jagagizi.stargan.id (Super Admin) - Password: Admin@123!');
  console.log('   • admin@jagagizi.stargan.id (Admin) - Password: Admin@123!');
  console.log('   • manager@jagagizi.stargan.id (Manager) - Password: Admin@123!');
  console.log('   • operator@jagagizi.stargan.id (Operator) - Password: Admin@123!');
  console.log('   • user@jagagizi.stargan.id (User) - Password: Admin@123!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });