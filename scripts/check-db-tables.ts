import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function checkTables() {
  try {
    // Query to get all table names from public schema
    const result = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log('📊 Tables found in database:');
    console.log(result.map(r => `  - ${r.tablename}`).join('\n'));
    console.log(`\n✅ Total: ${result.length} tables`);

    // Check for FAB specific tables
    const fabTables = ['asociaciones', 'users', 'atletas', 'entrenadores', 'jueces', 'eventos', 'pruebas', 'inscripciones', 'dorsales'];
    const foundFabTables = result.filter(r => fabTables.includes(r.tablename));

    if (foundFabTables.length > 0) {
      console.log('\n✅ FAB tables found:', foundFabTables.map(t => t.tablename).join(', '));
    } else {
      console.log('\n❌ No FAB tables found. Please execute prisma/migrations/00_fab_schema.sql in Supabase first.');
      console.log('See docs/database-setup.md for instructions.');
    }
  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
