&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Course, CourseCategory, CourseLevel } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
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
  TrendingUp,
  Award,
  BarChart3,
} from &ldquo;lucide-react&rdquo;;

interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  totalHours: number;
  averageRating: number;
  completionRate: number;
  activeCourses: number;
}

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [statusFilter, setStatusFilter] = useState<string>(&ldquo;all&rdquo;);
  const [categoryFilter, setCategoryFilter] = useState<string>(&ldquo;all&rdquo;);
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
          id: &ldquo;course-1&rdquo;,
          title: &ldquo;Habilidades Laborales Básicas&rdquo;,
          slug: &ldquo;habilidades-laborales-basicas&rdquo;,
          description:
            &ldquo;Curso completo sobre competencias fundamentales para el trabajo&rdquo;,
          shortDescription:
            &ldquo;Desarrolla las competencias esenciales para el éxito laboral&rdquo;,
          thumbnail: &ldquo;/api/placeholder/400/300&rdquo;,
          instructor: {
            id: &ldquo;instructor-1&rdquo;,
            name: &ldquo;Dra. Ana Pérez&rdquo;,
            title: &ldquo;Especialista en Desarrollo Profesional&rdquo;,
            avatar: &ldquo;/api/placeholder/80/80&rdquo;,
            bio: &ldquo;Experta en desarrollo de habilidades laborales&rdquo;,
            rating: 4.8,
            totalStudents: 2847,
            totalCourses: 12,
          },
          institution: &ldquo;Centro de Capacitación Municipal&rdquo;,
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
            &ldquo;Desarrollar comunicación efectiva&rdquo;,
            &ldquo;Fortalecer trabajo en equipo&rdquo;,
          ],
          prerequisites: [&ldquo;Ninguno&rdquo;],
          includedMaterials: [
            &ldquo;Videos&rdquo;,
            &ldquo;Material de lectura&rdquo;,
            &ldquo;Ejercicios prácticos&rdquo;,
          ],
          certification: true,
          tags: [&ldquo;habilidades&rdquo;, &ldquo;trabajo&rdquo;, &ldquo;comunicación&rdquo;],
          createdAt: new Date(&ldquo;2024-01-15&rdquo;),
          updatedAt: new Date(&ldquo;2024-02-20&rdquo;),
          publishedAt: new Date(&ldquo;2024-01-20&rdquo;),
        },
        {
          id: &ldquo;course-2&rdquo;,
          title: &ldquo;Emprendimiento Digital&rdquo;,
          slug: &ldquo;emprendimiento-digital&rdquo;,
          description: &ldquo;Aprende a crear y gestionar negocios digitales&rdquo;,
          shortDescription: &ldquo;Inicia tu camino emprendedor en el mundo digital&rdquo;,
          thumbnail: &ldquo;/api/placeholder/400/300&rdquo;,
          instructor: {
            id: &ldquo;instructor-2&rdquo;,
            name: &ldquo;Carlos Mendoza&rdquo;,
            title: &ldquo;Consultor en Emprendimiento&rdquo;,
            avatar: &ldquo;/api/placeholder/80/80&rdquo;,
            bio: &ldquo;Especialista en negocios digitales&rdquo;,
            rating: 4.6,
            totalStudents: 1523,
            totalCourses: 8,
          },
          institution: &ldquo;Centro de Capacitación Municipal&rdquo;,
          category: CourseCategory.ENTREPRENEURSHIP,
          level: CourseLevel.INTERMEDIATE,
          duration: 12,
          totalLessons: 20,
          rating: 4.6,
          studentCount: 1523,
          price: 0,
          isMandatory: false,
          isActive: true,
          objectives: [&ldquo;Crear plan de negocios&rdquo;, &ldquo;Desarrollar MVP&rdquo;],
          prerequisites: [&ldquo;Conocimientos básicos de computación&rdquo;],
          includedMaterials: [&ldquo;Videos&rdquo;, &ldquo;Plantillas&rdquo;, &ldquo;Casos de estudio&rdquo;],
          certification: true,
          tags: [&ldquo;emprendimiento&rdquo;, &ldquo;digital&rdquo;, &ldquo;negocios&rdquo;],
          createdAt: new Date(&ldquo;2024-02-01&rdquo;),
          updatedAt: new Date(&ldquo;2024-02-25&rdquo;),
          publishedAt: new Date(&ldquo;2024-02-05&rdquo;),
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error(&ldquo;Error fetching courses:&rdquo;, error);
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
      statusFilter === &ldquo;all&rdquo; ||
      (statusFilter === &ldquo;active&rdquo; && course.isActive) ||
      (statusFilter === &ldquo;inactive&rdquo; && !course.isActive);
    const matchesCategory =
      categoryFilter === &ldquo;all&rdquo; || course.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm(&ldquo;¿Estás seguro de que quieres eliminar este curso?&rdquo;)) {
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
      [CourseCategory.SOFT_SKILLS]: &ldquo;Habilidades Blandas&rdquo;,
      [CourseCategory.BASIC_COMPETENCIES]: &ldquo;Competencias Básicas&rdquo;,
      [CourseCategory.JOB_PLACEMENT]: &ldquo;Inserción Laboral&rdquo;,
      [CourseCategory.ENTREPRENEURSHIP]: &ldquo;Emprendimiento&rdquo;,
      [CourseCategory.TECHNICAL_SKILLS]: &ldquo;Habilidades Técnicas&rdquo;,
      [CourseCategory.DIGITAL_LITERACY]: &ldquo;Alfabetización Digital&rdquo;,
      [CourseCategory.COMMUNICATION]: &ldquo;Comunicación&rdquo;,
      [CourseCategory.LEADERSHIP]: &ldquo;Liderazgo&rdquo;,
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-8 bg-gray-200 rounded w-1/4&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            {[...Array(4)].map((_, i) => (
              <div key={i} className=&ldquo;h-24 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
          <div className=&ldquo;h-96 bg-gray-200 rounded&rdquo; />
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6 space-y-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <div>
          <h1 className=&ldquo;text-3xl font-bold&rdquo;>Gestión de Cursos</h1>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            Administra el contenido educativo de tu institución
          </p>
        </div>
        <Button asChild>
          <Link href=&ldquo;/admin/courses/create&rdquo;>
            <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Crear Curso
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Total Cursos</CardTitle>
            <BookOpen className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalCourses}</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              {stats.activeCourses} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Estudiantes</CardTitle>
            <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {stats.totalStudents.toLocaleString()}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Inscritos en total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Horas de Contenido
            </CardTitle>
            <Clock className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalHours}h</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Material educativo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Calificación Promedio
            </CardTitle>
            <Star className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.averageRating}</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>De 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className=&ldquo;flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between&rdquo;>
            <div className=&ldquo;flex flex-col sm:flex-row gap-4 flex-1&rdquo;>
              <div className=&ldquo;relative flex-1 max-w-sm&rdquo;>
                <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4&rdquo; />
                <Input
                  placeholder=&ldquo;Buscar cursos...&rdquo;
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=&ldquo;pl-10&rdquo;
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className=&ldquo;w-[150px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Estado&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                  <SelectItem value=&ldquo;active&rdquo;>Activos</SelectItem>
                  <SelectItem value=&ldquo;inactive&rdquo;>Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className=&ldquo;w-[180px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Categoría&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todas</SelectItem>
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
          <div className=&ldquo;rounded-md border&rdquo;>
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
                  <TableHead className=&ldquo;text-right&rdquo;>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className=&ldquo;flex items-center gap-3&rdquo;>
                        <div className=&ldquo;w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center&rdquo;>
                          <BookOpen className=&ldquo;h-6 w-6 text-gray-600&rdquo; />
                        </div>
                        <div>
                          <div className=&ldquo;font-medium&rdquo;>{course.title}</div>
                          <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            {course.totalLessons} lecciones • {course.duration}h
                          </div>
                          <div className=&ldquo;flex gap-1 mt-1&rdquo;>
                            {course.isMandatory && (
                              <Badge variant=&ldquo;destructive&rdquo; className=&ldquo;text-xs&rdquo;>
                                Obligatorio
                              </Badge>
                            )}
                            {course.certification && (
                              <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                                <Award className=&ldquo;h-3 w-3 mr-1&rdquo; />
                                Certificado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className=&ldquo;font-medium&rdquo;>
                          {course.instructor.name}
                        </div>
                        <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          {course.instructor.title}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant=&ldquo;outline&rdquo;>
                        {getCategoryLabel(course.category)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                        {course.studentCount.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={course.isActive ? &ldquo;default&rdquo; : &ldquo;secondary&rdquo;}
                      >
                        {course.isActive ? &ldquo;Activo&rdquo; : &ldquo;Inactivo&rdquo;}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <Star className=&ldquo;h-4 w-4 fill-yellow-400 text-yellow-400&rdquo; />
                        {course.rating}
                      </div>
                    </TableCell>

                    <TableCell>
                      {course.updatedAt.toLocaleDateString()}
                    </TableCell>

                    <TableCell className=&ldquo;text-right&rdquo;>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=&ldquo;ghost&rdquo; className=&ldquo;h-8 w-8 p-0&rdquo;>
                            <MoreHorizontal className=&ldquo;h-4 w-4&rdquo; />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align=&ldquo;end&rdquo;>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.id}`}>
                              <Eye className=&ldquo;h-4 w-4 mr-2&rdquo; />
                              Ver curso
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/edit`}>
                              <Edit className=&ldquo;h-4 w-4 mr-2&rdquo; />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}/students`}>
                              <Users className=&ldquo;h-4 w-4 mr-2&rdquo; />
                              Ver estudiantes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/courses/${course.id}/analytics`}
                            >
                              <BarChart3 className=&ldquo;h-4 w-4 mr-2&rdquo; />
                              Analíticas
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateCourse(course.id)}
                          >
                            <Copy className=&ldquo;h-4 w-4 mr-2&rdquo; />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className=&ldquo;text-red-600&rdquo;
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
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
            <div className=&ldquo;text-center py-12&rdquo;>
              <BookOpen className=&ldquo;h-12 w-12 text-muted-foreground mx-auto mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                No se encontraron cursos
              </h3>
              <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
                {searchQuery ||
                statusFilter !== &ldquo;all&rdquo; ||
                categoryFilter !== &ldquo;all&rdquo;
                  ? &ldquo;Intenta ajustar los filtros de búsqueda&rdquo;
                  : &ldquo;Comienza creando tu primer curso&rdquo;}
              </p>
              <Button asChild>
                <Link href=&ldquo;/admin/courses/create&rdquo;>
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
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
