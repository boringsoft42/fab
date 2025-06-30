"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  FileText,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Clock,
  Award,
  Target,
  ArrowRight,
  Users,
  BookOpen,
  Briefcase,
  Shield,
  Info,
  GraduationCapIcon,
  Heart,
} from "lucide-react";
import Link from "next/link";

export function DashboardAdolescent() {
  const modules = [
    {
      title: "Búsqueda de Empleo",
      description: "Explora oportunidades laborales apropiadas para tu edad",
      icon: Search,
      href: "/jobs",
      color: "bg-blue-500",
      stats: [
        { label: "Ofertas Apropiadas", value: "23" },
        { label: "Guardadas", value: "5" },
        { label: "Orientación", value: "8" },
      ],
      actions: [
        { label: "Explorar Ofertas", href: "/jobs/browse" },
        { label: "Orientación Laboral", href: "/jobs/guidance" },
        { label: "Preparación", href: "/jobs/preparation" },
      ],
    },
    {
      title: "Capacitación y Recursos Formativos",
      description: "Desarrolla habilidades y obtén orientación educativa",
      icon: GraduationCap,
      href: "/training",
      color: "bg-green-500",
      stats: [
        { label: "Cursos Disponibles", value: "32" },
        { label: "En Progreso", value: "1" },
        { label: "Orientaciones", value: "3" },
      ],
      actions: [
        { label: "Ver Cursos", href: "/training/courses" },
        { label: "Orientación Académica", href: "/training/academic-guidance" },
        {
          label: "Recursos Educativos",
          href: "/training/educational-resources",
        },
      ],
    },
    {
      title: "Emprendimiento",
      description:
        "Explora ideas de negocio y desarrolla habilidades empresariales",
      icon: Target,
      href: "/entrepreneurship",
      color: "bg-purple-500",
      stats: [
        { label: "Ideas Juveniles", value: "15" },
        { label: "Talleres", value: "6" },
        { label: "Educación Financiera", value: "4" },
      ],
      actions: [
        { label: "Ideas Juveniles", href: "/entrepreneurship/youth-ideas" },
        {
          label: "Educación Financiera",
          href: "/entrepreneurship/financial-education",
        },
        { label: "Talleres", href: "/entrepreneurship/workshops" },
      ],
    },
    // NOTE: No Reports module for adolescents according to the permissions matrix
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ¡Bienvenido Adolescente!
            </h1>
            <p className="text-green-100">
              Explora oportunidades educativas, desarrolla tus habilidades y
              prepárate para tu futuro
            </p>
          </div>
          <div className="hidden md:flex">
            <GraduationCapIcon className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      {/* Parental Consent Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">
              Recordatorio Importante
            </h3>
            <p className="text-sm text-amber-700">
              Recuerda que para ciertas actividades necesitas autorización de
              tus padres o tutores.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Ofertas Apropiadas</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Cursos en Progreso</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Talleres Disponibles</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Modules */}
      <div className="space-y-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {module.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {module.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={index === 0 ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <Link href={action.href}>
                        {action.label}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recursos Educativos Destacados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Orientación Vocacional
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Descubre qué carrera se adapta mejor a tus intereses y
                habilidades
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/training/vocational-guidance">Comenzar Test</Link>
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">
                Habilidades del Siglo XXI
              </h4>
              <p className="text-sm text-green-700 mb-3">
                Desarrolla competencias digitales y habilidades blandas
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/training/21st-century-skills">Ver Cursos</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  Completaste "Orientación Vocacional - Módulo 1"
                </span>
              </div>
              <Badge variant="secondary">Hace 1 día</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm">
                  Participaste en taller "Educación Financiera Básica"
                </span>
              </div>
              <Badge variant="secondary">Hace 3 días</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  Guardaste oferta de trabajo de medio tiempo
                </span>
              </div>
              <Badge variant="secondary">Hace 5 días</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Heart className="w-8 h-8 text-pink-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">¿Necesitas ayuda?</h3>
          <p className="text-gray-600 mb-4">
            Estamos aquí para apoyarte en tu desarrollo académico y profesional
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/support/academic">Apoyo Académico</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/support/career">Orientación Profesional</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
