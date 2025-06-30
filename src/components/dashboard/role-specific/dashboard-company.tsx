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
import {
  Briefcase,
  Building2,
  Users,
  UserCheck,
  Clock,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Plus,
  Eye,
  Calendar,
  Target,
  Award,
  MessageSquare,
  FileText,
  Building,
} from "lucide-react";
import Link from "next/link";

export function DashboardCompany() {
  const modules = [
    {
      title: "Publicación de Ofertas de Trabajo",
      description:
        "Gestiona y publica ofertas laborales para atraer el mejor talento",
      icon: Briefcase,
      href: "/job-publishing",
      color: "bg-blue-500",
      stats: [
        { label: "Ofertas Activas", value: "8" },
        { label: "Candidatos", value: "124" },
        { label: "En Proceso", value: "15" },
      ],
      actions: [
        { label: "Crear Oferta", href: "/job-publishing/create" },
        { label: "Mis Ofertas", href: "/job-publishing/my-offers" },
        { label: "Gestionar Candidatos", href: "/job-publishing/candidates" },
      ],
    },
    {
      title: "Reportes Empresariales",
      description:
        "Analiza métricas de reclutamiento y rendimiento empresarial",
      icon: BarChart3,
      href: "/reports",
      color: "bg-green-500",
      stats: [
        { label: "Postulaciones", value: "124" },
        { label: "Conversión", value: "12%" },
        { label: "Tiempo Promedio", value: "18d" },
      ],
      actions: [
        { label: "Ver Reportes", href: "/reports/company" },
        { label: "Métricas de Reclutamiento", href: "/reports/recruitment" },
        { label: "Análisis de Talento", href: "/reports/talent-analysis" },
      ],
    },
    // NOTE: Only Job Publishing and Reports for companies according to the permissions matrix
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Empresa</h1>
            <p className="text-blue-100">
              Encuentra el talento ideal para tu empresa y gestiona tus procesos
              de reclutamiento
            </p>
          </div>
          <div className="hidden md:flex">
            <Building className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Ofertas Activas</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Total Candidatos</p>
                <p className="text-2xl font-bold">124</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">En Proceso</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Tasa Conversión</p>
                <p className="text-2xl font-bold">12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* Active Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Ofertas de Trabajo Activas
          </CardTitle>
          <CardDescription>
            Gestiona tus publicaciones laborales activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Desarrollador Frontend Senior</h4>
                  <p className="text-sm text-gray-600">Publicado hace 3 días</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">24 candidatos</p>
                  <p className="text-sm text-gray-600">5 nuevos</p>
                </div>
                <Badge variant="default">Activa</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Especialista en Marketing</h4>
                  <p className="text-sm text-gray-600">
                    Publicado hace 1 semana
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">18 candidatos</p>
                  <p className="text-sm text-gray-600">2 en entrevista</p>
                </div>
                <Badge variant="secondary">En proceso</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Analista de Datos</h4>
                  <p className="text-sm text-gray-600">
                    Publicado hace 2 semanas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">31 candidatos</p>
                  <p className="text-sm text-gray-600">1 finalista</p>
                </div>
                <Badge variant="outline">Por cerrar</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button asChild className="w-full">
              <Link href="/job-publishing/my-offers">
                Ver Todas las Ofertas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
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
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  Nueva postulación para "Desarrollador Frontend Senior"
                </span>
              </div>
              <Badge variant="secondary">Hace 30 min</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm">
                  Entrevista programada con candidato para "Marketing"
                </span>
              </div>
              <Badge variant="secondary">Hace 2 horas</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span className="text-sm">
                  Publicaste nueva oferta "Desarrollador Backend"
                </span>
              </div>
              <Badge variant="secondary">Hace 1 día</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Crear Nueva Oferta</h3>
            <p className="text-gray-600 mb-4">
              Publica una nueva oferta de trabajo para encontrar candidatos
              ideales
            </p>
            <Button asChild>
              <Link href="/job-publishing/create">
                Crear Oferta
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Análisis de Rendimiento
            </h3>
            <p className="text-gray-600 mb-4">
              Revisa métricas detalladas de tus procesos de reclutamiento
            </p>
            <Button variant="outline" asChild>
              <Link href="/reports/recruitment">
                Ver Reportes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
