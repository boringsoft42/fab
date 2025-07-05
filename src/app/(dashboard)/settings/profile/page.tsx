&ldquo;use client&rdquo;;

import { AdaptiveProfileRouter } from &ldquo;@/components/profile/adaptive-profile-router&rdquo;;

export default function ProfilePage() {
  return (
    <div className=&ldquo;space-y-6&rdquo;>
      <div className=&ldquo;space-y-2&rdquo;>
        <h2 className=&ldquo;text-2xl font-bold tracking-tight&rdquo;>Perfil Completo</h2>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Gestiona tu información personal y profesional de manera integral
        </p>
      </div>

      <AdaptiveProfileRouter />
    </div>
  );
}
