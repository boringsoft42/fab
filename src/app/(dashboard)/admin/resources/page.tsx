"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Upload,
  List,
  Settings,
  Search,
  Download,
  FileText,
  Video,
  Music,
  Image,
  File,
  Star,
  Building2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { ResourceUploadForm } from "@/components/resources/ResourceUploadForm";
import { ResourceManagementList } from "@/components/resources/ResourceManagementList";
import { ResourceSettings } from "@/components/resources/ResourceSettings";
import { ResourceService } from "@/services/resource.service";
import { Resource } from "@/types/api";
import { toast } from "sonner";

interface ResourceStats {
  total: number;
  byType: { [key: string]: number };
  byStatus: { [key: string]: number };
  totalDownloads: number;
  averageRating: number;
  featured: number;
  public: number;
  private: number;
  byMunicipality: { [key: string]: number };
}

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ResourceStats>({
    total: 0,
    byType: {},
    byStatus: {},
    totalDownloads: 0,
    averageRating: 0,
    featured: 0,
    public: 0,
    private: 0,
    byMunicipality: {},
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<string>("all");

  useEffect(() => {
    fetchResources();
    fetchStats();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await ResourceService.getAllResources();
      setResources(response.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Error al cargar los recursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats - in a real app, this would come from an API
      const mockStats: ResourceStats = {
        total: 156,
        byType: {
          DOCUMENT: 45,
          VIDEO: 32,
          AUDIO: 18,
          IMAGE: 28,
          TEXT: 33,
        },
        byStatus: {
          public: 142,
          private: 14,
        },
        totalDownloads: 2847,
        averageRating: 4.2,
        featured: 12,
        public: 142,
        private: 14,
        byMunicipality: {
          "La Paz": 23,
          Cochabamba: 18,
          "Santa Cruz": 31,
          Oruro: 12,
          Potosí: 8,
          Chuquisaca: 15,
          Tarija: 11,
          Beni: 9,
          Pando: 7,
        },
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType =
      selectedType === "all" || resource.type === selectedType;
    const matchesMunicipality =
      selectedMunicipality === "all" ||
      resource.authorId === selectedMunicipality; // Simplified filter

    return matchesSearch && matchesType && matchesMunicipality;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "DOCUMENT":
        return <FileText className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "AUDIO":
        return <Music className="h-4 w-4" />;
      case "IMAGE":
        return <Image className="h-4 w-4" />;
      case "TEXT":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "DOCUMENT":
        return "bg-blue-100 text-blue-800";
      case "VIDEO":
        return "bg-red-100 text-red-800";
      case "AUDIO":
        return "bg-purple-100 text-purple-800";
      case "IMAGE":
        return "bg-green-100 text-green-800";
      case "TEXT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Recursos
        </h1>
        <p className="text-gray-600">
          Administra todos los recursos educativos del sistema
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Subir Recurso
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Gestionar Recursos
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Recursos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  +12% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Descargas
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalDownloads.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8% desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Calificación Promedio
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Basado en {stats.total} recursos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recursos Destacados
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.featured}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.featured / stats.total) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(type)}
                        <span className="font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(count / stats.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos por Municipio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.byMunicipality)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([municipality, count]) => (
                      <div
                        key={municipality}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{municipality}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${(count / Math.max(...Object.values(stats.byMunicipality))) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredResources.slice(0, 5).map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resource.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Creado por {resource.author} •{" "}
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={resource.isPublic ? "default" : "secondary"}
                      >
                        {resource.isPublic ? "Público" : "Privado"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {resource.downloads} descargas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Subir Nuevo Recurso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceUploadForm
                onSuccess={() => {
                  setActiveTab("manage");
                  fetchResources();
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Buscar recursos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type-filter">Tipo</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="DOCUMENT">Documento</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                      <SelectItem value="IMAGE">Imagen</SelectItem>
                      <SelectItem value="TEXT">Texto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="municipality-filter">Municipio</Label>
                  <Select
                    value={selectedMunicipality}
                    onValueChange={setSelectedMunicipality}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los municipios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los municipios</SelectItem>
                      {Object.keys(stats.byMunicipality).map((municipality) => (
                        <SelectItem key={municipality} value={municipality}>
                          {municipality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedType("all");
                      setSelectedMunicipality("all");
                    }}
                    className="w-full"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Gestionar Recursos Existentes ({filteredResources.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceManagementList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
