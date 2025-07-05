&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;

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
      businessName: &ldquo;&rdquo;,
      description: &ldquo;&rdquo;,
      category: &ldquo;&rdquo;,
      subcategory: &ldquo;&rdquo;,
      location: &ldquo;&rdquo;,
      foundedYear: &ldquo;&rdquo;,
      website: &ldquo;&rdquo;,
      socialMedia: {
        facebook: &ldquo;&rdquo;,
        instagram: &ldquo;&rdquo;,
        linkedin: &ldquo;&rdquo;,
      },
    },
    services: {
      services: [],
      priceRange: { min: 0, max: 0 },
      serviceDetails: &ldquo;&rdquo;,
    },
    contact: {
      contactPerson: &ldquo;&rdquo;,
      email: &ldquo;&rdquo;,
      phone: &ldquo;&rdquo;,
      whatsapp: &ldquo;&rdquo;,
      preferredContact: &ldquo;&rdquo;,
      availableHours: &ldquo;&rdquo;,
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

  const [newService, setNewService] = useState(&ldquo;&rdquo;);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    {
      title: &ldquo;Información Básica&rdquo;,
      description: &ldquo;Datos principales de tu emprendimiento&rdquo;,
      icon: <Info className=&ldquo;h-5 w-5&rdquo; />,
    },
    {
      title: &ldquo;Servicios y Precios&rdquo;,
      description: &ldquo;Qué ofreces y a qué precio&rdquo;,
      icon: <Plus className=&ldquo;h-5 w-5&rdquo; />,
    },
    // {
    //   title: &ldquo;Información de Contacto&rdquo;,
    //   description: &ldquo;Cómo pueden contactarte&rdquo;,
    //   icon: <Info className=&ldquo;h-5 w-5&rdquo; />,
    // },
    {
      title: &ldquo;Imágenes y Videos&rdquo;,
      description: &ldquo;Galería visual de tu emprendimiento&rdquo;,
      icon: <ImageIcon className=&ldquo;h-5 w-5&rdquo; />,
    },
    // {
    //   title: &ldquo;Configuración de Visibilidad&rdquo;,
    //   description: &ldquo;Controla cómo aparece tu emprendimiento&rdquo;,
    //   icon: <Eye className=&ldquo;h-5 w-5&rdquo; />,
    // },
  ];

  const categories = [
    {
      value: &ldquo;tecnologia&rdquo;,
      label: &ldquo;Tecnología&rdquo;,
      subcategories: [
        &ldquo;Desarrollo Web&rdquo;,
        &ldquo;Apps Móviles&rdquo;,
        &ldquo;Consultoría IT&rdquo;,
        &ldquo;Diseño UX/UI&rdquo;,
      ],
    },
    {
      value: &ldquo;ecommerce&rdquo;,
      label: &ldquo;E-commerce&rdquo;,
      subcategories: [
        &ldquo;Tienda Online&rdquo;,
        &ldquo;Marketplace&rdquo;,
        &ldquo;Dropshipping&rdquo;,
        &ldquo;Servicios Digitales&rdquo;,
      ],
    },
    {
      value: &ldquo;alimentacion&rdquo;,
      label: &ldquo;Alimentación&rdquo;,
      subcategories: [
        &ldquo;Delivery&rdquo;,
        &ldquo;Catering&rdquo;,
        &ldquo;Productos Artesanales&rdquo;,
        &ldquo;Consultoría Nutricional&rdquo;,
      ],
    },
    {
      value: &ldquo;educacion&rdquo;,
      label: &ldquo;Educación&rdquo;,
      subcategories: [
        &ldquo;Cursos Online&rdquo;,
        &ldquo;Tutorías&rdquo;,
        &ldquo;Capacitación Empresarial&rdquo;,
        &ldquo;Material Educativo&rdquo;,
      ],
    },
    {
      value: &ldquo;servicios&rdquo;,
      label: &ldquo;Servicios&rdquo;,
      subcategories: [
        &ldquo;Consultoría&rdquo;,
        &ldquo;Marketing&rdquo;,
        &ldquo;Diseño Gráfico&rdquo;,
        &ldquo;Fotografía&rdquo;,
      ],
    },
    {
      value: &ldquo;manufactura&rdquo;,
      label: &ldquo;Manufactura&rdquo;,
      subcategories: [
        &ldquo;Artesanías&rdquo;,
        &ldquo;Textiles&rdquo;,
        &ldquo;Productos Ecológicos&rdquo;,
        &ldquo;Joyería&rdquo;,
      ],
    },
  ];

  const locations = [
    &ldquo;La Paz&rdquo;,
    &ldquo;Santa Cruz&rdquo;,
    &ldquo;Cochabamba&rdquo;,
    &ldquo;Oruro&rdquo;,
    &ldquo;Potosí&rdquo;,
    &ldquo;Sucre&rdquo;,
    &ldquo;Tarija&rdquo;,
    &ldquo;Beni&rdquo;,
    &ldquo;Pando&rdquo;,
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
      updateFormData(&ldquo;services&rdquo;, &ldquo;services&rdquo;, [
        ...formData.services.services,
        newService.trim(),
      ]);
      setNewService(&ldquo;&rdquo;);
    }
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.services.filter(
      (_, i) => i !== index
    );
    updateFormData(&ldquo;services&rdquo;, &ldquo;services&rdquo;, updatedServices);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      updateFormData(&ldquo;media&rdquo;, &ldquo;images&rdquo;, [...formData.media.images, ...files]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.media.images.filter((_, i) => i !== index);
    updateFormData(&ldquo;media&rdquo;, &ldquo;images&rdquo;, updatedImages);
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
      <div className=&ldquo;container mx-auto p-6 max-w-4xl&rdquo;>
        <div className=&ldquo;flex items-center justify-between mb-6&rdquo;>
          <h1 className=&ldquo;text-2xl font-bold&rdquo;>Vista Previa</h1>
          <Button variant=&ldquo;outline&rdquo; onClick={() => setPreviewMode(false)}>
            <ChevronLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Volver a Editar
          </Button>
        </div>

        <Card className=&ldquo;overflow-hidden&rdquo;>
          <div className=&ldquo;aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center&rdquo;>
            <div className=&ldquo;text-center&rdquo;>
              <h2 className=&ldquo;text-2xl font-bold text-gray-700&rdquo;>
                {formData.basicInfo.businessName}
              </h2>
              <p className=&ldquo;text-gray-500&rdquo;>{formData.basicInfo.category}</p>
            </div>
          </div>

          <CardContent className=&ldquo;p-6&rdquo;>
            <div className=&ldquo;space-y-6&rdquo;>
              <div>
                <h3 className=&ldquo;text-xl font-semibold mb-2&rdquo;>
                  {formData.basicInfo.businessName}
                </h3>
                <p className=&ldquo;text-muted-foreground&rdquo;>
                  {formData.basicInfo.description}
                </p>
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;>
                <div>
                  <h4 className=&ldquo;font-semibold mb-2&rdquo;>Servicios</h4>
                  <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                    {formData.services.services.map((service, index) => (
                      <Badge key={index} variant=&ldquo;secondary&rdquo;>
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className=&ldquo;font-semibold mb-2&rdquo;>Rango de Precios</h4>
                  <p>
                    Bs. {formData.services.priceRange.min} - Bs.{&ldquo; &rdquo;}
                    {formData.services.priceRange.max}
                  </p>
                </div>

                <div>
                  <h4 className=&ldquo;font-semibold mb-2&rdquo;>Ubicación</h4>
                  <p>{formData.basicInfo.location}</p>
                </div>

                <div>
                  <h4 className=&ldquo;font-semibold mb-2&rdquo;>Contacto</h4>
                  <p>{formData.contact.contactPerson}</p>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    {formData.contact.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className=&ldquo;flex justify-center mt-6&rdquo;>
          <Button size=&ldquo;lg&rdquo;>
            <Send className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Publicar Emprendimiento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6 max-w-4xl&rdquo;>
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Publicar mi Emprendimiento</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Comparte tu emprendimiento con la comunidad y conecta con clientes
          potenciales
        </p>
      </div>

      {/* Progress Bar */}
      <Card className=&ldquo;mb-6&rdquo;>
        <CardContent className=&ldquo;p-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between mb-4&rdquo;>
            <h3 className=&ldquo;font-semibold&rdquo;>
              Paso {currentStep + 1} de {steps.length}
            </h3>
            <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
              {Math.round(progress)}% completado
            </span>
          </div>
          <Progress value={progress} className=&ldquo;mb-4&rdquo; />

          <div className=&ldquo;flex items-center gap-2&rdquo;>
            {steps[currentStep].icon}
            <div>
              <h4 className=&ldquo;font-medium&rdquo;>{steps[currentStep].title}</h4>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className=&ldquo;p-6&rdquo;>
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Nombre del Emprendimiento *</Label>
                  <Input
                    value={formData.basicInfo.businessName}
                    onChange={(e) =>
                      updateFormData(
                        &ldquo;basicInfo&rdquo;,
                        &ldquo;businessName&rdquo;,
                        e.target.value
                      )
                    }
                    placeholder=&ldquo;Ej: EcoTech Bolivia&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Año de Fundación</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={formData.basicInfo.foundedYear}
                    onChange={(e) =>
                      updateFormData(&ldquo;basicInfo&rdquo;, &ldquo;foundedYear&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;2024&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Descripción *</Label>
                <Textarea
                  value={formData.basicInfo.description}
                  onChange={(e) =>
                    updateFormData(&ldquo;basicInfo&rdquo;, &ldquo;description&rdquo;, e.target.value)
                  }
                  placeholder=&ldquo;Describe tu emprendimiento, qué hace, cuál es su propósito...&rdquo;
                  className=&ldquo;min-h-[120px]&rdquo;
                />
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.basicInfo.category}
                    onValueChange={(value) =>
                      updateFormData(&ldquo;basicInfo&rdquo;, &ldquo;category&rdquo;, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Selecciona una categoría&rdquo; />
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

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Subcategoría</Label>
                  <Select
                    value={formData.basicInfo.subcategory}
                    onValueChange={(value) =>
                      updateFormData(&ldquo;basicInfo&rdquo;, &ldquo;subcategory&rdquo;, value)
                    }
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Selecciona una subcategoría&rdquo; />
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

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Ubicación *</Label>
                  <Select
                    value={formData.basicInfo.location}
                    onValueChange={(value) =>
                      updateFormData(&ldquo;basicInfo&rdquo;, &ldquo;location&rdquo;, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Selecciona tu ubicación&rdquo; />
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

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Sitio Web</Label>
                  <Input
                    value={formData.basicInfo.website}
                    onChange={(e) =>
                      updateFormData(&ldquo;basicInfo&rdquo;, &ldquo;website&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;https://mi-emprendimiento.com&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;space-y-4&rdquo;>
                <Label>Redes Sociales</Label>
                <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label className=&ldquo;text-sm&rdquo;>Facebook</Label>
                    <Input
                      value={formData.basicInfo.socialMedia.facebook}
                      onChange={(e) =>
                        updateNestedFormData(
                          &ldquo;basicInfo&rdquo;,
                          &ldquo;socialMedia&rdquo;,
                          &ldquo;facebook&rdquo;,
                          e.target.value
                        )
                      }
                      placeholder=&ldquo;@mi-emprendimiento&rdquo;
                    />
                  </div>
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label className=&ldquo;text-sm&rdquo;>Instagram</Label>
                    <Input
                      value={formData.basicInfo.socialMedia.instagram}
                      onChange={(e) =>
                        updateNestedFormData(
                          &ldquo;basicInfo&rdquo;,
                          &ldquo;socialMedia&rdquo;,
                          &ldquo;instagram&rdquo;,
                          e.target.value
                        )
                      }
                      placeholder=&ldquo;@mi-emprendimiento&rdquo;
                    />
                  </div>
                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label className=&ldquo;text-sm&rdquo;>LinkedIn</Label>
                    <Input
                      value={formData.basicInfo.socialMedia.linkedin}
                      onChange={(e) =>
                        updateNestedFormData(
                          &ldquo;basicInfo&rdquo;,
                          &ldquo;socialMedia&rdquo;,
                          &ldquo;linkedin&rdquo;,
                          e.target.value
                        )
                      }
                      placeholder=&ldquo;mi-emprendimiento&rdquo;
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services and Pricing */}
          {currentStep === 1 && (
            <div className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;space-y-4&rdquo;>
                <Label>Servicios que Ofreces *</Label>
                <div className=&ldquo;flex gap-2&rdquo;>
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder=&ldquo;Ej: Desarrollo de sitios web&rdquo;
                    onKeyPress={(e) => e.key === &ldquo;Enter&rdquo; && addService()}
                  />
                  <Button onClick={addService} type=&ldquo;button&rdquo;>
                    <Plus className=&ldquo;h-4 w-4&rdquo; />
                  </Button>
                </div>
                <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                  {formData.services.services.map((service, index) => (
                    <Badge
                      key={index}
                      variant=&ldquo;secondary&rdquo;
                      className=&ldquo;flex items-center gap-1&rdquo;
                    >
                      {service}
                      <X
                        className=&ldquo;h-3 w-3 cursor-pointer&rdquo;
                        onClick={() => removeService(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Precio Mínimo (Bs.) *</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={formData.services.priceRange.min}
                    onChange={(e) =>
                      updateNestedFormData(
                        &ldquo;services&rdquo;,
                        &ldquo;priceRange&rdquo;,
                        &ldquo;min&rdquo;,
                        Number(e.target.value)
                      )
                    }
                    placeholder=&ldquo;100&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Precio Máximo (Bs.) *</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={formData.services.priceRange.max}
                    onChange={(e) =>
                      updateNestedFormData(
                        &ldquo;services&rdquo;,
                        &ldquo;priceRange&rdquo;,
                        &ldquo;max&rdquo;,
                        Number(e.target.value)
                      )
                    }
                    placeholder=&ldquo;5000&rdquo;
                  />
                </div>
              </div> */}

              <div className=&ldquo;space-y-2&rdquo;>
                <Label>Detalles de Servicios</Label>
                <Textarea
                  value={formData.services.serviceDetails}
                  onChange={(e) =>
                    updateFormData(&ldquo;services&rdquo;, &ldquo;serviceDetails&rdquo;, e.target.value)
                  }
                  placeholder=&ldquo;Describe en detalle los servicios que ofreces, metodología, tiempos de entrega...&rdquo;
                  className=&ldquo;min-h-[120px]&rdquo;
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {/* {currentStep === 2 && (
            <div className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Persona de Contacto *</Label>
                  <Input
                    value={formData.contact.contactPerson}
                    onChange={(e) =>
                      updateFormData(&ldquo;contact&rdquo;, &ldquo;contactPerson&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;Tu nombre completo&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Email *</Label>
                  <Input
                    type=&ldquo;email&rdquo;
                    value={formData.contact.email}
                    onChange={(e) =>
                      updateFormData(&ldquo;contact&rdquo;, &ldquo;email&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;contacto@mi-emprendimiento.com&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Teléfono *</Label>
                  <Input
                    value={formData.contact.phone}
                    onChange={(e) =>
                      updateFormData(&ldquo;contact&rdquo;, &ldquo;phone&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;+591 70123456&rdquo;
                  />
                </div>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>WhatsApp</Label>
                  <Input
                    value={formData.contact.whatsapp}
                    onChange={(e) =>
                      updateFormData(&ldquo;contact&rdquo;, &ldquo;whatsapp&rdquo;, e.target.value)
                    }
                    placeholder=&ldquo;+591 70123456&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Método de Contacto Preferido</Label>
                  <Select
                    value={formData.contact.preferredContact}
                    onValueChange={(value) =>
                      updateFormData(&ldquo;contact&rdquo;, &ldquo;preferredContact&rdquo;, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Selecciona un método&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;email&rdquo;>Email</SelectItem>
                      <SelectItem value=&ldquo;phone&rdquo;>Teléfono</SelectItem>
                      <SelectItem value=&ldquo;whatsapp&rdquo;>WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className=&ldquo;space-y-2&rdquo;>
                  <Label>Horario de Atención</Label>
                  <Input
                    value={formData.contact.availableHours}
                    onChange={(e) =>
                      updateFormData(
                        &ldquo;contact&rdquo;,
                        &ldquo;availableHours&rdquo;,
                        e.target.value
                      )
                    }
                    placeholder=&ldquo;Lunes a Viernes 9:00 - 18:00&rdquo;
                  />
                </div>
              </div>
            </div>
          )} */}

          {/* Step 4: Media */}
          {currentStep === 3 && (
            <div className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;space-y-4&rdquo;>
                <Label>Imágenes de tu Emprendimiento</Label>
                <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-6 text-center&rdquo;>
                  <Upload className=&ldquo;h-12 w-12 mx-auto mb-4 text-gray-400&rdquo; />
                  <p className=&ldquo;text-muted-foreground mb-2&rdquo;>
                    Arrastra imágenes aquí o haz clic para seleccionar
                  </p>
                  <Input
                    type=&ldquo;file&rdquo;
                    multiple
                    accept=&ldquo;image/*&rdquo;
                    onChange={handleImageUpload}
                    className=&ldquo;hidden&rdquo;
                    id=&ldquo;image-upload&rdquo;
                  />
                  <Button asChild variant=&ldquo;outline&rdquo;>
                    <label htmlFor=&ldquo;image-upload&rdquo; className=&ldquo;cursor-pointer&rdquo;>
                      Seleccionar Imágenes
                    </label>
                  </Button>
                </div>

                {formData.media.images.length > 0 && (
                  <div className=&ldquo;grid grid-cols-2 md:grid-cols-4 gap-4&rdquo;>
                    {formData.media.images.map((image, index) => (
                      <div key={index} className=&ldquo;relative&rdquo;>
                        <div className=&ldquo;aspect-square bg-gray-100 rounded-lg flex items-center justify-center&rdquo;>
                          <ImageIcon className=&ldquo;h-8 w-8 text-gray-400&rdquo; />
                        </div>
                        <Button
                          variant=&ldquo;destructive&rdquo;
                          size=&ldquo;sm&rdquo;
                          className=&ldquo;absolute -top-2 -right-2 h-6 w-6 rounded-full p-0&rdquo;
                          onClick={() => removeImage(index)}
                        >
                          <X className=&ldquo;h-3 w-3&rdquo; />
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
            <div className=&ldquo;space-y-6&rdquo;>
              <div className=&ldquo;space-y-4&rdquo;>
                <Label>Configuración de Visibilidad</Label>

                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;flex items-center space-x-2&rdquo;>
                    <Checkbox
                      id=&ldquo;isPublic&rdquo;
                      checked={formData.visibility.isPublic}
                      onCheckedChange={(checked) =>
                        updateFormData(&ldquo;visibility&rdquo;, &ldquo;isPublic&rdquo;, checked)
                      }
                    />
                    <Label htmlFor=&ldquo;isPublic&rdquo;>
                      Hacer mi emprendimiento público
                    </Label>
                  </div>

                  <div className=&ldquo;flex items-center space-x-2&rdquo;>
                    <Checkbox
                      id=&ldquo;allowDirectContact&rdquo;
                      checked={formData.visibility.allowDirectContact}
                      onCheckedChange={(checked) =>
                        updateFormData(
                          &ldquo;visibility&rdquo;,
                          &ldquo;allowDirectContact&rdquo;,
                          checked
                        )
                      }
                    />
                    <Label htmlFor=&ldquo;allowDirectContact&rdquo;>
                      Permitir contacto directo
                    </Label>
                  </div>

                  <div className=&ldquo;flex items-center space-x-2&rdquo;>
                    <Checkbox
                      id=&ldquo;showPricing&rdquo;
                      checked={formData.visibility.showPricing}
                      onCheckedChange={(checked) =>
                        updateFormData(&ldquo;visibility&rdquo;, &ldquo;showPricing&rdquo;, checked)
                      }
                    />
                    <Label htmlFor=&ldquo;showPricing&rdquo;>
                      Mostrar rango de precios
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Navigation */}
          <div className=&ldquo;flex justify-between pt-6 border-t&rdquo;>
            <Button
              variant=&ldquo;outline&rdquo;
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Anterior
            </Button>

            <div className=&ldquo;flex gap-2&rdquo;>
              <Button variant=&ldquo;outline&rdquo; onClick={() => setPreviewMode(true)}>
                <Eye className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Vista Previa
              </Button>

              <Button variant=&ldquo;outline&rdquo;>
                <Save className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Guardar Borrador
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button disabled={!isStepValid()}>
                  <Send className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  
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
                  <ChevronRight className=&ldquo;h-4 w-4 ml-2&rdquo; />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
