"use client"

import type React from "react"

import { useState } from "react"
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
  GraduationCap,
  Heart,
  TreePine,
  Home,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

interface MunicipalProfile {
  id: string
  name: string
  description: string
  logo: string
  coverImage: string
  department: string
  province: string
  region: string
  founded: string
  website: string
  email: string
  phone: string
  address: string
  mayor: {
    name: string
    photo: string
    party: string
    startDate: string
    endDate: string
    email: string
    phone: string
  }
  demographics: {
    population: number
    area: number
    density: number
    urbanPopulation: number
    ruralPopulation: number
  }
  economy: {
    budget: number
    mainActivities: string[]
    unemployment: number
    poverty: number
  }
  services: {
    education: number
    health: number
    water: number
    electricity: number
    internet: number
  }
  projects: Array<{
    name: string
    description: string
    budget: number
    status: "PLANNING" | "IN_PROGRESS" | "COMPLETED"
    progress: number
  }>
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
  settings: {
    publicProfile: boolean
    showBudget: boolean
    allowMessages: boolean
    emailNotifications: boolean
  }
}

export default function MunicipalProfilePage() {
  const [profile, setProfile] = useState<MunicipalProfile>({
    id: "municipality-1",
    name: "Municipio de La Paz",
    description:
      "Sede de gobierno de Bolivia, centro político, administrativo y cultural del país. Comprometidos con el desarrollo sostenible y la mejora de la calidad de vida de nuestros ciudadanos.",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=300&width=800",
    department: "La Paz",
    province: "Pedro Domingo Murillo",
    region: "Altiplano",
    founded: "1548",
    website: "https://www.lapaz.bo",
    email: "contacto@lapaz.bo",
    phone: "+591 2 2650000",
    address: "Plaza Murillo s/n, La Paz, Bolivia",
    mayor: {
      name: "Iván Arias Durán",
      photo: "/placeholder.svg?height=120&width=120",
      party: "Partido Demócrata Cristiano",
      startDate: "2021-05-03",
      endDate: "2026-05-03",
      email: "alcalde@lapaz.bo",
      phone: "+591 2 2650001",
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
      mainActivities: ["Servicios", "Comercio", "Industria", "Turismo", "Administración Pública"],
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
        name: "Mi Teleférico - Línea Dorada",
        description: "Ampliación del sistema de transporte por cable",
        budget: 450000000,
        status: "IN_PROGRESS",
        progress: 65,
      },
      {
        name: "Parque Urbano Central",
        description: "Creación de espacios verdes en el centro de la ciudad",
        budget: 85000000,
        status: "PLANNING",
        progress: 15,
      },
      {
        name: "Modernización del Mercado Rodríguez",
        description: "Renovación integral del mercado tradicional",
        budget: 120000000,
        status: "COMPLETED",
        progress: 100,
      },
      {
        name: "Red de Ciclovías Metropolitanas",
        description: "Implementación de rutas seguras para ciclistas",
        budget: 35000000,
        status: "IN_PROGRESS",
        progress: 40,
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/AlcaldiaLaPaz",
      twitter: "https://twitter.com/AlcaldiaLaPaz",
      instagram: "https://instagram.com/alcaldialapaz",
      youtube: "https://youtube.com/AlcaldiaLaPazOficial",
    },
    settings: {
      publicProfile: true,
      showBudget: true,
      allowMessages: true,
      emailNotifications: true,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<MunicipalProfile>(profile)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [mayorPhotoFile, setMayorPhotoFile] = useState<File | null>(null)

  const handleSave = async () => {
    try {
      console.log("Saving municipal profile:", editedProfile)
      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setLogoFile(null)
    setCoverFile(null)
    setMayorPhotoFile(null)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setEditedProfile({ ...editedProfile, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setEditedProfile({ ...editedProfile, coverImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMayorPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setMayorPhotoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setEditedProfile({
          ...editedProfile,
          mayor: { ...editedProfile.mayor, photo: reader.result as string },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "PLANNING":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProjectStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completado"
      case "IN_PROGRESS":
        return "En Progreso"
      case "PLANNING":
        return "Planificación"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Perfil Municipal</h1>
          <p className="text-muted-foreground">Información oficial del municipio y administración local</p>
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="demographics">Demografía</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Cover Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={editedProfile.coverImage || "/placeholder.svg"}
                  alt="Vista del municipio"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg">
                        <Camera className="w-4 h-4" />
                        Cambiar Imagen
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
                <CardTitle>Información Municipal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={editedProfile.logo || "/placeholder.svg"} alt={editedProfile.name} />
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="text-2xl font-bold"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                    )}
                    <div className="flex gap-2">
                      <Badge variant="secondary">{profile.department}</Badge>
                      <Badge variant="outline">{profile.province}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Descripción</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.description}
                        onChange={(e) => setEditedProfile({ ...editedProfile, description: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground mt-1">{profile.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Región</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.region}
                          onChange={(e) => setEditedProfile({ ...editedProfile, region: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.region}</p>
                      )}
                    </div>
                    <div>
                      <Label>Año de Fundación</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.founded}
                          onChange={(e) => setEditedProfile({ ...editedProfile, founded: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">{profile.founded}</p>
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                        placeholder="https://..."
                      />
                    ) : (
                      <a href={profile.website} className="text-blue-600 hover:underline text-sm">
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {isEditing ? (
                      <Input
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm">{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      {isEditing ? (
                        <Input
                          value={editedProfile.address}
                          onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                          placeholder="Dirección"
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
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Alcalde Municipal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={editedProfile.mayor.photo || "/placeholder.svg"} alt={editedProfile.mayor.name} />
                    <AvatarFallback>
                      <Users className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Label
                      htmlFor="mayor-photo-upload"
                      className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <Input
                        id="mayor-photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleMayorPhotoUpload}
                        className="hidden"
                      />
                    </Label>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedProfile.mayor.name}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            mayor: { ...editedProfile.mayor, name: e.target.value },
                          })
                        }
                        placeholder="Nombre del alcalde"
                      />
                      <Input
                        value={editedProfile.mayor.party}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            mayor: { ...editedProfile.mayor, party: e.target.value },
                          })
                        }
                        placeholder="Partido político"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">{profile.mayor.name}</h3>
                      <p className="text-muted-foreground">{profile.mayor.party}</p>
                    </>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Período: {new Date(profile.mayor.startDate).getFullYear()} -{" "}
                        {new Date(profile.mayor.endDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{profile.mayor.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{profile.mayor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Población Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.demographics.population.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">habitantes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Área Total</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.demographics.area.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">km²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Densidad</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.demographics.density}</div>
                <p className="text-xs text-muted-foreground">hab/km²</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presupuesto</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Bs. {(profile.economy.budget / 1000000).toFixed(0)}M</div>
                <p className="text-xs text-muted-foreground">millones</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución Poblacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Población Urbana</span>
                    <span>{profile.demographics.urbanPopulation}%</span>
                  </div>
                  <Progress value={profile.demographics.urbanPopulation} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Población Rural</span>
                    <span>{profile.demographics.ruralPopulation}%</span>
                  </div>
                  <Progress value={profile.demographics.ruralPopulation} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores Económicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Desempleo</span>
                    <span>{profile.economy.unemployment}%</span>
                  </div>
                  <Progress value={profile.economy.unemployment} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pobreza</span>
                    <span>{profile.economy.poverty}%</span>
                  </div>
                  <Progress value={profile.economy.poverty} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Principales Actividades Económicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.economy.mainActivities.map((activity, index) => (
                  <Badge key={index} variant="outline">
                    {activity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Educación</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.services.education}%</div>
                <Progress value={profile.services.education} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salud</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.services.health}%</div>
                <Progress value={profile.services.health} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agua Potable</CardTitle>
                <TreePine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.services.water}%</div>
                <Progress value={profile.services.water} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Electricidad</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.services.electricity}%</div>
                <Progress value={profile.services.electricity} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Internet</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.services.internet}%</div>
                <Progress value={profile.services.internet} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cobertura de Servicios Básicos</CardTitle>
              <CardDescription>Porcentaje de población con acceso a servicios esenciales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Los indicadores muestran el porcentaje de la población que tiene acceso a cada servicio básico. El
                  municipio trabaja continuamente para mejorar estos índices y garantizar el bienestar de todos los
                  ciudadanos.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4">
            {profile.projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <Badge className={getProjectStatusColor(project.status)}>
                      {getProjectStatusText(project.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Presupuesto: Bs. {project.budget.toLocaleString()}</span>
                      <span>Progreso: {project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Perfil público</Label>
                  <p className="text-sm text-muted-foreground">La información municipal será visible públicamente</p>
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
                  <Label>Mostrar presupuesto</Label>
                  <p className="text-sm text-muted-foreground">Información presupuestaria visible al público</p>
                </div>
                <Switch
                  checked={editedProfile.settings.showBudget}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: { ...editedProfile.settings, showBudget: checked },
                    })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Permitir mensajes</Label>
                  <p className="text-sm text-muted-foreground">Los ciudadanos pueden enviar mensajes directos</p>
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
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Enlaces a perfiles oficiales del municipio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
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
                    placeholder="https://facebook.com/municipio"
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
                    placeholder="https://twitter.com/municipio"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.instagram : profile.socialMedia.instagram}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/municipio"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>YouTube</Label>
                  <Input
                    value={isEditing ? editedProfile.socialMedia.youtube : profile.socialMedia.youtube}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        socialMedia: { ...editedProfile.socialMedia, youtube: e.target.value },
                      })
                    }
                    placeholder="https://youtube.com/municipio"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
