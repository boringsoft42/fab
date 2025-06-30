"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Play,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Award,
  ChevronLeft,
  SkipBack,
  SkipForward,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { LessonPlayer } from "@/components/courses/lesson-player";
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
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  modules: Module[];
  totalProgress: number;
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

  // Mock course data
  useEffect(() => {
    const mockCourse: Course = {
      id: courseId,
      title: "Habilidades Laborales Básicas",
      instructor: "Dra. Ana Pérez",
      description:
        "Desarrolla las competencias fundamentales para el mundo laboral",
      totalProgress: 45,
      certificate: {
        id: "cert-123",
        issued: false,
      },
      modules: [
        {
          id: "mod-1",
          title: "Introducción a las Habilidades Laborales",
          duration: "45 min",
          completed: true,
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
              id: "quiz-1",
              title: "Evaluación: Conceptos básicos",
              duration: "10 min",
              completed: false,
              type: "quiz",
              quiz: {
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
                    correctAnswer: 0,
                    explanation:
                      "Las habilidades blandas como comunicación y trabajo en equipo son fundamentales para el éxito profesional.",
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    setCourse(mockCourse);
    // Set first incomplete lesson as current
    const firstIncompleteLesson = mockCourse.modules
      .flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })))
      .find((l) => !l.completed);

    if (firstIncompleteLesson) {
      setCurrentModuleId(firstIncompleteLesson.moduleId);
      setCurrentLessonId(firstIncompleteLesson.id);
    }
  }, [courseId]);

  const getCurrentLesson = () => {
    if (!course) return null;
    return course.modules
      .find((m) => m.id === currentModuleId)
      ?.lessons.find((l) => l.id === currentLessonId);
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
  };

  const currentLesson = getCurrentLesson();

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (showCertificate && course.certificate?.issued) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="text-center p-8">
            <div className="mb-6">
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Felicitaciones!
              </h1>
              <p className="text-lg text-gray-600">
                Has completado exitosamente el curso
              </p>
            </div>

            <div className="bg-white border-2 border-yellow-400 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Certificado de Finalización
              </h2>
              <p className="text-lg text-gray-700 mb-4">{course.title}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button size="lg">
                <Award className="mr-2 h-4 w-4" />
                Descargar Certificado
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/courses")}
              >
                Explorar más cursos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-12" : "w-80"} bg-white border-r transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-semibold text-lg truncate">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600">con {course.instructor}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {!sidebarCollapsed && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progreso del curso</span>
                <span>{course.totalProgress}%</span>
              </div>
              <Progress value={course.totalProgress} className="h-2" />
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <Collapsible
                  key={module.id}
                  defaultOpen={module.id === currentModuleId}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <ChevronRight className="h-4 w-4" />
                      <span className="font-medium text-sm">
                        {moduleIndex + 1}. {module.title}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {module.duration}
                    </Badge>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2">
                    <div className="pl-4 space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setCurrentModuleId(module.id);
                            setCurrentLessonId(lesson.id);
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                            lesson.id === currentLessonId
                              ? "bg-blue-100 border border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : lesson.id === currentLessonId ? (
                              <Play className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {lesson.duration}
                              </span>
                              {lesson.type === "quiz" && (
                                <Badge variant="outline" className="text-xs">
                                  Quiz
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver al curso
              </Button>

              {currentLesson && (
                <div>
                  <h1 className="font-semibold text-lg">
                    {currentLesson.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{currentLesson.duration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {currentLesson && (
            <Tabs defaultValue="lesson" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
                <TabsTrigger value="lesson" className="flex items-center gap-2">
                  {currentLesson.type === "video" ? (
                    <Play className="h-4 w-4" />
                  ) : currentLesson.type === "quiz" ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                  Lección
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notas
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="lesson"
                className="flex-1 p-4 overflow-hidden"
              >
                {currentLesson.type === "video" && (
                  <LessonPlayer
                    lesson={currentLesson}
                    onComplete={() => handleLessonComplete(currentLesson.id)}
                    onNext={() => {}}
                  />
                )}

                {currentLesson.type === "quiz" && currentLesson.quiz && (
                  <QuizComponent
                    quiz={currentLesson.quiz}
                    onComplete={() => handleLessonComplete(currentLesson.id)}
                  />
                )}
              </TabsContent>

              <TabsContent value="notes" className="flex-1 p-4 overflow-hidden">
                <LessonNotes
                  lessonId={currentLesson.id}
                  lessonTitle={currentLesson.title}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
