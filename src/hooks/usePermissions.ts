/**
 * usePermissions Hook
 *
 * Custom hook for checking user permissions based on rol and estado
 *
 * Requirements implemented:
 * - REQ-1.2.2: Role hierarchy (admin_fab > admin_asociacion > others)
 * - REQ-1.2.3: RLS-based access control
 * - REQ-1.3.4: Only "activo" users have full access
 *
 * Usage:
 * ```tsx
 * const { canApproveUsers, canCreateEvents, canViewAllData } = usePermissions();
 *
 * if (canApproveUsers) {
 *   return <ApproveButton />;
 * }
 * ```
 */

'use client';

import { useUser, UserRole } from './useUser';

export interface UsePermissionsReturn {
  // General permissions
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isActive: boolean;
  isPending: boolean;

  // User management permissions
  canApproveUsers: boolean; // Only admin_fab
  canCreateAdminAsociacion: boolean; // Only admin_fab
  canViewAllUsers: boolean; // admin_fab
  canViewAsociacionUsers: boolean; // admin_fab or admin_asociacion

  // Event management permissions
  canCreateEvents: boolean; // admin_fab or admin_asociacion
  canApproveEvents: boolean; // Only admin_fab
  canViewAllEvents: boolean; // admin_fab
  canManageOwnEvents: boolean; // admin_asociacion

  // Inscription permissions
  canCreateInscription: boolean; // atleta (if activo)
  canApproveInscriptionAsociacion: boolean; // admin_asociacion
  canApproveInscriptionFAB: boolean; // admin_fab

  // Payment permissions
  canRegisterPayment: boolean; // admin_asociacion
  canVerifyPayment: boolean; // admin_fab

  // Dorsal permissions
  canAssignDorsal: boolean; // admin_fab

  // Startlist permissions
  canCreateStartlist: boolean; // admin_fab or admin_asociacion
  canFinalizeStartlist: boolean; // admin_fab or admin_asociacion

  // Profile permissions
  canEditOwnProfile: boolean; // Any authenticated user
  canEditAnyProfile: boolean; // Only admin_fab

  // Helper functions
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { userRecord } = useUser();

  const rol = userRecord?.rol ?? null;
  const estado = userRecord?.estado ?? null;

  // Helper to check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!rol) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(rol);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!rol) return false;
    return roles.some(r => r === rol);
  };

  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!rol) return false;
    return roles.every(r => r === rol);
  };

  // General permissions
  const isAdmin = hasAnyRole(['admin_fab', 'admin_asociacion']);
  const isSuperAdmin = hasRole('admin_fab');
  const isActive = estado === 'activo';
  const isPending = estado === 'pendiente';

  // User management permissions
  const canApproveUsers = isSuperAdmin && isActive; // REQ-1.3.2
  const canCreateAdminAsociacion = isSuperAdmin && isActive; // REQ-1.1.8
  const canViewAllUsers = isSuperAdmin && isActive;
  const canViewAsociacionUsers = isAdmin && isActive;

  // Event management permissions
  const canCreateEvents = isAdmin && isActive; // REQ-4.1.1
  const canApproveEvents = isSuperAdmin && isActive; // REQ-4.2.2
  const canViewAllEvents = isSuperAdmin && isActive; // REQ-9.2.3
  const canManageOwnEvents = hasRole('admin_asociacion') && isActive; // REQ-4.3.2

  // Inscription permissions
  const canCreateInscription = hasRole('atleta') && isActive; // REQ-6.1.1
  const canApproveInscriptionAsociacion = hasRole('admin_asociacion') && isActive; // REQ-6.2.1
  const canApproveInscriptionFAB = isSuperAdmin && isActive; // REQ-6.5.1

  // Payment permissions
  const canRegisterPayment = hasRole('admin_asociacion') && isActive; // REQ-6.3.3
  const canVerifyPayment = isSuperAdmin && isActive; // REQ-6.4.1

  // Dorsal permissions
  const canAssignDorsal = isSuperAdmin && isActive; // REQ-7.2.1

  // Startlist permissions
  const canCreateStartlist = isAdmin && isActive; // REQ-8.1.1
  const canFinalizeStartlist = isAdmin && isActive; // REQ-8.4.3

  // Profile permissions
  const canEditOwnProfile = !!userRecord && isActive; // REQ-2.4.1
  const canEditAnyProfile = isSuperAdmin && isActive; // REQ-2.1.3

  return {
    // General
    isAdmin,
    isSuperAdmin,
    isActive,
    isPending,

    // User management
    canApproveUsers,
    canCreateAdminAsociacion,
    canViewAllUsers,
    canViewAsociacionUsers,

    // Event management
    canCreateEvents,
    canApproveEvents,
    canViewAllEvents,
    canManageOwnEvents,

    // Inscriptions
    canCreateInscription,
    canApproveInscriptionAsociacion,
    canApproveInscriptionFAB,

    // Payments
    canRegisterPayment,
    canVerifyPayment,

    // Dorsales
    canAssignDorsal,

    // Startlists
    canCreateStartlist,
    canFinalizeStartlist,

    // Profiles
    canEditOwnProfile,
    canEditAnyProfile,

    // Helpers
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}

/**
 * Hook to require specific permissions
 * Throws error if user doesn't have required permissions
 *
 * Usage:
 * ```tsx
 * function AdminOnlyPage() {
 *   useRequirePermission('canApproveUsers');
 *   // ... rest of component
 * }
 * ```
 */
export function useRequirePermission(permission: keyof UsePermissionsReturn): void {
  const permissions = usePermissions();

  if (typeof permissions[permission] === 'boolean' && !permissions[permission]) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

/**
 * Hook to require specific role(s)
 * Redirects to dashboard if user doesn't have required role
 *
 * Usage:
 * ```tsx
 * function AdminPage() {
 *   useRequireRole(['admin_fab', 'admin_asociacion']);
 *   // ... rest of component
 * }
 * ```
 */
export function useRequireRole(roles: UserRole | UserRole[]): void {
  const { userRecord } = useUser();

  const roleArray = Array.isArray(roles) ? roles : [roles];
  const hasRequiredRole = userRecord && roleArray.includes(userRecord.rol);

  if (!hasRequiredRole) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  }
}
