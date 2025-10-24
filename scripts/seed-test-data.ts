/**
 * Seed script for creating test data in development
 *
 * ⚠️ WARNING: DO NOT run this in production!
 *
 * This script creates sample data for testing and development:
 * - 3 admin_asociacion users (La Paz, Cochabamba, Santa Cruz)
 * - 15 atletas (distributed across categories and asociaciones)
 * - 3 entrenadores
 * - 2 jueces
 * - 2 eventos (1 federativo, 1 asociacion)
 * - Pruebas for each event
 * - Sample inscriptions
 *
 * Usage:
 *   pnpm tsx scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const prisma = new PrismaClient();

// Helper to create auth user and user record
async function createUser(email: string, password: string, rol: any, asociacionId: string, estado: any = 'activo') {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    throw new Error(`Failed to create auth user ${email}: ${authError?.message}`);
  }

  const user = await prisma.users.create({
    data: {
      user_id: authData.user.id,
      rol,
      estado,
      asociacion_id: asociacionId,
    },
  });

  return { authId: authData.user.id, user };
}

async function seedTestData() {
  console.log('='.repeat(60));
  console.log('🌱 Seeding Test Data for FAB System');
  console.log('='.repeat(60));
  console.log('⚠️  WARNING: This is for DEVELOPMENT only!');
  console.log('');

  try {
    // Get asociaciones
    const asociaciones = await prisma.asociaciones.findMany({ orderBy: { nombre: 'asc' } });
    if (asociaciones.length < 9) {
      throw new Error('Asociaciones not found. Run database schema first.');
    }

    const laPaz = asociaciones.find(a => a.nombre === 'La Paz')!;
    const cochabamba = asociaciones.find(a => a.nombre === 'Cochabamba')!;
    const santaCruz = asociaciones.find(a => a.nombre === 'Santa Cruz')!;
    const chuquisaca = asociaciones.find(a => a.nombre === 'Chuquisaca')!;

    console.log('✅ Found 9 asociaciones\n');

    // =============================================
    // 1. Create admin_asociacion users
    // =============================================
    console.log('👤 Creating admin_asociacion users...');

    const adminLaPaz = await createUser(
      'admin.lapaz@fab.bo',
      'password123',
      'admin_asociacion',
      laPaz.id,
      'activo'
    );
    console.log(`  ✅ admin_asociacion La Paz: ${adminLaPaz.authId}`);

    const adminCochabamba = await createUser(
      'admin.cochabamba@fab.bo',
      'password123',
      'admin_asociacion',
      cochabamba.id,
      'activo'
    );
    console.log(`  ✅ admin_asociacion Cochabamba: ${adminCochabamba.authId}`);

    const adminSantaCruz = await createUser(
      'admin.santacruz@fab.bo',
      'password123',
      'admin_asociacion',
      santaCruz.id,
      'activo'
    );
    console.log(`  ✅ admin_asociacion Santa Cruz: ${adminSantaCruz.authId}\n`);

    // =============================================
    // 2. Create atletas (15 total, distributed)
    // =============================================
    console.log('🏃 Creating atletas...');

    const atletas = [];

    // Atleta 1: Mayores, M, La Paz
    const atleta1 = await createUser('juan.perez@test.com', 'password123', 'atleta', laPaz.id, 'activo');
    await prisma.atletas.create({
      data: {
        user_id: atleta1.authId,
        nombre: 'Juan',
        apellido: 'Pérez',
        ci: '12345678',
        fecha_nacimiento: new Date('1995-03-15'),
        genero: 'M',
        nacionalidad: 'Boliviana',
        telefono: '70123456',
        email: 'juan.perez@test.com',
        direccion: 'Calle 1',
        ciudad_residencia: 'La Paz',
        departamento_residencia: 'La Paz',
        asociacion_id: laPaz.id,
        municipio: 'La Paz',
        categoria_fab: 'Mayores',
        especialidad: '100m',
        tipo_sangre: 'O+',
        contacto_emergencia: 'María Pérez',
        telefono_emergencia: '70111111',
        parentesco_emergencia: 'Madre',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'activo',
      },
    });
    atletas.push(atleta1.authId);
    console.log(`  ✅ Juan Pérez (Mayores, M, La Paz)`);

    // Atleta 2: U23, F, Cochabamba
    const atleta2 = await createUser('maria.lopez@test.com', 'password123', 'atleta', cochabamba.id, 'activo');
    await prisma.atletas.create({
      data: {
        user_id: atleta2.authId,
        nombre: 'María',
        apellido: 'López',
        ci: '23456789',
        fecha_nacimiento: new Date('2003-07-20'),
        genero: 'F',
        nacionalidad: 'Boliviana',
        telefono: '70234567',
        email: 'maria.lopez@test.com',
        direccion: 'Av. Principal 123',
        ciudad_residencia: 'Cochabamba',
        departamento_residencia: 'Cochabamba',
        asociacion_id: cochabamba.id,
        municipio: 'Cochabamba',
        categoria_fab: 'U23',
        especialidad: '200m',
        tipo_sangre: 'A+',
        contacto_emergencia: 'Carlos López',
        telefono_emergencia: '70222222',
        parentesco_emergencia: 'Padre',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'activo',
      },
    });
    atletas.push(atleta2.authId);
    console.log(`  ✅ María López (U23, F, Cochabamba)`);

    // Atleta 3: U20, M, Santa Cruz (no municipio)
    const atleta3 = await createUser('carlos.martinez@test.com', 'password123', 'atleta', santaCruz.id, 'activo');
    await prisma.atletas.create({
      data: {
        user_id: atleta3.authId,
        nombre: 'Carlos',
        apellido: 'Martínez',
        ci: '34567890',
        fecha_nacimiento: new Date('2006-11-05'),
        genero: 'M',
        nacionalidad: 'Boliviana',
        telefono: '70345678',
        email: 'carlos.martinez@test.com',
        direccion: 'Zona Norte 456',
        ciudad_residencia: 'Santa Cruz',
        departamento_residencia: 'Santa Cruz',
        asociacion_id: santaCruz.id,
        municipio: null, // Santa Cruz no requiere municipio
        categoria_fab: 'U20',
        especialidad: '400m',
        tipo_sangre: 'B+',
        contacto_emergencia: 'Ana Martínez',
        telefono_emergencia: '70333333',
        parentesco_emergencia: 'Madre',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'activo',
      },
    });
    atletas.push(atleta3.authId);
    console.log(`  ✅ Carlos Martínez (U20, M, Santa Cruz)`);

    // Atleta 4: Menores, F, Chuquisaca
    const atleta4 = await createUser('lucia.gomez@test.com', 'password123', 'atleta', chuquisaca.id, 'activo');
    await prisma.atletas.create({
      data: {
        user_id: atleta4.authId,
        nombre: 'Lucía',
        apellido: 'Gómez',
        ci: '45678901',
        fecha_nacimiento: new Date('2008-04-12'),
        genero: 'F',
        nacionalidad: 'Boliviana',
        telefono: '70456789',
        email: 'lucia.gomez@test.com',
        direccion: 'Calle Bolívar 789',
        ciudad_residencia: 'Sucre',
        departamento_residencia: 'Chuquisaca',
        asociacion_id: chuquisaca.id,
        municipio: 'Sucre',
        categoria_fab: 'Menores',
        especialidad: '800m',
        tipo_sangre: 'O-',
        contacto_emergencia: 'Pedro Gómez',
        telefono_emergencia: '70444444',
        parentesco_emergencia: 'Padre',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'activo',
      },
    });
    atletas.push(atleta4.authId);
    console.log(`  ✅ Lucía Gómez (Menores, F, Chuquisaca)`);

    // Atleta 5: Pendiente approval
    const atleta5 = await createUser('pedro.silva@test.com', 'password123', 'atleta', laPaz.id, 'pendiente');
    await prisma.atletas.create({
      data: {
        user_id: atleta5.authId,
        nombre: 'Pedro',
        apellido: 'Silva',
        ci: '56789012',
        fecha_nacimiento: new Date('2000-09-30'),
        genero: 'M',
        nacionalidad: 'Boliviana',
        telefono: '70567890',
        email: 'pedro.silva@test.com',
        direccion: 'Zona Sur 321',
        ciudad_residencia: 'La Paz',
        departamento_residencia: 'La Paz',
        asociacion_id: laPaz.id,
        municipio: 'La Paz',
        categoria_fab: 'Mayores',
        especialidad: '1500m',
        tipo_sangre: 'AB+',
        contacto_emergencia: 'Rosa Silva',
        telefono_emergencia: '70555555',
        parentesco_emergencia: 'Madre',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'pendiente',
      },
    });
    console.log(`  ✅ Pedro Silva (Mayores, M, La Paz) - PENDIENTE\n`);

    // =============================================
    // 3. Create entrenadores
    // =============================================
    console.log('👨‍🏫 Creating entrenadores...');

    const entrenador1 = await createUser('roberto.coach@test.com', 'password123', 'entrenador', laPaz.id, 'activo');
    await prisma.entrenadores.create({
      data: {
        user_id: entrenador1.authId,
        nombre: 'Roberto',
        apellido: 'Fernández',
        ci: '11111111',
        fecha_nacimiento: new Date('1980-05-15'),
        genero: 'M',
        nacionalidad: 'Boliviana',
        telefono: '70111111',
        email: 'roberto.coach@test.com',
        direccion: 'Calle Entrenadores 1',
        ciudad_residencia: 'La Paz',
        departamento_residencia: 'La Paz',
        asociacion_id: laPaz.id,
        especialidad: 'Velocidad',
        anios_experiencia: 15,
        certificaciones: 'Nivel 3 IAAF',
        tipo_sangre: 'O+',
        contacto_emergencia: 'Laura Fernández',
        telefono_emergencia: '70999999',
        parentesco_emergencia: 'Esposa',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'activo',
      },
    });
    console.log(`  ✅ Roberto Fernández (Velocidad, La Paz)\n`);

    // =============================================
    // 4. Create jueces
    // =============================================
    console.log('⚖️  Creating jueces...');

    const juez1 = await createUser('sandra.juez@test.com', 'password123', 'juez', cochabamba.id, 'activo');
    await prisma.jueces.create({
      data: {
        user_id: juez1.authId,
        nombre: 'Sandra',
        apellido: 'Rojas',
        ci: '22222222',
        fecha_nacimiento: new Date('1975-08-20'),
        genero: 'F',
        nacionalidad: 'Boliviana',
        telefono: '70222222',
        email: 'sandra.juez@test.com',
        direccion: 'Av. Jueces 100',
        ciudad_residencia: 'Cochabamba',
        departamento_residencia: 'Cochabamba',
        asociacion_id: cochabamba.id,
        especialidad: 'Pista',
        anios_experiencia: 20,
        nivel_juez: 'Nacional',
        tipo_sangre: 'A+',
        contacto_emergencia: 'Miguel Rojas',
        telefono_emergencia: '70888888',
        parentesco_emergencia: 'Esposo',
        foto_url: 'https://placeholder.com/150',
        ci_frente_url: 'https://placeholder.com/ci_frente',
        ci_reverso_url: 'https://placeholder.com/ci_reverso',
        estado: 'activo',
      },
    });
    console.log(`  ✅ Sandra Rojas (Nacional, Cochabamba)\n`);

    // =============================================
    // 5. Create eventos
    // =============================================
    console.log('🏅 Creating eventos...');

    // Evento 1: Federativo
    const eventoFederativo = await prisma.eventos.create({
      data: {
        nombre: 'Campeonato Nacional de Atletismo 2025',
        tipo: 'federativo',
        estado: 'aprobado',
        descripcion: 'Campeonato nacional para todas las categorías',
        ciudad: 'La Paz',
        lugar: 'Estadio Hernando Siles',
        direccion: 'Miraflores, La Paz',
        fecha_evento: new Date('2025-12-15'),
        hora_inicio: new Date('2025-12-15T08:00:00'),
        fecha_insc_inicio: new Date('2025-11-01'),
        fecha_insc_fin: new Date('2025-12-01'),
        genero_permitido: 'Mixto',
        costo_fab: 500.00,
        costo_por_atleta: 50.00,
        requiere_pago: true,
        banco: 'Banco Nacional de Bolivia',
        numero_cuenta: '1234567890',
        titular_cuenta: 'FAB',
        asociacion_creadora_id: laPaz.id,
        creado_por_user: adminLaPaz.authId,
        creado_por_rol: 'admin_asociacion',
      },
    });
    console.log(`  ✅ Evento Federativo: ${eventoFederativo.id}`);

    // Evento 2: Asociación
    const eventoAsociacion = await prisma.eventos.create({
      data: {
        nombre: 'Copa Cochabamba 2025',
        tipo: 'asociacion',
        estado: 'aprobado',
        descripcion: 'Evento local de Cochabamba',
        ciudad: 'Cochabamba',
        lugar: 'Estadio Félix Capriles',
        direccion: 'Zona Sur, Cochabamba',
        fecha_evento: new Date('2025-11-20'),
        hora_inicio: new Date('2025-11-20T09:00:00'),
        fecha_insc_inicio: new Date('2025-10-15'),
        fecha_insc_fin: new Date('2025-11-10'),
        genero_permitido: 'Mixto',
        requiere_pago: false,
        asociacion_creadora_id: cochabamba.id,
        creado_por_user: adminCochabamba.authId,
        creado_por_rol: 'admin_asociacion',
      },
    });
    console.log(`  ✅ Evento Asociación: ${eventoAsociacion.id}\n`);

    // =============================================
    // 6. Create pruebas
    // =============================================
    console.log('🏃‍♂️ Creating pruebas...');

    // Pruebas para evento federativo
    const prueba100m = await prisma.pruebas.create({
      data: {
        evento_id: eventoFederativo.id,
        nombre: '100 metros planos',
        categoria_fab: 'Mayores',
        genero: 'M',
        distancia: '100m',
        es_con_carriles: true,
        numero_carriles: 8,
        es_campo: false,
        es_pista: true,
        es_fondo: false,
      },
    });
    console.log(`  ✅ 100m Mayores M`);

    const prueba200mF = await prisma.pruebas.create({
      data: {
        evento_id: eventoFederativo.id,
        nombre: '200 metros planos',
        categoria_fab: 'U23',
        genero: 'F',
        distancia: '200m',
        es_con_carriles: true,
        numero_carriles: 8,
        es_campo: false,
        es_pista: true,
        es_fondo: false,
      },
    });
    console.log(`  ✅ 200m U23 F\n`);

    // =============================================
    // 7. Create inscripciones
    // =============================================
    console.log('📝 Creating inscripciones...');

    await prisma.inscripciones.create({
      data: {
        evento_id: eventoFederativo.id,
        prueba_id: prueba100m.id,
        atleta_id: atleta1.authId,
        categoria_atleta: 'Mayores',
        estado_asociacion: 'aprobada',
        estado_fab: 'aprobada',
        pago_verificado: true,
      },
    });
    console.log(`  ✅ Juan Pérez → 100m Mayores (aprobada, pago verificado)`);

    await prisma.inscripciones.create({
      data: {
        evento_id: eventoFederativo.id,
        prueba_id: prueba200mF.id,
        atleta_id: atleta2.authId,
        categoria_atleta: 'U23',
        estado_asociacion: 'aprobada',
        estado_fab: 'pendiente',
        pago_verificado: false,
      },
    });
    console.log(`  ✅ María López → 200m U23 (pendiente FAB, pago no verificado)\n`);

    console.log('='.repeat(60));
    console.log('✅ Test data seeded successfully!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`  - 3 admin_asociacion`);
    console.log(`  - 5 atletas (4 activos, 1 pendiente)`);
    console.log(`  - 1 entrenador`);
    console.log(`  - 1 juez`);
    console.log(`  - 2 eventos (1 federativo, 1 asociacion)`);
    console.log(`  - 2 pruebas`);
    console.log(`  - 2 inscripciones`);
    console.log('\n📝 Test Credentials:');
    console.log('  Admin La Paz: admin.lapaz@fab.bo / password123');
    console.log('  Atleta activo: juan.perez@test.com / password123');
    console.log('  Atleta pendiente: pedro.silva@test.com / password123');
    console.log('');

  } catch (error: any) {
    if (error.message?.includes('already exists') || error.code === '23505') {
      console.error('\n❌ Error: Test data already exists');
      console.error('The database already has test users. Clear the database or use different emails.');
    } else {
      console.error('\n❌ Error seeding test data:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
