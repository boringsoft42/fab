# PRD: Sistema de Gestión Integral FAB (Federación de Atletismo de Bolivia)

## Introduction/Overview

### Problem Statement
La Federación de Atletismo de Bolivia (FAB) requiere una plataforma digital centralizada para gestionar:
- Registro diferenciado: auto-registro público para atletas/entrenadores/jueces y creación administrativa de cuentas para admins de asociación
- Perfiles de atletas, entrenadores y jueces de las 9 asociaciones departamentales
- Eventos federativos y de asociación con sus respectivas pruebas
- Proceso de inscripciones con flujo de aprobación multi-nivel
- Verificación manual de pagos de asociaciones para eventos federativos
- Asignación de dorsales únicos por evento
- Generación de startlists para competencias

Actualmente, estos procesos se realizan de forma manual o descoordinada, generando:
- Falta de acceso directo para atletas/entrenadores/jueces que desean registrarse
- Inconsistencias en datos de atletas
- Retrasos en aprobaciones y verificaciones
- Dificultad para rastrear pagos de asociaciones
- Errores en asignación de dorsales
- Falta de trazabilidad en flujos de aprobación

### Goal
Desarrollar una plataforma web integral que digitalice y automatice la gestión completa de la FAB, desde el registro de usuarios hasta la generación de startlists, con control de permisos por rol (RLS), flujos de aprobación definidos y soporte para 9 asociaciones departamentales.

---

## Goals

1. **Gestión de Usuarios y Perfiles**
   - Soportar 5 roles diferentes: admin_fab, admin_asociacion, atleta, entrenador, juez
   - Dos flujos de registro diferenciados:
     - **Auto-registro público**: atleta, entrenador, juez (requieren aprobación de admin_fab)
     - **Creación administrativa**: admin_fab crea cuentas de admin_asociacion
   - Implementar perfiles completos auto-editables excepto datos personales
   - Sistema de aprobación FAB para activación de usuarios registrados públicamente

2. **Gestión de Asociaciones**
   - Registrar y gestionar las 9 asociaciones departamentales de Bolivia
   - Vincular usuarios a su asociación correspondiente
   - Reglas especiales (ej: campo municipio obligatorio excepto para Santa Cruz)

3. **Gestión de Eventos y Pruebas**
   - Crear eventos tipo "federativo" (con pago) o "asociacion" (sin pago)
   - Configurar pruebas técnicas por evento (carriles, categorías, límites)
   - Estados de evento: borrador → en revisión → aprobado/rechazado → finalizado

4. **Proceso de Inscripciones**
   - Flujo dual: Asociación pre-aprueba → FAB aprueba
   - Cálculo automático de categoría FAB por edad
   - Validaciones de límites por evento/prueba/asociación

5. **Gestión de Pagos (Solo Eventos Federativos)**
   - Registro de pagos de asociación (no procesamiento)
   - Verificación manual por admin_fab
   - Seguimiento de comprobantes

6. **Sistema de Dorsales**
   - Asignación única por evento
   - Solo tras pago verificado (federativo) o aprobación (asociación)
   - Trazabilidad de quién asigna y cuándo

7. **Startlists**
   - Generación de listas de salida por prueba
   - Soporte para carriles, series y orden de competencia
   - Estados: borrador → finalizada

8. **Seguridad y Permisos**
   - RLS (Row Level Security) en todas las tablas
   - Jerarquía: admin_fab > admin_asociacion > perfiles
   - Aislamiento de datos por asociación

---

## User Stories

### Como Admin FAB
1. Quiero crear cuentas de admin_asociacion para cada una de las 9 asociaciones departamentales asignándoles sus credenciales
2. Quiero revisar y aprobar/rechazar solicitudes de registro público de atletas, entrenadores y jueces para garantizar que solo personas verificadas accedan al sistema
3. Quiero crear eventos federativos con costos y requisitos de pago para coordinar competencias nacionales
4. Quiero verificar manualmente los pagos de las asociaciones para asegurar que cumplieron con sus obligaciones antes de asignar dorsales
5. Quiero tener acceso completo a todos los datos de todas las asociaciones para supervisión y reportes
6. Quiero asignar dorsales a atletas cuyas inscripciones están aprobadas y pagadas
7. Quiero editar cualquier dato de cualquier perfil en casos excepcionales (override)
8. Quiero activar/desactivar cuentas de admin_asociacion cuando sea necesario

### Como Admin de Asociación
1. Quiero crear eventos de mi asociación sin requerir pago federativo para organizar competencias locales
2. Quiero revisar y aprobar inscripciones de atletas de mi departamento antes de que pasen a FAB
3. Quiero calcular el monto total a pagar por evento federativo basado en mis atletas aprobados
4. Quiero subir comprobantes de pago de mi asociación para eventos federativos
5. Quiero ver solo los datos de usuarios y atletas de mi asociación
6. Quiero generar startlists para las pruebas de mis eventos

### Como Atleta
1. Quiero poder registrarme públicamente desde la web sin necesidad de que un administrador me cree la cuenta
2. Quiero proporcionar mis datos personales y documentos durante el registro para formar parte de la federación
3. Quiero recibir notificación cuando mi cuenta sea aprobada o rechazada por admin_fab
4. Quiero actualizar mi información de contacto, datos físicos y deportivos sin poder modificar mis datos personales (nombre, CI, fecha de nacimiento)
5. Quiero inscribirme en eventos y pruebas que correspondan a mi categoría FAB (calculada automáticamente) una vez que mi cuenta esté activa
6. Quiero ver el estado de mis inscripciones (pendiente asociación, pendiente FAB, aprobada, rechazada)
7. Quiero consultar mi dorsal asignado una vez que mi inscripción esté aprobada y pagada
8. Quiero subir mis marcas previas al inscribirme en pruebas

### Como Entrenador
1. Quiero poder registrarme públicamente desde la web proporcionando mi información profesional (años de experiencia, certificaciones, especialidades)
2. Quiero esperar la aprobación de admin_fab para poder acceder al sistema completamente
3. Quiero actualizar mi perfil excepto datos personales bloqueados una vez que mi cuenta esté activa
4. Quiero ver información de eventos y pruebas para planificar entrenamientos
5. Quiero consultar startlists de eventos donde participan mis atletas

### Como Juez
1. Quiero poder registrarme públicamente desde la web con mi nivel de certificación (nacional/internacional)
2. Quiero esperar la aprobación de admin_fab para activar mi cuenta
3. Quiero actualizar mi perfil profesional excepto datos personales una vez activo
4. Quiero acceder a startlists finalizadas para organizar las competencias
5. Quiero consultar información técnica de pruebas (carriles, series, orden)

---

## Functional Requirements

### 1. Autenticación y Gestión de Usuarios

#### 1.1 Registro de Usuarios

##### 1.1.1 Flujo de Registro Público (Atleta, Entrenador, Juez)
- **REQ-1.1.1**: El sistema debe tener una página pública de Sign Up accesible sin autenticación
- **REQ-1.1.2**: En el Sign Up público, el usuario debe poder seleccionar SOLO entre 3 roles: atleta, entrenador, juez
- **REQ-1.1.3**: Durante el registro público, el usuario debe proporcionar: email, contraseña, rol deseado, asociación departamental
- **REQ-1.1.4**: Todo usuario registrado públicamente debe iniciar con estado "pendiente"
- **REQ-1.1.5**: El sistema debe vincular el registro con Supabase Auth
- **REQ-1.1.6**: El sistema debe enviar notificación a admin_fab cuando hay usuarios públicos pendientes de aprobación
- **REQ-1.1.7**: Usuarios con estado "pendiente" pueden hacer login pero tienen acceso limitado (solo ver su perfil en estado pendiente y completar datos requeridos)

##### 1.1.2 Flujo de Creación de Admin de Asociación (Solo por Admin FAB)
- **REQ-1.1.8**: Solo usuarios con rol admin_fab pueden crear cuentas de tipo admin_asociacion
- **REQ-1.1.9**: La creación de admin_asociacion debe hacerse desde un panel administrativo interno (NO desde Sign Up público)
- **REQ-1.1.10**: Al crear un admin_asociacion, el admin_fab debe proporcionar: email, nombre completo, asociación departamental asignada
- **REQ-1.1.11**: El sistema debe generar una contraseña temporal o enviar un link de activación al email del nuevo admin_asociacion
- **REQ-1.1.12**: Las cuentas admin_asociacion creadas por admin_fab deben iniciar con estado "activo" automáticamente (sin proceso de aprobación)
- **REQ-1.1.13**: Admin_fab puede crear múltiples admin_asociacion para la misma asociación si es necesario

##### 1.1.3 Admin FAB (Cuenta Root)
- **REQ-1.1.14**: Las cuentas admin_fab NO se crean mediante la aplicación web
- **REQ-1.1.15**: Admin_fab debe ser creado directamente en la base de datos o mediante script de seed inicial
- **REQ-1.1.16**: Debe existir al menos 1 cuenta admin_fab activa en todo momento

#### 1.2 Roles y Permisos
- **REQ-1.2.1**: El sistema debe soportar 5 roles: admin_fab, admin_asociacion, atleta, entrenador, juez
- **REQ-1.2.2**: Jerarquía de creación de cuentas:
  - **admin_fab**: creado manualmente (seed/script)
  - **admin_asociacion**: creado únicamente por admin_fab
  - **atleta, entrenador, juez**: auto-registro público + aprobación de admin_fab
- **REQ-1.2.3**: La jerarquía de permisos debe ser: admin_fab (acceso total) > admin_asociacion (su asociación) > perfiles individuales
- **REQ-1.2.4**: RLS debe estar activo en todas las tablas de la base de datos
- **REQ-1.2.5**: Los usuarios solo pueden ver datos de su asociación, excepto admin_fab que ve todo

#### 1.3 Estados de Usuario
- **REQ-1.3.1**: Estados posibles: pendiente, activo, inactivo, rechazado
- **REQ-1.3.2**: Solo admin_fab puede cambiar estado de usuarios registrados públicamente (atleta, entrenador, juez)
- **REQ-1.3.3**: Admin_asociacion creados por admin_fab inician directamente en estado "activo"
- **REQ-1.3.4**: Solo usuarios con estado "activo" pueden usar el sistema completamente
- **REQ-1.3.5**: Usuarios con estado "pendiente" tienen acceso restringido (solo pueden ver notificación de "cuenta en revisión" y completar su perfil)
- **REQ-1.3.6**: Usuarios con estado "rechazado" no pueden acceder al sistema (login bloqueado con mensaje explicativo)
- **REQ-1.3.7**: Admin_fab puede cambiar estado de admin_asociacion (activar/desactivar) en casos excepcionales

---

### 2. Gestión de Perfiles (Atleta, Entrenador, Juez)

#### 2.1 Perfil de Atleta

##### 2.1.1 Datos Personales (BLOQUEADOS para auto-edición)
- **REQ-2.1.1**: El perfil debe incluir: nombre, apellido, CI (único), fecha_nacimiento, género (M/F), nacionalidad, estado_civil (opcional)
- **REQ-2.1.2**: El usuario NO puede editar estos campos una vez creados
- **REQ-2.1.3**: Solo admin_fab puede modificar datos personales en casos excepcionales

##### 2.1.2 Datos de Contacto (EDITABLES)
- **REQ-2.1.4**: El usuario debe poder actualizar: teléfono, email (único), dirección, ciudad_residencia, departamento_residencia
- **REQ-2.1.5**: El email debe ser validado y único en el sistema

##### 2.1.3 Datos Federativos
- **REQ-2.1.6**: El perfil debe incluir: asociacion_id (FK), municipio, categoria_fab, especialidad, años_practica (opcional)
- **REQ-2.1.7**: El campo "municipio" debe ser obligatorio SOLO si la asociación NO es "Santa Cruz"
- **REQ-2.1.8**: Si la asociación es "Santa Cruz", el campo "municipio" debe ser NULL
- **REQ-2.1.9**: La categoría FAB debe calcularse automáticamente según la edad actual del atleta:
  - Mayores: 23+ años
  - U23: 21-22 años
  - U20: 18-20 años
  - Menores: 16-17 años
  - U16: 14-15 años
  - U14: 12-13 años
  - U10: 8-9 años
  - U8: <8 años
- **REQ-2.1.10**: La categoría FAB debe recalcularse automáticamente al cambiar fecha_nacimiento

##### 2.1.4 Datos Físicos y Deportivos (EDITABLES)
- **REQ-2.1.11**: El sistema debe permitir registro de: altura_cm (130-250), peso_kg (25-180), tallas (camiseta, pantalón, zapatos), tipo_sangre (obligatorio)
- **REQ-2.1.12**: El sistema debe permitir registro opcional de: marca_personal_mejor, evento_de_la_marca, fecha_de_la_marca

##### 2.1.5 Contacto de Emergencia (EDITABLES)
- **REQ-2.1.13**: El sistema debe exigir: contacto_emergencia, telefono_emergencia, parentesco_emergencia

##### 2.1.6 Documentos (usar Supabase Storage)
- **REQ-2.1.14**: El sistema debe requerir carga de: foto_url, ci_frente_url, ci_reverso_url
- **REQ-2.1.15**: El sistema debe permitir carga opcional de: certificado_medico_url, carnet_vacunacion_url
- **REQ-2.1.16**: Los archivos deben almacenarse en Supabase Storage con RLS por path

##### 2.1.7 Sistema de Aprobación
- **REQ-2.1.17**: El perfil debe iniciar con estado "pendiente"
- **REQ-2.1.18**: Admin_fab debe poder aprobar (estado → "activo") o rechazar (estado → "rechazado")
- **REQ-2.1.19**: Al aprobar/rechazar, se debe registrar: aprobado_por_fab (user_id), fecha_aprobacion, observaciones

#### 2.2 Perfil de Entrenador
- **REQ-2.2.1**: Debe incluir los mismos bloques que atleta: Datos Personales (bloqueados), Contacto (editable), Emergencia, Documentos, Sistema
- **REQ-2.2.2**: Datos Profesionales específicos: especialidad, anios_experiencia (obligatorio), certificaciones (opcional), titulos_deportivos (opcional)
- **REQ-2.2.3**: Documentos opcionales adicionales: titulos_profesionales_url, certificaciones_deportivas_url
- **REQ-2.2.4**: Mismo sistema de aprobación que atletas

#### 2.3 Perfil de Juez
- **REQ-2.3.1**: Debe incluir los mismos bloques base que atleta y entrenador
- **REQ-2.3.2**: Datos Profesionales específicos: especialidad, anios_experiencia, nivel_juez (nacional/internacional), certificaciones, eventos_juzgados
- **REQ-2.3.3**: Documentos opcionales adicionales: certificaciones_juez_url, licencia_juez_url
- **REQ-2.3.4**: Mismo sistema de aprobación que atletas

#### 2.4 Auto-edición de Perfil ("Mi Perfil")
- **REQ-2.4.1**: Todos los usuarios deben poder acceder a una sección "Mi Perfil"
- **REQ-2.4.2**: En "Mi Perfil", los usuarios pueden editar solo campos NO BLOQUEADOS
- **REQ-2.4.3**: El sistema debe mostrar campos bloqueados como "solo lectura" con indicación visual
- **REQ-2.4.4**: Si un usuario intenta modificar campos bloqueados (via API), el sistema debe rechazar la operación

---

### 3. Gestión de Asociaciones

#### 3.1 Asociaciones Departamentales
- **REQ-3.1.1**: El sistema debe incluir 9 asociaciones predefinidas (una por departamento): La Paz, Cochabamba, Santa Cruz, Chuquisaca, Tarija, Oruro, Potosí, Beni, Pando
- **REQ-3.1.2**: Cada asociación debe tener: nombre (único), departamento, ciudad, contacto, email, teléfono, estado (activo/inactivo)
- **REQ-3.1.3**: Las asociaciones deben ser gestionables solo por admin_fab
- **REQ-3.1.4**: Cada usuario debe estar vinculado a exactamente una asociación

---

### 4. Gestión de Eventos

#### 4.1 Creación de Eventos
- **REQ-4.1.1**: Solo admin_fab y admin_asociacion pueden crear eventos
- **REQ-4.1.2**: Cada evento debe tener tipo: "federativo" o "asociacion"
- **REQ-4.1.3**: Eventos tipo "federativo":
  - Deben incluir: costo_fab (obligatorio), costo_por_atleta (opcional)
  - Requieren pago de la asociación verificado por FAB
  - Datos bancarios: banco, numero_cuenta, titular_cuenta, qr_pago_url
- **REQ-4.1.4**: Eventos tipo "asociacion":
  - NO requieren pago federativo
  - Son gestionados por la asociación creadora
- **REQ-4.1.5**: Todo evento debe incluir:
  - Información básica: nombre, descripción, logo_url (opcional)
  - Ubicación: ciudad, lugar, dirección
  - Calendario: fecha_evento, hora_inicio, hora_fin (opcional), fecha_insc_inicio, fecha_insc_fin
  - Reglas: limite_participantes, limite_por_prueba, limite_por_asociacion, edad_minima, edad_maxima, genero_permitido (M/F/Mixto)
  - Organización: asociacion_creadora_id, creado_por_user, creado_por_rol, director_tecnico, jefe_competencia, comisario

#### 4.2 Estados de Evento
- **REQ-4.2.1**: Estados posibles: borrador, en_revision, aprobado, rechazado, finalizado
- **REQ-4.2.2**: Flujo de estados:
  - Admin_asociacion crea evento → "borrador"
  - Admin_asociacion envía a revisión → "en_revision"
  - Admin_fab revisa → "aprobado" o "rechazado"
  - Tras el evento → "finalizado"
- **REQ-4.2.3**: Solo eventos en estado "aprobado" pueden recibir inscripciones

#### 4.3 Permisos de Eventos
- **REQ-4.3.1**: Admin_fab puede ver, editar y aprobar todos los eventos
- **REQ-4.3.2**: Admin_asociacion solo puede ver y editar eventos de su asociación
- **REQ-4.3.3**: Atletas, entrenadores y jueces pueden ver eventos aprobados

---

### 5. Gestión de Pruebas

#### 5.1 Configuración de Pruebas
- **REQ-5.1.1**: Cada evento puede tener múltiples pruebas
- **REQ-5.1.2**: Cada prueba debe incluir:
  - Básico: nombre, categoria_fab, genero (M/F/Mixto), distancia
  - Técnico: es_con_carriles (boolean), numero_carriles (si aplica), es_campo, es_pista, es_fondo
  - Límites: limite_participantes, tiempo_limite, marca_minima, marca_maxima, edad_minima, edad_maxima
  - Horario: hora_inicio, hora_fin, duracion_estimada, orden_competencia
  - Estado: activa/inactiva, observaciones

#### 5.2 Validaciones de Pruebas
- **REQ-5.2.1**: Si es_con_carriles = true, numero_carriles debe ser obligatorio y > 0
- **REQ-5.2.2**: La categoría FAB de la prueba debe coincidir con categorías válidas del sistema
- **REQ-5.2.3**: Solo admin_fab y admin_asociacion del evento pueden crear/editar pruebas

---

### 6. Gestión de Inscripciones

#### 6.1 Proceso de Inscripción (Atleta)
- **REQ-6.1.1**: Solo atletas con estado "activo" pueden inscribirse
- **REQ-6.1.2**: Un atleta puede inscribirse en múltiples pruebas del mismo evento
- **REQ-6.1.3**: No se permiten inscripciones duplicadas (mismo evento + prueba + atleta)
- **REQ-6.1.4**: Al inscribirse, el sistema debe:
  - Registrar categoría_atleta (calculada en ese momento)
  - Permitir ingresar: marca_previa, mejor_marca_personal, fecha_mejor_marca (opcionales)
  - Inicializar estados: estado_asociacion = "pendiente", estado_fab = "pendiente"
- **REQ-6.1.5**: El sistema debe validar:
  - Fecha de inscripción dentro del rango (fecha_insc_inicio <= hoy <= fecha_insc_fin)
  - Límites no excedidos (por evento, por prueba, por asociación)
  - Edad del atleta dentro de rangos de la prueba
  - Género del atleta coincide con genero_permitido de la prueba

#### 6.2 Aprobación por Asociación (Admin Asociación)
- **REQ-6.2.1**: Admin_asociacion debe poder ver inscripciones pendientes de atletas de su asociación
- **REQ-6.2.2**: Admin_asociacion puede:
  - Aprobar (estado_asociacion → "aprobada")
  - Rechazar (estado_asociacion → "rechazada", con motivo_rechazo obligatorio)
- **REQ-6.2.3**: Al aprobar, se debe registrar: aprobado_por_asociacion (user_id), fecha_aprobacion_asociacion

#### 6.3 Pago de Asociación (Solo Eventos Federativos)
- **REQ-6.3.1**: Una vez que la asociación aprobó sus inscripciones, debe calcular el monto total a pagar
- **REQ-6.3.2**: Cálculo de monto:
  - Si evento tiene costo_por_atleta: monto = cantidad_atletas_aprobados × costo_por_atleta
  - Si NO: monto = costo_fab (fijo por asociación)
- **REQ-6.3.3**: Admin_asociacion debe poder registrar el pago en la tabla `pagos_evento_asociacion`:
  - monto, metodo_pago, fecha_pago, comprobante_url
  - estado_pago = "pendiente"
- **REQ-6.3.4**: La plataforma NO procesa pagos, solo registra información

#### 6.4 Verificación de Pago (Admin FAB)
- **REQ-6.4.1**: Admin_fab debe poder ver todos los pagos pendientes de verificación
- **REQ-6.4.2**: Admin_fab puede:
  - Verificar (estado_pago → "verificado")
  - Observar (estado_pago → "observado", con observaciones obligatorias)
- **REQ-6.4.3**: Al verificar, se debe registrar: verificado_por (user_id), fecha_verificacion
- **REQ-6.4.4**: Solo pagos con estado "verificado" permiten continuar el flujo de inscripciones

#### 6.5 Aprobación Final (Admin FAB)
- **REQ-6.5.1**: Admin_fab debe poder ver inscripciones donde:
  - estado_asociacion = "aprobada"
  - Para federativos: pago_verificado = true
  - Para asociación: sin requisito de pago
- **REQ-6.5.2**: Admin_fab puede:
  - Aprobar (estado_fab → "aprobada")
  - Rechazar (estado_fab → "rechazada", con motivo_rechazo)
- **REQ-6.5.3**: Al aprobar, se debe registrar: aprobado_por_fab (user_id), fecha_aprobacion_fab

---

### 7. Sistema de Dorsales

#### 7.1 Asignación de Dorsales
- **REQ-7.1.1**: Los dorsales solo se asignan a inscripciones donde:
  - estado_fab = "aprobada"
  - Para federativos: pago_verificado = true
- **REQ-7.1.2**: Cada dorsal debe ser único por evento (no se repite el número dentro del mismo evento)
- **REQ-7.1.3**: Un atleta solo puede tener un dorsal por evento (aunque esté en múltiples pruebas)
- **REQ-7.1.4**: La asignación debe registrar:
  - evento_id, atleta_id, numero (único)
  - fecha_asignacion, asignado_por (user_id)
  - estado (activo/inactivo)

#### 7.2 Gestión de Dorsales
- **REQ-7.2.1**: Solo admin_fab puede asignar dorsales
- **REQ-7.2.2**: El sistema debe proveer una interfaz para asignación manual o automática (secuencial)
- **REQ-7.2.3**: Admin_fab puede desactivar un dorsal (estado → "inactivo") en casos excepcionales
- **REQ-7.2.4**: Al asignar dorsal, se debe actualizar la inscripción con: dorsal_asignado, fecha_asignacion_dorsal, dorsal_asignado_por

---

### 8. Startlists

#### 8.1 Creación de Startlists
- **REQ-8.1.1**: Solo admin_fab y admin_asociacion del evento pueden crear startlists
- **REQ-8.1.2**: Cada startlist debe estar vinculada a: evento_id, prueba_id
- **REQ-8.1.3**: Una startlist debe tener:
  - nombre (descriptivo, ej: "Serie 1 - Varones U20")
  - tipo: "serie" o "lista"
  - indice (orden de la serie/lista)
  - numero_carriles (si la prueba es con carriles)
  - estado: "borrador" o "finalizada"

#### 8.2 Items de Startlist
- **REQ-8.2.1**: Cada startlist contiene múltiples items (startlist_items)
- **REQ-8.2.2**: Cada item debe incluir:
  - startlist_id, dorsal_id, atleta_id
  - carril (obligatorio si es_con_carriles = true)
  - posicion_salida (opcional), orden (obligatorio)
  - semilla (opcional, para ordenamiento por marca previa)
- **REQ-8.2.3**: Datos de presentación (denormalizados): nombre_completo, apellido_completo, asociacion_nombre, categoria_atleta

#### 8.3 Validaciones de Startlists
- **REQ-8.3.1**: Si la prueba es con carriles:
  - Todos los items deben tener carril asignado
  - Los carriles no deben repetirse dentro de la misma startlist
  - Los carriles deben estar en rango [1..numero_carriles]
- **REQ-8.3.2**: El orden debe ser único dentro de cada startlist
- **REQ-8.3.3**: Solo dorsales válidos (estado "activo") pueden ser incluidos

#### 8.4 Estados de Startlist
- **REQ-8.4.1**: Startlists inician en "borrador"
- **REQ-8.4.2**: Admin puede editar items solo en estado "borrador"
- **REQ-8.4.3**: Al finalizar (estado → "finalizada"), la startlist se vuelve de solo lectura
- **REQ-8.4.4**: Startlists finalizadas son visibles para todos los roles

---

### 9. Seguridad y Permisos (RLS)

#### 9.1 Políticas Generales
- **REQ-9.1.1**: Row Level Security (RLS) debe estar habilitado en todas las tablas
- **REQ-9.1.2**: Por defecto, los usuarios solo pueden ver registros de su asociación
- **REQ-9.1.3**: Admin_fab tiene acceso total (puede leer y escribir todo)

#### 9.2 Políticas por Tabla

##### Usuarios (users, atletas, entrenadores, jueces)
- **REQ-9.2.1**: Lectura:
  - Propio perfil (user_id = auth.uid())
  - Admin_fab puede ver todos
  - Admin_asociacion puede ver usuarios de su asociación
- **REQ-9.2.2**: Escritura:
  - Usuario puede actualizar su perfil (excepto campos bloqueados)
  - Admin_fab puede actualizar todo

##### Eventos y Pruebas
- **REQ-9.2.3**: Lectura:
  - Admin_fab: todos
  - Admin_asociacion: eventos de su asociación
  - Otros roles: solo eventos en estado "aprobado"
- **REQ-9.2.4**: Escritura:
  - Admin_fab: todos
  - Admin_asociacion: solo eventos de su asociación

##### Inscripciones
- **REQ-9.2.5**: Lectura:
  - Atleta: sus propias inscripciones
  - Admin_asociacion: inscripciones de atletas de su asociación
  - Admin_fab: todas
- **REQ-9.2.6**: Escritura:
  - Atleta: puede crear inscripciones (solo para sí mismo)
  - Admin_asociacion: puede aprobar/rechazar (estado_asociacion)
  - Admin_fab: puede aprobar/rechazar (estado_fab)

##### Dorsales
- **REQ-9.2.7**: Lectura:
  - Atleta: su propio dorsal
  - Admin_asociacion: dorsales de su asociación
  - Admin_fab: todos
- **REQ-9.2.8**: Escritura:
  - Solo admin_fab

##### Pagos
- **REQ-9.2.9**: Lectura:
  - Admin_asociacion: pagos de su asociación
  - Admin_fab: todos
- **REQ-9.2.10**: Escritura:
  - Admin_asociacion: puede crear/actualizar (NO puede marcar como verificado)
  - Admin_fab: puede verificar/observar

##### Startlists
- **REQ-9.2.11**: Lectura:
  - Todos los roles pueden ver startlists finalizadas
  - Admin_fab y admin_asociacion del evento pueden ver borradores
- **REQ-9.2.12**: Escritura:
  - Solo admin_fab y admin_asociacion del evento

---

### 10. Interfaz de Usuario

#### 10.1 Consideraciones Generales
- **REQ-10.1.1**: El sistema debe usar componentes de Shadcn UI como base
- **REQ-10.1.2**: La UI debe ser responsiva (mobile-first)
- **REQ-10.1.3**: Priorizar funcionalidad sobre diseño estético complejo
- **REQ-10.1.4**: Usar Tailwind CSS para estilos

#### 10.2 Navegación
- **REQ-10.2.1**: La página pública de Sign Up debe ser accesible SIN login y mostrar SOLO las opciones de rol: Atleta, Entrenador, Juez
- **REQ-10.2.2**: El formulario de Sign Up NO debe mostrar opción de rol "admin_fab" ni "admin_asociacion"
- **REQ-10.2.3**: Menú principal debe adaptarse según el rol del usuario autenticado
- **REQ-10.2.4**: Indicador visual del estado del perfil (pendiente/activo/rechazado)
- **REQ-10.2.5**: Breadcrumbs para orientación en flujos complejos
- **REQ-10.2.6**: Usuarios en estado "pendiente" deben ver un banner persistente: "Tu cuenta está en revisión. Serás notificado cuando sea aprobada."

#### 10.3 Formularios
- **REQ-10.3.1**: Validación en tiempo real con mensajes claros
- **REQ-10.3.2**: Campos bloqueados deben mostrarse con estilo diferenciado (ej: fondo gris, icono de candado)
- **REQ-10.3.3**: Carga de archivos con preview y validación de tipo/tamaño
- **REQ-10.3.4**: Indicadores de progreso en formularios multi-paso

#### 10.4 Tablas y Listados
- **REQ-10.4.1**: Tablas con ordenamiento, filtrado y paginación
- **REQ-10.4.2**: Acciones rápidas en filas (aprobar, rechazar, editar)
- **REQ-10.4.3**: Badges de estado con colores distintivos

#### 10.5 Dashboards
- **REQ-10.5.1**: Dashboard específico por rol:
  - Admin_fab: métricas globales, usuarios públicos pendientes de aprobación, gestión de admin_asociacion, pagos por verificar
  - Admin_asociacion: resumen de su asociación, inscripciones pendientes
  - Atleta (pendiente): mensaje de "cuenta en revisión" + opción de completar perfil
  - Atleta (activo): próximos eventos, estado de inscripciones, dorsal asignado
  - Entrenador/Juez (pendiente): mensaje de "cuenta en revisión" + completar datos profesionales
  - Entrenador/Juez (activo): eventos relevantes, información de competencias

---

### 11. Notificaciones (Futuro - Nice to Have)
- **REQ-11.1**: Email al aprobar/rechazar perfil
- **REQ-11.2**: Email al cambiar estado de inscripción
- **REQ-11.3**: Email al asignar dorsal
- **REQ-11.4**: Notificaciones in-app

---

### 12. Reportes y Exportación (Futuro - Nice to Have)
- **REQ-12.1**: Exportar listados de atletas por asociación (PDF/Excel)
- **REQ-12.2**: Exportar startlists para imprimir
- **REQ-12.3**: Reporte de pagos por evento
- **REQ-12.4**: Estadísticas de participación por categoría

---

## Non-Goals (Out of Scope)

1. **Resultados de Competencias**: El sistema NO gestionará resultados de eventos (tiempos, marcas finales, clasificaciones). Esto queda explícitamente fuera de alcance en esta versión.

2. **Procesamiento de Pagos**: El sistema NO procesará pagos en línea. Solo registra comprobantes y permite verificación manual.

3. **Sistema de Mensajería Interna**: No se incluye chat o mensajería entre usuarios.

4. **Aplicación Móvil Nativa**: Solo web responsiva, sin apps iOS/Android nativas.

5. **Integración con Cronometraje**: No se conecta con sistemas de cronometraje electrónico.

6. **Marketplace de Eventos**: No se permite venta de entradas ni productos.

7. **Streaming o Transmisión en Vivo**: No se incluye funcionalidad de video.

8. **Red Social / Feed de Noticias**: No hay timeline social ni publicaciones de usuarios.

9. **Acreditaciones Físicas**: No se genera impresión de credenciales con QR/barcode (puede añadirse en el futuro).

10. **Multi-idioma**: Solo español en esta versión.

---

## Design Considerations

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Components**: Shadcn UI (Radix UI + Tailwind CSS)
- **Backend**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (para documentos y fotos)
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query

### UI/UX Guidelines
1. **Formularios multi-paso**: Usar stepper (Shadcn Tabs o Steps) para registro de perfiles
2. **Confirmaciones**: Diálogos (Alert Dialog) para acciones destructivas (rechazar, eliminar)
3. **Estados de carga**: Skeletons en tablas, spinners en botones
4. **Mensajes de éxito/error**: Toast notifications (Shadcn Toast)
5. **Campos bloqueados**: Usar `disabled` + icono de candado + tooltip explicativo
6. **Paleta de colores**:
   - Verde: aprobado, activo, verificado
   - Amarillo/Naranja: pendiente, en revisión
   - Rojo: rechazado, observado, inactivo
   - Azul: información, links
7. **Iconos**: Lucide React
8. **Tipografía**: Sistema por defecto (Inter via Next.js)

### Key Pages/Routes
```
/
├── /auth
│   ├── /login                          # Login para todos los roles
│   ├── /register                       # Sign Up PÚBLICO (solo atleta, entrenador, juez)
│   └── /reset-password
├── /dashboard                          # Adaptado por rol
├── /profile
│   ├── /edit
│   └── /documents
├── /users                              # Admin FAB/Asociacion
│   ├── /pending                        # Admin FAB: usuarios públicos pendientes de aprobación
│   ├── /admins                         # Admin FAB: gestión de admin_asociacion
│   ├── /admins/new                     # Admin FAB: crear nuevo admin_asociacion
│   ├── /[userId]
│   └── /[userId]/approve
├── /associations                       # Admin FAB
├── /events
│   ├── /                   # Listado
│   ├── /new                # Crear
│   ├── /[eventId]
│   ├── /[eventId]/edit
│   ├── /[eventId]/pruebas
│   └── /[eventId]/inscripciones
├── /inscripciones
│   ├── /                   # Mis inscripciones (atleta)
│   ├── /pending            # Admin asociacion
│   ├── /new
│   └── /[inscripcionId]
├── /pagos                  # Admin FAB/Asociacion
│   ├── /pending
│   └── /[pagoId]/verify
├── /dorsales
│   ├── /[eventId]
│   └── /[eventId]/assign
├── /startlists
│   ├── /[eventId]/[pruebaId]
│   └── /[eventId]/[pruebaId]/edit
```

---

## Technical Considerations

### Database Schema
- Ya existe un schema SQL completo en el PRD original (con ENUMs, triggers, funciones, RLS)
- Usar Prisma como ORM (ya configurado en el proyecto)
- Generar migraciones a partir del schema existente

### RLS Implementation
- Las políticas RLS ya están definidas en el SQL
- Asegurar que todas las queries usen `auth.uid()` de Supabase
- Usar Supabase Service Role Key solo en backend seguro (Server Actions)

### File Upload Strategy
- Usar Supabase Storage con buckets separados:
  - `profile-photos/`: fotos de perfil
  - `documents/`: CI, certificados, comprobantes
  - `event-logos/`: logos de eventos
- Path structure: `{bucket}/{asociacion_id}/{user_id}/{filename}`
- RLS en Storage: solo el propietario y admins pueden acceder
- Validaciones:
  - Fotos: JPG/PNG, max 5MB
  - Documentos: PDF/JPG/PNG, max 10MB
  - QR pagos: JPG/PNG, max 2MB

### Performance Considerations
1. **Paginación**: Todas las tablas con cursor-based pagination
2. **Índices**: Ya definidos en schema SQL (por asociación, estado, fechas)
3. **Caching**: TanStack Query con staleTime apropiado por tipo de dato
4. **Optimistic Updates**: En acciones frecuentes (aprobar inscripción)
5. **Prefetching**: En navegación predecible (listados → detalle)

### Error Handling
1. **Errores de validación**: Mostrar en formulario con React Hook Form
2. **Errores de RLS**: Mensaje genérico "No tienes permisos" (no revelar estructura)
3. **Errores de red**: Toast con retry
4. **Errores de servidor**: Log en Sentry/similar + mensaje genérico al usuario

### Testing Strategy (Futuro)
1. **Unit tests**: Funciones de negocio (cálculo categoría, validaciones)
2. **Integration tests**: API routes / Server Actions
3. **E2E tests**: Flujos críticos (registro → aprobación → inscripción → dorsal)

---

## Success Metrics

### 1. Reducción de Trabajo Manual (Objetivo: 70% reducción)
- **Métrica 1.1**: Tiempo promedio de procesamiento de registro de atleta (manual: ~30min → sistema: ~5min)
- **Métrica 1.2**: Tiempo de aprobación de inscripciones (manual: días → sistema: <24hrs)

### 2. Adopción del Sistema
- **Métrica 2.1**: 80% de atletas activos registrados en los primeros 3 meses
- **Métrica 2.2**: 100% de asociaciones registradas y con al menos 1 admin activo
- **Métrica 2.3**: 90% de eventos nuevos creados en la plataforma (vs. gestión manual)

### 3. Calidad de Datos
- **Métrica 3.1**: 95% de perfiles con documentos completos (foto + CI + certificado)
- **Métrica 3.2**: 0% de dorsales duplicados por evento
- **Métrica 3.3**: <5% de inscripciones rechazadas por errores de datos

### 4. Eficiencia en Pagos (Solo Federativos)
- **Métrica 4.1**: 90% de pagos verificados en <48hrs
- **Métrica 4.2**: 100% de comprobantes de pago digitalizados (vs. físicos)

### 5. Satisfacción de Usuarios
- **Métrica 5.1**: Net Promoter Score (NPS) > 50
- **Métrica 5.2**: <10% de tickets de soporte por confusión en flujos
- **Métrica 5.3**: 80% de usuarios reportan "fácil de usar" en encuesta

### 6. Transparencia y Trazabilidad
- **Métrica 6.1**: 100% de aprobaciones/rechazos con usuario y fecha registrados
- **Métrica 6.2**: 100% de dorsales con registro de quién/cuándo asignó
- **Métrica 6.3**: 0% de quejas por "pérdida de información" (vs. sistema manual)

---

## Open Questions

### 1. Gestión de Temporadas
- **Pregunta**: ¿El sistema debe manejar concepto de "temporadas" o "años deportivos" para categorías FAB? (Ej: categoría calculada por edad al inicio de temporada vs. edad actual)
- **Impacto**: Afecta cálculo de categoría y validaciones de inscripción
- **Propuesta**: Iniciar con edad actual, añadir temporadas en v2 si es necesario

### 2. Capacitación de Asociaciones
- **Pregunta**: ¿Cómo se capacitará a los 9 admin_asociacion en el uso del sistema?
- **Propuesta**: Crear guías en video + manual PDF + sesión de onboarding virtual

### 3. Migración de Datos Históricos
- **Pregunta**: ¿Hay datos de atletas/eventos previos que deban migrarse?
- **Impacto**: Requiere scripts de importación y validación
- **Propuesta**: Iniciar sistema "limpio" y permitir registro manual o importación CSV

### 4. Activación de Admin Asociación
- **Pregunta**: ¿Cómo recibe sus credenciales el admin_asociacion creado por admin_fab?
- **Propuesta**:
  - Opción A: Admin_fab ingresa contraseña temporal → sistema envía email con credenciales
  - Opción B: Sistema genera link de activación único → admin_asociacion establece su propia contraseña
  - Opción C: Admin_fab genera contraseña temporal → la comunica manualmente (WhatsApp/llamada) → admin_asociacion debe cambiarla en primer login
- **Decisión pendiente**: Confirmar método preferido de seguridad y comunicación

### 5. Proceso de "Edición de Datos Personales"
- **Pregunta**: Si un atleta detecta un error en su CI o nombre (datos bloqueados), ¿cómo lo corrige?
- **Propuesta**:
  - Opción A: Solicitud formal vía sistema (ticket) → admin_fab corrige
  - Opción B: Formulario especial "Solicitar corrección" con justificación → admin_fab aprueba y edita
- **Decisión pendiente**: Confirmar con FAB el proceso preferido

### 6. Pagos Parciales / Descuentos
- **Pregunta**: ¿Las asociaciones pueden tener descuentos o pagar en cuotas?
- **Impacto**: Requiere tabla adicional de transacciones o campo de "monto_pagado" vs "monto_total"
- **Propuesta inicial**: Pago único completo; gestionar excepciones manualmente fuera del sistema

### 7. Dorsales Reutilizables
- **Pregunta**: ¿Los dorsales pueden reutilizarse entre eventos o debe haber un pool único por año?
- **Propuesta**: Dorsales únicos por evento (reutilizables entre eventos diferentes)

### 8. Startlists Públicas
- **Pregunta**: ¿Las startlists deben ser públicas (sin login) para que espectadores/medios las consulten?
- **Impacto**: Requiere rutas públicas sin RLS
- **Propuesta**: Iniciar con acceso solo autenticado; añadir vista pública en v2

### 9. Notificaciones Email
- **Pregunta**: ¿Es crítico tener emails automáticos en v1 o puede ser manual al inicio?
- **Propuesta**: Iniciar sin emails automáticos (nice to have); admins notifican manualmente

### 10. Backup y Recuperación
- **Pregunta**: ¿Cuál es la política de backups de Supabase contratada?
- **Acción**: Verificar plan de Supabase y configurar backups automáticos diarios

### 11. Manejo de Apelaciones
- **Pregunta**: Si un atleta es rechazado, ¿puede apelar o debe re-registrarse desde cero?
- **Propuesta**: Permitir que admin_fab cambie estado de "rechazado" → "pendiente" para re-revisar

---

## Appendix

### A. Enum Values Reference

#### rol_enum
- `admin_fab`
- `admin_asociacion`
- `atleta`
- `entrenador`
- `juez`

#### estado_usuario_enum
- `pendiente`
- `activo`
- `inactivo`
- `rechazado`

#### genero_enum
- `M` (Masculino)
- `F` (Femenino)

#### tipo_evento_enum
- `federativo`
- `asociacion`

#### estado_evento_enum
- `borrador`
- `en_revision`
- `aprobado`
- `rechazado`
- `finalizado`

#### estado_pago_enum
- `pendiente`
- `verificado`
- `observado`

#### estado_insc_assoc_enum
- `pendiente`
- `aprobada`
- `rechazada`

#### estado_startlist_enum
- `borrador`
- `finalizada`

### B. Categorías FAB por Edad

| Categoría | Rango de Edad |
|-----------|---------------|
| U8        | < 8 años      |
| U10       | 8-9 años      |
| U14       | 12-13 años    |
| U16       | 14-15 años    |
| Menores   | 16-17 años    |
| U20       | 18-20 años    |
| U23       | 21-22 años    |
| Mayores   | 23+ años      |

### C. Asociaciones Departamentales

1. La Paz
2. Cochabamba
3. Santa Cruz
4. Chuquisaca
5. Tarija
6. Oruro
7. Potosí
8. Beni
9. Pando

### D. Flujos de Registro de Usuarios

#### D.1 Flujo de Auto-Registro Público (Atleta, Entrenador, Juez)

```
1. Usuario accede a página pública /auth/register (sin login)
2. Usuario completa formulario con:
   - Email
   - Contraseña
   - Rol deseado (atleta / entrenador / juez)
   - Asociación departamental
   - Datos básicos iniciales
3. Sistema crea cuenta en Supabase Auth
4. Sistema crea registro en tabla users con estado: "pendiente"
5. Usuario recibe email de confirmación (cuenta creada pero pendiente)
6. Usuario puede hacer login pero ve mensaje: "Tu cuenta está en revisión por admin_fab"
7. Usuario puede completar su perfil mientras espera aprobación
8. Admin_fab revisa usuario pendiente
9. Admin_fab aprueba → estado: "activo" (usuario recibe email de activación)
   O rechaza → estado: "rechazado" (usuario recibe email con motivo)
10. Si aprobado, usuario puede acceder a todas las funcionalidades según su rol
```

#### D.2 Flujo de Creación de Admin Asociación (Solo por Admin FAB)

```
1. Admin_fab accede a panel interno /users/admins/new
2. Admin_fab completa formulario:
   - Email del nuevo admin_asociacion
   - Nombre completo
   - Asociación departamental a asignar
   - [Opcional] Contraseña temporal o generación automática
3. Sistema crea cuenta en Supabase Auth
4. Sistema crea registro en tabla users con:
   - rol: "admin_asociacion"
   - estado: "activo" (sin aprobación, directo)
   - asociacion_id asignada
5. Sistema envía email al nuevo admin_asociacion con:
   - Link de activación de cuenta (si se usó opción B)
   - O credenciales temporales (si se usó opción A/C)
6. Admin_asociacion accede con sus credenciales
7. [Recomendado] En primer login, forzar cambio de contraseña
8. Admin_asociacion puede empezar a gestionar su asociación inmediatamente
```

### E. Flujo de Inscripción (Evento Federativo)

```
1. Atleta crea inscripción → estado_asociacion: "pendiente"
2. Admin_asociacion aprueba → estado_asociacion: "aprobada"
3. Admin_asociacion calcula monto total y registra pago → estado_pago: "pendiente"
4. Admin_fab verifica pago → estado_pago: "verificado"
5. Admin_fab aprueba inscripción → estado_fab: "aprobada"
6. Admin_fab asigna dorsal → dorsal_asignado: [número]
7. Atleta puede ver su dorsal en "Mis Inscripciones"
```

### F. Flujo de Inscripción (Evento de Asociación)

```
1. Atleta crea inscripción → estado_asociacion: "pendiente"
2. Admin_asociacion aprueba → estado_asociacion: "aprobada"
3. Admin_asociacion asigna dorsal → dorsal_asignado: [número]
   (No requiere pago ni aprobación FAB)
4. Atleta puede ver su dorsal en "Mis Inscripciones"
```

---

## Version History

| Versión | Fecha       | Autor | Cambios                                      |
|---------|-------------|-------|----------------------------------------------|
| 1.0     | 2025-10-24  | AI    | Versión inicial del PRD basado en requisitos FAB |

---

## Approval Sign-off

| Rol                     | Nombre | Firma | Fecha |
|-------------------------|--------|-------|-------|
| Product Owner (FAB)     |        |       |       |
| Tech Lead               |        |       |       |
| Designer                |        |       |       |

---

**Fin del Documento**
