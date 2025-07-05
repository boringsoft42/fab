"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Course, Module } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
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
        console.error("Error loading course:", data);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
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
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      soft_skills: "Habilidades Blandas",
      basic_competencies: "Competencias Básicas",
      job_placement: "Inserción Laboral",
      entrepreneurship: "Emprendimiento",
      technical_skills: "Habilidades Técnicas",
      digital_literacy: "Alfabetización Digital",
      communication: "Comunicación",
      leadership: "Liderazgo",
    };
    return labels[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado",
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
        <Button asChild>
          <Link href="/courses">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link
          href="/courses"
          className="hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Cursos
        </Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">
                {getCategoryLabel(course.category)}
              </Badge>
              <Badge variant="outline">{getLevelLabel(course.level)}</Badge>
              {course.isMandatory && (
                <Badge className="bg-red-500">Obligatorio</Badge>
              )}
              {course.price === 0 && (
                <Badge className="bg-green-500">Gratis</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

            <p className="text-lg text-muted-foreground mb-6">
              {course.shortDescription}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground">
                  ({course.studentCount} estudiantes)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration} horas</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.totalLessons} lecciones</span>
              </div>
              {course.certification && (
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>Certificado incluido</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Image/Video */}
          <div className="relative">
            <Image
              src={course.thumbnail}
              alt={course.title}
              width={800}
              height={450}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
            {course.videoPreview && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full h-16 w-16">
                  <Play className="h-6 w-6 fill-current" />
                </Button>
              </div>
            )}
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Descripción</TabsTrigger>
              <TabsTrigger value="curriculum">Temario</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Descripción del curso
                </h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{course.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Objetivos de aprendizaje
                </h3>
                <ul className="space-y-2">
                  {course.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Materiales incluidos
                </h3>
                <ul className="space-y-2">
                  {course.includedMaterials.map((material, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{material}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Contenido del curso
                </h3>
                <div className="space-y-3">
                  {modules.map((module, moduleIndex) => (
                    <Card key={module.id}>
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => toggleModule(module.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedModules.has(module.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <div>
                              <CardTitle className="text-base">
                                Módulo {moduleIndex + 1}: {module.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {module.lessons.length} lecciones •{" "}
                                {formatDuration(module.duration)}
                              </p>
                            </div>
                          </div>
                          {module.isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>

                      {expandedModules.has(module.id) && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-4">
                            {module.description}
                          </p>
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-2 rounded hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>
                                    {moduleIndex + 1}.{lessonIndex + 1}
                                  </span>
                                  {lesson.type === "video" && (
                                    <Play className="h-3 w-3" />
                                  )}
                                  {lesson.type === "quiz" && (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  {lesson.type === "text" && (
                                    <BookOpen className="h-3 w-3" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      {lesson.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  </div>
                                  {lesson.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">
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

            <TabsContent value="instructor" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback className="text-lg">
                        {course.instructor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {course.instructor.name}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {course.instructor.title}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{course.instructor.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {course.instructor.totalStudents?.toLocaleString()}{" "}
                            estudiantes
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.instructor.totalCourses} cursos</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {course.instructor.bio}
                      </p>

                      {course.instructor.socialLinks && (
                        <div className="flex gap-2 mt-4">
                          {course.instructor.socialLinks.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={course.instructor.socialLinks.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe className="h-4 w-4 mr-1" />
                                Sitio web
                              </a>
                            </Button>
                          )}
                          {course.instructor.socialLinks.linkedin && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={course.instructor.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
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

            <TabsContent value="reviews">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Las reseñas estarán disponibles próximamente
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {course.price === 0
                    ? "Gratis"
                    : `$${course.price.toLocaleString()} BOB`}
                </div>
                {course.price > 0 && (
                  <p className="text-sm text-muted-foreground">Pago único</p>
                )}
              </div>

              <div className="space-y-4">
                <Button asChild className="w-full" size="lg">
                  <Link href={`/courses/${params.id}/learn`}>Ir al curso</Link>
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsSaved(!isSaved)}
                    className="flex-1"
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {isSaved ? "Guardado" : "Guardar"}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span className="font-medium">{course.duration} horas</span>
                </div>
                <div className="flex justify-between">
                  <span>Lecciones:</span>
                  <span className="font-medium">{course.totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nivel:</span>
                  <span className="font-medium">
                    {getLevelLabel(course.level)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Certificado:</span>
                  <span className="font-medium">
                    {course.certification ? "Sí" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Acceso:</span>
                  <span className="font-medium">De por vida</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Este curso incluye</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.includedMaterials.map((material, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
