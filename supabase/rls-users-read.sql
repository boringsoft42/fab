-- ============================================
-- RLS POLICIES PARA TABLA USERS
-- ============================================
-- Permitir que admin_fab pueda leer todos los usuarios

-- 1. Verificar políticas actuales
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'users';

-- 2. Eliminar políticas existentes (si hay)
DROP POLICY IF EXISTS "admin_fab_all_users" ON users;
DROP POLICY IF EXISTS "users_read_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;

-- 3. Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Crear política: admin_fab puede hacer TODO
CREATE POLICY "admin_fab_all_users" ON users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.user_id = auth.uid()
    AND u.rol = 'admin_fab'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.user_id = auth.uid()
    AND u.rol = 'admin_fab'
  )
);

-- 5. Crear política: Los usuarios pueden leer su propio registro
CREATE POLICY "users_read_own" ON users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 6. Crear política: Los usuarios pueden actualizar su propio registro
CREATE POLICY "users_update_own" ON users
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Crear política: Permitir inserción para nuevos usuarios (sign-up)
CREATE POLICY "users_insert_own" ON users
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 8. Verificar que se crearon las políticas
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
