&ldquo;use client&rdquo;;

import React, { useState } from &ldquo;react&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import * as z from &ldquo;zod&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from &ldquo;@/components/ui/dialog&rdquo;;
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &ldquo;@/components/ui/form&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { PasswordInput } from &ldquo;@/components/utils/password-input&rdquo;;
import { PasswordStrengthIndicator } from &ldquo;@/components/utils/password-strength-indicator&rdquo;;
import { AlertCircle, CheckCircle2, Loader2 } from &ldquo;lucide-react&rdquo;;
import { hashPassword } from &ldquo;@/lib/auth/password-crypto&rdquo;;

// Password validation schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, &ldquo;La contraseña actual es requerida&rdquo;),
    newPassword: z
      .string()
      .min(8, &ldquo;La contraseña debe tener al menos 8 caracteres&rdquo;)
      .regex(/[A-Z]/, &ldquo;La contraseña debe contener al menos una mayúscula&rdquo;)
      .regex(/[a-z]/, &ldquo;La contraseña debe contener al menos una minúscula&rdquo;)
      .regex(/[0-9]/, &ldquo;La contraseña debe contener al menos un número&rdquo;)
      .regex(
        /[^A-Za-z0-9]/,
        &ldquo;La contraseña debe contener al menos un carácter especial&rdquo;
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: &ldquo;Las contraseñas no coinciden&rdquo;,
    path: [&ldquo;confirmPassword&rdquo;],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordDialog({ open, onOpenChange }: PasswordDialogProps) {
  const [password, setPassword] = useState(&ldquo;&rdquo;);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: &ldquo;&rdquo;,
      newPassword: &ldquo;&rdquo;,
      confirmPassword: &ldquo;&rdquo;,
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue(&ldquo;newPassword&rdquo;, e.target.value);
  };

  async function onSubmit(data: PasswordFormValues) {
    try {
      setIsSubmitting(true);

      // Get current user's password hash to send to API
      const hashedCurrentPassword = await hashPassword(data.currentPassword);
      const hashedNewPassword = await hashPassword(data.newPassword);

      // Call API to update password
      const response = await fetch(&ldquo;/api/user/password&rdquo;, {
        method: &ldquo;PUT&rdquo;,
        headers: {
          &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
        },
        body: JSON.stringify({
          currentPassword: hashedCurrentPassword,
          newPassword: hashedNewPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || &ldquo;Error al cambiar la contraseña&rdquo;);
      }

      toast({
        title: &ldquo;Contraseña actualizada&rdquo;,
        description: (
          <div className=&ldquo;flex items-center&rdquo;>
            <CheckCircle2 className=&ldquo;h-4 w-4 text-green-500 mr-2&rdquo; />
            <span>Tu contraseña ha sido actualizada correctamente.</span>
          </div>
        ),
      });

      // Reset form and close dialog
      form.reset();
      setPassword(&ldquo;&rdquo;);
      onOpenChange(false);
    } catch (error: unknown) {
      console.error(&ldquo;Error updating password:&rdquo;, error);

      let errorMessage =
        &ldquo;No se pudo actualizar la contraseña. Por favor, intenta de nuevo.&rdquo;;

      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes(&ldquo;incorrect&rdquo;)) {
          errorMessage = &ldquo;La contraseña actual es incorrecta.&rdquo;;
        } else if (error.message.includes(&ldquo;weak&rdquo;)) {
          errorMessage = &ldquo;La nueva contraseña es demasiado débil.&rdquo;;
        }
      }

      toast({
        title: &ldquo;Error&rdquo;,
        description: (
          <div className=&ldquo;flex items-center&rdquo;>
            <AlertCircle className=&ldquo;h-4 w-4 text-destructive mr-2&rdquo; />
            <span>{errorMessage}</span>
          </div>
        ),
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDialogOpenChange = (value: boolean) => {
    if (!value) {
      // Reset the form when dialog is closed
      form.reset();
      setPassword(&ldquo;&rdquo;);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className=&ldquo;sm:max-w-[425px]&rdquo;>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Actualiza tu contraseña para mantener tu cuenta segura.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=&ldquo;space-y-6&rdquo;>
            <FormField
              control={form.control}
              name=&ldquo;currentPassword&rdquo;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña Actual</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder=&ldquo;••••••••&rdquo; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&ldquo;newPassword&rdquo;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder=&ldquo;••••••••&rdquo;
                      {...field}
                      onChange={handlePasswordChange}
                    />
                  </FormControl>
                  <PasswordStrengthIndicator password={password} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name=&ldquo;confirmPassword&rdquo;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder=&ldquo;••••••••&rdquo; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className=&ldquo;gap-2 sm:gap-0&rdquo;>
              <DialogClose asChild>
                <Button type=&ldquo;button&rdquo; variant=&ldquo;outline&rdquo;>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type=&ldquo;submit&rdquo; disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className=&ldquo;mr-2 h-4 w-4 animate-spin&rdquo; />
                    Actualizando...
                  </>
                ) : (
                  &ldquo;Actualizar Contraseña&rdquo;
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
