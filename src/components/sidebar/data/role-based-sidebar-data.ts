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
  Newspaper,
  UserCircle,
} from &ldquo;lucide-react&rdquo;;
import type { SidebarData, SidebarItem } from &ldquo;../types&rdquo;;
import type { UserRole } from &ldquo;@prisma/client&rdquo;;

const commonTeams = [
  {
    name: &ldquo;CEMSE Platform&rdquo;,
    logo: Command,
    plan: &ldquo;Employability & Entrepreneurship&rdquo;,
  },
  {
    name: &ldquo;Cochabamba&rdquo;,
    logo: GalleryVerticalEnd,
    plan: &ldquo;Regional Hub&rdquo;,
  },
  {
    name: &ldquo;Bolivia&rdquo;,
    logo: AudioWaveform,
    plan: &ldquo;National Network&rdquo;,
  },
];

// YOUTH navigation
export const youthSidebarData: SidebarData = {
  user: {
    name: &ldquo;Usuario Joven&rdquo;,
    email: &ldquo;youth@example.com&rdquo;,
    avatar: &ldquo;/avatars/youth.jpg&rdquo;,
  },
  teams: commonTeams,
  navGroups: [
    {
      title: &ldquo;Principal&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard&rdquo;,
          url: &ldquo;/dashboard&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Buscar Empleos&rdquo;,
          url: &ldquo;/jobs&rdquo;,
          icon: Search,
        },
        {
          title: &ldquo;Mis Postulaciones&rdquo;,
          url: &ldquo;/my-applications&rdquo;,
          icon: FileText,
        },
        {
          title: &ldquo;Mis Entrevistas&rdquo;,
          url: &ldquo;/my-interviews&rdquo;,
          icon: FileText,
        },
      ],
    },
    {
      title: &ldquo;Desarrollo&rdquo;,
      items: [
        {
          title: &ldquo;Capacitación&rdquo;,
          icon: GraduationCap,
          items: [
            {
              title: &ldquo;Cursos Disponibles&rdquo;,
              url: &ldquo;/courses&rdquo;,
            },
            {
              title: &ldquo;Mis Cursos&rdquo;,
              url: &ldquo;/my-courses&rdquo;,
            },
            {
              title: &ldquo;Certificados&rdquo;,
              url: &ldquo;/certificates&rdquo;,
            },
          ],
        },
        {
          title: &ldquo;Emprendimiento&rdquo;,
          icon: Lightbulb,
          items: [
            {
              title: &ldquo;Hub de Emprendimiento&rdquo;,
              url: &ldquo;/entrepreneurship&rdquo;,
            },
            {
              title: &ldquo;Simulador de Plan de Negocios&rdquo;,
              url: &ldquo;/business-plan-simulator&rdquo;,
            },
            {
              title: &ldquo;Centro de Recursos&rdquo;,
              url: &ldquo;/entrepreneurship/resources&rdquo;,
            },
            {
              title: &ldquo;Publicar mi Emprendimiento&rdquo;,
              url: &ldquo;/publish-entrepreneurship&rdquo;,
            },
            {
              title: &ldquo;Mentorías&rdquo;,
              url: &ldquo;/mentorship&rdquo;,
            },
          ],
        },
      ],
    },
    {
      title: &ldquo;Recursos de Emprendimiento&rdquo;,
      items: [
        {
          title: &ldquo;Directorio de Instituciones&rdquo;,
          url: &ldquo;/entrepreneurship/directory&rdquo;,
          icon: Building2,
        },
        {
          title: &ldquo;Red de Contactos&rdquo;,
          url: &ldquo;/entrepreneurship/network&rdquo;,
          icon: Users,
        },
      ],
    },
    {
      title: &ldquo;Información&rdquo;,
      items: [
        {
          title: &ldquo;Noticias&rdquo;,
          icon: Newspaper,
          url: &ldquo;/news&rdquo;,
        },
      ],
    },
    {
      title: &ldquo;Personal&rdquo;,
      items: [
        {
          title: &ldquo;Mi Perfil&rdquo;,
          url: &ldquo;/profile&rdquo;,
          icon: User,
        },
        // {
        //   title: &ldquo;Reportes Personales&rdquo;,
        //   url: &ldquo;/reports/personal&rdquo;,
        //   icon: BarChart3,
        // },
      ],
    },
  ],
};


// ADOLESCENTS navigation (similar to youth but no reports)
export const adolescentSidebarData: SidebarData = {
  user: {
    name: &ldquo;Usuario Adolescente&rdquo;,
    email: &ldquo;adolescent@example.com&rdquo;,
    avatar: &ldquo;/avatars/adolescent.jpg&rdquo;,
  },
  teams: commonTeams,
  navGroups: [
    {
      title: &ldquo;Principal&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard&rdquo;,
          url: &ldquo;/dashboard&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Buscar Empleos&rdquo;,
          url: &ldquo;/jobs&rdquo;,
          icon: Search,
        },
        {
          title: &ldquo;Mis Postulaciones&rdquo;,
          url: &ldquo;/my-applications&rdquo;,
          icon: FileText,
        },
      ],
    },
    {
      title: &ldquo;Desarrollo&rdquo;,
      items: [
        {
          title: &ldquo;Capacitación&rdquo;,
          icon: GraduationCap,
          items: [
            {
              title: &ldquo;Cursos Disponibles&rdquo;,
              url: &ldquo;/courses&rdquo;,
            },
            {
              title: &ldquo;Mis Cursos&rdquo;,
              url: &ldquo;/my-courses&rdquo;,
            },
            {
              title: &ldquo;Certificados&rdquo;,
              url: &ldquo;/certificates&rdquo;,
            },
          ],
        },
        {
          title: &ldquo;Emprendimiento&rdquo;,
          icon: Lightbulb,
          items: [
            {
              title: &ldquo;Hub de Emprendimiento&rdquo;,
              url: &ldquo;/entrepreneurship&rdquo;,
            },
            {
              title: &ldquo;Simulador de Plan de Negocios&rdquo;,
              url: &ldquo;/business-plan-simulator&rdquo;,
            },
            {
              title: &ldquo;Centro de Recursos&rdquo;,
              url: &ldquo;/entrepreneurship/resources&rdquo;,
            },
            // {
            //   title: &ldquo;Directorio de Instituciones&rdquo;,
            //   url: &ldquo;/entrepreneurship/directory&rdquo;,
            // },
            {
              title: &ldquo;Publicar mi Emprendimiento&rdquo;,
              url: &ldquo;/publish-entrepreneurship&rdquo;,
            },
            // {
            //   title: &ldquo;Red de Contactos&rdquo;,
            //   url: &ldquo;/entrepreneurship/network&rdquo;,
            // },
            {
              title: &ldquo;Mentorías&rdquo;,
              url: &ldquo;/mentorship&rdquo;,
            },
          ],
        },
      ],
    },
    {
      title: &ldquo;Personal&rdquo;,
      items: [
        {
          title: &ldquo;Mi Perfil&rdquo;,
          url: &ldquo;/profile&rdquo;,
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
    name: &ldquo;Empresa&rdquo;,
    email: &ldquo;company@example.com&rdquo;,
    avatar: &ldquo;/avatars/company.jpg&rdquo;,
  },
  teams: commonTeams,
  navGroups: [
    {
      title: &ldquo;Principal&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard&rdquo;,
          url: &ldquo;/dashboard&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Publicar Empleos&rdquo;,
          url: &ldquo;/jobs/create&rdquo;,
          icon: Briefcase,
        },
        {
          title: &ldquo;Mis Empleos&rdquo;,
          url: &ldquo;/jobs/manage&rdquo;,
          icon: Building2,
        },
        {
          title: &ldquo;Gestionar Candidatos&rdquo;,
          url: &ldquo;/job-publishing/candidates&rdquo;,
          icon: Users,
        },
      ],
    },
    {
      title: &ldquo;Comunicación&rdquo;,
      items: [
        {
          title: &ldquo;Gestión de Noticias&rdquo;,
          url: &ldquo;/company/news&rdquo;,
          icon: FileText,
        },
      ],
    },
    // {
    //   title: &ldquo;Análisis&rdquo;,
    //   items: [
    //     {
    //       title: &ldquo;Reportes Empresariales&rdquo;,
    //       url: &ldquo;/company/report&rdquo;,
    //       icon: BarChart3,
    //     },
    //   ],
    // },
    {
      title: &ldquo;Configuración&rdquo;,
      items: [
        {
          title: &ldquo;Perfil de Empresa&rdquo;,
          url: &ldquo;/company/profile&rdquo;,
          icon: Building2,
        },
      ],
    },
  ],
};

// MUNICIPAL GOVERNMENTS navigation
export const municipalGovernmentSidebarData: SidebarData = {
  user: {
    name: &ldquo;Gobierno Municipal&rdquo;,
    email: &ldquo;municipality@example.com&rdquo;,
    avatar: &ldquo;/avatars/government.jpg&rdquo;,
  },
  teams: commonTeams,
  navGroups: [
    {
      title: &ldquo;Administración&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard Administrativo&rdquo;,
          url: &ldquo;/dashboard&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Gestión de Usuarios&rdquo;,
          url: &ldquo;/admin/users&rdquo;,
          icon: UserCog,
        },
      ],
    },
    {
      title: &ldquo;Programas&rdquo;,
      items: [
        {
          title: &ldquo;Capacitación&rdquo;,
          icon: GraduationCap,
          items: [
            {
              title: &ldquo;Gestión de Cursos&rdquo;,
              url: &ldquo;/admin/courses&rdquo;,
            },
            // {
            //   title: &ldquo;Crear Curso&rdquo;,
            //   url: &ldquo;/admin/courses/create&rdquo;,
            // },
            {
              title: &ldquo;Estudiantes&rdquo;,
              url: &ldquo;/admin/students&rdquo;,
            },
          ],
        },
        {
          title: &ldquo;Contenido para Jóvenes&rdquo;,
          icon: Lightbulb,
          items: [
            {
              title: &ldquo;Gestión de Contenido&rdquo;,
              url: &ldquo;/admin/youth-content&rdquo;,
            },
            // {
            //   title: &ldquo;Gestión de Eventos&rdquo;,
            //   url: &ldquo;/admin/entrepreneurship/events&rdquo;,
            // },
          ],
        },
      ],
    },
    {
      title: &ldquo;Comunicación&rdquo;,
      items: [
        {
          title: &ldquo;Gestión de Noticias&rdquo;,
          url: &ldquo;/admin/news&rdquo;,
          icon: FileText,
        },
      ],
    },
    {
      title: &ldquo;Análisis&rdquo;,
      items: [
        {
          title: &ldquo;Reportes Avanzados&rdquo;,
          url: &ldquo;/reports/admin&rdquo;,
          icon: PieChart,
        },
      ],
    },
    {
      title: &ldquo;Sistema&rdquo;,
      items: [
        {
          title: &ldquo;Perfil&rdquo;,
          url: &ldquo;/admin/settings&rdquo;,
          icon: Settings,
        },
      ],
    },
  ],
};

// TRAINING CENTERS navigation
export const trainingCenterSidebarData: SidebarData = {
  user: {
    name: &ldquo;Centro de Capacitación&rdquo;,
    email: &ldquo;training@example.com&rdquo;,
    avatar: &ldquo;/avatars/training.jpg&rdquo;,
  },
  teams: commonTeams,
  navGroups: [
    {
      title: &ldquo;Administración&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard&rdquo;,
          url: &ldquo;/dashboard&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Gestión de Usuarios&rdquo;,
          url: &ldquo;/admin/users&rdquo;,
          icon: UserCog,
        },
      ],
    },
    {
      title: &ldquo;Programas&rdquo;,
      items: [
        {
          title: &ldquo;Capacitación&rdquo;,
          icon: GraduationCap,
          items: [
            {
              title: &ldquo;Gestión de Cursos&rdquo;,
              url: &ldquo;/admin/courses&rdquo;,
            },
            {
              title: &ldquo;Crear Curso&rdquo;,
              url: &ldquo;/admin/courses/create&rdquo;,
            },
            {
              title: &ldquo;Estudiantes&rdquo;,
              url: &ldquo;/admin/students&rdquo;,
            },
          ],
        },
        {
          title: &ldquo;Contenido para Jóvenes&rdquo;,
          icon: Lightbulb,
          items: [
            {
              title: &ldquo;Gestión de Contenido&rdquo;,
              url: &ldquo;/admin/youth-content&rdquo;,
            },
            {
              title: &ldquo;Gestión de Eventos&rdquo;,
              url: &ldquo;/admin/entrepreneurship/events&rdquo;,
            },
          ],
        },
      ],
    },
    {
      title: &ldquo;Comunicación&rdquo;,
      items: [
        {
          title: &ldquo;Gestión de Noticias&rdquo;,
          url: &ldquo;/admin/news&rdquo;,
          icon: FileText,
        },
      ],
    },
    {
      title: &ldquo;Análisis&rdquo;,
      items: [
        {
          title: &ldquo;Reportes de Capacitación&rdquo;,
          url: &ldquo;/reports/training&rdquo;,
          icon: BarChart3,
        },
      ],
    },
    {
      title: &ldquo;Sistema&rdquo;,
      items: [
        {
          title: &ldquo;Configuración&rdquo;,
          url: &ldquo;/admin/settings&rdquo;,
          icon: Settings,
        },
      ],
    },
  ],
};

// NGOS AND FOUNDATIONS navigation
export const ngoFoundationSidebarData: SidebarData = {
  user: {
    name: &ldquo;ONG/Fundación&rdquo;,
    email: &ldquo;ngo@example.com&rdquo;,
    avatar: &ldquo;/avatars/ngo.jpg&rdquo;,
  },
  teams: commonTeams,
  navGroups: [
    {
      title: &ldquo;Administración&rdquo;,
      items: [
        {
          title: &ldquo;Dashboard&rdquo;,
          url: &ldquo;/dashboard&rdquo;,
          icon: LayoutDashboard,
        },
        {
          title: &ldquo;Gestión de Usuarios&rdquo;,
          url: &ldquo;/admin/users&rdquo;,
          icon: UserCog,
        },
      ],
    },
    {
      title: &ldquo;Programas&rdquo;,
      items: [
        {
          title: &ldquo;Capacitación&rdquo;,
          icon: GraduationCap,
          items: [
            {
              title: &ldquo;Gestión de Cursos&rdquo;,
              url: &ldquo;/admin/courses&rdquo;,
            },
            {
              title: &ldquo;Crear Curso&rdquo;,
              url: &ldquo;/admin/courses/create&rdquo;,
            },
            {
              title: &ldquo;Estudiantes&rdquo;,
              url: &ldquo;/admin/students&rdquo;,
            },
          ],
        },
        {
          title: &ldquo;Contenido para Jóvenes&rdquo;,
          icon: Lightbulb,
          items: [
            {
              title: &ldquo;Gestión de Contenido&rdquo;,
              url: &ldquo;/admin/youth-content&rdquo;,
            },
            {
              title: &ldquo;Gestión de Eventos&rdquo;,
              url: &ldquo;/admin/entrepreneurship/events&rdquo;,
            },
          ],
        },
      ],
    },
    {
      title: &ldquo;Comunicación&rdquo;,
      items: [
        {
          title: &ldquo;Gestión de Noticias&rdquo;,
          url: &ldquo;/admin/news&rdquo;,
          icon: FileText,
        },
      ],
    },
    {
      title: &ldquo;Análisis&rdquo;,
      items: [
        {
          title: &ldquo;Reportes de Impacto Social&rdquo;,
          url: &ldquo;/reports/impact&rdquo;,
          icon: BarChart3,
        },
      ],
    },
    {
      title: &ldquo;Sistema&rdquo;,
      items: [
        {
          title: &ldquo;Configuración&rdquo;,
          url: &ldquo;/admin/settings&rdquo;,
          icon: Settings,
        },
      ],
    },
  ],
};

export function getSidebarDataByRole(role: UserRole): SidebarData {
  switch (role) {
    case &ldquo;YOUTH&rdquo;:
      return youthSidebarData;
    case &ldquo;ADOLESCENTS&rdquo;:
      return adolescentSidebarData;
    case &ldquo;COMPANIES&rdquo;:
      return companySidebarData;
    case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
      return municipalGovernmentSidebarData;
    case &ldquo;TRAINING_CENTERS&rdquo;:
      return trainingCenterSidebarData;
    case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
      return ngoFoundationSidebarData;
    default:
      return youthSidebarData; // fallback
  }
}

export const youthSidebarItems: SidebarItem[] = [
  {
    title: &ldquo;Principal&rdquo;,
    items: [
      {
        title: &ldquo;Dashboard&rdquo;,
        icon: LayoutDashboard,
        href: &ldquo;/dashboard&rdquo;,
      },
      {
        title: &ldquo;Buscar Empleos&rdquo;,
        icon: Briefcase,
        href: &ldquo;/jobs&rdquo;,
      },
      {
        title: &ldquo;Mis Postulaciones&rdquo;,
        icon: Briefcase,
        href: &ldquo;/my-applications&rdquo;,
      },
    ],
  },
  {
    title: &ldquo;Desarrollo&rdquo;,
    items: [
      {
        title: &ldquo;Capacitación&rdquo;,
        icon: GraduationCap,
        href: &ldquo;/courses&rdquo;,
        items: [
          {
            title: &ldquo;Explorar Cursos&rdquo;,
            href: &ldquo;/courses&rdquo;,
          },
          {
            title: &ldquo;Mis Cursos&rdquo;,
            href: &ldquo;/my-courses&rdquo;,
          },
        ],
      },
      {
        title: &ldquo;Emprendimiento&rdquo;,
        icon: Lightbulb,
        href: &ldquo;/entrepreneurship&rdquo;,
        items: [
          {
            title: &ldquo;Recursos&rdquo;,
            href: &ldquo;/entrepreneurship/resources&rdquo;,
          },
          {
            title: &ldquo;Directorio&rdquo;,
            href: &ldquo;/entrepreneurship/directory&rdquo;,
          },
          {
            title: &ldquo;Red de Contactos&rdquo;,
            href: &ldquo;/entrepreneurship/network&rdquo;,
          },
        ],
      },
    ],
  },
  {
    title: &ldquo;Información&rdquo;,
    items: [
      {
        title: &ldquo;Noticias&rdquo;,
        icon: Newspaper,
        href: &ldquo;/news&rdquo;,
      },
    ],
  },
  {
    title: &ldquo;Personal&rdquo;,
    items: [
      {
        title: &ldquo;Mi Perfil&rdquo;,
        icon: UserCircle,
        href: &ldquo;/profile&rdquo;,
      },
      // {
      //   title: &ldquo;Reportes Personales&rdquo;,
      //   icon: BarChart3,
      //   href: &ldquo;/reports&rdquo;,
      // },
    ],
  },
];
