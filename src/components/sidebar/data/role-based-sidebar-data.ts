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
          url: "/training",
          icon: GraduationCap,
          items: [
            {
              title: "Cursos Disponibles",
              url: "/training/courses",
            },
            {
              title: "Mis Cursos",
              url: "/training/my-courses",
            },
            {
              title: "Certificados",
              url: "/training/certificates",
            },
          ],
        },
        {
          title: "Emprendimiento",
          url: "/entrepreneurship",
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
          url: "/training",
          icon: GraduationCap,
          items: [
            {
              title: "Cursos Disponibles",
              url: "/training/courses",
            },
            {
              title: "Mis Cursos",
              url: "/training/my-courses",
            },
            {
              title: "Certificados",
              url: "/training/certificates",
            },
          ],
        },
        {
          title: "Emprendimiento",
          url: "/entrepreneurship",
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
          url: "/admin/training",
          icon: GraduationCap,
          items: [
            {
              title: "Gestión de Cursos",
              url: "/admin/training/courses",
            },
            {
              title: "Estudiantes",
              url: "/admin/training/students",
            },
            {
              title: "Instructores",
              url: "/admin/training/instructors",
            },
          ],
        },
        {
          title: "Emprendimiento",
          url: "/admin/entrepreneurship",
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
          url: "/admin/courses",
          icon: BookOpen,
        },
        {
          title: "Estudiantes",
          url: "/admin/students",
          icon: Users,
        },
      ],
    },
    {
      title: "Programas",
      items: [
        {
          title: "Emprendimiento",
          url: "/admin/entrepreneurship",
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
          title: "Programas de Capacitación",
          url: "/admin/training",
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Desarrollo",
      items: [
        {
          title: "Gestión de Emprendimiento",
          url: "/admin/entrepreneurship",
          icon: Target,
          items: [
            {
              title: "Programas Sociales",
              url: "/admin/entrepreneurship/social-programs",
            },
            {
              title: "Beneficiarios",
              url: "/admin/entrepreneurship/beneficiaries",
            },
            {
              title: "Impacto Social",
              url: "/admin/entrepreneurship/impact",
            },
          ],
        },
      ],
    },
    {
      title: "Impacto",
      items: [
        {
          title: "Reportes de Impacto",
          url: "/reports/impact",
          icon: PieChart,
        },
      ],
    },
    {
      title: "Organización",
      items: [
        {
          title: "Perfil Organizacional",
          url: "/profile/organization",
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
      return youthSidebarData; // Default fallback
  }
}
