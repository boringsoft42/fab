&ldquo;use client&rdquo;;

import type { ReactNode } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { usePathname } from &ldquo;next/navigation&rdquo;;
import { ChevronRight } from &ldquo;lucide-react&rdquo;;
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from &ldquo;@/components/ui/collapsible&rdquo;;
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from &ldquo;@/components/ui/sidebar&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import type {
  NavCollapsible,
  NavItem,
  NavLink,
  NavGroup as NavGroupType,
} from &ldquo;./types&rdquo;;

export function NavGroup({ title, items }: NavGroupType) {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item: NavItem) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items)
            return (
              <SidebarMenuLink key={key} item={item} pathname={pathname} />
            );

          if (state === &ldquo;collapsed&rdquo;)
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                pathname={pathname}
              />
            );

          return (
            <SidebarMenuCollapsible key={key} item={item} pathname={pathname} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className=&ldquo;rounded-full px-1 py-0 text-xs&rdquo;>{children}</Badge>
);

function isNavLink(item: NavItem): item is NavLink {
  return &ldquo;url&rdquo; in item;
}

const SidebarMenuLink = ({
  item,
  pathname,
}: {
  item: NavLink;
  pathname: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(pathname, item)}
        tooltip={item.title}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) => {
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(pathname, item, true)}
      className=&ldquo;group/collapsible&rdquo;
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className=&ldquo;ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90&rdquo; />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className=&ldquo;CollapsibleContent&rdquo;>
          <SidebarMenuSub>
            {item.items.map((subItem: NavItem) => {
              if (isNavLink(subItem)) {
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={checkIsActive(pathname, subItem)}
                    >
                      <Link
                        href={subItem.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        {subItem.icon && <subItem.icon />}
                        <span>{subItem.title}</span>
                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              }
              return null;
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(pathname, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className=&ldquo;ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90&rdquo; />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side=&ldquo;right&rdquo; align=&ldquo;start&rdquo; sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : &ldquo;&rdquo;}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub: NavItem) => {
            if (isNavLink(sub)) {
              return (
                <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                  <Link
                    href={sub.url}
                    className={`${checkIsActive(pathname, sub) ? &ldquo;bg-secondary&rdquo; : &ldquo;&rdquo;}`}
                  >
                    {sub.icon && <sub.icon />}
                    <span className=&ldquo;max-w-52 text-wrap&rdquo;>{sub.title}</span>
                    {sub.badge && <span className=&ldquo;ml-auto text-xs&rdquo;>{sub.badge}</span>}
                  </Link>
                </DropdownMenuItem>
              );
            }
            return null;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
  return (
    pathname === item.url || // /endpoint
    !!item?.items?.filter((i: NavItem) => i.url === pathname).length || // if child nav is active
    (mainNav &&
      pathname.split(&ldquo;/&rdquo;)[1] !== &ldquo;&rdquo; &&
      pathname.split(&ldquo;/&rdquo;)[1] === item?.url?.split(&ldquo;/&rdquo;)[1])
  );
}
