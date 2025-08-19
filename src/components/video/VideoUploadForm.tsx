"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  Video,
  Image,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Play,
  Clock,
  FileVideo,
  FileImage,
  File,
  Trash2,
} from 'lucide-react';
import { useLessonVideoUpload } from '@/hooks/useLessonVideoUpload';
import { VideoPlayer } from './VideoPlayer';

interface VideoUploadFormProps {
  moduleId: string;
  onSuccess?: (lessonId: string) => void;
  onCancel?: () => void;
}

interface UploadedFile {
  file: File;
  preview?: string;
  type: 'video' | 'image' | 'document';
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  moduleId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    contentType: 'VIDEO' as 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'LIVE',
    duration: 15,
    orderIndex: 1,
    isRequired: true,
    isPreview: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    video?: UploadedFile;
    thumbnail?: UploadedFile;
    attachments: UploadedFile[];
  }>({
    attachments: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);

  const { uploadMultipleFilesWithProgress, isUploading, uploadProgress } = useLessonVideoUpload();

  // Handle form data changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file selection
  const handleFileSelect = (file: File, type: 'video' | 'image' | 'document') => {
    const uploadedFile: UploadedFile = { file, type };

    // Generate preview for images and videos
    if (type === 'image' || type === 'video') {
      const url = URL.createObjectURL(file);
      uploadedFile.preview = url;
      
      if (type === 'video') {
        setPreviewUrl(url);
      }
    }

    // Update state based on file type
    if (type === 'video') {
      setUploadedFiles(prev => ({ ...prev, video: uploadedFile }));
    } else if (type === 'image') {
      setUploadedFiles(prev => ({ ...prev, thumbnail: uploadedFile }));
    } else {
      setUploadedFiles(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, uploadedFile] 
      }));
    }
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'video' | 'image' | 'document') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0], type);
    }
  };

  // Remove file
  const removeFile = (type: 'video' | 'image' | 'document', index?: number) => {
    if (type === 'video') {
      setUploadedFiles(prev => ({ ...prev, video: undefined }));
      setPreviewUrl('');
    } else if (type === 'image') {
      setUploadedFiles(prev => ({ ...prev, thumbnail: undefined }));
    } else if (typeof index === 'number') {
      setUploadedFiles(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFiles.video && formData.contentType === 'VIDEO') {
      alert('Please select a video file');
      return;
    }

    try {
      const uploadData = {
        ...formData,
        moduleId,
        video: uploadedFiles.video?.file,
        thumbnail: uploadedFiles.thumbnail?.file,
        attachments: uploadedFiles.attachments.map(f => f.file),
      };

      const result = await uploadMultipleFilesWithProgress(uploadData);
      
      if (onSuccess) {
        onSuccess(result.id);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <FileVideo className="h-4 w-4" />;
      case 'image':
        return <FileImage className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Subir Video a Lección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título de la Lección</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Ej: Introducción a HTML"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Contenido</label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value: any) => handleFormChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="TEXT">Texto</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="ASSIGNMENT">Asignación</SelectItem>
                    <SelectItem value="LIVE">En Vivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Describe el contenido de la lección..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido</label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                placeholder="Contenido detallado de la lección..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Orden</label>
                <Input
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => handleFormChange('orderIndex', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Duración (minutos)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Configuración</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={(e) => handleFormChange('isRequired', e.target.checked)}
                    />
                    <span className="text-sm">Obligatoria</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPreview}
                      onChange={(e) => handleFormChange('isPreview', e.target.checked)}
                    />
                    <span className="text-sm">Vista previa</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Video Upload */}
            {formData.contentType === 'VIDEO' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Principal
                </h3>
                
                {!uploadedFiles.video ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => handleDrop(e, 'video')}
                  >
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Arrastra tu video aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Formatos: MP4, WebM, OGG, AVI, MOV, WMV, FLV, MKV. Máximo 500MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoFileInputRef.current?.click()}
                    >
                      Seleccionar Video
                    </Button>
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file, 'video');
                      }}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileVideo className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{uploadedFiles.video.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadedFiles.video.file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('video')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {previewUrl && (
                      <div className="mt-4">
                        <VideoPlayer
                          videoUrl={previewUrl}
                          width="100%"
                          height={200}
                          controls={true}
                          title={uploadedFiles.video.file.name}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Image className="h-5 w-5" />
                Thumbnail (Opcional)
              </h3>
              
              {!uploadedFiles.thumbnail ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'image')}
                >
                  <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Arrastra una imagen aquí</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Formatos: JPG, PNG, GIF, WebP. Máximo 10MB
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => thumbnailFileInputRef.current?.click()}
                  >
                    Seleccionar Imagen
                  </Button>
                  <input
                    ref={thumbnailFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file, 'image');
                    }}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileImage className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="font-medium">{uploadedFiles.thumbnail.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(uploadedFiles.thumbnail.file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('image')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {uploadedFiles.thumbnail.preview && (
                    <img
                      src={uploadedFiles.thumbnail.preview}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Attachments Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Archivos Adjuntos (Opcional)
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, 'document')}
              >
                <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium mb-1">Arrastra archivos aquí</p>
                <p className="text-xs text-gray-500 mb-3">
                  Formatos: PDF, DOC, DOCX, TXT. Máximo 50MB por archivo
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => attachmentFileInputRef.current?.click()}
                >
                  Seleccionar Archivos
                </Button>
                <input
                  ref={attachmentFileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach(file => handleFileSelect(file, 'document'));
                  }}
                  className="hidden"
                />
              </div>

              {/* Attachments List */}
              {uploadedFiles.attachments.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(attachment.type)}
                        <div>
                          <p className="font-medium">{attachment.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(attachment.file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('document', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && uploadProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subiendo archivos...</span>
                  <span className="text-sm text-gray-500">
                    {uploadProgress.percentage}%
                  </span>
                </div>
                <Progress value={uploadProgress.percentage} className="w-full" />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !formData.title}
              >
                {isUploading ? 'Subiendo...' : 'Crear Lección'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
