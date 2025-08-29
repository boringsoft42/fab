"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  FileText, 
  FileVideo, 
  FileImage, 
  FileAudio, 
  FileArchive, 
  Link as LinkIcon,
  TrendingUp,
  Clock
} from 'lucide-react';

interface ResourceStatsProps {
  resources: Array<{
    id: string;
    type: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'ZIP' | 'OTHER';
    fileSize?: number;
    isDownloadable: boolean;
  }>;
}

export const ResourceStats: React.FC<ResourceStatsProps> = ({ resources }) => {
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
      case 'DOCUMENT':
        return <FileText className="h-4 w-4" />;
      case 'VIDEO':
        return <FileVideo className="h-4 w-4" />;
      case 'AUDIO':
        return <FileAudio className="h-4 w-4" />;
      case 'IMAGE':
        return <FileImage className="h-4 w-4" />;
      case 'LINK':
        return <LinkIcon className="h-4 w-4" />;
      case 'ZIP':
        return <FileArchive className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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

  // Calcular estadísticas
  const totalResources = resources.length;
  const downloadableResources = resources.filter(r => r.isDownloadable).length;
  const totalSize = resources.reduce((sum, r) => sum + (r.fileSize || 0), 0);
  
  // Contar por tipo
  const typeCounts = resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mock stats (en implementación real, vendrían del backend)
  const mockStats = {
    totalDownloads: 1250,
    totalViews: 3400,
    averageViewsPerResource: Math.round(3400 / Math.max(totalResources, 1)),
    mostDownloadedType: Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b, 'PDF'),
    lastActivity: new Date('2024-01-19T15:30:00Z'),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Resources */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recursos</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResources}</div>
          <p className="text-xs text-muted-foreground">
            {downloadableResources} descargables
          </p>
        </CardContent>
      </Card>

      {/* Total Size */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tamaño Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          <p className="text-xs text-muted-foreground">
            Promedio: {formatFileSize(totalSize / Math.max(totalResources, 1))}
          </p>
        </CardContent>
      </Card>

      {/* Total Downloads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Descargas</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.totalDownloads}</div>
          <p className="text-xs text-muted-foreground">
            {mockStats.averageViewsPerResource} por recurso
          </p>
        </CardContent>
      </Card>

      {/* Total Views */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vistas</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockStats.totalViews}</div>
          <p className="text-xs text-muted-foreground">
            Última actividad: {mockStats.lastActivity.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
