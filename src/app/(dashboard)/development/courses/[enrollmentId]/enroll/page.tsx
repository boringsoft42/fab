"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserFromToken } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  User, 
  Building2, 
  CheckCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  instructor?: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  organization?: {
    id: string;
    name: string;
  } | null;
  totalLessons: number;
  totalQuizzes: number;
  isActive: boolean;
}

interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course: Course;
}

export default function CourseEnrollPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.enrollmentId as string; // Este parámetro es realmente el courseId
  
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'Principiante';
      case 'INTERMEDIATE':
        return 'Intermedio';
      case 'ADVANCED':
        return 'Avanzado';
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleEnroll = async () => {
    if (!enrollment?.course) return;

    setEnrolling(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Get current user ID from token
      const userInfo = getUserFromToken();
      
      if (!userInfo || !userInfo.id) {
        throw new Error('No authenticated user found');
      }

      const userId = userInfo.id;
      console.log('🔍 Current user ID:', userId);

      const requestBody = {
        courseId: enrollment.course.id,
        studentId: userId
      };

      console.log('🔍 Enrolling in course with data:', requestBody);

      const response = await fetch('/api/course-enrollments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al inscribirse al curso');
      }

      const data = await response.json();
      toast.success('¡Te has inscrito exitosamente al curso!');
      
      // Redirigir al curso
      router.push(`/development/courses/${data.enrollment.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        // Primero intentamos obtener el curso por ID
        const response = await fetch(`/api/course/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Curso no encontrado');
        }

        const data = await response.json();
        const course = data.course;

        // Verificar si ya está inscrito
        const enrollmentResponse = await fetch(`/api/course-enrollments?courseId=${course.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (enrollmentResponse.ok) {
          const enrollmentData = await enrollmentResponse.json();
          if (enrollmentData.enrollments && enrollmentData.enrollments.length > 0) {
            // Ya está inscrito, redirigir al curso
            router.push(`/development/courses/${enrollmentData.enrollments[0].id}`);
            return;
          }
        }

        // Crear un objeto de enrollment temporal para mostrar la información
        setEnrollment({
          id: courseId,
          courseId: course.id,
          userId: '',
          status: 'ENROLLED',
          progress: 0,
          enrolledAt: new Date().toISOString(),
          course: course,
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando información del curso...</p>
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
              <p className="text-red-600 mb-4">{error || 'Curso no encontrado'}</p>
              <Button asChild>
                <Link href="/development/courses">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al catálogo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/development/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Inscripción al Curso</h1>
          <p className="text-muted-foreground">Confirma tu inscripción al siguiente curso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Información del Curso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Header */}
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">{enrollment.course.title}</h2>
                    <p className="text-muted-foreground mb-4">{enrollment.course.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getLevelColor(enrollment.course.level)}>
                        {getLevelLabel(enrollment.course.level)}
                      </Badge>
                      <Badge variant="outline">{enrollment.course.category}</Badge>
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium">{formatDuration(enrollment.course.duration)}</div>
                    <div className="text-xs text-muted-foreground">Duración</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium">{enrollment.course.totalLessons}</div>
                    <div className="text-xs text-muted-foreground">Lecciones</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-medium">{enrollment.course.totalQuizzes}</div>
                    <div className="text-xs text-muted-foreground">Evaluaciones</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <User className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-sm font-medium">{enrollment.course.instructor?.name || 'No especificado'}</div>
                    <div className="text-xs text-muted-foreground">Instructor</div>
                  </div>
                </div>

                                 {/* Organization */}
                 <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                   <Building2 className="h-5 w-5 text-blue-600" />
                   <div>
                     <div className="font-medium">{enrollment.course.organization?.name || 'No especificada'}</div>
                     <div className="text-sm text-muted-foreground">Organización</div>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Confirmar Inscripción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium text-green-800">Curso Disponible</div>
                  <div className="text-sm text-green-600">Listo para comenzar</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estado:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duración:</span>
                    <span>{formatDuration(enrollment.course.duration)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lecciones:</span>
                    <span>{enrollment.course.totalLessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Evaluaciones:</span>
                    <span>{enrollment.course.totalQuizzes}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleEnroll}
                  disabled={enrolling || !enrollment.course.isActive}
                  className="w-full"
                  size="lg"
                >
                  {enrolling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Inscribiendo...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Inscribirse al Curso
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al inscribirte, tendrás acceso completo al contenido del curso
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
