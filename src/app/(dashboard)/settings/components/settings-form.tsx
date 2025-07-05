&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import * as z from &ldquo;zod&rdquo;;
import { motion } from &ldquo;framer-motion&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &ldquo;@/components/ui/form&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { useCurrentUser } from &ldquo;@/hooks/use-current-user&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { LoadingScreen } from &ldquo;@/components/ui/loading-screen&rdquo;;
import { AvatarUpload } from &ldquo;@/components/settings/avatar-upload&rdquo;;

const settingsFormSchema = z.object({
  firstName: z
    .string()
    .min(2, &ldquo;El nombre debe tener al menos 2 caracteres&rdquo;)
    .optional(),
  lastName: z
    .string()
    .min(2, &ldquo;El apellido debe tener al menos 2 caracteres&rdquo;)
    .optional(),
  avatarUrl: z.string().url(&ldquo;URL inválida&rdquo;).optional().or(z.literal(&ldquo;&rdquo;)),
  active: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { profile, user, refetch } = useCurrentUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(&ldquo;&rdquo;);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      firstName: profile?.firstName || &ldquo;&rdquo;,
      lastName: profile?.lastName || &ldquo;&rdquo;,
      avatarUrl: profile?.avatarUrl || &ldquo;&rdquo;,
      active: profile?.active ?? true,
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || &ldquo;&rdquo;,
        lastName: profile.lastName || &ldquo;&rdquo;,
        avatarUrl: profile.avatarUrl || &ldquo;&rdquo;,
        active: profile.active ?? true,
      });
    }
  }, [profile, form]);

  async function onSubmit(data: SettingsFormValues) {
    if (isSubmitting || !user) return;

    try {
      setIsSubmitting(true);
      setLoadingMessage(&ldquo;Actualizando perfil...&rdquo;);

      // Add a small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Retry logic for updating profile
      let success = false;
      let retryCount = 0;
      const maxRetries = 3;
      let lastError = null;

      while (!success && retryCount < maxRetries) {
        try {
          setLoadingMessage(
            `Actualizando perfil (intento ${retryCount + 1}/${maxRetries})...`
          );

          // Use the main profile endpoint - it will get the user ID from the session
          const response = await fetch(`/api/profile`, {
            method: &ldquo;PUT&rdquo;,
            headers: {
              &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
            },
            body: JSON.stringify({
              firstName: data.firstName,
              lastName: data.lastName,
              avatarUrl: newAvatarUrl || data.avatarUrl,
              active: data.active,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || &ldquo;Error al actualizar el perfil&rdquo;);
          }

          // Refresh the user data after successful update
          if (refetch) await refetch();
          success = true;
        } catch (error) {
          console.error(`Attempt ${retryCount + 1} failed:`, error);
          lastError = error;
          retryCount++;

          if (retryCount < maxRetries) {
            // Wait before retrying (increasing delay with each retry)
            setLoadingMessage(
              `Reintentando actualización (${retryCount}/${maxRetries})...`
            );
            // Exponential backoff for retries
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * 1.5 ** retryCount)
            );
          }
        }
      }

      if (!success) {
        throw (
          lastError ||
          new Error(&ldquo;Failed to update profile after multiple attempts&rdquo;)
        );
      }

      toast({
        title: &ldquo;Perfil actualizado&rdquo;,
        description: &ldquo;Tu información ha sido actualizada correctamente.&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Error updating profile:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description:
          error instanceof Error
            ? error.message
            : &ldquo;No se pudo actualizar la configuración. Por favor, intenta de nuevo.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setIsSubmitting(false);
      setLoadingMessage(&ldquo;&rdquo;);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isSubmitting && (
        <LoadingScreen
          variant=&ldquo;overlay&rdquo;
          message={loadingMessage || &ldquo;Procesando...&rdquo;}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=&ldquo;space-y-8&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              {profile && (
                <AvatarUpload
                  userId={profile.userId}
                  currentAvatarUrl={profile.avatarUrl}
                  onUploadComplete={(url) => setNewAvatarUrl(url)}
                  onUploadError={(error) => {
                    toast({
                      title: &ldquo;Error&rdquo;,
                      description: error.message,
                      variant: &ldquo;destructive&rdquo;,
                    });
                  }}
                />
              )}

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <FormField
                  control={form.control}
                  name=&ldquo;firstName&rdquo;
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder=&ldquo;Tu nombre&rdquo; {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name=&ldquo;lastName&rdquo;
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder=&ldquo;Tu apellido&rdquo; {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {(profile?.role as string) === &ldquo;SUPERADMIN&rdquo; && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Rol</CardTitle>
                <CardDescription>
                  Información sobre tu tipo de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <span className=&ldquo;text-sm font-medium&rdquo;>Rol:</span>
                  <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    {(profile?.role as string) === &ldquo;USER&rdquo; && &ldquo;Usuario&rdquo;}
                    {(profile?.role as string) === &ldquo;SUPERADMIN&rdquo; &&
                      &ldquo;Administrador&rdquo;}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className=&ldquo;flex justify-end&rdquo;>
            <Button type=&ldquo;submit&rdquo; disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className=&ldquo;mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white&rdquo;></span>
                  Guardando...
                </>
              ) : (
                &ldquo;Guardar Cambios&rdquo;
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
