"use client";

import { useState, useEffect } from "react";
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
  Users,
  Building2,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  authorType: "GOVERNMENT" | "NGO";
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  featured: boolean;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  category: string;
  tags: string[];
  region: string;
  targetAudience: string[];
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
    priority: "MEDIUM",
    featured: false,
    status: "DRAFT",
    organizationType: "GOVERNMENT",
    targetAudience: ["YOUTH"],
    region: "Cochabamba",
    expiresAt: "",
  });

  useEffect(() => {
    fetchNews();
  }, [statusFilter, typeFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/news?status=${statusFilter}&type=${typeFilter}&organizationId=gov-1`
      );
      const data = await response.json();
      setNews(data.news || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNews = async () => {
    try {
      const newsData = {
        ...newNews,
        organizationId: "gov-1",
        organizationName: "Gobierno Municipal de Cochabamba",
        organizationLogo: "/api/placeholder/60/60",
        tags: newNews.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setNewNews({
          title: "",
          summary: "",
          content: "",
          category: "",
          tags: "",
          priority: "MEDIUM",
          featured: false,
          status: "DRAFT",
          organizationType: "GOVERNMENT",
          targetAudience: ["YOUTH"],
          region: "Cochabamba",
          expiresAt: "",
        });
        fetchNews();
      }
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

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

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Gestión de Noticias Institucionales
          </h1>
          <p className="text-muted-foreground">
            Crea y gestiona noticias oficiales que aparecerán en el feed de los
            jóvenes
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Noticia Oficial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Noticia Oficial</DialogTitle>
              <DialogDescription>
                Crea una noticia oficial que será visible para los jóvenes en la
                plataforma
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newNews.title}
                  onChange={(e) =>
                    setNewNews({ ...newNews, title: e.target.value })
                  }
                  placeholder="Título de la noticia oficial..."
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
                  placeholder="Contenido completo de la noticia oficial..."
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo de Organización</Label>
                  <RadioGroup
                    value={newNews.organizationType}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, organizationType: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="GOVERNMENT" id="government" />
                      <Label
                        htmlFor="government"
                        className="flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Gobierno/Municipalidad
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NGO" id="ngo" />
                      <Label htmlFor="ngo" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        ONG/Fundación
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="region">Región</Label>
                  <Select
                    value={newNews.region}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, region: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nacional">Nacional</SelectItem>
                      <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                      <SelectItem value="La Paz">La Paz</SelectItem>
                      <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                      <SelectItem value="Tarija">Tarija</SelectItem>
                      <SelectItem value="Oruro">Oruro</SelectItem>
                      <SelectItem value="Potosí">Potosí</SelectItem>
                      <SelectItem value="Chuquisaca">Chuquisaca</SelectItem>
                      <SelectItem value="Beni">Beni</SelectItem>
                      <SelectItem value="Pando">Pando</SelectItem>
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
              <div className="grid gap-2">
                <Label htmlFor="expiresAt">
                  Fecha de Expiración (Opcional)
                </Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={newNews.expiresAt}
                  onChange={(e) =>
                    setNewNews({ ...newNews, expiresAt: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={newNews.featured}
                  onCheckedChange={(checked) =>
                    setNewNews({ ...newNews, featured: !!checked })
                  }
                />
                <Label htmlFor="featured">
                  Destacar esta noticia (aparecerá primero)
                </Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateNews}
                  disabled={
                    !newNews.title || !newNews.summary || !newNews.content
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
                    !newNews.title || !newNews.summary || !newNews.content
                  }
                >
                  Publicar Inmediatamente
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
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
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
            <Edit className="h-4 w-4 text-muted-foreground" />
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
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impacto Total</CardTitle>
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
                placeholder="Buscar noticias oficiales..."
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="government">Gubernamentales</SelectItem>
                <SelectItem value="ngo">ONGs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>Noticias Oficiales</CardTitle>
          <CardDescription>
            Gestiona todas las noticias oficiales publicadas y borradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Región</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead>Alcance</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Cargando noticias...
                  </TableCell>
                </TableRow>
              ) : filteredNews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No se encontraron noticias
                  </TableCell>
                </TableRow>
              ) : (
                filteredNews.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium line-clamp-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {article.summary}
                        </div>
                        {article.featured && (
                          <Badge variant="secondary" className="mt-1">
                            Destacada
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {article.authorType === "GOVERNMENT" ? (
                          <Shield className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Users className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm">
                          {article.authorType === "GOVERNMENT"
                            ? "Gobierno"
                            : "ONG"}
                        </span>
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
                    <TableCell>{article.region}</TableCell>
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
                        <div>{article.likeCount} reacciones</div>
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
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Archivar
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
