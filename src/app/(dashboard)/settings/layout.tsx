"use client";

import { Separator } from "@/components/ui/separator";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Actualiza tu información personal y gestiona tu contraseña.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
