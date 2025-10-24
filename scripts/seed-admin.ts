/**
 * Seed script for creating the initial admin_fab user
 *
 * This script MUST be run manually by an administrator with Supabase Admin access.
 *
 * Requirements (from PRD REQ-1.1.14, REQ-1.1.15):
 * - admin_fab accounts are NOT created via the web application
 * - Must be created directly in the database or via script
 * - At least 1 admin_fab account must exist at all times
 *
 * Usage:
 *   pnpm tsx scripts/seed-admin.ts
 *
 * Environment variables required:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (NOT anon key!)
 */

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Required:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure these are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function seedAdminFab() {
  console.log('='.repeat(60));
  console.log('🔐 Seed Admin FAB User Script');
  console.log('='.repeat(60));
  console.log();

  try {
    // Step 1: Get asociación "La Paz" (or any other as default)
    const laPaz = await prisma.asociaciones.findFirst({
      where: { nombre: 'La Paz' },
    });

    if (!laPaz) {
      console.error('❌ Error: Asociación "La Paz" not found');
      console.error('Please run the database schema setup first.');
      process.exit(1);
    }

    console.log('📋 Creating admin_fab user for FAB (Federación de Atletismo de Bolivia)\n');

    // Step 2: Collect admin data
    const email = await question('📧 Email: ');
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address');
      process.exit(1);
    }

    const password = await question('🔒 Password (min 6 chars): ');
    if (!password || password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      process.exit(1);
    }

    const confirmPassword = await question('🔒 Confirm password: ');
    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    console.log('\n' + '-'.repeat(60));
    console.log('Summary:');
    console.log(`  Email: ${email}`);
    console.log(`  Rol: admin_fab`);
    console.log(`  Asociación: La Paz (${laPaz.id})`);
    console.log(`  Estado: activo (no approval needed)`);
    console.log('-'.repeat(60));

    const confirm = await question('\n✅ Create this admin_fab user? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Cancelled by user');
      process.exit(0);
    }

    // Step 3: Create auth user with Supabase Admin
    console.log('\n🔄 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError || !authData.user) {
      console.error('❌ Error creating auth user:', authError);
      process.exit(1);
    }

    console.log(`✅ Auth user created: ${authData.user.id}`);

    // Step 4: Create user record in users table
    console.log('🔄 Creating user record in database...');
    const user = await prisma.users.create({
      data: {
        user_id: authData.user.id,
        rol: 'admin_fab',
        estado: 'activo', // admin_fab is always active
        asociacion_id: laPaz.id, // admin_fab can be linked to any asociacion (administrative)
      },
    });

    console.log(`✅ User record created in database`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! Admin FAB user created');
    console.log('='.repeat(60));
    console.log('\nUser Details:');
    console.log(`  User ID: ${user.user_id}`);
    console.log(`  Email: ${email}`);
    console.log(`  Rol: ${user.rol}`);
    console.log(`  Estado: ${user.estado}`);
    console.log(`  Asociación ID: ${user.asociacion_id}`);
    console.log('\n📝 You can now login with these credentials:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: [the one you entered]`);
    console.log('\n⚠️  IMPORTANT: Store these credentials securely!');
    console.log('');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

seedAdminFab();
