"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

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
  status: "active" | "completed" | "dropped" | "inactive";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [progressFilter, setProgressFilter] = useState<string>("all");
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
          id: "enrollment-1",
          student: {
            id: "student-1",
            name: "María González",
            email: "maria.gonzalez@email.com",
            avatar: "/api/placeholder/40/40",
            age: 19,
            location: "La Paz",
          },
          enrollmentDate: new Date("2024-01-15"),
          lastAccessed: new Date("2024-02-28"),
          progressPercentage: 85,
          completedLessons: 13,
          totalLessons: 15,
          timeSpent: 420, // 7 hours
          status: "active",
          certificateIssued: false,
          finalGrade: 88,
          moduleProgress: [
            {
              moduleId: "mod-1",
              moduleName: "Introducción",
              completedLessons: 3,
              totalLessons: 3,
              progressPercentage: 100,
              lastAccessed: new Date("2024-02-20"),
            },
            {
              moduleId: "mod-2",
              moduleName: "Desarrollo de Habilidades",
              completedLessons: 7,
              totalLessons: 8,
              progressPercentage: 87,
              lastAccessed: new Date("2024-02-28"),
            },
          ],
          quizResults: [
            {
              quizId: "quiz-1",
              quizName: "Evaluación Módulo 1",
              score: 85,
              maxScore: 100,
              attempts: 1,
              completedAt: new Date("2024-02-20"),
              passed: true,
            },
          ],
        },
        {
          id: "enrollment-2",
          student: {
            id: "student-2",
            name: "Carlos Mamani",
            email: "carlos.mamani@email.com",
            age: 22,
            location: "El Alto",
          },
          enrollmentDate: new Date("2024-01-20"),
          lastAccessed: new Date("2024-02-25"),
          progressPercentage: 60,
          completedLessons: 9,
          totalLessons: 15,
          timeSpent: 310,
          status: "active",
          certificateIssued: false,
          moduleProgress: [
            {
              moduleId: "mod-1",
              moduleName: "Introducción",
              completedLessons: 3,
              totalLessons: 3,
              progressPercentage: 100,
              lastAccessed: new Date("2024-02-15"),
            },
            {
              moduleId: "mod-2",
              moduleName: "Desarrollo de Habilidades",
              completedLessons: 4,
              totalLessons: 8,
              progressPercentage: 50,
              lastAccessed: new Date("2024-02-25"),
            },
          ],
          quizResults: [
            {
              quizId: "quiz-1",
              quizName: "Evaluación Módulo 1",
              score: 75,
              maxScore: 100,
              attempts: 2,
              completedAt: new Date("2024-02-16"),
              passed: true,
            },
          ],
        },
        {
          id: "enrollment-3",
          student: {
            id: "student-3",
            name: "Ana Quispe",
            email: "ana.quispe@email.com",
            age: 18,
            location: "Cochabamba",
          },
          enrollmentDate: new Date("2024-01-10"),
          lastAccessed: new Date("2024-02-29"),
          progressPercentage: 100,
          completedLessons: 15,
          totalLessons: 15,
          timeSpent: 480,
          status: "completed",
          certificateIssued: true,
          finalGrade: 95,
          moduleProgress: [
            {
              moduleId: "mod-1",
              moduleName: "Introducción",
              completedLessons: 3,
              totalLessons: 3,
              progressPercentage: 100,
              lastAccessed: new Date("2024-02-10"),
            },
            {
              moduleId: "mod-2",
              moduleName: "Desarrollo de Habilidades",
              completedLessons: 8,
              totalLessons: 8,
              progressPercentage: 100,
              lastAccessed: new Date("2024-02-29"),
            },
          ],
          quizResults: [
            {
              quizId: "quiz-1",
              quizName: "Evaluación Módulo 1",
              score: 95,
              maxScore: 100,
              attempts: 1,
              completedAt: new Date("2024-02-10"),
              passed: true,
            },
            {
              quizId: "quiz-2",
              quizName: "Evaluación Final",
              score: 90,
              maxScore: 100,
              attempts: 1,
              completedAt: new Date("2024-02-29"),
              passed: true,
            },
          ],
        },
      ];

      setStudents(mockStudents);

      // Calculate stats
      const stats: CourseStats = {
        totalEnrolled: mockStudents.length,
        activeStudents: mockStudents.filter((s) => s.status === "active")
          .length,
        completedStudents: mockStudents.filter((s) => s.status === "completed")
          .length,
        averageProgress:
          mockStudents.reduce((acc, s) => acc + s.progressPercentage, 0) /
          mockStudents.length,
        averageTimeSpent:
          mockStudents.reduce((acc, s) => acc + s.timeSpent, 0) /
          mockStudents.length,
        completionRate:
          (mockStudents.filter((s) => s.status === "completed").length /
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
      console.error("Error fetching student data:", error);
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
      statusFilter === "all" || enrollment.status === statusFilter;

    const matchesProgress =
      progressFilter === "all" ||
      (progressFilter === "not_started" &&
        enrollment.progressPercentage === 0) ||
      (progressFilter === "in_progress" &&
        enrollment.progressPercentage > 0 &&
        enrollment.progressPercentage < 100) ||
      (progressFilter === "completed" && enrollment.progressPercentage === 100);

    return matchesSearch && matchesStatus && matchesProgress;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Activo",
        variant: "default" as const,
        icon: CheckCircle,
      },
      completed: {
        label: "Completado",
        variant: "default" as const,
        icon: Award,
      },
      dropped: {
        label: "Abandonado",
        variant: "destructive" as const,
        icon: XCircle,
      },
      inactive: {
        label: "Inactivo",
        variant: "secondary" as const,
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
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
      "Fecha Inscripción": enrollment.enrollmentDate.toLocaleDateString(),
      "Último Acceso": enrollment.lastAccessed.toLocaleDateString(),
      "Tiempo Total": `${Math.floor(enrollment.timeSpent / 60)}h ${enrollment.timeSpent % 60}m`,
      Calificación: enrollment.finalGrade || "N/A",
    }));

    console.log("Exporting data:", csvData);
    // Implementation for CSV export would go here
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Estudiantes del Curso</h1>
            <p className="text-muted-foreground">
              Gestiona y supervisa el progreso de los estudiantes
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inscritos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrolled}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStudents} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progreso Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.averageProgress)}%
            </div>
            <Progress value={stats.averageProgress} className="mt-2" />
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
            <div className="text-2xl font-bold">
              {Math.floor(stats.averageTimeSpent / 60)}h{" "}
              {Math.round(stats.averageTimeSpent % 60)}m
            </div>
            <p className="text-xs text-muted-foreground">Por estudiante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Finalización
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.completionRate)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.certificatesIssued} certificados emitidos
            </p>
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
                  placeholder="Buscar estudiantes..."
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
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="dropped">Abandonados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={progressFilter} onValueChange={setProgressFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Progreso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="not_started">Sin iniciar</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
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
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tiempo Total</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={enrollment.student.avatar} />
                          <AvatarFallback>
                            {enrollment.student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {enrollment.student.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {enrollment.student.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {enrollment.student.age} años •{" "}
                            {enrollment.student.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{enrollment.progressPercentage}%</span>
                          <span className="text-muted-foreground">
                            {enrollment.completedLessons}/
                            {enrollment.totalLessons}
                          </span>
                        </div>
                        <Progress
                          value={enrollment.progressPercentage}
                          className="h-2"
                        />
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(enrollment.status)}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {Math.floor(enrollment.timeSpent / 60)}h{" "}
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
                              ? "default"
                              : "destructive"
                          }
                        >
                          {enrollment.finalGrade}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudent(enrollment);
                              setShowStudentDetail(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
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
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron estudiantes
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={showStudentDetail} onOpenChange={setShowStudentDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedStudent.student.avatar} />
                    <AvatarFallback>
                      {selectedStudent.student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedStudent.student.name}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {selectedStudent.student.email}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="progress" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="progress">Progreso</TabsTrigger>
                  <TabsTrigger value="quizzes">Exámenes</TabsTrigger>
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {selectedStudent.progressPercentage}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Progreso General
                        </p>
                        <Progress
                          value={selectedStudent.progressPercentage}
                          className="mt-2"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {selectedStudent.completedLessons}/
                          {selectedStudent.totalLessons}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Lecciones Completadas
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {Math.floor(selectedStudent.timeSpent / 60)}h{" "}
                          {selectedStudent.timeSpent % 60}m
                        </div>
                        <p className="text-sm text-muted-foreground">
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
                      <div className="space-y-4">
                        {selectedStudent.moduleProgress.map((module) => (
                          <div key={module.moduleId} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {module.moduleName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {module.completedLessons}/
                                  {module.totalLessons} lecciones
                                </p>
                              </div>
                              <Badge variant="outline">
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

                <TabsContent value="quizzes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resultados de Exámenes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedStudent.quizResults.map((quiz) => (
                          <div
                            key={quiz.quizId}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium">{quiz.quizName}</h4>
                              <p className="text-sm text-muted-foreground">
                                Completado el{" "}
                                {quiz.completedAt.toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Intentos: {quiz.attempts}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {quiz.score}/{quiz.maxScore}
                              </div>
                              <Badge
                                variant={
                                  quiz.passed ? "default" : "destructive"
                                }
                              >
                                {quiz.passed ? "Aprobado" : "Reprobado"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Lección completada</p>
                            <p className="text-sm text-muted-foreground">
                              "Comunicación Efectiva" - Hace 2 días
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Examen aprobado</p>
                            <p className="text-sm text-muted-foreground">
                              "Evaluación Módulo 1" - Hace 1 semana
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
