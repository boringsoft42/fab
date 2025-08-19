"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  MoreHorizontal,
  Eye,
  Download,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Target,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Award,
  BarChart3,
  Activity,
  Play,
  Pause,
  GraduationCap,
  BookOpen,
  Timer,
  Star,
} from "lucide-react";
import { useCourseProgress } from "@/hooks/useLessonProgressApi";
import { toast } from "sonner";

export default function CourseProgressPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");

  // Hooks
  const { data: progressData, isLoading: progressLoading } = useCourseProgress(courseId);
  const courseProgress = progressData?.courseProgress;

  // Mock student data - in real implementation, fetch from API
  const mockStudents = [
    {
      id: "student_1",
      name: "Ana García",
      email: "ana.garcia@example.com",
      enrollmentDate: new Date("2024-01-01T10:00:00Z"),
      lastActivity: new Date("2024-01-16T14:30:00Z"),
      progress: 75,
      completedLessons: 8,
      totalLessons: 12,
      timeSpent: 5400, // 90 minutes
      certificates: 2,
      status: "active",
    },
    {
      id: "student_2",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      enrollmentDate: new Date("2024-01-05T15:30:00Z"),
      lastActivity: new Date("2024-01-15T09:15:00Z"),
      progress: 45,
      completedLessons: 5,
      totalLessons: 12,
      timeSpent: 3600, // 60 minutes
      certificates: 1,
      status: "active",
    },
    {
      id: "student_3",
      name: "María López",
      email: "maria.lopez@example.com",
      enrollmentDate: new Date("2024-01-10T11:20:00Z"),
      lastActivity: new Date("2024-01-14T16:45:00Z"),
      progress: 100,
      completedLessons: 12,
      totalLessons: 12,
      timeSpent: 7200, // 120 minutes
      certificates: 3,
      status: "completed",
    },
    {
      id: "student_4",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      enrollmentDate: new Date("2024-01-12T08:45:00Z"),
      lastActivity: new Date("2024-01-13T10:20:00Z"),
      progress: 25,
      completedLessons: 3,
      totalLessons: 12,
      timeSpent: 1800, // 30 minutes
      certificates: 0,
      status: "inactive",
    },
  ];

  // Filter students
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    
    let matchesProgress = true;
    if (progressFilter === "completed") matchesProgress = student.progress === 100;
    else if (progressFilter === "in-progress") matchesProgress = student.progress > 0 && student.progress < 100;
    else if (progressFilter === "not-started") matchesProgress = student.progress === 0;
    
    return matchesSearch && matchesStatus && matchesProgress;
  });

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    if (progress >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Activo</Badge>;
      case "completed":
        return <Badge variant="secondary">Completado</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactivo</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getProgressStats = () => {
    const totalStudents = mockStudents.length;
    const activeStudents = mockStudents.filter(s => s.status === "active").length;
    const completedStudents = mockStudents.filter(s => s.status === "completed").length;
    const averageProgress = mockStudents.reduce((acc, s) => acc + s.progress, 0) / totalStudents;
    const totalTimeSpent = mockStudents.reduce((acc, s) => acc + s.timeSpent, 0);
    const totalCertificates = mockStudents.reduce((acc, s) => acc + s.certificates, 0);

    return {
      totalStudents,
      activeStudents,
      completedStudents,
      averageProgress: Math.round(averageProgress),
      totalTimeSpent,
      totalCertificates,
    };
  };

  const stats = getProgressStats();

  if (progressLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href={`/admin/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Curso
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">📊 Progreso del Curso</h1>
            <p className="text-muted-foreground">
              Monitorea el progreso y rendimiento de los estudiantes
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Analíticas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStudents} activos, {stats.completedStudents} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Progreso general del curso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTimeSpent(stats.totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Tiempo invertido en el curso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground">
              Certificados emitidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={progressFilter} onValueChange={setProgressFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Progreso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo el progreso</SelectItem>
                  <SelectItem value="completed">Completados (100%)</SelectItem>
                  <SelectItem value="in-progress">En progreso</SelectItem>
                  <SelectItem value="not-started">No iniciados</SelectItem>
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
                  <TableHead>Lecciones</TableHead>
                  <TableHead>Tiempo</TableHead>
                  <TableHead>Certificados</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Inscrito: {student.enrollmentDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                            {student.progress}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.completedLessons} de {student.totalLessons} lecciones
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{student.completedLessons} completadas</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span>{student.totalLessons - student.completedLessons} pendientes</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTimeSpent(student.timeSpent)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span>{student.certificates}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {student.lastActivity.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.lastActivity.toLocaleTimeString()}
                      </div>
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
                            <Link href={`/admin/courses/${courseId}/progress/${student.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${courseId}/progress/${student.id}/certificates`}>
                              <GraduationCap className="h-4 w-4 mr-2" />
                              Certificados
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${courseId}/progress/${student.id}/activity`}>
                              <Activity className="h-4 w-4 mr-2" />
                              Actividad
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar reporte
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
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" || progressFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Aún no hay estudiantes inscritos en este curso"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Progress Overview */}
      {courseProgress && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Progreso del Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Progreso General</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso general</span>
                      <span>{courseProgress.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${courseProgress.overallProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Lecciones totales:</span>
                      <span className="ml-2 font-medium">{courseProgress.totalLessons}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Completadas:</span>
                      <span className="ml-2 font-medium">{courseProgress.completedLessons}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tiempo total:</span>
                      <span className="ml-2 font-medium">{formatTimeSpent(courseProgress.timeSpent)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última actividad:</span>
                      <span className="ml-2 font-medium">
                        {new Date(courseProgress.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Progreso por Módulos</h4>
                <div className="space-y-3">
                  {courseProgress.modules?.map((module: any) => (
                    <div key={module.moduleId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{module.title}</span>
                        <span>{module.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {module.completedLessons} de {module.totalLessons} lecciones
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
