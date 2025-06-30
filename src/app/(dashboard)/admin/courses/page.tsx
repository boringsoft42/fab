"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Course, CourseCategory, CourseLevel } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Users,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Award,
  PlayCircle,
  FileText,
  BarChart3,
} from "lucide-react";

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  totalHours: number;
  averageRating: number;
  completionRate: number;
  activeCourses: number;
}

export default function CourseManagementPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stats, setStats] = useState<CourseStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalHours: 0,
    averageRating: 0,
    completionRate: 0,
    activeCourses: 0,
  });

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockCourses: Course[] = [
        {
          id: "course-1",
          title: "Habilidades Laborales Básicas",
          slug: "habilidades-laborales-basicas",
          description:
            "Curso completo sobre competencias fundamentales para el trabajo",
          shortDescription:
            "Desarrolla las competencias esenciales para el éxito laboral",
          thumbnail: "/api/placeholder/400/300",
          instructor: {
            id: "instructor-1",
            name: "Dra. Ana Pérez",
            title: "Especialista en Desarrollo Profesional",
            avatar: "/api/placeholder/80/80",
            bio: "Experta en desarrollo de habilidades laborales",
            rating: 4.8,
            totalStudents: 2847,
            totalCourses: 12,
          },
          institution: "Centro de Capacitación Municipal",
          category: CourseCategory.SOFT_SKILLS,
          level: CourseLevel.BEGINNER,
          duration: 8,
          totalLessons: 15,
          rating: 4.8,
          studentCount: 2847,
          price: 0,
          isMandatory: true,
          isActive: true,
          objectives: [
            "Desarrollar comunicación efectiva",
            "Fortalecer trabajo en equipo",
          ],
          prerequisites: ["Ninguno"],
          includedMaterials: [
            "Videos",
            "Material de lectura",
            "Ejercicios prácticos",
          ],
          certification: true,
          tags: ["habilidades", "trabajo", "comunicación"],
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-02-20"),
          publishedAt: new Date("2024-01-20"),
        },
        {
          id: "course-2",
          title: "Emprendimiento Digital",
          slug: "emprendimiento-digital",
          description: "Aprende a crear y gestionar negocios digitales",
          shortDescription: "Inicia tu camino emprendedor en el mundo digital",
          thumbnail: "/api/placeholder/400/300",
          instructor: {
            id: "instructor-2",
            name: "Carlos Mendoza",
            title: "Consultor en Emprendimiento",
            avatar: "/api/placeholder/80/80",
            bio: "Especialista en negocios digitales",
            rating: 4.6,
            totalStudents: 1523,
            totalCourses: 8,
          },
          institution: "Centro de Capacitación Municipal",
          category: CourseCategory.ENTREPRENEURSHIP,
          level: CourseLevel.INTERMEDIATE,
          duration: 12,
          totalLessons: 20,
          rating: 4.6,
          studentCount: 1523,
          price: 0,
          isMandatory: false,
          isActive: true,
          objectives: ["Crear plan de negocios", "Desarrollar MVP"],
          prerequisites: ["Conocimientos básicos de computación"],
          includedMaterials: ["Videos", "Plantillas", "Casos de estudio"],
          certification: true,
          tags: ["emprendimiento", "digital", "negocios"],
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-02-25"),
          publishedAt: new Date("2024-02-05"),
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats
    setStats({
      totalCourses: 12,
      totalStudents: 8450,
      totalHours: 156,
      averageRating: 4.7,
      completionRate: 78,
      activeCourses: 10,
    });
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && course.isActive) ||
      (statusFilter === "inactive" && !course.isActive);
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      // Implementation for course deletion
      setCourses(courses.filter((c) => c.id !== courseId));
    }
  };

  const handleDuplicateCourse = async (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const duplicated = {
        ...course,
        id: `${course.id}-copy`,
        title: `${course.title} (Copia)`,
        slug: `${course.slug}-copy`,
        isActive: false,
        studentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: undefined,
      };
      setCourses([...courses, duplicated]);
    }
  };

  const getCategoryLabel = (category: CourseCategory) => {
    const labels = {
      [CourseCategory.SOFT_SKILLS]: "Habilidades Blandas",
      [CourseCategory.BASIC_COMPETENCIES]: "Competencias Básicas",
      [CourseCategory.JOB_PLACEMENT]: "Inserción Laboral",
      [CourseCategory.ENTREPRENEURSHIP]: "Emprendimiento",
      [CourseCategory.TECHNICAL_SKILLS]: "Habilidades Técnicas",
      [CourseCategory.DIGITAL_LITERACY]: "Alfabetización Digital",
      [CourseCategory.COMMUNICATION]: "Comunicación",
      [CourseCategory.LEADERSHIP]: "Liderazgo",
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: CourseLevel) => {
    const labels = {
      [CourseLevel.BEGINNER]: "Principiante",
      [CourseLevel.INTERMEDIATE]: "Intermedio",
      [CourseLevel.ADVANCED]: "Avanzado",
    };
    return labels[level] || level;
  };

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
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
          <p className="text-muted-foreground">
            Administra el contenido educativo de tu institución
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/courses/create">
            <Plus className="h-4 w-4 mr-2" />
            Crear Curso
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCourses} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Inscritos en total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas de Contenido
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Material educativo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value={CourseCategory.SOFT_SKILLS}>
                    Habilidades Blandas
                  </SelectItem>
                  <SelectItem value={CourseCategory.ENTREPRENEURSHIP}>
                    Emprendimiento
                  </SelectItem>
                  <SelectItem value={CourseCategory.TECHNICAL_SKILLS}>
                    Habilidades Técnicas
                  </SelectItem>
                  <SelectItem value={CourseCategory.DIGITAL_LITERACY}>
                    Alfabetización Digital
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Última actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {course.totalLessons} lecciones • {course.duration}h
                          </div>
                          <div className="flex gap-1 mt-1">
                            {course.isMandatory && (
                              <Badge variant="destructive" className="text-xs">
                                Obligatorio
                              </Badge>
                            )}
                            {course.certification && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Certificado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {course.instructor.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.instructor.title}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryLabel(course.category)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {course.studentCount.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={course.isActive ? "default" : "secondary"}
                      >
                        {course.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                    </TableCell>

                    <TableCell>
                      {course.updatedAt.toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver curso
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/students`}>
                              <Users className="h-4 w-4 mr-2" />
                              Ver estudiantes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/courses/${course.id}/analytics`}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analíticas
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateCourse(course.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
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
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza creando tu primer curso"}
              </p>
              <Button asChild>
                <Link href="/admin/courses/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Curso
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
