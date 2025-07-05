&ldquo;use client&rdquo;;

import Link from &ldquo;next/link&rdquo;;
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from &ldquo;lucide-react&rdquo;;
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from &ldquo;@/components/ui/avatar&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from &ldquo;@/components/ui/sidebar&rdquo;;
import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;

export function NavUser() {
  const { isMobile } = useSidebar();
  const { signOut, profile, user } = useAuth();

  if (!profile || !user) return null;

  const displayName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(&ldquo; &rdquo;);

  const getInitials = () => {
    if (profile.firstName || profile.lastName) {
      return [profile.firstName?.[0], profile.lastName?.[0]]
        .filter(Boolean)
        .join(&ldquo;&rdquo;)
        .toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || &ldquo;U&rdquo;;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size=&ldquo;lg&rdquo;
              className=&ldquo;data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground&rdquo;
            >
              <Avatar className=&ldquo;h-8 w-8 rounded-lg ring-2 ring-primary/10&rdquo;>
                <AvatarImage 
                  src={profile.avatarUrl || &ldquo;&rdquo;} 
                  alt={displayName || user.email || &ldquo;User&rdquo;} 
                />
                <AvatarFallback className=&ldquo;rounded-lg bg-primary/10&rdquo;>
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className=&ldquo;grid flex-1 text-left text-sm leading-tight&rdquo;>
                <span className=&ldquo;truncate font-semibold&rdquo;>
                  {displayName || user.email}
                </span>
                <span className=&ldquo;truncate text-xs&rdquo;>{user.email}</span>
              </div>
              <ChevronsUpDown className=&ldquo;ml-auto size-4&rdquo; />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className=&ldquo;w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg&rdquo;
            side={isMobile ? &ldquo;bottom&rdquo; : &ldquo;right&rdquo;}
            align=&ldquo;end&rdquo;
            sideOffset={4}
          >
            <DropdownMenuLabel className=&ldquo;p-0 font-normal&rdquo;>
              <div className=&ldquo;flex items-center gap-2 px-1 py-1.5 text-left text-sm&rdquo;>
                <Avatar className=&ldquo;h-8 w-8 rounded-lg ring-2 ring-primary/10&rdquo;>
                  <AvatarImage 
                    src={profile.avatarUrl || &ldquo;&rdquo;} 
                    alt={displayName || user.email || &ldquo;User&rdquo;} 
                  />
                  <AvatarFallback className=&ldquo;rounded-lg bg-primary/10&rdquo;>
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className=&ldquo;grid flex-1 text-left text-sm leading-tight&rdquo;>
                  <span className=&ldquo;truncate font-semibold&rdquo;>
                    {displayName || user.email}
                  </span>
                  <span className=&ldquo;truncate text-xs&rdquo;>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href=&ldquo;/settings/account&rdquo;>
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href=&ldquo;/settings&rdquo;>
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href=&ldquo;/settings/notifications&rdquo;>
                  <Bell />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
