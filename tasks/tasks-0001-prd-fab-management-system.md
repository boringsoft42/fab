# Task List: Sistema de Gestión Integral FAB

Generated from: `0001-prd-fab-management-system.md`

## Relevant Files

### Database & Schema
- `prisma/schema.prisma` - Main Prisma schema file (needs major expansion for FAB models)
- `prisma/migrations/` - Database migration files
- `prisma/migrations/00_fab_schema.sql` - **[CREATED]** Complete FAB database schema with tables, enums, triggers, RLS policies, and seed data for 9 asociaciones
- `docs/database-setup.md` - **[CREATED]** Step-by-step guide for executing the schema in Supabase (Dashboard or CLI methods)
- `scripts/seed-admin.ts` - Seed script for initial admin_fab user
- `scripts/seed-test-data.ts` - Test data seeding for development

### Authentication & Authorization
- `src/lib/supabase/client.ts` - Supabase client configuration (client-side)
- `src/lib/supabase/server.ts` - Supabase server client (with service role)
- `src/middleware.ts` - Next.js middleware for route protection and role checking
- `src/lib/auth/check-role.ts` - Role verification utilities
- `src/hooks/useUser.ts` - Custom hook for user data with role/estado
- `src/hooks/usePermissions.ts` - Hook for permission checks

### Validation Schemas
- `src/lib/validations/auth.ts` - Auth form validation schemas
- `src/lib/validations/atleta.ts` - **[CREATED]** Atleta validation schemas (100% Prisma aligned)
- `src/lib/validations/entrenador.ts` - **[CREATED]** Entrenador validation schemas (100% Prisma aligned)
- `src/lib/validations/juez.ts` - **[CREATED]** Juez validation schemas (100% Prisma aligned)
- `src/lib/categoria-fab-utils.ts` - **[CREATED]** FAB category calculation utility (8 age-based categories)
- `src/lib/validations/event.ts` - Event and prueba validation
- `src/lib/validations/inscription.ts` - Inscription validation

### Auth Pages & Components
- `src/app/(auth)/sign-up/page.tsx` - Public registration (atleta/entrenador/juez only)
- `src/app/(auth)/login/page.tsx` - Login for all roles
- `src/components/auth/sign-up-form.tsx` - Registration form component
- `src/components/auth/pending-account-banner.tsx` - Banner for users in "pendiente" state
- `src/components/auth/rejected-account-message.tsx` - Message for "rechazado" users

### User Management (Admin FAB)
- `src/app/(dashboard)/users/pending/page.tsx` - Pending user approvals
- `src/app/(dashboard)/users/pending/actions.ts` - Server Actions for approve/reject
- `src/app/(dashboard)/users/[userId]/page.tsx` - User detail and approval
- `src/app/(dashboard)/users/admins/page.tsx` - Admin asociacion management
- `src/app/(dashboard)/users/admins/new/page.tsx` - Create admin asociacion
- `src/app/(dashboard)/users/admins/actions.ts` - Server Actions for admin_asociacion management
- `src/components/users/pending-users-table.tsx` - Table component
- `src/components/users/user-detail-view.tsx` - User detail view
- `src/components/users/admin-asociacion-table.tsx` - Admin asociacion management table
- `src/components/users/create-admin-form.tsx` - Form to create admin_asociacion

### Profile Management
- `src/app/(dashboard)/profile/atleta/page.tsx` - **[CREATED]** Atleta profile form (multi-step)
- `src/app/(dashboard)/profile/entrenador/page.tsx` - **[CREATED]** Entrenador profile form
- `src/app/(dashboard)/profile/juez/page.tsx` - **[CREATED]** Juez profile form
- `src/app/(dashboard)/profile/page.tsx` - **[CREATED]** "Mi Perfil" with locked fields (view-only)
- `src/app/(dashboard)/profile/documents/page.tsx` - Document upload
- `src/components/profile/atleta-form.tsx` - **[CREATED]** Atleta form component (7-step with stepper)
- `src/components/profile/entrenador-form.tsx` - **[CREATED]** Entrenador form component (7-step)
- `src/components/profile/juez-form.tsx` - **[CREATED]** Juez form component (7-step with nivel_juez)
- `src/components/profile/actions.ts` - **[CREATED]** Profile creation and update Server Actions
- `src/components/profile/profile-view.tsx` - Read-only profile viewer
- `src/components/shared/document-upload.tsx` - **[CREATED]** File upload component with Supabase Storage integration

### Asociaciones
- `src/app/(dashboard)/associations/page.tsx` - Associations management
- `src/app/(dashboard)/associations/[id]/edit/page.tsx` - Edit association
- `src/components/associations/associations-table.tsx` - Table component

### Events & Pruebas
- `src/app/(dashboard)/events/page.tsx` - Events listing
- `src/app/(dashboard)/events/new/page.tsx` - Create event form
- `src/app/(dashboard)/events/[eventId]/page.tsx` - Event detail
- `src/app/(dashboard)/events/[eventId]/edit/page.tsx` - Edit event
- `src/app/(dashboard)/events/[eventId]/actions.ts` - Event state change actions
- `src/app/(dashboard)/events/[eventId]/pruebas/page.tsx` - Pruebas listing
- `src/app/(dashboard)/events/[eventId]/pruebas/new/page.tsx` - Create prueba
- `src/components/events/event-form.tsx` - Event form (multi-step)
- `src/components/events/events-table.tsx` - Events table
- `src/components/events/event-detail.tsx` - Event detail view
- `src/components/pruebas/prueba-form.tsx` - Prueba form
- `src/components/pruebas/pruebas-table.tsx` - Pruebas table

### Inscriptions
- `src/app/(dashboard)/inscripciones/page.tsx` - My inscriptions (atleta)
- `src/app/(dashboard)/inscripciones/new/page.tsx` - Create inscription
- `src/app/(dashboard)/inscripciones/pending/page.tsx` - Pending approvals (admin asociacion)
- `src/app/(dashboard)/inscripciones/summary/page.tsx` - Event summary for payments
- `src/components/inscripciones/inscription-form.tsx` - Inscription form
- `src/components/inscripciones/my-inscriptions-table.tsx` - Atleta's inscriptions table
- `src/components/inscripciones/pending-inscriptions-table.tsx` - Admin approval table
- `src/components/inscripciones/event-summary-card.tsx` - Event summary for payment calculation

### Payments
- `src/app/(dashboard)/pagos/new/page.tsx` - Register payment (admin asociacion)
- `src/app/(dashboard)/pagos/pending/page.tsx` - Verify payments (admin FAB)
- `src/app/(dashboard)/pagos/[pagoId]/page.tsx` - Payment detail
- `src/components/pagos/payment-form.tsx` - Payment registration form
- `src/components/pagos/pending-payments-table.tsx` - Payments verification table

### Dorsales
- `src/app/(dashboard)/dorsales/[eventId]/page.tsx` - Dorsal assignment
- `src/app/(dashboard)/dorsales/[eventId]/assigned/page.tsx` - Assigned dorsales view
- `src/components/dorsales/dorsal-assignment-table.tsx` - Assignment interface
- `src/components/dorsales/assigned-dorsals-table.tsx` - Assigned list

### Startlists
- `src/app/(dashboard)/startlists/[eventId]/[pruebaId]/page.tsx` - Startlists manager
- `src/app/(dashboard)/startlists/[eventId]/[pruebaId]/new/page.tsx` - Create startlist
- `src/app/(dashboard)/startlists/[eventId]/[pruebaId]/[startlistId]/edit/page.tsx` - Edit items
- `src/app/(dashboard)/startlists/[eventId]/[pruebaId]/[startlistId]/view/page.tsx` - View (read-only)
- `src/components/startlists/startlist-editor.tsx` - Drag-and-drop editor
- `src/components/startlists/startlist-view.tsx` - Presentation view
- `src/components/startlists/startlists-manager.tsx` - Startlists manager component

### Dashboards
- `src/app/(dashboard)/dashboard/page.tsx` - Router to role-specific dashboard
- `src/app/(dashboard)/dashboard/admin-fab/page.tsx` - Admin FAB dashboard
- `src/app/(dashboard)/dashboard/admin-asociacion/page.tsx` - Admin Asociacion dashboard
- `src/app/(dashboard)/dashboard/atleta-pending/page.tsx` - Atleta pending approval
- `src/app/(dashboard)/dashboard/atleta-activo/page.tsx` - Active atleta dashboard
- `src/app/(dashboard)/dashboard/entrenador-pending/page.tsx` - Entrenador pending approval
- `src/app/(dashboard)/dashboard/entrenador-activo/page.tsx` - Active entrenador dashboard
- `src/app/(dashboard)/dashboard/juez-pending/page.tsx` - Juez pending approval
- `src/app/(dashboard)/dashboard/juez-activo/page.tsx` - Active juez dashboard
- `src/components/dashboard/admin-fab-dashboard.tsx` - Admin FAB dashboard component
- `src/components/dashboard/admin-asociacion-dashboard.tsx` - Admin Asociacion dashboard component
- `src/components/dashboard/stats-card.tsx` - Statistics card component

### Shared UI Components
- `src/components/ui/data-table.tsx` - Reusable table with sorting/filtering/pagination
- `src/components/ui/data-table-toolbar.tsx` - Table toolbar
- `src/components/ui/data-table-pagination.tsx` - Pagination controls
- `src/components/ui/form-field.tsx` - Form field wrapper with locked field support
- `src/components/ui/status-badge.tsx` - Status badges with color variants
- `src/components/ui/file-upload.tsx` - File upload with Supabase Storage
- `src/components/ui/stepper.tsx` - Multi-step form stepper
- `src/components/ui/loading-spinner.tsx` - Loading spinner component
- `src/components/ui/skeleton-loader.tsx` - Skeleton loaders
- `src/components/ui/breadcrumb.tsx` - Breadcrumb navigation component

### Utilities & Helpers
- `src/lib/format-utils.ts` - Date, currency, CI formatting functions
- `src/lib/categoria-fab-utils.ts` - FAB category calculation (client-side)
- `src/lib/toast-utils.ts` - Toast notification helpers
- `src/hooks/useDebounce.ts` - Debounce hook for search inputs
- `src/lib/react-query-provider.tsx` - React Query configuration
- `src/lib/react-query-config.ts` - Query client config

### Storage Configuration
- Supabase Storage Buckets: `profile-photos/`, `documents/`, `event-logos/`
- RLS policies configured per bucket

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory)
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration
- Existing auth infrastructure can be leveraged and adapted for multi-role system
- Current Prisma schema needs significant expansion for FAB requirements
- Follow existing patterns: Server Actions in `actions.ts` files, API routes for complex operations
- All forms use React Hook Form + Zod validation (pattern already established)
- Supabase RLS policies handle data access control (defined in SQL migration)

## Tasks

- [x] 1.0 Database Schema Setup and Configuration
  - [x] 1.1 Execute FAB SQL schema in Supabase (create all tables, enums, triggers, RLS policies)
  - [x] 1.2 Update Prisma schema to reflect FAB database structure (introspect and adjust)
  - [x] 1.3 Generate Prisma client and verify all models are correctly typed
  - [x] 1.4 Configure Supabase Storage buckets (`profile-photos/`, `documents/`, `event-logos/`) with RLS
  - [x] 1.5 Create seed script for initial admin_fab user (`scripts/seed-admin.ts`)
  - [x] 1.6 Create seed script for test data (`scripts/seed-test-data.ts`) - 9 asociaciones, sample users, events

- [x] 2.0 Authentication System with Multi-Role Support
  - [x] 2.1 Update Supabase client configuration to support service role operations (`src/lib/supabase/server.ts`)
  - [x] 2.2 Create middleware for route protection and role-based access control (`src/middleware.ts`)
    - [x] 2.2.1 **[REQ-1.2.3, REQ-1.3.4]** Implement role-based redirects based on user rol + estado (admin_fab → admin dashboard, atleta+pendiente → pendiente dashboard, etc.)
    - [x] 2.2.2 **[REQ-1.3.6]** Block access for users with estado="rechazado" (redirect to login with error message)
    - [x] 2.2.3 **[REQ-1.3.5, REQ-1.1.7]** Allow login for estado="pendiente" users but restrict routes (only /dashboard/[role]-pending and /profile/edit)
  - [x] 2.3 Implement `useUser` hook that fetches user + role + estado + asociacion (`src/hooks/useUser.ts`)
    - [x] 2.3.1 **[REQ-1.3.1]** Include estado field in returned data (pendiente, activo, inactivo, rechazado)
  - [x] 2.4 Implement `usePermissions` hook with role checking helpers (`src/hooks/usePermissions.ts`)
  - [x] 2.5 **[REQ-1.1.1, REQ-1.1.2, REQ-10.2.1]** Update sign-up page to public registration - **ONLY show atleta/entrenador/juez options** (`src/app/(auth)/sign-up/page.tsx`)
    - [x] 2.5.1 **[REQ-1.1.2]** Ensure admin_fab and admin_asociacion are NOT visible as role options in the UI
    - [x] 2.5.2 **[REQ-1.1.3]** Collect email, password, rol (atleta/entrenador/juez), asociacion_id during registration
  - [x] 2.6 Create validation schemas for auth forms with rol and asociacion selection (`src/types/auth/sign-up.ts`)
  - [x] 2.7 **[REQ-1.1.4, REQ-1.1.5, REQ-1.1.6]** Implement Server Action for public registration (`src/app/actions/auth/register.ts`)
    - [x] 2.7.1 Create user in Supabase Auth
    - [x] 2.7.2 Create record in users table with estado="pendiente"
    - [ ] 2.7.3 Send notification to admin_fab (email or in-app) about new pending user
    - [ ] 2.7.4 Send confirmation email to user (account created but pending approval)
  - [x] 2.8 Update login page to handle all roles and redirect based on rol + estado (`src/app/(auth)/sign-in/page.tsx`)
    - [x] 2.8.1 **[REQ-1.3.6]** Implement login blocking for estado="rechazado" with explanatory message (show error: "Tu cuenta ha sido rechazada. Contacta a FAB para más información.")
    - [x] 2.8.2 **[REQ-1.3.5, REQ-1.1.7]** Allow login for estado="pendiente" but redirect to restricted dashboard (atleta-pending, entrenador-pending, etc.)
  - [x] 2.9 **[REQ-10.2.6]** Create persistent banner component for users with estado="pendiente" (`src/components/auth/pending-approval-banner.tsx`)
    - [x] 2.9.1 Display message: "Tu cuenta está en revisión. Serás notificado cuando sea aprobada."
    - [x] 2.9.2 Show in all pages while estado="pendiente"
  - [x] 2.10 **[REQ-1.3.6]** Create message component for rejected users explaining they cannot access (implemented in login page with Alert component)

- [ ] 3.0 User Management and Profile Systems
  - [x] 3.1 Create pending users page for admin_fab (`src/app/(dashboard)/users/pending/page.tsx`)
    - [x] 3.1.1 Build pending users table component with filters by rol, asociacion, fecha_registro (`src/components/users/pending-users-table.tsx`)
    - [x] 3.1.2 **[REQ-1.3.2, REQ-2.1.18, REQ-2.1.19]** Implement Server Actions for approve/reject user (`src/app/(dashboard)/users/pending/actions.ts`)
      - Approve: estado="activo", set aprobado_por_fab (user_id), fecha_aprobacion, observaciones (optional), send email notification
      - Reject: estado="rechazado", set observaciones (required), send email notification with motivo
    - [ ] 3.1.3 **[REQ-1.1.6]** Implement notification query/badge showing count of pending users for admin_fab dashboard
  - [x] 3.2 Create user detail page with approve/reject actions (`src/app/(dashboard)/users/[userId]/page.tsx`)
    - [x] 3.2.1 Build user detail view component showing all profile data (`src/components/users/user-detail-view.tsx`)
    - [x] 3.2.2 Implement confirmation dialogs for approve/reject with observaciones field
    - [x] 3.2.3 Implement estado change validations (e.g., can't approve if profile is incomplete)
  - [x] 3.3 Create admin_asociacion management page (`src/app/(dashboard)/users/admins/page.tsx`)
    - [x] 3.3.1 **[REQ-1.3.7]** Build admin_asociacion table with activate/deactivate toggle actions (`src/components/users/admin-asociacion-table.tsx`)
  - [x] 3.4 **[REQ-1.1.8, REQ-1.1.9]** Create form to create new admin_asociacion (`src/app/(dashboard)/users/admins/new/page.tsx`)
    - [x] 3.4.1 **[REQ-1.1.10]** Build form component with email, nombre, asociacion_id selection (`src/components/users/create-admin-form.tsx`)
    - [x] 3.4.2 **[REQ-1.1.11, REQ-1.1.12, REQ-1.3.3]** Implement Server Action that creates auth user + users record with estado="activo" (no approval needed) (`src/app/(dashboard)/users/admins/actions.ts`)
    - [ ] 3.4.3 **[REQ-1.1.11]** Send activation email with credentials or magic link
    - [ ] 3.4.4 **[REQ-1.1.11]** Implement password reset flow or magic link activation for new admin_asociacion
  - [x] 3.5 **[REQ-2.1.x]** Create atleta profile form (multi-step) (`src/app/(dashboard)/profile/atleta/page.tsx`)
    - [x] 3.5.1 Build 7-step form component with stepper (`src/components/profile/atleta-form.tsx`)
      - Step 1: Datos Personales (bloqueados si ya existen) - **[REQ-2.1.1, REQ-2.1.2]**
      - Step 2: Datos de Contacto - **[REQ-2.1.4, REQ-2.1.5]**
      - Step 3: Datos Federativos - **[REQ-2.1.6, REQ-2.1.7, REQ-2.1.8, REQ-2.1.9]**
      - Step 4: Datos Físicos y Deportivos - **[REQ-2.1.11, REQ-2.1.12]**
      - Step 5: Contacto de Emergencia - **[REQ-2.1.13]**
      - Step 6: Documentos - **[REQ-2.1.14, REQ-2.1.15, REQ-2.1.16]**
      - Step 7: Revisión y Envío - **[REQ-2.1.17]**
    - [x] 3.5.2 **[REQ-2.1.7, REQ-2.1.8]** Implement validation schema for atleta with municipio conditional logic (required ONLY if asociacion != "Santa Cruz") (`src/lib/validations/atleta.ts`)
    - [x] 3.5.3 **[REQ-2.1.9, REQ-2.1.10]** Implement categoria_fab calculation utility with auto-recalculation on fecha_nacimiento change (`src/lib/categoria-fab-utils.ts`)
      - Include all 8 categories: U8, U10, U14, U16, Menores, U20, U23, Mayores
      - Implement recalculation trigger when fecha_nacimiento changes
    - [x] 3.5.4 **[REQ-2.1.14, REQ-2.1.15, REQ-2.1.16]** Integrate document upload component for foto, CI frente/reverso, certificado médico, carnet vacunación (`src/components/shared/document-upload.tsx`)
    - [x] 3.5.5 Implement Server Action to save atleta profile to database (`src/components/profile/actions.ts`)
      - Validate all required fields per step
      - Apply municipio conditional validation
      - Calculate categoria_fab before saving
      - Upload files to Supabase Storage with proper RLS path structure
    - [ ] 3.5.6 **[REQ-2.4.4]** Implement API-level validation that REJECTS requests attempting to modify personal data fields (nombre, apellido, CI, fecha_nacimiento) once created
    - [ ] 3.5.7 **[REQ-2.1.3]** Implement admin_fab override functionality to edit personal data fields in exceptional cases
  - [x] 3.6 **[REQ-2.2.x]** Create entrenador profile form (`src/app/(dashboard)/profile/entrenador/page.tsx`)
    - [x] 3.6.1 Build form component adapted for entrenador professional fields (especialidad, anios_experiencia, certificaciones, titulos_deportivos) (`src/components/profile/entrenador-form.tsx`)
    - [x] 3.6.2 Implement validation schema for entrenador (`src/lib/validations/entrenador.ts`)
  - [x] 3.7 **[REQ-2.3.x]** Create juez profile form (`src/app/(dashboard)/profile/juez/page.tsx`)
    - [x] 3.7.1 Build form component adapted for juez with nivel_juez field (nacional/internacional) (`src/components/profile/juez-form.tsx`)
    - [x] 3.7.2 Implement validation schema for juez (`src/lib/validations/juez.ts`)
  - [x] 3.8 **[REQ-2.4.x]** Create "Mi Perfil" page with locked personal data fields (`src/app/(dashboard)/profile/page.tsx`)
    - [ ] 3.8.1 **[REQ-2.4.3]** Build form-field component with locked field indicator (candado icon + disabled + tooltip) (`src/components/ui/form-field.tsx`)
    - [ ] 3.8.2 **[REQ-2.4.4]** Implement Server Action that validates personal fields haven't changed (security check, reject if modified)
    - [ ] 3.8.3 **[REQ-10.2.5]** Implement breadcrumb navigation for profile completion flow
  - [ ] 3.9 Create document upload/replacement page (`src/app/(dashboard)/profile/documents/page.tsx`)
    - [ ] 3.9.1 **[REQ-2.1.16]** Build file upload component with Supabase Storage integration (`src/components/ui/file-upload.tsx`)
    - [ ] 3.9.2 Implement preview and replace functionality for documents
  - [ ] 3.10 Create read-only profile viewer component for admin use (`src/components/profile/profile-view.tsx`)
  - [ ] 3.11 **[REQ-1.3.7]** Implement admin_fab ability to activate/deactivate admin_asociacion accounts
    - [ ] 3.11.1 Add toggle button in admin_asociacion table
    - [ ] 3.11.2 Implement Server Action to change estado (activo ↔ inactivo)
  - [x] 3.12 Implement validation schemas as separate task deliverables
    - [x] 3.12.1 Create atleta validation schema (`src/lib/validations/atleta.ts`)
    - [x] 3.12.2 Create entrenador validation schema (`src/lib/validations/entrenador.ts`)
    - [x] 3.12.3 Create juez validation schema (`src/lib/validations/juez.ts`)
    - [ ] 3.12.4 Create user management validation schemas (`src/lib/validations/users.ts`)

- [x] 3.5 Asociaciones Management (Admin FAB Only)
  - [x] 3.5.1 **[REQ-3.1.1, REQ-3.1.2]** Create asociaciones management page (`src/app/(dashboard)/associations/page.tsx`)
    - [x] 3.5.1.1 Build table showing all 9 asociaciones departamentales (La Paz, Cochabamba, Santa Cruz, Chuquisaca, Tarija, Oruro, Potosí, Beni, Pando)
    - [x] 3.5.1.2 Implement filters by departamento, estado (activo/inactivo)
    - [x] 3.5.1.3 **[REQ-3.1.3]** Restrict access to admin_fab only (RLS + UI check)
  - [x] 3.5.2 **[REQ-3.1.2]** Create asociación edit form (`src/app/(dashboard)/associations/[id]/edit/page.tsx`)
    - [x] 3.5.2.1 Build form with fields: nombre, departamento, ciudad, contacto, email, teléfono, estado
    - [x] 3.5.2.2 Implement validation schema for asociación data
    - [x] 3.5.2.3 Implement Server Action to update asociación (`src/app/(dashboard)/associations/actions.ts`)
  - [x] 3.5.3 **[REQ-3.1.4]** Verify all users are linked to exactly one asociación (data integrity check)
    - [x] 3.5.3.1 Create utility to validate asociacion_id foreign key references
    - [x] 3.5.3.2 Implement constraint that prevents deleting asociación if it has linked users

- [ ] 4.0 Events, Pruebas, and Inscriptions Management
  - [ ] 4.1 **[REQ-9.2.3]** Create events listing page with role-based filtering (`src/app/(dashboard)/events/page.tsx`)
    - [ ] 4.1.1 Build events table component with filters by tipo, estado, fecha (`src/components/events/events-table.tsx`)
    - [ ] 4.1.2 **[REQ-9.2.3]** Implement Server Action to fetch events with RLS-based filtering (admin_fab sees all, admin_asociacion sees only their asociacion, others see only "aprobado")
  - [ ] 4.2 **[REQ-4.1.x]** Create event creation form (multi-step) (`src/app/(dashboard)/events/new/page.tsx`)
    - [ ] 4.2.1 Build 5-step event form: básico, ubicación, reglas, financiero (conditional), organización (`src/components/events/event-form.tsx`)
      - Step 1: Información Básica - **[REQ-4.1.5]** nombre, descripción, tipo (federativo/asociacion), logo_url
      - Step 2: Ubicación - **[REQ-4.1.5]** ciudad, lugar, dirección
      - Step 3: Calendario y Reglas - **[REQ-4.1.5]** fecha_evento, hora_inicio/fin, fecha_insc_inicio/fin, limite_participantes, limite_por_prueba, limite_por_asociacion, edad_minima/maxima, genero_permitido
      - Step 4: Financiero (ONLY if tipo="federativo") - **[REQ-4.1.3]** costo_fab, costo_por_atleta, banco, numero_cuenta, titular_cuenta, qr_pago_url
      - Step 5: Organización - **[REQ-4.1.5]** director_tecnico, jefe_competencia, comisario
    - [ ] 4.2.2 **[REQ-4.1.3, REQ-4.1.4]** Implement validation schema with conditional required fields (`src/lib/validations/event.ts`)
      - For tipo="federativo": costo_fab, banco, numero_cuenta, titular_cuenta are REQUIRED
      - For tipo="asociacion": financial fields are NOT required
      - costo_por_atleta is optional even for federativo events
    - [ ] 4.2.3 Integrate logo and QR payment upload to Supabase Storage (bucket: `event-logos/`)
    - [ ] 4.2.4 **[REQ-4.2.2]** Implement Server Action to create event with estado="borrador" (`src/app/(dashboard)/events/actions.ts`)
      - Record asociacion_creadora_id, creado_por_user (user_id), creado_por_rol
  - [ ] 4.3 Create event detail page (`src/app/(dashboard)/events/[eventId]/page.tsx`)
    - [ ] 4.3.1 Build event detail component showing all sections (`src/components/events/event-detail.tsx`)
    - [ ] 4.3.2 **[REQ-4.2.2, REQ-4.3.1]** Implement action buttons based on rol (aprobar/rechazar for admin_fab, enviar a revisión for admin_asociacion)
  - [ ] 4.4 **[REQ-4.2.2]** Implement event state change Server Actions (aprobar, rechazar, enviar a revisión) (`src/app/(dashboard)/events/[eventId]/actions.ts`)
    - [ ] 4.4.1 Implement Server Action for "enviar a revisión" (admin_asociacion only)
      - Change estado: borrador → en_revision
      - Validate all required fields are complete before allowing submission
    - [ ] 4.4.2 Implement Server Action for "aprobar" (admin_fab only)
      - Change estado: en_revision → aprobado
      - Record fecha_aprobacion, aprobado_por (user_id)
    - [ ] 4.4.3 Implement Server Action for "rechazar" (admin_fab only)
      - Change estado: en_revision → rechazado
      - Require observaciones field (motivo del rechazo)
      - Record fecha_rechazo, rechazado_por (user_id), observaciones
    - [ ] 4.4.4 **[REQ-4.2.3]** Implement validation that ONLY events with estado="aprobado" can receive inscriptions
  - [ ] 4.5 Create event edit page reusing event form in edit mode (`src/app/(dashboard)/events/[eventId]/edit/page.tsx`)
  - [ ] 4.6 Create pruebas listing page for an event (`src/app/(dashboard)/events/[eventId]/pruebas/page.tsx`)
    - [ ] 4.6.1 Build pruebas table with technical details (carriles, categoría, género) (`src/components/pruebas/pruebas-table.tsx`)
  - [ ] 4.7 **[REQ-5.1.x, REQ-5.2.x]** Create prueba creation form (`src/app/(dashboard)/events/[eventId]/pruebas/new/page.tsx`)
    - [ ] 4.7.1 Build form with 4 sections: básico, técnico, límites, horario (`src/components/pruebas/prueba-form.tsx`)
    - [ ] 4.7.2 **[REQ-5.2.1]** Implement validation with conditional numero_carriles requirement (if es_con_carriles=true, numero_carriles is required and >0)
    - [ ] 4.7.3 Implement Server Action to create prueba
  - [ ] 4.8 Create prueba edit page reusing form component
  - [ ] 4.9 **[REQ-6.1.x]** Create inscription form for atleta (`src/app/(dashboard)/inscripciones/new/page.tsx`)
    - [ ] 4.9.1 Build form showing event info and prueba selection with checkboxes (`src/components/inscripciones/inscription-form.tsx`)
    - [ ] 4.9.2 **[REQ-6.1.5]** Implement validation before allowing inscription:
      - [ ] 4.9.2.1 Fecha actual within fecha_insc_inicio and fecha_insc_fin
      - [ ] 4.9.2.2 Check limits: limite_participantes, limite_por_prueba, limite_por_asociacion (reject if exceeded)
      - [ ] 4.9.2.3 Edad del atleta within edad_minima and edad_maxima of prueba
      - [ ] 4.9.2.4 Género del atleta matches genero_permitido of prueba
    - [ ] 4.9.3 **[REQ-6.1.4]** Implement Server Action to create inscriptions with estado_asociacion="pendiente", estado_fab="pendiente"
  - [ ] 4.10 Create "Mis Inscripciones" page for atleta (`src/app/(dashboard)/inscripciones/page.tsx`)
    - [ ] 4.10.1 Build table showing inscriptions with estado_asociacion, estado_fab, dorsal (`src/components/inscripciones/my-inscriptions-table.tsx`)
  - [ ] 4.11 **[REQ-6.2.x]** Create pending inscriptions page for admin_asociacion (`src/app/(dashboard)/inscripciones/pending/page.tsx`)
    - [ ] 4.11.1 Build table grouped by event with bulk approve checkbox (`src/components/inscripciones/pending-inscriptions-table.tsx`)
    - [ ] 4.11.2 **[REQ-6.2.2, REQ-6.2.3]** Implement Server Actions:
      - Approve (bulk): estado_asociacion="aprobada", record aprobado_por_asociacion (user_id), fecha_aprobacion_asociacion
      - Reject (single): estado_asociacion="rechazada", record motivo_rechazo (required)
  - [ ] 4.12 **[REQ-6.3.1, REQ-6.3.2]** Create inscriptions summary page by event for payment calculation (`src/app/(dashboard)/inscripciones/summary/page.tsx`)
    - [ ] 4.12.1 Build event summary cards showing cantidad atletas aprobados + monto a pagar (`src/components/inscripciones/event-summary-card.tsx`)
    - [ ] 4.12.2 **[REQ-6.3.2]** Implement automatic monto calculation logic:
      - If evento has costo_por_atleta: monto = cantidad_atletas_aprobados × costo_por_atleta
      - Else: monto = costo_fab (fixed per asociación)

- [ ] 5.0 Payments, Dorsales, and Startlists
  - [ ] 5.1 **[REQ-6.3.3]** Create payment registration form for admin_asociacion (`src/app/(dashboard)/pagos/new/page.tsx`)
    - [ ] 5.1.1 Build form with monto (auto-calculated or manual), metodo_pago, fecha_pago, comprobante upload (`src/components/pagos/payment-form.tsx`)
    - [ ] 5.1.2 **[REQ-6.3.3]** Implement Server Action to save payment with estado_pago="pendiente"
  - [ ] 5.2 **[REQ-6.4.x]** Create pending payments page for admin_fab (`src/app/(dashboard)/pagos/pending/page.tsx`)
    - [ ] 5.2.1 Build table with comprobante preview and verificar/observar actions (`src/components/pagos/pending-payments-table.tsx`)
    - [ ] 5.2.2 **[REQ-6.4.2, REQ-6.4.3, REQ-6.4.4]** Implement Server Actions:
      - Verify: estado_pago="verificado", record verificado_por (user_id), fecha_verificacion, **update inscripciones.pago_verificado=true** for all inscriptions of this asociacion+event
      - Observe: estado_pago="observado", record observaciones (required)
  - [ ] 5.3 Create payment detail page showing full info + comprobante (`src/app/(dashboard)/pagos/[pagoId]/page.tsx`)
  - [ ] 5.4 **[REQ-7.1.x, REQ-7.2.x]** Create dorsal assignment page for admin_fab (`src/app/(dashboard)/dorsales/[eventId]/page.tsx`)
    - [ ] 5.4.0 **[REQ-7.1.1]** Implement validation that dorsales can ONLY be assigned to inscriptions with:
      - estado_fab="aprobada"
      - For tipo_evento="federativo": pago_verificado=true
      - For tipo_evento="asociacion": no payment requirement
    - [ ] 5.4.1 **[REQ-7.1.4]** Build table showing eligible atletas with dorsal input field (`src/components/dorsales/dorsal-assignment-table.tsx`)
    - [ ] 5.4.2 **[REQ-7.1.2]** Implement real-time validation: no duplicate dorsales within the same event
    - [ ] 5.4.3 **[REQ-7.1.4, REQ-7.2.4]** Implement Server Action for manual assignment:
      - Create dorsal record with evento_id, atleta_id, numero (unique), fecha_asignacion, asignado_por (user_id), estado="activo"
      - Update inscription record with dorsal_asignado, fecha_asignacion_dorsal, dorsal_asignado_por
    - [ ] 5.4.4 **[REQ-7.2.2]** Implement Server Action for automatic sequential assignment (assign next available number)
  - [ ] 5.5 Create assigned dorsales view page (`src/app/(dashboard)/dorsales/[eventId]/assigned/page.tsx`)
    - [ ] 5.5.1 Build table showing all assigned dorsales with search/filter (`src/components/dorsales/assigned-dorsals-table.tsx`)
    - [ ] 5.5.2 **[REQ-7.2.3]** Implement dorsal deactivation functionality (admin_fab only)
      - Add "Desactivar" action button in table
      - Implement Server Action to change dorsal estado: activo → inactivo
      - Implement confirmation dialog explaining consequences (atleta won't be able to compete)
      - Record fecha_desactivacion, desactivado_por (user_id), motivo (optional)
  - [ ] 5.6 **[REQ-8.1.x]** Create startlists manager page for a prueba (`src/app/(dashboard)/startlists/[eventId]/[pruebaId]/page.tsx`)
    - [ ] 5.6.1 Build component listing existing startlists with create/edit/finalize buttons (`src/components/startlists/startlists-manager.tsx`)
  - [ ] 5.7 **[REQ-8.1.2, REQ-8.1.3]** Create startlist creation form (`src/app/(dashboard)/startlists/[eventId]/[pruebaId]/new/page.tsx`)
    - [ ] 5.7.1 Build simple form: nombre, tipo (serie/lista), índice, numero_carriles (if applicable)
    - [ ] 5.7.2 **[REQ-8.4.1]** Implement Server Action to create startlist with estado="borrador"
  - [ ] 5.8 **[REQ-8.2.x, REQ-8.3.x]** Create startlist items editor with drag-and-drop (`src/app/(dashboard)/startlists/[eventId]/[pruebaId]/[startlistId]/edit/page.tsx`)
    - [ ] 5.8.1 Build drag-and-drop or table-based editor for assigning atletas to carriles/orden (`src/components/startlists/startlist-editor.tsx`)
    - [ ] 5.8.2 Implement athlete selector with search and filters
      - Show only atletas with dorsales assigned for this event
      - Display dorsal number, nombre_completo, asociacion for selection
    - [ ] 5.8.3 **[REQ-8.3.1, REQ-8.3.2, REQ-8.3.3]** Implement validation:
      - If prueba is es_con_carriles=true: all items must have carril, carriles must be unique, carriles in range [1..numero_carriles]
      - Orden must be unique within each startlist
      - Only dorsales with estado="activo" can be included
    - [ ] 5.8.4 **[REQ-8.2.2, REQ-8.2.3]** Implement Server Action to save items (replaces all existing items in transaction)
      - For each item, record: startlist_id, dorsal_id, atleta_id, carril (if applicable), posicion_salida (optional), orden, semilla (optional)
      - Denormalize data for presentation: nombre_completo, apellido_completo, asociacion_nombre, categoria_atleta
      - This denormalized data ensures startlist remains readable even if atleta profile changes
    - [ ] 5.8.5 **[REQ-8.4.2, REQ-8.4.3]** Implement Server Action to finalize startlist
      - Change estado: borrador → finalizada
      - Once finalizada, startlist becomes read-only (no more edits allowed)
      - Record fecha_finalizacion, finalizado_por (user_id)
  - [ ] 5.9 **[REQ-8.4.4]** Create read-only startlist view for presentation/print (`src/app/(dashboard)/startlists/[eventId]/[pruebaId]/[startlistId]/view/page.tsx`)
    - [ ] 5.9.1 Build visual presentation component (table with carriles or ordered list) (`src/components/startlists/startlist-view.tsx`)

- [ ] 6.0 Role-Based Dashboards and UI Components
  - [ ] 6.1 Create dashboard router that redirects to role-specific dashboard based on rol + estado (`src/app/(dashboard)/dashboard/page.tsx`)
    - [ ] 6.1.1 Implement server-side logic to fetch user rol + estado
    - [ ] 6.1.2 Redirect logic:
      - admin_fab + activo → /dashboard/admin-fab
      - admin_asociacion + activo → /dashboard/admin-asociacion
      - atleta + pendiente → /dashboard/atleta-pending
      - atleta + activo → /dashboard/atleta-activo
      - entrenador + pendiente → /dashboard/entrenador-pending
      - entrenador + activo → /dashboard/entrenador-activo
      - juez + pendiente → /dashboard/juez-pending
      - juez + activo → /dashboard/juez-activo
  - [ ] 6.2 **[REQ-10.5.1]** Create admin_fab dashboard (`src/app/(dashboard)/dashboard/admin-fab/page.tsx`)
    - [ ] 6.2.1 Build dashboard component with metrics cards and quick actions (`src/components/dashboard/admin-fab-dashboard.tsx`)
    - [ ] 6.2.2 **[COMPLETED]** Implement stats card component reusable across dashboards (`src/components/dashboard/stats-card.tsx`)
    - [ ] 6.2.3 Fetch and display global metrics:
      - Total users by rol (admin_fab, admin_asociacion, atleta, entrenador, juez)
      - Pending users (public registration) requiring approval
      - Pending payments requiring verification
      - Active events by tipo (federativo, asociacion)
      - Admin_asociacion count (active vs inactive)
  - [ ] 6.3 **[REQ-10.5.1]** Create admin_asociacion dashboard (`src/app/(dashboard)/dashboard/admin-asociacion/page.tsx`)
    - [ ] 6.3.1 Build dashboard showing asociacion-specific metrics (`src/components/dashboard/admin-asociacion-dashboard.tsx`)
    - [ ] 6.3.2 Show pending inscriptions count and payment status for events
  - [ ] 6.4 **[REQ-10.5.1]** Create atleta pending dashboard (`src/app/(dashboard)/dashboard/atleta-pending/page.tsx`)
    - [ ] 6.4.1 Build simple view with "cuenta en revisión" message and profile completion CTA
    - [ ] 6.4.2 **[REQ-1.3.5]** Show profile completion progress indicator
  - [ ] 6.5 **[REQ-10.5.1]** Create atleta active dashboard (`src/app/(dashboard)/dashboard/atleta-activo/page.tsx`)
    - [ ] 6.5.1 Build dashboard showing próximos eventos, mis inscripciones summary, dorsales asignados
  - [ ] 6.6 Create entrenador/juez dashboards (pending and active variants)
    - [ ] 6.6.1 Create entrenador pending dashboard (`src/app/(dashboard)/dashboard/entrenador-pending/page.tsx`)
    - [ ] 6.6.2 Create entrenador active dashboard (`src/app/(dashboard)/dashboard/entrenador-activo/page.tsx`)
    - [ ] 6.6.3 Create juez pending dashboard (`src/app/(dashboard)/dashboard/juez-pending/page.tsx`)
    - [ ] 6.6.4 Create juez active dashboard (`src/app/(dashboard)/dashboard/juez-activo/page.tsx`)
  - [ ] 6.7 Create reusable DataTable component with TanStack Table (`src/components/ui/data-table.tsx`)
    - [ ] 6.7.1 Implement toolbar with search and filters (`src/components/ui/data-table-toolbar.tsx`)
    - [ ] 6.7.2 Implement pagination controls (`src/components/ui/data-table-pagination.tsx`)
    - [ ] 6.7.3 Add sorting, filtering, row selection features
  - [ ] 6.8 **[Design Considerations - Paleta de colores]** Create StatusBadge component with exact color variants (`src/components/ui/status-badge.tsx`)
    - Verde: aprobado, activo, verificado
    - Amarillo/Naranja: pendiente, en revisión
    - Rojo: rechazado, observado, inactivo
    - Azul: información, links
  - [ ] 6.9 **[REQ-10.3.4]** Create Stepper component for multi-step forms (`src/components/ui/stepper.tsx`)
  - [ ] 6.10 Create LoadingSpinner and SkeletonLoader components (`src/components/ui/loading-spinner.tsx`, `skeleton-loader.tsx`)
  - [ ] 6.11 **[REQ-10.1.3]** Configure toast notification helpers (`src/lib/toast-utils.ts`)
  - [ ] 6.12 **[REQ-10.2.5]** Create Breadcrumb component for multi-step flows (`src/components/ui/breadcrumb.tsx`)

- [ ] 7.0 Integration, Testing, and Deployment
  - [ ] 7.1 Create formatting utility functions (date, currency, CI, phone) (`src/lib/format-utils.ts`)
  - [ ] 7.2 Create useDebounce hook for search inputs (`src/hooks/useDebounce.ts`)
  - [ ] 7.3 Configure React Query with optimized defaults (`src/lib/react-query-provider.tsx`)
  - [ ] 7.4 Update sidebar navigation data to include FAB-specific routes (`src/components/sidebar/data/sidebar-data.ts`)
    - [ ] 7.4.1 Define sidebar items for each rol (admin_fab, admin_asociacion, atleta, entrenador, juez)
    - [ ] 7.4.2 Implement rol-based sidebar filtering in layout component
  - [ ] 7.5 **[REQ-11.x]** Implement Email Notification System
    - [ ] 7.5.1 Configure email service (Resend, SendGrid, or Supabase Auth emails)
    - [ ] 7.5.2 Create email templates directory (`src/emails/`)
    - [ ] 7.5.3 **[REQ-1.1.6]** Create email template for new user pending approval notification (to admin_fab)
    - [ ] 7.5.4 **[REQ-2.7.4]** Create email template for user account created (to user - "cuenta en revisión")
    - [ ] 7.5.5 Create email template for user account approved (to user - "cuenta activada")
    - [ ] 7.5.6 Create email template for user account rejected (to user - with motivo)
    - [ ] 7.5.7 **[REQ-3.4.3]** Create email template for admin_asociacion activation (with credentials or magic link)
    - [ ] 7.5.8 Create email template for inscription approved by asociación (to atleta)
    - [ ] 7.5.9 Create email template for inscription approved by FAB (to atleta)
    - [ ] 7.5.10 Create email template for dorsal assigned (to atleta)
    - [ ] 7.5.11 Integrate email sending in all relevant Server Actions
  - [ ] 7.6 **[REQ-9.x]** RLS Policy Testing and Verification
    - [ ] 7.6.1 **[REQ-9.1.1]** Verify RLS is enabled on ALL tables (users, atletas, entrenadores, jueces, eventos, pruebas, inscripciones, pagos, dorsales, startlists, asociaciones)
    - [ ] 7.6.2 **[REQ-9.2.1]** Test users table RLS:
      - Test atleta can read own profile only
      - Test admin_fab can read all users
      - Test admin_asociacion can read users from their asociación only
      - Test atleta CANNOT read other users
    - [ ] 7.6.3 **[REQ-9.2.3]** Test eventos table RLS:
      - Test admin_fab can read all events
      - Test admin_asociacion can read only their asociación's events
      - Test atleta can read only events with estado="aprobado"
      - Test atleta CANNOT read events in estado="borrador" or "en_revision"
    - [ ] 7.6.4 **[REQ-9.2.5]** Test inscripciones table RLS:
      - Test atleta can read only their own inscriptions
      - Test admin_asociacion can read inscriptions from their asociación
      - Test admin_fab can read all inscriptions
      - Test atleta CANNOT read other atletas' inscriptions
    - [ ] 7.6.5 **[REQ-9.2.7]** Test dorsales table RLS:
      - Test atleta can read only their own dorsal
      - Test admin_asociacion can read dorsales from their asociación
      - Test admin_fab can read all dorsales
    - [ ] 7.6.6 **[REQ-9.2.8]** Test dorsales write permissions:
      - Test ONLY admin_fab can create/update dorsales
      - Test admin_asociacion CANNOT create dorsales
      - Test atleta CANNOT create dorsales
    - [ ] 7.6.7 **[REQ-9.2.9, REQ-9.2.10]** Test pagos table RLS:
      - Test admin_asociacion can read only their asociación's pagos
      - Test admin_asociacion can create/update pagos but CANNOT set estado_pago="verificado"
      - Test admin_fab can read all pagos and can verify them
    - [ ] 7.6.8 **[REQ-2.1.16]** Test Supabase Storage RLS:
      - Test user can upload to their own path only (profile-photos/{user_id}/, documents/{user_id}/)
      - Test user CANNOT access other users' documents
      - Test admin_fab can access all documents
    - [ ] 7.6.9 Create automated RLS test suite using Supabase client with different user roles
  - [ ] 7.7 Test complete user flows end-to-end:
    - [ ] 7.7.1 **[Appendix D.1]** Public registration (atleta) → approval by admin_fab → profile completion → estado="activo"
    - [ ] 7.7.2 **[Appendix E, F]** Event creation → prueba creation → inscription → approval by asociacion → payment → verification by FAB → dorsal assignment → startlist creation
    - [ ] 7.7.3 **[Appendix D.2]** Admin_fab creates admin_asociacion → activation email/link → first login password change
    - [ ] 7.7.4 **[REQ-1.3.6]** Rejected user flow (user registers → admin_fab rejects → user tries to login → blocked with message)
    - [ ] 7.7.5 **[REQ-1.3.5, REQ-1.1.7]** Pendiente user restricted access (user registers → logs in with estado="pendiente" → sees limited UI + banner + can complete profile only)
    - [ ] 7.7.6 Test evento de asociación flow (no payment required): event creation → inscription → approval by admin_asociacion → dorsal assignment (by admin_asociacion)
    - [ ] 7.7.7 Test evento federativo flow (with payment): same as 7.7.2 with full payment verification by admin_fab
  - [ ] 7.8 Create `.env.example` with all required Supabase variables documented
  - [ ] 7.9 Write deployment documentation (`docs/deployment.md`)
  - [ ] 7.10 Write user guides by role (`docs/user-guide-*.md`)
    - [ ] 7.10.1 Admin FAB user guide
    - [ ] 7.10.2 Admin Asociación user guide
    - [ ] 7.10.3 Atleta user guide
    - [ ] 7.10.4 Entrenador user guide
    - [ ] 7.10.5 Juez user guide
  - [ ] 7.11 Configure Vercel deployment with environment variables
  - [ ] 7.12 Perform production deployment and smoke testing
  - [ ] 7.13 Verify all Server Actions have proper error handling and logging

---

## Analysis Summary

**Current State (✅ COMPLETED):**
- ✅ Next.js 15 with App Router
- ✅ Supabase Auth integration with multi-role support
- ✅ Prisma ORM configured
- ✅ Shadcn UI components library
- ✅ React Hook Form + Zod validation
- ✅ TanStack Query for data fetching
- ✅ Complete FAB SQL schema created and executed (Task 1.0 completed)
- ✅ Public registration flow implemented (atleta/entrenador/juez only)
- ✅ Estado-based middleware and route protection
- ✅ Role-based authentication with 5 roles (admin_fab, admin_asociacion, atleta, entrenador, juez)
- ✅ 4 estados implemented (pendiente, activo, inactivo, rechazado)
- ✅ Basic UI components (StatusBadge, LoadingSpinner, SkeletonLoader, DataTable, StatsCard)
- ✅ Dashboard layout with sidebar
- ✅ Admin FAB dashboard (simplified version)
- ✅ Pending approval banner for users with estado="pendiente"
- ✅ Login blocking for users with estado="rechazado"

**Remaining Tasks (📋 TO BE COMPLETED - 100% PRD Coverage):**
- 📋 **Section 3.0**: User Management and Profile Systems
  - Admin panel for user approvals (3.1-3.2)
  - Admin asociación creation and management (3.3-3.4)
  - Atleta/Entrenador/Juez profile forms with locked personal fields (3.5-3.7)
  - "Mi Perfil" with locked field UI (3.8)
  - Document upload to Supabase Storage (3.9)
  - Asociaciones management (3.5 subsection - COMPLETELY NEW)
  - Validation schemas as deliverables (3.12 - NEW)
- 📋 **Section 4.0**: Events, Pruebas, and Inscriptions
  - Events listing with role-based filtering (4.1)
  - Event creation form (multi-step) with financial section (4.2)
  - Event detail and state changes (4.3-4.4)
  - Pruebas creation and management (4.6-4.8)
  - Inscription flow for atletas (4.9-4.10)
  - Pending inscriptions approval by admin_asociacion (4.11)
  - Event summary for payment calculation (4.12)
- 📋 **Section 5.0**: Payments, Dorsales, and Startlists
  - Payment registration and verification (5.1-5.3)
  - Dorsal assignment with uniqueness validation (5.4-5.5)
  - Dorsal deactivation functionality (5.5.2 - NEW)
  - Startlists creation with drag-and-drop editor (5.6-5.8)
  - Startlist denormalized data handling (5.8.4 - ENHANCED)
  - Read-only startlist view (5.9)
- 📋 **Section 6.0**: Role-Based Dashboards (8 variants)
  - Dashboard router with estado logic (6.1 - ENHANCED)
  - Admin FAB dashboard with real metrics (6.2.3 - ENHANCED)
  - Admin Asociación dashboard (6.3)
  - 6 pending/active dashboards for atleta/entrenador/juez (6.4-6.6)
- 📋 **Section 7.0**: Integration, Testing, and Deployment
  - Email notification system (7.5 - COMPLETELY NEW)
  - RLS policy testing suite (7.6 - COMPLETELY NEW)
  - End-to-end user flow testing (7.7 - ENHANCED)
  - Documentation and deployment (7.8-7.13)

**Technical Approach:**
- Expand Prisma schema via introspection from executed SQL
- Adapt existing auth to support 5 roles + 4 estados with middleware-based route protection
- Implement two distinct registration flows (public vs admin creation)
- Build on existing Shadcn components with custom locked field patterns
- Leverage React Hook Form patterns already in codebase
- Use TanStack Query for server state with optimistic updates
- Implement RLS enforcement via Supabase policies (already defined in SQL)
- Create reusable form components with estado-aware rendering
- Implement automatic categoria_fab calculation triggers (already in SQL, need client-side utility)

**Key PRD Requirements Mapping:**
- **REQ-1.1.x**: Public registration flow (atleta/entrenador/juez only) vs admin creation (admin_asociacion)
- **REQ-1.2.x**: 5 roles + role hierarchy enforcement
- **REQ-1.3.x**: 4 estados + estado-based access control
- **REQ-2.x**: Profile management with locked personal data fields
- **REQ-3.x**: Asociaciones management (9 departamentos)
- **REQ-4.x - REQ-8.x**: Event management workflows (creation, inscriptions, payments, dorsales, startlists)
- **REQ-9.x**: RLS policies enforcement
- **REQ-10.x**: UI requirements (breadcrumbs, locked fields, status badges, persistent banners)
- **REQ-11.x**: Email notifications (new)

---

## Update Log: 100% PRD Coverage Achieved

**Date:** 2025-10-25

**Changes Made to Achieve 100% Coverage:**

### 1. Added Complete Asociaciones Management Section (Section 3.5)
- **Missing from original**: Entire asociaciones CRUD system
- **Added tasks**: 3.5.1 - 3.5.3
- **Covers**: REQ-3.1.1, REQ-3.1.2, REQ-3.1.3, REQ-3.1.4
- **Details**: Management page for 9 departamentos, edit forms, RLS enforcement, data integrity checks

### 2. Added Email Notification System (Section 7.5)
- **Missing from original**: All email integrations
- **Added tasks**: 7.5.1 - 7.5.11
- **Covers**: REQ-1.1.6, REQ-2.7.3, REQ-2.7.4, REQ-3.4.3, REQ-11.x
- **Details**: Email service configuration, 10 email templates, integration with Server Actions

### 3. Added Comprehensive RLS Testing Suite (Section 7.6)
- **Missing from original**: Systematic RLS verification
- **Added tasks**: 7.6.1 - 7.6.9
- **Covers**: REQ-9.1.1, REQ-9.2.1 through REQ-9.2.12
- **Details**: Test plans for ALL tables, Supabase Storage RLS, automated test suite

### 4. Enhanced Event Management Tasks
- **Enhanced**: Tasks 4.2.1, 4.2.2, 4.4.1-4.4.4
- **Added**: Detailed financial section breakdown, event rejection flow with observaciones
- **Covers**: REQ-4.1.3, REQ-4.1.4, REQ-4.1.5, REQ-4.2.2, REQ-4.2.3

### 5. Added Dorsal Deactivation Functionality (Task 5.5.2)
- **Missing from original**: Dorsal estado management beyond assignment
- **Added task**: 5.5.2
- **Covers**: REQ-7.2.3
- **Details**: Deactivation flow, confirmation dialogs, audit trail

### 6. Enhanced Startlist Denormalized Data Handling (Task 5.8.4)
- **Enhanced**: Task 5.8.4 with detailed implementation notes
- **Covers**: REQ-8.2.3
- **Details**: Explicit denormalization strategy for nombre_completo, asociacion_nombre, categoria_atleta

### 7. Added Validation Schemas as Deliverables (Section 3.12)
- **Missing from original**: Explicit validation schema tasks
- **Added tasks**: 3.12.1 - 3.12.4
- **Covers**: All profile validation requirements
- **Details**: Separate schema files for atleta, entrenador, juez, users

### 8. Enhanced Profile Management Tasks
- **Enhanced**: Tasks 3.1.2, 3.5.1-3.5.7
- **Added**: Admin FAB override functionality, categoria_fab recalculation, municipio conditional logic details
- **Covers**: REQ-2.1.3, REQ-2.1.7, REQ-2.1.8, REQ-2.1.9, REQ-2.1.10

### 9. Enhanced Dashboard Router (Task 6.1)
- **Enhanced**: Task 6.1 with detailed estado-based routing logic
- **Added**: Tasks 6.1.1, 6.1.2 with 8 redirect scenarios
- **Covers**: REQ-1.2.3, REQ-1.3.4, REQ-10.5.1

### 10. Added User Flow Testing (Section 7.7)
- **Enhanced**: Tasks 7.7.1 - 7.7.7
- **Added**: Two additional flows (7.7.6, 7.7.7) for evento de asociación vs federativo
- **Covers**: Appendix D.1, D.2, E, F

### 11. Added Documentation Tasks (Section 7.10)
- **Enhanced**: Task 7.10 with 5 role-specific user guides
- **Covers**: User onboarding for all 5 roles

### Summary Statistics:
- **Total new tasks added**: ~45 subtasks
- **Total tasks enhanced**: ~25 existing tasks
- **PRD requirements coverage**: 100% (all REQ-1.x through REQ-10.x + REQ-11.x)
- **Critical gaps closed**:
  - Asociaciones management (complete section)
  - Email notifications (complete system)
  - RLS testing (comprehensive suite)
  - Admin override permissions
  - Dorsal deactivation
  - Event rejection flow details
  - Validation schemas as deliverables

**Result**: The tasks document now provides complete, step-by-step implementation guidance to build a 100% functional FAB management system matching all PRD requirements.
