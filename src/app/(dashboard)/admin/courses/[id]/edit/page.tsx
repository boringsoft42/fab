&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams, useRouter } from &ldquo;next/navigation&rdquo;;
import { CourseCategory, CourseLevel } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Label } from &ldquo;@/components/ui/label&rdquo;;
import { Textarea } from &ldquo;@/components/ui/textarea&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from &ldquo;@/components/ui/collapsible&rdquo;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from &ldquo;@/components/ui/dialog&rdquo;;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from &ldquo;@/components/ui/dropdown-menu&rdquo;;
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  VideoIcon,
  FileText,
  HelpCircle,
  BookOpen,
  PlayCircle,
  ChevronDown,
  ChevronRight,
  Users,
  Clock,
  Star,
  Award,
} from &ldquo;lucide-react&rdquo;;

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  lessons: Lesson[];
  isLocked: boolean;
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: &ldquo;video&rdquo; | &ldquo;reading&rdquo; | &ldquo;quiz&rdquo;;
  content: Record<string, unknown>;
  duration: number;
  order: number;
  isPreview: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  allowedAttempts: number;
  showCorrectAnswers: boolean;
}

interface Question {
  id: string;
  type: &ldquo;multiple_choice&rdquo; | &ldquo;true_false&rdquo; | &ldquo;short_answer&rdquo;;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export default function EditCoursePage() {
  const courseId = params.id as string;

  const [activeTab, setActiveTab] = useState(&ldquo;content&rdquo;);
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [courseData] = useState({
    title: &ldquo;Habilidades Laborales Básicas&rdquo;,
    description:
      &ldquo;Curso completo sobre competencias fundamentales para el trabajo&rdquo;,
    category: CourseCategory.SOFT_SKILLS,
    level: CourseLevel.BEGINNER,
    duration: 8,
    totalLessons: 15,
    rating: 4.8,
    studentCount: 2847,
    isActive: true,
  });

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    // Mock data for demonstration
    const mockModules: Module[] = [
      {
        id: &ldquo;mod-1&rdquo;,
        title: &ldquo;Introducción a las Habilidades Laborales&rdquo;,
        description: &ldquo;Conceptos fundamentales y bienvenida al curso&rdquo;,
        order: 1,
        duration: 45,
        isLocked: false,
        lessons: [
          {
            id: &ldquo;lesson-1&rdquo;,
            moduleId: &ldquo;mod-1&rdquo;,
            title: &ldquo;Bienvenida al curso&rdquo;,
            description: &ldquo;Video de introducción y bienvenida&rdquo;,
            type: &ldquo;video&rdquo;,
            content: { videoUrl: &ldquo;https://example.com/video1.mp4&rdquo; },
            duration: 5,
            order: 1,
            isPreview: true,
          },
          {
            id: &ldquo;lesson-2&rdquo;,
            moduleId: &ldquo;mod-1&rdquo;,
            title: &ldquo;¿Qué son las habilidades laborales?&rdquo;,
            description: &ldquo;Conceptos básicos sobre habilidades en el trabajo&rdquo;,
            type: &ldquo;video&rdquo;,
            content: { videoUrl: &ldquo;https://example.com/video2.mp4&rdquo; },
            duration: 8,
            order: 2,
            isPreview: false,
          },
          {
            id: &ldquo;quiz-1&rdquo;,
            moduleId: &ldquo;mod-1&rdquo;,
            title: &ldquo;Evaluación: Conceptos básicos&rdquo;,
            description: &ldquo;Quiz sobre los conceptos fundamentales&rdquo;,
            type: &ldquo;quiz&rdquo;,
            content: {
              questions: [
                {
                  id: &ldquo;q1&rdquo;,
                  type: &ldquo;multiple_choice&rdquo;,
                  question:
                    &ldquo;¿Cuáles son las habilidades blandas más importantes?&rdquo;,
                  options: [
                    &ldquo;Comunicación&rdquo;,
                    &ldquo;Programación&rdquo;,
                    &ldquo;Matemáticas&rdquo;,
                    &ldquo;Diseño&rdquo;,
                  ],
                  correctAnswer: &ldquo;Comunicación&rdquo;,
                  explanation:
                    &ldquo;La comunicación es fundamental en cualquier trabajo&rdquo;,
                  points: 10,
                },
              ],
            },
            duration: 10,
            order: 3,
            isPreview: false,
          },
        ],
      },
    ];
    setModules(mockModules);
    setExpandedModules(new Set([&ldquo;mod-1&rdquo;]));
  };

  const handleAddModule = (moduleData: Partial<Module>) => {
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: moduleData.title || &ldquo;&rdquo;,
      description: moduleData.description || &ldquo;&rdquo;,
      order: modules.length + 1,
      duration: 0,
      lessons: [],
      isLocked: false,
      ...moduleData,
    };
    setModules([...modules, newModule]);
    setExpandedModules((prev) => new Set([...prev, newModule.id]));
  };

  const handleAddLesson = (moduleId: string, lessonData: Partial<Lesson>) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId,
      title: lessonData.title || &ldquo;&rdquo;,
      description: lessonData.description || &ldquo;&rdquo;,
      type: lessonData.type || &ldquo;video&rdquo;,
      content: lessonData.content || {},
      duration: lessonData.duration || 0,
      order: module.lessons.length + 1,
      isPreview: false,
      ...lessonData,
    };

    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  };

  const handleDeleteModule = (moduleId: string) => {
    if (
      window.confirm(
        &ldquo;¿Estás seguro de eliminar este módulo y todas sus lecciones?&rdquo;
      )
    ) {
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
    }
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (window.confirm(&ldquo;¿Estás seguro de eliminar esta lección?&rdquo;)) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case &ldquo;video&rdquo;:
        return <VideoIcon className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;quiz&rdquo;:
        return <HelpCircle className=&ldquo;h-4 w-4&rdquo; />;
      case &ldquo;reading&rdquo;:
        return <FileText className=&ldquo;h-4 w-4&rdquo; />;
      default:
        return <BookOpen className=&ldquo;h-4 w-4&rdquo; />;
    }
  };

  const getTotalDuration = () => {
    return modules.reduce(
      (total, mod) =>
        total +
        mod.lessons.reduce(
          (moduleTotal, lesson) => moduleTotal + lesson.duration,
          0
        ),
      0
    );
  };

  const getTotalLessons = () => {
    return modules.reduce((total, mod) => total + mod.lessons.length, 0);
  };

  return (
    <div className=&ldquo;container mx-auto p-6 max-w-6xl&rdquo;>
      {/* Header */}
      <div className=&ldquo;flex items-center justify-between mb-6&rdquo;>
        <div className=&ldquo;flex items-center gap-4&rdquo;>
          <Button variant=&ldquo;ghost&rdquo; onClick={() => router.back()}>
            <ArrowLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Volver
          </Button>
          <div>
            <h1 className=&ldquo;text-2xl font-bold&rdquo;>{courseData.title}</h1>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              Gestiona el contenido y estructura del curso
            </p>
          </div>
        </div>

        <div className=&ldquo;flex gap-2&rdquo;>
          <Button variant=&ldquo;outline&rdquo; asChild>
            <a href={`/courses/${courseId}`} target=&ldquo;_blank&rdquo;>
              <Eye className=&ldquo;h-4 w-4 mr-2&rdquo; />
              Vista Previa
            </a>
          </Button>
          <Button>
            <Save className=&ldquo;h-4 w-4 mr-2&rdquo; />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4 mb-6&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <BookOpen className=&ldquo;h-4 w-4 text-blue-600&rdquo; />
              <div>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Módulos</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{modules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <PlayCircle className=&ldquo;h-4 w-4 text-green-600&rdquo; />
              <div>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Lecciones</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>{getTotalLessons()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Clock className=&ldquo;h-4 w-4 text-orange-600&rdquo; />
              <div>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Duración</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>
                  {Math.floor(getTotalDuration() / 60)}h{&ldquo; &rdquo;}
                  {getTotalDuration() % 60}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className=&ldquo;p-4&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Users className=&ldquo;h-4 w-4 text-purple-600&rdquo; />
              <div>
                <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Estudiantes</p>
                <p className=&ldquo;text-2xl font-bold&rdquo;>
                  {courseData.studentCount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className=&ldquo;space-y-6&rdquo;
      >
        <TabsList>
          <TabsTrigger value=&ldquo;content&rdquo;>Contenido del Curso</TabsTrigger>
          <TabsTrigger value=&ldquo;settings&rdquo;>Configuración</TabsTrigger>
          <TabsTrigger value=&ldquo;analytics&rdquo;>Analíticas</TabsTrigger>
        </TabsList>

        {/* Content Management Tab */}
        <TabsContent value=&ldquo;content&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <CardTitle>Estructura del Curso</CardTitle>
                <Button onClick={() => setShowModuleDialog(true)}>
                  <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Agregar Módulo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4&rdquo;>
                {modules.map((module, moduleIndex) => (
                  <div key={module.id} className=&ldquo;border rounded-lg&rdquo;>
                    <Collapsible
                      open={expandedModules.has(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className=&ldquo;flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer&rdquo;>
                          <div className=&ldquo;flex items-center gap-3&rdquo;>
                            {expandedModules.has(module.id) ? (
                              <ChevronDown className=&ldquo;h-4 w-4&rdquo; />
                            ) : (
                              <ChevronRight className=&ldquo;h-4 w-4&rdquo; />
                            )}
                            <div className=&ldquo;w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600&rdquo;>
                              {moduleIndex + 1}
                            </div>
                            <div>
                              <h4 className=&ldquo;font-medium&rdquo;>{module.title}</h4>
                              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                                {module.lessons.length} lecciones •{&ldquo; &rdquo;}
                                {Math.floor(
                                  module.lessons.reduce(
                                    (total, lesson) => total + lesson.duration,
                                    0
                                  ) / 60
                                )}
                                h
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                                <MoreHorizontal className=&ldquo;h-4 w-4&rdquo; />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingModule(module);
                                  setShowModuleDialog(true);
                                }}
                              >
                                <Edit className=&ldquo;h-4 w-4 mr-2&rdquo; />
                                Editar Módulo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteModule(module.id)}
                                className=&ldquo;text-red-600&rdquo;
                              >
                                <Trash2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
                                Eliminar Módulo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className=&ldquo;px-4 pb-4&rdquo;>
                          <div className=&ldquo;ml-8 space-y-2&rdquo;>
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className=&ldquo;flex items-center justify-between p-3 bg-gray-50 rounded-lg&rdquo;
                              >
                                <div className=&ldquo;flex items-center gap-3&rdquo;>
                                  <div className=&ldquo;w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs&rdquo;>
                                    {lessonIndex + 1}
                                  </div>
                                  {getLessonIcon(lesson.type)}
                                  <div>
                                    <p className=&ldquo;font-medium text-sm&rdquo;>
                                      {lesson.title}
                                    </p>
                                    <p className=&ldquo;text-xs text-muted-foreground&rdquo;>
                                      {lesson.type === &ldquo;video&rdquo;
                                        ? &ldquo;Video&rdquo;
                                        : lesson.type === &ldquo;quiz&rdquo;
                                          ? &ldquo;Examen&rdquo;
                                          : &ldquo;Lectura&rdquo;}{&ldquo; &rdquo;}
                                      • {lesson.duration} min
                                      {lesson.isPreview && (
                                        <Badge
                                          variant=&ldquo;secondary&rdquo;
                                          className=&ldquo;ml-2 text-xs&rdquo;
                                        >
                                          Vista previa
                                        </Badge>
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant=&ldquo;ghost&rdquo; size=&ldquo;sm&rdquo;>
                                      <MoreHorizontal className=&ldquo;h-4 w-4&rdquo; />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingLesson(lesson);
                                        setShowLessonDialog(true);
                                      }}
                                    >
                                      <Edit className=&ldquo;h-4 w-4 mr-2&rdquo; />
                                      Editar Lección
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteLesson(module.id, lesson.id)
                                      }
                                      className=&ldquo;text-red-600&rdquo;
                                    >
                                      <Trash2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
                                      Eliminar Lección
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ))}

                            <Button
                              variant=&ldquo;outline&rdquo;
                              onClick={() => {
                                setEditingLesson({
                                  moduleId: module.id,
                                } as Lesson);
                                setShowLessonDialog(true);
                              }}
                              className=&ldquo;w-full mt-2&rdquo;
                            >
                              <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                              Agregar Lección
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}

                {modules.length === 0 && (
                  <div className=&ldquo;text-center py-12 border-2 border-dashed border-gray-300 rounded-lg&rdquo;>
                    <BookOpen className=&ldquo;h-12 w-12 text-gray-400 mx-auto mb-4&rdquo; />
                    <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                      Sin contenido
                    </h3>
                    <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
                      Comienza agregando el primer módulo de tu curso
                    </p>
                    <Button onClick={() => setShowModuleDialog(true)}>
                      <Plus className=&ldquo;h-4 w-4 mr-2&rdquo; />
                      Agregar Primer Módulo
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value=&ldquo;settings&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                Las configuraciones básicas del curso se pueden editar desde la
                página de información general.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value=&ldquo;analytics&rdquo; className=&ldquo;space-y-6&rdquo;>
          <Card>
            <CardHeader>
              <CardTitle>Analíticas del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-4&rdquo;>
                <div className=&ldquo;text-center p-4 border rounded-lg&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>78%</div>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Tasa de Finalización
                  </p>
                </div>
                <div className=&ldquo;text-center p-4 border rounded-lg&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-green-600&rdquo;>4.8</div>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Calificación Promedio
                  </p>
                </div>
                <div className=&ldquo;text-center p-4 border rounded-lg&rdquo;>
                  <div className=&ldquo;text-2xl font-bold text-purple-600&rdquo;>
                    2,847
                  </div>
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    Estudiantes Inscritos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Dialog */}
      <ModuleDialog
        isOpen={showModuleDialog}
        onClose={() => {
          setShowModuleDialog(false);
          setEditingModule(null);
        }}
        onSave={handleAddModule}
        module={editingModule}
      />

      {/* Lesson Dialog */}
      <LessonDialog
        isOpen={showLessonDialog}
        onClose={() => {
          setShowLessonDialog(false);
          setEditingLesson(null);
        }}
        onSave={(lessonData) => {
          if (editingLesson?.moduleId) {
            handleAddLesson(editingLesson.moduleId, lessonData);
          }
        }}
        lesson={editingLesson}
      />
    </div>
  );
}

// Module Dialog Component
function ModuleDialog({
  isOpen,
  onClose,
  onSave,
  module,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Module>) => void;
  module?: Module | null;
}) {
  const [title, setTitle] = useState(module?.title || &ldquo;&rdquo;);
  const [description, setDescription] = useState(module?.description || &ldquo;&rdquo;);

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, description });
      onClose();
      setTitle(&ldquo;&rdquo;);
      setDescription(&ldquo;&rdquo;);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {module ? &ldquo;Editar Módulo&rdquo; : &ldquo;Agregar Nuevo Módulo&rdquo;}
          </DialogTitle>
        </DialogHeader>
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;space-y-2&rdquo;>
            <Label htmlFor=&ldquo;moduleTitle&rdquo;>Título del Módulo</Label>
            <Input
              id=&ldquo;moduleTitle&rdquo;
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=&ldquo;Ej: Introducción a las Habilidades Laborales&rdquo;
            />
          </div>
          <div className=&ldquo;space-y-2&rdquo;>
            <Label htmlFor=&ldquo;moduleDescription&rdquo;>Descripción</Label>
            <Textarea
              id=&ldquo;moduleDescription&rdquo;
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=&ldquo;Descripción del contenido del módulo&rdquo;
              rows={3}
            />
          </div>
          <div className=&ldquo;flex justify-end gap-2&rdquo;>
            <Button variant=&ldquo;outline&rdquo; onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {module ? &ldquo;Actualizar&rdquo; : &ldquo;Crear&rdquo;} Módulo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Lesson Dialog Component
function LessonDialog({
  isOpen,
  onClose,
  onSave,
  lesson,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Lesson>) => void;
  lesson?: Lesson | null;
}) {
  const [title, setTitle] = useState(lesson?.title || &ldquo;&rdquo;);
  const [description, setDescription] = useState(lesson?.description || &ldquo;&rdquo;);
  const [type, setType] = useState<&ldquo;video&rdquo; | &ldquo;reading&rdquo; | &ldquo;quiz&rdquo;>(
    lesson?.type || &ldquo;video&rdquo;
  );
  const [videoUrl, setVideoUrl] = useState(&ldquo;&rdquo;);
  const [readingContent, setReadingContent] = useState(&ldquo;&rdquo;);

  const handleSave = () => {
    if (title.trim()) {
      const content =
        type === &ldquo;video&rdquo;
          ? { videoUrl }
          : type === &ldquo;reading&rdquo;
            ? { text: readingContent }
            : { questions: [] };

      onSave({
        title,
        description,
        type,
        duration,
        content,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=&ldquo;max-w-2xl&rdquo;>
        <DialogHeader>
          <DialogTitle>
            {lesson?.id ? &ldquo;Editar Lección&rdquo; : &ldquo;Agregar Nueva Lección&rdquo;}
          </DialogTitle>
        </DialogHeader>
        <div className=&ldquo;space-y-4&rdquo;>
          <div className=&ldquo;grid grid-cols-2 gap-4&rdquo;>
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;lessonTitle&rdquo;>Título de la Lección</Label>
              <Input
                id=&ldquo;lessonTitle&rdquo;
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=&ldquo;Título de la lección&rdquo;
              />
            </div>
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;lessonType&rdquo;>Tipo de Lección</Label>
              <Select
                value={type}
                onValueChange={(value: &ldquo;video&rdquo; | &ldquo;reading&rdquo; | &ldquo;quiz&rdquo;) =>
                  setType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;video&rdquo;>Video</SelectItem>
                  <SelectItem value=&ldquo;reading&rdquo;>Lectura</SelectItem>
                  <SelectItem value=&ldquo;quiz&rdquo;>Examen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=&ldquo;space-y-2&rdquo;>
            <Label htmlFor=&ldquo;lessonDescription&rdquo;>Descripción</Label>
            <Textarea
              id=&ldquo;lessonDescription&rdquo;
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=&ldquo;Descripción de la lección&rdquo;
              rows={2}
            />
          </div>

          <div className=&ldquo;space-y-2&rdquo;>
            <Label htmlFor=&ldquo;duration&rdquo;>Duración (minutos)</Label>
            <Input
              id=&ldquo;duration&rdquo;
              type=&ldquo;number&rdquo;
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min=&ldquo;1&rdquo;
            />
          </div>

          {type === &ldquo;video&rdquo; && (
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;videoUrl&rdquo;>URL del Video</Label>
              <Input
                id=&ldquo;videoUrl&rdquo;
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder=&ldquo;https://ejemplo.com/video.mp4&rdquo;
              />
            </div>
          )}

          {type === &ldquo;reading&rdquo; && (
            <div className=&ldquo;space-y-2&rdquo;>
              <Label htmlFor=&ldquo;readingContent&rdquo;>Contenido de Lectura</Label>
              <Textarea
                id=&ldquo;readingContent&rdquo;
                value={readingContent}
                onChange={(e) => setReadingContent(e.target.value)}
                placeholder=&ldquo;Contenido del material de lectura...&rdquo;
                rows={4}
              />
            </div>
          )}

          {type === &ldquo;quiz&rdquo; && (
            <div className=&ldquo;p-4 bg-blue-50 rounded-lg&rdquo;>
              <p className=&ldquo;text-sm text-blue-700&rdquo;>
                El constructor de exámenes se abrirá después de crear la
                lección.
              </p>
            </div>
          )}

          <div className=&ldquo;flex justify-end gap-2&rdquo;>
            <Button variant=&ldquo;outline&rdquo; onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {lesson?.id ? &ldquo;Actualizar&rdquo; : &ldquo;Crear&rdquo;} Lección
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
