"use client";

import { useState } from "react";
import { useCompaniesByMunicipality, useCreateCompany, useUpdateCompany, useDeleteCompany, useCompanyStats } from "@/hooks/useCompanyApi";
import { useCurrentMunicipality } from "@/hooks/useMunicipalityApi";
import { useUserColors } from "@/hooks/use-user-colors";
import { TestColorTheme } from "@/components/test-color-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Users, TrendingUp, DollarSign, Calendar, MapPin, Phone, Mail, Globe, CheckCircle, XCircle, Clock, AlertCircle, Copy, Check } from "lucide-react";
import type { Company } from "@/services/company-api.service";
import type { Municipality } from "@/types/municipality";
import { generateCompanyCredentials } from "@/lib/utils/generate-credentials";

// Interfaces
interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface User {
  id: number;
  email: string;
  profile: Profile;
  createdAt: string;
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string }>({ username: '', password: '' });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Usar el hook para aplicar las variables CSS automáticamente
  const colors = useUserColors();
  
  console.log('🏢 CompaniesPage - Colors applied:', {
    primaryColor: colors.primaryColor,
    secondaryColor: colors.secondaryColor
  });

  // Obtener el municipio actual del usuario
  const { data: currentMunicipality, isLoading: municipalityLoading } = useCurrentMunicipality();

  // Hooks de datos - usar empresas del municipio actual
  const { data: companies = [], isLoading: companiesLoading } = useCompaniesByMunicipality(
    currentMunicipality?.id || ""
  );
  const { data: stats } = useCompanyStats();
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();
  const deleteCompanyMutation = useDeleteCompany();

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    businessSector: "",
    companySize: "",
    foundedYear: new Date().getFullYear(),
    municipalityId: currentMunicipality?.id || "",
    email: "",
    phone: "",
    website: "",
    address: ""
  });

  // Filtros - solo por búsqueda y estado, no por municipio
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (company.businessSector?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || !statusFilter || 
                         (statusFilter === "active" && company.isActive) ||
                         (statusFilter === "inactive" && !company.isActive);

    return matchesSearch && matchesStatus;
  });

  // Estadísticas calculadas
  const calculatedStats = {
    totalCompanies: stats?.totalCompanies || 0,
    activeCompanies: stats?.activeCompanies || 0,
    inactiveCompanies: stats?.inactiveCompanies || 0,
    pendingCompanies: stats?.pendingCompanies || 0,
    totalEmployees: stats?.totalEmployees || 0,
    totalRevenue: stats?.totalRevenue || 0
  };

  // Handlers
  const handleCreateCompany = () => {
    // Usar las credenciales del estado (pueden ser generadas o escritas por el usuario)
    const companyName = formData.name.trim() || "empresa";
    const finalCredentials = credentials.username && credentials.password 
      ? credentials 
      : generateCompanyCredentials(companyName);
    
    createCompanyMutation.mutate({
      ...formData,
      municipalityId: currentMunicipality?.id || "",
      foundedYear: parseInt(formData.foundedYear.toString()),
      username: finalCredentials.username,
      password: finalCredentials.password
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          businessSector: "",
          companySize: "",
          foundedYear: new Date().getFullYear(),
          municipalityId: currentMunicipality?.id || "",
          email: "",
          phone: "",
          website: "",
          address: ""
        });
                 setCredentials({ username: '', password: '' });
      }
    });
  };

  const handleUpdateCompany = () => {
    if (!editingCompany) return;
    
    updateCompanyMutation.mutate({
      id: editingCompany.id,
      data: {
        ...formData,
        municipalityId: currentMunicipality?.id || "",
        foundedYear: parseInt(formData.foundedYear.toString())
      }
    }, {
      onSuccess: () => {
        setEditingCompany(null);
        setFormData({
          name: "",
          description: "",
          businessSector: "",
          companySize: "",
          foundedYear: new Date().getFullYear(),
          municipalityId: currentMunicipality?.id || "",
          email: "",
          phone: "",
          website: "",
          address: ""
        });
      }
    });
  };

  const handleDeleteCompany = (companyId: string) => {
    deleteCompanyMutation.mutate(companyId);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description || "",
      businessSector: company.businessSector || "",
      companySize: company.companySize || "",
      foundedYear: company.foundedYear || new Date().getFullYear(),
      municipalityId: currentMunicipality?.id || "",
      email: company.email || "",
      phone: company.phone || "",
      website: company.website || "",
      address: company.address || ""
    });
  };

  // Función para generar credenciales automáticamente
  const handleGenerateCredentials = () => {
    // Generar credenciales basadas en el nombre de la empresa o un nombre genérico
    const companyName = formData.name.trim() || "empresa";
    const generatedCredentials = generateCompanyCredentials(companyName);
    setCredentials(generatedCredentials);
  };

  // Función para copiar al portapapeles
  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  if (companiesLoading || municipalityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Test Component - Solo para verificar colores */}
      <TestColorTheme />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold"
            style={{ color: colors.primaryColor }}
          >
            Gestión de Empresas
          </h1>
          <p className="text-muted-foreground">
            Administra las empresas registradas en{' '}
            <span style={{ color: colors.secondaryColor, fontWeight: '600' }}>
              {currentMunicipality?.name || 'tu municipio'}
            </span>
          </p>
        </div>
        
                 <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
           setIsCreateDialogOpen(open);
           if (!open) {
             setCredentials({ username: '', password: '' });
             setCopiedField(null);
           }
         }}>
          <DialogTrigger asChild>
            <Button 
              style={{
                backgroundColor: colors.primaryColor,
                borderColor: colors.primaryColor
              }}
              className="hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Empresa
            </Button>
          </DialogTrigger>
                     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>Crear Nueva Empresa</DialogTitle>
             </DialogHeader>
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Empresa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ingrese el nombre de la empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessSector">Sector de Negocio</Label>
                <Input
                  id="businessSector"
                  value={formData.businessSector}
                  onChange={(e) => setFormData({...formData, businessSector: e.target.value})}
                  placeholder="Ej: Tecnología, Salud, Educación"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Tamaño de la Empresa</Label>
                <Select value={formData.companySize} onValueChange={(value) => setFormData({...formData, companySize: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MICRO">Micro (1-10 empleados)</SelectItem>
                    <SelectItem value="SMALL">Pequeña (11-50 empleados)</SelectItem>
                    <SelectItem value="MEDIUM">Mediana (51-250 empleados)</SelectItem>
                    <SelectItem value="LARGE">Grande (250+ empleados)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="foundedYear">Año de Fundación</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({...formData, foundedYear: parseInt(e.target.value)})}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contacto@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono de Contacto</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://www.empresa.com"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Dirección completa de la empresa"
                />
              </div>
                             <div className="space-y-2 col-span-2">
                 <Label htmlFor="description">Descripción</Label>
                 <Textarea
                   id="description"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                   placeholder="Descripción de la empresa y sus actividades"
                   rows={3}
                 />
               </div>
               
                               {/* Sección de Credenciales */}
                <div className="space-y-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Credenciales de Acceso</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateCredentials}
                    >
                      Generar Credenciales
                    </Button>
                  </div>
                  
                                     <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Usuario</Label>
                       <div className="flex items-center gap-2">
                         <Input
                           value={credentials.username}
                           onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                           className="font-mono text-sm"
                           placeholder="Escribe el usuario o genera automáticamente"
                         />
                         <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => credentials.username && handleCopyToClipboard(credentials.username, 'username')}
                           disabled={!credentials.username}
                         >
                           {copiedField === 'username' ? (
                             <Check className="h-4 w-4 text-green-600" />
                           ) : (
                             <Copy className="h-4 w-4" />
                           )}
                         </Button>
                       </div>
                     </div>
                     
                     <div className="space-y-2">
                       <Label className="text-sm font-medium">Contraseña</Label>
                       <div className="flex items-center gap-2">
                         <Input
                           value={credentials.password}
                           onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                           type="password"
                           className="font-mono text-sm"
                           placeholder="Escribe la contraseña o genera automáticamente"
                         />
                         <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => credentials.password && handleCopyToClipboard(credentials.password, 'password')}
                           disabled={!credentials.password}
                         >
                           {copiedField === 'password' ? (
                             <Check className="h-4 w-4 text-green-600" />
                           ) : (
                             <Copy className="h-4 w-4" />
                           )}
                         </Button>
                       </div>
                     </div>
                     
                     <div className="text-xs text-muted-foreground">
                       💡 Puedes escribir tus propias credenciales o usar el botón "Generar Credenciales" para crearlas automáticamente.
                     </div>
                   </div>
                </div>
             </div>
                         <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                 Cancelar
               </Button>
                               <Button 
                  onClick={handleCreateCompany} 
                  disabled={createCompanyMutation.isPending}
                >
                  {createCompanyMutation.isPending ? "Creando..." : "Crear Empresa"}
                </Button>
             </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empresas</CardTitle>
            <Building2 
              className="h-4 w-4" 
              style={{ color: colors.primaryColor }}
            />
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={{ color: colors.primaryColor }}
            >
              {calculatedStats.totalCompanies}
            </div>
            <p className="text-xs text-muted-foreground">
              Empresas registradas en el sistema
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
            <CheckCircle 
              className="h-4 w-4" 
              style={{ color: colors.secondaryColor }}
            />
          </CardHeader>
          <CardContent>
            <div 
              className="text-2xl font-bold"
              style={{ color: colors.secondaryColor }}
            >
              {calculatedStats.activeCompanies}
            </div>
            <p className="text-xs text-muted-foreground">
              Empresas operativas
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Inactivas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{calculatedStats.inactiveCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Empresas no operativas
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{calculatedStats.pendingCompanies}</div>
            <p className="text-xs text-muted-foreground">
              En proceso de verificación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-2 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle 
            className="text-lg font-semibold"
            style={{ color: colors.primaryColor }}
          >
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar Empresas</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, descripción o sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Filtrar por Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Empresas */}
      <Card className="border-2 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle 
            className="text-lg font-semibold"
            style={{ color: colors.secondaryColor }}
          >
            Lista de Empresas ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Municipio</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${company.name}&background=random`} />
                        <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Fundada en {company.foundedYear || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      style={{
                        borderColor: colors.primaryColor,
                        color: colors.primaryColor
                      }}
                    >
                      {company.businessSector || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{company.municipality.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: `${colors.secondaryColor}20`,
                        color: colors.secondaryColor
                      }}
                    >
                      {company.companySize || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={company.isActive ? "default" : "destructive"}
                      style={{
                        backgroundColor: company.isActive ? colors.secondaryColor : undefined,
                        color: company.isActive ? 'white' : undefined
                      }}
                    >
                      {company.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{company.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{company.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente la empresa "{company.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCompany(company.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edición */}
      <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre de la Empresa</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ingrese el nombre de la empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-businessSector">Sector de Negocio</Label>
              <Input
                id="edit-businessSector"
                value={formData.businessSector}
                onChange={(e) => setFormData({...formData, businessSector: e.target.value})}
                placeholder="Ej: Tecnología, Salud, Educación"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-companySize">Tamaño de la Empresa</Label>
              <Select value={formData.companySize} onValueChange={(value) => setFormData({...formData, companySize: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro (1-10 empleados)</SelectItem>
                  <SelectItem value="small">Pequeña (11-50 empleados)</SelectItem>
                  <SelectItem value="medium">Mediana (51-250 empleados)</SelectItem>
                  <SelectItem value="large">Grande (250+ empleados)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-foundedYear">Año de Fundación</Label>
              <Input
                id="edit-foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => setFormData({...formData, foundedYear: parseInt(e.target.value)})}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email de Contacto</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="contacto@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Teléfono de Contacto</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-website">Sitio Web</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://www.empresa.com"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-address">Dirección</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Dirección completa de la empresa"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descripción de la empresa y sus actividades"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingCompany(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateCompany} disabled={updateCompanyMutation.isPending}>
              {updateCompanyMutation.isPending ? "Actualizando..." : "Actualizar Empresa"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
