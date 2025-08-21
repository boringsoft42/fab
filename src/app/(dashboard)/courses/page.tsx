"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { useCourses } from "@/hooks/useCourses";
import { Course } from "@/types/api";

export default function CoursesPage() {
  const { courses, loading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debug logs
  console.log('🔍 CoursesPage - courses:', courses);
  console.log('🔍 CoursesPage - loading:', loading);
  console.log('🔍 CoursesPage - error:', error);
  console.log('🔍 CoursesPage - courses length:', courses?.length || 0);

  // Estadísticas
  const stats = {
    total: courses?.length || 0,
    inProgress: 0, // Se calculará con las inscripciones
    completed: 0,
    certificates: 0,
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      SOFT_SKILLS: "Habilidades Blandas",
      BASIC_COMPETENCIES: "Competencias Básicas",
      JOB_PLACEMENT: "Inserción Laboral",
      ENTREPRENEURSHIP: "Emprendimiento",
      TECHNICAL_SKILLS: "Habilidades Técnicas",
      DIGITAL_LITERACY: "Alfabetización Digital",
      COMMUNICATION: "Comunicación",
      LEADERSHIP: "Liderazgo",
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      BEGINNER: "Principiante",
      INTERMEDIATE: "Intermedio",
      ADVANCED: "Avanzado",
    };
    return labels[level] || level;
  };

  const filteredCourses = courses?.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  }) || [];

  console.log('🔍 CoursesPage - filteredCourses:', filteredCourses);
  console.log('🔍 CoursesPage - searchQuery:', searchQuery);
  console.log('🔍 CoursesPage - categoryFilter:', categoryFilter);
  console.log('🔍 CoursesPage - levelFilter:', levelFilter);

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "SOFT_SKILLS", label: "Habilidades Blandas" },
    { value: "BASIC_COMPETENCIES", label: "Competencias Básicas" },
    { value: "JOB_PLACEMENT", label: "Inserción Laboral" },
    { value: "ENTREPRENEURSHIP", label: "Emprendimiento" },
    { value: "TECHNICAL_SKILLS", label: "Habilidades Técnicas" },
    { value: "DIGITAL_LITERACY", label: "Alfabetización Digital" },
    { value: "COMMUNICATION", label: "Comunicación" },
    { value: "LEADERSHIP", label: "Liderazgo" },
  ];

  const levels = [
    { value: "all", label: "Todos los niveles" },
    { value: "BEGINNER", label: "Principiante" },
    { value: "INTERMEDIATE", label: "Intermedio" },
    { value: "ADVANCED", label: "Avanzado" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explorar Cursos</h1>
        <p className="text-muted-foreground">
            Descubre cursos para desarrollar tus habilidades y competencias
        </p>
      </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Cursos Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">En Progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.certificates}</p>
                  <p className="text-sm text-muted-foreground">Certificados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
                  placeholder="Buscar cursos..."
            value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
          />
        </div>
          </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Vista */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
            {filteredCourses.length} cursos encontrados
            </p>
          </div>

        {error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Error al cargar los cursos: {error}</p>
            </CardContent>
          </Card>
        )}

        {filteredCourses.length === 0 && !loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No se encontraron cursos</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode={viewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
