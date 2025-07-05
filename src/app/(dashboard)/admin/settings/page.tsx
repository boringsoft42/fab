&ldquo;use client&rdquo;;

import type React from &ldquo;react&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  TrendingUp,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Award,
  Calendar,
  Briefcase,
  Home,
} from &ldquo;lucide-react&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Switch } from &ldquo;@/components/ui/switch&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;

interface MunicipalProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  department: string;
  province: string;
  region: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  mayor: {
    name: string;
    photo: string;
    party: string;
    startDate: string;
    endDate: string;
    email: string;
    phone: string;
  };
  demographics: {
    population: number;
    area: number;
    density: number;
    urbanPopulation: number;
    ruralPopulation: number;
  };
  economy: {
    budget: number;
    mainActivities: string[];
    unemployment: number;
    poverty: number;
  };
  services: {
    education: number;
    health: number;
    water: number;
    electricity: number;
    internet: number;
  };
  projects: Array<{
    name: string;
    description: string;
    budget: number;
    status: &ldquo;PLANNING&rdquo; | &ldquo;IN_PROGRESS&rdquo; | &ldquo;COMPLETED&rdquo;;
    progress: number;
  }>;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  settings: {
    publicProfile: boolean;
    showBudget: boolean;
    allowMessages: boolean;
    emailNotifications: boolean;
  };
}

export default function MunicipalProfilePage() {
  const [profile, setProfile] = useState<MunicipalProfile>({
    id: &ldquo;municipality-1&rdquo;,
    name: &ldquo;Municipio de La Paz&rdquo;,
    description:
      &ldquo;Sede de gobierno de Bolivia, centro político, administrativo y cultural del país. Comprometidos con el desarrollo sostenible y la mejora de la calidad de vida de nuestros ciudadanos.&rdquo;,
    logo: &ldquo;/placeholder.svg?height=100&width=100&rdquo;,
    coverImage: &ldquo;/placeholder.svg?height=300&width=800&rdquo;,
    department: &ldquo;La Paz&rdquo;,
    province: &ldquo;Pedro Domingo Murillo&rdquo;,
    region: &ldquo;Altiplano&rdquo;,
    founded: &ldquo;1548&rdquo;,
    website: &ldquo;https://www.lapaz.bo&rdquo;,
    email: &ldquo;contacto@lapaz.bo&rdquo;,
    phone: &ldquo;+591 2 2650000&rdquo;,
    address: &ldquo;Plaza Murillo s/n, La Paz, Bolivia&rdquo;,
    mayor: {
      name: &ldquo;Iván Arias Durán&rdquo;,
      photo: &ldquo;/placeholder.svg?height=120&width=120&rdquo;,
      party: &ldquo;Partido Demócrata Cristiano&rdquo;,
      startDate: &ldquo;2021-05-03&rdquo;,
      endDate: &ldquo;2026-05-03&rdquo;,
      email: &ldquo;alcalde@lapaz.bo&rdquo;,
      phone: &ldquo;+591 2 2650001&rdquo;,
    },
    demographics: {
      population: 835361,
      area: 3020,
      density: 276,
      urbanPopulation: 95,
      ruralPopulation: 5,
    },
    economy: {
      budget: 2800000000,
      mainActivities: [
        &ldquo;Servicios&rdquo;,
        &ldquo;Comercio&rdquo;,
        &ldquo;Industria&rdquo;,
        &ldquo;Turismo&rdquo;,
        &ldquo;Administración Pública&rdquo;,
      ],
      unemployment: 4.2,
      poverty: 18.5,
    },
    services: {
      education: 92,
      health: 88,
      water: 95,
      electricity: 98,
      internet: 75,
    },
    projects: [
      {
        name: &ldquo;Mi Teleférico - Línea Dorada&rdquo;,
        description: &ldquo;Ampliación del sistema de transporte por cable&rdquo;,
        budget: 450000000,
        status: &ldquo;IN_PROGRESS&rdquo;,
        progress: 65,
      },
      {
        name: &ldquo;Parque Urbano Central&rdquo;,
        description: &ldquo;Creación de espacios verdes en el centro de la ciudad&rdquo;,
        budget: 85000000,
        status: &ldquo;PLANNING&rdquo;,
        progress: 15,
      },
      {
        name: &ldquo;Modernización del Mercado Rodríguez&rdquo;,
        description: &ldquo;Renovación integral del mercado tradicional&rdquo;,
        budget: 120000000,
        status: &ldquo;COMPLETED&rdquo;,
        progress: 100,
      },
      {
        name: &ldquo;Red de Ciclovías Metropolitanas&rdquo;,
        description: &ldquo;Implementación de rutas seguras para ciclistas&rdquo;,
        budget: 35000000,
        status: &ldquo;IN_PROGRESS&rdquo;,
        progress: 40,
      },
    ],
    socialMedia: {
      facebook: &ldquo;https://facebook.com/AlcaldiaLaPaz&rdquo;,
      twitter: &ldquo;https://twitter.com/AlcaldiaLaPaz&rdquo;,
      instagram: &ldquo;https://instagram.com/alcaldialapaz&rdquo;,
      youtube: &ldquo;https://youtube.com/AlcaldiaLaPazOficial&rdquo;,
    },
    settings: {
      publicProfile: true,
      showBudget: true,
      allowMessages: true,
      emailNotifications: true,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<MunicipalProfile>(profile);

  const handleSave = async () => {
    try {
      console.log(&ldquo;Saving municipal profile:&rdquo;, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error(&ldquo;Error saving profile:&rdquo;, error);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setLogoFile(null);
    setCoverFile(null);
    setMayorPhotoFile(null);
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

  const handleMayorPhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setMayorPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedProfile({
          ...editedProfile,
          mayor: { ...editedProfile.mayor, photo: reader.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case &ldquo;COMPLETED&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;IN_PROGRESS&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;PLANNING&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getProjectStatusText = (status: string) => {
    switch (status) {
      case &ldquo;COMPLETED&rdquo;:
        return &ldquo;Completado&rdquo;;
      case &ldquo;IN_PROGRESS&rdquo;:
        return &ldquo;En Progreso&rdquo;;
      case &ldquo;PLANNING&rdquo;:
        return &ldquo;Planificación&rdquo;;
      default:
        return status;
    }
  };

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Perfil Municipal</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Información oficial del municipio y administración local
          </p>
        </div>
        <div className=&ldquo;flex gap-2&rdquo;>
          {isEditing ? (
            <>
              <Button variant=&ldquo;outline&rdquo; onClick={handleCancel}>
                <X className=&ldquo;w-4 h-4 mr-2&rdquo; />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className=&ldquo;w-4 h-4 mr-2&rdquo; />
                Guardar Cambios
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className=&ldquo;w-4 h-4 mr-2&rdquo; />
              Editar Perfil
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue=&ldquo;general&rdquo; className=&ldquo;space-y-6&rdquo;>
        <TabsList className=&ldquo;grid w-full grid-cols-4&rdquo;>
          <TabsTrigger value=&ldquo;general&rdquo;>Información General</TabsTrigger>
          <TabsTrigger value=&ldquo;demographics&rdquo;>Demografía</TabsTrigger>
          <TabsTrigger value=&ldquo;settings&rdquo;>Configuración</TabsTrigger>
          <TabsTrigger value=&ldquo;settings&rdquo;>Certificados</TabsTrigger>
        </TabsList>

        <TabsContent value=&ldquo;general&rdquo; className=&ldquo;space-y-6&rdquo;>
          {/* Cover Image */}
          <Card>
            <CardContent className=&ldquo;p-0&rdquo;>
              <div className=&ldquo;relative&rdquo;>
                <div
                  style={{
                    backgroundImage: `url(${editedProfile.coverImage || &ldquo;/placeholder.svg&rdquo;})`,
                    backgroundSize: &ldquo;cover&rdquo;,
                    backgroundPosition: &ldquo;center&rdquo;,
                  }}
                  className=&ldquo;w-full h-48 rounded-t-lg&rdquo;
                />
                {isEditing && (
                  <div className=&ldquo;absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg&rdquo;>
                    <Label htmlFor=&ldquo;cover-upload&rdquo; className=&ldquo;cursor-pointer&rdquo;>
                      <div className=&ldquo;flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg&rdquo;>
                        <Camera className=&ldquo;w-4 h-4&rdquo; />
                        Cambiar Imagen
                      </div>
                      <Input
                        id=&ldquo;cover-upload&rdquo;
                        type=&ldquo;file&rdquo;
                        accept=&ldquo;image/*&rdquo;
                        onChange={handleCoverUpload}
                        className=&ldquo;hidden&rdquo;
                      />
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-6&rdquo;>
            <Card className=&ldquo;lg:col-span-2&rdquo;>
              <CardHeader>
                <CardTitle>Información Municipal</CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-start gap-4&rdquo;>
                  <div className=&ldquo;relative&rdquo;>
                    <Avatar className=&ldquo;w-20 h-20&rdquo;>
                      <AvatarImage
                        src={editedProfile.logo || &ldquo;/placeholder.svg&rdquo;}
                        alt={editedProfile.name}
                      />
                      <AvatarFallback>
                        <Building2 className=&ldquo;w-8 h-8&rdquo; />
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Label
                        htmlFor=&ldquo;logo-upload&rdquo;
                        className=&ldquo;absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer&rdquo;
                      >
                        <Camera className=&ldquo;w-3 h-3&rdquo; />
                        <Input
                          id=&ldquo;logo-upload&rdquo;
                          type=&ldquo;file&rdquo;
                          accept=&ldquo;image/*&rdquo;
                          onChange={handleLogoUpload}
                          className=&ldquo;hidden&rdquo;
                        />
                      </Label>
                    )}
                  </div>
                  <div className=&ldquo;flex-1 space-y-2&rdquo;>
                    {isEditing ? (
                      <Input
                        value={editedProfile.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            name: e.target.value,
                          })
                        }
                        className=&ldquo;text-2xl font-bold&rdquo;
                      />
                    ) : (
                      <h2 className=&ldquo;text-2xl font-bold&rdquo;>{profile.name}</h2>
                    )}
                    <div className=&ldquo;flex gap-2&rdquo;>
                      <Badge variant=&ldquo;secondary&rdquo;>{profile.department}</Badge>
                      <Badge variant=&ldquo;outline&rdquo;>{profile.province}</Badge>
                    </div>
                  </div>
                </div>

                <div className=&ldquo;space-y-3&rdquo;>
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
                      <p className=&ldquo;text-muted-foreground mt-1&rdquo;>
                        {profile.description}
                      </p>
                    )}
                  </div>

                  <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                    <div>
                      <Label>Región</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.region}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              region: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <p className=&ldquo;text-sm text-muted-foreground mt-1&rdquo;>
                          {profile.region}
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
                        <p className=&ldquo;text-sm text-muted-foreground mt-1&rdquo;>
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
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;space-y-3&rdquo;>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <Globe className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                    {isEditing ? (
                      <Input
                        value={editedProfile.website}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            website: e.target.value,
                          })
                        }
                        placeholder=&ldquo;https://...&rdquo;
                      />
                    ) : (
                      <a
                        href={profile.website}
                        className=&ldquo;text-blue-600 hover:underline text-sm&rdquo;
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <Mail className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                    {isEditing ? (
                      <Input
                        value={editedProfile.email}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            email: e.target.value,
                          })
                        }
                        type=&ldquo;email&rdquo;
                      />
                    ) : (
                      <span className=&ldquo;text-sm&rdquo;>{profile.email}</span>
                    )}
                  </div>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <Phone className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
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
                      <span className=&ldquo;text-sm&rdquo;>{profile.phone}</span>
                    )}
                  </div>
                  <div className=&ldquo;flex items-start gap-2&rdquo;>
                    <MapPin className=&ldquo;w-4 h-4 text-muted-foreground mt-0.5&rdquo; />
                    <div className=&ldquo;text-sm&rdquo;>
                      {isEditing ? (
                        <Input
                          value={editedProfile.address}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: e.target.value,
                            })
                          }
                          placeholder=&ldquo;Dirección&rdquo;
                        />
                      ) : (
                        <div>{profile.address}</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mayor Information */}
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Briefcase className=&ldquo;w-5 h-5&rdquo; />
                Alcalde Municipal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex items-start gap-4&rdquo;>
                <div className=&ldquo;relative&rdquo;>
                  <Avatar className=&ldquo;w-24 h-24&rdquo;>
                    <AvatarImage
                      src={editedProfile.mayor.photo || &ldquo;/placeholder.svg&rdquo;}
                      alt={editedProfile.mayor.name}
                    />
                    <AvatarFallback>
                      <Users className=&ldquo;w-8 h-8&rdquo; />
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Label
                      htmlFor=&ldquo;mayor-photo-upload&rdquo;
                      className=&ldquo;absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer&rdquo;
                    >
                      <Camera className=&ldquo;w-3 h-3&rdquo; />
                      <Input
                        id=&ldquo;mayor-photo-upload&rdquo;
                        type=&ldquo;file&rdquo;
                        accept=&ldquo;image/*&rdquo;
                        onChange={handleMayorPhotoUpload}
                        className=&ldquo;hidden&rdquo;
                      />
                    </Label>
                  )}
                </div>
                <div className=&ldquo;flex-1 space-y-2&rdquo;>
                  {isEditing ? (
                    <div className=&ldquo;space-y-2&rdquo;>
                      <Input
                        value={editedProfile.mayor.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            mayor: {
                              ...editedProfile.mayor,
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder=&ldquo;Nombre del alcalde&rdquo;
                      />
                      <Input
                        value={editedProfile.mayor.party}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            mayor: {
                              ...editedProfile.mayor,
                              party: e.target.value,
                            },
                          })
                        }
                        placeholder=&ldquo;Partido político&rdquo;
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className=&ldquo;text-xl font-semibold&rdquo;>
                        {profile.mayor.name}
                      </h3>
                      <p className=&ldquo;text-muted-foreground&rdquo;>
                        {profile.mayor.party}
                      </p>
                    </>
                  )}
                  <div className=&ldquo;flex items-center gap-4 text-sm text-muted-foreground&rdquo;>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Calendar className=&ldquo;w-3 h-3&rdquo; />
                      <span>
                        Período:{&ldquo; &rdquo;}
                        {new Date(profile.mayor.startDate).getFullYear()} -{&ldquo; &rdquo;}
                        {new Date(profile.mayor.endDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className=&ldquo;flex gap-4 text-sm&rdquo;>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Mail className=&ldquo;w-3 h-3&rdquo; />
                      <span>{profile.mayor.email}</span>
                    </div>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Phone className=&ldquo;w-3 h-3&rdquo; />
                      <span>{profile.mayor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=&ldquo;demographics&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4&rdquo;>
            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
                  Población Total
                </CardTitle>
                <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>
                  {profile.demographics.population.toLocaleString()}
                </div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>habitantes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
                  Área Total
                </CardTitle>
                <MapPin className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>
                  {profile.demographics.area.toLocaleString()}
                </div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>km²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Densidad</CardTitle>
                <Home className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>
                  {profile.demographics.density}
                </div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>hab/km²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
                  Presupuesto
                </CardTitle>
                <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>
                  Bs. {(profile.economy.budget / 1000000).toFixed(0)}M
                </div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>millones</p>
              </CardContent>
            </Card>
          </div>

          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
            <Card>
              <CardHeader>
                <CardTitle>Distribución Poblacional</CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div>
                  <div className=&ldquo;flex justify-between text-sm mb-1&rdquo;>
                    <span>Población Urbana</span>
                    <span>{profile.demographics.urbanPopulation}%</span>
                  </div>
                  <Progress
                    value={profile.demographics.urbanPopulation}
                    className=&ldquo;h-2&rdquo;
                  />
                </div>
                <div>
                  <div className=&ldquo;flex justify-between text-sm mb-1&rdquo;>
                    <span>Población Rural</span>
                    <span>{profile.demographics.ruralPopulation}%</span>
                  </div>
                  <Progress
                    value={profile.demographics.ruralPopulation}
                    className=&ldquo;h-2&rdquo;
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores Económicos</CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div>
                  <div className=&ldquo;flex justify-between text-sm mb-1&rdquo;>
                    <span>Desempleo</span>
                    <span>{profile.economy.unemployment}%</span>
                  </div>
                  <Progress
                    value={profile.economy.unemployment}
                    className=&ldquo;h-2&rdquo;
                  />
                </div>
                <div>
                  <div className=&ldquo;flex justify-between text-sm mb-1&rdquo;>
                    <span>Pobreza</span>
                    <span>{profile.economy.poverty}%</span>
                  </div>
                  <Progress value={profile.economy.poverty} className=&ldquo;h-2&rdquo; />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Principales Actividades Económicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                {profile.economy.mainActivities.map((activity, index) => (
                  <Badge key={index} variant=&ldquo;outline&rdquo;>
                    {activity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value=&ldquo;services&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4&rdquo;>
            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Educación</CardTitle>
                <GraduationCap className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.services.education}%</div>
                <Progress value={profile.services.education} className=&ldquo;h-2 mt-2&rdquo; />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Salud</CardTitle>
                <Heart className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.services.health}%</div>
                <Progress value={profile.services.health} className=&ldquo;h-2 mt-2&rdquo; />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Agua Potable</CardTitle>
                <TreePine className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.services.water}%</div>
                <Progress value={profile.services.water} className=&ldquo;h-2 mt-2&rdquo; />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Electricidad</CardTitle>
                <Award className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.services.electricity}%</div>
                <Progress value={profile.services.electricity} className=&ldquo;h-2 mt-2&rdquo; />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Internet</CardTitle>
                <Globe className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.services.internet}%</div>
                <Progress value={profile.services.internet} className=&ldquo;h-2 mt-2&rdquo; />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cobertura de Servicios Básicos</CardTitle>
              <CardDescription>Porcentaje de población con acceso a servicios esenciales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                  Los indicadores muestran el porcentaje de la población que tiene acceso a cada servicio básico. El
                  municipio trabaja continuamente para mejorar estos índices y garantizar el bienestar de todos los
                  ciudadanos.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value=&ldquo;projects&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid gap-4&rdquo;>
            {profile.projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className=&ldquo;flex justify-between items-start&rdquo;>
                    <div>
                      <CardTitle className=&ldquo;text-lg&rdquo;>{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <Badge className={getProjectStatusColor(project.status)}>
                      {getProjectStatusText(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className=&ldquo;space-y-3&rdquo;>
                    <div className=&ldquo;flex justify-between items-center text-sm&rdquo;>
                      <span>
                        Presupuesto: Bs. {project.budget.toLocaleString()}
                      </span>
                      <span>Progreso: {project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className=&ldquo;h-2&rdquo; />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value=&ldquo;settings&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Shield className=&ldquo;w-5 h-5&rdquo; />
                Configuración de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Perfil público</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    La información municipal será visible públicamente
                  </p>
                </div>
                <Switch
                  checked={editedProfile.settings.publicProfile}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: {
                        ...editedProfile.settings,
                        publicProfile: checked,
                      },
                    })
                  }
                />
              </div>
              <Separator />
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Mostrar presupuesto</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Información presupuestaria visible al público
                  </p>
                </div>
                <Switch
                  checked={editedProfile.settings.showBudget}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: {
                        ...editedProfile.settings,
                        showBudget: checked,
                      },
                    })
                  }
                />
              </div>
              <Separator />
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Permitir mensajes</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Los ciudadanos pueden enviar mensajes directos
                  </p>
                </div>
                <Switch
                  checked={editedProfile.settings.allowMessages}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: {
                        ...editedProfile.settings,
                        allowMessages: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Bell className=&ldquo;w-5 h-5&rdquo; />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Notificaciones por email</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Recibe actualizaciones importantes por correo
                  </p>
                </div>
                <Switch
                  checked={editedProfile.settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: {
                        ...editedProfile.settings,
                        emailNotifications: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                Enlaces a perfiles oficiales del municipio
              </CardDescription>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-3&rdquo;>
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
                    placeholder=&ldquo;https://facebook.com/municipio&rdquo;
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
                    placeholder=&ldquo;https://twitter.com/municipio&rdquo;
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={
                      isEditing
                        ? editedProfile.socialMedia.instagram
                        : profile.socialMedia.instagram
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: {
                          ...editedProfile.socialMedia,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder=&ldquo;https://instagram.com/municipio&rdquo;
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>YouTube</Label>
                  <Input
                    value={
                      isEditing
                        ? editedProfile.socialMedia.youtube
                        : profile.socialMedia.youtube
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: {
                          ...editedProfile.socialMedia,
                          youtube: e.target.value,
                        },
                      })
                    }
                    placeholder=&ldquo;https://youtube.com/municipio&rdquo;
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value=&ldquo;certificates&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Award className=&ldquo;h-5 w-5&rdquo; />
                Certificado de Finalización
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-2&rdquo;>
                <Label htmlFor=&ldquo;certificateFile&rdquo;>Subir Certificado (PDF)</Label>
                <Input
                  id=&ldquo;certificateFile&rdquo;
                  type=&ldquo;file&rdquo;
                  accept=&ldquo;application/pdf&rdquo;
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCertificateFile(file);
                  }}
                />
                {certificateFile && (
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Archivo seleccionado: {certificateFile.name}
                  </p>
                )}
              </div>

              <div className=&ldquo;flex justify-end&rdquo;>
                <Button
                  disabled={!certificateFile}
                  onClick={async () => {
                    const formDataUpload = new FormData();
                    formDataUpload.append(&ldquo;file&rdquo;, certificateFile!);

                    try {
                      const res = await fetch(&ldquo;/api/certificates/upload&rdquo;, {
                        method: &ldquo;POST&rdquo;,
                        body: formDataUpload,
                      });

                      if (!res.ok)
                        throw new Error(&ldquo;Error al subir certificado&rdquo;);

                      const result = await res.json();
                      console.log(&ldquo;Certificado subido:&rdquo;, result);

                      // Guarda la URL en el estado del curso (si tienes un campo para eso)
                      handleInputChange(&ldquo;certificateUrl&rdquo;, result.url);

                      // Limpia el estado local si deseas
                      setCertificateFile(null);
                    } catch (err) {
                      console.error(&ldquo;Error al subir:&rdquo;, err);
                    }
                  }}
                >
                  Subir Certificado
                </Button>
              </div>

              {formData.certificateUrl && (
                <div className=&ldquo;text-sm text-green-700&rdquo;>
                  Certificado cargado:{&ldquo; &rdquo;}
                  <a
                    href={formData.certificateUrl}
                    target=&ldquo;_blank&rdquo;
                    rel=&ldquo;noopener noreferrer&rdquo;
                    className=&ldquo;underline&rdquo;
                  >
                    Ver certificado
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
