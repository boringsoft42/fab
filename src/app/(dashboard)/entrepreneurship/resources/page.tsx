"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  Download,
  Star,
  Play,
  FileText,
  BookOpen,
  Calculator,
  Headphones,
  Filter,
  SortAsc,
  Eye,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "template" | "guide" | "video" | "podcast" | "tool";
  category: string;
  downloads: number;
  rating: number;
  reviewCount: number;
  fileSize: string;
  format: string;
  createdAt: Date;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  tags: string[];
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [resources, searchQuery, filterType, filterCategory, sortBy]);

  const fetchResources = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockResources: Resource[] = [
        {
          id: "resource-1",
          title: "Plantilla de Plan de Negocios 2024",
          description: "Plantilla completa en Word con todas las secciones necesarias para crear un plan de negocios profesional. Incluye ejemplos y guías paso a paso.",
          type: "template",
          category: "Planificación",
          downloads: 2847,
          rating: 4.8,
          reviewCount: 156,
          fileSize: "2.5 MB",
          format: "DOCX",
          createdAt: new Date("2024-01-15"),
          difficulty: "beginner",
          estimatedTime: "30 minutos",
          tags: ["Plan de Negocios", "Startups", "Plantilla", "Fundamentos"],
        },
        {
          id: "resource-2",
          title: "Guía de Validación de Mercado",
          description: "Metodología completa para validar tu idea de negocio antes de invertir tiempo y dinero. Incluye herramientas prácticas y casos de estudio bolivianos.",
          type: "guide",
          category: "Validación",
          downloads: 1923,
          rating: 4.6,
          reviewCount: 98,
          fileSize: "5.1 MB",
          format: "PDF",
          createdAt: new Date("2024-01-20"),
          difficulty: "intermediate",
          estimatedTime: "45 minutos",
          tags: [
            "Validación",
            "Investigación de Mercado",
            "MVP",
            "Metodología",
          ],
        },
        {
          id: "resource-3",
          title: "Finanzas para Emprendedores",
          description: "Video curso completo sobre gestión financiera básica para startups. Aprende a manejar flujo de caja, proyecciones y métricas financieras clave.",
          type: "video",
          category: "Finanzas",
          downloads: 3456,
          rating: 4.9,
          reviewCount: 234,
          fileSize: "850 MB",
          format: "MP4",
          createdAt: new Date("2024-01-10"),
          difficulty: "intermediate",
          estimatedTime: "2 horas",
          tags: ["Finanzas", "Flujo de Caja", "Métricas", "Contabilidad"],
        },
        {
          id: "resource-4",
          title: "Calculadora de Proyecciones Financieras",
          description: "Herramienta Excel interactiva para calcular proyecciones financieras automáticamente. Incluye gráficos dinámicos y análisis de sensibilidad.",
          type: "tool",
          category: "Finanzas",
          downloads: 1567,
          rating: 4.7,
          reviewCount: 89,
          fileSize: "1.2 MB",
          format: "XLSX",
          createdAt: new Date("2024-02-01"),
          difficulty: "advanced",
          estimatedTime: "15 minutos",
          tags: ["Excel", "Proyecciones", "Automatización", "Análisis"],
        },
        {
          id: "resource-5",
          title: "Podcast: Emprendedores Bolivianos Exitosos",
          description: "Serie de entrevistas inspiradoras con emprendedores bolivianos que han escalado sus negocios. Aprende de sus experiencias y estrategias.",
          type: "podcast",
          category: "Inspiración",
          downloads: 892,
          rating: 4.5,
          reviewCount: 67,
          fileSize: "45 MB",
          format: "MP3",
          createdAt: new Date("2024-02-05"),
          difficulty: "beginner",
          estimatedTime: "30 minutos",
          tags: [
            "Historias de Éxito",
            "Inspiración",
            "Casos Bolivianos",
            "Mentalidad",
          ],
        },
        {
          id: "resource-6",
          title: "Cómo Presentar tu Startup a Inversionistas",
          description: "Masterclass completa sobre cómo crear y presentar un pitch deck efectivo. Incluye plantillas y ejemplos de presentaciones exitosas.",
          type: "video",
          category: "Fundraising",
          downloads: 2156,
          rating: 4.8,
          reviewCount: 145,
          fileSize: "1.2 GB",
          format: "MP4",
          createdAt: new Date("2024-01-25"),
          difficulty: "advanced",
          estimatedTime: "1.5 horas",
          tags: ["Pitch Deck", "Inversión", "Presentación", "Fundraising"],
        },
      ];

      setResources(mockResources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...resources];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((resource) => resource.type === filterType);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (resource) => resource.category === filterCategory
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "downloads":
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // popular
        filtered.sort((a, b) => b.downloads - a.downloads);
    }

    setFilteredResources(filtered);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "template":
        return <FileText className="h-5 w-5" />;
      case "guide":
        return <BookOpen className="h-5 w-5" />;
      case "video":
        return <Play className="h-5 w-5" />;
      case "podcast":
        return <Headphones className="h-5 w-5" />;
      case "tool":
        return <Calculator className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [
    "Planificación",
    "Validación",
    "Finanzas",
    "Marketing",
    "Fundraising",
    "Legal",
    "Inspiración",
  ];
  const types = ["template", "guide", "video", "podcast", "tool"];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Centro de Recursos</h1>
        <p className="text-muted-foreground">
          Accede a plantillas, guías, videos y herramientas para hacer crecer tu
          emprendimiento
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {resources.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Recursos Totales
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources
                .reduce((sum, r) => sum + r.downloads, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Descargas Totales
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(
                resources.reduce((sum, r) => sum + r.rating, 0) /
                resources.length
              ).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              Calificación Promedio
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(resources.map((r) => r.category)).size}
            </div>
            <div className="text-sm text-muted-foreground">Categorías</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar recursos por título, descripción o etiquetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "template"
                  ? "Plantillas"
                  : type === "guide"
                    ? "Guías"
                    : type === "video"
                      ? "Videos"
                      : type === "podcast"
                        ? "Podcasts"
                        : "Herramientas"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Más populares</SelectItem>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="rating">Mejor calificados</SelectItem>
            <SelectItem value="downloads">Más descargados</SelectItem>
            <SelectItem value="title">Alfabético</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {filteredResources.length} recursos encontrados
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getResourceIcon(resource.type)}
                  </div>
                  <Badge variant="outline">
                    {resource.type === "template"
                      ? "Plantilla"
                      : resource.type === "guide"
                        ? "Guía"
                        : resource.type === "video"
                          ? "Video"
                          : resource.type === "podcast"
                            ? "Podcast"
                            : "Herramienta"}
                  </Badge>
                </div>
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty === "beginner"
                    ? "Principiante"
                    : resource.difficulty === "intermediate"
                      ? "Intermedio"
                      : "Avanzado"}
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">
                {resource.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {resource.description}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{resource.category}</span>
                <span>{resource.estimatedTime}</span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{resource.rating}</span>
                  <span className="text-muted-foreground">
                    ({resource.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span>{resource.downloads.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <span>
                  {resource.format} • {resource.fileSize}
                </span>
                <span>{resource.createdAt.toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Vista Previa
                </Button>
                <Button size="sm" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No se encontraron recursos
          </h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar los filtros o términos de búsqueda
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
              setFilterCategory("all");
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
