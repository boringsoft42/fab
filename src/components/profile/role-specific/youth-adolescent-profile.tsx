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
  User,
  GraduationCap,
  Briefcase,
  Star,
  FileText,
  AlertCircle,
  MapPin,
  Camera,
} from "lucide-react";

// Import shared components
import { ProfileCompletionIndicator } from "../shared/profile-completion-indicator";
import { ImageUpload } from "../shared/image-upload";
import { SkillsSelector } from "../shared/skills-selector";
import { LocationSelector } from "../shared/location-selector";

interface YouthAdolescentProfileProps {
  userRole: "YOUTH" | "ADOLESCENTS";
  profile: Profile;
}

export function YouthAdolescentProfile({
  userRole,
  profile,
}: YouthAdolescentProfileProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const isAdolescent = userRole === "ADOLESCENTS";
  const isYouth = userRole === "YOUTH";

  // Handle section navigation from completion indicator
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getRoleTitle = () => {
    return isAdolescent ? "Perfil de Adolescente" : "Perfil de Joven";
  };

  const getRoleDescription = () => {
    return isAdolescent
      ? "Información personal y académica para adolescentes"
      : "Perfil completo para búsqueda de empleo y desarrollo profesional";
  };

  const getAvailableSections = () => {
    const baseSections = [
      { id: "overview", label: "Resumen", icon: User },
      { id: "personal", label: "Información Personal", icon: User },
      { id: "academic", label: "Educación", icon: GraduationCap },
      { id: "skills", label: "Habilidades", icon: Star },
      { id: "location", label: "Ubicación", icon: MapPin },
    ];

    // Add role-specific sections
    if (isYouth) {
      baseSections.splice(4, 0, {
        id: "work",
        label: "Experiencia Laboral",
        icon: Briefcase,
      });
      baseSections.push({ id: "cv", label: "Generar CV", icon: FileText });
    }

    if (isAdolescent) {
      baseSections.push({
        id: "parental",
        label: "Consentimiento Parental",
        icon: AlertCircle,
      });
    }

    return baseSections;
  };

  const sections = getAvailableSections();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{getRoleTitle()}</h1>
          <p className="text-muted-foreground">{getRoleDescription()}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isAdolescent ? "secondary" : "default"}>
            {isAdolescent ? "Adolescente" : "Joven"}
          </Badge>
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

          {/* Profile Photo Upload */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Foto de Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImage={profile.avatarUrl}
                onImageChange={(url) => {
                  // TODO: Update profile avatar
                  console.log("Avatar updated:", url);
                }}
                type="avatar"
                maxSize={2}
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
                  userRole={userRole}
                  onSectionClick={handleSectionClick}
                />

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Educación
                          </p>
                          <p className="font-medium">
                            {profile.educationLevel || "No especificado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Ubicación
                          </p>
                          <p className="font-medium">
                            {profile.municipality || "No especificado"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Habilidades
                          </p>
                          <p className="font-medium">
                            {profile.skills?.length || 0} registradas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Role-specific alerts */}
                {isAdolescent && !profile.parentalConsent && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-orange-700">
                        <AlertCircle className="h-5 w-5" />
                        <div>
                          <p className="font-medium">
                            Consentimiento Parental Requerido
                          </p>
                          <p className="text-sm">
                            Como adolescente, necesitas el consentimiento de tus
                            padres o tutores.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Personal Information Form */}
            {activeSection === "personal" && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Datos básicos de contacto e identificación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Formulario de información personal en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Academic Profile Form */}
            {activeSection === "academic" && (
              <Card>
                <CardHeader>
                  <CardTitle>Perfil Académico</CardTitle>
                  <CardDescription>
                    Información sobre tu educación y estudios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Formulario académico en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Work Experience Form (Youth only) */}
            {activeSection === "work" && isYouth && (
              <Card>
                <CardHeader>
                  <CardTitle>Experiencia Laboral</CardTitle>
                  <CardDescription>
                    Registra tu historial de trabajos y experiencia profesional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Formulario de experiencia laboral en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Skills and Competences */}
            {activeSection === "skills" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Habilidades y Competencias
                  </CardTitle>
                  <CardDescription>
                    {isAdolescent
                      ? "Registra tus intereses y habilidades para descubrir oportunidades"
                      : "Destaca tus habilidades técnicas y blandas para empleadores"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsSelector
                    selectedSkills={profile.skills || []}
                    onSkillsChange={(skills) => {
                      // TODO: Update profile skills
                      console.log("Skills updated:", skills);
                    }}
                    maxSkills={isAdolescent ? 10 : 20}
                    showLevels={isYouth}
                  />
                </CardContent>
              </Card>
            )}

            {/* Location Selector */}
            {activeSection === "location" && (
              <LocationSelector
                selectedDepartment={profile.department || ""}
                selectedMunicipality={profile.municipality || ""}
                onLocationChange={(department, municipality) => {
                  // TODO: Update profile location
                  console.log("Location updated:", {
                    department,
                    municipality,
                  });
                }}
                required
              />
            )}

            {/* CV Generator (Youth only) */}
            {activeSection === "cv" && isYouth && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generador de CV
                  </CardTitle>
                  <CardDescription>
                    Crea tu currículum vitae automáticamente con la información
                    de tu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generador de CV en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Parental Consent Form (Adolescents only) */}
            {activeSection === "parental" && isAdolescent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Consentimiento Parental
                  </CardTitle>
                  <CardDescription>
                    Autorización de padres o tutores para participar en la
                    plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Formulario de consentimiento parental en desarrollo...
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
