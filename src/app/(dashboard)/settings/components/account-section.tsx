&ldquo;use client&rdquo;;

import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { CalendarClock } from &ldquo;lucide-react&rdquo;;

export function AccountSection() {
  const { profile, user } = useCurrentUser();

  if (!profile || !user) return null;

  // Format user creation date
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString(&ldquo;es-ES&rdquo;, {
        year: &ldquo;numeric&rdquo;,
        month: &ldquo;long&rdquo;,
        day: &ldquo;numeric&rdquo;,
      })
    : &ldquo;N/A&rdquo;;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Cuenta</CardTitle>
        <CardDescription>Detalles sobre tu cuenta y acceso.</CardDescription>
      </CardHeader>
      <CardContent className=&ldquo;space-y-6&rdquo;>
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
          <div className=&ldquo;space-y-1&rdquo;>
            <p className=&ldquo;text-sm font-medium&rdquo;>Email</p>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{user.email}</p>
          </div>

          <div className=&ldquo;space-y-1&rdquo;>
            <p className=&ldquo;text-sm font-medium&rdquo;>Estado</p>
            <div>
              {profile.active ? (
                <Badge
                  variant=&ldquo;outline&rdquo;
                  className=&ldquo;bg-green-50 text-green-700 hover:bg-green-50 border-green-200&rdquo;
                >
                  Activo
                </Badge>
              ) : (
                <Badge
                  variant=&ldquo;outline&rdquo;
                  className=&ldquo;bg-red-50 text-red-700 hover:bg-red-50 border-red-200&rdquo;
                >
                  Inactivo
                </Badge>
              )}
            </div>
          </div>

          <div className=&ldquo;space-y-1&rdquo;>
            <p className=&ldquo;text-sm font-medium&rdquo;>Rol</p>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
              {(profile.role as string) === &ldquo;USER&rdquo; && &ldquo;Usuario&rdquo;}
              {(profile.role as string) === &ldquo;SUPERADMIN&rdquo; && &ldquo;Administrador&rdquo;}
            </p>
          </div>

          <div className=&ldquo;space-y-1&rdquo;>
            <p className=&ldquo;text-sm font-medium&rdquo;>Miembro desde</p>
            <div className=&ldquo;flex items-center gap-1 text-sm text-muted-foreground&rdquo;>
              <CalendarClock className=&ldquo;h-3.5 w-3.5&rdquo; />
              <span>{createdAt}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
