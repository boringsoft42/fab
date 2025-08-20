"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  User, 
  Play,
  CheckCircle,
  Award,
  Target,
  Loader2,
  Lock,
  Video,
  FileText,
  Download,
  ChevronRight,
  ChevronDown,
  Star,
  MessageSquare,
  Share2,
  Bookmark
} from "lucide-react";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useQuizzes } from "@/hooks/useQuizzes";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { QuizComponent } from "@/components/courses/QuizComponent";
import { QuizSelector } from "@/components/courses/QuizSelector";
import { LessonResources } from "@/components/courses/LessonResources";
import { apiCall } from "@/lib/api";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'VIDEO' | 'TEXT' | 'QUIZ' | 'EXERCISE' | 'DOCUMENT';
  videoUrl?: string;
  duration: number;
  orderIndex: number;
  isRequired: boolean;
  isPreview: boolean;
  attachments?: any;
  resources?: any[];
  quizzes?: any[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: number;
  isLocked: boolean;
  prerequisites: string[];
  hasCertificate: boolean;
  lessons: Lesson[];
}

export default function CourseLearningPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params.enrollmentId as string;
  
  const { getEnrollmentById, getEnrollmentForLearning } = useCourseEnrollments();
  const { completeLesson, updateVideoProgress, getEnrollmentProgress } = useCourseProgress(enrollmentId);
  const { getQuizByLessonId } = useQuizzes();
  
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado del curso
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showQuizSelector, setShowQuizSelector] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        console.log('🔍 CourseLearningPage: Loading enrollment with ID:', enrollmentId);
        
        // Intentar cargar datos completos para aprendizaje primero
        let enrollmentData = await getEnrollmentForLearning(enrollmentId);
        
        // Si no se obtuvieron datos completos, usar el método normal como fallback
        if (!enrollmentData) {
          console.log('🔍 CourseLearningPage: Fallback to normal enrollment endpoint');
          enrollmentData = await getEnrollmentById(enrollmentId);
        }
        
        console.log('🔍 CourseLearningPage: Final enrollment data:', enrollmentData);
        
        if (!enrollmentData) {
          throw new Error('No se encontró la inscripción al curso');
        }
        
        // Verificar si las lecciones tienen resources y quizzes
        const needsResourcesAndQuizzes = enrollmentData.course?.modules?.some(
          (module: any) => module.lessons?.some(
            (lesson: any) => lesson.resources === undefined || lesson.quizzes === undefined
          )
        );
        
        if (needsResourcesAndQuizzes) {
          console.log('🔍 CourseLearningPage: Loading resources and quizzes separately...');
          
          // Cargar resources y quizzes para cada lección
          for (const module of enrollmentData.course.modules || []) {
            for (const lesson of module.lessons || []) {
              try {
                // Cargar recursos si no existen
                if (lesson.resources === undefined) {
                  const resourcesResponse = await apiCall(`/lesson/${lesson.id}/resources`);
                  lesson.resources = resourcesResponse.resources || [];
                }
                
                // Cargar quizzes si no existen
                if (lesson.quizzes === undefined) {
                  const quizzesResponse = await apiCall(`/lesson/${lesson.id}/quizzes`);
                  lesson.quizzes = quizzesResponse.quizzes || [];
                }
              } catch (err) {
                console.warn(`Failed to load additional data for lesson ${lesson.id}:`, err);
                // Asignar arrays vacíos si falla la carga
                if (lesson.resources === undefined) lesson.resources = [];
                if (lesson.quizzes === undefined) lesson.quizzes = [];
              }
            }
          }
        }
        
        setEnrollment(enrollmentData);
        
        // Debug: Log de la estructura de datos
        console.log('🔍 CourseLearningPage: Final course structure:', {
          course: enrollmentData.course,
          modules: enrollmentData.course?.modules,
          firstModule: enrollmentData.course?.modules?.[0],
          firstLesson: enrollmentData.course?.modules?.[0]?.lessons?.[0],
          lessonResources: enrollmentData.course?.modules?.[0]?.lessons?.[0]?.resources,
          lessonQuizzes: enrollmentData.course?.modules?.[0]?.lessons?.[0]?.quizzes
        });
        
        // Cargar progreso del curso
        const progressData = await getEnrollmentProgress();
        if (progressData) {
          setCourseProgress(progressData);
          
          // Actualizar el progreso de lecciones
          const lessonProgressMap: Record<string, boolean> = {};
          progressData.modules.forEach((module: any) => {
            module.lessons.forEach((lesson: any) => {
              lessonProgressMap[lesson.id] = lesson.isCompleted;
            });
          });
          setLessonProgress(lessonProgressMap);
        }
        
        // Seleccionar el primer módulo y lección por defecto
        if (enrollmentData.course?.modules?.length > 0) {
          const firstModule = enrollmentData.course.modules[0];
          setSelectedModule(firstModule);
          
          if (firstModule.lessons?.length > 0) {
            setSelectedLesson(firstModule.lessons[0]);
          }
          
          // Expandir el primer módulo
          setExpandedModules(new Set([firstModule.id]));
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el curso';
        setError(errorMessage);
        console.error('Error loading course:', err);
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      loadCourseData();
    }
  }, [enrollmentId]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (module: Module, lesson: Lesson) => {
    console.log('🔍 selectLesson: Selected lesson data:', {
      lesson,
      resources: lesson.resources,
      quizzes: lesson.quizzes,
      attachments: lesson.attachments
    });
    
    setSelectedModule(module);
    setSelectedLesson(lesson);
    
    // Expandir el módulo si no está expandido
    if (!expandedModules.has(module.id)) {
      setExpandedModules(new Set([...expandedModules, module.id]));
    }
  };

  const navigateToNextLesson = () => {
    if (!courseProgress?.nextLesson) return;
    
    // Encontrar el módulo y lección siguiente
    const nextModule = enrollment.course.modules.find((m: any) => m.id === courseProgress.nextLesson.moduleId);
    const nextLesson = nextModule?.lessons.find((l: any) => l.id === courseProgress.nextLesson.id);
    
    if (nextModule && nextLesson) {
      selectLesson(nextModule, nextLesson);
    }
  };

  const navigateToPreviousLesson = () => {
    if (!selectedLesson || !selectedModule) return;
    
    // Encontrar la lección anterior
    const currentModuleIndex = enrollment.course.modules.findIndex((m: any) => m.id === selectedModule.id);
    const currentLessonIndex = selectedModule.lessons.findIndex((l: any) => l.id === selectedLesson.id);
    
    if (currentLessonIndex > 0) {
      // Lección anterior en el mismo módulo
      const previousLesson = selectedModule.lessons[currentLessonIndex - 1];
      selectLesson(selectedModule, previousLesson);
    } else if (currentModuleIndex > 0) {
      // Última lección del módulo anterior
      const previousModule = enrollment.course.modules[currentModuleIndex - 1];
      if (previousModule.lessons.length > 0) {
        const lastLesson = previousModule.lessons[previousModule.lessons.length - 1];
        selectLesson(previousModule, lastLesson);
      }
    }
  };

  const getLessonIcon = (contentType: string) => {
    switch (contentType) {
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      case 'QUIZ':
        return <Target className="h-4 w-4" />;
      case 'EXERCISE':
        return <BookOpen className="h-4 w-4" />;
      case 'DOCUMENT':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return lessonProgress[lessonId] || false;
  };

  const handleLessonComplete = async () => {
    if (!selectedLesson) return;
    
    try {
      console.log('🔍 CourseLearningPage: Completing lesson:', selectedLesson.id);
      
      const result = await completeLesson(
        selectedLesson.id, 
        selectedLesson.duration * 60, // Tiempo en segundos
        1.0 // Video progress completo
      );
      
      if (result) {
        // Actualizar progreso local
        setLessonProgress(prev => ({
          ...prev,
          [selectedLesson.id]: true
        }));
        
        // Actualizar progreso del curso
        if (courseProgress) {
          setCourseProgress(prev => ({
            ...prev,
            enrollment: {
              ...prev.enrollment,
              progress: result.courseProgress.progress
            },
            course: {
              ...prev.course,
              progress: result.courseProgress.progress,
              completedLessons: result.courseProgress.completedLessons
            }
          }));
        }
        
        console.log('🔍 CourseLearningPage: Lesson completed successfully:', result);
        
        // TODO: Mostrar notificación de éxito
        // TODO: Si hay siguiente lección, sugerir navegar a ella
        if (result.nextLesson) {
          console.log('🔍 CourseLearningPage: Next lesson available:', result.nextLesson);
        }
      }
    } catch (error) {
      console.error('Error al marcar lección como completada:', error);
    }
  };

  const handleVideoProgress = async (progress: number) => {
    if (!selectedLesson) return;
    
    try {
      console.log('🔍 CourseLearningPage: Updating video progress:', progress);
      
      const result = await updateVideoProgress(
        selectedLesson.id, 
        progress, 
        selectedLesson.duration * 60
      );
      
      if (result) {
        console.log('🔍 CourseLearningPage: Video progress updated:', result);
      }
    } catch (error) {
      console.error('Error al actualizar progreso del video:', error);
    }
  };

  const handleQuizComplete = (results: any) => {
    console.log('🔍 CourseLearningPage: Quiz completed:', results);
    setShowQuiz(false);
    setCurrentQuiz(null);
    
    // Si aprobó el quiz, marcar la lección como completada
    if (results.passed && selectedLesson) {
      console.log('🔍 CourseLearningPage: Quiz passed, marking lesson as completed');
      handleLessonComplete();
    } else {
      console.log('🔍 CourseLearningPage: Quiz failed, lesson not marked as completed');
    }
  };

  const startQuiz = async () => {
    if (!selectedLesson) {
      console.warn('No hay lección seleccionada');
      return;
    }
    
    // Si hay múltiples quizzes, mostrar el selector
    if (selectedLesson.quizzes && selectedLesson.quizzes.length > 1) {
      setShowQuizSelector(true);
      return;
    }
    
    try {
      // Intentar cargar el quiz desde el backend
      const quiz = await getQuizByLessonId(selectedLesson.id);
      
      if (quiz) {
        setCurrentQuiz(quiz);
        setShowQuiz(true);
      } else if (selectedLesson.quizzes && selectedLesson.quizzes.length > 0) {
        // Si no hay quiz en el backend, usar el primer quiz del array
        setCurrentQuiz(selectedLesson.quizzes[0]);
        setShowQuiz(true);
      } else {
        console.warn('No hay quiz disponible para esta lección');
        // TODO: Mostrar notificación al usuario
      }
    } catch (error) {
      console.error('Error al cargar el quiz:', error);
      // TODO: Mostrar notificación de error al usuario
    }
  };

  const selectQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
    setShowQuizSelector(false);
    setShowQuiz(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Error al cargar el curso'}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { course } = enrollment;

  if (showQuizSelector && selectedLesson?.quizzes) {
    return (
      <QuizSelector
        quizzes={selectedLesson.quizzes}
        enrollmentId={enrollmentId}
        onSelectQuiz={selectQuiz}
        onCancel={() => setShowQuizSelector(false)}
      />
    );
  }

  if (showQuiz && currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setShowQuiz(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Lección
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{currentQuiz.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Evalúa tu conocimiento
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <QuizComponent
          quiz={currentQuiz}
          enrollmentId={enrollmentId}
          onComplete={handleQuizComplete}
          onCancel={() => setShowQuiz(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
                         <div>
               <h1 className="text-lg font-semibold">{course.title}</h1>
               <div className="flex items-center gap-4">
                 <p className="text-sm text-muted-foreground">
                   Progreso: {courseProgress?.course?.progress || enrollment.progress || 0}%
                 </p>
                 {courseProgress?.course && (
                   <p className="text-sm text-muted-foreground">
                     {courseProgress.course.completedLessons} de {courseProgress.course.totalLessons} lecciones
                   </p>
                 )}
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comentarios
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Módulos */}
        <div className={`bg-white border-r transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Contenido del Curso</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            
            {!sidebarCollapsed && (
              <div className="space-y-2">
                {course.modules?.map((module: Module) => (
                  <div key={module.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleModuleExpansion(module.id)}
                      className="w-full p-3 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">Módulo {module.orderIndex}</p>
                          <p className="text-xs text-muted-foreground">{module.title}</p>
                        </div>
                      </div>
                                             <div className="flex items-center gap-2">
                         <span className="text-xs text-muted-foreground">
                           {module.lessons?.length || 0} lecciones
                         </span>
                         {courseProgress?.modules?.find((m: any) => m.id === module.id)?.progress > 0 && (
                           <span className="text-xs text-green-600 font-medium">
                             {Math.round(courseProgress.modules.find((m: any) => m.id === module.id)?.progress)}%
                           </span>
                         )}
                         {expandedModules.has(module.id) ? (
                           <ChevronDown className="h-4 w-4" />
                         ) : (
                           <ChevronRight className="h-4 w-4" />
                         )}
                       </div>
                    </button>
                    
                    {expandedModules.has(module.id) && (
                      <div className="border-t bg-gray-50">
                        {module.lessons?.map((lesson: Lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => selectLesson(module, lesson)}
                            className={`w-full p-3 text-left hover:bg-gray-100 flex items-center gap-3 ${
                              selectedLesson?.id === lesson.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {getLessonIcon(lesson.contentType)}
                              <div className="text-left">
                                <p className="text-sm font-medium">{lesson.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDuration(lesson.duration)}
                                </p>
                              </div>
                            </div>
                                                         <div className="ml-auto flex items-center gap-2">
                               {isLessonCompleted(lesson.id) && (
                                 <CheckCircle className="h-4 w-4 text-green-600" />
                               )}
                               {courseProgress?.modules?.find((m: any) => m.id === module.id)?.lessons?.find((l: any) => l.id === lesson.id)?.timeSpent > 0 && (
                                 <span className="text-xs text-muted-foreground">
                                   {Math.floor(courseProgress.modules.find((m: any) => m.id === module.id)?.lessons?.find((l: any) => l.id === lesson.id)?.timeSpent / 60)}m
                                 </span>
                               )}
                             </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col">
          {selectedLesson ? (
            <>
              {/* Reproductor de Video */}
              <div className="bg-black aspect-video">
                                 {selectedLesson.contentType === 'VIDEO' && selectedLesson.videoUrl ? (
                   <VideoPlayer
                     src={selectedLesson.videoUrl}
                     title={selectedLesson.title}
                     onProgress={handleVideoProgress}
                     onTimeUpdate={(currentTime) => {
                       console.log('Video time:', currentTime);
                     }}
                   />
                 ) : (
                   <div className="flex items-center justify-center h-full text-white">
                     <div className="text-center">
                       <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                       <p>No hay video disponible para esta lección</p>
                     </div>
                   </div>
                 )}
              </div>

              {/* Información de la Lección */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    {/* Header de la lección */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{selectedLesson.contentType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(selectedLesson.duration)}
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold mb-2">{selectedLesson.title}</h1>
                      <p className="text-muted-foreground">{selectedLesson.description}</p>
                    </div>

                    {/* Contenido de la lección */}
                    <Card className="mb-6">
                      <CardContent className="p-6">
                        <div className="prose max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                        </div>
                      </CardContent>
                    </Card>

                                         {/* Recursos y Adjuntos */}
                    {(selectedLesson.resources && selectedLesson.resources.length > 0) ? (
                      <LessonResources
                        resources={selectedLesson.resources}
                        lessonTitle={selectedLesson.title}
                      />
                    ) : (
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Recursos de la Lección
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-center py-4">
                            No hay recursos disponibles para esta lección.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                                         {/* Navegación entre lecciones */}
                     <div className="flex items-center justify-between pt-6 border-t">
                       <Button 
                         variant="outline" 
                         onClick={navigateToPreviousLesson}
                         disabled={!selectedLesson || !selectedModule}
                       >
                         <ArrowLeft className="h-4 w-4 mr-2" />
                         Lección Anterior
                       </Button>
                       
                       <div className="flex items-center gap-4">
                         <Button variant="outline">
                           <MessageSquare className="h-4 w-4 mr-2" />
                           Comentarios
                         </Button>
                         {selectedLesson.quizzes && selectedLesson.quizzes.length > 0 ? (
                           <Button variant="outline" onClick={startQuiz}>
                             <Target className="h-4 w-4 mr-2" />
                             Tomar Quiz ({selectedLesson.quizzes.length})
                           </Button>
                         ) : (
                           <Button variant="outline" disabled>
                             <Target className="h-4 w-4 mr-2" />
                             Sin Quiz
                           </Button>
                         )}
                         <Button onClick={handleLessonComplete}>
                           <CheckCircle className="h-4 w-4 mr-2" />
                           Marcar como Completada
                         </Button>
                       </div>
                       
                       <Button 
                         variant="outline" 
                         onClick={navigateToNextLesson}
                         disabled={!courseProgress?.nextLesson}
                       >
                         Siguiente Lección
                         <ChevronRight className="h-4 w-4 ml-2" />
                       </Button>
                     </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Selecciona una lección</h2>
                <p className="text-muted-foreground">
                  Elige una lección del menú lateral para comenzar a aprender
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
