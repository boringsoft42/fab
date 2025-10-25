-- ============================================
-- MIGRATION: Setup RLS Policies for FAB System
-- ============================================
-- This migration sets up all Row Level Security policies
-- Run this ONCE in Supabase SQL Editor or via migration tool

-- ============================================
-- 1. ASOCIACIONES
-- ============================================

ALTER TABLE asociaciones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "admin_fab_all_asociaciones" ON asociaciones;
DROP POLICY IF EXISTS "public_read_asociaciones_activas" ON asociaciones;

-- admin_fab can do everything
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

-- Everyone (including anon) can read active asociaciones
CREATE POLICY "public_read_asociaciones_activas" ON asociaciones
FOR SELECT
TO anon, authenticated
USING (estado = true);

-- ============================================
-- 2. USERS
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_users" ON users;
DROP POLICY IF EXISTS "users_read_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;

-- admin_fab can do everything
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

-- Users can read their own record
CREATE POLICY "users_read_own" ON users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can update their own record
CREATE POLICY "users_update_own" ON users
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can insert their own record (sign-up)
CREATE POLICY "users_insert_own" ON users
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 3. ATLETAS
-- ============================================

ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_atletas" ON atletas;
DROP POLICY IF EXISTS "atletas_read_own" ON atletas;
DROP POLICY IF EXISTS "atletas_insert_own" ON atletas;
DROP POLICY IF EXISTS "atletas_update_own_pending" ON atletas;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_atletas" ON atletas
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Atletas can read their own profile
CREATE POLICY "atletas_read_own" ON atletas
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Atletas can insert their own profile
CREATE POLICY "atletas_insert_own" ON atletas
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Atletas can update their own profile (only if estado = pendiente)
CREATE POLICY "atletas_update_own_pending" ON atletas
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND estado = 'pendiente'
);

-- ============================================
-- 4. ENTRENADORES
-- ============================================

ALTER TABLE entrenadores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_entrenadores" ON entrenadores;
DROP POLICY IF EXISTS "entrenadores_read_own" ON entrenadores;
DROP POLICY IF EXISTS "entrenadores_insert_own" ON entrenadores;
DROP POLICY IF EXISTS "entrenadores_update_own_pending" ON entrenadores;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_entrenadores" ON entrenadores
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Entrenadores can read their own profile
CREATE POLICY "entrenadores_read_own" ON entrenadores
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Entrenadores can insert their own profile
CREATE POLICY "entrenadores_insert_own" ON entrenadores
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Entrenadores can update their own profile (only if estado = pendiente)
CREATE POLICY "entrenadores_update_own_pending" ON entrenadores
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND estado = 'pendiente'
);

-- ============================================
-- 5. JUECES
-- ============================================

ALTER TABLE jueces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_jueces" ON jueces;
DROP POLICY IF EXISTS "jueces_read_own" ON jueces;
DROP POLICY IF EXISTS "jueces_insert_own" ON jueces;
DROP POLICY IF EXISTS "jueces_update_own_pending" ON jueces;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_jueces" ON jueces
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Jueces can read their own profile
CREATE POLICY "jueces_read_own" ON jueces
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Jueces can insert their own profile
CREATE POLICY "jueces_insert_own" ON jueces
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Jueces can update their own profile (only if estado = pendiente)
CREATE POLICY "jueces_update_own_pending" ON jueces
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  AND estado = 'pendiente'
);

-- ============================================
-- 6. EVENTOS
-- ============================================

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_eventos" ON eventos;
DROP POLICY IF EXISTS "authenticated_read_eventos_aprobados" ON eventos;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_eventos" ON eventos
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- All authenticated users can read approved events
CREATE POLICY "authenticated_read_eventos_aprobados" ON eventos
FOR SELECT
TO authenticated
USING (estado = 'aprobado');

-- ============================================
-- 7. PAGOS
-- ============================================

ALTER TABLE pagos_evento_asociacion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_pagos" ON pagos_evento_asociacion;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_pagos" ON pagos_evento_asociacion
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- ============================================
-- 8. INSCRIPCIONES
-- ============================================

ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_inscripciones" ON inscripciones;
DROP POLICY IF EXISTS "atletas_read_own_inscripciones" ON inscripciones;
DROP POLICY IF EXISTS "atletas_insert_inscripciones" ON inscripciones;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_inscripciones" ON inscripciones
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Atletas can read their own inscriptions
CREATE POLICY "atletas_read_own_inscripciones" ON inscripciones
FOR SELECT
TO authenticated
USING (atleta_id = auth.uid());

-- Atletas can create inscriptions
CREATE POLICY "atletas_insert_inscripciones" ON inscripciones
FOR INSERT
TO authenticated
WITH CHECK (atleta_id = auth.uid());

-- ============================================
-- 9. DORSALES
-- ============================================

ALTER TABLE dorsales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_fab_all_dorsales" ON dorsales;
DROP POLICY IF EXISTS "atletas_read_own_dorsales" ON dorsales;

-- admin_fab can do everything
CREATE POLICY "admin_fab_all_dorsales" ON dorsales
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.user_id = auth.uid()
    AND users.rol = 'admin_fab'
  )
);

-- Atletas can read their own dorsales
CREATE POLICY "atletas_read_own_dorsales" ON dorsales
FOR SELECT
TO authenticated
USING (atleta_id = auth.uid());

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify all policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
