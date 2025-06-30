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
  Search,
  FileText,
  GraduationCap,
  Lightbulb,
  TrendingUp,
  Clock,
  Award,
  Target,
  ArrowRight,
  User,
  BookOpen,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

export function DashboardYouth() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido/a!</h1>
          <p className="text-muted-foreground">
            Explora oportunidades laborales y desarrolla tus habilidades
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <User className="w-4 h-4 mr-1" />
          Joven
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/jobs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Buscar Empleos
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                empleos disponibles
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/my-applications">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mis Postulaciones
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                postulaciones activas
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/training">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">en progreso</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/entrepreneurship">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Emprendimiento
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">plan activo</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Completitud del Perfil
            </CardTitle>
            <CardDescription>
              Completa tu perfil para acceder a más oportunidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso general</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Información básica
                </span>
                <Badge variant="secondary">Completo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Educación
                </span>
                <Badge variant="secondary">Completo</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  Experiencia laboral
                </span>
                <Badge variant="outline">Pendiente</Badge>
              </div>
            </div>
            <Button asChild size="sm" className="w-full">
              <Link href="/profile">
                Completar Perfil
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    Te postulaste a "Desarrollador Junior"
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    Completaste "Habilidades Blandas - Módulo 3"
                  </p>
                  <p className="text-xs text-muted-foreground">Ayer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">Actualizaste tu plan de negocio</p>
                  <p className="text-xs text-muted-foreground">Hace 3 días</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Training Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Capacitación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Habilidades Blandas</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Competencias Básicas</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
                <Badge className="mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  Certificado
                </Badge>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/training/my-courses">Ver Todos los Cursos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Job Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Postulaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">En revisión</span>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Preseleccionado</span>
                <Badge className="bg-blue-500">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Entrevistas</span>
                <Badge className="bg-green-500">1</Badge>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/my-applications">Ver Postulaciones</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Skills Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">JavaScript</Badge>
                <div className="flex-1">
                  <Progress value={70} className="h-1" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Comunicación</Badge>
                <div className="flex-1">
                  <Progress value={85} className="h-1" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Liderazgo</Badge>
                <div className="flex-1">
                  <Progress value={40} className="h-1" />
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/profile">Gestionar Habilidades</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
