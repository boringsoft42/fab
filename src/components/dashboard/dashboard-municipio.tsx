"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Users, TrendingUp, MapPin, Plus, BarChart3, Globe, Mail, Phone } from "lucide-react"

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
      id: "1",
      name: "Cemse Innovación",
      description:
        "Empresa líder en desarrollo de soluciones tecnológicas innovadoras para el sector empresarial boliviano. Nos especializamos en transformación digital y consultoría estratégica.",
      logo: "/placeholder.svg?height=60&width=60",
      industry: "Tecnología",
      size: "51-200 empleados",
      founded: "2018",
      website: "https://cemse.com.bo",
      email: "contacto@cemse.com.bo",
      phone: "+591 2 2345678",
      address: "Av. Arce 2345, Edificio Torre Empresarial, Piso 12",
      city: "La Paz",
      employees: 127,
      revenue: 2500000,
      growth: 35,
      mission:
        "Impulsar la transformación digital de las empresas bolivianas mediante soluciones tecnológicas innovadoras y consultoría especializada.",
      vision:
        "Ser la empresa de tecnología más reconocida de Bolivia, liderando la innovación y el desarrollo empresarial en la región.",
      values: ["Innovación", "Excelencia", "Integridad", "Colaboración", "Sostenibilidad"],
    },
  ])

  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: "",
    description: "",
    industry: "",
    size: "",
    founded: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    employees: 0,
    revenue: 0,
    growth: 0,
    mission: "",
    vision: "",
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
      logo: "/placeholder.svg?height=60&width=60",
      values: typeof newCompany.values === "string" ? newCompany.values.split(",").map((v) => v.trim()) : [],
    } as Company

    setCompanies([...companies, company])
    setNewCompany({
      name: "",
      description: "",
      industry: "",
      size: "",
      founded: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      employees: 0,
      revenue: 0,
      growth: 0,
      mission: "",
      vision: "",
      values: [],
    })
    setShowCreateDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Municipio </h1>
          <p className="text-muted-foreground">Gestión y análisis de empresas registradas</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Empresa</DialogTitle>
              <DialogDescription>Registra una nueva empresa en la plataforma CEMSE</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre de la Empresa *</Label>
                  <Input
                    id="name"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="Ej: Cemse Innovación"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="founded">Año de Fundación</Label>
                  <Input
                    id="founded"
                    value={newCompany.founded}
                    onChange={(e) => setNewCompany({ ...newCompany, founded: e.target.value })}
                    placeholder="2018"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  placeholder="Descripción de la empresa..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Sector</Label>
                  <Select
                    value={newCompany.industry}
                    onValueChange={(value) => setNewCompany({ ...newCompany, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Finanzas">Finanzas</SelectItem>
                      <SelectItem value="Salud">Salud</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Manufactura">Manufactura</SelectItem>
                      <SelectItem value="Servicios">Servicios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="size">Tamaño</Label>
                  <Select
                    value={newCompany.size}
                    onValueChange={(value) => setNewCompany({ ...newCompany, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10 empleados">1-10 empleados</SelectItem>
                      <SelectItem value="11-50 empleados">11-50 empleados</SelectItem>
                      <SelectItem value="51-200 empleados">51-200 empleados</SelectItem>
                      <SelectItem value="201-500 empleados">201-500 empleados</SelectItem>
                      <SelectItem value="500+ empleados">500+ empleados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    placeholder="https://empresa.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newCompany.phone}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    placeholder="+591 2 2345678"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Select
                    value={newCompany.city}
                    onValueChange={(value) => setNewCompany({ ...newCompany, city: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="La Paz">La Paz</SelectItem>
                      <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                      <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                      <SelectItem value="Sucre">Sucre</SelectItem>
                      <SelectItem value="Potosí">Potosí</SelectItem>
                      <SelectItem value="Oruro">Oruro</SelectItem>
                      <SelectItem value="Tarija">Tarija</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  placeholder="Av. Principal 123"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employees">Número de Empleados</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={newCompany.employees}
                    onChange={(e) => setNewCompany({ ...newCompany, employees: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="revenue">Ingresos Anuales (Bs.)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={newCompany.revenue}
                    onChange={(e) => setNewCompany({ ...newCompany, revenue: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="growth">Crecimiento (%)</Label>
                  <Input
                    id="growth"
                    type="number"
                    value={newCompany.growth}
                    onChange={(e) => setNewCompany({ ...newCompany, growth: Number.parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mission">Misión</Label>
                <Textarea
                  id="mission"
                  value={newCompany.mission}
                  onChange={(e) => setNewCompany({ ...newCompany, mission: e.target.value })}
                  placeholder="Misión de la empresa..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="vision">Visión</Label>
                <Textarea
                  id="vision"
                  value={newCompany.vision}
                  onChange={(e) => setNewCompany({ ...newCompany, vision: e.target.value })}
                  placeholder="Visión de la empresa..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="values">Valores Corporativos</Label>
                <Input
                  id="values"
                  value={Array.isArray(newCompany.values) ? newCompany.values.join(", ") : newCompany.values}
                  onChange={(e) => setNewCompany({ ...newCompany, values: e.target.value })}
                  placeholder="Innovación, Excelencia, Integridad (separados por comas)"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyStats.totalEmployees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">en todas las empresas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Bs. {(companyStats.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">millones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento Promedio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{companyStats.averageGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">anual</p>
          </CardContent>
        </Card>
      </div>

      {/* Companies List */}
      <div className="grid gap-6">
        {companies.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                  <AvatarFallback>
                    <Building2 className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <CardDescription className="mt-1">{company.description}</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{company.industry}</Badge>
                        <Badge variant="outline">{company.size}</Badge>
                        <Badge variant="outline">Fundada en {company.founded}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">+{company.growth}%</div>
                      <p className="text-xs text-muted-foreground">crecimiento</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={company.website} className="text-sm text-blue-600 hover:underline">
                    {company.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{company.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{company.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{company.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{company.employees}</div>
                  <p className="text-xs text-muted-foreground">Empleados</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">Bs. {company.revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Ingresos Anuales</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">+{company.growth}%</div>
                  <p className="text-xs text-muted-foreground">Crecimiento</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Misión</h4>
                  <p className="text-sm text-muted-foreground">{company.mission}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Visión</h4>
                  <p className="text-sm text-muted-foreground">{company.vision}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Valores Corporativos</h4>
                  <div className="flex flex-wrap gap-1">
                    {company.values.map((value, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
