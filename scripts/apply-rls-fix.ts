import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSFix() {
  console.log('🔧 Applying RLS fix for users table...\n');

  try {
    // Drop all existing policies
    console.log('1. Dropping all existing policies...');
    
    const dropPolicies = `
      DO $$
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
              EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
          END LOOP;
      END $$;
    `;
    
    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropPolicies });
    
    if (dropError) {
      console.log('⚠️  Using alternative method to drop policies...');
      
      // List and drop policies one by one
      const policies = [
        'users_select_policy',
        'users_insert_policy', 
        'users_update_policy',
        'users_delete_policy',
        'Enable read access for authenticated users',
        'Enable read access for all users',
        'Users can read own data',
        'Users can update own data',
      ];
      
      for (const policy of policies) {
        await supabase.rpc('exec_sql', { 
          sql: `DROP POLICY IF EXISTS "${policy}" ON users;` 
        });
      }
    }

    console.log('✅ Policies dropped\n');

    // Create simple SELECT policy
    console.log('2. Creating simple SELECT policy...');
    
    const createPolicy = `
      CREATE POLICY "users_read_own"
      ON users
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createPolicy });
    
    if (createError) {
      console.error('❌ Error creating policy:', createError);
      console.log('\n📝 Please run this SQL manually in Supabase SQL Editor:');
      console.log('');
      console.log('-- Drop all policies');
      console.log('DROP POLICY IF EXISTS "users_select_policy" ON users;');
      console.log('DROP POLICY IF EXISTS "users_insert_policy" ON users;');
      console.log('DROP POLICY IF EXISTS "users_update_policy" ON users;');
      console.log('DROP POLICY IF EXISTS "users_delete_policy" ON users;');
      console.log('');
      console.log('-- Create simple policy');
      console.log(createPolicy);
      return;
    }

    console.log('✅ Policy created\n');
    console.log('🎉 RLS fix applied successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n⚠️  The script cannot execute SQL directly.');
    console.log('Please run the SQL manually in Supabase:');
    console.log('\n1. Go to: https://supabase.com/dashboard/project/kyfmpqdsusgkwqpllghn/sql/new');
    console.log('2. Copy and paste this SQL:\n');
    console.log(fs.readFileSync('scripts/fix-rls-simple.sql', 'utf-8'));
  }
}

applyRLSFix();
