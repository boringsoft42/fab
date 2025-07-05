"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseCategory, CourseLevel } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  VideoIcon,
  FileText,
  HelpCircle,
  BookOpen,
  Award,
  Users,
  Target,
} from "lucide-react";

interface CourseFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: CourseCategory | "";
  level: CourseLevel | "";
  duration: number;
  price: number;
  isMandatory: boolean;
  isActive: boolean;
  certification: boolean;
  objectives: string[];
  prerequisites: string[];
  includedMaterials: string[];
  tags: string[];
  thumbnail: string;
  videoPreview: string;
  instructor: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
  };
}

export default function CreateCoursePage() {
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "",
    duration: 0,
    price: 0,
    isMandatory: false,
    isActive: false,
    certification: true,
    objectives: [""],
    prerequisites: [""],
    includedMaterials: [""],
    tags: [],
    thumbnail: "",
    videoPreview: "",
    instructor: {
      name: "",
      title: "",
      bio: "",
      avatar: "",
    },
  });

  const handleInputChange = (
    field: keyof CourseFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title
    if (field === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }
  };

  const handleInstructorChange = (
    field: keyof CourseFormData["instructor"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (
    field: keyof CourseFormData,
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

  const addArrayItem = (field: keyof CourseFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeArrayItem = (field: keyof CourseFormData, index: number) => {
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

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      const courseData = {
        ...formData,
        isActive: isDraft ? false : formData.isActive,
        publishedAt: isDraft ? null : new Date(),
      };

      console.log("Saving course:", courseData);

      // Here you would make an API call to save the course
      // await fetch('/api/admin/courses', { method: 'POST', body: JSON.stringify(courseData) });

      router.push("/admin/courses");
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const getCategoryLabel = (category: CourseCategory) => {
    const labels = {
      [CourseCategory.SOFT_SKILLS]: "Habilidades Blandas",
      [CourseCategory.BASIC_COMPETENCIES]: "Competencias Básicas",
      [CourseCategory.JOB_PLACEMENT]: "Inserción Laboral",
      [CourseCategory.ENTREPRENEURSHIP]: "Emprendimiento",
      [CourseCategory.TECHNICAL_SKILLS]: "Habilidades Técnicas",
      [CourseCategory.DIGITAL_LITERACY]: "Alfabetización Digital",
      [CourseCategory.COMMUNICATION]: "Comunicación",
      [CourseCategory.LEADERSHIP]: "Liderazgo",
    };
    return labels[category] || category;
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
            <h1 className="text-2xl font-bold">Crear Nuevo Curso</h1>
            <p className="text-muted-foreground">
              Configure el contenido educativo para sus estudiantes
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Borrador
          </Button>
          <Button onClick={() => handleSubmit(false)}>
            <Eye className="h-4 w-4 mr-2" />
            Publicar Curso
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Información del Curso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;title&rdquo;>Título del Curso *</Label>
                  <Input
                    id=&ldquo;title&rdquo;
                    value={formData.title}
                    onChange={(e) => handleInputChange(&ldquo;title&rdquo;, e.target.value)}
                    placeholder=&ldquo;Ej: Habilidades Laborales Básicas&rdquo;
                  />
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;slug&rdquo;>URL del Curso</Label>
                  <Input
                    id=&ldquo;slug&rdquo;
                    value={formData.slug}
                    onChange={(e) => handleInputChange(&ldquo;slug&rdquo;, e.target.value)}
                    placeholder=&ldquo;habilidades-laborales-basicas&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;shortDescription&rdquo;>Descripción Corta *</Label>
                <Input
                  id=&ldquo;shortDescription&rdquo;
                  value={formData.shortDescription}
                  onChange={(e) =>
                    handleInputChange(&ldquo;shortDescription&rdquo;, e.target.value)
                  }
                  placeholder=&ldquo;Descripción que aparece en las tarjetas del curso&rdquo;
                  maxLength={120}
                />
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                  {formData.shortDescription.length}/120 caracteres
                </p>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;description&rdquo;>Descripción Completa *</Label>
                <Textarea
                  id=&ldquo;description&rdquo;
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange(&ldquo;description&rdquo;, e.target.value)
                  }
                  placeholder=&ldquo;Descripción detallada del curso, objetivos, metodología...&rdquo;
                  rows={4}
                />
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange(&ldquo;category&rdquo;, value as CourseCategory)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar categoría&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CourseCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryLabel(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Nivel *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) =>
                      handleInputChange(&ldquo;level&rdquo;, value as CourseLevel)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Nivel del curso&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseLevel.BEGINNER}>
                        Principiante
                      </SelectItem>
                      <SelectItem value={CourseLevel.INTERMEDIATE}>
                        Intermedio
                      </SelectItem>
                      <SelectItem value={CourseLevel.ADVANCED}>
                        Avanzado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;duration&rdquo;>Duración (horas) *</Label>
                  <Input
                    id=&ldquo;duration&rdquo;
                    type=&ldquo;number&rdquo;
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange(
                        &ldquo;duration&rdquo;,
                        parseInt(e.target.value) || 0
                      )
                    }
                    min=&ldquo;1&rdquo;
                    max=&ldquo;100&rdquo;
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recursos Multimedia</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Imagen de Portada</Label>
                <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-6 text-center&rdquo;>
                  <Upload className=&ldquo;h-8 w-8 mx-auto text-gray-400 mb-2&rdquo; />
                  <p className=&ldquo;text-sm text-gray-600&rdquo;>
                    Arrastra una imagen aquí o{&ldquo; &rdquo;}
                    <span className=&ldquo;text-blue-600 cursor-pointer&rdquo;>
                      buscar archivo
                    </span>
                  </p>
                  <p className=&ldquo;text-xs text-gray-500&rdquo;>
                    Recomendado: 1280x720px, JPG o PNG
                  </p>
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Video de Presentación (Opcional)</Label>
                <Input
                  value={formData.videoPreview}
                  onChange={(e) =>
                    handleInputChange(&ldquo;videoPreview&rdquo;, e.target.value)
                  }
                  placeholder=&ldquo;URL del video de presentación&rdquo;
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value=&ldquo;content&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Target className=&ldquo;h-5 w-5&rdquo; />
                Objetivos de Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              {formData.objectives.map((objective, index) => (
                <div key={index} className=&ldquo;flex gap-2&rdquo;>
                  <Input
                    value={objective}
                    onChange={(e) =>
                      handleArrayChange(&ldquo;objectives&rdquo;, index, e.target.value)
                    }
                    placeholder={`Objetivo ${index + 1}`}
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      variant=&ldquo;outline&rdquo;
                      size=&ldquo;icon&rdquo;
                      onClick={() => removeArrayItem(&ldquo;objectives&rdquo;, index)}
                    >
                      <X className=&ldquo;h-4 w-4&rdquo; />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant=&ldquo;outline&rdquo;
                onClick={() => addArrayItem(&ldquo;objectives&rdquo;)}
                className=&ldquo;w-full&rdquo;
              >
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Agregar Objetivo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerrequisitos</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className=&ldquo;flex gap-2&rdquo;>
                  <Input
                    value={prerequisite}
                    onChange={(e) =>
                      handleArrayChange(&ldquo;prerequisites&rdquo;, index, e.target.value)
                    }
                    placeholder={`Prerrequisito ${index + 1}`}
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      variant=&ldquo;outline&rdquo;
                      size=&ldquo;icon&rdquo;
                      onClick={() => removeArrayItem(&ldquo;prerequisites&rdquo;, index)}
                    >
                      <X className=&ldquo;h-4 w-4&rdquo; />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant=&ldquo;outline&rdquo;
                onClick={() => addArrayItem(&ldquo;prerequisites&rdquo;)}
                className=&ldquo;w-full&rdquo;
              >
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Agregar Prerrequisito
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Materiales Incluidos</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              {formData.includedMaterials.map((material, index) => (
                <div key={index} className=&ldquo;flex gap-2&rdquo;>
                  <Input
                    value={material}
                    onChange={(e) =>
                      handleArrayChange(
                        &ldquo;includedMaterials&rdquo;,
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Material ${index + 1}`}
                  />
                  {formData.includedMaterials.length > 1 && (
                    <Button
                      variant=&ldquo;outline&rdquo;
                      size=&ldquo;icon&rdquo;
                      onClick={() =>
                        removeArrayItem(&ldquo;includedMaterials&rdquo;, index)
                      }
                    >
                      <X className=&ldquo;h-4 w-4&rdquo; />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant=&ldquo;outline&rdquo;
                onClick={() => addArrayItem(&ldquo;includedMaterials&rdquo;)}
                className=&ldquo;w-full&rdquo;
              >
                <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Agregar Material
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant=&ldquo;secondary&rdquo;
                    className=&ldquo;flex items-center gap-1&rdquo;
                  >
                    {tag}
                    <X
                      className=&ldquo;h-3 w-3 cursor-pointer&rdquo;
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className=&ldquo;flex gap-2&rdquo;>
                <Input
                  placeholder=&ldquo;Agregar etiqueta&rdquo;
                  onKeyPress={(e) => {
                    if (e.key === &ldquo;Enter&rdquo;) {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      handleTagAdd(target.value);
                      target.value = &ldquo;&rdquo;;
                    }
                  }}
                />
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={(e) => {
                    const input = (e.target as HTMLElement)
                      .previousElementSibling as HTMLInputElement;
                    handleTagAdd(input.value);
                    input.value = &ldquo;&rdquo;;
                  }}
                >
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructor Tab */}
        <TabsContent value=&ldquo;instructor&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Users className=&ldquo;h-5 w-5&rdquo; />
                Información del Instructor
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;instructorName&rdquo;>
                    Nombre del Instructor *
                  </Label>
                  <Input
                    id=&ldquo;instructorName&rdquo;
                    value={formData.instructor.name}
                    onChange={(e) =>
                      handleInstructorChange(&ldquo;name&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;Nombre completo&rdquo;
                  />
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;instructorTitle&rdquo;>Título Profesional *</Label>
                  <Input
                    id=&ldquo;instructorTitle&rdquo;
                    value={formData.instructor.title}
                    onChange={(e) =>
                      handleInstructorChange(&ldquo;title&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;Ej: Especialista en Desarrollo Profesional&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;instructorBio&rdquo;>Biografía del Instructor</Label>
                <Textarea
                  id=&ldquo;instructorBio&rdquo;
                  value={formData.instructor.bio}
                  onChange={(e) =>
                    handleInstructorChange(&ldquo;bio&rdquo;, e.target.value)
                  }
                  placeholder=&ldquo;Experiencia, credenciales, especialidades...&rdquo;
                  rows={3}
                />
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Foto del Instructor</Label>
                <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-6 text-center&rdquo;>
                  <Upload className=&ldquo;h-8 w-8 mx-auto text-gray-400 mb-2&rdquo; />
                  <p className=&ldquo;text-sm text-gray-600&rdquo;>
                    Subir foto del instructor
                  </p>
                  <p className=&ldquo;text-xs text-gray-500&rdquo;>
                    Recomendado: 400x400px, formato cuadrado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value=&ldquo;settings&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Curso</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;isMandatory&rdquo;
                    checked={formData.isMandatory}
                    onCheckedChange={(checked) =>
                      handleInputChange(&ldquo;isMandatory&rdquo;, checked)
                    }
                  />
                  <Label htmlFor=&ldquo;isMandatory&rdquo; className=&ldquo;text-sm font-medium&rdquo;>
                    Curso Obligatorio
                  </Label>
                  <HelpCircle className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                </div>

                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;certification&rdquo;
                    checked={formData.certification}
                    onCheckedChange={(checked) =>
                      handleInputChange(&ldquo;certification&rdquo;, checked)
                    }
                  />

                  <Label
                    htmlFor=&ldquo;certification&rdquo;
                    className=&ldquo;text-sm font-medium&rdquo;
                  >
                    Incluir Certificado de Finalización
                  </Label>
                  {formData.certification && (
                    <Button
                      variant=&ldquo;outline&rdquo;
                      className=&ldquo;mt-2&rdquo;
                      onClick={() => setCertificateDialogOpen(true)}
                    >
                      Subir Certificado Personalizado
                    </Button>
                  )}

                  <Award className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                </div>

                <div className=&ldquo;flex items-center space-x-2&rdquo;>
                  <Checkbox
                    id=&ldquo;isActive&rdquo;
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange(&ldquo;isActive&rdquo;, checked)
                    }
                  />
                  <Label htmlFor=&ldquo;isActive&rdquo; className=&ldquo;text-sm font-medium&rdquo;>
                    Publicar Inmediatamente
                  </Label>
                </div>
              </div>

              <Separator />

              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label htmlFor=&ldquo;price&rdquo;>Precio (BOB)</Label>
                  <Input
                    id=&ldquo;price&rdquo;
                    type=&ldquo;number&rdquo;
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        &ldquo;price&rdquo;,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min=&ldquo;0&rdquo;
                    step=&ldquo;0.01&rdquo;
                  />
                  <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                    Establecer en 0 para curso gratuito
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4 text-sm&rdquo;>
                <div className=&ldquo;flex items-start gap-3 p-3 bg-blue-50 rounded-lg&rdquo;>
                  <VideoIcon className=&ldquo;h-5 w-5 text-blue-600 mt-0.5&rdquo; />
                  <div>
                    <p className=&ldquo;font-medium text-blue-900&rdquo;>
                      Después de crear el curso
                    </p>
                    <p className=&ldquo;text-blue-700&rdquo;>
                      Podrás agregar módulos, lecciones, videos y exámenes desde
                      el panel de gestión del curso.
                    </p>
                  </div>
                </div>

                <div className=&ldquo;flex items-start gap-3 p-3 bg-green-50 rounded-lg&rdquo;>
                  <FileText className=&ldquo;h-5 w-5 text-green-600 mt-0.5&rdquo; />
                  <div>
                    <p className=&ldquo;font-medium text-green-900&rdquo;>
                      Contenido del curso
                    </p>
                    <p className=&ldquo;text-green-700&rdquo;>
                      Estructura tu curso en módulos y lecciones. Cada lección
                      puede ser un video, material de lectura o examen.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog
        open={certificateDialogOpen}
        onOpenChange={setCertificateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Certificado Personalizado</DialogTitle>
          </DialogHeader>

          <div className=&ldquo;space-y-4&rdquo;>
            <Input
              type=&ldquo;file&rdquo;
              accept=&ldquo;.pdf&rdquo;
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCertificateFile(file);
                }
              }}
            />

            {certificateFile && (
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Archivo seleccionado: {certificateFile.name}
              </p>
            )}

            <div className=&ldquo;flex justify-end gap-2&rdquo;>
              <Button
                variant=&ldquo;outline&rdquo;
                onClick={() => setCertificateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                disabled={!certificateFile}
                onClick={() => {
                  console.log(&ldquo;Subiendo certificado:&rdquo;, certificateFile);
                  // Aquí podrías hacer tu fetch a una API
                  setCertificateDialogOpen(false);
                }}
              >
                Subir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
