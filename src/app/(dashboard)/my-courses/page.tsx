"use client";

import { useState } from "react";
import Link from "next/link";
import { EnrollmentStatus } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  PlayCircle,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useMyCourses, useMyCoursesStats, UserCourse } from "@/hooks/useMyCourses";
import { EnrollmentCourseCard } from "@/components/courses/enrollment-course-card";

export default function MyCoursesPage() {
  const { data: courses, isLoading, error } = useMyCourses();
  const stats = useMyCoursesStats(courses);
  const [filter, setFilter] = useState<EnrollmentStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  console.log("🔍 MyCoursesPage - courses:", courses);
  console.log("🔍 MyCoursesPage - isLoading:", isLoading);
  console.log("🔍 MyCoursesPage - error:", error);
  console.log("🔍 MyCoursesPage - stats:", stats);

  const filteredCourses = courses?.filter(
    (course: UserCourse) => {
      const matchesSearch = course.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.course.instructor?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      const matchesFilter = filter === "all" || course.status === filter;
      
      return matchesSearch && matchesFilter;
    }
  ) || [];

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case EnrollmentStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case EnrollmentStatus.ENROLLED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.COMPLETED:
        return "Completado";
      case EnrollmentStatus.IN_PROGRESS:
        return "En progreso";
      case EnrollmentStatus.ENROLLED:
        return "Inscrito";
      default:
        return status;
    }
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes % 60}m`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Cursos</h1>
          <p className="text-muted-foreground">
            Gestiona tu progreso de aprendizaje y continúa con tus cursos
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error al cargar cursos</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Cursos</h1>
        <p className="text-muted-foreground">
          Gestiona tu progreso de aprendizaje y continúa con tus cursos
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Cursos
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  En Progreso
                </p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completados
                </p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Certificados
                </p>
                <p className="text-2xl font-bold">
                  {stats.certificatesEarned}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filter}
          onValueChange={(value) =>
            setFilter(value as EnrollmentStatus | "all")
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los cursos</SelectItem>
            <SelectItem value={EnrollmentStatus.ENROLLED}>Inscritos</SelectItem>
            <SelectItem value={EnrollmentStatus.IN_PROGRESS}>
              En progreso
            </SelectItem>
            <SelectItem value={EnrollmentStatus.COMPLETED}>
              Completados
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay cursos</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filter !== "all"
                ? "No se encontraron cursos con los filtros aplicados"
                : "Aún no te has inscrito en ningún curso"}
            </p>
            {!searchQuery && filter === "all" && (
              <Button asChild>
                <Link href="/courses">Explorar cursos</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((userCourse: UserCourse) => (
            <EnrollmentCourseCard
              key={userCourse.id}
              userCourse={userCourse}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progreso promedio</span>
                  <span>{Math.round(stats.averageProgress)}%</span>
                </div>
                <Progress value={stats.averageProgress} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  Tiempo total invertido:{" "}
                  {formatTimeSpent(stats.totalTimeSpent)}
                </p>
                <p>Cursos activos: {stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Logros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cursos completados</span>
                <Badge variant="secondary">{stats.completed}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificados obtenidos</span>
                <Badge variant="secondary">
                  {stats.certificatesEarned}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo de estudio</span>
                <Badge variant="secondary">
                  {formatTimeSpent(stats.totalTimeSpent)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


