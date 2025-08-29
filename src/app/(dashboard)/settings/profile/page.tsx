"use client";

import { AdaptiveProfileRouter } from "@/components/profile/adaptive-profile-router";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Perfil Completo</h2>
        <p className="text-muted-foreground">
          Gestiona tu información personal y profesional de manera integral
        </p>
      </div>

      <AdaptiveProfileRouter />
    </div>
  );
}
