# 🚀 Setup Rápido - FAB System

## ⚡ Pasos para configurar el sistema (Una sola vez)

### 1️⃣ Configurar RLS Policies en Supabase

Ve a **Supabase Dashboard** → **SQL Editor** y ejecuta:

📄 **`supabase/migrations/20250101000000_setup_rls_policies.sql`**

Este archivo configura TODAS las políticas de seguridad necesarias.

---

### 2️⃣ Crear Usuario Admin FAB

**En Supabase Dashboard:**
1. **Authentication** → **Users** → **Add user**
2. Email: `admin@fab.bo`
3. Password: `Admin123!`
4. ✅ Auto Confirm User

**En SQL Editor:**
```sql
-- Crear asociación "FAB Nacional" (para el admin)
INSERT INTO asociaciones (nombre, departamento, ciudad, contacto, email, telefono, estado)
VALUES ('FAB Nacional', 'La Paz', 'La Paz', 'FAB', 'admin@fab.bo', '2-2222222', true)
RETURNING id;

-- Vincular usuario (reemplaza los UUIDs)
INSERT INTO users (user_id, rol, estado, asociacion_id)
VALUES (
  'UUID_DEL_USUARIO_AUTH',
  'admin_fab',
  'activo',
  'UUID_DE_FAB_NACIONAL'
);
```

---

### 3️⃣ Crear las 9 Asociaciones Departamentales

**Login como admin_fab:**
- URL: `http://localhost:3000/sign-in`
- Email: `admin@fab.bo`
- Password: `Admin123!`

**Crear asociaciones:**
- Click en "Crear Asociación" en el sidebar
- Crea las 9 asociaciones: La Paz, Cochabamba, Santa Cruz, Chuquisaca, Tarija, Oruro, Potosí, Beni, Pando

---

### 4️⃣ ¡Listo!

Ahora puedes:
- ✅ Registrar usuarios públicos (atletas, entrenadores, jueces)
- ✅ El dropdown de asociaciones funciona automáticamente
- ✅ Los usuarios aparecen en "Usuarios Pendientes"
- ✅ Aprobar usuarios desde el dashboard admin_fab

---

## 🔧 Si algo no funciona

1. **Dropdown de asociaciones vacío**: Verifica que ejecutaste el script de RLS
2. **No aparecen usuarios pendientes**: Verifica las políticas RLS de la tabla `users`
3. **Error al crear asociación**: Verifica que eres admin_fab y tienes una asociación asignada

**Ver políticas RLS:**
```sql
SELECT tablename, COUNT(*) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename;
```

Deberías ver políticas en: asociaciones, users, atletas, entrenadores, jueces, eventos, etc.
