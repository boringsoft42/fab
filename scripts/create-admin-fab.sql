-- Script para crear/verificar usuario admin_fab
-- Ejecuta este script en Supabase SQL Editor

-- 1. Primero, verifica si el usuario existe en auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email = 'admin@admin.com';

-- 2. Copia el 'id' del resultado anterior y úsalo en la siguiente query
-- Reemplaza 'TU_USER_ID_AQUI' con el ID real del usuario

-- 3. Verifica si el usuario existe en la tabla users
SELECT user_id, email, rol, estado, nombre, apellido
FROM users
WHERE email = 'admin@admin.com';

-- 4. Si NO existe en la tabla users, créalo con este INSERT:
-- (Reemplaza 'TU_USER_ID_AQUI' con el ID real de auth.users)

INSERT INTO users (
  user_id,
  email,
  rol,
  estado,
  nombre,
  apellido,
  fecha_registro
) VALUES (
  'TU_USER_ID_AQUI',  -- Reemplaza esto con el ID de auth.users
  'admin@admin.com',
  'admin_fab',
  'activo',
  'Admin',
  'FAB',
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  rol = 'admin_fab',
  estado = 'activo';

-- 5. Verifica que el usuario fue creado correctamente
SELECT user_id, email, rol, estado, nombre, apellido
FROM users
WHERE email = 'admin@admin.com';

-- Si todo está correcto, deberías ver:
-- rol = 'admin_fab'
-- estado = 'activo'
