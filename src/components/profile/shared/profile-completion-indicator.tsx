&ldquo;use client&rdquo;;

import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { CheckCircle, AlertCircle, Target, ArrowRight } from &ldquo;lucide-react&rdquo;;
import { UserRole } from &ldquo;@prisma/client&rdquo;;
import type { Profile } from &ldquo;@/types/profile&rdquo;;

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
        id: &ldquo;personal&rdquo;,
        title: &ldquo;Información Personal&rdquo;,
        completed: !!(profile.firstName && profile.lastName && profile.email),
        required: true,
        description: &ldquo;Nombre, email y datos básicos&rdquo;,
      },
    ];

    switch (role) {
      case &ldquo;YOUTH&rdquo;:
        return [
          ...baseSections,
          {
            id: &ldquo;academic&rdquo;,
            title: &ldquo;Educación&rdquo;,
            completed: !!(profile.educationLevel && profile.currentInstitution),
            required: true,
            description: &ldquo;Nivel educativo e institución&rdquo;,
          },
          {
            id: &ldquo;work&rdquo;,
            title: &ldquo;Experiencia Laboral&rdquo;,
            completed: !!(
              profile.workExperience &&
              Object.keys(profile.workExperience).length > 0
            ),
            required: false,
            description: &ldquo;Historial de trabajos previos&rdquo;,
          },
          {
            id: &ldquo;skills&rdquo;,
            title: &ldquo;Habilidades&rdquo;,
            completed: !!(profile.skills && profile.skills.length > 0),
            required: true,
            description: &ldquo;Competencias técnicas y blandas&rdquo;,
          },
          {
            id: &ldquo;location&rdquo;,
            title: &ldquo;Ubicación&rdquo;,
            completed: !!(profile.municipality && profile.department),
            required: true,
            description: &ldquo;Municipio y departamento&rdquo;,
          },
        ];

      case &ldquo;ADOLESCENTS&rdquo;:
        return [
          ...baseSections,
          {
            id: &ldquo;academic&rdquo;,
            title: &ldquo;Educación Actual&rdquo;,
            completed: !!(profile.educationLevel && profile.currentInstitution),
            required: true,
            description: &ldquo;Nivel educativo e institución actual&rdquo;,
          },
          {
            id: &ldquo;interests&rdquo;,
            title: &ldquo;Intereses&rdquo;,
            completed: !!(profile.interests && profile.interests.length > 0),
            required: true,
            description: &ldquo;Áreas de interés y aspiraciones&rdquo;,
          },
          {
            id: &ldquo;parental&rdquo;,
            title: &ldquo;Consentimiento Parental&rdquo;,
            completed: profile.parentalConsent,
            required: true,
            description: &ldquo;Autorización de padres o tutores&rdquo;,
          },
          {
            id: &ldquo;location&rdquo;,
            title: &ldquo;Ubicación&rdquo;,
            completed: !!(profile.municipality && profile.department),
            required: true,
            description: &ldquo;Municipio y departamento&rdquo;,
          },
        ];

      case &ldquo;COMPANIES&rdquo;:
        return [
          ...baseSections,
          {
            id: &ldquo;company&rdquo;,
            title: &ldquo;Información Empresarial&rdquo;,
            completed: !!(profile.companyName && profile.businessSector),
            required: true,
            description: &ldquo;Datos de la empresa y sector&rdquo;,
          },
          {
            id: &ldquo;legal&rdquo;,
            title: &ldquo;Datos Legales&rdquo;,
            completed: !!(profile.taxId && profile.legalRepresentative),
            required: true,
            description: &ldquo;NIT y representante legal&rdquo;,
          },
          {
            id: &ldquo;description&rdquo;,
            title: &ldquo;Descripción Empresarial&rdquo;,
            completed: !!(
              profile.companyDescription &&
              profile.companyDescription.length > 50
            ),
            required: false,
            description: &ldquo;Descripción de la empresa y cultura&rdquo;,
          },
          {
            id: &ldquo;contact&rdquo;,
            title: &ldquo;Información de Contacto&rdquo;,
            completed: !!(profile.phone && profile.address),
            required: true,
            description: &ldquo;Teléfono y dirección&rdquo;,
          },
        ];

      case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
      case &ldquo;TRAINING_CENTERS&rdquo;:
      case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
        const institutionType =
          role === &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;
            ? &ldquo;gobierno&rdquo;
            : role === &ldquo;TRAINING_CENTERS&rdquo;
              ? &ldquo;centro de capacitación&rdquo;
              : &ldquo;ONG/fundación&rdquo;;

        return [
          ...baseSections,
          {
            id: &ldquo;institutional&rdquo;,
            title: &ldquo;Información Institucional&rdquo;,
            completed: !!(profile.institutionName && profile.institutionType),
            required: true,
            description: `Datos del ${institutionType}`,
          },
          {
            id: &ldquo;services&rdquo;,
            title: &ldquo;Áreas de Servicio&rdquo;,
            completed: !!(
              profile.serviceArea &&
              profile.specialization &&
              profile.specialization.length > 0
            ),
            required: true,
            description: &ldquo;Servicios ofrecidos y especialización&rdquo;,
          },
          {
            id: &ldquo;description&rdquo;,
            title: &ldquo;Descripción Institucional&rdquo;,
            completed: !!(
              profile.institutionDescription &&
              profile.institutionDescription.length > 50
            ),
            required: false,
            description: &ldquo;Misión, visión y descripción&rdquo;,
          },
          {
            id: &ldquo;contact&rdquo;,
            title: &ldquo;Información de Contacto&rdquo;,
            completed: !!(profile.phone && profile.address),
            required: true,
            description: &ldquo;Teléfono y dirección oficial&rdquo;,
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
      case &ldquo;YOUTH&rdquo;:
        return &ldquo;Joven&rdquo;;
      case &ldquo;ADOLESCENTS&rdquo;:
        return &ldquo;Adolescente&rdquo;;
      case &ldquo;COMPANIES&rdquo;:
        return &ldquo;Empresa&rdquo;;
      case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
        return &ldquo;Gobierno Municipal&rdquo;;
      case &ldquo;TRAINING_CENTERS&rdquo;:
        return &ldquo;Centro de Capacitación&rdquo;;
      case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
        return &ldquo;ONG/Fundación&rdquo;;
      default:
        return &ldquo;Usuario&rdquo;;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
          <Target className=&ldquo;h-5 w-5&rdquo; />
          Completitud del Perfil - {getRoleDisplayName(userRole)}
        </CardTitle>
        <CardDescription>
          {completionPercentage === 100
            ? &ldquo;¡Felicitaciones! Tu perfil está completo&rdquo;
            : &ldquo;Completa tu perfil para acceder a todas las funcionalidades&rdquo;}
        </CardDescription>
      </CardHeader>

      <CardContent className=&ldquo;space-y-6&rdquo;>
        {/* Progress Overview */}
        <div className=&ldquo;space-y-2&rdquo;>
          <div className=&ldquo;flex justify-between text-sm&rdquo;>
            <span>Progreso general</span>
            <span className=&ldquo;font-medium&rdquo;>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className=&ldquo;h-3&rdquo; />
          <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
            {completedRequired} de {totalRequired} secciones requeridas
            completadas
          </div>
        </div>

        {/* Section Details */}
        <div className=&ldquo;space-y-3&rdquo;>
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                onSectionClick ? &ldquo;cursor-pointer hover:bg-muted/50&rdquo; : &ldquo;&rdquo;
              }`}
              onClick={() => onSectionClick?.(section.id)}
            >
              <div className=&ldquo;flex items-center gap-3&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  {section.completed ? (
                    <CheckCircle className=&ldquo;h-4 w-4 text-green-500&rdquo; />
                  ) : (
                    <AlertCircle
                      className={`h-4 w-4 ${section.required ? &ldquo;text-orange-500&rdquo; : &ldquo;text-gray-400&rdquo;}`}
                    />
                  )}

                  <div>
                    <div className=&ldquo;flex items-center gap-2&rdquo;>
                      <span className=&ldquo;text-sm font-medium&rdquo;>
                        {section.title}
                      </span>
                      {section.required && (
                        <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                          Requerido
                        </Badge>
                      )}
                    </div>
                    {section.description && (
                      <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                        {section.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className=&ldquo;flex items-center gap-2&rdquo;>
                {section.completed ? (
                  <Badge variant=&ldquo;secondary&rdquo;>Completo</Badge>
                ) : (
                  <Badge variant={section.required ? &ldquo;destructive&rdquo; : &ldquo;outline&rdquo;}>
                    {section.required ? &ldquo;Pendiente&rdquo; : &ldquo;Opcional&rdquo;}
                  </Badge>
                )}

                {onSectionClick && (
                  <ArrowRight className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {completionPercentage < 100 && (
          <Button
            className=&ldquo;w-full&rdquo;
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
            <ArrowRight className=&ldquo;w-4 h-4 ml-2&rdquo; />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
