"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  User, 
  Building2,
  Play,
  CheckCircle,
  Award,
  Calendar,
  Target
} from "lucide-react";
import { useCourseEnrollments } from "@/hooks/useCourseEnrollments";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { ModuleProgress } from "@/components/courses/ModuleProgress";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = params.enrollmentId as string;
  
  const { getEnrollmentById, updateEnrollmentProgress } = useCourseEnrollments();
  const { fetchLessonProgress, markLessonAsCompleted, isLessonCompleted } = useLessonProgress();
  
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos de la inscripción
        const enrollmentData = await getEnrollmentById(enrollmentId);
        if (!enrollmentData) {
          throw new Error('No se encontró la inscripción al curso');
        }
        setEnrollment(enrollmentData);
        
        // Cargar progreso de lecciones
        await fetchLessonProgress(enrollmentId);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el curso');
        console.error('Error loading course:', err);
      } finally {
        setLoading(false);
      }
    };

    if (enrollmentId) {
      loadCourseData();
    }
  }, [enrollmentId, getEnrollmentById, fetchLessonProgress]);

  const handleLessonClick = async (lessonId: string) => {
    setSelectedLesson(lessonId);
    
    // Marcar lección como completada si no lo está
    if (!isLessonCompleted(lessonId)) {
      try {
        await markLessonAsCompleted(enrollmentId, lessonId);
        
        // Actualizar progreso del curso
        const currentModule = enrollment.course.modules.find((m: any) => 
          m.lessons.some((l: any) => l.id === lessonId)
        );
        
        if (currentModule) {
          const completedLessonsInModule = currentModule.lessons.filter((l: any) => 
            isLessonCompleted(l.id)
          ).length;
          
          const moduleProgress = (completedLessonsInModule / currentModule.lessons.length) * 100;
          
          await updateEnrollmentProgress(enrollmentId, {
            currentModuleId: currentModule.id,
            currentLessonId: lessonId,
            progress: moduleProgress
          });
        }
      } catch (err) {
        console.error('Error marking lesson as completed:', err);
      }
    }
  };

  const handleQuizClick = (quizId: string) => {
    // Aquí iría la lógica para abrir el quiz
    console.log('Opening quiz:', quizId);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Error al cargar el curso'}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { course } = enrollment;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Información del Curso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duración</p>
                <p className="font-semibold">{formatDuration(course.duration)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progreso</p>
                <p className="font-semibold">{enrollment.progress}%</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inscrito</p>
                <p className="font-semibold">
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Invertido</p>
                <p className="font-semibold">{formatTimeSpent(enrollment.timeSpent)}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-muted-foreground">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Course Instructor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Instructor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold">{course.instructor.name}</h3>
              <p className="text-sm text-muted-foreground">
                {course.organization.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Módulos del Curso</h2>
        
        {course.modules.map((module: any, index: number) => {
          const moduleProgress = enrollment.moduleProgress[module.id] || {
            completed: false,
            lessonsCompleted: 0,
            totalLessons: module.lessons.length,
            quizPassed: false
          };
          
          const isUnlocked = index === 0 || 
            (enrollment.moduleProgress[course.modules[index - 1]?.id]?.completed);
          
          const isCurrentModule = enrollment.currentModuleId === module.id;

          return (
            <ModuleProgress
              key={module.id}
              module={module}
              progress={moduleProgress}
              isUnlocked={isUnlocked}
              isCurrentModule={isCurrentModule}
              onLessonClick={handleLessonClick}
              onQuizClick={handleQuizClick}
            />
          );
        })}
      </div>

      {/* Certificate Section */}
      {enrollment.certificateIssued && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Award className="h-5 w-5" />
              ¡Felicidades! Has completado el curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Has completado exitosamente el curso "{course.title}" con una calificación de {enrollment.finalGrade}%.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              <Award className="h-4 w-4 mr-2" />
              Descargar Certificado
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
