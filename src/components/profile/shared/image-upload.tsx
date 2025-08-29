"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, User, Building, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string | null) => void;
  type?: "avatar" | "logo";
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  currentImage,
  onImageChange,
  type = "avatar",
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
  placeholder,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    // Simplemente crear una URL local para la imagen sin subir al servidor
    return URL.createObjectURL(file);
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
        setError("Formato de imagen no válido. Usa JPG, PNG o WebP");
        return;
      }

      try {
        setIsUploading(true);
        const imageUrl = await uploadImage(file);
        onImageChange(imageUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen"
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
      "image/*": acceptedTypes
        .map((type) => type.split("/")[1])
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
    return type === "logo" ? "Logo de la organización" : "Foto de perfil";
  };

  const getIcon = () => {
    return type === "logo" ? Building : User;
  };

  const Icon = getIcon();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Display */}
      {currentImage && (
        <div className="flex items-center gap-4">
          {type === "avatar" ? (
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentImage} alt="Imagen actual" />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-20 w-20 rounded-lg border overflow-hidden">
              <img
                src={currentImage}
                alt="Logo actual"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
              ${isUploading ? "cursor-not-allowed opacity-50" : "hover:border-primary/50"}
            `}
          >
            <input {...getInputProps()} />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isUploading
                    ? "Subiendo imagen..."
                    : isDragActive
                      ? "Suelta la imagen aquí"
                      : `Arrastra una imagen o haz clic para seleccionar`}
                </p>

                <p className="text-xs text-muted-foreground">
                  {getPlaceholder()} • Máximo {maxSize}MB • JPG, PNG, WebP
                </p>
              </div>

              {!isUploading && (
                <Button variant="outline" size="sm" type="button">
                  <Icon className="h-4 w-4 mr-2" />
                  Seleccionar Imagen
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
