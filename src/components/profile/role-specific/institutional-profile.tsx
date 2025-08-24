"use client";

import { useState } from "react";
import { UserRole } from "@/types/profile";
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
  Target,
  Award,
  Phone,
  MapPin,
  Globe,
  Camera,
} from "lucide-react";

import { ProfileCompletionIndicator } from "../shared/profile-completion-indicator";
import { ImageUpload } from "../shared/image-upload";
import { LocationSelector } from "../shared/location-selector";

interface InstitutionalProfileProps {
  userRole:
    | "MUNICIPAL_GOVERNMENTS"
    | "TRAINING_CENTERS"
    | "NGOS_AND_FOUNDATIONS";
  profile: Profile;
}

// Función para calcular el contraste de colores
const getContrastColor = (hexColor: string): string => {
  // Remover el # si está presente
  const hex = hexColor.replace("#", "");

  // Convertir a RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Retornar blanco para colores oscuros, negro para colores claros
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export function InstitutionalProfile({
  userRole,
  profile,
}: InstitutionalProfileProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Obtener colores del perfil (simulando datos del login)
  const primaryColor = profile.primaryColor || "#1E40AF";
  const secondaryColor = profile.secondaryColor || "#F59E0B";

  // Calcular colores de texto basados en el contraste
  const primaryTextColor = getContrastColor(primaryColor);
  const secondaryTextColor = getContrastColor(secondaryColor);

  const getRoleInfo = () => {
    switch (userRole) {
      case "MUNICIPAL_GOVERNMENTS":
        return {
          title: "Perfil de Institución",
          description:
            "Gestión de programas de empleabilidad y emprendimiento institucional",
          badge: "Institución",
          icon: Building,
        };
      case "TRAINING_CENTERS":
        return {
          title: "Perfil de Centro de Capacitación",
          description: "Administración de programas educativos y de formación",
          badge: "Centro de Capacitación",
          icon: Award,
        };
      case "NGOS_AND_FOUNDATIONS":
        return {
          title: "Perfil de ONG/Fundación",
          description: "Gestión de programas sociales y de desarrollo",
          badge: "ONG/Fundación",
          icon: Target,
        };
      default:
        return {
          title: "Perfil Institucional",
          description: "Gestión institucional",
          badge: "Institución",
          icon: Building,
        };
    }
  };

  const getAvailableSections = () => {
    return [
      { id: "overview", label: "Resumen Institucional", icon: Building },
      {
        id: "institutional",
        label: "Información Institucional",
        icon: Building,
      },
      { id: "services", label: "Áreas de Servicio", icon: Target },
      { id: "contact", label: "Información de Contacto", icon: Phone },
      { id: "description", label: "Descripción Institucional", icon: Globe },
    ];
  };

  const sections = getAvailableSections();
  const roleInfo = getRoleInfo();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header con colores personalizados */}
      <div className="rounded-lg p-6" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1
              className="text-3xl font-bold"
              style={{ color: primaryTextColor }}
            >
              {roleInfo.title}
            </h1>
            <p style={{ color: primaryTextColor, opacity: 0.9 }}>
              {roleInfo.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              style={{
                backgroundColor: secondaryColor,
                color: secondaryTextColor,
                border: "none",
              }}
            >
              {roleInfo.badge}
            </Badge>
            {profile.profileCompletion !== undefined && (
              <Badge
                variant={
                  profile.profileCompletion >= 80 ? "default" : "outline"
                }
                style={{
                  backgroundColor:
                    profile.profileCompletion >= 80
                      ? secondaryColor
                      : "transparent",
                  color:
                    profile.profileCompletion >= 80
                      ? secondaryTextColor
                      : primaryTextColor,
                  borderColor: primaryTextColor,
                }}
              >
                {profile.profileCompletion}% Completo
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                      style={{
                        backgroundColor: isActive
                          ? secondaryColor
                          : "transparent",
                        color: isActive ? secondaryTextColor : "inherit",
                        border: "none",
                      }}
                    >
                      <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Logo Institucional
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
                placeholder="Logo de la institución"
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-6">
            {activeSection === "overview" && (
              <div className="space-y-6">
                <ProfileCompletionIndicator
                  profile={profile}
                  userRole={userRole}
                  onSectionClick={handleSectionClick}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Building
                          className="h-5 w-5"
                          style={{ color: primaryColor }}
                        />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Institución
                          </p>
                          <p className="font-medium">
                            {profile.institutionName || "Nombre no registrado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Target
                          className="h-5 w-5"
                          style={{ color: secondaryColor }}
                        />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Área de Servicio
                          </p>
                          <p className="font-medium">
                            {profile.serviceArea || "No especificado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "institutional" && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Institucional</CardTitle>
                  <CardDescription>
                    Datos básicos de la institución y tipo de organización
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Formulario institucional en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === "services" && (
              <Card>
                <CardHeader>
                  <CardTitle>Áreas de Servicio</CardTitle>
                  <CardDescription>
                    Servicios ofrecidos y áreas de especialización
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Editor de servicios en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === "contact" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Contacto</CardTitle>
                    <CardDescription>
                      Datos de contacto institucional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Formulario de contacto en desarrollo...
                    </p>
                  </CardContent>
                </Card>

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

            {activeSection === "description" && (
              <Card>
                <CardHeader>
                  <CardTitle>Descripción Institucional</CardTitle>
                  <CardDescription>
                    Misión, visión y descripción de la institución
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Editor de descripción institucional en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
