'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Video, 
  Music, 
  Image, 
  File, 
  Download, 
  Users, 
  TrendingUp,
  Settings,
  Database,
  HardDrive
} from 'lucide-react';
import { ResourceService } from '@/services/resource.service';

interface ResourceStats {
  totalResources: number;
  totalDownloads: number;
  totalCategories: number;
  totalTypes: number;
  storageUsed: number;
  storageLimit: number;
  resourcesByType: { type: string; count: number }[];
  resourcesByCategory: { category: string; count: number }[];
  topResources: Array<{
    id: string;
    title: string;
    downloads: number;
    type: string;
  }>;
}

export function ResourceSettings() {
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas desde el backend
      const [resources, categories, types] = await Promise.all([
        ResourceService.getAll(),
        ResourceService.getResourceCategories(),
        ResourceService.getResourceTypes()
      ]);

      // Calcular estadísticas
      const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);
      const storageUsed = resources.length * 10; // Simulación: 10MB por recurso
      const storageLimit = 10000; // 10GB límite

      // Top recursos por descargas
      const topResources = resources
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          title: r.title,
          downloads: r.downloads || 0,
          type: r.type
        }));

      setStats({
        totalResources: resources.length,
        totalDownloads,
        totalCategories: categories.length,
        totalTypes: types.length,
        storageUsed,
        storageLimit,
        resourcesByType: types,
        resourcesByCategory: categories,
        topResources
      });

    } catch (error) {
      console.error('Error loading resource stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return <FileText className="h-4 w-4" />;
      case 'VIDEO': return <Video className="h-4 w-4" />;
      case 'AUDIO': return <Music className="h-4 w-4" />;
      case 'IMAGE': return <Image className="h-4 w-4" />;
      case 'TEXT': return <File className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatStorage = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se pudieron cargar las estadísticas.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recursos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResources}</div>
            <p className="text-xs text-muted-foreground">
              Recursos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Descargas</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Descargas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Categorías activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatStorage(stats.storageUsed)}</div>
            <p className="text-xs text-muted-foreground">
              de {formatStorage(stats.storageLimit)}
            </p>
            <Progress 
              value={(stats.storageUsed / stats.storageLimit) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Distribución por tipo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Distribución por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.resourcesByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="text-sm font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.count}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {((item.count / stats.totalResources) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Top Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topResources.map((resource, index) => (
              <div key={resource.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{resource.title}</p>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(resource.type)}
                      <span className="text-xs text-muted-foreground">{resource.type}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{resource.downloads} descargas</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Categorías más populares */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stats.resourcesByCategory.map((item) => (
              <div key={item.category} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{item.count}</div>
                <div className="text-sm text-muted-foreground">{item.category}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones de administración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Acciones de Administración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              Exportar Recursos
            </Button>
            <Button variant="outline">
              Importar Recursos
            </Button>
            <Button variant="outline">
              Limpiar Cache
            </Button>
            <Button variant="outline">
              Respaldar Datos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
