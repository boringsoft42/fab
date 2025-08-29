import { UserRole } from '@/types/api';

// Define permissions enum
export enum Permission {
  // Course permissions
  VIEW_COURSES = 'VIEW_COURSES',
  CREATE_COURSES = 'CREATE_COURSES',
  DELETE_COURSES = 'DELETE_COURSES',
  
  // Lesson permissions
  VIEW_LESSONS = 'VIEW_LESSONS',
  CREATE_LESSONS = 'CREATE_LESSONS',
  
  // Quiz permissions
  VIEW_QUIZZES = 'VIEW_QUIZZES',
  CREATE_QUIZZES = 'CREATE_QUIZZES',
  
  // Job permissions
  VIEW_JOB_OFFERS = 'VIEW_JOB_OFFERS',
  CREATE_JOB_OFFERS = 'CREATE_JOB_OFFERS',
  
  // User management
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  
  // Additional permissions
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  MODERATE_CONTENT = 'MODERATE_CONTENT',
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  JOVENES: [
    Permission.VIEW_COURSES,
    Permission.VIEW_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
  ],
  
  ADOLESCENTES: [
    Permission.VIEW_COURSES,
    Permission.VIEW_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
  ],
  
  EMPRESAS: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSES,
    Permission.VIEW_LESSONS,
    Permission.CREATE_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.CREATE_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
    Permission.CREATE_JOB_OFFERS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_CONTENT,
  ],
  
  GOBIERNOS_MUNICIPALES: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSES,
    Permission.VIEW_LESSONS,
    Permission.CREATE_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.CREATE_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
    Permission.CREATE_JOB_OFFERS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_CONTENT,
  ],
  
  CENTROS_DE_FORMACION: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSES,
    Permission.VIEW_LESSONS,
    Permission.CREATE_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.CREATE_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
    Permission.CREATE_JOB_OFFERS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_CONTENT,
  ],
  
  ONGS_Y_FUNDACIONES: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSES,
    Permission.VIEW_LESSONS,
    Permission.CREATE_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.CREATE_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
    Permission.CREATE_JOB_OFFERS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_CONTENT,
  ],
  
  CLIENT: [
    Permission.VIEW_COURSES,
    Permission.VIEW_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
  ],
  
  AGENT: [
    Permission.VIEW_COURSES,
    Permission.VIEW_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
  ],
  
  SUPER_ADMIN: [
    Permission.VIEW_COURSES,
    Permission.CREATE_COURSES,
    Permission.DELETE_COURSES,
    Permission.VIEW_LESSONS,
    Permission.CREATE_LESSONS,
    Permission.VIEW_QUIZZES,
    Permission.CREATE_QUIZZES,
    Permission.VIEW_JOB_OFFERS,
    Permission.CREATE_JOB_OFFERS,
    Permission.USER_MANAGEMENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_CONTENT,
    Permission.MODERATE_CONTENT,
  ],
};

// Organization roles (can create content)
export const ORGANIZATION_ROLES: UserRole[] = [
  'EMPRESAS',
  'GOBIERNOS_MUNICIPALES',
  'CENTROS_DE_FORMACION',
  'ONGS_Y_FUNDACIONES',
];

// Student roles
export const STUDENT_ROLES: UserRole[] = [
  'JOVENES',
  'ADOLESCENTES',
];

// Utility functions
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const isOrganization = (userRole: UserRole): boolean => {
  return ORGANIZATION_ROLES.includes(userRole);
};

export const isStudent = (userRole: UserRole): boolean => {
  return STUDENT_ROLES.includes(userRole);
};

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'SUPER_ADMIN';
};

export const canCreateCourses = (userRole: UserRole): boolean => {
  return hasPermission(userRole, Permission.CREATE_COURSES);
};

export const canCreateJobOffers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, Permission.CREATE_JOB_OFFERS);
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, Permission.USER_MANAGEMENT);
};

export const canViewAnalytics = (userRole: UserRole): boolean => {
  return hasPermission(userRole, Permission.VIEW_ANALYTICS);
};

// Role display helpers
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    JOVENES: 'Joven',
    ADOLESCENTES: 'Adolescente',
    EMPRESAS: 'Empresa',
    GOBIERNOS_MUNICIPALES: 'Gobierno Municipal',
    CENTROS_DE_FORMACION: 'Centro de Formación',
    ONGS_Y_FUNDACIONES: 'ONG/Fundación',
    CLIENT: 'Cliente',
    AGENT: 'Agente',
    SUPER_ADMIN: 'Administrador',
  };
  
  return roleNames[role] || role;
};

export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    JOVENES: 'bg-blue-100 text-blue-800',
    ADOLESCENTES: 'bg-green-100 text-green-800',
    EMPRESAS: 'bg-purple-100 text-purple-800',
    GOBIERNOS_MUNICIPALES: 'bg-red-100 text-red-800',
    CENTROS_DE_FORMACION: 'bg-orange-100 text-orange-800',
    ONGS_Y_FUNDACIONES: 'bg-pink-100 text-pink-800',
    CLIENT: 'bg-gray-100 text-gray-800',
    AGENT: 'bg-yellow-100 text-yellow-800',
    SUPER_ADMIN: 'bg-black text-white',
  };
  
  return roleColors[role] || 'bg-gray-100 text-gray-800';
};
