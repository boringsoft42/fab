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
              title: "Centro de Recursos",
              url: "/entrepreneurship/resources",
            },
            {
              title: "Simulador de Plan",
              url: "/entrepreneurship/business-plan",
            },
            {
              title: "Mi Emprendimiento",
              url: "/entrepreneurship/my-business",
            },
            {
              title: "Marketplace",
              url: "/entrepreneurship/marketplace",
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
              title: "Centro de Recursos",
              url: "/entrepreneurship/resources",
            },
            {
              title: "Simulador de Plan",
              url: "/entrepreneurship/business-plan",
            },
            {
              title: "Mi Emprendimiento",
              url: "/entrepreneurship/my-business",
            },
            {
              title: "Marketplace",
              url: "/entrepreneurship/marketplace",
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
            {
              title: "Instructores",
              url: "/admin/instructors",
            },
          ],
        },
        {
          title: "Emprendimiento",
          icon: Lightbulb,
          items: [
            {
              title: "Gestión de Programas",
              url: "/admin/entrepreneurship/programs",
            },
            {
              title: "Emprendedores",
              url: "/admin/entrepreneurship/entrepreneurs",
            },
            {
              title: "Mentorías",
              url: "/admin/entrepreneurship/mentorship",
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
      title: "Educación",
      items: [
        {
          title: "Dashboard Educativo",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Gestión de Cursos",
          icon: BookOpen,
          items: [
            {
              title: "Todos los Cursos",
              url: "/admin/courses",
            },
            {
              title: "Crear Curso",
              url: "/admin/courses/create",
            },
          ],
        },
        {
          title: "Estudiantes",
          url: "/admin/students",
          icon: Users,
        },
        {
          title: "Instructores",
          url: "/admin/instructors",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "Programas",
      items: [
        {
          title: "Emprendimiento",
          icon: Lightbulb,
          items: [
            {
              title: "Gestión de Programas",
              url: "/admin/entrepreneurship/programs",
            },
            {
              title: "Emprendedores",
              url: "/admin/entrepreneurship/entrepreneurs",
            },
            {
              title: "Recursos",
              url: "/admin/entrepreneurship/resources",
            },
          ],
        },
      ],
    },
    {
      title: "Análisis",
      items: [
        {
          title: "Reportes Educativos",
          url: "/reports/educational",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Institución",
      items: [
        {
          title: "Perfil Institucional",
          url: "/profile/institution",
          icon: Building2,
        },
      ],
    },
  ],
};

// NGOs AND FOUNDATIONS navigation
export const ngoSidebarData: SidebarData = {
  user: {
    name: "ONG/Fundación",
    email: "ngo@example.com",
    avatar: "/avatars/ngo.jpg",
  },
  teams: commonTeams,
  navGroups: [
    {
      title: "Social",
      items: [
        {
          title: "Dashboard Social",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
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
            {
              title: "Instructores",
              url: "/admin/instructors",
            },
          ],
        },
        {
          title: "Emprendimiento",
          icon: Lightbulb,
          items: [
            {
              title: "Gestión de Programas",
              url: "/admin/entrepreneurship/programs",
            },
            {
              title: "Emprendedores",
              url: "/admin/entrepreneurship/entrepreneurs",
            },
            {
              title: "Recursos Sociales",
              url: "/admin/entrepreneurship/social-resources",
            },
          ],
        },
      ],
    },
    {
      title: "Análisis",
      items: [
        {
          title: "Impacto Social",
          url: "/reports/social-impact",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Organización",
      items: [
        {
          title: "Perfil de ONG",
          url: "/profile/ngo",
          icon: Building2,
        },
      ],
    },
  ],
};

// Function to get sidebar data based on user role
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
      return ngoSidebarData;
    default:
      return youthSidebarData;
  }
}
