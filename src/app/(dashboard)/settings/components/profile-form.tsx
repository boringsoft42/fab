&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useForm } from &ldquo;react-hook-form&rdquo;;
import { zodResolver } from &ldquo;@hookform/resolvers/zod&rdquo;;
import { Loader2 } from &ldquo;lucide-react&rdquo;;
import { useAuth } from &ldquo;@/providers/auth-provider&rdquo;;
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
import { ConfirmDialog } from &ldquo;@/components/ui/confirm-dialog&rdquo;;
import { AvatarUpload } from &ldquo;@/components/settings/avatar-upload&rdquo;;
import { profileFormSchema } from &ldquo;@/lib/validations/profile&rdquo;;
import type { ProfileFormValues } from &ldquo;@/lib/validations/profile&rdquo;;

export function ProfileForm() {
  const { profile } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] =
    useState<ProfileFormValues | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || &ldquo;&rdquo;,
      lastName: profile?.lastName || &ldquo;&rdquo;,
    },
  });

  async function handleSubmit(data: ProfileFormValues) {
    setPendingChanges(data);
    setShowConfirmDialog(true);
  }

  async function handleConfirmUpdate() {
    if (!pendingChanges || !profile?.userId) return;

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/profile/${profile.userId}`, {
        method: &ldquo;PATCH&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify({
          ...pendingChanges,
          avatarUrl: newAvatarUrl || profile.avatarUrl,
        }),
      });

      if (!response.ok) throw new Error(&ldquo;Failed to update profile&rdquo;);

      toast({
        title: &ldquo;Profile updated&rdquo;,
        description: &ldquo;Your profile has been updated successfully.&rdquo;,
      });

      form.reset(pendingChanges);
    } catch {
      toast({
        title: &ldquo;Error&rdquo;,
        description: &ldquo;Failed to update profile. Please try again.&rdquo;,
        variant: &ldquo;destructive&rdquo;,
      });
    } finally {
      setIsUpdating(false);
      setShowConfirmDialog(false);
      setPendingChanges(null);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className=&ldquo;space-y-8&rdquo;>
          {profile && (
            <AvatarUpload
              userId={profile.userId}
              currentAvatarUrl={profile.avatarUrl || null}
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

          <div className=&ldquo;grid gap-4 sm:grid-cols-2&rdquo;>
            <FormField
              control={form.control}
              name=&ldquo;firstName&rdquo;
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=&ldquo;John&rdquo;
                      {...field}
                      value={field.value ?? &ldquo;&rdquo;}
                    />
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
                    <Input
                      placeholder=&ldquo;Doe&rdquo;
                      {...field}
                      value={field.value ?? &ldquo;&rdquo;}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className=&ldquo;flex items-center gap-4&rdquo;>
            <Button type=&ldquo;submit&rdquo; disabled={isUpdating}>
              {isUpdating && <Loader2 className=&ldquo;mr-2 h-4 w-4 animate-spin&rdquo; />}
              Update profile
            </Button>
            <Button
              type=&ldquo;button&rdquo;
              variant=&ldquo;outline&rdquo;
              onClick={() => form.reset()}
              disabled={isUpdating}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmUpdate}
        title=&ldquo;Update Profile&rdquo;
        description=&ldquo;Are you sure you want to update your profile? This action cannot be undone.&rdquo;
      />
    </>
  );
}
