"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  Building2, 
  Play, 
  BookOpen, 
  Award,
  CheckCircle,
  Lock
} from "lucide-react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number; // en minutos
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  organization: {
    id: string;
    name: string;
  };
  totalLessons: number;
  totalQuizzes: number;
  isActive: boolean;
}

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  enrollmentId?: string;
  progress?: number;
  onEnroll?: (courseId: string) => void;
  loading?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled = false,
  enrollmentId,
  progress = 0,
  onEnroll,
  loading = false
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'Principiante';
      case 'INTERMEDIATE':
        return 'Intermedio';
      case 'ADVANCED':
        return 'Avanzado';
      default:
        return difficulty;
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

  const handleEnroll = () => {
    if (onEnroll && !loading) {
      onEnroll(course.id);
    }
  };

  return (
    <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Course Thumbnail */}
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        {course.thumbnail && course.thumbnail.trim() !== "" ? (
          <Image
            src={course.thumbnail.trim()}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "/images/courses/default-course.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
        )}
        
        {/* Difficulty Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className={getDifficultyColor(course.level)}>
            {getDifficultyLabel(course.level)}
          </Badge>
        </div>

        {/* Progress Overlay */}
        {isEnrolled && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progreso</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Enrolled Badge */}
        {isEnrolled && (
          <div className="absolute top-4 right-4 z-20">
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Inscrito
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Course Title and Description */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{course.totalLessons} lecciones</span>
          </div>
          {course.totalQuizzes > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              <span>{course.totalQuizzes} evaluaciones</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{course.instructor.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{course.organization.name}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          {isEnrolled ? (
            <Button asChild className="flex-1">
              <Link href={`/development/courses/${enrollmentId}`}>
                <Play className="h-4 w-4 mr-2" />
                Continuar
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={handleEnroll}
              disabled={loading || !course.isActive}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Inscribiendo...
                </>
              ) : !course.isActive ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  No disponible
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Inscribirse
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
