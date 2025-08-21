'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Star, User, Calendar, Eye } from 'lucide-react';
import { Resource } from '@/types/api';

interface ResourceCardProps {
  resource: Resource;
  onDownload?: (resource: Resource) => void;
  onRate?: (resource: Resource, rating: number) => void;
  showActions?: boolean;
}

export function ResourceCard({ 
  resource, 
  onDownload, 
  onRate, 
  showActions = true 
}: ResourceCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(resource);
    }
  };

  const handleRate = (rating: number) => {
    if (onRate) {
      onRate(resource, rating);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {resource.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>Autor</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>{formatDate(resource.createdAt)}</span>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {resource.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {resource.description}
        </p>
        
        <div className="space-y-3">
          {/* Estadísticas */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>{resource.downloads || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{resource.rating || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>0</span>
            </div>
          </div>
          
          {/* Etiquetas */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {resource.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {resource.format}
            </Badge>
            {resource.tags && resource.tags.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {resource.tags[0]}
                {resource.tags.length > 1 && ` +${resource.tags.length - 1}`}
              </Badge>
            )}
          </div>
          
          {/* Acciones */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleRate(5)}
                title="Calificar con 5 estrellas"
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
