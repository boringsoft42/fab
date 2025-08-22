# Fix para Inconsistencias en Roles de Usuario

## Problema Identificado

Se detectaron inconsistencias en el manejo de roles de usuario entre diferentes partes de la aplicación:

### Inconsistencias Encontradas:

1. **Backend vs Frontend Roles:**

   - Backend usa: `MUNICIPAL_GOVERNMENTS` (inglés)
   - Frontend espera: `GOBIERNOS_MUNICIPALES` (español)

2. **Múltiples Formatos de Roles:**

   - `GOBIERNOS_MUNICIPALES` (español)
   - `MUNICIPAL_GOVERNMENTS` (inglés)
   - `municipality` (formato alternativo)
   - Variaciones con `toLowerCase().includes('municipality')`

3. **Logs Confusos:**
   ```
   useCurrentUser: Raw user data: {role: 'GOBIERNOS_MUNICIPALES'}
   useCurrentMunicipality: {userRole: 'MUNICIPAL_GOVERNMENTS'}
   CompaniesPage: {userRole: 'GOBIERNOS_MUNICIPALES'}
   ```

## Solución Implementada

### 1. Funciones de Normalización en `src/lib/utils.ts`

Se agregaron funciones para manejar consistentemente los roles:

```typescript
// Normaliza roles de backend a frontend
export function normalizeUserRole(
  role: string | null | undefined
): string | null;

// Verifica si un rol es de municipio (maneja ambos formatos)
export function isMunicipalityRole(role: string | null | undefined): boolean;

// Verifica si un rol es de empresa
export function isCompanyRole(role: string | null | undefined): boolean;

// Verifica si un rol es super admin
export function isSuperAdminRole(role: string | null | undefined): boolean;
```

### 2. Actualización de Hooks

**`src/hooks/useMunicipalityApi.ts`:**

- Reemplazó la lógica compleja de detección de municipio
- Ahora usa `isMunicipalityRole(user?.role)` para consistencia

**`src/hooks/use-current-user.ts`:**

- Usa `normalizeUserRole()` para mapear roles consistentemente
- Elimina dependencia de `mapBackendRoleToFrontend()`

### 3. Actualización de Servicios

**`src/services/company.service.ts`:**

- Reemplazó comparaciones directas de roles
- Ahora usa funciones de verificación normalizadas:
  - `isMunicipalityRole(userRole)` en lugar de `userRole === 'GOBIERNOS_MUNICIPALES'`
  - `isCompanyRole(userRole)` en lugar de `userRole === 'EMPRESAS'`
  - `isSuperAdminRole(userRole)` en lugar de `userRole === 'SUPERADMIN'`

## Beneficios de la Solución

1. **Consistencia:** Todos los roles se manejan de manera uniforme
2. **Mantenibilidad:** Cambios en roles solo requieren actualizar las funciones de normalización
3. **Debugging:** Logs más claros y consistentes
4. **Flexibilidad:** Maneja tanto roles del backend como del frontend
5. **Escalabilidad:** Fácil agregar nuevos roles o formatos

## Roles Soportados

### Frontend (Normalizados):

- `JOVENES`
- `ADOLESCENTES`
- `EMPRESAS`
- `GOBIERNOS_MUNICIPALES`
- `CENTROS_DE_FORMACION`
- `ONGS_Y_FUNDACIONES`
- `SUPERADMIN`
- `SUPER_ADMIN`

### Backend (Mapeados automáticamente):

- `YOUTH` → `JOVENES`
- `ADOLESCENTS` → `ADOLESCENTES`
- `COMPANIES` → `EMPRESAS`
- `MUNICIPAL_GOVERNMENTS` → `GOBIERNOS_MUNICIPALES`
- `TRAINING_CENTERS` → `CENTROS_DE_FORMACION`
- `NGOS_AND_FOUNDATIONS` → `ONGS_Y_FUNDACIONES`
- `SUPERADMIN` → `SUPERADMIN`

## Uso Recomendado

En lugar de comparar roles directamente:

```typescript
// ❌ Antes (problemático)
if (userRole === 'GOBIERNOS_MUNICIPALES') { ... }
if (userRole === 'MUNICIPAL_GOVERNMENTS') { ... }

// ✅ Ahora (recomendado)
if (isMunicipalityRole(userRole)) { ... }
if (isCompanyRole(userRole)) { ... }
if (isSuperAdminRole(userRole)) { ... }
```

Para normalizar roles:

```typescript
// ✅ Normalizar antes de usar
const normalizedRole = normalizeUserRole(userRole);
```

## Próximos Pasos

1. **Aplicar el patrón** a otros servicios y componentes
2. **Actualizar tests** para usar las nuevas funciones
3. **Documentar** el uso en el equipo de desarrollo
4. **Monitorear** logs para verificar consistencia
