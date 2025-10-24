# FAB System - Seed Scripts

This directory contains seed scripts for initializing the FAB database with required data.

## Available Scripts

### 1. `seed-admin.ts` - Create initial admin_fab user

**Purpose**: Creates the first admin_fab (Super Administrator) user for the FAB system.

**When to run**: Once, during initial system setup, before any users can access the application.

**Requirements (from PRD)**:
- admin_fab accounts CANNOT be created via the web application (REQ-1.1.14)
- Must be created directly in database or via script (REQ-1.1.15)
- At least 1 admin_fab must exist at all times (REQ-1.1.16)

**Usage**:
```bash
pnpm tsx scripts/seed-admin.ts
```

**Interactive prompts**:
- Email address for admin_fab
- Password (min 6 characters)
- Password confirmation

**Environment variables required**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NOT the anon key!)

**What it does**:
1. Creates auth user in Supabase Auth using Admin API
2. Auto-confirms email (no verification needed)
3. Creates user record in `users` table with:
   - `rol = 'admin_fab'`
   - `estado = 'activo'` (no approval needed)
   - `asociacion_id` = La Paz (administrative, can be any)

**Output**:
```
✅ SUCCESS! Admin FAB user created

User Details:
  User ID: 550e8400-e29b-41d4-a716-446655440000
  Email: admin@fab.bo
  Rol: admin_fab
  Estado: activo
  Asociación ID: [uuid]

📝 You can now login with these credentials
```

**⚠️ Security Notes**:
- Store credentials securely (password manager)
- Do NOT commit credentials to git
- Use a strong password (min 12 chars recommended)
- This account has FULL access to ALL data

---

### 2. `seed-test-data.ts` - Create test data for development

**Purpose**: Populates the database with sample users, events, and inscriptions for testing and development.

**When to run**: After `seed-admin.ts`, in development/staging environments only.

**⚠️ DO NOT run in production!**

**Usage**:
```bash
pnpm tsx scripts/seed-test-data.ts
```

**What it creates**:
- 3 admin_asociacion users (La Paz, Cochabamba, Santa Cruz)
- 10 atletas (2 per category: U8, U10, U14, U16, Menores, U20, U23, Mayores)
- 3 entrenadores
- 2 jueces
- 2 eventos (1 federativo, 1 asociacion)
- 5 pruebas per event
- Sample inscriptions

**Environment variables required**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

### 3. `verify-prisma-models.ts` - Verify Prisma setup

**Purpose**: Verifies that all Prisma models are correctly generated and the database is accessible.

**Usage**:
```bash
pnpm tsx scripts/verify-prisma-models.ts
```

**What it checks**:
- All 12 models accessible in Prisma Client
- 9 asociaciones seeded correctly
- Database connection working

---

### 4. `check-db-tables.ts` - Check database tables

**Purpose**: Lists all tables in the public schema to verify schema execution.

**Usage**:
```bash
pnpm tsx scripts/check-db-tables.ts
```

---

## Recommended Setup Order

For a fresh installation:

1. **Database Schema**
   ```bash
   # Execute prisma/migrations/00_fab_schema.sql in Supabase Dashboard
   # See docs/database-setup.md
   ```

2. **Verify Schema**
   ```bash
   pnpm tsx scripts/check-db-tables.ts
   pnpm tsx scripts/verify-prisma-models.ts
   ```

3. **Create Admin FAB**
   ```bash
   pnpm tsx scripts/seed-admin.ts
   ```

4. **[Development Only] Seed Test Data**
   ```bash
   pnpm tsx scripts/seed-test-data.ts
   ```

5. **[Optional] Configure Storage Buckets**
   ```
   Follow docs/storage-setup.md
   ```

---

## Troubleshooting

### Error: "Missing required environment variables"
- Make sure `.env` file exists in project root
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (NOT anon key!)

### Error: "Asociación 'La Paz' not found"
- Database schema not executed
- Run the SQL in `prisma/migrations/00_fab_schema.sql` first
- See `docs/database-setup.md`

### Error: "User already exists"
- The email is already registered
- Use a different email or delete the existing user from Supabase Auth

### Error: "Invalid Supabase URL or key"
- Check that URL and keys are copied correctly from Supabase Dashboard
- Service role key should start with `eyJ...` and be very long
- Don't confuse with anon key!

---

## Related Documentation

- `docs/database-setup.md` - Database schema setup
- `docs/storage-setup.md` - Storage buckets configuration
- `tasks/tasks-0001-prd-fab-management-system.md` - Task 1.5, 1.6
- `tasks/0001-prd-fab-management-system.md` - PRD REQ-1.1.14, REQ-1.1.15, REQ-1.1.16
