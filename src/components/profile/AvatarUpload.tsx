"use client";

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  X, 
  User, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { formatFileSize } from '@/lib/avatar-utils';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange?: (avatarUrl: string) => void;
  className?: string;
}

export const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChange, 
  className = "" 
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { isUploading, previewUrl, uploadAvatar, clearPreview, error } = useAvatarUpload();

  const handleFileSelect = async (file: File) => {
    await uploadAvatar(file);
    if (onAvatarChange && previewUrl) {
      onAvatarChange(previewUrl);
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
    clearPreview();
    if (onAvatarChange) {
      onAvatarChange('');
    }
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Avatar Display */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Avatar del usuario"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Upload Status Badge */}
              {isUploading && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Subiendo...
                  </Badge>
                </div>
              )}
              
              {previewUrl && !isUploading && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Listo
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />
            
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {displayAvatar ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={handleButtonClick}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Seleccionar archivo
                </Button>
                
                {displayAvatar && (
                  <Button
                    variant="outline"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Remover
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* File Requirements */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Formatos permitidos: JPG, PNG, WebP</p>
            <p>• Tamaño máximo: 5MB</p>
            <p>• Resolución recomendada: 400x400 píxeles</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
