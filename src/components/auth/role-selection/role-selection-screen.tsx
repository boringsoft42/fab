"use client";

import { useState } from "react";
type UserRole =
  | "YOUTH"
  | "ADOLESCENTS"
  | "COMPANIES"
  | "MUNICIPAL_GOVERNMENTS"
  | "TRAINING_CENTERS"
  | "NGOS_AND_FOUNDATIONS";
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
  Building,
  GraduationCap,
  Users,
  Target,
  Briefcase,
  Search,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: any;
  color: string;
  modules: string[];
  targetAudience: string;
  examples: string[];
}

interface RoleSelectionScreenProps {
  onRoleSelect: (role: UserRole) => void;
  isLoading?: boolean;
}

const roleOptions: RoleOption[] = [
  {
    role: "YOUTH",
    title: "Joven",
    description:
      "Para jóvenes que buscan empleo y oportunidades de desarrollo profesional",
    icon: User,
    color: "bg-blue-500",
    targetAudience: "Jóvenes de 18+ años",
    examples: ["Universitarios", "Egresados", "Profesionales jóvenes"],
    modules: [
      "Búsqueda de Empleo",
      "Capacitación y Recursos",
      "Emprendimiento",
      "Reportes Personales",
    ],
  },
  {
    role: "ADOLESCENTS",
    title: "Adolescente",
    description:
      "Para adolescentes que exploran oportunidades educativas y laborales",
    icon: GraduationCap,
    color: "bg-green-500",
    targetAudience: "Adolescentes de 14-17 años",
    examples: ["Estudiantes de secundaria", "Bachilleres"],
    modules: [
      "Búsqueda de Empleo",
      "Capacitación y Recursos",
      "Emprendimiento",
    ],
  },
  {
    role: "COMPANIES",
    title: "Empresa",
    description:
      "Para empresas que buscan talento y publican ofertas de trabajo",
    icon: Building,
    color: "bg-purple-500",
    targetAudience: "Empresas y empleadores",
    examples: ["Startups", "PYMEs", "Grandes empresas"],
    modules: ["Publicación de Ofertas", "Reportes Empresariales"],
  },
  {
    role: "MUNICIPAL_GOVERNMENTS",
    title: "Gobierno Municipal",
    description:
      "Para gobiernos municipales que gestionan programas de empleabilidad",
    icon: Building,
    color: "bg-red-500",
    targetAudience: "Administración pública municipal",
    examples: ["Alcaldías", "Secretarías municipales"],
    modules: [
      "Gestión de Capacitación",
      "Gestión de Emprendimiento",
      "Reportes Avanzados",
    ],
  },
  {
    role: "TRAINING_CENTERS",
    title: "Centro de Capacitación",
    description: "Para instituciones educativas y centros de formación técnica",
    icon: Users,
    color: "bg-orange-500",
    targetAudience: "Instituciones educativas",
    examples: ["Universidades", "Institutos técnicos", "Centros de formación"],
    modules: [
      "Gestión de Capacitación",
      "Gestión de Emprendimiento",
      "Reportes Educativos",
    ],
  },
  {
    role: "NGOS_AND_FOUNDATIONS",
    title: "ONG/Fundación",
    description:
      "Para organizaciones sin fines de lucro con programas sociales",
    icon: Target,
    color: "bg-teal-500",
    targetAudience: "Organizaciones sociales",
    examples: ["ONGs", "Fundaciones", "Organizaciones comunitarias"],
    modules: [
      "Gestión de Capacitación",
      "Gestión de Emprendimiento",
      "Reportes de Impacto",
    ],
  },
];

const getModuleIcon = (module: string) => {
  if (module.includes("Búsqueda")) return Search;
  if (module.includes("Publicación")) return Briefcase;
  if (module.includes("Capacitación")) return GraduationCap;
  if (module.includes("Emprendimiento")) return Target;
  if (module.includes("Reportes")) return BarChart3;
  return FileText;
};

export function RoleSelectionScreen({
  onRoleSelect,
  isLoading = false,
}: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            ¡Bienvenido a CEMSE!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Selecciona tu tipo de usuario para acceder a las funcionalidades
            diseñadas específicamente para ti
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.role;

            return (
              <Card
                key={option.role}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleRoleSelect(option.role)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <CardTitle className="text-xl flex items-center justify-center gap-2">
                    {option.title}
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </CardTitle>

                  <CardDescription className="text-sm">
                    {option.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Target Audience */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Dirigido a:
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {option.targetAudience}
                    </Badge>
                  </div>

                  {/* Examples */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Ejemplos:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {option.examples.map((example, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Available Modules */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Módulos disponibles:
                    </p>
                    <div className="space-y-1">
                      {option.modules.map((module, index) => {
                        const ModuleIcon = getModuleIcon(module);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <ModuleIcon className="w-3 h-3" />
                            {module}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Confirmation Section */}
        {selectedRole && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                Has seleccionado:{" "}
                <strong>
                  {roleOptions.find((r) => r.role === selectedRole)?.title}
                </strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Podrás cambiar esto más tarde en tu perfil si es necesario
              </p>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Configurando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-gray-500">
          <p>
            ¿No estás seguro qué opción elegir? Contacta con nuestro soporte
            técnico
          </p>
        </div>
      </div>
    </div>
  );
}
