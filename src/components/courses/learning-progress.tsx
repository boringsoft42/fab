"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  Play,
  Award,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { CourseEnrollment } from "@/hooks/useCourseEnrollments";

interface LearningProgressProps {
  enrollment: CourseEnrollment;
  onContinue?: () => void;
  onViewCertificate?: () => void;
}

export const LearningProgress = ({
  enrollment,
  onContinue,
  onViewCertificate,
}: LearningProgressProps) => {
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes % 60}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "ENROLLED":
        return "bg-yellow-100 text-yellow-800";
      case "DROPPED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completado";
      case "IN_PROGRESS":
        return "En progreso";
      case "ENROLLED":
        return "Inscrito";
      case "DROPPED":
        return "Abandonado";
      default:
        return status;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressLabel = (progress: number) => {
    if (progress >= 80) return "¡Excelente progreso!";
    if (progress >= 60) return "Buen progreso";
    if (progress >= 40) return "Progreso regular";
    return "Necesitas más práctica";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progreso de Aprendizaje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado y Progreso General */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(enrollment.status)}>
                {getStatusLabel(enrollment.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Inscrito el {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </span>
            </div>
            {enrollment.completedAt && (
              <span className="text-sm text-muted-foreground">
                Completado el {new Date(enrollment.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso general</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <Progress 
              value={enrollment.progress} 
              className="h-3"
              style={{
                '--progress-color': getProgressColor(enrollment.progress)
              } as React.CSSProperties}
            />
            <p className="text-xs text-muted-foreground">
              {getProgressLabel(enrollment.progress)}
            </p>
          </div>
        </div>

        {/* Estadísticas del Curso */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {formatTimeSpent(enrollment.course.duration)}
              </p>
              <p className="text-xs text-muted-foreground">Duración total</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {enrollment.course.totalLessons}
              </p>
              <p className="text-xs text-muted-foreground">Lecciones</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {enrollment.course.totalQuizzes}
              </p>
              <p className="text-xs text-muted-foreground">Evaluaciones</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {Math.ceil(enrollment.course.duration / 60)}h
              </p>
              <p className="text-xs text-muted-foreground">Tiempo estimado</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {enrollment.status === "COMPLETED" ? (
            <Button onClick={onViewCertificate} className="flex-1">
              <Award className="h-4 w-4 mr-2" />
              Ver Certificado
            </Button>
          ) : enrollment.status === "IN_PROGRESS" ? (
            <Button onClick={onContinue} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Continuar
            </Button>
          ) : (
            <Button onClick={onContinue} className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Ir al Curso
            </Button>
          )}
        </div>

        {/* Consejos de Progreso */}
        {enrollment.progress < 100 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              💡 Consejos para avanzar
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Dedica al menos 30 minutos diarios al estudio</li>
              <li>• Completa todas las lecciones en orden</li>
              <li>• Toma notas durante las lecciones</li>
              <li>• Practica con los ejercicios y evaluaciones</li>
            </ul>
          </div>
        )}

        {/* Logros */}
        {enrollment.progress >= 25 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-900">¡Logro Desbloqueado!</h4>
            </div>
            <p className="text-sm text-green-800">
              Has completado más del 25% del curso. ¡Sigue así!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
