import {
  LayoutDashboard,
  Search,
  FileText,
  GraduationCap,
  Lightbulb,
  User,
  BarChart3,
  Briefcase,
  Building2,
  Users,
  Settings,
  BookOpen,
  Target,
  PieChart,
  UserCog,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
  Plus,
  Eye,
  UserCheck,
} from "lucide-react";
import type { SidebarData } from "../types";
import type { UserRole } from "@prisma/client";

const commonTeams = [
  {
    name: "CEMSE Platform",
    logo: Command,
    plan: "Employability & Entrepreneurship",
  },
  {
    name: "Cochabamba",
    logo: GalleryVerticalEnd,
    plan: "Regional Hub",
  },
  {
    name: "Bolivia",
    logo: AudioWaveform,
    plan: "National Network",
  },
];

// YOUTH navigation
export const youthSidebarData: SidebarData = {
  user: {
    name: "Usuario Joven",
    email: "youth@example.com",
    avatar: "/avatars/youth.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Buscar Empleos",
          url: "/jobs",
          icon: Search,
        },
        {
          title: "Mis Postulaciones",
          url: "/my-applications",
          icon: FileText,
        },
      ],
    },
    {
      title: "Desarrollo",
      items: [
        {
          title: "Capacitación",
          icon: GraduationCap,
          items: [
            {
              title: "Cursos Disponibles",
              url: "/courses",
            },
            {
              title: "Mis Cursos",
              url: "/my-courses",
            },
            {
              title: "Certificados",
              url: "/certificates",
            },
          ],
        },
        {
          title: "Emprendimiento",
          icon: Lightbulb,
          items: [
            {
              title: "Hub de Emprendimiento",
              url: "/entrepreneurship",
            },
            {
              title: "Simulador de Plan de Negocios",
              url: "/business-plan-simulator",
            },
            {
              title: "Centro de Recursos",
              url: "/entrepreneurship/resources",
            },
            {
              title: "Directorio de Instituciones",
              url: "/entrepreneurship/directory",
            },
            {
              title: "Publicar mi Emprendimiento",
              url: "/publish-entrepreneurship",
            },
            {
              title: "Red de Contactos",
              url: "/entrepreneurship/network",
            },
            {
              title: "Mentorías",
              url: "/mentorship",
            },
          ],
        },
      ],
    },
    {
      title: "Personal",
      items: [
        {
          title: "Mi Perfil",
          url: "/profile",
          icon: User,
        },
        {
          title: "Reportes Personales",
          url: "/reports/personal",
          icon: BarChart3,
        },
      ],
    },
  ],
};

// ADOLESCENTS navigation (similar to youth but no reports)
export const adolescentSidebarData: SidebarData = {
  user: {
    name: "Usuario Adolescente",
    email: "adolescent@example.com",
    avatar: "/avatars/adolescent.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Buscar Empleos",
          url: "/jobs",
          icon: Search,
        },
        {
          title: "Mis Postulaciones",
          url: "/my-applications",
          icon: FileText,
        },
      ],
    },
    {
      title: "Desarrollo",
      items: [
        {
          title: "Capacitación",
          icon: GraduationCap,
          items: [
            {
              title: "Cursos Disponibles",
              url: "/courses",
            },
            {
              title: "Mis Cursos",
              url: "/my-courses",
            },
            {
              title: "Certificados",
              url: "/certificates",
            },
          ],
        },
        {
          title: "Emprendimiento",
          icon: Lightbulb,
          items: [
            {
              title: "Hub de Emprendimiento",
              url: "/entrepreneurship",
            },
            {
              title: "Simulador de Plan de Negocios",
              url: "/business-plan-simulator",
            },
            {
              title: "Centro de Recursos",
              url: "/entrepreneurship/resources",
            },
            {
              title: "Directorio de Instituciones",
              url: "/entrepreneurship/directory",
            },
            {
              title: "Publicar mi Emprendimiento",
              url: "/publish-entrepreneurship",
            },
            {
              title: "Red de Contactos",
              url: "/entrepreneurship/network",
            },
            {
              title: "Mentorías",
              url: "/mentorship",
            },
          ],
        },
      ],
    },
    {
      title: "Personal",
      items: [
        {
          title: "Mi Perfil",
          url: "/profile",
          icon: User,
        },
        // Note: No Reports for adolescents per permission matrix
      ],
    },
  ],
};

// COMPANIES navigation
export const companySidebarData: SidebarData = {
  user: {
    name: "Empresa",
    email: "company@example.com",
    avatar: "/avatars/company.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Publicar Empleos",
          url: "/jobs/create",
          icon: Briefcase,
        },
        {
          title: "Mis Empleos",
          url: "/jobs/manage",
          icon: Building2,
        },
        {
          title: "Gestionar Candidatos",
          url: "/candidates",
          icon: Users,
        },
      ],
    },
    {
      title: "Análisis",
      items: [
        {
          title: "Reportes Empresariales",
          url: "/reports/company",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Configuración",
      items: [
        {
          title: "Perfil de Empresa",
          url: "/profile/company",
          icon: Building2,
        },
      ],
    },
  ],
};

// MUNICIPAL GOVERNMENTS navigation
export const municipalGovernmentSidebarData: SidebarData = {
  user: {
    name: "Gobierno Municipal",
    email: "municipality@example.com",
    avatar: "/avatars/government.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Administración",
      items: [
        {
          title: "Dashboard Administrativo",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Gestión de Usuarios",
          url: "/admin/users",
          icon: UserCog,
        },
      ],
    },
    {
      title: "Programas",
      items: [
        {
          title: "Capacitación",
          icon: GraduationCap,
          items: [
            {
              title: "Gestión de Cursos",
              url: "/admin/courses",
            },
            {
              title: "Crear Curso",
              url: "/admin/courses/create",
            },
            {
              title: "Estudiantes",
              url: "/admin/students",
            },
          ],
        },
        {
          title: "Contenido para Jóvenes",
          icon: Lightbulb,
          items: [
            {
              title: "Gestión de Contenido",
              url: "/admin/youth-content",
            },
            {
              title: "Gestión de Eventos",
              url: "/admin/entrepreneurship/events",
            },
          ],
        },
      ],
    },
    {
      title: "Análisis",
      items: [
        {
          title: "Reportes Avanzados",
          url: "/reports/admin",
          icon: PieChart,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configuración",
          url: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

// TRAINING CENTERS navigation
export const trainingCenterSidebarData: SidebarData = {
  user: {
    name: "Centro de Capacitación",
    email: "training@example.com",
    avatar: "/avatars/training.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Administración",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Gestión de Usuarios",
          url: "/admin/users",
          icon: UserCog,
        },
      ],
    },
    {
      title: "Programas",
      items: [
        {
          title: "Capacitación",
          icon: GraduationCap,
          items: [
            {
              title: "Gestión de Cursos",
              url: "/admin/courses",
            },
            {
              title: "Crear Curso",
              url: "/admin/courses/create",
            },
            {
              title: "Estudiantes",
              url: "/admin/students",
            },
          ],
        },
        {
          title: "Contenido para Jóvenes",
          icon: Lightbulb,
          items: [
            {
              title: "Gestión de Contenido",
              url: "/admin/youth-content",
            },
            {
              title: "Gestión de Eventos",
              url: "/admin/entrepreneurship/events",
            },
          ],
        },
      ],
    },
    {
      title: "Análisis",
      items: [
        {
          title: "Reportes de Capacitación",
          url: "/reports/training",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configuración",
          url: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

// NGOS AND FOUNDATIONS navigation
export const ngoFoundationSidebarData: SidebarData = {
  user: {
    name: "ONG/Fundación",
    email: "ngo@example.com",
    avatar: "/avatars/ngo.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Administración",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Gestión de Usuarios",
          url: "/admin/users",
          icon: UserCog,
        },
      ],
    },
    {
      title: "Programas",
      items: [
        {
          title: "Capacitación",
          icon: GraduationCap,
          items: [
            {
              title: "Gestión de Cursos",
              url: "/admin/courses",
            },
            {
              title: "Crear Curso",
              url: "/admin/courses/create",
            },
            {
              title: "Estudiantes",
              url: "/admin/students",
            },
          ],
        },
        {
          title: "Contenido para Jóvenes",
          icon: Lightbulb,
          items: [
            {
              title: "Gestión de Contenido",
              url: "/admin/youth-content",
            },
            {
              title: "Gestión de Eventos",
              url: "/admin/entrepreneurship/events",
            },
          ],
        },
      ],
    },
    {
      title: "Análisis",
      items: [
        {
          title: "Reportes de Impacto Social",
          url: "/reports/impact",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configuración",
          url: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

export function getSidebarDataByRole(role: UserRole): SidebarData {
  switch (role) {
    case "YOUTH":
      return youthSidebarData;
    case "ADOLESCENTS":
      return adolescentSidebarData;
    case "COMPANIES":
      return companySidebarData;
    case "MUNICIPAL_GOVERNMENTS":
      return municipalGovernmentSidebarData;
    case "TRAINING_CENTERS":
      return trainingCenterSidebarData;
    case "NGOS_AND_FOUNDATIONS":
      return ngoFoundationSidebarData;
    default:
      return youthSidebarData; // fallback
  }
}
