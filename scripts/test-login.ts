import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🔐 Testing login flow...\n');

  // Sign in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@fab.bo',
    password: 'Admin123!',
  });

  if (authError) {
    console.error('❌ Auth error:', authError.message);
    return;
  }

  console.log('✅ Authentication successful');
  console.log('   User ID:', authData.user.id);
  console.log('   Email:', authData.user.email);
  console.log('');

  // Try to fetch user data from users table
  console.log('🔍 Fetching user data from users table...\n');
  
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_id, rol, estado, asociacion_id')
    .eq('user_id', authData.user.id)
    .single();

  if (userError) {
    console.error('❌ RLS POLICY ERROR');
    console.error('   Code:', userError.code);
    console.error('   Message:', userError.message);
    console.error('   Hint:', userError.hint || 'No hint provided');
    console.error('\n⚠️  The RLS policy is blocking SELECT operations on the users table.');
    console.error('   You need to enable SELECT policy for authenticated users.');
    return;
  }

  console.log('✅ User data fetched successfully!');
  console.log('   User ID:', userData.user_id);
  console.log('   Rol:', userData.rol);
  console.log('   Estado:', userData.estado);
  console.log('   Asociación ID:', userData.asociacion_id);
  console.log('\n🎉 Everything is working correctly!\n');

  await supabase.auth.signOut();
}

testLogin();
