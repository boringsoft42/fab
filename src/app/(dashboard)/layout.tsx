import { DashboardLayoutClient } from &ldquo;@/components/dashboard/dashboard-layout-client&rdquo;;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
