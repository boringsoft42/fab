# 🚀 Guía de Setup - Admin FAB

## ✅ Sistema de Asociaciones Completado

Ahora puedes crear las 9 asociaciones departamentales desde la interfaz web.

---

## 📋 Pasos para Setup Inicial

### **PASO 1: Crear Usuario Admin FAB** (Solo una vez)

1. Ve a **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: `admin@fab.bo`
   - **Password**: `Admin123!` (o tu preferencia)
   - **Auto Confirm User**: ✅ **SÍ** (marcar esta opción)
4. Click **"Create user"**
5. **COPIA EL UUID** del usuario creado

#### Vincular el usuario a la tabla `users`

**IMPORTANTE**: Primero necesitas crear una asociación para el admin_fab, porque TODOS los usuarios deben tener una asociación asignada.

Ve a **SQL Editor** y ejecuta:

```sql
-- PASO 1: Crear asociación "FAB Nacional" para admin_fab
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
-- COPIA el ID (UUID) que se muestra en el resultado
```

Ahora vincula el usuario admin_fab con esta asociación:

```sql
-- PASO 2: Vincular usuario admin_fab
-- REEMPLAZA 'UUID_DEL_USUARIO' con el UUID del usuario de Authentication
-- REEMPLAZA 'UUID_ASOCIACION_FAB_NACIONAL' con el UUID de la asociación "FAB Nacional" creada arriba
INSERT INTO users (user_id, rol, estado, asociacion_id)
VALUES (
  'UUID_DEL_USUARIO',              -- <- UUID del usuario de Authentication
  'admin_fab',
  'activo',
  'UUID_ASOCIACION_FAB_NACIONAL'   -- <- UUID de la asociación "FAB Nacional"
);
```

✅ Verifica que se creó correctamente:
```sql
SELECT u.user_id, u.rol, u.estado, u.asociacion_id, a.nombre as asociacion
FROM users u
LEFT JOIN asociaciones a ON u.asociacion_id = a.id
WHERE u.rol = 'admin_fab';
```

**Muy importante**: Verifica que `asociacion_id` NO sea NULL. Si es NULL, el admin_fab no podrá crear asociaciones.

---

### **PASO 0: Configurar RLS Policies (Row Level Security) - UNA SOLA VEZ**

**MUY IMPORTANTE**: Este paso se ejecuta UNA SOLA VEZ y configura TODAS las políticas RLS del sistema.

Ve a **Supabase Dashboard** → **SQL Editor** y ejecuta el archivo completo:

📄 **`supabase/migrations/20250101000000_setup_rls_policies.sql`**

Este script configura TODAS las políticas RLS para:
- ✅ Asociaciones (lectura pública + admin_fab)
- ✅ Users (admin_fab + usuarios propios)
- ✅ Atletas, Entrenadores, Jueces (admin_fab + propios)
- ✅ Eventos (admin_fab + lectura pública de aprobados)
- ✅ Pagos, Inscripciones, Dorsales (admin_fab + propios)

**Después de ejecutar, verifica:**
```sql
-- Ver todas las políticas creadas
SELECT tablename, COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

Deberías ver políticas en todas las tablas principales.

---

### **PASO 2: Login como Admin FAB**

1. Ve a: `http://localhost:3000/sign-in`
2. Login:
   - **Email**: `admin@fab.bo`
   - **Password**: `Admin123!` (o el que pusiste)
3. Serás redirigido a: `/dashboard/admin-fab`

---

### **PASO 3: Crear las 9 Asociaciones desde la Web**

1. En el Dashboard Admin FAB, click **"Crear Asociación"**
   - O ve directamente a: `/associations/new`

2. Crea cada una de las 9 asociaciones departamentales:

#### **La Paz**
- **Nombre**: La Paz
- **Departamento**: La Paz
- **Ciudad**: La Paz
- **Email**: lapaz@fab.bo
- **Teléfono**: 2-2222222
- **Contacto**: Asociación Departamental La Paz

#### **Cochabamba**
- **Nombre**: Cochabamba
- **Departamento**: Cochabamba
- **Ciudad**: Cochabamba
- **Email**: cochabamba@fab.bo
- **Teléfono**: 4-4444444
- **Contacto**: Asociación Departamental Cochabamba

#### **Santa Cruz**
- **Nombre**: Santa Cruz
- **Departamento**: Santa Cruz
- **Ciudad**: Santa Cruz de la Sierra
- **Email**: santacruz@fab.bo
- **Teléfono**: 3-3333333
- **Contacto**: Asociación Departamental Santa Cruz

#### **Chuquisaca**
- **Nombre**: Chuquisaca
- **Departamento**: Chuquisaca
- **Ciudad**: Sucre
- **Email**: chuquisaca@fab.bo
- **Teléfono**: 4-6464646
- **Contacto**: Asociación Departamental Chuquisaca

#### **Tarija**
- **Nombre**: Tarija
- **Departamento**: Tarija
- **Ciudad**: Tarija
- **Email**: tarija@fab.bo
- **Teléfono**: 4-6666666
- **Contacto**: Asociación Departamental Tarija

#### **Oruro**
- **Nombre**: Oruro
- **Departamento**: Oruro
- **Ciudad**: Oruro
- **Email**: oruro@fab.bo
- **Teléfono**: 2-5252525
- **Contacto**: Asociación Departamental Oruro

#### **Potosí**
- **Nombre**: Potosí
- **Departamento**: Potosí
- **Ciudad**: Potosí
- **Email**: potosi@fab.bo
- **Teléfono**: 2-6262626
- **Contacto**: Asociación Departamental Potosí

#### **Beni**
- **Nombre**: Beni
- **Departamento**: Beni
- **Ciudad**: Trinidad
- **Email**: beni@fab.bo
- **Teléfono**: 3-4646464
- **Contacto**: Asociación Departamental Beni

#### **Pando**
- **Nombre**: Pando
- **Departamento**: Pando
- **Ciudad**: Cobija
- **Email**: pando@fab.bo
- **Teléfono**: 3-8421111
- **Contacto**: Asociación Departamental Pando

3. ✅ Verifica en `/associations` que se crearon las 9 asociaciones

---

### **PASO 4: Ahora SÍ puedes registrar usuarios normales**

1. Ve a: `http://localhost:3000/sign-up`
2. Registra un atleta/entrenador/juez
3. **Ahora el dropdown de Asociación mostrará las 9 opciones** ✅
4. Completa el registro
5. Login como el usuario nuevo
6. Completa el perfil (7 pasos)
7. Login como admin_fab para aprobar el usuario

---

## 🎯 Funcionalidades Admin FAB Completadas

### ✅ Asociaciones CRUD
- ✅ Crear asociación (`/associations/new`)
- ✅ Listar asociaciones (`/associations`)
- ✅ Editar asociación (`/associations/[id]/edit`)
- ✅ Toggle estado (activar/desactivar)

### ✅ Dashboard
- ✅ Métricas en tiempo real:
  - Total Usuarios
  - Usuarios Pendientes
  - Eventos Activos
  - Pagos Pendientes
  - Admin Asociaciones
  - Asociaciones Registradas

### ✅ Acciones Rápidas
- ✅ Revisar usuarios pendientes
- ✅ Gestionar administradores
- ✅ Crear Admin Asociación
- ✅ Gestionar Asociaciones
- ✅ Crear Asociación

---

## 🔄 Próximas Funcionalidades

1. **Sistema de Aprobación de Eventos**
   - Ver eventos en revisión
   - Aprobar/Rechazar eventos

2. **Sistema de Verificación de Pagos**
   - Ver pagos pendientes
   - Verificar comprobantes
   - Aprobar/Observar pagos

3. **Gestión de Inscripciones**
   - Ver todas las inscripciones
   - Aprobar inscripciones (estado_fab)

4. **Asignación de Dorsales**
   - Listar atletas elegibles
   - Asignar números de dorsal

---

## 🔧 Troubleshooting

### "No me aparecen las asociaciones en el dropdown"
- Ve a `/associations` y verifica que existen las 9 asociaciones
- Verifica que tengan `estado = true` (activas)

### "Error al crear asociación"
- Verifica que estás logueado como admin_fab
- Verifica que el nombre de la asociación sea único
- Revisa la consola del navegador para más detalles

### "No puedo hacer login como admin_fab"
- Verifica que el usuario existe en Supabase Authentication
- Verifica que existe en la tabla `users` con `rol = 'admin_fab'`
- Verifica que `estado = 'activo'`

---

## 📊 Estado del Proyecto

**Completado:**
- ✅ Sistema de autenticación multi-rol
- ✅ Validación de formularios (Zod + React Hook Form)
- ✅ Profile forms (Atleta, Entrenador, Juez)
- ✅ Asociaciones CRUD completo
- ✅ Dashboard Admin FAB con métricas

**En Progreso:**
- 🔄 Sistema de aprobación de eventos
- 🔄 Verificación de pagos
- 🔄 Gestión de inscripciones
- 🔄 Asignación de dorsales
