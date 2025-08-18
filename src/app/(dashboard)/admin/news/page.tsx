"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Eye, Edit, Trash2, Calendar, Tag, Image as ImageIcon, Upload, TrendingUp, MoreVertical, X } from "lucide-react";
import { NewsArticleService } from "@/services/newsarticle.service";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  category: string;
  tags: string[];
  imageUrl?: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const { toast } = useToast();

  // News creation form state
  const [newNews, setNewNews] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
    priority: "MEDIUM",
    imageUrl: "",
    status: "DRAFT",
    targetAudience: ["YOUTH"],
  });
  const [imagePreview, setImagePreview] = useState("");

  // Default banner image
  const defaultBannerImage = "/api/placeholder/800/400";

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      console.log("📰 AdminNewsPage - Fetching news...");
      console.log("📰 AdminNewsPage - Using NewsArticleService.getAll()");
      const result = await NewsArticleService.getAll();
      console.log("✅ AdminNewsPage - News fetched:", result);
      setNews(result || []);
      
      // Calculate stats from the fetched news
      const stats = {
        total: result.length,
        published: result.filter(n => n.status === "PUBLISHED").length,
        draft: result.filter(n => n.status === "DRAFT").length,
        totalViews: result.reduce((sum, n) => sum + n.viewCount, 0),
        totalLikes: result.reduce((sum, n) => sum + n.likeCount, 0),
      };
      setStats(stats);
    } catch (error) {
      console.error("❌ AdminNewsPage - Error fetching news:", error);
      toast({
        title: "Error",
        description: "Error al cargar las noticias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []); // Remove toast dependency to prevent unnecessary re-renders

  useEffect(() => {
    fetchNews();
  }, []); // Only run once on mount

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    setImagePreview("");
    setNewNews({ ...newNews, imageUrl: "" });
  };

  const handleCreateNews = useCallback(async () => {
    try {
      console.log("📰 AdminNewsPage - Creating news with data:", newNews);
      console.log("📰 AdminNewsPage - Using NewsArticleService.create()");
      
      // Validate required fields
      if (!newNews.title || !newNews.summary || !newNews.content || !newNews.category) {
        console.log("❌ AdminNewsPage - Validation failed - missing required fields");
        toast({
          title: "Error",
          description: "Por favor complete todos los campos requeridos (título, resumen, contenido y categoría)",
          variant: "destructive",
        });
        return;
      }
      
      const newsData = {
        title: newNews.title,
        summary: newNews.summary,
        content: newNews.content,
        category: newNews.category,
        priority: newNews.priority,
        imageUrl: newNews.imageUrl,
        status: newNews.status,
        authorId: "gov-1", // Default government ID
        authorName: "Gobierno Municipal de Cochabamba", // Default government name
        authorType: "GOVERNMENT", // Default government type
        tags: newNews.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      console.log("📰 AdminNewsPage - Sending data to service:", newsData);
      const result = await NewsArticleService.create(newsData);
      console.log("✅ AdminNewsPage - News created:", result);

      setShowCreateDialog(false);
      setNewNews({
        title: "",
        summary: "",
        content: "",
        category: "",
        tags: "",
        priority: "MEDIUM",
        imageUrl: "",
        status: "DRAFT",
        targetAudience: ["YOUTH"],
      });
      setImagePreview("");
      
      toast({
        title: "Éxito",
        description: "Noticia creada exitosamente",
      });
      
      // Fetch news only after successful creation
      fetchNews();
    } catch (error) {
      console.error("❌ AdminNewsPage - Error creating news:", error);
      toast({
        title: "Error",
        description: "Error al crear la noticia",
        variant: "destructive",
      });
    }
  }, [newNews, fetchNews, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-blue-100 text-blue-800";
      case "LOW":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredNews = useMemo(() => {
    return (news || []).filter((article) => {
      if (!article) return false;
      
      const searchLower = (searchTerm || '').toLowerCase();
      const articleTitle = (article.title || '').toLowerCase();
      const articleSummary = (article.summary || '').toLowerCase();
      
      return articleTitle.includes(searchLower) ||
             articleSummary.includes(searchLower);
    });
  }, [news, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
          <p className="text-muted-foreground">
            Crea y gestiona noticias que aparecerán en el feed de los jóvenes
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Noticia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Noticia</DialogTitle>
              <DialogDescription>
                Crea una noticia que será visible para los jóvenes en la
                plataforma
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              {/* Image Upload Section */}
              <div className="grid gap-2">
                <Label>Imagen de Portada</Label>
                {imagePreview ? (
                  <div className="relative">
                    <div
                      style={{
                        backgroundImage: `url(${imagePreview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Sube una imagen de portada para tu noticia
                        </p>
                        <p className="text-xs text-gray-400">
                          Se usará una imagen por defecto si no subes ninguna
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 mt-2"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Subir Imagen
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                  placeholder="Título de la noticia..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="summary">Resumen *</Label>
                <Textarea
                  id="summary"
                  value={newNews.summary}
                  onChange={(e) =>
                    setNewNews({ ...newNews, summary: e.target.value })
                  }
                  placeholder="Breve resumen de la noticia..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={newNews.content}
                  onChange={(e) =>
                    setNewNews({ ...newNews, content: e.target.value })
                  }
                  placeholder="Contenido completo de la noticia..."
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={newNews.category}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Política Pública">
                        Política Pública
                      </SelectItem>
                      <SelectItem value="Programas Sociales">
                        Programas Sociales
                      </SelectItem>
                      <SelectItem value="Educación Digital">
                        Educación Digital
                      </SelectItem>
                      <SelectItem value="Empleo Juvenil">
                        Empleo Juvenil
                      </SelectItem>
                      <SelectItem value="Capacitación">Capacitación</SelectItem>
                      <SelectItem value="Anuncios Oficiales">
                        Anuncios Oficiales
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridad</Label>
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
                      <SelectItem value="LOW">Baja</SelectItem>
                      <SelectItem value="MEDIUM">Media</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                      <SelectItem value="URGENT">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Etiquetas</Label>
                <Input
                  id="tags"
                  value={newNews.tags}
                  onChange={(e) =>
                    setNewNews({ ...newNews, tags: e.target.value })
                  }
                  placeholder="política pública, juventud, empleo (separadas por comas)"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateNews}
                  disabled={
                    !newNews.title || !newNews.summary || !newNews.content || !newNews.category
                  }
                >
                  Crear como Borrador
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewNews({ ...newNews, status: "PUBLISHED" });
                    handleCreateNews();
                  }}
                  disabled={
                    !newNews.title || !newNews.summary || !newNews.content || !newNews.category
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Noticias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.published}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.draft}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="archived">Archivados</SelectItem>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando noticias...
                  </TableCell>
                </TableRow>
              ) : filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron noticias
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex gap-3">
                        <div
                          style={{
                            backgroundImage: `url(${article.imageUrl || defaultBannerImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          className="w-16 h-12 rounded"
                        />
                        <div>
                          <div className="font-medium line-clamp-1">
                            {article.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {article.summary}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(article.status)}>
                        {article.status === "PUBLISHED"
                          ? "Publicado"
                          : article.status === "DRAFT"
                            ? "Borrador"
                            : "Archivado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(article.priority)}>
                        {article.priority === "URGENT"
                          ? "Urgente"
                          : article.priority === "HIGH"
                            ? "Alta"
                            : article.priority === "MEDIUM"
                              ? "Media"
                              : "Baja"}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.category}</TableCell>
                    <TableCell>
                      {article.publishedAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishedAt).toLocaleDateString(
                            "es-ES"
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          No publicado
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{article.viewCount} vistas</div>
                        <div>
                          {article.likeCount} likes, {article.commentCount}{" "}
                          comentarios
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
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
