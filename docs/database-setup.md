# Database Setup Guide - Sistema FAB

This document explains how to set up the FAB database schema in Supabase.

## Prerequisites

- Supabase project created
- Database credentials configured in `.env` file
- Access to Supabase Dashboard or Supabase CLI installed

## Option 1: Using Supabase Dashboard (Recommended for first-time setup)

### Steps:

1. **Login to Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Execute the Schema**
   - Copy the entire contents of `prisma/migrations/00_fab_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl/Cmd + Enter`

4. **Verify Execution**
   - Check that the query executed successfully (green checkmark)
   - You should see confirmation messages for:
     - Extensions created
     - ENUMs created
     - Tables created
     - Triggers created
     - RLS policies enabled
     - 9 asociaciones inserted

5. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see all the following tables:
     - `asociaciones`
     - `users`
     - `atletas`
     - `entrenadores`
     - `jueces`
     - `eventos`
     - `pruebas`
     - `inscripciones`
     - `dorsales`
     - `pagos_evento_asociacion`
     - `startlists`
     - `startlist_items`

## Option 2: Using Supabase CLI

### Steps:

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link your project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

   *Find your PROJECT_REF in your Supabase project URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`*

4. **Execute the migration**
   ```bash
   supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

   Or execute the SQL file directly:
   ```bash
   psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < prisma/migrations/00_fab_schema.sql
   ```

## Verification Checklist

After executing the schema, verify the following:

### ✅ Extensions
```sql
SELECT * FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');
```
Expected: 2 rows

### ✅ ENUMs
```sql
SELECT typname FROM pg_type WHERE typtype = 'e' AND typname LIKE '%enum';
```
Expected: 8 rows (rol_enum, estado_usuario_enum, genero_enum, tipo_evento_enum, estado_evento_enum, estado_pago_enum, estado_insc_assoc_enum, estado_startlist_enum)

### ✅ Tables
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```
Expected: 12 tables (asociaciones, users, atletas, entrenadores, jueces, eventos, pruebas, inscripciones, dorsales, pagos_evento_asociacion, startlists, startlist_items)

### ✅ Asociaciones Seeded
```sql
SELECT count(*) FROM asociaciones;
```
Expected: 9 rows

```sql
SELECT nombre FROM asociaciones ORDER BY nombre;
```
Expected:
- Beni
- Chuquisaca
- Cochabamba
- La Paz
- Oruro
- Pando
- Potosí
- Santa Cruz
- Tarija

### ✅ Triggers
```sql
SELECT trigger_name, event_object_table FROM information_schema.triggers
WHERE trigger_schema = 'public';
```
Expected: At least 2 triggers (trg_enforce_municipio_atleta, trg_atletas_set_categoria)

### ✅ Functions
```sql
SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND prokind = 'f';
```
Expected: At least 4 functions (enforce_municipio_atleta, fab_calcular_categoria_fn, atletas_set_categoria, me_asociacion_id, asignar_dorsal)

### ✅ RLS Policies
```sql
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename;
```
Expected: All 12 tables should have policies

### ✅ Indexes
```sql
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```
Expected: Multiple indexes on foreign keys and frequently queried columns

## Test Queries

### Test ENUMs
```sql
-- Should return the valid enum values
SELECT unnest(enum_range(NULL::rol_enum));
-- Expected: admin_fab, admin_asociacion, atleta, entrenador, juez
```

### Test Categoria Calculation Function
```sql
-- Test categoria calculation for different ages
SELECT fab_calcular_categoria_fn('2000-01-01'::date); -- Should return 'Mayores' (24 years old)
SELECT fab_calcular_categoria_fn('2003-01-01'::date); -- Should return 'U23' (21 years old)
SELECT fab_calcular_categoria_fn('2006-01-01'::date); -- Should return 'U20' (18 years old)
```

### Test Asociaciones
```sql
-- Should return 9 asociaciones
SELECT id, nombre, departamento FROM asociaciones ORDER BY nombre;
```

## Troubleshooting

### Error: "type already exists"
If you get errors about types already existing, the script is idempotent and will skip creation. This is expected if running the script multiple times.

### Error: "relation already exists"
Similar to above, the script uses `CREATE TABLE IF NOT EXISTS`, so this is safe.

### Error: "permission denied"
Make sure you're using the correct database credentials with sufficient privileges. The user should have CREATE, ALTER, and INSERT permissions.

### RLS Policies Not Working
1. Verify RLS is enabled on all tables:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```
   All should show `rowsecurity = true`

2. Check that `auth.uid()` function exists (provided by Supabase):
   ```sql
   SELECT auth.uid();
   ```
   Should return your current user ID or NULL if not authenticated.

## Next Steps

After successfully executing the schema:

1. ✅ **Task 1.1 Complete** - Mark as done in task list
2. ➡️ **Task 1.2** - Update Prisma schema to reflect this database structure
3. ➡️ **Task 1.3** - Generate Prisma client
4. ➡️ **Task 1.4** - Configure Supabase Storage buckets
5. ➡️ **Task 1.5** - Create seed script for admin_fab user
6. ➡️ **Task 1.6** - Create seed script for test data

## Schema Overview

### Core Tables
- **asociaciones**: 9 departmental associations (pre-seeded)
- **users**: Central user table (links to auth.users)
- **atletas/entrenadores/jueces**: Profile tables for each role

### Event Management
- **eventos**: Events (federativo or asociacion type)
- **pruebas**: Tests/competitions within events
- **inscripciones**: Athlete registrations with dual approval flow

### Competition Management
- **dorsales**: Unique bib numbers per event
- **pagos_evento_asociacion**: Payment tracking for federative events
- **startlists**: Starting lists with lanes/order

### Key Features
- ✅ Row Level Security (RLS) on all tables
- ✅ Automatic categoria_fab calculation based on age
- ✅ Municipio enforcement (required except for Santa Cruz)
- ✅ Locked personal data fields (enforced via RLS)
- ✅ Multi-stage approval workflow (asociacion → FAB)
- ✅ Unique dorsal assignment per event
- ✅ Payment verification workflow

## Support

If you encounter issues not covered in this guide:
1. Check Supabase logs in Dashboard → Database → Logs
2. Verify environment variables in `.env`
3. Review the PRD document for business logic clarification
4. Check the task list for related issues

---

**Schema Version**: v2025-10-24
**Last Updated**: 2025-10-24
**Related**: `tasks/tasks-0001-prd-fab-management-system.md` (Task 1.1)
