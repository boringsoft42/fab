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
} from "lucide-react";
import Link from "next/link";

export function DashboardCompany() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel Empresarial
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus ofertas laborales y encuentra el talento ideal
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Building2 className="w-4 h-4 mr-1" />
          Empresa
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Empleos Activos
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 publicados esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +23% vs. mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Candidatos Pre-seleccionados
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              7 pendientes entrevista
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">días para contratar</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/jobs/create">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Publicar Nueva Oferta
              </CardTitle>
              <CardDescription>
                Crea una nueva oportunidad laboral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Crear Empleo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/jobs/manage">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Gestionar Empleos
              </CardTitle>
              <CardDescription>
                Administra tus ofertas existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver Empleos
                <Eye className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/candidates">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Revisar Candidatos
              </CardTitle>
              <CardDescription>Evalúa postulaciones pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Pendientes</span>
                <Badge className="bg-orange-500">12</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Revisar Ahora
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Job Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rendimiento de Ofertas
            </CardTitle>
            <CardDescription>
              Estadísticas de tus últimas publicaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">Desarrollador Frontend</p>
                  <p className="text-xs text-muted-foreground">
                    Publicado hace 3 días
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 mb-1">42 postulaciones</Badge>
                  <div className="text-xs text-muted-foreground">86 vistas</div>
                </div>
              </div>
              <Progress value={85} className="h-2" />

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">Marketing Digital</p>
                  <p className="text-xs text-muted-foreground">
                    Publicado hace 1 semana
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-500 mb-1">28 postulaciones</Badge>
                  <div className="text-xs text-muted-foreground">64 vistas</div>
                </div>
              </div>
              <Progress value={60} className="h-2" />

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Asistente Administrativo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Publicado hace 2 semanas
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    15 postulaciones
                  </Badge>
                  <div className="text-xs text-muted-foreground">38 vistas</div>
                </div>
              </div>
              <Progress value={35} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Hiring Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pipeline de Contratación
            </CardTitle>
            <CardDescription>
              Estado actual de candidatos por etapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">
                    Postulaciones Nuevas
                  </span>
                </div>
                <Badge className="bg-blue-500">24</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-medium">En Revisión</span>
                </div>
                <Badge className="bg-yellow-500">12</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">
                    Entrevistas Programadas
                  </span>
                </div>
                <Badge className="bg-green-500">7</Badge>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">Ofertas Enviadas</span>
                </div>
                <Badge className="bg-purple-500">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Entrevistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">María González</p>
                  <p className="text-xs text-muted-foreground">
                    Desarrollador Frontend
                  </p>
                  <p className="text-xs text-muted-foreground">Hoy 14:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Carlos Mamani</p>
                  <p className="text-xs text-muted-foreground">
                    Marketing Digital
                  </p>
                  <p className="text-xs text-muted-foreground">Mañana 10:30</p>
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/interviews">Ver Todas las Entrevistas</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Company Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas Clave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tasa de Respuesta</span>
                <div className="flex items-center gap-2">
                  <Progress value={78} className="w-16 h-2" />
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Conversión a Entrevista</span>
                <div className="flex items-center gap-2">
                  <Progress value={22} className="w-16 h-2" />
                  <span className="text-sm font-medium">22%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Tasa de Contratación</span>
                <div className="flex items-center gap-2">
                  <Progress value={15} className="w-16 h-2" />
                  <span className="text-sm font-medium">15%</span>
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/reports/company">Ver Reportes Completos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Mensajes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm">
                    Pregunta sobre beneficios - Desarrollador Frontend
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm">
                    Confirmación de entrevista - Marketing
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm">
                    Consulta sobre modalidad - Administrativo
                  </p>
                  <p className="text-xs text-muted-foreground">Ayer</p>
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/messages">Ver Todos los Mensajes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Company Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Perfil de Empresa
          </CardTitle>
          <CardDescription>
            Un perfil completo atrae mejores candidatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completitud del perfil</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Información básica
                  </span>
                  <Badge variant="secondary" >
                    Completo
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Cultura empresarial
                  </span>
                  <Badge variant="outline" >
                    Pendiente
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Button asChild className="w-full">
                <Link href="/profile/company">
                  Completar Perfil
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
