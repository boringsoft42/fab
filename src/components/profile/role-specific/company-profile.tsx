&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
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
  FileText,
  Users,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
} from &ldquo;lucide-react&rdquo;;

// Import shared components
import { ProfileCompletionIndicator } from &ldquo;../shared/profile-completion-indicator&rdquo;;
import { ImageUpload } from &ldquo;../shared/image-upload&rdquo;;
import { LocationSelector } from &ldquo;../shared/location-selector&rdquo;;

interface CompanyProfileProps {
  profile: Profile;
}

export function CompanyProfile({ profile }: CompanyProfileProps) {
  const [activeSection, setActiveSection] = useState(&ldquo;overview&rdquo;);

  // Handle section navigation from completion indicator
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getAvailableSections = () => {
    return [
      { id: &ldquo;overview&rdquo;, label: &ldquo;Resumen Empresarial&rdquo;, icon: Building },
      { id: &ldquo;company&rdquo;, label: &ldquo;Información Empresarial&rdquo;, icon: Building },
      { id: &ldquo;legal&rdquo;, label: &ldquo;Datos Legales&rdquo;, icon: FileText },
      { id: &ldquo;contact&rdquo;, label: &ldquo;Información de Contacto&rdquo;, icon: Phone },
      { id: &ldquo;description&rdquo;, label: &ldquo;Descripción y Cultura&rdquo;, icon: Globe },
    ];
  };

  const sections = getAvailableSections();

  const getCompanySize = (size: string) => {
    switch (size) {
      case &ldquo;MICRO&rdquo;:
        return &ldquo;Microempresa (1-10 empleados)&rdquo;;
      case &ldquo;SMALL&rdquo;:
        return &ldquo;Pequeña empresa (11-50 empleados)&rdquo;;
      case &ldquo;MEDIUM&rdquo;:
        return &ldquo;Mediana empresa (51-200 empleados)&rdquo;;
      case &ldquo;LARGE&rdquo;:
        return &ldquo;Gran empresa (200+ empleados)&rdquo;;
      default:
        return &ldquo;No especificado&rdquo;;
    }
  };

  return (
    <div className=&ldquo;max-w-7xl mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div className=&ldquo;space-y-1&rdquo;>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Perfil Empresarial</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Información completa de tu empresa para publicar ofertas de trabajo
          </p>
        </div>

        <div className=&ldquo;flex items-center gap-2&rdquo;>
          <Badge variant=&ldquo;default&rdquo;>Empresa</Badge>
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

          {/* Company Logo Upload */}
          <Card className=&ldquo;mt-4&rdquo;>
            <CardHeader>
              <CardTitle className=&ldquo;text-sm flex items-center gap-2&rdquo;>
                <Camera className=&ldquo;h-4 w-4&rdquo; />
                Logo Empresarial
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
                placeholder=&ldquo;Logo de la empresa&rdquo;
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
                  userRole=&ldquo;COMPANIES&rdquo;
                  onSectionClick={handleSectionClick}
                />

                {/* Company Overview Cards */}
                <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4&rdquo;>
                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <Building className=&ldquo;h-5 w-5 text-blue-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Empresa
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.companyName || &ldquo;Nombre no registrado&rdquo;}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <Briefcase className=&ldquo;h-5 w-5 text-green-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Sector
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.businessSector || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <Users className=&ldquo;h-5 w-5 text-purple-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Tamaño
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {getCompanySize(profile.companySize || &ldquo;&rdquo;)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=&ldquo;p-4&rdquo;>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <MapPin className=&ldquo;h-5 w-5 text-red-500&rdquo; />
                        <div>
                          <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            Ubicación
                          </p>
                          <p className=&ldquo;font-medium&rdquo;>
                            {profile.municipality
                              ? `${profile.municipality}, ${profile.department}`
                              : &ldquo;No especificado&rdquo;}
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
                      <CardTitle className=&ldquo;text-lg&rdquo;>
                        Acerca de la Empresa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className=&ldquo;text-muted-foreground line-clamp-3&rdquo;>
                        {profile.companyDescription}
                      </p>
                      <Button variant=&ldquo;link&rdquo; className=&ldquo;p-0 mt-2&rdquo;>
                        Ver descripción completa
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Company Information Form */}
            {activeSection === &ldquo;company&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                    <Building className=&ldquo;h-5 w-5&rdquo; />
                    Información Empresarial
                  </CardTitle>
                  <CardDescription>
                    Datos básicos de tu empresa y actividad comercial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=&ldquo;space-y-4&rdquo;>
                    <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                      <div>
                        <p className=&ldquo;text-sm font-medium&rdquo;>
                          Nombre de la Empresa
                        </p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {profile.companyName || &ldquo;No especificado&rdquo;}
                        </p>
                      </div>
                      <div>
                        <p className=&ldquo;text-sm font-medium&rdquo;>
                          Sector Empresarial
                        </p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {profile.businessSector || &ldquo;No especificado&rdquo;}
                        </p>
                      </div>
                      <div>
                        <p className=&ldquo;text-sm font-medium&rdquo;>
                          Tamaño de la Empresa
                        </p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {getCompanySize(profile.companySize || &ldquo;&rdquo;)}
                        </p>
                      </div>
                      <div>
                        <p className=&ldquo;text-sm font-medium&rdquo;>Año de Fundación</p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {profile.foundedYear || &ldquo;No especificado&rdquo;}
                        </p>
                      </div>
                    </div>

                    <div className=&ldquo;pt-4&rdquo;>
                      <p className=&ldquo;text-muted-foreground&rdquo;>
                        Formulario de información empresarial en desarrollo...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legal Information */}
            {activeSection === &ldquo;legal&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                    <FileText className=&ldquo;h-5 w-5&rdquo; />
                    Datos Legales
                  </CardTitle>
                  <CardDescription>
                    Información legal y fiscal de la empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=&ldquo;space-y-4&rdquo;>
                    <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                      <div>
                        <p className=&ldquo;text-sm font-medium&rdquo;>
                          NIT / Número de Identificación Tributaria
                        </p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {profile.taxId || &ldquo;No especificado&rdquo;}
                        </p>
                      </div>
                      <div>
                        <p className=&ldquo;text-sm font-medium&rdquo;>
                          Representante Legal
                        </p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {profile.legalRepresentative || &ldquo;No especificado&rdquo;}
                        </p>
                      </div>
                    </div>

                    <div className=&ldquo;pt-4&rdquo;>
                      <p className=&ldquo;text-muted-foreground&rdquo;>
                        Formulario de datos legales en desarrollo...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            {activeSection === &ldquo;contact&rdquo; && (
              <div className=&ldquo;space-y-6&rdquo;>
                <Card>
                  <CardHeader>
                    <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                      <Phone className=&ldquo;h-5 w-5&rdquo; />
                      Información de Contacto
                    </CardTitle>
                    <CardDescription>
                      Datos de contacto de la empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className=&ldquo;space-y-4&rdquo;>
                      <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
                        <div>
                          <p className=&ldquo;text-sm font-medium&rdquo;>
                            Email Corporativo
                          </p>
                          <p className=&ldquo;text-muted-foreground&rdquo;>
                            {profile.email || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                        <div>
                          <p className=&ldquo;text-sm font-medium&rdquo;>Teléfono</p>
                          <p className=&ldquo;text-muted-foreground&rdquo;>
                            {profile.phone || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                        <div>
                          <p className=&ldquo;text-sm font-medium&rdquo;>Dirección</p>
                          <p className=&ldquo;text-muted-foreground&rdquo;>
                            {profile.address || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                        <div>
                          <p className=&ldquo;text-sm font-medium&rdquo;>Sitio Web</p>
                          <p className=&ldquo;text-muted-foreground&rdquo;>
                            {profile.website || &ldquo;No especificado&rdquo;}
                          </p>
                        </div>
                      </div>

                      <div className=&ldquo;pt-4&rdquo;>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          Formulario de contacto en desarrollo...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Selector */}
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

            {/* Company Description */}
            {activeSection === &ldquo;description&rdquo; && (
              <Card>
                <CardHeader>
                  <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
                    <Globe className=&ldquo;h-5 w-5&rdquo; />
                    Descripción y Cultura Empresarial
                  </CardTitle>
                  <CardDescription>
                    Describe tu empresa, misión, visión y cultura organizacional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className=&ldquo;space-y-4&rdquo;>
                    {profile.companyDescription && (
                      <div className=&ldquo;p-4 bg-muted rounded-lg&rdquo;>
                        <p className=&ldquo;text-sm font-medium mb-2&rdquo;>
                          Descripción Actual:
                        </p>
                        <p className=&ldquo;text-muted-foreground&rdquo;>
                          {profile.companyDescription}
                        </p>
                      </div>
                    )}

                    <div className=&ldquo;pt-4&rdquo;>
                      <p className=&ldquo;text-muted-foreground&rdquo;>
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
