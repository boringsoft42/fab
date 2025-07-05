"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-react";

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
    // {
    //   title: "Información de Contacto",
    //   description: "Cómo pueden contactarte",
    //   icon: <Info className="h-5 w-5" />,
    // },
    {
      title: "Imágenes y Videos",
      description: "Galería visual de tu emprendimiento",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    // {
    //   title: "Configuración de Visibilidad",
    //   description: "Controla cómo aparece tu emprendimiento",
    //   icon: <Eye className="h-5 w-5" />,
    // },
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      updateFormData("media", "images", [...formData.media.images, ...files]);
    }
  };

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
        return (
          formData.services.services.length > 0 
          // formData.services.priceRange.min > 0
        );
      // case 2:
      //   return (
      //     formData.contact.contactPerson &&
      //     formData.contact.email &&
      //     formData.contact.phone
      //   );
      case 2:
        return true; // Media is optional
      case 3:
        return true; // Visibility settings have defaults
      default:
        return false;
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
                    Bs. {formData.services.priceRange.min} - Bs.{" "}
                    {formData.services.priceRange.max}
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

      {/* Progress Bar */}
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
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
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
                      updateFormData("basicInfo", "foundedYear", e.target.value)
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
                        <SelectItem key={category.value} value={category.value}>
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
                    onValueChange={(value) =>
                      updateFormData("basicInfo", "location", value)
                    }
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
                  <Label>Sitio Web</Label>
                  <Input
                    value={formData.basicInfo.website}
                    onChange={(e) =>
                      updateFormData("basicInfo", "website", e.target.value)
                    }
                    placeholder="https://mi-emprendimiento.com"
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
          )}

          {/* Step 2: Services and Pricing */}
          {currentStep === 1 && (
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

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio Mínimo (Bs.) *</Label>
                  <Input
                    type="number"
                    value={formData.services.priceRange.min}
                    onChange={(e) =>
                      updateNestedFormData(
                        "services",
                        "priceRange",
                        "min",
                        Number(e.target.value)
                      )
                    }
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Máximo (Bs.) *</Label>
                  <Input
                    type="number"
                    value={formData.services.priceRange.max}
                    onChange={(e) =>
                      updateNestedFormData(
                        "services",
                        "priceRange",
                        "max",
                        Number(e.target.value)
                      )
                    }
                    placeholder="5000"
                  />
                </div>
              </div> */}

              <div className="space-y-2">
                <Label>Detalles de Servicios</Label>
                <Textarea
                  value={formData.services.serviceDetails}
                  onChange={(e) =>
                    updateFormData("services", "serviceDetails", e.target.value)
                  }
                  placeholder="Describe en detalle los servicios que ofreces, metodología, tiempos de entrega..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {/* {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Persona de Contacto *</Label>
                  <Input
                    value={formData.contact.contactPerson}
                    onChange={(e) =>
                      updateFormData("contact", "contactPerson", e.target.value)
                    }
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      updateFormData("contact", "email", e.target.value)
                    }
                    placeholder="contacto@mi-emprendimiento.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono *</Label>
                  <Input
                    value={formData.contact.phone}
                    onChange={(e) =>
                      updateFormData("contact", "phone", e.target.value)
                    }
                    placeholder="+591 70123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.contact.whatsapp}
                    onChange={(e) =>
                      updateFormData("contact", "whatsapp", e.target.value)
                    }
                    placeholder="+591 70123456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Método de Contacto Preferido</Label>
                  <Select
                    value={formData.contact.preferredContact}
                    onValueChange={(value) =>
                      updateFormData("contact", "preferredContact", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Teléfono</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Horario de Atención</Label>
                  <Input
                    value={formData.contact.availableHours}
                    onChange={(e) =>
                      updateFormData(
                        "contact",
                        "availableHours",
                        e.target.value
                      )
                    }
                    placeholder="Lunes a Viernes 9:00 - 18:00"
                  />
                </div>
              </div>
            </div>
          )} */}

          {/* Step 4: Media */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Imágenes de tu Emprendimiento</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-muted-foreground mb-2">
                    Arrastra imágenes aquí o haz clic para seleccionar
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Seleccionar Imágenes
                    </label>
                  </Button>
                </div>

                {formData.media.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.media.images.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Visibility */}
          {/* {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Configuración de Visibilidad</Label>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublic"
                      checked={formData.visibility.isPublic}
                      onCheckedChange={(checked) =>
                        updateFormData("visibility", "isPublic", checked)
                      }
                    />
                    <Label htmlFor="isPublic">
                      Hacer mi emprendimiento público
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowDirectContact"
                      checked={formData.visibility.allowDirectContact}
                      onCheckedChange={(checked) =>
                        updateFormData(
                          "visibility",
                          "allowDirectContact",
                          checked
                        )
                      }
                    />
                    <Label htmlFor="allowDirectContact">
                      Permitir contacto directo
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPricing"
                      checked={formData.visibility.showPricing}
                      onCheckedChange={(checked) =>
                        updateFormData("visibility", "showPricing", checked)
                      }
                    />
                    <Label htmlFor="showPricing">
                      Mostrar rango de precios
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Navigation */}
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
