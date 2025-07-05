&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams } from &ldquo;next/navigation&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Award,
  BookOpen,
  Eye,
  Download,
  ArrowLeft,
  Target,
  AlertTriangle,
} from &ldquo;lucide-react&rdquo;;

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
      sentiment: &ldquo;positive&rdquo; | &ldquo;negative&rdquo; | &ldquo;neutral&rdquo;;
    }[];
  };
}

export default function CourseAnalyticsPage() {
  const courseId = params.id as string;

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(&ldquo;30d&rdquo;);
  const [activeTab, setActiveTab] = useState(&ldquo;overview&rdquo;);

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
            { date: &ldquo;2024-02-01&rdquo;, users: 145 },
            { date: &ldquo;2024-02-02&rdquo;, users: 132 },
            { date: &ldquo;2024-02-03&rdquo;, users: 156 },
            { date: &ldquo;2024-02-04&rdquo;, users: 189 },
            { date: &ldquo;2024-02-05&rdquo;, users: 167 },
            { date: &ldquo;2024-02-06&rdquo;, users: 143 },
            { date: &ldquo;2024-02-07&rdquo;, users: 178 },
          ],
          lessonCompletionRates: [
            {
              lessonId: &ldquo;lesson-1&rdquo;,
              title: &ldquo;Bienvenida al curso&rdquo;,
              completionRate: 95.2,
            },
            {
              lessonId: &ldquo;lesson-2&rdquo;,
              title: &ldquo;Comunicación efectiva&rdquo;,
              completionRate: 87.5,
            },
            {
              lessonId: &ldquo;lesson-3&rdquo;,
              title: &ldquo;Trabajo en equipo&rdquo;,
              completionRate: 82.1,
            },
            {
              lessonId: &ldquo;lesson-4&rdquo;,
              title: &ldquo;Resolución de problemas&rdquo;,
              completionRate: 76.8,
            },
            {
              lessonId: &ldquo;lesson-5&rdquo;,
              title: &ldquo;Liderazgo básico&rdquo;,
              completionRate: 71.3,
            },
          ],
          dropoffPoints: [
            { moduleId: &ldquo;mod-1&rdquo;, moduleName: &ldquo;Introducción&rdquo;, dropoffRate: 8.2 },
            {
              moduleId: &ldquo;mod-2&rdquo;,
              moduleName: &ldquo;Habilidades Básicas&rdquo;,
              dropoffRate: 15.7,
            },
            {
              moduleId: &ldquo;mod-3&rdquo;,
              moduleName: &ldquo;Desarrollo Avanzado&rdquo;,
              dropoffRate: 23.4,
            },
          ],
          timeSpentDistribution: [
            { range: &ldquo;0-1h&rdquo;, percentage: 12 },
            { range: &ldquo;1-3h&rdquo;, percentage: 28 },
            { range: &ldquo;3-6h&rdquo;, percentage: 35 },
            { range: &ldquo;6-10h&rdquo;, percentage: 18 },
            { range: &ldquo;10+h&rdquo;, percentage: 7 },
          ],
        },
        performance: {
          quizResults: [
            {
              quizId: &ldquo;quiz-1&rdquo;,
              title: &ldquo;Evaluación Módulo 1&rdquo;,
              averageScore: 84.5,
              passRate: 91.2,
            },
            {
              quizId: &ldquo;quiz-2&rdquo;,
              title: &ldquo;Evaluación Módulo 2&rdquo;,
              averageScore: 78.3,
              passRate: 83.7,
            },
            {
              quizId: &ldquo;quiz-3&rdquo;,
              title: &ldquo;Evaluación Final&rdquo;,
              averageScore: 81.7,
              passRate: 87.9,
            },
          ],
          modulePerformance: [
            {
              moduleId: &ldquo;mod-1&rdquo;,
              name: &ldquo;Introducción&rdquo;,
              averageTime: 45,
              completionRate: 92.8,
            },
            {
              moduleId: &ldquo;mod-2&rdquo;,
              name: &ldquo;Habilidades Básicas&rdquo;,
              averageTime: 120,
              completionRate: 84.3,
            },
            {
              moduleId: &ldquo;mod-3&rdquo;,
              name: &ldquo;Desarrollo Avanzado&rdquo;,
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
              theme: &ldquo;Contenido claro y útil&rdquo;,
              mentions: 342,
              sentiment: &ldquo;positive&rdquo;,
            },
            {
              theme: &ldquo;Buena organización&rdquo;,
              mentions: 278,
              sentiment: &ldquo;positive&rdquo;,
            },
            {
              theme: &ldquo;Videos de calidad&rdquo;,
              mentions: 234,
              sentiment: &ldquo;positive&rdquo;,
            },
            {
              theme: &ldquo;Necesita más ejemplos prácticos&rdquo;,
              mentions: 156,
              sentiment: &ldquo;negative&rdquo;,
            },
            { theme: &ldquo;Ritmo algo lento&rdquo;, mentions: 89, sentiment: &ldquo;negative&rdquo; },
          ],
        },
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error(&ldquo;Error fetching analytics:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implementation for exporting analytics report
    console.log(&ldquo;Exporting analytics report...&rdquo;);
  };

  if (loading || !analyticsData) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-8 bg-gray-200 rounded w-1/4&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            {[...Array(6)].map((_, i) => (
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
            <h1 className=&ldquo;text-2xl font-bold&rdquo;>Analíticas del Curso</h1>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              Métricas de rendimiento y engagement de estudiantes
            </p>
          </div>
        </div>

        <div className=&ldquo;flex gap-2&rdquo;>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className=&ldquo;w-[150px]&rdquo;>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=&ldquo;7d&rdquo;>Últimos 7 días</SelectItem>
              <SelectItem value=&ldquo;30d&rdquo;>Últimos 30 días</SelectItem>
              <SelectItem value=&ldquo;90d&rdquo;>Últimos 3 meses</SelectItem>
              <SelectItem value=&ldquo;1y&rdquo;>Último año</SelectItem>
            </SelectContent>
          </Select>

          <Button variant=&ldquo;outline&rdquo; onClick={exportReport}>
            <Download className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4&rdquo;>
        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Total Inscritos
            </CardTitle>
            <Users className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {analyticsData.overview.totalEnrollments.toLocaleString()}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              <TrendingUp className=&ldquo;h-3 w-3 inline mr-1&rdquo; />
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Estudiantes Activos
            </CardTitle>
            <Eye className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {analyticsData.overview.activeStudents.toLocaleString()}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              <TrendingUp className=&ldquo;h-3 w-3 inline mr-1&rdquo; />
              +8% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Tasa de Finalización
            </CardTitle>
            <Target className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {analyticsData.overview.completionRate}%
            </div>
            <Progress
              value={analyticsData.overview.completionRate}
              className=&ldquo;mt-2&rdquo;
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>
              Calificación Promedio
            </CardTitle>
            <BarChart3 className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {analyticsData.overview.averageRating}
            </div>
            <div className=&ldquo;flex items-center text-xs text-muted-foreground&rdquo;>
              <span className=&ldquo;text-yellow-500&rdquo;>★★★★★</span>
              <span className=&ldquo;ml-1&rdquo;>de 5.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Tiempo Total</CardTitle>
            <Clock className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {analyticsData.overview.totalViewTime.toLocaleString()}h
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
              Tiempo de visualización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className=&ldquo;flex flex-row items-center justify-between space-y-0 pb-2&rdquo;>
            <CardTitle className=&ldquo;text-sm font-medium&rdquo;>Certificados</CardTitle>
            <Award className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
          </CardHeader>
          <CardContent>
            <div className=&ldquo;text-2xl font-bold&rdquo;>
              {analyticsData.overview.certificatesIssued.toLocaleString()}
            </div>
            <p className=&ldquo;text-xs text-muted-foreground&rdquo;>Emitidos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className=&ldquo;space-y-6&rdquo;
      >
        <TabsList className=&ldquo;grid w-full grid-cols-4&rdquo;>
          <TabsTrigger value=&ldquo;overview&rdquo;>Resumen</TabsTrigger>
          <TabsTrigger value=&ldquo;engagement&rdquo;>Engagement</TabsTrigger>
          <TabsTrigger value=&ldquo;performance&rdquo;>Rendimiento</TabsTrigger>
          <TabsTrigger value=&ldquo;feedback&rdquo;>Feedback</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value=&ldquo;overview&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
            <Card>
              <CardHeader>
                <CardTitle>Progreso de Inscripciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;flex items-center justify-between&rdquo;>
                    <span className=&ldquo;text-sm&rdquo;>Meta mensual: 3,000</span>
                    <Badge variant=&ldquo;outline&rdquo;>95% alcanzado</Badge>
                  </div>
                  <Progress value={95} />
                  <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
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
                <div className=&ldquo;space-y-3&rdquo;>
                  {analyticsData.engagement.timeSpentDistribution.map(
                    (item) => (
                      <div key={item.range} className=&ldquo;space-y-1&rdquo;>
                        <div className=&ldquo;flex justify-between text-sm&rdquo;>
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
              <div className=&ldquo;space-y-4&rdquo;>
                {analyticsData.performance.modulePerformance.map((module) => (
                  <div
                    key={module.moduleId}
                    className=&ldquo;flex items-center justify-between p-4 border rounded-lg&rdquo;
                  >
                    <div>
                      <h4 className=&ldquo;font-medium&rdquo;>{module.name}</h4>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        Tiempo promedio: {module.averageTime} min
                      </p>
                    </div>
                    <div className=&ldquo;text-right&rdquo;>
                      <div className=&ldquo;text-lg font-bold&rdquo;>
                        {module.completionRate}%
                      </div>
                      <Badge
                        variant={
                          module.completionRate >= 80 ? &ldquo;default&rdquo; : &ldquo;secondary&rdquo;
                        }
                      >
                        {module.completionRate >= 80
                          ? &ldquo;Excelente&rdquo;
                          : &ldquo;Mejorable&rdquo;}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value=&ldquo;engagement&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
            <Card>
              <CardHeader>
                <CardTitle>Finalización por Lección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=&ldquo;space-y-4&rdquo;>
                  {analyticsData.engagement.lessonCompletionRates.map(
                    (lesson) => (
                      <div key={lesson.lessonId} className=&ldquo;space-y-2&rdquo;>
                        <div className=&ldquo;flex justify-between text-sm&rdquo;>
                          <span className=&ldquo;font-medium&rdquo;>{lesson.title}</span>
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
                <div className=&ldquo;space-y-4&rdquo;>
                  {analyticsData.engagement.dropoffPoints.map((point) => (
                    <div
                      key={point.moduleId}
                      className=&ldquo;flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200&rdquo;
                    >
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <AlertTriangle className=&ldquo;h-4 w-4 text-red-600&rdquo; />
                        <span className=&ldquo;font-medium&rdquo;>{point.moduleName}</span>
                      </div>
                      <Badge variant=&ldquo;destructive&rdquo;>
                        {point.dropoffRate}% abandono
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className=&ldquo;text-xs text-muted-foreground mt-4&rdquo;>
                  Los puntos con mayor abandono requieren revisión del contenido
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value=&ldquo;performance&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-4 mb-6&rdquo;>
            <Card>
              <CardContent className=&ldquo;p-4&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <AlertTriangle className=&ldquo;h-5 w-5 text-orange-600&rdquo; />
                  <div>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      Estudiantes con Dificultades
                    </p>
                    <p className=&ldquo;text-2xl font-bold&rdquo;>
                      {analyticsData.performance.strugglingStudents}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className=&ldquo;p-4&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Award className=&ldquo;h-5 w-5 text-green-600&rdquo; />
                  <div>
                    <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                      Estudiantes Destacados
                    </p>
                    <p className=&ldquo;text-2xl font-bold&rdquo;>
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
              <div className=&ldquo;space-y-4&rdquo;>
                {analyticsData.performance.quizResults.map((quiz) => (
                  <div
                    key={quiz.quizId}
                    className=&ldquo;flex items-center justify-between p-4 border rounded-lg&rdquo;
                  >
                    <div>
                      <h4 className=&ldquo;font-medium&rdquo;>{quiz.title}</h4>
                      <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                        Puntuación promedio: {quiz.averageScore}%
                      </p>
                    </div>
                    <div className=&ldquo;text-right&rdquo;>
                      <div className=&ldquo;text-lg font-bold&rdquo;>{quiz.passRate}%</div>
                      <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
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
        <TabsContent value=&ldquo;feedback&rdquo; className=&ldquo;space-y-6&rdquo;>
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-2 gap-6&rdquo;>
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=&ldquo;space-y-3&rdquo;>
                  {analyticsData.feedback.ratingDistribution.map((rating) => (
                    <div key={rating.stars} className=&ldquo;flex items-center gap-3&rdquo;>
                      <div className=&ldquo;flex items-center gap-1 w-16&rdquo;>
                        <span>{rating.stars}</span>
                        <span className=&ldquo;text-yellow-500&rdquo;>★</span>
                      </div>
                      <div className=&ldquo;flex-1&rdquo;>
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
                      <span className=&ldquo;text-sm text-muted-foreground w-12&rdquo;>
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
                <div className=&ldquo;space-y-3&rdquo;>
                  {analyticsData.feedback.commonFeedback.map(
                    (feedback, index) => (
                      <div
                        key={index}
                        className=&ldquo;flex items-center justify-between p-3 border rounded-lg&rdquo;
                      >
                        <div>
                          <p className=&ldquo;font-medium text-sm&rdquo;>
                            {feedback.theme}
                          </p>
                          <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                            {feedback.mentions} menciones
                          </p>
                        </div>
                        <Badge
                          variant={
                            feedback.sentiment === &ldquo;positive&rdquo;
                              ? &ldquo;default&rdquo;
                              : feedback.sentiment === &ldquo;negative&rdquo;
                                ? &ldquo;destructive&rdquo;
                                : &ldquo;secondary&rdquo;
                          }
                        >
                          {feedback.sentiment === &ldquo;positive&rdquo;
                            ? &ldquo;Positivo&rdquo;
                            : feedback.sentiment === &ldquo;negative&rdquo;
                              ? &ldquo;Negativo&rdquo;
                              : &ldquo;Neutral&rdquo;}
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
