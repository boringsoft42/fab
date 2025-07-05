"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
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

export function InstitutionalProfile({
  userRole,
  profile,
}: InstitutionalProfileProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case "MUNICIPAL_GOVERNMENTS":
        return {
          title: "Perfil de Gobierno Municipal",
          description: "Gestion de programas de empleabilidad y emprendimiento municipal",
          badge: "Gobierno Municipal",
          icon: Building,
        };
      case "TRAINING_CENTERS":
        return {
          title: "Perfil de Centro de Capacitacion",
          description: "Administracion de programas educativos y de formacion",
          badge: "Centro de Capacitacion",
          icon: Award,
        };
      case "NGOS_AND_FOUNDATIONS":
        return {
          title: "Perfil de ONG/Fundacion",
          description: "Gestion de programas sociales y de desarrollo",
          badge: "ONG/Fundacion",
          icon: Target,
        };
      default:
        return {
          title: "Perfil Institucional",
          description: "Gestion institucional",
          badge: "Institucion",
          icon: Building,
        };
    }
  };

  const getAvailableSections = () => {
    return [
      { id: "overview", label: "Resumen Institucional", icon: Building },
      {
        id: "institutional",
        label: "Informacion Institucional",
        icon: Building,
      },
      { id: "services", label: "Areas de Servicio", icon: Target },
      { id: "contact", label: "Informacion de Contacto", icon: Phone },
      { id: "description", label: "Descripcion Institucional", icon: Globe },
    ];
  };

  const sections = getAvailableSections();
  const roleInfo = getRoleInfo();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{roleInfo.title}</h1>
          <p className="text-muted-foreground">{roleInfo.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="default">{roleInfo.badge}</Badge>
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
                placeholder="Logo de la institucion"
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
                        <Building className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Institucion
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
                        <Target className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Area de Servicio
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
                  <CardTitle>Informacion Institucional</CardTitle>
                  <CardDescription>
                    Datos basicos de la institucion y tipo de organizacion
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
                  <CardTitle>Areas de Servicio</CardTitle>
                  <CardDescription>
                    Servicios ofrecidos y areas de especializacion
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
                    <CardTitle>Informacion de Contacto</CardTitle>
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
                  <CardTitle>Descripcion Institucional</CardTitle>
                  <CardDescription>
                    Mision, vision y descripcion de la institucion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Editor de descripcion institucional en desarrollo...
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
