import { PrismaClient, UserRole, InstitutionType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create a super admin user if it doesn't exist
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { username: 'superadmin' }
    });

    let superAdminUser;
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      superAdminUser = await prisma.user.create({
        data: {
          username: 'superadmin',
          password: hashedPassword,
          role: UserRole.SUPERADMIN,
          isActive: true,
        },
      });
      console.log('✅ Created super admin user');
    } else {
      superAdminUser = existingSuperAdmin;
      console.log('✅ Super admin user already exists');
    }

    // Create default municipalities if they don't exist
    const municipalities = [
      {
        id: 'municipality_1',
        name: 'Municipio de Cochabamba',
        department: 'Cochabamba',
        region: 'Valle',
        address: 'Plaza Principal 14 de Septiembre',
        website: 'https://cochabamba.gob.bo',
        phone: '+591 4 4222222',
        username: 'cochabamba_muni',
        email: 'info@cochabamba.gob.bo',
        password: await bcrypt.hash('cochabamba123', 10),
        institutionType: InstitutionType.MUNICIPALITY,
        primaryColor: '#1E40AF',
        secondaryColor: '#F59E0B',
        isActive: true,
        createdBy: superAdminUser.id,
      },
      {
        id: 'municipality_2',
        name: 'Municipio de La Paz',
        department: 'La Paz',
        region: 'Altiplano',
        address: 'Plaza Murillo',
        website: 'https://lapaz.gob.bo',
        phone: '+591 2 2200000',
        username: 'lapaz_muni',
        email: 'info@lapaz.gob.bo',
        password: await bcrypt.hash('lapaz123', 10),
        institutionType: InstitutionType.MUNICIPALITY,
        primaryColor: '#DC2626',
        secondaryColor: '#FCD34D',
        isActive: true,
        createdBy: superAdminUser.id,
      },
      {
        id: 'municipality_3',
        name: 'Municipio de Santa Cruz',
        department: 'Santa Cruz',
        region: 'Llanos',
        address: 'Plaza 24 de Septiembre',
        website: 'https://santacruz.gob.bo',
        phone: '+591 3 3300000',
        username: 'santacruz_muni',
        email: 'info@santacruz.gob.bo',
        password: await bcrypt.hash('santacruz123', 10),
        institutionType: InstitutionType.MUNICIPALITY,
        primaryColor: '#059669',
        secondaryColor: '#F59E0B',
        isActive: true,
        createdBy: superAdminUser.id,
      }
    ];

    for (const municipalityData of municipalities) {
      const existingMunicipality = await prisma.municipality.findUnique({
        where: { id: municipalityData.id }
      });

      if (!existingMunicipality) {
        await prisma.municipality.create({
          data: municipalityData
        });
        console.log(`✅ Created municipality: ${municipalityData.name}`);
      } else {
        console.log(`✅ Municipality already exists: ${municipalityData.name}`);
      }
    }

    console.log('🌱 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });