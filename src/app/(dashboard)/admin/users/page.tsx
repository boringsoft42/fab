&ldquo;use client&rdquo;

import type React from &ldquo;react&rdquo;

import { useState, useEffect } from &ldquo;react&rdquo;
import { Plus, MoreVertical, Eye, Edit, Trash2, Building2, Users, TrendingUp, MapPin, Download, X } from &ldquo;lucide-react&rdquo;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;
import { Button } from &ldquo;@/components/ui/button&rdquo;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;
import { Input } from &ldquo;@/components/ui/input&rdquo;
import { Label } from &ldquo;@/components/ui/label&rdquo;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &ldquo;@/components/ui/select&rdquo;
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from &ldquo;@/components/ui/dropdown-menu&rdquo;
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from &ldquo;@/components/ui/table&rdquo;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &ldquo;@/components/ui/dialog&rdquo;
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from &ldquo;@/components/ui/alert-dialog&rdquo;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;

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
  country: string
  status: &ldquo;ACTIVE&rdquo; | &ldquo;INACTIVE&rdquo; | &ldquo;PENDING&rdquo;
  employees: number
  revenue: number
  growth: number
  createdAt: string
  updatedAt: string
}

export default function CompaniesManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(&ldquo;&rdquo;)
  const [industryFilter, setIndustryFilter] = useState(&ldquo;all&rdquo;)
  const [statusFilter, setStatusFilter] = useState(&ldquo;all&rdquo;)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false)

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    totalEmployees: 0,
    totalRevenue: 0,
  })

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Company>>({
    name: &ldquo;&rdquo;,
    description: &ldquo;&rdquo;,
    logo: &ldquo;&rdquo;,
    industry: &ldquo;&rdquo;,
    size: &ldquo;&rdquo;,
    founded: &ldquo;&rdquo;,
    website: &ldquo;&rdquo;,
    email: &ldquo;&rdquo;,
    phone: &ldquo;&rdquo;,
    address: &ldquo;&rdquo;,
    city: &ldquo;&rdquo;,
    country: &ldquo;Bolivia&rdquo;,
    status: &ldquo;ACTIVE&rdquo;,
    employees: 0,
    revenue: 0,
    growth: 0,
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState(&ldquo;&rdquo;)

  useEffect(() => {
    fetchCompanies()
  }, [industryFilter, statusFilter])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      // Simulated data
      const mockCompanies: Company[] = [
        {
          id: &ldquo;1&rdquo;,
          name: &ldquo;Cemse Innovación&rdquo;,
          description: &ldquo;Empresa líder en desarrollo de soluciones tecnológicas innovadoras&rdquo;,
          logo: &ldquo;/placeholder.svg?height=60&width=60&rdquo;,
          industry: &ldquo;Tecnología&rdquo;,
          size: &ldquo;51-200 empleados&rdquo;,
          founded: &ldquo;2018&rdquo;,
          website: &ldquo;https://cemse.com.bo&rdquo;,
          email: &ldquo;contacto@cemse.com.bo&rdquo;,
          phone: &ldquo;+591 2 2345678&rdquo;,
          address: &ldquo;Av. Arce 2345, Torre Empresarial&rdquo;,
          city: &ldquo;La Paz&rdquo;,
          country: &ldquo;Bolivia&rdquo;,
          status: &ldquo;ACTIVE&rdquo;,
          employees: 127,
          revenue: 2500000,
          growth: 35,
          createdAt: &ldquo;2024-01-15&rdquo;,
          updatedAt: &ldquo;2024-01-20&rdquo;,
        },
        {
          id: &ldquo;2&rdquo;,
          name: &ldquo;TechSolutions Bolivia&rdquo;,
          description: &ldquo;Consultoría en transformación digital para empresas&rdquo;,
          logo: &ldquo;/placeholder.svg?height=60&width=60&rdquo;,
          industry: &ldquo;Tecnología&rdquo;,
          size: &ldquo;11-50 empleados&rdquo;,
          founded: &ldquo;2020&rdquo;,
          website: &ldquo;https://techsolutions.bo&rdquo;,
          email: &ldquo;info@techsolutions.bo&rdquo;,
          phone: &ldquo;+591 4 4567890&rdquo;,
          address: &ldquo;Calle Comercio 123&rdquo;,
          city: &ldquo;Cochabamba&rdquo;,
          country: &ldquo;Bolivia&rdquo;,
          status: &ldquo;ACTIVE&rdquo;,
          employees: 45,
          revenue: 850000,
          growth: 28,
          createdAt: &ldquo;2024-01-10&rdquo;,
          updatedAt: &ldquo;2024-01-18&rdquo;,
        },
        {
          id: &ldquo;3&rdquo;,
          name: &ldquo;FinanceGroup SA&rdquo;,
          description: &ldquo;Servicios financieros y consultoría empresarial&rdquo;,
          logo: &ldquo;/placeholder.svg?height=60&width=60&rdquo;,
          industry: &ldquo;Finanzas&rdquo;,
          size: &ldquo;201-500 empleados&rdquo;,
          founded: &ldquo;2015&rdquo;,
          website: &ldquo;https://financegroup.bo&rdquo;,
          email: &ldquo;contacto@financegroup.bo&rdquo;,
          phone: &ldquo;+591 3 3456789&rdquo;,
          address: &ldquo;Av. San Martín 456&rdquo;,
          city: &ldquo;Santa Cruz&rdquo;,
          country: &ldquo;Bolivia&rdquo;,
          status: &ldquo;ACTIVE&rdquo;,
          employees: 289,
          revenue: 4200000,
          growth: 15,
          createdAt: &ldquo;2024-01-05&rdquo;,
          updatedAt: &ldquo;2024-01-15&rdquo;,
        },
        {
          id: &ldquo;4&rdquo;,
          name: &ldquo;EcoVerde Ltda&rdquo;,
          description: &ldquo;Soluciones ambientales y energías renovables&rdquo;,
          logo: &ldquo;/placeholder.svg?height=60&width=60&rdquo;,
          industry: &ldquo;Medio Ambiente&rdquo;,
          size: &ldquo;11-50 empleados&rdquo;,
          founded: &ldquo;2021&rdquo;,
          website: &ldquo;https://ecoverde.bo&rdquo;,
          email: &ldquo;info@ecoverde.bo&rdquo;,
          phone: &ldquo;+591 2 2987654&rdquo;,
          address: &ldquo;Zona Sur, Calle 21&rdquo;,
          city: &ldquo;La Paz&rdquo;,
          country: &ldquo;Bolivia&rdquo;,
          status: &ldquo;PENDING&rdquo;,
          employees: 23,
          revenue: 320000,
          growth: 45,
          createdAt: &ldquo;2024-01-01&rdquo;,
          updatedAt: &ldquo;2024-01-12&rdquo;,
        },
      ]

      const filteredCompanies = mockCompanies.filter((company) => {
        const matchesIndustry = industryFilter === &ldquo;all&rdquo; || company.industry === industryFilter
        const matchesStatus = statusFilter === &ldquo;all&rdquo; || company.status.toLowerCase() === statusFilter
        return matchesIndustry && matchesStatus
      })

      setCompanies(filteredCompanies)
      setStats({
        total: mockCompanies.length,
        active: mockCompanies.filter((c) => c.status === &ldquo;ACTIVE&rdquo;).length,
        inactive: mockCompanies.filter((c) => c.status === &ldquo;INACTIVE&rdquo;).length,
        pending: mockCompanies.filter((c) => c.status === &ldquo;PENDING&rdquo;).length,
        totalEmployees: mockCompanies.reduce((sum, c) => sum + c.employees, 0),
        totalRevenue: mockCompanies.reduce((sum, c) => sum + c.revenue, 0),
      })
    } catch (error) {
      console.error(&ldquo;Error fetching companies:&rdquo;, error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setLogoPreview(result)
        setFormData({ ...formData, logo: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(&ldquo;&rdquo;)
    setFormData({ ...formData, logo: &ldquo;&rdquo; })
  }

  const resetForm = () => {
    setFormData({
      name: &ldquo;&rdquo;,
      description: &ldquo;&rdquo;,
      logo: &ldquo;&rdquo;,
      industry: &ldquo;&rdquo;,
      size: &ldquo;&rdquo;,
      founded: &ldquo;&rdquo;,
      website: &ldquo;&rdquo;,
      email: &ldquo;&rdquo;,
      phone: &ldquo;&rdquo;,
      address: &ldquo;&rdquo;,
      city: &ldquo;&rdquo;,
      country: &ldquo;Bolivia&rdquo;,
      status: &ldquo;ACTIVE&rdquo;,
      employees: 0,
      revenue: 0,
      growth: 0,
    })
    setLogoFile(null)
    setLogoPreview(&ldquo;&rdquo;)
  }

  const handleCreate = async () => {
    try {
      const newCompany: Company = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
  
      console.log(&ldquo;Creating company:&rdquo;, newCompany)
  
      // Aquí iría la lógica para guardar la empresa (API o localStorage)
      // Por ahora lo dejamos simulado
  
      setShowCreateDialog(false) // cierra el modal de creación
      resetForm()
      fetchCompanies()
      setSuccessDialogOpen(true) // abre el modal de éxito
      setTimeout(() => {
        setShowCreateDialog(true)
      }, 200) 
    } catch (error) {
      console.error(&ldquo;Error creating company:&rdquo;, error)
    }
  }
  

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setFormData(company)
    setLogoPreview(company.logo)
    setShowEditDialog(true)
  }

  const handleUpdate = async () => {
    try {
      const updatedCompany = {
        ...formData,
        id: selectedCompany?.id,
        updatedAt: new Date().toISOString(),
      }

      console.log(&ldquo;Updating company:&rdquo;, updatedCompany)
      setShowEditDialog(false)
      setSelectedCompany(null)
      resetForm()
      fetchCompanies()
    } catch (error) {
      console.error(&ldquo;Error updating company:&rdquo;, error)
    }
  }

  const handleDelete = async () => {
    try {
      console.log(&ldquo;Deleting company:&rdquo;, selectedCompany?.id)
      setShowDeleteDialog(false)
      setSelectedCompany(null)
      fetchCompanies()
    } catch (error) {
      console.error(&ldquo;Error deleting company:&rdquo;, error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case &ldquo;ACTIVE&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;
      case &ldquo;INACTIVE&rdquo;:
        return &ldquo;bg-red-100 text-red-800&rdquo;
      case &ldquo;PENDING&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case &ldquo;ACTIVE&rdquo;:
        return &ldquo;Activa&rdquo;
      case &ldquo;INACTIVE&rdquo;:
        return &ldquo;Inactiva&rdquo;
      case &ldquo;PENDING&rdquo;:
        return &ldquo;Pendiente&rdquo;
      default:
        return status
    }
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className=&ldquo;space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Gestión de Empresas</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>Administra todas las empresas registradas en la plataforma</p>
        </div>
        <div className=&ldquo;flex gap-2&rdquo;>
          <Button variant=&ldquo;outline&rdquo;>
            <Download className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Exportar
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className=&ldquo;w-4 h-4 mr-2&rdquo; />
                Nueva Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className=&ldquo;max-w-4xl max-h-[90vh] overflow-y-auto&rdquo;>
              <DialogHeader>
                <DialogTitle>Crear Nueva Empresa</DialogTitle>
                <DialogDescription>Registra una nueva empresa en la plataforma</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue=&ldquo;basic&rdquo; className=&ldquo;w-full&rdquo;>
                <TabsList className=&ldquo;grid w-full grid-cols-3&rdquo;>
                  <TabsTrigger value=&ldquo;basic&rdquo;>Información Básica</TabsTrigger>
                  <TabsTrigger value=&ldquo;contact&rdquo;>Contacto</TabsTrigger>
                  <TabsTrigger value=&ldquo;metrics&rdquo;>Métricas</TabsTrigger>
                </TabsList>

                <TabsContent value=&ldquo;basic&rdquo; className=&ldquo;space-y-4&rdquo;>
                  {/* Logo Upload */}
                  <div className=&ldquo;grid gap-2&rdquo;>
                    <Label>Logo de la Empresa</Label>
                    {logoPreview ? (
                      <div className=&ldquo;relative w-24 h-24&rdquo;>
                        <Avatar className=&ldquo;w-24 h-24&rdquo;>
                          <AvatarImage src={logoPreview || &ldquo;/placeholder.svg&rdquo;} alt=&ldquo;Logo preview&rdquo; />
                          <AvatarFallback>
                            <Building2 className=&ldquo;w-8 h-8&rdquo; />
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size=&ldquo;sm&rdquo;
                          variant=&ldquo;destructive&rdquo;
                          className=&ldquo;absolute -top-2 -right-2 h-6 w-6 rounded-full p-0&rdquo;
                          onClick={removeLogo}
                        >
                          <X className=&ldquo;w-3 h-3&rdquo; />
                        </Button>
                      </div>
                    ) : (
                      <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-32&rdquo;>
                        <Building2 className=&ldquo;w-8 h-8 text-gray-400 mx-auto mb-2&rdquo; />
                        <Input
                          type=&ldquo;file&rdquo;
                          accept=&ldquo;image/*&rdquo;
                          onChange={handleLogoUpload}
                          className=&ldquo;hidden&rdquo;
                          id=&ldquo;logo-upload&rdquo;
                        />
                        <Label
                          htmlFor=&ldquo;logo-upload&rdquo;
                          className=&ldquo;cursor-pointer text-sm text-blue-600 hover:text-blue-800&rdquo;
                        >
                          Subir Logo
                        </Label>
                      </div>
                    )}
                  </div>

                  <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;name&rdquo;>Nombre de la Empresa *</Label>
                      <Input
                        id=&ldquo;name&rdquo;
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder=&ldquo;Ej: Cemse Innovación&rdquo;
                      />
                    </div>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;founded&rdquo;>Año de Fundación</Label>
                      <Input
                        id=&ldquo;founded&rdquo;
                        value={formData.founded}
                        onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                        placeholder=&ldquo;2018&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid gap-2&rdquo;>
                    <Label htmlFor=&ldquo;description&rdquo;>Descripción</Label>
                    <Textarea
                      id=&ldquo;description&rdquo;
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder=&ldquo;Descripción de la empresa...&rdquo;
                      rows={3}
                    />
                  </div>

                  <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;industry&rdquo;>Sector</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData({ ...formData, industry: value })}
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
                          <SelectItem value=&ldquo;Medio Ambiente&rdquo;>Medio Ambiente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;size&rdquo;>Tamaño</Label>
                      <Select
                        value={formData.size}
                        onValueChange={(value) => setFormData({ ...formData, size: value })}
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

                  <div className=&ldquo;grid gap-2&rdquo;>
                    <Label htmlFor=&ldquo;status&rdquo;>Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as Company[&ldquo;status&rdquo;] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=&ldquo;ACTIVE&rdquo;>Activa</SelectItem>
                        <SelectItem value=&ldquo;PENDING&rdquo;>Pendiente</SelectItem>
                        <SelectItem value=&ldquo;INACTIVE&rdquo;>Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value=&ldquo;contact&rdquo; className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;website&rdquo;>Sitio Web</Label>
                      <Input
                        id=&ldquo;website&rdquo;
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder=&ldquo;https://empresa.com&rdquo;
                      />
                    </div>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;email&rdquo;>Email</Label>
                      <Input
                        id=&ldquo;email&rdquo;
                        type=&ldquo;email&rdquo;
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder=&ldquo;contacto@empresa.com&rdquo;
                      />
                    </div>
                  </div>

                  <div className=&ldquo;grid gap-2&rdquo;>
                    <Label htmlFor=&ldquo;phone&rdquo;>Teléfono</Label>
                    <Input
                      id=&ldquo;phone&rdquo;
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder=&ldquo;+591 2 2345678&rdquo;
                    />
                  </div>

                  <div className=&ldquo;grid gap-2&rdquo;>
                    <Label htmlFor=&ldquo;address&rdquo;>Dirección</Label>
                    <Input
                      id=&ldquo;address&rdquo;
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder=&ldquo;Av. Principal 123&rdquo;
                    />
                  </div>

                  <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;city&rdquo;>Ciudad</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => setFormData({ ...formData, city: value })}
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
                          <SelectItem value=&ldquo;Beni&rdquo;>Beni</SelectItem>
                          <SelectItem value=&ldquo;Pando&rdquo;>Pando</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;country&rdquo;>País</Label>
                      <Input
                        id=&ldquo;country&rdquo;
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder=&ldquo;Bolivia&rdquo;
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value=&ldquo;metrics&rdquo; className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-3 gap-4&rdquo;>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;employees&rdquo;>Número de Empleados</Label>
                      <Input
                        id=&ldquo;employees&rdquo;
                        type=&ldquo;number&rdquo;
                        value={formData.employees}
                        onChange={(e) => setFormData({ ...formData, employees: Number.parseInt(e.target.value) || 0 })}
                        placeholder=&ldquo;0&rdquo;
                      />
                    </div>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;revenue&rdquo;>Ingresos Anuales (Bs.)</Label>
                      <Input
                        id=&ldquo;revenue&rdquo;
                        type=&ldquo;number&rdquo;
                        value={formData.revenue}
                        onChange={(e) => setFormData({ ...formData, revenue: Number.parseInt(e.target.value) || 0 })}
                        placeholder=&ldquo;0&rdquo;
                      />
                    </div>
                    <div className=&ldquo;grid gap-2&rdquo;>
                      <Label htmlFor=&ldquo;growth&rdquo;>Crecimiento (%)</Label>
                      <Input
                        id=&ldquo;growth&rdquo;
                        type=&ldquo;number&rdquo;
                        value={formData.growth}
                        onChange={(e) => setFormData({ ...formData, growth: Number.parseInt(e.target.value) || 0 })}
                        placeholder=&ldquo;0&rdquo;
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className=&ldquo;flex justify-end gap-2 pt-4&rdquo;>
                <Button variant=&ldquo;outline&rdquo; onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={!formData.name}>
                  Crear Empresa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-6 gap-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Empresas</CardTitle>
            <Building2 className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-yellow-600&rdquo;>{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Inactivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold text-red-600&rdquo;>{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Empleados</CardTitle>
            <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalEmployees.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Ingresos Totales</CardTitle>
            <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>Bs. {(stats.totalRevenue / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;flex gap-4&rdquo;>
            <div className=&ldquo;flex-1&rdquo;>
              <Input
                placeholder=&ldquo;Buscar empresas...&rdquo;
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=&ldquo;max-w-sm&rdquo;
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className=&ldquo;w-[180px]&rdquo;>
                <SelectValue placeholder=&ldquo;Sector&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos los sectores</SelectItem>
                <SelectItem value=&ldquo;Tecnología&rdquo;>Tecnología</SelectItem>
                <SelectItem value=&ldquo;Finanzas&rdquo;>Finanzas</SelectItem>
                <SelectItem value=&ldquo;Salud&rdquo;>Salud</SelectItem>
                <SelectItem value=&ldquo;Medio Ambiente&rdquo;>Medio Ambiente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className=&ldquo;w-[180px]&rdquo;>
                <SelectValue placeholder=&ldquo;Estado&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos los estados</SelectItem>
                <SelectItem value=&ldquo;active&rdquo;>Activas</SelectItem>
                <SelectItem value=&ldquo;pending&rdquo;>Pendientes</SelectItem>
                <SelectItem value=&ldquo;inactive&rdquo;>Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>Gestiona todas las empresas registradas en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className=&ldquo;text-center py-8&rdquo;>
                    Cargando empresas...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className=&ldquo;text-center py-8&rdquo;>
                    No se encontraron empresas
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className=&ldquo;flex items-center gap-3&rdquo;>
                        <Avatar className=&ldquo;w-10 h-10&rdquo;>
                          <AvatarImage src={company.logo || &ldquo;/placeholder.svg&rdquo;} alt={company.name} />
                          <AvatarFallback>
                            <Building2 className=&ldquo;w-4 h-4&rdquo; />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className=&ldquo;font-medium&rdquo;>{company.name}</div>
                          <div className=&ldquo;text-sm text-muted-foreground line-clamp-1&rdquo;>{company.description}</div>
                          <div className=&ldquo;text-xs text-muted-foreground&rdquo;>Fundada en {company.founded}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant=&ldquo;secondary&rdquo;>{company.industry}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <MapPin className=&ldquo;w-3 h-3&rdquo; />
                        <span className=&ldquo;text-sm&rdquo;>
                          {company.city}, {company.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>{getStatusText(company.status)}</Badge>
                    </TableCell>
                    {/* <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <Users className=&ldquo;w-3 h-3&rdquo; />
                        <span>{company.employees}</span>
                      </div>
                    </TableCell> */}
                    {/* <TableCell>
                      <div className=&ldquo;text-sm&rdquo;>
                        <div>Bs. {company.revenue.toLocaleString()}</div>
                        <div className=&ldquo;text-green-600&rdquo;>+{company.growth}%</div>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                            <MoreVertical className=&ldquo;w-4 h-4&rdquo; />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Edit className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className=&ldquo;text-red-600&rdquo;
                            onClick={() => {
                              setSelectedCompany(company)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className=&ldquo;w-4 h-4 mr-2&rdquo; />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className=&ldquo;max-w-4xl max-h-[90vh] overflow-y-auto&rdquo;>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>Modifica la información de {selectedCompany?.name}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue=&ldquo;basic&rdquo; className=&ldquo;w-full&rdquo;>
            <TabsList className=&ldquo;grid w-full grid-cols-3&rdquo;>
              <TabsTrigger value=&ldquo;basic&rdquo;>Información Básica</TabsTrigger>
              <TabsTrigger value=&ldquo;contact&rdquo;>Contacto</TabsTrigger>
              <TabsTrigger value=&ldquo;metrics&rdquo;>Métricas</TabsTrigger>
            </TabsList>

            <TabsContent value=&ldquo;basic&rdquo; className=&ldquo;space-y-4&rdquo;>
              {/* Same form fields as create, but with formData values */}
              <div className=&ldquo;grid gap-2&rdquo;>
                <Label>Logo de la Empresa</Label>
                {logoPreview ? (
                  <div className=&ldquo;relative w-24 h-24&rdquo;>
                    <Avatar className=&ldquo;w-24 h-24&rdquo;>
                      <AvatarImage src={logoPreview || &ldquo;/placeholder.svg&rdquo;} alt=&ldquo;Logo preview&rdquo; />
                      <AvatarFallback>
                        <Building2 className=&ldquo;w-8 h-8&rdquo; />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size=&ldquo;sm&rdquo;
                      variant=&ldquo;destructive&rdquo;
                      className=&ldquo;absolute -top-2 -right-2 h-6 w-6 rounded-full p-0&rdquo;
                      onClick={removeLogo}
                    >
                      <X className=&ldquo;w-3 h-3&rdquo; />
                    </Button>
                  </div>
                ) : (
                  <div className=&ldquo;border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-32&rdquo;>
                    <Building2 className=&ldquo;w-8 h-8 text-gray-400 mx-auto mb-2&rdquo; />
                    <Input
                      type=&ldquo;file&rdquo;
                      accept=&ldquo;image/*&rdquo;
                      onChange={handleLogoUpload}
                      className=&ldquo;hidden&rdquo;
                      id=&ldquo;logo-upload-edit&rdquo;
                    />
                    <Label
                      htmlFor=&ldquo;logo-upload-edit&rdquo;
                      className=&ldquo;cursor-pointer text-sm text-blue-600 hover:text-blue-800&rdquo;
                    >
                      Subir Logo
                    </Label>
                  </div>
                )}
              </div>

              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;edit-name&rdquo;>Nombre de la Empresa *</Label>
                  <Input
                    id=&ldquo;edit-name&rdquo;
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label htmlFor=&ldquo;edit-founded&rdquo;>Año de Fundación</Label>
                  <Input
                    id=&ldquo;edit-founded&rdquo;
                    value={formData.founded}
                    onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  />
                </div>
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label htmlFor=&ldquo;edit-description&rdquo;>Descripción</Label>
                <Textarea
                  id=&ldquo;edit-description&rdquo;
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Sector</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
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
                      <SelectItem value=&ldquo;Medio Ambiente&rdquo;>Medio Ambiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Company[&ldquo;status&rdquo;] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;ACTIVE&rdquo;>Activa</SelectItem>
                      <SelectItem value=&ldquo;PENDING&rdquo;>Pendiente</SelectItem>
                      <SelectItem value=&ldquo;INACTIVE&rdquo;>Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;contact&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Sitio Web</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Email</Label>
                  <Input
                    type=&ldquo;email&rdquo;
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label>Teléfono</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>

              <div className=&ldquo;grid gap-2&rdquo;>
                <Label>Dirección</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Ciudad</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&ldquo;La Paz&rdquo;>La Paz</SelectItem>
                      <SelectItem value=&ldquo;Santa Cruz&rdquo;>Santa Cruz</SelectItem>
                      <SelectItem value=&ldquo;Cochabamba&rdquo;>Cochabamba</SelectItem>
                      <SelectItem value=&ldquo;Sucre&rdquo;>Sucre</SelectItem>
                      <SelectItem value=&ldquo;Potosí&rdquo;>Potosí</SelectItem>
                      <SelectItem value=&ldquo;Oruro&rdquo;>Oruro</SelectItem>
                      <SelectItem value=&ldquo;Tarija&rdquo;>Tarija</SelectItem>
                      <SelectItem value=&ldquo;Beni&rdquo;>Beni</SelectItem>
                      <SelectItem value=&ldquo;Pando&rdquo;>Pando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>País</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;metrics&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;grid grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Número de Empleados</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={formData.employees}
                    onChange={(e) => setFormData({ ...formData, employees: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Ingresos Anuales (Bs.)</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className=&ldquo;grid gap-2&rdquo;>
                  <Label>Crecimiento (%)</Label>
                  <Input
                    type=&ldquo;number&rdquo;
                    value={formData.growth}
                    onChange={(e) => setFormData({ ...formData, growth: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className=&ldquo;flex justify-end gap-2 pt-4&rdquo;>
            <Button
              variant=&ldquo;outline&rdquo;
              onClick={() => {
                setShowEditDialog(false)
                setSelectedCompany(null)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Actualizar Empresa</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la empresa &ldquo;{selectedCompany?.name}&rdquo; y
              todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCompany(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className=&ldquo;bg-red-600 hover:bg-red-700&rdquo;>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>¡Empresa creada!</DialogTitle>
      <DialogDescription>
        La empresa fue registrada exitosamente en el sistema.
      </DialogDescription>
    </DialogHeader>
    <div className=&ldquo;flex justify-end&rdquo;>
      <Button onClick={() => setSuccessDialogOpen(false)}>Cerrar</Button>
    </div>
  </DialogContent>
</Dialog>

    </div>

    
  )
}
