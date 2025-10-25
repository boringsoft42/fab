-- Fix RLS policies for users table
-- This script removes the recursive policies and creates simple, correct ones

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create simple, non-recursive SELECT policy
-- Authenticated users can read their own user record
CREATE POLICY "users_select_own"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admin FAB can read all users
CREATE POLICY "admin_fab_select_all"
ON users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.user_id = auth.uid()
    AND u.rol = 'admin_fab'
    AND u.estado = 'activo'
  )
);

-- Admin Asociacion can read users from their asociacion
CREATE POLICY "admin_asociacion_select_own"
ON users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.user_id = auth.uid()
    AND u.rol = 'admin_asociacion'
    AND u.estado = 'activo'
    AND u.asociacion_id = users.asociacion_id
  )
);

-- Users can update their own data (but not rol or estado)
CREATE POLICY "users_update_own"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only admins can insert new users
CREATE POLICY "admin_insert_users"
ON users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.user_id = auth.uid()
    AND u.rol IN ('admin_fab', 'admin_asociacion')
    AND u.estado = 'activo'
  )
);

-- Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Show all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';
