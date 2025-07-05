&ldquo;use client&rdquo;

import type React from &ldquo;react&rdquo;

import { useState } from &ldquo;react&rdquo;
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
  CreditCard,
  Award,
  Target,
} from &ldquo;lucide-react&rdquo;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;
import { Input } from &ldquo;@/components/ui/input&rdquo;
import { Label } from &ldquo;@/components/ui/label&rdquo;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &ldquo;@/components/ui/select&rdquo;
import { Switch } from &ldquo;@/components/ui/switch&rdquo;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;
import MapMarker from &ldquo;@/components/MapMarker&rdquo;

interface CompanyProfile {
  id: string
  name: string
  description: string
  logo: string
  coverImage: string
  industry: string
  size: string
  founded: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  mission: string
  vision: string
  values: string[]
  metrics: {
    employees: number
    revenue: number
    growth: number
    projects: number
  }
  socialMedia: {
    linkedin: string
    twitter: string
    facebook: string
  }
  settings: {
    publicProfile: boolean
    showMetrics: boolean
    allowMessages: boolean
    emailNotifications: boolean
  }
}

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>({
    id: &ldquo;company-1&rdquo;,
    name: &ldquo;Cemse Innovación&rdquo;,
    description:
      &ldquo;Empresa líder en desarrollo de soluciones tecnológicas innovadoras para el sector empresarial boliviano. Nos especializamos en transformación digital y consultoría estratégica.&rdquo;,
    logo: &ldquo;/placeholder.svg?height=100&width=100&rdquo;,
    coverImage: &ldquo;/placeholder.svg?height=300&width=800&rdquo;,
    industry: &ldquo;Tecnología&rdquo;,
    size: &ldquo;51-200 empleados&rdquo;,
    founded: &ldquo;2018&rdquo;,
    website: &ldquo;https://cemse.com.bo&rdquo;,
    email: &ldquo;contacto@cemse.com.bo&rdquo;,
    phone: &ldquo;+591 2 2345678&rdquo;,
    address: &ldquo;Av. Arce 2345, Edificio Torre Empresarial, Piso 12&rdquo;,
    city: &ldquo;La Paz&rdquo;,
    country: &ldquo;Bolivia&rdquo;,
    mission:
      &ldquo;Impulsar la transformación digital de las empresas bolivianas mediante soluciones tecnológicas innovadoras y consultoría especializada.&rdquo;,
    vision:
      &ldquo;Ser la empresa de tecnología más reconocida de Bolivia, liderando la innovación y el desarrollo empresarial en la región.&rdquo;,
    values: [&ldquo;Innovación&rdquo;, &ldquo;Excelencia&rdquo;, &ldquo;Integridad&rdquo;, &ldquo;Colaboración&rdquo;, &ldquo;Sostenibilidad&rdquo;],
    metrics: {
      employees: 127,
      revenue: 2500000,
      growth: 35,
      projects: 89,
    },
    socialMedia: {
      linkedin: &ldquo;https://linkedin.com/company/cemse&rdquo;,
      twitter: &ldquo;https://twitter.com/cemse_bo&rdquo;,
      facebook: &ldquo;https://facebook.com/cemse.bolivia&rdquo;,
    },
    settings: {
      publicProfile: true,
      showMetrics: false,
      allowMessages: true,
      emailNotifications: true,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<CompanyProfile>(profile)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const handleSave = async () => {
    try {
      // Simulate API call
      console.log(&ldquo;Saving profile:&rdquo;, editedProfile)
      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error(&ldquo;Error saving profile:&rdquo;, error)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setLogoFile(null)
    setCoverFile(null)
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

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Perfil de la Empresa</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>Gestiona la información y configuración de tu empresa</p>
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
        <TabsList className=&ldquo;grid w-full grid-cols-1&rdquo;>
          <TabsTrigger value=&ldquo;general&rdquo;>Información General</TabsTrigger>
        </TabsList>

        <TabsContent value=&ldquo;general&rdquo; className=&ldquo;space-y-6&rdquo;>
          {/* Cover Image */}
          <Card>
            <CardContent className=&ldquo;p-0&rdquo;>
              <div className=&ldquo;relative&rdquo;>
                <img
                  src={editedProfile.coverImage || &ldquo;/placeholder.svg&rdquo;}
                  alt=&ldquo;Portada de la empresa&rdquo;
                  className=&ldquo;w-full h-48 object-cover rounded-t-lg&rdquo;
                />
                {isEditing && (
                  <div className=&ldquo;absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg&rdquo;>
                    <Label htmlFor=&ldquo;cover-upload&rdquo; className=&ldquo;cursor-pointer&rdquo;>
                      <div className=&ldquo;flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-lg&rdquo;>
                        <Camera className=&ldquo;w-4 h-4&rdquo; />
                        Cambiar Portada
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
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-start gap-4&rdquo;>
                  <div className=&ldquo;relative&rdquo;>
                    <Avatar className=&ldquo;w-20 h-20&rdquo;>
                      <AvatarImage src={editedProfile.logo || &ldquo;/placeholder.svg&rdquo;} alt={editedProfile.name} />
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className=&ldquo;text-2xl font-bold&rdquo;
                      />
                    ) : (
                      <h2 className=&ldquo;text-2xl font-bold&rdquo;>{profile.name}</h2>
                    )}
                    <div className=&ldquo;flex gap-2&rdquo;>
                      <Badge variant=&ldquo;secondary&rdquo;>{profile.industry}</Badge>
                      <Badge variant=&ldquo;outline&rdquo;>{profile.size}</Badge>
                    </div>
                  </div>
                </div>

                <div className=&ldquo;space-y-3&rdquo;>
                  <div>
                    <Label>Descripción</Label>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.description}
                        onChange={(e) => setEditedProfile({ ...editedProfile, description: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className=&ldquo;text-muted-foreground mt-1&rdquo;>{profile.description}</p>
                    )}
                  </div>

                  <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                    <div>
                      <Label>Sector</Label>
                      {isEditing ? (
                        <Select
                          value={editedProfile.industry}
                          onValueChange={(value) => setEditedProfile({ ...editedProfile, industry: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=&ldquo;Tecnología&rdquo;>Tecnología</SelectItem>
                            <SelectItem value=&ldquo;Finanzas&rdquo;>Finanzas</SelectItem>
                            <SelectItem value=&ldquo;Salud&rdquo;>Salud</SelectItem>
                            <SelectItem value=&ldquo;Educación&rdquo;>Educación</SelectItem>
                            <SelectItem value=&ldquo;Manufactura&rdquo;>Manufactura</SelectItem>
                            <SelectItem value=&ldquo;Servicios&rdquo;>Servicios</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className=&ldquo;text-sm text-muted-foreground mt-1&rdquo;>{profile.industry}</p>
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
                        <p className=&ldquo;text-sm text-muted-foreground mt-1&rdquo;>{profile.founded}</p>
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                        placeholder=&ldquo;https://...&rdquo;
                      />
                    ) : (
                      <a href={profile.website} className=&ldquo;text-blue-600 hover:underline text-sm&rdquo;>
                        {profile.website}
                      </a>
                    )}
                  </div>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    <Mail className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                    {isEditing ? (
                      <Input
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
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
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      />
                    ) : (
                      <span className=&ldquo;text-sm&rdquo;>{profile.phone}</span>
                    )}
                  </div>
                  <div className=&ldquo;flex flex-col gap-2&rdquo;>
  <MapPin className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
  {!isEditing ? (
    <MapMarker
      name={profile.name}
      position={[-16.5, -68.15]} // Coordenadas de La Paz
    />
  ) : (
    <div className=&ldquo;space-y-2&rdquo;>
      <Input
        value={editedProfile.address}
        onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
        placeholder=&ldquo;Dirección&rdquo;
      />
      <div className=&ldquo;grid grid-cols-2 gap-2&rdquo;>
        <Input
          value={editedProfile.city}
          onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
          placeholder=&ldquo;Ciudad&rdquo;
        />
        <Input
          value={editedProfile.country}
          onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
          placeholder=&ldquo;País&rdquo;
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
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
            <Card>
              <CardHeader>
                <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                  <Target className=&ldquo;w-5 h-5&rdquo; />
                  Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.mission}
                    onChange={(e) => setEditedProfile({ ...editedProfile, mission: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className=&ldquo;text-muted-foreground&rdquo;>{profile.mission}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                  <Award className=&ldquo;w-5 h-5&rdquo; />
                  Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.vision}
                    onChange={(e) => setEditedProfile({ ...editedProfile, vision: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className=&ldquo;text-muted-foreground&rdquo;>{profile.vision}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Valores Corporativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                {profile.values.map((value, index) => (
                  <Badge key={index} variant=&ldquo;outline&rdquo;>
                    {value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Conecta tus perfiles de redes sociales para mayor visibilidad</CardDescription>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-3&rdquo;>
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
                    placeholder=&ldquo;https://linkedin.com/company/tu-empresa&rdquo;
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
                    placeholder=&ldquo;https://twitter.com/tu-empresa&rdquo;
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
                    placeholder=&ldquo;https://facebook.com/tu-empresa&rdquo;
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=&ldquo;metrics&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4&rdquo;>
            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Empleados</CardTitle>
                <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.metrics.employees}</div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Equipo actual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Ingresos Anuales</CardTitle>
                <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>Bs. {profile.metrics.revenue.toLocaleString()}</div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Año fiscal 2023</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Crecimiento</CardTitle>
                <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>+{profile.metrics.growth}%</div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Vs. año anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
                <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Proyectos</CardTitle>
                <Building2 className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;text-2xl font-bold&rdquo;>{profile.metrics.projects}</div>
                <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Completados</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Métricas</CardTitle>
              <CardDescription>Controla qué métricas son visibles en tu perfil público</CardDescription>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Mostrar métricas públicamente</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Las métricas serán visibles para otros usuarios de la plataforma
                  </p>
                </div>
                <Switch
                  checked={editedProfile.settings.showMetrics}
                  onCheckedChange={(checked) =>
                    setEditedProfile({
                      ...editedProfile,
                      settings: { ...editedProfile.settings, showMetrics: checked },
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
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-3&rdquo;>
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
                    placeholder=&ldquo;https://linkedin.com/company/tu-empresa&rdquo;
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
                    placeholder=&ldquo;https://twitter.com/tu-empresa&rdquo;
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
                    placeholder=&ldquo;https://facebook.com/tu-empresa&rdquo;
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}
          
        </TabsContent>

        {/* <TabsContent value=&ldquo;social&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Conecta tus perfiles de redes sociales para mayor visibilidad</CardDescription>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;space-y-3&rdquo;>
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
                    placeholder=&ldquo;https://linkedin.com/company/tu-empresa&rdquo;
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
                    placeholder=&ldquo;https://twitter.com/tu-empresa&rdquo;
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
                    placeholder=&ldquo;https://facebook.com/tu-empresa&rdquo;
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value=&ldquo;settings&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Shield className=&ldquo;w-5 h-5&rdquo; />
                Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Perfil público</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Tu perfil será visible para otros usuarios</p>
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
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Permitir mensajes</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Otros usuarios pueden enviarte mensajes directos</p>
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
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <Bell className=&ldquo;w-5 h-5&rdquo; />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div>
                  <Label>Notificaciones por email</Label>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Recibe actualizaciones importantes por correo</p>
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
              <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                <CreditCard className=&ldquo;w-5 h-5&rdquo; />
                Plan y Facturación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-center justify-between&rdquo;>
                  <div>
                    <Label>Plan Actual</Label>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Plan Empresarial - Renovación automática</p>
                  </div>
                  <Badge>Activo</Badge>
                </div>
                <Button variant=&ldquo;outline&rdquo; className=&ldquo;w-full bg-transparent&rdquo;>
                  Gestionar Suscripción
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
