"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-react";

// Types for different content sections
interface Resource {
  id: string;
  title: string;
  description: string;
  type: "template" | "guide" | "video" | "podcast" | "tool";
  category: string;
  fileUrl: string;
  thumbnail: string;
  tags: string[];
  status: "published" | "draft";
  featured: boolean;
  createdAt: Date;
}

interface Institution {
  id: string;
  name: string;
  type:
    | "municipality"
    | "ngo"
    | "foundation"
    | "training_center"
    | "government";
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
  status: "active" | "inactive";
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
  status: "active" | "inactive";
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
  price: { type: "free" | "paid"; amount?: number };
  availability: string;
  achievements: string[];
  isVerified: boolean;
  status: "active" | "inactive";
  createdAt: Date;
}

export default function YouthContentManagementPage() {
  const [activeTab, setActiveTab] = useState("resources");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for different content types
  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    type: "template" as const,
    category: "",
    fileUrl: "",
    thumbnail: "",
    tags: "",
    featured: false,
    status: "draft" as const,
  });

  const [institutionForm, setInstitutionForm] = useState({
    name: "",
    type: "municipality" as const,
    description: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: "",
    services: "",
    focusAreas: "",
    programs: "",
    featured: false,
    status: "active" as const,
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    businessName: "",
    category: "",
    location: "",
    bio: "",
    skills: "",
    interests: "",
    avatar: "",
    lookingFor: "",
    offering: "",
    experience: "",
    isAvailable: true,
    status: "active" as const,
  });

  const [mentorForm, setMentorForm] = useState({
    name: "",
    title: "",
    company: "",
    location: "",
    bio: "",
    expertise: "",
    experience: "",
    avatar: "",
    languages: "",
    priceType: "free" as const,
    priceAmount: 0,
    availability: "",
    achievements: "",
    status: "active" as const,
  });

  const handleCreateContent = async () => {
    try {
      setLoading(true);
      let endpoint = "";
      let data = {};

      switch (activeTab) {
        case "resources":
          endpoint = "/api/admin/entrepreneurship/resources";
          data = {
            ...resourceForm,
            tags: resourceForm.tags.split(",").map((tag) => tag.trim()),
          };
          break;
        case "institutions":
          endpoint = "/api/admin/institutions";
          data = {
            ...institutionForm,
            services: institutionForm.services.split(",").map((s) => s.trim()),
            focusAreas: institutionForm.focusAreas
              .split(",")
              .map((f) => f.trim()),
            programs: institutionForm.programs.split(",").map((p) => p.trim()),
          };
          break;
        case "contacts":
          endpoint = "/api/admin/youth-content/contacts";
          data = {
            ...contactForm,
            skills: contactForm.skills.split(",").map((s) => s.trim()),
            interests: contactForm.interests.split(",").map((i) => i.trim()),
            lookingFor: contactForm.lookingFor.split(",").map((l) => l.trim()),
            offering: contactForm.offering.split(",").map((o) => o.trim()),
          };
          break;
        case "mentors":
          endpoint = "/api/admin/youth-content/mentors";
          data = {
            ...mentorForm,
            expertise: mentorForm.expertise.split(",").map((e) => e.trim()),
            languages: mentorForm.languages.split(",").map((l) => l.trim()),
            achievements: mentorForm.achievements
              .split(",")
              .map((a) => a.trim()),
            price: {
              type: mentorForm.priceType,
              amount:
                mentorForm.priceType === "paid"
                  ? mentorForm.priceAmount
                  : undefined,
            },
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        resetForms();
        // Show success message or refresh data
      }
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setResourceForm({
      title: "",
      description: "",
      type: "template",
      category: "",
      fileUrl: "",
      thumbnail: "",
      tags: "",
      featured: false,
      status: "draft",
    });
    setInstitutionForm({
      name: "",
      type: "municipality",
      description: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      logo: "",
      services: "",
      focusAreas: "",
      programs: "",
      featured: false,
      status: "active",
    });
    setContactForm({
      name: "",
      businessName: "",
      category: "",
      location: "",
      bio: "",
      skills: "",
      interests: "",
      avatar: "",
      lookingFor: "",
      offering: "",
      experience: "",
      isAvailable: true,
      status: "active",
    });
    setMentorForm({
      name: "",
      title: "",
      company: "",
      location: "",
      bio: "",
      expertise: "",
      experience: "",
      avatar: "",
      languages: "",
      priceType: "free",
      priceAmount: 0,
      availability: "",
      achievements: "",
      status: "active",
    });
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "resources":
        return <FileText className="h-4 w-4" />;
      case "institutions":
        return <Building2 className="h-4 w-4" />;
      case "contacts":
        return <Users className="h-4 w-4" />;
      case "mentors":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const categories = {
    resources: [
      "Planificación",
      "Validación",
      "Finanzas",
      "Marketing",
      "Legal",
      "Tecnología",
    ],
    contacts: [
      "Tecnología",
      "Marketing",
      "Finanzas",
      "E-commerce",
      "Agro",
      "Salud",
      "Educación",
    ],
    mentors: [
      "Tecnología",
      "Marketing Digital",
      "Finanzas",
      "Liderazgo",
      "Startups",
      "Negocios",
    ],
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Gestión de Contenido para Jóvenes
          </h1>
          <p className="text-muted-foreground">
            Administra todo el contenido que aparece en el perfil de jóvenes
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Contenido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Crear Nuevo Contenido -{" "}
                {activeTab === "resources"
                  ? "Centro de Recursos"
                  : activeTab === "institutions"
                    ? "Directorio de Instituciones"
                    : activeTab === "contacts"
                      ? "Red de Contactos"
                      : "Mentorías"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 p-1">
              {/* Resource Center Form */}
              {activeTab === "resources" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={resourceForm.title}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Título del recurso"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo *</Label>
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
                          <SelectItem value="template">Plantilla</SelectItem>
                          <SelectItem value="guide">Guía</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="podcast">Podcast</SelectItem>
                          <SelectItem value="tool">Herramienta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={resourceForm.description}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descripción detallada del recurso"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría *</Label>
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
                          <SelectValue placeholder="Seleccionar categoría" />
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
                    <div className="space-y-2">
                      <Label htmlFor="fileUrl">URL del Archivo</Label>
                      <Input
                        id="fileUrl"
                        value={resourceForm.fileUrl}
                        onChange={(e) =>
                          setResourceForm((prev) => ({
                            ...prev,
                            fileUrl: e.target.value,
                          }))
                        }
                        placeholder="https://... o /downloads/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Etiquetas</Label>
                    <Input
                      id="tags"
                      value={resourceForm.tags}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      placeholder="etiqueta1, etiqueta2, etiqueta3"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={resourceForm.featured}
                      onCheckedChange={(checked) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="featured">Recurso destacado</Label>
                  </div>
                </div>
              )}

              {/* Directory of Institutions Form */}
              {activeTab === "institutions" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Institución *</Label>
                      <Input
                        id="name"
                        value={institutionForm.name}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Institución *</Label>
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
                          <SelectItem value="municipality">
                            Municipalidad
                          </SelectItem>
                          <SelectItem value="ngo">ONG</SelectItem>
                          <SelectItem value="foundation">Fundación</SelectItem>
                          <SelectItem value="training_center">
                            Centro de Capacitación
                          </SelectItem>
                          <SelectItem value="government">Gobierno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={institutionForm.description}
                      onChange={(e) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descripción de la institución y su misión"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación *</Label>
                      <Input
                        id="location"
                        value={institutionForm.location}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Ciudad, País"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={institutionForm.address}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Dirección completa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={institutionForm.phone}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+591-X-XXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={institutionForm.email}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="contacto@institucion.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={institutionForm.website}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        placeholder="https://www.institucion.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="services">Servicios</Label>
                    <Textarea
                      id="services"
                      value={institutionForm.services}
                      onChange={(e) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          services: e.target.value,
                        }))
                      }
                      placeholder="servicio1, servicio2, servicio3"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="focusAreas">Áreas de Enfoque</Label>
                    <Input
                      id="focusAreas"
                      value={institutionForm.focusAreas}
                      onChange={(e) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          focusAreas: e.target.value,
                        }))
                      }
                      placeholder="área1, área2, área3"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="institutionFeatured"
                      checked={institutionForm.featured}
                      onCheckedChange={(checked) =>
                        setInstitutionForm((prev) => ({
                          ...prev,
                          featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="institutionFeatured">
                      Institución destacada
                    </Label>
                  </div>
                </div>
              )}

              {/* Contact Network Form */}
              {activeTab === "contacts" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Nombre Completo *</Label>
                      <Input
                        id="contactName"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nombre y apellido"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nombre del Negocio</Label>
                      <Input
                        id="businessName"
                        value={contactForm.businessName}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            businessName: e.target.value,
                          }))
                        }
                        placeholder="Nombre de la empresa/startup"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactCategory">Categoría *</Label>
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
                          <SelectValue placeholder="Seleccionar categoría" />
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
                    <div className="space-y-2">
                      <Label htmlFor="contactLocation">Ubicación *</Label>
                      <Input
                        id="contactLocation"
                        value={contactForm.location}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Ciudad, País"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía *</Label>
                    <Textarea
                      id="bio"
                      value={contactForm.bio}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Descripción profesional y experiencia"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Habilidades</Label>
                      <Input
                        id="skills"
                        value={contactForm.skills}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            skills: e.target.value,
                          }))
                        }
                        placeholder="habilidad1, habilidad2, habilidad3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interests">Intereses</Label>
                      <Input
                        id="interests"
                        value={contactForm.interests}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            interests: e.target.value,
                          }))
                        }
                        placeholder="interés1, interés2, interés3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lookingFor">Busca</Label>
                      <Input
                        id="lookingFor"
                        value={contactForm.lookingFor}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            lookingFor: e.target.value,
                          }))
                        }
                        placeholder="inversionistas, socios, mentores"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offering">Ofrece</Label>
                      <Input
                        id="offering"
                        value={contactForm.offering}
                        onChange={(e) =>
                          setContactForm((prev) => ({
                            ...prev,
                            offering: e.target.value,
                          }))
                        }
                        placeholder="consultoría, desarrollo, marketing"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAvailable"
                      checked={contactForm.isAvailable}
                      onCheckedChange={(checked) =>
                        setContactForm((prev) => ({
                          ...prev,
                          isAvailable: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="isAvailable">
                      Disponible para networking
                    </Label>
                  </div>
                </div>
              )}

              {/* Mentorship Form */}
              {activeTab === "mentors" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mentorName">Nombre Completo *</Label>
                      <Input
                        id="mentorName"
                        value={mentorForm.name}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nombre y apellido"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mentorTitle">Título/Cargo *</Label>
                      <Input
                        id="mentorTitle"
                        value={mentorForm.title}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="CEO, Director, Consultor"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa *</Label>
                      <Input
                        id="company"
                        value={mentorForm.company}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mentorLocation">Ubicación *</Label>
                      <Input
                        id="mentorLocation"
                        value={mentorForm.location}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Ciudad, País"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentorBio">Biografía *</Label>
                    <Textarea
                      id="mentorBio"
                      value={mentorForm.bio}
                      onChange={(e) =>
                        setMentorForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Experiencia profesional y logros"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expertise">Áreas de Expertise</Label>
                      <Input
                        id="expertise"
                        value={mentorForm.expertise}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            expertise: e.target.value,
                          }))
                        }
                        placeholder="tecnología, marketing, finanzas"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Años de Experiencia</Label>
                      <Input
                        id="experience"
                        value={mentorForm.experience}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            experience: e.target.value,
                          }))
                        }
                        placeholder="10+ años"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceType">Tipo de Mentoría</Label>
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
                          <SelectItem value="free">Gratuita</SelectItem>
                          <SelectItem value="paid">Pagada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {mentorForm.priceType === "paid" && (
                      <div className="space-y-2">
                        <Label htmlFor="priceAmount">Precio (Bs.)</Label>
                        <Input
                          id="priceAmount"
                          type="number"
                          value={mentorForm.priceAmount}
                          onChange={(e) =>
                            setMentorForm((prev) => ({
                              ...prev,
                              priceAmount: parseFloat(e.target.value) || 0,
                            }))
                          }
                          min="0"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="languages">Idiomas</Label>
                      <Input
                        id="languages"
                        value={mentorForm.languages}
                        onChange={(e) =>
                          setMentorForm((prev) => ({
                            ...prev,
                            languages: e.target.value,
                          }))
                        }
                        placeholder="español, inglés"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Disponibilidad</Label>
                    <Input
                      id="availability"
                      value={mentorForm.availability}
                      onChange={(e) =>
                        setMentorForm((prev) => ({
                          ...prev,
                          availability: e.target.value,
                        }))
                      }
                      placeholder="Lunes a Viernes 14:00-18:00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="achievements">Logros</Label>
                    <Input
                      id="achievements"
                      value={mentorForm.achievements}
                      onChange={(e) =>
                        setMentorForm((prev) => ({
                          ...prev,
                          achievements: e.target.value,
                        }))
                      }
                      placeholder="logro1, logro2, logro3"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateContent} disabled={loading}>
                  {loading ? "Creando..." : "Crear Contenido"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Recursos
                </p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Instituciones
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contactos
                </p>
                <p className="text-2xl font-bold">87</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mentores
                </p>
                <p className="text-2xl font-bold">34</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-600" />
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="resources"
                className="flex items-center gap-2"
              >
                {getTabIcon("resources")}
                Centro de Recursos
              </TabsTrigger>
              
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                {getTabIcon("contacts")}
                Red de Contactos
              </TabsTrigger>
              <TabsTrigger value="mentors" className="flex items-center gap-2">
                {getTabIcon("mentors")}
                Mentorías
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Centro de Recursos</h3>
                <Button
                  onClick={() => {
                    setActiveTab("resources");
                    setShowCreateDialog(true);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Recurso
                </Button>
              </div>
              <p className="text-muted-foreground">
                Gestiona plantillas, guías, videos, podcasts y herramientas para
                emprendedores
              </p>

              {/* Search and filters would go here */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar recursos..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="template">Plantillas</SelectItem>
                    <SelectItem value="guide">Guías</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center py-8 text-muted-foreground">
                Los recursos aparecen aquí. Usa los filtros para navegar o crear
                nuevos recursos.
              </div>
            </TabsContent>

            <TabsContent value="institutions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Directorio de Instituciones
                </h3>
                <Button
                  onClick={() => {
                    setActiveTab("institutions");
                    setShowCreateDialog(true);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Institución
                </Button>
              </div>
              <p className="text-muted-foreground">
                Gestiona el directorio de municipalidades, ONGs, fundaciones y
                centros de capacitación
              </p>

              <div className="text-center py-8 text-muted-foreground">
                Las instituciones aparecen aquí. Gestiona organizaciones que
                aparecen en el directorio.
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Red de Contactos</h3>
                <Button
                  onClick={() => {
                    setActiveTab("contacts");
                    setShowCreateDialog(true);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Contacto
                </Button>
              </div>
              <p className="text-muted-foreground">
                Gestiona emprendedores y profesionales disponibles para
                networking
              </p>

              <div className="text-center py-8 text-muted-foreground">
                Los contactos de networking aparecen aquí. Agrega emprendedores
                para la red.
              </div>
            </TabsContent>

            <TabsContent value="mentors" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mentorías</h3>
                <Button
                  onClick={() => {
                    setActiveTab("mentors");
                    setShowCreateDialog(true);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Mentor
                </Button>
              </div>
              <p className="text-muted-foreground">
                Gestiona mentores y programas de mentoría disponibles para
                jóvenes
              </p>

              <div className="text-center py-8 text-muted-foreground">
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
