"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthContext } from "@/hooks/use-auth";
import { useUserColors } from "@/hooks/use-user-colors";
import { ProfileDropdown } from "./profile-dropdown";

interface AdaptiveHeaderProps {
  title: string;
  breadcrumbs?: string[];
  userRole?: string;
  showSearch?: boolean;
  showThemeSwitch?: boolean;
  showProfileDropdown?: boolean;
}

export function AdaptiveHeader({
  title,
  breadcrumbs = [],
  userRole,
  showSearch = true,
  showThemeSwitch = true,
  showProfileDropdown = true,
}: AdaptiveHeaderProps) {
  const { user } = useAuthContext();
  
  // Usar el hook para aplicar las variables CSS automáticamente
  useUserColors();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="text-muted-foreground">
            {crumb}
          </span>
        ))}
        {breadcrumbs.length > 0 && (
          <span className="text-muted-foreground">/</span>
        )}
        <span className="font-medium">{title}</span>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        {userRole && (
          <Badge variant="secondary" className="ml-2">
            {userRole}
          </Badge>
        )}
        
        {showSearch && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Button>
        )}
        
        {showThemeSwitch && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </Button>
        )}
        
        {showProfileDropdown && user && (
          <ProfileDropdown />
        )}
      </div>
    </header>
  );
}
