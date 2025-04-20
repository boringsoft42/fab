"use client";

import { useState } from "react";
import { SettingsForm } from "./components/settings-form";
import { PasswordDialog } from "./components/password-dialog";
import { AccountSection } from "./components/account-section";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { profile, isLoading } = useCurrentUser();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingScreen message="Cargando configuración..." />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">
            No se pudo cargar tu perfil. Por favor, intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Gestiona tu configuración de cuenta y preferencias.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <AccountSection />
          <SettingsForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Gestiona la configuración de seguridad de tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Contraseña</h3>
                <p className="text-sm text-muted-foreground">
                  Actualiza tu contraseña regularmente para mayor seguridad.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setPasswordDialogOpen(true)}
                className="flex items-center"
              >
                <LockKeyhole className="mr-2 h-4 w-4" />
                Cambiar Contraseña
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
      />
    </div>
  );
}
