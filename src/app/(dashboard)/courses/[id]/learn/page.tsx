"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from "canvas-confetti";
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
import { CourseSection } from "@/components/courses/course-section";
import type {
  CourseResource,
  Quiz,
  QuizQuestion,
  ResourceType,
} from "@/types/courses";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: "PDF" | "VIDEO" | "LINK" | "IMAGE";
  url: string;
  fileSize?: string;
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "reading";
  videoUrl?: string;
  content?: string;
  locked?: boolean;
  resources?: CourseResource[];
  quiz?: Quiz;
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
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string>("");
  const [currentLessonId, setCurrentLessonId] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState("");
  
  // Video player state
  // 10 minutes for demo
  // Mock course data
  useEffect(() => {
    const mockCourse: Course = {
      id: courseId,
      title: "Habilidades Laborales Básicas",
      instructor: "Dra. Ana Pérez",
      description: "Desarrolla las competencias fundamentales para el mundo laboral",
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
              resources: [
                {
                  id: "res-1",
                  title: "Guía de Introducción",
                  description: "PDF con el contenido detallado del curso",
                  type: "PDF" as ResourceType,
                  url: "/resources/guia-introduccion.pdf",
                  fileSize: "2.4 MB",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: "res-2",
                  title: "Video de Bienvenida",
                  description: "Mensaje del instructor",
                  type: "VIDEO" as ResourceType,
                  url: "https://sample-videos.com/welcome.mp4",
                  duration: "3:45",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: "res-3",
                  title: "Material Complementario",
                  description: "Lecturas recomendadas y ejercicios prácticos",
                  type: "PDF" as ResourceType,
                  url: "/resources/material-complementario.pdf",
                  fileSize: "1.8 MB",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
            {
              id: "lesson-2",
              title: "¿Qué son las habilidades laborales?",
              duration: "8 min",
              completed: false,
              type: "video",
              videoUrl:
                "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
              resources: [
                {
                  id: "res-4",
                  title: "Presentación de Habilidades Laborales",
                  description: "Slides de la presentación",
                  type: "PDF" as ResourceType,
                  url: "/resources/presentacion-habilidades.pdf",
                  fileSize: "3.1 MB",
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
                {
                  id: "res-5",
                  title: "Enlaces Útiles",
                  description: "Recursos externos recomendados",
                  type: "LINK" as ResourceType,
                  url: "https://example.com/recursos",
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
              ],
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
                description: "Evalúa tu comprensión de los conceptos fundamentales",
                timeLimit: 10,
                passingScore: 70,
                attempts: 0,
                isRequired: true,
                questions: [
                  {
                    id: "q1",
                    question:
                      "¿Cuáles son las habilidades blandas más importantes en el trabajo?",
                    options: [
                      "Comunicación y trabajo en equipo",
                      "Solo conocimientos técnicos",
                      "Experiencia laboral únicamente",
                      "Ninguna de las anteriores",
                    ],
                    correctOption: 0,
                    explanation:
                      "Las habilidades blandas como comunicación y trabajo en equipo son fundamentales para el éxito profesional.",
                    points: 10,
                  },
                  {
                    id: "q2",
                    question: "¿Qué significa ser proactivo en el trabajo?",
                    options: [
                      "Esperar instrucciones constantemente",
                      "Tomar iniciativa y anticiparse a los problemas",
                      "Trabajar solo cuando sea necesario",
                      "Evitar responsabilidades adicionales",
                    ],
                    correctOption: 1,
                    explanation:
                      "Ser proactivo implica tomar la iniciativa y buscar soluciones antes de que surjan problemas.",
                    points: 10,
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

    // Mostrar motivación si el progreso es bajo, medio o alto
const progress = mockCourse.totalProgress;

if (progress >= 80) {
  setMotivationMessage("✨ ¡Estás a punto de terminar el curso, sigue así!");
  setShowMotivationModal(true);
} else if (progress >= 50) {
  setMotivationMessage("🔥 ¡Muy bien! Ya pasaste la mitad del camino.");
  setShowMotivationModal(true);
} else if (progress >= 20) {
  setMotivationMessage("🚀 ¡Buen arranque! No te detengas.");
  setShowMotivationModal(true);
} else {
  setMotivationMessage("👣 ¡Vamos! Cada paso cuenta, continúa aprendiendo.");
  setShowMotivationModal(true);
}

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
      }
      

      return updated;
    });

    // Move to next lesson automatically
    const allLessons = updated.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleId: m.id }))
    );
    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    const isLastLesson = currentIndex === allLessons.length - 1;
    
    if (isLastLesson) {
      // Confeti final por terminar TODO el curso
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
      });
      setShowCertificate(true);
    } else {
      // Espera y pasa a la siguiente lección
      setTimeout(() => {
        goToNextLesson();
      }, 1000);
    }
    
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
      <Dialog open={showMotivationModal} onOpenChange={setShowMotivationModal}>
  <DialogContent className="text-center">
    <DialogHeader>
      <DialogTitle>💡 Motivación del día</DialogTitle>
    </DialogHeader>
    <p className="text-lg">{motivationMessage}</p>
  </DialogContent>
</Dialog>

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
          {currentLesson && (
            <CourseSection
              section={{
                id: currentLesson.id,
                title: currentLesson.title,
                description: currentModule?.title || "",
                order: course.modules.findIndex(
                  (m) => m.id === currentModuleId
                ),
                videoUrl: currentLesson.videoUrl,
                videoDuration: currentLesson.duration,
                content: currentLesson.content,
                resources: currentLesson.resources || [],
                quiz: currentLesson.quiz,
              }}
              isActive={!currentLesson.locked}
              onComplete={() => handleLessonComplete(currentLessonId)}
            />
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

                {(() => {
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const isLastLesson = currentIndex === allLessons.length - 1;

  if (course.totalProgress === 100 || isLastLesson) {
    return (
      <Button
        onClick={() => {
          confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
          setShowCertificate(true);
        }}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        🎉 Celebrar finalización
      </Button>
    );
  }

  return (
    <Button onClick={goToNextLesson}>
      Siguiente lección
      <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  );
})()}


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
