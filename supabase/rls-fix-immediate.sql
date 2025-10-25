-- ============================================
-- FIX INMEDIATO - RLS POLICIES PARA ASOCIACIONES
-- ============================================
-- Ejecutar esto AHORA en Supabase SQL Editor para poder crear asociaciones

-- 1. Eliminar políticas existentes (por si acaso)
DROP POLICY IF EXISTS "admin_fab_all_asociaciones" ON asociaciones;
DROP POLICY IF EXISTS "public_read_asociaciones_activas" ON asociaciones;

-- 2. Habilitar RLS
ALTER TABLE asociaciones ENABLE ROW LEVEL SECURITY;

-- 3. Crear política: admin_fab puede hacer TODO en asociaciones
CREATE POLICY "admin_fab_all_asociaciones" ON asociaciones
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- 4. Crear política: Todos pueden LEER asociaciones activas
CREATE POLICY "public_read_asociaciones_activas" ON asociaciones
FOR SELECT
TO authenticated
USING (estado = true);

-- 5. Verificar que las políticas se crearon
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'asociaciones';

-- Deberías ver 2 políticas:
-- 1. admin_fab_all_asociaciones (ALL)
-- 2. public_read_asociaciones_activas (SELECT)
