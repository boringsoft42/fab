# 🚀 Setup Inicial - FAB Management System

## Problema Actual
No puedes registrar usuarios porque:
1. ❌ No existen asociaciones en la base de datos
2. ❌ No existe un admin_fab para aprobar usuarios
3. ❌ El dashboard de admin_fab no está completo

## ✅ Solución Paso a Paso

### **PASO 1: Crear las 9 Asociaciones**

Ve a Supabase Dashboard → SQL Editor y ejecuta:

```sql
-- COPIAR Y PEGAR TODO ESTE CÓDIGO EN SUPABASE SQL EDITOR

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
```

✅ Verifica que se crearon:
```sql
SELECT id, nombre, departamento FROM asociaciones ORDER BY nombre;
```

---

### **PASO 2: Crear Usuario Admin FAB**

#### Opción A: Desde Supabase Dashboard (MÁS FÁCIL)

1. Ve a Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: `admin@fab.bo`
   - **Password**: `Admin123!` (o tu preferencia)
   - **Auto Confirm User**: ✅ **SÍ** (marcar esta opción)
4. Click **"Create user"**
5. **COPIA EL UUID** del usuario creado (lo necesitarás abajo)

#### Vincular el usuario a la tabla `users`

Ve a SQL Editor y ejecuta (reemplaza `UUID_DEL_USUARIO`):

```sql
-- REEMPLAZA 'UUID_DEL_USUARIO' con el UUID que copiaste arriba
INSERT INTO users (user_id, rol, estado, asociacion_id)
VALUES (
  'UUID_DEL_USUARIO',  -- <- CAMBIAR ESTO
  'admin_fab',
  'activo',
  (SELECT id FROM asociaciones WHERE nombre = 'La Paz' LIMIT 1)
);
```

✅ Verifica:
```sql
SELECT u.user_id, u.rol, u.estado, a.nombre as asociacion
FROM users u
JOIN asociaciones a ON u.asociacion_id = a.id
WHERE u.rol = 'admin_fab';
```

---

### **PASO 3: Login como Admin FAB**

1. Ve a: `http://localhost:3000/sign-in`
2. Login:
   - **Email**: `admin@fab.bo`
   - **Password**: `Admin123!` (o el que pusiste)
3. Serás redirigido a: `/dashboard/admin-fab`

---

### **PASO 4: Ahora SÍ puedes registrar usuarios normales**

1. Ve a: `http://localhost:3000/sign-up`
2. Registra un atleta/entrenador/juez
3. **Ahora el dropdown de Asociación mostrará las 9 opciones** ✅
4. Completa el registro
5. Login como el usuario nuevo
6. Completa el perfil
7. Login como admin_fab para aprobar

---

## 🔧 Troubleshooting

### "No me aparecen las asociaciones en el dropdown"
- Verifica que ejecutaste el SQL del PASO 1
- Verifica en Supabase: Table Editor → asociaciones
- Deben haber 9 registros con estado=true

### "No puedo hacer login como admin_fab"
- Verifica que el usuario existe en Authentication → Users
- Verifica que existe en la tabla `users` con rol='admin_fab'
- Verifica que estado='activo'

### "Me redirige a /dashboard pero da error"
- Es porque el dashboard de admin_fab aún no está creado
- Voy a crearlo ahora mismo

---

## 📝 Próximos Pasos

Después de este setup, voy a crear:
1. ✅ Dashboard Admin FAB completo
2. ✅ Página para gestionar usuarios pendientes
3. ✅ Página para gestionar asociaciones
4. ✅ Sistema completo de eventos e inscripciones
