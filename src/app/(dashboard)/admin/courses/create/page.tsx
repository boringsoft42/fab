"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseCategory, CourseLevel } from "@/types/courses";
import { useCreateCourse } from "@/hooks/useCourseApi";
import { useToast } from "@/hooks/use-toast";
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
  category: CourseCategory | "" | undefined;
  level: CourseLevel | "" | undefined;
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
  const router = useRouter();
  const { toast } = useToast();
  const createCourseMutation = useCreateCourse();
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
    if (field === "title" && typeof value === "string") {
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
      console.log("📚 CreateCoursePage - handleSubmit called with isDraft:", isDraft);
      console.log("📚 CreateCoursePage - formData:", formData);
      
      // Validate required fields
      if (!formData.title || !formData.category || !formData.level) {
        console.log("❌ CreateCoursePage - Validation failed");
        toast({
          title: "Error",
          description: "Por favor complete todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      // Destructure formData to exclude instructor object
      const { instructor, ...courseDataWithoutInstructor } = formData;
      
      const courseData = {
        ...courseDataWithoutInstructor,
        isActive: isDraft ? false : formData.isActive,
        publishedAt: isDraft ? null : new Date(),
        // Filter out empty objectives, prerequisites, and materials
        objectives: formData.objectives.filter(obj => obj.trim() !== ""),
        prerequisites: formData.prerequisites.filter(prereq => prereq.trim() !== ""),
        includedMaterials: formData.includedMaterials.filter(material => material.trim() !== ""),
      };

      console.log("📚 CreateCoursePage - Creating course with data:", courseData);
      console.log("📚 CreateCoursePage - Using createCourseMutation");

      await createCourseMutation.mutateAsync(courseData);

      console.log("✅ CreateCoursePage - Course created successfully");

      toast({
        title: "Éxito",
        description: isDraft 
          ? "Curso guardado como borrador" 
          : "Curso creado y publicado exitosamente",
      });

      router.push("/admin/courses");
    } catch (error) {
      console.error("❌ CreateCoursePage - Error creating course:", error);
      toast({
        title: "Error",
        description: "Error al crear el curso. Por favor intente nuevamente.",
        variant: "destructive",
      });
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
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("📚 CreateCoursePage - Save Draft button clicked");
              handleSubmit(true);
            }}
            disabled={createCourseMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {createCourseMutation.isPending ? "Guardando..." : "Guardar Borrador"}
          </Button>
          <Button 
            onClick={() => {
              console.log("📚 CreateCoursePage - Publish Course button clicked");
              handleSubmit(false);
            }}
            disabled={createCourseMutation.isPending}
          >
            <Eye className="h-4 w-4 mr-2" />
            {createCourseMutation.isPending ? "Publicando..." : "Publicar Curso"}
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
                  <Label htmlFor="title">Título del Curso *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ej: Habilidades Laborales Básicas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL del Curso</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="habilidades-laborales-basicas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descripción Corta *</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  placeholder="Descripción que aparece en las tarjetas del curso"
                  maxLength={120}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.shortDescription.length}/120 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Completa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Descripción detallada del curso, objetivos, metodología..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value as CourseCategory)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
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

                <div className="space-y-2">
                  <Label>Nivel *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) =>
                      handleInputChange("level", value as CourseLevel)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel del curso" />
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

                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (horas) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange(
                        "duration",
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="1"
                    max="100"
                  />
                </div>
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
                <Label>Video de Presentación (Opcional)</Label>
                <Input
                  value={formData.videoPreview}
                  onChange={(e) =>
                    handleInputChange("videoPreview", e.target.value)
                  }
                  placeholder="URL del video de presentación"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos de Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) =>
                      handleArrayChange("objectives", index, e.target.value)
                    }
                    placeholder={`Objetivo ${index + 1}`}
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("objectives", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("objectives")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Objetivo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerrequisitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={prerequisite}
                    onChange={(e) =>
                      handleArrayChange("prerequisites", index, e.target.value)
                    }
                    placeholder={`Prerrequisito ${index + 1}`}
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("prerequisites", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("prerequisites")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Prerrequisito
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Materiales Incluidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.includedMaterials.map((material, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={material}
                    onChange={(e) =>
                      handleArrayChange(
                        "includedMaterials",
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Material ${index + 1}`}
                  />
                  {formData.includedMaterials.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        removeArrayItem("includedMaterials", index)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("includedMaterials")}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Material
              </Button>
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

        {/* Instructor Tab */}
        <TabsContent value="instructor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Información del Instructor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructorName">
                    Nombre del Instructor *
                  </Label>
                  <Input
                    id="instructorName"
                    value={formData.instructor.name}
                    onChange={(e) =>
                      handleInstructorChange("name", e.target.value)
                    }
                    placeholder="Nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructorTitle">Título Profesional *</Label>
                  <Input
                    id="instructorTitle"
                    value={formData.instructor.title}
                    onChange={(e) =>
                      handleInstructorChange("title", e.target.value)
                    }
                    placeholder="Ej: Especialista en Desarrollo Profesional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorBio">Biografía del Instructor</Label>
                <Textarea
                  id="instructorBio"
                  value={formData.instructor.bio}
                  onChange={(e) =>
                    handleInstructorChange("bio", e.target.value)
                  }
                  placeholder="Experiencia, credenciales, especialidades..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Foto del Instructor</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Subir foto del instructor
                  </p>
                  <p className="text-xs text-gray-500">
                    Recomendado: 400x400px, formato cuadrado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isMandatory"
                    checked={formData.isMandatory}
                    onCheckedChange={(checked) =>
                      handleInputChange("isMandatory", checked)
                    }
                  />
                  <Label htmlFor="isMandatory" className="text-sm font-medium">
                    Curso Obligatorio
                  </Label>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certification"
                    checked={formData.certification}
                    onCheckedChange={(checked) =>
                      handleInputChange("certification", checked)
                    }
                  />

                  <Label
                    htmlFor="certification"
                    className="text-sm font-medium"
                  >
                    Incluir Certificado de Finalización
                  </Label>
                  {formData.certification && (
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setCertificateDialogOpen(true)}
                    >
                      Subir Certificado Personalizado
                    </Button>
                  )}

                  <Award className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Publicar Inmediatamente
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (BOB)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
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
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <VideoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Después de crear el curso
                    </p>
                    <p className="text-blue-700">
                      Podrás agregar módulos, lecciones, videos y exámenes desde
                      el panel de gestión del curso.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">
                      Contenido del curso
                    </p>
                    <p className="text-green-700">
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

          <div className="space-y-4">
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setCertificateFile(file);
                }
              }}
            />

            {certificateFile && (
              <p className="text-sm text-muted-foreground">
                Archivo seleccionado: {certificateFile.name}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCertificateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                disabled={!certificateFile}
                onClick={() => {
                  console.log("Subiendo certificado:", certificateFile);
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
