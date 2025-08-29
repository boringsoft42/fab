"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CourseCategory, CourseLevel } from "@/types/courses";
import { Course } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Users,
  BookOpen,
  Clock,
  Star,
  BarChart3,
  Award,
  Layers,
  FileText,
  Video,
  Download,
  Play,
  CheckCircle,
  Lock,
  Unlock,
  Settings,
  GraduationCap,
  Target,
  TrendingUp,
  Building2,
} from "lucide-react";
import { useCourses } from "@/hooks/useCourseApi";
import { useCourseModules } from "@/hooks/useCourseModuleApi";
import { useModuleLessons } from "@/hooks/useLessonApi";
import { useLessonResources } from "@/hooks/useLessonResourceApi";
import { useCourseProgress } from "@/hooks/useLessonProgressApi";
import { useModuleCertificates } from "@/hooks/useModuleCertificateApi";

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  totalHours: number;
  averageRating: number;
  completionRate: number;
  activeCourses: number;
  totalModules: number;
  totalLessons: number;
  totalResources: number;
  totalCertificates: number;
}

export default function MunicipalityCourseManagementPage() {
  const { data: allCourses, loading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Filter courses to only show those created by this municipality
  const municipalityId = "municipality-1"; // TODO: Get from auth context
  const courses = allCourses?.filter(course => course.organizationId === municipalityId) || [];

  // Fetch modules for selected course
  const { data: modulesData } = useCourseModules(selectedCourse);
  const modules = modulesData?.modules || [];

  // Fetch lessons for all modules
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [allResources, setAllResources] = useState<any[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);

  // Calculate comprehensive stats for municipality courses
  const stats: CourseStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + (course.studentCount || 0), 0),
    totalHours: courses.reduce((sum, course) => sum + (course.duration || 0), 0),
    averageRating: courses.reduce((sum, course) => sum + (course.rating || 0), 0) / (courses.length || 1),
    completionRate: 78.5, // Mock data
    activeCourses: courses.filter(course => course.status === 'ACTIVE').length,
    totalModules: modules.length,
    totalLessons: allLessons.length,
    totalResources: allResources.length,
    totalCertificates: allCertificates.length,
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default">Activo</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Borrador</Badge>;
      case 'ARCHIVED':
        return <Badge variant="outline">Archivado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'TECHNOLOGY': 'Tecnología',
      'BUSINESS': 'Negocios',
      'HEALTH': 'Salud',
      'EDUCATION': 'Educación',
      'ARTS': 'Artes',
      'SCIENCE': 'Ciencia',
      'LANGUAGE': 'Idiomas',
      'OTHER': 'Otros'
    };
    return categories[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const levels: Record<string, string> = {
      'BEGINNER': 'Principiante',
      'INTERMEDIATE': 'Intermedio',
      'ADVANCED': 'Avanzado'
    };
    return levels[level] || level;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error al cargar los cursos</h2>
          <p className="text-gray-600 mt-2">No se pudieron cargar los cursos del municipio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🎓 Gestión de Cursos del Municipio</h1>
          <p className="text-muted-foreground mt-2">
            Administra los cursos creados por tu municipio
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analíticas
          </Button>
          <Link href="/municipalities/courses/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Curso
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
                <p className="text-sm text-muted-foreground">Cursos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalModules}</p>
                <p className="text-sm text-muted-foreground">Módulos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalResources}</p>
                <p className="text-sm text-muted-foreground">Recursos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCertificates}</p>
                <p className="text-sm text-muted-foreground">Certificados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="DRAFT">Borrador</SelectItem>
                <SelectItem value="ARCHIVED">Archivado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="TECHNOLOGY">Tecnología</SelectItem>
                <SelectItem value="BUSINESS">Negocios</SelectItem>
                <SelectItem value="HEALTH">Salud</SelectItem>
                <SelectItem value="EDUCATION">Educación</SelectItem>
                <SelectItem value="ARTS">Artes</SelectItem>
                <SelectItem value="SCIENCE">Ciencia</SelectItem>
                <SelectItem value="LANGUAGE">Idiomas</SelectItem>
                <SelectItem value="OTHER">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cursos del Municipio ({filteredCourses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay cursos</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primer curso para el municipio
              </p>
              <Link href="/municipalities/courses/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Curso
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estructura</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.description.substring(0, 60)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryLabel(course.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getLevelLabel(course.level)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(course.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {course.studentCount || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{modules.filter(m => m.courseId === course.id).length} módulos</span>
                        <span>•</span>
                        <span>{allLessons.filter(l => l.courseId === course.id).length} lecciones</span>
                        <span>•</span>
                        <span>{allResources.filter(r => r.courseId === course.id).length} recursos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver curso
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Layers className="h-4 w-4 mr-2" />
                            Gestionar módulos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Progreso
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Award className="h-4 w-4 mr-2" />
                            Certificados
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
