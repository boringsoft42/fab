-- FAB 2025 – DB Schema & RLS (vRef-2025-10-24)
-- Fuente: PRD (Arquitectura de Datos) + Correcciones del 2025-10-24
-- Cambios incorporados:
-- 1) Asociaciones: 9 (una por departamento).
-- 2) Resultados: FUERA DE ALCANCE (no crear tablas de resultados).
-- 3) Perfiles completos: ATLETA, ENTRENADOR, JUEZ con campos detallados.
-- 4) Perfil self-service: los usuarios pueden actualizar su perfil EXCEPTO "Datos personales".
-- 5) Eventos de tipo: federativo | asociacion. Flujo federativo: la asociación PRE-APRUEBA atletas → calcula monto → paga → FAB verifica manualmente → dorsal.
-- 6) Pagos verificados manualmente por FAB (externo); la plataforma SOLO registra y marca verificación.

-- =============================================================
-- EXTENSIONES Y ESQUEMA
-- =============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;    -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- uuid_generate_v4()

-- =============================================================
-- ENUMS / TIPOS
-- =============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_enum') THEN
    CREATE TYPE rol_enum AS ENUM ('admin_fab','admin_asociacion','atleta','entrenador','juez');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_usuario_enum') THEN
    CREATE TYPE estado_usuario_enum AS ENUM ('pendiente','activo','inactivo','rechazado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'genero_enum') THEN
    CREATE TYPE genero_enum AS ENUM ('M','F');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_evento_enum') THEN
    CREATE TYPE tipo_evento_enum AS ENUM ('federativo','asociacion');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_evento_enum') THEN
    CREATE TYPE estado_evento_enum AS ENUM ('borrador','en_revision','aprobado','rechazado','finalizado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_pago_enum') THEN
    CREATE TYPE estado_pago_enum AS ENUM ('pendiente','verificado','observado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_insc_assoc_enum') THEN
    CREATE TYPE estado_insc_assoc_enum AS ENUM ('pendiente','aprobada','rechazada');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_startlist_enum') THEN
    CREATE TYPE estado_startlist_enum AS ENUM ('borrador','finalizada');
  END IF;
END $$;

-- =============================================================
-- TABLA: asociaciones (9 departamentos)
-- =============================================================
CREATE TABLE IF NOT EXISTS asociaciones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT NOT NULL UNIQUE,         -- Nombre del departamento (sin "ASO")
  departamento  TEXT NOT NULL,                -- Igual que nombre (redundante para claridad)
  ciudad        TEXT,
  contacto      TEXT,
  email         TEXT,
  telefono      TEXT,
  estado        BOOLEAN NOT NULL DEFAULT TRUE, -- activo/inactivo
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Semillas (idempotentes): 9 departamentos de Bolivia
INSERT INTO asociaciones (nombre, departamento)
VALUES
  ('La Paz','La Paz'),
  ('Cochabamba','Cochabamba'),
  ('Santa Cruz','Santa Cruz'),
  ('Chuquisaca','Chuquisaca'),
  ('Tarija','Tarija'),
  ('Oruro','Oruro'),
  ('Potosí','Potosí'),
  ('Beni','Beni'),
  ('Pando','Pando')
ON CONFLICT (nombre) DO NOTHING;

-- =============================================================
-- TABLA: users (central, referencia a auth.users.id)
-- =============================================================
CREATE TABLE IF NOT EXISTS users (
  user_id       UUID PRIMARY KEY,                 -- FK a auth.users.id
  rol           rol_enum NOT NULL,
  estado        estado_usuario_enum NOT NULL DEFAULT 'pendiente',
  asociacion_id UUID NOT NULL REFERENCES asociaciones(id) ON UPDATE CASCADE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_asociacion ON users(asociacion_id);
CREATE INDEX IF NOT EXISTS idx_users_estado ON users(estado);

-- =============================================================
-- COMMON: restricciones para perfiles (datos personales bloqueados para self-service)
-- Se aplicará vía RLS (policies de UPDATE que exigen OLD=NEW para columnas bloqueadas)

-- =============================================================
-- TABLA: atletas (perfil)
-- =============================================================
CREATE TABLE IF NOT EXISTS atletas (
  user_id            UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,

  -- Datos Personales Básicos (BLOQUEADOS para auto-edición)
  nombre             TEXT NOT NULL,
  apellido           TEXT NOT NULL,
  ci                 TEXT NOT NULL UNIQUE,
  fecha_nacimiento   DATE NOT NULL,
  genero             genero_enum NOT NULL,
  nacionalidad       TEXT NOT NULL,
  estado_civil       TEXT, -- opcional

  -- Datos de Contacto (EDITABLE por el usuario)
  telefono           TEXT NOT NULL,
  email              TEXT NOT NULL UNIQUE,
  direccion          TEXT NOT NULL,
  ciudad_residencia  TEXT NOT NULL,
  departamento_residencia TEXT NOT NULL,

  -- Datos Federativos
  asociacion_id      UUID NOT NULL REFERENCES asociaciones(id) ON UPDATE CASCADE,
  municipio          TEXT,                                  -- solo si no es Santa Cruz (ver trigger)
  categoria_fab      TEXT NOT NULL,                          -- calculada automáticamente
  especialidad       TEXT NOT NULL,
  anios_practica     INTEGER,

  -- Datos Físicos y Deportivos
  altura_cm          INTEGER CHECK (altura_cm IS NULL OR (altura_cm BETWEEN 130 AND 250)),
  peso_kg            NUMERIC(5,2) CHECK (peso_kg IS NULL OR (peso_kg BETWEEN 25 AND 180)),
  talla_camiseta     TEXT,
  talla_pantalon     TEXT,
  talla_zapatos      TEXT,
  tipo_sangre        TEXT NOT NULL,
  marca_personal_mejor TEXT,
  evento_de_la_marca   TEXT,
  fecha_de_la_marca    DATE,

  -- Emergencia
  contacto_emergencia   TEXT NOT NULL,
  telefono_emergencia   TEXT NOT NULL,
  parentesco_emergencia TEXT NOT NULL,

  -- Documentos y Archivos (usar Storage con RLS por path)
  foto_url           TEXT NOT NULL,
  ci_frente_url      TEXT NOT NULL,
  ci_reverso_url     TEXT NOT NULL,
  certificado_medico_url  TEXT,
  carnet_vacunacion_url   TEXT,

  -- Sistema
  estado             estado_usuario_enum NOT NULL DEFAULT 'pendiente',
  fecha_registro     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aprobado_por_fab   UUID REFERENCES users(user_id),
  fecha_aprobacion   TIMESTAMP WITH TIME ZONE,
  observaciones      TEXT,

  created_at         TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_atletas_asociacion ON atletas(asociacion_id);
CREATE INDEX IF NOT EXISTS idx_atletas_categoria ON atletas(categoria_fab);

-- Trigger: municipio obligatorio solo si asociacion != 'Santa Cruz'
CREATE OR REPLACE FUNCTION enforce_municipio_atleta()
RETURNS TRIGGER AS $$
DECLARE
  aso TEXT;
BEGIN
  SELECT nombre INTO aso FROM asociaciones WHERE id = NEW.asociacion_id;
  IF aso IS DISTINCT FROM 'Santa Cruz' THEN
    IF NEW.municipio IS NULL OR length(trim(NEW.municipio)) = 0 THEN
      RAISE EXCEPTION 'municipio es obligatorio para asociaciones distintas de Santa Cruz';
    END IF;
  ELSE
    -- En Santa Cruz, municipio debe ser NULL
    NEW.municipio := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_enforce_municipio_atleta ON atletas;
CREATE TRIGGER trg_enforce_municipio_atleta
BEFORE INSERT OR UPDATE ON atletas
FOR EACH ROW EXECUTE FUNCTION enforce_municipio_atleta();

-- Trigger: cálculo de categoría FAB (por edad actual). Ajustable a "por temporada" si se requiere.
CREATE OR REPLACE FUNCTION fab_calcular_categoria_fn(dob DATE)
RETURNS TEXT AS $$
DECLARE
  edad INTEGER;
BEGIN
  edad := date_part('year', age(current_date, dob));
  IF edad >= 23 THEN RETURN 'Mayores';
  ELSIF edad BETWEEN 21 AND 22 THEN RETURN 'U23';
  ELSIF edad BETWEEN 18 AND 20 THEN RETURN 'U20';
  ELSIF edad BETWEEN 16 AND 17 THEN RETURN 'Menores';
  ELSIF edad BETWEEN 14 AND 15 THEN RETURN 'U16';
  ELSIF edad BETWEEN 12 AND 13 THEN RETURN 'U14';
  ELSIF edad BETWEEN 8  AND 9  THEN RETURN 'U10';
  ELSE RETURN 'U8';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION atletas_set_categoria()
RETURNS TRIGGER AS $$
BEGIN
  NEW.categoria_fab := fab_calcular_categoria_fn(NEW.fecha_nacimiento);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_atletas_set_categoria ON atletas;
CREATE TRIGGER trg_atletas_set_categoria
BEFORE INSERT OR UPDATE OF fecha_nacimiento ON atletas
FOR EACH ROW EXECUTE FUNCTION atletas_set_categoria();

-- =============================================================
-- TABLA: entrenadores (perfil)
-- =============================================================
CREATE TABLE IF NOT EXISTS entrenadores (
  user_id            UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,

  -- Datos Personales (BLOQUEADOS)
  nombre             TEXT NOT NULL,
  apellido           TEXT NOT NULL,
  ci                 TEXT NOT NULL UNIQUE,
  fecha_nacimiento   DATE NOT NULL,
  genero             genero_enum NOT NULL,
  nacionalidad       TEXT NOT NULL,
  estado_civil       TEXT,

  -- Contacto (EDITABLE)
  telefono           TEXT NOT NULL,
  email              TEXT NOT NULL UNIQUE,
  direccion          TEXT NOT NULL,
  ciudad_residencia  TEXT NOT NULL,
  departamento_residencia TEXT NOT NULL,

  -- Profesionales
  asociacion_id      UUID NOT NULL REFERENCES asociaciones(id) ON UPDATE CASCADE,
  especialidad       TEXT NOT NULL,
  anios_experiencia  INTEGER NOT NULL,
  certificaciones    TEXT,
  titulos_deportivos TEXT,

  -- Físicos
  altura_cm          INTEGER,
  peso_kg            NUMERIC(5,2),
  tipo_sangre        TEXT NOT NULL,

  -- Emergencia
  contacto_emergencia   TEXT NOT NULL,
  telefono_emergencia   TEXT NOT NULL,
  parentesco_emergencia TEXT NOT NULL,

  -- Documentos
  foto_url           TEXT NOT NULL,
  ci_frente_url      TEXT NOT NULL,
  ci_reverso_url     TEXT NOT NULL,
  certificado_medico_url  TEXT,
  titulos_profesionales_url TEXT,
  certificaciones_deportivas_url TEXT,

  -- Sistema
  estado             estado_usuario_enum NOT NULL DEFAULT 'pendiente',
  fecha_registro     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aprobado_por_fab   UUID REFERENCES users(user_id),
  fecha_aprobacion   TIMESTAMP WITH TIME ZONE,
  observaciones      TEXT,

  created_at         TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_entrenadores_asociacion ON entrenadores(asociacion_id);

-- =============================================================
-- TABLA: jueces (perfil)
-- =============================================================
CREATE TABLE IF NOT EXISTS jueces (
  user_id            UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,

  -- Datos Personales (BLOQUEADOS)
  nombre             TEXT NOT NULL,
  apellido           TEXT NOT NULL,
  ci                 TEXT NOT NULL UNIQUE,
  fecha_nacimiento   DATE NOT NULL,
  genero             genero_enum NOT NULL,
  nacionalidad       TEXT NOT NULL,
  estado_civil       TEXT,

  -- Contacto (EDITABLE)
  telefono           TEXT NOT NULL,
  email              TEXT NOT NULL UNIQUE,
  direccion          TEXT NOT NULL,
  ciudad_residencia  TEXT NOT NULL,
  departamento_residencia TEXT NOT NULL,

  -- Profesionales
  asociacion_id      UUID NOT NULL REFERENCES asociaciones(id) ON UPDATE CASCADE,
  especialidad       TEXT NOT NULL,
  anios_experiencia  INTEGER NOT NULL,
  nivel_juez         TEXT NOT NULL, -- nacional/internacional
  certificaciones    TEXT,
  eventos_juzgados   TEXT,

  -- Físicos
  altura_cm          INTEGER,
  peso_kg            NUMERIC(5,2),
  tipo_sangre        TEXT NOT NULL,

  -- Emergencia
  contacto_emergencia   TEXT NOT NULL,
  telefono_emergencia   TEXT NOT NULL,
  parentesco_emergencia TEXT NOT NULL,

  -- Documentos
  foto_url           TEXT NOT NULL,
  ci_frente_url      TEXT NOT NULL,
  ci_reverso_url     TEXT NOT NULL,
  certificado_medico_url  TEXT,
  certificaciones_juez_url TEXT,
  licencia_juez_url      TEXT,

  -- Sistema
  estado             estado_usuario_enum NOT NULL DEFAULT 'pendiente',
  fecha_registro     TIMESTAMP WITH TIME ZONE DEFAULT now(),
  aprobado_por_fab   UUID REFERENCES users(user_id),
  fecha_aprobacion   TIMESTAMP WITH TIME ZONE,
  observaciones      TEXT,

  created_at         TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jueces_asociacion ON jueces(asociacion_id);

-- =============================================================
-- TABLAS: eventos, pruebas, inscripciones
-- =============================================================
CREATE TABLE IF NOT EXISTS eventos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           TEXT NOT NULL,
  tipo             tipo_evento_enum NOT NULL,
  estado           estado_evento_enum NOT NULL DEFAULT 'borrador',
  descripcion      TEXT,
  logo_url         TEXT,

  ciudad           TEXT NOT NULL,
  lugar            TEXT NOT NULL,
  direccion        TEXT NOT NULL,
  fecha_evento     DATE NOT NULL,
  hora_inicio      TIME NOT NULL,
  hora_fin         TIME,
  fecha_insc_inicio DATE NOT NULL,
  fecha_insc_fin    DATE NOT NULL,

  limite_participantes INTEGER,
  limite_por_prueba   INTEGER,
  limite_por_asociacion INTEGER,
  edad_minima       INTEGER,
  edad_maxima       INTEGER,
  genero_permitido  TEXT NOT NULL, -- 'M' | 'F' | 'Mixto'

  costo_fab         NUMERIC(12,2), -- obligatorio si federativo (validación app/trigger)
  costo_por_atleta  NUMERIC(12,2),
  requiere_pago     BOOLEAN NOT NULL DEFAULT FALSE,
  banco             TEXT,
  numero_cuenta     TEXT,
  titular_cuenta    TEXT,
  qr_pago_url       TEXT,

  asociacion_creadora_id UUID REFERENCES asociaciones(id) ON UPDATE CASCADE,
  creado_por_user   UUID REFERENCES users(user_id),
  creado_por_rol    rol_enum,
  director_tecnico  TEXT,
  jefe_competencia  TEXT,
  comisario         TEXT,

  created_at        TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_fechas ON eventos(fecha_evento, fecha_insc_inicio, fecha_insc_fin);

CREATE TABLE IF NOT EXISTS pruebas (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  nombre           TEXT NOT NULL,
  categoria_fab    TEXT NOT NULL,
  genero           TEXT NOT NULL, -- 'M'|'F'|'Mixto'
  distancia        TEXT NOT NULL,

  es_con_carriles  BOOLEAN NOT NULL,
  numero_carriles  INTEGER,
  es_campo         BOOLEAN NOT NULL,
  es_pista         BOOLEAN NOT NULL,
  es_fondo         BOOLEAN NOT NULL,

  limite_participantes INTEGER,
  tiempo_limite    TEXT,
  marca_minima     TEXT,
  marca_maxima     TEXT,
  edad_minima      INTEGER,
  edad_maxima      INTEGER,

  hora_inicio      TIME,
  hora_fin         TIME,
  duracion_estimada INTERVAL,
  orden_competencia INTEGER,

  estado           TEXT NOT NULL DEFAULT 'activa', -- activa/inactiva
  observaciones    TEXT,

  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pruebas_evento ON pruebas(evento_id);

CREATE TABLE IF NOT EXISTS inscripciones (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id            UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  prueba_id            UUID NOT NULL REFERENCES pruebas(id) ON DELETE CASCADE,
  atleta_id            UUID NOT NULL REFERENCES atletas(user_id) ON DELETE CASCADE,

  categoria_atleta     TEXT NOT NULL, -- calculada
  marca_previa         TEXT,
  mejor_marca_personal TEXT,
  fecha_mejor_marca    DATE,

  -- Estados (flujo federativo)
  estado_asociacion    estado_insc_assoc_enum NOT NULL DEFAULT 'pendiente',
  aprobado_por_asociacion UUID REFERENCES users(user_id),
  fecha_aprobacion_asociacion TIMESTAMP WITH TIME ZONE,

  estado_fab           estado_insc_assoc_enum NOT NULL DEFAULT 'pendiente',
  aprobado_por_fab     UUID REFERENCES users(user_id),
  fecha_aprobacion_fab TIMESTAMP WITH TIME ZONE,

  -- Pago
  pago_verificado      BOOLEAN NOT NULL DEFAULT FALSE,
  metodo_pago          TEXT,
  comprobante_pago_url TEXT,
  fecha_pago           TIMESTAMP WITH TIME ZONE,

  -- Dorsal (se asigna SOLO cuando pago_verificado = true si federativo)
  dorsal_asignado      INTEGER,
  fecha_asignacion_dorsal TIMESTAMP WITH TIME ZONE,
  dorsal_asignado_por  UUID REFERENCES users(user_id),

  fecha_inscripcion    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  fecha_actualizacion  TIMESTAMP WITH TIME ZONE DEFAULT now(),
  observaciones        TEXT,
  motivo_rechazo       TEXT,

  UNIQUE (evento_id, prueba_id, atleta_id)
);
CREATE INDEX IF NOT EXISTS idx_insc_evento ON inscripciones(evento_id);
CREATE INDEX IF NOT EXISTS idx_insc_prueba ON inscripciones(prueba_id);
CREATE INDEX IF NOT EXISTS idx_insc_atleta ON inscripciones(atleta_id);
CREATE INDEX IF NOT EXISTS idx_insc_estado_assoc ON inscripciones(estado_asociacion);
CREATE INDEX IF NOT EXISTS idx_insc_pago ON inscripciones(pago_verificado);

-- =============================================================
-- TABLA: dorsales (únicos por evento)
-- =============================================================
CREATE TABLE IF NOT EXISTS dorsales (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  atleta_id        UUID NOT NULL REFERENCES atletas(user_id) ON DELETE CASCADE,
  numero           INTEGER NOT NULL,
  estado           TEXT NOT NULL DEFAULT 'activo', -- activo/inactivo
  fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT now(),
  asignado_por     UUID REFERENCES users(user_id),
  UNIQUE (evento_id, numero),
  UNIQUE (evento_id, atleta_id)
);
CREATE INDEX IF NOT EXISTS idx_dorsales_evento ON dorsales(evento_id);

-- =============================================================
-- TABLA: pagos_evento_asociacion (verificación manual por FAB)
-- =============================================================
CREATE TABLE IF NOT EXISTS pagos_evento_asociacion (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asociacion_id      UUID NOT NULL REFERENCES asociaciones(id) ON UPDATE CASCADE,
  evento_id          UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,

  monto              NUMERIC(12,2) NOT NULL,
  estado_pago        estado_pago_enum NOT NULL DEFAULT 'pendiente',
  comprobante_url    TEXT,
  fecha_pago         TIMESTAMP WITH TIME ZONE,
  metodo_pago        TEXT,

  verificado_por     UUID REFERENCES users(user_id), -- debe ser admin_fab
  fecha_verificacion TIMESTAMP WITH TIME ZONE,
  observaciones      TEXT,

  created_at         TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE (asociacion_id, evento_id)
);
CREATE INDEX IF NOT EXISTS idx_pagos_asoc_evento ON pagos_evento_asociacion(asociacion_id, evento_id);

-- =============================================================
-- STARTLISTS
-- =============================================================
CREATE TABLE IF NOT EXISTS startlists (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id        UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  prueba_id        UUID NOT NULL REFERENCES pruebas(id) ON DELETE CASCADE,
  nombre           TEXT NOT NULL,
  tipo             TEXT NOT NULL, -- 'serie'|'lista'
  indice           INTEGER NOT NULL, -- orden de la serie/lista
  numero_carriles  INTEGER,
  estado           estado_startlist_enum NOT NULL DEFAULT 'borrador',
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_startlists_unique ON startlists(evento_id, prueba_id, indice);

CREATE TABLE IF NOT EXISTS startlist_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startlist_id     UUID NOT NULL REFERENCES startlists(id) ON DELETE CASCADE,
  dorsal_id        UUID NOT NULL REFERENCES dorsales(id) ON DELETE CASCADE,
  atleta_id        UUID NOT NULL REFERENCES atletas(user_id) ON DELETE CASCADE,

  carril           INTEGER,           -- obligatorio si es con carriles (validación app)
  posicion_salida  INTEGER,
  orden            INTEGER NOT NULL,
  semilla          TEXT,

  -- Campos de presentación (denormalizados opcionales)
  nombre_completo  TEXT,
  apellido_completo TEXT,
  asociacion_nombre TEXT,
  categoria_atleta  TEXT,

  es_con_carriles   BOOLEAN,
  numero_carriles_disponibles INTEGER,

  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_startlist_items_startlist ON startlist_items(startlist_id);
CREATE INDEX IF NOT EXISTS idx_startlist_items_orden ON startlist_items(orden);

-- =============================================================
-- FUNCIONES AUXILIARES
-- =============================================================
-- Asignación segura de dorsal: intenta insertar en dorsales y refleja en inscripciones (opcional)
CREATE OR REPLACE FUNCTION asignar_dorsal(_evento UUID, _atleta UUID, _numero INT, _by UUID)
RETURNS UUID AS $$
DECLARE
  _id UUID;
BEGIN
  INSERT INTO dorsales(evento_id, atleta_id, numero, asignado_por)
  VALUES(_evento, _atleta, _numero, _by)
  RETURNING id INTO _id;
  RETURN _id;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'Dorsal % ya asignado para evento %', _numero, _evento;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- RLS: ACTIVACIÓN GENERAL
-- =============================================================
ALTER TABLE asociaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrenadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE jueces ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pruebas ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE dorsales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos_evento_asociacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE startlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE startlist_items ENABLE ROW LEVEL SECURITY;

-- Helper: función para obtener la asociacion del usuario autenticado
CREATE OR REPLACE FUNCTION me_asociacion_id()
RETURNS UUID AS $$
  SELECT asociacion_id FROM users WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE;

-- =============================================================
-- POLÍTICAS RLS (resumen mínimo funcional)
-- Nota: Ajustar según necesidades de lectura pública de eventos publicados si aplica.
-- =============================================================

-- users
DROP POLICY IF EXISTS sel_users_self_or_admin ON users;
CREATE POLICY sel_users_self_or_admin ON users
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM users u2 WHERE u2.user_id = auth.uid() AND u2.rol IN ('admin_fab','admin_asociacion'))
  );

DROP POLICY IF EXISTS upd_users_admins ON users;
CREATE POLICY upd_users_admins ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users u2 WHERE u2.user_id = auth.uid() AND u2.rol IN ('admin_fab','admin_asociacion'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM users u2 WHERE u2.user_id = auth.uid() AND u2.rol IN ('admin_fab','admin_asociacion'))
  );

-- atletas: SELECT propietario, su admin_asociacion, admin_fab
DROP POLICY IF EXISTS sel_atletas ON atletas;
CREATE POLICY sel_atletas ON atletas
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    (SELECT asociacion_id FROM users WHERE user_id = auth.uid()) = asociacion_id
  );

-- atletas: UPDATE propietario (solo campos NO personales) o admin_fab (todo)
DROP POLICY IF EXISTS upd_atletas_self_or_fab ON atletas;
CREATE POLICY upd_atletas_self_or_fab ON atletas
  FOR UPDATE USING (
    auth.uid() = user_id OR (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab'
  ) WITH CHECK (true);

-- Trigger para proteger datos personales de atletas
CREATE OR REPLACE FUNCTION protect_atleta_personal_data()
RETURNS TRIGGER AS $$
DECLARE
  user_rol rol_enum;
BEGIN
  SELECT rol INTO user_rol FROM users WHERE user_id = auth.uid();

  -- Solo admin_fab puede modificar datos personales
  IF user_rol != 'admin_fab' THEN
    IF NEW.nombre IS DISTINCT FROM OLD.nombre OR
       NEW.apellido IS DISTINCT FROM OLD.apellido OR
       NEW.ci IS DISTINCT FROM OLD.ci OR
       NEW.fecha_nacimiento IS DISTINCT FROM OLD.fecha_nacimiento OR
       NEW.genero IS DISTINCT FROM OLD.genero OR
       NEW.nacionalidad IS DISTINCT FROM OLD.nacionalidad THEN
      RAISE EXCEPTION 'Solo admin_fab puede modificar datos personales (nombre, apellido, CI, fecha_nacimiento, género, nacionalidad)';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_atleta_personal_data ON atletas;
CREATE TRIGGER trg_protect_atleta_personal_data
BEFORE UPDATE ON atletas
FOR EACH ROW EXECUTE FUNCTION protect_atleta_personal_data();

-- entrenadores (mismas políticas que atletas)
DROP POLICY IF EXISTS sel_entrenadores ON entrenadores;
CREATE POLICY sel_entrenadores ON entrenadores
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    (SELECT asociacion_id FROM users WHERE user_id = auth.uid()) = asociacion_id
  );

DROP POLICY IF EXISTS upd_entrenadores_self_or_fab ON entrenadores;
CREATE POLICY upd_entrenadores_self_or_fab ON entrenadores
  FOR UPDATE USING (
    auth.uid() = user_id OR (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab'
  ) WITH CHECK (true);

-- Trigger para proteger datos personales de entrenadores
CREATE OR REPLACE FUNCTION protect_entrenador_personal_data()
RETURNS TRIGGER AS $$
DECLARE
  user_rol rol_enum;
BEGIN
  SELECT rol INTO user_rol FROM users WHERE user_id = auth.uid();

  -- Solo admin_fab puede modificar datos personales
  IF user_rol != 'admin_fab' THEN
    IF NEW.nombre IS DISTINCT FROM OLD.nombre OR
       NEW.apellido IS DISTINCT FROM OLD.apellido OR
       NEW.ci IS DISTINCT FROM OLD.ci OR
       NEW.fecha_nacimiento IS DISTINCT FROM OLD.fecha_nacimiento OR
       NEW.genero IS DISTINCT FROM OLD.genero OR
       NEW.nacionalidad IS DISTINCT FROM OLD.nacionalidad THEN
      RAISE EXCEPTION 'Solo admin_fab puede modificar datos personales (nombre, apellido, CI, fecha_nacimiento, género, nacionalidad)';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_entrenador_personal_data ON entrenadores;
CREATE TRIGGER trg_protect_entrenador_personal_data
BEFORE UPDATE ON entrenadores
FOR EACH ROW EXECUTE FUNCTION protect_entrenador_personal_data();

-- jueces (mismas políticas)
DROP POLICY IF EXISTS sel_jueces ON jueces;
CREATE POLICY sel_jueces ON jueces
  FOR SELECT USING (
    auth.uid() = user_id OR
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    (SELECT asociacion_id FROM users WHERE user_id = auth.uid()) = asociacion_id
  );

DROP POLICY IF EXISTS upd_jueces_self_or_fab ON jueces;
CREATE POLICY upd_jueces_self_or_fab ON jueces
  FOR UPDATE USING (
    auth.uid() = user_id OR (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab'
  ) WITH CHECK (true);

-- Trigger para proteger datos personales de jueces
CREATE OR REPLACE FUNCTION protect_juez_personal_data()
RETURNS TRIGGER AS $$
DECLARE
  user_rol rol_enum;
BEGIN
  SELECT rol INTO user_rol FROM users WHERE user_id = auth.uid();

  -- Solo admin_fab puede modificar datos personales
  IF user_rol != 'admin_fab' THEN
    IF NEW.nombre IS DISTINCT FROM OLD.nombre OR
       NEW.apellido IS DISTINCT FROM OLD.apellido OR
       NEW.ci IS DISTINCT FROM OLD.ci OR
       NEW.fecha_nacimiento IS DISTINCT FROM OLD.fecha_nacimiento OR
       NEW.genero IS DISTINCT FROM OLD.genero OR
       NEW.nacionalidad IS DISTINCT FROM OLD.nacionalidad THEN
      RAISE EXCEPTION 'Solo admin_fab puede modificar datos personales (nombre, apellido, CI, fecha_nacimiento, género, nacionalidad)';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_juez_personal_data ON jueces;
CREATE TRIGGER trg_protect_juez_personal_data
BEFORE UPDATE ON jueces
FOR EACH ROW EXECUTE FUNCTION protect_juez_personal_data();

-- eventos: lectura por asociación o global si así se define; aquí restringimos por creador/asociación o admin_fab
DROP POLICY IF EXISTS sel_eventos ON eventos;
CREATE POLICY sel_eventos ON eventos
  FOR SELECT USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    asociacion_creadora_id = me_asociacion_id()
  );

DROP POLICY IF EXISTS ins_eventos_admins ON eventos;
CREATE POLICY ins_eventos_admins ON eventos
  FOR INSERT WITH CHECK (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion')
  );

DROP POLICY IF EXISTS upd_eventos_admins ON eventos;
CREATE POLICY upd_eventos_admins ON eventos
  FOR UPDATE USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion') AND
    ( (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR asociacion_creadora_id = me_asociacion_id() )
  ) WITH CHECK (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion')
  );

-- pruebas: similar a eventos (por evento)
DROP POLICY IF EXISTS sel_pruebas ON pruebas;
CREATE POLICY sel_pruebas ON pruebas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM eventos e WHERE e.id = pruebas.evento_id AND (
      (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
      e.asociacion_creadora_id = me_asociacion_id()
    ))
  );

DROP POLICY IF EXISTS ins_pruebas_admins ON pruebas;
CREATE POLICY ins_pruebas_admins ON pruebas
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM eventos e WHERE e.id = pruebas.evento_id AND (
      (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion') AND
      ( (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR e.asociacion_creadora_id = me_asociacion_id() )
    ))
  );

DROP POLICY IF EXISTS upd_pruebas_admins ON pruebas;
CREATE POLICY upd_pruebas_admins ON pruebas
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM eventos e WHERE e.id = pruebas.evento_id AND (
      (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion') AND
      ( (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR e.asociacion_creadora_id = me_asociacion_id() )
    ))
  ) WITH CHECK (true);

-- inscripciones: atleta crea/lee las suyas; admin_asociacion gestiona de su asociación; admin_fab total
DROP POLICY IF EXISTS sel_inscripciones ON inscripciones;
CREATE POLICY sel_inscripciones ON inscripciones
  FOR SELECT USING (
    atleta_id = auth.uid() OR
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    EXISTS (
      SELECT 1 FROM atletas a
      WHERE a.user_id = inscripciones.atleta_id
        AND a.asociacion_id = me_asociacion_id()
    )
  );

DROP POLICY IF EXISTS ins_inscripciones_atleta ON inscripciones;
CREATE POLICY ins_inscripciones_atleta ON inscripciones
  FOR INSERT WITH CHECK (
    atleta_id = auth.uid()
  );

-- Aprobación por asociación (solo admins de la misma asociación)
DROP POLICY IF EXISTS upd_inscripciones_assoc ON inscripciones;
CREATE POLICY upd_inscripciones_assoc ON inscripciones
  FOR UPDATE USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_asociacion','admin_fab') AND
    EXISTS (
      SELECT 1 FROM atletas a
      WHERE a.user_id = inscripciones.atleta_id
        AND ( (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR a.asociacion_id = me_asociacion_id() )
    )
  ) WITH CHECK (true);

-- dorsales: visible a admin_fab, admin_asociacion del evento y al propietario del dorsal (atleta)
DROP POLICY IF EXISTS sel_dorsales ON dorsales;
CREATE POLICY sel_dorsales ON dorsales
  FOR SELECT USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    EXISTS (
      SELECT 1 FROM atletas a
      JOIN inscripciones i ON i.atleta_id = a.user_id AND i.evento_id = dorsales.evento_id
      WHERE a.user_id = auth.uid() OR a.asociacion_id = me_asociacion_id()
    )
  );

-- pagos_evento_asociacion: leer propia asociación; escribir asociación (comprobante); verificar FAB
DROP POLICY IF EXISTS sel_pagos_evento_asoc ON pagos_evento_asociacion;
CREATE POLICY sel_pagos_evento_asoc ON pagos_evento_asociacion
  FOR SELECT USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    asociacion_id = me_asociacion_id()
  );

DROP POLICY IF EXISTS ins_pagos_evento_asoc_assoc ON pagos_evento_asociacion;
CREATE POLICY ins_pagos_evento_asoc_assoc ON pagos_evento_asociacion
  FOR INSERT WITH CHECK (
    asociacion_id = me_asociacion_id() AND (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_asociacion'
  );

-- Política UPDATE para asociación (sin restricción de campos en WITH CHECK, se manejará con trigger)
DROP POLICY IF EXISTS upd_pagos_evento_asoc_assoc ON pagos_evento_asociacion;
CREATE POLICY upd_pagos_evento_asoc_assoc ON pagos_evento_asociacion
  FOR UPDATE USING (
    asociacion_id = me_asociacion_id() AND (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_asociacion'
  ) WITH CHECK (true);

-- Trigger para evitar que admin_asociacion modifique campos de verificación
CREATE OR REPLACE FUNCTION prevent_assoc_verify_payment()
RETURNS TRIGGER AS $$
DECLARE
  user_rol rol_enum;
BEGIN
  SELECT rol INTO user_rol FROM users WHERE user_id = auth.uid();

  -- Si el usuario es admin_asociacion, no puede cambiar estos campos
  IF user_rol = 'admin_asociacion' THEN
    IF NEW.estado_pago IS DISTINCT FROM OLD.estado_pago OR
       NEW.verificado_por IS DISTINCT FROM OLD.verificado_por OR
       NEW.fecha_verificacion IS DISTINCT FROM OLD.fecha_verificacion THEN
      RAISE EXCEPTION 'admin_asociacion no puede modificar campos de verificación';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_assoc_verify_payment ON pagos_evento_asociacion;
CREATE TRIGGER trg_prevent_assoc_verify_payment
BEFORE UPDATE ON pagos_evento_asociacion
FOR EACH ROW EXECUTE FUNCTION prevent_assoc_verify_payment();

DROP POLICY IF EXISTS verify_pagos_evento_asoc_fab ON pagos_evento_asociacion;
CREATE POLICY verify_pagos_evento_asoc_fab ON pagos_evento_asociacion
  FOR UPDATE USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab'
  ) WITH CHECK (
    -- FAB puede cambiar estado a verificado/observado y setear verificador
    true
  );

-- startlists y startlist_items: admins (asociación del evento) y FAB
DROP POLICY IF EXISTS sel_startlists ON startlists;
CREATE POLICY sel_startlists ON startlists
  FOR SELECT USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    EXISTS (SELECT 1 FROM eventos e WHERE e.id = startlists.evento_id AND e.asociacion_creadora_id = me_asociacion_id())
  );

DROP POLICY IF EXISTS ins_startlists_admins ON startlists;
CREATE POLICY ins_startlists_admins ON startlists
  FOR INSERT WITH CHECK (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion')
  );

DROP POLICY IF EXISTS upd_startlists_admins ON startlists;
CREATE POLICY upd_startlists_admins ON startlists
  FOR UPDATE USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion')
  ) WITH CHECK (true);

DROP POLICY IF EXISTS sel_startlist_items ON startlist_items;
CREATE POLICY sel_startlist_items ON startlist_items
  FOR SELECT USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) = 'admin_fab' OR
    EXISTS (
      SELECT 1 FROM startlists s
      JOIN eventos e ON e.id = s.evento_id
      WHERE s.id = startlist_id AND e.asociacion_creadora_id = me_asociacion_id()
    )
  );

DROP POLICY IF EXISTS ins_startlist_items_admins ON startlist_items;
CREATE POLICY ins_startlist_items_admins ON startlist_items
  FOR INSERT WITH CHECK (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion')
  );

DROP POLICY IF EXISTS upd_startlist_items_admins ON startlist_items;
CREATE POLICY upd_startlist_items_admins ON startlist_items
  FOR UPDATE USING (
    (SELECT rol FROM users WHERE user_id = auth.uid()) IN ('admin_fab','admin_asociacion')
  ) WITH CHECK (true);

-- =============================================================
-- FIN DEL SCHEMA
-- =============================================================
