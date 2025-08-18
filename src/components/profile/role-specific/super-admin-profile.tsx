"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  User,
  Shield,
  Plus,
  Edit,
  Save,
  X,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Crown,
} from "lucide-react";
import type { Profile } from "@/types/profile";

interface SuperAdminProfileProps {
  profile: Profile;
}

export function SuperAdminProfile({ profile }: SuperAdminProfileProps) {
  const { refetch } = useCurrentUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    avatarUrl: profile.avatarUrl || "",
  });

  // Company creation form state
  const [companyForm, setCompanyForm] = useState({
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
    country: "",
  });

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Perfil actualizado",
          description: "Tu información ha sido actualizada exitosamente.",
        });
        setIsEditing(false);
        refetch();
      } else {
        throw new Error("Error al actualizar el perfil");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCompany = async () => {
    try {
      const response = await fetch("/api/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyForm),
      });

      if (response.ok) {
        toast({
          title: "Empresa creada",
          description: "La empresa ha sido creada exitosamente.",
        });
        setIsCreateCompanyOpen(false);
        setCompanyForm({
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
          country: "",
        });
      } else {
        throw new Error("Error al crear la empresa");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la empresa. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const industryOptions = [
    "Tecnología",
    "Salud",
    "Educación",
    "Finanzas",
    "Manufactura",
    "Retail",
    "Servicios",
    "Otro",
  ];

  const sizeOptions = [
    "1-10 empleados",
    "11-50 empleados",
    "51-200 empleados",
    "201-500 empleados",
    "500+ empleados",
  ];

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatarUrl} alt={profile.firstName} />
                  <AvatarFallback>
                    {profile.firstName?.charAt(0)}
                    {profile.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1 -right-1 bg-yellow-600">
                  <Crown className="h-3 w-3" />
                </Badge>
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {profile.firstName} {profile.lastName}
                </CardTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Super Administrador</span>
                </div>
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleProfileUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Creation Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Crear Nueva Empresa</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Como super administrador, puedes crear empresas en el sistema
              </p>
            </div>
            <Dialog open={isCreateCompanyOpen} onOpenChange={setIsCreateCompanyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Empresa</DialogTitle>
                  <DialogDescription>
                    Completa la información de la empresa que deseas crear
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                      <Input
                        id="companyName"
                        value={companyForm.name}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, name: e.target.value })
                        }
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industria *</Label>
                      <Select
                        value={companyForm.industry}
                        onValueChange={(value) =>
                          setCompanyForm({ ...companyForm, industry: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una industria" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Tamaño de la Empresa</Label>
                      <Select
                        value={companyForm.size}
                        onValueChange={(value) =>
                          setCompanyForm({ ...companyForm, size: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          {sizeOptions.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Año de Fundación</Label>
                      <Input
                        id="founded"
                        type="number"
                        value={companyForm.founded}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, founded: e.target.value })
                        }
                        placeholder="2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        value={companyForm.website}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, website: e.target.value })
                        }
                        placeholder="https://ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email de la Empresa</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={companyForm.email}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, email: e.target.value })
                        }
                        placeholder="contacto@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Teléfono de la Empresa</Label>
                      <Input
                        id="companyPhone"
                        value={companyForm.phone}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, phone: e.target.value })
                        }
                        placeholder="+591 12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={companyForm.city}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, city: e.target.value })
                        }
                        placeholder="Cochabamba"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={companyForm.address}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, address: e.target.value })
                      }
                      placeholder="Av. Principal 123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={companyForm.description}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, description: e.target.value })
                      }
                      placeholder="Describe la empresa, su misión, visión y valores..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={companyForm.country}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, country: e.target.value })
                      }
                      placeholder="Bolivia"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateCompanyOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCompany}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Empresa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>
              Como super administrador, tienes la capacidad de crear empresas en el
              sistema. Esto es útil para:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Registrar empresas que se unen al sistema</li>
              <li>Crear cuentas de empresa para organizaciones</li>
              <li>Gestionar el ecosistema empresarial</li>
              <li>Facilitar la integración de nuevas empresas</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Información del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">ID de Usuario</Label>
              <p className="text-sm text-muted-foreground">{profile.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rol</Label>
              <Badge variant="secondary">Super Administrador</Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Fecha de Registro</Label>
              <p className="text-sm text-muted-foreground">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("es-ES")
                  : "No disponible"}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Última Actualización</Label>
              <p className="text-sm text-muted-foreground">
                {profile.updatedAt
                  ? new Date(profile.updatedAt).toLocaleDateString("es-ES")
                  : "No disponible"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 