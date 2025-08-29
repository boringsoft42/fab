"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FileVideo, 
  FileImage, 
  FileAudio, 
  FileArchive, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X
} from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { getVideoUrl, getPdfUrl, getFileUrl } from '@/lib/video-utils';

interface ResourceViewerProps {
  resource: {
    id: string;
    title: string;
    description?: string;
    type: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'ZIP' | 'OTHER';
    url: string;
    filePath?: string;
    fileSize?: number;
    orderIndex: number;
    isDownloadable: boolean;
  };
  onClose?: () => void;
}

export const ResourceViewer: React.FC<ResourceViewerProps> = ({ resource, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
      case 'DOCUMENT':
        return <FileText className="h-6 w-6" />;
      case 'VIDEO':
        return <FileVideo className="h-6 w-6" />;
      case 'AUDIO':
        return <FileAudio className="h-6 w-6" />;
      case 'IMAGE':
        return <FileImage className="h-6 w-6" />;
      case 'LINK':
        return <LinkIcon className="h-6 w-6" />;
      case 'ZIP':
        return <FileArchive className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'PDF';
      case 'DOCUMENT':
        return 'Documento';
      case 'VIDEO':
        return 'Video';
      case 'AUDIO':
        return 'Audio';
      case 'IMAGE':
        return 'Imagen';
      case 'LINK':
        return 'Enlace';
      case 'ZIP':
        return 'Archivo ZIP';
      default:
        return 'Otro';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const downloadUrl = getFileUrl(resource.url, resource.type);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (resource.type) {
      case 'PDF':
        const pdfUrl = getPdfUrl(resource.url);
        console.log('📄 ResourceViewer - PDF URL conversion:', { original: resource.url, proxy: pdfUrl });
        
        return (
          <div className="w-full h-[600px]">
            <iframe
              src={pdfUrl}
              title={resource.title}
              className="w-full h-full border rounded-lg"
            />
          </div>
        );

      case 'VIDEO':
        return (
          <div className="w-full">
            <VideoPlayer
              videoUrl={resource.url}
              title={resource.title}
              width="100%"
              height={400}
              controls={true}
              downloadable={resource.isDownloadable}
            />
          </div>
        );

      case 'AUDIO':
        return (
          <div className="w-full p-4 bg-gray-100 rounded-lg">
            <audio
              controls
              className="w-full"
              src={resource.url}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        );

      case 'IMAGE':
        return (
          <div className="w-full flex justify-center">
            <img
              src={resource.url}
              alt={resource.title}
              className="max-w-full max-h-[600px] object-contain rounded-lg"
            />
          </div>
        );

      case 'LINK':
        return (
          <div className="w-full p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="h-4 w-4" />
              <span className="font-medium">Enlace externo</span>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {resource.url}
            </a>
          </div>
        );

      case 'ZIP':
      case 'DOCUMENT':
      case 'OTHER':
        return (
          <div className="w-full p-8 bg-gray-50 rounded-lg text-center">
            <div className="mb-4">
              {getResourceTypeIcon(resource.type)}
            </div>
            <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
            <p className="text-gray-600 mb-4">
              Este tipo de archivo no se puede previsualizar directamente.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload} disabled={!resource.isDownloadable}>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button variant="outline" asChild>
                <a href={getFileUrl(resource.url, resource.type)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir
                </a>
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">Tipo de recurso no soportado para previsualización.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
              {getResourceTypeIcon(resource.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {getResourceTypeLabel(resource.type)}
                </Badge>
                {resource.fileSize && (
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(resource.fileSize)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {resource.isDownloadable && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a href={getFileUrl(resource.url, resource.type)} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto max-h-[calc(90vh-120px)]">
          {resource.description && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{resource.description}</p>
            </div>
          )}
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};
