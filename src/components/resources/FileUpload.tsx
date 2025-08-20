"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  FileVideo,
  FileImage,
  FileAudio,
  FileArchive
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number; // en bytes
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.zip,.mp4,.webm,.ogg,.mp3,.wav,.jpg,.jpeg,.png,.gif,.txt",
  maxSize = 50 * 1024 * 1024, // 50MB por defecto
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') return <FileText className="h-6 w-6" />;
    if (['doc', 'docx', 'xls', 'xlsx'].includes(extension || '')) return <FileText className="h-6 w-6" />;
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) return <FileVideo className="h-6 w-6" />;
    if (['mp3', 'wav'].includes(extension || '')) return <FileAudio className="h-6 w-6" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return <FileImage className="h-6 w-6" />;
    if (extension === 'zip') return <FileArchive className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Verificar tamaño
    if (file.size > maxSize) {
      return `El archivo es demasiado grande. Máximo ${formatFileSize(maxSize)}`;
    }

    // Verificar tipo de archivo
    const allowedExtensions = accept.split(',').map(ext => ext.trim().replace('.', ''));
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return `Tipo de archivo no permitido. Tipos permitidos: ${accept}`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, maxSize, accept]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Arrastra y suelta tu archivo aquí
            </h3>
            <p className="text-gray-600 mb-4">
              o haz clic para seleccionar un archivo
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, ZIP, MP4, MP3, JPG, PNG, etc.
              </p>
              <p className="text-sm text-gray-500">
                Tamaño máximo: {formatFileSize(maxSize)}
              </p>
            </div>
            <Button 
              onClick={handleBrowseClick}
              variant="outline"
              className="mt-4"
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Archivo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  {getFileTypeIcon(selectedFile.name)}
                </div>
                <div>
                  <h4 className="font-medium text-green-900">{selectedFile.name}</h4>
                  <p className="text-sm text-green-700">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFileRemove}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};
