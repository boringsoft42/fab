"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building,
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
  Crown,
} from "lucide-react";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { cn } from "@/lib/utils";

interface MunicipalityProfile {
  id: string;
  name: string;
  description: string;
  department: string;
  region: string;
  population: number;
  mayorName: string;
  mayorEmail: string;
  mayorPhone: string;
  address: string;
  website: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MunicipalityProfileFormProps {
  municipalityId?: string;
  initialData?: Partial<MunicipalityProfile>;
  className?: string;
  onProfileUpdate?: (profile: MunicipalityProfile) => void;
  showLogo?: boolean;
}

export const MunicipalityProfileForm: React.FC<
  MunicipalityProfileFormProps
> = ({
  municipalityId,
  initialData = {},
  className = "",
  onProfileUpdate,
  showLogo = true,
}) => {
  const [formData, setFormData] =
    useState<Partial<MunicipalityProfile>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (
    field: keyof MunicipalityProfile,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!municipalityId) {
      console.error("No municipality ID available");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedProfile: MunicipalityProfile = {
        id: municipalityId,
        name: formData.name || "",
        description: formData.description || "",
        department: formData.department || "",
        region: formData.region || "",
        population: formData.population || 0,
        mayorName: formData.mayorName || "",
        mayorEmail: formData.mayorEmail || "",
        mayorPhone: formData.mayorPhone || "",
        address: formData.address || "",
        website: formData.website || "",
        logoUrl: formData.logoUrl,
        primaryColor: formData.primaryColor || "#3B82F6",
        secondaryColor: formData.secondaryColor || "#1E40AF",
        isActive: formData.isActive !== undefined ? formData.isActive : true,
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
      console.error("Error updating municipality profile:", err);
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
          profileId={municipalityId}
          currentAvatarUrl={formData.logoUrl}
          onAvatarUpdate={handleLogoUpdate}
          size="lg"
          showTitle={false}
        />
      )}

      {/* Municipality Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información del Municipio
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
                  Perfil del municipio actualizado exitosamente
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Municipality Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Municipio *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nombre del municipio"
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
                  placeholder="Describe tu municipio, historia, características..."
                  rows={4}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <select
                  id="department"
                  value={formData.department || ""}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Seleccionar departamento</option>
                  <option value="La Paz">La Paz</option>
                  <option value="Cochabamba">Cochabamba</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Oruro">Oruro</option>
                  <option value="Potosí">Potosí</option>
                  <option value="Chuquisaca">Chuquisaca</option>
                  <option value="Tarija">Tarija</option>
                  <option value="Beni">Beni</option>
                  <option value="Pando">Pando</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Región</Label>
                <Input
                  id="region"
                  value={formData.region || ""}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Región del municipio"
                />
              </div>
            </div>

            {/* Population and Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="population">Población</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="population"
                    type="number"
                    min="0"
                    value={formData.population || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "population",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="50000"
                    className="pl-10"
                  />
                </div>
              </div>

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
            </div>

            {/* Mayor Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Información del Alcalde
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mayorName">Nombre del Alcalde</Label>
                  <Input
                    id="mayorName"
                    value={formData.mayorName || ""}
                    onChange={(e) =>
                      handleInputChange("mayorName", e.target.value)
                    }
                    placeholder="Nombre completo del alcalde"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mayorEmail">Email del Alcalde</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mayorEmail"
                      type="email"
                      value={formData.mayorEmail || ""}
                      onChange={(e) =>
                        handleInputChange("mayorEmail", e.target.value)
                      }
                      placeholder="alcalde@municipio.gob.bo"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mayorPhone">Teléfono del Alcalde</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mayorPhone"
                    value={formData.mayorPhone || ""}
                    onChange={(e) =>
                      handleInputChange("mayorPhone", e.target.value)
                    }
                    placeholder="+591 700 123 456"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Website and Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    placeholder="https://www.municipio.gob.bo"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Color Primario</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor || "#3B82F6"}
                    onChange={(e) =>
                      handleInputChange("primaryColor", e.target.value)
                    }
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.primaryColor || "#3B82F6"}
                    onChange={(e) =>
                      handleInputChange("primaryColor", e.target.value)
                    }
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Color Secundario</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor || "#1E40AF"}
                    onChange={(e) =>
                      handleInputChange("secondaryColor", e.target.value)
                    }
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.secondaryColor || "#1E40AF"}
                    onChange={(e) =>
                      handleInputChange("secondaryColor", e.target.value)
                    }
                    placeholder="#1E40AF"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="isActive">Estado del Municipio</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={
                    formData.isActive !== undefined ? formData.isActive : true
                  }
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="text-sm">
                  Municipio activo
                </Label>
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
