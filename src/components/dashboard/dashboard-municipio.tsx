&ldquo;use client&rdquo;

import { useState } from &ldquo;react&rdquo;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;
import { Input } from &ldquo;@/components/ui/input&rdquo;
import { Label } from &ldquo;@/components/ui/label&rdquo;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &ldquo;@/components/ui/select&rdquo;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;
import { Building2, Users, TrendingUp, MapPin, Plus, BarChart3, Globe, Mail, Phone, Play, Link, FileText, GraduationCap, Bookmark, Lightbulb, MessageSquare, BookOpen, Briefcase } from &ldquo;lucide-react&rdquo;

interface Company {
  id: string
  name: string
  description: string
  logo: string
  industry: string
  size: string
  founded: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  employees: number
  revenue: number
  growth: number
  mission: string
  vision: string
  values: string[]
}

export function DashboardMunicipio() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: &ldquo;1&rdquo;,
      name: &ldquo;Cemse Innovación&rdquo;,
      description:
        &ldquo;Empresa líder en desarrollo de soluciones tecnológicas innovadoras para el sector empresarial boliviano. Nos especializamos en transformación digital y consultoría estratégica.&rdquo;,
      logo: &ldquo;/placeholder.svg?height=60&width=60&rdquo;,
      industry: &ldquo;Tecnología&rdquo;,
      size: &ldquo;51-200 empleados&rdquo;,
      founded: &ldquo;2018&rdquo;,
      website: &ldquo;https://cemse.com.bo&rdquo;,
      email: &ldquo;contacto@cemse.com.bo&rdquo;,
      phone: &ldquo;+591 2 2345678&rdquo;,
      address: &ldquo;Av. Arce 2345, Edificio Torre Empresarial, Piso 12&rdquo;,
      city: &ldquo;La Paz&rdquo;,
      employees: 127,
      revenue: 2500000,
      growth: 35,
      mission:
        &ldquo;Impulsar la transformación digital de las empresas bolivianas mediante soluciones tecnológicas innovadoras y consultoría especializada.&rdquo;,
      vision:
        &ldquo;Ser la empresa de tecnología más reconocida de Bolivia, liderando la innovación y el desarrollo empresarial en la región.&rdquo;,
      values: [&ldquo;Innovación&rdquo;, &ldquo;Excelencia&rdquo;, &ldquo;Integridad&rdquo;, &ldquo;Colaboración&rdquo;, &ldquo;Sostenibilidad&rdquo;],
    },
  ])

  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    industry: &ldquo;&rdquo;,
    size: &ldquo;&rdquo;,
    founded: &ldquo;&rdquo;,
    website: &ldquo;&rdquo;,
    email: &ldquo;&rdquo;,
    phone: &ldquo;&rdquo;,
    address: &ldquo;&rdquo;,
    city: &ldquo;&rdquo;,
    employees: 0,
    revenue: 0,
    growth: 0,
    mission: &ldquo;&rdquo;,
    vision: &ldquo;&rdquo;,
    values: [],
  })

  const companyStats = {
    totalCompanies: companies.length,
    totalEmployees: companies.reduce((sum, company) => sum + company.employees, 0),
    totalRevenue: companies.reduce((sum, company) => sum + company.revenue, 0),
    averageGrowth: companies.reduce((sum, company) => sum + company.growth, 0) / companies.length,
    industries: [...new Set(companies.map((c) => c.industry))],
  }

  const handleCreateCompany = () => {
    const company: Company = {
      ...newCompany,
      id: Date.now().toString(),
      logo: &ldquo;/placeholder.svg?height=60&width=60&rdquo;,
      values: typeof newCompany.values === &ldquo;string&rdquo; ? newCompany.values.split(&ldquo;,&rdquo;).map((v) => v.trim()) : [],
    } as Company

    setCompanies([...companies, company])
    setNewCompany({
      name: &ldquo;&rdquo;,
      description: &ldquo;&rdquo;,
      industry: &ldquo;&rdquo;,
      size: &ldquo;&rdquo;,
      founded: &ldquo;&rdquo;,
      website: &ldquo;&rdquo;,
      email: &ldquo;&rdquo;,
      phone: &ldquo;&rdquo;,
      address: &ldquo;&rdquo;,
      city: &ldquo;&rdquo;,
      employees: 0,
      revenue: 0,
      growth: 0,
      mission: &ldquo;&rdquo;,
      vision: &ldquo;&rdquo;,
      values: [],
    })
    setShowCreateDialog(false)
  }

  return (
    <div className=&ldquo;space-y-6 px-4&rdquo;>
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold tracking-tight&rdquo;>Dashboard Municipio </h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>Gestión y análisis de empresas registradas</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
              Crear Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className=&ldquo;max-w-4xl max-h-[90vh] overflow-y-auto&rdquo;>
            <DialogHeader>
              <DialogTitle>Crear Nueva Empresa</DialogTitle>
              <DialogDescription>Registra una nueva empresa en la plataforma CEMSE</DialogDescription>
            </DialogHeader>
            <div className=&ldquo;grid gap-4 py-4&rdquo;>
              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;name&rdquo;>Nombre de la Empresa *</Label>
                  <Input
                    id=&ldquo;name&rdquo;
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder=&ldquo;Ej: Cemse Innovación&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;founded&rdquo;>Año de Fundación</Label>
                  <Input
                    id=&ldquo;founded&rdquo;
                    value={newCompany.founded}
                    onChange={(e) => setNewCompany({ ...newCompany, founded: e.target.value })}
                    placeholder=&ldquo;2018&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;description&rdquo;>Descripción</Label>
                <Textarea
                  id=&ldquo;description&rdquo;
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  placeholder=&ldquo;Descripción de la empresa...&rdquo;
                  rows={3}
                />
              </div>

              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;industry&rdquo;>Sector</Label>
                  <Select
                    value={newCompany.industry}
                    onValueChange={(value) => setNewCompany({ ...newCompany, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar sector&rdquo; />
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
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;size&rdquo;>Tamaño</Label>
                  <Select
                    value={newCompany.size}
                    onValueChange={(value) => setNewCompany({ ...newCompany, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar tamaño&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;1-10 empleados&rdquo;>1-10 empleados</SelectItem>
                      <SelectItem value=&ldquo;11-50 empleados&rdquo;>11-50 empleados</SelectItem>
                      <SelectItem value=&ldquo;51-200 empleados&rdquo;>51-200 empleados</SelectItem>
                      <SelectItem value=&ldquo;201-500 empleados&rdquo;>201-500 empleados</SelectItem>
                      <SelectItem value=&ldquo;500+ empleados&rdquo;>500+ empleados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;website&rdquo;>Sitio Web</Label>
                  <Input
                    id=&ldquo;website&rdquo;
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    placeholder=&ldquo;https://empresa.com&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;email&rdquo;>Email</Label>
                  <Input
                    id=&ldquo;email&rdquo;
                    type=&ldquo;email&rdquo;
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    placeholder=&ldquo;contacto@empresa.com&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;phone&rdquo;>Teléfono</Label>
                  <Input
                    id=&ldquo;phone&rdquo;
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    placeholder=&ldquo;+591 2 2345678&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;city&rdquo;>Ciudad</Label>
                  <Select
                    value={newCompany.city}
                    onValueChange={(value) => setNewCompany({ ...newCompany, city: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&ldquo;Seleccionar ciudad&rdquo; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;La Paz&rdquo;>La Paz</SelectItem>
                      <SelectItem value=&ldquo;Santa Cruz&rdquo;>Santa Cruz</SelectItem>
                      <SelectItem value=&ldquo;Cochabamba&rdquo;>Cochabamba</SelectItem>
                      <SelectItem value=&ldquo;Sucre&rdquo;>Sucre</SelectItem>
                      <SelectItem value=&ldquo;Potosí&rdquo;>Potosí</SelectItem>
                      <SelectItem value=&ldquo;Oruro&rdquo;>Oruro</SelectItem>
                      <SelectItem value=&ldquo;Tarija&rdquo;>Tarija</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;address&rdquo;>Dirección</Label>
                <Input
                  id=&ldquo;address&rdquo;
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  placeholder=&ldquo;Av. Principal 123&rdquo;
                />
              </div>

              <div className=&ldquo;grid grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;employees&rdquo;>Número de Empleados</Label>
                  <Input
                    id=&ldquo;employees&rdquo;
                    type=&ldquo;number&rdquo;
                    value={newCompany.employees}
                    onChange={(e) => setNewCompany({ ...newCompany, employees: Number.parseInt(e.target.value) || 0 })}
                    placeholder=&ldquo;0&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;revenue&rdquo;>Ingresos Anuales (Bs.)</Label>
                  <Input
                    id=&ldquo;revenue&rdquo;
                    type=&ldquo;number&rdquo;
                    value={newCompany.revenue}
                    onChange={(e) => setNewCompany({ ...newCompany, revenue: Number.parseInt(e.target.value) || 0 })}
                    placeholder=&ldquo;0&rdquo;
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;growth&rdquo;>Crecimiento (%)</Label>
                  <Input
                    id=&ldquo;growth&rdquo;
                    type=&ldquo;number&rdquo;
                    value={newCompany.growth}
                    onChange={(e) => setNewCompany({ ...newCompany, growth: Number.parseInt(e.target.value) || 0 })}
                    placeholder=&ldquo;0&rdquo;
                  />
                </div>
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;mission&rdquo;>Misión</Label>
                <Textarea
                  id=&ldquo;mission&rdquo;
                  value={newCompany.mission}
                  onChange={(e) => setNewCompany({ ...newCompany, mission: e.target.value })}
                  placeholder=&ldquo;Misión de la empresa...&rdquo;
                  rows={2}
                />
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;vision&rdquo;>Visión</Label>
                <Textarea
                  id=&ldquo;vision&rdquo;
                  value={newCompany.vision}
                  onChange={(e) => setNewCompany({ ...newCompany, vision: e.target.value })}
                  placeholder=&ldquo;Visión de la empresa...&rdquo;
                  rows={2}
                />
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;values&rdquo;>Valores Corporativos</Label>
                <Input
                  id=&ldquo;values&rdquo;
                  value={Array.isArray(newCompany.values) ? newCompany.values.join(&ldquo;, &rdquo;) : newCompany.values}
                  onChange={(e) => setNewCompany({ ...newCompany, values: e.target.value })}
                  placeholder=&ldquo;Innovación, Excelencia, Integridad (separados por comas)&rdquo;
                />
              </div>

              <div className=&ldquo;flex justify-end gap-2 pt-4&rdquo;>
                <Button variant=&ldquo;outline&rdquo; onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCompany} disabled={!newCompany.name}>
                  Crear Empresa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid gap-4 md:grid-cols-2 lg:grid-cols-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Empresas</CardTitle>
            <Building2 className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{companyStats.totalCompanies}</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Empleados</CardTitle>
            <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{companyStats.totalEmployees.toLocaleString()}</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>en todas las empresas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Ingresos Totales</CardTitle>
            <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>Bs. {(companyStats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>millones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Crecimiento Promedio</CardTitle>
            <BarChart3 className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>+{companyStats.averageGrowth.toFixed(1)}%</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>anual</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies List */}
      {/* <div className=&ldquo;grid gap-6&rdquo;>
        {companies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <div className=&ldquo;flex items-start gap-4&rdquo;>
                <Avatar className=&ldquo;w-16 h-16&rdquo;>
                  <AvatarImage src={company.logo || &ldquo;/placeholder.svg&rdquo;} alt={company.name} />
                  <AvatarFallback>
                    <Building2 className=&ldquo;w-6 h-6&rdquo; />
                  </AvatarFallback>
                </Avatar>
                <div className=&ldquo;flex-1&rdquo;>
                  <div className=&ldquo;flex justify-between items-start&rdquo;>
                    <div>
                      <CardTitle className=&ldquo;text-xl&rdquo;>{company.name}</CardTitle>
                      <CardDescription className=&ldquo;mt-1&rdquo;>{company.description}</CardDescription>
                      <div className=&ldquo;flex gap-2 mt-2&rdquo;>
                        <Badge variant=&ldquo;secondary&rdquo;>{company.industry}</Badge>
                        <Badge variant=&ldquo;outline&rdquo;>{company.size}</Badge>
                        <Badge variant=&ldquo;outline&rdquo;>Fundada en {company.founded}</Badge>
                      </div>
                    </div>
                    <div className=&ldquo;text-right&rdquo;>
                      <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>+{company.growth}%</div>
                      <p className=&ldquo;text-xs text-muted-foreground&rdquo;>crecimiento</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Globe className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                  <a href={company.website} className=&ldquo;text-sm text-blue-600 hover:underline&rdquo;>
                    {company.website}
                  </a>
                </div>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Mail className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                  <span className=&ldquo;text-sm&rdquo;>{company.email}</span>
                </div>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Phone className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                  <span className=&ldquo;text-sm&rdquo;>{company.phone}</span>
                </div>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <MapPin className=&ldquo;w-4 h-4 text-muted-foreground&rdquo; />
                  <span className=&ldquo;text-sm&rdquo;>{company.city}</span>
                </div>
              </div>

              <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4 mb-4&rdquo;>
                <div className=&ldquo;text-center p-3 bg-blue-50 rounded-lg&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>{company.employees}</div>
                  <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Empleados</p>
                </div>
                <div className=&ldquo;text-center p-3 bg-green-50 rounded-lg&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>Bs. {company.revenue.toLocaleString()}</div>
                  <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Ingresos Anuales</p>
                </div>
                <div className=&ldquo;text-center p-3 bg-purple-50 rounded-lg&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-purple-600&rdquo;>+{company.growth}%</div>
                  <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Crecimiento</p>
                </div>
              </div>

              <div className=&ldquo;space-y-3&rdquo;>
                <div>
                  <h4 className=&ldquo;font-semibold text-sm mb-1&rdquo;>Misión</h4>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{company.mission}</p>
                </div>
                <div>
                  <h4 className=&ldquo;font-semibold text-sm mb-1&rdquo;>Visión</h4>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>{company.vision}</p>
                </div>
                <div>
                  <h4 className=&ldquo;font-semibold text-sm mb-2&rdquo;>Valores Corporativos</h4>
                  <div className=&ldquo;flex flex-wrap gap-1&rdquo;>
                    {company.values.map((value, index) => (
                      <Badge key={index} variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
      {/* Acciones Rápidas */}
      {/* Extra Invented Metrics Row */}
<div className=&ldquo;grid grid-cols-2 md:grid-cols-3 gap-4 mt-6&rdquo;>
  <div className=&ldquo;flex items-center gap-3 p-3 bg-white rounded-lg&rdquo;>
    <div className=&ldquo;w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center&rdquo;>
      <BookOpen className=&ldquo;w-5 h-5 text-sky-600&rdquo; />
    </div>
    <div>
      <div className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>14</div>
      <p className=&ldquo;text-xs text-gray-600&rdquo;>Artículos leídos este mes</p>
    </div>
  </div>

  <div className=&ldquo;flex items-center gap-3 p-3 bg-white rounded-lg&rdquo;>
    <div className=&ldquo;w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center&rdquo;>
      <Briefcase className=&ldquo;w-5 h-5 text-lime-600&rdquo; />
    </div>
    <div>
      <div className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>5</div>
      <p className=&ldquo;text-xs text-gray-600&rdquo;>Empresas seguidas</p>
    </div>
  </div>

  <div className=&ldquo;flex items-center gap-3 p-3 bg-white rounded-lg&rdquo;>
    <div className=&ldquo;w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center&rdquo;>
      <Lightbulb className=&ldquo;w-5 h-5 text-rose-600&rdquo; />
    </div>
    <div>
      <div className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>3</div>
      <p className=&ldquo;text-xs text-gray-600&rdquo;>Ideas guardadas</p>
    </div>
  </div>
</div>

<Card className=&ldquo;mt-6&rdquo;>
  <CardHeader>
    <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
      <Play className=&ldquo;w-5 h-5&rdquo; />
      Acciones Rápidas
    </CardTitle>
    <CardDescription>
      Comienza de inmediato con las herramientas que tienes disponibles
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className=&ldquo;grid grid-cols-2 md:grid-cols-3 gap-4&rdquo;>
      <Button variant=&ldquo;secondary&rdquo; className=&ldquo;justify-start gap-2 w-full&rdquo; asChild>
        <Link href=&ldquo;/cv-builder&rdquo;>
          <FileText className=&ldquo;w-4 h-4&rdquo; />
          Crear mi CV
        </Link>
      </Button>

      <Button variant=&ldquo;secondary&rdquo; className=&ldquo;justify-start gap-2 w-full&rdquo; asChild>
        <Link href=&ldquo;/courses&rdquo;>
          <GraduationCap className=&ldquo;w-4 h-4&rdquo; />
          Continuar Curso
        </Link>
      </Button>

      <Button variant=&ldquo;secondary&rdquo; className=&ldquo;justify-start gap-2 w-full&rdquo; asChild>
        <Link href=&ldquo;/jobs/saved&rdquo;>
          <Bookmark className=&ldquo;w-4 h-4&rdquo; />
          Ver Postulaciones Guardadas
        </Link>
      </Button>

      <Button variant=&ldquo;secondary&rdquo; className=&ldquo;justify-start gap-2 w-full&rdquo; asChild>
        <Link href=&ldquo;/entrepreneurship/ideas&rdquo;>
          <Lightbulb className=&ldquo;w-4 h-4&rdquo; />
          Mis Ideas de Negocio
        </Link>
      </Button>

      <Button variant=&ldquo;secondary&rdquo; className=&ldquo;justify-start gap-2 w-full&rdquo; asChild>
        <Link href=&ldquo;/mentorship&rdquo;>
          <Users className=&ldquo;w-4 h-4&rdquo; />
          Pedir Mentoría
        </Link>
      </Button>

      <Button variant=&ldquo;secondary&rdquo; className=&ldquo;justify-start gap-2 w-full&rdquo; asChild>
        <Link href=&ldquo;/support&rdquo;>
          <MessageSquare className=&ldquo;w-4 h-4&rdquo; />
          Contactar Soporte
        </Link>
      </Button>
    </div>
  </CardContent>
</Card>

    </div>
  )
}
