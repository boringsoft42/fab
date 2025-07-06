"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  Users,
  TrendingUp,
  MapPin,
  Download,
  X,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Company {
  id: string;
  name: string;
  description: string;
  logo: string;
  industry: string;
  size: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  employees: number;
  revenue: number;
  growth: number;
  createdAt: string;
  updatedAt: string;
}

export default function CompaniesManagementPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    totalEmployees: 0,
    totalRevenue: 0,
  });

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    description: "",
    logo: "",
    industry: "",
    size: "",
    founded: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Bolivia",
    status: "ACTIVE",
    employees: 0,
    revenue: 0,
    growth: 0,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      // Simulated data
      const mockCompanies: Company[] = [
        {
          id: "1",
          name: "Cemse Innovación",
          description:
            "Empresa líder en desarrollo de soluciones tecnológicas innovadoras",
          logo: "/placeholder.svg?height=60&width=60",
          industry: "Tecnología",
          size: "51-200 empleados",
          founded: "2018",
          website: "https://cemse.com.bo",
          email: "contacto@cemse.com.bo",
          phone: "+591 2 2345678",
          address: "Av. Arce 2345, Torre Empresarial",
          city: "La Paz",
          country: "Bolivia",
          status: "ACTIVE",
          employees: 127,
          revenue: 2500000,
          growth: 35,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
        },
        {
          id: "2",
          name: "TechSolutions Bolivia",
          description: "Consultoría en transformación digital para empresas",
          logo: "/placeholder.svg?height=60&width=60",
          industry: "Tecnología",
          size: "11-50 empleados",
          founded: "2020",
          website: "https://techsolutions.bo",
          email: "info@techsolutions.bo",
          phone: "+591 4 4567890",
          address: "Calle Comercio 123",
          city: "Cochabamba",
          country: "Bolivia",
          status: "ACTIVE",
          employees: 45,
          revenue: 850000,
          growth: 28,
          createdAt: "2024-01-10",
          updatedAt: "2024-01-18",
        },
        {
          id: "3",
          name: "FinanceGroup SA",
          description: "Servicios financieros y consultoría empresarial",
          logo: "/placeholder.svg?height=60&width=60",
          industry: "Finanzas",
          size: "201-500 empleados",
          founded: "2015",
          website: "https://financegroup.bo",
          email: "contacto@financegroup.bo",
          phone: "+591 3 3456789",
          address: "Av. San Martín 456",
          city: "Santa Cruz",
          country: "Bolivia",
          status: "ACTIVE",
          employees: 289,
          revenue: 4200000,
          growth: 15,
          createdAt: "2024-01-05",
          updatedAt: "2024-01-15",
        },
        {
          id: "4",
          name: "EcoVerde Ltda",
          description: "Soluciones ambientales y energías renovables",
          logo: "/placeholder.svg?height=60&width=60",
          industry: "Medio Ambiente",
          size: "11-50 empleados",
          founded: "2021",
          website: "https://ecoverde.bo",
          email: "info@ecoverde.bo",
          phone: "+591 2 2987654",
          address: "Zona Sur, Calle 21",
          city: "La Paz",
          country: "Bolivia",
          status: "PENDING",
          employees: 23,
          revenue: 320000,
          growth: 45,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-12",
        },
      ];

      const filteredCompanies = mockCompanies.filter((company) => {
        const matchesIndustry =
          industryFilter === "all" || company.industry === industryFilter;
        const matchesStatus =
          statusFilter === "all" ||
          company.status.toLowerCase() === statusFilter;
        return matchesIndustry && matchesStatus;
      });

      setCompanies(filteredCompanies);
      setStats({
        total: mockCompanies.length,
        active: mockCompanies.filter((c) => c.status === "ACTIVE").length,
        inactive: mockCompanies.filter((c) => c.status === "INACTIVE").length,
        pending: mockCompanies.filter((c) => c.status === "PENDING").length,
        totalEmployees: mockCompanies.reduce((sum, c) => sum + c.employees, 0),
        totalRevenue: mockCompanies.reduce((sum, c) => sum + c.revenue, 0),
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, [industryFilter, statusFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData({ ...formData, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData({ ...formData, logo: "" });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      industry: "",
      size: "",
      founded: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Bolivia",
      status: "ACTIVE",
      employees: 0,
      revenue: 0,
      growth: 0,
    });
    setLogoFile(null);
    setLogoPreview("");
  };

  const handleCreate = async () => {
    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.industry ||
        !formData.size ||
        !formData.founded ||
        !formData.website ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.country ||
        !formData.status
      ) {
        // Show error toast or handle incomplete data
        return;
      }

      const newCompany: Company = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        logo: formData.logo || "/placeholder.svg",
        industry: formData.industry,
        size: formData.size,
        founded: formData.founded,
        website: formData.website,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        status: formData.status,
        employees: formData.employees || 0,
        revenue: formData.revenue || 0,
        growth: formData.growth || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Creating company:", newCompany);

      // Aquí iría la lógica para guardar la empresa (API o localStorage)
      // Por ahora lo dejamos simulado

      setShowCreateDialog(false); // cierra el modal de creación
      resetForm();
      fetchCompanies();
      setSuccessDialogOpen(true); // abre el modal de éxito
      setTimeout(() => {
        setShowCreateDialog(true);
      }, 200);
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData(company);
    setLogoPreview(company.logo);
    setShowEditDialog(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedCompany = {
        ...formData,
        id: selectedCompany?.id,
        updatedAt: new Date().toISOString(),
      };

      console.log("Updating company:", updatedCompany);
      setShowEditDialog(false);
      setSelectedCompany(null);
      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log("Deleting company:", selectedCompany?.id);
      setShowDeleteDialog(false);
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Activa";
      case "INACTIVE":
        return "Inactiva";
      case "PENDING":
        return "Pendiente";
      default:
        return status;
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Empresas</h1>
          <p className="text-muted-foreground">
            Administra todas las empresas registradas en la plataforma
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Empresa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Empresa</DialogTitle>
                <DialogDescription>
                  Registra una nueva empresa en la plataforma
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="contact">Contacto</TabsTrigger>
                  <TabsTrigger value="metrics">Métricas</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  {/* Logo Upload */}
                  <div className="grid gap-2">
                    <Label>Logo de la Empresa</Label>
                    {logoPreview ? (
                      <div className="relative w-24 h-24">
                        <Avatar className="w-24 h-24">
                          <AvatarImage
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo preview"
                          />
                          <AvatarFallback>
                            <Building2 className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeLogo}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-32">
                        <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Label
                          htmlFor="logo-upload"
                          className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                        >
                          Subir Logo
                        </Label>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre de la Empresa *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Ej: Cemse Innovación"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="founded">Año de Fundación</Label>
                      <Input
                        id="founded"
                        value={formData.founded}
                        onChange={(e) =>
                          setFormData({ ...formData, founded: e.target.value })
                        }
                        placeholder="2018"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Descripción de la empresa..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="industry">Sector</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          setFormData({ ...formData, industry: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tecnología">Tecnología</SelectItem>
                          <SelectItem value="Finanzas">Finanzas</SelectItem>
                          <SelectItem value="Salud">Salud</SelectItem>
                          <SelectItem value="Educación">Educación</SelectItem>
                          <SelectItem value="Manufactura">
                            Manufactura
                          </SelectItem>
                          <SelectItem value="Servicios">Servicios</SelectItem>
                          <SelectItem value="Medio Ambiente">
                            Medio Ambiente
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="size">Tamaño</Label>
                      <Select
                        value={formData.size}
                        onValueChange={(value) =>
                          setFormData({ ...formData, size: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10 empleados">
                            1-10 empleados
                          </SelectItem>
                          <SelectItem value="11-50 empleados">
                            11-50 empleados
                          </SelectItem>
                          <SelectItem value="51-200 empleados">
                            51-200 empleados
                          </SelectItem>
                          <SelectItem value="201-500 empleados">
                            201-500 empleados
                          </SelectItem>
                          <SelectItem value="500+ empleados">
                            500+ empleados
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as Company["status"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Activa</SelectItem>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="INACTIVE">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="https://empresa.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="contacto@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+591 2 2345678"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Av. Principal 123"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          setFormData({ ...formData, city: value })
                        }
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
                          <SelectItem value="Beni">Beni</SelectItem>
                          <SelectItem value="Pando">Pando</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        placeholder="Bolivia"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="employees">Número de Empleados</Label>
                      <Input
                        id="employees"
                        type="number"
                        value={formData.employees}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employees: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="revenue">Ingresos Anuales (Bs.)</Label>
                      <Input
                        id="revenue"
                        type="number"
                        value={formData.revenue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            revenue: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="growth">Crecimiento (%)</Label>
                      <Input
                        id="growth"
                        type="number"
                        value={formData.growth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            growth: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empresas
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Empleados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEmployees.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Bs. {(stats.totalRevenue / 1000000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar empresas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
                <SelectItem value="Finanzas">Finanzas</SelectItem>
                <SelectItem value="Salud">Salud</SelectItem>
                <SelectItem value="Medio Ambiente">Medio Ambiente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>
            Gestiona todas las empresas registradas en la plataforma
          </CardDescription>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    Cargando empresas...
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No se encontraron empresas
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={company.logo || "/placeholder.svg"}
                            alt={company.name}
                          />
                          <AvatarFallback>
                            <Building2 className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {company.description}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Fundada en {company.founded}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{company.industry}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">
                          {company.city}, {company.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>
                        {getStatusText(company.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(company)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Modifica la información de {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="contact">Contacto</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Same form fields as create, but with formData values */}
              <div className="grid gap-2">
                <Label>Logo de la Empresa</Label>
                {logoPreview ? (
                  <div className="relative w-24 h-24">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                      />
                      <AvatarFallback>
                        <Building2 className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeLogo}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center w-32">
                    <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload-edit"
                    />
                    <Label
                      htmlFor="logo-upload-edit"
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                    >
                      Subir Logo
                    </Label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre de la Empresa *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-founded">Año de Fundación</Label>
                  <Input
                    id="edit-founded"
                    value={formData.founded}
                    onChange={(e) =>
                      setFormData({ ...formData, founded: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Sector</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData({ ...formData, industry: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tecnología">Tecnología</SelectItem>
                      <SelectItem value="Finanzas">Finanzas</SelectItem>
                      <SelectItem value="Salud">Salud</SelectItem>
                      <SelectItem value="Educación">Educación</SelectItem>
                      <SelectItem value="Manufactura">Manufactura</SelectItem>
                      <SelectItem value="Servicios">Servicios</SelectItem>
                      <SelectItem value="Medio Ambiente">
                        Medio Ambiente
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as Company["status"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Activa</SelectItem>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="INACTIVE">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Sitio Web</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Dirección</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Ciudad</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="La Paz">La Paz</SelectItem>
                      <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                      <SelectItem value="Cochabamba">Cochabamba</SelectItem>
                      <SelectItem value="Sucre">Sucre</SelectItem>
                      <SelectItem value="Potosí">Potosí</SelectItem>
                      <SelectItem value="Oruro">Oruro</SelectItem>
                      <SelectItem value="Tarija">Tarija</SelectItem>
                      <SelectItem value="Beni">Beni</SelectItem>
                      <SelectItem value="Pando">Pando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>País</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Número de Empleados</Label>
                  <Input
                    type="number"
                    value={formData.employees}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employees: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Ingresos Anuales (Bs.)</Label>
                  <Input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        revenue: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Crecimiento (%)</Label>
                  <Input
                    type="number"
                    value={formData.growth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        growth: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setSelectedCompany(null);
                resetForm();
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
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              empresa &quot;{selectedCompany?.name}&quot; y todos sus datos
              asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCompany(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
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
          <div className="flex justify-end">
            <Button onClick={() => setSuccessDialogOpen(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
