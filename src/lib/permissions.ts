import type { UserRole } from "@prisma/client";
import type { UserPermissions } from "@/types/profile";

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
  return hasPermission(role, "canSearchJobs");
}

/**
 * Check if user can publish job offers
 */
export function canPublishJobs(role: UserRole): boolean {
  return hasPermission(role, "canPublishJobs");
}

/**
 * Check if user can access training/courses
 */
export function canAccessTraining(role: UserRole): boolean {
  return hasPermission(role, "canAccessTraining");
}

/**
 * Check if user can manage training content (create/edit courses)
 */
export function canManageTraining(role: UserRole): boolean {
  return hasPermission(role, "canManageTraining");
}

/**
 * Check if user can access entrepreneurship tools
 */
export function canAccessEntrepreneurship(role: UserRole): boolean {
  return hasPermission(role, "canAccessEntrepreneurship");
}

/**
 * Check if user can manage entrepreneurship content
 */
export function canManageEntrepreneurship(role: UserRole): boolean {
  return hasPermission(role, "canManageEntrepreneurship");
}

/**
 * Check if user can view personal/basic reports
 */
export function canViewReports(role: UserRole): boolean {
  return hasPermission(role, "canViewReports");
}

/**
 * Check if user can view advanced/administrative reports
 */
export function canViewAdvancedReports(role: UserRole): boolean {
  return hasPermission(role, "canViewAdvancedReports");
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(role: UserRole): boolean {
  return hasPermission(role, "canManageUsers");
}

/**
 * Check if user requires parental consent
 */
export function requiresParentalConsent(role: UserRole): boolean {
  return hasPermission(role, "requiresParentalConsent");
}

/**
 * Get user type display name
 */
export function getUserTypeDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    YOUTH: "Joven",
    ADOLESCENTS: "Adolescente",
    COMPANIES: "Empresa",
    MUNICIPAL_GOVERNMENTS: "Gobierno Municipal",
    TRAINING_CENTERS: "Centro de Formación",
    NGOS_AND_FOUNDATIONS: "ONG y Fundaciones",
    SUPERADMIN: "Super Administrador",
  };

  return displayNames[role];
}

/**
 * Get default dashboard route based on user role
 */
export function getDefaultDashboardRoute(role: UserRole): string {
  const dashboardRoutes: Record<UserRole, string> = {
    YOUTH: "/dashboard",
    ADOLESCENTS: "/dashboard",
    COMPANIES: "/dashboard/company",
    MUNICIPAL_GOVERNMENTS: "/dashboard/admin",
    TRAINING_CENTERS: "/dashboard/training-center",
    NGOS_AND_FOUNDATIONS: "/dashboard/ngo",
    SUPERADMIN: "/dashboard/admin",
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
    title: "Dashboard",
    href: getDefaultDashboardRoute(role),
    icon: "LayoutDashboard",
  });

  // Job Search (YOUTH, ADOLESCENTS)
  if (permissions.canSearchJobs) {
    items.push(
      {
        title: "Buscar Empleos",
        href: "/jobs",
        icon: "Search",
      },
      {
        title: "Mis Postulaciones",
        href: "/my-applications",
        icon: "FileText",
      }
    );
  }

  // Job Management (COMPANIES)
  if (permissions.canPublishJobs) {
    items.push(
      {
        title: "Publicar Empleo",
        href: "/jobs/create",
        icon: "Plus",
      },
      {
        title: "Mis Empleos",
        href: "/my-jobs",
        icon: "Briefcase",
      },
      {
        title: "Candidatos",
        href: "/candidates",
        icon: "Users",
      }
    );
  }

  // Training (All except COMPANIES)
  if (permissions.canAccessTraining) {
    items.push({
      title: permissions.canManageTraining ? "Gestión de Cursos" : "Cursos",
      href: "/courses",
      icon: "BookOpen",
    });

    if (!permissions.canManageTraining) {
      items.push({
        title: "Mis Cursos",
        href: "/my-courses",
        icon: "GraduationCap",
      });
    }
  }

  // Entrepreneurship (All except COMPANIES)
  if (permissions.canAccessEntrepreneurship) {
    items.push(
      {
        title: "Emprendimiento",
        href: "/entrepreneurship",
        icon: "Lightbulb",
      },
      {
        title: "Simulador de Plan de Negocio",
        href: "/business-plan-simulator",
        icon: "Calculator",
      },
      {
        title: "Escaparate Virtual",
        href: "/marketplace",
        icon: "Store",
      }
    );
  }

  // Reports
  if (permissions.canViewReports) {
    items.push({
      title: permissions.canViewAdvancedReports
        ? "Reportes Avanzados"
        : "Mis Reportes",
      href: "/reports",
      icon: "BarChart3",
    });
  }

  // User Management (MUNICIPAL_GOVERNMENTS, SUPERADMIN)
  if (permissions.canManageUsers) {
    items.push({
      title: "Gestión de Usuarios",
      href: "/admin/users",
      icon: "UserCog",
    });
  }

  // Profile and Settings (always available)
  items.push({
    title: "Mi Perfil",
    href: "/profile",
    icon: "User",
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
  const baseFields = ["firstName", "lastName", "email", "municipality"];

  switch (role) {
    case "YOUTH":
    case "ADOLESCENTS":
      return [
        ...baseFields,
        "birthDate",
        "educationLevel",
        "skills",
        "interests",
        ...(role === "ADOLESCENTS" ? ["parentEmail"] : []),
      ];

    case "COMPANIES":
      return [
        ...baseFields,
        "companyName",
        "businessSector",
        "companyDescription",
        "legalRepresentative",
      ];

    case "MUNICIPAL_GOVERNMENTS":
    case "TRAINING_CENTERS":
    case "NGOS_AND_FOUNDATIONS":
      return [
        ...baseFields,
        "institutionName",
        "institutionType",
        "serviceArea",
        "institutionDescription",
      ];

    default:
      return baseFields;
  }
}
