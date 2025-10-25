-- Verificar políticas RLS en la tabla users
-- Ejecuta este script en Supabase SQL Editor

-- 1. Ver si RLS está habilitado en la tabla users
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'users';

-- 2. Ver todas las políticas de la tabla users
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users';

-- 3. Si NO hay políticas, necesitas crear una política permisiva
-- Ejecuta esto SOLO si no hay políticas:

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura a usuarios autenticados
CREATE POLICY "Users can read their own data"
ON users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Crear política para permitir a admin_fab leer todos los usuarios
CREATE POLICY "Admin FAB can read all users"
ON users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE user_id = auth.uid()
    AND rol = 'admin_fab'
  )
);

-- 4. Verificar que las políticas se crearon
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users';
