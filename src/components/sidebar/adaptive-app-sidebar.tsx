"use client";

import { useAuthContext } from "@/hooks/use-auth";
import { useUserColors } from "@/hooks/use-user-colors";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import { NavGroup } from "@/components/sidebar/nav-group";
import { NavUser } from "@/components/sidebar/nav-user";
import { useCurrentUser } from "@/hooks/use-current-user";
import { User, Users, Building2, BookOpen, Target, Shield, Crown, GraduationCap, Heart, Briefcase, FileText, BarChart3, Settings, Home, Calendar, MessageSquare, Award, Globe, Zap, Command } from "lucide-react";
import { getSidebarDataByRole } from "./data/role-based-sidebar-data";
import type { UserRole } from "@/types/api";

interface AdaptiveAppSidebarProps {
  className?: string;
}

export function AdaptiveAppSidebar({ className }: AdaptiveAppSidebarProps) {
  const { user } = useAuthContext();
  const { profile } = useCurrentUser();
  
  // Aplicar colores del usuario
  useUserColors();

  // Obtener datos del usuario para el sidebar
  const userRole = profile?.role || "USUARIO";
  const userName = profile?.firstName && profile?.lastName 
    ? `${profile.firstName} ${profile.lastName}` 
    : user?.email || "Usuario";
  const userEmail = user?.email || "";

  // Obtener datos del sidebar basados en el rol del usuario
  const sidebarData = getSidebarDataByRole(userRole as UserRole);
  
  // Definir navegación basada en el rol del usuario
  const getNavigationItems = () => {
    // Para superadmin, usar la navegación completa del archivo role-based-sidebar-data
    if (userRole === "SUPER_ADMIN" || userRole === "SUPERADMIN") {
      return sidebarData.navGroups;
    }
    
    switch (userRole) {

      case "GOBIERNOS_MUNICIPALES":
        // Usar la estructura definida en role-based-sidebar-data.ts
        return sidebarData.navGroups;

      case "EMPRESAS":
        // Usar la estructura definida en role-based-sidebar-data.ts
        return sidebarData.navGroups;

      case "JOVENES":
      case "ADOLESCENTES":
        // Usar la estructura definida en role-based-sidebar-data.ts
        return sidebarData.navGroups;

      case "CENTROS_DE_FORMACION":
        return [
          {
            title: "Educación",
            items: [
              { title: "Dashboard Educativo", url: "/dashboard", icon: Home },
              { title: "Gestión de Cursos", url: "/admin/courses", icon: BookOpen },
              { title: "Estudiantes", url: "/admin/students", icon: GraduationCap },
              { title: "Reportes Educativos", url: "/admin/reports", icon: BarChart3 },
              { title: "Configuración", url: "/admin/settings", icon: Settings },
            ]
          }
        ];

      case "ONGS_Y_FUNDACIONES":
        return [
          {
            title: "Social",
            items: [
              { title: "Dashboard Social", url: "/dashboard", icon: Home },
              { title: "Programas Sociales", url: "/admin/programs", icon: Heart },
              { title: "Beneficiarios", url: "/admin/beneficiaries", icon: Users },
              { title: "Reportes Sociales", url: "/admin/reports", icon: BarChart3 },
              { title: "Configuración", url: "/admin/settings", icon: Settings },
            ]
          }
        ];

      default:
        return [
          {
            title: "General",
            items: [
              { title: "Dashboard", url: "/dashboard", icon: Home },
              { title: "Mi Perfil", url: "/profile", icon: User },
            ]
          }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  // Define teams data for TeamSwitcher
  const teams = [
    {
      name: "CEMSE Platform",
      logo: Command,
      plan: "Employability & Entrepreneurship",
    },
    {
      name: "Cochabamba",
      logo: Globe,
      plan: "Regional Hub",
    },
    {
      name: "Bolivia",
      logo: Zap,
      plan: "National Network",
    },
  ];

  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarInset>
          {navigationItems.map((group, groupIndex) => (
            <NavGroup
              key={groupIndex}
              title={group.title}
              items={group.items}
            />
          ))}
        </SidebarInset>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
