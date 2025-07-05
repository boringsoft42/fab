&ldquo;use client&rdquo;;

import Link from &ldquo;next/link&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { BadgeCheck, LogOut, Settings, User } from &ldquo;lucide-react&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { useMockAuth } from &ldquo;@/context/mock-auth-context&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
type UserRole =
  | &ldquo;YOUTH&rdquo;
  | &ldquo;ADOLESCENTS&rdquo;
  | &ldquo;COMPANIES&rdquo;
  | &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;
  | &ldquo;TRAINING_CENTERS&rdquo;
  | &ldquo;NGOS_AND_FOUNDATIONS&rdquo;
  | &ldquo;SUPERADMIN&rdquo;;

export function ProfileDropdown() {
  const { profile, user, isLoading } = useCurrentUser();
  const { signOut } = useMockAuth();
  if (isLoading) {
    return (
      <Button variant=&ldquo;ghost&rdquo; className=&ldquo;relative h-8 w-8 rounded-full&rdquo;>
        <div className=&ldquo;h-8 w-8 rounded-full bg-primary/10 animate-pulse&rdquo; />
      </Button>
    );
  }

  if (!profile || !user) return null;

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(&ldquo; &rdquo;) ||
    user?.name ||
    user?.email?.split(&ldquo;@&rdquo;)[0] ||
    &ldquo;Usuario&rdquo;;

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.firstName || profile?.lastName) {
      return [profile.firstName?.[0], profile.lastName?.[0]]
        .filter(Boolean)
        .join(&ldquo;&rdquo;)
        .toUpperCase();
    }
    if (user?.name) {
      return user.name
        .split(&ldquo; &rdquo;)
        .map((n: string) => n[0])
        .join(&ldquo;&rdquo;)
        .toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || &ldquo;U&rdquo;;
  };

  // Get role display name
  const getRoleDisplay = (role?: UserRole | null) => {
    if (!role) return &ldquo;Sin rol&rdquo;;
    return role
      .toString()
      .replace(&ldquo;_&rdquo;, &ldquo; &rdquo;)
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant=&ldquo;ghost&rdquo; className=&ldquo;relative h-8 w-8 rounded-full&rdquo;>
          <Avatar className=&ldquo;h-8 w-8 ring-2 ring-primary/10&rdquo;>
            <AvatarImage
              src={profile?.profilePicture || &ldquo;&rdquo;}
              alt={displayName || user?.email || &ldquo;User&rdquo;}
            />
            <AvatarFallback className=&ldquo;bg-primary/10&rdquo;>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=&ldquo;w-56&rdquo; align=&ldquo;end&rdquo; forceMount>
        <DropdownMenuLabel className=&ldquo;font-normal&rdquo;>
          <div className=&ldquo;flex flex-col space-y-1&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <p className=&ldquo;text-sm font-medium leading-none&rdquo;>{displayName}</p>
              <Badge variant=&ldquo;outline&rdquo; className=&ldquo;ml-2 text-xs&rdquo;>
                {getRoleDisplay(profile?.role)}
              </Badge>
            </div>
            <p className=&ldquo;text-xs leading-none text-muted-foreground&rdquo;>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href=&ldquo;/profile&rdquo;>
              <User className=&ldquo;mr-2 h-4 w-4&rdquo; />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href=&ldquo;/settings&rdquo;>
              <Settings className=&ldquo;mr-2 h-4 w-4&rdquo; />
              Settings
            </Link>
          </DropdownMenuItem>
          {profile?.role === &ldquo;SUPERADMIN&rdquo; && (
            <DropdownMenuItem asChild>
              <Link href=&ldquo;/admin&rdquo;>
                <BadgeCheck className=&ldquo;mr-2 h-4 w-4&rdquo; />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
            router.replace(&ldquo;/login&rdquo;);
          }}
        >
          <LogOut className=&ldquo;mr-2 h-4 w-4&rdquo; />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
