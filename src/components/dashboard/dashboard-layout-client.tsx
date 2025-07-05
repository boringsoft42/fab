&ldquo;use client&rdquo;;

import { cn } from &ldquo;@/lib/utils&rdquo;;
import { SearchProvider } from &ldquo;@/context/search-context&rdquo;;
import { SidebarProvider } from &ldquo;@/components/ui/sidebar&rdquo;;
import { AdaptiveAppSidebar } from &ldquo;@/components/sidebar/adaptive-app-sidebar&rdquo;;
import SkipToMain from &ldquo;@/components/skip-to-main&rdquo;;
import { AdaptiveHeader } from &ldquo;@/components/sidebar/adaptive-header&rdquo;;
import { RoleGuard } from &ldquo;@/components/auth/role-guard&rdquo;;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayoutClient({ children }: DashboardLayoutProps) {
  return (
    <RoleGuard>
      <SearchProvider>
        <SidebarProvider defaultOpen={true}>
          <SkipToMain />
          <AdaptiveAppSidebar className=&ldquo;fixed inset-y-0 left-0 z-20&rdquo; />
          <div
            id=&ldquo;content&rdquo;
            className={cn(
              &ldquo;ml-auto w-full max-w-full&rdquo;,
              &ldquo;peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]&rdquo;,
              &ldquo;peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]&rdquo;,
              &ldquo;transition-[width] duration-200 ease-linear&rdquo;,
              &ldquo;flex min-h-screen flex-col&rdquo;,
              &ldquo;group-data-[scroll-locked=1]/body:h-full&rdquo;,
              &ldquo;group-data-[scroll-locked=1]/body:has-[main.fixed-main]:min-h-screen&rdquo;
            )}
          >
            <AdaptiveHeader />
            {children}
          </div>
        </SidebarProvider>
      </SearchProvider>
    </RoleGuard>
  );
}
