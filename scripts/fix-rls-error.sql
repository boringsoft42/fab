-- Script para arreglar el error de RLS
-- Ejecuta este script en Supabase SQL Editor

-- 1. Primero, eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "sel_users_self_or_admin" ON users;
DROP POLICY IF EXISTS "upd_users_admins" ON users;

-- 2. Deshabilitar RLS temporalmente para limpiar
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 3. Volver a habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Crear UNA SOLA política simple para SELECT (lectura)
CREATE POLICY "users_select_policy"
ON users
FOR SELECT
TO authenticated
USING (true);

-- 5. Crear política para UPDATE (solo admin_fab puede actualizar)
CREATE POLICY "users_update_policy"
ON users
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid()
    AND rol = 'admin_fab'
  )
);

-- 6. Crear política para INSERT (para cuando se registran nuevos usuarios)
CREATE POLICY "users_insert_policy"
ON users
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 7. Verificar que las políticas se crearon correctamente
SELECT
  policyname,
  cmd as operation,
  CASE
    WHEN qual IS NULL THEN 'No condition'
    ELSE 'Has condition'
  END as has_condition
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Deberías ver 3 políticas:
-- users_insert_policy  | INSERT | Has condition
-- users_select_policy  | SELECT | Has condition
-- users_update_policy  | UPDATE | Has condition
