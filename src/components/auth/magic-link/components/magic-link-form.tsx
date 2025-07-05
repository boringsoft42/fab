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

type MagicLinkFormProps = React.HTMLAttributes<HTMLDivElement>;

export function MagicLinkForm({ className, ...props }: MagicLinkFormProps) {
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

      // Send magic link email
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: &ldquo;Check your email&rdquo;,
        description: &ldquo;We&apos;ve sent you a magic link to sign in.&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Magic link error:&rdquo;, error);
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
            We&apos;ve sent a magic link to your email. Please check your inbox
            and click the link to sign in.
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
              {isLoading ? &ldquo;Sending...&rdquo; : &ldquo;Send Magic Link&rdquo;}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
