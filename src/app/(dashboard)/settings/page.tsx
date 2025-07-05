&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { SettingsForm } from &ldquo;./components/settings-form&rdquo;;
import { PasswordDialog } from &ldquo;./components/password-dialog&rdquo;;
import { AccountSection } from &ldquo;./components/account-section&rdquo;;
import { SettingsLoader } from &ldquo;./components/settings-loader&rdquo;;
import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { LockKeyhole, RefreshCw } from &ldquo;lucide-react&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;

export default function SettingsPage() {
  const { profile, isLoading, refetch } = useCurrentUser();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState(false);

  // Simulate data loading and ensure everything is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        setPageLoading(false);
      }
    }, 500); // Small delay to ensure smooth transitions

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleRetry = async () => {
    setRetryLoading(true);
    if (refetch) {
      await refetch();
      setTimeout(() => setRetryLoading(false), 500);
    } else {
      setRetryLoading(false);
    }
  };

  // Handle error case
  if (!isLoading && !profile) {
    return (
      <div className=&ldquo;container mx-auto py-10&rdquo;>
        <Card className=&ldquo;max-w-md mx-auto&rdquo;>
          <CardHeader className=&ldquo;text-center&rdquo;>
            <CardTitle className=&ldquo;text-xl&rdquo;>
              No se pudo cargar el perfil
            </CardTitle>
            <CardDescription>
              No se pudo cargar la información de tu perfil. Por favor, intenta
              nuevamente.
            </CardDescription>
          </CardHeader>
          <CardContent className=&ldquo;flex justify-center&rdquo;>
            <Button
              onClick={handleRetry}
              className=&ldquo;w-full max-w-xs&rdquo;
              disabled={retryLoading}
            >
              {retryLoading ? (
                <>
                  <RefreshCw className=&ldquo;mr-2 h-4 w-4 animate-spin&rdquo; />
                  Cargando...
                </>
              ) : (
                &ldquo;Reintentar&rdquo;
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loader while loading
  if (pageLoading || isLoading) {
    return <SettingsLoader />;
  }

  return (
    <div className=&ldquo;space-y-6 animate-in fade-in-50 duration-500&rdquo;>
      <div>
        <h2 className=&ldquo;text-3xl font-bold tracking-tight&rdquo;>Configuración</h2>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Gestiona tu configuración de cuenta y preferencias.
        </p>
      </div>

      <Tabs defaultValue=&ldquo;profile&rdquo; className=&ldquo;space-y-6&rdquo;>
        <TabsList className=&ldquo;grid w-full grid-cols-2&rdquo;>
          <TabsTrigger value=&ldquo;profile&rdquo;>Perfil</TabsTrigger>
          <TabsTrigger value=&ldquo;security&rdquo;>Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value=&ldquo;profile&rdquo; className=&ldquo;space-y-6&rdquo;>
          <AccountSection />
          <SettingsForm />
        </TabsContent>

        <TabsContent value=&ldquo;security&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Gestiona la configuración de seguridad de tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-2&rdquo;>
                <h3 className=&ldquo;font-medium&rdquo;>Contraseña</h3>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                  Actualiza tu contraseña regularmente para mayor seguridad.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setPasswordDialogOpen(true)}
                className=&ldquo;flex items-center&rdquo;
              >
                <LockKeyhole className=&ldquo;mr-2 h-4 w-4&rdquo; />
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
