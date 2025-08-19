import { useState } from 'react';
import { toast } from 'sonner';
import { validateImageFile, compressImage, CompressedImageResult } from '@/lib/avatar-utils';

interface UseAvatarUploadReturn {
  isUploading: boolean;
  previewUrl: string | null;
  uploadAvatar: (file: File) => Promise<void>;
  clearPreview: () => void;
  error: string | null;
}

export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<void> => {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Error de validación');
        toast.error(validation.error || 'Error de validación');
        return;
      }

      // Compress image
      const compressedResult: CompressedImageResult = await compressImage(file);
      
      // Set preview
      setPreviewUrl(compressedResult.previewUrl);

      // TODO: Upload to server
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Avatar actualizado correctamente');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir el avatar';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = (): void => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setError(null);
  };

  return {
    isUploading,
    previewUrl,
    uploadAvatar,
    clearPreview,
    error,
  };
};
