"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Link, 
  Image, 
  Video, 
  File, 
  ExternalLink,
  Eye
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'IMAGE' | 'LINK' | 'OTHER';
  url: string;
  filePath?: string;
  fileSize?: number;
  orderIndex?: number;
  isDownloadable?: boolean;
  createdAt?: string;
}

interface LessonResourcesProps {
  resources: Resource[];
  lessonTitle: string;
}

export const LessonResources: React.FC<LessonResourcesProps> = ({
  resources,
  lessonTitle
}) => {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'DOCUMENT':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'VIDEO':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'IMAGE':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'LINK':
        return <Link className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
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
      case 'IMAGE':
        return 'Imagen';
      case 'LINK':
        return 'Enlace';
      default:
        return 'Archivo';
    }
  };

  const handleDownload = (resource: Resource) => {
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (resource: Resource) => {
    window.open(resource.url, '_blank');
  };

  const handleExternalLink = (resource: Resource) => {
    window.open(resource.url, '_blank');
  };

  if (!resources || resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Recursos de la Lección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No hay recursos disponibles para esta lección.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Recursos de la Lección: {lessonTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {getResourceIcon(resource.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{resource.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {getResourceTypeLabel(resource.type)}
                    </Badge>
                    {resource.isDownloadable && (
                      <Badge variant="secondary" className="text-xs">
                        Descargable
                      </Badge>
                    )}
                  </div>
                  {resource.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {resource.description}
                    </p>
                  )}
                  {resource.fileSize && (
                    <p className="text-xs text-muted-foreground">
                      Tamaño: {(resource.fileSize / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {resource.type === 'LINK' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExternalLink(resource)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir
                  </Button>
                ) : (
                  <>
                    {resource.type === 'PDF' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(resource)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Vista Previa
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Descarga los recursos para acceder a ellos sin conexión a internet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
