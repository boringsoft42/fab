-- Simple RLS fix for users table (no recursion)

-- Drop ALL existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON users';
    END LOOP;
END $$;

-- Create ONE simple policy: authenticated users can read their own record
CREATE POLICY "users_read_own_simple"
ON users
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Verify
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users';
