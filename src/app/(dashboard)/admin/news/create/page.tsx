"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateNewsArticle } from "@/hooks/useNewsArticleApi";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  Upload,
  FileText,
  Globe,
  Users,
  Calendar,
  Tag,
} from "lucide-react";

interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  featured: boolean;
  imageUrl: string;
  videoUrl: string;
  tags: string[];
  targetAudience: string[];
  region: string;
  organizationId: string;
  organizationName: string;
  organizationType: "GOVERNMENT" | "NGO";
  organizationLogo: string;
  expiresAt: string;
}

export default function CreateNewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const createNewsMutation = useCreateNewsArticle();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    summary: "",
    content: "",
    category: "",
    status: "DRAFT",
    priority: "MEDIUM",
    featured: false,
    imageUrl: "",
    videoUrl: "",
    tags: [],
    targetAudience: ["YOUTH"],
    region: "",
    organizationId: "",
    organizationName: "",
    organizationType: "GOVERNMENT",
    organizationLogo: "",
    expiresAt: "",
  });

  // Set organization details from current user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        organizationId: user.id || "",
        organizationName: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Gobierno Municipal",
        organizationType: "GOVERNMENT" as const,
      }));
    }
  }, [user]);

  const handleInputChange = (
    field: keyof NewsFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: keyof NewsFormData,
    index: number,
    value: string
  ) => {
    const newArray = [...(formData[field] as string[])];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const addArrayItem = (field: keyof NewsFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeArrayItem = (field: keyof NewsFormData, index: number) => {
    const newArray = (formData[field] as string[]).filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTargetAudienceToggle = (audience: string) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter((a) => a !== audience)
        : [...prev.targetAudience, audience],
    }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      // Validate required fields
      if (!formData.title || !formData.summary || !formData.content || !formData.organizationName || !formData.organizationType) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos requeridos (título, resumen, contenido, nombre de organización y tipo de organización)",
          variant: "destructive",
        });
        return;
      }

      const newsData = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        organizationId: formData.organizationId,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        organizationLogo: formData.organizationLogo,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        priority: formData.priority,
        featured: formData.featured,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl,
        tags: formData.tags.filter(tag => tag.trim() !== ""),
        category: formData.category,
        targetAudience: formData.targetAudience,
        region: formData.region,
        expiresAt: formData.expiresAt,
        publishedAt: isDraft ? "" : new Date().toISOString(),
      };

      console.log("📰 Creating news with data:", newsData);

      await createNewsMutation.mutateAsync(newsData);

      toast({
        title: "Éxito",
        description: isDraft 
          ? "Noticia guardada como borrador" 
          : "Noticia creada y publicada exitosamente",
      });

      router.push("/admin/news");
    } catch (error) {
      console.error("❌ Error creating news:", error);
      toast({
        title: "Error",
        description: "Error al crear la noticia. Por favor intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "Política Pública": "Política Pública",
      "Educación": "Educación",
      "Empleo": "Empleo",
      "Emprendimiento": "Emprendimiento",
      "Tecnología": "Tecnología",
      "Salud": "Salud",
      "Medio Ambiente": "Medio Ambiente",
      "Cultura": "Cultura",
      "Deportes": "Deportes",
      "General": "General",
    };
    return labels[category] || category;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      "LOW": "Baja",
      "MEDIUM": "Media",
      "HIGH": "Alta",
      "URGENT": "Urgente",
    };
    return labels[priority] || priority;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "DRAFT": "Borrador",
      "PUBLISHED": "Publicada",
      "ARCHIVED": "Archivada",
    };
    return labels[status] || status;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Crear Nueva Noticia</h1>
            <p className="text-muted-foreground">
              Comparta información importante con la comunidad
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(true)}
            disabled={createNewsMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {createNewsMutation.isPending ? "Guardando..." : "Guardar Borrador"}
          </Button>
          <Button 
            onClick={() => handleSubmit(false)}
            disabled={createNewsMutation.isPending}
          >
            <Eye className="h-4 w-4 mr-2" />
            {createNewsMutation.isPending ? "Publicando..." : "Publicar Noticia"}
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información de la Noticia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Noticia *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: Gobierno Municipal Implementa Nueva Política de Empleo Juvenil"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Resumen *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Resumen breve de la noticia que aparecerá en las tarjetas"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.summary.length}/200 caracteres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Política Pública",
                        "Educación",
                        "Empleo",
                        "Emprendimiento",
                        "Tecnología",
                        "Salud",
                        "Medio Ambiente",
                        "Cultura",
                        "Deportes",
                        "General",
                      ].map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryLabel(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {getPriorityLabel(priority)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {["DRAFT", "PUBLISHED", "ARCHIVED"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Región</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Ej: Cochabamba, La Paz, Nacional"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos Multimedia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Imagen de Portada</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Arrastra una imagen aquí o{" "}
                    <span className="text-blue-600 cursor-pointer">
                      buscar archivo
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Recomendado: 1280x720px, JPG o PNG
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Video (Opcional)</Label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                  placeholder="URL del video (YouTube, Vimeo, etc.)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenido de la Noticia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Contenido Completo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Escriba el contenido completo de la noticia aquí..."
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar etiqueta"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      handleTagAdd(target.value);
                      target.value = "";
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement)
                      .previousElementSibling as HTMLInputElement;
                    handleTagAdd(input.value);
                    input.value = "";
                  }}
                >
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Noticia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Destacar Noticia
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Audiencia Objetivo</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "YOUTH", label: "Jóvenes" },
                    { value: "ADOLESCENTS", label: "Adolescentes" },
                    { value: "COMPANIES", label: "Empresas" },
                    { value: "ALL", label: "Todos" },
                  ].map((audience) => (
                    <div key={audience.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={audience.value}
                        checked={formData.targetAudience.includes(audience.value)}
                        onCheckedChange={() => handleTargetAudienceToggle(audience.value)}
                      />
                      <Label htmlFor={audience.value} className="text-sm">
                        {audience.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

                             <div className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="organizationName">Nombre de la Organización *</Label>
                   <Input
                     id="organizationName"
                     value={formData.organizationName}
                     onChange={(e) => handleInputChange("organizationName", e.target.value)}
                     placeholder="Ej: Gobierno Municipal de Cochabamba"
                   />
                 </div>

                 <div className="space-y-2">
                   <Label>Tipo de Organización *</Label>
                   <Select
                     value={formData.organizationType}
                     onValueChange={(value) => handleInputChange("organizationType", value)}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Seleccionar tipo" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="GOVERNMENT">Gobierno</SelectItem>
                       <SelectItem value="NGO">ONG</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="organizationLogo">Logo de la Organización</Label>
                   <Input
                     id="organizationLogo"
                     value={formData.organizationLogo}
                     onChange={(e) => handleInputChange("organizationLogo", e.target.value)}
                     placeholder="URL del logo de la organización"
                   />
                 </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Fecha de Expiración (Opcional)</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange("expiresAt", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Si se establece, la noticia se archivará automáticamente en esta fecha
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 