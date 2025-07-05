&ldquo;use client&rdquo;;

import { useForm } from &ldquo;react-hook-form&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &ldquo;@/components/ui/form&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { toast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { profileFormSchema } from &ldquo;@/lib/validations/profile&rdquo;;
import type { ProfileFormValues } from &ldquo;@/lib/validations/profile&rdquo;;

export function ProfileForm() {
  const { profile } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || &ldquo;&rdquo;,
      lastName: profile?.lastName || &ldquo;&rdquo;,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      const response = await fetch(`/api/profile/${profile?.userId}`, {
        method: &ldquo;PATCH&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(error.message || &ldquo;Failed to update profile&rdquo;);
      }

      await response.json(); // Wait for response to be fully read

      toast({
        title: &ldquo;Profile updated&rdquo;,
        description: &ldquo;Your profile has been updated successfully.&rdquo;,
      });
    } catch (error) {
      toast({
        title: &ldquo;Error&rdquo;,
        description: error instanceof Error ? error.message : &ldquo;Failed to update profile. Please try again.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=&ldquo;space-y-8&rdquo;>
        <FormField
          control={form.control}
          name=&ldquo;firstName&rdquo;
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder=&ldquo;shadcn&rdquo; {...field} value={field.value ?? &ldquo;&rdquo;} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym.
              </FormDescription>
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
                <Input placeholder=&ldquo;John Doe&rdquo; {...field} value={field.value ?? &ldquo;&rdquo;} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=&ldquo;flex items-center gap-4&rdquo;>
          <Button type=&ldquo;submit&rdquo;>Update profile</Button>
          <Button type=&ldquo;button&rdquo; variant=&ldquo;outline&rdquo; onClick={() => form.reset()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
} 