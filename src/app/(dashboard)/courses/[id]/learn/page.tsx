&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams, useRouter } from &ldquo;next/navigation&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from &ldquo;@/components/ui/dialog&rdquo;;

import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import confetti from &ldquo;canvas-confetti&rdquo;;
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from &ldquo;@/components/ui/collapsible&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;
import { QuizComponent } from &ldquo;@/components/courses/quiz-component&rdquo;;
import { LessonNotes } from &ldquo;@/components/courses/lesson-notes&rdquo;;
import { CourseSection } from &ldquo;@/components/courses/course-section&rdquo;;
import type {
  CourseResource,
  Quiz,
  QuizQuestion,
  ResourceType,
} from &ldquo;@/types/courses&rdquo;;

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: &ldquo;PDF&rdquo; | &ldquo;VIDEO&rdquo; | &ldquo;LINK&rdquo; | &ldquo;IMAGE&rdquo;;
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
  type: &ldquo;video&rdquo; | &ldquo;quiz&rdquo; | &ldquo;reading&rdquo;;
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
  const [currentModuleId, setCurrentModuleId] = useState<string>(&ldquo;&rdquo;);
  const [currentLessonId, setCurrentLessonId] = useState<string>(&ldquo;&rdquo;);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState(&ldquo;&rdquo;);
  
  // Video player state
  // 10 minutes for demo
  // Mock course data
  useEffect(() => {
    const mockCourse: Course = {
      id: courseId,
      title: &ldquo;Habilidades Laborales Básicas&rdquo;,
      instructor: &ldquo;Dra. Ana Pérez&rdquo;,
      description:
        &ldquo;Desarrolla las competencias fundamentales para el mundo laboral&rdquo;,
      totalProgress: 15,
      rating: 4.8,
      studentsCount: 2847,
      certificate: {
        id: &ldquo;cert-123&rdquo;,
        issued: false,
      },
      modules: [
        {
          id: &ldquo;mod-1&rdquo;,
          title: &ldquo;Introducción a las Habilidades Laborales&rdquo;,
          duration: &ldquo;45 min&rdquo;,
          completed: false,
          lessons: [
            {
              id: &ldquo;lesson-1&rdquo;,
              title: &ldquo;Bienvenida al curso&rdquo;,
              duration: &ldquo;5 min&rdquo;,
              completed: true,
              type: &ldquo;video&rdquo;,
              videoUrl:
                &ldquo;https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4&rdquo;,
              resources: [
                {
                  id: &ldquo;res-1&rdquo;,
                  title: &ldquo;Guía de Introducción&rdquo;,
                  description: &ldquo;PDF con el contenido detallado del curso&rdquo;,
                  type: &ldquo;PDF&rdquo; as ResourceType,
                  url: &ldquo;/resources/guia-introduccion.pdf&rdquo;,
                  fileSize: &ldquo;2.4 MB&rdquo;,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: &ldquo;res-2&rdquo;,
                  title: &ldquo;Video de Bienvenida&rdquo;,
                  description: &ldquo;Mensaje del instructor&rdquo;,
                  type: &ldquo;VIDEO&rdquo; as ResourceType,
                  url: &ldquo;https://sample-videos.com/welcome.mp4&rdquo;,
                  duration: &ldquo;3:45&rdquo;,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
                {
                  id: &ldquo;res-3&rdquo;,
                  title: &ldquo;Material Complementario&rdquo;,
                  description: &ldquo;Lecturas recomendadas y ejercicios prácticos&rdquo;,
                  type: &ldquo;PDF&rdquo; as ResourceType,
                  url: &ldquo;/resources/material-complementario.pdf&rdquo;,
                  fileSize: &ldquo;1.8 MB&rdquo;,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
            {
              id: &ldquo;lesson-2&rdquo;,
              title: &ldquo;¿Qué son las habilidades laborales?&rdquo;,
              duration: &ldquo;8 min&rdquo;,
              completed: false,
              type: &ldquo;video&rdquo;,
              videoUrl:
                &ldquo;https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4&rdquo;,
              resources: [
                {
                  id: &ldquo;res-4&rdquo;,
                  title: &ldquo;Presentación de Habilidades Laborales&rdquo;,
                  description: &ldquo;Slides de la presentación&rdquo;,
                  type: &ldquo;PDF&rdquo; as ResourceType,
                  url: &ldquo;/resources/presentacion-habilidades.pdf&rdquo;,
                  fileSize: &ldquo;3.1 MB&rdquo;,
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
                {
                  id: &ldquo;res-5&rdquo;,
                  title: &ldquo;Enlaces Útiles&rdquo;,
                  description: &ldquo;Recursos externos recomendados&rdquo;,
                  type: &ldquo;LINK&rdquo; as ResourceType,
                  url: &ldquo;https://example.com/recursos&rdquo;,
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
              ],
            },
            {
              id: &ldquo;quiz-1&rdquo;,
              title: &ldquo;Evaluación: Conceptos básicos&rdquo;,
              duration: &ldquo;10 min&rdquo;,
              completed: false,
              type: &ldquo;quiz&rdquo;,
              quiz: {
                id: &ldquo;quiz-1&rdquo;,
                title: &ldquo;Evaluación: Conceptos básicos&rdquo;,
                description:
                  &ldquo;Evalúa tu comprensión de los conceptos fundamentales&rdquo;,
                timeLimit: 10,
                passingScore: 70,
                attempts: 0,
                isRequired: true,
                questions: [
                  {
                    id: &ldquo;q1&rdquo;,
                    question:
                      &ldquo;¿Cuáles son las habilidades blandas más importantes en el trabajo?&rdquo;,
                    options: [
                      &ldquo;Comunicación y trabajo en equipo&rdquo;,
                      &ldquo;Solo conocimientos técnicos&rdquo;,
                      &ldquo;Experiencia laboral únicamente&rdquo;,
                      &ldquo;Ninguna de las anteriores&rdquo;,
                    ],
                    correctOption: 0,
                    explanation:
                      &ldquo;Las habilidades blandas como comunicación y trabajo en equipo son fundamentales para el éxito profesional.&rdquo;,
                    points: 10,
                  },
                  {
                    id: &ldquo;q2&rdquo;,
                    question: &ldquo;¿Qué significa ser proactivo en el trabajo?&rdquo;,
                    options: [
                      &ldquo;Esperar instrucciones constantemente&rdquo;,
                      &ldquo;Tomar iniciativa y anticiparse a los problemas&rdquo;,
                      &ldquo;Trabajar solo cuando sea necesario&rdquo;,
                      &ldquo;Evitar responsabilidades adicionales&rdquo;,
                    ],
                    correctOption: 1,
                    explanation:
                      &ldquo;Ser proactivo implica tomar la iniciativa y buscar soluciones antes de que surjan problemas.&rdquo;,
                    points: 10,
                  },
                ],
              },
            },
          ],
        },
        {
          id: &ldquo;mod-2&rdquo;,
          title: &ldquo;Comunicación Efectiva&rdquo;,
          duration: &ldquo;60 min&rdquo;,
          completed: false,
          lessons: [
            {
              id: &ldquo;lesson-3&rdquo;,
              title: &ldquo;Fundamentos de la comunicación&rdquo;,
              duration: &ldquo;12 min&rdquo;,
              completed: false,
              type: &ldquo;video&rdquo;,
              videoUrl:
                &ldquo;https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4&rdquo;,
            },
            {
              id: &ldquo;lesson-4&rdquo;,
              title: &ldquo;Comunicación no verbal&rdquo;,
              duration: &ldquo;10 min&rdquo;,
              completed: false,
              type: &ldquo;video&rdquo;,
              videoUrl:
                &ldquo;https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4&rdquo;,
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
  setMotivationMessage(&ldquo;✨ ¡Estás a punto de terminar el curso, sigue así!&rdquo;);
  setShowMotivationModal(true);
} else if (progress >= 50) {
  setMotivationMessage(&ldquo;🔥 ¡Muy bien! Ya pasaste la mitad del camino.&rdquo;);
  setShowMotivationModal(true);
} else if (progress >= 20) {
  setMotivationMessage(&ldquo;🚀 ¡Buen arranque! No te detengas.&rdquo;);
  setShowMotivationModal(true);
} else {
  setMotivationMessage(&ldquo;👣 ¡Vamos! Cada paso cuenta, continúa aprendiendo.&rdquo;);
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
      <div className=&ldquo;min-h-screen flex items-center justify-center&rdquo;>
        <div className=&ldquo;text-center&rdquo;>
          <div className=&ldquo;animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto&rdquo;></div>
          <p className=&ldquo;mt-4 text-muted-foreground&rdquo;>Cargando curso...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className=&ldquo;min-h-screen bg-gray-50&rdquo;>
      <Dialog open={showMotivationModal} onOpenChange={setShowMotivationModal}>
  <DialogContent className=&ldquo;text-center&rdquo;>
    <DialogHeader>
      <DialogTitle>💡 Motivación del día</DialogTitle>
    </DialogHeader>
    <p className=&ldquo;text-lg&rdquo;>{motivationMessage}</p>
  </DialogContent>
</Dialog>

      {/* Header */}
      <div className=&ldquo;bg-white border-b border-gray-200 px-6 py-4&rdquo;>
        <div className=&ldquo;flex items-center justify-between&rdquo;>
          <div className=&ldquo;flex items-center gap-4&rdquo;>
            <Button
              variant=&ldquo;ghost&rdquo;
              size=&ldquo;sm&rdquo;
              onClick={() => router.push(`/courses/${courseId}`)}
            >
              <ChevronLeft className=&ldquo;h-4 w-4 mr-1&rdquo; />
              Volver al curso
            </Button>
            <Separator orientation=&ldquo;vertical&rdquo; className=&ldquo;h-6&rdquo; />
            <div>
              <h1 className=&ldquo;font-semibold text-lg&rdquo;>{course.title}</h1>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                con {course.instructor}
              </p>
            </div>
          </div>

          <div className=&ldquo;flex items-center gap-4&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Star className=&ldquo;h-4 w-4 text-yellow-500 fill-current&rdquo; />
              <span className=&ldquo;text-sm font-medium&rdquo;>{course.rating}</span>
              <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
                ({course.studentsCount.toLocaleString()} estudiantes)
              </span>
            </div>
            <div className=&ldquo;text-right&rdquo;>
              <div className=&ldquo;text-sm font-medium&rdquo;>
                {course.totalProgress}% completado
              </div>
              <Progress value={course.totalProgress} className=&ldquo;w-32 h-2&rdquo; />
            </div>
          </div>
        </div>
      </div>

      <div className=&ldquo;flex&rdquo;>
        {/* Main Content */}
        <div className={`flex-1 ${sidebarCollapsed ? &ldquo;mr-0&rdquo; : &ldquo;mr-80&rdquo;}`}>
          {currentLesson && (
            <CourseSection
              section={{
                id: currentLesson.id,
                title: currentLesson.title,
                description: currentModule?.title || &ldquo;&rdquo;,
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
          <div className=&ldquo;bg-white p-6 border-t&rdquo;>
            <div className=&ldquo;max-w-4xl mx-auto&rdquo;>
              <div className=&ldquo;flex items-start justify-between mb-4&rdquo;>
                <div className=&ldquo;flex-1&rdquo;>
                  <h2 className=&ldquo;text-xl font-semibold mb-2&rdquo;>
                    {currentLesson.title}
                  </h2>
                  <div className=&ldquo;flex items-center gap-4 text-sm text-muted-foreground&rdquo;>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <Clock className=&ldquo;h-4 w-4&rdquo; />
                      {currentLesson.duration}
                    </div>
                    <div className=&ldquo;flex items-center gap-1&rdquo;>
                      <BookOpen className=&ldquo;h-4 w-4&rdquo; />
                      {currentModule?.title}
                    </div>
                  </div>
                </div>

                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  {currentLesson.completed && (
                    <Badge
                      variant=&ldquo;secondary&rdquo;
                      className=&ldquo;bg-green-100 text-green-800&rdquo;
                    >
                      <CheckCircle2 className=&ldquo;h-3 w-3 mr-1&rdquo; />
                      Completado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <Button
                  variant=&ldquo;outline&rdquo;
                  onClick={goToPreviousLesson}
                  disabled={
                    course.modules
                      .flatMap((m) => m.lessons)
                      .findIndex((l) => l.id === currentLessonId) === 0
                  }
                >
                  <ChevronLeft className=&ldquo;h-4 w-4 mr-1&rdquo; />
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
        className=&ldquo;bg-green-600 hover:bg-green-700 text-white&rdquo;
      >
        🎉 Celebrar finalización
      </Button>
    );
  }

  return (
    <Button onClick={goToNextLesson}>
      Siguiente lección
      <ChevronRight className=&ldquo;h-4 w-4 ml-1&rdquo; />
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
            sidebarCollapsed ? &ldquo;w-0&rdquo; : &ldquo;w-80&rdquo;
          } overflow-hidden`}
        >
          <div className=&ldquo;p-4 border-b&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <h3 className=&ldquo;font-semibold&rdquo;>Contenido del curso</h3>
              <Button
                variant=&ldquo;ghost&rdquo;
                size=&ldquo;sm&rdquo;
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                <ChevronRight className=&ldquo;h-4 w-4&rdquo; />
              </Button>
            </div>
            <div className=&ldquo;mt-2 text-sm text-muted-foreground&rdquo;>
              {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}{&ldquo; &rdquo;}
              lecciones •{&ldquo; &rdquo;}
              {course.modules.reduce((acc, m) => acc + parseInt(m.duration), 0)}{&ldquo; &rdquo;}
              min
            </div>
          </div>

          <div className=&ldquo;overflow-y-auto h-full pb-20&rdquo;>
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id} className=&ldquo;border-b border-gray-100&rdquo;>
                <Collapsible
                  open={expandedModules.includes(module.id)}
                  onOpenChange={() => toggleModuleExpanded(module.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                        module.locked ? &ldquo;opacity-50&rdquo; : &ldquo;&rdquo;
                      }`}
                    >
                      <div className=&ldquo;flex items-center gap-3&rdquo;>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            module.completed
                              ? &ldquo;bg-green-100 text-green-800&rdquo;
                              : module.locked
                                ? &ldquo;bg-gray-100 text-gray-400&rdquo;
                                : &ldquo;bg-blue-100 text-blue-800&rdquo;
                          }`}
                        >
                          {module.completed ? (
                            <CheckCircle2 className=&ldquo;h-3 w-3&rdquo; />
                          ) : module.locked ? (
                            <Lock className=&ldquo;h-3 w-3&rdquo; />
                          ) : (
                            moduleIndex + 1
                          )}
                        </div>
                        <div className=&ldquo;flex-1&rdquo;>
                          <div className=&ldquo;font-medium text-sm&rdquo;>
                            {module.title}
                          </div>
                          <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
                            {module.duration}
                          </div>
                        </div>
                      </div>
                      <div className=&ldquo;flex items-center gap-2&rdquo;>
                        <div className=&ldquo;text-xs text-muted-foreground&rdquo;>
                          {module.lessons.filter((l) => l.completed).length}/
                          {module.lessons.length}
                        </div>
                        {expandedModules.includes(module.id) ? (
                          <ChevronUp className=&ldquo;h-4 w-4&rdquo; />
                        ) : (
                          <ChevronDown className=&ldquo;h-4 w-4&rdquo; />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className=&ldquo;bg-gray-50&rdquo;>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 p-3 pl-6 cursor-pointer hover:bg-white transition-colors ${
                            lesson.id === currentLessonId
                              ? &ldquo;bg-blue-50 border-r-2 border-blue-600&rdquo;
                              : &ldquo;&rdquo;
                          } ${lesson.locked ? &ldquo;opacity-50 cursor-not-allowed&rdquo; : &ldquo;&rdquo;}`}
                          onClick={() => selectLesson(module.id, lesson.id)}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              lesson.completed
                                ? &ldquo;bg-green-600&rdquo;
                                : lesson.locked
                                  ? &ldquo;bg-gray-300&rdquo;
                                  : lesson.id === currentLessonId
                                    ? &ldquo;bg-blue-600&rdquo;
                                    : &ldquo;border-2 border-gray-300&rdquo;
                            }`}
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className=&ldquo;h-3 w-3 text-white&rdquo; />
                            ) : lesson.type === &ldquo;quiz&rdquo; ? (
                              <FileText className=&ldquo;h-3 w-3 text-white&rdquo; />
                            ) : (
                              <Play className=&ldquo;h-2 w-2 text-white&rdquo; />
                            )}
                          </div>

                          <div className=&ldquo;flex-1 min-w-0&rdquo;>
                            <div className=&ldquo;text-sm font-medium truncate&rdquo;>
                              {lesson.title}
                            </div>
                            <div className=&ldquo;flex items-center gap-2 text-xs text-muted-foreground&rdquo;>
                              <Clock className=&ldquo;h-3 w-3&rdquo; />
                              {lesson.duration}
                              {lesson.type === &ldquo;quiz&rdquo; && (
                                <Badge
                                  variant=&ldquo;outline&rdquo;
                                  className=&ldquo;text-xs py-0&rdquo;
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
          <div className=&ldquo;fixed right-0 top-1/2 -translate-y-1/2 z-10&rdquo;>
            <Button
              variant=&ldquo;outline&rdquo;
              size=&ldquo;sm&rdquo;
              onClick={() => setSidebarCollapsed(false)}
              className=&ldquo;rounded-l-lg rounded-r-none border-r-0 bg-white shadow-lg&rdquo;
            >
              <ChevronLeft className=&ldquo;h-4 w-4&rdquo; />
            </Button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className=&ldquo;fixed inset-0 bg-black/50 flex items-center justify-center z-50&rdquo;>
          <Card className=&ldquo;max-w-md mx-4&rdquo;>
            <CardHeader className=&ldquo;text-center&rdquo;>
              <Award className=&ldquo;h-16 w-16 text-yellow-500 mx-auto mb-4&rdquo; />
              <CardTitle>¡Felicitaciones!</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;text-center space-y-4&rdquo;>
              <p>
                Has completado exitosamente el curso{&ldquo; &rdquo;}
                <strong>{course.title}</strong>
              </p>
              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Tu certificado está listo para descargar
              </p>
              <div className=&ldquo;flex gap-2&rdquo;>
                <Button className=&ldquo;flex-1&rdquo;>
                  <Download className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Descargar certificado
                </Button>
                <Button
                  variant=&ldquo;outline&rdquo;
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
