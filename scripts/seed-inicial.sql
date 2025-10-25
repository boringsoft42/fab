-- Script de Seed Inicial para FAB Management System
-- Ejecutar esto PRIMERO en Supabase SQL Editor

-- 1. CREAR LAS 9 ASOCIACIONES DEPARTAMENTALES
-- REQ-3.1.1 - 9 asociaciones departamentales de Bolivia

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

-- Mensaje de confirmación
SELECT 'Asociaciones creadas exitosamente' AS resultado, COUNT(*) AS total FROM asociaciones;

-- NOTA: Para crear el usuario admin_fab, necesitas:
-- 1. Crear el usuario en Supabase Authentication (Dashboard > Authentication > Users)
-- 2. Luego ejecutar el siguiente SQL con el UUID del usuario creado

-- Ejemplo (reemplaza 'USER_UUID_AQUI' con el UUID real del usuario de auth):
/*
INSERT INTO users (user_id, rol, estado, asociacion_id)
VALUES (
  'USER_UUID_AQUI',
  'admin_fab',
  'activo',
  (SELECT id FROM asociaciones WHERE nombre = 'La Paz' LIMIT 1)
);
*/

-- Ver las asociaciones creadas
SELECT id, nombre, departamento, ciudad, estado FROM asociaciones ORDER BY nombre;
