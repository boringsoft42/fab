import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser() {
  console.log('🔍 Testing RLS policies on users table...\n');

  // Sign in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@admin.com',
    password: 'admin123',
  });

  if (authError) {
    console.error('❌ Auth error:', authError);
    return;
  }

  console.log('✅ Auth successful');
  console.log('User ID:', authData.user.id);
  console.log('');

  // Try to fetch user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('user_id, rol, estado, asociacion_id')
    .eq('user_id', authData.user.id)
    .single();

  if (userError) {
    console.error('❌ RLS Error - Cannot read from users table');
    console.error('Error code:', userError.code);
    console.error('Error message:', userError.message);
    console.error('Error hint:', userError.hint);
    console.error('\nThis means RLS policies are blocking the SELECT operation.');
    console.error('You need to add a SELECT policy for authenticated users.\n');
  } else {
    console.log('✅ User data fetched successfully:', userData);
  }

  await supabase.auth.signOut();
}

checkUser();
