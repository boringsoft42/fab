"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Search } from "./search";
import { ThemeSwitch } from "./theme-switch";
import { ProfileDropdown } from "./profile-dropdown";
import { Badge } from "@/components/ui/badge";
import { User, Users, Building2, BookOpen, Target, Shield } from "lucide-react";

type UserRole =
  | "YOUTH"
  | "ADOLESCENTS"
  | "COMPANIES"
  | "MUNICIPAL_GOVERNMENTS"
  | "TRAINING_CENTERS"
  | "NGOS_AND_FOUNDATIONS"
  | "SUPERADMIN";

interface AdaptiveHeaderProps {
  className?: string;
  fixed?: boolean;
  children?: React.ReactNode;
}

export function AdaptiveHeader({
  className,
  fixed,
  children,
  ...props
}: AdaptiveHeaderProps) {
  const [offset, setOffset] = React.useState(0);
  const pathname = usePathname();
  const { profile, isLoading } = useCurrentUser();

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  // Get role-specific breadcrumb formatting
  const getRoleBreadcrumb = (pathname: string, role?: UserRole | null) => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0 || segments[0] === "dashboard") {
      switch (role) {
        case "YOUTH":
          return "Dashboard Personal";
        case "ADOLESCENTS":
          return "Dashboard Estudiantil";
        case "COMPANIES":
          return "Dashboard Empresarial";
        case "MUNICIPAL_GOVERNMENTS":
          return "Dashboard Administrativo";
        case "TRAINING_CENTERS":
          return "Dashboard Educativo";
        case "NGOS_AND_FOUNDATIONS":
          return "Dashboard Social";
        default:
          return "Dashboard";
      }
    }

    // Format other pages based on role context
    const formattedSegments = segments.map((segment) => {
      switch (segment) {
        case "jobs":
          return role === "COMPANIES" ? "Mis Empleos" : "Empleos";
        case "my-applications":
          return "Mis Postulaciones";
        case "training":
          return role === "COMPANIES" ? "Capacitación" : "Mis Cursos";
        case "entrepreneurship":
          return "Emprendimiento";
        case "reports":
          return role === "COMPANIES" ? "Reportes Empresariales" : "Reportes";
        case "profile":
          return role === "COMPANIES" ? "Perfil Empresarial" : "Mi Perfil";
        case "candidates":
          return "Candidatos";
        case "admin":
          return "Administración";
        default:
          return segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    });

    return formattedSegments.join(" / ");
  };

  // Get role-specific icon and label
  const getRoleInfo = (role?: UserRole | null) => {
    switch (role) {
      case "YOUTH":
        return {
          icon: User,
          label: "Joven",
          color: "bg-blue-100 text-blue-800",
        };
      case "ADOLESCENTS":
        return {
          icon: Users,
          label: "Adolescente",
          color: "bg-purple-100 text-purple-800",
        };
      case "COMPANIES":
        return {
          icon: Building2,
          label: "Empresa",
          color: "bg-green-100 text-green-800",
        };
      case "MUNICIPAL_GOVERNMENTS":
        return {
          icon: Shield,
          label: "Gobierno",
          color: "bg-red-100 text-red-800",
        };
      case "TRAINING_CENTERS":
        return {
          icon: BookOpen,
          label: "Centro",
          color: "bg-orange-100 text-orange-800",
        };
      case "NGOS_AND_FOUNDATIONS":
        return {
          icon: Target,
          label: "ONG",
          color: "bg-teal-100 text-teal-800",
        };
      default:
        return {
          icon: User,
          label: "Usuario",
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Check if search should be shown for this role
  const shouldShowSearch = (role?: UserRole | null) => {
    return ["YOUTH", "ADOLESCENTS", "COMPANIES"].includes(role || "");
  };

  const formattedPath = getRoleBreadcrumb(pathname, profile?.role as UserRole);
  const roleInfo = getRoleInfo(profile?.role as UserRole);
  const showSearch = shouldShowSearch(profile?.role as UserRole);

  return (
    <header
      className={cn(
        "flex h-16 items-center gap-3 bg-background p-4 sm:gap-4 border-b",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
        offset > 10 && fixed ? "shadow-md" : "shadow-none",
        className
      )}
      {...props}
    >
      <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" />
      <Separator orientation="vertical" className="h-6" />

      {/* Role-specific breadcrumb */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium text-muted-foreground">
          {formattedPath}
        </span>

        {/* Role badge */}
        {!isLoading && profile && (
          <Badge className={cn("ml-2 text-xs", roleInfo.color)}>
            {React.createElement(roleInfo.icon, { className: "w-3 h-3 mr-1" })}
            {roleInfo.label}
          </Badge>
        )}
      </div>

      {/* Role-specific actions */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Show search only for roles that need it */}
        {showSearch && <Search />}

        {/* Always show theme switch */}
        <ThemeSwitch />

        {/* Always show profile dropdown */}
        <ProfileDropdown />
      </div>

      {children}
    </header>
  );
}
