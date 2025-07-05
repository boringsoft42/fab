&ldquo;use client&rdquo;;

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from &ldquo;@/components/ui/sidebar&rdquo;;
import { NavGroup } from &ldquo;./nav-group&rdquo;;
import { NavUser } from &ldquo;./nav-user&rdquo;;
import { TeamSwitcher } from &ldquo;./team-switcher&rdquo;;
import { getSidebarDataByRole } from &ldquo;./data/role-based-sidebar-data&rdquo;;
import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import type { NavGroupProps } from &ldquo;./types&rdquo;;

export function AdaptiveAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { profile, isLoading } = useCurrentUser();

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Sidebar collapsible=&ldquo;icon&rdquo; variant=&ldquo;floating&rdquo; {...props}>
        <SidebarHeader>
          <Skeleton className=&ldquo;h-10 w-full&rdquo; />
        </SidebarHeader>
        <SidebarContent>
          <div className=&ldquo;space-y-4 p-4&rdquo;>
            <Skeleton className=&ldquo;h-6 w-20&rdquo; />
            <div className=&ldquo;space-y-2&rdquo;>
              <Skeleton className=&ldquo;h-8 w-full&rdquo; />
              <Skeleton className=&ldquo;h-8 w-full&rdquo; />
              <Skeleton className=&ldquo;h-8 w-full&rdquo; />
            </div>
            <Skeleton className=&ldquo;h-6 w-20&rdquo; />
            <div className=&ldquo;space-y-2&rdquo;>
              <Skeleton className=&ldquo;h-8 w-full&rdquo; />
              <Skeleton className=&ldquo;h-8 w-full&rdquo; />
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Skeleton className=&ldquo;h-10 w-full&rdquo; />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  // Get sidebar data based on user role, fallback to YOUTH if no profile
  const userRole = profile?.role || &ldquo;YOUTH&rdquo;;
  const sidebarData = getSidebarDataByRole(userRole);

  return (
    <Sidebar collapsible=&ldquo;icon&rdquo; variant=&ldquo;floating&rdquo; {...props}>
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
