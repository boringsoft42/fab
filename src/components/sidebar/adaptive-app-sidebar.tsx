"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { getSidebarDataByRole } from "./data/role-based-sidebar-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavGroupProps } from "./types";

export function AdaptiveAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { profile, isLoading } = useCurrentUser();

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Sidebar collapsible="icon" variant="floating" {...props}>
        <SidebarHeader>
          <Skeleton className="h-10 w-full" />
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-4 p-4">
            <Skeleton className="h-6 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-6 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Skeleton className="h-10 w-full" />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  // Get sidebar data based on user role, fallback to YOUTH if no profile
  const userRole = profile?.role || "YOUTH";
  const sidebarData = getSidebarDataByRole(userRole);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props: NavGroupProps) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
