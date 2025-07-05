&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import {
  FileText,
  BookOpen,
  Play,
  Headphones,
  Calculator,
  Plus,
  Search,
  Building2,
  Users,
  MessageCircle,
  GraduationCap,
  Award,
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  Clock,
  Video,
  User,
  Briefcase,
} from &ldquo;lucide-react&rdquo;;

// Types for different content sections
interface Resource {
  id: string;
  title: string;
  description: string;
  type: &ldquo;template&rdquo; | &ldquo;guide&rdquo; | &ldquo;video&rdquo; | &ldquo;podcast&rdquo; | &ldquo;tool&rdquo;;
  category: string;
  fileUrl: string;
  thumbnail: string;
  tags: string[];
  status: &ldquo;published&rdquo; | &ldquo;draft&rdquo;;
  featured: boolean;
  createdAt: Date;
}

interface Institution {
  id: string;
  name: string;
  type:
    | &ldquo;municipality&rdquo;
    | &ldquo;ngo&rdquo;
    | &ldquo;foundation&rdquo;
    | &ldquo;training_center&rdquo;
    | &ldquo;government&rdquo;;
  description: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  services: string[];
  focusAreas: string[];
  programs: string[];
  status: &ldquo;active&rdquo; | &ldquo;inactive&rdquo;;
  featured: boolean;
  createdAt: Date;
}

interface NetworkContact {
  id: string;
  name: string;
  businessName: string;
  category: string;
  location: string;
  bio: string;
  skills: string[];
  interests: string[];
  avatar: string;
  lookingFor: string[];
  offering: string[];
  experience: string;
  connections: number;
  isAvailable: boolean;
  status: &ldquo;active&rdquo; | &ldquo;inactive&rdquo;;
  createdAt: Date;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[];
  experience: string;
  avatar: string;
  languages: string[];
  price: { type: &ldquo;free&rdquo; | &ldquo;paid&rdquo;; amount?: number };
  availability: string;
  achievements: string[];
  isVerified: boolean;
  status: &ldquo;active&rdquo; | &ldquo;inactive&rdquo;;
  createdAt: Date;
}

export default function YouthContentManagementPage() {
  const [activeTab, setActiveTab] = useState(&ldquo;resources&rdquo;);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for different content types
  const [resourceForm, setResourceForm] = useState({
    title: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    type: &ldquo;template&rdquo; as const,
    category: &ldquo;&rdquo;,
    fileUrl: &ldquo;&rdquo;,
    thumbnail: &ldquo;&rdquo;,
    tags: &ldquo;&rdquo;,
    featured: false,
    status: &ldquo;draft&rdquo; as const,
  });

  const [institutionForm, setInstitutionForm] = useState({
    name: &ldquo;&rdquo;,
    type: &ldquo;municipality&rdquo; as const,
    description: &ldquo;&rdquo;,
    location: &ldquo;&rdquo;,
    address: &ldquo;&rdquo;,
    phone: &ldquo;&rdquo;,
    email: &ldquo;&rdquo;,
    website: &ldquo;&rdquo;,
    logo: &ldquo;&rdquo;,
    services: &ldquo;&rdquo;,
    focusAreas: &ldquo;&rdquo;,
    programs: &ldquo;&rdquo;,
    featured: false,
    status: &ldquo;active&rdquo; as const,
  });

  const [contactForm, setContactForm] = useState({
    name: &ldquo;&rdquo;,
    businessName: &ldquo;&rdquo;,
    category: &ldquo;&rdquo;,
    location: &ldquo;&rdquo;,
    bio: &ldquo;&rdquo;,
    skills: &ldquo;&rdquo;,
    interests: &ldquo;&rdquo;,
    avatar: &ldquo;&rdquo;,
    lookingFor: &ldquo;&rdquo;,
    offering: &ldquo;&rdquo;,
    experience: &ldquo;&rdquo;,
    isAvailable: true,
    status: &ldquo;active&rdquo; as const,
  });

  const [mentorForm, setMentorForm] = useState({
    name: &ldquo;&rdquo;,
    title: &ldquo;&rdquo;,
    company: &ldquo;&rdquo;,
    location: &ldquo;&rdquo;,
    bio: &ldquo;&rdquo;,
    expertise: &ldquo;&rdquo;,
    experience: &ldquo;&rdquo;,
    avatar: &ldquo;&rdquo;,
    languages: &ldquo;&rdquo;,
    priceType: &ldquo;free&rdquo; as const,
    priceAmount: 0,
    availability: &ldquo;&rdquo;,
    achievements: &ldquo;&rdquo;,
    status: &ldquo;active&rdquo; as const,
  });

  const handleCreateContent = async () => {
    try {
      setLoading(true);
      let endpoint = &ldquo;&rdquo;;
      let data = {};

      switch (activeTab) {
        case &ldquo;resources&rdquo;:
          endpoint = &ldquo;/api/admin/entrepreneurship/resources&rdquo;;
          data = {
            ...resourceForm,
            tags: resourceForm.tags.split(&ldquo;,&rdquo;).map((tag) => tag.trim()),
          };
          break;
        case &ldquo;institutions&rdquo;:
          endpoint = &ldquo;/api/admin/institutions&rdquo;;
          data = {
            ...institutionForm,
            services: institutionForm.services.split(&ldquo;,&rdquo;).map((s) => s.trim()),
            focusAreas: institutionForm.focusAreas
              .split(&ldquo;,&rdquo;)
              .map((f) => f.trim()),
            programs: institutionForm.programs.split(&ldquo;,&rdquo;).map((p) => p.trim()),
          };
          break;
        case &ldquo;contacts&rdquo;:
          endpoint = &ldquo;/api/admin/youth-content/contacts&rdquo;;
          data = {
            ...contactForm,
            skills: contactForm.skills.split(&ldquo;,&rdquo;).map((s) => s.trim()),
            interests: contactForm.interests.split(&ldquo;,&rdquo;).map((i) => i.trim()),
            lookingFor: contactForm.lookingFor.split(&ldquo;,&rdquo;).map((l) => l.trim()),
            offering: contactForm.offering.split(&ldquo;,&rdquo;).map((o) => o.trim()),
          };
          break;
        case &ldquo;mentors&rdquo;:
          endpoint = &ldquo;/api/admin/youth-content/mentors&rdquo;;
          data = {
            ...mentorForm,
            expertise: mentorForm.expertise.split(&ldquo;,&rdquo;).map((e) => e.trim()),
            languages: mentorForm.languages.split(&ldquo;,&rdquo;).map((l) => l.trim()),
            achievements: mentorForm.achievements
              .split(&ldquo;,&rdquo;)
              .map((a) => a.trim()),
            price: {
              type: mentorForm.priceType,
              amount:
                mentorForm.priceType === &ldquo;paid&rdquo;
                  ? mentorForm.priceAmount
                  : undefined,
            },
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: &ldquo;POST&rdquo;,
        headers: { &ldquo;Content-Type&rdquo;: &ldquo;application/json&rdquo; },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        resetForms();
        // Show success message or refresh data
      }
    } catch (error) {
      console.error(&ldquo;Error creating content:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setResourceForm({
      title: &ldquo;&rdquo;,
      description: &ldquo;&rdquo;,
      type: &ldquo;template&rdquo;,
      category: &ldquo;&rdquo;,
      fileUrl: &ldquo;&rdquo;,
      thumbnail: &ldquo;&rdquo;,
      tags: &ldquo;&rdquo;,
      featured: false,
      status: &ldquo;draft&rdquo;,
    });
    setInstitutionForm({
      name: &ldquo;&rdquo;,
      type: &ldquo;municipality&rdquo;,
      description: &ldquo;&rdquo;,
      location: &ldquo;&rdquo;,
      address: &ldquo;&rdquo;,
      phone: &ldquo;&rdquo;,
      email: &ldquo;&rdquo;,
      website: &ldquo;&rdquo;,
      logo: &ldquo;&rdquo;,
      services: &ldquo;&rdquo;,
      focusAreas: &ldquo;&rdquo;,
      programs: &ldquo;&rdquo;,
      featured: false,
      status: &ldquo;active&rdquo;,
    });
    setContactForm({
      name: &ldquo;&rdquo;,
      businessName: &ldquo;&rdquo;,
      category: &ldquo;&rdquo;,
      location: &ldquo;&rdquo;,
      bio: &ldquo;&rdquo;,
      skills: &ldquo;&rdquo;,
      interests: &ldquo;&rdquo;,
      avatar: &ldquo;&rdquo;,
      lookingFor: &ldquo;&rdquo;,
      offering: &ldquo;&rdquo;,
      experience: &ldquo;&rdquo;,
      isAvailable: true,
      status: &ldquo;active&rdquo;,
    });
    setMentorForm({
      name: &ldquo;&rdquo;,
      title: &ldquo;&rdquo;,
      company: &ldquo;&rdquo;,
      location: &ldquo;&rdquo;,
      bio: &ldquo;&rdquo;,
      expertise: &ldquo;&rdquo;,
      experience: &ldquo;&rdquo;,
      avatar: &ldquo;&rdquo;,
      languages: &ldquo;&rdquo;,
      priceType: &ldquo;free&rdquo;,
      priceAmount: 0,
      availability: &ldquo;&rdquo;,
      achievements: &ldquo;&rdquo;,
      status: &ldquo;active&rdquo;,
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case &ldquo;resources&rdquo;:
        return <FileText className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;institutions&rdquo;:
        return <Building2 className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;contacts&rdquo;:
        return <Users className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;mentors&rdquo;:
        return <GraduationCap className=&ldquo;h-4 w-4&rdquo; />;
      default:
        return <FileText className=&ldquo;h-4 w-4&rdquo; />;
    }
  };

  const categories = {
    resources: [
      &ldquo;Planificación&rdquo;,
      &ldquo;Validación&rdquo;,
      &ldquo;Finanzas&rdquo;,
      &ldquo;Marketing&rdquo;,
      &ldquo;Legal&rdquo;,
      &ldquo;Tecnología&rdquo;,
    ],
    contacts: [
      &ldquo;Tecnología&rdquo;,
      &ldquo;Marketing&rdquo;,
      &ldquo;Finanzas&rdquo;,
      &ldquo;E-commerce&rdquo;,
      &ldquo;Agro&rdquo;,
      &ldquo;Salud&rdquo;,
      &ldquo;Educación&rdquo;,
    ],
    mentors: [
      &ldquo;Tecnología&rdquo;,
      &ldquo;Marketing Digital&rdquo;,
      &ldquo;Finanzas&rdquo;,
      &ldquo;Liderazgo&rdquo;,
      &ldquo;Startups&rdquo;,
      &ldquo;Negocios&rdquo;,
    ],
  };

  return (
    <div className=&ldquo;container mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>
            Gestión de Contenido para Jóvenes
          </h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Administra todo el contenido que aparece en el perfil de jóvenes
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Crear Contenido
            </Button>
          </DialogTrigger>
          <DialogContent className=&ldquo;max-w-4xl max-h-[90vh] overflow-y-auto&rdquo;>
            <DialogHeader>
              <DialogTitle>
                Crear Nuevo Contenido -{&ldquo; &rdquo;}
                {activeTab === &ldquo;resources&rdquo;
                  ? &ldquo;Centro de Recursos&rdquo;
                  : activeTab === &ldquo;institutions&rdquo;
                    ? &ldquo;Directorio de Instituciones&rdquo;
                    : activeTab === &ldquo;contacts&rdquo;
                      ? &ldquo;Red de Contactos&rdquo;
                      : &ldquo;Mentorías&rdquo;}
              </DialogTitle>
            </DialogHeader>

            <div className=&ldquo;space-y-4 p-1&rdquo;>
              {/* Resource Center Form */}
              {activeTab === &ldquo;resources&rdquo; && (
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;title&rdquo;>Título *</Label>
                      <Input
                        id=&ldquo;title&rdquo;
                        value={resourceForm.title}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Título del recurso&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;type&rdquo;>Tipo *</Label>
                      <Select
                        value={resourceForm.type}
                        onValueChange={(value: unknown) =>
                          setResourceForm((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=&ldquo;template&rdquo;>Plantilla</SelectItem>
                          <SelectItem value=&ldquo;guide&rdquo;>Guía</SelectItem>
                          <SelectItem value=&ldquo;video&rdquo;>Video</SelectItem>
                          <SelectItem value=&ldquo;podcast&rdquo;>Podcast</SelectItem>
                          <SelectItem value=&ldquo;tool&rdquo;>Herramienta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;description&rdquo;>Descripción *</Label>
                    <Textarea
                      id=&ldquo;description&rdquo;
                      value={resourceForm.description}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;Descripción detallada del recurso&rdquo;
                      rows={3}
                    />
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;category&rdquo;>Categoría *</Label>
                      <Select
                        value={resourceForm.category}
                        onValueChange={(value) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder=&ldquo;Seleccionar categoría&rdquo; />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.resources.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;fileUrl&rdquo;>URL del Archivo</Label>
                      <Input
                        id=&ldquo;fileUrl&rdquo;
                        value={resourceForm.fileUrl}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            fileUrl: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;https://... o /downloads/...&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;tags&rdquo;>Etiquetas</Label>
                    <Input
                      id=&ldquo;tags&rdquo;
                      value={resourceForm.tags}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;etiqueta1, etiqueta2, etiqueta3&rdquo;
                    />
                  </div>

                  <div className=&ldquo;flex items-center space-x-2&rdquo;>
                    <Checkbox
                      id=&ldquo;featured&rdquo;
                      checked={resourceForm.featured}
                      onCheckedChange={(checked) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor=&ldquo;featured&rdquo;>Recurso destacado</Label>
                  </div>
                </div>
              )}

              {/* Directory of Institutions Form */}
              {activeTab === &ldquo;institutions&rdquo; && (
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;name&rdquo;>Nombre de la Institución *</Label>
                      <Input
                        id=&ldquo;name&rdquo;
                        value={institutionForm.name}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Nombre completo&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;type&rdquo;>Tipo de Institución *</Label>
                      <Select
                        value={institutionForm.type}
                        onValueChange={(value: unknown) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            type: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=&ldquo;municipality&rdquo;>
                            Municipalidad
                          </SelectItem>
                          <SelectItem value=&ldquo;ngo&rdquo;>ONG</SelectItem>
                          <SelectItem value=&ldquo;foundation&rdquo;>Fundación</SelectItem>
                          <SelectItem value=&ldquo;training_center&rdquo;>
                            Centro de Capacitación
                          </SelectItem>
                          <SelectItem value=&ldquo;government&rdquo;>Gobierno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;description&rdquo;>Descripción *</Label>
                    <Textarea
                      id=&ldquo;description&rdquo;
                      value={institutionForm.description}
                      onChange={(e) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;Descripción de la institución y su misión&rdquo;
                      rows={3}
                    />
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;location&rdquo;>Ubicación *</Label>
                      <Input
                        id=&ldquo;location&rdquo;
                        value={institutionForm.location}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Ciudad, País&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;address&rdquo;>Dirección</Label>
                      <Input
                        id=&ldquo;address&rdquo;
                        value={institutionForm.address}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Dirección completa&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;phone&rdquo;>Teléfono</Label>
                      <Input
                        id=&ldquo;phone&rdquo;
                        value={institutionForm.phone}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;+591-X-XXXXXXX&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;email&rdquo;>Email</Label>
                      <Input
                        id=&ldquo;email&rdquo;
                        type=&ldquo;email&rdquo;
                        value={institutionForm.email}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;contacto@institucion.com&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;website&rdquo;>Sitio Web</Label>
                      <Input
                        id=&ldquo;website&rdquo;
                        value={institutionForm.website}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;https://www.institucion.com&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;services&rdquo;>Servicios</Label>
                    <Textarea
                      id=&ldquo;services&rdquo;
                      value={institutionForm.services}
                      onChange={(e) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          services: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;servicio1, servicio2, servicio3&rdquo;
                      rows={2}
                    />
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;focusAreas&rdquo;>Áreas de Enfoque</Label>
                    <Input
                      id=&ldquo;focusAreas&rdquo;
                      value={institutionForm.focusAreas}
                      onChange={(e) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          focusAreas: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;área1, área2, área3&rdquo;
                    />
                  </div>

                  <div className=&ldquo;flex items-center space-x-2&rdquo;>
                    <Checkbox
                      id=&ldquo;institutionFeatured&rdquo;
                      checked={institutionForm.featured}
                      onCheckedChange={(checked) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor=&ldquo;institutionFeatured&rdquo;>
                      Institución destacada
                    </Label>
                  </div>
                </div>
              )}

              {/* Contact Network Form */}
              {activeTab === &ldquo;contacts&rdquo; && (
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;contactName&rdquo;>Nombre Completo *</Label>
                      <Input
                        id=&ldquo;contactName&rdquo;
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Nombre y apellido&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;businessName&rdquo;>Nombre del Negocio</Label>
                      <Input
                        id=&ldquo;businessName&rdquo;
                        value={contactForm.businessName}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            businessName: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Nombre de la empresa/startup&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;contactCategory&rdquo;>Categoría *</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) =>
                          setContactForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder=&ldquo;Seleccionar categoría&rdquo; />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.contacts.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;contactLocation&rdquo;>Ubicación *</Label>
                      <Input
                        id=&ldquo;contactLocation&rdquo;
                        value={contactForm.location}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Ciudad, País&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;bio&rdquo;>Biografía *</Label>
                    <Textarea
                      id=&ldquo;bio&rdquo;
                      value={contactForm.bio}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;Descripción profesional y experiencia&rdquo;
                      rows={3}
                    />
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;skills&rdquo;>Habilidades</Label>
                      <Input
                        id=&ldquo;skills&rdquo;
                        value={contactForm.skills}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            skills: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;habilidad1, habilidad2, habilidad3&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;interests&rdquo;>Intereses</Label>
                      <Input
                        id=&ldquo;interests&rdquo;
                        value={contactForm.interests}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            interests: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;interés1, interés2, interés3&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;lookingFor&rdquo;>Busca</Label>
                      <Input
                        id=&ldquo;lookingFor&rdquo;
                        value={contactForm.lookingFor}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            lookingFor: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;inversionistas, socios, mentores&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;offering&rdquo;>Ofrece</Label>
                      <Input
                        id=&ldquo;offering&rdquo;
                        value={contactForm.offering}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            offering: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;consultoría, desarrollo, marketing&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;flex items-center space-x-2&rdquo;>
                    <Checkbox
                      id=&ldquo;isAvailable&rdquo;
                      checked={contactForm.isAvailable}
                      onCheckedChange={(checked) =>
                        setContactForm((prev) => ({
                          ...prev,
                          isAvailable: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor=&ldquo;isAvailable&rdquo;>
                      Disponible para networking
                    </Label>
                  </div>
                </div>
              )}

              {/* Mentorship Form */}
              {activeTab === &ldquo;mentors&rdquo; && (
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;mentorName&rdquo;>Nombre Completo *</Label>
                      <Input
                        id=&ldquo;mentorName&rdquo;
                        value={mentorForm.name}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Nombre y apellido&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;mentorTitle&rdquo;>Título/Cargo *</Label>
                      <Input
                        id=&ldquo;mentorTitle&rdquo;
                        value={mentorForm.title}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;CEO, Director, Consultor&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;company&rdquo;>Empresa *</Label>
                      <Input
                        id=&ldquo;company&rdquo;
                        value={mentorForm.company}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Nombre de la empresa&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;mentorLocation&rdquo;>Ubicación *</Label>
                      <Input
                        id=&ldquo;mentorLocation&rdquo;
                        value={mentorForm.location}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;Ciudad, País&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;mentorBio&rdquo;>Biografía *</Label>
                    <Textarea
                      id=&ldquo;mentorBio&rdquo;
                      value={mentorForm.bio}
                      onChange={(e) =>
                        setMentorForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;Experiencia profesional y logros&rdquo;
                      rows={3}
                    />
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;expertise&rdquo;>Áreas de Expertise</Label>
                      <Input
                        id=&ldquo;expertise&rdquo;
                        value={mentorForm.expertise}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            expertise: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;tecnología, marketing, finanzas&rdquo;
                      />
                    </div>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;experience&rdquo;>Años de Experiencia</Label>
                      <Input
                        id=&ldquo;experience&rdquo;
                        value={mentorForm.experience}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            experience: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;10+ años&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;priceType&rdquo;>Tipo de Mentoría</Label>
                      <Select
                        value={mentorForm.priceType}
                        onValueChange={(value: unknown) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            priceType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=&ldquo;free&rdquo;>Gratuita</SelectItem>
                          <SelectItem value=&ldquo;paid&rdquo;>Pagada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {mentorForm.priceType === &ldquo;paid&rdquo; && (
                      <div className=&ldquo;space-y-2&rdquo;>
                        <Label htmlFor=&ldquo;priceAmount&rdquo;>Precio (Bs.)</Label>
                        <Input
                          id=&ldquo;priceAmount&rdquo;
                          type=&ldquo;number&rdquo;
                          value={mentorForm.priceAmount}
                          onChange={(e) =>
                            setMentorForm((prev) => ({
                              ...prev,
                              priceAmount: parseFloat(e.target.value) || 0,
                            }))
                          }
                          min=&ldquo;0&rdquo;
                        />
                      </div>
                    )}
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Label htmlFor=&ldquo;languages&rdquo;>Idiomas</Label>
                      <Input
                        id=&ldquo;languages&rdquo;
                        value={mentorForm.languages}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            languages: e.target.value,
                          }))
                        }
                        placeholder=&ldquo;español, inglés&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;availability&rdquo;>Disponibilidad</Label>
                    <Input
                      id=&ldquo;availability&rdquo;
                      value={mentorForm.availability}
                      onChange={(e) =>
                        setMentorForm((prev) => ({
                          ...prev,
                          availability: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;Lunes a Viernes 14:00-18:00&rdquo;
                    />
                  </div>

                  <div className=&ldquo;space-y-2&rdquo;>
                    <Label htmlFor=&ldquo;achievements&rdquo;>Logros</Label>
                    <Input
                      id=&ldquo;achievements&rdquo;
                      value={mentorForm.achievements}
                      onChange={(e) =>
                        setMentorForm((prev) => ({
                          ...prev,
                          achievements: e.target.value,
                        }))
                      }
                      placeholder=&ldquo;logro1, logro2, logro3&rdquo;
                    />
                  </div>
                </div>
              )}

              <div className=&ldquo;flex justify-end space-x-2 pt-4&rdquo;>
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateContent} disabled={loading}>
                  {loading ? &ldquo;Creando...&rdquo; : &ldquo;Crear Contenido&rdquo;}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Recursos
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>24</p>
              </div>
              <FileText className=&ldquo;h-8 w-8 text-blue-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Instituciones
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>12</p>
              </div>
              <Building2 className=&ldquo;h-8 w-8 text-green-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Contactos
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>87</p>
              </div>
              <Users className=&ldquo;h-8 w-8 text-purple-600&rdquo; />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <p className=&ldquo;text-sm font-medium text-muted-foreground&rdquo;>
                  Mentores
                </p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>34</p>
              </div>
              <GraduationCap className=&ldquo;h-8 w-8 text-orange-600&rdquo; />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Contenido por Sección</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className=&ldquo;grid w-full grid-cols-4&rdquo;>
              <TabsTrigger
                value=&ldquo;resources&rdquo;
                className=&ldquo;flex items-center gap-2&rdquo;
              >
                {getTabIcon(&ldquo;resources&rdquo;)}
                Centro de Recursos
              </TabsTrigger>
              
              <TabsTrigger value=&ldquo;contacts&rdquo; className=&ldquo;flex items-center gap-2&rdquo;>
                {getTabIcon(&ldquo;contacts&rdquo;)}
                Red de Contactos
              </TabsTrigger>
              <TabsTrigger value=&ldquo;mentors&rdquo; className=&ldquo;flex items-center gap-2&rdquo;>
                {getTabIcon(&ldquo;mentors&rdquo;)}
                Mentorías
              </TabsTrigger>
            </TabsList>

            <TabsContent value=&ldquo;resources&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>Centro de Recursos</h3>
                <Button
                  onClick={() => {
                    setActiveTab(&ldquo;resources&rdquo;);
                    setShowCreateDialog(true);
                  }}
                  size=&ldquo;sm&rdquo;
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Nuevo Recurso
                </Button>
              </div>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Gestiona plantillas, guías, videos, podcasts y herramientas para
                emprendedores
              </p>

              {/* Search and filters would go here */}
              <div className=&ldquo;flex gap-4&rdquo;>
                <div className=&ldquo;relative flex-1&rdquo;>
                  <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground&rdquo; />
                  <Input placeholder=&ldquo;Buscar recursos...&rdquo; className=&ldquo;pl-10&rdquo; />
                </div>
                <Select defaultValue=&ldquo;all&rdquo;>
                  <SelectTrigger className=&ldquo;w-[150px]&rdquo;>
                    <SelectValue placeholder=&ldquo;Tipo&rdquo; />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                    <SelectItem value=&ldquo;template&rdquo;>Plantillas</SelectItem>
                    <SelectItem value=&ldquo;guide&rdquo;>Guías</SelectItem>
                    <SelectItem value=&ldquo;video&rdquo;>Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className=&ldquo;text-center py-8 text-muted-foreground&rdquo;>
                Los recursos aparecen aquí. Usa los filtros para navegar o crear
                nuevos recursos.
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;institutions&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>
                  Directorio de Instituciones
                </h3>
                <Button
                  onClick={() => {
                    setActiveTab(&ldquo;institutions&rdquo;);
                    setShowCreateDialog(true);
                  }}
                  size=&ldquo;sm&rdquo;
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Nueva Institución
                </Button>
              </div>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Gestiona el directorio de municipalidades, ONGs, fundaciones y
                centros de capacitación
              </p>

              <div className=&ldquo;text-center py-8 text-muted-foreground&rdquo;>
                Las instituciones aparecen aquí. Gestiona organizaciones que
                aparecen en el directorio.
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;contacts&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>Red de Contactos</h3>
                <Button
                  onClick={() => {
                    setActiveTab(&ldquo;contacts&rdquo;);
                    setShowCreateDialog(true);
                  }}
                  size=&ldquo;sm&rdquo;
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Nuevo Contacto
                </Button>
              </div>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Gestiona emprendedores y profesionales disponibles para
                networking
              </p>

              <div className=&ldquo;text-center py-8 text-muted-foreground&rdquo;>
                Los contactos de networking aparecen aquí. Agrega emprendedores
                para la red.
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;mentors&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <h3 className=&ldquo;text-lg font-semibold&rdquo;>Mentorías</h3>
                <Button
                  onClick={() => {
                    setActiveTab(&ldquo;mentors&rdquo;);
                    setShowCreateDialog(true);
                  }}
                  size=&ldquo;sm&rdquo;
                >
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Nuevo Mentor
                </Button>
              </div>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Gestiona mentores y programas de mentoría disponibles para
                jóvenes
              </p>

              <div className=&ldquo;text-center py-8 text-muted-foreground&rdquo;>
                Los mentores aparecen aquí. Agrega mentores y programas de
                mentoría.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
