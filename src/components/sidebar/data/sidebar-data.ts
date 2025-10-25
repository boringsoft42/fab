import {
  AlertCircle,
  AppWindow,
  AudioWaveform,
  Ban,
  Bug,
  CheckSquare,
  Command,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LockKeyhole,
  MessageSquare,
  Settings,
  ServerCrash,
  UserX,
  Users,
  Building2,
  UserCheck,
  Award,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Administración",
      items: [
        {
          title: "Usuarios",
          icon: Users,
          items: [
            {
              title: "Usuarios Pendientes",
              url: "/users/pending",
              icon: UserCheck,
            },
            {
              title: "Administradores",
              url: "/users/admins",
              icon: Award,
            },
          ],
        },
        {
          title: "Asociaciones",
          icon: Building2,
          items: [
            {
              title: "Ver Todas",
              url: "/associations",
            },
            {
              title: "Crear Nueva",
              url: "/associations/new",
            },
          ],
        },
        {
          title: "Eventos",
          url: "/events",
          icon: Calendar,
        },
        {
          title: "Pagos",
          url: "/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Configuración",
      items: [
        {
          title: "Mi Perfil",
          icon: Users,
          url: "/profile",
        },
        {
          title: "Ajustes",
          icon: Settings,
          url: "/settings",
        },
      ],
    },
  ],
};
