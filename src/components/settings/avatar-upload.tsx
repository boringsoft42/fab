&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { UploadCloud } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { useToast } from &ldquo;@/components/ui/use-toast&rdquo;;
import { uploadAvatar } from &ldquo;@/lib/supabase/upload-avatar&rdquo;;

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  onUploadComplete,
  onUploadError,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const avatarUrl = await uploadAvatar(file, userId);
      onUploadComplete(avatarUrl);
      toast({
        title: &ldquo;Avatar actualizado&rdquo;,
        description: &ldquo;Tu foto de perfil ha sido actualizada correctamente.&rdquo;,
      });
    } catch (error) {
      console.error(&ldquo;Error uploading avatar:&rdquo;, error);
      onUploadError(
        error instanceof Error
          ? error
          : new Error(&ldquo;Error al subir la imagen de perfil&rdquo;)
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className=&ldquo;flex flex-col items-center gap-4&rdquo;>
      <div className=&ldquo;relative h-24 w-24&rdquo;>
        {previewUrl || currentAvatarUrl ? (
          <Image
            src={previewUrl || currentAvatarUrl || &ldquo;&rdquo;}
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
      <div className=&ldquo;flex flex-col items-center gap-2&rdquo;>
        <Button variant=&ldquo;outline&rdquo; className=&ldquo;relative&rdquo; disabled={isUploading}>
          {isUploading ? (
            <>
              <span className=&ldquo;mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-opacity-20 border-t-current&rdquo;></span>
              Subiendo...
            </>
          ) : (
            &ldquo;Cambiar foto&rdquo;
          )}
          <input
            type=&ldquo;file&rdquo;
            accept=&ldquo;image/*&rdquo;
            onChange={handleFileChange}
            className=&ldquo;absolute inset-0 w-full h-full opacity-0 cursor-pointer&rdquo;
            disabled={isUploading}
          />
        </Button>
        <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
          PNG, JPG o GIF. Máximo 2MB.
        </p>
      </div>
    </div>
  );
}
