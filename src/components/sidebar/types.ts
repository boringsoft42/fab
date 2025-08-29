import type { LucideIcon } from "lucide-react";

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
  disabled?: boolean;
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
  customColors?: {
    primary: string;
    secondary: string;
    primaryForeground: string;
    secondaryForeground: string;
  };
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
