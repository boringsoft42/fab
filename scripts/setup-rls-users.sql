-- Script para configurar RLS en la tabla users
-- Ejecuta este script en Supabase SQL Editor

-- 1. Habilitar RLS en la tabla users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. ELIMINAR políticas existentes (si hay)
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Admin FAB can read all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;

-- 3. Crear política PERMISIVA para que usuarios autenticados puedan leer sus propios datos
CREATE POLICY "Enable read access for authenticated users"
ON users
FOR SELECT
TO authenticated
USING (true); -- Permitir leer todos los usuarios (necesario para el login)

-- 4. Política para INSERT (cuando se crea un usuario)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
CREATE POLICY "Enable insert for authenticated users"
ON users
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 5. Política para UPDATE (solo su propio registro)
DROP POLICY IF EXISTS "Enable update for own record" ON users;
CREATE POLICY "Enable update for own record"
ON users
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. Verificar que las políticas se crearon correctamente
SELECT
    schemaname,
    tablename,
    policyname,
    cmd as "Operation"
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Deberías ver algo como:
-- | schemaname | tablename | policyname                              | Operation |
-- |------------|-----------|----------------------------------------|-----------|
-- | public     | users     | Enable insert for authenticated users  | INSERT    |
-- | public     | users     | Enable read access for authenticated   | SELECT    |
-- | public     | users     | Enable update for own record           | UPDATE    |
