import type { LucideIcon } from &ldquo;lucide-react&rdquo;;

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

interface BaseNavItem {
  title: string;
  icon?: LucideIcon;
  badge?: string;
}

export interface NavLink extends BaseNavItem {
  url: string;
  items?: never;
}

export interface NavCollapsible extends BaseNavItem {
  items: NavLink[];
  url?: never;
}

export type NavItem = NavLink | NavCollapsible;

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
}

export type NavGroupProps = NavGroup;

export interface SidebarItem {
  title: string;
  items: {
    title: string;
    icon?: LucideIcon;
    href: string;
    items?: {
      title: string;
      href: string;
    }[];
  }[];
}

export interface SidebarData {
  [key: string]: {
    title: string;
    items: {
      title: string;
      icon?: LucideIcon;
      url: string;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  }[];
}
