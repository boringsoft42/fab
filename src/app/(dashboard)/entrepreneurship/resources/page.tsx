&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;

interface Resource {
  id: string;
  title: string;
  description: string;
  type: &ldquo;template&rdquo; | &ldquo;guide&rdquo; | &ldquo;video&rdquo; | &ldquo;podcast&rdquo; | &ldquo;tool&rdquo;;
  category: string;
  downloads: number;
  rating: number;
  reviewCount: number;
  fileSize: string;
  format: string;
  createdAt: Date;
  difficulty: &ldquo;beginner&rdquo; | &ldquo;intermediate&rdquo; | &ldquo;advanced&rdquo;;
  estimatedTime: string;
  tags: string[];
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [filterType, setFilterType] = useState(&ldquo;all&rdquo;);
  const [filterCategory, setFilterCategory] = useState(&ldquo;all&rdquo;);
  const [sortBy, setSortBy] = useState(&ldquo;popular&rdquo;);

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
          id: &ldquo;resource-1&rdquo;,
          title: &ldquo;Plantilla de Plan de Negocios 2024&rdquo;,
          description:
            &ldquo;Plantilla completa en Word con todas las secciones necesarias para crear un plan de negocios profesional. Incluye ejemplos y guías paso a paso.&rdquo;,
          type: &ldquo;template&rdquo;,
          category: &ldquo;Planificación&rdquo;,
          downloads: 2847,
          rating: 4.8,
          reviewCount: 156,
          fileSize: &ldquo;2.5 MB&rdquo;,
          format: &ldquo;DOCX&rdquo;,
          createdAt: new Date(&ldquo;2024-01-15&rdquo;),
          difficulty: &ldquo;beginner&rdquo;,
          estimatedTime: &ldquo;30 minutos&rdquo;,
          tags: [&ldquo;Plan de Negocios&rdquo;, &ldquo;Startups&rdquo;, &ldquo;Plantilla&rdquo;, &ldquo;Fundamentos&rdquo;],
        },
        {
          id: &ldquo;resource-2&rdquo;,
          title: &ldquo;Guía de Validación de Mercado&rdquo;,
          description:
            &ldquo;Metodología completa para validar tu idea de negocio antes de invertir tiempo y dinero. Incluye herramientas prácticas y casos de estudio bolivianos.&rdquo;,
          type: &ldquo;guide&rdquo;,
          category: &ldquo;Validación&rdquo;,
          downloads: 1923,
          rating: 4.6,
          reviewCount: 98,
          fileSize: &ldquo;5.1 MB&rdquo;,
          format: &ldquo;PDF&rdquo;,
          createdAt: new Date(&ldquo;2024-01-20&rdquo;),
          difficulty: &ldquo;intermediate&rdquo;,
          estimatedTime: &ldquo;45 minutos&rdquo;,
          tags: [
            &ldquo;Validación&rdquo;,
            &ldquo;Investigación de Mercado&rdquo;,
            &ldquo;MVP&rdquo;,
            &ldquo;Metodología&rdquo;,
          ],
        },
        {
          id: &ldquo;resource-3&rdquo;,
          title: &ldquo;Finanzas para Emprendedores&rdquo;,
          description:
            &ldquo;Video curso completo sobre gestión financiera básica para startups. Aprende a manejar flujo de caja, proyecciones y métricas financieras clave.&rdquo;,
          type: &ldquo;video&rdquo;,
          category: &ldquo;Finanzas&rdquo;,
          downloads: 3456,
          rating: 4.9,
          reviewCount: 234,
          fileSize: &ldquo;850 MB&rdquo;,
          format: &ldquo;MP4&rdquo;,
          createdAt: new Date(&ldquo;2024-01-10&rdquo;),
          difficulty: &ldquo;intermediate&rdquo;,
          estimatedTime: &ldquo;2 horas&rdquo;,
          tags: [&ldquo;Finanzas&rdquo;, &ldquo;Flujo de Caja&rdquo;, &ldquo;Métricas&rdquo;, &ldquo;Contabilidad&rdquo;],
        },
        {
          id: &ldquo;resource-4&rdquo;,
          title: &ldquo;Calculadora de Proyecciones Financieras&rdquo;,
          description:
            &ldquo;Herramienta Excel interactiva para calcular proyecciones financieras automáticamente. Incluye gráficos dinámicos y análisis de sensibilidad.&rdquo;,
          type: &ldquo;tool&rdquo;,
          category: &ldquo;Finanzas&rdquo;,
          downloads: 1567,
          rating: 4.7,
          reviewCount: 89,
          fileSize: &ldquo;1.2 MB&rdquo;,
          format: &ldquo;XLSX&rdquo;,
          createdAt: new Date(&ldquo;2024-02-01&rdquo;),
          difficulty: &ldquo;advanced&rdquo;,
          estimatedTime: &ldquo;15 minutos&rdquo;,
          tags: [&ldquo;Excel&rdquo;, &ldquo;Proyecciones&rdquo;, &ldquo;Automatización&rdquo;, &ldquo;Análisis&rdquo;],
        },
        {
          id: &ldquo;resource-5&rdquo;,
          title: &ldquo;Podcast: Emprendedores Bolivianos Exitosos&rdquo;,
          description:
            &ldquo;Serie de entrevistas inspiradoras con emprendedores bolivianos que han escalado sus negocios. Aprende de sus experiencias y estrategias.&rdquo;,
          type: &ldquo;podcast&rdquo;,
          category: &ldquo;Inspiración&rdquo;,
          downloads: 892,
          rating: 4.5,
          reviewCount: 67,
          fileSize: &ldquo;45 MB&rdquo;,
          format: &ldquo;MP3&rdquo;,
          createdAt: new Date(&ldquo;2024-02-05&rdquo;),
          difficulty: &ldquo;beginner&rdquo;,
          estimatedTime: &ldquo;30 minutos&rdquo;,
          tags: [
            &ldquo;Historias de Éxito&rdquo;,
            &ldquo;Inspiración&rdquo;,
            &ldquo;Casos Bolivianos&rdquo;,
            &ldquo;Mentalidad&rdquo;,
          ],
        },
        {
          id: &ldquo;resource-6&rdquo;,
          title: &ldquo;Cómo Presentar tu Startup a Inversionistas&rdquo;,
          description:
            &ldquo;Masterclass completa sobre cómo crear y presentar un pitch deck efectivo. Incluye plantillas y ejemplos de presentaciones exitosas.&rdquo;,
          type: &ldquo;video&rdquo;,
          category: &ldquo;Fundraising&rdquo;,
          downloads: 2156,
          rating: 4.8,
          reviewCount: 145,
          fileSize: &ldquo;1.2 GB&rdquo;,
          format: &ldquo;MP4&rdquo;,
          createdAt: new Date(&ldquo;2024-01-25&rdquo;),
          difficulty: &ldquo;advanced&rdquo;,
          estimatedTime: &ldquo;1.5 horas&rdquo;,
          tags: [&ldquo;Pitch Deck&rdquo;, &ldquo;Inversión&rdquo;, &ldquo;Presentación&rdquo;, &ldquo;Fundraising&rdquo;],
        },
      ];

      setResources(mockResources);
    } catch (error) {
      console.error(&ldquo;Error fetching resources:&rdquo;, error);
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
    if (filterType !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((resource) => resource.type === filterType);
    }

    // Category filter
    if (filterCategory !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (resource) => resource.category === filterCategory
      );
    }

    // Sort
    switch (sortBy) {
      case &ldquo;newest&rdquo;:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case &ldquo;rating&rdquo;:
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case &ldquo;downloads&rdquo;:
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case &ldquo;title&rdquo;:
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // popular
        filtered.sort((a, b) => b.downloads - a.downloads);
    }

    setFilteredResources(filtered);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case &ldquo;template&rdquo;:
        return <FileText className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;guide&rdquo;:
        return <BookOpen className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;video&rdquo;:
        return <Play className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;podcast&rdquo;:
        return <Headphones className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;tool&rdquo;:
        return <Calculator className=&ldquo;h-5 w-5&rdquo; />;
      default:
        return <FileText className=&ldquo;h-5 w-5&rdquo; />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case &ldquo;beginner&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;intermediate&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      case &ldquo;advanced&rdquo;:
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
    &ldquo;Fundraising&rdquo;,
    &ldquo;Legal&rdquo;,
    &ldquo;Inspiración&rdquo;,
  ];
  const types = [&ldquo;template&rdquo;, &ldquo;guide&rdquo;, &ldquo;video&rdquo;, &ldquo;podcast&rdquo;, &ldquo;tool&rdquo;];

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-32 bg-gray-200 rounded-lg&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
            {[...Array(6)].map((_, i) => (
              <div key={i} className=&ldquo;h-64 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Centro de Recursos</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Accede a plantillas, guías, videos y herramientas para hacer crecer tu
          emprendimiento
        </p>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4 mb-8&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>
              {resources.length}
            </div>
            <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
              Recursos Totales
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>
              {resources
                .reduce((sum, r) => sum + r.downloads, 0)
                .toLocaleString()}
            </div>
            <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
              Descargas Totales
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-purple-600&rdquo;>
              {(
                resources.reduce((sum, r) => sum + r.rating, 0) /
                resources.length
              ).toFixed(1)}
            </div>
            <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
              Calificación Promedio
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className=&ldquo;p-4 text-center&rdquo;>
            <div className=&ldquo;text-2xl font-bold text-orange-600&rdquo;>
              {new Set(resources.map((r) => r.category)).size}
            </div>
            <div className=&ldquo;text-sm text-muted-foreground&rdquo;>Categorías</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className=&ldquo;flex flex-col md:flex-row gap-4 mb-6&rdquo;>
        <div className=&ldquo;relative flex-1&rdquo;>
          <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground&rdquo; />
          <Input
            placeholder=&ldquo;Buscar recursos por título, descripción o etiquetas...&rdquo;
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=&ldquo;pl-10&rdquo;
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className=&ldquo;w-40&rdquo;>
            <SelectValue placeholder=&ldquo;Tipo&rdquo; />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=&ldquo;all&rdquo;>Todos los tipos</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type === &ldquo;template&rdquo;
                  ? &ldquo;Plantillas&rdquo;
                  : type === &ldquo;guide&rdquo;
                    ? &ldquo;Guías&rdquo;
                    : type === &ldquo;video&rdquo;
                      ? &ldquo;Videos&rdquo;
                      : type === &ldquo;podcast&rdquo;
                        ? &ldquo;Podcasts&rdquo;
                        : &ldquo;Herramientas&rdquo;}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className=&ldquo;w-48&rdquo;>
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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className=&ldquo;w-40&rdquo;>
            <SelectValue placeholder=&ldquo;Ordenar por&rdquo; />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=&ldquo;popular&rdquo;>Más populares</SelectItem>
            <SelectItem value=&ldquo;newest&rdquo;>Más recientes</SelectItem>
            <SelectItem value=&ldquo;rating&rdquo;>Mejor calificados</SelectItem>
            <SelectItem value=&ldquo;downloads&rdquo;>Más descargados</SelectItem>
            <SelectItem value=&ldquo;title&rdquo;>Alfabético</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className=&ldquo;mb-6&rdquo;>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          {filteredResources.length} recursos encontrados
        </p>
      </div>

      {/* Resources Grid */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className=&ldquo;overflow-hidden hover:shadow-lg transition-shadow&rdquo;
          >
            <CardHeader className=&ldquo;pb-3&rdquo;>
              <div className=&ldquo;flex items-center justify-between mb-2&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <div className=&ldquo;p-2 bg-blue-100 rounded-lg&rdquo;>
                    {getResourceIcon(resource.type)}
                  </div>
                  <Badge variant=&ldquo;outline&rdquo;>
                    {resource.type === &ldquo;template&rdquo;
                      ? &ldquo;Plantilla&rdquo;
                      : resource.type === &ldquo;guide&rdquo;
                        ? &ldquo;Guía&rdquo;
                        : resource.type === &ldquo;video&rdquo;
                          ? &ldquo;Video&rdquo;
                          : resource.type === &ldquo;podcast&rdquo;
                            ? &ldquo;Podcast&rdquo;
                            : &ldquo;Herramienta&rdquo;}
                  </Badge>
                </div>
                <Badge className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty === &ldquo;beginner&rdquo;
                    ? &ldquo;Principiante&rdquo;
                    : resource.difficulty === &ldquo;intermediate&rdquo;
                      ? &ldquo;Intermedio&rdquo;
                      : &ldquo;Avanzado&rdquo;}
                </Badge>
              </div>
              <CardTitle className=&ldquo;text-lg line-clamp-2&rdquo;>
                {resource.title}
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <p className=&ldquo;text-sm text-muted-foreground line-clamp-3&rdquo;>
                {resource.description}
              </p>

              <div className=&ldquo;flex items-center justify-between text-sm text-muted-foreground&rdquo;>
                <span>{resource.category}</span>
                <span>{resource.estimatedTime}</span>
              </div>

              <div className=&ldquo;flex items-center gap-4 text-sm&rdquo;>
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <Star className=&ldquo;h-4 w-4 fill-yellow-400 text-yellow-400&rdquo; />
                  <span>{resource.rating}</span>
                  <span className=&ldquo;text-muted-foreground&rdquo;>
                    ({resource.reviewCount})
                  </span>
                </div>
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <Download className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                  <span>{resource.downloads.toLocaleString()}</span>
                </div>
              </div>

              <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                {resource.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className=&ldquo;flex items-center justify-between text-xs text-muted-foreground border-t pt-3&rdquo;>
                <span>
                  {resource.format} • {resource.fileSize}
                </span>
                <span>{resource.createdAt.toLocaleDateString()}</span>
              </div>

              <div className=&ldquo;flex gap-2&rdquo;>
                <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; className=&ldquo;flex-1&rdquo;>
                  <Eye className=&ldquo;h-3 w-3 mr-1&rdquo; />
                  Vista Previa
                </Button>
                <Button size=&ldquo;sm&rdquo; className=&ldquo;flex-1&rdquo;>
                  <Download className=&ldquo;h-3 w-3 mr-1&rdquo; />
                  Descargar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className=&ldquo;text-center py-12&rdquo;>
          <div className=&ldquo;w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center&rdquo;>
            <Search className=&ldquo;h-8 w-8 text-gray-400&rdquo; />
          </div>
          <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
            No se encontraron recursos
          </h3>
          <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
            Intenta ajustar los filtros o términos de búsqueda
          </p>
          <Button
            variant=&ldquo;outline&rdquo;
            onClick={() => {
              setSearchQuery(&ldquo;&rdquo;);
              setFilterType(&ldquo;all&rdquo;);
              setFilterCategory(&ldquo;all&rdquo;);
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
