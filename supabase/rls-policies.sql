-- ============================================
-- RLS POLICIES FOR FAB MANAGEMENT SYSTEM
-- ============================================

-- NOTA: Ejecutar en Supabase SQL Editor
-- Este script crea las políticas de Row Level Security necesarias

-- ============================================
-- 1. ASOCIACIONES
-- ============================================

-- Habilitar RLS en asociaciones (si no está habilitado)
ALTER TABLE asociaciones ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede hacer todo en asociaciones
CREATE POLICY "admin_fab_all_asociaciones" ON asociaciones
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: Todos pueden leer asociaciones activas (para el dropdown en sign-up)
CREATE POLICY "public_read_asociaciones_activas" ON asociaciones
FOR SELECT
USING (estado = true);

-- ============================================
-- 2. USERS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver y modificar todos los usuarios
CREATE POLICY "admin_fab_all_users" ON users
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.user_id = auth.uid()
    AND u.rol = 'admin_fab'
  )
);

-- Policy: Los usuarios pueden ver su propio registro
CREATE POLICY "users_read_own" ON users
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Los usuarios pueden actualizar su propio registro
CREATE POLICY "users_update_own" ON users
FOR UPDATE
USING (user_id = auth.uid());

-- Policy: Permitir inserción para nuevos usuarios (sign-up)
CREATE POLICY "users_insert_own" ON users
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 3. ATLETAS
-- ============================================

ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver todos los atletas
CREATE POLICY "admin_fab_all_atletas" ON atletas
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: Los atletas pueden ver su propio perfil
CREATE POLICY "atletas_read_own" ON atletas
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Los atletas pueden insertar su propio perfil
CREATE POLICY "atletas_insert_own" ON atletas
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy: Los atletas pueden actualizar su propio perfil (solo si estado = pendiente)
CREATE POLICY "atletas_update_own_pending" ON atletas
FOR UPDATE
USING (
  user_id = auth.uid()
  AND estado = 'pendiente'
);

-- ============================================
-- 4. ENTRENADORES
-- ============================================

ALTER TABLE entrenadores ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver todos los entrenadores
CREATE POLICY "admin_fab_all_entrenadores" ON entrenadores
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: Los entrenadores pueden ver su propio perfil
CREATE POLICY "entrenadores_read_own" ON entrenadores
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Los entrenadores pueden insertar su propio perfil
CREATE POLICY "entrenadores_insert_own" ON entrenadores
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy: Los entrenadores pueden actualizar su propio perfil (solo si estado = pendiente)
CREATE POLICY "entrenadores_update_own_pending" ON entrenadores
FOR UPDATE
USING (
  user_id = auth.uid()
  AND estado = 'pendiente'
);

-- ============================================
-- 5. JUECES
-- ============================================

ALTER TABLE jueces ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver todos los jueces
CREATE POLICY "admin_fab_all_jueces" ON jueces
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: Los jueces pueden ver su propio perfil
CREATE POLICY "jueces_read_own" ON jueces
FOR SELECT
USING (user_id = auth.uid());

-- Policy: Los jueces pueden insertar su propio perfil
CREATE POLICY "jueces_insert_own" ON jueces
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy: Los jueces pueden actualizar su propio perfil (solo si estado = pendiente)
CREATE POLICY "jueces_update_own_pending" ON jueces
FOR UPDATE
USING (
  user_id = auth.uid()
  AND estado = 'pendiente'
);

-- ============================================
-- 6. EVENTOS
-- ============================================

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver y modificar todos los eventos
CREATE POLICY "admin_fab_all_eventos" ON eventos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: admin_asociacion puede ver eventos de su asociación
CREATE POLICY "admin_asociacion_read_own_eventos" ON eventos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_asociacion'
    AND users.asociacion_id = eventos.asociacion_creadora_id
  )
);

-- Policy: admin_asociacion puede crear eventos
CREATE POLICY "admin_asociacion_insert_eventos" ON eventos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_asociacion'
    AND users.asociacion_id = eventos.asociacion_creadora_id
  )
);

-- Policy: Todos los usuarios autenticados pueden ver eventos aprobados
CREATE POLICY "authenticated_read_eventos_aprobados" ON eventos
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND estado = 'aprobado'
);

-- ============================================
-- 7. PAGOS
-- ============================================

ALTER TABLE pagos_evento_asociacion ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver todos los pagos
CREATE POLICY "admin_fab_all_pagos" ON pagos_evento_asociacion
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: admin_asociacion puede ver pagos de su asociación
CREATE POLICY "admin_asociacion_read_own_pagos" ON pagos_evento_asociacion
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_asociacion'
    AND users.asociacion_id = pagos_evento_asociacion.asociacion_id
  )
);

-- ============================================
-- 8. INSCRIPCIONES
-- ============================================

ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede ver todas las inscripciones
CREATE POLICY "admin_fab_all_inscripciones" ON inscripciones
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: Los atletas pueden ver sus propias inscripciones
CREATE POLICY "atletas_read_own_inscripciones" ON inscripciones
FOR SELECT
USING (atleta_id = auth.uid());

-- Policy: Los atletas pueden crear inscripciones
CREATE POLICY "atletas_insert_inscripciones" ON inscripciones
FOR INSERT
WITH CHECK (atleta_id = auth.uid());

-- ============================================
-- 9. DORSALES
-- ============================================

ALTER TABLE dorsales ENABLE ROW LEVEL SECURITY;

-- Policy: admin_fab puede gestionar todos los dorsales
CREATE POLICY "admin_fab_all_dorsales" ON dorsales
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Policy: Los atletas pueden ver sus propios dorsales
CREATE POLICY "atletas_read_own_dorsales" ON dorsales
FOR SELECT
USING (atleta_id = auth.uid());

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver todas las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
