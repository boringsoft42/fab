&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { z } from &ldquo;zod&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { cn } from &ldquo;@/lib/utils&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &ldquo;@/components/ui/form&rdquo;;
import { toast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { createClientComponentClient } from &ldquo;@supabase/auth-helpers-nextjs&rdquo;;
import { PasswordInput } from &ldquo;@/components/utils/password-input&rdquo;;
import { PasswordStrengthIndicator } from &ldquo;@/components/utils/password-strength-indicator&rdquo;;
import { hashPassword } from &ldquo;@/lib/auth/password-crypto&rdquo;;

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, &ldquo;Password must be at least 8 characters&rdquo;)
      .regex(/[A-Z]/, &ldquo;Password must contain at least one uppercase letter&rdquo;)
      .regex(/[a-z]/, &ldquo;Password must contain at least one lowercase letter&rdquo;)
      .regex(/[0-9]/, &ldquo;Password must contain at least one number&rdquo;)
      .regex(
        /[^A-Za-z0-9]/,
        &ldquo;Password must contain at least one special character&rdquo;
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: &ldquo;Passwords do not match&rdquo;,
    path: [&ldquo;confirmPassword&rdquo;],
  });

type FormValues = z.infer<typeof formSchema>;

type ResetPasswordFormProps = React.HTMLAttributes<HTMLDivElement>;

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(&ldquo;&rdquo;);
  const supabase = createClientComponentClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: &ldquo;&rdquo;,
      confirmPassword: &ldquo;&rdquo;,
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue(&ldquo;password&rdquo;, e.target.value);
  };

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);

      // Get the current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error(&ldquo;User not found. Please try logging in again.&rdquo;);
      }

      // Hash the password before sending to server
      const hashedPassword = await hashPassword(data.password);

      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: hashedPassword,
      });

      if (error) {
        throw error;
      }

      toast({
        title: &ldquo;Password Updated&rdquo;,
        description: &ldquo;Your password has been reset successfully.&rdquo;,
      });

      // Redirect to the login page
      router.push(&ldquo;/sign-in&rdquo;);
    } catch (error) {
      console.error(&ldquo;Reset password error:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;Failed to reset password. Please try again.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn(&ldquo;grid gap-6&rdquo;, className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=&ldquo;space-y-4&rdquo;>
          <FormField
            control={form.control}
            name=&ldquo;password&rdquo;
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder=&ldquo;********&rdquo;
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder=&ldquo;********&rdquo; {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type=&ldquo;submit&rdquo; className=&ldquo;w-full&rdquo; disabled={isLoading}>
            {isLoading ? &ldquo;Resetting...&rdquo; : &ldquo;Reset Password&rdquo;}
          </Button>
        </form>
      </Form>
    </div>
  );
}
