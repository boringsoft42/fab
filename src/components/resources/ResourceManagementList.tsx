'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff,
  FileText,
  Video,
  Music,
  Image,
  File
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResourceService } from '@/services/resource.service';
import { Resource } from '@/types/api';
import { ResourceUploadForm } from './ResourceUploadForm';

export function ResourceManagementList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await ResourceService.getAll();
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: "Error",
        description: "Error al cargar los recursos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await ResourceService.delete(resourceId);
      setResources(resources.filter(r => r.id !== resourceId));
      toast({
        title: "Éxito",
        description: "Recurso eliminado correctamente.",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el recurso.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublic = async (resource: Resource) => {
    try {
      const updatedResource = await ResourceService.togglePublic(resource.id);
      setResources(resources.map(r => 
        r.id === resource.id ? { ...r, isPublic: updatedResource.isPublic } : r
      ));
      toast({
        title: "Éxito",
        description: `Recurso ${updatedResource.isPublic ? 'publicado' : 'oculto'} correctamente.`,
      });
    } catch (error) {
      console.error('Error toggling resource public status:', error);
      toast({
        title: "Error",
        description: "Error al cambiar la visibilidad del recurso.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingResource(null);
    loadResources(); // Recargar la lista
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar recursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={loadResources} variant="outline">
          Actualizar
        </Button>
      </div>

      {/* Tabla de recursos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recursos ({filteredResources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No se encontraron recursos que coincidan con la búsqueda.' : 'No hay recursos disponibles.'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Descargas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-[50px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {resource.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {resource.authorId}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {resource.downloads || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={resource.isPublic ? "default" : "secondary"}>
                        {resource.isPublic ? "Público" : "Privado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(resource.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(resource)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublic(resource)}>
                            {resource.isPublic ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Ocultar
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publicar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El recurso será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(resource.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Recurso</DialogTitle>
          </DialogHeader>
          {editingResource && (
            <ResourceUploadForm
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
