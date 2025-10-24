# Tareas de Implementación - Sistema FAB

Este documento desglosa el PRD del Sistema de Gestión Integral FAB en tareas ejecutables organizadas por módulos.

**Leyenda de Complejidad:**
- **S (Small)**: 1-2 horas
- **M (Medium)**: 3-5 horas
- **L (Large)**: 1-2 días
- **XL (Extra Large)**: 3-5 días

---

## Módulo 1: Configuración Inicial del Proyecto

### TASK-0001: Ejecutar Schema SQL en Supabase
**Complejidad:** M
**Dependencias:** Ninguna

**Descripción:**
Ejecutar el schema SQL completo del PRD en la base de datos de Supabase para crear todas las tablas, enums, triggers, funciones y políticas RLS.

**Archivos involucrados:**
- Ejecutar SQL en Supabase Dashboard o CLI

**Criterios de aceptación:**
- [ ] Todas las tablas creadas (users, atletas, entrenadores, jueces, asociaciones, eventos, pruebas, inscripciones, dorsales, pagos_evento_asociacion, startlists, startlist_items)
- [ ] Todos los ENUMs creados
- [ ] Triggers funcionando (municipio, categoría FAB)
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas RLS aplicadas
- [ ] 9 asociaciones departamentales insertadas
- [ ] Función `fab_calcular_categoria_fn` operativa

---

### TASK-0002: Configurar Prisma con el schema existente
**Complejidad:** M
**Dependencias:** TASK-0001

**Descripción:**
Generar el schema de Prisma (`prisma/schema.prisma`) a partir de la base de datos ya creada mediante introspección, y ajustar tipos personalizados.

**Archivos involucrados:**
- `prisma/schema.prisma`

**Pasos:**
1. Ejecutar `npx prisma db pull` para introspección
2. Revisar y ajustar relaciones
3. Ejecutar `npx prisma generate`

**Criterios de aceptación:**
- [ ] Schema Prisma refleja todas las tablas
- [ ] Relaciones FK correctamente mapeadas
- [ ] ENUMs definidos como tipos Prisma
- [ ] Cliente Prisma generado sin errores
- [ ] Tipos TypeScript disponibles

---

### TASK-0003: Configurar Supabase Auth
**Complejidad:** S
**Dependencias:** TASK-0001

**Descripción:**
Configurar Supabase Auth en el proyecto con las variables de entorno necesarias y crear el cliente de Supabase.

**Archivos involucrados:**
- `.env.local`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

**Criterios de aceptación:**
- [ ] Variables de entorno configuradas (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Cliente de Supabase creado para client-side
- [ ] Cliente de Supabase creado para server-side (con service role key)
- [ ] Helpers para auth (getSession, getUser) implementados

---

### TASK-0004: Configurar Supabase Storage con buckets y RLS
**Complejidad:** M
**Dependencias:** TASK-0001

**Descripción:**
Crear los buckets necesarios en Supabase Storage y configurar políticas RLS para cada bucket.

**Buckets a crear:**
- `profile-photos/`
- `documents/`
- `event-logos/`

**Path structure:** `{bucket}/{asociacion_id}/{user_id}/{filename}`

**Criterios de aceptación:**
- [ ] 3 buckets creados en Supabase Storage
- [ ] RLS habilitado en cada bucket
- [ ] Política: usuario puede subir a su propio path
- [ ] Política: admin_fab puede acceder a todo
- [ ] Política: admin_asociacion puede acceder a su asociación
- [ ] Validaciones de tamaño implementadas (fotos: 5MB, docs: 10MB, QR: 2MB)

---

### TASK-0005: Crear utilidades de validación con Zod
**Complejidad:** M
**Dependencias:** Ninguna

**Descripción:**
Crear schemas de validación Zod para todos los formularios del sistema.

**Archivos a crear:**
- `lib/validations/auth.ts`
- `lib/validations/profile.ts`
- `lib/validations/event.ts`
- `lib/validations/inscription.ts`

**Criterios de aceptación:**
- [ ] Schema para registro de usuario
- [ ] Schemas para perfiles (atleta, entrenador, juez)
- [ ] Schema para eventos y pruebas
- [ ] Schema para inscripciones
- [ ] Validaciones de CI (único, formato)
- [ ] Validaciones de email
- [ ] Validaciones de rangos (edad, altura, peso)

---

### TASK-0006: Crear seed script para admin_fab inicial
**Complejidad:** S
**Dependencias:** TASK-0001, TASK-0003

**Descripción:**
Crear un script de seed que cree la primera cuenta admin_fab directamente en Supabase Auth y en la tabla users.

**Archivos a crear:**
- `scripts/seed-admin.ts`

**Criterios de aceptación:**
- [ ] Script crea usuario en Supabase Auth
- [ ] Script crea registro en tabla users con rol admin_fab
- [ ] Script usa variables de entorno para credenciales
- [ ] Estado inicial: activo
- [ ] Asociación asignada (puede ser "La Paz" por defecto)
- [ ] Script es idempotente (no falla si ya existe)

---

## Módulo 2: Autenticación

### TASK-0007: Crear página de Login
**Complejidad:** M
**Dependencias:** TASK-0003, TASK-0005

**Descripción:**
Implementar la página de login (`/auth/login`) para todos los roles usando Supabase Auth.

**Archivos a crear:**
- `app/auth/login/page.tsx`
- `app/auth/login/actions.ts` (Server Action)

**Criterios de aceptación:**
- [ ] Formulario con email y password
- [ ] Validación con Zod
- [ ] Integración con Supabase Auth
- [ ] Manejo de errores (credenciales inválidas, cuenta no existe)
- [ ] Redirección según rol después de login exitoso
- [ ] Link a "Olvidé mi contraseña"
- [ ] Link a "Registrarse" (público)

---

### TASK-0008: Crear página de Sign Up Público (Atleta/Entrenador/Juez)
**Complejidad:** L
**Dependencias:** TASK-0003, TASK-0005

**Descripción:**
Implementar la página de registro público (`/auth/register`) que permite SOLO registrarse como atleta, entrenador o juez.

**Archivos a crear:**
- `app/auth/register/page.tsx`
- `app/auth/register/actions.ts` (Server Action)

**Criterios de aceptación:**
- [ ] Formulario multi-step (paso 1: credenciales, paso 2: asociación y datos básicos)
- [ ] Selector de rol: SOLO atleta, entrenador, juez (NO admin_fab ni admin_asociacion)
- [ ] Selector de asociación departamental (dropdown con las 9)
- [ ] Validación de email único
- [ ] Creación de cuenta en Supabase Auth
- [ ] Creación de registro en tabla users con estado "pendiente"
- [ ] Mensaje: "Tu cuenta ha sido creada y está en revisión"
- [ ] Notificación a admin_fab (opcional en esta task, puede ser TASK separada)

---

### TASK-0009: Implementar middleware de protección de rutas
**Complejidad:** M
**Dependencias:** TASK-0003

**Descripción:**
Crear middleware de Next.js para proteger rutas según autenticación y rol.

**Archivos a crear:**
- `middleware.ts`
- `lib/auth/check-role.ts`

**Criterios de aceptación:**
- [ ] Rutas públicas: `/`, `/auth/login`, `/auth/register`
- [ ] Rutas protegidas requieren autenticación
- [ ] Redirección a `/auth/login` si no autenticado
- [ ] Verificación de rol para rutas administrativas
- [ ] Bloqueo de usuarios con estado "rechazado" o "inactivo"
- [ ] Usuarios "pendientes" solo acceden a `/dashboard` y `/profile`

---

### TASK-0010: Crear página de Reset Password
**Complejidad:** S
**Dependencias:** TASK-0003

**Descripción:**
Implementar flujo de recuperación de contraseña.

**Archivos a crear:**
- `app/auth/reset-password/page.tsx`
- `app/auth/reset-password/actions.ts`

**Criterios de aceptación:**
- [ ] Formulario solicita email
- [ ] Envía email de recuperación vía Supabase Auth
- [ ] Mensaje de confirmación
- [ ] Página de actualización de contraseña (con token)

---

### TASK-0011: Crear hook personalizado useUser
**Complejidad:** S
**Dependencias:** TASK-0003

**Descripción:**
Crear hook React para obtener información del usuario autenticado incluyendo su rol y estado.

**Archivos a crear:**
- `hooks/useUser.ts`

**Criterios de aceptación:**
- [ ] Hook retorna: user (auth), profile (users table), role, estado, asociacion_id
- [ ] Hook usa React Query para caching
- [ ] Loading states
- [ ] Error handling
- [ ] Actualización automática al cambiar sesión

---

## Módulo 3: Gestión de Usuarios (Admin FAB)

### TASK-0012: Crear página de usuarios pendientes (Admin FAB)
**Complejidad:** L
**Dependencias:** TASK-0007, TASK-0009, TASK-0011

**Descripción:**
Implementar el panel donde admin_fab ve y gestiona usuarios públicos pendientes de aprobación.

**Archivos a crear:**
- `app/users/pending/page.tsx`
- `app/users/pending/actions.ts`
- `components/users/pending-users-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con usuarios estado "pendiente"
- [ ] Columnas: nombre, email, rol, asociación, fecha_registro
- [ ] Filtrado por rol y asociación
- [ ] Ordenamiento por fecha
- [ ] Paginación (10 por página)
- [ ] Botón "Ver detalle" lleva a `/users/[userId]`
- [ ] Accesible solo por admin_fab

---

### TASK-0013: Crear página de detalle de usuario pendiente
**Complejidad:** M
**Dependencias:** TASK-0012

**Descripción:**
Página de detalle para revisar datos completos de un usuario pendiente antes de aprobar/rechazar.

**Archivos a crear:**
- `app/users/[userId]/page.tsx`
- `app/users/[userId]/actions.ts`
- `components/users/user-detail-view.tsx`

**Criterios de aceptación:**
- [ ] Muestra todos los datos del perfil (según rol: atleta/entrenador/juez)
- [ ] Muestra documentos cargados (fotos, CI, certificados)
- [ ] Botones: "Aprobar", "Rechazar"
- [ ] Modal de confirmación para aprobar
- [ ] Modal con textarea para rechazar (observaciones obligatorias)
- [ ] Actualiza estado en tabla users
- [ ] Registra aprobado_por_fab y fecha_aprobacion

---

### TASK-0014: Implementar acción de aprobar usuario
**Complejidad:** M
**Dependencias:** TASK-0013

**Descripción:**
Server Action para aprobar un usuario pendiente (cambiar estado a "activo").

**Archivos involucrados:**
- `app/users/[userId]/actions.ts`

**Criterios de aceptación:**
- [ ] Verifica que el usuario actual es admin_fab
- [ ] Actualiza users.estado = "activo"
- [ ] Registra aprobado_por_fab = auth.uid()
- [ ] Registra fecha_aprobacion = now()
- [ ] Si es atleta/entrenador/juez: actualiza perfil correspondiente
- [ ] Retorna éxito/error
- [ ] (Opcional) Envía email de notificación al usuario

---

### TASK-0015: Implementar acción de rechazar usuario
**Complejidad:** M
**Dependencias:** TASK-0013

**Descripción:**
Server Action para rechazar un usuario pendiente con observaciones.

**Archivos involucrados:**
- `app/users/[userId]/actions.ts`

**Criterios de aceptación:**
- [ ] Verifica que el usuario actual es admin_fab
- [ ] Requiere observaciones (motivo de rechazo)
- [ ] Actualiza users.estado = "rechazado"
- [ ] Registra aprobado_por_fab y fecha_aprobacion
- [ ] Actualiza observaciones en perfil correspondiente
- [ ] Usuario no puede hacer login después del rechazo
- [ ] (Opcional) Envía email con motivo de rechazo

---

### TASK-0016: Crear página de gestión de admin_asociacion
**Complejidad:** L
**Dependencias:** TASK-0007, TASK-0009

**Descripción:**
Panel donde admin_fab puede ver, crear, activar/desactivar cuentas de admin_asociacion.

**Archivos a crear:**
- `app/users/admins/page.tsx`
- `app/users/admins/actions.ts`
- `components/users/admin-asociacion-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con todos los admin_asociacion
- [ ] Columnas: nombre, email, asociación, estado, fecha_creación
- [ ] Filtrado por asociación y estado
- [ ] Botón "Crear nuevo admin_asociacion"
- [ ] Botón "Activar/Desactivar" en cada fila
- [ ] Badge de estado (activo/inactivo)
- [ ] Accesible solo por admin_fab

---

### TASK-0017: Crear formulario de nuevo admin_asociacion
**Complejidad:** L
**Dependencias:** TASK-0016

**Descripción:**
Formulario para que admin_fab cree cuentas de admin_asociacion.

**Archivos a crear:**
- `app/users/admins/new/page.tsx`
- `app/users/admins/new/actions.ts`
- `components/users/create-admin-form.tsx`

**Criterios de aceptación:**
- [ ] Formulario con: email, nombre completo, asociación (dropdown)
- [ ] Opción: generar contraseña temporal o enviar link de activación
- [ ] Validación de email único
- [ ] Crea cuenta en Supabase Auth
- [ ] Crea registro en users con rol "admin_asociacion", estado "activo"
- [ ] Envía email con credenciales o link de activación
- [ ] Redirección a `/users/admins` tras éxito
- [ ] Manejo de errores (email ya existe, etc.)

---

## Módulo 4: Perfiles

### TASK-0018: Crear formulario de perfil de Atleta (registro inicial)
**Complejidad:** XL
**Dependencias:** TASK-0008, TASK-0005, TASK-0004

**Descripción:**
Formulario multi-step para que el atleta complete su perfil después del registro público.

**Archivos a crear:**
- `app/profile/atleta/page.tsx`
- `app/profile/atleta/actions.ts`
- `components/profile/atleta-form.tsx`
- `components/profile/document-upload.tsx`

**Steps del formulario:**
1. Datos Personales (nombre, apellido, CI, fecha_nacimiento, género, nacionalidad, estado_civil)
2. Datos de Contacto (teléfono, dirección, ciudad, departamento)
3. Datos Federativos (municipio si aplica, especialidad, años_practica)
4. Datos Físicos (altura, peso, tallas, tipo_sangre)
5. Mejor Marca Personal (opcional)
6. Contacto de Emergencia
7. Documentos (foto, CI frente/reverso, certificado médico, carnet vacunación)

**Criterios de aceptación:**
- [ ] Formulario con 7 pasos (stepper visual)
- [ ] Validación en cada paso con Zod
- [ ] Campo "municipio" obligatorio solo si asociación != Santa Cruz
- [ ] Categoría FAB se calcula automáticamente (mostrar pero no editable)
- [ ] Upload de archivos a Supabase Storage
- [ ] Preview de imágenes cargadas
- [ ] Validación de tamaños de archivo
- [ ] Guarda en tabla atletas
- [ ] Estado inicial del perfil: "pendiente"
- [ ] Botón "Guardar borrador" en cada paso
- [ ] Botón "Enviar para aprobación" en último paso

---

### TASK-0019: Crear formulario de perfil de Entrenador (registro inicial)
**Complejidad:** L
**Dependencias:** TASK-0008, TASK-0005, TASK-0004

**Descripción:**
Formulario multi-step para que el entrenador complete su perfil después del registro público.

**Steps del formulario:**
1. Datos Personales
2. Datos de Contacto
3. Datos Profesionales (especialidad, años_experiencia, certificaciones, títulos_deportivos)
4. Datos Físicos
5. Contacto de Emergencia
6. Documentos (foto, CI, certificado médico, títulos profesionales, certificaciones deportivas)

**Criterios de aceptación:**
- [ ] Similar a TASK-0018 pero adaptado a entrenador
- [ ] Campos profesionales específicos de entrenador
- [ ] Documentos opcionales: títulos_profesionales_url, certificaciones_deportivas_url
- [ ] Guarda en tabla entrenadores
- [ ] Estado inicial: "pendiente"

---

### TASK-0020: Crear formulario de perfil de Juez (registro inicial)
**Complejidad:** L
**Dependencias:** TASK-0008, TASK-0005, TASK-0004

**Descripción:**
Formulario multi-step para que el juez complete su perfil después del registro público.

**Steps del formulario:**
1. Datos Personales
2. Datos de Contacto
3. Datos Profesionales (especialidad, años_experiencia, nivel_juez, certificaciones, eventos_juzgados)
4. Datos Físicos
5. Contacto de Emergencia
6. Documentos (foto, CI, certificado médico, certificaciones_juez, licencia_juez)

**Criterios de aceptación:**
- [ ] Similar a TASK-0018 pero adaptado a juez
- [ ] Campo nivel_juez: dropdown con "nacional" / "internacional"
- [ ] Documentos opcionales: certificaciones_juez_url, licencia_juez_url
- [ ] Guarda en tabla jueces
- [ ] Estado inicial: "pendiente"

---

### TASK-0021: Crear página "Mi Perfil" con campos bloqueados
**Complejidad:** L
**Dependencias:** TASK-0018, TASK-0019, TASK-0020, TASK-0011

**Descripción:**
Página donde usuarios activos pueden editar su perfil, excepto campos bloqueados (datos personales).

**Archivos a crear:**
- `app/profile/edit/page.tsx`
- `app/profile/edit/actions.ts`
- `components/profile/edit-profile-form.tsx`

**Criterios de aceptación:**
- [ ] Carga perfil del usuario autenticado según su rol
- [ ] Campos bloqueados (nombre, apellido, CI, fecha_nacimiento, género, nacionalidad) mostrados como disabled con icono de candado
- [ ] Tooltip en campos bloqueados: "Este campo solo puede ser editado por admin_fab"
- [ ] Campos editables: contacto, físicos, emergencia, datos profesionales
- [ ] Validación con Zod
- [ ] Server Action valida que campos bloqueados no cambien (seguridad backend)
- [ ] Mensaje de éxito tras guardar
- [ ] Botón "Actualizar documentos" lleva a `/profile/documents`

---

### TASK-0022: Crear página de actualización de documentos
**Complejidad:** M
**Dependencias:** TASK-0021, TASK-0004

**Descripción:**
Página donde usuarios pueden actualizar sus documentos (fotos, certificados).

**Archivos a crear:**
- `app/profile/documents/page.tsx`
- `app/profile/documents/actions.ts`
- `components/profile/document-manager.tsx`

**Criterios de aceptación:**
- [ ] Muestra documentos actuales con preview
- [ ] Botón "Reemplazar" en cada documento
- [ ] Upload a Supabase Storage
- [ ] Validación de tipo y tamaño
- [ ] Actualiza URLs en tabla de perfil correspondiente
- [ ] Mensaje de éxito/error

---

### TASK-0023: Crear componente de visualización de perfil (solo lectura)
**Complejidad:** M
**Dependencias:** TASK-0018, TASK-0019, TASK-0020

**Descripción:**
Componente reutilizable para mostrar un perfil completo en modo solo lectura (usado por admins para revisar).

**Archivos a crear:**
- `components/profile/profile-view.tsx`
- `components/profile/profile-section.tsx`

**Criterios de aceptación:**
- [ ] Recibe perfil (atleta/entrenador/juez) como prop
- [ ] Muestra todos los campos organizados por secciones
- [ ] Muestra documentos con opción de vista previa/descarga
- [ ] Destacar categoría FAB (si es atleta)
- [ ] Badge de estado del perfil
- [ ] Responsivo

---

## Módulo 5: Asociaciones

### TASK-0024: Crear página de gestión de asociaciones (Admin FAB)
**Complejidad:** M
**Dependencias:** TASK-0007, TASK-0009

**Descripción:**
Panel donde admin_fab puede ver y editar las 9 asociaciones departamentales.

**Archivos a crear:**
- `app/associations/page.tsx`
- `app/associations/actions.ts`
- `components/associations/associations-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con las 9 asociaciones
- [ ] Columnas: nombre, departamento, ciudad, contacto, email, teléfono, estado
- [ ] Badge de estado (activo/inactivo)
- [ ] Botón "Editar" en cada fila
- [ ] No se puede eliminar asociaciones (solo desactivar)
- [ ] Accesible solo por admin_fab

---

### TASK-0025: Crear formulario de edición de asociación
**Complejidad:** S
**Dependencias:** TASK-0024

**Descripción:**
Formulario para editar datos de una asociación (ciudad, contacto, email, teléfono, estado).

**Archivos a crear:**
- `app/associations/[id]/edit/page.tsx`
- `app/associations/[id]/edit/actions.ts`

**Criterios de aceptación:**
- [ ] Formulario pre-poblado con datos actuales
- [ ] Campos editables: ciudad, contacto, email, teléfono, estado
- [ ] Nombre y departamento NO editables (son fijos)
- [ ] Validación con Zod
- [ ] Server Action actualiza asociación
- [ ] Redirección a `/associations` tras éxito

---

## Módulo 6: Eventos

### TASK-0026: Crear página de listado de eventos
**Complejidad:** M
**Dependencias:** TASK-0007, TASK-0009, TASK-0011

**Descripción:**
Página que muestra eventos según el rol del usuario.

**Archivos a crear:**
- `app/events/page.tsx`
- `app/events/actions.ts`
- `components/events/events-table.tsx`

**Criterios de aceptación:**
- [ ] Admin_fab ve todos los eventos
- [ ] Admin_asociacion ve solo eventos de su asociación
- [ ] Atleta/entrenador/juez ven solo eventos aprobados
- [ ] Columnas: nombre, tipo, estado, fecha_evento, ciudad, asociación_creadora
- [ ] Filtrado por: tipo (federativo/asociacion), estado, fechas
- [ ] Ordenamiento por fecha_evento
- [ ] Badge de tipo y estado con colores
- [ ] Botón "Ver detalle" lleva a `/events/[eventId]`
- [ ] Botón "Crear evento" (solo admin_fab y admin_asociacion)
- [ ] Paginación

---

### TASK-0027: Crear formulario de nuevo evento
**Complejidad:** XL
**Dependencias:** TASK-0026, TASK-0005

**Descripción:**
Formulario multi-step para crear un evento (federativo o de asociación).

**Archivos a crear:**
- `app/events/new/page.tsx`
- `app/events/new/actions.ts`
- `components/events/event-form.tsx`

**Steps del formulario:**
1. Información Básica (nombre, descripción, tipo, logo)
2. Ubicación y Calendario (ciudad, lugar, dirección, fechas)
3. Reglas de Participación (límites, edad, género)
4. Información Financiera (solo si federativo: costo_fab, costo_por_atleta, datos bancarios, QR)
5. Organización (director técnico, jefe competencia, comisario)

**Criterios de aceptación:**
- [ ] Al seleccionar tipo "federativo", mostrar sección financiera (obligatoria)
- [ ] Al seleccionar tipo "asociacion", ocultar sección financiera
- [ ] Validación: fecha_insc_fin < fecha_evento
- [ ] Validación: fecha_insc_inicio < fecha_insc_fin
- [ ] Upload de logo a Supabase Storage (event-logos/)
- [ ] Upload de QR de pago si aplica
- [ ] Guarda en tabla eventos con estado "borrador"
- [ ] asociacion_creadora_id = asociación del usuario creador
- [ ] creado_por_user = auth.uid()
- [ ] Redirección a `/events/[eventId]` tras éxito

---

### TASK-0028: Crear página de detalle de evento
**Complejidad:** M
**Dependencias:** TASK-0026

**Descripción:**
Página que muestra toda la información de un evento.

**Archivos a crear:**
- `app/events/[eventId]/page.tsx`
- `components/events/event-detail.tsx`

**Criterios de aceptación:**
- [ ] Muestra toda la información del evento organizada por secciones
- [ ] Muestra logo del evento si existe
- [ ] Badge de tipo y estado
- [ ] Sección de pruebas (lista de pruebas del evento)
- [ ] Sección de inscripciones (si admin)
- [ ] Botones de acción según rol:
  - Admin_fab: "Aprobar", "Rechazar", "Editar", "Ver inscripciones"
  - Admin_asociacion (creador): "Editar", "Enviar a revisión", "Ver inscripciones"
  - Atleta (si evento aprobado): "Inscribirse"
- [ ] Botón "Ver pruebas" lleva a `/events/[eventId]/pruebas`

---

### TASK-0029: Implementar cambio de estado de evento (Admin FAB)
**Complejidad:** M
**Dependencias:** TASK-0028

**Descripción:**
Server Actions para que admin_fab apruebe o rechace eventos en revisión.

**Archivos involucrados:**
- `app/events/[eventId]/actions.ts`

**Criterios de aceptación:**
- [ ] Acción "aprobar": cambia estado a "aprobado"
- [ ] Acción "rechazar": cambia estado a "rechazado" (requiere observaciones)
- [ ] Solo admin_fab puede ejecutar estas acciones
- [ ] Validación de estado actual (solo si está en "en_revision")
- [ ] (Opcional) Notificar a creador del evento

---

### TASK-0030: Implementar envío a revisión (Admin Asociación)
**Complejidad:** S
**Dependencias:** TASK-0028

**Descripción:**
Server Action para que admin_asociacion envíe su evento de "borrador" a "en_revision".

**Archivos involucrados:**
- `app/events/[eventId]/actions.ts`

**Criterios de aceptación:**
- [ ] Solo admin_asociacion creador puede ejecutar
- [ ] Valida que estado actual sea "borrador"
- [ ] Valida que el evento tenga al menos 1 prueba
- [ ] Cambia estado a "en_revision"
- [ ] (Opcional) Notifica a admin_fab

---

### TASK-0031: Crear formulario de edición de evento
**Complejidad:** L
**Dependencias:** TASK-0027, TASK-0028

**Descripción:**
Permite editar un evento existente (similar al formulario de creación).

**Archivos a crear:**
- `app/events/[eventId]/edit/page.tsx`

**Criterios de aceptación:**
- [ ] Reutiliza componente de TASK-0027 en modo edición
- [ ] Pre-popula datos del evento
- [ ] Solo editable si estado es "borrador" o "rechazado"
- [ ] Admin_fab puede editar cualquier evento
- [ ] Admin_asociacion solo puede editar eventos de su asociación
- [ ] Actualiza evento en BD
- [ ] Redirección a `/events/[eventId]` tras éxito

---

## Módulo 7: Pruebas

### TASK-0032: Crear página de pruebas de un evento
**Complejidad:** M
**Dependencias:** TASK-0028

**Descripción:**
Página que lista todas las pruebas de un evento con opciones de gestión.

**Archivos a crear:**
- `app/events/[eventId]/pruebas/page.tsx`
- `app/events/[eventId]/pruebas/actions.ts`
- `components/pruebas/pruebas-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con pruebas del evento
- [ ] Columnas: nombre, categoría_fab, género, distancia, tipo (pista/campo/fondo), carriles, límite_participantes, estado
- [ ] Badge de estado (activa/inactiva)
- [ ] Badge de tipo técnico (con carriles, campo, pista, fondo)
- [ ] Botón "Crear prueba" (solo admin_fab y admin_asociacion creador del evento)
- [ ] Botón "Editar" en cada fila
- [ ] Botón "Activar/Desactivar" en cada fila
- [ ] Filtrado por categoría y género

---

### TASK-0033: Crear formulario de nueva prueba
**Complejidad:** L
**Dependencias:** TASK-0032, TASK-0005

**Descripción:**
Formulario para crear una prueba dentro de un evento.

**Archivos a crear:**
- `app/events/[eventId]/pruebas/new/page.tsx`
- `app/events/[eventId]/pruebas/new/actions.ts`
- `components/pruebas/prueba-form.tsx`

**Secciones del formulario:**
1. Información Básica (nombre, categoría_fab, género, distancia)
2. Configuración Técnica (es_con_carriles, numero_carriles, es_campo, es_pista, es_fondo)
3. Límites y Reglas (limite_participantes, tiempo_limite, marcas mín/máx, edades mín/máx)
4. Horario (hora_inicio, hora_fin, duración_estimada, orden_competencia)

**Criterios de aceptación:**
- [ ] Si es_con_carriles = true, numero_carriles es obligatorio
- [ ] Validación: numero_carriles > 0
- [ ] Selector de categoría_fab con las 8 categorías
- [ ] Selector de género: M / F / Mixto
- [ ] Checkboxes: es_campo, es_pista, es_fondo (al menos uno debe estar marcado)
- [ ] Guarda en tabla pruebas vinculada a evento_id
- [ ] Estado inicial: "activa"
- [ ] Redirección a `/events/[eventId]/pruebas` tras éxito

---

### TASK-0034: Crear formulario de edición de prueba
**Complejidad:** M
**Dependencias:** TASK-0033

**Descripción:**
Permite editar una prueba existente.

**Archivos a crear:**
- `app/events/[eventId]/pruebas/[pruebaId]/edit/page.tsx`

**Criterios de aceptación:**
- [ ] Reutiliza componente de TASK-0033 en modo edición
- [ ] Pre-popula datos de la prueba
- [ ] Solo admin_fab y admin_asociacion creador del evento pueden editar
- [ ] Actualiza prueba en BD
- [ ] Redirección a `/events/[eventId]/pruebas` tras éxito

---

## Módulo 8: Inscripciones

### TASK-0035: Crear formulario de inscripción (Atleta)
**Complejidad:** L
**Dependencias:** TASK-0028, TASK-0032, TASK-0011

**Descripción:**
Formulario para que un atleta se inscriba en una o más pruebas de un evento.

**Archivos a crear:**
- `app/inscripciones/new/page.tsx`
- `app/inscripciones/new/actions.ts`
- `components/inscripciones/inscription-form.tsx`

**Criterios de aceptación:**
- [ ] Recibe evento_id como parámetro (desde página de evento)
- [ ] Muestra información del evento (nombre, fecha, lugar)
- [ ] Lista de pruebas disponibles con checkboxes
- [ ] Filtra pruebas por categoría_fab del atleta y género
- [ ] Por cada prueba seleccionada, campos opcionales: marca_previa, mejor_marca_personal, fecha_mejor_marca
- [ ] Validaciones:
  - Fecha actual dentro de ventana de inscripciones
  - No exceder límites (por evento, por prueba, por asociación)
  - Edad del atleta dentro de rangos de la prueba
  - Género del atleta coincide con género de la prueba
  - No inscripciones duplicadas
- [ ] Crea registros en tabla inscripciones con:
  - estado_asociacion = "pendiente"
  - estado_fab = "pendiente"
  - categoria_atleta = categoría calculada del atleta
- [ ] Mensaje de éxito: "Inscripción enviada para aprobación de tu asociación"
- [ ] Redirección a `/inscripciones` (mis inscripciones)

---

### TASK-0036: Crear página "Mis Inscripciones" (Atleta)
**Complejidad:** M
**Dependencias:** TASK-0035

**Descripción:**
Página donde el atleta ve todas sus inscripciones con sus estados.

**Archivos a crear:**
- `app/inscripciones/page.tsx`
- `components/inscripciones/my-inscriptions-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con inscripciones del atleta autenticado
- [ ] Columnas: evento, prueba, fecha_inscripción, estado_asociacion, estado_fab, dorsal_asignado
- [ ] Badges de estado con colores:
  - Pendiente asociación: amarillo
  - Aprobada asociación / Pendiente FAB: azul
  - Aprobada FAB: verde
  - Rechazada: rojo
- [ ] Columna "Dorsal" muestra número si está asignado, sino "-"
- [ ] Filtrado por evento y estado
- [ ] Botón "Ver detalle" en cada fila

---

### TASK-0037: Crear página de inscripciones pendientes (Admin Asociación)
**Complejidad:** L
**Dependencias:** TASK-0035

**Descripción:**
Panel donde admin_asociacion ve inscripciones pendientes de atletas de su asociación.

**Archivos a crear:**
- `app/inscripciones/pending/page.tsx`
- `app/inscripciones/pending/actions.ts`
- `components/inscripciones/pending-inscriptions-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con inscripciones donde:
  - Atleta pertenece a asociación del admin
  - estado_asociacion = "pendiente"
- [ ] Columnas: atleta (nombre), evento, prueba, fecha_inscripción, marca_previa
- [ ] Agrupado por evento
- [ ] Checkbox para selección múltiple
- [ ] Botones: "Aprobar seleccionadas", "Rechazar"
- [ ] Modal de rechazo con motivo_rechazo obligatorio
- [ ] Actualiza estado_asociacion
- [ ] Registra aprobado_por_asociacion y fecha_aprobacion_asociacion

---

### TASK-0038: Implementar aprobación masiva de inscripciones (Admin Asociación)
**Complejidad:** M
**Dependencias:** TASK-0037

**Descripción:**
Server Action para aprobar múltiples inscripciones a la vez.

**Archivos involucrados:**
- `app/inscripciones/pending/actions.ts`

**Criterios de aceptación:**
- [ ] Recibe array de inscripcion_ids
- [ ] Verifica que todas las inscripciones pertenecen a atletas de la asociación del admin
- [ ] Actualiza estado_asociacion = "aprobada" para todas
- [ ] Registra aprobado_por_asociacion y fecha
- [ ] Transacción: si falla una, revertir todas
- [ ] Retorna cantidad de inscripciones aprobadas

---

### TASK-0039: Crear vista de resumen de inscripciones por evento (Admin Asociación)
**Complejidad:** M
**Dependencias:** TASK-0037

**Descripción:**
Vista que muestra cuántos atletas de la asociación están inscritos en cada evento, para calcular monto a pagar.

**Archivos a crear:**
- `app/inscripciones/summary/page.tsx`
- `components/inscripciones/event-summary-card.tsx`

**Criterios de aceptación:**
- [ ] Lista de eventos con inscripciones de la asociación
- [ ] Por cada evento muestra:
  - Nombre del evento
  - Tipo (federativo / asociación)
  - Cantidad de atletas con inscripciones aprobadas por asociación
  - Si es federativo: monto a pagar calculado (costo_fab o cantidad × costo_por_atleta)
  - Estado del pago (si aplica): pendiente / verificado / observado
- [ ] Botón "Registrar pago" si es federativo y no hay pago registrado
- [ ] Botón "Ver comprobante" si ya hay pago

---

## Módulo 9: Pagos

### TASK-0040: Crear formulario de registro de pago (Admin Asociación)
**Complejidad:** M
**Dependencias:** TASK-0039, TASK-0004

**Descripción:**
Formulario para que admin_asociacion registre el pago de su asociación por un evento federativo.

**Archivos a crear:**
- `app/pagos/new/page.tsx`
- `app/pagos/new/actions.ts`
- `components/pagos/payment-form.tsx`

**Criterios de aceptación:**
- [ ] Recibe evento_id y monto calculado (desde TASK-0039)
- [ ] Muestra información del evento (nombre, fecha, monto a pagar)
- [ ] Campos: método_pago (dropdown: transferencia/depósito/efectivo), fecha_pago, comprobante (file upload)
- [ ] Upload de comprobante a Supabase Storage (documents/)
- [ ] Guarda en tabla pagos_evento_asociacion con:
  - asociacion_id del admin
  - estado_pago = "pendiente"
- [ ] Mensaje: "Pago registrado. Será verificado por FAB"
- [ ] Redirección a `/inscripciones/summary`

---

### TASK-0041: Crear página de pagos pendientes de verificación (Admin FAB)
**Complejidad:** M
**Dependencias:** TASK-0040

**Descripción:**
Panel donde admin_fab ve y verifica pagos de asociaciones.

**Archivos a crear:**
- `app/pagos/pending/page.tsx`
- `app/pagos/pending/actions.ts`
- `components/pagos/pending-payments-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con pagos donde estado_pago = "pendiente"
- [ ] Columnas: asociación, evento, monto, método_pago, fecha_pago, comprobante
- [ ] Botón "Ver comprobante" (abre imagen/PDF)
- [ ] Botón "Verificar" en cada fila
- [ ] Botón "Observar" en cada fila
- [ ] Filtrado por asociación y evento
- [ ] Ordenamiento por fecha_pago

---

### TASK-0042: Implementar verificación de pago (Admin FAB)
**Complejidad:** M
**Dependencies:** TASK-0041

**Descripción:**
Server Action para que admin_fab verifique o observe un pago.

**Archivos involucrados:**
- `app/pagos/pending/actions.ts`

**Acción "Verificar":**
- [ ] Cambia estado_pago = "verificado"
- [ ] Registra verificado_por = auth.uid()
- [ ] Registra fecha_verificacion
- [ ] Actualiza inscripciones del evento/asociación: pago_verificado = true

**Acción "Observar":**
- [ ] Cambia estado_pago = "observado"
- [ ] Requiere observaciones (motivo)
- [ ] Registra verificado_por y fecha
- [ ] (Opcional) Notifica a admin_asociacion

---

### TASK-0043: Crear página de detalle de pago
**Complejidad:** S
**Dependencias:** TASK-0041

**Descripción:**
Página que muestra toda la información de un pago con su historial.

**Archivos a crear:**
- `app/pagos/[pagoId]/page.tsx`
- `components/pagos/payment-detail.tsx`

**Criterios de aceptación:**
- [ ] Muestra toda la información del pago
- [ ] Preview del comprobante (imagen o PDF)
- [ ] Badge de estado
- [ ] Si verificado: mostrar quién y cuándo
- [ ] Si observado: mostrar observaciones
- [ ] Lista de inscripciones asociadas al pago
- [ ] Accesible por admin_fab y admin_asociacion del pago

---

## Módulo 10: Dorsales

### TASK-0044: Crear página de asignación de dorsales (Admin FAB)
**Complejidad:** L
**Dependencias:** TASK-0028, TASK-0042

**Descripción:**
Panel donde admin_fab asigna dorsales a atletas con inscripciones aprobadas.

**Archivos a crear:**
- `app/dorsales/[eventId]/page.tsx`
- `app/dorsales/[eventId]/actions.ts`
- `components/dorsales/dorsal-assignment-table.tsx`

**Criterios de aceptación:**
- [ ] Recibe evento_id como parámetro
- [ ] Lista atletas elegibles para dorsal:
  - estado_fab = "aprobada"
  - Para federativos: pago_verificado = true
  - Sin dorsal asignado aún
- [ ] Tabla con columnas: atleta, asociación, categoría, pruebas inscritas, dorsal (input)
- [ ] Input numérico para asignar dorsal manualmente
- [ ] Validación en tiempo real: no repetir dorsales en el evento
- [ ] Botón "Asignar automáticamente" (secuencial desde el último dorsal usado)
- [ ] Botón "Guardar asignaciones"
- [ ] Filtrado por asociación y categoría

---

### TASK-0045: Implementar asignación automática de dorsales
**Complejidad:** M
**Dependencias:** TASK-0044

**Descripción:**
Server Action que asigna dorsales de forma secuencial automática.

**Archivos involucrados:**
- `app/dorsales/[eventId]/actions.ts`

**Criterios de aceptación:**
- [ ] Obtiene último dorsal asignado en el evento
- [ ] Asigna dorsales secuencialmente a atletas sin dorsal (último + 1, último + 2, ...)
- [ ] Crea registros en tabla dorsales
- [ ] Actualiza inscripciones con dorsal_asignado, fecha_asignacion_dorsal, dorsal_asignado_por
- [ ] Transacción: si falla uno, revertir todos
- [ ] Retorna cantidad de dorsales asignados

---

### TASK-0046: Implementar asignación manual de dorsales
**Complejidad:** M
**Dependencias:** TASK-0044

**Descripción:**
Server Action que asigna dorsales manualmente según input del admin.

**Archivos involucrados:**
- `app/dorsales/[eventId]/actions.ts`

**Criterios de aceptación:**
- [ ] Recibe array de { atleta_id, numero }
- [ ] Valida que números no estén duplicados en el evento
- [ ] Valida que atletas cumplan requisitos (inscripción aprobada + pago verificado si aplica)
- [ ] Crea registros en tabla dorsales
- [ ] Actualiza inscripciones
- [ ] Transacción
- [ ] Retorna éxito/error con detalle

---

### TASK-0047: Crear vista de dorsales asignados por evento
**Complejidad:** M
**Dependencias:** TASK-0044

**Descripción:**
Página que muestra todos los dorsales asignados de un evento.

**Archivos a crear:**
- `app/dorsales/[eventId]/assigned/page.tsx`
- `components/dorsales/assigned-dorsals-table.tsx`

**Criterios de aceptación:**
- [ ] Tabla con dorsales asignados del evento
- [ ] Columnas: número, atleta, asociación, categoría, estado
- [ ] Filtrado por asociación y categoría
- [ ] Ordenamiento por número
- [ ] Búsqueda por nombre de atleta o número
- [ ] Badge de estado (activo/inactivo)
- [ ] Botón "Desactivar" (solo admin_fab, en casos excepcionales)
- [ ] Exportar a PDF/Excel (futuro)

---

## Módulo 11: Startlists

### TASK-0048: Crear página de gestión de startlists por prueba
**Complejidad:** L
**Dependencias:** TASK-0032, TASK-0047

**Descripción:**
Panel donde admin_fab y admin_asociacion crean y gestionan startlists de una prueba.

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/page.tsx`
- `app/startlists/[eventId]/[pruebaId]/actions.ts`
- `components/startlists/startlists-manager.tsx`

**Criterios de aceptación:**
- [ ] Muestra información de la prueba (nombre, categoría, género, distancia, carriles)
- [ ] Lista de startlists existentes de la prueba
- [ ] Por cada startlist: nombre, tipo (serie/lista), índice, estado
- [ ] Botón "Crear nueva startlist"
- [ ] Botón "Editar" en startlists con estado "borrador"
- [ ] Botón "Finalizar" en startlists borradores
- [ ] Startlists finalizadas son de solo lectura
- [ ] Accesible por admin_fab y admin_asociacion del evento

---

### TASK-0049: Crear formulario de nueva startlist
**Complejidad:** M
**Dependencias:** TASK-0048

**Descripción:**
Formulario para crear una startlist (serie o lista).

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/new/page.tsx`
- `app/startlists/[eventId]/[pruebaId]/new/actions.ts`
- `components/startlists/startlist-form.tsx`

**Criterios de aceptación:**
- [ ] Campos: nombre, tipo (serie/lista), índice (número de serie)
- [ ] Si prueba es_con_carriles, mostrar numero_carriles (pre-poblado desde prueba)
- [ ] Guarda en tabla startlists con estado "borrador"
- [ ] Redirección a página de edición de items tras crear

---

### TASK-0050: Crear editor de items de startlist
**Complejidad:** XL
**Dependencias:** TASK-0049

**Descripción:**
Interfaz drag-and-drop o tabla para asignar atletas (dorsales) a una startlist con sus carriles/orden.

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/edit/page.tsx`
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/edit/actions.ts`
- `components/startlists/startlist-editor.tsx`
- `components/startlists/athlete-selector.tsx`

**Criterios de aceptación:**
- [ ] Lista de atletas disponibles (con dorsal asignado y inscritos en la prueba)
- [ ] Filtrado por asociación y categoría
- [ ] Búsqueda por nombre o dorsal
- [ ] Área de edición:
  - Si es con carriles: tabla con columnas de carriles (1, 2, 3, ..., N)
  - Si es sin carriles: lista ordenada con posición_salida
- [ ] Drag-and-drop o botón "Agregar" para asignar atleta
- [ ] Por cada item: mostrar dorsal, nombre, apellido, asociación, categoría
- [ ] Input de "semilla" (marca previa) opcional
- [ ] Validaciones:
  - No repetir dorsal en la misma startlist
  - No repetir carril en la misma startlist (si aplica)
  - Carriles en rango [1..numero_carriles]
- [ ] Botón "Guardar borrador"
- [ ] Botón "Finalizar startlist" (cambia estado a "finalizada", ya no editable)

---

### TASK-0051: Implementar guardado de startlist items
**Complejidad:** M
**Dependencias:** TASK-0050

**Descripción:**
Server Action que guarda los items de una startlist.

**Archivos involucrados:**
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/edit/actions.ts`

**Criterios de aceptación:**
- [ ] Recibe array de items: { dorsal_id, atleta_id, carril?, posicion_salida?, orden, semilla? }
- [ ] Valida unicidad de dorsal en startlist
- [ ] Valida unicidad de carril (si aplica)
- [ ] Valida rango de carriles
- [ ] Elimina items anteriores de la startlist (reemplaza completamente)
- [ ] Inserta nuevos items en startlist_items
- [ ] Denormaliza datos: nombre_completo, apellido_completo, asociacion_nombre, categoria_atleta, es_con_carriles, numero_carriles_disponibles
- [ ] Transacción

---

### TASK-0052: Crear vista pública de startlist (solo lectura)
**Complejidad:** M
**Dependencias:** TASK-0050

**Descripción:**
Página que muestra una startlist finalizada en formato de presentación.

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/view/page.tsx`
- `components/startlists/startlist-view.tsx`

**Criterios de aceptación:**
- [ ] Muestra información de la prueba y startlist
- [ ] Si es con carriles: tabla visual con carriles y atletas
- [ ] Si es sin carriles: lista ordenada por posición_salida u orden
- [ ] Por cada atleta: dorsal, nombre completo, asociación, categoría, semilla
- [ ] Diseño apto para imprimir
- [ ] Botón "Imprimir" o "Exportar PDF" (futuro)
- [ ] Accesible por todos los roles autenticados
- [ ] (Futuro) Acceso público sin login si se habilita

---

## Módulo 12: Dashboards

### TASK-0053: Crear Dashboard de Admin FAB
**Complejidad:** L
**Dependencias:** TASK-0012, TASK-0026, TASK-0041

**Descripción:**
Dashboard principal para admin_fab con métricas globales y acciones rápidas.

**Archivos a crear:**
- `app/dashboard/admin-fab/page.tsx`
- `components/dashboard/admin-fab-dashboard.tsx`
- `components/dashboard/stats-card.tsx`

**Secciones del dashboard:**
1. **Métricas globales:**
   - Total de usuarios registrados (por rol)
   - Usuarios pendientes de aprobación (con enlace)
   - Total de eventos (por tipo y estado)
   - Pagos pendientes de verificación (con enlace)
2. **Acciones rápidas:**
   - "Ver usuarios pendientes"
   - "Ver pagos pendientes"
   - "Crear admin_asociacion"
   - "Ver eventos en revisión"
3. **Gráficos (opcional):**
   - Atletas por asociación (bar chart)
   - Eventos por mes (line chart)

**Criterios de aceptación:**
- [ ] Cards con métricas actualizadas
- [ ] Enlaces a páginas relevantes
- [ ] Diseño limpio con Shadcn components
- [ ] Loading skeletons mientras carga datos
- [ ] Accesible solo por admin_fab

---

### TASK-0054: Crear Dashboard de Admin Asociación
**Complejidad:** M
**Dependencias:** TASK-0026, TASK-0037, TASK-0039

**Descripción:**
Dashboard para admin_asociacion con resumen de su asociación.

**Archivos a crear:**
- `app/dashboard/admin-asociacion/page.tsx`
- `components/dashboard/admin-asociacion-dashboard.tsx`

**Secciones del dashboard:**
1. **Resumen de asociación:**
   - Total de atletas activos
   - Total de entrenadores y jueces
   - Eventos creados
2. **Inscripciones pendientes:**
   - Cantidad de inscripciones esperando aprobación
   - Enlace a "Revisar inscripciones"
3. **Pagos:**
   - Eventos federativos con pagos pendientes
   - Enlace a "Registrar pago"
4. **Acciones rápidas:**
   - "Crear evento"
   - "Ver mis eventos"
   - "Revisar inscripciones"

**Criterios de aceptación:**
- [ ] Muestra solo datos de la asociación del admin
- [ ] Cards con métricas
- [ ] Enlaces rápidos
- [ ] Accesible solo por admin_asociacion

---

### TASK-0055: Crear Dashboard de Atleta (estado: pendiente)
**Complejidad:** S
**Dependencias:** TASK-0011, TASK-0021

**Descripción:**
Dashboard para atleta con cuenta pendiente de aprobación.

**Archivos a crear:**
- `app/dashboard/atleta-pending/page.tsx`

**Criterios de aceptación:**
- [ ] Banner grande: "Tu cuenta está en revisión por admin_fab. Serás notificado cuando sea aprobada."
- [ ] Icono de reloj o spinner
- [ ] Botón "Completar mi perfil" (si no está completo)
- [ ] Botón "Ver mi perfil"
- [ ] Indicador de progreso del perfil (% de campos completados)

---

### TASK-0056: Crear Dashboard de Atleta (estado: activo)
**Complejidad:** M
**Dependencias:** TASK-0026, TASK-0036

**Descripción:**
Dashboard para atleta con cuenta activa.

**Archivos a crear:**
- `app/dashboard/atleta-activo/page.tsx`
- `components/dashboard/atleta-dashboard.tsx`

**Secciones del dashboard:**
1. **Próximos eventos:**
   - Lista de eventos aprobados con inscripciones abiertas
   - Botón "Ver detalles" e "Inscribirse"
2. **Mis inscripciones:**
   - Resumen: cantidad pendientes, aprobadas, con dorsal asignado
   - Enlace a "Ver todas mis inscripciones"
3. **Dorsales asignados:**
   - Lista de eventos donde tiene dorsal asignado con el número
4. **Mi perfil:**
   - Categoría FAB actual
   - Enlace a "Editar perfil"

**Criterios de aceptación:**
- [ ] Información personalizada del atleta
- [ ] Enlaces rápidos
- [ ] Badges de estado en inscripciones

---

### TASK-0057: Crear Dashboard de Entrenador/Juez (estado: pendiente)
**Complejidad:** S
**Dependencias:** TASK-0055

**Descripción:**
Similar a TASK-0055 pero para entrenador/juez.

**Criterios de aceptación:**
- [ ] Banner de cuenta en revisión
- [ ] Botón "Completar mis datos profesionales"
- [ ] Indicador de progreso

---

### TASK-0058: Crear Dashboard de Entrenador/Juez (estado: activo)
**Complejidad:** M
**Dependencias:** TASK-0026

**Descripción:**
Dashboard para entrenador/juez con cuenta activa.

**Archivos a crear:**
- `app/dashboard/entrenador-activo/page.tsx` (y similar para juez)
- `components/dashboard/entrenador-dashboard.tsx`

**Secciones del dashboard:**
1. **Próximos eventos:**
   - Lista de eventos aprobados
   - Enlace a ver detalles
2. **Startlists:**
   - Eventos con startlists finalizadas disponibles
   - Enlace a ver startlists
3. **Mi perfil:**
   - Resumen de datos profesionales
   - Enlace a "Editar perfil"

**Criterios de aceptación:**
- [ ] Información relevante para el rol
- [ ] Acceso a startlists de eventos
- [ ] Enlaces rápidos

---

### TASK-0059: Implementar router de dashboard según rol
**Complejidad:** S
**Dependencias:** TASK-0053 a TASK-0058

**Descripción:**
Lógica en `/dashboard/page.tsx` que redirecciona al dashboard correcto según rol y estado del usuario.

**Archivos involucrados:**
- `app/dashboard/page.tsx`

**Criterios de aceptación:**
- [ ] Si admin_fab ’ `/dashboard/admin-fab`
- [ ] Si admin_asociacion ’ `/dashboard/admin-asociacion`
- [ ] Si atleta + pendiente ’ `/dashboard/atleta-pending`
- [ ] Si atleta + activo ’ `/dashboard/atleta-activo`
- [ ] Si entrenador/juez + pendiente ’ `/dashboard/entrenador-pending`
- [ ] Si entrenador/juez + activo ’ `/dashboard/entrenador-activo`
- [ ] Si estado = rechazado o inactivo ’ mensaje de error

---

## Módulo 13: Componentes UI Compartidos

### TASK-0060: Crear componente DataTable reutilizable
**Complejidad:** L
**Dependencias:** Ninguna

**Descripción:**
Componente de tabla genérico con ordenamiento, filtrado, paginación y acciones.

**Archivos a crear:**
- `components/ui/data-table.tsx`
- `components/ui/data-table-toolbar.tsx`
- `components/ui/data-table-pagination.tsx`

**Props:**
- `columns`: definición de columnas (ColumnDef de TanStack Table)
- `data`: array de datos
- `pageSize`: tamaño de página (default 10)
- `searchPlaceholder`: placeholder del input de búsqueda
- `filters`: array de filtros personalizados

**Criterios de aceptación:**
- [ ] Usa TanStack Table (@tanstack/react-table)
- [ ] Ordenamiento por columnas (click en header)
- [ ] Búsqueda global (input de texto)
- [ ] Filtros customizables (dropdowns, checkboxes)
- [ ] Paginación con controles (primera, anterior, siguiente, última)
- [ ] Indicador de cantidad de resultados
- [ ] Loading state (skeleton)
- [ ] Empty state
- [ ] Responsivo

---

### TASK-0061: Crear componente FormField reutilizable
**Complejidad:** M
**Dependencias:** TASK-0005

**Descripción:**
Wrapper de campos de formulario con integración de React Hook Form y Zod.

**Archivos a crear:**
- `components/ui/form-field.tsx`
- `components/ui/form-input.tsx`
- `components/ui/form-select.tsx`
- `components/ui/form-textarea.tsx`

**Props:**
- `name`: nombre del campo (para React Hook Form)
- `label`: label del campo
- `placeholder`: placeholder
- `disabled`: campo bloqueado
- `locked`: indica si es campo bloqueado (muestra candado)
- `tooltip`: tooltip explicativo
- `type`: tipo de input (text, email, number, date, etc.)

**Criterios de aceptación:**
- [ ] Integración con React Hook Form
- [ ] Muestra errores de validación Zod
- [ ] Si locked=true, muestra icono de candado + disabled + tooltip
- [ ] Estilos consistentes con Shadcn UI
- [ ] Variantes: input, select, textarea, date picker, file upload

---

### TASK-0062: Crear componente StatusBadge
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Componente de badge para mostrar estados con colores distintivos.

**Archivos a crear:**
- `components/ui/status-badge.tsx`

**Props:**
- `status`: string (pendiente, activo, aprobado, rechazado, verificado, etc.)
- `variant`: color scheme (default, success, warning, danger, info)

**Mapeo de colores:**
- Verde: aprobado, activo, verificado
- Amarillo: pendiente, en_revision
- Rojo: rechazado, observado, inactivo
- Azul: información

**Criterios de aceptación:**
- [ ] Usa Shadcn Badge como base
- [ ] Variantes de color predefinidas
- [ ] Texto del badge en español
- [ ] Tamaños: small, medium, large
- [ ] Opción de añadir icono

---

### TASK-0063: Crear componente FileUpload
**Complejidad:** M
**Dependencias:** TASK-0004

**Descripción:**
Componente de carga de archivos con preview, validación y upload a Supabase Storage.

**Archivos a crear:**
- `components/ui/file-upload.tsx`
- `components/ui/file-preview.tsx`

**Props:**
- `bucket`: nombre del bucket de Supabase
- `path`: path dentro del bucket
- `accept`: tipos de archivo aceptados (image/*, .pdf, etc.)
- `maxSize`: tamaño máximo en MB
- `onUploadComplete`: callback con URL del archivo subido

**Criterios de aceptación:**
- [ ] Drag-and-drop o click para seleccionar archivo
- [ ] Validación de tipo de archivo
- [ ] Validación de tamaño
- [ ] Preview de imágenes (thumbnail)
- [ ] Preview de PDFs (icono + nombre)
- [ ] Progress bar durante upload
- [ ] Upload a Supabase Storage
- [ ] Retorna URL pública del archivo
- [ ] Manejo de errores (archivo muy grande, tipo no permitido, error de red)
- [ ] Botón "Eliminar" para remover archivo

---

### TASK-0064: Crear componente Stepper para formularios multi-paso
**Complejidad:** M
**Dependencias:** Ninguna

**Descripción:**
Componente de stepper (pasos) para formularios multi-paso.

**Archivos a crear:**
- `components/ui/stepper.tsx`
- `components/ui/stepper-step.tsx`

**Props:**
- `steps`: array de { id, label, description? }
- `currentStep`: índice del paso actual
- `onStepChange`: callback al cambiar de paso

**Criterios de aceptación:**
- [ ] Muestra lista de pasos con indicador visual
- [ ] Paso actual destacado
- [ ] Pasos completados con check
- [ ] Pasos futuros en gris
- [ ] Línea conectora entre pasos
- [ ] Click en paso completado permite volver atrás
- [ ] No permite saltar pasos no completados
- [ ] Responsivo (vertical en mobile, horizontal en desktop)

---

### TASK-0065: Crear sistema de notificaciones Toast
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Configurar sistema de notificaciones toast para mensajes de éxito/error.

**Archivos a crear:**
- `components/ui/toaster.tsx` (ya existe en Shadcn, solo configurar)
- `lib/toast-utils.ts`

**Helpers a crear:**
- `showSuccess(message)`
- `showError(message)`
- `showInfo(message)`
- `showWarning(message)`

**Criterios de aceptación:**
- [ ] Usa Shadcn Toast/Sonner
- [ ] Helpers simples de usar en Server Actions
- [ ] Posición: bottom-right
- [ ] Auto-dismiss después de 5s (configurable)
- [ ] Iconos según tipo (, , 9,  )
- [ ] Animaciones suaves

---

### TASK-0066: Crear componente LoadingSpinner y Skeleton
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Componentes para estados de carga.

**Archivos a crear:**
- `components/ui/loading-spinner.tsx`
- `components/ui/skeleton-loader.tsx`

**Criterios de aceptación:**
- [ ] LoadingSpinner: spinner animado con tamaños (small, medium, large)
- [ ] SkeletonLoader: placeholders para diferentes componentes (card, table, form)
- [ ] Usa Shadcn Skeleton como base
- [ ] Reutilizable en toda la app

---

### TASK-0067: Crear componente ConfirmDialog
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Modal de confirmación para acciones destructivas.

**Archivos a crear:**
- `components/ui/confirm-dialog.tsx`

**Props:**
- `title`: título del modal
- `description`: descripción de la acción
- `confirmText`: texto del botón de confirmar (default: "Confirmar")
- `cancelText`: texto del botón de cancelar (default: "Cancelar")
- `variant`: "danger" | "warning" | "default"
- `onConfirm`: callback al confirmar

**Criterios de aceptación:**
- [ ] Usa Shadcn AlertDialog
- [ ] Variante "danger" con botón rojo
- [ ] Variante "warning" con botón amarillo
- [ ] Opción de añadir input (ej: para observaciones al rechazar)
- [ ] Opción de requerir confirmación extra (ej: escribir "CONFIRMAR")

---

## Módulo 14: Integraciones y Utilidades

### TASK-0068: Crear utilidades de formateo
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Funciones helper para formateo de datos.

**Archivos a crear:**
- `lib/format-utils.ts`

**Funciones a crear:**
- `formatDate(date)`: formatea fecha a "DD/MM/YYYY"
- `formatDateTime(date)`: formatea fecha y hora a "DD/MM/YYYY HH:mm"
- `formatCurrency(amount)`: formatea monto a "Bs 1.234,56"
- `formatCI(ci)`: formatea CI con guiones
- `formatPhone(phone)`: formatea teléfono
- `capitalizeWords(str)`: capitaliza primera letra de cada palabra

**Criterios de aceptación:**
- [ ] Funciones puras (sin efectos secundarios)
- [ ] Manejo de null/undefined
- [ ] Formato boliviano (fecha DD/MM/YYYY, moneda Bs)

---

### TASK-0069: Crear utilidades de cálculo de categoría FAB
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Función client-side que replica el cálculo de categoría FAB del backend.

**Archivos a crear:**
- `lib/categoria-fab-utils.ts`

**Funciones:**
- `calcularCategoriaFAB(fechaNacimiento: Date): string`
- `getEdad(fechaNacimiento: Date): number`

**Criterios de aceptación:**
- [ ] Lógica idéntica al trigger de la BD
- [ ] Retorna categoría correcta según edad
- [ ] Usado en formularios para preview antes de guardar

---

### TASK-0070: Crear hook useDebounce
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Hook para debouncing de inputs (búsqueda, filtros).

**Archivos a crear:**
- `hooks/useDebounce.ts`

**Criterios de aceptación:**
- [ ] Retorna valor debounced
- [ ] Delay configurable (default 300ms)
- [ ] Limpia timeout en cleanup

---

### TASK-0071: Crear hook usePermissions
**Complejidad:** M
**Dependencias:** TASK-0011

**Descripción:**
Hook para verificar permisos del usuario actual.

**Archivos a crear:**
- `hooks/usePermissions.ts`

**Funciones del hook:**
- `isAdminFAB(): boolean`
- `isAdminAsociacion(): boolean`
- `canEditEvent(eventId): boolean`
- `canApproveInscription(inscripcionId): boolean`
- `canAssignDorsal(): boolean`

**Criterios de aceptación:**
- [ ] Usa hook useUser
- [ ] Retorna booleans de permisos
- [ ] Usado para mostrar/ocultar UI según permisos

---

### TASK-0072: Configurar React Query con defaults
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Configurar React Query Provider con opciones por defecto.

**Archivos a crear:**
- `lib/react-query-provider.tsx`
- `lib/react-query-config.ts`

**Configuración:**
- `staleTime`: 5 minutos (datos de catálogos), 30 segundos (datos transaccionales)
- `cacheTime`: 10 minutos
- `refetchOnWindowFocus`: false (en dev), true (en prod)
- `retry`: 1 vez

**Criterios de aceptación:**
- [ ] Provider envuelve toda la app
- [ ] React Query Devtools habilitado en desarrollo
- [ ] Configuración optimizada para performance

---

## Módulo 15: Testing y Calidad (Futuro - Opcional)

### TASK-0073: Setup de testing con Jest y React Testing Library
**Complejidad:** M
**Dependencias:** Ninguna

**Descripción:**
Configurar entorno de testing para el proyecto.

**Archivos a crear:**
- `jest.config.js`
- `jest.setup.js`
- `.test-utils.tsx` (helpers de testing)

**Criterios de aceptación:**
- [ ] Jest configurado para Next.js
- [ ] React Testing Library instalado
- [ ] Mock de Supabase client
- [ ] Script `npm test` funcional

---

### TASK-0074: Tests unitarios para utilidades de validación
**Complejidad:** M
**Dependencias:** TASK-0005, TASK-0073

**Descripción:**
Tests para schemas de validación Zod.

**Archivos a crear:**
- `lib/validations/__tests__/profile.test.ts`
- `lib/validations/__tests__/event.test.ts`

**Criterios de aceptación:**
- [ ] Test de validación de CI
- [ ] Test de validación de email
- [ ] Test de rangos (edad, altura, peso)
- [ ] Test de campos obligatorios
- [ ] Coverage > 80%

---

### TASK-0075: Tests de integración para flujo de inscripción
**Complejidad:** L
**Dependencias:** TASK-0035 a TASK-0039, TASK-0073

**Descripción:**
Tests end-to-end del flujo de inscripción completo.

**Archivos a crear:**
- `__tests__/integration/inscription-flow.test.tsx`

**Escenarios:**
- [ ] Atleta crea inscripción ’ éxito
- [ ] Atleta intenta inscribirse fuera de ventana ’ error
- [ ] Atleta intenta inscribirse en prueba de categoría diferente ’ error
- [ ] Admin_asociacion aprueba inscripción ’ estado cambia
- [ ] Admin_fab aprueba inscripción con pago verificado ’ estado cambia

---

## Módulo 16: Deployment y DevOps

### TASK-0076: Configurar variables de entorno para producción
**Complejidad:** S
**Dependencias:** Ninguna

**Descripción:**
Documentar y configurar todas las variables de entorno necesarias.

**Archivos a crear:**
- `.env.example`
- `docs/environment-setup.md`

**Variables a documentar:**
- Supabase (URL, keys)
- Next.js (NODE_ENV, BASE_URL)
- Storage buckets
- Otras configuraciones

**Criterios de aceptación:**
- [ ] `.env.example` completo
- [ ] Documentación de cada variable
- [ ] Instrucciones de setup para dev y prod

---

### TASK-0077: Configurar build y deploy en Vercel
**Complejidad:** S
**Dependencias:** Todas las anteriores

**Descripción:**
Configurar el proyecto para deployment en Vercel.

**Archivos a crear:**
- `vercel.json`

**Criterios de aceptación:**
- [ ] Proyecto conectado a GitHub
- [ ] Vercel conectado al repo
- [ ] Variables de entorno configuradas en Vercel
- [ ] Build exitoso
- [ ] Preview deployments para PRs
- [ ] Production deployment funcional

---

### TASK-0078: Crear script de seed para datos de prueba
**Complejidad:** M
**Dependencias:** TASK-0001, TASK-0006

**Descripción:**
Script para popular la BD con datos de prueba (dev/staging).

**Archivos a crear:**
- `scripts/seed-test-data.ts`

**Datos a crear:**
- 1 admin_fab
- 9 admin_asociacion (uno por asociación)
- 20 atletas de prueba (distribuidos en asociaciones)
- 5 entrenadores
- 3 jueces
- 2 eventos de prueba (1 federativo, 1 asociación)
- Pruebas por evento
- Inscripciones de ejemplo

**Criterios de aceptación:**
- [ ] Script ejecutable: `npm run seed:test`
- [ ] Idempotente (no crea duplicados)
- [ ] Usa contraseñas conocidas para testing
- [ ] Crea datos realistas

---

## Módulo 17: Documentación

### TASK-0079: Crear documentación de arquitectura
**Complejidad:** M
**Dependencias:** Ninguna

**Descripción:**
Documentar la arquitectura del sistema.

**Archivos a crear:**
- `docs/architecture.md`
- `docs/database-schema.md`
- `docs/api-routes.md`

**Contenido:**
- Diagrama de arquitectura
- Stack tecnológico
- Estructura de carpetas
- Convenciones de código
- Flujos principales
- Esquema de BD con relaciones

**Criterios de aceptación:**
- [ ] Documentación clara y concisa
- [ ] Diagramas visuales (mermaid)
- [ ] Útil para onboarding de nuevos devs

---

### TASK-0080: Crear guías de usuario por rol
**Complejidad:** L
**Dependencias:** Todas las anteriores

**Descripción:**
Manuales de usuario para cada rol.

**Archivos a crear:**
- `docs/user-guide-admin-fab.md`
- `docs/user-guide-admin-asociacion.md`
- `docs/user-guide-atleta.md`
- `docs/user-guide-entrenador.md`
- `docs/user-guide-juez.md`

**Contenido por guía:**
- Introducción al rol
- Cómo hacer login
- Funcionalidades principales
- Flujos paso a paso con capturas de pantalla
- Preguntas frecuentes
- Troubleshooting

**Criterios de aceptación:**
- [ ] Una guía por rol
- [ ] Capturas de pantalla actualizadas
- [ ] Escritas en lenguaje no técnico
- [ ] Formato PDF descargable

---

## Resumen de Tareas

**Total de tareas:** 80

**Por complejidad:**
- S (Small): 18 tareas (~18-36 horas)
- M (Medium): 32 tareas (~96-160 horas)
- L (Large): 23 tareas (~23-46 días)
- XL (Extra Large): 7 tareas (~21-35 días)

**Estimación total:** ~4-6 meses para 1 desarrollador full-time

**Dependencias críticas:**
- TASK-0001 a TASK-0006: Setup inicial (debe completarse primero)
- TASK-0007 a TASK-0011: Autenticación (base para todo)
- TASK-0018 a TASK-0023: Perfiles (necesario para flujo completo)
- TASK-0035 a TASK-0047: Flujo de inscripción completo

**Priorización sugerida:**
1. **Sprint 1 (Semanas 1-2):** TASK-0001 a TASK-0011 (Setup y Auth)
2. **Sprint 2 (Semanas 3-4):** TASK-0012 a TASK-0023 (Gestión de usuarios y perfiles)
3. **Sprint 3 (Semanas 5-6):** TASK-0024 a TASK-0034 (Asociaciones, Eventos, Pruebas)
4. **Sprint 4 (Semanas 7-8):** TASK-0035 a TASK-0043 (Inscripciones y Pagos)
5. **Sprint 5 (Semanas 9-10):** TASK-0044 a TASK-0052 (Dorsales y Startlists)
6. **Sprint 6 (Semanas 11-12):** TASK-0053 a TASK-0059 (Dashboards)
7. **Sprint 7 (Semanas 13-14):** TASK-0060 a TASK-0072 (Componentes UI y utilidades)
8. **Sprint 8 (Semanas 15-16):** TASK-0073 a TASK-0080 (Testing, Deploy, Docs)

---

**Fin del documento de tareas**
