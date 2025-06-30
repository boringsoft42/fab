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
} from "lucide-react";
import Link from "next/link";

export function DashboardAdolescent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">¡Bienvenido/a!</h1>
          <p className="text-muted-foreground">
            Desarrolla tus habilidades y explora oportunidades de crecimiento
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Users className="w-4 h-4 mr-1" />
          Adolescente
        </Badge>
      </div>

      {/* Parental Consent Alert (if needed) */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Tu cuenta está supervisada según las políticas de protección para
          adolescentes.
          <Button variant="link" className="p-0 h-auto ml-1">
            Más información
          </Button>
        </AlertDescription>
      </Alert>

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
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">empleos adecuados</p>
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
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                postulación activa
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
              <div className="text-2xl font-bold">3</div>
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
              <p className="text-xs text-muted-foreground">
                idea desarrollando
              </p>
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
              Completa tu perfil educativo y de intereses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso general</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
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
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Educación actual
                </span>
                <Badge variant="secondary" >
                  Completo
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  Intereses y habilidades
                </span>
                <Badge variant="outline" >
                  Pendiente
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Consentimiento parental
                </span>
                <Badge variant="outline" >
                  Requerido
                </Badge>
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

        {/* Educational Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Progreso Académico
            </CardTitle>
            <CardDescription>
              Tu avance en cursos y certificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Habilidades Básicas</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Desarrollo Personal</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Orientación Vocacional</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                Cursos adaptados para tu edad
              </span>
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
              Mis Cursos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Competencias Básicas</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-2" />
                <Badge  className="mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  Casi completado
                </Badge>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Orientación Laboral</span>
                  <span>30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/training/my-courses">Ver Mis Cursos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prácticas</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Voluntariados</span>
                <Badge className="bg-green-500">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Empleos de medio tiempo</span>
                <Badge className="bg-blue-500">15</Badge>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/jobs">Explorar Oportunidades</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Skills & Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Intereses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" >
                  Arte
                </Badge>
                <Badge variant="outline" >
                  Tecnología
                </Badge>
                <Badge variant="outline" >
                  Deportes
                </Badge>
                <Badge variant="outline" >
                  Música
                </Badge>
                <Badge variant="outline" >
                  Ciencias
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Desarrolla tus intereses a través de nuestros cursos
                especializados
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/profile">Actualizar Intereses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  Completaste "Competencias Básicas - Comunicación"
                </p>
                <p className="text-xs text-muted-foreground">Hace 1 hora</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  Te inscribiste en "Orientación Vocacional"
                </p>
                <p className="text-xs text-muted-foreground">Hace 2 días</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  Actualizaste tus intereses en tu perfil
                </p>
                <p className="text-xs text-muted-foreground">Hace 1 semana</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
