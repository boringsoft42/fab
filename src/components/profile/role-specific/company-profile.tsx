"use client";

import { useState } from "react";
import type { Profile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  FileText,
  Users,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
} from "lucide-react";

// Import shared components
import { ProfileCompletionIndicator } from "../shared/profile-completion-indicator";
import { ImageUpload } from "../shared/image-upload";
import { LocationSelector } from "../shared/location-selector";

interface CompanyProfileProps {
  profile: Profile;
}

export function CompanyProfile({ profile }: CompanyProfileProps) {
  const [activeSection, setActiveSection] = useState("overview");

  // Handle section navigation from completion indicator
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getAvailableSections = () => {
    return [
      { id: "overview", label: "Resumen Empresarial", icon: Building },
      { id: "company", label: "Información Empresarial", icon: Building },
      { id: "legal", label: "Datos Legales", icon: FileText },
      { id: "contact", label: "Información de Contacto", icon: Phone },
      { id: "description", label: "Descripción y Cultura", icon: Globe },
    ];
  };

  const sections = getAvailableSections();

  const getCompanySize = (size: string) => {
    switch (size) {
      case "MICRO":
        return "Microempresa (1-10 empleados)";
      case "SMALL":
        return "Pequeña empresa (11-50 empleados)";
      case "MEDIUM":
        return "Mediana empresa (51-200 empleados)";
      case "LARGE":
        return "Gran empresa (200+ empleados)";
      default:
        return "No especificado";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Perfil Empresarial</h1>
          <p className="text-muted-foreground">
            Información completa de tu empresa para publicar ofertas de trabajo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="default">Empresa</Badge>
          {profile.profileCompletion !== undefined && (
            <Badge
              variant={profile.profileCompletion >= 80 ? "default" : "outline"}
            >
              {profile.profileCompletion}% Completo
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Secciones del Perfil</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <Button
                      key={section.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Company Logo Upload */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Logo Empresarial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImage={profile.avatarUrl}
                onImageChange={(url) => {
                  console.log("Logo updated:", url);
                }}
                type="logo"
                maxSize={5}
                placeholder="Logo de la empresa"
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <ProfileCompletionIndicator
                  profile={profile}
                  userRole="COMPANIES"
                  onSectionClick={handleSectionClick}
                />

                {/* Company Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Empresa
                          </p>
                          <p className="font-medium">
                            {profile.companyName || "Nombre no registrado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Sector
                          </p>
                          <p className="font-medium">
                            {profile.businessSector || "No especificado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Tamaño
                          </p>
                          <p className="font-medium">
                            {getCompanySize(profile.companySize || "")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ubicación
                          </p>
                          <p className="font-medium">
                            {profile.municipality
                              ? `${profile.municipality}, ${profile.department}`
                              : "No especificado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Company Description Preview */}
                {profile.companyDescription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Acerca de la Empresa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {profile.companyDescription}
                      </p>
                      <Button variant="link" className="p-0 mt-2">
                        Ver descripción completa
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Company Information Form */}
            {activeSection === "company" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Información Empresarial
                  </CardTitle>
                  <CardDescription>
                    Datos básicos de tu empresa y actividad comercial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          Nombre de la Empresa
                        </p>
                        <p className="text-muted-foreground">
                          {profile.companyName || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Sector Empresarial
                        </p>
                        <p className="text-muted-foreground">
                          {profile.businessSector || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Tamaño de la Empresa
                        </p>
                        <p className="text-muted-foreground">
                          {getCompanySize(profile.companySize || "")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Año de Fundación</p>
                        <p className="text-muted-foreground">
                          {profile.foundedYear || "No especificado"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-muted-foreground">
                        Formulario de información empresarial en desarrollo...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legal Information */}
            {activeSection === "legal" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Datos Legales
                  </CardTitle>
                  <CardDescription>
                    Información legal y fiscal de la empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          NIT / Número de Identificación Tributaria
                        </p>
                        <p className="text-muted-foreground">
                          {profile.taxId || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Representante Legal
                        </p>
                        <p className="text-muted-foreground">
                          {profile.legalRepresentative || "No especificado"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <p className="text-muted-foreground">
                        Formulario de datos legales en desarrollo...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            {activeSection === "contact" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Información de Contacto
                    </CardTitle>
                    <CardDescription>
                      Datos de contacto de la empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">
                            Email Corporativo
                          </p>
                          <p className="text-muted-foreground">
                            {profile.email || "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-muted-foreground">
                            {profile.phone || "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dirección</p>
                          <p className="text-muted-foreground">
                            {profile.address || "No especificado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sitio Web</p>
                          <p className="text-muted-foreground">
                            {profile.website || "No especificado"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="text-muted-foreground">
                          Formulario de contacto en desarrollo...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Selector */}
                <LocationSelector
                  selectedDepartment={profile.department || ""}
                  selectedMunicipality={profile.municipality || ""}
                  onLocationChange={(department, municipality) => {
                    console.log("Location updated:", {
                      department,
                      municipality,
                    });
                  }}
                  required
                />
              </div>
            )}

            {/* Company Description */}
            {activeSection === "description" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Descripción y Cultura Empresarial
                  </CardTitle>
                  <CardDescription>
                    Describe tu empresa, misión, visión y cultura organizacional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.companyDescription && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">
                          Descripción Actual:
                        </p>
                        <p className="text-muted-foreground">
                          {profile.companyDescription}
                        </p>
                      </div>
                    )}

                    <div className="pt-4">
                      <p className="text-muted-foreground">
                        Editor de descripción empresarial en desarrollo...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
