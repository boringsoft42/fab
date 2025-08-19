"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Save,
  ArrowLeft,
  Eye,
  Building2,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Globe,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEntrepreneurship } from "@/hooks/useEntrepreneurshipApi";
import { useUpdateEntrepreneurship } from "@/hooks/useEntrepreneurshipApi";
import { Entrepreneurship } from "@/types/profile";

interface EditFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  businessStage: "IDEA" | "STARTUP" | "GROWING" | "ESTABLISHED";
  municipality: string;
  department: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  founded: string;
  employees: string;
  annualRevenue: string;
  businessModel: string;
  targetMarket: string;
  isPublic: boolean;
}

export default function EditEntrepreneurshipPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const entrepreneurshipId = params.id as string;
  
  const { entrepreneurship, loading: fetchLoading, error: fetchError, fetchEntrepreneurship } = useEntrepreneurship(entrepreneurshipId);
  const { updateEntrepreneurship, loading: updateLoading, error: updateError } = useUpdateEntrepreneurship();
  
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    businessStage: "IDEA",
    municipality: "",
    department: "Cochabamba",
    website: "",
    email: "",
    phone: "",
    address: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
    founded: "",
    employees: "",
    annualRevenue: "",
    businessModel: "",
    targetMarket: "",
    isPublic: true,
  });

  useEffect(() => {
    if (entrepreneurshipId) {
      fetchEntrepreneurship();
    }
  }, [entrepreneurshipId, fetchEntrepreneurship]);

  useEffect(() => {
    if (entrepreneurship) {
      setFormData({
        name: entrepreneurship.name || "",
        description: entrepreneurship.description || "",
        category: entrepreneurship.category || "",
        subcategory: entrepreneurship.subcategory || "",
        businessStage: entrepreneurship.businessStage || "IDEA",
        municipality: entrepreneurship.municipality || "",
        department: entrepreneurship.department || "Cochabamba",
        website: entrepreneurship.website || "",
        email: entrepreneurship.email || "",
        phone: entrepreneurship.phone || "",
        address: entrepreneurship.address || "",
        socialMedia: {
          facebook: (entrepreneurship.socialMedia as any)?.facebook || "",
          instagram: (entrepreneurship.socialMedia as any)?.instagram || "",
          linkedin: (entrepreneurship.socialMedia as any)?.linkedin || "",
        },
        founded: entrepreneurship.founded ? new Date(entrepreneurship.founded).getFullYear().toString() : "",
        employees: entrepreneurship.employees?.toString() || "",
        annualRevenue: entrepreneurship.annualRevenue?.toString() || "",
        businessModel: entrepreneurship.businessModel || "",
        targetMarket: entrepreneurship.targetMarket || "",
        isPublic: entrepreneurship.isPublic,
      });
    }
  }, [entrepreneurship]);

  const categories = [
    { value: "tecnologia", label: "Tecnología" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "alimentacion", label: "Alimentación" },
    { value: "educacion", label: "Educación" },
    { value: "servicios", label: "Servicios" },
    { value: "manufactura", label: "Manufactura" }
  ];

  const businessStages = [
    { value: "IDEA", label: "Idea" },
    { value: "STARTUP", label: "Startup" },
    { value: "GROWING", label: "En Crecimiento" },
    { value: "ESTABLISHED", label: "Establecida" }
  ];

  const departments = [
    "Cochabamba",
    "La Paz",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando"
  ];

  const municipalities = [
    "Cochabamba",
    "Sacaba",
    "Quillacollo",
    "Viacha",
    "El Alto",
    "La Paz",
    "Santa Cruz",
    "Warnes",
    "Montero"
  ];

  const updateFormField = (field: keyof EditFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSocialMedia = (platform: keyof EditFormData['socialMedia'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        businessStage: formData.businessStage,
        municipality: formData.municipality,
        department: formData.department,
        website: formData.website || undefined,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        socialMedia: {
          facebook: formData.socialMedia.facebook || undefined,
          instagram: formData.socialMedia.instagram || undefined,
          linkedin: formData.socialMedia.linkedin || undefined,
        },
        founded: formData.founded ? new Date(parseInt(formData.founded), 0, 1) : undefined,
        employees: formData.employees ? parseInt(formData.employees) : undefined,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : undefined,
        businessModel: formData.businessModel || undefined,
        targetMarket: formData.targetMarket || undefined,
        isPublic: formData.isPublic,
      };

      await updateEntrepreneurship(entrepreneurshipId, updateData);
      
      toast({
        title: "Emprendimiento actualizado",
        description: "Los cambios han sido guardados exitosamente",
      });
      
      router.push("/my-entrepreneurships");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el emprendimiento",
        variant: "destructive",
      });
    }
  };

  const getBusinessStageColor = (stage: string) => {
    switch (stage) {
      case 'IDEA':
        return 'bg-blue-100 text-blue-800';
      case 'STARTUP':
        return 'bg-green-100 text-green-800';
      case 'GROWING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ESTABLISHED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBusinessStageLabel = (stage: string) => {
    switch (stage) {
      case 'IDEA':
        return 'Idea';
      case 'STARTUP':
        return 'Startup';
      case 'GROWING':
        return 'En Crecimiento';
      case 'ESTABLISHED':
        return 'Establecida';
      default:
        return stage;
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Cargando emprendimiento...</span>
        </div>
      </div>
    );
  }

  if (fetchError || !entrepreneurship) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">Error al cargar el emprendimiento</p>
            <p className="text-red-500 text-sm">{fetchError || "No se encontró el emprendimiento"}</p>
            <Button 
              onClick={() => router.push("/my-entrepreneurships")} 
              variant="outline" 
              className="mt-4"
            >
              Volver a mis emprendimientos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/my-entrepreneurships")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Editar Emprendimiento</h1>
            <p className="text-muted-foreground">
              Actualiza la información de tu emprendimiento
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push(`/entrepreneurship/${entrepreneurshipId}`)}>
          <Eye className="h-4 w-4 mr-2" />
          Ver Público
        </Button>
      </div>

      {/* Current Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{entrepreneurship.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getBusinessStageColor(entrepreneurship.businessStage)}>
                    {getBusinessStageLabel(entrepreneurship.businessStage)}
                  </Badge>
                  {entrepreneurship.isPublic ? (
                    <Badge variant="secondary">Público</Badge>
                  ) : (
                    <Badge variant="outline">Privado</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {entrepreneurship.viewsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {entrepreneurship.viewsCount} vistas
                  </div>
                )}
                {entrepreneurship.employees && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {entrepreneurship.employees} empleados
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Emprendimiento *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormField("name", e.target.value)}
                  placeholder="Nombre de tu emprendimiento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormField("description", e.target.value)}
                  placeholder="Describe tu emprendimiento"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormField("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessStage">Etapa del Negocio *</Label>
                  <Select value={formData.businessStage} onValueChange={(value: any) => updateFormField("businessStage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategoría</Label>
                <Input
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => updateFormField("subcategory", e.target.value)}
                  placeholder="Subcategoría específica"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación y Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento *</Label>
                  <Select value={formData.department} onValueChange={(value) => updateFormField("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="municipality">Municipio *</Label>
                  <Select value={formData.municipality} onValueChange={(value) => updateFormField("municipality", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona municipio" />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalities.map((muni) => (
                        <SelectItem key={muni} value={muni}>
                          {muni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormField("address", e.target.value)}
                  placeholder="Dirección completa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormField("email", e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormField("phone", e.target.value)}
                  placeholder="+591 70000000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormField("website", e.target.value)}
                  placeholder="https://tu-sitio.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Negocio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="founded">Año de Fundación</Label>
                <Input
                  id="founded"
                  type="number"
                  value={formData.founded}
                  onChange={(e) => updateFormField("founded", e.target.value)}
                  placeholder="2024"
                  min="1900"
                  max="2030"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees">Número de Empleados</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={formData.employees}
                    onChange={(e) => updateFormField("employees", e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Ingresos Anuales (Bs.)</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={formData.annualRevenue}
                    onChange={(e) => updateFormField("annualRevenue", e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessModel">Modelo de Negocio</Label>
                <Textarea
                  id="businessModel"
                  value={formData.businessModel}
                  onChange={(e) => updateFormField("businessModel", e.target.value)}
                  placeholder="Describe tu modelo de negocio"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">Mercado Objetivo</Label>
                <Input
                  id="targetMarket"
                  value={formData.targetMarket}
                  onChange={(e) => updateFormField("targetMarket", e.target.value)}
                  placeholder="Tu mercado objetivo"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales y Visibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => updateSocialMedia("facebook", e.target.value)}
                  placeholder="@tu-pagina"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                  placeholder="@tu-cuenta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => updateSocialMedia("linkedin", e.target.value)}
                  placeholder="tu-perfil"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => updateFormField("isPublic", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isPublic">Hacer público este emprendimiento</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/my-entrepreneurships")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
