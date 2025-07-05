&ldquo;use client&rdquo;;
import { useState } from &ldquo;react&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { FacebookIcon, GithubIcon, UploadCloud } from &ldquo;lucide-react&rdquo;;
import { useAuth } from &ldquo;@/hooks/use-auth&rdquo;;
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
import { PasswordStrengthIndicator } from &ldquo;@/components/utils/password-strength-indicator&rdquo;;
import type { SignUpFormProps, SignUpFormData } from &ldquo;@/types/auth/sign-up&rdquo;;
import { signUpFormSchema } from &ldquo;@/types/auth/sign-up&rdquo;;
import { toast } from &ldquo;@/components/ui/use-toast&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { uploadAvatar } from &ldquo;@/lib/supabase/upload-avatar&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { saltAndHashPassword } from &ldquo;@/lib/auth/password-crypto&rdquo;;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState(&ldquo;&rdquo;);
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: &ldquo;&rdquo;,
      firstName: &ldquo;&rdquo;,
      lastName: &ldquo;&rdquo;,
      password: &ldquo;&rdquo;,
      confirmPassword: &ldquo;&rdquo;,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    form.setValue(&ldquo;password&rdquo;, e.target.value);
  };

  async function onSubmit(data: SignUpFormData) {
    try {
      setIsLoading(true);

      // Hash the password with email as salt before sending to server
      const hashedPassword = await saltAndHashPassword(
        data.password,
        data.email
      );

      const { success, user, session, confirmEmail, error } = await signUp(
        data.email,
        hashedPassword
      );

      if (!success || error) {
        throw error || new Error(&ldquo;Failed to sign up&rdquo;);
      }

      if (user) {
        let avatarUrl = null;
        if (avatarFile) {
          try {
            avatarUrl = await uploadAvatar(avatarFile, user.id);
          } catch (error) {
            console.error(&ldquo;Avatar upload failed:&rdquo;, error);
            toast({
              title: &ldquo;Warning&rdquo;,
              description:
                &ldquo;Failed to upload avatar, you can add it later from your profile.&rdquo;,
              variant: &ldquo;default&rdquo;,
            });
          }
        }

        const response = await fetch(&ldquo;/api/profile&rdquo;, {
          method: &ldquo;POST&rdquo;,
          headers: {
            &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo;,
          },
          body: JSON.stringify({
            userId: user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            avatarUrl,
          }),
        });

        let result: Record<string, unknown>;
        let text = &ldquo;&rdquo;; // Define text outside the try block

        try {
          text = await response.text(); // Assign value inside try
          result = text ? JSON.parse(text) : {};

          if (!response.ok) {
            throw new Error(
              typeof result.error === &ldquo;string&rdquo;
                ? result.error
                : `Server responded with status ${response.status}`
            );
          }
        } catch (parseError) {
          console.error(
            &ldquo;Response parsing error:&rdquo;,
            parseError,
            &ldquo;Response text:&rdquo;,
            text
          );
          throw new Error(&ldquo;Invalid server response&rdquo;);
        }

        toast({
          title: &ldquo;Success&rdquo;,
          description:
            &ldquo;Your account has been created! Please verify your email to continue.&rdquo;,
        });

        // Redirect to verification page instead of dashboard if email confirmation is required
        if (confirmEmail) {
          router.push(&ldquo;/verify-email&rdquo;);
        } else if (session) {
          router.push(&ldquo;/dashboard&rdquo;);
        }
      }
    } catch (error) {
      console.error(&ldquo;Sign up error:&rdquo;, error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : &ldquo;Something went wrong. Please try again.&rdquo;;

      toast({
        title: &ldquo;Error&rdquo;,
        description: errorMessage,
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
          <div className=&ldquo;flex flex-col items-center gap-4&rdquo;>
            <div className=&ldquo;relative h-24 w-24&rdquo;>
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt=&ldquo;Avatar preview&rdquo;
                  fill
                  className=&ldquo;rounded-full object-cover&rdquo;
                />
              ) : (
                <div className=&ldquo;flex h-24 w-24 items-center justify-center rounded-full bg-muted&rdquo;>
                  <UploadCloud className=&ldquo;h-8 w-8 text-muted-foreground&rdquo; />
                </div>
              )}
            </div>
            <Input
              type=&ldquo;file&rdquo;
              accept=&ldquo;image/*&rdquo;
              onChange={handleAvatarChange}
              className=&ldquo;w-full max-w-xs&rdquo;
            />
          </div>

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

          <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
            <FormField
              control={form.control}
              name=&ldquo;firstName&rdquo;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder=&ldquo;John&rdquo; {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder=&ldquo;Doe&rdquo; {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name=&ldquo;password&rdquo;
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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

          <Button className=&ldquo;w-full&rdquo; disabled={isLoading}>
            Create Account
          </Button>
        </form>
      </Form>

      <div className=&ldquo;relative&rdquo;>
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
  );
}
