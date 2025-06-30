"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  BookOpen,
  Eye,
  Download,
  Calendar,
  ArrowLeft,
  Target,
  AlertTriangle,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalEnrollments: number;
    activeStudents: number;
    completionRate: number;
    averageRating: number;
    totalViewTime: number;
    certificatesIssued: number;
  };
  engagement: {
    dailyActiveUsers: { date: string; users: number }[];
    lessonCompletionRates: {
      lessonId: string;
      title: string;
      completionRate: number;
    }[];
    dropoffPoints: {
      moduleId: string;
      moduleName: string;
      dropoffRate: number;
    }[];
    timeSpentDistribution: { range: string; percentage: number }[];
  };
  performance: {
    quizResults: {
      quizId: string;
      title: string;
      averageScore: number;
      passRate: number;
    }[];
    modulePerformance: {
      moduleId: string;
      name: string;
      averageTime: number;
      completionRate: number;
    }[];
    strugglingStudents: number;
    topPerformers: number;
  };
  feedback: {
    averageRating: number;
    ratingDistribution: { stars: number; count: number }[];
    commonFeedback: {
      theme: string;
      mentions: number;
      sentiment: "positive" | "negative" | "neutral";
    }[];
  };
}

export default function CourseAnalyticsPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAnalyticsData();
  }, [courseId, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalEnrollments: 2847,
          activeStudents: 1923,
          completionRate: 78.3,
          averageRating: 4.8,
          totalViewTime: 15240, // hours
          certificatesIssued: 2234,
        },
        engagement: {
          dailyActiveUsers: [
            { date: "2024-02-01", users: 145 },
            { date: "2024-02-02", users: 132 },
            { date: "2024-02-03", users: 156 },
            { date: "2024-02-04", users: 189 },
            { date: "2024-02-05", users: 167 },
            { date: "2024-02-06", users: 143 },
            { date: "2024-02-07", users: 178 },
          ],
          lessonCompletionRates: [
            {
              lessonId: "lesson-1",
              title: "Bienvenida al curso",
              completionRate: 95.2,
            },
            {
              lessonId: "lesson-2",
              title: "Comunicación efectiva",
              completionRate: 87.5,
            },
            {
              lessonId: "lesson-3",
              title: "Trabajo en equipo",
              completionRate: 82.1,
            },
            {
              lessonId: "lesson-4",
              title: "Resolución de problemas",
              completionRate: 76.8,
            },
            {
              lessonId: "lesson-5",
              title: "Liderazgo básico",
              completionRate: 71.3,
            },
          ],
          dropoffPoints: [
            { moduleId: "mod-1", moduleName: "Introducción", dropoffRate: 8.2 },
            {
              moduleId: "mod-2",
              moduleName: "Habilidades Básicas",
              dropoffRate: 15.7,
            },
            {
              moduleId: "mod-3",
              moduleName: "Desarrollo Avanzado",
              dropoffRate: 23.4,
            },
          ],
          timeSpentDistribution: [
            { range: "0-1h", percentage: 12 },
            { range: "1-3h", percentage: 28 },
            { range: "3-6h", percentage: 35 },
            { range: "6-10h", percentage: 18 },
            { range: "10+h", percentage: 7 },
          ],
        },
        performance: {
          quizResults: [
            {
              quizId: "quiz-1",
              title: "Evaluación Módulo 1",
              averageScore: 84.5,
              passRate: 91.2,
            },
            {
              quizId: "quiz-2",
              title: "Evaluación Módulo 2",
              averageScore: 78.3,
              passRate: 83.7,
            },
            {
              quizId: "quiz-3",
              title: "Evaluación Final",
              averageScore: 81.7,
              passRate: 87.9,
            },
          ],
          modulePerformance: [
            {
              moduleId: "mod-1",
              name: "Introducción",
              averageTime: 45,
              completionRate: 92.8,
            },
            {
              moduleId: "mod-2",
              name: "Habilidades Básicas",
              averageTime: 120,
              completionRate: 84.3,
            },
            {
              moduleId: "mod-3",
              name: "Desarrollo Avanzado",
              averageTime: 180,
              completionRate: 76.6,
            },
          ],
          strugglingStudents: 234,
          topPerformers: 428,
        },
        feedback: {
          averageRating: 4.8,
          ratingDistribution: [
            { stars: 5, count: 1456 },
            { stars: 4, count: 892 },
            { stars: 3, count: 234 },
            { stars: 2, count: 67 },
            { stars: 1, count: 23 },
          ],
          commonFeedback: [
            {
              theme: "Contenido claro y útil",
              mentions: 342,
              sentiment: "positive",
            },
            {
              theme: "Buena organización",
              mentions: 278,
              sentiment: "positive",
            },
            {
              theme: "Videos de calidad",
              mentions: 234,
              sentiment: "positive",
            },
            {
              theme: "Necesita más ejemplos prácticos",
              mentions: 156,
              sentiment: "negative",
            },
            { theme: "Ritmo algo lento", mentions: 89, sentiment: "negative" },
          ],
        },
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implementation for exporting analytics report
    console.log("Exporting analytics report...");
  };

  if (loading || !analyticsData) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
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
            <h1 className="text-2xl font-bold">Analíticas del Curso</h1>
            <p className="text-muted-foreground">
              Métricas de rendimiento y engagement de estudiantes
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 3 meses</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inscritos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.totalEnrollments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estudiantes Activos
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.activeStudents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasa de Finalización
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.completionRate}%
            </div>
            <Progress
              value={analyticsData.overview.completionRate}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calificación Promedio
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.averageRating}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-yellow-500">★★★★★</span>
              <span className="ml-1">de 5.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.totalViewTime.toLocaleString()}h
            </div>
            <p className="text-xs text-muted-foreground">
              Tiempo de visualización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.certificatesIssued.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Emitidos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Inscripciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meta mensual: 3,000</span>
                    <Badge variant="outline">95% alcanzado</Badge>
                  </div>
                  <Progress value={95} />
                  <p className="text-xs text-muted-foreground">
                    153 inscripciones restantes para alcanzar la meta
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Tiempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.engagement.timeSpentDistribution.map(
                    (item) => (
                      <div key={item.range} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.range}</span>
                          <span>{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performance.modulePerformance.map((module) => (
                  <div
                    key={module.moduleId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{module.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Tiempo promedio: {module.averageTime} min
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {module.completionRate}%
                      </div>
                      <Badge
                        variant={
                          module.completionRate >= 80 ? "default" : "secondary"
                        }
                      >
                        {module.completionRate >= 80
                          ? "Excelente"
                          : "Mejorable"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Finalización por Lección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.engagement.lessonCompletionRates.map(
                    (lesson) => (
                      <div key={lesson.lessonId} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{lesson.title}</span>
                          <span>{lesson.completionRate}%</span>
                        </div>
                        <Progress value={lesson.completionRate} />
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Puntos de Abandono</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.engagement.dropoffPoints.map((point) => (
                    <div
                      key={point.moduleId}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium">{point.moduleName}</span>
                      </div>
                      <Badge variant="destructive">
                        {point.dropoffRate}% abandono
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Los puntos con mayor abandono requieren revisión del contenido
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estudiantes con Dificultades
                    </p>
                    <p className="text-2xl font-bold">
                      {analyticsData.performance.strugglingStudents}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estudiantes Destacados
                    </p>
                    <p className="text-2xl font-bold">
                      {analyticsData.performance.topPerformers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resultados de Exámenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.performance.quizResults.map((quiz) => (
                  <div
                    key={quiz.quizId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Puntuación promedio: {quiz.averageScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{quiz.passRate}%</div>
                      <p className="text-xs text-muted-foreground">
                        Tasa de aprobación
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.feedback.ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span>{rating.stars}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                      <div className="flex-1">
                        <Progress
                          value={
                            (rating.count /
                              analyticsData.feedback.ratingDistribution.reduce(
                                (sum, r) => sum + r.count,
                                0
                              )) *
                            100
                          }
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {rating.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comentarios Frecuentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.feedback.commonFeedback.map(
                    (feedback, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {feedback.theme}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {feedback.mentions} menciones
                          </p>
                        </div>
                        <Badge
                          variant={
                            feedback.sentiment === "positive"
                              ? "default"
                              : feedback.sentiment === "negative"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {feedback.sentiment === "positive"
                            ? "Positivo"
                            : feedback.sentiment === "negative"
                              ? "Negativo"
                              : "Neutral"}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
