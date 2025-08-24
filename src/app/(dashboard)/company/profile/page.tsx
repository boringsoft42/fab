"use client";

import type React from "react";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Edit,
  Save,
  X,
  Camera,
  TrendingUp,
  Target,
  Award,
  DollarSign,
  ExternalLink,
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Download,
  Play,
  Headphones,
  Calculator,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
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
import MapMarker from "@/components/MapMarker";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfileApi";

interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  industry: string;
  size: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  mission: string;
  vision: string;
  values: string[];
  metrics: {
    employees: number;
    revenue: number;
    growth: number;
    projects: number;
  };
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  settings: {
    publicProfile: boolean;
    showMetrics: boolean;
    allowMessages: boolean;
    emailNotifications: boolean;
  };
}

interface CompanyResource {
  id: string;
  title: string;
  description: string;
  type:
    | "template"
    | "guide"
    | "video"
    | "podcast"
    | "tool"
    | "case_study"
    | "whitepaper";
  category: string;
  fileUrl: string;
  thumbnail: string;
  tags: string[];
  status: "published" | "draft";
  featured: boolean;
  downloads: number;
  views: number;
  createdAt: Date;
  companyId: string;
}

export default function CompanyProfilePage() {
  const { data: profile, loading, error } = useProfile("current");

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile | null>(
    null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Resources state
  const [resources, setResources] = useState<CompanyResource[]>([]);
  const [showCreateResourceDialog, setShowCreateResourceDialog] =
    useState(false);
  const [resourceForm, setResourceForm] = useState<CompanyResource>({
    id: "",
    title: "",
    description: "",
    type: "template",
    category: "Planificación",
    fileUrl: "",
    thumbnail: "",
    tags: [],
    status: "draft",
    featured: false,
    downloads: 0,
    views: 0,
    createdAt: new Date(),
    companyId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Update editedProfile when profile data is loaded
  React.useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      // Simulate API call
      console.log("Saving profile:", editedProfile);
      // setProfile(editedProfile); // This function doesn't exist, removing
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile(profile);
    }
    setIsEditing(false);
    setLogoFile(null);
    setCoverFile(null);
  };

  // Resource management functions
  const handleCreateResource = async () => {
    try {
      // Simulate API call
      const newResource = {
        ...resourceForm,
        id: Date.now().toString(),
        companyId: profile?.id || "",
        createdAt: new Date(),
      };
      setResources([...resources, newResource]);
      setShowCreateResourceDialog(false);
      resetResourceForm();
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  const handleDeleteResource = (resourceId: string) => {
    setResources(resources.filter((r) => r.id !== resourceId));
  };

  const resetResourceForm = () => {
    setResourceForm({
      id: "",
      title: "",
      description: "",
      type: "template",
      category: "Planificación",
      fileUrl: "",
      thumbnail: "",
      tags: [],
      status: "draft",
      featured: false,
      downloads: 0,
      views: 0,
      createdAt: new Date(),
      companyId: "",
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "template":
        return <FileText className="h-4 w-4" />;
      case "guide":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      case "podcast":
        return <Headphones className="h-4 w-4" />;
      case "tool":
        return <Calculator className="h-4 w-4" />;
      case "case_study":
        return <FileText className="h-4 w-4" />;
      case "whitepaper":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const resourceCategories = [
    "Planificación",
    "Validación",
    "Finanzas",
    "Marketing",
    "Legal",
    "Tecnología",
    "Operaciones",
    "Recursos Humanos",
    "Ventas",
    "Estrategia",
  ];

  const resourceTypes = [
    { value: "template", label: "Plantilla" },
    { value: "guide", label: "Guía" },
    { value: "video", label: "Video" },
    { value: "podcast", label: "Podcast" },
    { value: "tool", label: "Herramienta" },
    { value: "case_study", label: "Caso de Estudio" },
    { value: "whitepaper", label: "White Paper" },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editedProfile) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedProfile({ ...editedProfile, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editedProfile) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedProfile({
          ...editedProfile,
          coverImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading state
  if (loading || !profile || !editedProfile) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Perfil de la Empresa</h1>
            <p className="text-muted-foreground">
              Gestiona la información y configuración de tu empresa
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Perfil de la Empresa</h1>
            <p className="text-muted-foreground">
              Gestiona la información y configuración de tu empresa
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-red-600">
              Error al cargar el perfil: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Perfil de la Empresa</h1>
          <p className="text-muted-foreground">
            Gestiona la información y configuración de tu empresa
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={editedProfile?.coverImage || "/placeholder.svg"}
                  alt="Portada de la empresa"
                  fill
                  className="object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg">
                        <Camera className="w-4 h-4" />
                        Cambiar Portada
                      </div>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage
                        src={editedProfile?.logo || "/placeholder.svg"}
                        alt={editedProfile?.name || "Empresa"}
                      />
                      <AvatarFallback>
                        <Building2 className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Label
                        htmlFor="logo-upload"
                        className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </Label>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <Input
                        value={editedProfile?.name || ""}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile!,
                            name: e.target.value,
                          })
                        }
                        className="text-2xl font-bold"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">
                        {profile?.name || "Empresa"}
                      </h2>
                    )}
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {profile?.industry || "Sector"}
                      </Badge>
                      <Badge variant="outline">
                        {profile?.size || "Tamaño"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Descripción</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.description}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground mt-1">
                        {profile.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Sector</Label>
                      {isEditing ? (
                        <Select
                          value={editedProfile.industry}
                          onValueChange={(value) =>
                            setEditedProfile({
                              ...editedProfile,
                              industry: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tecnología">
                              Tecnología
                            </SelectItem>
                            <SelectItem value="Finanzas">Finanzas</SelectItem>
                            <SelectItem value="Salud">Salud</SelectItem>
                            <SelectItem value="Educación">Educación</SelectItem>
                            <SelectItem value="Manufactura">
                              Manufactura
                            </SelectItem>
                            <SelectItem value="Servicios">Servicios</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profile.industry}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Año de Fundación</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.founded}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              founded: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {profile.founded}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedProfile.website}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            website: e.target.value,
                          })
                        }
                        placeholder="https://..."
                      />
                    ) : (
                      <a
                        href={profile.website}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedProfile.email}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            email: e.target.value,
                          })
                        }
                        type="email"
                      />
                    ) : (
                      <span className="text-sm">{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedProfile.phone}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <span className="text-sm">{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {!isEditing ? (
                      <MapMarker
                        name={profile.name}
                        position={[-16.5, -68.15]} // Coordenadas de La Paz
                      />
                    ) : (
                      <div className="space-y-2">
                        <Input
                          value={editedProfile.address}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: e.target.value,
                            })
                          }
                          placeholder="Dirección"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={editedProfile.city}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                city: e.target.value,
                              })
                            }
                            placeholder="Ciudad"
                          />
                          <Input
                            value={editedProfile.country}
                            onChange={(e) =>
                              setEditedProfile({
                                ...editedProfile,
                                country: e.target.value,
                              })
                            }
                            placeholder="País"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.mission}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        mission: e.target.value,
                      })
                    }
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.mission}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.vision}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        vision: e.target.value,
                      })
                    }
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.vision}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Valores Corporativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.values.map((value, index) => (
                  <Badge key={index} variant="outline">
                    {value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                Conecta tus perfiles de redes sociales para mayor visibilidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={
                      isEditing
                        ? editedProfile.socialMedia.linkedin
                        : profile.socialMedia.linkedin
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: {
                          ...editedProfile.socialMedia,
                          linkedin: e.target.value,
                        },
                      })
                    }
                    placeholder="https://linkedin.com/company/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={
                      isEditing
                        ? editedProfile.socialMedia.twitter
                        : profile.socialMedia.twitter
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: {
                          ...editedProfile.socialMedia,
                          twitter: e.target.value,
                        },
                      })
                    }
                    placeholder="https://twitter.com/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={
                      isEditing
                        ? editedProfile.socialMedia.facebook
                        : profile.socialMedia.facebook
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: {
                          ...editedProfile.socialMedia,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="https://facebook.com/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Resources Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Centro de Recursos</h3>
              <p className="text-muted-foreground">
                Comparte plantillas, guías, videos y herramientas con la
                comunidad
              </p>
            </div>
            <Dialog
              open={showCreateResourceDialog}
              onOpenChange={setShowCreateResourceDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Recurso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Recurso</DialogTitle>
                </DialogHeader>

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
                        onValueChange={(value: any) =>
                          setResourceForm((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                          {resourceCategories.map((category) => (
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
                      value={resourceForm.tags.join(", ")}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
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

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateResourceDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateResource}>
                      Crear Recurso
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar recursos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <Card
                  key={resource.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <Badge variant="outline" className="text-xs">
                          {
                            resourceTypes.find((t) => t.value === resource.type)
                              ?.label
                          }
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>{resource.downloads} descargas</span>
                        <span>{resource.views} vistas</span>
                      </div>
                      {resource.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Destacado
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay recursos aún</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || typeFilter !== "all"
                  ? "No se encontraron recursos con los filtros aplicados"
                  : "Comienza creando tu primer recurso para compartir con la comunidad"}
              </p>
              {!searchTerm && typeFilter === "all" && (
                <Button onClick={() => setShowCreateResourceDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Recurso
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Empleados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile.metrics.employees}
                </div>
                <p className="text-xs text-muted-foreground">Equipo actual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Anuales
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Bs. {profile.metrics.revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Año fiscal 2023</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Crecimiento
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +{profile.metrics.growth}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Vs. año anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {profile.metrics.projects}
                </div>
                <p className="text-xs text-muted-foreground">Completados</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Métricas</CardTitle>
              <CardDescription>
                Controla qué métricas son visibles en tu perfil público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mostrar métricas públicamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Las métricas serán visibles para otros usuarios de la
                    plataforma
                  </p>
                </div>
                <Switch
                  checked={editedProfile.settings.showMetrics}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: {
                        ...editedProfile.settings,
                        showMetrics: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
