&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { UserRole } from &ldquo;@prisma/client&rdquo;;
import type { Profile } from &ldquo;@/types/profile&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  User,
  GraduationCap,
  Briefcase,
  Star,
  FileText,
  AlertCircle,
  MapPin,
  Camera,
} from &ldquo;lucide-react&rdquo;;

// Import shared components
import { ProfileCompletionIndicator } from &ldquo;../shared/profile-completion-indicator&rdquo;;
import { ImageUpload } from &ldquo;../shared/image-upload&rdquo;;
import { SkillsSelector } from &ldquo;../shared/skills-selector&rdquo;;
import { LocationSelector } from &ldquo;../shared/location-selector&rdquo;;

interface YouthAdolescentProfileProps {
  userRole: &ldquo;YOUTH&rdquo; | &ldquo;ADOLESCENTS&rdquo;;
  profile: Profile;
}

export function YouthAdolescentProfile({
  userRole,
  profile,
}: YouthAdolescentProfileProps) {
  const [activeSection, setActiveSection] = useState(&ldquo;overview&rdquo;);

  const isAdolescent = userRole === &ldquo;ADOLESCENTS&rdquo;;
  const isYouth = userRole === &ldquo;YOUTH&rdquo;;

  // Handle section navigation from completion indicator
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getRoleTitle = () => {
    return isAdolescent ? &ldquo;Perfil de Adolescente&rdquo; : &ldquo;Perfil de Joven&rdquo;;
  };

  const getRoleDescription = () => {
    return isAdolescent
      ? &ldquo;Información personal y académica para adolescentes&rdquo;
      : &ldquo;Perfil completo para búsqueda de empleo y desarrollo profesional&rdquo;;
  };

  const getAvailableSections = () => {
    const baseSections = [
      { id: &ldquo;overview&rdquo;, label: &ldquo;Resumen&rdquo;, icon: User },
      { id: &ldquo;personal&rdquo;, label: &ldquo;Información Personal&rdquo;, icon: User },
      { id: &ldquo;academic&rdquo;, label: &ldquo;Educación&rdquo;, icon: GraduationCap },
      { id: &ldquo;skills&rdquo;, label: &ldquo;Habilidades&rdquo;, icon: Star },
      { id: &ldquo;location&rdquo;, label: &ldquo;Ubicación&rdquo;, icon: MapPin },
    ];

    // Add role-specific sections
    if (isYouth) {
      baseSections.splice(4, 0, {
        id: &ldquo;work&rdquo;,
        label: &ldquo;Experiencia Laboral&rdquo;,
        icon: Briefcase,
      });
      baseSections.push({ id: &ldquo;cv&rdquo;, label: &ldquo;Generar CV&rdquo;, icon: FileText });
    }

    if (isAdolescent) {
      baseSections.push({
        id: &ldquo;parental&rdquo;,
        label: &ldquo;Consentimiento Parental&rdquo;,
        icon: AlertCircle,
      });
    }

    return baseSections;
  };

  const sections = getAvailableSections();

  return (
    <div className=&ldquo;max-w-7xl mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div className=&ldquo;space-y-1&rdquo;>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>{getRoleTitle()}</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>{getRoleDescription()}</p>
        </div>

        <div className=&ldquo;flex items-center gap-2&rdquo;>
          <Badge variant={isAdolescent ? &ldquo;secondary&rdquo; : &ldquo;default&rdquo;}>
            {isAdolescent ? &ldquo;Adolescente&rdquo; : &ldquo;Joven&rdquo;}
          </Badge>
          {profile.profileCompletion !== undefined && (
            <Badge
              variant={profile.profileCompletion >= 80 ? &ldquo;default&rdquo; : &ldquo;outline&rdquo;}
            >
              {profile.profileCompletion}% Completo
            </Badge>
          )}
        </div>
      </div>

      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-4 gap-6&rdquo;>
        {/* Sidebar Navigation */}
        <div className=&ldquo;lg:col-span-1&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;text-sm&rdquo;>Secciones del Perfil</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;p-0&rdquo;>
              <nav className=&ldquo;space-y-1&rdquo;>
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <Button
                      key={section.id}
                      variant={isActive ? &ldquo;secondary&rdquo; : &ldquo;ghost&rdquo;}
                      className=&ldquo;w-full justify-start text-left h-auto p-3&rdquo;
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className=&ldquo;h-4 w-4 mr-3 flex-shrink-0&rdquo; />
                      <span className=&ldquo;truncate&rdquo;>{section.label}</span>
                    </Button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Profile Photo Upload */}
          <Card className=&ldquo;mt-4&rdquo;>
            <CardHeader>
              <CardTitle className=&ldquo;text-sm flex items-center gap-2&rdquo;>
                <Camera className=&ldquo;h-4 w-4&rdquo; />
                Foto de Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImage={profile.avatarUrl}
                onImageChange={(url) => {
                  // TODO: Update profile avatar
                  console.log(&ldquo;Avatar updated:&rdquo;, url);
                }}
                type=&ldquo;avatar&rdquo;
                maxSize={2}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className=&ldquo;lg:col-span-3&rdquo;>
          <div className=&ldquo;space-y-6&rdquo;>
            {/* Overview Section */}
            {activeSection === &ldquo;overview&rdquo; && (
              <div className=&ldquo;space-y-6&rdquo;>
                <ProfileCompletionIndicator
                  profile={profile}
                  userRole={userRole}
                  onSectionClick={handleSectionClick}
                />

                {/* Quick Stats */}
                <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <GraduationCap className=&ldquo;h-5 w-5 text-blue-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Educación
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.educationLevel || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <MapPin className=&ldquo;h-5 w-5 text-green-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Ubicación
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.municipality || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <Star className=&ldquo;h-5 w-5 text-yellow-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Habilidades
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.skills?.length || 0} registradas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Role-specific alerts */}
                {isAdolescent && !profile.parentalConsent && (
                  <Card className=&ldquo;border-orange-200 bg-orange-50&rdquo;>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2 text-orange-700&rdquo;>
                        <AlertCircle className=&ldquo;h-5 w-5&rdquo; />
                        <div>
                          <p className=&ldquo;font-medium&rdquo;>
                            Consentimiento Parental Requerido
                          </p>
                          <p className=&ldquo;text-sm&rdquo;>
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
            {activeSection === &ldquo;personal&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Datos básicos de contacto e identificación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
                    Formulario de información personal en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Academic Profile Form */}
            {activeSection === &ldquo;academic&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle>Perfil Académico</CardTitle>
                  <CardDescription>
                    Información sobre tu educación y estudios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
                    Formulario académico en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Work Experience Form (Youth only) */}
            {activeSection === &ldquo;work&rdquo; && isYouth && (
              <Card>
                <CardHeader>
                  <CardTitle>Experiencia Laboral</CardTitle>
                  <CardDescription>
                    Registra tu historial de trabajos y experiencia profesional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
                    Formulario de experiencia laboral en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Skills and Competences */}
            {activeSection === &ldquo;skills&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                    <Star className=&ldquo;h-5 w-5&rdquo; />
                    Habilidades y Competencias
                  </CardTitle>
                  <CardDescription>
                    {isAdolescent
                      ? &ldquo;Registra tus intereses y habilidades para descubrir oportunidades&rdquo;
                      : &ldquo;Destaca tus habilidades técnicas y blandas para empleadores&rdquo;}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsSelector
                    selectedSkills={profile.skills || []}
                    onSkillsChange={(skills) => {
                      // TODO: Update profile skills
                      console.log(&ldquo;Skills updated:&rdquo;, skills);
                    }}
                    maxSkills={isAdolescent ? 10 : 20}
                    showLevels={isYouth}
                  />
                </CardContent>
              </Card>
            )}

            {/* Location Selector */}
            {activeSection === &ldquo;location&rdquo; && (
              <LocationSelector
                selectedDepartment={profile.department || &ldquo;&rdquo;}
                selectedMunicipality={profile.municipality || &ldquo;&rdquo;}
                onLocationChange={(department, municipality) => {
                  // TODO: Update profile location
                  console.log(&ldquo;Location updated:&rdquo;, {
                    department,
                    municipality,
                  });
                }}
                required
              />
            )}

            {/* CV Generator (Youth only) */}
            {activeSection === &ldquo;cv&rdquo; && isYouth && (
              <Card>
                <CardHeader>
                  <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                    <FileText className=&ldquo;h-5 w-5&rdquo; />
                    Generador de CV
                  </CardTitle>
                  <CardDescription>
                    Crea tu currículum vitae automáticamente con la información
                    de tu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
                    Generador de CV en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Parental Consent Form (Adolescents only) */}
            {activeSection === &ldquo;parental&rdquo; && isAdolescent && (
              <Card>
                <CardHeader>
                  <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                    <AlertCircle className=&ldquo;h-5 w-5&rdquo; />
                    Consentimiento Parental
                  </CardTitle>
                  <CardDescription>
                    Autorización de padres o tutores para participar en la
                    plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
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
