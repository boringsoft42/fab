/**
 * Script to create/update admin_fab user
 *
 * Run this with: npx tsx scripts/setup-admin-fab.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // You need this in .env

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdminFab() {
  const adminEmail = 'admin@admin.com';

  console.log('🔍 Checking if admin user exists in auth.users...');

  // Get user from auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('❌ Error listing users:', listError);
    return;
  }

  const authUser = users.find(u => u.email === adminEmail);

  if (!authUser) {
    console.log('❌ User not found in auth.users. Please create the user first in Supabase Auth.');
    console.log('   Or run: supabase auth create user --email admin@admin.com --password your-password');
    return;
  }

  console.log('✅ Found user in auth.users:', authUser.id);

  // Check if user exists in users table
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', authUser.id)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('❌ Error checking users table:', checkError);
    return;
  }

  if (existingUser) {
    console.log('✅ User exists in users table');
    console.log('📊 Current data:', {
      rol: existingUser.rol,
      estado: existingUser.estado,
      nombre: existingUser.nombre,
      apellido: existingUser.apellido,
    });

    // Update to ensure correct role and status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        rol: 'admin_fab',
        estado: 'activo',
      })
      .eq('user_id', authUser.id);

    if (updateError) {
      console.error('❌ Error updating user:', updateError);
      return;
    }

    console.log('✅ Updated user to admin_fab with estado activo');
  } else {
    console.log('📝 Creating user in users table...');

    // Insert new user
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        user_id: authUser.id,
        email: adminEmail,
        rol: 'admin_fab',
        estado: 'activo',
        nombre: 'Admin',
        apellido: 'FAB',
        fecha_registro: new Date().toISOString(),
      });

    if (insertError) {
      console.error('❌ Error creating user:', insertError);
      return;
    }

    console.log('✅ Created user in users table');
  }

  // Verify final state
  const { data: finalUser } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', authUser.id)
    .single();

  console.log('\n✅ Setup complete! Final user data:');
  console.log({
    user_id: finalUser?.user_id,
    email: finalUser?.email,
    rol: finalUser?.rol,
    estado: finalUser?.estado,
    nombre: finalUser?.nombre,
    apellido: finalUser?.apellido,
  });

  console.log('\n🚀 You can now login with:');
  console.log(`   Email: ${adminEmail}`);
  console.log('   Password: (your password)');
  console.log('   You should be redirected to: /dashboard/admin-fab');
}

setupAdminFab().catch(console.error);
