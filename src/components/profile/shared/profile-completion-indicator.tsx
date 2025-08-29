"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Target, ArrowRight } from "lucide-react";
import { UserRole } from "@/types/profile";
import type { Profile } from "@/types/profile";

interface ProfileSection {
  id: string;
  title: string;
  completed: boolean;
  required: boolean;
  description?: string;
}

interface ProfileCompletionIndicatorProps {
  profile: Profile;
  userRole: UserRole;
  onSectionClick?: (sectionId: string) => void;
}

export function ProfileCompletionIndicator({
  profile,
  userRole,
  onSectionClick,
}: ProfileCompletionIndicatorProps) {
  // Define role-specific completion requirements
  const getProfileSections = (
    role: UserRole,
    profile: Profile
  ): ProfileSection[] => {
    const baseSections: ProfileSection[] = [
      {
        id: "personal",
        title: "Información Personal",
        completed: !!(profile.firstName && profile.lastName && profile.email),
        required: true,
        description: "Nombre, email y datos básicos",
      },
    ];

    switch (role) {
      case "YOUTH":
        return [
          ...baseSections,
          {
            id: "academic",
            title: "Educación",
            completed: !!(profile.educationLevel && profile.currentInstitution),
            required: true,
            description: "Nivel educativo e institución",
          },
          {
            id: "work",
            title: "Experiencia Laboral",
            completed: !!(
              profile.workExperience &&
              Object.keys(profile.workExperience).length > 0
            ),
            required: false,
            description: "Historial de trabajos previos",
          },
          {
            id: "skills",
            title: "Habilidades",
            completed: !!(profile.skills && profile.skills.length > 0),
            required: true,
            description: "Competencias técnicas y blandas",
          },
          {
            id: "location",
            title: "Ubicación",
            completed: !!(profile.municipality && profile.department),
            required: true,
            description: "Municipio y departamento",
          },
        ];

      case "ADOLESCENTS":
        return [
          ...baseSections,
          {
            id: "academic",
            title: "Educación Actual",
            completed: !!(profile.educationLevel && profile.currentInstitution),
            required: true,
            description: "Nivel educativo e institución actual",
          },
          {
            id: "interests",
            title: "Intereses",
            completed: !!(profile.interests && profile.interests.length > 0),
            required: true,
            description: "Áreas de interés y aspiraciones",
          },
          {
            id: "parental",
            title: "Consentimiento Parental",
            completed: profile.parentalConsent,
            required: true,
            description: "Autorización de padres o tutores",
          },
          {
            id: "location",
            title: "Ubicación",
            completed: !!(profile.municipality && profile.department),
            required: true,
            description: "Municipio y departamento",
          },
        ];

      case "COMPANIES":
        return [
          ...baseSections,
          {
            id: "company",
            title: "Información Empresarial",
            completed: !!(profile.companyName && profile.businessSector),
            required: true,
            description: "Datos de la empresa y sector",
          },
          {
            id: "legal",
            title: "Datos Legales",
            completed: !!(profile.taxId && profile.legalRepresentative),
            required: true,
            description: "NIT y representante legal",
          },
          {
            id: "description",
            title: "Descripción Empresarial",
            completed: !!(
              profile.companyDescription &&
              profile.companyDescription.length > 50
            ),
            required: false,
            description: "Descripción de la empresa y cultura",
          },
          {
            id: "contact",
            title: "Información de Contacto",
            completed: !!(profile.phone && profile.address),
            required: true,
            description: "Teléfono y dirección",
          },
        ];

      case "MUNICIPAL_GOVERNMENTS":
      case "TRAINING_CENTERS":
      case "NGOS_AND_FOUNDATIONS":
        const institutionType =
          role === "MUNICIPAL_GOVERNMENTS"
            ? "gobierno"
            : role === "TRAINING_CENTERS"
              ? "centro de capacitación"
              : "ONG/fundación";

        return [
          ...baseSections,
          {
            id: "institutional",
            title: "Información Institucional",
            completed: !!(profile.institutionName && profile.institutionType),
            required: true,
            description: `Datos del ${institutionType}`,
          },
          {
            id: "services",
            title: "Áreas de Servicio",
            completed: !!(
              profile.serviceArea &&
              profile.specialization &&
              profile.specialization.length > 0
            ),
            required: true,
            description: "Servicios ofrecidos y especialización",
          },
          {
            id: "description",
            title: "Descripción Institucional",
            completed: !!(
              profile.institutionDescription &&
              profile.institutionDescription.length > 50
            ),
            required: false,
            description: "Misión, visión y descripción",
          },
          {
            id: "contact",
            title: "Información de Contacto",
            completed: !!(profile.phone && profile.address),
            required: true,
            description: "Teléfono y dirección oficial",
          },
        ];

      default:
        return baseSections;
    }
  };

  const sections = getProfileSections(userRole, profile);
  const requiredSections = sections.filter((s) => s.required);
  const completedRequired = requiredSections.filter((s) => s.completed).length;
  const totalRequired = requiredSections.length;
  const completionPercentage =
    totalRequired > 0
      ? Math.round((completedRequired / totalRequired) * 100)
      : 0;

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "YOUTH":
        return "Joven";
      case "ADOLESCENTS":
        return "Adolescente";
      case "COMPANIES":
        return "Empresa";
      case "MUNICIPAL_GOVERNMENTS":
        return "Gobierno Municipal";
      case "TRAINING_CENTERS":
        return "Centro de Capacitación";
      case "NGOS_AND_FOUNDATIONS":
        return "ONG/Fundación";
      default:
        return "Usuario";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Completitud del Perfil - {getRoleDisplayName(userRole)}
        </CardTitle>
        <CardDescription>
          {completionPercentage === 100
            ? "¡Felicitaciones! Tu perfil está completo"
            : "Completa tu perfil para acceder a todas las funcionalidades"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso general</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <div className="text-xs text-muted-foreground">
            {completedRequired} de {totalRequired} secciones requeridas
            completadas
          </div>
        </div>

        {/* Section Details */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                onSectionClick ? "cursor-pointer hover:bg-muted/50" : ""
              }`}
              onClick={() => onSectionClick?.(section.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {section.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle
                      className={`h-4 w-4 ${section.required ? "text-orange-500" : "text-gray-400"}`}
                    />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                      {section.required && (
                        <Badge variant="outline" className="text-xs">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    {section.description && (
                      <p className="text-xs text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {section.completed ? (
                  <Badge variant="secondary">Completo</Badge>
                ) : (
                  <Badge variant={section.required ? "destructive" : "outline"}>
                    {section.required ? "Pendiente" : "Opcional"}
                  </Badge>
                )}

                {onSectionClick && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {completionPercentage < 100 && (
          <Button
            className="w-full"
            onClick={() => {
              const firstIncomplete = sections.find(
                (s) => s.required && !s.completed
              );
              if (firstIncomplete && onSectionClick) {
                onSectionClick(firstIncomplete.id);
              }
            }}
          >
            Completar Perfil
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
