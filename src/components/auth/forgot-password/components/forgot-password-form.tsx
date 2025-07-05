&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { z } from &ldquo;zod&rdquo;;
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
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { toast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { createClientComponentClient } from &ldquo;@supabase/auth-helpers-nextjs&rdquo;;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: &ldquo;Please enter your email&rdquo; })
    .email({ message: &ldquo;Invalid email address&rdquo; }),
});

type FormValues = z.infer<typeof formSchema>;

type ForgotPasswordFormProps = React.HTMLAttributes<HTMLDivElement>;

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClientComponentClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: &ldquo;&rdquo;,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);

      // Get the site URL from the environment or current location
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      // Call Supabase's resetPasswordForEmail method
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: &ldquo;Check your email&rdquo;,
        description: &ldquo;We've sent you a password reset link.&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Reset password error:&rdquo;, error);
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;Something went wrong. Please try again.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn(&ldquo;grid gap-6&rdquo;, className)} {...props}>
      {isSuccess ? (
        <div className=&ldquo;text-center&rdquo;>
          <h3 className=&ldquo;mb-1 text-lg font-medium&rdquo;>Check your email</h3>
          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
            We&apos;ve sent a password reset link to your email. Please check
            your inbox and follow the instructions.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=&ldquo;space-y-4&rdquo;>
            <FormField
              control={form.control}
              name=&ldquo;email&rdquo;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder=&ldquo;name@example.com&rdquo; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type=&ldquo;submit&rdquo; className=&ldquo;w-full&rdquo; disabled={isLoading}>
              {isLoading ? &ldquo;Sending...&rdquo; : &ldquo;Send reset link&rdquo;}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
