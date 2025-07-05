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
  Building,
  Target,
  Award,
  Phone,
  MapPin,
  Globe,
  Camera,
} from &ldquo;lucide-react&rdquo;;

import { ProfileCompletionIndicator } from &ldquo;../shared/profile-completion-indicator&rdquo;;
import { ImageUpload } from &ldquo;../shared/image-upload&rdquo;;
import { LocationSelector } from &ldquo;../shared/location-selector&rdquo;;

interface InstitutionalProfileProps {
  userRole:
    | &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;
    | &ldquo;TRAINING_CENTERS&rdquo;
    | &ldquo;NGOS_AND_FOUNDATIONS&rdquo;;
  profile: Profile;
}

export function InstitutionalProfile({
  userRole,
  profile,
}: InstitutionalProfileProps) {
  const [activeSection, setActiveSection] = useState(&ldquo;overview&rdquo;);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getRoleInfo = () => {
    switch (userRole) {
      case &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;:
        return {
          title: &ldquo;Perfil de Gobierno Municipal&rdquo;,
          description:
            &ldquo;Gestion de programas de empleabilidad y emprendimiento municipal&rdquo;,
          badge: &ldquo;Gobierno Municipal&rdquo;,
          icon: Building,
        };
      case &ldquo;TRAINING_CENTERS&rdquo;:
        return {
          title: &ldquo;Perfil de Centro de Capacitacion&rdquo;,
          description: &ldquo;Administracion de programas educativos y de formacion&rdquo;,
          badge: &ldquo;Centro de Capacitacion&rdquo;,
          icon: Award,
        };
      case &ldquo;NGOS_AND_FOUNDATIONS&rdquo;:
        return {
          title: &ldquo;Perfil de ONG/Fundacion&rdquo;,
          description: &ldquo;Gestion de programas sociales y de desarrollo&rdquo;,
          badge: &ldquo;ONG/Fundacion&rdquo;,
          icon: Target,
        };
      default:
        return {
          title: &ldquo;Perfil Institucional&rdquo;,
          description: &ldquo;Gestion institucional&rdquo;,
          badge: &ldquo;Institucion&rdquo;,
          icon: Building,
        };
    }
  };

  const getAvailableSections = () => {
    return [
      { id: &ldquo;overview&rdquo;, label: &ldquo;Resumen Institucional&rdquo;, icon: Building },
      {
        id: &ldquo;institutional&rdquo;,
        label: &ldquo;Informacion Institucional&rdquo;,
        icon: Building,
      },
      { id: &ldquo;services&rdquo;, label: &ldquo;Areas de Servicio&rdquo;, icon: Target },
      { id: &ldquo;contact&rdquo;, label: &ldquo;Informacion de Contacto&rdquo;, icon: Phone },
      { id: &ldquo;description&rdquo;, label: &ldquo;Descripcion Institucional&rdquo;, icon: Globe },
    ];
  };

  const sections = getAvailableSections();
  const roleInfo = getRoleInfo();

  return (
    <div className=&ldquo;max-w-7xl mx-auto p-6 space-y-6&rdquo;>
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div className=&ldquo;space-y-1&rdquo;>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>{roleInfo.title}</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>{roleInfo.description}</p>
        </div>

        <div className=&ldquo;flex items-center gap-2&rdquo;>
          <Badge variant=&ldquo;default&rdquo;>{roleInfo.badge}</Badge>
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

          <Card className=&ldquo;mt-4&rdquo;>
            <CardHeader>
              <CardTitle className=&ldquo;text-sm flex items-center gap-2&rdquo;>
                <Camera className=&ldquo;h-4 w-4&rdquo; />
                Logo Institucional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImage={profile.avatarUrl}
                onImageChange={(url) => {
                  console.log(&ldquo;Logo updated:&rdquo;, url);
                }}
                type=&ldquo;logo&rdquo;
                maxSize={5}
                placeholder=&ldquo;Logo de la institucion&rdquo;
              />
            </CardContent>
          </Card>
        </div>

        <div className=&ldquo;lg:col-span-3&rdquo;>
          <div className=&ldquo;space-y-6&rdquo;>
            {activeSection === &ldquo;overview&rdquo; && (
              <div className=&ldquo;space-y-6&rdquo;>
                <ProfileCompletionIndicator
                  profile={profile}
                  userRole={userRole}
                  onSectionClick={handleSectionClick}
                />

                <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <Building className=&ldquo;h-5 w-5 text-blue-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Institucion
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.institutionName || &ldquo;Nombre no registrado&rdquo;}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <Target className=&ldquo;h-5 w-5 text-green-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Area de Servicio
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.serviceArea || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === &ldquo;institutional&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle>Informacion Institucional</CardTitle>
                  <CardDescription>
                    Datos basicos de la institucion y tipo de organizacion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
                    Formulario institucional en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === &ldquo;services&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle>Areas de Servicio</CardTitle>
                  <CardDescription>
                    Servicios ofrecidos y areas de especializacion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
                    Editor de servicios en desarrollo...
                  </p>
                </CardContent>
              </Card>
            )}

            {activeSection === &ldquo;contact&rdquo; && (
              <div className=&ldquo;space-y-6&rdquo;>
                <Card>
                  <CardHeader>
                    <CardTitle>Informacion de Contacto</CardTitle>
                    <CardDescription>
                      Datos de contacto institucional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className=&ldquo;text-muted-foreground&rdquo;>
                      Formulario de contacto en desarrollo...
                    </p>
                  </CardContent>
                </Card>

                <LocationSelector
                  selectedDepartment={profile.department || &ldquo;&rdquo;}
                  selectedMunicipality={profile.municipality || &ldquo;&rdquo;}
                  onLocationChange={(department, municipality) => {
                    console.log(&ldquo;Location updated:&rdquo;, {
                      department,
                      municipality,
                    });
                  }}
                  required
                />
              </div>
            )}

            {activeSection === &ldquo;description&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle>Descripcion Institucional</CardTitle>
                  <CardDescription>
                    Mision, vision y descripcion de la institucion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className=&ldquo;text-muted-foreground&rdquo;>
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
