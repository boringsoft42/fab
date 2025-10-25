/**
 * Quick script to create admin_fab user
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔄 Creating admin_fab user...\n');

    const email = 'admin@admin.com';
    const password = 'admin123';

    // Get La Paz asociación
    const laPaz = await prisma.asociaciones.findFirst({
      where: { nombre: 'La Paz' },
    });

    if (!laPaz) {
      console.error('❌ Asociación "La Paz" not found. Creating it...');

      // Create La Paz asociación
      const newLaPaz = await prisma.asociaciones.create({
        data: {
          nombre: 'La Paz',
          departamento: 'La Paz',
          ciudad: 'La Paz',
        },
      });

      console.log('✅ La Paz asociación created:', newLaPaz.id);

      // Create admin with new asociación
      return await createAdminUser(email, password, newLaPaz.id);
    }

    return await createAdminUser(email, password, laPaz.id);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function createAdminUser(email: string, password: string, asociacionId: string) {
  // Check if user already exists
  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const userExists = existingUser?.users?.find(u => u.email === email);

  let userId: string;

  if (userExists) {
    console.log('⚠️  Auth user already exists, using existing user:', userExists.id);
    userId = userExists.id;
  } else {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('❌ Error creating auth user:', authError);
      process.exit(1);
    }

    userId = authData.user.id;
    console.log('✅ Auth user created:', userId);
  }

  // Check if user record exists in database
  const existingUserRecord = await prisma.users.findUnique({
    where: { user_id: userId },
  });

  if (existingUserRecord) {
    console.log('✅ User record already exists in database');
    console.log('  User ID:', existingUserRecord.user_id);
    console.log('  Rol:', existingUserRecord.rol);
    console.log('  Estado:', existingUserRecord.estado);
    console.log('\n✅ You can now login with:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    return;
  }

  // Create user record in database
  const user = await prisma.users.create({
    data: {
      user_id: userId,
      rol: 'admin_fab',
      estado: 'activo',
      asociacion_id: asociacionId,
    },
  });

  console.log('✅ User record created in database');
  console.log('\n='.repeat(60));
  console.log('✅ SUCCESS! Admin FAB user created');
  console.log('='.repeat(60));
  console.log('\nLogin credentials:');
  console.log('  Email:', email);
  console.log('  Password:', password);
  console.log('  Rol:', user.rol);
  console.log('  Estado:', user.estado);
  console.log('\n🎉 You can now login at http://localhost:3000/sign-in');
}

createAdmin();
