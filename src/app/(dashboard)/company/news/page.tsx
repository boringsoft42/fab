&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Upload,
  X,
  Image as ImageIcon,
} from &ldquo;lucide-react&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  status: &ldquo;PUBLISHED&rdquo; | &ldquo;DRAFT&rdquo; | &ldquo;ARCHIVED&rdquo;;
  priority: &ldquo;LOW&rdquo; | &ldquo;MEDIUM&rdquo; | &ldquo;HIGH&rdquo; | &ldquo;URGENT&rdquo;;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  category: string;
  tags: string[];
  imageUrl?: string;
}

export default function CompanyNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(&ldquo;&rdquo;);
  const [statusFilter, setStatusFilter] = useState(&ldquo;all&rdquo;);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  // News creation form state
  const [newNews, setNewNews] = useState({
    title: &ldquo;&rdquo;,
    summary: &ldquo;&rdquo;,
    content: &ldquo;&rdquo;,
    category: &ldquo;&rdquo;,
    tags: &ldquo;&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    imageUrl: &ldquo;&rdquo;,
    status: &ldquo;DRAFT&rdquo;,
    targetAudience: [&ldquo;YOUTH&rdquo;],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(&ldquo;&rdquo;);

  // Default company banner image
  const defaultBannerImage = &ldquo;/api/placeholder/800/400&rdquo;;

  useEffect(() => {
    fetchNews();
  }, [statusFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/company/news?status=${statusFilter}&companyId=company-1`
      );
      const data = await response.json();
      setNews(data.news || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error(&ldquo;Error fetching news:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setNewNews({ ...newNews, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(&ldquo;&rdquo;);
    setNewNews({ ...newNews, imageUrl: &ldquo;&rdquo; });
  };

  const handleCreateNews = async () => {
    try {
      const newsData = {
        ...newNews,
        companyId: &ldquo;company-1&rdquo;,
        companyName: &ldquo;TechCorp Bolivia&rdquo;,
        companyLogo: &ldquo;/logos/techcorp.svg&rdquo;,
        imageUrl: newNews.imageUrl || defaultBannerImage, // Use default if no image uploaded
        tags: newNews.tags
          .split(&ldquo;,&rdquo;)
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await fetch(&ldquo;/api/company/news&rdquo;, {
        method: &ldquo;POST&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify(newsData),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setNewNews({
          title: &ldquo;&rdquo;,
          summary: &ldquo;&rdquo;,
          content: &ldquo;&rdquo;,
          category: &ldquo;&rdquo;,
          tags: &ldquo;&rdquo;,
          priority: &ldquo;MEDIUM&rdquo;,
          imageUrl: &ldquo;&rdquo;,
          status: &ldquo;DRAFT&rdquo;,
          targetAudience: [&ldquo;YOUTH&rdquo;],
        });
        setImageFile(null);
        setImagePreview(&ldquo;&rdquo;);
        fetchNews();
      }
    } catch (error) {
      console.error(&ldquo;Error creating news:&rdquo;, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case &ldquo;PUBLISHED&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;DRAFT&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      case &ldquo;ARCHIVED&rdquo;:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case &ldquo;URGENT&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;;
      case &ldquo;HIGH&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;;
      case &ldquo;MEDIUM&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;LOW&rdquo;:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className=&ldquo;space-y-6 px-4&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Gestión de Noticias</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Crea y gestiona noticias que aparecerán en el feed de los jóvenes
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
              Crear Noticia
            </Button>
          </DialogTrigger>
          <DialogContent className=&ldquo;max-w-3xl px-4&rdquo;>
            <DialogHeader>
              <DialogTitle>Crear Nueva Noticia</DialogTitle>
              <DialogDescription>
                Crea una noticia que será visible para los jóvenes en la
                plataforma
              </DialogDescription>
            </DialogHeader>
            <div className=&ldquo;grid gap-4 py-4 max-h-[70vh] overflow-y-auto&rdquo;>
              {/* Image Upload Section */}
              <div className=&ldquo;grid gap-2&rdquo;>
                <Label>Imagen de Portada</Label>
                {imagePreview ? (
                  <div className=&ldquo;relative&rdquo;>
                    <img
                      src={imagePreview}
                      alt=&ldquo;Vista previa&rdquo;
                      className=&ldquo;w-full h-48 object-cover rounded-lg border-2 border-dashed border-gray-300&rdquo;
                    />
                    <Button
                      size=&ldquo;sm&rdquo;
                      variant=&ldquo;destructive&rdquo;
                      className=&ldquo;absolute top-2 right-2&rdquo;
                      onClick={removeImage}
                    >
                      <X className=&ldquo;w-4 h-4&rdquo; />
                    </Button>
                  </div>
                ) : (
                  <div className=&ldquo;relative&rdquo;>
                    <div className=&ldquo;w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50&rdquo;>
                      <div className=&ldquo;text-center&rdquo;>
                        <ImageIcon className=&ldquo;w-12 h-12 text-gray-400 mx-auto mb-2&rdquo; />
                        <p className=&ldquo;text-sm text-gray-500 mb-2&rdquo;>
                          Sube una imagen de portada para tu noticia
                        </p>
                        <p className=&ldquo;text-xs text-gray-400&rdquo;>
                          Se usará una imagen por defecto si no subes ninguna
                        </p>
                        <Input
                          type=&ldquo;file&rdquo;
                          accept=&ldquo;image/*&rdquo;
                          onChange={handleImageUpload}
                          className=&ldquo;hidden&rdquo;
                          id=&ldquo;image-upload&rdquo;
                        />
                        <Label
                          htmlFor=&ldquo;image-upload&rdquo;
                          className=&ldquo;cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 mt-2&rdquo;
                        >
                          <Upload className=&ldquo;w-4 h-4 mr-2&rdquo; />
                          Subir Imagen
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className=&ldquo;grid gap-2 px-4&rdquo;>
                <Label htmlFor=&ldquo;title&rdquo;>Título *</Label>
                <Input
                  id=&ldquo;title&rdquo;
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                  placeholder=&ldquo;Título de la noticia...&rdquo;
                />
              </div>
              <div className=&ldquo;grid gap-2 px-4&rdquo;>
                <Label htmlFor=&ldquo;summary&rdquo;>Resumen *</Label>
                <Textarea
                  id=&ldquo;summary&rdquo;
                  value={newNews.summary}
                  onChange={(e) =>
                    setNewNews({ ...newNews, summary: e.target.value })
                  }
                  placeholder=&ldquo;Breve resumen de la noticia...&rdquo;
                  rows={2}
                />
              </div>
              <div className=&ldquo;grid gap-2 px-4&rdquo;>
                <Label htmlFor=&ldquo;content&rdquo;>Contenido *</Label>
                <Textarea
                  id=&ldquo;content&rdquo;
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                  placeholder=&ldquo;Contenido completo de la noticia...&rdquo;
                  rows={6}
                />
              </div>
              <div className=&ldquo;grid grid-cols-2 gap-4 px-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;category&rdquo;>Categoría</Label>
                  <Select
                    value={newNews.category}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar categoría&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;Empleo&rdquo;>Empleo</SelectItem>
                      <SelectItem value=&ldquo;Educación y Becas&rdquo;>
                        Educación y Becas
                      </SelectItem>
                      <SelectItem value=&ldquo;Capacitación&rdquo;>Capacitación</SelectItem>
                      <SelectItem value=&ldquo;Responsabilidad Social&rdquo;>
                        Responsabilidad Social
                      </SelectItem>
                      <SelectItem value=&ldquo;Innovación&rdquo;>Innovación</SelectItem>
                      <SelectItem value=&ldquo;Anuncios Corporativos&rdquo;>
                        Anuncios Corporativos
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=&ldquo;grid gap-2 px-4&rdquo;>
                  <Label htmlFor=&ldquo;priority&rdquo;>Prioridad</Label>
                  <Select
                    value={newNews.priority}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;LOW&rdquo;>Baja</SelectItem>
                      <SelectItem value=&ldquo;MEDIUM&rdquo;>Media</SelectItem>
                      <SelectItem value=&ldquo;HIGH&rdquo;>Alta</SelectItem>
                      <SelectItem value=&ldquo;URGENT&rdquo;>Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className=&ldquo;grid gap-2 px-4&rdquo;>
                <Label htmlFor=&ldquo;tags&rdquo;>Etiquetas</Label>
                <Input
                  id=&ldquo;tags&rdquo;
                  value={newNews.tags}
                  onChange={(e) =>
                    setNewNews({ ...newNews, tags: e.target.value })
                  }
                  placeholder=&ldquo;empleo, tecnología, jóvenes (separadas por comas)&rdquo;
                />
              </div>
              <div className=&ldquo;flex gap-2 pt-4 px-4 &rdquo;>
                <Button
                  onClick={handleCreateNews}
                  disabled={
                    !newNews.title || !newNews.summary || !newNews.content
                  }
                >
                  Crear como Borrador
                </Button>
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={() => {
                    setNewNews({ ...newNews, status: &ldquo;PUBLISHED&rdquo; });
                    handleCreateNews();
                  }}
                  disabled={
                    !newNews.title || !newNews.summary || !newNews.content
                  }
                >
                  Publicar Ahora
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-5 gap-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Total Noticias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>
              {stats.published}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Borradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-yellow-600&rdquo;>
              {stats.draft}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Vistas</CardTitle>
            <Eye className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Likes</CardTitle>
            <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;flex gap-4&rdquo;>
            <div className=&ldquo;flex-1&rdquo;>
              <Input
                placeholder=&ldquo;Buscar noticias...&rdquo;
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=&ldquo;max-w-sm&rdquo;
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className=&ldquo;w-[180px]&rdquo;>
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
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Noticias</CardTitle>
          <CardDescription>
            Gestiona todas tus noticias publicadas y borradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Noticia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className=&ldquo;text-center py-8&rdquo;>
                    Cargando noticias...
                  </TableCell>
                </TableRow>
              ) : filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className=&ldquo;text-center py-8&rdquo;>
                    No se encontraron noticias
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className=&ldquo;flex gap-3&rdquo;>
                        <img
                          src={article.imageUrl || defaultBannerImage}
                          alt={article.title}
                          className=&ldquo;w-16 h-12 object-cover rounded&rdquo;
                        />
                        <div>
                          <div className=&ldquo;font-medium line-clamp-1&rdquo;>
                            {article.title}
                          </div>
                          <div className=&ldquo;text-sm text-muted-foreground line-clamp-1&rdquo;>
                            {article.summary}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(article.status)}>
                        {article.status === &ldquo;PUBLISHED&rdquo;
                          ? &ldquo;Publicado&rdquo;
                          : article.status === &ldquo;DRAFT&rdquo;
                            ? &ldquo;Borrador&rdquo;
                            : &ldquo;Archivado&rdquo;}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(article.priority)}>
                        {article.priority === &ldquo;URGENT&rdquo;
                          ? &ldquo;Urgente&rdquo;
                          : article.priority === &ldquo;HIGH&rdquo;
                            ? &ldquo;Alta&rdquo;
                            : article.priority === &ldquo;MEDIUM&rdquo;
                              ? &ldquo;Media&rdquo;
                              : &ldquo;Baja&rdquo;}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      {article.publishedAt ? (
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <Calendar className=&ldquo;w-3 h-3&rdquo; />
                          {new Date(article.publishedAt).toLocaleDateString(
                            &ldquo;es-ES&rdquo;
                          )}
                        </div>
                      ) : (
                        <span className=&ldquo;text-muted-foreground&rdquo;>
                          No publicado
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;text-sm&rdquo;>
                        <div>{article.viewCount} vistas</div>
                        <div>
                          {article.likeCount} likes, {article.commentCount}{&ldquo; &rdquo;}
                          comentarios
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                            <MoreVertical className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className=&ldquo;text-red-600&rdquo;>
                            <Trash2 className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
