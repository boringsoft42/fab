# 🗺️ FAB System - Implementation Roadmap

## Estado Actual del Proyecto

### ✅ Completado (30%)
1. **Database Schema** - 100%
   - Todas las tablas creadas
   - Enums definidos
   - Triggers y funciones activos
   - RLS policies (requiere ajustes)

2. **Authentication System** - 95%
   - Login/Logout funcionando
   - Middleware con role-based redirects
   - Estado-based access control
   - useUser y usePermissions hooks
   - ⚠️ Falta: Notificaciones email

3. **UI Base Components** - 100%
   - DataTable con TanStack Table
   - StatusBadge con variantes de color
   - Loading/Skeleton components
   - Toast notifications system
   - StatsCard component

4. **Admin FAB Dashboard** - 40%
   - Dashboard simple funcionando
   - ⚠️ Falta: Métricas reales, tablas de datos

### ❌ Pendiente (70%)

---

## 🎯 Plan de Implementación por Fases

### **FASE 1: Core User Management** (Prioridad CRÍTICA)
**Objetivo:** Permitir que admin_fab gestione usuarios y admin_asociacion pueda operar

#### 1.1 Gestión de Usuarios Pendientes (Task 3.1-3.2)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── users/
│           ├── pending/
│           │   ├── page.tsx                    # Lista usuarios pendientes
│           │   └── actions.ts                  # approve/reject actions
│           └── [userId]/
│               └── page.tsx                    # Detalle + aprobar/rechazar
├── components/
│   └── users/
│       ├── pending-users-table.tsx             # Tabla con filtros
│       ├── user-detail-view.tsx                # Vista detallada
│       └── approve-reject-dialog.tsx           # Confirmación
└── lib/
    └── actions/
        └── users/
            ├── get-pending-users.ts            # Server Action
            ├── approve-user.ts                 # Server Action
            └── reject-user.ts                  # Server Action
```

**Funcionalidad:**
- ✅ Ver lista de usuarios registrados públicamente (estado="pendiente")
- ✅ Filtrar por rol (atleta/entrenador/juez), asociación, fecha
- ✅ Ver perfil completo de cada usuario
- ✅ Aprobar usuario → estado="activo" + email notificación
- ✅ Rechazar usuario → estado="rechazado" + observaciones + email

**Validaciones:**
- Solo admin_fab puede aprobar/rechazar
- Registrar quién aprobó/rechazó y cuándo
- No permitir aprobar si perfil incompleto (opcional)

**Dependencias:** RLS policies en `users` table

---

#### 1.2 Gestión de Admin Asociación (Task 3.3-3.4)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── users/
│           └── admins/
│               ├── page.tsx                    # Lista admin_asociacion
│               ├── new/
│               │   └── page.tsx                # Crear nuevo admin
│               └── actions.ts                  # CRUD actions
├── components/
│   └── users/
│       ├── admin-asociacion-table.tsx          # Tabla con toggle activo/inactivo
│       └── create-admin-form.tsx               # Form multi-step
└── lib/
    └── actions/
        └── users/
            ├── create-admin-asociacion.ts      # Server Action (usa service role)
            ├── toggle-admin-status.ts          # Activar/desactivar
            └── send-activation-email.ts        # Email con credenciales
```

**Funcionalidad:**
- ✅ Ver lista de todos los admin_asociacion
- ✅ Crear nuevo admin_asociacion (admin_fab only)
- ✅ Asignar asociación departamental
- ✅ Generar contraseña temporal o enviar link activación
- ✅ Activar/desactivar admin_asociacion existente
- ✅ Email con credenciales al crear

**Validaciones:**
- Solo admin_fab puede crear/modificar admin_asociacion
- Email único en el sistema
- Asociación válida (de las 9 existentes)
- Estado inicial: "activo" (sin aprobación)

**Dependencias:** Supabase Admin API, Email service

---

#### 1.3 Perfiles de Usuario (Task 3.5-3.10)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── profile/
│           ├── atleta/
│           │   └── page.tsx                    # Form 7 pasos
│           ├── entrenador/
│           │   └── page.tsx                    # Form adaptado
│           ├── juez/
│           │   └── page.tsx                    # Form adaptado
│           ├── edit/
│           │   └── page.tsx                    # Mi Perfil (campos bloqueados)
│           └── documents/
│               └── page.tsx                    # Upload docs
├── components/
│   ├── profile/
│   │   ├── atleta-form.tsx                     # Stepper 7 pasos
│   │   ├── entrenador-form.tsx                 # Form profesional
│   │   ├── juez-form.tsx                       # Form con nivel_juez
│   │   ├── profile-view.tsx                    # Vista read-only
│   │   └── document-upload.tsx                 # File upload + preview
│   └── ui/
│       ├── stepper.tsx                         # Multi-step indicator
│       ├── form-field-locked.tsx               # Campo bloqueado con candado
│       └── file-upload.tsx                     # Supabase Storage integration
└── lib/
    ├── actions/
    │   └── profile/
    │       ├── save-atleta-profile.ts
    │       ├── save-entrenador-profile.ts
    │       ├── save-juez-profile.ts
    │       ├── update-profile.ts               # Con validación campos bloqueados
    │       └── upload-document.ts              # Supabase Storage
    ├── validations/
    │   └── profile.ts                          # Zod schemas
    └── utils/
        └── categoria-fab-utils.ts              # Cálculo automático categoría
```

**Funcionalidad Atleta (7 Pasos):**
1. **Datos Personales** (BLOQUEADOS después de crear)
   - nombre, apellido, CI, fecha_nacimiento, género, nacionalidad
2. **Datos de Contacto** (EDITABLES)
   - teléfono, email, dirección, ciudad, departamento
3. **Datos Federativos**
   - asociación, municipio (condicional), categoría_fab (auto), especialidad
4. **Datos Físicos y Deportivos**
   - altura, peso, tallas, tipo_sangre, marca_personal
5. **Contacto de Emergencia**
   - nombre, teléfono, parentesco
6. **Documentos**
   - foto, CI frente/reverso, certificado médico, carnet vacunación
7. **Revisión y Envío**

**Validaciones Especiales:**
- ✅ **REQ-2.1.7**: Municipio obligatorio SOLO si asociación != "Santa Cruz"
- ✅ **REQ-2.1.9**: Categoría FAB calculada automáticamente por edad
- ✅ **REQ-2.4.4**: API rechaza modificación de campos bloqueados
- ✅ **REQ-2.1.16**: Archivos en Supabase Storage con RLS

**Dependencias:** Supabase Storage buckets, categoria-fab-utils

---

### **FASE 2: Event Management** (Prioridad ALTA)
**Objetivo:** Permitir crear y gestionar eventos federativos y de asociación

#### 2.1 Eventos CRUD (Task 4.1-4.5)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── events/
│           ├── page.tsx                        # Lista eventos (filtro por rol)
│           ├── new/
│           │   └── page.tsx                    # Crear evento
│           ├── [eventId]/
│           │   ├── page.tsx                    # Detalle evento
│           │   ├── edit/
│           │   │   └── page.tsx                # Editar evento
│           │   └── actions.ts                  # Cambiar estado evento
│           └── actions.ts                      # CRUD events
├── components/
│   └── events/
│       ├── events-table.tsx                    # Tabla con filtros + estados
│       ├── event-form.tsx                      # Form 5 pasos
│       ├── event-detail.tsx                    # Vista completa
│       └── event-state-buttons.tsx             # Aprobar/Rechazar/Enviar a revisión
└── lib/
    ├── actions/
    │   └── events/
    │       ├── get-events.ts                   # Con RLS filtering
    │       ├── create-event.ts
    │       ├── update-event.ts
    │       ├── change-event-state.ts           # Workflow estados
    │       └── delete-event.ts
    └── validations/
        └── event.ts                            # Conditional validation federativo
```

**Form Evento (5 Pasos):**
1. **Información Básica**
   - nombre, descripción, tipo (federativo/asociacion), logo
2. **Ubicación**
   - ciudad, lugar, dirección, fecha, hora
3. **Reglas**
   - límites, edad, género, inscripciones
4. **Financiero** (SOLO si tipo=federativo)
   - costo_fab, costo_por_atleta, banco, cuenta, QR
5. **Organización**
   - director_tecnico, jefe_competencia, comisario

**Estados de Evento:**
```
borrador → en_revision → aprobado/rechazado → finalizado
         (admin_asoc)  (admin_fab)
```

**RLS Logic:**
- Admin_fab: ve TODOS
- Admin_asociacion: solo su asociación
- Otros: solo estado="aprobado"

**Dependencias:** RLS policies eventos, Supabase Storage (logos, QRs)

---

#### 2.2 Pruebas por Evento (Task 4.6-4.8)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── events/
│           └── [eventId]/
│               └── pruebas/
│                   ├── page.tsx                # Lista pruebas del evento
│                   ├── new/
│                   │   └── page.tsx            # Crear prueba
│                   └── [pruebaId]/
│                       └── edit/
│                           └── page.tsx        # Editar prueba
├── components/
│   └── pruebas/
│       ├── pruebas-table.tsx                   # Tabla técnica
│       └── prueba-form.tsx                     # Form 4 secciones
└── lib/
    ├── actions/
    │   └── pruebas/
    │       ├── get-pruebas-by-event.ts
    │       ├── create-prueba.ts
    │       ├── update-prueba.ts
    │       └── delete-prueba.ts
    └── validations/
        └── prueba.ts                           # Conditional carriles validation
```

**Form Prueba (4 Secciones):**
1. **Básico**: nombre, categoria_fab, género, distancia
2. **Técnico**: carriles (condicional), campo/pista/fondo
3. **Límites**: participantes, tiempo, marcas, edades
4. **Horario**: hora, duración, orden

**Validaciones:**
- ✅ **REQ-5.2.1**: Si es_con_carriles=true → numero_carriles obligatorio
- Categoría FAB válida
- Solo admin_fab y admin_asociacion del evento pueden crear

---

### **FASE 3: Inscriptions & Payments** (Prioridad ALTA)
**Objetivo:** Flujo completo de inscripción dual (Asociación + FAB)

#### 3.1 Inscripciones Atleta (Task 4.9-4.10)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── inscripciones/
│           ├── page.tsx                        # Mis inscripciones (atleta)
│           ├── new/
│           │   └── page.tsx                    # Inscribirse en evento
│           └── [inscripcionId]/
│               └── page.tsx                    # Detalle inscripción
├── components/
│   └── inscripciones/
│       ├── inscription-form.tsx                # Selección pruebas + validaciones
│       ├── my-inscriptions-table.tsx           # Con dual estado
│       └── inscription-status-badge.tsx        # Estado compuesto
└── lib/
    └── actions/
        └── inscripciones/
            ├── get-my-inscriptions.ts
            ├── create-inscription.ts           # Con validaciones múltiples
            └── check-inscription-eligibility.ts # Validar límites
```

**Validaciones Críticas:**
- ✅ Fecha dentro del rango inscripción
- ✅ Límites no excedidos (evento/prueba/asociación)
- ✅ Edad del atleta en rango de la prueba
- ✅ Género coincide con prueba
- ✅ No inscripciones duplicadas
- ✅ Solo atletas estado="activo"

**Estados Duales:**
```
estado_asociacion: pendiente → aprobada/rechazada
estado_fab:        pendiente → aprobada/rechazada
```

---

#### 3.2 Aprobación Asociación (Task 4.11)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── inscripciones/
│           └── pending/
│               └── page.tsx                    # Admin asociación
├── components/
│   └── inscripciones/
│       ├── pending-inscriptions-table.tsx      # Bulk approve
│       └── approve-reject-inscription-dialog.tsx
└── lib/
    └── actions/
        └── inscripciones/
            ├── get-pending-inscriptions.ts     # Por asociación
            ├── approve-inscriptions-bulk.ts
            └── reject-inscription.ts
```

**Funcionalidad:**
- Ver inscripciones pendientes de mi asociación
- Aprobar masivo (checkbox múltiple)
- Rechazar individual con motivo obligatorio
- Registrar aprobado_por y fecha

---

#### 3.3 Pagos y Verificación (Task 4.12, 5.1-5.3)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── pagos/
│           ├── pending/
│           │   └── page.tsx                    # Admin FAB verifica
│           ├── new/
│           │   └── page.tsx                    # Admin asociación registra
│           └── [pagoId]/
│               └── page.tsx                    # Detalle pago + comprobante
├── components/
│   └── pagos/
│       ├── payment-form.tsx                    # Con cálculo automático monto
│       ├── pending-payments-table.tsx          # Admin FAB
│       ├── event-summary-card.tsx              # Resumen por evento
│       └── comprobante-viewer.tsx              # Preview imagen/PDF
└── lib/
    └── actions/
        └── pagos/
            ├── calculate-payment-amount.ts     # Lógica costo_por_atleta
            ├── create-payment.ts
            ├── get-pending-payments.ts
            ├── verify-payment.ts               # Admin FAB
            └── observe-payment.ts              # Con observaciones
```

**Cálculo Monto (REQ-6.3.2):**
```typescript
if (evento.costo_por_atleta) {
  monto = cantidad_atletas_aprobados * costo_por_atleta
} else {
  monto = evento.costo_fab
}
```

**Flujo:**
1. Admin_asociacion ve resumen de inscripciones aprobadas
2. Calcula monto automático
3. Registra pago con comprobante
4. Admin_fab verifica/observa
5. Si verificado → inscripciones.pago_verificado = true

---

### **FASE 4: Dorsales & Startlists** (Prioridad MEDIA)
**Objetivo:** Asignación de dorsales y generación de startlists

#### 4.1 Sistema de Dorsales (Task 5.4-5.5)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── dorsales/
│           └── [eventId]/
│               ├── page.tsx                    # Asignar dorsales
│               └── assigned/
│                   └── page.tsx                # Ver asignados
├── components/
│   └── dorsales/
│       ├── dorsal-assignment-table.tsx         # Input número + validación
│       ├── assigned-dorsals-table.tsx          # Lista con búsqueda
│       └── auto-assign-dialog.tsx              # Asignación secuencial
└── lib/
    └── actions/
        └── dorsales/
            ├── get-eligible-athletes.ts        # Con validaciones
            ├── assign-dorsal-manual.ts
            ├── assign-dorsals-auto.ts          # Secuencial
            ├── check-dorsal-uniqueness.ts      # Por evento
            └── deactivate-dorsal.ts
```

**Validaciones:**
- ✅ **REQ-7.1.1**: Solo inscripciones con estado_fab="aprobada" + pago_verificado (federativos)
- ✅ **REQ-7.1.2**: Dorsal único por evento (validación real-time)
- ✅ **REQ-7.1.3**: Un atleta = un dorsal por evento
- Solo admin_fab puede asignar

---

#### 4.2 Startlists (Task 5.6-5.9)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── startlists/
│           └── [eventId]/
│               └── [pruebaId]/
│                   ├── page.tsx                # Manager startlists
│                   ├── new/
│                   │   └── page.tsx            # Crear startlist
│                   ├── [startlistId]/
│                   │   ├── edit/
│                   │   │   └── page.tsx        # Editor drag-drop
│                   │   └── view/
│                   │       └── page.tsx        # Vista presentación
│                   └── actions.ts
├── components/
│   └── startlists/
│       ├── startlists-manager.tsx              # Lista + crear/editar/finalizar
│       ├── startlist-editor.tsx                # Drag-drop o tabla editable
│       ├── startlist-view.tsx                  # Presentación visual
│       └── athlete-selector.tsx                # Search + filters
└── lib/
    └── actions/
        └── startlists/
            ├── create-startlist.ts
            ├── add-items-to-startlist.ts       # Bulk insert con validaciones
            ├── finalize-startlist.ts           # Estado → finalizada
            ├── validate-startlist-items.ts     # Carriles, orden único
            └── get-startlists-by-prueba.ts
```

**Validaciones:**
- ✅ **REQ-8.3.1**: Si es_con_carriles → todos tienen carril, sin duplicados, rango válido
- ✅ **REQ-8.3.2**: Orden único por startlist
- ✅ **REQ-8.3.3**: Solo dorsales activos
- Editor drag-drop para reordenar
- Finalizada = read-only

---

### **FASE 5: Dashboards & UX** (Prioridad MEDIA)
**Objetivo:** Dashboards específicos y UX pulido

#### 5.1 Dashboards por Rol (Task 6.1-6.6)
**Componentes a crear:**
```
src/
├── app/
│   └── (dashboard)/
│       └── dashboard/
│           ├── page.tsx                        # Router (ya existe)
│           ├── admin-fab/
│           │   └── page.tsx                    # Con datos reales
│           ├── admin-asociacion/
│           │   └── page.tsx
│           ├── atleta-pending/
│           │   └── page.tsx
│           ├── atleta-activo/
│           │   └── page.tsx
│           ├── entrenador-pending/
│           │   └── page.tsx
│           ├── entrenador-activo/
│           │   └── page.tsx
│           ├── juez-pending/
│           │   └── page.tsx
│           └── juez-activo/
│               └── page.tsx
└── components/
    └── dashboard/
        ├── admin-fab-dashboard.tsx             # Versión completa con datos
        ├── admin-asociacion-dashboard.tsx
        ├── atleta-pending-dashboard.tsx        # "Cuenta en revisión" + completar perfil
        ├── atleta-activo-dashboard.tsx         # Eventos, inscripciones, dorsales
        ├── entrenador-dashboard.tsx
        └── juez-dashboard.tsx
```

**Métricas Admin FAB:**
- Total usuarios (por rol)
- Usuarios pendientes aprobación (REQ-10.5.1)
- Pagos pendientes verificación
- Admin_asociacion activos/inactivos
- Eventos por estado
- Quick actions con counts reales

**Métricas Admin Asociación:**
- Usuarios de mi asociación
- Inscripciones pendientes mi aprobación
- Pagos pendientes de mi asociación
- Eventos de mi asociación

**Atleta Activo:**
- Próximos eventos
- Mis inscripciones con estados
- Mi dorsal asignado
- Startlists donde participo

**Atleta Pendiente:**
- Banner: "Tu cuenta está en revisión"
- Barra progreso completitud perfil
- Botón "Completar Perfil"

---

#### 5.2 Componentes UX Mejorados
**Componentes a crear:**
```
src/components/
├── ui/
│   ├── breadcrumb.tsx                          # Task 6.12
│   ├── stepper.tsx                             # Task 6.9
│   └── confirm-dialog-enhanced.tsx             # Con textarea observaciones
└── shared/
    ├── pending-account-banner.tsx              # Banner persistente
    ├── role-badge.tsx                          # Badge por rol
    └── progress-indicator.tsx                  # Completitud perfil
```

---

### **FASE 6: Integration & Polish** (Prioridad BAJA)
**Objetivo:** Integraciones finales y pulido

#### 6.1 Notificaciones Email (Task 2.7.3-2.7.4, etc.)
**Componentes a crear:**
```
src/lib/
├── email/
│   ├── templates/
│   │   ├── user-approved.tsx                   # React Email
│   │   ├── user-rejected.tsx
│   │   ├── admin-created.tsx
│   │   ├── inscription-approved.tsx
│   │   └── dorsal-assigned.tsx
│   ├── send-email.ts                           # Resend/SendGrid integration
│   └── email-queue.ts                          # Background jobs (opcional)
```

**Emails Críticos:**
- Usuario aprobado/rechazado (REQ-1.1.6, 2.7.4)
- Admin_asociacion creado con credenciales (REQ-1.1.11)
- Inscripción aprobada/rechazada
- Dorsal asignado

---

#### 6.2 Utilidades y Helpers (Task 7.1-7.4)
**Ya creados pero verificar:**
```
src/lib/
├── format-utils.ts                             # Date, currency, CI format
├── categoria-fab-utils.ts                      # Cálculo categoría
└── toast-utils.ts                              # Ya existe ✅
```

---

#### 6.3 Testing & Documentation
**Tareas:**
- Unit tests para utils (categoría, validaciones)
- Integration tests para Server Actions críticos
- E2E tests para flujos completos:
  - Registro → Aprobación → Perfil
  - Evento → Inscripción → Pago → Dorsal
- Documentación de API
- Guías de usuario por rol

---

## 🔥 Orden de Implementación Recomendado

### **Sprint 1: User Management Foundation** (2 semanas)
1. ✅ Pending Users List & Approval (Task 3.1-3.2)
2. ✅ Admin Asociación CRUD (Task 3.3-3.4)
3. ✅ Email notifications básicas

**Resultado:** Admin_fab puede aprobar usuarios y crear admin_asociacion

---

### **Sprint 2: Profiles System** (2 semanas)
1. ✅ Atleta Profile Form 7 pasos (Task 3.5)
2. ✅ Entrenador Profile Form (Task 3.6)
3. ✅ Juez Profile Form (Task 3.7)
4. ✅ Mi Perfil con campos bloqueados (Task 3.8-3.9)
5. ✅ Document Upload Supabase Storage (Task 3.9.1)

**Resultado:** Usuarios pueden completar sus perfiles

---

### **Sprint 3: Event Management** (2 semanas)
1. ✅ Events CRUD (Task 4.1-4.5)
2. ✅ Pruebas CRUD (Task 4.6-4.8)
3. ✅ Event state workflow

**Resultado:** Admin puede crear y aprobar eventos

---

### **Sprint 4: Inscriptions Flow** (3 semanas)
1. ✅ Inscription creation (Task 4.9)
2. ✅ Aprobación Asociación (Task 4.11)
3. ✅ Payment registration (Task 4.12, 5.1)
4. ✅ Payment verification FAB (Task 5.2-5.3)
5. ✅ Aprobación FAB final

**Resultado:** Flujo completo de inscripción funcionando

---

### **Sprint 5: Dorsales & Startlists** (2 semanas)
1. ✅ Dorsal assignment (Task 5.4-5.5)
2. ✅ Startlists creation (Task 5.6-5.9)

**Resultado:** Sistema completo de competencia

---

### **Sprint 6: Dashboards & Polish** (1-2 semanas)
1. ✅ Dashboards por rol (Task 6.1-6.6)
2. ✅ UX improvements
3. ✅ Testing
4. ✅ Documentation

**Resultado:** Sistema production-ready

---

## 📋 Checklist de Prioridades AHORA MISMO

### **Bloqueo 1: Usuario Admin FAB funcional**
- [x] ✅ RLS policies corregidas
- [x] ✅ Login funcionando
- [x] ✅ Dashboard básico visible
- [ ] ❌ Ver usuarios pendientes
- [ ] ❌ Aprobar/rechazar usuarios
- [ ] ❌ Crear admin_asociacion

**Próxima acción:** Implementar Task 3.1 (Pending Users)

---

## 🎯 Métricas de Éxito

### Por Fase
- **Fase 1**: Admin_fab puede gestionar 100% de usuarios
- **Fase 2**: Admin puede crear y aprobar eventos
- **Fase 3**: Flujo inscripción completo end-to-end
- **Fase 4**: Dorsales y startlists generables
- **Fase 5**: Todos los dashboards funcionando
- **Fase 6**: Sistema production-ready

### Criterios de Completitud
✅ **Backend:**
- Todas las Server Actions creadas
- RLS policies validadas
- File upload funcionando

✅ **Frontend:**
- Todos los forms funcionando
- Validaciones en tiempo real
- Loading states everywhere

✅ **UX:**
- Navegación intuitiva
- Mensajes de error claros
- Confirmaciones en acciones críticas

---

## 📝 Notas Técnicas

### Stack Confirmado
- Next.js 15 (App Router)
- React 19
- TypeScript
- Supabase (Auth + DB + Storage)
- Prisma ORM
- Shadcn UI + Tailwind
- React Hook Form + Zod
- TanStack Query + Table

### Patrones de Código
```typescript
// Server Actions pattern
"use server"
export async function actionName() {
  const supabase = await createServerClient()
  // Verificar permisos
  // Ejecutar operación
  // Revalidar cache
  revalidatePath()
}

// Component pattern
"use client"
import { useQuery } from '@tanstack/react-query'

export function Component() {
  const { data, isLoading } = useQuery({
    queryKey: ['key'],
    queryFn: fetchFn
  })

  if (isLoading) return <Skeleton />
  return <DataTable />
}
```

---

**Última actualización:** 2025-10-25
**Próximo Sprint:** User Management Foundation (Task 3.1-3.4)
