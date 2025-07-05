import type { UserRole } from &ldquo;@prisma/client&rdquo;;
import type { UserPermissions } from &ldquo;@/types/profile&rdquo;;

/**
 * CORRECTED PERMISSIONS MATRIX FROM TASKS.MD
 *
 * | USER TYPE              | JOB SEARCH | PUBLISH OFFERS | TRAINING | ENTREPRENEURSHIP | REPORTS |
 * |------------------------|------------|----------------|----------|------------------|---------|
 * | YOUTH                  | ✓          | ✗              | ✓        | ✓                | ✓       |
 * | ADOLESCENTS            | ✓          | ✗              | ✓        | ✓                | ✗       |
 * | COMPANIES              | ✗          | ✓              | ✗        | ✗                | ✓       |
 * | MUNICIPAL_GOVERNMENTS  | ✗          | ✗              | ✓        | ✓                | ✓       |
 * | TRAINING_CENTERS       | ✗          | ✗              | ✓        | ✓                | ✓       |
 * | NGOS_AND_FOUNDATIONS   | ✗          | ✗              | ✓        | ✓                | ✓       |
 */

const PERMISSIONS_MATRIX: Record<UserRole, UserPermissions> = {
  YOUTH: {
    canSearchJobs: true,
    canPublishJobs: false,
    canAccessTraining: true,
    canManageTraining: false,
    canAccessEntrepreneurship: true,
    canManageEntrepreneurship: false,
    canViewReports: true,
    canViewAdvancedReports: false,
    canManageUsers: false,
    requiresParentalConsent: false,
  },
  ADOLESCENTS: {
    canSearchJobs: true,
    canPublishJobs: false,
    canAccessTraining: true,
    canManageTraining: false,
    canAccessEntrepreneurship: true,
    canManageEntrepreneurship: false,
    canViewReports: false, // Key difference from YOUTH
    canViewAdvancedReports: false,
    canManageUsers: false,
    requiresParentalConsent: true, // Key difference from YOUTH
  },
  COMPANIES: {
    canSearchJobs: false,
    canPublishJobs: true,
    canAccessTraining: false,
    canManageTraining: false,
    canAccessEntrepreneurship: false,
    canManageEntrepreneurship: false,
    canViewReports: true,
    canViewAdvancedReports: false,
    canManageUsers: false,
    requiresParentalConsent: false,
  },
  MUNICIPAL_GOVERNMENTS: {
    canSearchJobs: false,
    canPublishJobs: false,
    canAccessTraining: true,
    canManageTraining: true,
    canAccessEntrepreneurship: true,
    canManageEntrepreneurship: true,
    canViewReports: true,
    canViewAdvancedReports: true,
    canManageUsers: true,
    requiresParentalConsent: false,
  },
  TRAINING_CENTERS: {
    canSearchJobs: false,
    canPublishJobs: false,
    canAccessTraining: true,
    canManageTraining: true,
    canAccessEntrepreneurship: true,
    canManageEntrepreneurship: true,
    canViewReports: true,
    canViewAdvancedReports: true,
    canManageUsers: false,
    requiresParentalConsent: false,
  },
  NGOS_AND_FOUNDATIONS: {
    canSearchJobs: false,
    canPublishJobs: false,
    canAccessTraining: true,
    canManageTraining: true,
    canAccessEntrepreneurship: true,
    canManageEntrepreneurship: true,
    canViewReports: true,
    canViewAdvancedReports: true,
    canManageUsers: false,
    requiresParentalConsent: false,
  },
  SUPERADMIN: {
    canSearchJobs: true,
    canPublishJobs: true,
    canAccessTraining: true,
    canManageTraining: true,
    canAccessEntrepreneurship: true,
    canManageEntrepreneurship: true,
    canViewReports: true,
    canViewAdvancedReports: true,
    canManageUsers: true,
    requiresParentalConsent: false,
  },
};

/**
 * Get permissions for a specific user role
 */
export function getPermissions(role: UserRole): UserPermissions {
  return PERMISSIONS_MATRIX[role];
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  role: UserRole,
  permission: keyof UserPermissions
): boolean {
  return PERMISSIONS_MATRIX[role][permission];
}

/**
 * Check if user can access job search functionality
 */
export function canSearchJobs(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canSearchJobs&rdquo;);
}

/**
 * Check if user can publish job offers
 */
export function canPublishJobs(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canPublishJobs&rdquo;);
}

/**
 * Check if user can access training/courses
 */
export function canAccessTraining(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canAccessTraining&rdquo;);
}

/**
 * Check if user can manage training content (create/edit courses)
 */
export function canManageTraining(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canManageTraining&rdquo;);
}

/**
 * Check if user can access entrepreneurship tools
 */
export function canAccessEntrepreneurship(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canAccessEntrepreneurship&rdquo;);
}

/**
 * Check if user can manage entrepreneurship content
 */
export function canManageEntrepreneurship(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canManageEntrepreneurship&rdquo;);
}

/**
 * Check if user can view personal/basic reports
 */
export function canViewReports(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canViewReports&rdquo;);
}

/**
 * Check if user can view advanced/administrative reports
 */
export function canViewAdvancedReports(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canViewAdvancedReports&rdquo;);
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(role: UserRole): boolean {
  return hasPermission(role, &ldquo;canManageUsers&rdquo;);
}

/**
 * Check if user requires parental consent
 */
export function requiresParentalConsent(role: UserRole): boolean {
  return hasPermission(role, &ldquo;requiresParentalConsent&rdquo;);
}

/**
 * Get user type display name
 */
export function getUserTypeDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    YOUTH: &ldquo;Joven&rdquo;,
    ADOLESCENTS: &ldquo;Adolescente&rdquo;,
    COMPANIES: &ldquo;Empresa&rdquo;,
    MUNICIPAL_GOVERNMENTS: &ldquo;Gobierno Municipal&rdquo;,
    TRAINING_CENTERS: &ldquo;Centro de Formación&rdquo;,
    NGOS_AND_FOUNDATIONS: &ldquo;ONG y Fundaciones&rdquo;,
    SUPERADMIN: &ldquo;Super Administrador&rdquo;,
  };

  return displayNames[role];
}

/**
 * Get default dashboard route based on user role
 */
export function getDefaultDashboardRoute(role: UserRole): string {
  const dashboardRoutes: Record<UserRole, string> = {
    YOUTH: &ldquo;/dashboard&rdquo;,
    ADOLESCENTS: &ldquo;/dashboard&rdquo;,
    COMPANIES: &ldquo;/dashboard/company&rdquo;,
    MUNICIPAL_GOVERNMENTS: &ldquo;/dashboard/admin&rdquo;,
    TRAINING_CENTERS: &ldquo;/dashboard/training-center&rdquo;,
    NGOS_AND_FOUNDATIONS: &ldquo;/dashboard/ngo&rdquo;,
    SUPERADMIN: &ldquo;/dashboard/admin&rdquo;,
  };

  return dashboardRoutes[role];
}

/**
 * Get navigation menu items based on user role
 */
export function getNavigationItems(role: UserRole) {
  const permissions = getPermissions(role);
  const items = [];

  // Dashboard (always available)
  items.push({
    title: &ldquo;Dashboard&rdquo;,
    href: getDefaultDashboardRoute(role),
    icon: &ldquo;LayoutDashboard&rdquo;,
  });

  // Job Search (YOUTH, ADOLESCENTS)
  if (permissions.canSearchJobs) {
    items.push(
      {
        title: &ldquo;Buscar Empleos&rdquo;,
        href: &ldquo;/jobs&rdquo;,
        icon: &ldquo;Search&rdquo;,
      },
      {
        title: &ldquo;Mis Postulaciones&rdquo;,
        href: &ldquo;/my-applications&rdquo;,
        icon: &ldquo;FileText&rdquo;,
      }
    );
  }

  // Job Management (COMPANIES)
  if (permissions.canPublishJobs) {
    items.push(
      {
        title: &ldquo;Publicar Empleo&rdquo;,
        href: &ldquo;/jobs/create&rdquo;,
        icon: &ldquo;Plus&rdquo;,
      },
      {
        title: &ldquo;Mis Empleos&rdquo;,
        href: &ldquo;/my-jobs&rdquo;,
        icon: &ldquo;Briefcase&rdquo;,
      },
      {
        title: &ldquo;Candidatos&rdquo;,
        href: &ldquo;/candidates&rdquo;,
        icon: &ldquo;Users&rdquo;,
      }
    );
  }

  // Training (All except COMPANIES)
  if (permissions.canAccessTraining) {
    items.push({
      title: permissions.canManageTraining ? &ldquo;Gestión de Cursos&rdquo; : &ldquo;Cursos&rdquo;,
      href: &ldquo;/courses&rdquo;,
      icon: &ldquo;BookOpen&rdquo;,
    });

    if (!permissions.canManageTraining) {
      items.push({
        title: &ldquo;Mis Cursos&rdquo;,
        href: &ldquo;/my-courses&rdquo;,
        icon: &ldquo;GraduationCap&rdquo;,
      });
    }
  }

  // Entrepreneurship (All except COMPANIES)
  if (permissions.canAccessEntrepreneurship) {
    items.push(
      {
        title: &ldquo;Emprendimiento&rdquo;,
        href: &ldquo;/entrepreneurship&rdquo;,
        icon: &ldquo;Lightbulb&rdquo;,
      },
      {
        title: &ldquo;Simulador de Plan de Negocio&rdquo;,
        href: &ldquo;/business-plan-simulator&rdquo;,
        icon: &ldquo;Calculator&rdquo;,
      },
      {
        title: &ldquo;Escaparate Virtual&rdquo;,
        href: &ldquo;/marketplace&rdquo;,
        icon: &ldquo;Store&rdquo;,
      }
    );
  }

  // Reports
  if (permissions.canViewReports) {
    items.push({
      title: permissions.canViewAdvancedReports
        ? &ldquo;Reportes Avanzados&rdquo;
        : &ldquo;Mis Reportes&rdquo;,
      href: &ldquo;/reports&rdquo;,
      icon: &ldquo;BarChart3&rdquo;,
    });
  }

  // User Management (MUNICIPAL_GOVERNMENTS, SUPERADMIN)
  if (permissions.canManageUsers) {
    items.push({
      title: &ldquo;Gestión de Usuarios&rdquo;,
      href: &ldquo;/admin/users&rdquo;,
      icon: &ldquo;UserCog&rdquo;,
    });
  }

  // Profile and Settings (always available)
  items.push({
    title: &ldquo;Mi Perfil&rdquo;,
    href: &ldquo;/profile&rdquo;,
    icon: &ldquo;User&rdquo;,
  });

  return items;
}

/**
 * Check if user should be redirected to complete profile
 */
export function shouldCompleteProfile(
  role: UserRole,
  profileCompletion: number
): boolean {
  // Different completion thresholds based on role
  const completionThresholds: Record<UserRole, number> = {
    YOUTH: 70,
    ADOLESCENTS: 60, // Lower threshold for adolescents
    COMPANIES: 80,
    MUNICIPAL_GOVERNMENTS: 85,
    TRAINING_CENTERS: 85,
    NGOS_AND_FOUNDATIONS: 85,
    SUPERADMIN: 50,
  };

  return profileCompletion < completionThresholds[role];
}

/**
 * Get required profile fields based on user role
 */
export function getRequiredProfileFields(role: UserRole): string[] {
  const baseFields = [&ldquo;firstName&rdquo;, &ldquo;lastName&rdquo;, &ldquo;email&rdquo;, &ldquo;municipality&rdquo;];

  switch (role) {
    case &ldquo;YOUTH&rdquo;:
    case &ldquo;ADOLESCENTS&rdquo;:
      return [
        ...baseFields,
        &ldquo;birthDate&rdquo;,
        &ldquo;educationLevel&rdquo;,
        &ldquo;skills&rdquo;,
        &ldquo;interests&rdquo;,
        ...(role === &ldquo;ADOLESCENTS&rdquo; ? [&ldquo;parentEmail&rdquo;] : []),
      ];

    case &ldquo;COMPANIES&rdquo;:
      return [
        ...baseFields,
        &ldquo;companyName&rdquo;,
        &ldquo;businessSector&rdquo;,
        &ldquo;companyDescription&rdquo;,
        &ldquo;legalRepresentative&rdquo;,
      ];

    case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
    case &ldquo;TRAINING_CENTERS&rdquo;:
    case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
      return [
        ...baseFields,
        &ldquo;institutionName&rdquo;,
        &ldquo;institutionType&rdquo;,
        &ldquo;serviceArea&rdquo;,
        &ldquo;institutionDescription&rdquo;,
      ];

    default:
      return baseFields;
  }
}
