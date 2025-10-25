-- ============================================
-- FIX: Dropdown de Asociaciones en Sign-Up
-- ============================================
-- Este script soluciona el problema del dropdown vacío

-- PASO 1: Verificar si existen asociaciones
SELECT COUNT(*) as total_asociaciones FROM asociaciones WHERE estado = true;
-- Si el resultado es 0, necesitas crear las asociaciones (ver PASO 3)

-- PASO 2: Actualizar política RLS para permitir lectura pública
DROP POLICY IF EXISTS "public_read_asociaciones_activas" ON asociaciones;

CREATE POLICY "public_read_asociaciones_activas" ON asociaciones
FOR SELECT
TO anon, authenticated
USING (estado = true);

-- PASO 3: Si no hay asociaciones, crear las 9 departamentales
-- (Solo ejecutar si el COUNT del PASO 1 devolvió 0)

INSERT INTO asociaciones (nombre, departamento, ciudad, contacto, email, telefono, estado) VALUES
('La Paz', 'La Paz', 'La Paz', 'Asociación Departamental La Paz', 'lapaz@fab.bo', '2-2222222', true),
('Cochabamba', 'Cochabamba', 'Cochabamba', 'Asociación Departamental Cochabamba', 'cochabamba@fab.bo', '4-4444444', true),
('Santa Cruz', 'Santa Cruz', 'Santa Cruz de la Sierra', 'Asociación Departamental Santa Cruz', 'santacruz@fab.bo', '3-3333333', true),
('Chuquisaca', 'Chuquisaca', 'Sucre', 'Asociación Departamental Chuquisaca', 'chuquisaca@fab.bo', '4-6464646', true),
('Tarija', 'Tarija', 'Tarija', 'Asociación Departamental Tarija', 'tarija@fab.bo', '4-6666666', true),
('Oruro', 'Oruro', 'Oruro', 'Asociación Departamental Oruro', 'oruro@fab.bo', '2-5252525', true),
('Potosí', 'Potosí', 'Potosí', 'Asociación Departamental Potosí', 'potosi@fab.bo', '2-6262626', true),
('Beni', 'Beni', 'Trinidad', 'Asociación Departamental Beni', 'beni@fab.bo', '3-4646464', true),
('Pando', 'Pando', 'Cobija', 'Asociación Departamental Pando', 'pando@fab.bo', '3-8421111', true)
ON CONFLICT (nombre) DO NOTHING;

-- PASO 4: Verificar que todo funcionó
SELECT id, nombre, departamento, estado
FROM asociaciones
WHERE estado = true
ORDER BY nombre;

-- PASO 5: Verificar las políticas RLS
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'asociaciones';

-- Deberías ver 2 políticas:
-- 1. admin_fab_all_asociaciones (ALL, authenticated)
-- 2. public_read_asociaciones_activas (SELECT, {anon, authenticated})
