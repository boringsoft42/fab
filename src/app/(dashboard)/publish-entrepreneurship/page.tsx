"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
  Upload,
  X,
  Plus,
  Info,
  Eye,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EntrepreneurshipForm {
  basicInfo: {
    businessName: string;
    description: string;
    category: string;
    subcategory: string;
    location: string;
    foundedYear: string;
    website: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      linkedin: string;
    };
    municipality: string;
    priceMin: string;
    priceMax: string;
  };
  services: {
    services: string[];
    priceRange: {
      min: number;
      max: number;
    };
    serviceDetails: string;
  };
  contact: {
    contactPerson: string;
    email: string;
    phone: string;
    whatsapp: string;
    preferredContact: string;
    availableHours: string;
  };
  media: {
    logo: File | null;
    images: File[];
    videos: string[];
  };
  visibility: {
    isPublic: boolean;
    allowDirectContact: boolean;
    showPricing: boolean;
    featured: boolean;
  };
}

export default function PublishEntrepreneurshipPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EntrepreneurshipForm>({
    basicInfo: {
      businessName: "",
      description: "",
      category: "",
      subcategory: "",
      location: "",
      foundedYear: "",
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        linkedin: "",
      },
      municipality: "",
      priceMin: "",
      priceMax: "",
    },
    services: {
      services: [],
      priceRange: { min: 0, max: 0 },
      serviceDetails: "",
    },
    contact: {
      contactPerson: "",
      email: "",
      phone: "",
      whatsapp: "",
      preferredContact: "",
      availableHours: "",
    },
    media: {
      logo: null,
      images: [],
      videos: [],
    },
    visibility: {
      isPublic: true,
      allowDirectContact: true,
      showPricing: true,
      featured: false,
    },
  });

  const [newService, setNewService] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "Información Básica",
      description: "Datos principales de tu emprendimiento",
      icon: <Info className="h-5 w-5" />,
    },
    {
      title: "Servicios y Precios",
      description: "Qué ofreces y a qué precio",
      icon: <Plus className="h-5 w-5" />,
    },
    {
      title: "Imágenes y Videos",
      description: "Galería visual de tu emprendimiento",
      icon: <ImageIcon className="h-5 w-5" />,
    },
  ];

  const categories = [
    {
      value: "tecnologia",
      label: "Tecnología",
      subcategories: [
        "Desarrollo Web",
        "Apps Móviles",
        "Consultoría IT",
        "Diseño UX/UI",
      ],
    },
    {
      value: "ecommerce",
      label: "E-commerce",
      subcategories: [
        "Tienda Online",
        "Marketplace",
        "Dropshipping",
        "Servicios Digitales",
      ],
    },
    {
      value: "alimentacion",
      label: "Alimentación",
      subcategories: [
        "Delivery",
        "Catering",
        "Productos Artesanales",
        "Consultoría Nutricional",
      ],
    },
    {
      value: "educacion",
      label: "Educación",
      subcategories: [
        "Cursos Online",
        "Tutorías",
        "Capacitación Empresarial",
        "Material Educativo",
      ],
    },
    {
      value: "servicios",
      label: "Servicios",
      subcategories: [
        "Consultoría",
        "Marketing",
        "Diseño Gráfico",
        "Fotografía",
      ],
    },
    {
      value: "manufactura",
      label: "Manufactura",
      subcategories: [
        "Artesanías",
        "Textiles",
        "Productos Ecológicos",
        "Joyería",
      ],
    },
  ];

  const locations = [
    "La Paz",
    "Santa Cruz",
    "Cochabamba",
    "Oruro",
    "Potosí",
    "Sucre",
    "Tarija",
    "Beni",
    "Pando",
  ];

  const municipalitiesByCity: Record<string, string[]> = {
    "La Paz": ["Viacha", "El Alto", "Achocalla"],
    Cochabamba: ["Sacaba", "Quillacollo"],
    "Santa Cruz": ["Warnes", "Montero"],
    Oruro: ["Challapata"],
    Potosí: ["Uyuni"],
    Sucre: ["Yotala"],
    Tarija: ["Bermejo"],
    Beni: ["Trinidad"],
    Pando: ["Cobija"],
  };
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const updateFormData = (
    section: keyof EntrepreneurshipForm,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateNestedFormData = (
    section: keyof EntrepreneurshipForm,
    subsection: string,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value,
        },
      },
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      updateFormData("services", "services", [
        ...formData.services.services,
        newService.trim(),
      ]);
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.services.filter(
      (_, i) => i !== index
    );
    updateFormData("services", "services", updatedServices);
  };

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        updateFormData("media", "images", [...formData.media.images, ...files]);
      }
    },
    []
  );

  const removeImage = (index: number) => {
    const updatedImages = formData.media.images.filter((_, i) => i !== index);
    updateFormData("media", "images", updatedImages);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const selectedCategory = categories.find(
    (cat) => cat.value === formData.basicInfo.category
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.basicInfo.businessName &&
          formData.basicInfo.description &&
          formData.basicInfo.category &&
          formData.basicInfo.location
        );
      case 1:
        return formData.services.services.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      // In a real app, we would submit the form data to an API
      console.log("Form submitted:", formData);
      // Reset form after successful submission
      setFormData({
        basicInfo: {
          businessName: "",
          description: "",
          category: "",
          subcategory: "",
          location: "",
          foundedYear: "",
          website: "",
          socialMedia: {
            facebook: "",
            instagram: "",
            linkedin: "",
          },
          municipality: "",
          priceMin: "",
          priceMax: "",
        },
        services: {
          services: [],
          priceRange: { min: 0, max: 0 },
          serviceDetails: "",
        },
        contact: {
          contactPerson: "",
          email: "",
          phone: "",
          whatsapp: "",
          preferredContact: "",
          availableHours: "",
        },
        media: {
          logo: null,
          images: [],
          videos: [],
        },
        visibility: {
          isPublic: true,
          allowDirectContact: true,
          showPricing: true,
          featured: false,
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (previewMode) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Vista Previa</h1>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver a Editar
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-700">
                {formData.basicInfo.businessName}
              </h2>
              <p className="text-gray-500">{formData.basicInfo.category}</p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {formData.basicInfo.businessName}
                </h3>
                <p className="text-muted-foreground">
                  {formData.basicInfo.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Servicios</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.services.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Rango de Precios</h4>
                  <p>
                    Bs. {formData.basicInfo.priceMin} - Bs.{" "}
                    {formData.basicInfo.priceMax}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ubicación</h4>
                  <p>{formData.basicInfo.location}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Contacto</h4>
                  <p>{formData.contact.contactPerson}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.contact.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button size="lg">
            <Send className="h-4 w-4 mr-2" />
            Publicar Emprendimiento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Publicar mi Emprendimiento</h1>
        <p className="text-muted-foreground">
          Comparte tu emprendimiento con la comunidad y conecta con clientes
          potenciales
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Paso {currentStep + 1} de {steps.length}
            </h3>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% completado
            </span>
          </div>
          <Progress value={progress} className="mb-4" />

          <div className="flex items-center gap-2">
            {steps[currentStep].icon}
            <div>
              <h4 className="font-medium">{steps[currentStep].title}</h4>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Tabs
            value={formData.basicInfo.category}
            onValueChange={(value: string) =>
              updateFormData("basicInfo", "category", value)
            }
          >
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="tecnologia">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre del Emprendimiento *</Label>
                    <Input
                      value={formData.basicInfo.businessName}
                      onChange={(e) =>
                        updateFormData(
                          "basicInfo",
                          "businessName",
                          e.target.value
                        )
                      }
                      placeholder="Ej: EcoTech Bolivia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Año de Fundación</Label>
                    <Input
                      type="number"
                      value={formData.basicInfo.foundedYear}
                      onChange={(e) =>
                        updateFormData(
                          "basicInfo",
                          "foundedYear",
                          e.target.value
                        )
                      }
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Descripción *</Label>
                  <Textarea
                    value={formData.basicInfo.description}
                    onChange={(e) =>
                      updateFormData("basicInfo", "description", e.target.value)
                    }
                    placeholder="Describe tu emprendimiento, qué hace, cuál es su propósito..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoría *</Label>
                    <Select
                      value={formData.basicInfo.category}
                      onValueChange={(value) =>
                        updateFormData("basicInfo", "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
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

                  <div className="space-y-2">
                    <Label>Subcategoría</Label>
                    <Select
                      value={formData.basicInfo.subcategory}
                      onValueChange={(value) =>
                        updateFormData("basicInfo", "subcategory", value)
                      }
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ubicación *</Label>
                    <Select
                      value={formData.basicInfo.location}
                      onValueChange={(value) => {
                        updateFormData("basicInfo", "location", value);
                        setSelectedMunicipality("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Municipio</Label>
                    <Select
                      value={selectedMunicipality}
                      onValueChange={(value) => {
                        setSelectedMunicipality(value);
                        updateFormData("basicInfo", "municipality", value);
                      }}
                      disabled={!formData.basicInfo.location}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          municipalitiesByCity[formData.basicInfo.location] ||
                          []
                        ).map((muni) => (
                          <SelectItem key={muni} value={muni}>
                            {muni}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio Mínimo (Bs.)</Label>
                    <Input
                      type="number"
                      value={formData.basicInfo.priceMin || ""}
                      onChange={(e) =>
                        updateFormData("basicInfo", "priceMin", e.target.value)
                      }
                      placeholder="Ej: 100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio Máximo (Bs.)</Label>
                    <Input
                      type="number"
                      value={formData.basicInfo.priceMax || ""}
                      onChange={(e) =>
                        updateFormData("basicInfo", "priceMax", e.target.value)
                      }
                      placeholder="Ej: 1000"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Redes Sociales</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Facebook</Label>
                      <Input
                        value={formData.basicInfo.socialMedia.facebook}
                        onChange={(e) =>
                          updateNestedFormData(
                            "basicInfo",
                            "socialMedia",
                            "facebook",
                            e.target.value
                          )
                        }
                        placeholder="@mi-emprendimiento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Instagram</Label>
                      <Input
                        value={formData.basicInfo.socialMedia.instagram}
                        onChange={(e) =>
                          updateNestedFormData(
                            "basicInfo",
                            "socialMedia",
                            "instagram",
                            e.target.value
                          )
                        }
                        placeholder="@mi-emprendimiento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">LinkedIn</Label>
                      <Input
                        value={formData.basicInfo.socialMedia.linkedin}
                        onChange={(e) =>
                          updateNestedFormData(
                            "basicInfo",
                            "socialMedia",
                            "linkedin",
                            e.target.value
                          )
                        }
                        placeholder="mi-emprendimiento"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ecommerce">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Servicios que Ofreces *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ej: Desarrollo de sitios web"
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeService(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Detalles de Servicios</Label>
                  <Textarea
                    value={formData.services.serviceDetails}
                    onChange={(e) =>
                      updateFormData(
                        "services",
                        "serviceDetails",
                        e.target.value
                      )
                    }
                    placeholder="Describe en detalle los servicios que ofreces, metodología, tiempos de entrega..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alimentacion">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Servicios que Ofreces *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ej: Desarrollo de sitios web"
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeService(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Detalles de Servicios</Label>
                  <Textarea
                    value={formData.services.serviceDetails}
                    onChange={(e) =>
                      updateFormData(
                        "services",
                        "serviceDetails",
                        e.target.value
                      )
                    }
                    placeholder="Describe en detalle los servicios que ofreces, metodología, tiempos de entrega..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="educacion">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Servicios que Ofreces *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ej: Desarrollo de sitios web"
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeService(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Detalles de Servicios</Label>
                  <Textarea
                    value={formData.services.serviceDetails}
                    onChange={(e) =>
                      updateFormData(
                        "services",
                        "serviceDetails",
                        e.target.value
                      )
                    }
                    placeholder="Describe en detalle los servicios que ofreces, metodología, tiempos de entrega..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="servicios">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Servicios que Ofreces *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ej: Desarrollo de sitios web"
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeService(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Detalles de Servicios</Label>
                  <Textarea
                    value={formData.services.serviceDetails}
                    onChange={(e) =>
                      updateFormData(
                        "services",
                        "serviceDetails",
                        e.target.value
                      )
                    }
                    placeholder="Describe en detalle los servicios que ofreces, metodología, tiempos de entrega..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manufactura">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Servicios que Ofreces *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ej: Desarrollo de sitios web"
                      onKeyPress={(e) => e.key === "Enter" && addService()}
                    />
                    <Button onClick={addService} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeService(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Detalles de Servicios</Label>
                  <Textarea
                    value={formData.services.serviceDetails}
                    onChange={(e) =>
                      updateFormData(
                        "services",
                        "serviceDetails",
                        e.target.value
                      )
                    }
                    placeholder="Describe en detalle los servicios que ofreces, metodología, tiempos de entrega..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>

              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button disabled={!isStepValid()}>
                  <Send className="h-4 w-4 mr-2" />
                  Publicar
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                  }
                  disabled={!isStepValid()}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
