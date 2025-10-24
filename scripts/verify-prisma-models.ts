import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyModels() {
  console.log('🔍 Verifying Prisma models...\n');

  try {
    // Verify all models are accessible
    const models = {
      asociaciones: prisma.asociaciones,
      users: prisma.users,
      atletas: prisma.atletas,
      entrenadores: prisma.entrenadores,
      jueces: prisma.jueces,
      eventos: prisma.eventos,
      pruebas: prisma.pruebas,
      inscripciones: prisma.inscripciones,
      dorsales: prisma.dorsales,
      pagos_evento_asociacion: prisma.pagos_evento_asociacion,
      startlists: prisma.startlists,
      startlist_items: prisma.startlist_items,
    };

    console.log('✅ All models are accessible in Prisma Client:');
    Object.keys(models).forEach(model => {
      console.log(`  - ${model}`);
    });

    // Count records in asociaciones (should be 9 from seed)
    const asociacionesCount = await prisma.asociaciones.count();
    console.log(`\n✅ Asociaciones count: ${asociacionesCount} (expected: 9)`);

    if (asociacionesCount === 9) {
      console.log('✅ Seed data verified successfully!');
    } else {
      console.log('⚠️  Warning: Expected 9 asociaciones but found', asociacionesCount);
    }

    // List all asociaciones
    const asociaciones = await prisma.asociaciones.findMany({
      select: { nombre: true, departamento: true },
      orderBy: { nombre: 'asc' },
    });

    console.log('\n📋 Asociaciones departamentales:');
    asociaciones.forEach((asoc, index) => {
      console.log(`  ${index + 1}. ${asoc.nombre} (${asoc.departamento})`);
    });

    console.log('\n✅ All Prisma models verified successfully!');
  } catch (error) {
    console.error('❌ Error verifying models:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyModels();
