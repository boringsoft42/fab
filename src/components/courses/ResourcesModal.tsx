"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Download, 
  FileText, 
  Video, 
  Image, 
  File, 
  ExternalLink,
  X,
  FileDown,
  Eye
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  filePath: string;
  fileSize: number;
  orderIndex: number;
  isDownloadable: boolean;
  createdAt: string;
}

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  lessonTitle: string;
}

const getResourceIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'PDF':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'VIDEO':
      return <Video className="h-5 w-5 text-blue-500" />;
    case 'IMAGE':
      return <Image className="h-5 w-5 text-green-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const ResourcesModal: React.FC<ResourcesModalProps> = ({
  isOpen,
  onClose,
  resources,
  lessonTitle
}) => {
  const handleDownload = (resource: Resource) => {
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.filePath;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (resource: Resource) => {
    window.open(resource.url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Recursos de la Lección
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {lessonTitle}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay recursos disponibles para esta lección</p>
            </div>
          ) : (
            resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">
                          {resource.title}
                        </h3>
                        {resource.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(resource.fileSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(resource)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {resource.isDownloadable && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownload(resource)}
                          className="h-8 px-2"
                        >
                          <FileDown className="h-3 w-3 mr-1" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
