-- ============================================
-- PERMITIR LECTURA PÚBLICA DE ASOCIACIONES
-- ============================================
-- Para que el formulario de registro (sign-up) pueda mostrar
-- las asociaciones en el dropdown SIN requerir autenticación

-- 1. Eliminar la política anterior de lectura autenticada
DROP POLICY IF EXISTS "public_read_asociaciones_activas" ON asociaciones;

-- 2. Crear política que permite lectura PÚBLICA (sin autenticación)
CREATE POLICY "public_read_asociaciones_activas" ON asociaciones
FOR SELECT
TO anon, authenticated  -- Permite tanto a usuarios anónimos como autenticados
USING (estado = true);

-- 3. Verificar que se creó correctamente
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'asociaciones'
AND policyname = 'public_read_asociaciones_activas';

-- Deberías ver:
-- tablename: asociaciones
-- policyname: public_read_asociaciones_activas
-- cmd: SELECT
-- roles: {anon, authenticated}
