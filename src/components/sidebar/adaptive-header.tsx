&ldquo;use client&rdquo;;

import React from &ldquo;react&rdquo;;
import { usePathname } from &ldquo;next/navigation&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;
import { SidebarTrigger } from &ldquo;@/components/ui/sidebar&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { Search } from &ldquo;./search&rdquo;;
import { ThemeSwitch } from &ldquo;./theme-switch&rdquo;;
import { ProfileDropdown } from &ldquo;./profile-dropdown&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { User, Users, Building2, BookOpen, Target, Shield } from &ldquo;lucide-react&rdquo;;

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

    document.addEventListener(&ldquo;scroll&rdquo;, onScroll, { passive: true });
    return () => document.removeEventListener(&ldquo;scroll&rdquo;, onScroll);
  }, []);

  // Get role-specific breadcrumb formatting
  const getRoleBreadcrumb = (pathname: string, role?: string) => {
    const segments = pathname.split(&ldquo;/&rdquo;).filter(Boolean);

    if (segments.length === 0 || segments[0] === &ldquo;dashboard&rdquo;) {
      switch (role) {
        case &ldquo;YOUTH&rdquo;:
          return &ldquo;Dashboard Personal&rdquo;;
        case &ldquo;ADOLESCENTS&rdquo;:
          return &ldquo;Dashboard Estudiantil&rdquo;;
        case &ldquo;COMPANIES&rdquo;:
          return &ldquo;Dashboard Empresarial&rdquo;;
        case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
          return &ldquo;Dashboard Administrativo&rdquo;;
        case &ldquo;TRAINING_CENTERS&rdquo;:
          return &ldquo;Dashboard Educativo&rdquo;;
        case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
          return &ldquo;Dashboard Social&rdquo;;
        default:
          return &ldquo;Dashboard&rdquo;;
      }
    }

    // Format other pages based on role context
    const formattedSegments = segments.map((segment) => {
      switch (segment) {
        case &ldquo;jobs&rdquo;:
          return role === &ldquo;COMPANIES&rdquo; ? &ldquo;Mis Empleos&rdquo; : &ldquo;Empleos&rdquo;;
        case &ldquo;my-applications&rdquo;:
          return &ldquo;Mis Postulaciones&rdquo;;
        case &ldquo;training&rdquo;:
          return role === &ldquo;COMPANIES&rdquo; ? &ldquo;Capacitación&rdquo; : &ldquo;Mis Cursos&rdquo;;
        case &ldquo;entrepreneurship&rdquo;:
          return &ldquo;Emprendimiento&rdquo;;
        case &ldquo;reports&rdquo;:
          return role === &ldquo;COMPANIES&rdquo; ? &ldquo;Reportes Empresariales&rdquo; : &ldquo;Reportes&rdquo;;
        case &ldquo;profile&rdquo;:
          return role === &ldquo;COMPANIES&rdquo; ? &ldquo;Perfil Empresarial&rdquo; : &ldquo;Mi Perfil&rdquo;;
        case &ldquo;candidates&rdquo;:
          return &ldquo;Candidatos&rdquo;;
        case &ldquo;admin&rdquo;:
          return &ldquo;Administración&rdquo;;
        default:
          return segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    });

    return formattedSegments.join(&ldquo; / &rdquo;);
  };

  // Get role-specific icon and label
  const getRoleInfo = (role?: string) => {
    switch (role) {
      case &ldquo;YOUTH&rdquo;:
        return {
          icon: User,
          label: &ldquo;Joven&rdquo;,
          color: &ldquo;bg-blue-100 text-blue-800&rdquo;,
        };
      case &ldquo;ADOLESCENTS&rdquo;:
        return {
          icon: Users,
          label: &ldquo;Adolescente&rdquo;,
          color: &ldquo;bg-purple-100 text-purple-800&rdquo;,
        };
      case &ldquo;COMPANIES&rdquo;:
        return {
          icon: Building2,
          label: &ldquo;Empresa&rdquo;,
          color: &ldquo;bg-green-100 text-green-800&rdquo;,
        };
      case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
        return {
          icon: Shield,
          label: &ldquo;Gobierno&rdquo;,
          color: &ldquo;bg-red-100 text-red-800&rdquo;,
        };
      case &ldquo;TRAINING_CENTERS&rdquo;:
        return {
          icon: BookOpen,
          label: &ldquo;Centro&rdquo;,
          color: &ldquo;bg-orange-100 text-orange-800&rdquo;,
        };
      case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
        return {
          icon: Target,
          label: &ldquo;ONG&rdquo;,
          color: &ldquo;bg-teal-100 text-teal-800&rdquo;,
        };
      default:
        return {
          icon: User,
          label: &ldquo;Usuario&rdquo;,
          color: &ldquo;bg-gray-100 text-gray-800&rdquo;,
        };
    }
  };

  // Check if search should be shown for this role
  const shouldShowSearch = (role?: string) => {
    return [&ldquo;YOUTH&rdquo;, &ldquo;ADOLESCENTS&rdquo;, &ldquo;COMPANIES&rdquo;].includes(role || &ldquo;&rdquo;);
  };

  const formattedPath = getRoleBreadcrumb(pathname, profile?.role);
  const roleInfo = getRoleInfo(profile?.role);
  const showSearch = shouldShowSearch(profile?.role);

  return (
    <header
      className={cn(
        &ldquo;flex h-16 items-center gap-3 bg-background p-4 sm:gap-4 border-b&rdquo;,
        fixed && &ldquo;header-fixed peer/header fixed z-50 w-[inherit] rounded-md&rdquo;,
        offset > 10 && fixed ? &ldquo;shadow-md&rdquo; : &ldquo;shadow-none&rdquo;,
        className
      )}
      {...props}
    >
      <SidebarTrigger variant=&ldquo;outline&rdquo; className=&ldquo;scale-125 sm:scale-100&rdquo; />
      <Separator orientation=&ldquo;vertical&rdquo; className=&ldquo;h-6&rdquo; />

      {/* Role-specific breadcrumb */}
      <div className=&ldquo;flex items-center gap-2 flex-1&rdquo;>
        <span className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
          {formattedPath}
        </span>

        {/* Role badge */}
        {!isLoading && profile && (
          <Badge className={cn(&ldquo;ml-2 text-xs&rdquo;, roleInfo.color)}>
            <roleInfo.icon className=&ldquo;w-3 h-3 mr-1&rdquo; />
            {roleInfo.label}
          </Badge>
        )}
      </div>

      {/* Role-specific actions */}
      <div className=&ldquo;ml-auto flex items-center space-x-4&rdquo;>
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
