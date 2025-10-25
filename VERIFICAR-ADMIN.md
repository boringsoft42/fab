# 🔍 Verificar Admin FAB

## Problema Actual
El admin_fab no puede crear asociaciones porque probablemente:
1. El usuario admin_fab no tiene una asociación asignada en la tabla `users`
2. Según el schema de Prisma, **todos** los usuarios DEBEN tener un `asociacion_id`

## ✅ Solución Rápida

### Paso 1: Verificar el usuario admin_fab

Ve a **Supabase Dashboard** → **SQL Editor** y ejecuta:

```sql
SELECT u.user_id, u.rol, u.estado, u.asociacion_id, a.nombre as asociacion_nombre
FROM users u
LEFT JOIN asociaciones a ON u.asociacion_id = a.id
WHERE u.rol = 'admin_fab';
```

### Paso 2: Si `asociacion_id` es NULL o no existe asociación

Hay dos opciones:

#### Opción A: Crear una asociación temporal para admin_fab

```sql
-- 1. Crear asociación "FAB Nacional" (para admin_fab)
INSERT INTO asociaciones (nombre, departamento, ciudad, contacto, email, telefono, estado)
VALUES (
  'FAB Nacional',
  'La Paz',
  'La Paz',
  'Federación Atlética de Bolivia',
  'admin@fab.bo',
  '2-2222222',
  true
)
RETURNING id;

-- 2. Copia el ID de la asociación creada y actualiza el usuario admin_fab
-- REEMPLAZA 'ASOCIACION_ID' con el UUID de la asociación "FAB Nacional"
-- REEMPLAZA 'USER_ID' con el UUID del usuario admin_fab
UPDATE users
SET asociacion_id = 'ASOCIACION_ID'
WHERE user_id = 'USER_ID' AND rol = 'admin_fab';
```

#### Opción B: Asignar cualquier asociación existente

Si ya tienes alguna asociación creada, asígnala al admin_fab:

```sql
-- Ver asociaciones existentes
SELECT id, nombre FROM asociaciones WHERE estado = true;

-- Asignar una asociación al admin_fab
-- REEMPLAZA 'ASOCIACION_ID' con el UUID de cualquier asociación
-- REEMPLAZA 'USER_ID' con el UUID del usuario admin_fab
UPDATE users
SET asociacion_id = 'ASOCIACION_ID'
WHERE user_id = 'USER_ID' AND rol = 'admin_fab';
```

### Paso 3: Verificar que el cambio funcionó

```sql
SELECT u.user_id, u.rol, u.estado, u.asociacion_id, a.nombre as asociacion_nombre
FROM users u
LEFT JOIN asociaciones a ON u.asociacion_id = a.id
WHERE u.rol = 'admin_fab';
```

Deberías ver que `asociacion_id` ya no es NULL y `asociacion_nombre` muestra el nombre de la asociación.

### Paso 4: Intentar crear asociación nuevamente

1. Refresca la página en el navegador (F5)
2. Intenta crear una asociación nuevamente
3. Ahora debería funcionar correctamente

---

## 🔍 Cómo verificar el error exacto

Abre la **Consola del Navegador** (F12) y busca el error completo. Ahora debería mostrar:

```
Error al crear asociación: [mensaje específico del error]
```

Esto te dirá exactamente cuál es el problema.

---

## 📝 Nota Importante

Según el schema de Prisma, **todos** los usuarios deben tener una asociación asignada:

```prisma
model users {
  user_id       String   @id @db.Uuid
  rol           rol_enum
  estado        estado_usuario_enum @default(pendiente)
  asociacion_id String   @db.Uuid  // <- NO es opcional
  // ...
  asociaciones  asociaciones @relation(fields: [asociacion_id], references: [id])
}
```

Por lo tanto, incluso el admin_fab (que administra todas las asociaciones) necesita estar vinculado a una asociación en la base de datos.
