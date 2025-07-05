&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import {
  FileText,
  BookOpen,
  Play,
  Headphones,
  Calculator,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Download,
  Star,
  TrendingUp,
  Award,
  Upload,
} from &ldquo;lucide-react&rdquo;;

interface Resource {
  id: string;
  title: string;
  description: string;
  type: &ldquo;template&rdquo; | &ldquo;guide&rdquo; | &ldquo;video&rdquo; | &ldquo;podcast&rdquo; | &ldquo;tool&rdquo;;
  thumbnail: string;
  category: string;
  downloads: number;
  rating: number;
  author: string;
  fileUrl: string;
  fileSize: string;
  tags: string[];
  status: &ldquo;published&rdquo; | &ldquo;draft&rdquo; | &ldquo;archived&rdquo;;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Stats {
  total: number;
  byType: {
    template: number;
    guide: number;
    video: number;
    podcast: number;
    tool: number;
  };
  byStatus: {
    published: number;
    draft: number;
    archived: number;
  };
  totalDownloads: number;
  averageRating: number;
  featured: number;
}

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byType: { template: 0, guide: 0, video: 0, podcast: 0, tool: 0 },
    byStatus: { published: 0, draft: 0, archived: 0 },
    totalDownloads: 0,
    averageRating: 0,
    featured: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [selectedType, setSelectedType] = useState(&ldquo;all&rdquo;);
  const [selectedCategory, setSelectedCategory] = useState(&ldquo;all&rdquo;);
  const [selectedStatus, setSelectedStatus] = useState(&ldquo;all&rdquo;);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Form state for creating/editing resources
  const [formData, setFormData] = useState({
    title: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    type: &ldquo;template&rdquo; as const,
    category: &ldquo;&rdquo;,
    thumbnail: &ldquo;&rdquo;,
    fileUrl: &ldquo;&rdquo;,
    fileSize: &ldquo;&rdquo;,
    tags: &ldquo;&rdquo;,
    featured: false,
    status: &ldquo;draft&rdquo; as const,
  });

  useEffect(() => {
    fetchResources();
  }, [
    searchQuery,
    selectedType,
    selectedCategory,
    selectedStatus,
    fetchResources,
  ]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      if (searchQuery) params.append(&ldquo;search&rdquo;, searchQuery);
      if (selectedType !== &ldquo;all&rdquo;) params.append(&ldquo;type&rdquo;, selectedType);
      if (selectedCategory !== &ldquo;all&rdquo;)
        params.append(&ldquo;category&rdquo;, selectedCategory);
      if (selectedStatus !== &ldquo;all&rdquo;) params.append(&ldquo;status&rdquo;, selectedStatus);

      const response = await fetch(
        `/api/admin/entrepreneurship/resources?${params}`
      );
      const data = await response.json();

      setResources(data.resources);
      setStats(data.stats);
    } catch (error) {
      console.error(&ldquo;Error fetching resources:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async () => {
    try {
      const response = await fetch(&ldquo;/api/admin/entrepreneurship/resources&rdquo;, {
        method: &ldquo;POST&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(&ldquo;,&rdquo;).map((tag) => tag.trim()),
          author: &ldquo;Administrador&rdquo;, // This would come from user context
        }),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setFormData({
          title: &ldquo;&rdquo;,
          description: &ldquo;&rdquo;,
          type: &ldquo;template&rdquo;,
          category: &ldquo;&rdquo;,
          thumbnail: &ldquo;&rdquo;,
          fileUrl: &ldquo;&rdquo;,
          fileSize: &ldquo;&rdquo;,
          tags: &ldquo;&rdquo;,
          featured: false,
          status: &ldquo;draft&rdquo;,
        });
        fetchResources();
      }
    } catch (error) {
      console.error(&ldquo;Error creating resource:&rdquo;, error);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case &ldquo;template&rdquo;:
        return <FileText className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;guide&rdquo;:
        return <BookOpen className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;video&rdquo;:
        return <Play className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;podcast&rdquo;:
        return <Headphones className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;tool&rdquo;:
        return <Calculator className=&ldquo;h-4 w-4&rdquo; />;
      default:
        return <FileText className=&ldquo;h-4 w-4&rdquo; />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case &ldquo;template&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;guide&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;video&rdquo;:
        return &ldquo;bg-purple-100 text-purple-800&rdquo;;
      case &ldquo;podcast&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;;
      case &ldquo;tool&rdquo;:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case &ldquo;published&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;draft&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      case &ldquo;archived&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const categories = [
    &ldquo;Planificación&rdquo;,
    &ldquo;Validación&rdquo;,
    &ldquo;Finanzas&rdquo;,
    &ldquo;Marketing&rdquo;,
    &ldquo;Legal&rdquo;,
    &ldquo;Tecnología&rdquo;,
  ];

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-32 bg-gray-200 rounded-lg&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            {[...Array(4)].map((_, i) => (
              <div key={i} className=&ldquo;h-24 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Gestión de Recursos</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Administra recursos educativos para emprendedores
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Nuevo Recurso
            </Button>
          </DialogTrigger>
          <DialogContent className=&ldquo;max-w-2xl max-h-[90vh] overflow-y-auto&rdquo;>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Recurso</DialogTitle>
            </DialogHeader>
            <div className=&ldquo;space-y-4 p-1&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;title&rdquo;>Título *</Label>
                  <Input
                    id=&ldquo;title&rdquo;
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder=&ldquo;Título del recurso&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;type&rdquo;>Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: &ldquo;template&rdquo; | &ldquo;guide&rdquo; | &ldquo;video&rdquo; | &ldquo;podcast&rdquo; | &ldquo;tool&rdquo;
                    ) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;template&rdquo;>Plantilla</SelectItem>
                      <SelectItem value=&ldquo;guide&rdquo;>Guía</SelectItem>
                      <SelectItem value=&ldquo;video&rdquo;>Video</SelectItem>
                      <SelectItem value=&ldquo;podcast&rdquo;>Podcast</SelectItem>
                      <SelectItem value=&ldquo;tool&rdquo;>Herramienta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;description&rdquo;>Descripción *</Label>
                <Textarea
                  id=&ldquo;description&rdquo;
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder=&ldquo;Descripción detallada del recurso&rdquo;
                  rows={3}
                />
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;category&rdquo;>Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar categoría&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;status&rdquo;>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(
                      value: &ldquo;published&rdquo; | &ldquo;draft&rdquo; | &ldquo;archived&rdquo;
                    ) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;draft&rdquo;>Borrador</SelectItem>
                      <SelectItem value=&ldquo;published&rdquo;>Publicado</SelectItem>
                      <SelectItem value=&ldquo;archived&rdquo;>Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;fileUrl&rdquo;>URL del Archivo</Label>
                  <Input
                    id=&ldquo;fileUrl&rdquo;
                    value={formData.fileUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fileUrl: e.target.value,
                      }))
                    }
                    placeholder=&ldquo;https://... o /downloads/...&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;fileSize&rdquo;>Tamaño del Archivo</Label>
                  <Input
                    id=&ldquo;fileSize&rdquo;
                    value={formData.fileSize}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fileSize: e.target.value,
                      }))
                    }
                    placeholder=&ldquo;ej: 2.5 MB&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;thumbnail&rdquo;>URL de Imagen</Label>
                <Input
                  id=&ldquo;thumbnail&rdquo;
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  placeholder=&ldquo;URL de la imagen de portada&rdquo;
                />
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;tags&rdquo;>Etiquetas</Label>
                <Input
                  id=&ldquo;tags&rdquo;
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder=&ldquo;etiqueta1, etiqueta2, etiqueta3&rdquo;
                />
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                  Separar con comas
                </p>
              </div>

              <div className=&ldquo;flex items-center space-x-2&rdquo;>
                <Checkbox
                  id=&ldquo;featured&rdquo;
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: !!checked }))
                  }
                />
                <Label htmlFor=&ldquo;featured&rdquo;>Recurso destacado</Label>
              </div>

              <div className=&ldquo;flex justify-end space-x-2 pt-4&rdquo;>
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateResource}>Crear Recurso</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-5 gap-4&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Total Recursos
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.total}</p>
              </div>
              <FileText className=&ldquo;h-8 w-8 text-blue-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Descargas Totales
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>
              <Download className=&ldquo;h-8 w-8 text-green-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Calificación Promedio
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
              <Star className=&ldquo;h-8 w-8 text-yellow-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Publicados
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.byStatus.published}</p>
              </div>
              <TrendingUp className=&ldquo;h-8 w-8 text-purple-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Destacados
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{stats.featured}</p>
              </div>
              <Award className=&ldquo;h-8 w-8 text-orange-600&rdquo; />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className=&ldquo;p-6&rdquo;>
          <div className=&ldquo;flex flex-col md:flex-row gap-4&rdquo;>
            <div className=&ldquo;relative flex-1&rdquo;>
              <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground&rdquo; />
              <Input
                placeholder=&ldquo;Buscar recursos por título, descripción o etiquetas...&rdquo;
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=&ldquo;pl-10&rdquo;
              />
            </div>
            <div className=&ldquo;flex gap-2&rdquo;>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className=&ldquo;w-[150px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Tipo&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todos los tipos</SelectItem>
                  <SelectItem value=&ldquo;template&rdquo;>Plantillas</SelectItem>
                  <SelectItem value=&ldquo;guide&rdquo;>Guías</SelectItem>
                  <SelectItem value=&ldquo;video&rdquo;>Videos</SelectItem>
                  <SelectItem value=&ldquo;podcast&rdquo;>Podcasts</SelectItem>
                  <SelectItem value=&ldquo;tool&rdquo;>Herramientas</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className=&ldquo;w-[150px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Categoría&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className=&ldquo;w-[120px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Estado&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                  <SelectItem value=&ldquo;published&rdquo;>Publicados</SelectItem>
                  <SelectItem value=&ldquo;draft&rdquo;>Borradores</SelectItem>
                  <SelectItem value=&ldquo;archived&rdquo;>Archivados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Recursos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recurso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descargas</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Destacado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className=&ldquo;flex items-center gap-3&rdquo;>
                      <div className=&ldquo;w-12 h-12 bg-gray-100 rounded flex items-center justify-center&rdquo;>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <p className=&ldquo;font-medium&rdquo;>{resource.title}</p>
                        <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          {resource.description.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{resource.downloads.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Star className=&ldquo;h-3 w-3 fill-yellow-400 text-yellow-400&rdquo; />
                      {resource.rating.toFixed(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {resource.featured && (
                      <Award className=&ldquo;h-4 w-4 text-orange-600&rdquo; />
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                          <MoreVertical className=&ldquo;h-4 w-4&rdquo; />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align=&ldquo;end&rdquo;>
                        <DropdownMenuItem>
                          <Eye className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Upload className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Subir Archivo
                        </DropdownMenuItem>
                        <DropdownMenuItem className=&ldquo;text-red-600&rdquo;>
                          <Trash2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {resources.length === 0 && (
            <div className=&ldquo;text-center py-8&rdquo;>
              <FileText className=&ldquo;h-12 w-12 mx-auto text-muted-foreground mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                No se encontraron recursos
              </h3>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Intenta ajustar los filtros o crear nuevos recursos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
