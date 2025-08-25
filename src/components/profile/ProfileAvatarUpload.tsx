"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Upload,
  X,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { useProfileAvatar } from "@/hooks/useProfileAvatar";
import { ProfileAvatarService } from "@/services/profile-avatar.service";
import { cn } from "@/lib/utils";

interface ProfileAvatarUploadProps {
  profileId?: string;
  currentAvatarUrl?: string | null;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
  className?: string;
  showTitle?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ProfileAvatarUpload: React.FC<ProfileAvatarUploadProps> = ({
  profileId,
  currentAvatarUrl,
  onAvatarUpdate,
  className = "",
  showTitle = true,
  size = "md",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { profile, updateAvatar } = useProfileAvatar();

  // Use provided profileId or get from hook
  const effectiveProfileId = profileId || profile?.id;

  // Load profile if not provided
  useEffect(() => {
    if (!profileId && !profile) {
      // The hook will handle loading the profile
    }
  }, [profileId, profile]);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file
    const validation = ProfileAvatarService.validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || "Error de validación");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setIsUploading(true);

      if (effectiveProfileId) {
        const avatarUrl = await updateAvatar(file);
        setPreviewUrl(null); // Clear preview after successful upload

        if (onAvatarUpdate) {
          onAvatarUpdate(avatarUrl);
        }
      } else {
        // If no profile ID, just update the preview for now
        setPreviewUrl(URL.createObjectURL(file));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al subir avatar";
      setError(errorMessage);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    setError(null);
    if (onAvatarUpdate) {
      onAvatarUpdate("");
    }
  };

  const displayAvatar = previewUrl || currentAvatarUrl || profile?.avatarUrl;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          avatar: "h-16 w-16",
          uploadArea: "p-4",
          icon: "w-4 h-4",
        };
      case "lg":
        return {
          avatar: "h-32 w-32",
          uploadArea: "p-8",
          icon: "w-8 h-8",
        };
      default:
        return {
          avatar: "h-24 w-24",
          uploadArea: "p-6",
          icon: "w-6 h-6",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-4">
        {showTitle && (
          <CardTitle className="text-lg font-semibold">
            Foto de Perfil
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Avatar Display */}
        {displayAvatar && (
          <div className="flex items-center gap-4">
            <Avatar className={sizeClasses.avatar}>
              <AvatarImage
                src={displayAvatar}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback>
                <User
                  className={cn("text-muted-foreground", sizeClasses.icon)}
                />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                className="w-fit"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>

              {previewUrl && (
                <Badge variant="secondary" className="w-fit">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vista previa
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg text-center transition-colors",
            sizeClasses.uploadArea,
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400",
            isUploading && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="flex justify-center">
              <div
                className={cn(
                  "rounded-full bg-blue-100 flex items-center justify-center",
                  size === "lg" ? "w-16 h-16" : "w-12 h-12"
                )}
              >
                {isUploading ? (
                  <Loader2
                    className={cn(
                      "text-blue-600 animate-spin",
                      sizeClasses.icon
                    )}
                  />
                ) : (
                  <Camera className={cn("text-blue-600", sizeClasses.icon)} />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {displayAvatar
                  ? "Cambiar foto de perfil"
                  : "Subir foto de perfil"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={handleButtonClick}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Subiendo..." : "Seleccionar Imagen"}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Formatos permitidos: JPEG, PNG, GIF, WebP</p>
          <p>Tamaño máximo: 5MB</p>
        </div>
      </CardContent>
    </Card>
  );
};
