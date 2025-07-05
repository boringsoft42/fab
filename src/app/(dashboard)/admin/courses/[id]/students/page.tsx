&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams } from &ldquo;next/navigation&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &ldquo;@/components/ui/table&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from &ldquo;@/components/ui/dialog&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Mail,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
} from &ldquo;lucide-react&rdquo;;

interface StudentEnrollment {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    age: number;
    location: string;
  };
  enrollmentDate: Date;
  lastAccessed: Date;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  timeSpent: number; // minutes
  status: &ldquo;active&rdquo; | &ldquo;completed&rdquo; | &ldquo;dropped&rdquo; | &ldquo;inactive&rdquo;;
  certificateIssued: boolean;
  finalGrade?: number;
  moduleProgress: ModuleProgress[];
  quizResults: QuizResult[];
}

interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  lastAccessed: Date;
}

interface QuizResult {
  quizId: string;
  quizName: string;
  score: number;
  maxScore: number;
  attempts: number;
  completedAt: Date;
  passed: boolean;
}

interface CourseStats {
  totalEnrolled: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  averageTimeSpent: number;
  completionRate: number;
  averageGrade: number;
  certificatesIssued: number;
}

export default function CourseStudentsPage() {
  const courseId = params.id as string;

  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [statusFilter, setStatusFilter] = useState<string>(&ldquo;all&rdquo;);
  const [progressFilter, setProgressFilter] = useState<string>(&ldquo;all&rdquo;);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentEnrollment | null>(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [stats, setStats] = useState<CourseStats>({
    totalEnrolled: 0,
    activeStudents: 0,
    completedStudents: 0,
    averageProgress: 0,
    averageTimeSpent: 0,
    completionRate: 0,
    averageGrade: 0,
    certificatesIssued: 0,
  });

  useEffect(() => {
    fetchStudentData();
  }, [courseId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockStudents: StudentEnrollment[] = [
        {
          id: &ldquo;enrollment-1&rdquo;,
          student: {
            id: &ldquo;student-1&rdquo;,
            name: &ldquo;María González&rdquo;,
            email: &ldquo;maria.gonzalez@email.com&rdquo;,
            avatar: &ldquo;/api/placeholder/40/40&rdquo;,
            age: 19,
            location: &ldquo;La Paz&rdquo;,
          },
          enrollmentDate: new Date(&ldquo;2024-01-15&rdquo;),
          lastAccessed: new Date(&ldquo;2024-02-28&rdquo;),
          progressPercentage: 85,
          completedLessons: 13,
          totalLessons: 15,
          timeSpent: 420, // 7 hours
          status: &ldquo;active&rdquo;,
          certificateIssued: false,
          finalGrade: 88,
          moduleProgress: [
            {
              moduleId: &ldquo;mod-1&rdquo;,
              moduleName: &ldquo;Introducción&rdquo;,
              completedLessons: 3,
              totalLessons: 3,
              progressPercentage: 100,
              lastAccessed: new Date(&ldquo;2024-02-20&rdquo;),
            },
            {
              moduleId: &ldquo;mod-2&rdquo;,
              moduleName: &ldquo;Desarrollo de Habilidades&rdquo;,
              completedLessons: 7,
              totalLessons: 8,
              progressPercentage: 87,
              lastAccessed: new Date(&ldquo;2024-02-28&rdquo;),
            },
          ],
          quizResults: [
            {
              quizId: &ldquo;quiz-1&rdquo;,
              quizName: &ldquo;Evaluación Módulo 1&rdquo;,
              score: 85,
              maxScore: 100,
              attempts: 1,
              completedAt: new Date(&ldquo;2024-02-20&rdquo;),
              passed: true,
            },
          ],
        },
        {
          id: &ldquo;enrollment-2&rdquo;,
          student: {
            id: &ldquo;student-2&rdquo;,
            name: &ldquo;Carlos Mamani&rdquo;,
            email: &ldquo;carlos.mamani@email.com&rdquo;,
            age: 22,
            location: &ldquo;El Alto&rdquo;,
          },
          enrollmentDate: new Date(&ldquo;2024-01-20&rdquo;),
          lastAccessed: new Date(&ldquo;2024-02-25&rdquo;),
          progressPercentage: 60,
          completedLessons: 9,
          totalLessons: 15,
          timeSpent: 310,
          status: &ldquo;active&rdquo;,
          certificateIssued: false,
          moduleProgress: [
            {
              moduleId: &ldquo;mod-1&rdquo;,
              moduleName: &ldquo;Introducción&rdquo;,
              completedLessons: 3,
              totalLessons: 3,
              progressPercentage: 100,
              lastAccessed: new Date(&ldquo;2024-02-15&rdquo;),
            },
            {
              moduleId: &ldquo;mod-2&rdquo;,
              moduleName: &ldquo;Desarrollo de Habilidades&rdquo;,
              completedLessons: 4,
              totalLessons: 8,
              progressPercentage: 50,
              lastAccessed: new Date(&ldquo;2024-02-25&rdquo;),
            },
          ],
          quizResults: [
            {
              quizId: &ldquo;quiz-1&rdquo;,
              quizName: &ldquo;Evaluación Módulo 1&rdquo;,
              score: 75,
              maxScore: 100,
              attempts: 2,
              completedAt: new Date(&ldquo;2024-02-16&rdquo;),
              passed: true,
            },
          ],
        },
        {
          id: &ldquo;enrollment-3&rdquo;,
          student: {
            id: &ldquo;student-3&rdquo;,
            name: &ldquo;Ana Quispe&rdquo;,
            email: &ldquo;ana.quispe@email.com&rdquo;,
            age: 18,
            location: &ldquo;Cochabamba&rdquo;,
          },
          enrollmentDate: new Date(&ldquo;2024-01-10&rdquo;),
          lastAccessed: new Date(&ldquo;2024-02-29&rdquo;),
          progressPercentage: 100,
          completedLessons: 15,
          totalLessons: 15,
          timeSpent: 480,
          status: &ldquo;completed&rdquo;,
          certificateIssued: true,
          finalGrade: 95,
          moduleProgress: [
            {
              moduleId: &ldquo;mod-1&rdquo;,
              moduleName: &ldquo;Introducción&rdquo;,
              completedLessons: 3,
              totalLessons: 3,
              progressPercentage: 100,
              lastAccessed: new Date(&ldquo;2024-02-10&rdquo;),
            },
            {
              moduleId: &ldquo;mod-2&rdquo;,
              moduleName: &ldquo;Desarrollo de Habilidades&rdquo;,
              completedLessons: 8,
              totalLessons: 8,
              progressPercentage: 100,
              lastAccessed: new Date(&ldquo;2024-02-29&rdquo;),
            },
          ],
          quizResults: [
            {
              quizId: &ldquo;quiz-1&rdquo;,
              quizName: &ldquo;Evaluación Módulo 1&rdquo;,
              score: 95,
              maxScore: 100,
              attempts: 1,
              completedAt: new Date(&ldquo;2024-02-10&rdquo;),
              passed: true,
            },
            {
              quizId: &ldquo;quiz-2&rdquo;,
              quizName: &ldquo;Evaluación Final&rdquo;,
              score: 90,
              maxScore: 100,
              attempts: 1,
              completedAt: new Date(&ldquo;2024-02-29&rdquo;),
              passed: true,
            },
          ],
        },
      ];

      setStudents(mockStudents);

      // Calculate stats
      const stats: CourseStats = {
        totalEnrolled: mockStudents.length,
        activeStudents: mockStudents.filter((s) => s.status === &ldquo;active&rdquo;)
          .length,
        completedStudents: mockStudents.filter((s) => s.status === &ldquo;completed&rdquo;)
          .length,
        averageProgress:
          mockStudents.reduce((acc, s) => acc + s.progressPercentage, 0) /
          mockStudents.length,
        averageTimeSpent:
          mockStudents.reduce((acc, s) => acc + s.timeSpent, 0) /
          mockStudents.length,
        completionRate:
          (mockStudents.filter((s) => s.status === &ldquo;completed&rdquo;).length /
            mockStudents.length) *
          100,
        averageGrade:
          mockStudents.reduce((acc, s) => acc + (s.finalGrade || 0), 0) /
          mockStudents.length,
        certificatesIssued: mockStudents.filter((s) => s.certificateIssued)
          .length,
      };
      setStats(stats);
    } catch (error) {
      console.error(&ldquo;Error fetching student data:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((enrollment) => {
    const matchesSearch =
      enrollment.student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      enrollment.student.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === &ldquo;all&rdquo; || enrollment.status === statusFilter;

    const matchesProgress =
      progressFilter === &ldquo;all&rdquo; ||
      (progressFilter === &ldquo;not_started&rdquo; &&
        enrollment.progressPercentage === 0) ||
      (progressFilter === &ldquo;in_progress&rdquo; &&
        enrollment.progressPercentage > 0 &&
        enrollment.progressPercentage < 100) ||
      (progressFilter === &ldquo;completed&rdquo; && enrollment.progressPercentage === 100);

    return matchesSearch && matchesStatus && matchesProgress;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: &ldquo;Activo&rdquo;,
        variant: &ldquo;default&rdquo; as const,
        icon: CheckCircle,
      },
      completed: {
        label: &ldquo;Completado&rdquo;,
        variant: &ldquo;default&rdquo; as const,
        icon: Award,
      },
      dropped: {
        label: &ldquo;Abandonado&rdquo;,
        variant: &ldquo;destructive&rdquo; as const,
        icon: XCircle,
      },
      inactive: {
        label: &ldquo;Inactivo&rdquo;,
        variant: &ldquo;secondary&rdquo; as const,
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className=&ldquo;flex items-center gap-1&rdquo;>
        <Icon className=&ldquo;h-3 w-3&rdquo; />
        {config.label}
      </Badge>
    );
  };

  const exportData = () => {
    const csvData = filteredStudents.map((enrollment) => ({
      Nombre: enrollment.student.name,
      Email: enrollment.student.email,
      Progreso: `${enrollment.progressPercentage}%`,
      Estado: enrollment.status,
      &ldquo;Fecha Inscripción&rdquo;: enrollment.enrollmentDate.toLocaleDateString(),
      &ldquo;Último Acceso&rdquo;: enrollment.lastAccessed.toLocaleDateString(),
      &ldquo;Tiempo Total&rdquo;: `${Math.floor(enrollment.timeSpent / 60)}h ${enrollment.timeSpent % 60}m`,
      Calificación: enrollment.finalGrade || &ldquo;N/A&rdquo;,
    }));

    console.log(&ldquo;Exporting data:&rdquo;, csvData);
    // Implementation for CSV export would go here
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
      <div className=&ldquo;flex items-center justify-between&rdquo;>
        <div className=&ldquo;flex items-center gap-4&rdquo;>
          <Button variant=&ldquo;ghost&rdquo; onClick={() => window.history.back()}>
            <ArrowLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Volver
          </Button>
          <div>
            <h1 className=&ldquo;text-2xl font-bold&rdquo;>Estudiantes del Curso</h1>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              Gestiona y supervisa el progreso de los estudiantes
            </p>
          </div>
        </div>

        <div className=&ldquo;flex gap-2&rdquo;>
          <Button variant=&ldquo;outline&rdquo; onClick={exportData}>
            <Download className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Total Inscritos
            </CardTitle>
            <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>{stats.totalEnrolled}</div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              {stats.activeStudents} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Progreso Promedio
            </CardTitle>
            <TrendingUp className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {Math.round(stats.averageProgress)}%
            </div>
            <Progress value={stats.averageProgress} className=&ldquo;mt-2&rdquo; />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Tiempo Promedio
            </CardTitle>
            <Clock className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {Math.floor(stats.averageTimeSpent / 60)}h{&ldquo; &rdquo;}
              {Math.round(stats.averageTimeSpent % 60)}m
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Por estudiante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Tasa de Finalización
            </CardTitle>
            <Award className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {Math.round(stats.completionRate)}%
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              {stats.certificatesIssued} certificados emitidos
            </p>
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
                  placeholder=&ldquo;Buscar estudiantes...&rdquo;
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
                  <SelectItem value=&ldquo;completed&rdquo;>Completados</SelectItem>
                  <SelectItem value=&ldquo;inactive&rdquo;>Inactivos</SelectItem>
                  <SelectItem value=&ldquo;dropped&rdquo;>Abandonados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={progressFilter} onValueChange={setProgressFilter}>
                <SelectTrigger className=&ldquo;w-[150px]&rdquo;>
                  <SelectValue placeholder=&ldquo;Progreso&rdquo; />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;all&rdquo;>Todos</SelectItem>
                  <SelectItem value=&ldquo;not_started&rdquo;>Sin iniciar</SelectItem>
                  <SelectItem value=&ldquo;in_progress&rdquo;>En progreso</SelectItem>
                  <SelectItem value=&ldquo;completed&rdquo;>Completado</SelectItem>
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
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tiempo Total</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead className=&ldquo;text-right&rdquo;>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className=&ldquo;flex items-center gap-3&rdquo;>
                        <Avatar className=&ldquo;h-8 w-8&rdquo;>
                          <AvatarImage src={enrollment.student.avatar} />
                          <AvatarFallback>
                            {enrollment.student.name
                              .split(&ldquo; &rdquo;)
                              .map((n) => n[0])
                              .join(&ldquo;&rdquo;)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className=&ldquo;font-medium&rdquo;>
                            {enrollment.student.name}
                          </div>
                          <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                            {enrollment.student.email}
                          </div>
                          <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
                            {enrollment.student.age} años •{&ldquo; &rdquo;}
                            {enrollment.student.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className=&ldquo;space-y-1&rdquo;>
                        <div className=&ldquo;flex items-center justify-between text-sm&rdquo;>
                          <span>{enrollment.progressPercentage}%</span>
                          <span className=&ldquo;text-muted-foreground&rdquo;>
                            {enrollment.completedLessons}/
                            {enrollment.totalLessons}
                          </span>
                        </div>
                        <Progress
                          value={enrollment.progressPercentage}
                          className=&ldquo;h-2&rdquo;
                        />
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(enrollment.status)}</TableCell>

                    <TableCell>
                      <div className=&ldquo;flex items-center gap-1&rdquo;>
                        <Clock className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                        {Math.floor(enrollment.timeSpent / 60)}h{&ldquo; &rdquo;}
                        {enrollment.timeSpent % 60}m
                      </div>
                    </TableCell>

                    <TableCell>
                      {enrollment.lastAccessed.toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      {enrollment.finalGrade ? (
                        <Badge
                          variant={
                            enrollment.finalGrade >= 70
                              ? &ldquo;default&rdquo;
                              : &ldquo;destructive&rdquo;
                          }
                        >
                          {enrollment.finalGrade}%
                        </Badge>
                      ) : (
                        <span className=&ldquo;text-muted-foreground&rdquo;>-</span>
                      )}
                    </TableCell>

                    <TableCell className=&ldquo;text-right&rdquo;>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant=&ldquo;ghost&rdquo; className=&ldquo;h-8 w-8 p-0&rdquo;>
                            <MoreHorizontal className=&ldquo;h-4 w-4&rdquo; />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align=&ldquo;end&rdquo;>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudent(enrollment);
                              setShowStudentDetail(true);
                            }}
                          >
                            <Eye className=&ldquo;h-4 w-4 mr-2&rdquo; />
                            Ver Detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className=&ldquo;h-4 w-4 mr-2&rdquo; />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className=&ldquo;h-4 w-4 mr-2&rdquo; />
                            Mensaje Directo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className=&ldquo;text-center py-12&rdquo;>
              <Users className=&ldquo;h-12 w-12 text-muted-foreground mx-auto mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                No se encontraron estudiantes
              </h3>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={showStudentDetail} onOpenChange={setShowStudentDetail}>
        <DialogContent className=&ldquo;max-w-4xl max-h-[90vh] overflow-y-auto&rdquo;>
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className=&ldquo;flex items-center gap-3&rdquo;>
                  <Avatar className=&ldquo;h-10 w-10&rdquo;>
                    <AvatarImage src={selectedStudent.student.avatar} />
                    <AvatarFallback>
                      {selectedStudent.student.name
                        .split(&ldquo; &rdquo;)
                        .map((n) => n[0])
                        .join(&ldquo;&rdquo;)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedStudent.student.name}</div>
                    <div className=&ldquo;text-sm text-muted-foreground font-normal&rdquo;>
                      {selectedStudent.student.email}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue=&ldquo;progress&rdquo; className=&ldquo;space-y-4&rdquo;>
                <TabsList>
                  <TabsTrigger value=&ldquo;progress&rdquo;>Progreso</TabsTrigger>
                  <TabsTrigger value=&ldquo;quizzes&rdquo;>Exámenes</TabsTrigger>
                  <TabsTrigger value=&ldquo;activity&rdquo;>Actividad</TabsTrigger>
                </TabsList>

                <TabsContent value=&ldquo;progress&rdquo; className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                    <Card>
                      <CardContent className=&ldquo;p-4&rdquo;>
                        <div className=&ldquo;text-2xl font-bold&rdquo;>
                          {selectedStudent.progressPercentage}%
                        </div>
                        <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          Progreso General
                        </p>
                        <Progress
                          value={selectedStudent.progressPercentage}
                          className=&ldquo;mt-2&rdquo;
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className=&ldquo;p-4&rdquo;>
                        <div className=&ldquo;text-2xl font-bold&rdquo;>
                          {selectedStudent.completedLessons}/
                          {selectedStudent.totalLessons}
                        </div>
                        <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          Lecciones Completadas
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className=&ldquo;p-4&rdquo;>
                        <div className=&ldquo;text-2xl font-bold&rdquo;>
                          {Math.floor(selectedStudent.timeSpent / 60)}h{&ldquo; &rdquo;}
                          {selectedStudent.timeSpent % 60}m
                        </div>
                        <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          Tiempo Total
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Progreso por Módulo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className=&ldquo;space-y-4&rdquo;>
                        {selectedStudent.moduleProgress.map((module) => (
                          <div key={module.moduleId} className=&ldquo;space-y-2&rdquo;>
                            <div className=&ldquo;flex items-center justify-between&rdquo;>
                              <div>
                                <h4 className=&ldquo;font-medium&rdquo;>
                                  {module.moduleName}
                                </h4>
                                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                                  {module.completedLessons}/
                                  {module.totalLessons} lecciones
                                </p>
                              </div>
                              <Badge variant=&ldquo;outline&rdquo;>
                                {module.progressPercentage}%
                              </Badge>
                            </div>
                            <Progress value={module.progressPercentage} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value=&ldquo;quizzes&rdquo; className=&ldquo;space-y-4&rdquo;>
                  <Card>
                    <CardHeader>
                      <CardTitle>Resultados de Exámenes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className=&ldquo;space-y-4&rdquo;>
                        {selectedStudent.quizResults.map((quiz) => (
                          <div
                            key={quiz.quizId}
                            className=&ldquo;flex items-center justify-between p-4 border rounded-lg&rdquo;
                          >
                            <div>
                              <h4 className=&ldquo;font-medium&rdquo;>{quiz.quizName}</h4>
                              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                                Completado el{&ldquo; &rdquo;}
                                {quiz.completedAt.toLocaleDateString()}
                              </p>
                              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                                Intentos: {quiz.attempts}
                              </p>
                            </div>
                            <div className=&ldquo;text-right&rdquo;>
                              <div className=&ldquo;text-lg font-bold&rdquo;>
                                {quiz.score}/{quiz.maxScore}
                              </div>
                              <Badge
                                variant={
                                  quiz.passed ? &ldquo;default&rdquo; : &ldquo;destructive&rdquo;
                                }
                              >
                                {quiz.passed ? &ldquo;Aprobado&rdquo; : &ldquo;Reprobado&rdquo;}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value=&ldquo;activity&rdquo; className=&ldquo;space-y-4&rdquo;>
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className=&ldquo;space-y-4&rdquo;>
                        <div className=&ldquo;flex items-center gap-3 p-3 bg-gray-50 rounded-lg&rdquo;>
                          <BookOpen className=&ldquo;h-5 w-5 text-blue-600&rdquo; />
                          <div>
                            <p className=&ldquo;font-medium&rdquo;>Lección completada</p>
                            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                              &ldquo;Comunicación Efectiva&rdquo; - Hace 2 días
                            </p>
                          </div>
                        </div>

                        <div className=&ldquo;flex items-center gap-3 p-3 bg-gray-50 rounded-lg&rdquo;>
                          <CheckCircle className=&ldquo;h-5 w-5 text-green-600&rdquo; />
                          <div>
                            <p className=&ldquo;font-medium&rdquo;>Examen aprobado</p>
                            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                              &ldquo;Evaluación Módulo 1&rdquo; - Hace 1 semana
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
