&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { FacebookIcon, GithubIcon } from &ldquo;lucide-react&rdquo;;
import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;
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
import { PasswordInput } from &ldquo;@/components/utils/password-input&rdquo;;
import type { SignInFormData, UserAuthFormProps } from &ldquo;@/types/auth/sign-in&rdquo;;
import { signInFormSchema } from &ldquo;@/types/auth/sign-in&rdquo;;
import { toast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { saltAndHashPassword } from &ldquo;@/lib/auth/password-crypto&rdquo;;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: &ldquo;&rdquo;,
      password: &ldquo;&rdquo;,
    },
  });

  async function onSubmit(data: SignInFormData) {
    try {
      setIsLoading(true);

      // Hash the password with email as salt before sending to server
      const hashedPassword = await saltAndHashPassword(
        data.password,
        data.email
      );

      await signIn(data.email, hashedPassword);
      toast({
        title: &ldquo;Success&rdquo;,
        description: &ldquo;You have been signed in.&rdquo;,
      });
      router.push(&ldquo;/dashboard&rdquo;);
    } catch {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;Invalid email or password.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn(&ldquo;grid gap-6&rdquo;, className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=&ldquo;grid gap-2&rdquo;>
            <FormField
              control={form.control}
              name=&ldquo;email&rdquo;
              render={({ field }) => (
                <FormItem className=&ldquo;space-y-1&rdquo;>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder=&ldquo;name@example.com&rdquo; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name=&ldquo;password&rdquo;
              render={({ field }) => (
                <FormItem className=&ldquo;space-y-1&rdquo;>
                  <div className=&ldquo;flex items-center justify-between&rdquo;>
                    <FormLabel>Password</FormLabel>
                    <Link
                      href=&ldquo;/forgot-password&rdquo;
                      className=&ldquo;text-sm font-medium text-muted-foreground hover:opacity-75&rdquo;
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder=&ldquo;********&rdquo; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className=&ldquo;mt-2&rdquo; disabled={isLoading}>
              Login
            </Button>

            <div className=&ldquo;relative my-2&rdquo;>
              <div className=&ldquo;absolute inset-0 flex items-center&rdquo;>
                <span className=&ldquo;w-full border-t&rdquo; />
              </div>
              <div className=&ldquo;relative flex justify-center text-xs uppercase&rdquo;>
                <span className=&ldquo;bg-background px-2 text-muted-foreground&rdquo;>
                  Or continue with
                </span>
              </div>
            </div>

            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Button
                variant=&ldquo;outline&rdquo;
                className=&ldquo;w-full&rdquo;
                type=&ldquo;button&rdquo;
                disabled={isLoading}
              >
                <GithubIcon className=&ldquo;h-4 w-4&rdquo; /> GitHub
              </Button>
              <Button
                variant=&ldquo;outline&rdquo;
                className=&ldquo;w-full&rdquo;
                type=&ldquo;button&rdquo;
                disabled={isLoading}
              >
                <FacebookIcon className=&ldquo;h-4 w-4&rdquo; /> Facebook
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
