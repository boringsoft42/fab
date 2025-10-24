# Tareas de Implementaci�n - Sistema FAB

Este documento desglosa el PRD del Sistema de Gesti�n Integral FAB en tareas ejecutables organizadas por m�dulos.

**Leyenda de Complejidad:**
- **S (Small)**: 1-2 horas
- **M (Medium)**: 3-5 horas
- **L (Large)**: 1-2 d�as
- **XL (Extra Large)**: 3-5 d�as

---

## M�dulo 1: Configuraci�n Inicial del Proyecto

### TASK-0001: Ejecutar Schema SQL en Supabase
**Complejidad:** M
**Dependencias:** Ninguna

**Descripci�n:**
Ejecutar el schema SQL completo del PRD en la base de datos de Supabase para crear todas las tablas, enums, triggers, funciones y pol�ticas RLS.

**Archivos involucrados:**
- Ejecutar SQL en Supabase Dashboard o CLI

**Criterios de aceptaci�n:**
- [ ] Todas las tablas creadas (users, atletas, entrenadores, jueces, asociaciones, eventos, pruebas, inscripciones, dorsales, pagos_evento_asociacion, startlists, startlist_items)
- [ ] Todos los ENUMs creados
- [ ] Triggers funcionando (municipio, categor�a FAB)
- [ ] RLS habilitado en todas las tablas
- [ ] Pol�ticas RLS aplicadas
- [ ] 9 asociaciones departamentales insertadas
- [ ] Funci�n `fab_calcular_categoria_fn` operativa

---

### TASK-0002: Configurar Prisma con el schema existente
**Complejidad:** M
**Dependencias:** TASK-0001

**Descripci�n:**
Generar el schema de Prisma (`prisma/schema.prisma`) a partir de la base de datos ya creada mediante introspecci�n, y ajustar tipos personalizados.

**Archivos involucrados:**
- `prisma/schema.prisma`

**Pasos:**
1. Ejecutar `npx prisma db pull` para introspecci�n
2. Revisar y ajustar relaciones
3. Ejecutar `npx prisma generate`

**Criterios de aceptaci�n:**
- [ ] Schema Prisma refleja todas las tablas
- [ ] Relaciones FK correctamente mapeadas
- [ ] ENUMs definidos como tipos Prisma
- [ ] Cliente Prisma generado sin errores
- [ ] Tipos TypeScript disponibles

---

### TASK-0003: Configurar Supabase Auth
**Complejidad:** S
**Dependencias:** TASK-0001

**Descripci�n:**
Configurar Supabase Auth en el proyecto con las variables de entorno necesarias y crear el cliente de Supabase.

**Archivos involucrados:**
- `.env.local`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

**Criterios de aceptaci�n:**
- [ ] Variables de entorno configuradas (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Cliente de Supabase creado para client-side
- [ ] Cliente de Supabase creado para server-side (con service role key)
- [ ] Helpers para auth (getSession, getUser) implementados

---

### TASK-0004: Configurar Supabase Storage con buckets y RLS
**Complejidad:** M
**Dependencias:** TASK-0001

**Descripci�n:**
Crear los buckets necesarios en Supabase Storage y configurar pol�ticas RLS para cada bucket.

**Buckets a crear:**
- `profile-photos/`
- `documents/`
- `event-logos/`

**Path structure:** `{bucket}/{asociacion_id}/{user_id}/{filename}`

**Criterios de aceptaci�n:**
- [ ] 3 buckets creados en Supabase Storage
- [ ] RLS habilitado en cada bucket
- [ ] Pol�tica: usuario puede subir a su propio path
- [ ] Pol�tica: admin_fab puede acceder a todo
- [ ] Pol�tica: admin_asociacion puede acceder a su asociaci�n
- [ ] Validaciones de tama�o implementadas (fotos: 5MB, docs: 10MB, QR: 2MB)

---

### TASK-0005: Crear utilidades de validaci�n con Zod
**Complejidad:** M
**Dependencias:** Ninguna

**Descripci�n:**
Crear schemas de validaci�n Zod para todos los formularios del sistema.

**Archivos a crear:**
- `lib/validations/auth.ts`
- `lib/validations/profile.ts`
- `lib/validations/event.ts`
- `lib/validations/inscription.ts`

**Criterios de aceptaci�n:**
- [ ] Schema para registro de usuario
- [ ] Schemas para perfiles (atleta, entrenador, juez)
- [ ] Schema para eventos y pruebas
- [ ] Schema para inscripciones
- [ ] Validaciones de CI (�nico, formato)
- [ ] Validaciones de email
- [ ] Validaciones de rangos (edad, altura, peso)

---

### TASK-0006: Crear seed script para admin_fab inicial
**Complejidad:** S
**Dependencias:** TASK-0001, TASK-0003

**Descripci�n:**
Crear un script de seed que cree la primera cuenta admin_fab directamente en Supabase Auth y en la tabla users.

**Archivos a crear:**
- `scripts/seed-admin.ts`

**Criterios de aceptaci�n:**
- [ ] Script crea usuario en Supabase Auth
- [ ] Script crea registro en tabla users con rol admin_fab
- [ ] Script usa variables de entorno para credenciales
- [ ] Estado inicial: activo
- [ ] Asociaci�n asignada (puede ser "La Paz" por defecto)
- [ ] Script es idempotente (no falla si ya existe)

---

## M�dulo 2: Autenticaci�n

### TASK-0007: Crear p�gina de Login
**Complejidad:** M
**Dependencias:** TASK-0003, TASK-0005

**Descripci�n:**
Implementar la p�gina de login (`/auth/login`) para todos los roles usando Supabase Auth.

**Archivos a crear:**
- `app/auth/login/page.tsx`
- `app/auth/login/actions.ts` (Server Action)

**Criterios de aceptaci�n:**
- [ ] Formulario con email y password
- [ ] Validaci�n con Zod
- [ ] Integraci�n con Supabase Auth
- [ ] Manejo de errores (credenciales inv�lidas, cuenta no existe)
- [ ] Redirecci�n seg�n rol despu�s de login exitoso
- [ ] Link a "Olvid� mi contrase�a"
- [ ] Link a "Registrarse" (p�blico)

---

### TASK-0008: Crear p�gina de Sign Up P�blico (Atleta/Entrenador/Juez)
**Complejidad:** L
**Dependencias:** TASK-0003, TASK-0005

**Descripci�n:**
Implementar la p�gina de registro p�blico (`/auth/register`) que permite SOLO registrarse como atleta, entrenador o juez.

**Archivos a crear:**
- `app/auth/register/page.tsx`
- `app/auth/register/actions.ts` (Server Action)

**Criterios de aceptaci�n:**
- [ ] Formulario multi-step (paso 1: credenciales, paso 2: asociaci�n y datos b�sicos)
- [ ] Selector de rol: SOLO atleta, entrenador, juez (NO admin_fab ni admin_asociacion)
- [ ] Selector de asociaci�n departamental (dropdown con las 9)
- [ ] Validaci�n de email �nico
- [ ] Creaci�n de cuenta en Supabase Auth
- [ ] Creaci�n de registro en tabla users con estado "pendiente"
- [ ] Mensaje: "Tu cuenta ha sido creada y est� en revisi�n"
- [ ] Notificaci�n a admin_fab (opcional en esta task, puede ser TASK separada)

---

### TASK-0009: Implementar middleware de protecci�n de rutas
**Complejidad:** M
**Dependencias:** TASK-0003

**Descripci�n:**
Crear middleware de Next.js para proteger rutas seg�n autenticaci�n y rol.

**Archivos a crear:**
- `middleware.ts`
- `lib/auth/check-role.ts`

**Criterios de aceptaci�n:**
- [ ] Rutas p�blicas: `/`, `/auth/login`, `/auth/register`
- [ ] Rutas protegidas requieren autenticaci�n
- [ ] Redirecci�n a `/auth/login` si no autenticado
- [ ] Verificaci�n de rol para rutas administrativas
- [ ] Bloqueo de usuarios con estado "rechazado" o "inactivo"
- [ ] Usuarios "pendientes" solo acceden a `/dashboard` y `/profile`

---

### TASK-0010: Crear p�gina de Reset Password
**Complejidad:** S
**Dependencias:** TASK-0003

**Descripci�n:**
Implementar flujo de recuperaci�n de contrase�a.

**Archivos a crear:**
- `app/auth/reset-password/page.tsx`
- `app/auth/reset-password/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Formulario solicita email
- [ ] Env�a email de recuperaci�n v�a Supabase Auth
- [ ] Mensaje de confirmaci�n
- [ ] P�gina de actualizaci�n de contrase�a (con token)

---

### TASK-0011: Crear hook personalizado useUser
**Complejidad:** S
**Dependencias:** TASK-0003

**Descripci�n:**
Crear hook React para obtener informaci�n del usuario autenticado incluyendo su rol y estado.

**Archivos a crear:**
- `hooks/useUser.ts`

**Criterios de aceptaci�n:**
- [ ] Hook retorna: user (auth), profile (users table), role, estado, asociacion_id
- [ ] Hook usa React Query para caching
- [ ] Loading states
- [ ] Error handling
- [ ] Actualizaci�n autom�tica al cambiar sesi�n

---

## M�dulo 3: Gesti�n de Usuarios (Admin FAB)

### TASK-0012: Crear p�gina de usuarios pendientes (Admin FAB)
**Complejidad:** L
**Dependencias:** TASK-0007, TASK-0009, TASK-0011

**Descripci�n:**
Implementar el panel donde admin_fab ve y gestiona usuarios p�blicos pendientes de aprobaci�n.

**Archivos a crear:**
- `app/users/pending/page.tsx`
- `app/users/pending/actions.ts`
- `components/users/pending-users-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con usuarios estado "pendiente"
- [ ] Columnas: nombre, email, rol, asociaci�n, fecha_registro
- [ ] Filtrado por rol y asociaci�n
- [ ] Ordenamiento por fecha
- [ ] Paginaci�n (10 por p�gina)
- [ ] Bot�n "Ver detalle" lleva a `/users/[userId]`
- [ ] Accesible solo por admin_fab

---

### TASK-0013: Crear p�gina de detalle de usuario pendiente
**Complejidad:** M
**Dependencias:** TASK-0012

**Descripci�n:**
P�gina de detalle para revisar datos completos de un usuario pendiente antes de aprobar/rechazar.

**Archivos a crear:**
- `app/users/[userId]/page.tsx`
- `app/users/[userId]/actions.ts`
- `components/users/user-detail-view.tsx`

**Criterios de aceptaci�n:**
- [ ] Muestra todos los datos del perfil (seg�n rol: atleta/entrenador/juez)
- [ ] Muestra documentos cargados (fotos, CI, certificados)
- [ ] Botones: "Aprobar", "Rechazar"
- [ ] Modal de confirmaci�n para aprobar
- [ ] Modal con textarea para rechazar (observaciones obligatorias)
- [ ] Actualiza estado en tabla users
- [ ] Registra aprobado_por_fab y fecha_aprobacion

---

### TASK-0014: Implementar acci�n de aprobar usuario
**Complejidad:** M
**Dependencias:** TASK-0013

**Descripci�n:**
Server Action para aprobar un usuario pendiente (cambiar estado a "activo").

**Archivos involucrados:**
- `app/users/[userId]/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Verifica que el usuario actual es admin_fab
- [ ] Actualiza users.estado = "activo"
- [ ] Registra aprobado_por_fab = auth.uid()
- [ ] Registra fecha_aprobacion = now()
- [ ] Si es atleta/entrenador/juez: actualiza perfil correspondiente
- [ ] Retorna �xito/error
- [ ] (Opcional) Env�a email de notificaci�n al usuario

---

### TASK-0015: Implementar acci�n de rechazar usuario
**Complejidad:** M
**Dependencias:** TASK-0013

**Descripci�n:**
Server Action para rechazar un usuario pendiente con observaciones.

**Archivos involucrados:**
- `app/users/[userId]/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Verifica que el usuario actual es admin_fab
- [ ] Requiere observaciones (motivo de rechazo)
- [ ] Actualiza users.estado = "rechazado"
- [ ] Registra aprobado_por_fab y fecha_aprobacion
- [ ] Actualiza observaciones en perfil correspondiente
- [ ] Usuario no puede hacer login despu�s del rechazo
- [ ] (Opcional) Env�a email con motivo de rechazo

---

### TASK-0016: Crear p�gina de gesti�n de admin_asociacion
**Complejidad:** L
**Dependencias:** TASK-0007, TASK-0009

**Descripci�n:**
Panel donde admin_fab puede ver, crear, activar/desactivar cuentas de admin_asociacion.

**Archivos a crear:**
- `app/users/admins/page.tsx`
- `app/users/admins/actions.ts`
- `components/users/admin-asociacion-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con todos los admin_asociacion
- [ ] Columnas: nombre, email, asociaci�n, estado, fecha_creaci�n
- [ ] Filtrado por asociaci�n y estado
- [ ] Bot�n "Crear nuevo admin_asociacion"
- [ ] Bot�n "Activar/Desactivar" en cada fila
- [ ] Badge de estado (activo/inactivo)
- [ ] Accesible solo por admin_fab

---

### TASK-0017: Crear formulario de nuevo admin_asociacion
**Complejidad:** L
**Dependencias:** TASK-0016

**Descripci�n:**
Formulario para que admin_fab cree cuentas de admin_asociacion.

**Archivos a crear:**
- `app/users/admins/new/page.tsx`
- `app/users/admins/new/actions.ts`
- `components/users/create-admin-form.tsx`

**Criterios de aceptaci�n:**
- [ ] Formulario con: email, nombre completo, asociaci�n (dropdown)
- [ ] Opci�n: generar contrase�a temporal o enviar link de activaci�n
- [ ] Validaci�n de email �nico
- [ ] Crea cuenta en Supabase Auth
- [ ] Crea registro en users con rol "admin_asociacion", estado "activo"
- [ ] Env�a email con credenciales o link de activaci�n
- [ ] Redirecci�n a `/users/admins` tras �xito
- [ ] Manejo de errores (email ya existe, etc.)

---

## M�dulo 4: Perfiles

### TASK-0018: Crear formulario de perfil de Atleta (registro inicial)
**Complejidad:** XL
**Dependencias:** TASK-0008, TASK-0005, TASK-0004

**Descripci�n:**
Formulario multi-step para que el atleta complete su perfil despu�s del registro p�blico.

**Archivos a crear:**
- `app/profile/atleta/page.tsx`
- `app/profile/atleta/actions.ts`
- `components/profile/atleta-form.tsx`
- `components/profile/document-upload.tsx`

**Steps del formulario:**
1. Datos Personales (nombre, apellido, CI, fecha_nacimiento, g�nero, nacionalidad, estado_civil)
2. Datos de Contacto (tel�fono, direcci�n, ciudad, departamento)
3. Datos Federativos (municipio si aplica, especialidad, a�os_practica)
4. Datos F�sicos (altura, peso, tallas, tipo_sangre)
5. Mejor Marca Personal (opcional)
6. Contacto de Emergencia
7. Documentos (foto, CI frente/reverso, certificado m�dico, carnet vacunaci�n)

**Criterios de aceptaci�n:**
- [ ] Formulario con 7 pasos (stepper visual)
- [ ] Validaci�n en cada paso con Zod
- [ ] Campo "municipio" obligatorio solo si asociaci�n != Santa Cruz
- [ ] Categor�a FAB se calcula autom�ticamente (mostrar pero no editable)
- [ ] Upload de archivos a Supabase Storage
- [ ] Preview de im�genes cargadas
- [ ] Validaci�n de tama�os de archivo
- [ ] Guarda en tabla atletas
- [ ] Estado inicial del perfil: "pendiente"
- [ ] Bot�n "Guardar borrador" en cada paso
- [ ] Bot�n "Enviar para aprobaci�n" en �ltimo paso

---

### TASK-0019: Crear formulario de perfil de Entrenador (registro inicial)
**Complejidad:** L
**Dependencias:** TASK-0008, TASK-0005, TASK-0004

**Descripci�n:**
Formulario multi-step para que el entrenador complete su perfil despu�s del registro p�blico.

**Steps del formulario:**
1. Datos Personales
2. Datos de Contacto
3. Datos Profesionales (especialidad, a�os_experiencia, certificaciones, t�tulos_deportivos)
4. Datos F�sicos
5. Contacto de Emergencia
6. Documentos (foto, CI, certificado m�dico, t�tulos profesionales, certificaciones deportivas)

**Criterios de aceptaci�n:**
- [ ] Similar a TASK-0018 pero adaptado a entrenador
- [ ] Campos profesionales espec�ficos de entrenador
- [ ] Documentos opcionales: t�tulos_profesionales_url, certificaciones_deportivas_url
- [ ] Guarda en tabla entrenadores
- [ ] Estado inicial: "pendiente"

---

### TASK-0020: Crear formulario de perfil de Juez (registro inicial)
**Complejidad:** L
**Dependencias:** TASK-0008, TASK-0005, TASK-0004

**Descripci�n:**
Formulario multi-step para que el juez complete su perfil despu�s del registro p�blico.

**Steps del formulario:**
1. Datos Personales
2. Datos de Contacto
3. Datos Profesionales (especialidad, a�os_experiencia, nivel_juez, certificaciones, eventos_juzgados)
4. Datos F�sicos
5. Contacto de Emergencia
6. Documentos (foto, CI, certificado m�dico, certificaciones_juez, licencia_juez)

**Criterios de aceptaci�n:**
- [ ] Similar a TASK-0018 pero adaptado a juez
- [ ] Campo nivel_juez: dropdown con "nacional" / "internacional"
- [ ] Documentos opcionales: certificaciones_juez_url, licencia_juez_url
- [ ] Guarda en tabla jueces
- [ ] Estado inicial: "pendiente"

---

### TASK-0021: Crear p�gina "Mi Perfil" con campos bloqueados
**Complejidad:** L
**Dependencias:** TASK-0018, TASK-0019, TASK-0020, TASK-0011

**Descripci�n:**
P�gina donde usuarios activos pueden editar su perfil, excepto campos bloqueados (datos personales).

**Archivos a crear:**
- `app/profile/edit/page.tsx`
- `app/profile/edit/actions.ts`
- `components/profile/edit-profile-form.tsx`

**Criterios de aceptaci�n:**
- [ ] Carga perfil del usuario autenticado seg�n su rol
- [ ] Campos bloqueados (nombre, apellido, CI, fecha_nacimiento, g�nero, nacionalidad) mostrados como disabled con icono de candado
- [ ] Tooltip en campos bloqueados: "Este campo solo puede ser editado por admin_fab"
- [ ] Campos editables: contacto, f�sicos, emergencia, datos profesionales
- [ ] Validaci�n con Zod
- [ ] Server Action valida que campos bloqueados no cambien (seguridad backend)
- [ ] Mensaje de �xito tras guardar
- [ ] Bot�n "Actualizar documentos" lleva a `/profile/documents`

---

### TASK-0022: Crear p�gina de actualizaci�n de documentos
**Complejidad:** M
**Dependencias:** TASK-0021, TASK-0004

**Descripci�n:**
P�gina donde usuarios pueden actualizar sus documentos (fotos, certificados).

**Archivos a crear:**
- `app/profile/documents/page.tsx`
- `app/profile/documents/actions.ts`
- `components/profile/document-manager.tsx`

**Criterios de aceptaci�n:**
- [ ] Muestra documentos actuales con preview
- [ ] Bot�n "Reemplazar" en cada documento
- [ ] Upload a Supabase Storage
- [ ] Validaci�n de tipo y tama�o
- [ ] Actualiza URLs en tabla de perfil correspondiente
- [ ] Mensaje de �xito/error

---

### TASK-0023: Crear componente de visualizaci�n de perfil (solo lectura)
**Complejidad:** M
**Dependencias:** TASK-0018, TASK-0019, TASK-0020

**Descripci�n:**
Componente reutilizable para mostrar un perfil completo en modo solo lectura (usado por admins para revisar).

**Archivos a crear:**
- `components/profile/profile-view.tsx`
- `components/profile/profile-section.tsx`

**Criterios de aceptaci�n:**
- [ ] Recibe perfil (atleta/entrenador/juez) como prop
- [ ] Muestra todos los campos organizados por secciones
- [ ] Muestra documentos con opci�n de vista previa/descarga
- [ ] Destacar categor�a FAB (si es atleta)
- [ ] Badge de estado del perfil
- [ ] Responsivo

---

## M�dulo 5: Asociaciones

### TASK-0024: Crear p�gina de gesti�n de asociaciones (Admin FAB)
**Complejidad:** M
**Dependencias:** TASK-0007, TASK-0009

**Descripci�n:**
Panel donde admin_fab puede ver y editar las 9 asociaciones departamentales.

**Archivos a crear:**
- `app/associations/page.tsx`
- `app/associations/actions.ts`
- `components/associations/associations-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con las 9 asociaciones
- [ ] Columnas: nombre, departamento, ciudad, contacto, email, tel�fono, estado
- [ ] Badge de estado (activo/inactivo)
- [ ] Bot�n "Editar" en cada fila
- [ ] No se puede eliminar asociaciones (solo desactivar)
- [ ] Accesible solo por admin_fab

---

### TASK-0025: Crear formulario de edici�n de asociaci�n
**Complejidad:** S
**Dependencias:** TASK-0024

**Descripci�n:**
Formulario para editar datos de una asociaci�n (ciudad, contacto, email, tel�fono, estado).

**Archivos a crear:**
- `app/associations/[id]/edit/page.tsx`
- `app/associations/[id]/edit/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Formulario pre-poblado con datos actuales
- [ ] Campos editables: ciudad, contacto, email, tel�fono, estado
- [ ] Nombre y departamento NO editables (son fijos)
- [ ] Validaci�n con Zod
- [ ] Server Action actualiza asociaci�n
- [ ] Redirecci�n a `/associations` tras �xito

---

## M�dulo 6: Eventos

### TASK-0026: Crear p�gina de listado de eventos
**Complejidad:** M
**Dependencias:** TASK-0007, TASK-0009, TASK-0011

**Descripci�n:**
P�gina que muestra eventos seg�n el rol del usuario.

**Archivos a crear:**
- `app/events/page.tsx`
- `app/events/actions.ts`
- `components/events/events-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Admin_fab ve todos los eventos
- [ ] Admin_asociacion ve solo eventos de su asociaci�n
- [ ] Atleta/entrenador/juez ven solo eventos aprobados
- [ ] Columnas: nombre, tipo, estado, fecha_evento, ciudad, asociaci�n_creadora
- [ ] Filtrado por: tipo (federativo/asociacion), estado, fechas
- [ ] Ordenamiento por fecha_evento
- [ ] Badge de tipo y estado con colores
- [ ] Bot�n "Ver detalle" lleva a `/events/[eventId]`
- [ ] Bot�n "Crear evento" (solo admin_fab y admin_asociacion)
- [ ] Paginaci�n

---

### TASK-0027: Crear formulario de nuevo evento
**Complejidad:** XL
**Dependencias:** TASK-0026, TASK-0005

**Descripci�n:**
Formulario multi-step para crear un evento (federativo o de asociaci�n).

**Archivos a crear:**
- `app/events/new/page.tsx`
- `app/events/new/actions.ts`
- `components/events/event-form.tsx`

**Steps del formulario:**
1. Informaci�n B�sica (nombre, descripci�n, tipo, logo)
2. Ubicaci�n y Calendario (ciudad, lugar, direcci�n, fechas)
3. Reglas de Participaci�n (l�mites, edad, g�nero)
4. Informaci�n Financiera (solo si federativo: costo_fab, costo_por_atleta, datos bancarios, QR)
5. Organizaci�n (director t�cnico, jefe competencia, comisario)

**Criterios de aceptaci�n:**
- [ ] Al seleccionar tipo "federativo", mostrar secci�n financiera (obligatoria)
- [ ] Al seleccionar tipo "asociacion", ocultar secci�n financiera
- [ ] Validaci�n: fecha_insc_fin < fecha_evento
- [ ] Validaci�n: fecha_insc_inicio < fecha_insc_fin
- [ ] Upload de logo a Supabase Storage (event-logos/)
- [ ] Upload de QR de pago si aplica
- [ ] Guarda en tabla eventos con estado "borrador"
- [ ] asociacion_creadora_id = asociaci�n del usuario creador
- [ ] creado_por_user = auth.uid()
- [ ] Redirecci�n a `/events/[eventId]` tras �xito

---

### TASK-0028: Crear p�gina de detalle de evento
**Complejidad:** M
**Dependencias:** TASK-0026

**Descripci�n:**
P�gina que muestra toda la informaci�n de un evento.

**Archivos a crear:**
- `app/events/[eventId]/page.tsx`
- `components/events/event-detail.tsx`

**Criterios de aceptaci�n:**
- [ ] Muestra toda la informaci�n del evento organizada por secciones
- [ ] Muestra logo del evento si existe
- [ ] Badge de tipo y estado
- [ ] Secci�n de pruebas (lista de pruebas del evento)
- [ ] Secci�n de inscripciones (si admin)
- [ ] Botones de acci�n seg�n rol:
  - Admin_fab: "Aprobar", "Rechazar", "Editar", "Ver inscripciones"
  - Admin_asociacion (creador): "Editar", "Enviar a revisi�n", "Ver inscripciones"
  - Atleta (si evento aprobado): "Inscribirse"
- [ ] Bot�n "Ver pruebas" lleva a `/events/[eventId]/pruebas`

---

### TASK-0029: Implementar cambio de estado de evento (Admin FAB)
**Complejidad:** M
**Dependencias:** TASK-0028

**Descripci�n:**
Server Actions para que admin_fab apruebe o rechace eventos en revisi�n.

**Archivos involucrados:**
- `app/events/[eventId]/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Acci�n "aprobar": cambia estado a "aprobado"
- [ ] Acci�n "rechazar": cambia estado a "rechazado" (requiere observaciones)
- [ ] Solo admin_fab puede ejecutar estas acciones
- [ ] Validaci�n de estado actual (solo si est� en "en_revision")
- [ ] (Opcional) Notificar a creador del evento

---

### TASK-0030: Implementar env�o a revisi�n (Admin Asociaci�n)
**Complejidad:** S
**Dependencias:** TASK-0028

**Descripci�n:**
Server Action para que admin_asociacion env�e su evento de "borrador" a "en_revision".

**Archivos involucrados:**
- `app/events/[eventId]/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Solo admin_asociacion creador puede ejecutar
- [ ] Valida que estado actual sea "borrador"
- [ ] Valida que el evento tenga al menos 1 prueba
- [ ] Cambia estado a "en_revision"
- [ ] (Opcional) Notifica a admin_fab

---

### TASK-0031: Crear formulario de edici�n de evento
**Complejidad:** L
**Dependencias:** TASK-0027, TASK-0028

**Descripci�n:**
Permite editar un evento existente (similar al formulario de creaci�n).

**Archivos a crear:**
- `app/events/[eventId]/edit/page.tsx`

**Criterios de aceptaci�n:**
- [ ] Reutiliza componente de TASK-0027 en modo edici�n
- [ ] Pre-popula datos del evento
- [ ] Solo editable si estado es "borrador" o "rechazado"
- [ ] Admin_fab puede editar cualquier evento
- [ ] Admin_asociacion solo puede editar eventos de su asociaci�n
- [ ] Actualiza evento en BD
- [ ] Redirecci�n a `/events/[eventId]` tras �xito

---

## M�dulo 7: Pruebas

### TASK-0032: Crear p�gina de pruebas de un evento
**Complejidad:** M
**Dependencias:** TASK-0028

**Descripci�n:**
P�gina que lista todas las pruebas de un evento con opciones de gesti�n.

**Archivos a crear:**
- `app/events/[eventId]/pruebas/page.tsx`
- `app/events/[eventId]/pruebas/actions.ts`
- `components/pruebas/pruebas-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con pruebas del evento
- [ ] Columnas: nombre, categor�a_fab, g�nero, distancia, tipo (pista/campo/fondo), carriles, l�mite_participantes, estado
- [ ] Badge de estado (activa/inactiva)
- [ ] Badge de tipo t�cnico (con carriles, campo, pista, fondo)
- [ ] Bot�n "Crear prueba" (solo admin_fab y admin_asociacion creador del evento)
- [ ] Bot�n "Editar" en cada fila
- [ ] Bot�n "Activar/Desactivar" en cada fila
- [ ] Filtrado por categor�a y g�nero

---

### TASK-0033: Crear formulario de nueva prueba
**Complejidad:** L
**Dependencias:** TASK-0032, TASK-0005

**Descripci�n:**
Formulario para crear una prueba dentro de un evento.

**Archivos a crear:**
- `app/events/[eventId]/pruebas/new/page.tsx`
- `app/events/[eventId]/pruebas/new/actions.ts`
- `components/pruebas/prueba-form.tsx`

**Secciones del formulario:**
1. Informaci�n B�sica (nombre, categor�a_fab, g�nero, distancia)
2. Configuraci�n T�cnica (es_con_carriles, numero_carriles, es_campo, es_pista, es_fondo)
3. L�mites y Reglas (limite_participantes, tiempo_limite, marcas m�n/m�x, edades m�n/m�x)
4. Horario (hora_inicio, hora_fin, duraci�n_estimada, orden_competencia)

**Criterios de aceptaci�n:**
- [ ] Si es_con_carriles = true, numero_carriles es obligatorio
- [ ] Validaci�n: numero_carriles > 0
- [ ] Selector de categor�a_fab con las 8 categor�as
- [ ] Selector de g�nero: M / F / Mixto
- [ ] Checkboxes: es_campo, es_pista, es_fondo (al menos uno debe estar marcado)
- [ ] Guarda en tabla pruebas vinculada a evento_id
- [ ] Estado inicial: "activa"
- [ ] Redirecci�n a `/events/[eventId]/pruebas` tras �xito

---

### TASK-0034: Crear formulario de edici�n de prueba
**Complejidad:** M
**Dependencias:** TASK-0033

**Descripci�n:**
Permite editar una prueba existente.

**Archivos a crear:**
- `app/events/[eventId]/pruebas/[pruebaId]/edit/page.tsx`

**Criterios de aceptaci�n:**
- [ ] Reutiliza componente de TASK-0033 en modo edici�n
- [ ] Pre-popula datos de la prueba
- [ ] Solo admin_fab y admin_asociacion creador del evento pueden editar
- [ ] Actualiza prueba en BD
- [ ] Redirecci�n a `/events/[eventId]/pruebas` tras �xito

---

## M�dulo 8: Inscripciones

### TASK-0035: Crear formulario de inscripci�n (Atleta)
**Complejidad:** L
**Dependencias:** TASK-0028, TASK-0032, TASK-0011

**Descripci�n:**
Formulario para que un atleta se inscriba en una o m�s pruebas de un evento.

**Archivos a crear:**
- `app/inscripciones/new/page.tsx`
- `app/inscripciones/new/actions.ts`
- `components/inscripciones/inscription-form.tsx`

**Criterios de aceptaci�n:**
- [ ] Recibe evento_id como par�metro (desde p�gina de evento)
- [ ] Muestra informaci�n del evento (nombre, fecha, lugar)
- [ ] Lista de pruebas disponibles con checkboxes
- [ ] Filtra pruebas por categor�a_fab del atleta y g�nero
- [ ] Por cada prueba seleccionada, campos opcionales: marca_previa, mejor_marca_personal, fecha_mejor_marca
- [ ] Validaciones:
  - Fecha actual dentro de ventana de inscripciones
  - No exceder l�mites (por evento, por prueba, por asociaci�n)
  - Edad del atleta dentro de rangos de la prueba
  - G�nero del atleta coincide con g�nero de la prueba
  - No inscripciones duplicadas
- [ ] Crea registros en tabla inscripciones con:
  - estado_asociacion = "pendiente"
  - estado_fab = "pendiente"
  - categoria_atleta = categor�a calculada del atleta
- [ ] Mensaje de �xito: "Inscripci�n enviada para aprobaci�n de tu asociaci�n"
- [ ] Redirecci�n a `/inscripciones` (mis inscripciones)

---

### TASK-0036: Crear p�gina "Mis Inscripciones" (Atleta)
**Complejidad:** M
**Dependencias:** TASK-0035

**Descripci�n:**
P�gina donde el atleta ve todas sus inscripciones con sus estados.

**Archivos a crear:**
- `app/inscripciones/page.tsx`
- `components/inscripciones/my-inscriptions-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con inscripciones del atleta autenticado
- [ ] Columnas: evento, prueba, fecha_inscripci�n, estado_asociacion, estado_fab, dorsal_asignado
- [ ] Badges de estado con colores:
  - Pendiente asociaci�n: amarillo
  - Aprobada asociaci�n / Pendiente FAB: azul
  - Aprobada FAB: verde
  - Rechazada: rojo
- [ ] Columna "Dorsal" muestra n�mero si est� asignado, sino "-"
- [ ] Filtrado por evento y estado
- [ ] Bot�n "Ver detalle" en cada fila

---

### TASK-0037: Crear p�gina de inscripciones pendientes (Admin Asociaci�n)
**Complejidad:** L
**Dependencias:** TASK-0035

**Descripci�n:**
Panel donde admin_asociacion ve inscripciones pendientes de atletas de su asociaci�n.

**Archivos a crear:**
- `app/inscripciones/pending/page.tsx`
- `app/inscripciones/pending/actions.ts`
- `components/inscripciones/pending-inscriptions-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con inscripciones donde:
  - Atleta pertenece a asociaci�n del admin
  - estado_asociacion = "pendiente"
- [ ] Columnas: atleta (nombre), evento, prueba, fecha_inscripci�n, marca_previa
- [ ] Agrupado por evento
- [ ] Checkbox para selecci�n m�ltiple
- [ ] Botones: "Aprobar seleccionadas", "Rechazar"
- [ ] Modal de rechazo con motivo_rechazo obligatorio
- [ ] Actualiza estado_asociacion
- [ ] Registra aprobado_por_asociacion y fecha_aprobacion_asociacion

---

### TASK-0038: Implementar aprobaci�n masiva de inscripciones (Admin Asociaci�n)
**Complejidad:** M
**Dependencias:** TASK-0037

**Descripci�n:**
Server Action para aprobar m�ltiples inscripciones a la vez.

**Archivos involucrados:**
- `app/inscripciones/pending/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Recibe array de inscripcion_ids
- [ ] Verifica que todas las inscripciones pertenecen a atletas de la asociaci�n del admin
- [ ] Actualiza estado_asociacion = "aprobada" para todas
- [ ] Registra aprobado_por_asociacion y fecha
- [ ] Transacci�n: si falla una, revertir todas
- [ ] Retorna cantidad de inscripciones aprobadas

---

### TASK-0039: Crear vista de resumen de inscripciones por evento (Admin Asociaci�n)
**Complejidad:** M
**Dependencias:** TASK-0037

**Descripci�n:**
Vista que muestra cu�ntos atletas de la asociaci�n est�n inscritos en cada evento, para calcular monto a pagar.

**Archivos a crear:**
- `app/inscripciones/summary/page.tsx`
- `components/inscripciones/event-summary-card.tsx`

**Criterios de aceptaci�n:**
- [ ] Lista de eventos con inscripciones de la asociaci�n
- [ ] Por cada evento muestra:
  - Nombre del evento
  - Tipo (federativo / asociaci�n)
  - Cantidad de atletas con inscripciones aprobadas por asociaci�n
  - Si es federativo: monto a pagar calculado (costo_fab o cantidad � costo_por_atleta)
  - Estado del pago (si aplica): pendiente / verificado / observado
- [ ] Bot�n "Registrar pago" si es federativo y no hay pago registrado
- [ ] Bot�n "Ver comprobante" si ya hay pago

---

## M�dulo 9: Pagos

### TASK-0040: Crear formulario de registro de pago (Admin Asociaci�n)
**Complejidad:** M
**Dependencias:** TASK-0039, TASK-0004

**Descripci�n:**
Formulario para que admin_asociacion registre el pago de su asociaci�n por un evento federativo.

**Archivos a crear:**
- `app/pagos/new/page.tsx`
- `app/pagos/new/actions.ts`
- `components/pagos/payment-form.tsx`

**Criterios de aceptaci�n:**
- [ ] Recibe evento_id y monto calculado (desde TASK-0039)
- [ ] Muestra informaci�n del evento (nombre, fecha, monto a pagar)
- [ ] Campos: m�todo_pago (dropdown: transferencia/dep�sito/efectivo), fecha_pago, comprobante (file upload)
- [ ] Upload de comprobante a Supabase Storage (documents/)
- [ ] Guarda en tabla pagos_evento_asociacion con:
  - asociacion_id del admin
  - estado_pago = "pendiente"
- [ ] Mensaje: "Pago registrado. Ser� verificado por FAB"
- [ ] Redirecci�n a `/inscripciones/summary`

---

### TASK-0041: Crear p�gina de pagos pendientes de verificaci�n (Admin FAB)
**Complejidad:** M
**Dependencias:** TASK-0040

**Descripci�n:**
Panel donde admin_fab ve y verifica pagos de asociaciones.

**Archivos a crear:**
- `app/pagos/pending/page.tsx`
- `app/pagos/pending/actions.ts`
- `components/pagos/pending-payments-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con pagos donde estado_pago = "pendiente"
- [ ] Columnas: asociaci�n, evento, monto, m�todo_pago, fecha_pago, comprobante
- [ ] Bot�n "Ver comprobante" (abre imagen/PDF)
- [ ] Bot�n "Verificar" en cada fila
- [ ] Bot�n "Observar" en cada fila
- [ ] Filtrado por asociaci�n y evento
- [ ] Ordenamiento por fecha_pago

---

### TASK-0042: Implementar verificaci�n de pago (Admin FAB)
**Complejidad:** M
**Dependencies:** TASK-0041

**Descripci�n:**
Server Action para que admin_fab verifique o observe un pago.

**Archivos involucrados:**
- `app/pagos/pending/actions.ts`

**Acci�n "Verificar":**
- [ ] Cambia estado_pago = "verificado"
- [ ] Registra verificado_por = auth.uid()
- [ ] Registra fecha_verificacion
- [ ] Actualiza inscripciones del evento/asociaci�n: pago_verificado = true

**Acci�n "Observar":**
- [ ] Cambia estado_pago = "observado"
- [ ] Requiere observaciones (motivo)
- [ ] Registra verificado_por y fecha
- [ ] (Opcional) Notifica a admin_asociacion

---

### TASK-0043: Crear p�gina de detalle de pago
**Complejidad:** S
**Dependencias:** TASK-0041

**Descripci�n:**
P�gina que muestra toda la informaci�n de un pago con su historial.

**Archivos a crear:**
- `app/pagos/[pagoId]/page.tsx`
- `components/pagos/payment-detail.tsx`

**Criterios de aceptaci�n:**
- [ ] Muestra toda la informaci�n del pago
- [ ] Preview del comprobante (imagen o PDF)
- [ ] Badge de estado
- [ ] Si verificado: mostrar qui�n y cu�ndo
- [ ] Si observado: mostrar observaciones
- [ ] Lista de inscripciones asociadas al pago
- [ ] Accesible por admin_fab y admin_asociacion del pago

---

## M�dulo 10: Dorsales

### TASK-0044: Crear p�gina de asignaci�n de dorsales (Admin FAB)
**Complejidad:** L
**Dependencias:** TASK-0028, TASK-0042

**Descripci�n:**
Panel donde admin_fab asigna dorsales a atletas con inscripciones aprobadas.

**Archivos a crear:**
- `app/dorsales/[eventId]/page.tsx`
- `app/dorsales/[eventId]/actions.ts`
- `components/dorsales/dorsal-assignment-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Recibe evento_id como par�metro
- [ ] Lista atletas elegibles para dorsal:
  - estado_fab = "aprobada"
  - Para federativos: pago_verificado = true
  - Sin dorsal asignado a�n
- [ ] Tabla con columnas: atleta, asociaci�n, categor�a, pruebas inscritas, dorsal (input)
- [ ] Input num�rico para asignar dorsal manualmente
- [ ] Validaci�n en tiempo real: no repetir dorsales en el evento
- [ ] Bot�n "Asignar autom�ticamente" (secuencial desde el �ltimo dorsal usado)
- [ ] Bot�n "Guardar asignaciones"
- [ ] Filtrado por asociaci�n y categor�a

---

### TASK-0045: Implementar asignaci�n autom�tica de dorsales
**Complejidad:** M
**Dependencias:** TASK-0044

**Descripci�n:**
Server Action que asigna dorsales de forma secuencial autom�tica.

**Archivos involucrados:**
- `app/dorsales/[eventId]/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Obtiene �ltimo dorsal asignado en el evento
- [ ] Asigna dorsales secuencialmente a atletas sin dorsal (�ltimo + 1, �ltimo + 2, ...)
- [ ] Crea registros en tabla dorsales
- [ ] Actualiza inscripciones con dorsal_asignado, fecha_asignacion_dorsal, dorsal_asignado_por
- [ ] Transacci�n: si falla uno, revertir todos
- [ ] Retorna cantidad de dorsales asignados

---

### TASK-0046: Implementar asignaci�n manual de dorsales
**Complejidad:** M
**Dependencias:** TASK-0044

**Descripci�n:**
Server Action que asigna dorsales manualmente seg�n input del admin.

**Archivos involucrados:**
- `app/dorsales/[eventId]/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Recibe array de { atleta_id, numero }
- [ ] Valida que n�meros no est�n duplicados en el evento
- [ ] Valida que atletas cumplan requisitos (inscripci�n aprobada + pago verificado si aplica)
- [ ] Crea registros en tabla dorsales
- [ ] Actualiza inscripciones
- [ ] Transacci�n
- [ ] Retorna �xito/error con detalle

---

### TASK-0047: Crear vista de dorsales asignados por evento
**Complejidad:** M
**Dependencias:** TASK-0044

**Descripci�n:**
P�gina que muestra todos los dorsales asignados de un evento.

**Archivos a crear:**
- `app/dorsales/[eventId]/assigned/page.tsx`
- `components/dorsales/assigned-dorsals-table.tsx`

**Criterios de aceptaci�n:**
- [ ] Tabla con dorsales asignados del evento
- [ ] Columnas: n�mero, atleta, asociaci�n, categor�a, estado
- [ ] Filtrado por asociaci�n y categor�a
- [ ] Ordenamiento por n�mero
- [ ] B�squeda por nombre de atleta o n�mero
- [ ] Badge de estado (activo/inactivo)
- [ ] Bot�n "Desactivar" (solo admin_fab, en casos excepcionales)
- [ ] Exportar a PDF/Excel (futuro)

---

## M�dulo 11: Startlists

### TASK-0048: Crear p�gina de gesti�n de startlists por prueba
**Complejidad:** L
**Dependencias:** TASK-0032, TASK-0047

**Descripci�n:**
Panel donde admin_fab y admin_asociacion crean y gestionan startlists de una prueba.

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/page.tsx`
- `app/startlists/[eventId]/[pruebaId]/actions.ts`
- `components/startlists/startlists-manager.tsx`

**Criterios de aceptaci�n:**
- [ ] Muestra informaci�n de la prueba (nombre, categor�a, g�nero, distancia, carriles)
- [ ] Lista de startlists existentes de la prueba
- [ ] Por cada startlist: nombre, tipo (serie/lista), �ndice, estado
- [ ] Bot�n "Crear nueva startlist"
- [ ] Bot�n "Editar" en startlists con estado "borrador"
- [ ] Bot�n "Finalizar" en startlists borradores
- [ ] Startlists finalizadas son de solo lectura
- [ ] Accesible por admin_fab y admin_asociacion del evento

---

### TASK-0049: Crear formulario de nueva startlist
**Complejidad:** M
**Dependencias:** TASK-0048

**Descripci�n:**
Formulario para crear una startlist (serie o lista).

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/new/page.tsx`
- `app/startlists/[eventId]/[pruebaId]/new/actions.ts`
- `components/startlists/startlist-form.tsx`

**Criterios de aceptaci�n:**
- [ ] Campos: nombre, tipo (serie/lista), �ndice (n�mero de serie)
- [ ] Si prueba es_con_carriles, mostrar numero_carriles (pre-poblado desde prueba)
- [ ] Guarda en tabla startlists con estado "borrador"
- [ ] Redirecci�n a p�gina de edici�n de items tras crear

---

### TASK-0050: Crear editor de items de startlist
**Complejidad:** XL
**Dependencias:** TASK-0049

**Descripci�n:**
Interfaz drag-and-drop o tabla para asignar atletas (dorsales) a una startlist con sus carriles/orden.

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/edit/page.tsx`
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/edit/actions.ts`
- `components/startlists/startlist-editor.tsx`
- `components/startlists/athlete-selector.tsx`

**Criterios de aceptaci�n:**
- [ ] Lista de atletas disponibles (con dorsal asignado y inscritos en la prueba)
- [ ] Filtrado por asociaci�n y categor�a
- [ ] B�squeda por nombre o dorsal
- [ ] �rea de edici�n:
  - Si es con carriles: tabla con columnas de carriles (1, 2, 3, ..., N)
  - Si es sin carriles: lista ordenada con posici�n_salida
- [ ] Drag-and-drop o bot�n "Agregar" para asignar atleta
- [ ] Por cada item: mostrar dorsal, nombre, apellido, asociaci�n, categor�a
- [ ] Input de "semilla" (marca previa) opcional
- [ ] Validaciones:
  - No repetir dorsal en la misma startlist
  - No repetir carril en la misma startlist (si aplica)
  - Carriles en rango [1..numero_carriles]
- [ ] Bot�n "Guardar borrador"
- [ ] Bot�n "Finalizar startlist" (cambia estado a "finalizada", ya no editable)

---

### TASK-0051: Implementar guardado de startlist items
**Complejidad:** M
**Dependencias:** TASK-0050

**Descripci�n:**
Server Action que guarda los items de una startlist.

**Archivos involucrados:**
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/edit/actions.ts`

**Criterios de aceptaci�n:**
- [ ] Recibe array de items: { dorsal_id, atleta_id, carril?, posicion_salida?, orden, semilla? }
- [ ] Valida unicidad de dorsal en startlist
- [ ] Valida unicidad de carril (si aplica)
- [ ] Valida rango de carriles
- [ ] Elimina items anteriores de la startlist (reemplaza completamente)
- [ ] Inserta nuevos items en startlist_items
- [ ] Denormaliza datos: nombre_completo, apellido_completo, asociacion_nombre, categoria_atleta, es_con_carriles, numero_carriles_disponibles
- [ ] Transacci�n

---

### TASK-0052: Crear vista p�blica de startlist (solo lectura)
**Complejidad:** M
**Dependencias:** TASK-0050

**Descripci�n:**
P�gina que muestra una startlist finalizada en formato de presentaci�n.

**Archivos a crear:**
- `app/startlists/[eventId]/[pruebaId]/[startlistId]/view/page.tsx`
- `components/startlists/startlist-view.tsx`

**Criterios de aceptaci�n:**
- [ ] Muestra informaci�n de la prueba y startlist
- [ ] Si es con carriles: tabla visual con carriles y atletas
- [ ] Si es sin carriles: lista ordenada por posici�n_salida u orden
- [ ] Por cada atleta: dorsal, nombre completo, asociaci�n, categor�a, semilla
- [ ] Dise�o apto para imprimir
- [ ] Bot�n "Imprimir" o "Exportar PDF" (futuro)
- [ ] Accesible por todos los roles autenticados
- [ ] (Futuro) Acceso p�blico sin login si se habilita

---

## M�dulo 12: Dashboards

### TASK-0053: Crear Dashboard de Admin FAB
**Complejidad:** L
**Dependencias:** TASK-0012, TASK-0026, TASK-0041

**Descripci�n:**
Dashboard principal para admin_fab con m�tricas globales y acciones r�pidas.

**Archivos a crear:**
- `app/dashboard/admin-fab/page.tsx`
- `components/dashboard/admin-fab-dashboard.tsx`
- `components/dashboard/stats-card.tsx`

**Secciones del dashboard:**
1. **M�tricas globales:**
   - Total de usuarios registrados (por rol)
   - Usuarios pendientes de aprobaci�n (con enlace)
   - Total de eventos (por tipo y estado)
   - Pagos pendientes de verificaci�n (con enlace)
2. **Acciones r�pidas:**
   - "Ver usuarios pendientes"
   - "Ver pagos pendientes"
   - "Crear admin_asociacion"
   - "Ver eventos en revisi�n"
3. **Gr�ficos (opcional):**
   - Atletas por asociaci�n (bar chart)
   - Eventos por mes (line chart)

**Criterios de aceptaci�n:**
- [ ] Cards con m�tricas actualizadas
- [ ] Enlaces a p�ginas relevantes
- [ ] Dise�o limpio con Shadcn components
- [ ] Loading skeletons mientras carga datos
- [ ] Accesible solo por admin_fab

---

### TASK-0054: Crear Dashboard de Admin Asociaci�n
**Complejidad:** M
**Dependencias:** TASK-0026, TASK-0037, TASK-0039

**Descripci�n:**
Dashboard para admin_asociacion con resumen de su asociaci�n.

**Archivos a crear:**
- `app/dashboard/admin-asociacion/page.tsx`
- `components/dashboard/admin-asociacion-dashboard.tsx`

**Secciones del dashboard:**
1. **Resumen de asociaci�n:**
   - Total de atletas activos
   - Total de entrenadores y jueces
   - Eventos creados
2. **Inscripciones pendientes:**
   - Cantidad de inscripciones esperando aprobaci�n
   - Enlace a "Revisar inscripciones"
3. **Pagos:**
   - Eventos federativos con pagos pendientes
   - Enlace a "Registrar pago"
4. **Acciones r�pidas:**
   - "Crear evento"
   - "Ver mis eventos"
   - "Revisar inscripciones"

**Criterios de aceptaci�n:**
- [ ] Muestra solo datos de la asociaci�n del admin
- [ ] Cards con m�tricas
- [ ] Enlaces r�pidos
- [ ] Accesible solo por admin_asociacion

---

### TASK-0055: Crear Dashboard de Atleta (estado: pendiente)
**Complejidad:** S
**Dependencias:** TASK-0011, TASK-0021

**Descripci�n:**
Dashboard para atleta con cuenta pendiente de aprobaci�n.

**Archivos a crear:**
- `app/dashboard/atleta-pending/page.tsx`

**Criterios de aceptaci�n:**
- [ ] Banner grande: "Tu cuenta est� en revisi�n por admin_fab. Ser�s notificado cuando sea aprobada."
- [ ] Icono de reloj o spinner
- [ ] Bot�n "Completar mi perfil" (si no est� completo)
- [ ] Bot�n "Ver mi perfil"
- [ ] Indicador de progreso del perfil (% de campos completados)

---

### TASK-0056: Crear Dashboard de Atleta (estado: activo)
**Complejidad:** M
**Dependencias:** TASK-0026, TASK-0036

**Descripci�n:**
Dashboard para atleta con cuenta activa.

**Archivos a crear:**
- `app/dashboard/atleta-activo/page.tsx`
- `components/dashboard/atleta-dashboard.tsx`

**Secciones del dashboard:**
1. **Pr�ximos eventos:**
   - Lista de eventos aprobados con inscripciones abiertas
   - Bot�n "Ver detalles" e "Inscribirse"
2. **Mis inscripciones:**
   - Resumen: cantidad pendientes, aprobadas, con dorsal asignado
   - Enlace a "Ver todas mis inscripciones"
3. **Dorsales asignados:**
   - Lista de eventos donde tiene dorsal asignado con el n�mero
4. **Mi perfil:**
   - Categor�a FAB actual
   - Enlace a "Editar perfil"

**Criterios de aceptaci�n:**
- [ ] Informaci�n personalizada del atleta
- [ ] Enlaces r�pidos
- [ ] Badges de estado en inscripciones

---

### TASK-0057: Crear Dashboard de Entrenador/Juez (estado: pendiente)
**Complejidad:** S
**Dependencias:** TASK-0055

**Descripci�n:**
Similar a TASK-0055 pero para entrenador/juez.

**Criterios de aceptaci�n:**
- [ ] Banner de cuenta en revisi�n
- [ ] Bot�n "Completar mis datos profesionales"
- [ ] Indicador de progreso

---

### TASK-0058: Crear Dashboard de Entrenador/Juez (estado: activo)
**Complejidad:** M
**Dependencias:** TASK-0026

**Descripci�n:**
Dashboard para entrenador/juez con cuenta activa.

**Archivos a crear:**
- `app/dashboard/entrenador-activo/page.tsx` (y similar para juez)
- `components/dashboard/entrenador-dashboard.tsx`

**Secciones del dashboard:**
1. **Pr�ximos eventos:**
   - Lista de eventos aprobados
   - Enlace a ver detalles
2. **Startlists:**
   - Eventos con startlists finalizadas disponibles
   - Enlace a ver startlists
3. **Mi perfil:**
   - Resumen de datos profesionales
   - Enlace a "Editar perfil"

**Criterios de aceptaci�n:**
- [ ] Informaci�n relevante para el rol
- [ ] Acceso a startlists de eventos
- [ ] Enlaces r�pidos

---

### TASK-0059: Implementar router de dashboard seg�n rol
**Complejidad:** S
**Dependencias:** TASK-0053 a TASK-0058

**Descripci�n:**
L�gica en `/dashboard/page.tsx` que redirecciona al dashboard correcto seg�n rol y estado del usuario.

**Archivos involucrados:**
- `app/dashboard/page.tsx`

**Criterios de aceptaci�n:**
- [ ] Si admin_fab � `/dashboard/admin-fab`
- [ ] Si admin_asociacion � `/dashboard/admin-asociacion`
- [ ] Si atleta + pendiente � `/dashboard/atleta-pending`
- [ ] Si atleta + activo � `/dashboard/atleta-activo`
- [ ] Si entrenador/juez + pendiente � `/dashboard/entrenador-pending`
- [ ] Si entrenador/juez + activo � `/dashboard/entrenador-activo`
- [ ] Si estado = rechazado o inactivo � mensaje de error

---

## M�dulo 13: Componentes UI Compartidos

### TASK-0060: Crear componente DataTable reutilizable
**Complejidad:** L
**Dependencias:** Ninguna

**Descripci�n:**
Componente de tabla gen�rico con ordenamiento, filtrado, paginaci�n y acciones.

**Archivos a crear:**
- `components/ui/data-table.tsx`
- `components/ui/data-table-toolbar.tsx`
- `components/ui/data-table-pagination.tsx`

**Props:**
- `columns`: definici�n de columnas (ColumnDef de TanStack Table)
- `data`: array de datos
- `pageSize`: tama�o de p�gina (default 10)
- `searchPlaceholder`: placeholder del input de b�squeda
- `filters`: array de filtros personalizados

**Criterios de aceptaci�n:**
- [ ] Usa TanStack Table (@tanstack/react-table)
- [ ] Ordenamiento por columnas (click en header)
- [ ] B�squeda global (input de texto)
- [ ] Filtros customizables (dropdowns, checkboxes)
- [ ] Paginaci�n con controles (primera, anterior, siguiente, �ltima)
- [ ] Indicador de cantidad de resultados
- [ ] Loading state (skeleton)
- [ ] Empty state
- [ ] Responsivo

---

### TASK-0061: Crear componente FormField reutilizable
**Complejidad:** M
**Dependencias:** TASK-0005

**Descripci�n:**
Wrapper de campos de formulario con integraci�n de React Hook Form y Zod.

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

**Criterios de aceptaci�n:**
- [ ] Integraci�n con React Hook Form
- [ ] Muestra errores de validaci�n Zod
- [ ] Si locked=true, muestra icono de candado + disabled + tooltip
- [ ] Estilos consistentes con Shadcn UI
- [ ] Variantes: input, select, textarea, date picker, file upload

---

### TASK-0062: Crear componente StatusBadge
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
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
- Azul: informaci�n

**Criterios de aceptaci�n:**
- [ ] Usa Shadcn Badge como base
- [ ] Variantes de color predefinidas
- [ ] Texto del badge en espa�ol
- [ ] Tama�os: small, medium, large
- [ ] Opci�n de a�adir icono

---

### TASK-0063: Crear componente FileUpload
**Complejidad:** M
**Dependencias:** TASK-0004

**Descripci�n:**
Componente de carga de archivos con preview, validaci�n y upload a Supabase Storage.

**Archivos a crear:**
- `components/ui/file-upload.tsx`
- `components/ui/file-preview.tsx`

**Props:**
- `bucket`: nombre del bucket de Supabase
- `path`: path dentro del bucket
- `accept`: tipos de archivo aceptados (image/*, .pdf, etc.)
- `maxSize`: tama�o m�ximo en MB
- `onUploadComplete`: callback con URL del archivo subido

**Criterios de aceptaci�n:**
- [ ] Drag-and-drop o click para seleccionar archivo
- [ ] Validaci�n de tipo de archivo
- [ ] Validaci�n de tama�o
- [ ] Preview de im�genes (thumbnail)
- [ ] Preview de PDFs (icono + nombre)
- [ ] Progress bar durante upload
- [ ] Upload a Supabase Storage
- [ ] Retorna URL p�blica del archivo
- [ ] Manejo de errores (archivo muy grande, tipo no permitido, error de red)
- [ ] Bot�n "Eliminar" para remover archivo

---

### TASK-0064: Crear componente Stepper para formularios multi-paso
**Complejidad:** M
**Dependencias:** Ninguna

**Descripci�n:**
Componente de stepper (pasos) para formularios multi-paso.

**Archivos a crear:**
- `components/ui/stepper.tsx`
- `components/ui/stepper-step.tsx`

**Props:**
- `steps`: array de { id, label, description? }
- `currentStep`: �ndice del paso actual
- `onStepChange`: callback al cambiar de paso

**Criterios de aceptaci�n:**
- [ ] Muestra lista de pasos con indicador visual
- [ ] Paso actual destacado
- [ ] Pasos completados con check
- [ ] Pasos futuros en gris
- [ ] L�nea conectora entre pasos
- [ ] Click en paso completado permite volver atr�s
- [ ] No permite saltar pasos no completados
- [ ] Responsivo (vertical en mobile, horizontal en desktop)

---

### TASK-0065: Crear sistema de notificaciones Toast
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Configurar sistema de notificaciones toast para mensajes de �xito/error.

**Archivos a crear:**
- `components/ui/toaster.tsx` (ya existe en Shadcn, solo configurar)
- `lib/toast-utils.ts`

**Helpers a crear:**
- `showSuccess(message)`
- `showError(message)`
- `showInfo(message)`
- `showWarning(message)`

**Criterios de aceptaci�n:**
- [ ] Usa Shadcn Toast/Sonner
- [ ] Helpers simples de usar en Server Actions
- [ ] Posici�n: bottom-right
- [ ] Auto-dismiss despu�s de 5s (configurable)
- [ ] Iconos seg�n tipo (, , 9, �)
- [ ] Animaciones suaves

---

### TASK-0066: Crear componente LoadingSpinner y Skeleton
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Componentes para estados de carga.

**Archivos a crear:**
- `components/ui/loading-spinner.tsx`
- `components/ui/skeleton-loader.tsx`

**Criterios de aceptaci�n:**
- [ ] LoadingSpinner: spinner animado con tama�os (small, medium, large)
- [ ] SkeletonLoader: placeholders para diferentes componentes (card, table, form)
- [ ] Usa Shadcn Skeleton como base
- [ ] Reutilizable en toda la app

---

### TASK-0067: Crear componente ConfirmDialog
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Modal de confirmaci�n para acciones destructivas.

**Archivos a crear:**
- `components/ui/confirm-dialog.tsx`

**Props:**
- `title`: t�tulo del modal
- `description`: descripci�n de la acci�n
- `confirmText`: texto del bot�n de confirmar (default: "Confirmar")
- `cancelText`: texto del bot�n de cancelar (default: "Cancelar")
- `variant`: "danger" | "warning" | "default"
- `onConfirm`: callback al confirmar

**Criterios de aceptaci�n:**
- [ ] Usa Shadcn AlertDialog
- [ ] Variante "danger" con bot�n rojo
- [ ] Variante "warning" con bot�n amarillo
- [ ] Opci�n de a�adir input (ej: para observaciones al rechazar)
- [ ] Opci�n de requerir confirmaci�n extra (ej: escribir "CONFIRMAR")

---

## M�dulo 14: Integraciones y Utilidades

### TASK-0068: Crear utilidades de formateo
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Funciones helper para formateo de datos.

**Archivos a crear:**
- `lib/format-utils.ts`

**Funciones a crear:**
- `formatDate(date)`: formatea fecha a "DD/MM/YYYY"
- `formatDateTime(date)`: formatea fecha y hora a "DD/MM/YYYY HH:mm"
- `formatCurrency(amount)`: formatea monto a "Bs 1.234,56"
- `formatCI(ci)`: formatea CI con guiones
- `formatPhone(phone)`: formatea tel�fono
- `capitalizeWords(str)`: capitaliza primera letra de cada palabra

**Criterios de aceptaci�n:**
- [ ] Funciones puras (sin efectos secundarios)
- [ ] Manejo de null/undefined
- [ ] Formato boliviano (fecha DD/MM/YYYY, moneda Bs)

---

### TASK-0069: Crear utilidades de c�lculo de categor�a FAB
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Funci�n client-side que replica el c�lculo de categor�a FAB del backend.

**Archivos a crear:**
- `lib/categoria-fab-utils.ts`

**Funciones:**
- `calcularCategoriaFAB(fechaNacimiento: Date): string`
- `getEdad(fechaNacimiento: Date): number`

**Criterios de aceptaci�n:**
- [ ] L�gica id�ntica al trigger de la BD
- [ ] Retorna categor�a correcta seg�n edad
- [ ] Usado en formularios para preview antes de guardar

---

### TASK-0070: Crear hook useDebounce
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Hook para debouncing de inputs (b�squeda, filtros).

**Archivos a crear:**
- `hooks/useDebounce.ts`

**Criterios de aceptaci�n:**
- [ ] Retorna valor debounced
- [ ] Delay configurable (default 300ms)
- [ ] Limpia timeout en cleanup

---

### TASK-0071: Crear hook usePermissions
**Complejidad:** M
**Dependencias:** TASK-0011

**Descripci�n:**
Hook para verificar permisos del usuario actual.

**Archivos a crear:**
- `hooks/usePermissions.ts`

**Funciones del hook:**
- `isAdminFAB(): boolean`
- `isAdminAsociacion(): boolean`
- `canEditEvent(eventId): boolean`
- `canApproveInscription(inscripcionId): boolean`
- `canAssignDorsal(): boolean`

**Criterios de aceptaci�n:**
- [ ] Usa hook useUser
- [ ] Retorna booleans de permisos
- [ ] Usado para mostrar/ocultar UI seg�n permisos

---

### TASK-0072: Configurar React Query con defaults
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Configurar React Query Provider con opciones por defecto.

**Archivos a crear:**
- `lib/react-query-provider.tsx`
- `lib/react-query-config.ts`

**Configuraci�n:**
- `staleTime`: 5 minutos (datos de cat�logos), 30 segundos (datos transaccionales)
- `cacheTime`: 10 minutos
- `refetchOnWindowFocus`: false (en dev), true (en prod)
- `retry`: 1 vez

**Criterios de aceptaci�n:**
- [ ] Provider envuelve toda la app
- [ ] React Query Devtools habilitado en desarrollo
- [ ] Configuraci�n optimizada para performance

---

## M�dulo 15: Testing y Calidad (Futuro - Opcional)

### TASK-0073: Setup de testing con Jest y React Testing Library
**Complejidad:** M
**Dependencias:** Ninguna

**Descripci�n:**
Configurar entorno de testing para el proyecto.

**Archivos a crear:**
- `jest.config.js`
- `jest.setup.js`
- `.test-utils.tsx` (helpers de testing)

**Criterios de aceptaci�n:**
- [ ] Jest configurado para Next.js
- [ ] React Testing Library instalado
- [ ] Mock de Supabase client
- [ ] Script `npm test` funcional

---

### TASK-0074: Tests unitarios para utilidades de validaci�n
**Complejidad:** M
**Dependencias:** TASK-0005, TASK-0073

**Descripci�n:**
Tests para schemas de validaci�n Zod.

**Archivos a crear:**
- `lib/validations/__tests__/profile.test.ts`
- `lib/validations/__tests__/event.test.ts`

**Criterios de aceptaci�n:**
- [ ] Test de validaci�n de CI
- [ ] Test de validaci�n de email
- [ ] Test de rangos (edad, altura, peso)
- [ ] Test de campos obligatorios
- [ ] Coverage > 80%

---

### TASK-0075: Tests de integraci�n para flujo de inscripci�n
**Complejidad:** L
**Dependencias:** TASK-0035 a TASK-0039, TASK-0073

**Descripci�n:**
Tests end-to-end del flujo de inscripci�n completo.

**Archivos a crear:**
- `__tests__/integration/inscription-flow.test.tsx`

**Escenarios:**
- [ ] Atleta crea inscripci�n � �xito
- [ ] Atleta intenta inscribirse fuera de ventana � error
- [ ] Atleta intenta inscribirse en prueba de categor�a diferente � error
- [ ] Admin_asociacion aprueba inscripci�n � estado cambia
- [ ] Admin_fab aprueba inscripci�n con pago verificado � estado cambia

---

## M�dulo 16: Deployment y DevOps

### TASK-0076: Configurar variables de entorno para producci�n
**Complejidad:** S
**Dependencias:** Ninguna

**Descripci�n:**
Documentar y configurar todas las variables de entorno necesarias.

**Archivos a crear:**
- `.env.example`
- `docs/environment-setup.md`

**Variables a documentar:**
- Supabase (URL, keys)
- Next.js (NODE_ENV, BASE_URL)
- Storage buckets
- Otras configuraciones

**Criterios de aceptaci�n:**
- [ ] `.env.example` completo
- [ ] Documentaci�n de cada variable
- [ ] Instrucciones de setup para dev y prod

---

### TASK-0077: Configurar build y deploy en Vercel
**Complejidad:** S
**Dependencias:** Todas las anteriores

**Descripci�n:**
Configurar el proyecto para deployment en Vercel.

**Archivos a crear:**
- `vercel.json`

**Criterios de aceptaci�n:**
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

**Descripci�n:**
Script para popular la BD con datos de prueba (dev/staging).

**Archivos a crear:**
- `scripts/seed-test-data.ts`

**Datos a crear:**
- 1 admin_fab
- 9 admin_asociacion (uno por asociaci�n)
- 20 atletas de prueba (distribuidos en asociaciones)
- 5 entrenadores
- 3 jueces
- 2 eventos de prueba (1 federativo, 1 asociaci�n)
- Pruebas por evento
- Inscripciones de ejemplo

**Criterios de aceptaci�n:**
- [ ] Script ejecutable: `npm run seed:test`
- [ ] Idempotente (no crea duplicados)
- [ ] Usa contrase�as conocidas para testing
- [ ] Crea datos realistas

---

## M�dulo 17: Documentaci�n

### TASK-0079: Crear documentaci�n de arquitectura
**Complejidad:** M
**Dependencias:** Ninguna

**Descripci�n:**
Documentar la arquitectura del sistema.

**Archivos a crear:**
- `docs/architecture.md`
- `docs/database-schema.md`
- `docs/api-routes.md`

**Contenido:**
- Diagrama de arquitectura
- Stack tecnol�gico
- Estructura de carpetas
- Convenciones de c�digo
- Flujos principales
- Esquema de BD con relaciones

**Criterios de aceptaci�n:**
- [ ] Documentaci�n clara y concisa
- [ ] Diagramas visuales (mermaid)
- [ ] �til para onboarding de nuevos devs

---

### TASK-0080: Crear gu�as de usuario por rol
**Complejidad:** L
**Dependencias:** Todas las anteriores

**Descripci�n:**
Manuales de usuario para cada rol.

**Archivos a crear:**
- `docs/user-guide-admin-fab.md`
- `docs/user-guide-admin-asociacion.md`
- `docs/user-guide-atleta.md`
- `docs/user-guide-entrenador.md`
- `docs/user-guide-juez.md`

**Contenido por gu�a:**
- Introducci�n al rol
- C�mo hacer login
- Funcionalidades principales
- Flujos paso a paso con capturas de pantalla
- Preguntas frecuentes
- Troubleshooting

**Criterios de aceptaci�n:**
- [ ] Una gu�a por rol
- [ ] Capturas de pantalla actualizadas
- [ ] Escritas en lenguaje no t�cnico
- [ ] Formato PDF descargable

---

## Resumen de Tareas

**Total de tareas:** 80

**Por complejidad:**
- S (Small): 18 tareas (~18-36 horas)
- M (Medium): 32 tareas (~96-160 horas)
- L (Large): 23 tareas (~23-46 d�as)
- XL (Extra Large): 7 tareas (~21-35 d�as)

**Estimaci�n total:** ~4-6 meses para 1 desarrollador full-time

**Dependencias cr�ticas:**
- TASK-0001 a TASK-0006: Setup inicial (debe completarse primero)
- TASK-0007 a TASK-0011: Autenticaci�n (base para todo)
- TASK-0018 a TASK-0023: Perfiles (necesario para flujo completo)
- TASK-0035 a TASK-0047: Flujo de inscripci�n completo

**Priorizaci�n sugerida:**
1. **Sprint 1 (Semanas 1-2):** TASK-0001 a TASK-0011 (Setup y Auth)
2. **Sprint 2 (Semanas 3-4):** TASK-0012 a TASK-0023 (Gesti�n de usuarios y perfiles)
3. **Sprint 3 (Semanas 5-6):** TASK-0024 a TASK-0034 (Asociaciones, Eventos, Pruebas)
4. **Sprint 4 (Semanas 7-8):** TASK-0035 a TASK-0043 (Inscripciones y Pagos)
5. **Sprint 5 (Semanas 9-10):** TASK-0044 a TASK-0052 (Dorsales y Startlists)
6. **Sprint 6 (Semanas 11-12):** TASK-0053 a TASK-0059 (Dashboards)
7. **Sprint 7 (Semanas 13-14):** TASK-0060 a TASK-0072 (Componentes UI y utilidades)
8. **Sprint 8 (Semanas 15-16):** TASK-0073 a TASK-0080 (Testing, Deploy, Docs)

---

**Fin del documento de tareas**
