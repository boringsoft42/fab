"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { cn } from "@/lib/utils";

interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  businessSector: string;
  companySize: string;
  foundedYear: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  taxId: string | null;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyProfileFormProps {
  companyId?: string;
  initialData?: Partial<CompanyProfile>;
  className?: string;
  onProfileUpdate?: (profile: CompanyProfile) => void;
  showLogo?: boolean;
}

export const CompanyProfileForm: React.FC<CompanyProfileFormProps> = ({
  companyId,
  initialData = {},
  className = "",
  onProfileUpdate,
  showLogo = true,
}) => {
  const [formData, setFormData] =
    useState<Partial<CompanyProfile>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof CompanyProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      console.error("No company ID available");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedProfile: CompanyProfile = {
        id: companyId,
        name: formData.name || "",
        description: formData.description || "",
        businessSector: formData.businessSector || "",
        companySize: formData.companySize || "",
        foundedYear: formData.foundedYear || "",
        website: formData.website || "",
        email: formData.email || "",
        phone: formData.phone || "",
        address: formData.address || "",
        taxId: formData.taxId || null,
        logoUrl: formData.logoUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSaveSuccess(true);

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar perfil";
      setError(errorMessage);
      console.error("Error updating company profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpdate = (newLogoUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      logoUrl: newLogoUrl,
    }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Logo Upload Section */}
      {showLogo && (
        <ProfileAvatarUpload
          profileId={companyId}
          currentAvatarUrl={formData.logoUrl}
          onAvatarUpdate={handleLogoUpdate}
          size="lg"
          showTitle={false}
        />
      )}

      {/* Company Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {saveSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Perfil de empresa actualizado exitosamente
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Company Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nombre de tu empresa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe tu empresa, misión, visión..."
                  rows={4}
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessSector">Sector de Negocio</Label>
                <select
                  id="businessSector"
                  value={formData.businessSector || ""}
                  onChange={(e) =>
                    handleInputChange("businessSector", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Seleccionar sector</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="salud">Salud</option>
                  <option value="educacion">Educación</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="retail">Retail</option>
                  <option value="manufactura">Manufactura</option>
                  <option value="servicios">Servicios</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Tamaño de la Empresa</Label>
                <select
                  id="companySize"
                  value={formData.companySize || ""}
                  onChange={(e) =>
                    handleInputChange("companySize", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Seleccionar tamaño</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="500+">Más de 500 empleados</option>
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contacto</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contacto@empresa.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+591 700 123 456"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Website and Founded Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.website || ""}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://www.empresa.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundedYear">Año de Fundación</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="foundedYear"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.foundedYear || ""}
                    onChange={(e) =>
                      handleInputChange("foundedYear", e.target.value)
                    }
                    placeholder="2020"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Address and Tax ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Av. Principal 123, Ciudad"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">NIT (Opcional)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="taxId"
                    value={formData.taxId || ""}
                    onChange={(e) => handleInputChange("taxId", e.target.value)}
                    placeholder="1234567890"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
