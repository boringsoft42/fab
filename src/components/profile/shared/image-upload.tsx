&ldquo;use client&rdquo;;

import { useState, useCallback } from &ldquo;react&rdquo;;
import { useDropzone } from &ldquo;react-dropzone&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Card, CardContent } from &ldquo;@/components/ui/card&rdquo;;
import { Alert, AlertDescription } from &ldquo;@/components/ui/alert&rdquo;;
import { Upload, X, User, Building, AlertCircle } from &ldquo;lucide-react&rdquo;;

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string | null) => void;
  type?: &ldquo;avatar&rdquo; | &ldquo;logo&rdquo;;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  currentImage,
  onImageChange,
  type = &ldquo;avatar&rdquo;,
  maxSize = 5,
  acceptedTypes = [&ldquo;image/jpeg&rdquo;, &ldquo;image/png&rdquo;, &ldquo;image/webp&rdquo;],
  className,
  placeholder,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append(&ldquo;file&rdquo;, file);
    formData.append(&ldquo;type&rdquo;, type);

    const response = await fetch(&ldquo;/api/upload/image&rdquo;, {
      method: &ldquo;POST&rdquo;,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || &ldquo;Error al subir la imagen&rdquo;);
    }

    const data = await response.json();
    return data.url;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setError(null);

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`La imagen no puede ser mayor a ${maxSize}MB`);
        return;
      }

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setError(&ldquo;Formato de imagen no válido. Usa JPG, PNG o WebP&rdquo;);
        return;
      }

      try {
        setIsUploading(true);
        const imageUrl = await uploadImage(file);
        onImageChange(imageUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : &ldquo;Error al subir la imagen&rdquo;
        );
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, acceptedTypes, onImageChange, type]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      &ldquo;image/*&rdquo;: acceptedTypes
        .map((type) => type.split(&ldquo;/&rdquo;)[1])
        .map((ext) => `.${ext}`),
    },
    multiple: false,
    disabled: isUploading,
  });

  const handleRemove = () => {
    onImageChange(null);
    setError(null);
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return type === &ldquo;logo&rdquo; ? &ldquo;Logo de la organización&rdquo; : &ldquo;Foto de perfil&rdquo;;
  };

  const getIcon = () => {
    return type === &ldquo;logo&rdquo; ? Building : User;
  };

  const Icon = getIcon();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <div className=&ldquo;flex items-center gap-4&rdquo;>
          {type === &ldquo;avatar&rdquo; ? (
            <Avatar className=&ldquo;h-20 w-20&rdquo;>
              <AvatarImage src={currentImage} alt=&ldquo;Imagen actual&rdquo; />
              <AvatarFallback>
                <User className=&ldquo;h-8 w-8&rdquo; />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className=&ldquo;h-20 w-20 rounded-lg border overflow-hidden&rdquo;>
              <img
                src={currentImage}
                alt=&ldquo;Logo actual&rdquo;
                className=&ldquo;h-full w-full object-cover&rdquo;
              />
            </div>
          )}

          <Button
            variant=&ldquo;outline&rdquo;
            size=&ldquo;sm&rdquo;
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Eliminar
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <Card>
        <CardContent className=&ldquo;p-6&rdquo;>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? &ldquo;border-primary bg-primary/5&rdquo; : &ldquo;border-muted-foreground/25&rdquo;}
              ${isUploading ? &ldquo;cursor-not-allowed opacity-50&rdquo; : &ldquo;hover:border-primary/50&rdquo;}
            `}
          >
            <input {...getInputProps()} />

            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center&rdquo;>
                {isUploading ? (
                  <div className=&ldquo;animate-spin rounded-full h-6 w-6 border-b-2 border-primary&rdquo; />
                ) : (
                  <Upload className=&ldquo;h-6 w-6 text-muted-foreground&rdquo; />
                )}
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <p className=&ldquo;text-sm font-medium&rdquo;>
                  {isUploading
                    ? &ldquo;Subiendo imagen...&rdquo;
                    : isDragActive
                      ? &ldquo;Suelta la imagen aquí&rdquo;
                      : `Arrastra una imagen o haz clic para seleccionar`}
                </p>

                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                  {getPlaceholder()} • Máximo {maxSize}MB • JPG, PNG, WebP
                </p>
              </div>

              {!isUploading && (
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; type=&ldquo;button&rdquo;>
                  <Icon className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Seleccionar Imagen
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant=&ldquo;destructive&rdquo;>
          <AlertCircle className=&ldquo;h-4 w-4&rdquo; />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
