"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Pause,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Award,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageSquare,
  Lock,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  RotateCcw,
  RotateCw,
  Users,
  Star,
  Download,
} from "lucide-react";
import { QuizComponent } from "@/components/courses/quiz-component";
import { LessonNotes } from "@/components/courses/lesson-notes";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "reading";
  videoUrl?: string;
  content?: string;
  locked?: boolean;
  quiz?: {
    id: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    allowedAttempts: number;
    showCorrectAnswers: boolean;
    questions: Array<{
      id: string;
      question: string;
      type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
      options?: string[];
      correctAnswer: string | string[];
      points: number;
      explanation?: string;
    }>;
  };
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
  duration: string;
  locked?: boolean;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  modules: Module[];
  totalProgress: number;
  rating: number;
  studentsCount: number;
  certificate?: {
    id: string;
    issued: boolean;
    completionDate?: string;
  };
}

export default function CourseLeanPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string>("");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(600); // 10 minutes for demo
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Mock course data
  useEffect(() => {
    const mockCourse: Course = {
      id: courseId,
      title: "Habilidades Laborales Básicas",
      instructor: "Dra. Ana Pérez",
      description:
        "Desarrolla las competencias fundamentales para el mundo laboral",
      totalProgress: 15,
      rating: 4.8,
      studentsCount: 2847,
      certificate: {
        id: "cert-123",
        issued: false,
      },
      modules: [
        {
          id: "mod-1",
          title: "Introducción a las Habilidades Laborales",
          duration: "45 min",
          completed: false,
          lessons: [
            {
              id: "lesson-1",
              title: "Bienvenida al curso",
              duration: "5 min",
              completed: true,
              type: "video",
              videoUrl:
                "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            },
            {
              id: "lesson-2",
              title: "¿Qué son las habilidades laborales?",
              duration: "8 min",
              completed: false,
              type: "video",
              videoUrl:
                "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            },
            {
              id: "quiz-1",
              title: "Evaluación: Conceptos básicos",
              duration: "10 min",
              completed: false,
              type: "quiz",
              quiz: {
                id: "quiz-1",
                title: "Evaluación: Conceptos básicos",
                description:
                  "Evalúa tu comprensión de los conceptos fundamentales",
                timeLimit: 10,
                passingScore: 70,
                allowedAttempts: 3,
                showCorrectAnswers: true,
                questions: [
                  {
                    id: "q1",
                    question:
                      "¿Cuáles son las habilidades blandas más importantes en el trabajo?",
                    type: "MULTIPLE_CHOICE" as const,
                    options: [
                      "Comunicación y trabajo en equipo",
                      "Solo conocimientos técnicos",
                      "Experiencia laboral únicamente",
                      "Ninguna de las anteriores",
                    ],
                    correctAnswer: "Comunicación y trabajo en equipo",
                    points: 10,
                    explanation:
                      "Las habilidades blandas como comunicación y trabajo en equipo son fundamentales para el éxito profesional.",
                  },
                  {
                    id: "q2",
                    question: "¿Qué significa ser proactivo en el trabajo?",
                    type: "MULTIPLE_CHOICE" as const,
                    options: [
                      "Esperar instrucciones constantemente",
                      "Tomar iniciativa y anticiparse a los problemas",
                      "Trabajar solo cuando sea necesario",
                      "Evitar responsabilidades adicionales",
                    ],
                    correctAnswer:
                      "Tomar iniciativa y anticiparse a los problemas",
                    points: 10,
                    explanation:
                      "Ser proactivo implica tomar la iniciativa y buscar soluciones antes de que surjan problemas.",
                  },
                ],
              },
            },
          ],
        },
        {
          id: "mod-2",
          title: "Comunicación Efectiva",
          duration: "60 min",
          completed: false,
          lessons: [
            {
              id: "lesson-3",
              title: "Fundamentos de la comunicación",
              duration: "12 min",
              completed: false,
              type: "video",
              videoUrl:
                "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            },
            {
              id: "lesson-4",
              title: "Comunicación no verbal",
              duration: "10 min",
              completed: false,
              type: "video",
              videoUrl:
                "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            },
          ],
        },
      ],
    };

    setCourse(mockCourse);

    // Set first lesson as current
    setCurrentModuleId(mockCourse.modules[0].id);
    setCurrentLessonId(mockCourse.modules[0].lessons[0].id);
    setExpandedModules([mockCourse.modules[0].id]);
  }, [courseId]);

  const getCurrentLesson = () => {
    if (!course) return null;
    return course.modules
      .find((m) => m.id === currentModuleId)
      ?.lessons.find((l) => l.id === currentLessonId);
  };

  const getCurrentModule = () => {
    if (!course) return null;
    return course.modules.find((m) => m.id === currentModuleId);
  };

  const handleLessonComplete = (lessonId: string) => {
    if (!course) return;

    setCourse((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };
      updated.modules = updated.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        ),
      }));

      // Update module completion
      updated.modules = updated.modules.map((module) => ({
        ...module,
        completed: module.lessons.every((l) => l.completed),
      }));

      // Update total progress
      const totalLessons = updated.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0
      );
      const completedLessons = updated.modules.reduce(
        (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
        0
      );
      updated.totalProgress = Math.round(
        (completedLessons / totalLessons) * 100
      );

      // Check if course is completed
      if (updated.totalProgress === 100) {
        updated.certificate = {
          ...updated.certificate!,
          issued: true,
          completionDate: new Date().toISOString(),
        };
        setShowCertificate(true);
      }

      return updated;
    });

    // Move to next lesson automatically
    setTimeout(() => {
      goToNextLesson();
    }, 1000);
  };

  const goToNextLesson = () => {
    if (!course) return;

    const allLessons = course.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleId: m.id }))
    );
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setCurrentModuleId(nextLesson.moduleId);
      setCurrentLessonId(nextLesson.id);

      // Expand the module if needed
      if (!expandedModules.includes(nextLesson.moduleId)) {
        setExpandedModules([...expandedModules, nextLesson.moduleId]);
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!course) return;

    const allLessons = course.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleId: m.id }))
    );
    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);

    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      setCurrentModuleId(prevLesson.moduleId);
      setCurrentLessonId(prevLesson.id);

      // Expand the module if needed
      if (!expandedModules.includes(prevLesson.moduleId)) {
        setExpandedModules([...expandedModules, prevLesson.moduleId]);
      }
    }
  };

  const selectLesson = (moduleId: string, lessonId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);

    // Expand the module if needed
    if (!expandedModules.includes(moduleId)) {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const currentLesson = getCurrentLesson();
  const currentModule = getCurrentModule();

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/courses/${courseId}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver al curso
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold text-lg">{course.title}</h1>
              <p className="text-sm text-muted-foreground">
                con {course.instructor}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{course.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({course.studentsCount.toLocaleString()} estudiantes)
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {course.totalProgress}% completado
              </div>
              <Progress value={course.totalProgress} className="w-32 h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 ${sidebarCollapsed ? "mr-0" : "mr-80"}`}>
          {currentLesson.type === "video" ? (
            <div className="bg-black">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <video
                  className="w-full h-full"
                  controls
                  onEnded={() => handleLessonComplete(currentLessonId)}
                  onTimeUpdate={(e) => {
                    const video = e.target as HTMLVideoElement;
                    setCurrentTime(video.currentTime);

                    // Auto-complete when 90% watched
                    if (
                      video.currentTime / video.duration >= 0.9 &&
                      !currentLesson.completed
                    ) {
                      handleLessonComplete(currentLessonId);
                    }
                  }}
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                </video>
              </div>
            </div>
          ) : currentLesson.type === "quiz" && currentLesson.quiz ? (
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {currentLesson.quiz.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {currentLesson.quiz.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {currentLesson.quiz.timeLimit} minutos
                      </div>
                      <div>
                        Puntuación mínima: {currentLesson.quiz.passingScore}%
                      </div>
                      <div>{currentLesson.quiz.questions.length} preguntas</div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">
                        Vista previa de preguntas:
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {currentLesson.quiz.questions.map((q, index) => (
                          <li key={q.id} className="flex items-start gap-2">
                            <span className="text-blue-600 font-medium">
                              {index + 1}.
                            </span>
                            <span>{q.question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleLessonComplete(currentLessonId)}
                      >
                        Simular aprobar quiz
                      </Button>
                      <Button variant="outline">Iniciar quiz real</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {currentLesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium mb-3">Contenido de lectura</h4>
                    <p className="text-muted-foreground mb-4">
                      {currentLesson.content ||
                        "Material de lectura sobre habilidades laborales básicas. Este contenido incluye conceptos fundamentales, ejercicios prácticos y ejemplos del mundo real."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📖 Tiempo estimado de lectura: {currentLesson.duration}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleLessonComplete(currentLessonId)}
                    >
                      Marcar como completado
                    </Button>
                    <Button variant="outline">Descargar material</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lesson Info */}
          <div className="bg-white p-6 border-t">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentLesson.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {currentModule?.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentLesson.completed && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousLesson}
                  disabled={
                    course.modules
                      .flatMap((m) => m.lessons)
                      .findIndex((l) => l.id === currentLessonId) === 0
                  }
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Lección anterior
                </Button>

                <Button
                  onClick={goToNextLesson}
                  disabled={
                    course.modules
                      .flatMap((m) =>
                        m.lessons.map((l) => ({ ...l, moduleId: m.id }))
                      )
                      .find(
                        (_, index, arr) =>
                          arr[index]?.id === currentLessonId &&
                          (index === arr.length - 1 || arr[index + 1]?.locked)
                      ) !== undefined
                  }
                >
                  Siguiente lección
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 ${
            sidebarCollapsed ? "w-0" : "w-80"
          } overflow-hidden`}
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Contenido del curso</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}{" "}
              lecciones •{" "}
              {course.modules.reduce((acc, m) => acc + parseInt(m.duration), 0)}{" "}
              min
            </div>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id} className="border-b border-gray-100">
                <Collapsible
                  open={expandedModules.includes(module.id)}
                  onOpenChange={() => toggleModuleExpanded(module.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                        module.locked ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            module.completed
                              ? "bg-green-100 text-green-800"
                              : module.locked
                                ? "bg-gray-100 text-gray-400"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {module.completed ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : module.locked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            moduleIndex + 1
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {module.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {module.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">
                          {module.lessons.filter((l) => l.completed).length}/
                          {module.lessons.length}
                        </div>
                        {expandedModules.includes(module.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="bg-gray-50">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 p-3 pl-6 cursor-pointer hover:bg-white transition-colors ${
                            lesson.id === currentLessonId
                              ? "bg-blue-50 border-r-2 border-blue-600"
                              : ""
                          } ${lesson.locked ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => selectLesson(module.id, lesson.id)}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              lesson.completed
                                ? "bg-green-600"
                                : lesson.locked
                                  ? "bg-gray-300"
                                  : lesson.id === currentLessonId
                                    ? "bg-blue-600"
                                    : "border-2 border-gray-300"
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            ) : lesson.type === "quiz" ? (
                              <FileText className="h-3 w-3 text-white" />
                            ) : (
                              <Play className="h-2 w-2 text-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                              {lesson.type === "quiz" && (
                                <Badge
                                  variant="outline"
                                  className="text-xs py-0"
                                >
                                  Quiz
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>

        {/* Collapsed Sidebar Toggle */}
        {sidebarCollapsed && (
          <div className="fixed right-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="rounded-l-lg rounded-r-none border-r-0 bg-white shadow-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <CardTitle>¡Felicitaciones!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                Has completado exitosamente el curso{" "}
                <strong>{course.title}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Tu certificado está listo para descargar
              </p>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar certificado
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCertificate(false)}
                >
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
