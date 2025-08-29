"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Eye,
  Upload,
  FileText,
  Video,
  Music,
  Image,
  File,
  ExternalLink,
  Star,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { ResourceService } from "@/services/resource.service";
import { Resource } from "@/types/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

export default function MunicipalityResourcesPage() {
  const { user } = useCurrentUser();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "DOCUMENT" as "DOCUMENT" | "VIDEO" | "AUDIO" | "IMAGE" | "TEXT",
    category: "",
    format: "",
    author: "",
    externalUrl: "",
    publishedDate: "",
    tags: [] as string[],
    isPublic: true,
    isFeatured: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resource types and categories
  const resourceTypes = [
    { value: "DOCUMENT", label: "Documento" },
    { value: "VIDEO", label: "Video" },
    { value: "AUDIO", label: "Audio" },
    { value: "IMAGE", label: "Imagen" },
    { value: "TEXT", label: "Texto" },
  ];

  const categories = [
    { value: "PROGRAMMING", label: "Programación" },
    { value: "ENTREPRENEURSHIP", label: "Emprendimiento" },
    { value: "TECHNOLOGY", label: "Tecnología" },
    { value: "EDUCATION", label: "Educación" },
    { value: "BUSINESS", label: "Negocios" },
    { value: "MARKETING", label: "Marketing" },
    { value: "FINANCE", label: "Finanzas" },
    { value: "HEALTH", label: "Salud" },
    { value: "DESIGN", label: "Diseño" },
    { value: "LEADERSHIP", label: "Liderazgo" },
    { value: "PERSONAL_DEVELOPMENT", label: "Desarrollo Personal" },
    { value: "OTHER", label: "Otro" },
  ];

  const formats = [
    { value: "PDF", label: "PDF" },
    { value: "DOC", label: "Documento Word (.doc)" },
    { value: "DOCX", label: "Documento Word (.docx)" },
    { value: "XLS", label: "Excel (.xls)" },
    { value: "XLSX", label: "Excel (.xlsx)" },
    { value: "PPT", label: "PowerPoint (.ppt)" },
    { value: "PPTX", label: "PowerPoint (.pptx)" },
    { value: "MP4", label: "Video MP4" },
    { value: "WEBM", label: "Video WebM" },
    { value: "MP3", label: "Audio MP3" },
    { value: "WAV", label: "Audio WAV" },
    { value: "JPEG", label: "Imagen JPEG" },
    { value: "PNG", label: "Imagen PNG" },
    { value: "TXT", label: "Archivo de Texto" },
    { value: "CSV", label: "CSV" },
  ];

  // Fetch resources
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const municipalityId = user?.municipality?.id;
      console.log("🔍 Fetching resources for municipalityId:", municipalityId);
      console.log("🔍 User object:", user);

      const response = await ResourceService.getAllResources({
        municipalityId: municipalityId,
      });
      console.log("📦 Resources response:", response);
      // La respuesta viene directamente como array, no como {data: [...]}
      setResources(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Error al cargar los recursos");
    } finally {
      setLoading(false);
    }
  };

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    // Temporalmente simplificar el filtro para debug
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.tags &&
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesType =
      selectedType === "all" || resource.type === selectedType;
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  console.log("🔍 Resources state:", resources);
  console.log("🔍 Filtered resources:", filteredResources);
  console.log("🔍 Search query:", searchQuery);
  console.log("🔍 Selected type:", selectedType);
  console.log("🔍 Selected category:", selectedCategory);

  // Form handlers
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const extension = file.name.split(".").pop()?.toUpperCase();
      if (extension) {
        handleChange("format", extension);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "DOCUMENT",
      category: "",
      format: "",
      author: "",
      externalUrl: "",
      publishedDate: "",
      tags: [],
      isPublic: true,
      isFeatured: false,
    });
    setSelectedFile(null);
    setNewTag("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        toast.error("El título es requerido");
        return;
      }

      if (!formData.description.trim()) {
        toast.error("La descripción es requerida");
        return;
      }

      if (!formData.type) {
        toast.error("El tipo de recurso es requerido");
        return;
      }

      if (!formData.category) {
        toast.error("La categoría es requerida");
        return;
      }

      if (!formData.format) {
        toast.error("El formato es requerido");
        return;
      }

      if (!formData.author.trim()) {
        toast.error("El autor es requerido");
        return;
      }

      let result;

      if (selectedFile) {
        // Upload with file
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("format", formData.format);
        formDataToSend.append("author", formData.author);

        if (formData.externalUrl) {
          formDataToSend.append("externalUrl", formData.externalUrl);
        }

        if (formData.publishedDate) {
          formDataToSend.append("publishedDate", formData.publishedDate);
        }

        if (formData.tags.length > 0) {
          formDataToSend.append("tags", formData.tags.join(","));
        }

        formDataToSend.append("file", selectedFile);
        result = await ResourceService.uploadResource(formDataToSend);
      } else {
        // Create without file
        const resourceData = {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          category: formData.category,
          format: formData.format,
          author: formData.author,
          externalUrl: formData.externalUrl || undefined,
          publishedDate: formData.publishedDate || undefined,
          tags: formData.tags,
          isPublic: formData.isPublic,
        };

        result = await ResourceService.createResource(resourceData);
      }

      toast.success("Recurso creado exitosamente");
      setShowCreateDialog(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al crear el recurso"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este recurso?")) {
      return;
    }

    try {
      await ResourceService.deleteResource(resourceId);
      toast.success("Recurso eliminado exitosamente");
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Error al eliminar el recurso");
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recursos Municipales
            </h1>
            <p className="text-gray-600">
              Gestiona los recursos educativos de tu municipio
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear Recurso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Recurso</DialogTitle>
                <DialogDescription>
                  Completa la información del recurso que deseas compartir
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Título del recurso"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo de Recurso *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe el contenido y propósito del recurso"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format">Formato *</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => handleChange("format", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar formato" />
                      </SelectTrigger>
                      <SelectContent>
                        {formats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Autor *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleChange("author", e.target.value)}
                      placeholder="Nombre del autor"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="publishedDate">Fecha de Publicación</Label>
                    <Input
                      id="publishedDate"
                      type="datetime-local"
                      value={formData.publishedDate}
                      onChange={(e) =>
                        handleChange("publishedDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="externalUrl">URL Externa (Opcional)</Label>
                  <Input
                    id="externalUrl"
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) =>
                      handleChange("externalUrl", e.target.value)
                    }
                    placeholder="https://ejemplo.com/recurso"
                  />
                </div>

                <div>
                  <Label htmlFor="file">Subir Archivo</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="file"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("file")?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile
                          ? "Cambiar archivo"
                          : "Seleccionar archivo"}
                      </Button>
                    </div>
                    {selectedFile && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <File className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {selectedFile.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Etiquetas</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Nueva etiqueta"
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Agregar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      handleChange("isPublic", checked)
                    }
                  />
                  <Label htmlFor="isPublic">Recurso público</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      handleChange("isFeatured", checked)
                    }
                  />
                  <Label htmlFor="isFeatured">Recurso destacado</Label>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creando..." : "Crear Recurso"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
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
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category-filter">Categoría</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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
                  setSelectedCategory("all");
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos ({filteredResources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando recursos...</p>
            </div>
          ) : (() => {
              console.log(
                "🔍 Render condition - loading:",
                loading,
                "filteredResources.length:",
                filteredResources.length
              );
              return filteredResources.length === 0;
            })() ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay recursos
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ||
                selectedType !== "all" ||
                selectedCategory !== "all"
                  ? "No se encontraron recursos con los filtros aplicados"
                  : "Aún no has creado ningún recurso"}
              </p>
              {!searchQuery &&
                selectedType === "all" &&
                selectedCategory === "all" && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Recurso
                  </Button>
                )}
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(resource.type)}
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {resource.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {resource.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{resource.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{resource.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4 text-gray-400" />
                        <span>{resource.downloads}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={resource.isPublic ? "default" : "secondary"}
                      >
                        {resource.isPublic ? "Público" : "Privado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(resource.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
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
    </div>
  );
}
