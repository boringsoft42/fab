import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser() {
  console.log('Testing user fetch...\n');

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

  // Try to fetch user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', authData.user.id)
    .single();

  if (userError) {
    console.error('❌ User data error:', userError);
    console.error('Error details:', JSON.stringify(userError, null, 2));
  } else {
    console.log('✅ User data fetched:', userData);
  }
}

checkUser();
