&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams, useRouter } from &ldquo;next/navigation&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Course, Module } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import {
  Star,
  Clock,
  Users,
  BookOpen,
  Award,
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  Share2,
  Heart,
  Download,
  Globe,
  ChevronDown,
  ChevronRight,
} from &ldquo;lucide-react&rdquo;;
export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setCourse(data.course);
        setModules(data.modules);
      } else {
        console.error(&ldquo;Error loading course:&rdquo;, data);
      }
    } catch (error) {
      console.error(&ldquo;Error fetching course:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins > 0 ? `${mins}m` : &ldquo;&rdquo;}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      soft_skills: &ldquo;Habilidades Blandas&rdquo;,
      basic_competencies: &ldquo;Competencias Básicas&rdquo;,
      job_placement: &ldquo;Inserción Laboral&rdquo;,
      entrepreneurship: &ldquo;Emprendimiento&rdquo;,
      technical_skills: &ldquo;Habilidades Técnicas&rdquo;,
      digital_literacy: &ldquo;Alfabetización Digital&rdquo;,
      communication: &ldquo;Comunicación&rdquo;,
      leadership: &ldquo;Liderazgo&rdquo;,
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: &ldquo;Principiante&rdquo;,
      intermediate: &ldquo;Intermedio&rdquo;,
      advanced: &ldquo;Avanzado&rdquo;,
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-8 bg-gray-200 rounded w-1/4&rdquo; />
          <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-8&rdquo;>
            <div className=&ldquo;lg:col-span-2 space-y-6&rdquo;>
              <div className=&ldquo;h-64 bg-gray-200 rounded&rdquo; />
              <div className=&ldquo;h-6 bg-gray-200 rounded w-3/4&rdquo; />
              <div className=&ldquo;h-4 bg-gray-200 rounded w-full&rdquo; />
              <div className=&ldquo;h-4 bg-gray-200 rounded w-5/6&rdquo; />
            </div>
            <div className=&ldquo;space-y-4&rdquo;>
              <div className=&ldquo;h-32 bg-gray-200 rounded&rdquo; />
              <div className=&ldquo;h-12 bg-gray-200 rounded&rdquo; />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className=&ldquo;container mx-auto p-6 text-center&rdquo;>
        <h1 className=&ldquo;text-2xl font-bold mb-4&rdquo;>Curso no encontrado</h1>
        <Button asChild>
          <Link href=&ldquo;/courses&rdquo;>Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6&rdquo;>
      {/* Breadcrumb */}
      <div className=&ldquo;flex items-center gap-2 mb-6 text-sm text-muted-foreground&rdquo;>
        <Link
          href=&ldquo;/courses&rdquo;
          className=&ldquo;hover:text-foreground flex items-center gap-1&rdquo;
        >
          <ArrowLeft className=&ldquo;h-4 w-4&rdquo; />
          Cursos
        </Link>
        <span>/</span>
        <span className=&ldquo;text-foreground&rdquo;>{course.title}</span>
      </div>

      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-8&rdquo;>
        {/* Main Content */}
        <div className=&ldquo;lg:col-span-2 space-y-6&rdquo;>
          {/* Header */}
          <div>
            <div className=&ldquo;flex items-center gap-2 mb-3&rdquo;>
              <Badge variant=&ldquo;outline&rdquo;>
                {getCategoryLabel(course.category)}
              </Badge>
              <Badge variant=&ldquo;outline&rdquo;>{getLevelLabel(course.level)}</Badge>
              {course.isMandatory && (
                <Badge className=&ldquo;bg-red-500&rdquo;>Obligatorio</Badge>
              )}
              {course.price === 0 && (
                <Badge className=&ldquo;bg-green-500&rdquo;>Gratis</Badge>
              )}
            </div>

            <h1 className=&ldquo;text-3xl font-bold mb-4&rdquo;>{course.title}</h1>

            <p className=&ldquo;text-lg text-muted-foreground mb-6&rdquo;>
              {course.shortDescription}
            </p>

            {/* Course Stats */}
            <div className=&ldquo;flex flex-wrap items-center gap-6 text-sm&rdquo;>
              <div className=&ldquo;flex items-center gap-1&rdquo;>
                <Star className=&ldquo;h-4 w-4 fill-yellow-400 text-yellow-400&rdquo; />
                <span className=&ldquo;font-medium&rdquo;>{course.rating}</span>
                <span className=&ldquo;text-muted-foreground&rdquo;>
                  ({course.studentCount} estudiantes)
                </span>
              </div>
              <div className=&ldquo;flex items-center gap-1&rdquo;>
                <Clock className=&ldquo;h-4 w-4&rdquo; />
                <span>{course.duration} horas</span>
              </div>
              <div className=&ldquo;flex items-center gap-1&rdquo;>
                <BookOpen className=&ldquo;h-4 w-4&rdquo; />
                <span>{course.totalLessons} lecciones</span>
              </div>
              {course.certification && (
                <div className=&ldquo;flex items-center gap-1&rdquo;>
                  <Award className=&ldquo;h-4 w-4&rdquo; />
                  <span>Certificado incluido</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Image/Video */}
          <div className=&ldquo;relative&rdquo;>
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={800}
              height={450}
              className=&ldquo;w-full h-64 md:h-96 object-cover rounded-lg&rdquo;
            />
            {course.videoPreview && (
              <div className=&ldquo;absolute inset-0 flex items-center justify-center&rdquo;>
                <Button size=&ldquo;lg&rdquo; className=&ldquo;rounded-full h-16 w-16&rdquo;>
                  <Play className=&ldquo;h-6 w-6 fill-current&rdquo; />
                </Button>
              </div>
            )}
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue=&ldquo;overview&rdquo; className=&ldquo;w-full&rdquo;>
            <TabsList className=&ldquo;grid w-full grid-cols-4&rdquo;>
              <TabsTrigger value=&ldquo;overview&rdquo;>Descripción</TabsTrigger>
              <TabsTrigger value=&ldquo;curriculum&rdquo;>Temario</TabsTrigger>
              <TabsTrigger value=&ldquo;instructor&rdquo;>Instructor</TabsTrigger>
              <TabsTrigger value=&ldquo;reviews&rdquo;>Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value=&ldquo;overview&rdquo; className=&ldquo;space-y-6&rdquo;>
              <div>
                <h3 className=&ldquo;text-xl font-semibold mb-4&rdquo;>
                  Descripción del curso
                </h3>
                <div className=&ldquo;prose max-w-none&rdquo;>
                  <p className=&ldquo;whitespace-pre-line&rdquo;>{course.description}</p>
                </div>
              </div>

              <div>
                <h3 className=&ldquo;text-xl font-semibold mb-4&rdquo;>
                  Objetivos de aprendizaje
                </h3>
                <ul className=&ldquo;space-y-2&rdquo;>
                  {course.objectives.map((objective, index) => (
                    <li key={index} className=&ldquo;flex items-start gap-2&rdquo;>
                      <CheckCircle className=&ldquo;h-5 w-5 text-green-500 mt-0.5 flex-shrink-0&rdquo; />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className=&ldquo;text-xl font-semibold mb-4&rdquo;>
                  Materiales incluidos
                </h3>
                <ul className=&ldquo;space-y-2&rdquo;>
                  {course.includedMaterials.map((material, index) => (
                    <li key={index} className=&ldquo;flex items-start gap-2&rdquo;>
                      <CheckCircle className=&ldquo;h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0&rdquo; />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className=&ldquo;text-xl font-semibold mb-4&rdquo;>Etiquetas</h3>
                <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant=&ldquo;secondary&rdquo;>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;curriculum&rdquo; className=&ldquo;space-y-4&rdquo;>
              <div>
                <h3 className=&ldquo;text-xl font-semibold mb-4&rdquo;>
                  Contenido del curso
                </h3>
                <div className=&ldquo;space-y-3&rdquo;>
                  {modules.map((module, moduleIndex) => (
                    <Card key={module.id}>
                      <CardHeader
                        className=&ldquo;cursor-pointer hover:bg-muted/50 transition-colors&rdquo;
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className=&ldquo;flex items-center justify-between&rdquo;>
                          <div className=&ldquo;flex items-center gap-3&rdquo;>
                            {expandedModules.has(module.id) ? (
                              <ChevronDown className=&ldquo;h-4 w-4&rdquo; />
                            ) : (
                              <ChevronRight className=&ldquo;h-4 w-4&rdquo; />
                            )}
                            <div>
                              <CardTitle className=&ldquo;text-base&rdquo;>
                                Módulo {moduleIndex + 1}: {module.title}
                              </CardTitle>
                              <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
                                {module.lessons.length} lecciones •{&ldquo; &rdquo;}
                                {formatDuration(module.duration)}
                              </p>
                            </div>
                          </div>
                          {module.isLocked && (
                            <Lock className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                          )}
                        </div>
                      </CardHeader>

                      {expandedModules.has(module.id) && (
                        <CardContent className=&ldquo;pt-0&rdquo;>
                          <p className=&ldquo;text-sm text-muted-foreground mb-4&rdquo;>
                            {module.description}
                          </p>
                          <div className=&ldquo;space-y-2&rdquo;>
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className=&ldquo;flex items-center gap-3 p-2 rounded hover:bg-muted/50&rdquo;
                              >
                                <div className=&ldquo;flex items-center gap-2 text-sm text-muted-foreground&rdquo;>
                                  <span>
                                    {moduleIndex + 1}.{lessonIndex + 1}
                                  </span>
                                  {lesson.type === &ldquo;video&rdquo; && (
                                    <Play className=&ldquo;h-3 w-3&rdquo; />
                                  )}
                                  {lesson.type === &ldquo;quiz&rdquo; && (
                                    <CheckCircle className=&ldquo;h-3 w-3&rdquo; />
                                  )}
                                  {lesson.type === &ldquo;text&rdquo; && (
                                    <BookOpen className=&ldquo;h-3 w-3&rdquo; />
                                  )}
                                </div>
                                <div className=&ldquo;flex-1&rdquo;>
                                  <div className=&ldquo;flex items-center justify-between&rdquo;>
                                    <span className=&ldquo;text-sm font-medium&rdquo;>
                                      {lesson.title}
                                    </span>
                                    <span className=&ldquo;text-xs text-muted-foreground&rdquo;>
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  </div>
                                  {lesson.description && (
                                    <p className=&ldquo;text-xs text-muted-foreground mt-1&rdquo;>
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>
                                {lesson.isPreview && (
                                  <Badge variant=&ldquo;outline&rdquo; className=&ldquo;text-xs&rdquo;>
                                    Vista previa
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;instructor&rdquo; className=&ldquo;space-y-6&rdquo;>
              <Card>
                <CardContent className=&ldquo;p-6&rdquo;>
                  <div className=&ldquo;flex items-start gap-4&rdquo;>
                    <Avatar className=&ldquo;h-20 w-20&rdquo;>
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback className=&ldquo;text-lg&rdquo;>
                        {course.instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className=&ldquo;flex-1&rdquo;>
                      <h3 className=&ldquo;text-xl font-semibold&rdquo;>
                        {course.instructor.name}
                      </h3>
                      <p className=&ldquo;text-muted-foreground mb-2&rdquo;>
                        {course.instructor.title}
                      </p>
                      <div className=&ldquo;flex items-center gap-4 text-sm text-muted-foreground mb-4&rdquo;>
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <Star className=&ldquo;h-4 w-4&rdquo; />
                          <span>{course.instructor.rating} rating</span>
                        </div>
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <Users className=&ldquo;h-4 w-4&rdquo; />
                          <span>
                            {course.instructor.totalStudents?.toLocaleString()}{&ldquo; &rdquo;}
                            estudiantes
                          </span>
                        </div>
                        <div className=&ldquo;flex items-center gap-1&rdquo;>
                          <BookOpen className=&ldquo;h-4 w-4&rdquo; />
                          <span>{course.instructor.totalCourses} cursos</span>
                        </div>
                      </div>
                      <p className=&ldquo;text-sm leading-relaxed&rdquo;>
                        {course.instructor.bio}
                      </p>

                      {course.instructor.socialLinks && (
                        <div className=&ldquo;flex gap-2 mt-4&rdquo;>
                          {course.instructor.socialLinks.website && (
                            <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; asChild>
                              <a
                                href={course.instructor.socialLinks.website}
                                target=&ldquo;_blank&rdquo;
                                rel=&ldquo;noopener noreferrer&rdquo;
                              >
                                <Globe className=&ldquo;h-4 w-4 mr-1&rdquo; />
                                Sitio web
                              </a>
                            </Button>
                          )}
                          {course.instructor.socialLinks.linkedin && (
                            <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; asChild>
                              <a
                                href={course.instructor.socialLinks.linkedin}
                                target=&ldquo;_blank&rdquo;
                                rel=&ldquo;noopener noreferrer&rdquo;
                              >
                                LinkedIn
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value=&ldquo;reviews&rdquo;>
              <div className=&ldquo;text-center py-8&rdquo;>
                <p className=&ldquo;text-muted-foreground&rdquo;>
                  Las reseñas estarán disponibles próximamente
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className=&ldquo;space-y-6&rdquo;>
          {/* Enrollment Card */}
          <Card className=&ldquo;sticky top-6&rdquo;>
            <CardContent className=&ldquo;p-6&rdquo;>
              <div className=&ldquo;text-center mb-6&rdquo;>
                <div className=&ldquo;text-3xl font-bold text-blue-600 mb-2&rdquo;>
                  {course.price === 0
                    ? &ldquo;Gratis&rdquo;
                    : `$${course.price.toLocaleString()} BOB`}
                </div>
                {course.price > 0 && (
                  <p className=&ldquo;text-sm text-muted-foreground&rdquo;>Pago único</p>
                )}
              </div>

              <div className=&ldquo;space-y-4&rdquo;>
                <Button asChild className=&ldquo;w-full&rdquo; size=&ldquo;lg&rdquo;>
                  <Link href={`/courses/${params.id}/learn`}>Ir al curso</Link>
                </Button>

                <div className=&ldquo;flex gap-2&rdquo;>
                  <Button
                    variant=&ldquo;outline&rdquo;
                    onClick={() => setIsSaved(!isSaved)}
                    className=&ldquo;flex-1&rdquo;
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${isSaved ? &ldquo;fill-red-500 text-red-500&rdquo; : &ldquo;&rdquo;}`}
                    />
                    {isSaved ? &ldquo;Guardado&rdquo; : &ldquo;Guardar&rdquo;}
                  </Button>
                  <Button variant=&ldquo;outline&rdquo; size=&ldquo;icon&rdquo;>
                    <Share2 className=&ldquo;h-4 w-4&rdquo; />
                  </Button>
                </div>
              </div>

              <Separator className=&ldquo;my-6&rdquo; />

              <div className=&ldquo;space-y-3 text-sm&rdquo;>
                <div className=&ldquo;flex justify-between&rdquo;>
                  <span>Duración:</span>
                  <span className=&ldquo;font-medium&rdquo;>{course.duration} horas</span>
                </div>
                <div className=&ldquo;flex justify-between&rdquo;>
                  <span>Lecciones:</span>
                  <span className=&ldquo;font-medium&rdquo;>{course.totalLessons}</span>
                </div>
                <div className=&ldquo;flex justify-between&rdquo;>
                  <span>Nivel:</span>
                  <span className=&ldquo;font-medium&rdquo;>
                    {getLevelLabel(course.level)}
                  </span>
                </div>
                <div className=&ldquo;flex justify-between&rdquo;>
                  <span>Certificado:</span>
                  <span className=&ldquo;font-medium&rdquo;>
                    {course.certification ? &ldquo;Sí&rdquo; : &ldquo;No&rdquo;}
                  </span>
                </div>
                <div className=&ldquo;flex justify-between&rdquo;>
                  <span>Acceso:</span>
                  <span className=&ldquo;font-medium&rdquo;>De por vida</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Features */}
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;text-lg&rdquo;>Este curso incluye</CardTitle>
            </CardHeader>
            <CardContent className=&ldquo;space-y-3&rdquo;>
              {course.includedMaterials.map((material, index) => (
                <div key={index} className=&ldquo;flex items-center gap-2 text-sm&rdquo;>
                  <CheckCircle className=&ldquo;h-4 w-4 text-green-500 flex-shrink-0&rdquo; />
                  <span>{material}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
