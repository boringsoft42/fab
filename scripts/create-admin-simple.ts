/**
 * Simple script to create admin_fab user without interactive prompts
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

async function createAdminFab() {
  try {
    console.log('\n============================================================');
    console.log('🔐 Creating admin_fab user');
    console.log('============================================================\n');

    // Get La Paz asociacion
    const laPaz = await prisma.asociaciones.findFirst({
      where: { nombre: 'La Paz' },
    });

    if (!laPaz) {
      console.error('❌ Error: La Paz asociacion not found. Run seed-test-data.ts first.');
      process.exit(1);
    }

    // Admin credentials
    const email = 'admin@fab.bo';
    const password = 'Admin123!';
    const firstName = 'Administrador';
    const lastName = 'FAB';

    console.log(`📧 Email: ${email}`);
    console.log(`🔒 Password: ${password}`);
    console.log(`👤 Name: ${firstName} ${lastName}`);
    console.log(`🏢 Asociación: ${laPaz.nombre}\n`);

    // Create auth user
    console.log('Creating Supabase Auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (authError || !authData.user) {
      console.error('❌ Error creating auth user:', authError);
      process.exit(1);
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Create user record
    console.log('\nCreating users table record...');
    const user = await prisma.users.create({
      data: {
        user_id: authData.user.id,
        rol: 'admin_fab',
        estado: 'activo', // admin_fab is always activo, no approval needed
        asociacion_id: laPaz.id,
      },
    });

    console.log('✅ User record created');
    console.log('\n============================================================');
    console.log('✅ SUCCESS! admin_fab user created');
    console.log('============================================================\n');
    console.log('You can now log in with:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminFab();
