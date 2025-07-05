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
import { sidebarData } from &ldquo;./data/sidebar-data&rdquo;;
import type { NavGroupProps } from &ldquo;./types&rdquo;;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
