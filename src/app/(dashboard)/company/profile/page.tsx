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
import MapMarker from "@/components/MapMarker";

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

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>({
    id: "company-1",
    name: "Cemse Innovación",
    description:
      "Empresa líder en desarrollo de soluciones tecnológicas innovadoras para el sector empresarial boliviano. Nos especializamos en transformación digital y consultoría estratégica.",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=800",
    industry: "Tecnología",
    size: "51-200 empleados",
    founded: "2018",
    website: "https://cemse.com.bo",
    email: "contacto@cemse.com.bo",
    phone: "+591 2 2345678",
    address: "Av. Arce 2345, Edificio Torre Empresarial, Piso 12",
    city: "La Paz",
    country: "Bolivia",
    mission:
      "Impulsar la transformación digital de las empresas bolivianas mediante soluciones tecnológicas innovadoras y consultoría especializada.",
    vision:
      "Ser la empresa de tecnología más reconocida de Bolivia, liderando la innovación y el desarrollo empresarial en la región.",
    values: [
      "Innovación",
      "Excelencia",
      "Integridad",
      "Colaboración",
      "Sostenibilidad",
    ],
    metrics: {
      employees: 127,
      revenue: 2500000,
      growth: 35,
      projects: 89,
    },
    socialMedia: {
      linkedin: "https://linkedin.com/company/cemse",
      twitter: "https://twitter.com/cemse_bo",
      facebook: "https://facebook.com/cemse.bolivia",
    },
    settings: {
      publicProfile: true,
      showMetrics: false,
      allowMessages: true,
      emailNotifications: true,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile>(profile);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleSave = async () => {
    try {
      // Simulate API call
      console.log("Saving profile:", editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setLogoFile(null);
    setCoverFile(null);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    if (file) {
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="general">Información General</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={editedProfile.coverImage || "/placeholder.svg"}
                  alt="Portada de la empresa"
                  className="w-full h-48 object-cover rounded-t-lg"
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
                        src={editedProfile.logo || "/placeholder.svg"}
                        alt={editedProfile.name}
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
                        value={editedProfile.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            name: e.target.value,
                          })
                        }
                        className="text-2xl font-bold"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                    )}
                    <div className="flex gap-2">
                      <Badge variant="secondary">{profile.industry}</Badge>
                      <Badge variant="outline">{profile.size}</Badge>
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
          {/* <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Conecta tus perfiles de redes sociales para mayor visibilidad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.linkedin : profile.socialMedia.linkedin}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/company/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.twitter : profile.socialMedia.twitter}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, twitter: e.target.value },
                      })
                    }
                    placeholder="https://twitter.com/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.facebook : profile.socialMedia.facebook}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </TabsContent>

        {/* <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Conecta tus perfiles de redes sociales para mayor visibilidad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.linkedin : profile.socialMedia.linkedin}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/company/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.twitter : profile.socialMedia.twitter}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, twitter: e.target.value },
                      })
                    }
                    placeholder="https://twitter.com/tu-empresa"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.facebook : profile.socialMedia.facebook}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, facebook: e.target.value },
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

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Perfil público</Label>
                  <p className="text-sm text-muted-foreground">Tu perfil será visible para otros usuarios</p>
                </div>
                <Switch
                  checked={editedProfile.settings.publicProfile}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: { ...editedProfile.settings, publicProfile: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Permitir mensajes</Label>
                  <p className="text-sm text-muted-foreground">Otros usuarios pueden enviarte mensajes directos</p>
                </div>
                <Switch
                  checked={editedProfile.settings.allowMessages}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: { ...editedProfile.settings, allowMessages: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por email</Label>
                  <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por correo</p>
                </div>
                <Switch
                  checked={editedProfile.settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: { ...editedProfile.settings, emailNotifications: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Plan y Facturación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Plan Actual</Label>
                    <p className="text-sm text-muted-foreground">Plan Empresarial - Renovación automática</p>
                  </div>
                  <Badge>Activo</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Gestionar Suscripción
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
